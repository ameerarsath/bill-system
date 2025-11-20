import React, { useState, useEffect } from 'react';
import { menuApi } from '../api/menu';
import { tablesApi } from '../api/tables';
import type { MenuItem, Category, RestaurantTable, CreateMenuItemRequest, CreateCategoryRequest, CreateTableRequest } from '../types/index';
import { formatCurrency } from '../utils/format';
import { Settings, Plus, Edit, Trash2, Save, X, ChefHat, Grid3x3, Table } from 'lucide-react';

type TabType = 'menu' | 'categories' | 'tables';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('menu');

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 flex items-center space-x-3">
        <Settings className="w-8 h-8 text-primary-600" />
        <span>Admin Dashboard</span>
      </h1>

      {/* Tab Navigation */}
      <div className="mb-6 flex space-x-2">
        <button
          onClick={() => setActiveTab('menu')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === 'menu'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <ChefHat className="w-5 h-5 inline mr-2" />
          Menu Items
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === 'categories'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <Grid3x3 className="w-5 h-5 inline mr-2" />
          Categories
        </button>
        <button
          onClick={() => setActiveTab('tables')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === 'tables'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <Table className="w-5 h-5 inline mr-2" />
          Tables
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'menu' && <MenuItemsTab />}
      {activeTab === 'categories' && <CategoriesTab />}
      {activeTab === 'tables' && <TablesTab />}
    </div>
  );
};

// ============================================================================
// MENU ITEMS TAB
// ============================================================================

