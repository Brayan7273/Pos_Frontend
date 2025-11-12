import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductForm from './pages/ProductForm';
import Sales from './pages/Sales';
import Proveedor from './pages/Proveedor';
import CheckoutPage from './pages/CheckoutPage';
import Reportes from './pages/Reportes';
import SalesDashboard from './pages/SalesDashboard';
import RecommendationSystem from './pages/RecommendationSystem';
import DemandForecast from './pages/DemandForecast';
import ProductDetail from './pages/ProductDetail';

export default function App() {
  const location = useLocation();

  // rutas donde NO se mostrará el navbar
  const hideNavbarRoutes = ['/'];

  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/Proveedor" element={<Proveedor />} />
        <Route path="/Reportes" element={<Reportes />} />
        <Route path="/SalesDashboard" element={<SalesDashboard />} />
        <Route path="/RecommendationSystem" element={<RecommendationSystem />} />
        <Route path="/demand-forecast" element={<DemandForecast />} />
        <Route path="/products/new" element={<ProductForm />} />
         <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/checkoutPage" element={<CheckoutPage/>}/>
      </Routes>
    </>
  );
}
