import { Route, Routes } from 'react-router'
import './App.css'
import Home from './pages/Home'
import { Login } from './pages/Login'
import Layout from './components/Layout'
import { AuthProvider } from './context/AuthContext'
import { Register } from './pages/Register'
import { PrivateRoute } from './components/PrivateRoute'
import { AdminRoute } from './components/AdminRoute'
import Profile from './pages/Profile'
import BlogDetail from './pages/BlogDetail'
import Blogs from './pages/Blogs'
import DashboardHome from './components/admin/DashboardHome'
import AdminLayout from './components/admin/AdminLayout'
import UserManagement from './components/admin/UserManagement'
import BlogManagement from './components/admin/BlogManagement'
import Settings from './components/admin/Settings'
import ScrollToTop from './components/ScrollToTop'

function App() {

  return (
    <AuthProvider>
      <ScrollToTop />
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/blogs' element={<Blogs />} />
          <Route path='/blog/:slug' element={<BlogDetail />} />

          <Route element={<PrivateRoute />}>
            <Route path='/profile' element={<Profile />} />
          </Route>
        </Route>

        <Route path="/admin" element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="blogs" element={<BlogManagement />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App
