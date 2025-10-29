import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  Stack,
  Grid,
  Card,
  CardContent,
  TextField,
  Chip,
  Tooltip,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon,
  ShoppingCart as CartIcon,
  Assessment as AssessmentIcon,
  CalendarToday as CalendarIcon,
  PictureAsPdf as PdfIcon,
  FileDownload as DownloadIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

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

export default function ReportesVentas() {
  const [periodo, setPeriodo] = useState('semana');
  const [categoria, setCategoria] = useState('todas');
  const [vendedor, setVendedor] = useState('todos');
  const [fechaInicio, setFechaInicio] = useState('2025-10-01');
  const [fechaFin, setFechaFin] = useState('2025-10-28');

  // Datos de ejemplo para las gráficas
  const ventasPorDia = [
    { fecha: 'Lun', ventas: 45000, cantidad: 23 },
    { fecha: 'Mar', ventas: 52000, cantidad: 28 },
    { fecha: 'Mié', ventas: 48000, cantidad: 25 },
    { fecha: 'Jue', ventas: 61000, cantidad: 32 },
    { fecha: 'Vie', ventas: 73000, cantidad: 38 },
    { fecha: 'Sáb', ventas: 85000, cantidad: 45 },
    { fecha: 'Dom', ventas: 67000, cantidad: 35 },
  ];

  const productosMasVendidos = [
    { nombre: 'Producto A', ventas: 15000, cantidad: 45 },
    { nombre: 'Producto B', ventas: 12000, cantidad: 38 },
    { nombre: 'Producto C', ventas: 10000, cantidad: 32 },
    { nombre: 'Producto D', ventas: 8000, cantidad: 28 },
    { nombre: 'Producto E', ventas: 7000, cantidad: 25 },
  ];

  const ventasPorCategoria = [
    { nombre: 'Electrónica', valor: 35, cantidad: 120000 },
    { nombre: 'Ropa', valor: 25, cantidad: 85000 },
    { nombre: 'Alimentos', valor: 20, cantidad: 68000 },
    { nombre: 'Hogar', valor: 12, cantidad: 41000 },
    { nombre: 'Otros', valor: 8, cantidad: 27000 },
  ];

  const COLORS = ['#4F7FFF', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const generarPDF = () => {
    alert('Generando reporte en PDF...\nEn producción, aquí se generaría el PDF con jsPDF o similar');
  };

  const exportarDatos = () => {
    alert('Exportando datos...\nEn producción, aquí se exportarían los datos a Excel/CSV');
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 4 }}>
        <Container maxWidth={false} sx={{ py: 4, px: 4 }}>
          
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between" spacing={2}>
              <Box>
                <Typography variant="h4" fontWeight="bold" color="text.primary" mb={0.5}>
                  Reportes de Ventas
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Análisis detallado y métricas de rendimiento
                </Typography>
              </Box>
              <Stack direction="row" spacing={2} sx={{ width: { xs: '100%', sm: 'auto' } }}>
                <Tooltip title="Exportar datos a Excel">
                  <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    onClick={exportarDatos}
                    fullWidth={window.innerWidth < 600}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'text.primary',
                      '&:hover': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        bgcolor: 'rgba(255, 255, 255, 0.05)'
                      }
                    }}
                  >
                    Exportar
                  </Button>
                </Tooltip>
                <Button
                  variant="contained"
                  startIcon={<PdfIcon />}
                  onClick={generarPDF}
                  fullWidth={window.innerWidth < 600}
                  sx={{
                    borderRadius: 2,
                    px: 3,
                    textTransform: 'none',
                    fontWeight: 600,
                    bgcolor: 'error.main',
                    '&:hover': {
                      bgcolor: '#dc2626'
                    }
                  }}
                >
                  Generar PDF
                </Button>
              </Stack>
            </Stack>
          </Box>

          {/* Filtros */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 2, bgcolor: 'background.paper', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
              <FilterIcon sx={{ color: 'primary.main' }} />
              <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                Filtros de Reporte
              </Typography>
            </Stack>
            
            <Grid container spacing={3} alignItems="flex-end">
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel id="periodo-label">Período</InputLabel>
                  <Select
                    labelId="periodo-label"
                    value={periodo}
                    label="Período"
                    onChange={(e) => setPeriodo(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                      }
                    }}
                  >
                    <MenuItem value="dia">Último día</MenuItem>
                    <MenuItem value="semana">Última semana</MenuItem>
                    <MenuItem value="mes">Último mes</MenuItem>
                    <MenuItem value="trimestre">Último trimestre</MenuItem>
                    <MenuItem value="año">Último año</MenuItem>
                    <MenuItem value="personalizado">Personalizado</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel id="categoria-label">Categoría</InputLabel>
                  <Select
                    labelId="categoria-label"
                    value={categoria}
                    label="Categoría"
                    onChange={(e) => setCategoria(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                      }
                    }}
                  >
                    <MenuItem value="todas">Todas las categorías</MenuItem>
                    <MenuItem value="electronica">Electrónica</MenuItem>
                    <MenuItem value="ropa">Ropa</MenuItem>
                    <MenuItem value="alimentos">Alimentos</MenuItem>
                    <MenuItem value="hogar">Hogar</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel id="vendedor-label">Vendedor</InputLabel>
                  <Select
                    labelId="vendedor-label"
                    value={vendedor}
                    label="Vendedor"
                    onChange={(e) => setVendedor(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                      }
                    }}
                  >
                    <MenuItem value="todos">Todos los vendedores</MenuItem>
                    <MenuItem value="juan">Juan Pérez</MenuItem>
                    <MenuItem value="maria">María García</MenuItem>
                    <MenuItem value="carlos">Carlos López</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {periodo === 'personalizado' && (
                <>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      fullWidth
                      label="Fecha Inicio"
                      type="date"
                      value={fechaInicio}
                      onChange={(e) => setFechaInicio(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          bgcolor: 'rgba(255, 255, 255, 0.05)',
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      fullWidth
                      label="Fecha Fin"
                      type="date"
                      value={fechaFin}
                      onChange={(e) => setFechaFin(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          bgcolor: 'rgba(255, 255, 255, 0.05)',
                        }
                      }}
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </Paper>

          {/* Métricas */}
          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                bgcolor: 'background.paper', 
                border: '1px solid rgba(255, 255, 255, 0.1)', 
                borderRadius: 2,
                height: '100%',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.3)'
                }
              }}>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                      <Typography variant="body2" color="text.secondary" mb={1}>
                        Ventas Totales
                      </Typography>
                      <Typography variant="h4" fontWeight="bold" color="success.main">
                        $431,000
                      </Typography>
                      <Chip 
                        label="+12.5%" 
                        size="small" 
                        sx={{ 
                          mt: 1, 
                          bgcolor: 'rgba(16, 185, 129, 0.15)', 
                          color: 'success.main',
                          fontWeight: 600
                        }} 
                      />
                    </Box>
                    <Box sx={{ 
                      bgcolor: 'rgba(16, 185, 129, 0.15)', 
                      p: 1.5, 
                      borderRadius: 2 
                    }}>
                      <MoneyIcon sx={{ color: 'success.main', fontSize: 28 }} />
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                bgcolor: 'background.paper', 
                border: '1px solid rgba(255, 255, 255, 0.1)', 
                borderRadius: 2,
                height: '100%',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.3)'
                }
              }}>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                      <Typography variant="body2" color="text.secondary" mb={1}>
                        Transacciones
                      </Typography>
                      <Typography variant="h4" fontWeight="bold" color="primary.main">
                        226
                      </Typography>
                      <Chip 
                        label="+8.2%" 
                        size="small" 
                        sx={{ 
                          mt: 1, 
                          bgcolor: 'rgba(79, 127, 255, 0.15)', 
                          color: 'primary.main',
                          fontWeight: 600
                        }} 
                      />
                    </Box>
                    <Box sx={{ 
                      bgcolor: 'rgba(79, 127, 255, 0.15)', 
                      p: 1.5, 
                      borderRadius: 2 
                    }}>
                      <CartIcon sx={{ color: 'primary.main', fontSize: 28 }} />
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                bgcolor: 'background.paper', 
                border: '1px solid rgba(255, 255, 255, 0.1)', 
                borderRadius: 2,
                height: '100%',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.3)'
                }
              }}>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                      <Typography variant="body2" color="text.secondary" mb={1}>
                        Ticket Promedio
                      </Typography>
                      <Typography variant="h4" fontWeight="bold" color="warning.main">
                        $1,907
                      </Typography>
                      <Chip 
                        label="+3.8%" 
                        size="small" 
                        sx={{ 
                          mt: 1, 
                          bgcolor: 'rgba(245, 158, 11, 0.15)', 
                          color: 'warning.main',
                          fontWeight: 600
                        }} 
                      />
                    </Box>
                    <Box sx={{ 
                      bgcolor: 'rgba(245, 158, 11, 0.15)', 
                      p: 1.5, 
                      borderRadius: 2 
                    }}>
                      <TrendingUpIcon sx={{ color: 'warning.main', fontSize: 28 }} />
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                bgcolor: 'background.paper', 
                border: '1px solid rgba(255, 255, 255, 0.1)', 
                borderRadius: 2,
                height: '100%',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.3)'
                }
              }}>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                      <Typography variant="body2" color="text.secondary" mb={1}>
                        Productos Vendidos
                      </Typography>
                      <Typography variant="h4" fontWeight="bold" color="text.primary">
                        1,248
                      </Typography>
                      <Chip 
                        label="+15.3%" 
                        size="small" 
                        sx={{ 
                          mt: 1, 
                          bgcolor: 'rgba(139, 92, 246, 0.15)', 
                          color: '#8B5CF6',
                          fontWeight: 600
                        }} 
                      />
                    </Box>
                    <Box sx={{ 
                      bgcolor: 'rgba(139, 92, 246, 0.15)', 
                      p: 1.5, 
                      borderRadius: 2 
                    }}>
                      <AssessmentIcon sx={{ color: '#8B5CF6', fontSize: 28 }} />
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Gráficas */}
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <Paper sx={{ 
                p: 3, 
                borderRadius: 2, 
                bgcolor: 'background.paper', 
                border: '1px solid rgba(255, 255, 255, 0.1)',
                height: '100%'
              }}>
                <Typography variant="h6" fontWeight={600} color="text.primary" mb={3}>
                  Tendencia de Ventas
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={ventasPorDia}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                    <XAxis dataKey="fecha" stroke="#8B95A8" />
                    <YAxis stroke="#8B95A8" />
                    <RechartsTooltip 
                      contentStyle={{ 
                        backgroundColor: '#1A2332', 
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: '#E1E8F0'
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="ventas" stroke="#4F7FFF" strokeWidth={3} name="Ventas ($)" />
                    <Line type="monotone" dataKey="cantidad" stroke="#10B981" strokeWidth={3} name="Transacciones" />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            <Grid item xs={12} lg={4}>
              <Paper sx={{ 
                p: 3, 
                borderRadius: 2, 
                bgcolor: 'background.paper', 
                border: '1px solid rgba(255, 255, 255, 0.1)',
                height: '100%'
              }}>
                <Typography variant="h6" fontWeight={600} color="text.primary" mb={3}>
                  Ventas por Categoría
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={ventasPorCategoria}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="valor"
                      label={({ nombre, percent }) => `${nombre} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {ventasPorCategoria.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ 
                        backgroundColor: '#1A2332', 
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: '#E1E8F0'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper sx={{ 
                p: 3, 
                borderRadius: 2, 
                bgcolor: 'background.paper', 
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <Typography variant="h6" fontWeight={600} color="text.primary" mb={3}>
                  Top 5 Productos Más Vendidos
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={productosMasVendidos}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                    <XAxis dataKey="nombre" stroke="#8B95A8" />
                    <YAxis stroke="#8B95A8" />
                    <RechartsTooltip 
                      contentStyle={{ 
                        backgroundColor: '#1A2332', 
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: '#E1E8F0'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="ventas" fill="#4F7FFF" name="Ventas ($)" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="cantidad" fill="#10B981" name="Cantidad vendida" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
}