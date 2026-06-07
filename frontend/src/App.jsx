import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import HubCentral from './pages/HubCentral'
import SqlEditor from './pages/SqlEditor'
import Leaderboard from './pages/Leaderboard'
import WorldMap from './pages/WorldMap'

// Relit localStorage à chaque navigation — évite le bug token lu une seule fois
function PrivateRoute({ element }) {
  return localStorage.getItem('token') ? element : <Navigate to="/login" />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"      element={<Login />} />
        <Route path="/hub"        element={<PrivateRoute element={<HubCentral />} />} />
        <Route path="/monde"      element={<PrivateRoute element={<WorldMap />} />} />
        <Route path="/editeur"    element={<PrivateRoute element={<SqlEditor />} />} />
        <Route path="/classement" element={<PrivateRoute element={<Leaderboard />} />} />
        <Route path="*"           element={<Navigate to={localStorage.getItem('token') ? '/hub' : '/login'} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
