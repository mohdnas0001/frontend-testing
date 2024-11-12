import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useAuth } from '../../context/auth-context';
import { MemoryRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import LoginComponent from '../../components/login';

jest.mock('../../context/auth-context', () => ({
  useAuth: jest.fn(),
}));

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('react-toastify', () => {
  const originalModule = jest.requireActual('react-toastify');
  return {
    ...originalModule,
    toast: {
      error: jest.fn(),
      success: jest.fn(),
    },
  };
});

describe('LoginComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form fields and submit button', () => {
    (useAuth as jest.Mock).mockReturnValue({ login: jest.fn() });

    render(
      <MemoryRouter>
        <LoginComponent />
        <ToastContainer />
      </MemoryRouter>,
    );

    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('updates input fields correctly', () => {
    (useAuth as jest.Mock).mockReturnValue({ login: jest.fn() });

    render(
      <MemoryRouter>
        <LoginComponent />
      </MemoryRouter>,
    );

    const usernameInput = screen.getByPlaceholderText('Username');
    const passwordInput = screen.getByPlaceholderText('Password');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(usernameInput).toHaveValue('testuser');
    expect(passwordInput).toHaveValue('password123');
  });

  test('toggles password visibility', () => {
    (useAuth as jest.Mock).mockReturnValue({ login: jest.fn() });

    render(
      <MemoryRouter>
        <LoginComponent />
      </MemoryRouter>,
    );

    const passwordInput = screen.getByPlaceholderText('Password');
    const toggleButton = screen.getByRole('button', {
      name: /toggle password visibility/i,
    });

    // Initial type should be password
    expect(passwordInput).toHaveAttribute('type', 'password');

    // Click to show password
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');

    // Click to hide password
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('calls login function and navigates on successful login', async () => {
    const loginMock = jest.fn().mockResolvedValue(true);
    (useAuth as jest.Mock).mockReturnValue({ login: loginMock });

    render(
      <MemoryRouter>
        <LoginComponent />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText('Username'), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() =>
      expect(loginMock).toHaveBeenCalledWith('testuser', 'password123'),
    );
    expect(mockNavigate).toHaveBeenCalledWith('/home');
  });

  test('displays error toast on failed login', async () => {
    const loginMock = jest.fn().mockResolvedValue(false);
    (useAuth as jest.Mock).mockReturnValue({ login: loginMock });

    render(
      <MemoryRouter>
        <LoginComponent />
        <ToastContainer />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText('Username'), {
      target: { value: 'wronguser' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'wrongpassword' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() =>
      expect(loginMock).toHaveBeenCalledWith('wronguser', 'wrongpassword'),
    );

    expect(require('react-toastify').toast.error).toHaveBeenCalledWith(
      'Login failed. Please try again.'
    );
  });

  test('displays error toast on login error', async () => {
    const loginMock = jest.fn().mockRejectedValue(new Error('Network Error'));
    (useAuth as jest.Mock).mockReturnValue({ login: loginMock });

    render(
      <MemoryRouter>
        <LoginComponent />
        <ToastContainer />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText('Username'), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() =>
      expect(loginMock).toHaveBeenCalledWith('testuser', 'password123'),
    );

    expect(require('react-toastify').toast.error).toHaveBeenCalledWith(
      'An error occurred. Please try again.'
    );
  });
});
