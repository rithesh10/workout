import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Mail, Lock } from 'lucide-react';
import config from '../config/config';
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../AuthContext';
import AuthLayout from '../components/Auth/AuthLayout';
import AuthInput from '../components/Auth/AuthInput';
import AuthButton from '../components/Auth/AuthButton';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setAccessToken, setUser } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      setError('');
      const response = await axios.post(`${config.backendUrl}/login`, { email, password });

      if (response.status === 200) {
        localStorage.setItem('accessToken', response.data.data.accessToken);
        localStorage.setItem('refreshToken', response.data.data.refreshToken);
        localStorage.setItem('userData', JSON.stringify(response.data.data.user));

        if (response.data.data.user.role === "user") {
          navigate("/dash");
        } else if (response.data.data.user.role === "admin") {
          navigate('/admin/dashboard');
        }
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Welcome Back" 
      subtitle="Don't have an account?"
      linkText="Sign up"
      linkTo="/register"
      linkActionText="Sign up"
    >
      <form className="mt-8 space-y-6" onSubmit={handleLogin}>
        <div className="space-y-4">
          <AuthInput
            id="email"
            type="email"
            label="Email Address"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            icon={Mail}
          />
          
          <AuthInput
            id="password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            icon={Lock}
          />
        </div>

        {error && (
          <div className="rounded-md bg-red-500/10 p-4 border border-red-500/20">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-500">
                  Login Failed
                </h3>
                <div className="mt-2 text-sm text-red-400">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-end">
          <div className="text-sm">
            <a href="/forget-password" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
              Forgot your password?
            </a>
          </div>
        </div>

        <AuthButton type="submit" isLoading={isLoading}>
          Sign in
        </AuthButton>
      </form>
    </AuthLayout>
  );
};

export default Login;
