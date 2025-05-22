import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Searchbar from "../Components/Searchbar";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [allTickets, setAllTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState("");
  const [description, setDescription] = useState("");
  const [sending, setSending] = useState(false);
  
  useEffect(() => {
    fetchTickets();
  }, []);
  
  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}api/admin/tickets`);
      const formattedTickets = response.data.map(ticket => ({
        id: ticket.id,
        userId: ticket.userId,
        name: ticket.name,
        subject: ticket.subject,
        email: ticket.email,
        status: ticket.replied ? "Closed" : "Pending",
        description: ticket.description,
        reply: ticket.reply || ""
      }));
      setTickets(formattedTickets);
      setAllTickets(formattedTickets);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      toast.error("Failed to load tickets");
      setLoading(false);
    }
  };
  
  const handleSelectTicket = async (ticket) => {
    try {
      const response = await axios.get(`${backendUrl}api/admin/tickets/${ticket.id}`);
      const ticketData = {
        id: response.data.id,
        userId: response.data.userId,
        name: response.data.name,
        subject: response.data.subject,
        email: response.data.email,
        status: response.data.replied ? "Closed" : "Pending",
        description: response.data.description,
        reply: response.data.reply || ""
      };
      setSelectedTicket(ticketData);
      setDescription(ticketData.description);
      setReply(ticketData.reply);
    } catch (error) {
      console.error("Error fetching ticket details:", error);
      toast.error("Failed to load ticket details");
    }
  };
  
  const handleReplySubmit = async () => {
    if (!reply.trim()) {
      toast.warning("Reply cannot be empty");
      return;
    }
    
    try {
      setSending(true);
      await axios.put(`${backendUrl}api/admin/tickets/${selectedTicket.id}/reply`, {
        reply: reply
      });
      
      const updatedTickets = tickets.map(ticket => 
        ticket.id === selectedTicket.id 
          ? { ...ticket, status: "Closed", reply: reply } 
          : ticket
      );
      
      setTickets(updatedTickets);
      setAllTickets(updatedTickets);
      toast.success("Reply sent successfully and email notification sent to customer");
      setSelectedTicket(null);
      setSending(false);
      
      fetchTickets();
    } catch (error) {
      console.error("Error sending reply:", error);
      toast.error("Failed to send reply");
      setSending(false);
    }
  };
  
  return (
    <div className="p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="w-full flex justify-between">
        <h2 className="text-xl font-semibold">All Ticket List</h2>
        <Searchbar 
          placeholder="Search Tickets..." 
          unFilterd={allTickets} 
          onFilter={setTickets}
          searchKeys={["id", "userId", "name", "subject", "email", "status"]}
        />
      </div>
      
      <div className="mt-4 rounded-lg">
        {loading ? (
          <div className="text-center py-4">Loading tickets...</div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-4">No tickets found</div>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-center">ID</th>
                <th className="p-2 text-center">User ID</th>
                <th className="p-2 text-center">Name</th>
                <th className="p-2 text-center">Subject</th>
                <th className="p-2 text-center">Email</th>
                <th className="p-2 text-center">Status</th>
                <th className="p-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="border border-gray-300">
                  <td className="p-2 text-center">{ticket.id}</td>
                  <td className="p-2 text-center">{ticket.userId}</td>
                  <td className="p-2 text-center">{ticket.name}</td>
                  <td className="p-2 text-center">{ticket.subject}</td>
                  <td className="p-2 text-center">{ticket.email}</td>
                  <td className={`p-2 text-center font-semibold ${
                    ticket.status === "Closed" 
                      ? "text-green-600" 
                      : ticket.status === "Pending" 
                        ? "text-yellow-600" 
                        : "text-red-600"
                  }`}>
                    {ticket.status}
                  </td>
                  <td className="p-2 flex justify-center">
                    <button 
                      className="px-4 py-2 bg-white text-black border rounded" 
                      onClick={() => handleSelectTicket(ticket)}
                    >
                      View More
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      {selectedTicket && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="w-96 bg-white p-4 rounded shadow-lg">
            <div className="flex justify-between">
              <h3 className="text-lg font-semibold">Customer Contact</h3>
              <button 
                className="px-3 py-1 bg-black text-white rounded" 
                onClick={() => setSelectedTicket(null)}
              >
                X
              </button>
            </div>
            <div className="mt-4">
              <input 
                value={`ID: ${selectedTicket.id}`} 
                readOnly 
                className="w-full p-2 border mb-2" 
              />
              <input 
                value={`User ID: ${selectedTicket.userId}`} 
                readOnly 
                className="w-full p-2 border mb-2" 
              />
              <input 
                value={`Name: ${selectedTicket.name}`} 
                readOnly 
                className="w-full p-2 border mb-2" 
              />
              <input 
                value={`Subject: ${selectedTicket.subject}`} 
                readOnly 
                className="w-full p-2 border mb-2" 
              />
              <input 
                value={`Email: ${selectedTicket.email}`} 
                readOnly 
                className="w-full p-2 border mb-2" 
              />
              <input 
                value={`Status: ${selectedTicket.status}`} 
                readOnly 
                className={`w-full p-2 border mb-2 font-semibold ${
                  selectedTicket.status === "Closed" 
                    ? "text-green-600" 
                    : selectedTicket.status === "Pending" 
                      ? "text-yellow-600" 
                      : "text-red-600"
                }`}
              />
              <textarea 
                placeholder="Description" 
                className="w-full p-2 border mb-2"
                value={description}
                readOnly
              />
              <textarea 
                placeholder="Reply" 
                className="w-full p-2 border mb-2"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                disabled={selectedTicket.status === "Closed"}
              />
              <button 
                className={`w-full px-4 py-2 rounded ${
                  selectedTicket.status === "Closed" 
                    ? "bg-gray-400 text-white cursor-not-allowed" 
                    : sending
                      ? "bg-gray-500 text-white"
                      : "bg-black text-white"
                }`}
                onClick={handleReplySubmit}
                disabled={selectedTicket.status === "Closed" || sending}
              >
                {selectedTicket.status === "Closed" 
                  ? "Already Replied" 
                  : sending 
                    ? "Sending..." 
                    : "Send Reply & Email"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}