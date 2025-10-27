import React, { useState } from 'react';
import Layout from '../components/Layout';

const RegistrationPage = () => {
  const [formData, setFormData] = useState({ usernameOrEmail: '', password: '', confirmPassword: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    alert("Registration successful!");
  };

  return (
    <Layout>
      <div className="flex justify-center items-center w-full min-h-[70vh]">
        <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl bg-white p-10 rounded-2xl shadow-2xl border border-gray-100">
          <h2 className="text-3xl font-bold text-center text-green-700 mb-6">Create Account</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="usernameOrEmail" className="block text-gray-700 font-medium mb-1">
                Email or Username
              </label>
              <input
                type="text"
                name="usernameOrEmail"
                id="usernameOrEmail"
                value={formData.usernameOrEmail}
                onChange={handleChange}
                placeholder="Enter your desired email or username"
                className="w-full px-5 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm transition duration-200"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                className="w-full px-5 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm transition duration-200"
                required
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                className="w-full px-5 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm transition duration-200"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white font-semibold py-3 rounded-2xl hover:bg-green-700 transition duration-200 shadow-md"
            >
              Register
            </button>
          </form>
          <p className="text-center text-sm mt-6 text-gray-600">
            Already have an account? <a href="/login" className="text-green-600 hover:underline font-medium">Sign in here</a>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default RegistrationPage;
