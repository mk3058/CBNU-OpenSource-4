// SPDX-License-Identifier: No License
pragma solidity >=0.4.22 <0.9.0;

contract EthWallet {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    receive() external payable {}

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function sendEther(address payable _to, uint _amount) public {
        require(msg.sender == owner, "Only the owner of the wallet can make the request");
        require(_amount <= getBalance(), "sending amount must be less than or equal to your balance");
        _to.transfer(_amount);
    }
}
