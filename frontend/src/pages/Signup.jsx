import { useState } from 'react';
import { Mail, Lock, Loader2, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';
import { useNavigate } from 'react-router-dom';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // const navigate = useNavigate();
  const { signup, loading } = useUserStore();

  const handleSignup = async (e) => {
    e.preventDefault();
    signup(formData);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-md">
        <div className="mb-4 flex justify-center">
          {/* Logo Placeholder */}
          <div className="h-12 w-32 rounded-md bg-gray-200"></div>
        </div>
        <h2 className="mb-6 text-center text-2xl font-semibold">Sign Up</h2>
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <User size={16} />
              </span>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((formData) => ({
                    ...formData,
                    name: e.target.value,
                  }))
                }
                placeholder="Your name"
                className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Mail size={16} />
              </span>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((formData) => ({
                    ...formData,
                    email: e.target.value,
                  }))
                }
                placeholder="you@example.com"
                className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
          <div></div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Lock size={16} />
              </span>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData((formData) => ({
                    ...formData,
                    password: e.target.value,
                  }))
                }
                placeholder="••••••••"
                className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Lock size={16} />
              </span>
              <input
                type="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData((formData) => ({
                    ...formData,
                    confirmPassword: e.target.value,
                  }))
                }
                placeholder="••••••••"
                className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
            disabled={loading}
          >
            {loading && <Loader2 className="animate-spin" size={18} />}
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/" className="text-blue-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
