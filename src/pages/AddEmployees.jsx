import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const AddEmployees = () => {
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [role, setRole] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      
      const employeeData = {
        name: name,
        country: country,
        role: role,
        contactno: parseInt(contact),
        email: email,
        description: description,
        address: address,
        password: password
      };

      
      const formData = new FormData();
      formData.append("employee", JSON.stringify(employeeData));
      if (image) formData.append("image", image);

    
      console.log("Submitting employee data:", employeeData);
      console.log("FormData entries:");
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
      }

      const response = await axios.post(`${backendUrl}api/employees/register`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        toast.success("Employee Added Successfully");
        setName("");
        setCountry("");
        setRole("");
        setContact("");
        setEmail("");
        setDescription("");
        setAddress("");
        setPassword("");
        setConfirmPassword("");
        setImage(null);
      } else {
        toast.error(response.data.message || "Error adding employee");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-lg p-2 ml-0 ">
        <p className="text-gray-700 mb-2">Upload Image</p>
        <label className="block w-24 h-24 border-2 border-gray-300 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400">
          <img
            className="w-full h-full object-cover rounded-lg"
            src={image ? URL.createObjectURL(image) : assets.upload_area}
            alt="Upload"
          />
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            hidden
          />
        </label>
        {[
          { label: "Employee Name", value: name, setter: setName, type: "text" },
          { label: "Employee Country", value: country, setter: setCountry, type: "text" },
          { label: "Applying Role", value: role, setter: setRole, type: "text" },
          { label: "Employee Contact No", value: contact, setter: setContact, type: "text" },
          { label: "Employee Email", value: email, setter: setEmail, type: "email" },
          { label: "Employee Description", value: description, setter: setDescription, type: "text" },
          { label: "Employee Address", value: address, setter: setAddress, type: "text" },
          { label: "Employee Password", value: password, setter: setPassword, type: "password" },
          { label: "Confirm Password", value: confirmPassword, setter: setConfirmPassword, type: "password" }
        ].map((field, index) => (
          <div key={index} className="mb-4">
            <p className="text-gray-700 mb-2">{field.label}</p>
            <input
              onChange={(e) => field.setter(e.target.value)}
              value={field.value}
              type={field.type}
              placeholder={`Add ${field.label.split(" ")[1]} Here`}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        ))}
        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition cursor-pointer duration-300"
          onClick={onSubmitHandler}
        >
          Send to Approve
        </button>
      </div>
    </div>
  );
};

export default AddEmployees;