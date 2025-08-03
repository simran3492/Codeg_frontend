import { Routes,Route,Navigate } from "react-router"
import HomePage from "./pages/homePage.jsx"
import Login from "./pages/login.jsx"
import Signup from "./pages/signup.jsx"
import { useDispatch, useSelector } from 'react-redux';
import { userCheck } from "./redux/authSlice.js";
import { useEffect } from "react";
import Layout from "./components/layout.jsx";
import { setTheme } from './redux/themeSlice';
import { PulseLoader } from "react-spinners";
import Problems from "./pages/problems.jsx"
import ProblemPage from "./pages/problemPage.jsx";
import AdminLayout from "./components/adminlayout.jsx";
import AdminDashboard from "./admin/admindashboard.jsx";
import AdminCreateProblem from "./admin/createProblem.jsx";
import UpdateProblemPage from "./admin/updateproblem.jsx";
import EditProblemPage from "./admin/editproblem.jsx";
import AdminDelete from "./admin/deleteproblem.jsx";
import ManageUsers from "./admin/manageuser.jsx";

function App(){
  
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.mode);
  const {isAuthenticated,loading,error,user} = useSelector((state)=>state.auth);

  // check initial authentication
  useEffect(() => {
    dispatch(userCheck());
  }, [dispatch]); 

 useEffect(() => {
  document.documentElement.setAttribute('data-theme', theme);
}, [theme]);



// console.log({ loading, isAuthenticated, error });

if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <PulseLoader size={15} color="#3b82f6" />
    </div>
  );
}
// console.log(loading)



  
  return <>
    <Routes>
      <Route element={<Layout></Layout>}>
        <Route path="/" element={<HomePage />}></Route>
       
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login></Login>}></Route>
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/" /> : <Signup></Signup>}></Route>
        <Route path="/problems" element={<Problems></Problems>}></Route>
      </Route>
         <Route path="/problems/:id" element={<ProblemPage></ProblemPage>}></Route>
         <Route  element={isAuthenticated && user?.role==="admin"?<AdminLayout></AdminLayout>:<Navigate to="/" />}>
         <Route path="/admin" element={<AdminDashboard></AdminDashboard>}></Route>
         <Route path="/admin/create" element={<AdminCreateProblem></AdminCreateProblem>}></Route>
         <Route path="/admin/update" element={<UpdateProblemPage></UpdateProblemPage>}></Route>
         <Route path="/admin/update/editproblem/:id" element={<EditProblemPage></EditProblemPage>}></Route>
         <Route path="/admin/delete" element={<AdminDelete></AdminDelete>}></Route>
         <Route path="/admin/manage" element={<ManageUsers></ManageUsers>}></Route>
         </Route>
         

    </Routes>
  </>
}

export default App;