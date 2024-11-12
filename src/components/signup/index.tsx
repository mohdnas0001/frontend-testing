import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../../api/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Eye, EyeSlash } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import { UserCredentials } from 'types';

const SignUpComponent: React.FC = () => {
  const [credentials, setCredentials] = useState<UserCredentials>({
    username: '',
    password: '',
  });
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false); // New state for loading
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'password' || name === 'username') {
      setCredentials({
        ...credentials,
        [name]: value,
      });
    } else {
      setConfirmPassword(value);
    }
  };
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

   if (credentials.password !== confirmPassword) {
      toast.error('Passwords do not match. Please try again.');
      setIsLoading(false);
      return;
    }

  try {
    // Attempt signup; if successful, navigate to login page
    await signup(credentials); // Call the signup API
    navigate('/login');
  } catch (error: any) {
    console.error('Error details:', error); // Log full error details

    // Check if error contains a response (common with Axios errors)
    if (error.response) {
      // Display specific error messages based on status codes
      switch (error.response.status) {
        case 400:
          toast.error('Username already exists.');
          break;
        case 500:
          toast.error('Server error. Please try again later.');
          break;
        default:
          toast.error('An unexpected error occurred. Please try again.');
      }
    } else {
      // Handle cases where response data is unavailable (network or other issues)
      toast.error('Network error. Please check your connection.');
    }
  } finally {
    setIsLoading(false); // Reset loading state after the request completes
  }
};


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 border border-gray-300 rounded-lg bg-white shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-center">Sign Up</h1>
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
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-2 top-2 text-gray-500"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeSlash size={24} /> : <Eye size={24} />}
            </button>
          </div>
          <div className="mb-4 relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="absolute right-2 top-2 text-gray-500"
              aria-label="Confirm Toggle password visibility"
            >
              {showConfirmPassword ? <EyeSlash size={24} /> : <Eye size={24} />}
            </button>
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading} // Disable the button while loading
              className={`w-full py-2 text-white ${isLoading ? 'bg-gray-500' : 'bg-blue-600'} rounded hover:bg-blue-700 focus:outline-none`}
            >
              {isLoading ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>
        <div className="mt-4 text-center">
          <Link to="/login" className="text-blue-600 hover:underline">
            Already have an account? Login here.
          </Link>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SignUpComponent;
