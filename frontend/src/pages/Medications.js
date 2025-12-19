import React, {useState, useEffect} from 'react';
import {Link, useSearchParams} from 'react-router-dom';
import Layout from '../components/Layout';
import {medicationAPI, familyMemberAPI} from '../services/api';

const Medications = () => {
  const [searchParams] = useSearchParams();
  const familyMemberId = searchParams.get('familyMemberId');
  const [medications, setMedications] = useState([]);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState(familyMemberId || 'all');

  useEffect(() => {
    loadData();
  }, [selectedMember]);

  const loadData = async () => {
    try {
      const [membersRes, medsRes] = await Promise.all([
        familyMemberAPI.getAll(),
        selectedMember === 'all'
          ? medicationAPI.getAll()
          : medicationAPI.getAll(selectedMember),
      ]);
      setFamilyMembers(membersRes.data);
      setMedications(medsRes.data);
    } catch (err) {
      console.error('Failed to load data', err);
      if (err.response?.status === 401) {
        // Auth error will be handled by interceptor
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this medication?')) {
      return;
    }
    try {
      await medicationAPI.delete(id);
      loadData();
    } catch (err) {
      alert('Failed to delete medication');
    }
  };

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
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center mb-6">
          <div className="sm:flex-auto">
            <h1 className="text-3xl font-bold text-gray-900">Medications</h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage medications and set up reminders
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Link
              to="/medications/new"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
            >
              Add Medication
            </Link>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Family Member
          </label>
          <select
            value={selectedMember}
            onChange={(e) => setSelectedMember(e.target.value)}
            className="block w-full max-w-xs border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
          >
            <option value="all">All Family Members</option>
            {familyMembers.map((member) => (
              <option key={member.id} value={member.id}>
                {member.firstName} {member.lastName}
              </option>
            ))}
          </select>
        </div>

        {medications.length === 0 ? (
          <div className="text-center py-12 bg-white shadow rounded-lg">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No medications
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding a medication.
            </p>
            <div className="mt-6">
              <Link
                to="/medications/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Add Medication
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {medications.map((med) => {
              const member = familyMembers.find(
                (m) => m.id === med.familyMemberId
              );
              return (
                <div key={med.id} className="bg-white shadow rounded-lg p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-medium text-gray-900">
                          {med.name}
                        </h3>
                        {member && (
                          <span className="text-sm text-gray-500">
                            ({member.firstName} {member.lastName})
                          </span>
                        )}
                      </div>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Dosage:</span>{' '}
                          {med.dosage}
                        </p>
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Frequency:</span>{' '}
                          {med.frequency}
                        </p>
                        {med.startDate && (
                          <p className="text-sm text-gray-500">
                            Started:{' '}
                            {new Date(med.startDate).toLocaleDateString()}
                          </p>
                        )}
                        {med.endDate && (
                          <p className="text-sm text-gray-500">
                            End Date:{' '}
                            {new Date(med.endDate).toLocaleDateString()}
                          </p>
                        )}
                        {med.prescribedBy && (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Prescribed by:</span>{' '}
                            {med.prescribedBy}
                          </p>
                        )}
                        {med.instructions && (
                          <p className="text-sm text-gray-600 mt-2">
                            {med.instructions}
                          </p>
                        )}
                      </div>
                      {med.reminders && med.reminders.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs font-medium text-gray-500 mb-1">
                            Reminders:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {med.reminders.map((reminder, idx) => {
                              const timeStr = typeof reminder.reminderTime === 'string' 
                                ? reminder.reminderTime 
                                : reminder.reminderTime?.toString() || 'N/A';
                              const formattedTime = timeStr.includes(':') 
                                ? timeStr.substring(0, 5) 
                                : timeStr;
                              return (
                                <span
                                  key={idx}
                                  className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-indigo-100 text-indigo-800"
                                  title={`Type: ${reminder.reminderType || 'N/A'}`}
                                >
                                  {formattedTime}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col space-y-2 ml-4">
                      <Link
                        to={`/medications/${med.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                      >
                        Edit
                      </Link>
                      <Link
                        to={`/medications/${med.id}/reminders`}
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                      >
                        Manage Reminders
                      </Link>
                      <button
                        onClick={() => handleDelete(med.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium text-left"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Medications;
