'use client';

import { useState } from 'react';

interface FormData {
  name: string;
  phone: string;
  date: string;
  time: string;
  type: string;
}

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    date: '',
    time: '',
    type: '',
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [summary, setSummary] = useState('');

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.type) {
      newErrors.type = 'Appointment type is required';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      if (selectedDate < today) {
        newErrors.date = 'Date cannot be in the past';
      }
    }

    if (!formData.time) {
      newErrors.time = 'Time is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const updatedFormData = {
      ...formData,
      [name]: value
    };
    setFormData(updatedFormData);

    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleGenerate = () => {
    if (validateForm()) {
      const appointmentDetails = getAppointmentTypeText(formData.type);
      const summaryText = `
Patient Details:
---------------
Appointment Type: ${appointmentDetails}
Description: ${getAppointmentDescription(formData.type)}
${formData.name ? `Name: ${formData.name}` : ''}
${formData.phone ? `Phone: ${formData.phone}` : ''}
${formData.date ? `Date: ${new Date(formData.date).toLocaleDateString()}` : ''}
${formData.time ? `Time: ${formData.time}` : ''}
      `.trim();
      
      setSummary(summaryText);
    }
  };

  const getAppointmentTypeText = (value: string): string => {
    const types: { [key: string]: string } = {
      'homevisit': 'Home Visit',
      'collect': 'Collect Hearing Aid',
      'fitting': 'Fitting Hearing Aid',
      'deposit-repair': 'Deposit Repair Hearing Aid',
      'impression': 'Impression Taking',
      'hospital-followup': 'Hospital Appointment Followup',
      'purchase': 'Hearing Aid Purchases'
    };
    return types[value] || value;
  };

  // Add this new function to provide descriptions
  const getAppointmentDescription = (value: string): string => {
    const descriptions: { [key: string]: string } = {
      'homevisit': 'Our specialist will visit your home for a hearing assessment.',
      'collect': 'Pick up your new or repaired hearing aid from our clinic.',
      'fitting': 'Get your hearing aid properly fitted and adjusted.',
      'deposit-repair': 'Leave your hearing aid for repair and maintenance.',
      'impression': 'Get ear impressions taken for custom hearing aids.',
      'hospital-followup': 'Follow-up consultation after hospital appointment.',
      'purchase': 'Consultation for new hearing aid purchase.'
    };
    return descriptions[value] || '';
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <main className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">GHCC Patient Appointment Form</h1>
        
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>

        <div>
            <label htmlFor="type" className="block mb-1 text-sm font-medium text-gray-700">
              Appointment Type
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange(e)}
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black ${
                errors.type ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select appointment type</option>
              <option value="homevisit">Home Visit</option>
              <option value="collect">Collect Hearing Aid</option>
              <option value="fitting">Fitting Hearing Aid</option>
              <option value="deposit-repair">Deposit Repair Hearing Aid</option>
              <option value="impression">Impression Taking</option>
              <option value="hospital-followup">Hospital Appointment Followup</option>
              <option value="purchase">Hearing Aid Purchases</option>
            </select>
            {errors.type && (
              <p className="mt-1 text-sm text-red-500">{errors.type}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-700">
              Patient Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block mb-1 text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
            )}
          </div>

          <div>
            <label htmlFor="date" className="block mb-1 text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black ${
                errors.date ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-500">{errors.date}</p>
            )}
          </div>

          <div>
            <label htmlFor="time" className="block mb-1 text-sm font-medium text-gray-700">
              Time
            </label>
            <input
              type="time"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black ${
                errors.time ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.time && (
              <p className="mt-1 text-sm text-red-500">{errors.time}</p>
            )}
          </div>          

          <button
            type="button"
            onClick={handleGenerate}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Generate Summary
          </button>

          {summary && (
            <div>
              <label htmlFor="summary" className="block mb-1 text-sm font-medium text-gray-700">
                Appointment Summary
              </label>
              <textarea
                id="summary"
                value={summary}
                readOnly
                className="w-full p-2 border border-gray-300 rounded-md h-32 bg-gray-50 text-black"
              />
            </div>
          )}
        </form>
      </main>
    </div>
  );
}
