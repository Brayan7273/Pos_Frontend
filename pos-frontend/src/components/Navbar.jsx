import { useState } from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Box, IconButton, AppBar, Toolbar } from '@mui/material';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AssessmentIcon from '@mui/icons-material/Assessment';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const drawerWidth = 240;

  const menuItems = [
    { text: 'Inicio', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Productos', icon: <InventoryIcon />, path: '/products' },
    { text: 'Ventas', icon: <ShoppingCartIcon />, path: '/sales' },
    { text: 'Proveedores', icon: <LocalShippingIcon />, path: '/Proveedor' },
    { text: 'Reportes', icon: <AssessmentIcon />, path: '/Reportes' }


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
        </Toolbar>
      </AppBar>

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