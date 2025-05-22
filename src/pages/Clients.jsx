import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Clients = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [allClients, setAllClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch(`${backendUrl}api/auth/get-users`);
        if (!response.ok) {
          throw new Error('Failed to fetch clients');
        }
        const data = await response.json();
        
        
        const formattedClients = data.map(user => ({
          id: user.id,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'N/A',
          country: user.country || 'N/A',
          email: user.email || '',
          contactNo: user.contactNo || '',
          image: user.image ? `data:image/jpeg;base64,${user.image}` : "../../public/images/noimage.png",
        }));

        
        const sortedClients = formattedClients.sort((a, b) => a.id - b.id);
        
        setAllClients(sortedClients);
        setClients(sortedClients);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching clients:", error);
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  
  const handleSearch = (searchText) => {
    if (!searchText.trim()) {
      setClients(allClients);
      return;
    }
    
    const filteredClients = allClients.filter(client => {
      return (
        client.id.toString().toLowerCase().includes(searchText.toLowerCase()) ||
        client.name.toLowerCase().includes(searchText.toLowerCase()) ||
        (client.country && client.country.toLowerCase().includes(searchText.toLowerCase())) ||
        (client.email && client.email.toLowerCase().includes(searchText.toLowerCase())) ||
        (client.contactNo && client.contactNo.toString().includes(searchText))
      );
    });
    
    setClients(filteredClients);
  };

  return (
    <div className="p-6">
        <div className="w-full flex justify-between">
            <h1 className="text-2xl font-semibold mb-4">Client List</h1>
            <div className="w-64">
              <input
                type="text"
                placeholder="Search Clients..."
                className="w-full px-4 py-2 border border-gray-300 rounded"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
        </div>
        {loading ? (
          <p>Loading clients...</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
              <thead>
              <tr className="bg-gray-200">
                  <th className="p-2">ID</th>
                  <th className="p-2">Image</th>
                  <th className="p-2">Name</th>
                  <th className="p-2">Country</th>
                  <th className="p-2">Actions</th>
              </tr>
              </thead>
              <tbody className="space-y-2">
              {clients.map((client) => (
                  <tr key={client.id} className="border border-gray-300 rounded-lg">
                  <td className="p-2 text-center">{client.id}</td>
                  <td className="p-2 flex justify-center">
                      <img src={client.image} alt={client.name} className="w-10 h-10 rounded-full object-cover" />
                  </td>
                  <td className="p-2 text-center">{client.name}</td>
                  <td className="p-2 text-center">{client.country}</td>
                  <td className="p-2 text-center">
                      <button onClick={() => navigate(`/client/${client.id}`)} className="bg-white text-black border px-3 py-1 cursor-pointer rounded">View More</button>
                  </td>
                  </tr>
              ))}
              </tbody>
          </table>
        )}
    </div>
  );
};

export default Clients;