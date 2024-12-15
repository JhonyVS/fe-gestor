import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { routes } from './AppRoutes';
import Top from './components/Header/Top';
import Menu from './components/Header/Menu';
import Footer from './components/Footer/Footer';

const AppContent: React.FC = () => {
  const location = useLocation();
  const excludedRoutes = ['/'];
  const show = !excludedRoutes.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {show && <Top />}
      {show && <Menu />}
      <div className="flex-grow">
        <Routes>
          {routes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Routes>
      </div>
      {show && <Footer />}
    </div>
  );
};

export default AppContent;
