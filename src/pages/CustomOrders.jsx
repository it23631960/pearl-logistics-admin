import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const CustomOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [enlargedImage, setEnlargedImage] = useState(null);


  useEffect(() => {
    const fetchCustomOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${backendUrl}api/admin/custom-orders`
        );
        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching custom orders:", err);
        setError("Failed to load custom orders. Please try again later.");
        setLoading(false);
      }
    };

    fetchCustomOrders();
  }, []);

  const toggleDropdown = (orderId) => {
    setOpenDropdownId(openDropdownId === orderId ? null : orderId);
  };

  const handleOrderAction = async (orderId, action) => {
    try {
   
      const response = await axios.put(
        `${backendUrl}api/admin/custom-orders/${orderId}/status`,
        {
          orderStatus: action,
        }
      );
 
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, orderStatus: action } : order
        )
      );
      setOpenDropdownId(null);
    } catch (err) {
      console.error("Error updating order status:", err);
      alert("Failed to update order status. Please try again.");
    }
  };

  const handleShowMore = (order) => {
    setSelectedOrder(order);
    setOpenDropdownId(null);
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
  };

  const showEnlargedImage = (imageUrl) => {
    setEnlargedImage(imageUrl);
  };

  const closeEnlargedImage = () => {
    setEnlargedImage(null);
  };


  const handleDeleteOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await axios.delete(
          `${backendUrl}api/admin/custom-orders/${orderId}`
        );
        
      
        setOrders((prevOrders) => 
          prevOrders.filter((order) => order.id !== orderId)
        );
        toast.success("Order Deleted Successfully .. !")
      } catch (err) {
        console.error("Error deleting order:", err);
        alert("Failed to delete order. Please try again.");
      }
    }
  };


  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const getOrderImages = (order) => {
    const images = [
      { url: order.image1Url, index: 1 },
      { url: order.image2Url, index: 2 },
      { url: order.image3Url, index: 3 },
      { url: order.image4Url, index: 4 }
    ];
    
    return images;
  };

  if (loading)
    return (
      <div className="w-full p-4 text-center">Loading custom orders...</div>
    );
  if (error)
    return <div className="w-full p-4 text-center text-red-500">{error}</div>;
  if (orders.length === 0)
    return <div className="w-full p-4 text-center">No custom orders found</div>;

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Custom Orders Management</h1>
      <div
        className={`container mx-auto p-4 ${
          selectedOrder ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        {orders.map((order) => (
          <div
            key={order.id}
            className="border rounded-lg p-4 flex items-start mb-4"
          >
            <div className="flex space-x-2 mr-4 flex-shrink-0">
              {getOrderImages(order).map((image) => (
                <div key={image.index} className="w-20 h-20">
                  {image.url ? (
                    <img
                      src={image.url}
                      alt={`Product Image ${image.index}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src="/images/parcel_icon.svg"
                      alt="Parcel Icon"
                      className="w-full h-full"
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex-grow grid grid-cols-3 gap-4">
              <div>
                <p className="text-gray-500 text-sm">Product Name</p>
                <p className="truncate max-w-full font-medium">
                  {order.productName}
                </p>
                <p className="text-gray-500 text-sm mt-2">Customer Name</p>
                <p className="truncate max-w-full">{order.customerName}</p>
                <p className="text-gray-500 text-sm mt-2">Customer Email</p>
                <p className="truncate max-w-full">{order.customerEmail}</p>
                <p className="text-gray-500 text-sm mt-2">Street</p>
                <p className="truncate max-w-full">{order.street}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">State, City</p>
                <p className="truncate max-w-full">
                  {order.state}, {order.city}
                </p>
                <p className="text-gray-500 text-sm mt-2">Zip Code, Country</p>
                <p className="truncate max-w-full">
                  {order.zipCode}, {order.country}
                </p>
                <p className="text-gray-500 text-sm mt-2">Contact Number</p>
                <p className="truncate max-w-full">{order.contactNumber}</p>
                <p className="text-gray-500 text-sm mt-2">Product Link</p>
                <p className="truncate max-w-full">
                  {order.productLink || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Product Description</p>
                <p className="truncate max-w-full">
                  {order.productDescription}
                </p>
                <p className="text-gray-500 text-sm mt-2">Method</p>
                <p className="truncate max-w-full">{order.paymentMethod}</p>
                <p className="text-gray-500 text-sm mt-2">Payment</p>
                <p className="truncate max-w-full">{order.paymentStatus}</p>
                <p className="text-gray-500 text-sm mt-2">Date</p>
                <p className="truncate max-w-full">
                  {formatDate(order.createdAt)}
                </p>
              </div>
            </div>
            <div className="relative ml-4 flex-shrink-0">
              <button
                onClick={() => toggleDropdown(order.id)}
                className="px-4 py-2 border rounded flex items-center"
              >
                {order.orderStatus}
                <svg
                  className="ml-2 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {openDropdownId === order.id && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white border rounded-md shadow-lg z-10">
                  <div
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    onClick={() => handleOrderAction(order.id, "Approve")}
                  >
                    Approve Order
                  </div>
                  <div
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    onClick={() => handleOrderAction(order.id, "Reject")}
                  >
                    Reject Order
                  </div>
                  <div
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    onClick={() => handleOrderAction(order.id, "Hold")}
                  >
                    Hold Order
                  </div>
                  <div
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    onClick={() => handleOrderAction(order.id, "Processing")}
                  >
                    Processing
                  </div>
                  <div
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    onClick={() => handleOrderAction(order.id, "Completed")}
                  >
                    Completed
                  </div>
                </div>
              )}
            </div>
            <div className="ml-2 flex space-x-2">
              <button
                onClick={() => handleShowMore(order)}
                className="px-4 py-2 bg-white text-black border rounded hover:bg-gray-100 text-sm"
              >
                Show More
              </button>
              <button
                onClick={() => handleDeleteOrder(order.id)}
                className="px-4 py-2 bg-white text-black border border-black rounded hover:bg-red-200 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      
 
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl relative">
            <button
              onClick={closeOrderDetails}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h2 className="text-2xl font-bold mb-4">Order Details</h2>
            <div className="flex justify-center space-x-4 mb-6">
              {getOrderImages(selectedOrder).map((image) => (
                <div key={image.index} className="w-20 h-20">
                  {image.url ? (
                    <img
                      src={image.url}
                      alt={`Product Image ${image.index}`}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => showEnlargedImage(image.url)}
                    />
                  ) : (
                    <img
                      src="/images/parcel_icon.svg"
                      alt="Parcel Icon"
                      className="w-full h-full"
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Product Information
                </h3>
                <p>
                  <strong>Product Name:</strong> {selectedOrder.productName}
                </p>
                <p>
                  <strong>Description:</strong>{" "}
                  {selectedOrder.productDescription}
                </p>
                <p>
                  <strong>Product Link:</strong>{" "}
                  {selectedOrder.productLink || "N/A"}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Customer Information
                </h3>
                <p>
                  <strong>Name:</strong> {selectedOrder.customerName}
                </p>
                <p>
                  <strong>Email:</strong> {selectedOrder.customerEmail}
                </p>
                <p>
                  <strong>Contact:</strong> {selectedOrder.contactNumber}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Shipping Address</h3>
                <p>
                  <strong>Street:</strong> {selectedOrder.street}
                </p>
                <p>
                  <strong>City:</strong> {selectedOrder.city}
                </p>
                <p>
                  <strong>State:</strong> {selectedOrder.state}
                </p>
                <p>
                  <strong>Zip Code:</strong> {selectedOrder.zipCode}
                </p>
                <p>
                  <strong>Country:</strong> {selectedOrder.country}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Order Details</h3>
                <p>
                  <strong>Date:</strong> {formatDate(selectedOrder.createdAt)}
                </p>
                <p>
                  <strong>Payment Method:</strong> {selectedOrder.paymentMethod}
                </p>
                <p>
                  <strong>Payment Status:</strong> {selectedOrder.paymentStatus}
                </p>
                <p>
                  <strong>Current Status:</strong> {selectedOrder.orderStatus}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      

      {enlargedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={closeEnlargedImage}
        >
          <div className="relative max-w-4xl max-h-screen p-4">
            <button
              onClick={closeEnlargedImage}
              className="absolute top-2 right-2 bg-white rounded-full p-1 text-gray-900 hover:text-gray-700 z-10"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <img
              src={enlargedImage}
              alt="Enlarged Product Image"
              className="max-h-screen max-w-full object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default CustomOrders;