import CryptoAssetBox from "@/components/CryptoAssetBox";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import React from "react";

const CryptoFi = () => {
  return (
    <>
      <div className="p-15 bg-gradient-to-r from-[#ECF9FF] to-[#FFF8EA]">
        <Header />
        <Navbar
          one="Investments"
          two=""
          three=""
          title="CryptoFi"
          first="Home"
          second="CryptoFi"
          third=""
        />
        <CryptoAssetBox />
        <Footer />
      </div>
    </>
  );
};

export default CryptoFi;
