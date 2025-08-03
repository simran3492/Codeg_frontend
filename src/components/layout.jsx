// components/Layout.jsx
import Header from "./header.jsx";
import { Outlet } from "react-router";

function Layout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default Layout;
