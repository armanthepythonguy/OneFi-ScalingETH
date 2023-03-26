import Image from "next/image";
import React from "react";

const List = (props) => {
  return (
    <div>
      <li className="cursor-pointer rounded-lg p-4 hover:bg-gray-200 scale-100 hover:scale-105 transition ease-in delay-10">
        <div className="flex items-center space-x-4 ">
          <div className="flex-shrink-0">
            <Image src={props.src} alt="/" className="h-8 w-8 rounded-full" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-gray-900">
              {props.title}
            </p>
            <p className="truncate text-sm text-gray-500">{props.price}</p>
          </div>
          <div></div>
        </div>
      </li>
    </div>
  );
};

export default List;
