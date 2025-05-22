import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});
const Dashboard = () => {
  const [customOrders, setCustomOrders] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
 
  const getAllCustomOrders = async () => {
    try {
      const response = await apiClient.get('api/admin/custom-orders');
      return response.data;
    } catch (error) {
      console.error('Error fetching custom orders:', error);
      throw error;
    }
  };
  const getAllEmployees = async () => {
    try {
      const response = await apiClient.get('api/employees/get-employees');
      return response.data;
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  };
  const getAllCategories = async () => {
    try {
      const response = await apiClient.get('api/items/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
      
        const [ordersData, employeesData, categoriesData] = await Promise.all([
          getAllCustomOrders(),
          getAllEmployees(),
          getAllCategories()
        ]);
        
        setCustomOrders(ordersData);
        setEmployees(employeesData);
        setCategories(categoriesData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const getOrdersByStatus = (status) => {
    return customOrders.filter(order => order.orderStatus === status);
  };
  const pendingOrders = getOrdersByStatus('Pending');
  const approvedOrders = getOrdersByStatus('Approve');
  const rejectedOrders = getOrdersByStatus('Reject');
  const holdOrders = getOrdersByStatus('Hold');
  const processingOrders = getOrdersByStatus('Processing');
  const completedOrders = getOrdersByStatus('Completed');
  const prepareEmployeeCountryData = () => {
    const countryCount = {};
    
    employees.forEach(emp => {
      if (emp.country) {
        countryCount[emp.country] = (countryCount[emp.country] || 0) + 1;
      }
    });
    
    return Object.keys(countryCount).map(country => ({
      name: country,
      value: countryCount[country]
    }));
  };
  const prepareOrderDateData = () => {
    const dateCount = {};
    
    customOrders.forEach(order => {
      if (order.createdAt && Array.isArray(order.createdAt)) {
      
        const dateStr = `${order.createdAt[0]}-${order.createdAt[1]}-${order.createdAt[2]}`;
        dateCount[dateStr] = (dateCount[dateStr] || 0) + 1;
      }
    });
    
    return Object.keys(dateCount).map(date => ({
      name: date,
      value: dateCount[date]
    }));
  };
  const prepareCategoryData = () => {
    const categoryCount = {};
    
    categories.forEach(item => {
      if (item.category) {
        categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;
      }
    });
    
    return Object.keys(categoryCount).map(category => ({
      name: category,
      value: categoryCount[category]
    }));
  };
  const employeeCountryData = prepareEmployeeCountryData();
  const orderDateData = prepareOrderDateData();
  const categoryData = prepareCategoryData();
  const statusCards = [
    { id: 1, title: 'Pending Orders', count: pendingOrders.length, color: 'text-amber-500', bgColor: 'bg-amber-50', borderColor: 'border-amber-200', status: 'Pending' },
    { id: 2, title: 'Approved Orders', count: approvedOrders.length, color: 'text-green-500', bgColor: 'bg-green-50', borderColor: 'border-green-200', status: 'Approve' },
    { id: 3, title: 'Reject Orders', count: rejectedOrders.length, color: 'text-red-500', bgColor: 'bg-red-50', borderColor: 'border-red-200', status: 'Reject' },
    { id: 4, title: 'Hold Orders', count: holdOrders.length, color: 'text-yellow-500', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200', status: 'Hold' },
    { id: 5, title: 'Processing Orders', count: processingOrders.length, color: 'text-blue-500', bgColor: 'bg-blue-50', borderColor: 'border-blue-200', status: 'Processing' },
    { id: 6, title: 'Completed Orders', count: completedOrders.length, color: 'text-purple-500', bgColor: 'bg-purple-50', borderColor: 'border-purple-200', status: 'Completed' }
  ];
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + 4 >= statusCards.length ? 0 : prevIndex + 1
    );
  };
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? Math.max(0, statusCards.length - 4) : prevIndex - 1
    );
  };
  const visibleCards = () => {
    const cards = [];
    for (let i = 0; i < 4; i++) {
      const index = currentIndex + i;
      if (index < statusCards.length) {
        cards.push(statusCards[index]);
      }
    }
    return cards;
  };
  const handleViewMore = (status) => {
    navigate(`/orders/${status.toLowerCase()}`);
  };


  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];
  
  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  if (error) return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>{error}</p>
      </div>
    </div>
  );
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Dashboard</h1>
      
    
      <div className="relative mb-8">
        <div className="flex justify-between gap-4 overflow-hidden">
          {visibleCards().map((card) => (
            <div 
              key={card.id} 
              className={`flex-1 ${card.bgColor} ${card.borderColor} border rounded-lg shadow-md transition-all hover:shadow-lg`}
            >
              <div className="p-4 flex flex-col items-center">
                <button 
                  onClick={() => handleViewMore(card.status)}
                  className="text-sm text-gray-500 hover:text-gray-700 mb-2 transition-colors"
                >
                  view more &gt;&gt;
                </button>
                <div className={`text-6xl font-bold ${card.color}`}>{card.count}</div>
                <div className="mt-4 text-center font-medium">{card.title}</div>
              </div>
            </div>
          ))}
        </div>
        
     
        <button 
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow hover:bg-gray-100 transition-colors z-10"
          onClick={prevSlide}
        >
          <ArrowLeft size={24} className="text-gray-600" />
        </button>
        <button 
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow hover:bg-gray-100 transition-colors z-10"
          onClick={nextSlide}
        >
          <ArrowRight size={24} className="text-gray-600" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
     
        <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
          <h2 className="text-center mb-4 font-medium text-gray-700">Employee Countries</h2>
          <div className="flex justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={employeeCountryData}
                margin={{ top: 20, right: 10, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fill: '#666' }} />
                <YAxis tick={{ fill: '#666' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }} 
                />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                <Bar dataKey="value" fill="#ff0000" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
      
        <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
          <h2 className="text-center mb-4 font-medium text-gray-700">Item Categories</h2>
          <div className="flex justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart margin={{ top: 20, right: 20, bottom: 30, left: 20 }}>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="45%"
                  labelLine={false}
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => {
                   
                    const displayName = name.length > 8 ? `${name.substring(0, 8)}...` : name;
                    return `${displayName}: ${(percent * 100).toFixed(0)}%`;
                  }}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name, props) => [value, props.payload.name]}
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                />
                <Legend 
                  layout="horizontal" 
                  verticalAlign="bottom" 
                  align="center"
                  wrapperStyle={{ paddingTop: "20px" }}
                  formatter={(value) => {
             
                    return value.length > 12 ? `${value.substring(0, 12)}...` : value;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
  
        <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
          <h2 className="text-center mb-4 font-medium text-gray-700">Orders By Date</h2>
          <div className="flex justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={orderDateData}
                margin={{ top: 20, right: 10, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fill: '#666' }} />
                <YAxis tick={{ fill: '#666' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }} 
                />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                <Bar dataKey="value" fill="#ff0000" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;