package derive

import (
    "bytes"
    "encoding/binary"
    "fmt"
    "math/big"
    "github.com/ethereum/go-ethereum/common"
    "github.com/ethereum/go-ethereum/core/types"
    "github.com/ethereum/go-ethereum/crypto"
    "github.com/ethereum-optimism/optimism/op-node/eth"
)

const (
    L1AutomateFuncSignature = "setAutomate(uint256)"
    L1AutomateArguments     = 1
    L1AutomateLen           = 4 + 32*L1AutomateArguments
)

var (
    L1AutomateFuncBytes4 = crypto.Keccak256([]byte(L1AutomateFuncSignature))[:4]
    L1AutomateAddress    = common.HexToAddress("Your automate smart contract address")
)

type L1AutomateInfo struct {
    Number uint64
}

func (info *L1AutomateInfo) MarshalBinary() ([]byte, error) {
    data := make([]byte, L1AutomateLen)
    offset := 0
    copy(data[offset:4], L1AutomateFuncBytes4)
    offset += 4
    binary.BigEndian.PutUint64(data[offset+24:offset+32], info.Number)
    return data, nil
}

func (info *L1AutomateInfo) UnmarshalBinary(data []byte) error {
    if len(data) != L1AutomateLen {
        return fmt.Errorf("data is unexpected length: %d", len(data))
    }
    var padding [24]byte
    offset := 4
    info.Number = binary.BigEndian.Uint64(data[offset+24 : offset+32])
    if !bytes.Equal(data[offset:offset+24], padding[:]) {
        return fmt.Errorf("l1 automate tx number exceeds uint64 bounds: %x", data[offset:offset+32])
    }
    return nil
}

func L1AutomateDepositTxData(data []byte) (L1AutomateInfo, error) {
    var info L1AutomateInfo
    err := info.UnmarshalBinary(data)
    return info, err
}

func L1AutomateDeposit(seqNumber uint64, block eth.BlockInfo, sysCfg eth.SystemConfig) (*types.DepositTx, error) {
    infoDat := L1AutomateInfo{
        Number: block.NumberU64(),
    }
    data, err := infoDat.MarshalBinary()
    if err != nil {
        return nil, err
    }
    source := L1InfoDepositSource{
        L1BlockHash: block.Hash(),
        SeqNumber:   seqNumber,
    }
    return &types.DepositTx{
        SourceHash:          source.SourceHash(),
        From:                L1InfoDepositerAddress,
        To:                  &L1AutomateAddress,
        Mint:                nil,
        Value:               big.NewInt(0),
        Gas:                 150_000_000,
        IsSystemTransaction: true,
        Data:                data,
    }, nil
}

func L1AutomateDepositBytes(seqNumber uint64, l1Info eth.BlockInfo, sysCfg eth.SystemConfig) ([]byte, error) {
    dep, err := L1AutomateDeposit(seqNumber, l1Info, sysCfg)
    if err != nil {
        return nil, fmt.Errorf("failed to create L1 automate tx: %w", err)
    }
    l1Tx := types.NewTx(dep)
    opaqueL1Tx, err := l1Tx.MarshalBinary()
    if err != nil {
        return nil, fmt.Errorf("failed to encode L1 automate tx: %w", err)
    }
    return opaqueL1Tx, nil
}
