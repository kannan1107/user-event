import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  useDeleteUserMutation,
  useFetchUserQuery,
  useUpdateUserMutation,
} from "../../features/ApplicationApi";

const UserDetails = () => { // Renamed for conventional naming
  const navigate = useNavigate();
  const { user: authUser } = useSelector((state) => state.auth);

  // fetch all users (refetch available)
  const { data, isLoading, error, isFetching, refetch } = useFetchUserQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const users = data?.users || data?.data || data || [];

  // --- Live Search State ---
  const [searchTerm, setSearchTerm] = useState("");

  // --- Filtered Users based on Search Term ---
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
    // Add other fields you want to search by
  );

  // pagination (client-side) - now based on filteredUsers
  const [page, setPage] = useState(1);
  const limit = 15;
  const total = filteredUsers.length; // Use filteredUsers length
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const paginatedUsers = filteredUsers.slice((page - 1) * limit, page * limit); // Use filteredUsers

  // editing state
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    phone: "",
    password: "",
  });

  useEffect(() => {
    if (selectedUser) {
      setFormData({
        name: selectedUser.name || "",
        email: selectedUser.email || "",
        role: selectedUser.role || "",
        phone: selectedUser.phone || "",
        password: selectedUser.password || "",
      });
    }
  }, [selectedUser]);

  useEffect(() => {
    // clamp page if data changed or search term changed
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, searchTerm]); // Add searchTerm to dependency array

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (error)
    return (
      <div className="p-6 text-red-500">
        Error: {error?.data?.message || error?.error || "Unable to load users"}
      </div>
    );
  // No need for this if you want to show 'No results' after a search
  // if (!users.length) return <div className="p-6 text-gray-600">No users found</div>;

  const handleEditClick = (u) => {
    setSelectedUser(u);
  };

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    const id = selectedUser._id || selectedUser.id;
    // don't send empty password
    const payload = { ...formData };
    if (!payload.password) delete payload.password;
    try {
      await updateUser({ id, payload }).unwrap();
      setSelectedUser(null);
      await refetch();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!id) return;
    console.log("Deleting user id:", id);
    try {
      await deleteUser(id).unwrap();
      if (selectedUser && (selectedUser._id === id || selectedUser.id === id)) {
        setSelectedUser(null);
      }
      await refetch();
    } catch (err) {
      console.error("Delete user failed", err);
    }
  };

  const goToPage = (p) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // --- Handle Search Input Change ---
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to first page on search
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">All Users</h2>

      <div className="mb-4 flex items-center justify-between">
        {/* --- Search Input Field --- */}
        <input
          type="text"
          placeholder="Search users by name, email, or role..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 w-1/3"
        />

        <div className="text-sm text-gray-600">
          Showing {(page - 1) * limit + 1} - {Math.min(page * limit, total)} of {total}
          {isFetching && " (loading...)"}
        </div>
      </div>

      {total === 0 && searchTerm !== "" ? (
        <div className="p-6 text-gray-600">No users found matching "{searchTerm}"</div>
      ) : total === 0 && searchTerm === "" ? (
        <div className="p-6 text-gray-600">No users found</div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedUsers.map((u) => (
              <tr key={u._id || u.id}>
                <td className="px-6 py-4 whitespace-nowrap">{u.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{u.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{u.role}</td>
                <td className="px-6 py-4 whitespace-nowrap">{u.phone || "—"}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleEditClick(u)} className="text-indigo-600 hover:text-indigo-900 mr-2">
                    Edit
                  </button>
                  <button onClick={() => handleDeleteUser(u._id || u.id)} className="text-red-600 hover:text-red-900">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}


      {totalPages > 1 && ( // Only show pagination if there's more than one page
        <div className="mt-4 flex items-center justify-center gap-2">
          <button onClick={() => goToPage(page - 1)} disabled={page === 1} className="px-3 py-1 border rounded disabled:opacity-50">
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => goToPage(p)}
              className={`px-3 py-1 border rounded ${p === page ? "bg-blue-500 text-white" : ""}`}
            >
              {p}
            </button>
          ))}

          <button onClick={() => goToPage(page + 1)} disabled={page === totalPages} className="px-3 py-1 border rounded disabled:opacity-50">
            Next
          </button>
        </div>
      )}


      {/* Edit modal / inline form */}
      {selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <form onSubmit={handleUpdate} className="bg-white rounded p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Edit User</h3>

            <label className="block mb-2 text-sm">Name</label>
            <input name="name" value={formData.name} onChange={handleChange} className="w-full mb-3 border p-2 rounded" />

            <label className="block mb-2 text-sm">Email</label>
            <input name="email" value={formData.email} onChange={handleChange} className="w-full mb-3 border p-2 rounded" />

            <label className="block mb-2 text-sm">Role</label>
            <input name="role" value={formData.role} onChange={handleChange} className="w-full mb-3 border p-2 rounded" />

            <label className="block mb-2 text-sm">Phone</label>
            <input name="phone" value={formData.phone} onChange={handleChange} className="w-full mb-3 border p-2 rounded" />

            <label className="block mb-2 text-sm">Password (leave blank to keep)</label>
            <input name="password" value={formData.password} onChange={handleChange} type="password" className="w-full mb-4 border p-2 rounded" />

            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setSelectedUser(null)} className="px-4 py-2 border rounded">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
