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
	"io/ioutil"
   "net/http"
   "strconv"
   "encoding/json"
   "log"
)

const (
    L1BTCFeedFuncSignature = "setValue(uint64,uint64)"
    L1BTCFeedArguments     = 2
    L1BTCFeedLen           = 4 + 32*L1BTCFeedArguments
)

var (
    L1BTCFeedFuncBytes4 = crypto.Keccak256([]byte(L1BTCFeedFuncSignature))[:4]
    L1BTCFeedAddress    = common.HexToAddress("Your btcusd feed contract here")
)

type L1BTCFeedInfo struct {
    Number uint64
    Feed   uint64
}

func (info *L1BTCFeedInfo) MarshalBinary() ([]byte, error) {
    data := make([]byte, L1BTCFeedLen)
    offset := 0
    copy(data[offset:4], L1BTCFeedFuncBytes4)
    offset += 4
    binary.BigEndian.PutUint64(data[offset+24:offset+32], info.Number)
    offset += 32
    binary.BigEndian.PutUint64(data[offset+24:offset+32], info.Feed)
    return data, nil
}

func (info *L1BTCFeedInfo) UnmarshalBinary(data []byte) error {
    if len(data) != L1BTCFeedLen {
        return fmt.Errorf("data is unexpected length: %d", len(data))
    }
    var padding [24]byte
    offset := 4
    info.Number = binary.BigEndian.Uint64(data[offset+24 : offset+32])
    if !bytes.Equal(data[offset:offset+24], padding[:]) {
        return fmt.Errorf("l1 btc feed tx number exceeds uint64 bounds: %x", data[offset:offset+32])
    }
    offset += 32
    info.Feed = binary.BigEndian.Uint64(data[offset+24 : offset+32])
    if !bytes.Equal(data[offset:offset+24], padding[:]) {
        return fmt.Errorf("l1 btc feed tx feed exceeds uint64 bounds: %x", data[offset:offset+32])
    }
    return nil
}

func L1BTCFeedDepositTxData(data []byte) (L1BTCFeedInfo, error) {
    var info L1BTCFeedInfo
    err := info.UnmarshalBinary(data)
    return info, err
}

func L1BTCFeedDeposit(seqNumber uint64, block eth.BlockInfo, sysCfg eth.SystemConfig) (*types.DepositTx, error) {
	resp, err := http.Get("https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=BTC&to_currency=USD&apikey=YOURAPI")
   if err != nil {
      log.Fatalln(err)
   }
//We Read the response body on the line below.
   body, err := ioutil.ReadAll(resp.Body)
   if err != nil {
      log.Fatalln(err)
   }
   var res map[string]map[string]string
	if err := json.Unmarshal(body, &res); err != nil {
		panic(err)
	}
	decimal, err := strconv.ParseFloat(string(res["Realtime Currency Exchange Rate"]["5. Exchange Rate"]), 64)
    infoDat := L1BTCFeedInfo{
        Number: block.NumberU64(),
        Feed:   uint64(decimal),
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
        To:                  &L1BTCFeedAddress,
        Mint:                nil,
        Value:               big.NewInt(0),
        Gas:                 150_000_000,
        IsSystemTransaction: true,
        Data:                data,
    }, nil
}

func L1BTCFeedDepositBytes(seqNumber uint64, l1Info eth.BlockInfo, sysCfg eth.SystemConfig) ([]byte, error) {
    dep, err := L1BTCFeedDeposit(seqNumber, l1Info, sysCfg)
    if err != nil {
        return nil, fmt.Errorf("failed to create L1 btc feed tx: %w", err)
    }
    l1Tx := types.NewTx(dep)
    opaqueL1Tx, err := l1Tx.MarshalBinary()
    if err != nil {
        return nil, fmt.Errorf("failed to encode L1 btc feed tx: %w", err)
    }
    return opaqueL1Tx, nil
}

