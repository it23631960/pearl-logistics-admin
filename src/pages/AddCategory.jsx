import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const AddCategory = () => {
  const [newCategory, setNewCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${backendUrl}api/categories`, {
        withCredentials: true,
      });
      setCategories(res.data || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
      toast.error("An error occurred while fetching categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${backendUrl}api/categories`,
        { name: newCategory.trim() }, 
        { withCredentials: true }
      );
      toast.success("Category added successfully");
      setNewCategory("");
      fetchCategories();
    } catch (err) {
      console.error("Error adding category:", err);
      toast.error("An error occurred while adding category");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await axios.delete(`${backendUrl}api/categories/${categoryId}`, {
        withCredentials: true,
      });
      toast.success("Category deleted successfully");
      fetchCategories();
    } catch (err) {
      console.error("Error deleting category:", err);
      toast.error("An error occurred while deleting category");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Manage Categories</h2>
        <div className="mb-6">
          <p className="text-gray-700 mb-2">Add New Category</p>
          <div className="flex space-x-2">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter category name"
            />
            <button
              onClick={handleAddCategory}
              disabled={loading}
              className={`px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition duration-300 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Adding..." : "Add"}
            </button>
          </div>
        </div>
        <div>
          <p className="text-gray-700 mb-2">Existing Categories</p>
          {categories.length === 0 ? (
            <p className="text-gray-500">No categories found.</p>
          ) : (
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li
                  key={cat.id}
                  className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded-md"
                >
                  <span className="text-gray-800">{cat.name}</span> 
                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddCategory;