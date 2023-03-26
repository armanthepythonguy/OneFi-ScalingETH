import React, { useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Web3Modal from "web3modal";
import { providers, Contract } from "ethers";
import Image from "next/image";
import cryptoImg from "/public/assets/crypto1.png";
import Link from "next/link";
import IndexCard from "@/components/IndexCard";
import Carousal from "@/components/Carousal";
import Accordian from "@/components/Accordian";
import FlowCard from "@/components/FlowCard";

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const web3ModalRef = useRef();

  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 80001) {
      window.alert("Change the network to Mumbai");
      throw new Error("Change network to Mumbai");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };

  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "mumbai",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
    console.log(window.location.pathname);
  }, [walletConnected]);

  return (
    <>
      <div className="p-15  bg-gradient-to-r from-[#ECF9FF] to-[#FFF8EA] ">
        <Header />
        <Navbar
          one="CryptoFi"
          two="LendFi"
          three="AlgoFi"
          first="Home"
          second=""
          third=""
        />
        <div className="flex flex-row pt-40">
          <div className="mr-20 mt-5 mb-20 ml-[100px]">
            <Image src={cryptoImg} alt="/" height="1500" width="1500" />
          </div>
          <div className="p-10">
            <div className="pt-[120px] px-20">
              <h1 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
                <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
                  Lorem ipsum
                </span>{" "}
                Lorem ipsum.
              </h1>
              <p className="text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 mx-40 my-20">
          <IndexCard
            title="Lorem ipsum is placeholder text"
            content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
          />
          <IndexCard
            title="Lorem ipsum is placeholder text"
            content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
          />
          <IndexCard
            title="Lorem ipsum is placeholder text"
            content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
          />
        </div>
        <Carousal />
        <Accordian />
        <FlowCard />
        <Footer />
      </div>
    </>
  );
}
