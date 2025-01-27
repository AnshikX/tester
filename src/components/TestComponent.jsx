import { Children } from "react";

function TestComponent({ prop1, prop2, children }) {
  return (
    <>
      <div className="">
        {prop1}
        <input type="text" value={prop2} />
      </div>
      {children}
    </>
  );
}
export default TestComponent;
