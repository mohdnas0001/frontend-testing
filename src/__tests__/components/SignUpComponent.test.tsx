import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { ToastContainer } from 'react-toastify';
import { MemoryRouter } from 'react-router-dom';
import { signup } from '../../api/auth';
import SignUpComponent from '../../components/signup';
import '@testing-library/jest-dom';

jest.mock('../../api/auth', () => ({
  signup: jest.fn(),
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


describe('SignUpComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the signup form fields and submit button', () => {
    render(
      <MemoryRouter>
        <SignUpComponent />
        <ToastContainer />
      </MemoryRouter>,
    );

    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /register/i }),
    ).toBeInTheDocument();
  });

test('displays error toast on password mismatch', async () => {
  render(
    <MemoryRouter>
      <SignUpComponent />
      <ToastContainer />
    </MemoryRouter>
  );

  fireEvent.change(screen.getByPlaceholderText('Username'), {
    target: { value: 'testuser' },
  });
  fireEvent.change(screen.getByPlaceholderText('Password'), {
    target: { value: 'password123' },
  });
  fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
    target: { value: 'passafds' },
  });

  fireEvent.click(screen.getByRole('button', { name: /register/i }));

  await waitFor(() => {
    expect(require('react-toastify').toast.error).toHaveBeenCalledWith(
      'Passwords do not match. Please try again.'
    );
  });
});

test('calls signup function and navigates on successful signup', async () => {
  // Mock the signup function to resolve as a successful signup
  (signup as jest.Mock).mockResolvedValue(true);

  render(
    <MemoryRouter>
      <SignUpComponent />
      <ToastContainer />
    </MemoryRouter>,
  );

  // Fill out the form fields
  fireEvent.change(screen.getByPlaceholderText('Username'), {
    target: { value: 'testuser' },
  });
  fireEvent.change(screen.getByPlaceholderText('Password'), {
    target: { value: 'password123' },
  });
  fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
    target: { value: 'password123' },
  });

  // Click the register button
  fireEvent.click(screen.getByRole('button', { name: /register/i }));

  // Check that signup is called with the correct arguments
  await waitFor(() =>
    expect(signup).toHaveBeenCalledWith({
      username: 'testuser',
      password: 'password123',
    }),
  );

  // Verify navigation to "/login" after signup
  await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/login'));
});

  test('toggles password visibility', () => {
    render(
      <MemoryRouter>
        <SignUpComponent />
        <ToastContainer />
      </MemoryRouter>,
    );

    const passwordInput = screen.getByPlaceholderText('Password');
    const togglePasswordButton = screen.getByLabelText(
      'Toggle password visibility',
    );

    expect(passwordInput).toHaveAttribute('type', 'password');
    fireEvent.click(togglePasswordButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    fireEvent.click(togglePasswordButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('toggles confirm password visibility', () => {
    render(
      <MemoryRouter>
        <SignUpComponent />
        <ToastContainer />
      </MemoryRouter>,
    );

    const confirmPasswordInput =
      screen.getByPlaceholderText('Confirm Password');
    const toggleConfirmPasswordButton = screen.getByRole('button', {
      name: /confirm toggle password visibility/i,
    });

    // Initially, confirm password input should be of type 'password'
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');

    // Click to show password
    fireEvent.click(toggleConfirmPasswordButton);
    expect(confirmPasswordInput).toHaveAttribute('type', 'text');

    // Click again to hide password
    fireEvent.click(toggleConfirmPasswordButton);
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');
  });
});
