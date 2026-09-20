import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Public Pages
import Home from '../pages/public/Home';
import About from '../pages/public/About';
import Projects from '../pages/public/projects';
import ProjectDetail from '../pages/public/ProjectDetail';
import Blogs from '../pages/public/Blogs';
import BlogDetail from '../pages/public/BlogDetail';
import Contact from '../pages/public/Contact';
import Login from '../pages/Login';

// Admin Pages
import Dashboard from '../pages/admin/Dashboard';
import ProfileManager from '../pages/admin/ProfileManager';
import ProjectsManager from '../pages/admin/ProjectsManager';
import BlogsManager from '../pages/admin/BlogsManager';
import ContactsManager from '../pages/admin/ContactsManager';

const AppRoutes = () => {
    const { user } = useAuth();

    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:slug" element={<ProjectDetail />} />
                <Route path="/blogs" element={<Blogs />} />
                <Route path="/blogs/:slug" element={<BlogDetail />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />

                {/* Admin Routes */}
                <Route path="/admin" element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                } />
                <Route path="/admin/profile" element={
                    <ProtectedRoute>
                        <ProfileManager />
                    </ProtectedRoute>
                } />
                <Route path="/admin/projects" element={
                    <ProtectedRoute>
                        <ProjectsManager />
                    </ProtectedRoute>
                } />
                <Route path="/admin/projects/create" element={
                    <ProtectedRoute>
                        <ProjectsManager mode="create" />
                    </ProtectedRoute>
                } />
                <Route path="/admin/projects/edit/:id" element={
                    <ProtectedRoute>
                        <ProjectsManager mode="edit" />
                    </ProtectedRoute>
                } />
                <Route path="/admin/blogs" element={
                    <ProtectedRoute>
                        <BlogsManager />
                    </ProtectedRoute>
                } />
                <Route path="/admin/blogs/create" element={
                    <ProtectedRoute>
                        <BlogsManager mode="create" />
                    </ProtectedRoute>
                } />
                <Route path="/admin/blogs/edit/:id" element={
                    <ProtectedRoute>
                        <BlogsManager mode="edit" />
                    </ProtectedRoute>
                } />
                <Route path="/admin/contacts" element={
                    <ProtectedRoute>
                        <ContactsManager />
                    </ProtectedRoute>
                } />
            </Routes>
            <Footer />
        </BrowserRouter>
    );
};

export default AppRoutes;