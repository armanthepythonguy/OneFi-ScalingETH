import React from "react";
import List from "./List";
import Detail from "./Detail";
import Link from "next/link";
import btcImg from "public/assets/btc.png";
import eth2Img from "public/assets/eth2.png";
import tetherImg from "public/assets/tether.png";
import bnbImg from "public/assets/bnb.png";
import xrpImg from "public/assets/xrp.png";
import cardanoImg from "public/assets/cardano.png";
import solanaImg from "public/assets/solana.png";
import polkadotImg from "public/assets/polkadot.svg";
import ltcImg from "public/assets/ltc.png";
import avalancheImg from "public/assets/avalanche.png";

const AssetBox = () => {
  return (
    <div className="relative max-w-7xl mx-auto px-6 lg:px-8 w-full mb-24 pt-40 rounded-md">
      <div className="grid grid-cols-12 rounded-lg bg-white shadow">
        <div className="col-span-0 sticky top-0 hidden h-screen overflow-auto md:col-span-4 md:block">
          <div className="p-6">
            <div className="mt-6 mb-12 flow-root">
              <ul role="list" className="-my-5 divide-y divide-gray-200">
                <Link href="#Bitcoin">
                  <List src={btcImg} title="Bitcoin" price="$18,000" />
                </Link>
                <Link href="#Ethereum">
                  <List src={eth2Img} title="Ethereum" price="$1,400" />
                </Link>
                <Link href="#Tether">
                  <List src={tetherImg} title="Tether" price="$1" />
                </Link>
                <Link href="#Binance-Coin">
                  <List src={bnbImg} title="Binance Coin" price="$285" />
                </Link>
                <Link href="#XRP">
                  <List src={xrpImg} title="XRP" price="$0.37" />
                </Link>
                <Link href="#Cardano">
                  <List src={cardanoImg} title="Cardano" price="$0.32" />
                </Link>
                <Link href="#Solana">
                  <List src={solanaImg} title="Solana" price="$101" />
                </Link>
                <Link href="#Polkadot">
                  <List src={polkadotImg} title="Polkadot" price="$5.10" />
                </Link>
                <Link href="#Litecoin">
                  <List src={ltcImg} title="Litecoin" price="$84" />
                </Link>
                <Link href="#Avalanche">
                  <List src={avalancheImg} title="Avalanche" price="$15.4" />
                </Link>
              </ul>
            </div>
          </div>
        </div>
        <div className="col-span-12 py-8 md:col-span-8">
          <Detail
            id="Bitcoin"
            src={btcImg}
            title="Bitcoin"
            price="$18,000"
            content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
            assetOne="BTC"
            assetTwo="ETH"
            assetThree="SOL"
            assetValueOne="3000"
            assetValueTwo="2000"
            assetValueThree="1000"
            assetFour="LTC"
            assetValueFour="5000"
          />
          <Detail
            id="Ethereum"
            src={eth2Img}
            title="Ethereum"
            price="$1,400"
            content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
            assetOne="BTC"
            assetTwo="ETH"
            assetThree="SOL"
            assetValueOne="3000"
            assetValueTwo="2000"
            assetValueThree="1000"
            assetFour="LTC"
            assetValueFour="5000"
          />
          <Detail
            id="Tether"
            src={tetherImg}
            title="Tether"
            price="$1"
            content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
            assetOne="BTC"
            assetTwo="ETH"
            assetThree="SOL"
            assetValueOne="3000"
            assetValueTwo="2000"
            assetValueThree="1000"
            assetFour="LTC"
            assetValueFour="5000"
          />
          <Detail
            id="Binance-Coin"
            src={bnbImg}
            title="Binance Coin"
            price="$285"
            content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
            assetOne="BTC"
            assetTwo="ETH"
            assetThree="SOL"
            assetValueOne="3000"
            assetValueTwo="2000"
            assetValueThree="1000"
            assetFour="LTC"
            assetValueFour="5000"
          />
          <Detail
            id="XRP"
            src={xrpImg}
            title="XRP"
            price="$0.37"
            content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
            assetOne="BTC"
            assetTwo="ETH"
            assetThree="SOL"
            assetValueOne="3000"
            assetValueTwo="2000"
            assetValueThree="1000"
            assetFour="LTC"
            assetValueFour="5000"
          />
          <Detail
            id="Cardano"
            src={cardanoImg}
            title="Cardano"
            price="$0.32"
            content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
            assetOne="BTC"
            assetTwo="ETH"
            assetThree="SOL"
            assetValueOne="3000"
            assetValueTwo="2000"
            assetValueThree="1000"
            assetFour="LTC"
            assetValueFour="5000"
          />
          <Detail
            id="Solana"
            src={solanaImg}
            title="Solana"
            price="$101"
            content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
            assetOne="BTC"
            assetTwo="ETH"
            assetThree="SOL"
            assetValueOne="3000"
            assetValueTwo="2000"
            assetValueThree="1000"
            assetFour="LTC"
            assetValueFour="5000"
          />
          <Detail
            id="Polkadot"
            src={polkadotImg}
            title="Polkadot"
            price="$5.10"
            content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
            assetOne="BTC"
            assetTwo="ETH"
            assetThree="SOL"
            assetValueOne="3000"
            assetValueTwo="2000"
            assetValueThree="1000"
            assetFour="LTC"
            assetValueFour="5000"
          />
          <Detail
            id="Litecoin"
            src={ltcImg}
            title="Litecoin"
            price="$84"
            content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
            assetOne="BTC"
            assetTwo="ETH"
            assetThree="SOL"
            assetValueOne="3000"
            assetValueTwo="2000"
            assetValueThree="1000"
            assetFour="LTC"
            assetValueFour="5000"
          />
          <Detail
            id="Avalanche"
            src={avalancheImg}
            title="Avalanche"
            price="$15.4"
            content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
            assetOne="BTC"
            assetTwo="ETH"
            assetThree="SOL"
            assetValueOne="3000"
            assetValueTwo="2000"
            assetValueThree="1000"
            assetFour="LTC"
            assetValueFour="5000"
          />
        </div>
      </div>
    </div>
  );
};

export default AssetBox;
