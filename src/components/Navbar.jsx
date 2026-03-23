import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (['/login', '/register'].includes(location.pathname)) return null;

  return (
    <nav className="bg-blue-600 text-white p-3">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <div><a href="/" className="text-xl font-bold hover:text-blue-200">EventS</a></div>

        {user && (
          <div className="flex items-center space-x-2 bg-blue-700 px-4 py-2 rounded">
            <span>{user.role === 'admin' ? '👑' : '👤'}</span>
            <span className="font-semibold">{user.name}</span>
            <span className="text-blue-200">({user.role})</span>
          </div>
        )}

        <div className="space-x-6">
          {user ? (
            <>
              <Link to="/home" className="hover:text-blue-200">Home</Link>
              {user.role === "admin" && (
                <>
                  <Link to="/createUser" className="hover:text-blue-200">Create User</Link>
                  <Link to="/userDetails" className="hover:text-blue-200">User Details</Link>
                </>
              )}
              <Link to="/ticket" className="hover:text-blue-200">Ticket</Link>
              {(user.role === 'admin' || user.role === 'organizer') && (
                <Link to="/chart" className="hover:text-blue-200">Analytics</Link>
              )}
              <button onClick={handleLogout}>Log Out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-200">Login</Link>
              <Link to="/register" className="hover:text-blue-200">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
