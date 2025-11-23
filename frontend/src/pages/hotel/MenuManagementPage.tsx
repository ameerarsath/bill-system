import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, X, CheckCircle, AlertCircle } from 'lucide-react';
import { mockMenu } from '../../data/mockHotelData';
import type { MenuItem } from '../../data/mockHotelData';
import { formatCurrency } from '../../utils/hotelHelpers';

interface MenuFormData {
  name: string;
  category: string;
  price: string;
  image: string;
  available: boolean;
}

// Common emoji options for food items
const emojiOptions = [
  '🍽️', '🍛', '🍚', '🍜', '🍝', '🍕', '🍔', '🍟', '🌮', '🌯',
  '🥗', '🥙', '🥪', '🍖', '🍗', '🥩', '🍱', '🍲', '🍳', '🥘',
  '🧀', '🥞', '🫓', '🥐', '🍞', '🥨', '🥯', '☕', '🍵', '🧃',
  '🥤', '🍰', '🧁', '🍮', '🍨', '🍧', '🍦', '🍩', '🍪', '🎂',
];

// Modal form component (moved outside to prevent re-creation on every render)
const MenuFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  formData,
  setFormData,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title: string;
  formData: MenuFormData;
  setFormData: (data: MenuFormData) => void;
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Item Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., Butter Chicken"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            >
              <option value="">Select Category</option>
              <option value="Starters">Starters</option>
              <option value="Main Course">Main Course</option>
              <option value="Breads">Breads</option>
              <option value="Rice">Rice</option>
              <option value="South Indian">South Indian</option>
              <option value="Chinese">Chinese</option>
              <option value="Beverages">Beverages</option>
              <option value="Desserts">Desserts</option>
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price (₹) *
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              placeholder="e.g., 250"
              min="0"
              step="10"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Emoji Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Icon
            </label>
            <div className="grid grid-cols-10 gap-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
              {emojiOptions.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setFormData({ ...formData, image: emoji })}
                  className={`text-2xl p-2 rounded-lg hover:bg-gray-100 transition-colors ${
                    formData.image === emoji
                      ? 'bg-orange-100 ring-2 ring-orange-500'
                      : ''
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Selected: <span className="text-2xl">{formData.image}</span>
            </p>
          </div>

          {/* Availability */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.available}
                onChange={(e) =>
                  setFormData({ ...formData, available: e.target.checked })
                }
                className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Item is available
              </span>
            </label>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onSubmit();
            }}
            className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
          >
            {title === 'Add New Item' ? 'Add Item' : 'Save Changes'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export const MenuManagementPage = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenu);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState<MenuFormData>({
    name: '',
    category: '',
    price: '',
    image: '🍽️',
    available: true,
  });
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'success' });

  // Show notification
  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      price: '',
      image: '🍽️',
      available: true,
    });
  };

  // Handle add item
  const handleAddClick = () => {
    resetForm();
    setShowAddModal(true);
  };

  // Handle edit item
  const handleEditClick = (item: MenuItem) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      price: item.price.toString(),
      image: item.image,
      available: item.available,
    });
    setShowEditModal(true);
  };

  // Handle delete item
  const handleDeleteClick = (item: MenuItem) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  // Toggle availability
  const handleToggleAvailability = (item: MenuItem) => {
    setMenuItems(
      menuItems.map((menuItem) =>
        menuItem.id === item.id
          ? { ...menuItem, available: !menuItem.available }
          : menuItem
      )
    );
    showNotification(
      `${item.name} marked as ${item.available ? 'unavailable' : 'available'}`,
      'success'
    );
  };

  // Add new menu item
  const handleAddSubmit = () => {
    // Validate required fields
    if (!formData.name || !formData.category || !formData.price) {
      showNotification('Please fill all required fields', 'error');
      return;
    }

    // Validate name length (minimum 3 characters)
    if (formData.name.trim().length < 3) {
      showNotification('Item name must be at least 3 characters', 'error');
      return;
    }

    // Validate price (must be greater than 0)
    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      showNotification('Please enter a valid price greater than 0', 'error');
      return;
    }

    const newItem: MenuItem = {
      id: `M${String(menuItems.length + 1).padStart(3, '0')}`,
      name: formData.name.trim(),
      category: formData.category,
      price: price,
      image: formData.image,
      available: formData.available,
    };

    setMenuItems([...menuItems, newItem]);
    showNotification(`${formData.name} added successfully`, 'success');
    setShowAddModal(false);
    resetForm();
  };

  // Update existing menu item
  const handleEditSubmit = () => {
    // Validate required fields
    if (!formData.name || !formData.category || !formData.price) {
      showNotification('Please fill all required fields', 'error');
      return;
    }

    // Validate name length (minimum 3 characters)
    if (formData.name.trim().length < 3) {
      showNotification('Item name must be at least 3 characters', 'error');
      return;
    }

    // Validate price (must be greater than 0)
    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      showNotification('Please enter a valid price greater than 0', 'error');
      return;
    }

    if (selectedItem) {
      setMenuItems(
        menuItems.map((item) =>
          item.id === selectedItem.id
            ? {
                ...item,
                name: formData.name.trim(),
                category: formData.category,
                price: price,
                image: formData.image,
                available: formData.available,
              }
            : item
        )
      );
      showNotification(`${formData.name} updated successfully`, 'success');
      setShowEditModal(false);
      setSelectedItem(null);
      resetForm();
    }
  };

  // Delete menu item
  const handleDeleteConfirm = () => {
    if (selectedItem) {
      setMenuItems(menuItems.filter((item) => item.id !== selectedItem.id));
      showNotification(`${selectedItem.name} deleted successfully`, 'success');
      setShowDeleteModal(false);
      setSelectedItem(null);
    }
  };

  return (
    <div className="space-y-6 fade-in">
      {/* Notification */}
      <AnimatePresence>
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-20 right-8 z-50 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 ${
              notification.type === 'success'
                ? 'bg-green-500 text-white'
                : 'bg-red-500 text-white'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <p className="font-medium">{notification.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showAddModal && (
          <MenuFormModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onSubmit={handleAddSubmit}
            title="Add New Item"
            formData={formData}
            setFormData={setFormData}
          />
        )}
        {showEditModal && (
          <MenuFormModal
            isOpen={showEditModal}
            onClose={() => {
              setShowEditModal(false);
              setSelectedItem(null);
              resetForm();
            }}
            onSubmit={handleEditSubmit}
            title="Edit Menu Item"
            formData={formData}
            setFormData={setFormData}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && selectedItem && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl p-6 max-w-md w-full"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Delete Menu Item
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Are you sure you want to delete this item? This action
                    cannot be undone.
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{selectedItem.image}</span>
                  <div>
                    <p className="font-bold text-gray-900">
                      {selectedItem.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedItem.category} • {formatCurrency(selectedItem.price)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedItem(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Menu Management
          </h2>
          <p className="text-gray-600 mt-1">
            Add, edit, and manage your food items
          </p>
        </div>
        <button
          onClick={handleAddClick}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Total Items</p>
          <p className="text-2xl font-bold text-gray-900">{menuItems.length}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <p className="text-sm text-green-700">Available</p>
          <p className="text-2xl font-bold text-green-600">
            {menuItems.filter((item) => item.available).length}
          </p>
        </div>
        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
          <p className="text-sm text-red-700">Unavailable</p>
          <p className="text-2xl font-bold text-red-600">
            {menuItems.filter((item) => !item.available).length}
          </p>
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item, index) => (
          <motion.div
            key={item.id}
            className={`bg-white rounded-xl p-6 shadow-sm border-2 transition-all hover:shadow-md ${
              item.available
                ? 'border-gray-100'
                : 'border-red-200 bg-red-50'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="text-4xl">{item.image}</div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditClick(item)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit Item"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteClick(item)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-1">
              {item.name}
            </h3>
            <p className="text-sm text-gray-600 mb-3">{item.category}</p>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xl font-bold text-orange-600">
                {formatCurrency(item.price)}
              </p>
              <button
                onClick={() => handleToggleAvailability(item)}
                className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                  item.available
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                }`}
                title={`Mark as ${item.available ? 'Unavailable' : 'Available'}`}
              >
                {item.available ? 'Available' : 'Unavailable'}
              </button>
            </div>
            <p className="text-xs text-gray-500">
              Click badge to toggle availability
            </p>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {menuItems.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
          <p className="text-gray-500 mb-4">No menu items yet</p>
          <button
            onClick={handleAddClick}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Your First Item
          </button>
        </div>
      )}
    </div>
  );
};
