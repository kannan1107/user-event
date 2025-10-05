import { Route, Routes } from "react-router-dom";
import Navbar from "../components/Navbar";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Home from "../pages/auth/Home";



const AppRoutes = () => {
  return (
    <>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/home" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
      </Routes>
    </>
  )
}

export default AppRoutes;
