import { useEffect } from "react";
import { useState } from "react";
const Main = ({ prop1 }) => {
  const [state, setState] = useState();
  const mapVar = [1, 2, 3, 4, 5];
  return (
    <div style={{ backgroundColor: "#f5f5f5", color: "#540808" }}>
      Hello world
      <div className={"row"}>
        <div className={"col"}>Hello World</div>
        <div className={"col"}>Hello World</div>
      </div>
      {mapVar.map((item) => {
        if (item % 2 === 0) {
          return (
            <div style={{ backgroundColor: "#be7474", color: "#ff0000" }}>
              Anushkaa
            </div>
          );
        } else {
          return <div>Coding</div>;
        }
      })}
      {Main.map((item) => {
        return (
          <div
            style={{ backgroundColor: "#ddc0c0", color: "#ff0000" }}
            className={"d-flex"}
          >
            <div className={"col"} />
            <div className={"col"}>Hello World</div>Bye
          </div>
        );
      })}
    </div>
  );
};
export default Main;
