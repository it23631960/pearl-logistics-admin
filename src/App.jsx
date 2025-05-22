import React, { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Home from "./pages/Home";
import NavigationBar from "./Components/NavigationBar";
import Header from "./Components/Header";
import Login from "./pages/Login";
import AddItems from "./pages/AddItems";
import ProductList from "./pages/ProductList";
import OrdersList from "./pages/OrdersList";
import CustomOrders from "./pages/CustomOrders";
import Employees from "./pages/Employees";
import AddEmployees from "./pages/AddEmployees";
import Tickets from "./pages/Tickets";
import Clients from "./pages/Clients";
import EmployeeDetails from "./Components/EmployeeDetails";
import ClientDetails from "./Components/ClientDetails";
import Dashboard from "./Components/Dashboard";
import AddCategory from "./pages/AddCategory";
import AdminOrdersPanel from "./pages/AdminOrdersPanel";

const App = () => {
  return (
    <Router>
      <MainContent />
    </Router>
  );
};

const MainContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const hideHeaderNavRoutes = ["/login"];
  const showLayout = !hideHeaderNavRoutes.includes(location.pathname);
  
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token && location.pathname !== "/login") {
      navigate("/login"); 
    }
  }, [location, navigate]);
  
  return (
    <>
      <ToastContainer />
      {showLayout ? (
        <div className="flex flex-col h-screen">
          <Header />
          <div className="flex flex-1 overflow-hidden">
            <NavigationBar />
            <main className="flex-1 p-6 overflow-y-auto">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/add-items" element={<AddItems />} />
                <Route path="/list-items" element={<ProductList />} />
                <Route path="/custom-orders" element={<CustomOrders />} />
                <Route path="/all-orders" element={<OrdersList />} />
                <Route path="/employees" element={<Employees />} />
                <Route path="/add-employees" element={<AddEmployees />} />
                <Route path="/tickets" element={<Tickets />} />
                <Route path="/clients" element={<Clients />} />
                <Route path="/employee/:id" element={<EmployeeDetails />} />
                <Route path="/client/:id" element={<ClientDetails />} />
                <Route path="/orders/:status" element={<OrdersList />} />
                <Route path="/add-categories" element={<AddCategory />} />
              </Routes>
            </main>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      )}
    </>
  );
};

export default App;