const MenuItemsTab: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isVeg, setIsVeg] = useState(true);
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [items, cats] = await Promise.all([
        menuApi.getAllMenuItems(),
        menuApi.getAllCategories(),
      ]);
      setMenuItems(items);
      setCategories(cats);
    } catch (error: any) {
      alert('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const openCreateForm = () => {
    setEditingItem(null);
    setName('');
    setDescription('');
    setPrice('');
    setCategoryId(categories.length > 0 ? categories[0].id.toString() : '');
    setIsVeg(true);
    setAvailable(true);
    setShowForm(true);
  };

  const openEditForm = (item: MenuItem) => {
    setEditingItem(item);
    setName(item.name);
    setDescription(item.description || '');
    setPrice(item.price.toString());
    setCategoryId(item.categoryId.toString());
    setIsVeg(item.isVeg);
    setAvailable(item.available);
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!name || !price || !categoryId) {
      alert('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const data: CreateMenuItemRequest = {
        name,
        description: description || undefined,
        price: parseFloat(price),
        categoryId: parseInt(categoryId),
        isVeg,
        available,
      };

      if (editingItem) {
        await menuApi.updateMenuItem(editingItem.id, data);
      } else {
        await menuApi.createMenuItem(data);
      }

      await loadData();
      setShowForm(false);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to save menu item');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return;

    setLoading(true);
    try {
      await menuApi.deleteMenuItem(id);
      await loadData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete menu item');
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async (item: MenuItem) => {
    setLoading(true);
    try {
      await menuApi.updateMenuItem(item.id, {
        name: item.name,
        description: item.description,
        price: item.price,
        categoryId: item.categoryId,
        isVeg: item.isVeg,
        available: !item.available,
      });
      await loadData();
    } catch (error: any) {
      alert('Failed to update availability');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Menu Items ({menuItems.length})</h2>
        <button onClick={openCreateForm} className="btn btn-primary flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Add Menu Item</span>
        </button>
      </div>

      {/* Menu Items Table */}
      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Category</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Price</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Type</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-4 py-3 text-right text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {menuItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  No menu items found
                </td>
              </tr>
            ) : (
              menuItems.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      {item.description && (
                        <p className="text-xs text-gray-600">{item.description}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">{item.categoryName}</td>
                  <td className="px-4 py-3 font-semibold">{formatCurrency(item.price)}</td>
                  <td className="px-4 py-3">
                    {item.isVeg ? (
                      <span className="text-green-600 text-sm">● VEG</span>
                    ) : (
                      <span className="text-red-600 text-sm">● NON-VEG</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleAvailability(item)}
                      disabled={loading}
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        item.available
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {item.available ? 'Available' : 'Unavailable'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => openEditForm(item)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                {editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
              </h3>
              <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="label">Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input"
                  placeholder="Enter item name"
                />
              </div>

              <div>
                <label className="label">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input"
                  rows={2}
                  placeholder="Enter description"
                />
              </div>

              <div>
                <label className="label">Price *</label>
                <input
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="input"
                  placeholder="Enter price"
                />
              </div>

              <div>
                <label className="label">Category *</label>
                <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="input">
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={isVeg}
                    onChange={(e) => setIsVeg(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Vegetarian</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={available}
                    onChange={(e) => setAvailable(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Available</span>
                </label>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 btn btn-primary flex items-center justify-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingItem ? 'Update' : 'Create'}</span>
                </button>
                <button onClick={() => setShowForm(false)} className="btn bg-gray-200 text-gray-700">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// CATEGORIES TAB
// ============================================================================

const CategoriesTab: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await menuApi.getAllCategories();
      setCategories(data);
    } catch (error: any) {
      alert('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const openCreateForm = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setShowForm(true);
  };

  const openEditForm = (category: Category) => {
    setEditingCategory(category);
    setName(category.name);
    setDescription(category.description || '');
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!name) {
      alert('Please enter a category name');
      return;
    }

    setLoading(true);
    try {
      const data: CreateCategoryRequest = {
        name,
        description: description || undefined,
      };

      if (editingCategory) {
        await menuApi.updateCategory(editingCategory.id, data);
      } else {
        await menuApi.createCategory(data);
      }

      await loadCategories();
      setShowForm(false);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category? All associated menu items will be affected.')) return;

    setLoading(true);
    try {
      await menuApi.deleteCategory(id);
      await loadCategories();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Categories ({categories.length})</h2>
        <button onClick={openCreateForm} className="btn btn-primary flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.length === 0 ? (
          <div className="col-span-full card text-center py-8 text-gray-500">
            No categories found
          </div>
        ) : (
          categories.map((category) => (
            <div key={category.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold">{category.name}</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => openEditForm(category)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {category.description && (
                <p className="text-sm text-gray-600">{category.description}</p>
              )}
            </div>
          ))
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </h3>
              <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="label">Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input"
                  placeholder="Enter category name"
                />
              </div>

              <div>
                <label className="label">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input"
                  rows={3}
                  placeholder="Enter description"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 btn btn-primary flex items-center justify-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingCategory ? 'Update' : 'Create'}</span>
                </button>
                <button onClick={() => setShowForm(false)} className="btn bg-gray-200 text-gray-700">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// TABLES TAB
// ============================================================================

const TablesTab: React.FC = () => {
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingTable, setEditingTable] = useState<RestaurantTable | null>(null);

  // Form state
  const [tableNumber, setTableNumber] = useState('');
  const [capacity, setCapacity] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    loadTables();
  }, []);

  const loadTables = async () => {
    setLoading(true);
    try {
      const data = await tablesApi.getAllTables();
      setTables(data);
    } catch (error: any) {
      alert('Failed to load tables');
    } finally {
      setLoading(false);
    }
  };

  const openCreateForm = () => {
    setEditingTable(null);
    setTableNumber('');
    setCapacity('');
    setLocation('');
    setShowForm(true);
  };

  const openEditForm = (table: RestaurantTable) => {
    setEditingTable(table);
    setTableNumber(table.tableNumber);
    setCapacity(table.capacity.toString());
    setLocation(table.location || '');
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!tableNumber || !capacity) {
      alert('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const data: CreateTableRequest = {
        tableNumber,
        capacity: parseInt(capacity),
        location: location || undefined,
      };

      if (editingTable) {
        await tablesApi.updateTable(editingTable.id, data);
      } else {
        await tablesApi.createTable(data);
      }

      await loadTables();
      setShowForm(false);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to save table');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this table?')) return;

    setLoading(true);
    try {
      await tablesApi.deleteTable(id);
      await loadTables();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete table');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Tables ({tables.length})</h2>
        <button onClick={openCreateForm} className="btn btn-primary flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Add Table</span>
        </button>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {tables.length === 0 ? (
          <div className="col-span-full card text-center py-8 text-gray-500">
            No tables found
          </div>
        ) : (
          tables.map((table) => (
            <div
              key={table.id}
              className={`card hover:shadow-lg transition-shadow ${
                table.status === 'FREE' ? 'border-green-300' : 'border-red-300'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-bold">{table.tableNumber}</h3>
                  <p className="text-sm text-gray-600">Capacity: {table.capacity}</p>
                  {table.location && (
                    <p className="text-xs text-gray-500">{table.location}</p>
                  )}
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    table.status === 'FREE'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {table.status}
                </span>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={() => openEditForm(table)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(table.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                {editingTable ? 'Edit Table' : 'Add Table'}
              </h3>
              <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="label">Table Number *</label>
                <input
                  type="text"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="input"
                  placeholder="e.g., Table 1, T-01"
                />
              </div>

              <div>
                <label className="label">Capacity *</label>
                <input
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  className="input"
                  placeholder="Number of seats"
                />
              </div>

              <div>
                <label className="label">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="input"
                  placeholder="e.g., Main Hall, Garden"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 btn btn-primary flex items-center justify-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingTable ? 'Update' : 'Create'}</span>
                </button>
                <button onClick={() => setShowForm(false)} className="btn bg-gray-200 text-gray-700">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
