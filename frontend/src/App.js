import React, {useEffect} from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from './store/hooks';
import {loadUser} from './store/slices/authSlice';
import {useToast} from './store/hooks';
import ToastContainer from './components/ToastContainer';
import {setToastFunctions} from './services/api';
import PrivateRoute from './components/PrivateRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyOtp from './pages/VerifyOtp';
import Dashboard from './pages/Dashboard';
import FamilyMembers from './pages/FamilyMembers';
import FamilyMemberForm from './pages/FamilyMemberForm';
import FamilyMemberDetail from './pages/FamilyMemberDetail';
import HealthRecords from './pages/HealthRecords';
import HealthRecordForm from './pages/HealthRecordForm';
import Medications from './pages/Medications';
import MedicationForm from './pages/MedicationForm';
import MedicationReminders from './pages/MedicationReminders';
import Profile from './pages/Profile';

function AppContent() {
  const dispatch = useAppDispatch();
  const {toasts, removeToast, showSuccess, showError, showWarning, showInfo} = useToast();
  const {token, loading} = useAppSelector((state) => state.auth);

  // Load user on mount if token exists
  useEffect(() => {
    if (token) {
      dispatch(loadUser());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, dispatch]);

  // Set toast functions for API interceptor
  useEffect(() => {
    setToastFunctions({
      showSuccess,
      showError,
      showWarning,
      showInfo,
    });
  }, [showSuccess, showError, showWarning, showInfo]);

  return (
    <>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          {/* Family Members Routes */}
          <Route
            path="/family-members"
            element={
              <PrivateRoute>
                <FamilyMembers />
              </PrivateRoute>
            }
          />
          <Route
            path="/family-members/new"
            element={
              <PrivateRoute>
                <FamilyMemberForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/family-members/:id"
            element={
              <PrivateRoute>
                <FamilyMemberDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/family-members/:id/edit"
            element={
              <PrivateRoute>
                <FamilyMemberForm />
              </PrivateRoute>
            }
          />

          {/* Health Records Routes */}
          <Route
            path="/health-records"
            element={
              <PrivateRoute>
                <HealthRecords />
              </PrivateRoute>
            }
          />
          <Route
            path="/health-records/new"
            element={
              <PrivateRoute>
                <HealthRecordForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/health-records/:id/edit"
            element={
              <PrivateRoute>
                <HealthRecordForm />
              </PrivateRoute>
            }
          />

          {/* Medications Routes */}
          <Route
            path="/medications"
            element={
              <PrivateRoute>
                <Medications />
              </PrivateRoute>
            }
          />
          <Route
            path="/medications/new"
            element={
              <PrivateRoute>
                <MedicationForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/medications/:id/edit"
            element={
              <PrivateRoute>
                <MedicationForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/medications/:id/reminders"
            element={
              <PrivateRoute>
                <MedicationReminders />
              </PrivateRoute>
            }
          />

          {/* Profile Route */}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
}

function App() {
  return <AppContent />;
}

export default App;
