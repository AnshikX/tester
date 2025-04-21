import { React } from "react";
const test = () => {
  return (
    <div>
      Hello world
      <table className={"table p-2"}>
        <thead>
          <tr>
            {["id", "name", "age"].map((item) => {
              return (
                <>
                  <th>{item}</th>
                </>
              );
            })}
          </tr>
        </thead>
        <tbody />
      </table>
    </div>
  );
};
export default test;
