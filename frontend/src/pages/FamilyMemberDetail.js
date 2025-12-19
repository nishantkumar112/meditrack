import React, {useState, useEffect} from 'react';
import {useParams, Link, useNavigate} from 'react-router-dom';
import Layout from '../components/Layout';
import {familyMemberAPI, healthRecordAPI, medicationAPI} from '../services/api';

const FamilyMemberDetail = () => {
  const {id} = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [healthRecords, setHealthRecords] = useState([]);
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [memberRes, recordsRes, medsRes] = await Promise.all([
        familyMemberAPI.getById(id),
        healthRecordAPI.getAll(id),
        medicationAPI.getAll(id),
      ]);
      setMember(memberRes.data);
      setHealthRecords(recordsRes.data);
      setMedications(medsRes.data);
    } catch (err) {
      console.error('Failed to load data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm('Are you sure you want to delete this family member?')
    ) {
      return;
    }
    try {
      await familyMemberAPI.delete(id);
      navigate('/family-members');
    } catch (err) {
      alert('Failed to delete family member');
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

  if (!member) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-500">Family member not found</p>
          <Link
            to="/family-members"
            className="text-indigo-600 hover:text-indigo-800"
          >
            Back to Family Members
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            to="/family-members"
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium mb-4 inline-block"
          >
            ← Back to Family Members
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {member.firstName} {member.lastName}
              </h1>
              {member.relationship && (
                <p className="text-sm text-gray-500 mt-1">
                  {member.relationship}
                </p>
              )}
            </div>
            <div className="flex space-x-3">
              <Link
                to={`/family-members/${id}/edit`}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Edit
              </Link>
              <button
                onClick={handleDelete}
                className="px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {['overview', 'health-records', 'medications'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`${
                  activeTab === tab
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
              >
                {tab.replace('-', ' ')}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Personal Information
                </h3>
                <dl className="space-y-2">
                  {member.dateOfBirth && (
                    <div>
                      <dt className="text-sm text-gray-500">Date of Birth</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {new Date(member.dateOfBirth).toLocaleDateString()}
                      </dd>
                    </div>
                  )}
                  {member.gender && (
                    <div>
                      <dt className="text-sm text-gray-500">Gender</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {member.gender}
                      </dd>
                    </div>
                  )}
                  {member.phoneNumber && (
                    <div>
                      <dt className="text-sm text-gray-500">Phone</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {member.phoneNumber}
                      </dd>
                    </div>
                  )}
                  {member.address && (
                    <div>
                      <dt className="text-sm text-gray-500">Address</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {member.address}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Emergency Contact
                </h3>
                <dl className="space-y-2">
                  {member.emergencyContact && (
                    <div>
                      <dt className="text-sm text-gray-500">Contact Name</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {member.emergencyContact}
                      </dd>
                    </div>
                  )}
                  {member.emergencyPhone && (
                    <div>
                      <dt className="text-sm text-gray-500">Contact Phone</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {member.emergencyPhone}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              {member.medicalHistory && (
                <div className="md:col-span-2">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Medical History
                  </h3>
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">
                    {member.medicalHistory}
                  </p>
                </div>
              )}

              {member.allergies && (
                <div className="md:col-span-2">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Allergies
                  </h3>
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">
                    {member.allergies}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'health-records' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Health Records
              </h2>
              <Link
                to={`/health-records/new?familyMemberId=${id}`}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium"
              >
                Add Health Record
              </Link>
            </div>
            {healthRecords.length === 0 ? (
              <div className="bg-white shadow rounded-lg p-12 text-center">
                <p className="text-gray-500">No health records yet</p>
                <Link
                  to={`/health-records/new?familyMemberId=${id}`}
                  className="mt-4 inline-block text-indigo-600 hover:text-indigo-800"
                >
                  Add your first health record
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {healthRecords.map((record) => (
                  <div
                    key={record.id}
                    className="bg-white shadow rounded-lg p-6"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {record.recordType}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(
                            record.recordedDate || record.recordDate
                          ).toLocaleDateString()}
                        </p>
                        {record.notes && (
                          <p className="text-sm text-gray-700 mt-2">
                            {record.notes}
                          </p>
                        )}
                      </div>
                      <Link
                        to={`/health-records/${record.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-800 text-sm"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'medications' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Medications
              </h2>
              <Link
                to={`/medications/new?familyMemberId=${id}`}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium"
              >
                Add Medication
              </Link>
            </div>
            {medications.length === 0 ? (
              <div className="bg-white shadow rounded-lg p-12 text-center">
                <p className="text-gray-500">No medications yet</p>
                <Link
                  to={`/medications/new?familyMemberId=${id}`}
                  className="mt-4 inline-block text-indigo-600 hover:text-indigo-800"
                >
                  Add your first medication
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {medications.map((med) => (
                  <div key={med.id} className="bg-white shadow rounded-lg p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {med.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {med.dosage} • {med.frequency}
                        </p>
                        {med.instructions && (
                          <p className="text-sm text-gray-700 mt-2">
                            {med.instructions}
                          </p>
                        )}
                      </div>
                      <Link
                        to={`/medications/${med.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-800 text-sm"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FamilyMemberDetail;
