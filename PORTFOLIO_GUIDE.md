# 🚀 React Portfolio Frontend

A modern, responsive portfolio frontend built with React, featuring a clean design with dark theme, professional components, and full integration capabilities with a backend API.

## ✨ Features

- **Modern UI Design**: Professional dark theme with gradient accents and smooth animations
- **Responsive Layout**: Fully responsive design that works on desktop, tablet, and mobile devices
- **Navigation**: Sticky navbar with active links and mobile hamburger menu
- **Public Pages**:
  - Home: Hero section with skills showcase and featured projects
  - About: Comprehensive bio, experience, education, and skills
  - Projects: Grid layout with project cards and details page
  - Blog: Article listing with detailed article view
  - Contact: Contact form with validation and error handling

- **Admin Dashboard**: Protected routes for authenticated users
- **API Integration**: Connected to backend API with fallback sample data
- **Proper Styling**: Custom CSS with CSS variables for easy theming
- **Dark Mode**: Modern dark interface with high contrast for readability

## 🛠️ Tech Stack

- **React** 19.2.0 - UI library
- **React Router** 7.13.1 - Client-side routing
- **Axios** 1.13.5 - HTTP client
- **Vite** - Build tool and dev server
- **CSS3** - Custom styling with variables

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Setup Steps

1. **Navigate to project directory**:
   ```bash
   cd c:\xampp\htdocs\React-portfolio-frontend\portfolio-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure API Endpoint** (if using a backend):
   - Create a `.env` file in the project root:
     ```
     VITE_API_URL=http://localhost:8000/api
     ```
   - Adjust the URL based on your backend server

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open in browser**:
   - Local: `http://localhost:5174/`
   - Network: Check terminal output for network URL

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   ├── Navbar.jsx      # Navigation component
│   └── Footer.jsx      # Footer component
├── pages/
│   ├── public/         # Public pages
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   ├── projects.jsx
│   │   ├── Blogs.jsx
│   │   ├── Contact.jsx
│   │   ├── ProjectDetail.jsx
│   │   └── BlogDetail.jsx
│   ├── admin/          # Admin pages (protected)
│   │   ├── Dashboard.jsx
│   │   ├── ProfileManager.jsx
│   │   ├── ProjectsManager.jsx
│   │   ├── BlogsManager.jsx
│   │   └── ContactsManager.jsx
│   └── Login.jsx       # Login page
├── routes/
│   ├── AppRoutes.jsx   # Route configuration
│   └── ProtectedRoute.jsx # Protected route wrapper
├── api/                # API calls
│   ├── axios.js        # Axios configuration
│   ├── auth.js         # Authentication endpoints
│   ├── projects.js     # Projects endpoints
│   ├── blogs.js        # Blogs endpoints
│   ├── contacts.js     # Contact form endpoint
│   └── profile.js      # Profile endpoint
├── context/
│   └── AuthContext.jsx # Authentication context
├── App.jsx             # Main app component
├── App.css             # Component-specific styles
├── index.css           # Global styles
└── main.jsx            # Entry point
```

## 🎨 Customization

### Colors & Theme
Edit the CSS variables in `src/index.css`:

```css
:root {
  --primary-color: #0066ff;      /* Main blue */
  --secondary-color: #00cc99;    /* Teal accent */
  --accent-color: #ff6b6b;       /* Red for calls-to-action */
  --dark-bg: #0f1419;            /* Main background */
  --card-bg: #1a1f2e;            /* Card background */
  --text-primary: #ffffff;       /* Main text */
  --text-secondary: #b0b9c1;     /* Secondary text */
}
```

### Content Updates
- **Home Page**: Edit [src/pages/public/Home.jsx](src/pages/public/Home.jsx)
- **About Page**: Edit [src/pages/public/About.jsx](src/pages/public/About.jsx)
- **Contact Links**: Update email and social links in [src/pages/public/Contact.jsx](src/pages/public/Contact.jsx)

## 🔗 API Integration

The frontend connects to a backend API. Ensure your backend provides these endpoints:

### Projects API
- `GET /api/projects` - Get all projects
- `GET /api/projects/{slug}` - Get project details
- POST/PUT/DELETE endpoints for admin

### Blogs API
- `GET /api/blogs` - Get all blogs
- `GET /api/blogs/{slug}` - Get blog details
- POST/PUT/DELETE endpoints for admin

### Contact API
- `POST /api/contacts` - Submit contact form

### Authentication API
- `GET /api/csrf-cookie` - Get CSRF token
- `POST /api/login` - Login
- `POST /api/logout` - Logout
- `GET /api/user` - Get current user

## 🏃 Running the Complete Project

### Frontend Only (Development)
```bash
npm run dev
```

### Frontend Build (Production)
```bash
npm run build
npm run preview
```

### With Backend (Full Stack)
1. **Terminal 1 - Frontend**:
   ```bash
   npm run dev
   # Runs on http://localhost:5174/
   ```

2. **Terminal 2 - Backend** (Laravel/Node.js):
   ```bash
   # Laravel example
   php artisan serve
   # Runs on http://localhost:8000/
   ```

Make sure your `.env` file has the correct `VITE_API_URL`.

## 📱 Features by Page

### Home Page
- Hero section with call-to-action buttons
- Skills showcase grid
- Featured projects display
- Case for taking action section

### About Page
- Personal bio and introduction
- Work experience timeline
- Education details
- Technical skills categorized by type

### Projects Page
- Grid layout showing all projects
- Project cards with images and descriptions
- Technology tags
- Links to detailed project pages

### Blog Page
- Article listing with publication dates
- Featured images
- Article previews
- Links to full articles

### Contact Page
- Contact form with validation
- Form submission handling
- Success/error messages
- Alternative contact methods

### Project/Blog Detail Pages
- Full content display
- Navigation back to listing
- Related content suggestions
- External links (GitHub, live demo, etc.)

## 🔐 Authentication

The app includes authentication via the `AuthContext` component:

- **Protected Routes**: Admin pages require login
- **CSRF Protection**: Integrated with Sanctum/Laravel CSRF
- **User State**: Available via `useAuth()` hook

Usage example:
```jsx
import { useAuth } from '../context/AuthContext';

const Component = () => {
  const { user, login, logout, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please log in</div>;
  
  return <div>Welcome, {user.name}</div>;
};
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

This creates a `dist/` folder ready to deploy to:
- Vercel
- Netlify
- GitHub Pages
- Traditional web hosting

### Environment Variables for Production
Create `.env.production` with:
```
VITE_API_URL=https://your-api-domain.com/api
```

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## ✅ Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🐛 Troubleshooting

### Port Already in Use
If port 5174 is in use, Vite will automatically try the next available port.

### API Connection Issues
1. Check if backend server is running
2. Verify API URL in environment variables
3. Check CORS settings on backend
4. Use sample data (built-in as fallback)

### Hot Module Replacement (HMR) Issues
Clear your browser cache and hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

### Build Errors
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [React Router](https://reactrouter.com)
- [Vite Guide](https://vitejs.dev)
- [Axios Documentation](https://axios-http.com)

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

---

**Frontend URL**: http://localhost:5174/
**Backend API**: http://localhost:8000/api (default)

Happy coding! 🎉
