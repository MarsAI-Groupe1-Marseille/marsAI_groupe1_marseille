import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/home.jsx';
import Galerie from './pages/galerie.jsx';
import Login from './pages/login.jsx';
import FilmDetail from './pages/film_detail.jsx';
import Dashboard from './pages/dashboard.jsx';
import DashboardUser from './pages/dashboardUser.jsx';
import Header from './components/Header.jsx'; // Import du Header
import Footer from './components/Footer.jsx'; // Import du Footer
import AdminHeader from './components/AdminHeader.jsx';
import JuryHeader from './components/JuryHeader.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import GestionFilms from './pages/gestion_film.jsx';
import DistributionJury from './pages/distribution_jury.jsx';
import './App.css'
import SubmissionForm from './pages/SubmissionForm.jsx';
import Forgotpass from './pages/forgotpass.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import NotationJury  from './pages/NotationJury.jsx';
import NotFound from './pages/NotFound.jsx';
import { useAuth } from './context/AuthContext.jsx';


function App() {
  const location = useLocation();
  const { user } = useAuth();

  const privateRoutes = [
    "/dashboard",
    "/dashboardUser",
    "/gestion-films",
    "/distribution_jury",
  ];

  const isPrivateRoute =
    privateRoutes.includes(location.pathname) ||
    location.pathname.startsWith("/notationjury/");

  const isPublicRoute = !isPrivateRoute;

  const renderHeader = () => {
    if (isPublicRoute) return <Header />;
    if (user?.role === "admin" || user?.role === "moderator") return <AdminHeader />;
    if (user?.role === "jury") return <JuryHeader />;
    return null;
  };

  return (
    <div className="App flex flex-col min-h-screen">
      {renderHeader()}
      
      <main className="grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/galerie" element={<Galerie />} />
          <Route path="/galerie/:id" element={<FilmDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path='/submission' element ={<SubmissionForm/>}/>
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/forgotpass" element={<Forgotpass />} />

          <Route
            path="/dashboard"
            element={(
              <ProtectedRoute allowedRoles={["admin", "moderator"]}>
                <Dashboard />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/dashboardUser"
            element={(
              <ProtectedRoute allowedRoles={["admin"]}>
                <DashboardUser />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/notationjury/:id"
            element={(
              <ProtectedRoute allowedRoles={["jury"]}>
                <NotationJury />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/gestion-films"
            element={(
              <ProtectedRoute allowedRoles={["admin", "moderator"]}>
                <GestionFilms />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/distribution_jury"
            element={(
              <ProtectedRoute allowedRoles={["admin", "moderator"]}>
                <DistributionJury />
              </ProtectedRoute>
            )}
          />
          <Route path="*" element={<NotFound />} />

        </Routes>

        </main>

        {isPublicRoute && <Footer />}
      </div>
    
  )
}

export default App;