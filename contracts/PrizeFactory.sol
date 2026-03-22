// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./PrizeOffer.sol";

contract PrizeFactory {
    error NotOwner();
    error InvalidAddress();
    error UnknownOffer();

    address public owner;
    address public immutable paymentToken;
    address[] public allOffers;

    mapping(address => bool) public isOffer;
    mapping(address => address[]) public offersByParticipant;

    event OfferCreated(address indexed offer, address indexed participant, string hackathonName, string symbol);
    event OfferActivated(address indexed offer);
    event OfferRejected(address indexed offer);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    constructor(address paymentToken_) {
        if (paymentToken_ == address(0)) revert InvalidAddress();
        owner = msg.sender;
        paymentToken = paymentToken_;
        emit OwnershipTransferred(address(0), msg.sender);
    }

    function createOffer(
        string calldata hackathonName,
        string calldata symbol,
        bytes32 validationHash,
        uint256 prizeAmount,
        uint256 discountBps,
        uint256 expectedPaymentDate
    ) external returns (address offer) {
        PrizeOffer newOffer = new PrizeOffer(
            msg.sender,
            paymentToken,
            hackathonName,
            symbol,
            validationHash,
            prizeAmount,
            discountBps,
            expectedPaymentDate
        );

        offer = address(newOffer);
        allOffers.push(offer);
        isOffer[offer] = true;
        offersByParticipant[msg.sender].push(offer);

        emit OfferCreated(offer, msg.sender, hackathonName, symbol);
    }

    function activateOffer(address offer, bytes32 validationHash) external onlyOwner {
        if (!isOffer[offer]) revert UnknownOffer();
        PrizeOffer(offer).updateValidationHash(validationHash);
        PrizeOffer(offer).activate();
        emit OfferActivated(offer);
    }

    function rejectOffer(address offer) external onlyOwner {
        if (!isOffer[offer]) revert UnknownOffer();
        PrizeOffer(offer).reject();
        emit OfferRejected(offer);
    }

    function settleOffer(address offer, uint256 amount) external onlyOwner {
        if (!isOffer[offer]) revert UnknownOffer();
        PrizeOffer(offer).settle(msg.sender, amount);
    }

    function getParticipantOffers(address participant) external view returns (address[] memory) {
        return offersByParticipant[participant];
    }

    function offersCount() external view returns (uint256) {
        return allOffers.length;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert InvalidAddress();
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}
