import { Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Home from "../pages/auth/Home";
import CreateEvent from "../pages/auth/createEvent";
import UpdateEvent from "../pages/auth/updateEvent";
import Payment from "../pages/auth/Payment";
import CreateUser from "../pages/auth/createUser";
import UserDetails from '../pages/auth/userDetails';
import Ticket from "../pages/auth/Ticket";
import EventDetails from "../pages/auth/eventDetails";
import Analytics from "../pages/auth/Analytics";
import { Roles } from "../constants/Roles";


const ProtectedRoute = ({ children }) => {
  const user = useSelector((state) => state.auth.user);
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const user = useSelector((state) => state.auth.user);
  if (!user) return <Navigate to="/login" />;
  if (user.role !== Roles.ADMIN) return <Navigate to="/home" />;
  return children;
};

const OrganizerRoute = ({ children }) => {
  const user = useSelector((state) => state.auth.user);

  if (!user) return <Navigate to="/login" />;
  // Allow both organizers and admins to access organizer routes
  if (user.role !== Roles.ORGANIZER && user.role !== Roles.ADMIN) return <Navigate to="/home" />;

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
        <Route path="/createEvent" element={<OrganizerRoute><CreateEvent/></OrganizerRoute>} />
        <Route path="/updateEvent" element={<OrganizerRoute><UpdateEvent/></OrganizerRoute>} />
        <Route path="/ticket" element={<ProtectedRoute><Ticket/></ProtectedRoute>} />
        {/* Consolidated Analytics routes */}
        <Route path="/analytics" element={<ProtectedRoute><Analytics/></ProtectedRoute>} />
        <Route path="/chart" element={<ProtectedRoute><Analytics/></ProtectedRoute>} />
        <Route path="/analize" element={<Navigate to="/analytics" />} />
        <Route path="/eventDetails" element={<ProtectedRoute><EventDetails/></ProtectedRoute>} />

        <Route path="/userDetails" element={<AdminRoute><UserDetails /></AdminRoute>} /> 
        <Route path="/payment" element={<ProtectedRoute><Payment/></ProtectedRoute>} />
      </Routes>
    </>
  )
}

export default AppRoutes;
