import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [originalProducts, setOriginalProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${backendUrl}api/items/get-items`);

        const processedProducts = response.data.map(product => ({
          ...product,
          image1: product.image1 ? `data:image/png;base64,${product.image1}` : '/images/product.png'
        }));
        setProducts(processedProducts);
        setOriginalProducts(processedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    if (value === '') {
      setProducts(originalProducts);
    } else {
      const filteredProducts = originalProducts.filter(product =>
        product.name.toLowerCase().includes(value) ||
        product.category.toLowerCase().includes(value)
      );
      setProducts(filteredProducts);
    }
  };

  const handleRemoveProduct = async (itemId) => {
    try {
      const res = await axios.delete(`${backendUrl}api/items/delete/${itemId}`);
      if (res.data && res.data.status === "success") {
        toast.success(res.data.message || "Product deleted successfully");
        const response = await axios.get(`${backendUrl}api/items/get-items`);
        const processedProducts = response.data.map(product => ({
          ...product,
          image1: product.image1 ? `data:image/png;base64,${product.image1}` : '/images/product.png'
        }));
        setProducts(processedProducts);
        setOriginalProducts(processedProducts);
      } else {
        toast.error(res.data.message || "Failed to delete product");
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error(error.response?.data?.message || "An error occurred while deleting the product");
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-end mb-4 relative w-full px-4">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search Item"
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <div className="w-full px-4  ">
        <div className="flex items-center mb-3 gap-2">
          <h1 className='text-xl text-[#6D6D6D]'>All Products</h1>
          <h1 className='text-xl'>List</h1>
        </div>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Image</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Category</th>
                <th className="px-4 py-2 text-right">Price</th>
                <th className="px-4 py-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-50 ">
                  <td className="px-4 py-2">{product.itemId}</td>
                  <td className="px-4 py-2">
                    <img
                      src={product.image1}
                      alt={product.name}
                      className="w-12 h-12 object-contain"
                    />
                  </td>
                  <td className="px-4 py-2">{product.name}</td>
                  <td className="px-4 py-2">{product.category}</td>
                  <td className="px-4 py-2 text-right">${product.price}</td>
                  <td className="px-4 py-2 text-right">
                    <button
                      onClick={() => handleRemoveProduct(product.itemId)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 cursor-pointer"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductList;