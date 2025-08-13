import React, { useState, useEffect } from 'react';
import { FileText, LogOut, Clock, CheckCircle, Trash2, AlertTriangle } from 'lucide-react';
import { Visitor } from '../types/visitor';
import { getTodaysVisitors, updateVisitor, getVisitors } from '../utils/localStorage';
import { formatDateTime } from '../utils/dateUtils';


const TodaysRecords: React.FC = () => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadTodaysVisitors();
  }, []);

  const loadTodaysVisitors = () => {
    const todaysVisitors = getTodaysVisitors();
    setVisitors(todaysVisitors);
  };

  const handleDeleteAllRecords = async () => {
    setIsDeleting(true);
    
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Get all visitors and filter out today's visitors
    const allVisitors = getVisitors();
    const today = new Date().toDateString();
    
    const filteredVisitors = allVisitors.filter(visitor => {
      const checkInDate = new Date(visitor.checkInTime).toDateString();
      return checkInDate !== today;
    });
    
    // Save the filtered list back to localStorage
    localStorage.setItem('visitor_records', JSON.stringify(filteredVisitors));
    
    // Reload the visitors list
    loadTodaysVisitors();
    setShowDeleteConfirm(false);
    setIsDeleting(false);
  };


  const handleCheckOut = async (visitor: Visitor) => {
    setLoading(visitor.id);
    
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedVisitor = {
      ...visitor,
      checkOutTime: new Date().toISOString()
    };
    
    updateVisitor(updatedVisitor);
    loadTodaysVisitors();
    setLoading(null);
  };

  // Delete Confirmation Modal
  const DeleteConfirmModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Delete All Records</h3>
            <p className="text-sm text-gray-600">This action cannot be undone</p>
          </div>
        </div>
        
        <p className="text-gray-700 mb-6">
          Are you sure you want to delete all {visitors.length} visitor record{visitors.length !== 1 ? 's' : ''} for today? 
          This will permanently remove all check-in and check-out data.
        </p>
        
        <div className="flex space-x-3">
          <button
            onClick={() => setShowDeleteConfirm(false)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteAllRecords}
            disabled={isDeleting}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              isDeleting
                ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
          >
            {isDeleting ? 'Deleting...' : 'Delete All'}
          </button>
        </div>
      </div>
    </div>
  );
  if (visitors.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-12 text-center backdrop-blur-sm">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <FileText className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent mb-3">No Visitors Today</h2>
            <p className="text-gray-600 text-lg">There are no visitor records for today yet.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden backdrop-blur-sm">
          <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Today's Visitor Records</h2>
                  <p className="text-gray-600 text-lg">{visitors.length} visitor{visitors.length !== 1 ? 's' : ''} registered today</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                {/* Delete All Button */}
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete All</span>
                </button>
                
                {/* Total Visitors Circle */}
                <div className="w-28 h-28 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-full flex flex-col items-center justify-center shadow-xl border-4 border-white">
                  <span className="text-2xl font-bold text-white">{visitors.length}</span>
                  <span className="text-xs text-blue-100 font-semibold">Total</span>
                </div>
                
                {/* Checked In Circle */}
                <div className="w-24 h-24 bg-gradient-to-br from-green-500 via-green-600 to-green-700 rounded-full flex flex-col items-center justify-center shadow-lg border-4 border-white">
                  <span className="text-lg font-bold text-white">
                    {visitors.filter(v => !v.checkOutTime).length}
                  </span>
                  <span className="text-xs text-green-100 font-semibold">Active</span>
                </div>
                
                {/* Checked Out Circle */}
                <div className="w-24 h-24 bg-gradient-to-br from-gray-500 via-gray-600 to-gray-700 rounded-full flex flex-col items-center justify-center shadow-lg border-4 border-white">
                  <span className="text-lg font-bold text-white">
                    {visitors.filter(v => v.checkOutTime).length}
                  </span>
                  <span className="text-xs text-gray-100 font-semibold">Left</span>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Visitor Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact & Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Visit Information
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {visitors.map((visitor) => (
                  <tr key={visitor.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                          <span className="text-sm font-bold text-white">
                            {visitor.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{visitor.name}</div>
                          <div className="text-sm text-gray-500">ID: {visitor.id.slice(-8)}</div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{visitor.mobileNumber}</div>
                      <div className="text-sm text-gray-500 max-w-xs truncate" title={visitor.address}>
                        {visitor.address}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{visitor.purpose}</div>
                      <div className="text-sm text-gray-500">Meeting: {visitor.reference}</div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Clock className="w-4 h-4 mr-1 text-green-500" />
                        {formatDateTime(visitor.checkInTime)}
                      </div>
                      {visitor.checkOutTime && (
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          <LogOut className="w-4 h-4 mr-1 text-red-500" />
                          {formatDateTime(visitor.checkOutTime)}
                        </div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      {visitor.checkOutTime ? (
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          <span className="text-sm font-medium">Checked Out</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleCheckOut(visitor)}
                          disabled={loading === visitor.id}
                          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm leading-4 font-medium rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 ${
                            loading === visitor.id
                              ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                              : 'text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                          }`}
                        >
                          <LogOut className="w-4 h-4 mr-1" />
                          {loading === visitor.id ? 'Checking Out...' : 'Check Out'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    
    {/* Delete Confirmation Modal */}
    {showDeleteConfirm && <DeleteConfirmModal />}
    </>
  );
};

export default TodaysRecords;