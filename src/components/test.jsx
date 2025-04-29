import { React } from "react";
import { useState } from "react";
const test = () => {
  const arr = [
    { id: 1, name: "sam", age: 23, subject: "it" },
    { id: 2, name: "ank", age: 25, subject: "it" },
    { id: 3, name: "su", age: 24, subject: "it" },
    { id: 4, name: "rok", age: 23, subject: "it" },
  ];
  const [formdata, setFormdata] = useState({ id: "1", name: "Anonymous" });
  const handleChange = (e) => {};
  return <div>Hello world</div>;
};
export default test;
