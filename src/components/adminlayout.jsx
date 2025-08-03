import Header from "./header.jsx";
import { Outlet } from "react-router";

function AdminLayout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default AdminLayout;