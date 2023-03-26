import { Breadcrumb } from "flowbite-react";
import React from "react";
import { HiHome } from "react-icons/hi";

const breadcrumb = (props) => {
  if (props.first == "Home" && props.second == "" && props.third == "") {
    return (
      <div className="bg-gradient-to-r from-[#ECF9FF] to-[#FFF8EA] ">
        <Breadcrumb
          aria-label="Solid background breadcrumb example"
          className="bg-gradient-to-r from-[#ECF9FF] to-[#FFF8EA] border rounded-lg py-3 px-5 mx-[75px] "
        >
          <Breadcrumb.Item href="/" icon={HiHome}>
            {props.first}
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
    );
  } else {
    return (
      <div className="bg-gradient-to-r from-[#ECF9FF] to-[#FFF8EA] ">
        <Breadcrumb
          aria-label="Solid background breadcrumb example"
          className="bg-gradient-to-r from-[#ECF9FF] to-[#FFF8EA] border rounded-lg py-3 px-5 mx-[75px] "
        >
          <Breadcrumb.Item href="/" icon={HiHome}>
            {props.first}
          </Breadcrumb.Item>
          <Breadcrumb.Item href={props.second}>{props.second}</Breadcrumb.Item>
          <Breadcrumb.Item href={props.third}>{props.third}</Breadcrumb.Item>
        </Breadcrumb>
      </div>
    );
  }
};

export default breadcrumb;
