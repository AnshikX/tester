import { useEffect } from "react";
import { useState } from "react";
import Aaaa from "/src/components/Aaaa.jsx";
const Main = ({ prop1 }) => {
  const [state, setState] = useState();
  const mapVar = [1, 2, 3, 4, 5];
  const obj = { username: "user", password: "password" };
  const abc = (
    <>
      <div />
    </>
  );
  if (false) {
  }
  return (
    <div
      className={"container-fluid"}
      style={{ backgroundColor: "#ffffff", color: "#540808" }}
    >
      <div className={"col"}>
        <div
          className={"row"}
          style={{ backgroundColor: "#b04a4a", color: "#181616" }}
        >
          <div className={"col"}>
            <Aaaa />
          </div>
          <div className={"col"}>
            Hello World
            <Aaaa onCopy={undefined} />
          </div>
          <div className={"col"}>Hello World</div>
        </div>
      </div>
      {Object.keys(obj).map((item) => {
        return <div />;
      })}
      {1 == "1" ? <></> : <></>}
    </div>
  );
};
export default Main;
