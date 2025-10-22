import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';

export default function Navbar() {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#1565c0' }}>
      <Toolbar>
        <PointOfSaleIcon sx={{ mr: 1 }} />
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          POS System
        </Typography>
        <Button color="inherit" component={Link} to="/dashboard">Inicio</Button>
        <Button color="inherit" component={Link} to="/products">Productos</Button>
        <Button color="inherit" component={Link} to="/sales">Ventas</Button>
      </Toolbar>
    </AppBar>
  );
}
