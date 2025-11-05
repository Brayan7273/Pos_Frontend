import { useState } from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Box, IconButton, AppBar, Toolbar, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AssessmentIcon from '@mui/icons-material/Assessment';
import LogoutIcon from '@mui/icons-material/Logout';
import api from '../services/api';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const navigate = useNavigate();
  const drawerWidth = 240;

  const menuItems = [
    { text: 'Inicio', icon: <DashboardIcon />, path: '/home' },
    { text: 'Productos', icon: <InventoryIcon />, path: '/products' },
    { text: 'Ventas', icon: <ShoppingCartIcon />, path: '/sales' },
    { text: 'Proveedores', icon: <LocalShippingIcon />, path: '/Proveedor' },
    { text: 'Reportes', icon: <AssessmentIcon />, path: '/Reportes' },
    { text: 'Dashboard de Ventas', icon: <AssessmentIcon />, path: '/SalesDashboard' },
    { text: 'Sistema de Recomendaciones', icon: <AssessmentIcon />, path: '/RecommendationSystem' },
    { text: 'Pronóstico de Demanda', icon: <AssessmentIcon />, path: '/demand-forecast' },
    { text: 'Pagos', icon: <AssessmentIcon />, path: '/checkoutPage' }

  ];

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: '#1565c0' }}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <PointOfSaleIcon sx={{ mr: 1 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            POS System
          </Typography>
          {/* Logout button on the right */}
          <IconButton
            color="inherit"
            edge="end"
            onClick={() => setLogoutOpen(true)}
            aria-label="logout"
            sx={{ ml: 1 }}
          >
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Logout confirmation dialog */}
      <Dialog
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        aria-labelledby="logout-dialog-title"
      >
        <DialogTitle id="logout-dialog-title">Cerrar sesión</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro que deseas cerrar la sesión actual?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLogoutOpen(false)}>Cancelar</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={async () => {
              // Try to call backend logout, then clear local token and redirect
              const token = localStorage.getItem('token');
              try {
                if (token) {
                  await api.post('/logout', {}, { headers: { Authorization: `Bearer ${token}` } });
                }
              } catch (err) {
                // We still clear client-side auth even if backend call fails
                console.error('Logout request failed', err);
              }
              localStorage.removeItem('token');
              setLogoutOpen(false);
              navigate('/login');
            }}
          >
            Cerrar sesión
          </Button>
        </DialogActions>
      </Dialog>

      <Drawer
        anchor="left"
        open={open}
        onClose={toggleDrawer}
        sx={{
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            backgroundColor: '#1565c0',
            color: 'white',
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <PointOfSaleIcon />
          <Typography variant="h6">POS System</Typography>
        </Box>
        
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton 
                component={Link} 
                to={item.path}
                onClick={toggleDrawer}
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'white' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
}