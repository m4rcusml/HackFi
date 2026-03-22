// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./Token.sol";

interface IERC20Like {
    function decimals() external view returns (uint8);
    function transfer(address to, uint256 value) external returns (bool);
    function transferFrom(address from, address to, uint256 value) external returns (bool);
}

contract PrizeOffer {
    error OnlyFactory();
    error InvalidAddress();
    error InvalidAmount();
    error InvalidDiscount();
    error InvalidState();
    error FundingExceeded();
    error TransferFailed();
    error NothingToClaim();

    enum Status {
        Pending,
        Active,
        Rejected,
        Funded,
        Settled,
        Cancelled
    }

    uint256 public constant MIN_DISCOUNT_BPS = 500;
    uint256 public constant MAX_DISCOUNT_BPS = 1_500;
    uint256 public constant BPS = 10_000;
    uint256 public constant TRANCHE_COUNT = 20;

    address public immutable factory;
    address public immutable participant;
    IERC20Like public immutable paymentToken;
    Token public receiptToken;

    string public hackathonName;
    string public receiptSymbol;
    bytes32 public validationHash;

    uint256 public immutable prizeAmount;
    uint256 public immutable discountBps;
    uint256 public immutable fundingTarget;
    uint256 public immutable expectedPaymentDate;

    Status public status;
    uint256 public soldReceipts;
    uint256 public fundedAmount;
    uint256 public releasedToParticipant;
    uint256 public releasedTranches;
    uint256 public claimablePerReceipt;

    mapping(address => uint256) public claimablePerReceiptPaid;

    event Activated(address indexed offer);
    event Rejected(address indexed offer);
    event ValidationHashUpdated(bytes32 validationHash);
    event ReceiptsPurchased(address indexed buyer, uint256 receiptAmount, uint256 paymentAmount);
    event ParticipantPaid(address indexed participant, uint256 amount, uint256 releasedTranches);
    event Settled(address indexed payer, uint256 amount);
    event Claimed(address indexed investor, uint256 amount);

    modifier onlyFactory() {
        if (msg.sender != factory) revert OnlyFactory();
        _;
    }

    constructor(
        address participant_,
        address paymentToken_,
        string memory hackathonName_,
        string memory receiptSymbol_,
        bytes32 validationHash_,
        uint256 prizeAmount_,
        uint256 discountBps_,
        uint256 expectedPaymentDate_
    ) {
        if (participant_ == address(0) || paymentToken_ == address(0)) revert InvalidAddress();
        if (prizeAmount_ == 0) revert InvalidAmount();
        if (discountBps_ < MIN_DISCOUNT_BPS || discountBps_ > MAX_DISCOUNT_BPS) revert InvalidDiscount();

        factory = msg.sender;
        participant = participant_;
        paymentToken = IERC20Like(paymentToken_);
        hackathonName = hackathonName_;
        receiptSymbol = receiptSymbol_;
        validationHash = validationHash_;
        prizeAmount = prizeAmount_;
        discountBps = discountBps_;
        fundingTarget = (prizeAmount_ * (BPS - discountBps_)) / BPS;
        expectedPaymentDate = expectedPaymentDate_;
        status = Status.Pending;

        receiptToken = new Token(
            string.concat("Prize Receipt ", hackathonName_),
            receiptSymbol_,
            IERC20Like(paymentToken_).decimals(),
            address(this)
        );
    }

    function activate() external onlyFactory {
        if (status != Status.Pending) revert InvalidState();
        status = Status.Active;
        emit Activated(address(this));
    }

    function reject() external onlyFactory {
        if (status != Status.Pending) revert InvalidState();
        status = Status.Rejected;
        emit Rejected(address(this));
    }

    function updateValidationHash(bytes32 newValidationHash) external onlyFactory {
        validationHash = newValidationHash;
        emit ValidationHashUpdated(newValidationHash);
    }

    function buy(uint256 receiptAmount) external {
        if (status != Status.Active) revert InvalidState();
        if (receiptAmount == 0) revert InvalidAmount();

        uint256 remainingReceipts = prizeAmount - soldReceipts;
        if (receiptAmount > remainingReceipts) revert FundingExceeded();

        uint256 paymentAmount = quote(receiptAmount);
        if (paymentAmount == 0) revert InvalidAmount();

        soldReceipts += receiptAmount;
        fundedAmount += paymentAmount;

        if (!_safeTransferFrom(paymentToken, msg.sender, address(this), paymentAmount)) {
            revert TransferFailed();
        }

        receiptToken.mint(msg.sender, receiptAmount);
        _releaseParticipantTranches();

        if (fundedAmount >= fundingTarget || soldReceipts == prizeAmount) {
            status = Status.Funded;
        }

        emit ReceiptsPurchased(msg.sender, receiptAmount, paymentAmount);
    }

    function settle(address payer, uint256 amount) external onlyFactory {
        if (status != Status.Active && status != Status.Funded) revert InvalidState();
        if (payer == address(0)) revert InvalidAddress();
        if (amount == 0) revert InvalidAmount();

        if (!_safeTransferFrom(paymentToken, payer, address(this), amount)) {
            revert TransferFailed();
        }

        claimablePerReceipt += (amount * 1e18) / prizeAmount;
        status = Status.Settled;

        emit Settled(payer, amount);
    }

    function claim() external {
        uint256 amount = previewClaim(msg.sender);
        if (amount == 0) revert NothingToClaim();

        claimablePerReceiptPaid[msg.sender] = claimablePerReceipt;

        if (!_safeTransfer(paymentToken, msg.sender, amount)) revert TransferFailed();

        emit Claimed(msg.sender, amount);
    }

    function quote(uint256 receiptAmount) public view returns (uint256) {
        return (receiptAmount * fundingTarget) / prizeAmount;
    }

    function previewClaim(address investor) public view returns (uint256) {
        uint256 delta = claimablePerReceipt - claimablePerReceiptPaid[investor];
        return (receiptToken.balanceOf(investor) * delta) / 1e18;
    }

    function getSummary()
        external
        view
        returns (
            Status status_,
            uint256 prizeAmount_,
            uint256 fundingTarget_,
            uint256 fundedAmount_,
            uint256 soldReceipts_,
            uint256 releasedToParticipant_,
            uint256 expectedPaymentDate_,
            bytes32 validationHash_
        )
    {
        return (
            status,
            prizeAmount,
            fundingTarget,
            fundedAmount,
            soldReceipts,
            releasedToParticipant,
            expectedPaymentDate,
            validationHash
        );
    }

    function _releaseParticipantTranches() internal {
        uint256 nextReleasedTranches;
        uint256 trancheSize = fundingTarget / TRANCHE_COUNT;

        if (fundedAmount >= fundingTarget) {
            nextReleasedTranches = TRANCHE_COUNT;
        } else if (trancheSize != 0) {
            nextReleasedTranches = fundedAmount / trancheSize;
            if (nextReleasedTranches > TRANCHE_COUNT) {
                nextReleasedTranches = TRANCHE_COUNT;
            }
        }

        if (nextReleasedTranches <= releasedTranches) return;

        releasedTranches = nextReleasedTranches;

        uint256 maxReleased = (fundingTarget * releasedTranches) / TRANCHE_COUNT;
        uint256 amount = maxReleased - releasedToParticipant;

        if (amount == 0) return;

        releasedToParticipant += amount;

        if (!_safeTransfer(paymentToken, participant, amount)) revert TransferFailed();

        emit ParticipantPaid(participant, amount, releasedTranches);
    }

    function _safeTransfer(IERC20Like token, address to, uint256 value) internal returns (bool) {
        (bool success, bytes memory data) =
            address(token).call(abi.encodeWithSelector(token.transfer.selector, to, value));
        return success && (data.length == 0 || abi.decode(data, (bool)));
    }

    function _safeTransferFrom(IERC20Like token, address from, address to, uint256 value) internal returns (bool) {
        (bool success, bytes memory data) =
            address(token).call(abi.encodeWithSelector(token.transferFrom.selector, from, to, value));
        return success && (data.length == 0 || abi.decode(data, (bool)));
    }
}
