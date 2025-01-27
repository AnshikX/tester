import { useEffect } from "react";
import { useState } from "react";
const Main = ({ prop1, prop2 }) => {
  const [data, setData] = useState();
  return (
    <div>
      Hello world
      <div>
        <img
          alt={"Placeholder"}
          height={"150px"}
          src={
            "https://media.cntraveler.com/photos/60a6c5d7fa22dcf742469b4c/4:3/w_4608,h_3456,c_limit/Breeze017a%20(1).jpg"
          }
          width={"150px"}
        />
      </div>
      <form>
        <div>
          <label htmlFor={namr}>Name</label>
          <input type={"text"} />
        </div>
      </form>
    </div>
  );
};
export default Main;
