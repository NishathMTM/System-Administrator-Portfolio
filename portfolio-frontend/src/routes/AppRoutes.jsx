import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate, Outlet } from 'react-router-dom';
import RouteScroll from '../components/RouteScroll';
import ProtectedRoute from './ProtectedRoute';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Home from '../pages/public/Home';
import About from '../pages/public/About';
import Projects from '../pages/public/projects';
import ProjectDetail from '../pages/public/ProjectDetail';
import Blogs from '../pages/public/Blogs';
import BlogDetail from '../pages/public/BlogDetail';
import Contact from '../pages/public/Contact';

const Login = lazy(() => import('../pages/Login'));
const AdminLayout = lazy(() => import('../components/AdminLayout'));
const Dashboard = lazy(() => import('../pages/admin/Dashboard'));
const ProfileManager = lazy(() => import('../pages/admin/ProfileManager'));
const ProjectsManager = lazy(() => import('../pages/admin/ProjectsManager'));
const BlogsManager = lazy(() => import('../pages/admin/BlogsManager'));
const ContactsManager = lazy(() => import('../pages/admin/ContactsManager'));

function PublicLayout() {
  return <><Navbar/><main id="main-content" tabIndex="-1"><Outlet/></main><Footer/></>;
}

export default function AppRoutes() {
  return <BrowserRouter><RouteScroll/><Suspense fallback={<div className="container page-shell" role="status">Loading…</div>}><Routes>
    <Route element={<PublicLayout/>}>
      <Route path="labs/:slug" element={<ProjectDetail/>}/>
      <Route index element={<Home/>}/><Route path="about" element={<About/>}/><Route path="projects" element={<Projects/>}/><Route path="projects/:slug" element={<ProjectDetail/>}/><Route path="blogs" element={<Blogs/>}/><Route path="blogs/:slug" element={<BlogDetail/>}/><Route path="contact" element={<Contact/>}/>
      <Route path="*" element={<div className="container page-shell"><p className="eyebrow">404 / CONNECTION NOT FOUND</p><h1 className="page-heading">A route worth retracing.</h1><p>This page could not be found.</p><Link to="/" className="btn btn-primary">Back to home</Link></div>}/>
    </Route>
    <Route path="login" element={<Navigate to="/admin/login" replace/>}/><Route path="admin/login" element={<Login/>}/>
    <Route path="admin" element={<ProtectedRoute><AdminLayout/></ProtectedRoute>}>
      <Route index element={<Dashboard/>}/><Route path="profile" element={<ProfileManager/>}/>
      <Route path="projects" element={<ProjectsManager/>}/><Route path="projects/create" element={<ProjectsManager mode="create"/>}/><Route path="projects/edit/:id" element={<ProjectsManager mode="edit"/>}/>
      <Route path="blogs" element={<BlogsManager/>}/><Route path="blogs/create" element={<BlogsManager mode="create"/>}/><Route path="blogs/edit/:id" element={<BlogsManager mode="edit"/>}/><Route path="contacts" element={<ContactsManager/>}/>
      <Route path="*" element={<Navigate to="/admin" replace/>}/>
    </Route>
  </Routes></Suspense></BrowserRouter>;
}
