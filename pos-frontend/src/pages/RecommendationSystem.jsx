import { useState, useEffect } from 'react';
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
  CircularProgress,
  InputAdornment,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  AutoAwesome as SparklesIcon,
  Inventory as PackageIcon,
  TrendingUp as TrendingUpIcon,
  ShoppingCart as CartIcon,
  Bolt as ZapIcon,
  Search as SearchIcon,
  Add as AddIcon,
  ChevronRight as ChevronRightIcon,
  Star as StarIcon,
  TrackChanges as TargetIcon,
  Psychology as BrainIcon,
  Error as ErrorIcon,
  CheckCircle as SuccessIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../services/api';

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

// Helper para validaciones
const validateSearchQuery = (query) => {
  if (query.length < 2) {
    return { isValid: false, message: 'Ingresa al menos 2 caracteres para buscar' };
  }
  if (query.length > 50) {
    return { isValid: false, message: 'La búsqueda no puede exceder 50 caracteres' };
  }
  if (!/^[a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑ.,-]*$/.test(query)) {
    return { isValid: false, message: 'Solo se permiten letras, números y espacios' };
  }
  return { isValid: true, message: '' };
};

export default function RecommendationSystem() {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchError, setSearchError] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [recommendationData, setRecommendationData] = useState({
    productRecommendations: [],
    bundleSuggestions: [],
    crossSellOpportunities: [],
    trendingCombos: [],
    performanceMetrics: {}
  });
  
  // Estados para manejo de errores y feedback
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [bundleDialog, setBundleDialog] = useState({ open: false, bundle: null });
  const [retryCount, setRetryCount] = useState(0);
  const [hasData, setHasData] = useState(false);

  // Mostrar snackbar
  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  // Cerrar snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Fetch principal de recomendaciones con reintentos
  const fetchRecommendations = async (isRetry = false) => {
    try {
      setLoading(true);
      if (isRetry) {
        showSnackbar('Reintentando cargar recomendaciones...', 'info');
      }

      const response = await api.get("/ml/recommendations");
      
      // Validar estructura de datos
      if (!response.data || typeof response.data !== 'object') {
        throw new Error('Estructura de datos inválida');
      }

      const data = response.data;
      
      // Validar datos mínimos
      const isValidData = 
        Array.isArray(data.productRecommendations) &&
        Array.isArray(data.bundleSuggestions) &&
        Array.isArray(data.crossSellOpportunities) &&
        Array.isArray(data.trendingCombos) &&
        data.performanceMetrics &&
        typeof data.performanceMetrics === 'object';

      if (!isValidData) {
        throw new Error('Datos incompletos o formato incorrecto');
      }

      setRecommendationData(data);
      setHasData(true);
      setRetryCount(0);
      
      if (isRetry) {
        showSnackbar('¡Recomendaciones cargadas exitosamente!', 'success');
      }

    } catch (err) {
      console.error("Error al cargar recomendaciones:", err);
      
      const errorMessage = 
        err.response?.status === 404 ? 'Servicio de recomendaciones no disponible' :
        err.response?.status === 500 ? 'Error interno del servidor' :
        err.message === 'Network Error' ? 'Error de conexión. Verifica tu internet' :
        'Error al cargar las recomendaciones';

      showSnackbar(errorMessage, 'error');
      
      // Reintentar automáticamente (máximo 3 intentos)
      if (retryCount < 3 && !isRetry) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          fetchRecommendations(true);
        }, 3000);
      } else if (retryCount >= 3) {
        showSnackbar('No se pudieron cargar las recomendaciones después de varios intentos', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  // Búsqueda de productos con validación
  const searchProduct = async (query) => {
    const validation = validateSearchQuery(query);
    if (!validation.isValid) {
      setSearchError(validation.message);
      setSelectedProduct(null);
      return;
    }

    setSearchError("");
    
    try {
      const response = await api.get(`/ml/recommendations/product?q=${encodeURIComponent(query)}`);
      
      if (!response.data || !response.data.name) {
        showSnackbar('No se encontraron recomendaciones para este producto', 'warning');
        setSelectedProduct(null);
        return;
      }

      setSelectedProduct(response.data);
      showSnackbar(`Recomendaciones encontradas para "${response.data.name}"`, 'success');
      
    } catch (err) {
      console.error("Error en búsqueda:", err);
      
      const errorMessage = 
        err.response?.status === 404 ? 'Producto no encontrado' :
        'Error al buscar el producto';
      
      showSnackbar(errorMessage, 'error');
      setSelectedProduct(null);
    }
  };

  // Manejo de cambios en la búsqueda con debounce
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Limpiar error al empezar a escribir
    if (searchError && value.length >= 2) {
      setSearchError("");
    }

    // Debounce para evitar muchas llamadas API
    const timeoutId = setTimeout(() => {
      if (value.trim().length >= 2) {
        searchProduct(value.trim());
      } else if (value.trim().length === 0) {
        setSelectedProduct(null);
        setSearchError("");
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  // Crear bundle con confirmación
  const createBundle = async (bundle) => {
    try {
      if (!bundle || !bundle.items || !Array.isArray(bundle.items)) {
        showSnackbar('Datos del bundle inválidos', 'error');
        return;
      }

      if (bundle.items.length === 0) {
        showSnackbar('El bundle debe contener al menos un producto', 'warning');
        return;
      }

      setBundleDialog({ open: true, bundle });

    } catch (err) {
      console.error("Error al preparar bundle:", err);
      showSnackbar('Error al preparar la creación del bundle', 'error');
    }
  };

  // Confirmar creación de bundle
  const confirmCreateBundle = async () => {
    const { bundle } = bundleDialog;
    
    try {
      await api.post("/ml/recommendations/bundle", { 
        items: bundle.items,
        name: bundle.name 
      });
      
      showSnackbar(`¡Bundle "${bundle.name}" creado exitosamente!`, 'success');
      fetchRecommendations();
      
    } catch (err) {
      console.error("Error al crear bundle:", err);
      showSnackbar('Error al crear el bundle. Intenta nuevamente.', 'error');
    } finally {
      setBundleDialog({ open: false, bundle: null });
    }
  };

  // Renderizado condicional para datos vacíos
  const EmptyState = ({ type, message }) => (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <PackageIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );

  if (loading && !hasData) {
    return (
      <ThemeProvider theme={darkTheme}>
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress sx={{ color: 'warning.main', mb: 2 }} size={60} />
            <Typography variant="h6" color="text.primary" gutterBottom>
              {retryCount > 0 ? `Reintentando... (${retryCount}/3)` : 'Analizando datos con ML'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Esto puede tomar unos segundos
            </Typography>
          </Box>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 4 }}>
        <Container maxWidth={false} sx={{ py: 4, px: 4 }}>
          
          {/* Header con botón de recarga */}
          <Box sx={{ mb: 4 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <SparklesIcon sx={{ color: '#FBBF24', fontSize: 32 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="text.primary">
                    Sistema de Recomendaciones
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {hasData ? 'Recomendaciones basadas en datos reales' : 'Cargando recomendaciones...'}
                  </Typography>
                </Box>
              </Stack>
              
              <Button
                variant="outlined"
                startIcon={<SparklesIcon />}
                onClick={() => fetchRecommendations()}
                disabled={loading}
                sx={{ textTransform: 'none' }}
              >
                {loading ? 'Actualizando...' : 'Actualizar'}
              </Button>
            </Stack>
          </Box>

          {/* Alertas de estado del sistema */}
          {!hasData && !loading && (
            <Alert 
              severity="warning" 
              sx={{ mb: 3 }}
              action={
                <Button 
                  color="inherit" 
                  size="small" 
                  onClick={() => fetchRecommendations()}
                >
                  Reintentar
                </Button>
              }
            >
              No hay datos de recomendaciones disponibles. Verifica la conexión o intenta recargar.
            </Alert>
          )}

          {/* Métricas de Rendimiento */}
          <Grid container spacing={3} mb={3}>
            {[
              {
                key: 'acceptanceRate',
                label: 'Tasa de Aceptación',
                value: recommendationData.performanceMetrics.acceptanceRate || 0,
                suffix: '%',
                color: 'success.main',
                icon: <TargetIcon />,
                description: 'De recomendaciones aceptadas por clientes'
              },
              {
                key: 'additionalSales',
                label: 'Ventas Adicionales',
                value: recommendationData.performanceMetrics.additionalSales || 0,
                prefix: '$',
                color: 'primary.main',
                icon: <TrendingUpIcon />,
                description: 'Generadas por el sistema'
              },
              {
                key: 'avgTicketIncrease',
                label: 'Ticket Promedio +',
                value: recommendationData.performanceMetrics.avgTicketIncrease || 0,
                suffix: '%',
                color: '#8B5CF6',
                icon: <CartIcon />,
                description: 'Incremento en ventas promedio'
              },
              {
                key: 'mlAccuracy',
                label: 'Precisión ML',
                value: recommendationData.performanceMetrics.mlAccuracy || 0,
                suffix: '%',
                color: 'warning.main',
                icon: <BrainIcon />,
                description: 'Del modelo de machine learning'
              }
            ].map((metric, index) => (
              <Grid item xs={12} sm={6} md={3} key={metric.key}>
                <Card sx={{ 
                  bgcolor: 'background.paper', 
                  border: '1px solid rgba(255, 255, 255, 0.1)', 
                  borderRadius: 2,
                  height: '100%',
                  opacity: hasData ? 1 : 0.7
                }}>
                  <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" color="text.secondary" mb={1}>
                          {metric.label}
                        </Typography>
                        <Typography variant="h4" fontWeight="bold" sx={{ color: metric.color }} mb={0.5}>
                          {metric.prefix || ''}{(metric.value).toLocaleString()}{metric.suffix || ''}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {metric.description}
                        </Typography>
                      </Box>
                      <Box sx={{ 
                        bgcolor: `${metric.color}15`, 
                        p: 1.5, 
                        borderRadius: 2 
                      }}>
                        {metric.icon}
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Búsqueda de Producto */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 2, bgcolor: 'background.paper', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
              <SearchIcon sx={{ color: 'primary.main' }} />
              <Typography variant="h6" fontWeight={600} color="text.primary">
                Buscar Recomendaciones por Producto
              </Typography>
            </Stack>
            
            <TextField
              fullWidth
              placeholder="Ingresa el nombre o código del producto..."
              value={searchTerm}
              onChange={handleSearchChange}
              error={!!searchError}
              helperText={searchError || "Mínimo 2 caracteres para buscar"}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: searchError ? 'error.main' : 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                }
              }}
            />

            {selectedProduct && (
              <Box sx={{ 
                mt: 3,
                p: 3,
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(109, 40, 217, 0.3) 100%)',
                border: '1px solid rgba(79, 127, 255, 0.5)',
                borderRadius: 2
              }}>
                <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                  <PackageIcon sx={{ color: 'primary.light', fontSize: 32 }} />
                  <Box>
                    <Typography variant="h6" fontWeight="bold" color="text.primary">
                      {selectedProduct.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedProduct.category} • ${selectedProduct.price}
                    </Typography>
                  </Box>
                </Stack>

                <Typography variant="subtitle2" fontWeight={600} color="text.primary" mb={2}>
                  Productos frecuentemente comprados junto con este:
                </Typography>

                <Grid container spacing={2}>
                  {selectedProduct.recommendations?.length > 0 ? (
                    selectedProduct.recommendations.map((rec, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Paper sx={{ 
                          p: 2, 
                          bgcolor: 'rgba(26, 35, 50, 0.7)', 
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: 2,
                          transition: 'all 0.2s',
                          '&:hover': {
                            borderColor: 'primary.main',
                          }
                        }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                            <Typography variant="body2" fontWeight={500} color="text.primary" sx={{ flex: 1 }}>
                              {rec.name}
                            </Typography>
                            <Chip 
                              label={`${rec.confidence}%`} 
                              size="small" 
                              sx={{ 
                                bgcolor: rec.confidence > 80 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                                color: rec.confidence > 80 ? 'success.main' : 'warning.main',
                                fontSize: 11,
                                fontWeight: 600
                              }} 
                            />
                          </Stack>
                          <Typography variant="caption" color="text.secondary" display="block" mb={1.5}>
                            {rec.category}
                          </Typography>
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="h6" fontWeight="bold" color="success.main">
                              ${rec.price}
                            </Typography>
                            <Button 
                              size="small" 
                              variant="contained"
                              startIcon={<AddIcon />}
                              sx={{ 
                                bgcolor: 'primary.main',
                                textTransform: 'none',
                                fontSize: 12,
                                '&:hover': {
                                  bgcolor: 'primary.dark'
                                }
                              }}
                            >
                              Agregar
                            </Button>
                          </Stack>
                        </Paper>
                      </Grid>
                    ))
                  ) : (
                    <Grid item xs={12}>
                      <EmptyState 
                        message="No hay recomendaciones específicas para este producto" 
                      />
                    </Grid>
                  )}
                </Grid>
              </Box>
            )}
          </Paper>

          {/* Bundles y Cross-Sell */}
          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} lg={6}>
              <Paper sx={{ p: 3, borderRadius: 2, bgcolor: 'background.paper', border: '1px solid rgba(255, 255, 255, 0.1)', height: '100%' }}>
                <Stack direction="row" alignItems="center" spacing={1} mb={3}>
                  <PackageIcon sx={{ color: '#8B5CF6' }} />
                  <Typography variant="h6" fontWeight={600} color="text.primary">
                    Bundles Sugeridos
                  </Typography>
                  <Chip 
                    label={recommendationData.bundleSuggestions.length} 
                    size="small" 
                    color="primary" 
                  />
                </Stack>

                <Stack spacing={2}>
                  {recommendationData.bundleSuggestions.length > 0 ? (
                    recommendationData.bundleSuggestions.map((bundle, index) => (
                      <Paper key={index} sx={{ 
                        p: 2, 
                        bgcolor: 'rgba(255, 255, 255, 0.03)', 
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        borderRadius: 1.5,
                        transition: 'all 0.2s',
                        '&:hover': {
                          bgcolor: 'rgba(255, 255, 255, 0.05)',
                        }
                      }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
                          <Box>
                            <Typography variant="body1" fontWeight={600} color="text.primary">
                              {bundle.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {bundle.items.length} productos • Ahorro: ${bundle.savings || 0}
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="h6" fontWeight="bold" color="success.main">
                              ${bundle.price}
                            </Typography>
                            <Typography variant="caption" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                              ${bundle.originalPrice}
                            </Typography>
                          </Box>
                        </Stack>

                        <Stack spacing={0.5} mb={1.5}>
                          {bundle.items.map((item, i) => (
                            <Stack key={i} direction="row" alignItems="center" spacing={1}>
                              <ChevronRightIcon sx={{ color: '#A78BFA', fontSize: 16 }} />
                              <Typography variant="caption" color="text.secondary">
                                {item}
                              </Typography>
                            </Stack>
                          ))}
                        </Stack>

                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <StarIcon sx={{ color: '#FBBF24', fontSize: 14 }} />
                            <Typography variant="caption" sx={{ color: '#FBBF24' }}>
                              Popularidad: {bundle.popularity}%
                            </Typography>
                          </Stack>
                          <Button 
                            size="small"
                            variant="contained"
                            onClick={() => createBundle(bundle)}
                            sx={{ 
                              bgcolor: '#7C3AED',
                              textTransform: 'none',
                              fontSize: 12,
                              '&:hover': {
                                bgcolor: '#6D28D9'
                              }
                            }}
                          >
                            Crear Bundle
                          </Button>
                        </Stack>
                      </Paper>
                    ))
                  ) : (
                    <EmptyState 
                      message="No hay bundles sugeridos en este momento" 
                    />
                  )}
                </Stack>
              </Paper>
            </Grid>

            <Grid item xs={12} lg={6}>
              <Paper sx={{ p: 3, borderRadius: 2, bgcolor: 'background.paper', border: '1px solid rgba(255, 255, 255, 0.1)', height: '100%' }}>
                <Stack direction="row" alignItems="center" spacing={1} mb={3}>
                  <ZapIcon sx={{ color: 'warning.main' }} />
                  <Typography variant="h6" fontWeight={600} color="text.primary">
                    Oportunidades de Cross-Sell
                  </Typography>
                  <Chip 
                    label={recommendationData.crossSellOpportunities.length} 
                    size="small" 
                    color="warning" 
                  />
                </Stack>

                <Stack spacing={2}>
                  {recommendationData.crossSellOpportunities.length > 0 ? (
                    recommendationData.crossSellOpportunities.map((opp, index) => (
                      <Paper key={index} sx={{ 
                        p: 2, 
                        bgcolor: 'rgba(255, 255, 255, 0.03)', 
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        borderRadius: 1.5,
                        transition: 'all 0.2s',
                        '&:hover': {
                          bgcolor: 'rgba(255, 255, 255, 0.05)',
                        }
                      }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                          <Typography variant="body1" fontWeight={600} color="text.primary">
                            {opp.trigger}
                          </Typography>
                          <Chip 
                            label={`+${opp.avgIncrease}%`}
                            size="small"
                            sx={{ 
                              bgcolor: 'rgba(245, 158, 11, 0.2)', 
                              color: 'warning.main',
                              fontSize: 11,
                              fontWeight: 600
                            }}
                          />
                        </Stack>

                        <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
                          <Typography variant="caption" color="text.secondary">
                            Recomendar:
                          </Typography>
                          <Typography variant="caption" fontWeight={500} color="primary.light">
                            {opp.recommendation}
                          </Typography>
                        </Stack>

                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography variant="caption" color="text.secondary">
                              {opp.conversions} conversiones
                            </Typography>
                            {opp.successRate && (
                              <Chip 
                                label={`${opp.successRate}% éxito`} 
                                size="small" 
                                variant="outlined"
                              />
                            )}
                          </Stack>
                          <Button 
                            size="small"
                            variant="outlined"
                            sx={{ 
                              borderColor: 'rgba(255, 255, 255, 0.2)',
                              color: 'text.primary',
                              textTransform: 'none',
                              fontSize: 11
                            }}
                          >
                            Ver Detalles
                          </Button>
                        </Stack>
                      </Paper>
                    ))
                  ) : (
                    <EmptyState 
                      message="No hay oportunidades detectadas" 
                    />
                  )}
                </Stack>
              </Paper>
            </Grid>
          </Grid>

          {/* Combinaciones Más Vendidas */}
          <Paper sx={{ p: 3, borderRadius: 2, bgcolor: 'background.paper', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <Stack direction="row" alignItems="center" spacing={1} mb={3}>
              <TrendingUpIcon sx={{ color: 'success.main' }} />
              <Typography variant="h6" fontWeight={600} color="text.primary">
                Combinaciones Populares
              </Typography>
              <Chip 
                label={recommendationData.trendingCombos.length} 
                size="small" 
                color="success" 
              />
            </Stack>
            
            {recommendationData.trendingCombos.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={recommendationData.trendingCombos}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                  <XAxis dataKey="combo" stroke="#8B95A8" />
                  <YAxis stroke="#8B95A8" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1A2332', 
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: '#E1E8F0'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="sales" fill="#10B981" name="Ventas" />
                  <Bar dataKey="revenue" fill="#4F7FFF" name="Ingresos ($)" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState 
                message="No hay datos de combinaciones populares" 
              />
            )}
          </Paper>
        </Container>

        {/* Snackbar para notificaciones */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        {/* Dialog de confirmación para crear bundle */}
        <Dialog
          open={bundleDialog.open}
          onClose={() => setBundleDialog({ open: false, bundle: null })}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Stack direction="row" alignItems="center" spacing={1}>
              <PackageIcon color="primary" />
              <Typography variant="h6">Confirmar Creación de Bundle</Typography>
            </Stack>
          </DialogTitle>
          <DialogContent>
            {bundleDialog.bundle && (
              <Stack spacing={2}>
                <Typography>
                  ¿Estás seguro de que quieres crear el bundle <strong>"{bundleDialog.bundle.name}"</strong>?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Este bundle incluye {bundleDialog.bundle.items.length} productos con un descuento del {bundleDialog.bundle.discount || 12}%.
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.1)' }}>
                  <Typography variant="subtitle2" gutterBottom>Productos incluidos:</Typography>
                  {bundleDialog.bundle.items.map((item, index) => (
                    <Typography key={index} variant="body2" color="text.secondary">
                      • {item}
                    </Typography>
                  ))}
                </Paper>
              </Stack>
            )}
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setBundleDialog({ open: false, bundle: null })}
              color="inherit"
            >
              Cancelar
            </Button>
            <Button 
              onClick={confirmCreateBundle}
              variant="contained" 
              startIcon={<AddIcon />}
              sx={{ bgcolor: '#7C3AED' }}
            >
              Crear Bundle
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}