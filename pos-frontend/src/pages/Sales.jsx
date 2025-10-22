import { useEffect, useState } from 'react';
import api from '../services/api';
import { Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

export default function Sales() {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    api.get('/sales')
      .then(res => setSales(res.data))
      .catch(err => console.error('Error al obtener ventas', err));
  }, []);

  return (
    <Paper sx={{ m: 3, p: 3 }}>
      <Typography variant="h4" gutterBottom>Historial de Ventas</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Producto</TableCell>
            <TableCell>Cantidad</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Fecha</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sales.map((s, i) => (
            <TableRow key={i}>
              <TableCell>{s.product_name}</TableCell>
              <TableCell>{s.quantity}</TableCell>
              <TableCell>${s.total}</TableCell>
              <TableCell>{s.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
