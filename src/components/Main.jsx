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
  return (
    <div>
      <h1>Heading</h1>
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
      <table className={"table"}>
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
            <td>Anushka</td>
            <td>10A</td>
            <td>101</td>
            <td>Math</td>
          </tr>
          <tr>
            <td>Anshik</td>
            <td>10B</td>
            <td>102</td>
            <td>Science</td>
          </tr>
          <tr>
            <td>Bye</td>
            <td>
              10A
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
                    <td>
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
                            <td>
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
                              10A
                            </td>
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
                      102
                    </td>
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
            </td>
            <td>History</td>
            <td>103</td>
          </tr>
          <tr>
            <td>Diana</td>
            <td>
              Hello World
              <ul />
              10C
            </td>
            <td>104</td>
            <td>English</td>
          </tr>
          <tr>
            <td>10B</td>
            <td>Eva</td>
            <td>105</td>
            <td>Geography</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
export default Main;
