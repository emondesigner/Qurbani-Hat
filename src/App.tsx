import React from 'react';
import { RouterProvider, useRouter } from './lib/router-context';
import { AuthProvider } from './lib/auth-context';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { AllAnimalsPage } from './pages/AllAnimalsPage';
import { AnimalDetailsPage } from './pages/AnimalDetailsPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { MyProfilePage } from './pages/MyProfilePage';
import { UpdateProfilePage } from './pages/UpdateProfilePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AuthCallbackPage } from './pages/AuthCallbackPage';
import { Toaster } from 'sonner';

function AppContent() {
  const { path } = useRouter();

  const renderCurrentPage = () => {
    if (path === '/') {
      return <HomePage />;
    }
    if (path === '/animals') {
      return <AllAnimalsPage />;
    }
    if (path.startsWith('/details-page/')) {
      return <AnimalDetailsPage />;
    }
    if (path === '/login') {
      return <LoginPage />;
    }
    if (path === '/register') {
      return <RegisterPage />;
    }
    if (path === '/my-profile') {
      return <MyProfilePage />;
    }
    if (path === '/my-profile/update') {
      return <UpdateProfilePage />;
    }
    if (path === '/api/auth/callback/google' || path.startsWith('/auth/callback')) {
      return <AuthCallbackPage />;
    }
    return <NotFoundPage />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5] text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar />
      <main className="flex-1">
        {renderCurrentPage()}
      </main>
      <Footer />
      <Toaster 
        position="top-right" 
        richColors 
        closeButton 
        toastOptions={{
          style: {
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            borderRadius: '1rem',
          }
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider>
        <AppContent />
      </RouterProvider>
    </AuthProvider>
  );
}
