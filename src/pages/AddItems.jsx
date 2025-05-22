import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const AddItems = () => {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [bestseller, setBestSeller] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${backendUrl}api/categories`);
        setCategories(res.data);
      } catch (err) {
        toast.error("Failed to fetch categories");
      }
    };
    fetchCategories();
  }, []);

  const handleImageChange = (e, setImageFunction) => {
    const file = e.target.files[0];
    if (file) {
      setImageFunction(file);
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!name || !price || !quantity) {
      toast.error("Name, price and quantity are required");
      return;
    }
    setLoading(true);
    try {
      const itemData = {
        name,
        description,
        price: parseFloat(price),
        category,
        quantity: parseInt(quantity),
        bestseller,
      };
      const formData = new FormData();
      formData.append("item", JSON.stringify(itemData));
      if (image1) formData.append("image1", image1);
      if (image2) formData.append("image2", image2);
      if (image3) formData.append("image3", image3);
      if (image4) formData.append("image4", image4);
      const response = await axios.post(
        `${backendUrl}api/items/add-item`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        toast.success("Product Added Successfully");
        setName("");
        setDescription("");
        setImage1(null);
        setImage2(null);
        setImage3(null);
        setImage4(null);
        setPrice("");
        setCategory("");
        setQuantity("");
        setBestSeller(false);
      } else {
        toast.error(response.data.message || "Error in Product Adding");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      if (error.response) {
        if (error.response.status === 403) {
          toast.error(
            "Access denied. You might need to login or don't have permission."
          );
        } else {
          toast.error(
            error.response.data?.message ||
              `Error (${error.response.status}): ${error.message}`
          );
        }
      } else if (error.request) {
        toast.error("No response from server. Please check if the server is running.");
      } else {
        toast.error(error.message || "An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const renderImagePreview = (imageFile, index) => {
    return (
      <label
        key={index}
        htmlFor={`image${index}`}
        className="w-24 h-24 border-2 border-gray-300 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 overflow-hidden"
      >
        <img
          className="w-full h-full object-cover rounded-lg"
          src={!imageFile ? assets.upload_area : URL.createObjectURL(imageFile)}
          alt={`Upload ${index}`}
        />
        <input
          onChange={(e) => handleImageChange(e, eval(`setImage${index}`))}
          type="file"
          id={`image${index}`}
          accept="image/*"
          hidden
        />
      </label>
    );
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-4xl mx-0 bg-white rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Add New Product</h2>
          <button
            className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-500"
            onClick={() => navigate("/add-categories")}
          >
            Category Management
          </button>
        </div>

        <div className="mb-4">
          <p className="text-gray-700 mb-2">Upload Images (up to 4)</p>
          <div className="flex space-x-2">
            {renderImagePreview(image1, 1)}
            {renderImagePreview(image2, 2)}
            {renderImagePreview(image3, 3)}
            {renderImagePreview(image4, 4)}
          </div>
        </div>

        <div className="mb-4">
          <p className="text-gray-700 mb-2">Product Name *</p>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            placeholder="Add Name Here"
            required
          />
        </div>

        <div className="mb-4">
          <p className="text-gray-700 mb-2">Product Description</p>
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            placeholder="Add Description Here"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-gray-700 mb-2">Product Category</p>
            <select
              onChange={(e) => setCategory(e.target.value)}
              value={category}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <p className="text-gray-700 mb-2">Product Quantity *</p>
            <input
              onChange={(e) => setQuantity(e.target.value)}
              value={quantity}
              type="number"
              placeholder="Add Quantity Here"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <p className="text-gray-700 mb-2">Product Price *</p>
            <input
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="number"
              placeholder="Add Price Here"
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="flex items-center space-x-2">
            <input
              checked={bestseller}
              onChange={() => setBestSeller((prev) => !prev)}
              type="checkbox"
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="text-gray-700">Add to Best Seller</span>
          </label>
        </div>

        <button
          type="submit"
          className={`w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition duration-300 ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
          onClick={onSubmitHandler}
          disabled={loading}
        >
          {loading ? "ADDING ITEM..." : "ADD ITEM"}
        </button>
      </div>
    </div>
  );
};

export default AddItems;
