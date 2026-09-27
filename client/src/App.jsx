import { Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Menu from './pages/Menu';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Categories from './pages/admin/Categories';
import MenuItems from './pages/admin/MenuItems';
import GalleryManagement from './pages/admin/GalleryManagement';
import AdminSettings from './pages/admin/Settings';
import ChangePassword from './pages/admin/ChangePassword';

export default function App() {
  return (
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
  );
}
