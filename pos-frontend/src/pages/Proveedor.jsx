import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  InputAdornment,
  Chip,
  Fade,
  Tooltip,
  Stack,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Business as BusinessIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Badge as BadgeIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import api from '../services/api';

// Tema oscuro personalizado
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4F7FFF',
      light: '#6B93FF',
      dark: '#3D67E6',
    },
    background: {
      default: '#0F1419',
      paper: '#1A2332',
    },
    text: {
      primary: '#E1E8F0',
      secondary: '#8B95A8',
    },
    success: {
      main: '#10B981',
    },
    warning: {
      main: '#F59E0B',
    },
    error: {
      main: '#EF4444',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

export default function Proveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [filteredProveedores, setFilteredProveedores] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    contact: '',
    email: '',
    address: ''
  });

  const [errors, setErrors] = useState({});

  // Cargar proveedores desde el backend
  const fetchProveedores = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/suppliers');
      setProveedores(response.data);
      setFilteredProveedores(response.data);
    } catch (err) {
      console.error('Error cargando proveedores:', err);
      setError('Error al cargar los proveedores');
      showSnackbar('Error al cargar los proveedores', 'error');
      
      // Datos de ejemplo como fallback
      const ejemploProveedores = [
        {
          supplier_id: 1,
          name: 'Distribuidora López',
          phone: '4611234567',
          contact: 'Juan López',
          email: 'contacto@lopez.com',
          address: 'Av. Principal 123, Celaya, Gto.'
        },
        {
          supplier_id: 2,
          name: 'Suministros García',
          phone: '4619876543',
          contact: 'María García',
          email: 'ventas@garcia.com',
          address: 'Calle Comercio 45, Celaya, Gto.'
        }
      ];
      setProveedores(ejemploProveedores);
      setFilteredProveedores(ejemploProveedores);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProveedores();
  }, []);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredProveedores(proveedores);
    } else {
      const filtered = proveedores.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.email && p.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.address && p.address.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredProveedores(filtered);
    }
  }, [searchTerm, proveedores]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpenDialog = (proveedor = null) => {
    if (proveedor) {
      setFormData({
        name: proveedor.name || '',
        phone: proveedor.phone || '',
        contact: proveedor.contact || '',
        email: proveedor.email || '',
        address: proveedor.address || ''
      });
      setEditingId(proveedor.supplier_id);
    } else {
      setFormData({
        name: '',
        phone: '',
        contact: '',
        email: '',
        address: ''
      });
      setEditingId(null);
    }
    setErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingId(null);
    setFormData({
      name: '',
      phone: '',
      contact: '',
      email: '',
      address: ''
    });
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.phone.trim()) newErrors.phone = 'El teléfono es requerido';
    if (!formData.contact.trim()) newErrors.contact = 'El contacto es requerido';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (editingId) {
        // Actualizar proveedor existente
        await api.put(`/suppliers/${editingId}`, formData);
        showSnackbar('Proveedor actualizado exitosamente', 'success');
      } else {
        // Crear nuevo proveedor
        await api.post('/suppliers', formData);
        showSnackbar('Proveedor creado exitosamente', 'success');
      }
      
      // Recargar la lista
      await fetchProveedores();
      handleCloseDialog();
      
    } catch (err) {
      console.error('Error guardando proveedor:', err);
      showSnackbar('Error al guardar el proveedor', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este proveedor?')) {
      try {
        await api.delete(`/suppliers/${id}`);
        showSnackbar('Proveedor eliminado exitosamente', 'success');
        await fetchProveedores();
      } catch (err) {
        console.error('Error eliminando proveedor:', err);
        showSnackbar('Error al eliminar el proveedor', 'error');
      }
    }
  };

  const generateSupplierNumber = (id) => {
    return `PROV-${String(id).padStart(3, '0')}`;
  };

  if (loading) {
    return (
      <ThemeProvider theme={darkTheme}>
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Stack alignItems="center" spacing={2}>
            <CircularProgress size={60} sx={{ color: 'primary.main' }} />
            <Typography variant="h6" color="text.primary">
              Cargando proveedores...
            </Typography>
          </Stack>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 4 }}>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
              <Box>
                <Typography variant="h4" fontWeight="bold" color="text.primary" mb={0.5}>
                  Gestión de Proveedores
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Administra tu red de proveedores
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
                size="large"
                sx={{
                  borderRadius: 2,
                  px: 3,
                  textTransform: 'none',
                  fontWeight: 600,
                  bgcolor: 'primary.main',
                  '&:hover': {
                    bgcolor: 'primary.dark'
                  }
                }}
              >
                Nuevo Proveedor
              </Button>
            </Stack>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Búsqueda */}
          <Paper sx={{ p: 2.5, mb: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
            <TextField
              fullWidth
              placeholder="Buscar por nombre, contacto o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                )
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  },
                }
              }}
            />
          </Paper>

          {/* Tabla */}
          <TableContainer 
            component={Paper} 
            sx={{ 
              borderRadius: 2,
              bgcolor: 'background.paper',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ 
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Número</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Nombre</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Contacto</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Teléfono</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Correo</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Dirección</TableCell>
                  <TableCell align="center" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProveedores.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 8, borderBottom: 'none' }}>
                      <BusinessIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.3, mb: 2 }} />
                      <Typography color="text.primary" variant="h6" mb={1}>
                        No se encontraron proveedores
                      </Typography>
                      <Typography color="text.secondary" variant="body2">
                        {searchTerm ? 'Intenta con otro término de búsqueda' : 'Comienza agregando tu primer proveedor'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProveedores.map((proveedor, index) => (
                    <Fade in key={proveedor.supplier_id} timeout={300 + index * 100}>
                      <TableRow 
                        hover
                        sx={{
                          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                          '&:hover': {
                            bgcolor: 'rgba(255, 255, 255, 0.03)'
                          }
                        }}
                      >
                        <TableCell>
                          <Chip 
                            label={generateSupplierNumber(proveedor.supplier_id)} 
                            size="small" 
                            sx={{
                              bgcolor: 'rgba(79, 127, 255, 0.15)',
                              color: 'primary.main',
                              fontWeight: 600,
                              border: '1px solid rgba(79, 127, 255, 0.3)'
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography fontWeight={600} color="text.primary">
                            {proveedor.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <PersonIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                            <Typography color="text.secondary">
                              {proveedor.contact}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <PhoneIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                            <Typography color="text.secondary">
                              {proveedor.phone}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <EmailIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                            <Typography color="text.secondary">
                              {proveedor.email || 'No especificado'}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <LocationIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                            <Typography color="text.secondary">
                              {proveedor.address || 'No especificada'}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="Editar">
                            <IconButton
                              onClick={() => handleOpenDialog(proveedor)}
                              size="small"
                              sx={{ 
                                color: 'primary.main',
                                '&:hover': { bgcolor: 'rgba(79, 127, 255, 0.1)' }
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Eliminar">
                            <IconButton
                              onClick={() => handleDelete(proveedor.supplier_id)}
                              size="small"
                              sx={{ 
                                color: 'error.main',
                                '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' }
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    </Fade>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Dialog */}
          <Dialog 
            open={openDialog} 
            onClose={handleCloseDialog} 
            maxWidth="sm" 
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 3,
                bgcolor: 'background.paper',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            <DialogTitle sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              pb: 2
            }}>
              <Box display="flex" alignItems="center" gap={1}>
                <BusinessIcon sx={{ color: 'primary.main' }} />
                <Typography variant="h6" fontWeight={600} color="text.primary">
                  {editingId ? 'Editar Proveedor' : 'Nuevo Proveedor'}
                </Typography>
              </Box>
              <IconButton onClick={handleCloseDialog} size="small">
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            
            <DialogContent sx={{ mt: 3 }}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Nombre del Proveedor"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BusinessIcon sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    )
                  }}
                />

                <TextField
                  fullWidth
                  label="Persona de Contacto"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  error={!!errors.contact}
                  helperText={errors.contact}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    )
                  }}
                />

                <TextField
                  fullWidth
                  label="Teléfono"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  error={!!errors.phone}
                  helperText={errors.phone}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    )
                  }}
                />

                <TextField
                  fullWidth
                  label="Correo Electrónico"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    )
                  }}
                />

                <TextField
                  fullWidth
                  label="Dirección"
                  name="address"
                  multiline
                  rows={3}
                  value={formData.address}
                  onChange={handleChange}
                  error={!!errors.address}
                  helperText={errors.address}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 2 }}>
                        <LocationIcon sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    )
                  }}
                />
              </Stack>
            </DialogContent>
            
            <DialogActions sx={{ p: 3, pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <Button 
                onClick={handleCloseDialog}
                variant="outlined"
                sx={{ 
                  textTransform: 'none', 
                  borderRadius: 2,
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'text.primary',
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    bgcolor: 'rgba(255, 255, 255, 0.05)'
                  }
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSubmit}
                variant="contained"
                sx={{ 
                  textTransform: 'none',
                  borderRadius: 2,
                  px: 3,
                  bgcolor: 'primary.main',
                  '&:hover': {
                    bgcolor: 'primary.dark'
                  }
                }}
              >
                {editingId ? 'Actualizar' : 'Guardar'}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Snackbar para notificaciones */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          >
            <Alert 
              severity={snackbar.severity} 
              onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Container>
      </Box>
    </ThemeProvider>
  );
}