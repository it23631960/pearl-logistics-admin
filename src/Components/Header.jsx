import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { toast } from "react-toastify"; 

const Header = () => {
    const [adminName, setAdminName] = useState("Admin");
    const [adminImage, setAdminImage] = useState("/images/admin.png"); 
    const navigate = useNavigate(); 

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (token) {
            try {
                const adminData = JSON.parse(token);
                setAdminName(adminData.name || "Admin");
                if (adminData.image) {
                    setAdminImage(`data:image/png;base64,${adminData.image}`);
                }
            } catch (error) {
                console.error("Error parsing admin data:", error);
            }
        }
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem("token");

        
        toast.success("You have logged out successfully!");

      
        navigate("/login");
    };

    return (
        <div className="w-full flex justify-between items-center border-b border-gray-300 p-4 bg-white">
            <div>
                <h1 className="text-xl font-semibold text-gray-700">
                    <span className="text-blue-500">Pearl</span> Logistics
                </h1>
                <p className="text-sm text-gray-500">Admin Panel</p>
            </div>

            <div className="flex items-center gap-4">
                <img src={adminImage} alt="Admin Avatar" className="w-10 h-10 rounded-full object-cover" />
                <h2 className="text-gray-700 text-lg font-semibold">
                    Welcome, <span className="font-bold">{adminName}</span>
                </h2>
                <button
                    className="border border-gray-300 px-5 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                    onClick={handleLogout} 
                >
                    Log Out
                </button>
            </div>
        </div>
    );
};

export default Header;