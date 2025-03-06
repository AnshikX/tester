import { useEffect } from "react";
import { useState } from "react";
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
      {mapVar.map((item) => {
        if (item % 2 === 0) {
          return (
            <>
              <div>Hello </div>
            </>
          );
        } else {
          return (
            <>
              <div className={"col"} />
            </>
          );
        }
      })}
      {undefined.map((item) => {
        return <div />;
      })}
    </div>
  );
};
export default Main;
