// useItemsHooks.ts
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Item } from '../../types';
import { fetchItems } from '../api/item';

// Hook to fetch items
export const useFetchItems = () => {
  return useQuery<Item[], AxiosError>({
    queryKey: ['items'],
    queryFn: fetchItems,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
