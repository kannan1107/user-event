import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-3">
          <div>
            <h3 className="text-xl font-semibold text-white">EventS</h3>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-400">
              Manage events, tickets, and attendees from one polished dashboard built for organizers, admins, and users.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Quick Links</p>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              <li>
                <Link to="/home" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/ticket" className="hover:text-white transition-colors">
                  Tickets
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="hover:text-white transition-colors">
                  Analytics
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Contact</p>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <p>kannan11071985@gmail.com</p>
              <p>+91-9738111897</p>
              <p>Chennai, Tamil Nadu, India 600027</p>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-800 pt-6 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} Kannayira Moorthy M MERN STACK DEVELOPER.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
