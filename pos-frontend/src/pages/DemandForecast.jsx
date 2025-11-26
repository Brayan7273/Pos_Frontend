import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  Stack,
  Grid,
  TextField,
  Chip,
  CircularProgress,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
  IconButton
} from '@mui/material';
import {
  Psychology as BrainIcon,
  TrendingUp as TrendingUpIcon,
  Inventory as PackageIcon,
  Warning as AlertIcon,
  CalendarToday as CalendarIcon,
  FileDownload as DownloadIcon,
  Refresh as RefreshIcon,
  ShoppingCart as CartIcon,
  Bolt as ZapIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import api from '../services/api';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#4F7FFF', light: '#6B93FF', dark: '#3D67E6' },
    background: { default: '#0F1419', paper: '#1A2332' },
    text: { primary: '#E1E8F0', secondary: '#8B95A8' },
    success: { main: '#10B981' },
    warning: { main: '#F59E0B' },
    error: { main: '#EF4444' }
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' }
      }
    }
  }
});

export default function DemandForecast() {
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [forecastData, setForecastData] = useState({
    products: [],
    timeline: [],
    recommendations: [],
    seasonalPatterns: [],
    accuracy: 0
  });
  const [exporting, setExporting] = useState(false);

  const fetchForecastData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/ml/forecast?period=${selectedPeriod}`);
      setForecastData(response.data);
    } catch (err) {
      console.error("Error:", err);
      setForecastData({
        products: [],
        timeline: [],
        recommendations: [],
        seasonalPatterns: [],
        accuracy: 0
      });
    } finally {
      setLoading(false);
    }
  }, [selectedPeriod]);

  useEffect(() => {
    fetchForecastData();
  }, [fetchForecastData]);

  const handleExportForecast = async () => {
    try {
      setExporting(true);
      const response = await api.get('/ml/forecast/export', { 
        responseType: 'blob' 
      });
      
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `prediccion_demanda_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setExporting(false);
    }
  };

  const filteredProducts = (forecastData.products || []).filter((p) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    return (p.name || '').toLowerCase().includes(term) || (p.sku || '').toLowerCase().includes(term);
  });

  const getPriorityChip = (priority) => {
    switch ((priority || '').toString().toLowerCase()) {
      case 'high':
      case 'alta':
        return { label: 'Alta', colorKey: 'error' };
      case 'medium':
      case 'media':
        return { label: 'Media', colorKey: 'warning' };
      case 'low':
      case 'baja':
        return { label: 'Baja', colorKey: 'success' };
      default:
        return { label: priority ? String(priority) : 'N/A', colorKey: 'primary' };
    }
  };

  if (loading) {
    return (
      <ThemeProvider theme={darkTheme}>
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Stack alignItems="center" spacing={2}>
            <CircularProgress size={64} />
            <Typography variant="h6" color="text.primary">Analizando datos...</Typography>
          </Stack>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 6 }}>
        <Container maxWidth={false} sx={{ py: 4 }}>
          
          {/* Header */}
          <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between" spacing={2} mb={4}>
            <Box>
              <Stack direction="row" alignItems="center" spacing={1}>
                <BrainIcon sx={{ color: '#A78BFA', fontSize: 34 }} />
                <Box>
                  <Typography variant="h4" fontWeight={700} color="text.primary">Predicción de Demanda</Typography>
                  <Typography variant="body2" color="text.secondary">Forecasting con Machine Learning</Typography>
                </Box>
              </Stack>
            </Box>

            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={fetchForecastData}
                sx={{ textTransform: 'none' }}
              >
                Actualizar
              </Button>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={handleExportForecast}
                disabled={exporting}
                sx={{ textTransform: 'none' }}
              >
                {exporting ? 'Exportando...' : 'Exportar CSV'}
              </Button>
            </Stack>
          </Stack>

          {/* Precision card */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{ bgcolor: 'rgba(251,191,36,0.12)', p: 1.25, borderRadius: 1.5 }}>
                  <ZapIcon sx={{ color: 'warning.main', fontSize: 30 }} />
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight={700} color="text.primary">Precisión del Modelo</Typography>
                  <Typography variant="caption" color="text.secondary">Basado en histórico</Typography>
                </Box>
              </Stack>

              <Box textAlign="right">
                <Typography variant="h3" fontWeight={800} color="#A78BFA">{forecastData.accuracy || 0}%</Typography>
                <Typography variant="caption" color="success.main">Confiabilidad</Typography>
              </Box>
            </Stack>
          </Paper>

          {/* Period selector */}
          <Box sx={{ mb: 3 }}>
            <ToggleButtonGroup
              value={selectedPeriod}
              exclusive
              onChange={(_, newVal) => { if (newVal) setSelectedPeriod(newVal); }}
              sx={{
                '& .MuiToggleButton-root': {
                  color: 'text.secondary',
                  borderColor: 'rgba(255,255,255,0.06)',
                  textTransform: 'none',
                  px: 3,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: '#fff'
                  }
                }
              }}
            >
              <ToggleButton value="week">Próxima Semana</ToggleButton>
              <ToggleButton value="month">Próximo Mes</ToggleButton>
              <ToggleButton value="quarter">Próximo Trimestre</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Charts + patterns */}
          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} lg={8}>
              <Paper sx={{ p: 3, borderRadius: 2, height: '100%', bgcolor: 'background.paper' }}>
                <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                  <TrendingUpIcon sx={{ color: 'primary.main' }} />
                  <Typography variant="h6" fontWeight={700} color="text.primary">
                    Proyección de Ventas
                  </Typography>
                </Stack>

                <Box sx={{ width: '100%', height: 360 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={forecastData.timeline || []}>
                      <defs>
                        <linearGradient id="gradActual" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="gradPred" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
                      <XAxis dataKey="date" stroke="#8B95A8" />
                      <YAxis stroke="#8B95A8" />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="actual" name="Ventas Reales" stroke="#3B82F6" fill="url(#gradActual)" />
                      <Area type="monotone" dataKey="predicted" name="Predicción ML" stroke="#10B981" fill="url(#gradPred)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} lg={4}>
              <Paper sx={{ p: 3, borderRadius: 2, height: '100%', bgcolor: 'background.paper' }}>
                <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                  <CalendarIcon sx={{ color: 'warning.main' }} />
                  <Typography variant="h6" fontWeight={700} color="text.primary">Patrones Detectados</Typography>
                </Stack>

                <Box sx={{ maxHeight: 360, overflowY: 'auto' }}>
                  <Stack spacing={2}>
                    {(forecastData.seasonalPatterns || []).length === 0 && (
                      <Box sx={{ textAlign: 'center', py: 6 }}>
                        <CalendarIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                        <Typography variant="body2" color="text.secondary">Analizando patrones...</Typography>
                      </Box>
                    )}

                    {(forecastData.seasonalPatterns || []).map((pattern, idx) => (
                      <Paper key={idx} sx={{ p: 2, borderRadius: 1.5, bgcolor: 'rgba(255,255,255,0.02)' }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                          <Typography variant="body2" fontWeight={600} color="text.primary">{pattern.name}</Typography>
                          <Chip label={`${pattern.confidence || 0}%`} size="small" />
                        </Stack>
                        <Typography variant="caption" color="text.secondary" display="block" mb={1}>{pattern.description}</Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main' }} />
                          <Typography variant="caption" color="success.main">{pattern.impact}</Typography>
                        </Stack>
                      </Paper>
                    ))}
                  </Stack>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* Products table */}
          <Paper sx={{ p: 2, borderRadius: 2, mb: 3, bgcolor: 'background.paper' }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={2} mb={1}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <PackageIcon sx={{ color: 'success.main' }} />
                <Typography variant="h6" fontWeight={700} color="text.primary">Predicción por Producto</Typography>
              </Stack>

              <Stack direction="row" spacing={1}>
                <TextField
                  size="small"
                  placeholder="Buscar producto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    )
                  }}
                  sx={{ width: { xs: '100%', sm: 320 } }}
                />
                <IconButton onClick={() => setSearchTerm('')} size="small">
                  <RefreshIcon />
                </IconButton>
              </Stack>
            </Stack>

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Producto</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Stock Actual</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Demanda Predicha</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Diferencia</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>Prioridad</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Acción</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredProducts.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                          <PackageIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                          <Typography variant="body2" color="text.secondary">No se encontraron productos</Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}

                  {filteredProducts.map((product, idx) => {
                    const priority = getPriorityChip(product.priority);
                    const diff = (product.predictedDemand || 0) - (product.currentStock || 0);
                    const diffPositive = diff > 0;
                    return (
                      <TableRow key={idx} hover onClick={() => setSelectedProduct(product)}>
                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <PackageIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                            <Box>
                              <Typography variant="body2" fontWeight={600} color="text.primary">{product.name}</Typography>
                              <Typography variant="caption" color="text.secondary">{product.sku}</Typography>
                            </Box>
                          </Stack>
                        </TableCell>
                        <TableCell align="right"><Typography variant="body2" fontWeight={700}>{product.currentStock || 0}</Typography></TableCell>
                        <TableCell align="right"><Typography variant="body2" fontWeight={700} sx={{ color: 'primary.light' }}>{product.predictedDemand || 0}</Typography></TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight={700} sx={{ color: diff < 0 ? 'error.main' : 'success.main' }}>
                            {diffPositive ? `+${diff}` : diff}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip label={priority.label} size="small" color={priority.colorKey} />
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            size="small"
                            variant="contained"
                            sx={{
                              textTransform: 'none',
                              fontWeight: 700,
                              bgcolor: diff < 0 ? 'error.main' : 'success.main'
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (diff < 0) {
                                alert(`Generar orden de compra para ${product.name}`);
                              } else {
                                alert(`Monitorear ${product.name}`);
                              }
                            }}
                          >
                            {diff < 0 ? 'Reabastecer' : 'Monitorear'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* Recommendations */}
          <Paper sx={{ p: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
              <AlertIcon sx={{ color: 'warning.main' }} />
              <Typography variant="h6" fontWeight={700} color="text.primary">Recomendaciones</Typography>
            </Stack>

            <Grid container spacing={2}>
              {(forecastData.recommendations || []).length === 0 && (
                <Grid item xs={12}>
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" color="text.secondary">No hay recomendaciones</Typography>
                  </Box>
                </Grid>
              )}

              {(forecastData.recommendations || []).map((rec, idx) => {
                const priority = getPriorityChip(rec.priority);
                const borderColor = priority.colorKey === 'error' ? 'error.main' : priority.colorKey === 'warning' ? 'warning.main' : 'success.main';
                return (
                  <Grid item xs={12} md={6} lg={4} key={idx}>
                    <Paper sx={{ p: 2, borderRadius: 2, border: `1px solid ${borderColor}` }}>
                      <Stack direction="row" spacing={1}>
                        <CartIcon sx={{ color: borderColor, mt: 0.25 }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" fontWeight={700} color="text.primary" mb={0.5}>{rec.title}</Typography>
                          <Typography variant="caption" color="text.secondary" display="block" mb={1}>{rec.message}</Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>Impacto: <strong style={{ color: borderColor }}>{rec.impact}</strong></Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          </Paper>

        </Container>
      </Box>
    </ThemeProvider>
  );
}