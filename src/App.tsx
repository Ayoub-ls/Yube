/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Outlet, Link } from 'react-router-dom';
import { db } from './lib/db';
import { Menu, X, Store, ArrowLeft } from 'lucide-react';
import { GA4_ID } from './lib/analytics';

// Import Pages
import MarketingHome from './pages/MarketingHome';
import Signup from './pages/Signup';
import Login from './pages/Login';
import DashboardOverview from './pages/DashboardOverview';
import DashboardPages from './pages/DashboardPages';
import DashboardOrders from './pages/DashboardOrders';
import DashboardSettings from './pages/DashboardSettings';
import AdminPanel from './pages/AdminPanel';
import PublicLandingPage from './pages/PublicLandingPage';
import PageBuilder from './components/builder/PageBuilder';
import Sidebar from './components/dashboard/Sidebar';

// Route Guard to protect auth screens
function ProtectedRoute() {
  const currentUser = db.auth.getCurrentUser();
  if (!currentUser) {
    return <Navigate to="/auth/login" replace />;
  }
  return <Outlet />;
}

// Master Layout with Sidebar for RTL Stores Dashboard
function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const client = db.auth.getCurrentUser();
  const adminEmail = (import.meta as any).env.VITE_ADMIN_EMAIL || 'ayoublamara52@gmail.com';

  const handleToggle = () => setMobileOpen(!mobileOpen);
  const handleClose = () => setMobileOpen(false);

  useEffect(() => {
    if (!client || !client.pixel_id) return;

    const scriptId = `fb-pixel-dashboard-${client.id}`;
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window,document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${client.pixel_id}');
        fbq('track', 'PageView');
      `;
      document.head.appendChild(script);

      // Noscript
      const noscript = document.createElement('noscript');
      noscript.id = `${scriptId}-noscript`;
      const img = document.createElement('img');
      img.height = 1;
      img.width = 1;
      img.style.display = 'none';
      img.src = `https://www.facebook.com/tr?id=${client.pixel_id}&ev=PageView&noscript=1`;
      noscript.appendChild(img);
      document.body.appendChild(noscript);
    }
  }, [client]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row-reverse text-right" dir="rtl">
      {/* Desktop Sidebar Panel */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Menu Slide Drawer Panel */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-row-reverse">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
            onClick={handleClose}
          />
          {/* Slide Drawer content */}
          <div className="relative z-50 h-full">
            <Sidebar onCloseMobile={handleClose} />
          </div>
        </div>
      )}

      {/* Main content viewport block */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile Header Bar */}
        <header className="md:hidden bg-slate-900 border-b border-slate-800 text-white h-16 px-4 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <button 
              onClick={handleToggle}
              className="p-2 text-slate-300 hover:text-white transition cursor-pointer"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="flex items-center gap-1.5">
              <div className="bg-emerald-500 text-slate-950 p-1 rounded-lg">
                <Store className="w-4 h-4" />
              </div>
              <span className="font-black text-sm text-white">Yube</span>
            </div>
          </div>

          <div className="text-left">
            <span className="text-xs bg-emerald-500/10 text-emerald-400 font-extrabold px-2.5 py-1 rounded-full capitalize">
              {client?.plan}
            </span>
          </div>
        </header>

        {/* Dynamic page content child slot */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  useEffect(() => {
    if (GA4_ID) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() {
        window.dataLayer.push(arguments);
      };
      window.gtag('js', new Date());
      window.gtag('config', GA4_ID, {
        page_path: window.location.pathname,
      });
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Marketing Home */}
        <Route path="/" element={<MarketingHome />} />

        {/* Authentication Routes */}
        <Route path="/auth/signup" element={<Signup />} />
        <Route path="/auth/login" element={<Login />} />

        {/* Protected Dashboard Container */}
        <Route path="/dashboard" element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route index element={<DashboardOverview />} />
            <Route path="pages" element={<DashboardPages />} />
            <Route path="pages/new" element={<PageBuilder />} />
            <Route path="orders" element={<DashboardOrders />} />
            <Route path="settings" element={<DashboardSettings />} />
          </Route>
        </Route>

        {/* Platform Administration Control center */}
        <Route path="/admin" element={<AdminPanel />} />

        {/* Dynamic Client Landing Page Checkout URL mapping */}
        <Route path="/:clientSlug/:pageSlug" element={<PublicLandingPage />} />

        {/* Catch-all fallback redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

