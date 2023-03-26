package derive

import (
    "bytes"
    "encoding/binary"
    "fmt"
    "math/big"
	"math/rand"
	"time"
    "github.com/ethereum/go-ethereum/common"
    "github.com/ethereum/go-ethereum/core/types"
    "github.com/ethereum/go-ethereum/crypto"
    "github.com/ethereum-optimism/optimism/op-node/eth"
)

const (
    L1RandomFuncSignature = "setRandomNumber(uint256)"
    L1RandomArguments     = 1
    L1RandomLen           = 4 + 32*L1RandomArguments
)

var (
    L1RandomFuncBytes4 = crypto.Keccak256([]byte(L1RandomFuncSignature))[:4]
    L1RandomAddress    = common.HexToAddress("0xCF1043c69c5A694122e7230f5D02A7BdC8C81b14")
)

type L1RandomInfo struct {
    Number uint64
}

func (info *L1RandomInfo) MarshalBinary() ([]byte, error) {
    data := make([]byte, L1RandomLen)
    offset := 0
    copy(data[offset:4], L1RandomFuncBytes4)
    offset += 4
    binary.BigEndian.PutUint64(data[offset+24:offset+32], info.Number)
    return data, nil
}

func (info *L1RandomInfo) UnmarshalBinary(data []byte) error {
    if len(data) != L1RandomLen {
        return fmt.Errorf("data is unexpected length: %d", len(data))
    }
    var padding [24]byte
    offset := 4
    info.Number = binary.BigEndian.Uint64(data[offset+24 : offset+32])
    if !bytes.Equal(data[offset:offset+24], padding[:]) {
        return fmt.Errorf("l1 burn tx number exceeds uint64 bounds: %x", data[offset:offset+32])
    }
    return nil
}

func L1RandomDepositTxData(data []byte) (L1RandomInfo, error) {
    var info L1RandomInfo
    err := info.UnmarshalBinary(data)
    return info, err
}

func L1RandomDeposit(seqNumber uint64, block eth.BlockInfo, sysCfg eth.SystemConfig) (*types.DepositTx, error) {
	x1 := rand.NewSource(time.Now().UnixNano())
	y1 := rand.New(x1)
    infoDat := L1RandomInfo{
        Number: uint64(y1.Intn(101)),
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
        To:                  &L1RandomAddress,
        Mint:                nil,
        Value:               big.NewInt(0),
        Gas:                 150_000_000,
        IsSystemTransaction: true,
        Data:                data,
    }, nil
}

func L1RandomDepositBytes(seqNumber uint64, l1Info eth.BlockInfo, sysCfg eth.SystemConfig) ([]byte, error) {
    dep, err := L1RandomDeposit(seqNumber, l1Info, sysCfg)
    if err != nil {
        return nil, fmt.Errorf("failed to create L1 burn tx: %w", err)
    }
    l1Tx := types.NewTx(dep)
    opaqueL1Tx, err := l1Tx.MarshalBinary()
    if err != nil {
        return nil, fmt.Errorf("failed to encode L1 burn tx: %w", err)
    }
    return opaqueL1Tx, nil
}
