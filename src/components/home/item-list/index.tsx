import React, { useState } from 'react';
import { useFetchItems } from '../../../hooks/useItemsHooks';
import { Item } from '../../../../types';
import { PencilSimple, Trash } from '@phosphor-icons/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createItem, deleteItem, updateItem } from '../../../api/item';
import Swal from 'sweetalert2';
import { format, isValid } from 'date-fns';

const ItemList = () => {
  const { data: items, error, isLoading, isError, refetch } = useFetchItems();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', description: '' });
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  const openCreateDialog = () => {
    setEditingItem(null);
    setNewItem({ name: '', description: '' });
    setIsDialogOpen(true);
  };

  const openEditDialog = (item: Item) => {
    setEditingItem(item);
    setNewItem({ name: item.name, description: item.description });
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setNewItem({ name: '', description: '' });
  };

  const handleSubmit = async () => {
    if (!newItem.name.trim() || !newItem.description.trim()) {
      return toast.error("Name and description can't be empty.");
    }
    try {
      if (editingItem) {
        await updateItem(editingItem.id, newItem);
        toast.success('Item updated successfully!');
      } else {
        await createItem(newItem);
        toast.success('Item created successfully!');
      }
      refetch();
      closeDialog();
    } catch (err) {
      toast.error(
        `Failed to ${editingItem ? 'update' : 'create'} item. Please try again.`,
      );
    }
  };

  const handleDelete = async (itemId: number) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this item?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await deleteItem(itemId);
        toast.success('Item deleted successfully!');
        refetch();
      } catch (err) {
        toast.error('Failed to delete item. Please try again.');
      }
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error?.message}</div>;

  return (
    <div className="p-2 md:p-6">
      <ToastContainer />
      <div className="flex flex-row w-full justify-between items-center border-b border-gray-300 mb-3 md:mb-6">
        <h1 className="text-xl md:text-2xl font-bold mb-3 md:mb-6 text-center">
          {' '}
          My Items List
        </h1>

        <div className="flex justify-center mb-3 md:mb-6">
          <button
            onClick={openCreateDialog}
            className="p-1 md:p-2 md:px-4 text-base bg-green-500 text-white rounded-md shadow-lg hover:bg-green-600 transition duration-200"
          >
            Add new item
          </button>
        </div>
      </div>

      {items?.length === 0 ? (
        <div className="text-center text-gray-500 mt-4">
          <p>No items found. Click "Add new item" to add a new item.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          {items?.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg p-2 md:p-6 relative border-2  border-gray-100 hover:border-blue-500 hover:shadow-xl transform hover:scale-105 transition-transform duration-300"
            >
              <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
              <p className="text-gray-700 mb-4 h-24 overflow-hidden text-ellipsis">
                {item.description}
              </p>

              <p className="text-sm text-gray-500">
                Created:{' '}
                {item.createdAt && isValid(new Date(item.createdAt))
                  ? format(new Date(item.createdAt), 'PPpp')
                  : 'Unknown'}
              </p>
              {item.updatedAt &&
                item.updatedAt !== item.createdAt &&
                isValid(new Date(item.updatedAt)) && (
                  <p className="text-sm text-gray-500">
                    Last Updated: {format(new Date(item.updatedAt), 'PPpp')}
                  </p>
                )}

              <div className="absolute top-0 right-0 md:top-3  mdright-3 flex space-x-1 md:space-x-2">
                <button
                  onClick={() => openEditDialog(item)}
                  className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-100 rounded-full transition duration-200"
                  aria-label="Edit"
                >
                  <PencilSimple size={24} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition duration-200"
                  aria-label="Delete"
                >
                  <Trash size={24} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-3 md:p-6 rounded-lg shadow-lg w-80 md:w-[28rem]">
            <h2 className="text-xl md:text-2xl font-semibold mb-4">
              {editingItem ? 'Edit Item' : 'Create New Item'}
            </h2>
            <input
              type="text"
              placeholder="Item Name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <textarea
              placeholder="Item Description"
              value={newItem.description}
              onChange={(e) =>
                setNewItem({ ...newItem, description: e.target.value })
              }
              className="w-full p-2 border border-gray-300 h-44 rounded mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={closeDialog}
                className="p-2 px-4 bg-gray-300 text-black rounded-md hover:bg-gray-400 transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="p-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
              >
                {editingItem ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemList;
