/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import React from "react";
import { BiRefresh } from "react-icons/bi";

const Overview = (props) => {
  return (
    <div className="flex justify-center mx-[100px]">
      <div className="rounded-lg bg-neutral-100 p-6 text-neutral-700 shadow-lg dark:bg-neutral-600 dark:text-neutral-200 dark:shadow-black/30">
        <div className="grid grid-cols-5">
          <div>
            <div className="flex">
              <h2 className=" text-2xl font-normal">Your Investments </h2>
              <span className="cursor-pointer justify-center ">
                <BiRefresh size={20} />
              </span>
            </div>
            <p className="text-sm font-normal text-gray-500 ">
              Invest in smallcases to see overview here
            </p>
          </div>
          <div className="text-center text-gray-600">
            <p>Current Value</p>
            <p>{props.value} </p>
          </div>
          <div className="text-center text-gray-600">
            <p>Current Investment</p>
            <p>{props.inv}</p>
          </div>
          <div className="text-center text-gray-600">
            <p>Current Returns</p>
            <p>{props.return}</p>
          </div>
          <div className="text-center text-gray-600">
            <p>Total Returns</p>
            <p>{props.total}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
