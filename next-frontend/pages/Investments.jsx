/* eslint-disable @next/next/no-img-element */
import Card from "@/components/Card";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import React, { useState } from "react";
import btcImg from "public/assets/btc.png";
import eth2Img from "public/assets/eth2.png";
import solanaImg from "public/assets/solana.png";
import { BiRefresh } from "react-icons/bi";
import Link from "next/link";
import Overview from "@/components/Overview";
import Footer from "@/components/Footer";

const Smallcase = () => {
  const [investment, setInvestment] = useState(false);

  const renderInvestment = () => {
    if (investment) {
      return (
        <div className="pt-[120px]">
          <div className="p-4">
            <Overview value="-" inv="-" return="-" total="-" />
          </div>
          <div className="grid grid-rows-3">
            <Card
              title="Bitcoin"
              src={btcImg}
              value="$18,000"
              inv="-"
              return="-"
              total="-"
            />
            <Card
              title="Solana"
              src={solanaImg}
              value="$101"
              inv="-"
              return="-"
              total="-"
            />
            <Card
              title="Ethereum"
              src={eth2Img}
              value="$1,400"
              inv="-"
              return="-"
              total="-"
            />
          </div>
        </div>
      );
    } else {
      return (
        <div className="mt-[130px]">
          <div className="px-4 pb-4 pt-1">
            <Overview value="-" inv="-" return="-" total="-" />
          </div>
          <div className="text-center  font-normal grid grid-rows-2">
            <span className="justify-center text-2xl m-1 text-gray-700">
              It&apos;s a beautiful day to start your investment journey
            </span>
            <span className="justify-center m-1 text-gray-500 text-base">
              Pick up your first smallcase today and start tracking it here
            </span>
            <Link href="/CryptoFi" target="_blank">
              <button
                type="button"
                data-te-ripple-init
                data-te-ripple-color="light"
                className="scale-95 hover:scale-100 mb-1 justify-start bg-gradient-to-r from-[#01D28E] to-[#2192FF] hover:from-[#38A3A5] hover:to-[#22577A] text-white font-normal py-2 px-4 border border-green-700 rounded-md inline-block  bg-primary  pt-2.5 pb-2 text-xs  uppercase leading-normal shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
              >
                Start Investing Today
              </button>
            </Link>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="p-15 pb-[110px] bg-gradient-to-r from-[#ECF9FF] to-[#FFF8EA]">
      <Header />
      <Navbar
        one="Investments"
        two=""
        three=""
        title="CryptoFi "
        first="Home"
        second="CryptoFi"
        third="Investments"
      />
      <div className="p-10 pb-[400px]">{renderInvestment()}</div>
      <Footer />
    </div>
  );
};

export default Smallcase;
