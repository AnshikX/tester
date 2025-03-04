import { useEffect } from "react";
import { useState } from "react";
import Testing from "/src/components/Testing.jsx";
const Main = ({ prop1 }) => {
  const [state, setState] = useState();
  const mapVar = [1, 2, 3, 4, 5];
  const obj = { username: "user", password: "password" };
  if (false) {
    return (
      <div>
        <div className={"row"}>
          <div className={"col"}>Hello World</div>
        </div>
        <Testing prop1={undefined} />
        {mapVar.map((item, index) => {
          return <div />;
        })}
      </div>
    );
  }
  return (
    <div
      className={"d-flex"}
      style={{ backgroundColor: "#ffffff", color: "#540808" }}
    >
      <div className={"row"}>
        {Object.entries(mapVar).map((item, index, array) => {
          if (item % 2 === 0) {
            return (
              <div style={{ backgroundColor: "#ffffff", color: "#000000" }}>
                Bye worldHello World
              </div>
            );
          } else {
            return <div>Coding</div>;
          }
        })}
      </div>
    </div>
  );
};
export default Main;
