import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Roles } from "../constants/Roles";

const Navbar = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  if (["/register"].includes(location.pathname)) return null;

  return (
    <nav className="bg-blue-600 text-white p-3">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        
        <div>
          <a href="/" className="text-xl font-bold hover:text-blue-200">
            EventS
          </a>
        </div>

        {user && (
          <div className="flex items-center space-x-2">
            <span>
              {user.role === Roles.ADMIN
                ? "👑"
                : user.role === Roles.ORGANIZER
                ? "🎯"
                : "👤"}
            </span>
            <span>
              {user.name} ({user.role})
            </span>
          </div>
        )}

        <div className="space-x-6">
          {user ? (
            <>
              <Link to="/home" className="hover:text-blue-200">
                Home
              </Link>

              {user.role === Roles.ADMIN && (
                <>
                  <Link to="/createUser" className="hover:text-blue-200">
                    Create User
                  </Link>
                  <Link to="/userDetails" className="hover:text-blue-200">
                    User Details
                  </Link>
                  <Link to="/analytics" className="hover:text-blue-200">
                    Analytics
                  </Link>
                </>
              )}

              {user.role === Roles.ORGANIZER && (
                <Link to="/analytics" className="hover:text-blue-200">
                  Analytics
                </Link>
              )}

              <Link to="/ticket" className="hover:text-blue-200">
                Ticket
              </Link>

              <button onClick={handleLogout}>Log Out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-200">
                Login
              </Link>
              <Link to="/register" className="hover:text-blue-200">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
