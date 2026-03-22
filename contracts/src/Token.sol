// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Token {
    error OnlyOffer();
    error TransfersDisabled();

    string public name;
    string public symbol;
    uint8 public immutable decimals;
    uint256 public totalSupply;
    address public immutable offer;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor(string memory name_, string memory symbol_, uint8 decimals_, address offer_) {
        name = name_;
        symbol = symbol_;
        decimals = decimals_;
        offer = offer_;
    }

    function approve(address spender, uint256 value) external returns (bool) {
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }

    function transfer(address, uint256) external pure returns (bool) {
        revert TransfersDisabled();
    }

    function transferFrom(address, address, uint256) external pure returns (bool) {
        revert TransfersDisabled();
    }

    function mint(address to, uint256 value) external {
        if (msg.sender != offer) revert OnlyOffer();

        totalSupply += value;
        balanceOf[to] += value;
        emit Transfer(address(0), to, value);
    }
}
