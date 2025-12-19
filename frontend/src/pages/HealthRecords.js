import React, {useState, useEffect} from 'react';
import {Link, useSearchParams} from 'react-router-dom';
import Layout from '../components/Layout';
import {healthRecordAPI, familyMemberAPI} from '../services/api';

const HealthRecords = () => {
  const [searchParams] = useSearchParams();
  const familyMemberId = searchParams.get('familyMemberId');
  const [records, setRecords] = useState([]);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState(familyMemberId || 'all');

  useEffect(() => {
    loadData();
  }, [selectedMember]);

  const loadData = async () => {
    try {
      const [membersRes, recordsRes] = await Promise.all([
        familyMemberAPI.getAll(),
        selectedMember === 'all'
          ? healthRecordAPI.getAll()
          : healthRecordAPI.getAll(selectedMember),
      ]);
      setFamilyMembers(membersRes.data);
      setRecords(recordsRes.data);
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
    if (
      !window.confirm('Are you sure you want to delete this health record?')
    ) {
      return;
    }
    try {
      await healthRecordAPI.delete(id);
      loadData();
    } catch (err) {
      alert('Failed to delete health record');
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
            <h1 className="text-3xl font-bold text-gray-900">Health Records</h1>
            <p className="mt-2 text-sm text-gray-700">
              Track and manage health records for your family
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Link
              to="/health-records/new"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
            >
              Add Health Record
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

        {records.length === 0 ? (
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No health records
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding a health record.
            </p>
            <div className="mt-6">
              <Link
                to="/health-records/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Add Health Record
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {records.map((record) => {
              const member = familyMembers.find(
                (m) => m.id === record.familyMemberId
              );
              return (
                <div key={record.id} className="bg-white shadow rounded-lg p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {record.title || record.recordType}
                        </h3>
                        {member && (
                          <span className="text-sm text-gray-500">
                            ({member.firstName} {member.lastName})
                          </span>
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-gray-400">
                          Type: {record.recordType}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(
                            record.recordedDate || record.recordDate
                          ).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                        {record.value && (
                          <p className="text-sm font-medium text-indigo-600">
                            Value: {record.value} {record.unit || ''}
                          </p>
                        )}
                        {record.doctorName && (
                          <p className="text-sm text-gray-600">
                            Doctor: {record.doctorName}
                          </p>
                        )}
                        {record.description && (
                          <p className="text-sm text-gray-700 mt-2">
                            {record.description}
                          </p>
                        )}
                        {record.notes && (
                          <p className="text-sm text-gray-700 mt-2">
                            Notes: {record.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Link
                        to={`/health-records/${record.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(record.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
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

export default HealthRecords;
