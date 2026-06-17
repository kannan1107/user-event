import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { Roles } from "../constants/Roles";

const Navbar = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(logout());
    navigate("/login");
  };

  if (["/register"].includes(location.pathname)) return null;

  const linkClass = ({ isActive }) =>
    `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isActive
      ? "bg-white/20 text-white"
      : "text-slate-300 hover:text-white hover:bg-white/10"
    }`;

  return (
    <nav className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-white/10 shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <NavLink to="/home" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shadow-md group-hover:bg-indigo-400 transition-colors">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 12c0-1.1.9-2 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v4c1.1 0 2 .9 2 2s-.9 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2z" />
              </svg>
            </div>
            <span className="text-white font-bold text-lg tracking-wide">EventS</span>
          </NavLink>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {user ? (
              <>
                <NavLink to="/home" className={linkClass}>Home</NavLink>

                {user.role === Roles.ADMIN && (
                  <>
                    <NavLink to="/createUser" className={linkClass}>New User</NavLink>
                    <NavLink to="/userDetails" className={linkClass}>Users</NavLink>
                    <NavLink to="/analytics" className={linkClass}>Analytics</NavLink>
                  </>
                )}

                {user.role === Roles.ORGANIZER && (
                  <NavLink to="/analytics" className={linkClass}>Analytics</NavLink>
                )}

                <NavLink to="/ticket" className={linkClass}>Tickets</NavLink>
              </>
            ) : (
              <>
                <NavLink to="/login" className={linkClass}>Login</NavLink>
                <NavLink to="/register" className={linkClass}>Register</NavLink>
              </>
            )}
          </div>

          {/* Right: User info + Logout */}
          <div className="hidden md:flex items-center gap-3">
            {user && (
              <>
                <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1.5">
                  <span className="text-base leading-none">
                    {user.role === Roles.ADMIN ? "👑" : user.role === Roles.ORGANIZER ? "🎯" : "👤"}
                  </span>
                  <span className="text-sm text-slate-200 font-medium">{user.name}</span>
                  <span className="text-xs text-indigo-300 capitalize">({user.role})</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium px-4 py-1.5 rounded-lg bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500 hover:text-white transition-colors"
                >
                  Log Out
                </button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-slate-300 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/10 bg-slate-900/95 px-4 py-4 space-y-2">
          {user ? (
            <>
              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/10">
                <span>{user.role === Roles.ADMIN ? "👑" : user.role === Roles.ORGANIZER ? "🎯" : "👤"}</span>
                <span className="text-sm text-slate-200 font-medium">{user.name}</span>
                <span className="text-xs text-indigo-300 capitalize">({user.role})</span>
              </div>
              <NavLink to="/home" className={linkClass} onClick={() => setMenuOpen(false)}>Home</NavLink>
              {user.role === Roles.ADMIN && (
                <>
                  <NavLink to="/createUser" className={linkClass} onClick={() => setMenuOpen(false)}>New User</NavLink>
                  <NavLink to="/userDetails" className={linkClass} onClick={() => setMenuOpen(false)}>Users</NavLink>
                  <NavLink to="/analytics" className={linkClass} onClick={() => setMenuOpen(false)}>Analytics</NavLink>
                </>
              )}
              {user.role === Roles.ORGANIZER && (
                <NavLink to="/analytics" className={linkClass} onClick={() => setMenuOpen(false)}>Analytics</NavLink>
              )}
              <NavLink to="/ticket" className={linkClass} onClick={() => setMenuOpen(false)}>Tickets</NavLink>
              <button
                onClick={handleLogout}
                className="w-full text-left text-sm font-medium px-3 py-1.5 rounded-lg bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500 hover:text-white transition-colors mt-2"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass} onClick={() => setMenuOpen(false)}>Login</NavLink>
              <NavLink to="/register" className={linkClass} onClick={() => setMenuOpen(false)}>Register</NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
