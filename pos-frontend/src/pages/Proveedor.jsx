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
  Alert
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
  Badge as BadgeIcon
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

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
  
  const [formData, setFormData] = useState({
    nombre: '',
    numero: '',
    telefono: '',
    correoElectronico: '',
    direccion: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    // En producción: api.get('/proveedores').then(res => setProveedores(res.data))
    const ejemploProveedores = [
      {
        id: 1,
        nombre: 'Distribuidora López',
        numero: 'PROV-001',
        telefono: '4611234567',
        correoElectronico: 'contacto@lopez.com',
        direccion: 'Av. Principal 123, Celaya, Gto.'
      },
      {
        id: 2,
        nombre: 'Suministros García',
        numero: 'PROV-002',
        telefono: '4619876543',
        correoElectronico: 'ventas@garcia.com',
        direccion: 'Calle Comercio 45, Celaya, Gto.'
      },
      {
        id: 3,
        nombre: 'Importadora Martínez',
        numero: 'PROV-003',
        telefono: '4615551234',
        correoElectronico: 'info@martinez.com',
        direccion: 'Blvd. Industrial 890, Celaya, Gto.'
      }
    ];
    setProveedores(ejemploProveedores);
    setFilteredProveedores(ejemploProveedores);
  }, []);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredProveedores(proveedores);
    } else {
      const filtered = proveedores.filter(p => 
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.telefono.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.correoElectronico.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.direccion.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProveedores(filtered);
    }
  }, [searchTerm, proveedores]);

  const handleOpenDialog = (proveedor = null) => {
    if (proveedor) {
      setFormData(proveedor);
      setEditingId(proveedor.id);
    } else {
      setFormData({
        nombre: '',
        numero: '',
        telefono: '',
        correoElectronico: '',
        direccion: ''
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
      nombre: '',
      numero: '',
      telefono: '',
      correoElectronico: '',
      direccion: ''
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
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!formData.numero.trim()) newErrors.numero = 'El número es requerido';
    if (!formData.telefono.trim()) newErrors.telefono = 'El teléfono es requerido';
    if (!formData.correoElectronico.trim()) {
      newErrors.correoElectronico = 'El correo es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.correoElectronico)) {
      newErrors.correoElectronico = 'El correo no es válido';
    }
    if (!formData.direccion.trim()) newErrors.direccion = 'La dirección es requerida';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    if (editingId) {
      setProveedores(proveedores.map(p => 
        p.id === editingId ? { ...formData, id: editingId } : p
      ));
    } else {
      const nuevoProveedor = {
        ...formData,
        id: Date.now()
      };
      setProveedores([...proveedores, nuevoProveedor]);
    }
    handleCloseDialog();
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este proveedor?')) {
      setProveedores(proveedores.filter(p => p.id !== id));
    }
  };

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

          {/* Búsqueda */}
          <Paper sx={{ p: 2.5, mb: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
            <TextField
              fullWidth
              placeholder="Buscar por nombre o SKU..."
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
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Teléfono</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Correo</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Dirección</TableCell>
                  <TableCell align="center" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProveedores.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 8, borderBottom: 'none' }}>
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
                    <Fade in key={proveedor.id} timeout={300 + index * 100}>
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
                            label={proveedor.numero} 
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
                            {proveedor.nombre}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <PhoneIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                            <Typography color="text.secondary">
                              {proveedor.telefono}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <EmailIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                            <Typography color="text.secondary">
                              {proveedor.correoElectronico}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <LocationIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                            <Typography color="text.secondary">
                              {proveedor.direccion}
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
                              onClick={() => handleDelete(proveedor.id)}
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
                  label="Nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  error={!!errors.nombre}
                  helperText={errors.nombre}
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
                  label="Número de Proveedor"
                  name="numero"
                  value={formData.numero}
                  onChange={handleChange}
                  error={!!errors.numero}
                  helperText={errors.numero}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BadgeIcon sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    )
                  }}
                />

                <TextField
                  fullWidth
                  label="Teléfono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  error={!!errors.telefono}
                  helperText={errors.telefono}
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
                  name="correoElectronico"
                  type="email"
                  value={formData.correoElectronico}
                  onChange={handleChange}
                  error={!!errors.correoElectronico}
                  helperText={errors.correoElectronico}
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
                  name="direccion"
                  multiline
                  rows={3}
                  value={formData.direccion}
                  onChange={handleChange}
                  error={!!errors.direccion}
                  helperText={errors.direccion}
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
        </Container>
      </Box>
    </ThemeProvider>
  );
}