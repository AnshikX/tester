import { Outlet } from "react-router-dom";
import Layout from "/src/components/Layout.jsx";
const App = () => {
  return (
    <>
      <Layout>
        <Outlet />
      </Layout>
    </>
  );
};
export default App;
