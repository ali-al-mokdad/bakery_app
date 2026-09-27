import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Spinner from './components/Spinner';

import Home from './pages/Home';
import Menu from './pages/Menu';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

const Login = lazy(() => import('./pages/admin/Login'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const Categories = lazy(() => import('./pages/admin/Categories'));
const MenuItems = lazy(() => import('./pages/admin/MenuItems'));
const GalleryManagement = lazy(() => import('./pages/admin/GalleryManagement'));
const AdminSettings = lazy(() => import('./pages/admin/Settings'));
const ChangePassword = lazy(() => import('./pages/admin/ChangePassword'));

export default function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        {/* Public site */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* Admin auth */}
        <Route path="/admin/login" element={<Login />} />

        {/* Protected admin panel */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="categories" element={<Categories />} />
          <Route path="menu" element={<MenuItems />} />
          <Route path="gallery" element={<GalleryManagement />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="change-password" element={<ChangePassword />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
