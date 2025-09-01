import { useState } from 'react'

import './index.css'
import LoginPage from './pages/login.jsx'
import DashboardPage from './pages/admin/dashboard_page.jsx'
import DashboardBO from './pages/BO/dashboardBO.jsx'
import AddUser from './pages/admin/ajouter_user.jsx'
import Modifyuser from './pages/admin/modifier_user.jsx' 
import Produit from './pages/admin/produits.jsx'
import Addproduit from './pages/admin/ajouter_produit.jsx'
import Modifierproduit from './pages/admin/Modifier_produit.jsx'
import Stock from './pages/admin/Stock.jsx'
import AddStock from './pages/admin/Ajouter_stock.jsx'
import ModifierStock from './pages/admin/Modifier_stock.jsx'
import Vente from './pages/admin/Vente.jsx'
import Declarations from './pages/admin/Declarations.jsx'
import AjouterVente from './pages/admin/Ajouter_vente.jsx'
import ModifierVente from './pages/admin/modifier_vente.jsx'
import AjouterDeclarations from './pages/admin/Ajouter_declarations.jsx'
import DashboardSup from './pages/superviseur/dashboardsup.jsx'
import DashboardComm from './pages/commercial/dashboardcomm.jsx'
import OfflineMode from './pages/commercial/Offlinemode.jsx'
import AddVente from './pages/commercial/Addvente.jsx'
import StockAsawak from './pages/admin/Aswak.jsx'
import StockCarrefour from './pages/admin/Carrefour.jsx'
import ProtectedRoute from './Protectedroute.jsx'
import SearchAndFilter from './components/searchandfiltre.jsx'
import Couverture from './pages/admin/couverture.jsx'
import Sync from './pages/commercial/Sync.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
function App() {
  

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/dashboard/couverture" element={<ProtectedRoute><Couverture /></ProtectedRoute>} />
        <Route path="/dashboard/adduser" element={<ProtectedRoute><AddUser /></ProtectedRoute>} />
        <Route path="/dashboard/:id/modifier_user" element={<ProtectedRoute><Modifyuser /></ProtectedRoute>} />
        <Route path="/dashboard/produits" element={<ProtectedRoute><Produit /></ProtectedRoute>} />
        <Route path="/dashboard/ajouter_produit" element={<ProtectedRoute><Addproduit /></ProtectedRoute>} />
        <Route path="/dashboard/:id/modifier_produit" element={<ProtectedRoute><Modifierproduit /></ProtectedRoute>} />
        <Route path="/dashboard/stock" element={<ProtectedRoute><Stock /></ProtectedRoute>} />
        <Route path="/dashboard/stock_asawak" element={<ProtectedRoute><StockAsawak /></ProtectedRoute>} />
        <Route path="/dashboard/stock_carrefour" element={<ProtectedRoute><StockCarrefour /></ProtectedRoute>} />
        <Route path="/dashboard/ajouter_stock" element={<ProtectedRoute><AddStock /></ProtectedRoute>} />
        <Route path="/dashboard/:id/modifier_stock" element={<ProtectedRoute><ModifierStock /></ProtectedRoute>} />
        <Route path="/dashboard/vente" element={<ProtectedRoute><Vente /></ProtectedRoute>} />
        <Route path="/dashboard/declarations" element={<ProtectedRoute><Declarations /></ProtectedRoute>} />
        <Route path="/dashboard/ajouter_vente" element={<ProtectedRoute><AjouterVente /></ProtectedRoute>} />
        <Route path="/dashboard/:id/modifier_vente" element={<ProtectedRoute><ModifierVente /></ProtectedRoute>} />
        <Route path="/dashboard/ajouter_declarations" element={<ProtectedRoute><AjouterDeclarations /></ProtectedRoute>} />
        <Route path="/dashboard_superviseur" element={<ProtectedRoute><DashboardSup /></ProtectedRoute>} />
        <Route path="/dashboard_commercial" element={<ProtectedRoute><DashboardComm /></ProtectedRoute>} />
        <Route path="/dashboard_commercial/offline_mode" element={<ProtectedRoute><Sync /></ProtectedRoute>} />
        <Route path="/dashboard_commercial/add_vente" element={<ProtectedRoute><AddVente /></ProtectedRoute>} />
        <Route path="/dashboard_backoffice" element={<ProtectedRoute><DashboardBO /></ProtectedRoute>} />
        <Route path="/search_and_filter" element={<SearchAndFilter />} />
      </Routes>
    </Router>
  )
}

export default App
