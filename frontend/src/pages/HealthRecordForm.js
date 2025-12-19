import React, {useState, useEffect, useRef} from 'react';
import {useNavigate, useParams, useSearchParams} from 'react-router-dom';
import Layout from '../components/Layout';
import {useToast} from '../context/ToastContext';
import {healthRecordAPI, familyMemberAPI, suggestionAPI} from '../services/api';

const HealthRecordForm = () => {
  const {id} = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [familyMembers, setFamilyMembers] = useState([]);
  const [testSuggestions, setTestSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef(null);
  const [formData, setFormData] = useState({
    familyMemberId: searchParams.get('familyMemberId') || '',
    recordType: '',
    title: '',
    recordedDate: new Date().toISOString().split('T')[0],
    value: '',
    unit: '',
    description: '',
    doctorName: '',
    notes: '',
  });

  useEffect(() => {
    loadFamilyMembers();
    if (isEdit) {
      loadRecord();
    }
  }, [id, isEdit]);

  useEffect(() => {
    // Close suggestions when clicking outside
    const handleClickOutside = (event) => {
      if (
        suggestionRef.current &&
        !suggestionRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadFamilyMembers = async () => {
    try {
      const response = await familyMemberAPI.getAll();
      setFamilyMembers(response.data);
    } catch (err) {
      console.error('Failed to load family members', err);
    }
  };

  const loadRecord = async () => {
    try {
      const response = await healthRecordAPI.getById(id);
      const record = response.data;
      setFormData({
        familyMemberId: record.familyMemberId || '',
        recordType: record.recordType || '',
        title: record.title || '',
        recordedDate: record.recordedDate
          ? record.recordedDate.split('T')[0]
          : '',
        value: record.value || '',
        unit: record.unit || '',
        description: record.description || '',
        doctorName: record.doctorName || '',
        notes: record.notes || '',
      });
    } catch (err) {
      setError('Failed to load health record');
    }
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
    setError('');

    // Load medical test suggestions when typing in title field
    if (e.target.name === 'title' && e.target.value.length > 0) {
      loadTestSuggestions(e.target.value);
      setShowSuggestions(true);
    } else if (e.target.name === 'title' && e.target.value.length === 0) {
      setShowSuggestions(false);
    }
  };

  const loadTestSuggestions = async (query) => {
    try {
      const response = await suggestionAPI.getMedicalTests(query);
      setTestSuggestions(response.data);
    } catch (err) {
      console.error('Failed to load test suggestions', err);
    }
  };

  const handleSuggestionClick = (test) => {
    setFormData({...formData, title: test});
    setShowSuggestions(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isEdit) {
        await healthRecordAPI.update(id, formData);
      } else {
        await healthRecordAPI.create(formData);
      }
      navigate('/health-records');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save health record');
    } finally {
      setLoading(false);
    }
  };

  const recordTypes = [
    'Blood Pressure',
    'Heart Rate',
    'Weight',
    'Height',
    'Temperature',
    'Blood Sugar',
    'Cholesterol',
    'Lab Results',
    'Vaccination',
    'Appointment',
    'Diagnosis',
    'Other',
  ];

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8 max-w-3xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? 'Edit Health Record' : 'Add Health Record'}
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            {isEdit
              ? 'Update health record information'
              : 'Record a new health measurement or event'}
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
              Title *
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              onFocus={() => {
                if (formData.title.length > 0) {
                  loadTestSuggestions(formData.title);
                  setShowSuggestions(true);
                }
              }}
              placeholder="e.g., Annual Checkup, Blood Pressure Reading"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            />
            <p className="mt-1 text-xs text-gray-500">
              A descriptive title for this health record (e.g., medical test
              name)
            </p>
            {showSuggestions && testSuggestions.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                {testSuggestions.map((test, index) => (
                  <div
                    key={index}
                    onClick={() => handleSuggestionClick(test)}
                    className="px-4 py-2 hover:bg-indigo-50 cursor-pointer text-sm text-gray-700 border-b border-gray-100 last:border-b-0"
                  >
                    {test}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Record Type *
              </label>
              <select
                name="recordType"
                required
                value={formData.recordType}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
              >
                <option value="">Select type</option>
                {recordTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date *
              </label>
              <input
                type="date"
                name="recordedDate"
                required
                value={formData.recordedDate}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Value
              </label>
              <input
                type="text"
                name="value"
                value={formData.value}
                onChange={handleChange}
                placeholder="e.g., 120/80"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Unit
              </label>
              <input
                type="text"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                placeholder="e.g., mmHg, kg, °F"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              rows={3}
              value={formData.description || ''}
              onChange={handleChange}
              placeholder="Detailed description of the health record..."
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Doctor Name
            </label>
            <input
              type="text"
              name="doctorName"
              value={formData.doctorName || ''}
              onChange={handleChange}
              placeholder="e.g., Dr. Smith"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              name="notes"
              rows={4}
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional notes or observations..."
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => navigate('/health-records')}
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

export default HealthRecordForm;
