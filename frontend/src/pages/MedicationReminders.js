import React, {useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import Layout from '../components/Layout';
import {medicationAPI} from '../services/api';

const MedicationReminders = () => {
  const {id} = useParams();
  const navigate = useNavigate();
  const [medication, setMedication] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    reminderTime: '',
    reminderType: 'BOTH',
    daysOfWeek: [],
  });
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const response = await medicationAPI.getById(id);
      setMedication(response.data);
      setReminders(response.data.reminders || []);
    } catch (err) {
      setError('Failed to load medication');
    } finally {
      setLoading(false);
    }
  };

  const handleDayToggle = (day) => {
    setFormData((prev) => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(day)
        ? prev.daysOfWeek.filter((d) => d !== day)
        : [...prev.daysOfWeek, day],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.daysOfWeek.length === 0) {
      setError('Please select at least one day');
      return;
    }

    try {
      await medicationAPI.createReminder(id, formData);
      setShowForm(false);
      setFormData({
        reminderTime: '',
        reminderType: 'BOTH',
        daysOfWeek: [],
      });
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create reminder');
    }
  };

  const handleDelete = async (reminderId) => {
    if (!window.confirm('Are you sure you want to delete this reminder?')) {
      return;
    }
    // Note: You may need to add a delete reminder endpoint
    try {
      // await medicationAPI.deleteReminder(id, reminderId);
      alert('Delete reminder functionality needs to be implemented in the API');
    } catch (err) {
      alert('Failed to delete reminder');
    }
  };

  const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="mb-6">
          <button
            onClick={() => navigate('/medications')}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium mb-4 inline-block"
          >
            ← Back to Medications
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Medication Reminders: {medication?.name}
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Set up reminders for {medication?.name} ({medication?.dosage})
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {!showForm ? (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Active Reminders
              </h2>
              <button
                onClick={() => setShowForm(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium"
              >
                Add Reminder
              </button>
            </div>

            {reminders.length === 0 ? (
              <div className="bg-white shadow rounded-lg p-12 text-center">
                <p className="text-gray-500 mb-4">No reminders set up yet</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Add your first reminder
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {reminders.map((reminder, idx) => (
                  <div key={idx} className="bg-white shadow rounded-lg p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {(() => {
                            const timeStr = typeof reminder.reminderTime === 'string' 
                              ? reminder.reminderTime 
                              : reminder.reminderTime?.toString() || 'N/A';
                            return timeStr.includes(':') 
                              ? timeStr.substring(0, 5) 
                              : timeStr;
                          })()}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Type: {reminder.reminderType || 'N/A'}
                        </p>
                        {reminder.daysOfWeek &&
                          reminder.daysOfWeek.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs text-gray-500 mb-1">
                                Days:
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {reminder.daysOfWeek.map((day, i) => (
                                  <span
                                    key={i}
                                    className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-indigo-100 text-indigo-800"
                                  >
                                    {day}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        <p className="text-sm text-gray-500 mt-2">
                          Status:{' '}
                          <span className="font-medium">{reminder.status}</span>
                        </p>
                      </div>
                      <button
                        onClick={() => handleDelete(reminder.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Add New Reminder
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Reminder Time *
                </label>
                <input
                  type="time"
                  name="reminderTime"
                  required
                  value={formData.reminderTime}
                  onChange={(e) =>
                    setFormData({...formData, reminderTime: e.target.value})
                  }
                  className="mt-1 block w-full max-w-xs border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notification Type *
                </label>
                <select
                  name="reminderType"
                  required
                  value={formData.reminderType}
                  onChange={(e) =>
                    setFormData({...formData, reminderType: e.target.value})
                  }
                  className="block w-full max-w-xs border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
                >
                  <option value="SMS">SMS Only</option>
                  <option value="EMAIL">Email Only</option>
                  <option value="BOTH">Both SMS & Email</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Days of Week *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {days.map((day) => (
                    <label
                      key={day}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.daysOfWeek.includes(day)}
                        onChange={() => handleDayToggle(day)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700">{day}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setFormData({
                      reminderTime: '',
                      reminderType: 'BOTH',
                      daysOfWeek: [],
                    });
                    setError('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Create Reminder
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MedicationReminders;
