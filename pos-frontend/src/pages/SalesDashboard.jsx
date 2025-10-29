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
  Chip,
  Tooltip,
  CircularProgress
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon,
  ShoppingCart as CartIcon,
  People as PeopleIcon,
  Psychology as BrainIcon,
  Warning as WarningIcon,
  Star as StarIcon,
  Refresh as RefreshIcon,
  TrendingUp as ArrowUpIcon,
  TrendingDown as ArrowDownIcon
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

export default function SalesDashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalSales: 0,
    totalOrders: 0,
    avgTicket: 0,
    customers: 0,
    salesTrend: [],
    topProducts: [],
    categoryDistribution: [],
    predictions: {
      nextWeekSales: 0,
      demandForecast: [],
      stockAlerts: []
    }
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/dashboard/sales", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      }
    } catch (err) {
      console.error("Error al cargar dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#4F7FFF', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  if (loading) {
    return (
      <ThemeProvider theme={darkTheme}>
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress sx={{ color: 'primary.main', mb: 2 }} size={60} />
            <Typography variant="h6" color="text.primary">Cargando datos...</Typography>
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
            <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between" spacing={2}>
              <Box>
                <Typography variant="h4" fontWeight="bold" color="text.primary" mb={0.5}>
                  Dashboard de Ventas
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Análisis inteligente con Machine Learning
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                onClick={fetchDashboardData}
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
                Actualizar
              </Button>
            </Stack>
          </Box>

          {/* Métricas KPI */}
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
                        ${dashboardData.totalSales.toLocaleString('es-MX')}
                      </Typography>
                      <Chip 
                        icon={<ArrowUpIcon sx={{ fontSize: 16 }} />}
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
                        Pedidos
                      </Typography>
                      <Typography variant="h4" fontWeight="bold" color="primary.main">
                        {dashboardData.totalOrders}
                      </Typography>
                      <Chip 
                        icon={<ArrowUpIcon sx={{ fontSize: 16 }} />}
                        label="+8.3%" 
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
                        ${dashboardData.avgTicket.toLocaleString('es-MX')}
                      </Typography>
                      <Chip 
                        icon={<ArrowDownIcon sx={{ fontSize: 16 }} />}
                        label="-2.1%" 
                        size="small" 
                        sx={{ 
                          mt: 1, 
                          bgcolor: 'rgba(239, 68, 68, 0.15)', 
                          color: 'error.main',
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
                        Clientes
                      </Typography>
                      <Typography variant="h4" fontWeight="bold" color="text.primary">
                        {dashboardData.customers}
                      </Typography>
                      <Chip 
                        icon={<ArrowUpIcon sx={{ fontSize: 16 }} />}
                        label="+15.7%" 
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
                      <PeopleIcon sx={{ color: '#8B5CF6', fontSize: 28 }} />
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Gráficas principales */}
          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} lg={8}>
              <Paper sx={{ 
                p: 3, 
                borderRadius: 2, 
                bgcolor: 'background.paper', 
                border: '1px solid rgba(255, 255, 255, 0.1)',
                height: '100%'
              }}>
                <Stack direction="row" alignItems="center" spacing={1} mb={3}>
                  <TrendingUpIcon sx={{ color: 'primary.main' }} />
                  <Typography variant="h6" fontWeight={600} color="text.primary">
                    Tendencia de Ventas (Últimos 7 días)
                  </Typography>
                </Stack>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dashboardData.salesTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                    <XAxis dataKey="date" stroke="#8B95A8" />
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
                    <Line type="monotone" dataKey="sales" stroke="#4F7FFF" strokeWidth={3} name="Ventas" />
                    <Line type="monotone" dataKey="predicted" stroke="#10B981" strokeWidth={2} strokeDasharray="5 5" name="Predicción ML" />
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
                <Stack direction="row" alignItems="center" spacing={1} mb={3}>
                  <StarIcon sx={{ color: '#FBBF24' }} />
                  <Typography variant="h6" fontWeight={600} color="text.primary">
                    Ventas por Categoría
                  </Typography>
                </Stack>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={dashboardData.categoryDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={90}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {dashboardData.categoryDistribution.map((entry, index) => (
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
          </Grid>

          {/* Predicciones ML */}
          <Paper sx={{ 
            p: 3, 
            mb: 3,
            borderRadius: 2, 
            background: 'linear-gradient(135deg, rgba(109, 40, 217, 0.3) 0%, rgba(59, 130, 246, 0.3) 100%)',
            border: '1px solid rgba(124, 58, 237, 0.5)',
            backdropFilter: 'blur(10px)'
          }}>
            <Stack direction="row" alignItems="center" spacing={1} mb={3}>
              <BrainIcon sx={{ color: '#A78BFA' }} />
              <Typography variant="h6" fontWeight={600} color="text.primary">
                Predicciones de Machine Learning
              </Typography>
            </Stack>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Paper sx={{ 
                  p: 3, 
                  bgcolor: 'rgba(26, 35, 50, 0.7)', 
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 2
                }}>
                  <Typography variant="body2" color="text.secondary" mb={1}>
                    Ventas Próxima Semana
                  </Typography>
                  <Typography variant="h3" fontWeight="bold" sx={{ color: '#A78BFA', mb: 1 }}>
                    ${dashboardData.predictions.nextWeekSales.toLocaleString('es-MX')}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'success.main' }}>
                    Confianza: 87%
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} md={4}>
                <Paper sx={{ 
                  p: 3, 
                  bgcolor: 'rgba(26, 35, 50, 0.7)', 
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 2
                }}>
                  <Typography variant="body2" color="text.secondary" mb={1}>
                    Productos de Alta Demanda
                  </Typography>
                  <Typography variant="h3" fontWeight="bold" sx={{ color: '#60A5FA', mb: 1 }}>
                    {dashboardData.predictions.demandForecast.length}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'warning.main' }}>
                    Requieren reabastecimiento
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} md={4}>
                <Paper sx={{ 
                  p: 3, 
                  bgcolor: 'rgba(26, 35, 50, 0.7)', 
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 2
                }}>
                  <Typography variant="body2" color="text.secondary" mb={1}>
                    Alertas de Stock
                  </Typography>
                  <Typography variant="h3" fontWeight="bold" sx={{ color: '#FB923C', mb: 1 }}>
                    {dashboardData.predictions.stockAlerts.length}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'error.main' }}>
                    Acción inmediata requerida
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Paper>

          {/* Sección inferior */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ 
                p: 3, 
                borderRadius: 2, 
                bgcolor: 'background.paper', 
                border: '1px solid rgba(255, 255, 255, 0.1)',
                height: '100%'
              }}>
                <Stack direction="row" alignItems="center" spacing={1} mb={3}>
                  <StarIcon sx={{ color: '#FBBF24' }} />
                  <Typography variant="h6" fontWeight={600} color="text.primary">
                    Productos Más Vendidos
                  </Typography>
                </Stack>
                <Stack spacing={2}>
                  {dashboardData.topProducts.map((product, index) => (
                    <Paper key={index} sx={{ 
                      p: 2, 
                      bgcolor: 'rgba(255, 255, 255, 0.03)', 
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      borderRadius: 1.5,
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                        transform: 'translateX(4px)'
                      }
                    }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Box sx={{ 
                            width: 32, 
                            height: 32, 
                            bgcolor: 'primary.main', 
                            borderRadius: '50%', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            fontSize: 14
                          }}>
                            {index + 1}
                          </Box>
                          <Box>
                            <Typography variant="body1" fontWeight={500} color="text.primary">
                              {product.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {product.quantity} unidades
                            </Typography>
                          </Box>
                        </Stack>
                        <Typography variant="h6" fontWeight="bold" sx={{ color: 'success.main' }}>
                          ${product.revenue.toLocaleString('es-MX')}
                        </Typography>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ 
                p: 3, 
                borderRadius: 2, 
                bgcolor: 'background.paper', 
                border: '1px solid rgba(255, 255, 255, 0.1)',
                height: '100%'
              }}>
                <Stack direction="row" alignItems="center" spacing={1} mb={3}>
                  <WarningIcon sx={{ color: 'warning.main' }} />
                  <Typography variant="h6" fontWeight={600} color="text.primary">
                    Alertas Inteligentes
                  </Typography>
                </Stack>
                <Stack spacing={2}>
                  {dashboardData.predictions.stockAlerts.map((alert, index) => (
                    <Paper key={index} sx={{ 
                      p: 2, 
                      bgcolor: 'rgba(245, 158, 11, 0.1)', 
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                      borderRadius: 1.5
                    }}>
                      <Stack direction="row" spacing={1.5}>
                        <WarningIcon sx={{ color: 'warning.main', flexShrink: 0, mt: 0.5 }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body1" fontWeight={500} color="text.primary" mb={0.5}>
                            {alert.product}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" mb={1}>
                            {alert.message}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'warning.light' }}>
                            Acción recomendada: {alert.action}
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  ))}
                  {dashboardData.predictions.stockAlerts.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        No hay alertas en este momento
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
}