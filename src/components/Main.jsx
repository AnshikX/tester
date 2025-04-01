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
      <h6>HEADER</h6>Hello worldHello WorldHello World
      <div className={"container"}>
        <div className={"row"}>
          <div className={"container"}>
            <div className={"row"}>Hello World</div>
          </div>
          Hello WorldHello WorldHello World
        </div>
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
      <Alert>Hello World</Alert>
    </div>
  );
};
export default Main;
