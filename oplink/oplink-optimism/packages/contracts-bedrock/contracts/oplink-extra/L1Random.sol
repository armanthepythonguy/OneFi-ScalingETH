// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract L1Random{

    uint256 public randomNumber;

    function setRandomNumber(uint256 _randomNumber) external{
        require(msg.sender == 0xDeaDDEaDDeAdDeAdDEAdDEaddeAddEAdDEAd0001,"Only system address can call this function");
        randomNumber = _randomNumber;
    }

    function getRandomNumber() view external returns(uint256){
        return randomNumber;
    }

}
