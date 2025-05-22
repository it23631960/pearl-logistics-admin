import { useState, useEffect } from 'react';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const AdminOrdersPanel = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  
  const statusOptions = [
    "PENDING", 
    "APPROVED", 
    "REJECTED", 
    "HOLD", 
    "PROCESSING", 
    "COMPLETED"
  ];

 
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${backendUrl}api/orders`);
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        const data = await response.json();
        

        const userResponse = await fetch(`${backendUrl}api/auth/get-users`);
        const users = await userResponse.json();
        
  
        const ordersWithUserDetails = await Promise.all(
          data.map(async (order) => {
            try {
       
              const userId = order.user?.id;
              const user = userId ? users.find(u => u.id === userId) : null;
              
    
              const itemsWithDetails = await Promise.all(
                (order.orderItems || []).map(async (item) => {
                  try {
                    if (!item.itemId) return item;
                    
                    const itemResponse = await fetch(`${backendUrl}api/items/get/${item.itemId}`);
                    if (!itemResponse.ok) {
                      console.warn(`Item not found for id: ${item.itemId}`);
                      return item;
                    }
                    const itemData = await itemResponse.json();
                    return { ...item, details: itemData.item };
                  } catch (error) {
                    console.error(`Error fetching details for item ${item?.itemId}:`, error);
                    return item;
                  }
                })
              );
              
              return { ...order, user, orderItems: itemsWithDetails || [] };
            } catch (error) {
              console.error(`Error processing order ${order.id}:`, error);
              return order;
            }
          })
        );
        
        setOrders(ordersWithUserDetails);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to load orders. Please try again later.');
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);


  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${backendUrl}api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) {
        throw new Error('Failed to update order status');
      }
  
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, orderStatus: newStatus } 
          : order
      ));

      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status. Please try again.');
    }
  };

  const handleViewMore = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading orders...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">All Orders List</h1>
      
      {orders.length === 0 ? (
        <div className="text-center p-8 bg-gray-100 rounded-lg">
          No orders found
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div 
              key={order.id} 
              className={`border rounded-lg overflow-hidden shadow-sm ${
                order.orderStatus === 'COMPLETED' ? 'border-green-300' : 
                order.orderStatus === 'REJECTED' ? 'border-red-300' :
                'border-gray-300'
              }`}
            >
              <div className="grid grid-cols-12 p-4 gap-4 items-center">
     
                <div className="col-span-4 grid grid-cols-4 gap-2">
                  {(order.orderItems || []).slice(0, 4).map((item, idx) => (
                    <div key={idx} className="bg-gray-100 p-2 flex justify-center items-center">
                      <img 
                        src={item.itemId ? `/api/items/${item.itemId}/image` : "/api/placeholder/64/64"}
                        alt={`Product ${idx + 1}`}
                        className="w-16 h-16 object-contain"
                        onError={(e) => {
                          e.target.src = "/api/placeholder/64/64";
                        }}
                      />
                    </div>
                  ))}
                </div>
                
           
                <div className="col-span-8 grid grid-cols-4 gap-4">
     
                  <div className="space-y-1">
                    <p className="font-semibold">Product Name</p>
                    <p className="text-sm">{order.orderItems?.[0]?.itemName || 'No product name'}</p>
                    
                    <div className="pt-2">
                      <p className="font-semibold">Customer Name</p>
                      <p className="text-sm">{order.user?.firstName || 'N/A'} {order.user?.lastName || ''}</p>
                      
                      <p className="font-semibold mt-1">Customer Email</p>
                      <p className="text-sm">{order.user?.email || 'N/A'}</p>
                      
                      <p className="font-semibold mt-1">Street</p>
                      <p className="text-sm">{order.user?.street || 'N/A'}</p>
                      
                      <p className="font-semibold mt-1">State, City</p>
                      <p className="text-sm">{order.user?.state || 'N/A'}, {order.user?.city || 'N/A'}</p>
                      
                      <p className="font-semibold mt-1">Zip Code, Country</p>
                      <p className="text-sm">{order.user?.zipcode || 'N/A'}, {order.user?.country || 'N/A'}</p>
                      
                      <p className="font-semibold mt-1">Contact Number</p>
                      <p className="text-sm">{order.user?.contactNo || 'N/A'}</p>
                    </div>
                  </div>
                  
           
                  <div className="space-y-1">
                    <p className="font-semibold">Product Link</p>
                    <p className="text-sm text-blue-500 cursor-pointer">View</p>
                    
                    <p className="font-semibold mt-1">Product Description</p>
                    <p className="text-sm">{order.orderItems?.[0]?.details?.description || 'No description'}</p>
                    
                    <p className="font-semibold mt-1">From Country</p>
                    <p className="text-sm">Local</p>
                  </div>
                  
        
                  <div className="space-y-1">
                    <p className="font-semibold">Items: {order.orderItems?.length || 0}</p>
                    
                    <div className="pt-2">
                      <p className="font-semibold">Method: {order.paymentMethod || 'COD'}</p>
                      <p className="font-semibold mt-1">Payment: {order.paymentStatus || 'N/A'}</p>
                      <p className="font-semibold mt-1">Date: {formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                  

                  <div className="space-y-2 flex flex-col justify-center items-end">
                    <p className="font-bold text-xl">${order.totalAmount || 0}</p>
                    
                    <div className="flex items-center space-x-2">
                      <select 
                        className="border border-gray-300 rounded p-1"
                        value={order.orderStatus || 'PENDING'}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      >
                        {statusOptions.map(status => (
                          <option key={status} value={status}>
                            {status.charAt(0) + status.slice(1).toLowerCase()}
                          </option>
                        ))}
                      </select>
                      <button 
                        className="bg-green-500 hover:bg-green-600 text-white rounded px-4 py-1"
                        onClick={() => handleStatusChange(order.id, 'APPROVED')}
                      >
                        Approve
                      </button>
                    </div>
                    
                    <button 
                      className="w-full bg-gray-200 hover:bg-gray-300 rounded px-4 py-1"
                      onClick={() => handleViewMore(order)}
                    >
                      View More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
 
      {showModal && selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Order #{selectedOrder.id}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
     
              <div className="space-y-4">
                <div className="border-b pb-2">
                  <h3 className="font-semibold">Order Information</h3>
                  <p>Status: <span className="font-bold">{selectedOrder.orderStatus || 'N/A'}</span></p>
                  <p>Created: {formatDate(selectedOrder.createdAt)}</p>
                  <p>Payment Method: {selectedOrder.paymentMethod || 'N/A'}</p>
                  <p>Payment Status: {selectedOrder.paymentStatus || 'N/A'}</p>
                </div>
                
                <div className="border-b pb-2">
                  <h3 className="font-semibold">Price Details</h3>
                  <p>Items Total: ${selectedOrder.itemsTotal || 0}</p>
                  <p>Shipping Charges: ${selectedOrder.shippingCharges || 0}</p>
                  <p>Other Charges: ${selectedOrder.otherCharges || 0}</p>
                  <p className="font-bold">Total Amount: ${selectedOrder.totalAmount || 0}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold">Customer Information</h3>
                  <p>Name: {selectedOrder.user?.firstName || 'N/A'} {selectedOrder.user?.lastName || ''}</p>
                  <p>Email: {selectedOrder.user?.email || 'N/A'}</p>
                  <p>Contact: {selectedOrder.user?.contactNo || 'N/A'}</p>
                  <p>Address: {selectedOrder.user?.street || 'N/A'}, {selectedOrder.user?.city || 'N/A'}, {selectedOrder.user?.state || 'N/A'}, {selectedOrder.user?.zipcode || 'N/A'}, {selectedOrder.user?.country || 'N/A'}</p>
                </div>
                
                <div className="mt-4">
                  <h3 className="font-semibold">Update Order Status</h3>
                  <div className="flex items-center space-x-2 mt-2">
                    <select 
                      className="border border-gray-300 rounded p-2"
                      value={selectedOrder.orderStatus || 'PENDING'}
                      onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                    >
                      {statusOptions.map(status => (
                        <option key={status} value={status}>
                          {status.charAt(0) + status.slice(1).toLowerCase()}
                        </option>
                      ))}
                    </select>
                    <button 
                      className="bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2"
                      onClick={() => handleStatusChange(selectedOrder.id, selectedOrder.orderStatus)}
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
              
          
              <div>
                <h3 className="font-semibold mb-4">Order Items</h3>
                <div className="space-y-4">
                  {(selectedOrder.orderItems || []).map((item, index) => (
                    <div key={index} className="border rounded-lg p-4 flex space-x-4">
                      <div className="w-20 h-20 bg-gray-100 flex items-center justify-center">
                        <img 
                          src={item.itemId ? `/api/items/${item.itemId}/image` : "/api/placeholder/80/80"}
                          alt={item.itemName || `Item ${index + 1}`}
                          className="max-w-full max-h-full object-contain"
                          onError={(e) => {
                            e.target.src = "/api/placeholder/80/80";
                          }}
                        />
                      </div>
                      <div className="flex-grow">
                        <p className="font-semibold">{item.itemName || `Item ${index + 1}`}</p>
                        <p className="text-sm">Quantity: {item.quantity || 0}</p>
                        <p className="text-sm">Price: ${item.price || 0} per unit</p>
                        <p className="font-bold">Total: ${item.totalPrice || 0}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setShowModal(false)}
                className="bg-gray-300 hover:bg-gray-400 rounded px-4 py-2"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPanel;