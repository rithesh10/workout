import React, { useState } from "react";
import { User, Mail, Phone, Lock, Globe } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import config from "../config/config";
import AuthLayout from "../components/Auth/AuthLayout";
import AuthInput from "../components/Auth/AuthInput";
import AuthButton from "../components/Auth/AuthButton";
import AuthSelect from "../components/Auth/AuthSelect";

const Register = () => {
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState({
    code: "+91",
    flag: "IN",
  });
  const [formdata, setFormdata] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const countries = [
    { code: "+1", flag: "🇺🇸", name: "United States" },
    { code: "+44", flag: "🇬🇧", name: "United Kingdom" },
    { code: "+91", flag: "🇮🇳", name: "India" },
    { code: "+86", flag: "🇨🇳", name: "China" },
    { code: "+81", flag: "🇯🇵", name: "Japan" },
    { code: "+49", flag: "🇩🇪", name: "Germany" },
    { code: "+33", flag: "🇫🇷", name: "France" },
    { code: "+61", flag: "🇦🇺", name: "Australia" },
    { code: "+7", flag: "🇷🇺", name: "Russia" },
    { code: "+55", flag: "🇧🇷", name: "Brazil" },
  ];

  const genders = ["Male", "Female", "Other"];

  const validateForm = () => {
    const { fullName, email, password, phone, gender } = formdata;
    if (!fullName || !email || !password || !phone || !gender) {
      setError("All fields are required.");
      return false;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email format.");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${config.backendUrl}/register`,
        formdata
      );

      if (response.status === 201) {
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create an Account"
      subtitle="Already have an account?"
      linkText="Log in"
      linkTo="/login"
      linkActionText="Log in"
    >
      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        <AuthInput
          id="fullName"
          label="Full Name"
          placeholder="Enter your full name"
          value={formdata.fullName}
          onChange={(e) => setFormdata({ ...formdata, fullName: e.target.value })}
          required
          icon={User}
        />

        <AuthInput
          id="email"
          type="email"
          label="Email Address"
          placeholder="Enter your email"
          value={formdata.email}
          onChange={(e) => setFormdata({ ...formdata, email: e.target.value })}
          required
          icon={Mail}
        />

        {/* Phone Input with Country Code */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
            Phone Number
          </label>
          <div className="flex rounded-md shadow-sm">
            <div className="relative">
              <select
                className="h-full rounded-l-lg bg-gray-700 border border-r-0 border-gray-600 text-white py-3 pl-3 pr-8 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm appearance-none"
                value={selectedCountry.code}
                onChange={(e) => {
                  const country = countries.find(c => c.code === e.target.value);
                  setSelectedCountry(country);
                }}
              >
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.flag} {country.code}
                  </option>
                ))}
              </select>
            </div>
            <input
              id="phone"
              type="tel"
              className="flex-1 block w-full rounded-r-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3"
              placeholder="Phone number"
              value={formdata.phone}
              onChange={(e) => setFormdata({ ...formdata, phone: e.target.value })}
              required
            />
          </div>
        </div>

        <AuthSelect
          id="gender"
          label="Gender"
          value={formdata.gender}
          onChange={(e) => setFormdata({ ...formdata, gender: e.target.value })}
          options={genders}
          placeholder="Select Gender"
          required
        />

        <AuthInput
          id="password"
          type="password"
          label="Password"
          placeholder="Create a password"
          value={formdata.password}
          onChange={(e) => setFormdata({ ...formdata, password: e.target.value })}
          required
          icon={Lock}
        />

        {error && (
          <div className="rounded-md bg-red-500/10 p-4 border border-red-500/20">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-500">
                  Registration Failed
                </h3>
                <div className="mt-2 text-sm text-red-400">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <AuthButton type="submit" isLoading={isLoading}>
          Create Account
        </AuthButton>
      </form>
    </AuthLayout>
  );
};

export default Register;
