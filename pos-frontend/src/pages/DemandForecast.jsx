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
import { motion } from 'framer-motion';

/**
 * DemandForecast.jsx
 * Versión completa: dashboard responsivo con animaciones (framer-motion),
 * gráficos (recharts), tabla de productos y recomendaciones.
 *
 * Requisitos: React 18+, @mui/material v5, recharts, framer-motion.
 */

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#4F7FFF', light: '#6B93FF', dark: '#3D67E6' },
    background: { default: '#0F1419', paper: '#1A2332' },
    text: { primary: '#E1E8F0', secondary: '#8B95A8' },
    success: { main: '#10B981', dark: '#059669', light: '#34D399' },
    warning: { main: '#F59E0B', dark: '#D97706', light: '#FBBF24' },
    error: { main: '#EF4444', dark: '#DC2626', light: '#F87171' }
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' }
      }
    }
  }
});

/* Util: asegura fuente de datos segura */
const safeArray = (v) => (Array.isArray(v) ? v : []);
const safeNumber = (v, def = 0) => (typeof v === 'number' && !Number.isNaN(v) ? v : def);

export default function DemandForecast() {
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('week'); // week | month | quarter
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
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/ml/forecast?period=${selectedPeriod}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!res.ok) {
        // Manejo básico de errores (401/403/5xx)
        console.error('Error al obtener forecast:', res.status, res.statusText);
        // Si quieres, manejar 401 -> redirigir a login
        setForecastData((prev) => ({ ...prev, products: [], timeline: [], recommendations: [], seasonalPatterns: [], accuracy: 0 }));
        return;
      }

      const data = await res.json();
      // Normaliza la estructura por seguridad:
      setForecastData({
        products: safeArray(data.products),
        timeline: safeArray(data.timeline),
        recommendations: safeArray(data.recommendations),
        seasonalPatterns: safeArray(data.seasonalPatterns),
        accuracy: safeNumber(data.accuracy, 0)
      });
    } catch (err) {
      console.error('Error al cargar predicciones:', err);
      setForecastData((prev) => ({ ...prev, products: [], timeline: [], recommendations: [], seasonalPatterns: [], accuracy: 0 }));
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
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/ml/forecast/export', {
        headers: { Authorization: token ? `Bearer ${token}` : '' }
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `prediccion_demanda_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exportando:', err);
      alert('Error al exportar predicción. Revisa la consola.');
    } finally {
      setExporting(false);
    }
  };

  const filteredProducts = (safeArray(forecastData.products)).filter((p) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    return (p.name || '').toLowerCase().includes(term) || (p.sku || '').toLowerCase().includes(term);
  });

  const getPriorityChip = (priority) => {
    // retorna objeto con label y color clave de MUI palette
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

  /* Animaciones simples */
  const fadeIn = { hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

  if (loading) {
    return (
      <ThemeProvider theme={darkTheme}>
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Stack alignItems="center" spacing={2}>
            <CircularProgress size={64} thickness={5} />
            <Typography variant="h6" color="text.primary">Analizando datos con ML...</Typography>
            <Typography variant="caption" color="text.secondary">Esto puede tardar unos segundos según el volumen de datos.</Typography>
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
          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between" spacing={2} mb={4}>
              <Box>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <BrainIcon sx={{ color: '#A78BFA', fontSize: 34 }} />
                  <Box>
                    <Typography variant="h4" fontWeight={700} color="text.primary">Predicción de Demanda</Typography>
                    <Typography variant="body2" color="text.secondary">Forecasting inteligente con Machine Learning</Typography>
                  </Box>
                </Stack>
              </Box>

              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={fetchForecastData}
                  sx={{ textTransform: 'none', borderRadius: 2 }}
                >
                  Actualizar
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={handleExportForecast}
                  disabled={exporting}
                  sx={{ textTransform: 'none', borderRadius: 2 }}
                >
                  {exporting ? 'Exportando...' : 'Exportar CSV'}
                </Button>
              </Stack>
            </Stack>
          </motion.div>

          {/* Precision card */}
          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            <Paper sx={{
              p: 3,
              mb: 3,
              borderRadius: 2,
              background: 'linear-gradient(135deg, rgba(109,40,217,0.14), rgba(59,130,246,0.07))',
              border: '1px solid rgba(124,58,237,0.15)'
            }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={{ bgcolor: 'rgba(251,191,36,0.12)', p: 1.25, borderRadius: 1.5 }}>
                    <ZapIcon sx={{ color: 'warning.main', fontSize: 30 }} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={700} color="text.primary">Precisión del Modelo ML</Typography>
                    <Typography variant="caption" color="text.secondary">Basado en histórico de 6 meses</Typography>
                  </Box>
                </Stack>

                <Box textAlign="right">
                  <Typography variant="h3" fontWeight={800} color="#A78BFA">{safeNumber(forecastData.accuracy, 0)}%</Typography>
                  <Typography variant="caption" color="success.main">Alta confiabilidad</Typography>
                </Box>
              </Stack>
            </Paper>
          </motion.div>

          {/* Period selector */}
          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
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
                    borderRadius: 1.5,
                    '&.Mui-selected': {
                      bgcolor: 'primary.main',
                      color: '#fff',
                      '&:hover': { bgcolor: 'primary.dark' }
                    }
                  }
                }}
              >
                <ToggleButton value="week">Próxima Semana</ToggleButton>
                <ToggleButton value="month">Próximo Mes</ToggleButton>
                <ToggleButton value="quarter">Próximo Trimestre</ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </motion.div>

          {/* Charts + patterns */}
          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} lg={8}>
              <motion.div initial="hidden" animate="visible" variants={fadeIn}>
                <Paper sx={{ p: 3, borderRadius: 2, height: '100%', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                    <TrendingUpIcon sx={{ color: 'primary.main' }} />
                    <Typography variant="h6" fontWeight={700} color="text.primary">
                      Proyección de Ventas - {selectedPeriod === 'week' ? '7 días' : selectedPeriod === 'month' ? '30 días' : '90 días'}
                    </Typography>
                  </Stack>

                  <Box sx={{ width: '100%', height: 360 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={safeArray(forecastData.timeline)}>
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
                        <XAxis dataKey="date" stroke="#8B95A8" tick={{ fontSize: 12 }} />
                        <YAxis stroke="#8B95A8" />
                        <Tooltip
                          wrapperStyle={{ backgroundColor: darkTheme.palette.background.paper, borderRadius: 8 }}
                          contentStyle={{ border: '1px solid rgba(255,255,255,0.06)' }}
                        />
                        <Legend />
                        <Area type="monotone" dataKey="actual" name="Ventas Reales" stroke="#3B82F6" fill="url(#gradActual)" fillOpacity={1} />
                        <Area type="monotone" dataKey="predicted" name="Predicción ML" stroke="#10B981" fill="url(#gradPred)" fillOpacity={1} />
                        <Area type="monotone" dataKey="upperBound" name="Límite Superior" stroke="#8B5CF6" strokeDasharray="4 4" fill="none" />
                        <Area type="monotone" dataKey="lowerBound" name="Límite Inferior" stroke="#F59E0B" strokeDasharray="4 4" fill="none" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </motion.div>
            </Grid>

            <Grid item xs={12} lg={4}>
              <motion.div initial="hidden" animate="visible" variants={fadeIn}>
                <Paper sx={{ p: 3, borderRadius: 2, height: '100%', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                    <CalendarIcon sx={{ color: 'warning.main' }} />
                    <Typography variant="h6" fontWeight={700} color="text.primary">Patrones Detectados</Typography>
                  </Stack>

                  <Box sx={{ maxHeight: 360, overflowY: 'auto' }}>
                    <Stack spacing={2}>
                      {safeArray(forecastData.seasonalPatterns).length === 0 && (
                        <Box sx={{ textAlign: 'center', py: 6 }}>
                          <CalendarIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                          <Typography variant="body2" color="text.secondary">Recopilando datos de estacionalidad...</Typography>
                        </Box>
                      )}

                      {safeArray(forecastData.seasonalPatterns).map((pattern, idx) => (
                        <Paper key={pattern.id ?? idx} sx={{ p: 2, borderRadius: 1.5, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.03)' }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                            <Typography variant="body2" fontWeight={600} color="text.primary">{pattern.name}</Typography>
                            <Chip label={`${pattern.confidence ?? 0}%`} size="small" sx={{ bgcolor: 'rgba(139,92,246,0.12)', color: '#C4B5FD', fontWeight: 600 }} />
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
              </motion.div>
            </Grid>
          </Grid>

          {/* Products table */}
          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            <Paper sx={{ p: 2, borderRadius: 2, mb: 3, border: '1px solid rgba(255,255,255,0.04)' }}>
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
                    sx={{ width: { xs: '100%', sm: 320 }, '& .MuiOutlinedInput-root': { bgcolor: 'rgba(255,255,255,0.02)' } }}
                  />
                  <IconButton onClick={() => { setSearchTerm(''); }} size="small" title="Limpiar búsqueda">
                    <RefreshIcon sx={{ color: 'text.secondary' }} />
                  </IconButton>
                </Stack>
              </Stack>

              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'rgba(255,255,255,0.02)' }}>
                      <TableCell sx={{ color: 'text.secondary', fontWeight: 700 }}>Producto</TableCell>
                      <TableCell align="right" sx={{ color: 'text.secondary', fontWeight: 700 }}>Stock Actual</TableCell>
                      <TableCell align="right" sx={{ color: 'text.secondary', fontWeight: 700 }}>Demanda Predicha</TableCell>
                      <TableCell align="right" sx={{ color: 'text.secondary', fontWeight: 700 }}>Diferencia</TableCell>
                      <TableCell align="center" sx={{ color: 'text.secondary', fontWeight: 700 }}>Prioridad</TableCell>
                      <TableCell align="right" sx={{ color: 'text.secondary', fontWeight: 700 }}>Acción</TableCell>
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
                      const idKey = product.id ?? `${idx}-${product.sku ?? ''}`;
                      const priority = getPriorityChip(product.priority);
                      const diff = Number(product.difference ?? (product.predictedDemand ?? 0) - (product.currentStock ?? 0));
                      const diffPositive = diff > 0;
                      return (
                        <TableRow key={idKey} hover sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }} onClick={() => setSelectedProduct(product)}>
                          <TableCell>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <PackageIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                              <Box>
                                <Typography variant="body2" fontWeight={600} color="text.primary">{product.name}</Typography>
                                <Typography variant="caption" color="text.secondary">{product.sku}</Typography>
                              </Box>
                            </Stack>
                          </TableCell>
                          <TableCell align="right"><Typography variant="body2" fontWeight={700} color="text.primary">{product.currentStock ?? 0}</Typography></TableCell>
                          <TableCell align="right"><Typography variant="body2" fontWeight={700} sx={{ color: 'primary.light' }}>{product.predictedDemand ?? 0}</Typography></TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight={700} sx={{ color: diff < 0 ? 'error.main' : 'success.main' }}>
                              {diffPositive ? `+${diff}` : String(diff)}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Chip label={priority.label} size="small" sx={{ fontWeight: 700 }} color={priority.colorKey === 'primary' ? undefined : undefined} />
                          </TableCell>
                          <TableCell align="right">
                            <Button
                              size="small"
                              variant="contained"
                              sx={{
                                textTransform: 'none',
                                fontWeight: 700,
                                bgcolor: diff < 0 ? 'error.main' : 'success.main',
                                '&:hover': { bgcolor: diff < 0 ? 'error.dark' : 'success.dark' }
                              }}
                              onClick={(e) => {
                                // evita que la fila capture el click y cambie selectedProduct dos veces
                                e.stopPropagation();
                                // Ejemplo de acción: abrir modal / dirigir a orden de compra
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
          </motion.div>

          {/* Recommendations */}
          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid rgba(255,255,255,0.04)' }}>
              <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <AlertIcon sx={{ color: 'warning.main' }} />
                <Typography variant="h6" fontWeight={700} color="text.primary">Recomendaciones Inteligentes</Typography>
              </Stack>

              <Grid container spacing={2}>
                {safeArray(forecastData.recommendations).length === 0 && (
                  <Grid item xs={12}>
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body2" color="text.secondary">No hay recomendaciones en este momento</Typography>
                    </Box>
                  </Grid>
                )}

                {safeArray(forecastData.recommendations).map((rec, idx) => {
                  const priority = getPriorityChip(rec.priority);
                  // Map colorKey a estilos utilizable:
                  const borderColor = priority.colorKey === 'error' ? 'error.main' : priority.colorKey === 'warning' ? 'warning.main' : 'success.main';
                  const bg = priority.colorKey === 'error' ? 'rgba(239,68,68,0.06)' : priority.colorKey === 'warning' ? 'rgba(245,158,11,0.06)' : 'rgba(16,185,129,0.06)';
                  return (
                    <Grid item xs={12} md={6} lg={4} key={rec.id ?? idx}>
                      <Paper sx={{ p: 2.25, borderRadius: 2, border: `1px solid`, borderColor: borderColor, bgcolor: bg, height: '100%' }}>
                        <Stack direction="row" spacing={1}>
                          <CartIcon sx={{ color: borderColor, mt: 0.25 }} />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" fontWeight={700} color="text.primary" mb={0.5}>{rec.title}</Typography>
                            <Typography variant="caption" color="text.secondary" display="block" mb={1}>{rec.message}</Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>Impacto estimado: <strong style={{ color: borderColor }}>{rec.impact}</strong></Typography>
                          </Box>
                        </Stack>
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>
            </Paper>
          </motion.div>

        </Container>
      </Box>
    </ThemeProvider>
  );
}
