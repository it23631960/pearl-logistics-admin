import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Searchbar from '../Components/Searchbar';
import { toast } from "react-toastify";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const Employees = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [salary, setSalary] = useState("");
  
  useEffect(() => {
    fetchEmployees();
  }, []);
  
  const sortEmployeesByIdAscending = (employeeArray) => {
    return [...employeeArray].sort((a, b) => a.id - b.id);
  };
  
  const fetchEmployees = async () => {
    try {
      const response = await fetch(`${backendUrl}api/employees/get-employees`);
      if (response.ok) {
        const data = await response.json();
        const sortedData = sortEmployeesByIdAscending(data);
        setEmployees(sortedData);
        setFilteredEmployees(sortedData);
      } else {
        console.error("Failed to fetch employees");
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };
  
  const handleApprove = (employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };
  
  const handleRemove = async (id) => {
    try {
      const response = await fetch(`${backendUrl}api/employees/delete/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        toast.success("Employee deleted Successfully")
        const updatedEmployees = employees.filter(emp => emp.id !== id);
        const updatedFilteredEmployees = filteredEmployees.filter(emp => emp.id !== id);
        setEmployees(updatedEmployees);
        setFilteredEmployees(updatedFilteredEmployees);
      } else {
        console.error("Failed to delete employee");
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };
  
  const handleConfirmApproval = async () => {
    if (!selectedEmployee || !salary) return;
    
    try {
      const response = await fetch(
        `${backendUrl}api/employees/approve?id=${selectedEmployee.id}&salary=${salary}&role=${selectedEmployee.role || "Employee"}`,
        {
          method: 'PUT',
        }
      );
      
      if (response.ok) {
        toast.success("Employee approved successfully");
        
        const updatedEmployees = employees.map(emp =>
          emp.id === selectedEmployee.id ? { ...emp, status: "Approved", salary: parseInt(salary), role: selectedEmployee.role || "Employee" } : emp
        );
        
        const updatedFilteredEmployees = filteredEmployees.map(emp =>
          emp.id === selectedEmployee.id ? { ...emp, status: "Approved", salary: parseInt(salary), role: selectedEmployee.role || "Employee" } : emp
        );
        
        setEmployees(updatedEmployees);
        setFilteredEmployees(updatedFilteredEmployees);
        
        setIsModalOpen(false);
        setSalary("");
      } else {
        toast.error("Failed to approve employee");
        console.error("Failed to approve employee");
      }
    } catch (error) {
      toast.error("Error approving employee");
      console.error("Error updating employee:", error);
    }
  };
  
  const handleViewMore = (id) => {
    navigate(`/employee/${id}`);
  };
  
  
  const handleSearch = (filteredData) => {
    const sortedFilteredData = sortEmployeesByIdAscending(filteredData);
    setFilteredEmployees(sortedFilteredData);
  };
  
  return (
    <div className="container mx-auto py-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Employee List</h1>
        <Searchbar 
          placeholder="Search Employees..." 
          unFilterd={employees} 
          onFilter={handleSearch}
          searchKeys={["id", "name", "country", "status"]}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-200 text-black">
            <tr>
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-3 px-4 text-left">Image</th>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Country</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((emp) => (
              <tr key={emp.id} className="border-b hover:bg-gray-100">
                <td className="py-3 px-4">{emp.id}</td>
                <td className="py-3 px-4">
                  <img 
                    src={emp.image ? `data:image/jpeg;base64,${emp.image}` : "../../public/images/client.png"} 
                    alt={emp.name}
                    className="w-10 h-10 rounded-full"
                  />
                </td>
                <td className="py-3 px-4">{emp.name}</td>
                <td className="py-3 px-4">{emp.country}</td>
                <td className="py-3 px-4">{emp.status}</td>
                <td className="py-3 px-4 flex space-x-2">
                  <button 
                    onClick={() => handleViewMore(emp.id)} 
                    className="bg-white text-black border px-3 py-1 rounded cursor-pointer"
                  >
                    View More
                  </button>
                  {emp.status === "pending" ? (
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleApprove(emp)} 
                        className="bg-white text-black border px-3 py-1 rounded cursor-pointer"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleRemove(emp.id)} 
                        className="bg-white text-black border px-3 py-1 rounded cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleRemove(emp.id)} 
                      className="bg-white text-black border px-3 py-1 rounded cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Employee Approval</h2>
              <button onClick={() => {
                setIsModalOpen(false);
                setSelectedEmployee(null);
              }} className="text-xl font-bold">
                X
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Name</label>
              <p className="p-2 border rounded w-full">{selectedEmployee?.name}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Country</label>
              <p className="p-2 border rounded w-full">{selectedEmployee?.country}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Role</label>
              <input 
                className="p-2 border rounded w-full"
                value={selectedEmployee?.role || "Employee"}
                onChange={(e) => setSelectedEmployee({...selectedEmployee, role: e.target.value})}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Salary</label>
              <input 
                type="number"
                className="p-2 border rounded w-full"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
              />
            </div>
            <button 
              onClick={handleConfirmApproval}
              className="w-full bg-blue-500 text-white py-2 rounded cursor-pointer"
            >
              Approve
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default Employees;