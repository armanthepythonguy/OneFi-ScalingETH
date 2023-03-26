/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import React from "react";
import { BiRefresh } from "react-icons/bi";

const Card = (props) => {
  return (
    <div className="flex justify-center m-4 ">
      <div className="rounded-lg bg-neutral-100 p-6  text-neutral-700 shadow-lg dark:bg-neutral-600 dark:text-neutral-200 dark:shadow-black/30">
        <div className="grid grid-cols-5">
          <div>
            <div className="flex">
              <Image className="h-10 w-10" src={props.src} alt="/" />
              <h2 className=" text-2xl font-normal pl-12 pr-12">
                {props.title}
              </h2>
            </div>
          </div>
          <div className="text-center text-gray-600 pl-12 pr-12">
            <p>Current Value</p>
            <p>{props.value}</p>
          </div>
          <div className="text-center text-gray-600 pl-12 pr-12 ">
            <p>Current Investment</p>
            <p>{props.inv}</p>
          </div>
          <div className="text-center text-gray-600 pl-12 pr-12 ">
            <p>Current Returns</p>
            <p>{props.return}</p>
          </div>
          <div className="text-center text-gray-600 pl-12 pr-10">
            <p>Total Returns</p>
            <p>{props.total}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
