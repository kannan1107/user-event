import { Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar.jsx";
import Login from "../pages/auth/Login.jsx";
import Register from "../pages/auth/Register.jsx";
import Home from "../pages/auth/Home.jsx";
import CreateEvent from "../pages/auth/createEvent.jsx";
import UpdateEvent from "../pages/auth/updateEvent.jsx";
import Payment from "../pages/auth/Payment.jsx";
import CreateUser from "../pages/auth/createUser.jsx";
import UserDetails from '../pages/auth/userDetails.jsx';
import Ticket from "../pages/auth/Ticket.jsx";


const ProtectedRoute = ({ children }) => {
  const user = useSelector((state) => state.auth.user);
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const user = useSelector((state) => state.auth.user);
  if (!user) return <Navigate to="/login" />;
  if (user.role !== "admin") return <Navigate to="/home" />;
  return children;
};

const AppRoutes = () => {
  const user = useSelector((state) => state.auth.user);
  
  return (
    <>
      <Navbar/>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/home" /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/home" element={<ProtectedRoute><Home/></ProtectedRoute>} />
        <Route path="/createUser" element={<AdminRoute><CreateUser/></AdminRoute>} />
        <Route path="/createEvent" element={<ProtectedRoute><CreateEvent/></ProtectedRoute>} />
        <Route path="/updateEvent" element={<ProtectedRoute><UpdateEvent/></ProtectedRoute>} />
        <Route path="/ticket" element={<Ticket/>} />

        <Route path="/userDetails" element={<AdminRoute><UserDetails /></AdminRoute>} /> 
        <Route path="/payment" element={<ProtectedRoute><Payment/></ProtectedRoute>} />
      </Routes>
    </>
  )
}

export default AppRoutes;
