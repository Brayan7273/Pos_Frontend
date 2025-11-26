import { useEffect, useState } from 'react';
// import api from '../services/api'; // <--- Eliminamos esta línea
import { 
  Paper, 
  Typography, 
  Table, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableBody,
  Button,
  Box,
  CircularProgress
} from '@mui/material';

export default function Sales() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado de error

  // 1. Separar la lógica de "fetch" en su propia función
  const fetchSales = () => {
    setLoading(true); // Indicar que estamos cargando
    // Reemplazamos api.get con fetch
    fetch('/sales')
      .then(response => {
        if (!response.ok) {
          throw new Error('Error de red al obtener ventas');
        }
        return response.json();
      })
      .then(data => {
        // 2. Ordenar por fecha, más reciente primero
        const sortedSales = data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setSales(sortedSales);
        setError(null); // Limpiar errores
      })
      .catch(err => {
        console.error('Error al obtener ventas', err);
        setError('No se pudo cargar el historial de ventas.');
      })
      .finally(() => {
        setLoading(false); // Dejar de cargar
      });
  };

  // 3. Cargar datos al montar el componente
  useEffect(() => {
    fetchSales();

    // 4. (Opcional) Volver a cargar si el usuario vuelve a esta pestaña
    window.addEventListener('focus', fetchSales);

    // 5. Limpiar el listener al desmontar
    return () => {
      window.removeEventListener('focus', fetchSales);
    };
  }, []); // El array vacío asegura que solo se corre al montar/desmontar

  return (
    <Paper sx={{ m: 3, p: 3, background: 'linear-gradient(145deg, #ffffff, #e6e6e6)', borderRadius: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" gutterBottom>Historial de Ventas</Typography>
        <Button variant="outlined" onClick={fetchSales} disabled={loading}>
          {loading ? 'Cargando...' : 'Actualizar'}
        </Button>
      </Box>
      
      {/* Mostrar estado de Carga */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Mostrar estado de Error */}
      {error && (
        <Typography color="error" sx={{ textAlign: 'center', my: 3 }}>
          {error}
        </Typography>
      )}

      {/* Mostrar si no hay ventas */}
      {!loading && !error && sales.length === 0 && (
        <Typography sx={{ textAlign: 'center', my: 3, color: 'gray' }}>
          Aún no se han registrado ventas.
        </Typography>
      )}

      {/* Mostrar la tabla si todo está bien */}
      {!loading && !error && sales.length > 0 && (
        <Table>
          <TableHead>
            <TableRow sx={{ '& > th': { fontWeight: 'bold', bgcolor: '#f5f5f5' } }}>
              <TableCell>Producto</TableCell>
              <TableCell>Cantidad</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Método de Pago</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sales.map((s, i) => (
              // Usar s.id de la base de datos si existe, es mejor que 'i'
              <TableRow key={s.id || i} sx={{ '&:nth-of-type(odd)': { bgcolor: '#fafafa' }, '&:hover': { bgcolor: '#f0f0f0' } }}>
                <TableCell>{s.product_name}</TableCell>
                <TableCell>{s.quantity}</TableCell>
                <TableCell>${s.total}</TableCell>
                {/* Formatear la fecha para que sea legible */}
                <TableCell>{new Date(s.date).toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' })}</TableCell>
                <TableCell>{s.payment_method || 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Paper>
  );
}