import { Item } from '../../../types';
import apiClient from '../apiClient';

// Fetch items
export const fetchItems = async (): Promise<Item[]> => {
  const response = await apiClient.get<Item[]>('/items?join=user');
  return response.data;
};

// Create a new item
export const createItem = async (
  newItem: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<Item> => {
  const response = await apiClient.post<Item>('/items', newItem);
  return response.data;
};

// Update an existing item
export const updateItem = async (
  id: number,
  data: Partial<Item>,
): Promise<Item> => {
  const response = await apiClient.patch<Item>(`/items/${id}`, data);
  console.log(response.data);
  return response.data;
};

// Delete an item
export const deleteItem = async (id: number): Promise<void> => {
  await apiClient.delete(`/items/${id}`);
};
