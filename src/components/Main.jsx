import { useEffect } from "react";
import { useState } from "react";
import Aaaa from "/src/components/Aaaa.jsx";
const Main = ({ prop1 }) => {
  const [state, setState] = useState();
  const mapVar = [1, 2, 3, 4, 5];
  const obj = { username: "user", password: "password" };
  if (false) {
    return (
      <div style={{ backgroundColor: "#ffffff" }}>
        <div className={"row"}>
          <div className={"col"}>Hello World</div>
        </div>
        {obj.map((item, index) => {
          return (
            <div onBlur={"1"}>
              <Aaaa className={"bg-dark"} />
            </div>
          );
        })}
      </div>
    );
  }
  return (
    <div style={{ backgroundColor: "#ffffff", color: "#540808" }}>
      <div className={"row"}>
        {mapVar.map((item, index) => {
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
