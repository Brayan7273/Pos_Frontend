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
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            borderRadius: 3,
            border: '1px solid rgba(148,163,184,0.2)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            backdropFilter: 'blur(10px)',
            minWidth: 400,
          }
        }}
      >
        <DialogTitle
          id="logout-dialog-title"
          sx={{
            textAlign: 'center',
            fontWeight: 'bold',
            color: '#38bdf8',
            fontSize: '1.5rem',
            pb: 1,
            background: 'rgba(30, 41, 59, 0.8)',
          }}
        >
          Cerrar Sesión
        </DialogTitle>

        <DialogContent sx={{ pt: 3, pb: 2 }}>
          <DialogContentText
            sx={{
              textAlign: 'center',
              color: '#e2e8f0',
              fontSize: '1rem',
              lineHeight: 1.6,
            }}
          >
            ¿Estás seguro que deseas cerrar la sesión actual?
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{
          justifyContent: 'center',
          gap: 2,
          pb: 3,
          px: 3
        }}>
          <Button
            onClick={() => setLogoutOpen(false)}
            variant="outlined"
            sx={{
              color: '#94a3b8',
              borderColor: '#475569',
              borderRadius: 2,
              px: 3,
              py: 1,
              fontWeight: 'bold',
              '&:hover': {
                borderColor: '#64748b',
                backgroundColor: 'rgba(100, 116, 139, 0.1)',
              }
            }}
          >
            Cancelar
          </Button>

          <Button
            variant="contained"
            onClick={async () => {
              const token = localStorage.getItem('token');
              try {
                if (token) {
                  await api.post('/auth/logout', {}, {
                    headers: {
                      Authorization: `Bearer ${token}`
                    }
                  });
                  console.log('✅ Logout exitoso en backend');
                }
              } catch (err) {
                console.error('❌ Logout request failed', err);
              } finally {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                sessionStorage.clear();
                setLogoutOpen(false);
                navigate('/');
              }
            }}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
              fontWeight: 'bold',
              background: 'linear-gradient(90deg, #ef4444, #dc2626)',
              '&:hover': {
                background: 'linear-gradient(90deg, #dc2626, #b91c1c)',
                boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
              }
            }}
          >
            Cerrar Sesión
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