import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { mockProducts } from '../data/mockProducts.js';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todas');
  const [statusFilter, setStatusFilter] = useState('Todos');

  useEffect(() => {
    setProducts(mockProducts);
  }, []);

  const categories = ['Todas', ...new Set(mockProducts.map(p => p.category))];
  const statuses = ['Todos', 'Stock Normal', 'Stock Bajo', 'Stock Crítico'];

  const filteredProducts = products.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'Todas' || p.category === categoryFilter;
    const matchesStatus = statusFilter === 'Todos' || p.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Stock Normal':
        return { backgroundColor: '#e6f4ea', color: '#2e7d32' };
      case 'Stock Bajo':
        return { backgroundColor: '#fff3e0', color: '#ef6c00' };
      case 'Stock Crítico':
        return { backgroundColor: '#fdecea', color: '#c62828' };
      default:
        return {};
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      {/* Encabezado principal */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 3,
      }}>
        <Typography variant="h5" fontWeight="bold">
          Gestión de Inventario
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            textTransform: 'none',
            background: 'linear-gradient(to right, #6a11cb, #2575fc)',
            borderRadius: '12px',
            px: 3,
            '&:hover': {
              background: 'linear-gradient(to right, #5b0eb4, #1e63d6)',
            },
          }}
        >
          + Agregar Producto
        </Button>
      </Box>

      {/* Filtros */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          mb: 3,
          flexWrap: 'wrap',
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          label="🔍 Buscar producto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flex: 2, minWidth: '250px' }}
        />

        <TextField
          select
          label="Categoría"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          sx={{ minWidth: '180px' }}
        >
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>{cat}</MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Estado"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ minWidth: '180px' }}
        >
          {statuses.map((st) => (
            <MenuItem key={st} value={st}>{st}</MenuItem>
          ))}
        </TextField>
      </Box>

      {/* Tabla */}
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
        <Table>
          <TableHead sx={{
            background: 'linear-gradient(to right, #6a11cb, #2575fc)',
          }}>
            <TableRow>
              {['ID', 'PRODUCTO', 'CATEGORÍA', 'STOCK', 'PRECIO', 'ESTADO', 'ACCIONES'].map(header => (
                <TableCell key={header} sx={{ color: 'white', fontWeight: 'bold' }}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredProducts.map((p) => (
              <TableRow key={p.id}>
                <TableCell><strong>{p.id}</strong></TableCell>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.category}</TableCell>
                <TableCell sx={{ color: p.stock <= 10 ? 'error.main' : 'success.main' }}>
                  <strong>{p.stock}</strong>
                </TableCell>
                <TableCell>${p.price}</TableCell>
                <TableCell>
                  <Box
                    sx={{
                      display: 'inline-block',
                      px: 1.5,
                      py: 0.5,
                      borderRadius: '12px',
                      fontSize: '0.875rem',
                      fontWeight: 'bold',
                      ...getStatusStyle(p.status),
                    }}
                  >
                    {p.status}
                  </Box>
                </TableCell>
                <TableCell>
                  <IconButton sx={{ color: '#1976d2' }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton sx={{ color: '#d32f2f' }}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredProducts.length === 0 && (
        <Typography sx={{ mt: 4 }} color="text.secondary" align="center">
          No se encontraron productos.
        </Typography>
      )}
    </Box>
  );
}