import { useState, useEffect } from 'react';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${backendUrl}api/orders`);
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data = await response.json();
      setOrders(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, orderStatus) => {
    try {
      const response = await fetch(`${backendUrl}api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderStatus }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update order status');
      }
      
    
      fetchOrders();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleViewMore = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const OrderDetailModal = ({ order, onClose }) => {
   
    const formatDate = (dateArray) => {
      if (!dateArray || dateArray.length < 3) return "N/A";
      return new Date(dateArray[0], dateArray[1] - 1, dateArray[2]).toLocaleDateString();
    };

   
    const user = order.user || {};

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full max-h-screen overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Order Details</h2>
            <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="font-semibold mb-2">Customer Information</h3>
              <p>{user.firstName} {user.lastName}</p>
              <p>{user.email}</p>
              <p>{user.street}</p>
              <p>{user.city}, {user.state}</p>
              <p>{user.zipcode}, {user.country}</p>
              <p>Contact: {user.contactNo}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Order Information</h3>
              <p>Order ID: #{order.id}</p>
              <p>Date: {formatDate(order.createdAt)}</p>
              <p>Status: {order.orderStatus}</p>
              <p>Payment Method: {order.paymentMethod}</p>
              <p>Payment Status: {order.paymentStatus}</p>
              <p>Total Amount: ${parseFloat(order.totalAmount).toFixed(2)}</p>
            </div>
          </div>
          <h3 className="font-semibold mb-2">Order Items</h3>
          <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {order.items.map((orderItem) => (
                  <tr key={orderItem.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="font-medium">{orderItem.item?.name || orderItem.itemName}</p>
                        <p className="text-sm text-gray-500 truncate max-w-xs">
                          {orderItem.item?.description || 'No description available'}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{orderItem.item?.category || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${parseFloat(orderItem.price).toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{orderItem.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${parseFloat(orderItem.totalPrice).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 text-right">
            <p className="font-semibold">Items Total: ${parseFloat(order.itemsTotal).toFixed(2)}</p>
            <p className="font-semibold">Shipping Charges: ${parseFloat(order.shippingCharges).toFixed(2)}</p>
            <p className="font-semibold">Other Charges: ${parseFloat(order.otherCharges).toFixed(2)}</p>
            <p className="font-bold text-lg">Total Amount: ${parseFloat(order.totalAmount).toFixed(2)}</p>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-2"
            >
              Close
            </button>
            <button
              onClick={() => {
                updateOrderStatus(order.id, 'SHIPPED');
                onClose();
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Mark as Shipped
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading orders...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">Error: {error}</div>;
  }
  

  const formatDate = (dateArray) => {
    if (!dateArray || dateArray.length < 3) return "N/A";
    return new Date(dateArray[0], dateArray[1] - 1, dateArray[2]).toLocaleDateString();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">All Orders List</h1>
      
      {orders.length === 0 ? (
        <p className="text-center py-8">No orders found</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
   
            const user = order.user || {};
            return (
              <div 
                key={order.id} 
                className={`border rounded-lg overflow-hidden ${
                  order.orderStatus === 'SHIPPED' ? 'border-green-500' : 
                  order.orderStatus === 'PENDING' ? 'border-yellow-500' : 'border-gray-300'
                }`}
              >
                <div className="grid grid-cols-4 gap-4 p-4">
                  <div className="flex items-center">
                    <div className="w-16 h-16 flex-shrink-0 bg-gray-200 flex items-center justify-center rounded">
                      <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="font-medium">{user.firstName} {user.lastName}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-sm text-gray-600">{user.street}</p>
                      <p className="text-sm text-gray-600">{user.city}, {user.state}</p>
                      <p className="text-sm text-gray-600">{user.zipcode}, {user.country}</p>
                      <p className="text-sm text-gray-600">Contact: {user.contactNo}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col justify-center">
                    <p className="text-sm">Items: {order.items ? order.items.length : 0}</p>
                    <p className="text-sm">Method: {order.paymentMethod}</p>
                    <p className="text-sm">Payment: {order.paymentStatus}</p>
                    <p className="text-sm">Date: {formatDate(order.createdAt)}</p>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-lg font-semibold">${parseFloat(order.totalAmount).toFixed(2)}</p>
                    <div className="mt-2">
                      {order.items.map((item, idx) => (
                        <p key={idx} className="text-sm text-gray-600">
                          {item.quantity}x {item.item?.name || item.itemName}
                        </p>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end justify-center space-y-2">
                    <div className="relative">
                      <select 
                        className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={order.orderStatus}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      >
                        <option value="PENDING">Pending</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="READY_TO_SHIP">Ready to Ship</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleViewMore(order)}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {showOrderDetails && selectedOrder && (
        <OrderDetailModal 
          order={selectedOrder} 
          onClose={() => setShowOrderDetails(false)} 
        />
      )}
    </div>
  );
};

export default OrdersList;