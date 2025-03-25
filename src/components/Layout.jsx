const Layout = ({ children }) => {
  return (
    <div className={"d-flex flex-column h-100"}>
      <nav className={"bg-dark p-3"}>
        <div className={"d-flex justify-content-between align-items-center"}>
          <a
            className={"text-white text-decoration-none fs-5 fw-bold"}
            href={"/"}
          >
            MyLogo
          </a>
          <ul className={"d-flex gap-3 m-0 d-none d-md-flex"}>
            <li>
              <a className={"text-white text-decoration-none p-1"}>Home</a>
            </li>
            <li>
              <a className={"text-white text-decoration-none p-1"}>About</a>
            </li>
            <li>
              <a className={"text-white text-decoration-none p-1"}>Services</a>
            </li>
            <li>
              <a className={"text-white text-decoration-none p-1"}>Contact</a>
            </li>
          </ul>
        </div>
      </nav>
      <div className={"d-flex h-100"}>
        <aside className={"w-25 h-100 bg-secondary"}>SideBar</aside>
        <main className={"h-100 w-75"}>{children}</main>
      </div>
    </div>
  );
};
export default Layout;
