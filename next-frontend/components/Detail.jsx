import Image from "next/image";
import React from "react";
import Component from "./Component";

const Detail = (props) => {
  return (
    <div id={props.id} className="mb-12 border-b-2 border-b-gray-200 ">
      <div className="relative grid grid-cols-12 rounded-3xl lg:p-4">
        <div className="col-span-12 md:col-span-3 sm:ml-4">
          <Image
            src={props.src}
            alt="/"
            className="h-[120px] w-[120px]  rounded-full scale-100 hover:scale-105 transition ease-in delay-10"
          />
        </div>
        <div className="col-span-12 md:col-span-9 ">
          <h2 className="mt-4 sm:ml-4 text-4xl font-bold xl:pr-28">
            {props.title}
          </h2>
        </div>
      </div>
      <div className="p-4 m-4">
        <h3
          className="mb-2 text-xl font-medium text-gray-900 uppercase"
          id="recent-hires-title"
        >
          About the Smallcase
        </h3>
        <div className="text-mb text-gray-500 lg:text-base">
          <p className="mt-4 ">{props.content}</p>
        </div>
      </div>
      <div className="p-4 flex space-x-4 flex-row">
        <div className="mr-10 mt-10 p-5">
          <h4 className="mb-2 text-lg uppercase font-medium text-black-500">
            Minimum Investment Amount
          </h4>
          <p className="mt-2 mb-2 text-2xl font-light text-gray-500">
            {props.price}
          </p>
          <div className="grid grid-rows-2">
            <button
              type="button"
              data-te-ripple-init
              data-te-ripple-color="light"
              className="scale-95 hover:scale-100 mb-1 justify-start bg-gradient-to-r from-[#01D28E] to-[#2192FF] hover:from-[#38A3A5] hover:to-[#22577A] text-white font-normal py-2 px-4 border border-green-700 rounded-md inline-block  bg-primary  pt-2.5 pb-2 text-xs  uppercase leading-normal shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
            >
              Invest Now
            </button>
            <button className="scale-95 hover:scale-100 mb-1 mt-1 uppercase justify-start bg-transparent bg-gradient-to-r hover:from-[#548CFF] hover:to-[#7900FF] text-blue-700 font-normal text-xs   hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded-md shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]">
              Share
            </button>
          </div>
        </div>
        <div>
          <div>
            <Component
              assetOne={props.assetOne}
              assetTwo={props.assetTwo}
              assetThree={props.assetThree}
              assetFour={props.assetFour}
              assetValueOne={props.assetValueOne}
              assetValueTwo={props.assetValueTwo}
              assetValueThree={props.assetValueThree}
              assetValueFour={props.assetValueFour}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
