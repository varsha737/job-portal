import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UpdateProfile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    // Add more fields as needed
  });

  const [loading, setLoading] = useState(true);

  const getProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/v1/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data.user);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put("/api/v1/user/update-profile", profile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Error updating profile");
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Update Profile</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>
          <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded">
            Update Profile
          </button>
        </form>
      )}
    </div>
  );
};

export default UpdateProfile;
