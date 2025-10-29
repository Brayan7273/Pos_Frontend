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
  InputAdornment
} from '@mui/material';
import {
  AutoAwesome as SparklesIcon,
  Inventory as PackageIcon,
  TrendingUp as TrendingUpIcon,
  People as UsersIcon,
  ShoppingCart as CartIcon,
  Bolt as ZapIcon,
  Search as SearchIcon,
  Add as AddIcon,
  ChevronRight as ChevronRightIcon,
  Star as StarIcon,
  TrackChanges as TargetIcon,
  Psychology as BrainIcon
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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

export default function RecommendationSystem() {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [recommendationData, setRecommendationData] = useState({
    productRecommendations: [],
    bundleSuggestions: [],
    crossSellOpportunities: [],
    upsellItems: [],
    trendingCombos: [],
    performanceMetrics: {}
  });

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/ml/recommendations", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRecommendationData(data);
      }
    } catch (err) {
      console.error("Error al cargar recomendaciones:", err);
    } finally {
      setLoading(false);
    }
  };

  const searchProduct = async (query) => {
    if (query.length < 2) {
      setSelectedProduct(null);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/ml/recommendations/product?q=${query}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedProduct(data);
      }
    } catch (err) {
      console.error("Error al buscar producto:", err);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    searchProduct(value);
  };

  const createBundle = async (items) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/ml/recommendations/bundle", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ items })
      });

      if (response.ok) {
        alert("Bundle creado exitosamente");
        fetchRecommendations();
      }
    } catch (err) {
      alert("Error al crear bundle");
    }
  };

  if (loading) {
    return (
      <ThemeProvider theme={darkTheme}>
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress sx={{ color: 'warning.main', mb: 2 }} size={60} />
            <Typography variant="h6" color="text.primary">Generando recomendaciones inteligentes...</Typography>
          </Box>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 4 }}>
        <Container maxWidth={false} sx={{ py: 4, px: 4 }}>
          
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
              <SparklesIcon sx={{ color: '#FBBF24', fontSize: 32 }} />
              <Typography variant="h4" fontWeight="bold" color="text.primary">
                Sistema de Recomendaciones
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Aumenta tus ventas con Machine Learning
            </Typography>
          </Box>

          {/* Métricas de Rendimiento */}
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
                        Tasa de Aceptación
                      </Typography>
                      <Typography variant="h4" fontWeight="bold" color="success.main">
                        {recommendationData.performanceMetrics.acceptanceRate || 0}%
                      </Typography>
                    </Box>
                    <Box sx={{ 
                      bgcolor: 'rgba(16, 185, 129, 0.15)', 
                      p: 1.5, 
                      borderRadius: 2 
                    }}>
                      <TargetIcon sx={{ color: 'success.main', fontSize: 28 }} />
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
                        Ventas Adicionales
                      </Typography>
                      <Typography variant="h4" fontWeight="bold" color="primary.main">
                        ${(recommendationData.performanceMetrics.additionalSales || 0).toLocaleString()}
                      </Typography>
                    </Box>
                    <Box sx={{ 
                      bgcolor: 'rgba(79, 127, 255, 0.15)', 
                      p: 1.5, 
                      borderRadius: 2 
                    }}>
                      <TrendingUpIcon sx={{ color: 'primary.main', fontSize: 28 }} />
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
                        Ticket Promedio +
                      </Typography>
                      <Typography variant="h4" fontWeight="bold" sx={{ color: '#8B5CF6' }}>
                        {recommendationData.performanceMetrics.avgTicketIncrease || 0}%
                      </Typography>
                    </Box>
                    <Box sx={{ 
                      bgcolor: 'rgba(139, 92, 246, 0.15)', 
                      p: 1.5, 
                      borderRadius: 2 
                    }}>
                      <CartIcon sx={{ color: '#8B5CF6', fontSize: 28 }} />
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
                        Precisión ML
                      </Typography>
                      <Typography variant="h4" fontWeight="bold" color="warning.main">
                        {recommendationData.performanceMetrics.mlAccuracy || 0}%
                      </Typography>
                    </Box>
                    <Box sx={{ 
                      bgcolor: 'rgba(245, 158, 11, 0.15)', 
                      p: 1.5, 
                      borderRadius: 2 
                    }}>
                      <BrainIcon sx={{ color: 'warning.main', fontSize: 28 }} />
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
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
              placeholder="Buscar producto para ver recomendaciones..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'text.secondary' }} />
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

                <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                  <SparklesIcon sx={{ color: '#FBBF24', fontSize: 18 }} />
                  <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                    Clientes que compraron esto también compraron:
                  </Typography>
                </Stack>

                <Grid container spacing={2}>
                  {selectedProduct.recommendations?.map((rec, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Paper sx={{ 
                        p: 2, 
                        bgcolor: 'rgba(26, 35, 50, 0.7)', 
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 2,
                        transition: 'all 0.2s',
                        '&:hover': {
                          borderColor: 'primary.main',
                          transform: 'translateY(-4px)'
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
                              bgcolor: 'rgba(34, 197, 94, 0.2)', 
                              color: 'success.main',
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
                              py: 0.5
                            }}
                          >
                            Agregar
                          </Button>
                        </Stack>
                      </Paper>
                    </Grid>
                  ))}
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
                    Bundles Sugeridos por ML
                  </Typography>
                </Stack>

                <Stack spacing={2}>
                  {recommendationData.bundleSuggestions.map((bundle, index) => (
                    <Paper key={index} sx={{ 
                      p: 2, 
                      bgcolor: 'rgba(255, 255, 255, 0.03)', 
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      borderRadius: 1.5,
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                        borderColor: 'rgba(139, 92, 246, 0.5)'
                      }
                    }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
                        <Box>
                          <Typography variant="body1" fontWeight={600} color="text.primary">
                            {bundle.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {bundle.items.length} productos
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
                          onClick={() => createBundle(bundle.items)}
                          sx={{ 
                            bgcolor: '#7C3AED',
                            '&:hover': { bgcolor: '#6D28D9' },
                            textTransform: 'none',
                            fontSize: 12
                          }}
                        >
                          Crear Bundle
                        </Button>
                      </Stack>
                    </Paper>
                  ))}

                  {recommendationData.bundleSuggestions.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <PackageIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        No hay bundles sugeridos
                      </Typography>
                    </Box>
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
                </Stack>

                <Stack spacing={2}>
                  {recommendationData.crossSellOpportunities.map((opp, index) => (
                    <Paper key={index} sx={{ 
                      p: 2, 
                      bgcolor: 'rgba(255, 255, 255, 0.03)', 
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      borderRadius: 1.5,
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                        borderColor: 'rgba(245, 158, 11, 0.5)'
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
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <UsersIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {opp.conversions} conversiones
                          </Typography>
                        </Stack>
                        <Button 
                          size="small"
                          variant="outlined"
                          sx={{ 
                            borderColor: 'rgba(255, 255, 255, 0.2)',
                            color: 'text.primary',
                            textTransform: 'none',
                            fontSize: 11,
                            '&:hover': {
                              borderColor: 'rgba(255, 255, 255, 0.3)',
                              bgcolor: 'rgba(255, 255, 255, 0.05)'
                            }
                          }}
                        >
                          Ver Detalles
                        </Button>
                      </Stack>
                    </Paper>
                  ))}

                  {recommendationData.crossSellOpportunities.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <ZapIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        No hay oportunidades detectadas
                      </Typography>
                    </Box>
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
                Combinaciones Más Vendidas
              </Typography>
            </Stack>
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
                <Bar dataKey="sales" fill="#10B981" name="Ventas" radius={[8, 8, 0, 0]} />
                <Bar dataKey="revenue" fill="#4F7FFF" name="Ingresos ($)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}