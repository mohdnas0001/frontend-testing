import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth-context';
import { UserCredentials } from '../../api/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Eye, EyeSlash } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';

const LoginComponent: React.FC = () => {
  const [credentials, setCredentials] = useState<UserCredentials>({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState<boolean>(false); // State to toggle password visibility
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const success = await login(credentials.username, credentials.password);

      if (success) {
        navigate('/home');
      } else {
        toast.error('Login failed. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
      console.error(error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Toggle password visibility
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 border border-gray-300 rounded-lg bg-white shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-center">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              placeholder="Username"
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4 relative">
            {' '}
            {/* Make the container relative to position the icon */}
            <input
              type={showPassword ? 'text' : 'password'} // Toggle password visibility
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
            {/* Eye icon to toggle password visibility */}
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-2 top-2 text-gray-500"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeSlash size={24} /> : <Eye size={24} />}{' '}
              {/* Show eye slash if password is visible */}
            </button>
          </div>
          <div>
            <button
              type="submit"
              className="w-full py-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none"
            >
              Login
            </button>
          </div>
        </form>
        <div className="mt-4 text-center">
          <Link to="/signup" className="text-blue-600 hover:underline">
            Already have an account? Login here.
          </Link>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default LoginComponent;
