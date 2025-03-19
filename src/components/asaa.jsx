import { useEffect } from "react";
import { useState } from "react";
const asaa = () => {
  return (
    <div style={{}}>
      <video
        controls={true}
        height={"200px"}
        src={"https://www.w3schools.com/html/mov_bbb.mp4"}
        width={"200px"}
      />
      Hello world{undefined ? <></> : <></>}
      {undefined.map((item) => {
        return <div onPaste={null} style={{}} />;
      })}
    </div>
  );
};
export default asaa;
