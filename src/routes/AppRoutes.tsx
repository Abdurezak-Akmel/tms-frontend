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
import NewPassword from '../pages/PublicPages/NewPassword';

// Layout
import { UserShell, AdminShell } from '../components/dashboard';

// User Pages
import UserDashboard from '../pages/UserPages/UserDachboard';
import MyCourses from '../pages/UserPages/MyCourses';
import AddReceipt from '../pages/UserPages/AddReceipt';
import Courses from '../pages/UserPages/Courses';
import UserCoursePreview from '../pages/UserPages/UserCoursePreview';
import Videos from '../pages/UserPages/Videos';
import VideoDisplay from '../pages/UserPages/VideoDisplay';
import Files from '../pages/UserPages/Files';
import FilePreview from '../pages/UserPages/FilePreview';
import BuyCourse from '../pages/UserPages/BuyCourse';

// Admin Pages
import AdminDashboard from '../pages/AdminPages/AdminDashboard';
import Analytics from '../pages/AdminPages/Analytics';
import Reports from '../pages/AdminPages/Reports';
import Users from '../pages/AdminPages/Users';
import Roles from '../pages/AdminPages/Roles';
import AccessRequests from '../pages/AdminPages/AccessRequests';
import AddCourse from '../pages/AdminPages/AddCourse';
import AddVideo from '../pages/AdminPages/AddVideo';
import AddFile from '../pages/AdminPages/AddFile';
import AdminCourses from '../pages/AdminPages/Courses';
import AdminCoursePreview from '../pages/AdminPages/CoursePreview';
import AdminVideos from '../pages/AdminPages/Videos';
import AdminVideoDisplay from '../pages/AdminPages/VideoDisplay';
import AdminFiles from '../pages/AdminPages/Files';
import AdminFilePreview from '../pages/AdminPages/FilePreview';
import UserUpdate from '../pages/AdminPages/UserUpdate';
import CreateRole from '../pages/AdminPages/CreateRole';
import UpdateRole from '../pages/AdminPages/UpdateRole';
import LandingVideo from '../pages/AdminPages/LandingVideo';
import LandingProject from '../pages/AdminPages/LandingProject';
import FAQPage from '../pages/AdminPages/FAQPage';
import Receipts from '../pages/AdminPages/Receipts';

// Common Pages
import Profile from '../pages/UserPages/Profile';



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
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* Authenticated learner workspace (sidebar + content) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<UserShell />}>
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/my-courses" element={<MyCourses />} />
            <Route path="/add-receipt" element={<AddReceipt />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<UserCoursePreview />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/videos/:id" element={<VideoDisplay />} />
            <Route path="/files" element={<Files />} />
            <Route path="/files/:id" element={<FilePreview />} />
            <Route path="/buy-course/:id" element={<BuyCourse />} />
          </Route>
        </Route>

        {/* Protected Admin Routes */}
        <Route element={<AdminRoute />}>
          <Route element={<AdminShell />}>
            <Route path="/admin/courses" element={<AdminCourses />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin/analytics" element={<Analytics />} />
            <Route path="/admin/reports" element={<Reports />} />
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/roles" element={<Roles />} />
            <Route path="/admin/access-requests" element={<AccessRequests />} />
            <Route path="/admin/add-course" element={<AddCourse />} />
            <Route path="/admin/add-video" element={<AddVideo />} />
            <Route path="/admin/add-file" element={<AddFile />} />
            <Route path="/admin/courses" element={<Courses />} />
            <Route path="/admin/videos" element={<AdminVideos />} />
            <Route path="/admin/profile" element={<Profile />} />
            <Route path="/admin/courses/:id" element={<AdminCoursePreview />} />
            <Route path="/admin/videos/:id" element={<AdminVideoDisplay />} />
            <Route path="/admin/files" element={<AdminFiles />} />
            <Route path="/admin/files/:id" element={<AdminFilePreview />} />
            <Route path="/admin/user-update/:id" element={<UserUpdate />} />
            <Route path="/admin/create-role" element={<CreateRole />} />
            <Route path="/admin/update-role/:id" element={<UpdateRole />} />
            <Route path="/admin/landing-video" element={<LandingVideo />} />
            <Route path="/admin/landing-project" element={<LandingProject />} />
            <Route path="/admin/faq" element={<FAQPage />} />
            <Route path="/admin/receipts" element={<Receipts />} />
          </Route>
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