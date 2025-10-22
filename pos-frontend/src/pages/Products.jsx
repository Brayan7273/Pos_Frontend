import { useEffect, useState } from 'react';
import api from '../services/api';
import { Grid, Typography } from '@mui/material';
import ProductCard from '../components/ProductCard';

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get('/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error('Error al obtener productos', err));
  }, []);

  return (
    <div style={{ padding: '24px' }}>
      <Typography variant="h4" gutterBottom>Productos</Typography>
      <Grid container spacing={2}>
        {products.map((p) => (
          <Grid item xs={12} sm={6} md={4} key={p.id}>
            <ProductCard product={p} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
