import { useEffect } from "react";
import { useState } from "react";
const ankur = ({ prop1 }) => {
  const [state, setState] = useState();
  return (
    <div style={{ backgroundColor: undefined }}>
      Hello world<span>Hiiiii</span>
      <div className={"row"}>
        <div className={"col"}>Hello World</div>
        <div className={"col"}>Hello World</div>
        <div className={"col"}>Hello World</div>
        <div className={"col"}>Hello World</div>
      </div>
    </div>
  );
};
export default ankur;
