// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface callAutomate{
    function automate() external;
}

contract L1Automate{
    uint index=0;
    mapping(uint => address) addressMapper;
    mapping(uint64 => bool) blockMapper;

    function setAutomate(uint64 _blockNo) external{
        require(msg.sender == 0xDeaDDEaDDeAdDeAdDEAdDEaddeAddEAdDEAd0001,"Only system address can call this function");
        for(uint i=0; i<index; i++){
            callAutomate(addressMapper[i]).automate();
        }
        blockMapper[_blockNo] = true;
    }

    function getBlock(uint64 _blockNo) view external returns(bool){
        return blockMapper[_blockNo];
    }

    function addAutomate() external{
        addressMapper[index] = msg.sender;
        index++;
    }
}
