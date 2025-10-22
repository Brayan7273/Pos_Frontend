import { Card, CardContent, Typography, Button } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

export default function ProductCard({ product }) {
  return (
    <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6">{product.name}</Typography>
        <Typography color="text.secondary">Precio: ${product.price}</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddShoppingCartIcon />}
          sx={{ mt: 2 }}
          onClick={() => alert(`Agregado ${product.name}`)}
        >
          Agregar
        </Button>
      </CardContent>
    </Card>
  );
}
