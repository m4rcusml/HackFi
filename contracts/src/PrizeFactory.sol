// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./PrizeOffer.sol";

contract PrizeFactory {
    error InvalidAddress();
    error UnknownOffer();

    address public immutable paymentToken;
    address[] public allOffers;

    mapping(address => bool) public isOffer;
    mapping(address => address[]) public offersByParticipant;

    event OfferCreated(address indexed offer, address indexed participant, string hackathonName, string symbol);
    event OfferSettled(address indexed offer, address indexed payer, uint256 amount);

    constructor(address paymentToken_) {
        if (paymentToken_ == address(0)) revert InvalidAddress();
        paymentToken = paymentToken_;
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

    function settleOffer(address offer, uint256 amount) external {
        if (!isOffer[offer]) revert UnknownOffer();
        PrizeOffer(offer).settle(msg.sender, amount);
        emit OfferSettled(offer, msg.sender, amount);
    }

    function getParticipantOffers(address participant) external view returns (address[] memory) {
        return offersByParticipant[participant];
    }

    function offersCount() external view returns (uint256) {
        return allOffers.length;
    }

}
