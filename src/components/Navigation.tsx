import React from 'react';
import { UserPlus, FileText } from 'lucide-react';
import logo from "../../screenshots/dana_logo.png"

interface NavigationProps {
  currentPage: 'entry' | 'records';
  onPageChange: (page: 'entry' | 'records') => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, onPageChange }) => {
  return (
    <>
      {/* Company Header */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-center gap-4">
            <img
              src={logo} // Your logo import
              alt="Company Logo"
              className="w-20 h-auto object-contain"
            />
            <div className="text-left">
              <h1 className="text-3xl font-extrabold tracking-wide leading-tight">DANA</h1>
              <p className="text-blue-200 text-sm font-medium">Visitor Management System</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-white shadow-lg border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-16">
            <div className="flex space-x-2 bg-gray-50 rounded-xl p-1">
              <button
                onClick={() => onPageChange('entry')}
                className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 ${
                  currentPage === 'entry'
                    ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-white hover:shadow-md'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>New Visitor</span>
              </button>
              
              <button
                onClick={() => onPageChange('records')}
                className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 ${
                  currentPage === 'records'
                    ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-white hover:shadow-md'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Today's Records</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;