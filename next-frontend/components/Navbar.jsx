import React from "react";
import Breadcrumb from "./Breadcrumb";
import TickerTape from "./TickerTape";
import { Navbar } from "flowbite-react";

const navbar = (props) => {
  return (
    <div className="px-20 py-5 h-[160px] mb-10 justify fixed w-full  z-[100] bg-gradient-to-r from-[#ECF9FF] to-[#FFF8EA]">
      <div className="flex bg-transparent">
        <TickerTape />
      </div>
      <div className="mt-2">
        <Navbar
          fluid={true}
          rounded={true}
          className="bg-gradient-to-r from-[#ECF9FF] to-[#FFF8EA]"
        >
          <React.Fragment key=".0">
            <Navbar.Brand href="/">
              <span className="mx-[60px] self-center whitespace-nowrap text-5xl text-transparent bg-clip-text bg-gradient-to-r to-[#3C79F5] from-[#6C00FF] font-bold ">
                OneFi
              </span>
            </Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className="mr-20">
              <Navbar.Link className="text-xl" active href="/">
                Home
              </Navbar.Link>
              <Navbar.Link className="text-xl" href={props.one}>
                {props.one}
              </Navbar.Link>
              <Navbar.Link className="text-xl" href={props.two}>
                {props.two}
              </Navbar.Link>
              <Navbar.Link className="text-xl" href={props.three}>
                {props.three}
              </Navbar.Link>
            </Navbar.Collapse>
          </React.Fragment>
        </Navbar>
      </div>
      <div className="pb-5">
        <Breadcrumb
          first={props.first}
          second={props.second}
          third={props.third}
        />
      </div>
    </div>
  );
};

export default navbar;
