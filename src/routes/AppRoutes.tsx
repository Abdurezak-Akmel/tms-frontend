import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

// Public Pages
import LandingPage from '../pages/PublicPages/LandingPage';
import Register from '../pages/PublicPages/Register';
import ForgetPassword from '../pages/PublicPages/ForgetPassword';

// User Pages
import UserLogin from '../pages/UserPages/UserLogin';
import UserDashboard from '../pages/UserPages/UserDachboard';
import MyCourses from '../pages/UserPages/MyCourses';
import AddReceipt from '../pages/UserPages/AddReceipt';

// Admin Pages
import AdminLogin from '../pages/AdminPages/AdminLogin';
import AdminDashboard from '../pages/AdminPages/AdminDashboard';
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
        <Route path="/new-password" element={<NewPassword />} />

        {/* User Authentication Routes */}
        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Protected User Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/my-courses" element={<MyCourses />} />
          <Route path="/add-receipt" element={<AddReceipt />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Protected Admin Routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/roles" element={<Roles />} />
          <Route path="/admin/access-requests" element={<AccessRequests />} />
          <Route path="/admin/add-course" element={<AddCourse />} />
          <Route path="/admin/add-video" element={<AddVideo />} />
          <Route path="/admin/add-file" element={<AddFile />} />
        </Route>

        {/* Common Protected Routes (accessible to both users and admins) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CoursePreview />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/videos/:id" element={<VideoDisplay />} />
          <Route path="/files" element={<Files />} />
          <Route path="/files/:id" element={<FilePreview />} />
          <Route path="/receipts/:id" element={<ReceiptPreview />} />
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