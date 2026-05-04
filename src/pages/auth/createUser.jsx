import { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useRegisterMutation } from '../../features/ApplicationApi';
import Loading from '../../components/Loading';
import { Roles } from '../../constants/Roles';

const CreateUser = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const defaultState = {
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'user',
  };
  const [data, setData] = useState(defaultState);
  const [registerMutation, { isLoading }] = useRegisterMutation();

  const handleChange = (event) => {
    setData((state) => ({
      ...state,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    registerMutation(data)
      .unwrap()
      .then(() => {
        setData(defaultState);
        toast.success('User created successfully!');
      })
      .catch((error) => {
        console.error('Failed to create user:', error);
        toast.error('Failed to create user');
      });
  };

  if (isLoading) return <Loading />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 px-4 py-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),transparent_20%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.15),transparent_20%)] pointer-events-none"></div>
      <div className="relative z-10 w-full max-w-md rounded-[32px] border border-white/10 bg-slate-900/80 p-10 shadow-2xl backdrop-blur-xl">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80 mb-2">Admin Portal</p>
          <h2 className="text-3xl font-semibold text-white">Create New User</h2>
          <p className="mt-3 text-sm text-slate-400">Add a user to your event management system with a secure account.</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <label className="text-sm font-medium text-slate-200">Full Name</label>
            <input
              type="text"
              placeholder="Jane Doe"
              name="name"
              value={data.name}
              onChange={handleChange}
              className="w-full rounded-3xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
              required
            />
          </div>

          <div className="grid gap-4">
            <label className="text-sm font-medium text-slate-200">Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              name="email"
              value={data.email}
              onChange={handleChange}
              className="w-full rounded-3xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
              required
            />
          </div>

          <div className="grid gap-4">
            <label className="text-sm font-medium text-slate-200">Password</label>
            <input
              type="password"
              placeholder="Enter a strong password"
              name="password"
              value={data.password}
              onChange={handleChange}
              className="w-full rounded-3xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
              required
            />
          </div>

          <div className="grid gap-4">
            <label className="text-sm font-medium text-slate-200">Phone Number</label>
            <input
              type="tel"
              placeholder="(555) 123-4567"
              name="phone"
              value={data.phone}
              onChange={handleChange}
              className="w-full rounded-3xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
            />
          </div>

          <div className="grid gap-4">
            <label className="text-sm font-medium text-slate-200">Role</label>
            <select
              name="role"
              value={data.role}
              onChange={handleChange}
              className="w-full rounded-3xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
            >
              <option value={Roles.USER}>User</option>
              <option value={Roles.ADMIN}>Admin</option>
              <option value={Roles.ORGANIZER}>Organizer</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-3xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:from-cyan-400 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? 'Creating user...' : 'Create User'}
          </button>
        </form>

        <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-400">
          <p className="font-medium text-slate-200">Tip</p>
          <p>Assign roles carefully to keep event access secure.</p>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;
