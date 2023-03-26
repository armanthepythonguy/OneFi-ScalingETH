// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract L1BTCFeed{
    uint64 public currentPrice;
    mapping(uint64 => uint64) datafeed;

    function setValue(uint64 _blockNo, uint64 _priceFeed) external{
        require(msg.sender == 0xDeaDDEaDDeAdDeAdDEAdDEaddeAddEAdDEAd0001,"Only system address can call this function");
        currentPrice = _priceFeed;
        datafeed[_blockNo] = _priceFeed;
    }

    function getCurrentPrice() view external returns(uint64){
        return currentPrice;
    }

    function getPriceBlock(uint64 _blockNo) view external returns(uint64){
        return datafeed[_blockNo];
    }

}
