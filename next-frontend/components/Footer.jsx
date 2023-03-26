import { Footer } from "flowbite-react";
import Link from "next/link";
import React from "react";

const footer = () => {
  return (
    // <footer className="py-10 lg:py-24 border-t border-t-black-100">
    //   <div className="relative max-w-7xl mx-auto px-6 lg:px-8 w-full">
    //     <h3 className="text-center">
    //       Made with &#10084; by Team Code Phat Gaya
    //     </h3>
    //   </div>
    // </footer>
    <Footer
      container={true}
      className="bg-gradient-to-r from-[#ECF9FF] to-[#FFF8EA]"
    >
      <div className="w-full text-center">
        <div className="w-full justify-between sm:flex sm:items-center sm:justify-between">
          <Link href="/">
            <span className="mx-[150px] self-center whitespace-nowrap text-4xl text-transparent bg-clip-text bg-gradient-to-r to-[#3C79F5] from-[#6C00FF] font-bold ">
              OneFi
            </span>
          </Link>
          <Footer.LinkGroup className="mx-40">
            <Footer.Link className="text-base" href="/">
              Home
            </Footer.Link>
            <Footer.Link className="text-base" href="/CryptoFi">
              CryptoFi
            </Footer.Link>
            <Footer.Link className="text-base" href="/LendFi">
              LendFi
            </Footer.Link>
            <Footer.Link className="text-base" href="/AlgoFi">
              AlgoFi
            </Footer.Link>
          </Footer.LinkGroup>
        </div>
        <Footer.Divider />
        <Footer.Copyright href="#" by="OneFi™" year={2023} />
      </div>
    </Footer>
  );
};

export default footer;
