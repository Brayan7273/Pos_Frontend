import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import ProductForm from './pages/ProductForm';
import Sales from './pages/Sales';
import Proveedor from './pages/Proveedor';
import Reportes from './pages/Reportes';
import SalesDashboard from './pages/SalesDashboard';
import RecommendationSystem from './pages/RecommendationSystem';
import DemandForecast from './pages/DemandForecast';

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/Proveedor" element={<Proveedor />} />
        <Route path="/Reportes" element={<Reportes />} />
        <Route path="/SalesDashboard" element={<SalesDashboard />} />
        <Route path="/RecommendationSystem" element={<RecommendationSystem />} />
        <Route path="/demand-forecast" element={<DemandForecast />} />
        <Route path="/products/new" element={<ProductForm />} />
      </Routes>
    </>
  );
}
