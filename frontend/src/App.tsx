import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import { AuthProvider } from './contexts/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import Home from './pages/Home'
import Imoveis from './pages/Imoveis'
import CadastrarImovel from './pages/CadastrarImovel'
import EditarImovel from './pages/EditarImovel'
import DetalhesImovel from './pages/DetalhesImovel'
import Login from './pages/Login'
import Registro from './pages/Registro'
import AreaCorretor from './pages/AreaCorretor'
import EditarPerfil from './pages/EditarPerfil'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Rotas públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/imoveis" element={<Imoveis />} />
            <Route path="/imovel/:id" element={<DetalhesImovel />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            
            {/* Rotas protegidas - Área do Corretor */}
            <Route path="/area-corretor" element={<PrivateRoute><AreaCorretor /></PrivateRoute>} />
            <Route path="/cadastrar" element={<PrivateRoute><CadastrarImovel /></PrivateRoute>} />
            <Route path="/editar-imovel/:id" element={<PrivateRoute><EditarImovel /></PrivateRoute>} />
            <Route path="/editar-perfil" element={<PrivateRoute><EditarPerfil /></PrivateRoute>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App


