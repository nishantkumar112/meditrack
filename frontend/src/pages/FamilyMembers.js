import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import Layout from '../components/Layout';
import {familyMemberAPI} from '../services/api';

const FamilyMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const response = await familyMemberAPI.getAll();
      setMembers(response.data);
    } catch (err) {
      setError('Failed to load family members');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm('Are you sure you want to delete this family member?')
    ) {
      return;
    }
    try {
      await familyMemberAPI.delete(id);
      loadMembers();
    } catch (err) {
      setError('Failed to delete family member');
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
            <h1 className="text-3xl font-bold text-gray-900">Family Members</h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage health records for your family members
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Link
              to="/family-members/new"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Add Family Member
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {members.length === 0 ? (
          <div className="text-center py-12">
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
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No family members
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding a family member.
            </p>
            <div className="mt-6">
              <Link
                to="/family-members/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Add Family Member
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((member) => (
              <div
                key={member.id}
                className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-indigo-600 text-lg font-semibold">
                          {member.firstName[0]}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        {member.firstName} {member.lastName}
                      </h3>
                      {member.relationship && (
                        <p className="text-sm text-gray-500">
                          {member.relationship}
                        </p>
                      )}
                      {member.dateOfBirth && (
                        <p className="text-xs text-gray-400 mt-1">
                          DOB:{' '}
                          {new Date(member.dateOfBirth).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-6 flex space-x-3">
                    <Link
                      to={`/family-members/${member.id}`}
                      className="flex-1 text-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => handleDelete(member.id)}
                      className="px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FamilyMembers;
