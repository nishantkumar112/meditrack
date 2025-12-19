import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import Layout from '../components/Layout';
import {dashboardAPI} from '../services/api';

const Dashboard = () => {
  const [familyMembers, setFamilyMembers] = useState([]);
  const [upcomingReminders, setUpcomingReminders] = useState([]);
  const [recentHealthRecords, setRecentHealthRecords] = useState([]);
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalMedications: 0,
    totalRecords: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await dashboardAPI.getDashboard();
      const dashboard = response.data;

      // Set statistics
      if (dashboard.stats) {
        setStats({
          totalMembers: dashboard.stats.totalMembers || 0,
          totalMedications: dashboard.stats.totalMedications || 0,
          totalRecords: dashboard.stats.totalHealthRecords || 0,
        });
      }

      // Set family members
      setFamilyMembers(dashboard.recentFamilyMembers || []);

      // Set upcoming reminders
      setUpcomingReminders(dashboard.upcomingReminders || []);

      // Set recent health records
      setRecentHealthRecords(dashboard.recentHealthRecords || []);
    } catch (error) {
      console.error('Failed to load dashboard data', error);
      setError('Failed to load dashboard data. Please try again.');
      if (error.response?.status === 401) {
        // Auth error will be handled by interceptor
        return;
      }
    } finally {
      setLoading(false);
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
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-sm text-gray-700">
            Overview of your health tracking
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Family Members
                    </dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {stats.totalMembers || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-indigo-600"
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
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Medications
                    </dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {stats.totalMedications || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Health Records
                    </dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {stats.totalRecords || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Family Members */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Family Members
              </h2>
              <Link
                to="/family-members/new"
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Add New
              </Link>
            </div>
            {familyMembers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">
                  No family members added yet.
                </p>
                <Link
                  to="/family-members/new"
                  className="inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 text-sm font-medium"
                >
                  Add Family Member
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {familyMembers.map((member) => (
                  <Link
                    key={member.id}
                    to={`/family-members/${member.id}`}
                    className="block border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="font-semibold text-gray-900">
                      {member.firstName} {member.lastName}
                    </h3>
                    {member.relationship && (
                      <p className="text-sm text-gray-500">
                        {member.relationship}
                      </p>
                    )}
                  </Link>
                ))}
                {stats.totalMembers > familyMembers.length && (
                  <Link
                    to="/family-members"
                    className="block text-center text-indigo-600 hover:text-indigo-800 text-sm font-medium py-2"
                  >
                    View All ({stats.totalMembers})
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Upcoming Reminders */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Upcoming Reminders
              </h2>
              <Link
                to="/medications"
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
              >
                View All
              </Link>
            </div>
            {upcomingReminders.length === 0 ? (
              <p className="text-gray-500">No upcoming reminders</p>
            ) : (
              <div className="space-y-3">
                {upcomingReminders.map((reminder, idx) => (
                  <div
                    key={idx}
                    className="border-l-4 border-indigo-500 pl-3 py-2"
                  >
                    <p className="font-medium text-sm text-gray-900">
                      {reminder.medicationName || 'Unknown Medication'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {reminder.familyMemberName || 'Unknown'}
                    </p>
                    <p className="text-xs text-indigo-600 font-medium">
                      {(() => {
                        const timeStr =
                          typeof reminder.reminderTime === 'string'
                            ? reminder.reminderTime
                            : reminder.reminderTime?.toString() || 'N/A';
                        return timeStr.includes(':')
                          ? timeStr.substring(0, 5)
                          : timeStr;
                      })()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Health Records */}
          <div className="bg-white shadow rounded-lg p-6 lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Recent Health Records
              </h2>
              <Link
                to="/health-records"
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
              >
                View All
              </Link>
            </div>
            {recentHealthRecords.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No health records yet.</p>
                <Link
                  to="/health-records/new"
                  className="inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 text-sm font-medium"
                >
                  Add Health Record
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentHealthRecords.map((record) => (
                  <div key={record.id} className="border rounded-lg p-4">
                    <h3 className="font-medium text-gray-900">
                      {record.title || record.recordType}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {record.recordType}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(
                        record.recordedDate || record.recordDate
                      ).toLocaleDateString()}
                    </p>
                    {record.value && (
                      <p className="text-sm font-medium text-indigo-600 mt-1">
                        {record.value} {record.unit || ''}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
