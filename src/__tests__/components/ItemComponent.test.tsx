import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { toast } from 'react-toastify';
import { createItem, updateItem, deleteItem } from '../../api/item';
import ItemList from '../../components/home/item-list';
import { useFetchItems } from '../../hooks/useItemsHooks';

// Mock useFetchItems hook
jest.mock('../../hooks/useItemsHooks.ts', () => ({
  useFetchItems: jest.fn(),
}));

// Mock createItem function
jest.mock('../../api/item', () => ({
  createItem: jest.fn(),
  deleteItem: jest.fn(),
  updateItem: jest.fn(),
}));

// Mock toast for notifications
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
  ToastContainer: () => <div />, // Mock container
}));

describe('ItemList Component', () => {
  afterEach(() => {
    jest.resetModules(); // Reset modules if needed
  });

  // renders loading state initially
  test('renders loading state initially', () => {
    (useFetchItems as jest.Mock).mockReturnValue({
      isLoading: true,
    });
    render(<ItemList />);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  // renders error message when fetch fails
  test('renders error message when fetch fails', () => {
    (useFetchItems as jest.Mock).mockReturnValue({
      isLoading: false,
      isError: true,
      error: { message: 'Error loading items' },
    });
    render(<ItemList />);
    expect(screen.getByText(/Error: Error loading items/i)).toBeInTheDocument();
  });

  // renders items correctly
  test('renders items correctly', () => {
    const mockItems = [
      {
        id: 1,
        name: 'Item 1',
        description: 'Description 1',
        createdAt: new Date().toISOString(),
      },
    ];
    (useFetchItems as jest.Mock).mockReturnValue({
      isLoading: false,
      data: mockItems,
      isError: false,
    });
    render(<ItemList />);
    expect(screen.getByText(/Item 1/i)).toBeInTheDocument();
  });

  // renders "Add new item" button
  test('renders "Add new item" button', () => {
    render(<ItemList />);
    const createButton = screen.getByText(/Add new item/i);
    expect(createButton).toBeInTheDocument();
  });

  //opens dialog on "Add new item" button click
  test('opens dialog on "Add new item" button click', () => {
    render(<ItemList />);
    const createButton = screen.getByText(/Add new item/i);
    fireEvent.click(createButton);

    expect(screen.getByText(/Create New Item/i)).toBeInTheDocument(); // Dialog opens
  });

  //creates a new item successfully
  test('creates a new item successfully', async () => {
    // Mock the hook to return an empty item list initially
    (useFetchItems as jest.Mock).mockReturnValue({
      isLoading: false,
      data: [],
      isError: false,
      refetch: jest.fn(),
    });

    // Mock createItem to resolve successfully
    (createItem as jest.Mock).mockResolvedValue({
      id: 2,
      name: 'New Item',
      description: 'New Description',
    });

    render(<ItemList />);

    // Open the dialog by clicking the "Add new item" button
    const openDialogButton = screen.getByRole('button', {
      name: /Add new item/i,
    });
    fireEvent.click(openDialogButton);

    // Ensure the dialog has opened by checking for the "Create New Item" heading
    await waitFor(() => {
      expect(screen.getByText(/Create New Item/i)).toBeInTheDocument();
    });

    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText(/Item Name/i), {
      target: { value: 'New Item' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Item Description/i), {
      target: { value: 'New Description' },
    });

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /Create/i });
    fireEvent.click(submitButton);

    // Wait for the createItem function to be called
    await waitFor(() =>
      expect(createItem).toHaveBeenCalledWith({
        name: 'New Item',
        description: 'New Description',
      }),
    );

    // Verify success toast is shown
    expect(toast.success).toHaveBeenCalledWith('Item created successfully!');
  });

  // update a new item successfully
  test('updates an item successfully', async () => {
    const mockItems = [{ id: 1, name: 'Item 1', description: 'Description 1' }];

    // Mock the hook to return a list with one item
    (useFetchItems as jest.Mock).mockReturnValue({
      isLoading: false,
      data: mockItems,
      isError: false,
      refetch: jest.fn(),
    });

    // Mock updateItem to resolve successfully
    (updateItem as jest.Mock).mockResolvedValue({
      id: 1,
      name: 'Updated Item',
      description: 'Updated Description',
    });

    render(<ItemList />);

    // Open the edit dialog for "Item 1"
    const editButton = screen.getByRole('button', { name: /Edit/i });
    fireEvent.click(editButton);

    // Ensure the dialog has opened with "Edit Item" heading
    await waitFor(() => {
      expect(screen.getByText(/Edit Item/i)).toBeInTheDocument();
    });

    // Modify the item details
    fireEvent.change(screen.getByPlaceholderText(/Item Name/i), {
      target: { value: 'Updated Item' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Item Description/i), {
      target: { value: 'Updated Description' },
    });

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /Update/i });
    fireEvent.click(submitButton);

    // Wait for updateItem to be called
    await waitFor(() =>
      expect(updateItem).toHaveBeenCalledWith(1, {
        name: 'Updated Item',
        description: 'Updated Description',
      }),
    );

    // Verify success toast is shown
    expect(toast.success).toHaveBeenCalledWith('Item updated successfully!');
  });

  // deletes an item successfully
  test('deletes an item successfully', async () => {
    const mockItems = [
      {
        id: 1,
        name: 'Item 1',
        description: 'Description 1',
        createdAt: new Date().toISOString(),
      },
    ];

    // Mock the hook to return a list with one item
    (useFetchItems as jest.Mock).mockReturnValue({
      isLoading: false,
      data: mockItems,
      isError: false,
      refetch: jest.fn(),
    });

    // Mock deleteItem to resolve successfully
    const refetchMock = jest.fn();
    (deleteItem as jest.Mock).mockResolvedValue({});
    (useFetchItems as jest.Mock).mockReturnValue({
      isLoading: false,
      data: mockItems,
      isError: false,
      refetch: refetchMock,
    });

    render(<ItemList />);

    // Find and click the delete button for "Item 1"
    const deleteButton = screen.getByRole('button', { name: /Delete/i });
    fireEvent.click(deleteButton);

    // Confirm deletion in the dialog (if applicable)
    const confirmDeleteButton = screen.getByRole('button', {
      name: /Delete/i,
    });
    fireEvent.click(confirmDeleteButton);

    // Wait for deleteItem to be called
    await waitFor(() => expect(deleteItem).toHaveBeenCalledWith(1));

    // Verify success toast is shown
    expect(toast.success).toHaveBeenCalledWith('Item deleted successfully!');
  });

  // calls openCreateDialog on create button click
  test('calls openCreateDialog on create button click', () => {
    (useFetchItems as jest.Mock).mockReturnValue({
      isLoading: false,
      data: [],
    });

    render(<ItemList />);

    // Use getByText to get the button directly
    const createButton = screen.getByRole('button', { name: /Add new item/i });

    // Ensure the button is in the document
    expect(createButton).toBeInTheDocument();

    // Simulate a click on the button
    fireEvent.click(createButton);

    // Optionally check if a dialog or modal opens after the click
    expect(screen.getByText(/Create New Item/i)).toBeInTheDocument();
  });
});
