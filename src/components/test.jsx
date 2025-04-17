import { React } from "react";
const test = () => {
  return (
    <div>
      Hello world
      {undefined.map((item) => {
        return <div />;
      })}
    </div>
  );
};
export default test;
