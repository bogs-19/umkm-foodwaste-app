import React from 'react';
import { Menu, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TopBar = ({ title, onMenuClick }) => {
    return (
        <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-30 px-4 py-3 flex justify-between items-center md:hidden">
            <Link to="/settings" className="p-2 text-gray-600 hover:bg-[#A7D189] hover:text-white rounded-full transition-colors bg-green-50">
                <User size={24} className="text-[#1A361D]" />
            </Link>

            <h1 className="text-lg font-semibold text-gray-800">{title}</h1>

            <button onClick={onMenuClick} className="p-2 text-gray-600 hover:bg-[#A7D189] hover:text-white rounded-full transition-colors">
                <Menu size={24} />
            </button>
        </header>
    );
};