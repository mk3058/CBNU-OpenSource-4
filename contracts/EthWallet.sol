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
        require(msg.sender == owner, "소유자 정보가 일치하지 않습니다");
        require(_amount <= getBalance(), "잔액이 부족합니다");
        _to.transfer(_amount);
    }
}
