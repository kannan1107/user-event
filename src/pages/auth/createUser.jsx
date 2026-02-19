import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useRegisterMutation } from '../../features/ApplicationApi';
import Loading from '../../components/Loading';

const createUser = () => {
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
      .then((res) => {
        setData(defaultState);
        alert('User created successfully!');
      })
      .catch((error) => {
        console.error('Failed to create user:', error);
        alert('Failed to create user');
      });
  };

  if (isLoading) return <Loading />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Create User</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label>Name</label>
            <input
              type="text"
              placeholder="Full Name"
              name="name"
              value={data.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label>Email</label>
            <input
              type="email"
              placeholder="Email Address"
              name="email"
              value={data.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={data.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label>Phone</label>
            <input
              type="tel"
              placeholder="Phone Number"
              name="phone"
              value={data.phone}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label>Role</label>
            <select
              name="role"
              value={data.role}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="organizer">Organizer</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700"
          >
            {isLoading ? 'Creating...' : 'Create User'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default createUser;
