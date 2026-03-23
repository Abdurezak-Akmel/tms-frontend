import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

// Public Pages
import LandingPage from '../pages/PublicPages/LandingPage';
import Register from '../pages/PublicPages/Register';
import ForgetPassword from '../pages/PublicPages/ForgetPassword';
import AdminLogin from '../pages/PublicPages/AdminLogin';
import UserLogin from '../pages/PublicPages/UserLogin';
import VerifyEmail from '../pages/PublicPages/VerifyEmail';

// Layout
import { UserShell } from '../components/dashboard';

// User Pages
import UserDashboard from '../pages/UserPages/UserDachboard';
import MyCourses from '../pages/UserPages/MyCourses';
import AddReceipt from '../pages/UserPages/AddReceipt';

// Admin Pages
import AdminDashboard from '../pages/AdminPages/AdminDashboard';
import Analytics from '../pages/AdminPages/Analytics';
import Reports from '../pages/AdminPages/Reports';
import Settings from '../pages/AdminPages/Settings';
import Users from '../pages/AdminPages/Users';
import Roles from '../pages/AdminPages/Roles';
import AccessRequests from '../pages/AdminPages/AccessRequests';
import AddCourse from '../pages/AdminPages/AddCourse';
import AddVideo from '../pages/AdminPages/AddVideo';
import AddFile from '../pages/AdminPages/AddFile';

// Common Pages
import Courses from '../pages/CommonPages/Courses';
import CoursePreview from '../pages/CommonPages/CoursePreview';
import Videos from '../pages/CommonPages/Videos';
import VideoDisplay from '../pages/CommonPages/VideoDisplay';
import Files from '../pages/CommonPages/Files';
import FilePreview from '../pages/CommonPages/FilePreview';
import Profile from '../pages/CommonPages/Profile';
import ReceiptPreview from '../pages/CommonPages/ReceiptPreview';
import NewPassword from '../pages/CommonPages/NewPassword';

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forget-password" element={<ForgetPassword />} />

        {/* User Authentication Routes */}
        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* Authenticated learner workspace (sidebar + content) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<UserShell />}>
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/my-courses" element={<MyCourses />} />
            <Route path="/add-receipt" element={<AddReceipt />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/new-password" element={<NewPassword />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CoursePreview />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/videos/:id" element={<VideoDisplay />} />
            <Route path="/files" element={<Files />} />
            <Route path="/files/:id" element={<FilePreview />} />
            <Route path="/receipts/:id" element={<ReceiptPreview />} />
          </Route>
        </Route>

        {/* Protected Admin Routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin/analytics" element={<Analytics />} />
          <Route path="/admin/reports" element={<Reports />} />
          <Route path="/admin/settings" element={<Settings />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/roles" element={<Roles />} />
          <Route path="/admin/access-requests" element={<AccessRequests />} />
          <Route path="/admin/add-course" element={<AddCourse />} />
          <Route path="/admin/add-video" element={<AddVideo />} />
          <Route path="/admin/add-file" element={<AddFile />} />
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
              <p className="text-gray-600">Page not found</p>
            </div>
          </div>} />
        </Routes>
    </Router>
  );
};

export default AppRoutes;