import React, { useState } from 'react';
import { User, MapPin, Phone, FileText, Users, CheckCircle } from 'lucide-react';
import { FormData } from '../types/visitor';
import { saveVisitor } from '../utils/localStorage';
import { generateUniqueId } from '../utils/dateUtils';

const VisitorForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    address: '',
    mobileNumber: '',
    purpose: '',
    reference: ''
  });
  
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobileNumber.replace(/\D/g, ''))) {
      newErrors.mobileNumber = 'Please enter a valid 10-digit mobile number';
    }
    
    if (!formData.purpose.trim()) {
      newErrors.purpose = 'Purpose of visit is required';
    }
    
    if (!formData.reference.trim()) {
      newErrors.reference = 'Reference is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const visitor = {
      id: generateUniqueId(),
      ...formData,
      checkInTime: new Date().toISOString(),
      checkOutTime: null
    };
    
    saveVisitor(visitor);
    
    // Reset form
    setFormData({
      name: '',
      address: '',
      mobileNumber: '',
      purpose: '',
      reference: ''
    });
    
    setErrors({});
    setIsSubmitting(false);
    setShowSuccess(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center backdrop-blur-sm">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent mb-3">Visitor Registered Successfully!</h2>
            <p className="text-gray-600 mb-8 text-lg">The visitor has been checked in and added to today's records.</p>
            <button
              onClick={() => setShowSuccess(false)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Register Another Visitor
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 backdrop-blur-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Visitor Entry Form</h2>
            <p className="text-gray-600 mt-2 text-lg">Please fill in the visitor details below</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white ${
                  errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter full name"
              />
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Address
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                rows={3}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none bg-gray-50 focus:bg-white ${
                  errors.address ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter complete address"
              />
              {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-2" />
                Mobile Number
              </label>
              <input
                type="tel"
                value={formData.mobileNumber}
                onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white ${
                  errors.mobileNumber ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter 10-digit mobile number"
              />
              {errors.mobileNumber && <p className="text-red-600 text-sm mt-1">{errors.mobileNumber}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                Purpose of Visit
              </label>
              <input
                type="text"
                value={formData.purpose}
                onChange={(e) => handleInputChange('purpose', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white ${
                  errors.purpose ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="e.g., Business meeting, Interview, Delivery"
              />
              {errors.purpose && <p className="text-red-600 text-sm mt-1">{errors.purpose}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="w-4 h-4 inline mr-2" />
                Reference (Person to Meet)
              </label>
              <input
                type="text"
                value={formData.reference}
                onChange={(e) => handleInputChange('reference', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white ${
                  errors.reference ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter name of person to meet"
              />
              {errors.reference && <p className="text-red-600 text-sm mt-1">{errors.reference}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 px-4 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                isSubmitting
                  ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
              }`}
            >
              {isSubmitting ? 'Registering...' : 'Register Visitor'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VisitorForm;