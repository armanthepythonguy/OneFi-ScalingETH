import React from "react";
import { ReactTicker } from "@guna81/react-ticker";
import { green, inherit, orange, red } from "tailwindcss/colors";
import Data from "/data/data.json";

const TickerTape = ({ color }) => {
  return (
    <div>
      <ReactTicker
        data={Data.map((item) => item.value + ": $" + item.price)}
        // data={Data}
        // component={renderItem}
        speed={58}
        keyName="_id"
        tickerStyle={{
          position: "fixed",
          top: 0,
          left: "0",
          width: "100%",
          height: "25px",
          backgroundColor: inherit,
          zIndex: 99,
          borderTop: "1px solid #e0e0e0",
          borderBottom: "1px solid #e0e0e0",
        }}
        tickerClassName="news-ticker"
      />
    </div>
  );
};

export default TickerTape;
