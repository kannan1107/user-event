import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useRegisterMutation } from '../../features/ApplicationApi';

const Register = () => {
    const navigate = useNavigate();
    const [registerMutation, { isLoading }] = useRegisterMutation();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        registerMutation(formData)
            .unwrap()
            .then(() => {
                toast.success('User registered successfully!');
                setFormData({ name: '', email: '', password: '', role: 'user' });
                navigate('/login');
            })
            .catch((error) => {
                console.error('Registration failed:', error);
                toast.error('Registration failed. Please try again.');
            });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 relative overflow-hidden px-4 py-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.2),transparent_20%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.18),transparent_20%)] pointer-events-none"></div>
            <div className="absolute inset-0 bg-[url('/event.png')] bg-cover bg-center opacity-10"></div>
            <div className="relative z-10 w-full max-w-md rounded-[32px] border border-white/10 bg-slate-900/85 p-10 shadow-2xl backdrop-blur-xl">
                <div className="text-center mb-8">
                    <p className="text-sm uppercase tracking-[0.3em] text-blue-300 mb-2">Event Management</p>
                    <h2 className="text-3xl font-semibold">Create your account</h2>
                    <p className="mt-2 text-sm text-slate-400">
                        Register now to manage events, tickets, and attendees from one dashboard.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                        >
                            <option value="user">User</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-3 text-base font-medium text-white shadow-lg shadow-slate-950/20 transition hover:from-blue-400 hover:to-cyan-400 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {isLoading ? 'Registering...' : 'Register'}
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate('/login')}
                        className="w-full rounded-2xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-sm text-slate-200 transition hover:bg-slate-900"
                    >
                        Back to Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
