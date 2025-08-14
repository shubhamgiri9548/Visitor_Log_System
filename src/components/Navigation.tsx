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
      {/* <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white shadow-md">
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
      </div> */}

         {/* Company Header */}
      <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20"></div>
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center gap-6">
            {/* Logo Container with Glow Effect */}
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-300 blur-sm"></div>
              <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/20 shadow-2xl">
                <img
                  src={logo}
                  alt="Company Logo"
                  className="w-14 h-14 object-contain"
                />
              </div>
            </div>
            
            {/* Company Info */}
            <div className="text-center">
              <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent leading-tight">
                DANA
              </h1>
              <div className="flex items-center justify-center gap-2 mt-2">
                <div className="h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent flex-1 max-w-16"></div>
                <p className="text-blue-200 text-sm font-semibold tracking-wide uppercase px-3">
                  Visitor Management System
                </p>
                <div className="h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent flex-1 max-w-16"></div>
              </div>
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