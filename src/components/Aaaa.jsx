import { useEffect } from "react";
import { useState } from "react";
const a = "sxss";
const Aaaa = () => {
  return (
    <div onCut={null} style={{ backgroundColor: "#beb7b7" }}>
      {undefined.map((item, index, array) => {
        return (
          <div style={{}}>
            {1 === "1" ? (
              <>
                <div className={"col"} style={{ backgroundColor: "#6b5252" }} />
              </>
            ) : (
              <>
                <div className={"col"}>
                  <video
                    controls={true}
                    height={"200px"}
                    src={"https://www.w3schools.com/html/mov_bbb.mp4"}
                    width={"200px"}
                  />
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};
export default Aaaa;
