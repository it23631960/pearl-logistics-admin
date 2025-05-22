import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const EmployeeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [salary, setSalary] = useState("");
  const [role, setRole] = useState("");

  const handleGoBack = () => {
    navigate('/employees');
};
  
  useEffect(() => {
    fetchEmployeeDetails();
  }, [id]);

  const formatDate = (dateArray) => {
    if (!dateArray || !Array.isArray(dateArray)) {
      return "N/A";
    }
    
    const [year, month, day, hour, minute] = dateArray;
    const date = new Date(year, month - 1, day, hour || 0, minute || 0);
    
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const fetchEmployeeDetails = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${backendUrl}api/employees/get-employees/${id}`);
      console.log(response)
      if (response.ok) {
        const data = await response.json();
        setEmployee(data);
        setSalary(data.salary || "");
        setRole(data.role || "Employee");
      } else {
        toast.error("dsds");
        navigate("/employees");
      }
    } catch (error) {
      console.error("Error fetching employee details:", error);
      toast.error("Error loading employee data");
      navigate("/employees");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteEmployee = async () => {
    try {
      const response = await fetch(`${backendUrl}api/employees/delete/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        toast.success("Employee deleted successfully");
        navigate("/employees");
      } else {
        toast.error("Failed to delete employee");
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast.error("Error deleting employee");
    }
  };
  
  const handleUpdateDetails = async () => {
    try {
      const response = await fetch(
        `${backendUrl}api/employees/approve?id=${id}&salary=${salary}&role=${role}`,
        {
          method: 'PUT',
        }
      );
      
      if (response.ok) {
        toast.success("Employee details updated successfully");
        fetchEmployeeDetails();
      } else {
        toast.error("Failed to update employee details");
      }
    } catch (error) {
      console.error("Error updating employee:", error);
      toast.error("Error updating employee details");
    }
  };
  
  if (isLoading) {
    return <div className="container mx-auto py-4 text-center">Loading...</div>;
  }
  
  if (!employee) {
    return <div className="container mx-auto py-4 text-center">Employee not found</div>;
  }
  
  return (
    <div className="container mx-auto py-4">
        <div className="mb-6">
                        <button
                            onClick={handleGoBack}
                            className="flex items-center text-gray-700 hover:text-gray-900 transition duration-300"
                        >
                            <img
                                src="/images/backbutton.png"
                                alt="Back"
                                className="w-10 h-10 mr-2 cursor-pointer"
                            />
                            <span className="text-lg font-medium">Back to Employees</span>
                        </button>
                    </div>
      <h1 className="text-2xl font-bold mb-6">Employee Page</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3">
          <img 
            src={employee.image ? `data:image/jpeg;base64,${employee.image}` : "../../public/images/client.png"}
            alt={employee.name}
            className="w-full max-w-xs rounded"
          />
        </div>
        
        <div className="w-full md:w-2/3 border rounded p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Employee ID</p>
              <p>{employee.id}</p>
            </div>
            
            <div className="md:text-right">
              <p className="font-semibold">Employee Email</p>
              <p>{employee.email || "N/A"}</p>
            </div>
            
            <div>
              <p className="font-semibold">Employee Name</p>
              <p>{employee.name}</p>
            </div>
            
            <div className="md:text-right">
              <p className="font-semibold">Contact no</p>
              <p>{employee.contactno || "N/A"}</p>
            </div>
            
            <div>
              <p className="font-semibold">Employee Country</p>
              <p>{employee.country}</p>
            </div>
            
            <div className="md:text-right">
              <p className="font-semibold">Address</p>
              <p>{employee.address || "N/A"}</p>
            </div>
            
            <div>
              <p className="font-semibold">Employee Description</p>
              <p>{employee.description || "N/A"}</p>
            </div>
            
            <div>
              <p className="font-semibold mr-0 pr-0">Employee Date Joined</p>
              <p>{formatDate(employee.djoined)}</p>
            </div>
            
            <div>
              <p className="font-semibold">Employee Role</p>
              <input 
                type="text"
                className="p-2 border rounded w-full"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>
            
            <div className="md:text-right">
              <p className="font-semibold">Salary</p>
              <input 
                type="number"
                className="p-2 border rounded w-full"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center gap-4 mt-8">
        <button 
          onClick={handleUpdateDetails}
          className="bg-black text-white px-8 py-2 rounded cursor-pointer"
        >
          Update Details
        </button>
        <button 
          onClick={handleDeleteEmployee}
          className="bg-black text-white px-8 py-2 rounded cursor-pointer"
        >
          Delete Employee
        </button>
      </div>
    </div>
  );
};

export default EmployeeDetails;