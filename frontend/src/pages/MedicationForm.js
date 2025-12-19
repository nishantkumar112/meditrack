import React, {useState, useEffect, useRef} from 'react';
import {useNavigate, useParams, useSearchParams} from 'react-router-dom';
import Layout from '../components/Layout';
import {useToast} from '../context/ToastContext';
import {medicationAPI, familyMemberAPI, suggestionAPI} from '../services/api';

const MedicationForm = () => {
  const {id} = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [familyMembers, setFamilyMembers] = useState([]);
  const [medicineSuggestions, setMedicineSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef(null);
  const {showSuccess, showError} = useToast();
  const [formData, setFormData] = useState({
    familyMemberId: searchParams.get('familyMemberId') || '',
    name: '',
    dosage: '',
    frequency: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    instructions: '',
    prescribedBy: '',
  });

  useEffect(() => {
    loadFamilyMembers();
    if (isEdit) {
      loadMedication();
    }
    
    // Close suggestions when clicking outside
    const handleClickOutside = (event) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [id]);

  const loadFamilyMembers = async () => {
    try {
      const response = await familyMemberAPI.getAll();
      setFamilyMembers(response.data);
    } catch (err) {
      console.error('Failed to load family members', err);
    }
  };

  const loadMedication = async () => {
    try {
      const response = await medicationAPI.getById(id);
      const med = response.data;
      setFormData({
        familyMemberId: med.familyMemberId || '',
        name: med.name || '',
        dosage: med.dosage || '',
        frequency: med.frequency || '',
        startDate: med.startDate ? med.startDate.split('T')[0] : '',
        endDate: med.endDate ? med.endDate.split('T')[0] : '',
        instructions: med.instructions || '',
        prescribedBy: med.prescribedBy || '',
      });
    } catch (err) {
      setError('Failed to load medication');
    }
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
    setError('');
    
    // Load medicine suggestions when typing in name field
    if (e.target.name === 'name' && e.target.value.length > 0) {
      loadMedicineSuggestions(e.target.value);
      setShowSuggestions(true);
    } else if (e.target.name === 'name' && e.target.value.length === 0) {
      setShowSuggestions(false);
    }
  };
  
  const loadMedicineSuggestions = async (query) => {
    try {
      const response = await suggestionAPI.getMedicines(query);
      setMedicineSuggestions(response.data);
    } catch (err) {
      console.error('Failed to load medicine suggestions', err);
    }
  };
  
  const handleSuggestionClick = (medicine) => {
    setFormData({...formData, name: medicine});
    setShowSuggestions(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isEdit) {
        await medicationAPI.update(id, formData);
        // Success toast will be shown automatically by API interceptor
      } else {
        await medicationAPI.create(formData);
        // Success toast will be shown automatically by API interceptor
      }
      navigate('/medications');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to save medication';
      setError(errorMessage);
      // Error toast will be shown automatically by API interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8 max-w-3xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? 'Edit Medication' : 'Add Medication'}
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            {isEdit
              ? 'Update medication information'
              : 'Add a new medication and set up reminders'}
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow rounded-lg p-6 space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Family Member *
            </label>
            <select
              name="familyMemberId"
              required
              value={formData.familyMemberId}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            >
              <option value="">Select family member</option>
              {familyMembers.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.firstName} {member.lastName}
                </option>
              ))}
            </select>
          </div>

          <div className="relative" ref={suggestionRef}>
            <label className="block text-sm font-medium text-gray-700">
              Medication Name *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              onFocus={() => {
                if (formData.name.length > 0) {
                  loadMedicineSuggestions(formData.name);
                  setShowSuggestions(true);
                }
              }}
              placeholder="e.g., Aspirin, Metformin"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            />
            {showSuggestions && medicineSuggestions.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                {medicineSuggestions.map((medicine, index) => (
                  <div
                    key={index}
                    onClick={() => handleSuggestionClick(medicine)}
                    className="px-4 py-2 hover:bg-indigo-50 cursor-pointer text-sm text-gray-700 border-b border-gray-100 last:border-b-0"
                  >
                    {medicine}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Dosage *
              </label>
              <input
                type="text"
                name="dosage"
                required
                value={formData.dosage}
                onChange={handleChange}
                placeholder="e.g., 100mg, 1 tablet"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Frequency *
              </label>
              <input
                type="text"
                name="frequency"
                required
                value={formData.frequency}
                onChange={handleChange}
                placeholder="e.g., Once daily, Twice daily"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start Date *
              </label>
              <input
                type="date"
                name="startDate"
                required
                value={formData.startDate}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Prescribed By
            </label>
            <input
              type="text"
              name="prescribedBy"
              value={formData.prescribedBy}
              onChange={handleChange}
              placeholder="Doctor's name"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Instructions
            </label>
            <textarea
              name="instructions"
              rows={4}
              value={formData.instructions}
              onChange={handleChange}
              placeholder="Special instructions, side effects to watch for, etc."
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => navigate('/medications')}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Saving...' : isEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default MedicationForm;
