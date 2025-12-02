import React, { useState, useEffect } from "react";
import {
  Calendar,
  Plus,
  Trash2,
  Edit,
  Search,
  User,
  Mail,
  Phone,
  UserX,
} from "lucide-react";
import axios from "axios";
import config from "../../config/config";

const UserProfile = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${config.backendUrl}/get-all-users`);
      if (response.data && response.data.data) {
        setUsers(
          response.data.data.map((user) => ({
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            gender: user.gender,
          }))
        );
      }
      setLoading(false);
    } catch (err) {
      setError(err.message || "Failed to fetch users.");
      setLoading(false);
    }
  };

  const handleInputClick = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async(e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${config.backendUrl}/update`,
        formData,
        { withCredentials: true }
      );
      if (response.data) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === formData.id ? { ...user, ...formData } : user
          )
        );
        setIsEditMode(false);
        setSelectedUser(formData);
        alert("User updated successfully");
      } else {
        alert("Failed to update user.");
      }
    } catch (err) {
      console.log(err);
      alert("Error occurred while updating");
    }
  };

  const handleDeleteSubmit = async () => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const response = await axios.post(`${config.backendUrl}/del`, formData);
      if (response.data) {
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== formData.id));
        setIsModalOpen(false);
        alert("User deleted successfully");
      }
    } catch (err) {
      console.log(err);
      alert("Failed to delete user");
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    fetchUsers();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openUserModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
    setFormData(user);
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-900">User Directory</h1>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search users..."
            className="h-10 w-full rounded-lg border border-slate-200 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredUsers.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              onClick={() => openUserModal(user)}
              className="group cursor-pointer rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5 transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <User size={24} />
                </div>
                <div className="overflow-hidden">
                  <h3 className="font-semibold text-slate-900 truncate">{user.fullName}</h3>
                  <p className="text-sm text-slate-500 truncate">{user.email}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-64 items-center justify-center rounded-xl bg-slate-50 border-2 border-dashed border-slate-200">
          <p className="text-slate-500">No users found matching your search.</p>
        </div>
      )}

      {/* User Details Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <button
              onClick={() => {
                setIsModalOpen(false);
                setIsEditMode(false);
              }}
              className="absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <Trash2 className="hidden" /> {/* Hidden trash icon? Original had X */}
              <span className="text-xl font-bold">&times;</span>
            </button>

            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <User size={40} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                {isEditMode ? (
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputClick}
                    className="w-full rounded border border-slate-300 px-2 py-1 text-center"
                  />
                ) : (
                  selectedUser.fullName
                )}
              </h2>
              <p className="text-slate-500">{selectedUser.email}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
                <Mail className="text-slate-400" size={20} />
                <div className="flex-1">
                  <p className="text-xs font-medium text-slate-500">Email</p>
                  {isEditMode ? (
                    <input
                      type="text"
                      name="email"
                      value={formData.email}
                      onChange={handleInputClick}
                      className="w-full rounded border border-slate-300 px-2 py-1 text-sm"
                    />
                  ) : (
                    <p className="text-sm text-slate-900">{selectedUser.email}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
                <Phone className="text-slate-400" size={20} />
                <div className="flex-1">
                  <p className="text-xs font-medium text-slate-500">Phone</p>
                  {isEditMode ? (
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputClick}
                      className="w-full rounded border border-slate-300 px-2 py-1 text-sm"
                    />
                  ) : (
                    <p className="text-sm text-slate-900">{selectedUser.phone}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
                <UserX className="text-slate-400" size={20} />
                <div className="flex-1">
                  <p className="text-xs font-medium text-slate-500">Gender</p>
                  {isEditMode ? (
                    <input
                      type="text"
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputClick}
                      className="w-full rounded border border-slate-300 px-2 py-1 text-sm"
                    />
                  ) : (
                    <p className="text-sm text-slate-900">{selectedUser.gender}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              {isEditMode ? (
                <>
                  <button
                    onClick={handleSave}
                    className="flex-1 rounded-lg bg-green-600 py-2.5 text-sm font-medium text-white hover:bg-green-700"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditMode(false)}
                    className="flex-1 rounded-lg bg-slate-100 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditMode(true)}
                    className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    <Edit size={16} />
                    Edit Profile
                  </button>
                  <button
                    onClick={handleDeleteSubmit}
                    className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;

