import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import React from "react";
import CryptoAssetBox from "@/components/CryptoAssetBox";

const Users = () => {
  return (
    <>
      <div className="p-15 bg-gradient-to-r from-[#ECF9FF] to-[#FFF8EA]">
        <Header />
        <Navbar
          one="AlgoInvestments"
          two=""
          three=""
          title="CryptoFi"
          first="Home"
          second="AlgoFi"
          third="Users"
        />
        <CryptoAssetBox />
        <Footer />
      </div>
    </>
  );
};

export default Users;
