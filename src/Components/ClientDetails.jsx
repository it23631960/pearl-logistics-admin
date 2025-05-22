import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const ClientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClientDetails = async () => {
      try {
        const response = await fetch(`${backendUrl}api/auth/get-users`);
        if (!response.ok) {
            toast.error("Failed to fetch client details")
          throw new Error('Failed to fetch client details');
        }
        const users = await response.json();
        const foundClient = users.find(user => user.id.toString() === id);
        if (!foundClient) {
            toast.error("Client not found")
          throw new Error('Client not found');
        }
        setClient(foundClient);
        setLoading(false);
      } catch (error) {
        toast.error("Error fetching client details:")
        console.error("Error fetching client details:", error);
        setError(error.message);
        setLoading(false);
      }
    };
    fetchClientDetails();
  }, [id]);

  const handleGoBack = () => {
    navigate('/clients');
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${backendUrl}api/auth/delete/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        toast.error("Failed to delete client")
        throw new Error('Failed to delete client');
      }
      toast.success('Client deleted successfully');
      navigate('/clients');
    } catch (error) {
      console.error("Error deleting client:", error);
      toast.error("Error deleting client: " + error.message);
    }
  };

  const formatDate = (dateArray) => {
    if (!dateArray || dateArray.length < 3) return 'N/A';
    return `${dateArray[0]}-${dateArray[1]}-${dateArray[2]}`;
  };

  if (loading) return <div className="p-6">Loading client details...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;
  if (!client) return <div className="p-6">Client not found</div>;

  return (
    <div className="p-6">
      <div className="mb-6">
        <button onClick={handleGoBack} className="flex items-center text-gray-700 hover:text-gray-900 transition duration-300">
          <img src="/images/backbutton.png" alt="Back" className="w-10 h-10 mr-2 cursor-pointer" />
          <span className="text-lg font-medium">Back to Clients</span>
        </button>
      </div>
      
      <h1 className="text-black text-xl mb-4 font-semibold">Customer Page</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3">
          <img 
            src={client.image ? `data:image/jpeg;base64,${client.image}` : "/images/noimage.png"}
            alt={`${client.firstName || ''} ${client.lastName || ''}`}
            className="w-full max-w-xs rounded object-cover"
          />
          <div className="mt-4">
            <button onClick={handleDelete} className="bg-black text-white px-4 py-2 rounded w-full cursor-pointer">Delete Customer</button>
          </div>
        </div>
        
        <div className="w-full md:w-2/3 border border-black rounded p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><strong>Client ID</strong>: {client.id}</p>
              <p><strong>First Name</strong>: {client.firstName || 'N/A'}</p>
              <p><strong>Email Address</strong>: {client.email || 'N/A'}</p>
              <p><strong>Street</strong>: {client.street || 'N/A'}</p>
              <p><strong>City</strong>: {client.city || 'N/A'}</p>
              <p><strong>State</strong>: {client.state || 'N/A'}</p>
              <p><strong>Zip Code</strong>: {client.zipcode || 'N/A'}</p>
              <p><strong>Country</strong>: {client.country || 'N/A'}</p>
            </div>
            <div>
              <p><strong>Last Name</strong>: {client.lastName || 'N/A'}</p>
              <p><strong>Contact No</strong>: {client.contactNo || 'N/A'}</p>
              <p><strong>Employee D Joined</strong>: {formatDate(client.djoined)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetails;
