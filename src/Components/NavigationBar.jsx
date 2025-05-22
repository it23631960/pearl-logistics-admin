import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
    { title: "Dashboard", icon: "/icons/dashboard.png", href: "/dashboard" },
    { title: "Add Items", icon: "/icons/add.png", href: "/add-items" },
    { title: "List Items", icon: "/icons/list.png", href: "/list-items" },
    { title: "All Orders", icon: "/icons/orders.png", href: "/all-orders" },
    { title: "Custom Orders", icon: "/icons/custom-orders.png", href: "/custom-orders" },
    { title: "Clients", icon: "/icons/clients.png", href: "/clients" },
    { title: "Employees", icon: "/icons/employees.png", href: "/employees" },
    { title: "Add Employees", icon: "/icons/employees.png", href: "/add-employees" },
    { title: "Tickets", icon: "/icons/tickets.png", href: "/tickets" },
];

const NavigationBar = () => {
    const location = useLocation();

    return (
        <div className="w-64 h-screen border-r border-gray-300 p-6 bg-white">
            <nav className="space-y-3">
                {navItems.map((item) => (
                    <Link key={item.title} to={item.href}>
                        <div
                            className={`flex mt-3 items-center gap-4 px-5 py-3 border border-gray-300 rounded-lg transition-all text-base ${
                                location.pathname === item.href ? "bg-[#B4B4B4] text-blue-500" : "bg-white hover:bg-gray-100"
                            }`}
                        >
                            <img src={item.icon} alt={item.title} className="w-6 h-6" />
                            <span className="text-md">{item.title}</span>
                        </div>
                    </Link>
                ))}
            </nav>
        </div>
    );
};

export default NavigationBar;