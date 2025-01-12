import React from 'react';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import ActivitiesPage from './pages/ActivitiesPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailsPage from './pages/ProjectDetailsPage';
import TeamsPage from './pages/TeamsPage';
import UserProfile from './pages/UserProfile';
import NotFoundPage from './pages/NotFoundPage';
import NotAuthorizedPage from './pages/NotAuthorizedPage';
import ProjectDetailsAvancePage from './pages/ProjectDetailsAvancePage';

export const routes = [
  { path: "/", element: <LandingPage /> },
  { path: "/home", element: <HomePage /> },
  { path: "/activities", element: <ActivitiesPage /> },
  { path: "/projects", element: <ProjectsPage /> },
  { path: "/projects/:projectId", element: <ProjectDetailsPage /> },
  { path: "/projects/avance/:projectId", element: <ProjectDetailsAvancePage /> },
  { path: "/teams", element: <TeamsPage /> },
  { path: "/profile/:id", element: <UserProfile /> },
  { path: "/notauthorized", element: <NotAuthorizedPage /> },
  { path: "*", element: <NotFoundPage /> },
];
