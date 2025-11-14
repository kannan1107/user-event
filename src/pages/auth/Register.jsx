import { useState } from 'react';
import { useRegisterMutation } from '../../features/ApplicationApi';

const Register = () => {
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
                alert('User registered successfully!');
                setFormData({ name: '', email: '', password: '', role: 'user' });
            })
            .catch((error) => {
                console.error('Registration failed:', error);
                alert('Registration failed. Please try again.');
            });
    };

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md m-55">
            <h2 className="text-2xl font-bold mb-6 text-center">Create New User</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="user">User</option>
                </select>
                
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200 disabled:opacity-50"
                >
                    {isLoading ? 'Registering...' : 'Register'}
                </button>
            </form>
        </div>
    );
};

export default Register;