import { Button } from "react-bootstrap";
import { Card } from "react-bootstrap";
import { ButtonGroup } from "react-bootstrap";
import { Alert } from "react-bootstrap";
import { getPetById } from "/src/services/Swagger Petstore - OpenAPI 3.0/pet.jsx";
const Main = ({ prop1 }) => {
  const getId = async () => {
    try {
      const response = await getPetById(prop1);
    } catch (err) {}
  };
  const arr = ["A", "B"];
  return (
    <div style={{ border: "1px solid red" }}>
      <h1
        style={{
          backgroundColor: "#c44040",
          borderColor: "#4e4b4b",
          borderRadius: "3px",
          borderWidth: "4px",
        }}
      >
        Heading
      </h1>
      <h6>HEADER</h6>
      <div className={"container"}>
        <div className={"row"}>Hello WorldHello WorldHello World</div>
      </div>
      <Button
        className={"btn btn-danger"}
        onClick={() => {
          console.log("Button clicked");
        }}
        style={undefined}
      >
        This is some button
      </Button>
      <Card className={"bg-dark text-white"}>Hello World</Card>
      <ButtonGroup />
      <Card />
      Hello World<Alert>Hello World</Alert>
      {arr.map((item) => {
        return <>{item}</>;
      })}
      {arr.map((item) => {
        return <div />;
      })}
      <table className={"table p-2"}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Class</th>
            <th>Roll No</th>
            <th>Subject</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Alice</td>
            <td>10A</td>
            <td>101</td>
            <td>Math</td>
          </tr>
          <tr>
            <td>Bob</td>
            <td>10B</td>
            <td>102</td>
            <td>Science</td>
          </tr>
          <tr>
            <td>Charlie</td>
            <td>10A</td>
            <td>103</td>
            <td>History</td>
          </tr>
          <tr>
            <td>Diana</td>
            <td>10C</td>
            <td>104</td>
            <td>English</td>
          </tr>
          <tr>
            <td>Eva</td>
            <td>10B</td>
            <td>105</td>
            <td>Geography</td>
          </tr>
        </tbody>
      </table>
      {undefined ? <></> : <></>}
    </div>
  );
};
export default Main;
