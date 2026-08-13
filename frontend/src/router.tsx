import { Navigate, Route, Routes } from 'react-router-dom';
import { RequireAuth } from './auth/RequireAuth';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { CharacterListPage } from './pages/CharacterListPage';
import { CharacterDetailPage } from './pages/CharacterDetailPage';
import { LocationsListPage } from './pages/LocationsListPage';
import { LocationDetailPage } from './pages/LocationDetailPage';
import { EpisodesListPage } from './pages/EpisodesListPage';
import { EpisodeDetailPage } from './pages/EpisodeDetailPage';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/characters"
        element={
          <RequireAuth>
            <CharacterListPage />
          </RequireAuth>
        }
      />
      <Route
        path="/characters/:id"
        element={
          <RequireAuth>
            <CharacterDetailPage />
          </RequireAuth>
        }
      />
      <Route
        path="/locations"
        element={
          <RequireAuth>
            <LocationsListPage />
          </RequireAuth>
        }
      />
      <Route
        path="/locations/:id"
        element={
          <RequireAuth>
            <LocationDetailPage />
          </RequireAuth>
        }
      />
      <Route
        path="/episodes"
        element={
          <RequireAuth>
            <EpisodesListPage />
          </RequireAuth>
        }
      />
      <Route
        path="/episodes/:id"
        element={
          <RequireAuth>
            <EpisodeDetailPage />
          </RequireAuth>
        }
      />
      <Route path="/" element={<Navigate to="/characters" replace />} />
      <Route path="*" element={<Navigate to="/characters" replace />} />
    </Routes>
  );
}
