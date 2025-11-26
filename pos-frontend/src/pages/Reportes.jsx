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
  Tooltip,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Alert,
  Snackbar,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon,
  ShoppingCart as CartIcon,
  Assessment as AssessmentIcon,
  CalendarToday as CalendarIcon,
  PictureAsPdf as PdfIcon,
  FileDownload as DownloadIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  TrendingDown as TrendingDownIcon,
  People as PeopleIcon,
  Inventory as InventoryIcon,
  LocalOffer as LocalOfferIcon
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, 
  CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  AreaChart, Area, ComposedChart
} from 'recharts';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
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
    info: {
      main: '#3B82F6',
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

const COLORS = ['#4F7FFF', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#8B5CF6'];

export default function ReportesVentas() {
  const [periodo, setPeriodo] = useState('todas');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [data, setData] = useState({
    metrics: {},
    trend: [],
    categories: [],
    topProducts: [],
    vendedores: [],
    comparativa: []
  });

  // Calcular fechas por defecto
  useEffect(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    
    setFechaInicio(start.toISOString().split('T')[0]);
    setFechaFin(end.toISOString().split('T')[0]);
  }, []);

  // Mostrar snackbar
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // Cargar datos
  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');

      let startDate = fechaInicio;
      let endDate = fechaFin;

      if (periodo !== 'personalizado') {
        const end = new Date();
        const start = new Date();
        
        switch (periodo) {
          case 'dia':
            start.setDate(start.getDate() - 1);
            break;
          case 'semana':
            start.setDate(start.getDate() - 7);
            break;
          case 'mes':
            start.setMonth(start.getMonth() - 1);
            break;
          case 'trimestre':
            start.setMonth(start.getMonth() - 3);
            break;
          case 'año':
            start.setFullYear(start.getFullYear() - 1);
            break;
          case 'todas':
            // No establecer fechas para obtener todos los datos
            startDate = null;
            endDate = null;
            break;
          default:
            start.setDate(start.getDate() - 7);
        }
        
        if (periodo !== 'todas') {
          startDate = start.toISOString().split('T')[0];
          endDate = end.toISOString().split('T')[0];
        }
      }

      // Construir parámetros de URL
      const params = new URLSearchParams();
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);

      const queryString = params.toString();
      const urlSuffix = queryString ? `?${queryString}` : '';

      // Hacer todas las peticiones en paralelo
      const [metricsRes, trendRes, categoriesRes, topProductsRes] = await Promise.all([
        api.get(`/reports/metrics${urlSuffix}`),
        api.get(`/reports/trend${urlSuffix}`),
        api.get('/reports/categories'),
        api.get('/reports/top-products?limit=10')
      ]);

      const newData = {
        metrics: metricsRes.data,
        trend: trendRes.data,
        categories: categoriesRes.data,
        topProducts: topProductsRes.data,
        vendedores: [],
        comparativa: []
      };

      // Verificar si hay datos
      const hasData = newData.metrics.total_ventas > 0;
      
      if (!hasData) {
        showSnackbar(
          'No se encontraron ventas en el período seleccionado. Mostrando datos de ejemplo.', 
          'warning'
        );
      } else {
        showSnackbar(`Reporte cargado: ${newData.trend.length} días de datos`, 'success');
      }

      setData(newData);

    } catch (err) {
      console.error('Error cargando reportes:', err);
      const errorMsg = 'Error al cargar los datos de reportes. Mostrando datos de ejemplo.';
      setError(errorMsg);
      showSnackbar(errorMsg, 'error');
      
      // Datos de ejemplo mejorados
      setData({
        metrics: {
          total_ventas: 95999.86,
          total_transacciones: 10,
          ticket_promedio: 9599.99,
          total_productos: 13,
          crecimiento: 12.5,
          ventas_promedio_dia: 13714.27
        },
        trend: [
          { fecha: '08/01', ventas: 1999.99, cantidad: 1 },
          { fecha: '09/01', ventas: 1999.98, cantidad: 1 },
          { fecha: '10/01', ventas: 3499.99, cantidad: 1 },
          { fecha: '11/01', ventas: 8999.95, cantidad: 1 },
          { fecha: '12/01', ventas: 4599.97, cantidad: 1 },
          { fecha: '13/01', ventas: 1299.99, cantidad: 1 },
          { fecha: '14/01', ventas: 2599.98, cantidad: 1 },
          { fecha: '15/01', ventas: 15999.99, cantidad: 1 }
        ],
        categories: [
          { nombre: 'Electrónica', valor: 78999.91, cantidad: 7, porcentaje: 82 },
          { nombre: 'Accesorios', valor: 12999.95, cantidad: 5, porcentaje: 14 },
          { nombre: 'Componentes', valor: 1999.99, cantidad: 1, porcentaje: 2 },
          { nombre: 'Consumibles', valor: 1499.98, cantidad: 2, porcentaje: 2 }
        ],
        topProducts: [
          { nombre: 'Laptop HP ProBook 15', ventas: 31999.98, cantidad: 2, margen: 3999.99 },
          { nombre: 'Mouse Logitech MX Master 3', ventas: 6499.95, cantidad: 5, margen: 2499.95 },
          { nombre: 'Laptop Gaming ASUS TUF', ventas: 15999.99, cantidad: 1, margen: 3999.99 },
          { nombre: 'Impresora Epson EcoTank', ventas: 5999.99, cantidad: 1, margen: 1499.99 },
          { nombre: 'Monitor Samsung 24" FHD', ventas: 3299.99, cantidad: 1, margen: 799.99 }
        ],
        vendedores: [
          { nombre: 'Juan Pérez', ventas: 22299.97, transacciones: 3 },
          { nombre: 'María García', ventas: 17599.93, transacciones: 3 },
          { nombre: 'Carlos López', ventas: 9899.97, transacciones: 2 }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [periodo, fechaInicio, fechaFin]);

  // Exportar a Excel
  const exportarExcel = () => {
    try {
      const workbook = XLSX.utils.book_new();
      
      // Hoja de métricas
      const metricsData = [
        ['Métrica', 'Valor'],
        ['Ventas Totales', data.metrics.total_ventas],
        ['Transacciones', data.metrics.total_transacciones],
        ['Ticket Promedio', data.metrics.ticket_promedio],
        ['Productos Vendidos', data.metrics.total_productos],
        ['Crecimiento', `${data.metrics.crecimiento || 0}%`]
      ];
      const metricsSheet = XLSX.utils.aoa_to_sheet(metricsData);
      XLSX.utils.book_append_sheet(workbook, metricsSheet, 'Métricas');

      // Hoja de productos top
      const productsData = [
        ['Producto', 'Ventas', 'Cantidad', 'Margen']
      ];
      data.topProducts.forEach(product => {
        productsData.push([
          product.nombre,
          product.ventas,
          product.cantidad,
          product.margen || 0
        ]);
      });
      const productsSheet = XLSX.utils.aoa_to_sheet(productsData);
      XLSX.utils.book_append_sheet(workbook, productsSheet, 'Productos Top');

      // Hoja de tendencia
      const trendData = [
        ['Fecha', 'Ventas', 'Transacciones']
      ];
      data.trend.forEach(day => {
        trendData.push([day.fecha, day.ventas, day.cantidad]);
      });
      const trendSheet = XLSX.utils.aoa_to_sheet(trendData);
      XLSX.utils.book_append_sheet(workbook, trendSheet, 'Tendencia');

      // Generar archivo
      const fileName = `reporte_ventas_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);
      
      showSnackbar('Reporte exportado a Excel exitosamente', 'success');
    } catch (error) {
      console.error('Error exportando a Excel:', error);
      showSnackbar('Error al exportar a Excel', 'error');
    }
  };

  // Generar PDF
// Generar PDF - Versión corregida y probada
// Generar PDF - Versión corregida y simplificada
const generarPDF = () => {
  try {
    console.log('🔄 Iniciando generación de PDF...');

    // Crear una instancia FRESCA de jsPDF
    const doc = new jsPDF();
    
    // Configuración básica - SIN autoTable primero
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPosition = 20;

    // 1. TÍTULO
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(0, 51, 102);
    doc.text('REPORTE DE VENTAS', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 10;

    // 2. INFORMACIÓN DEL PERÍODO
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    
    const periodoText = getPeriodoText(periodo, fechaInicio, fechaFin);
    doc.text(`Período: ${periodoText}`, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 5;
    
    doc.text(`Generado: ${new Date().toLocaleDateString('es-MX')}`, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    // 3. MÉTRICAS PRINCIPALES
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('MÉTRICAS PRINCIPALES', 20, yPosition);
    yPosition += 10;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    
    const metrics = [
      `• Ventas Totales: ${formatCurrency(data.metrics.total_ventas)}`,
      `• Transacciones: ${data.metrics.total_transacciones}`,
      `• Ticket Promedio: ${formatCurrency(data.metrics.ticket_promedio)}`,
      `• Productos Vendidos: ${data.metrics.total_productos}`
    ];

    metrics.forEach(metric => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(metric, 25, yPosition);
      yPosition += 8;
    });

    yPosition += 10;

    // 4. PRODUCTOS MÁS VENDIDOS
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('PRODUCTOS MÁS VENDIDOS', 20, yPosition);
    yPosition += 10;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    data.topProducts.slice(0, 8).forEach((product, index) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      
      const productText = `${index + 1}. ${product.nombre}`;
      const salesText = `${product.cantidad} und - ${formatCurrency(product.ventas)}`;
      
      doc.text(productText, 25, yPosition);
      doc.text(salesText, pageWidth - 60, yPosition, { align: 'right' });
      
      yPosition += 7;
    });

    // 5. PIE DE PÁGINA
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Página ${i} de ${totalPages} - Sistema POS`,
        pageWidth / 2,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
    }

    // GUARDAR PDF
    const fileName = `reporte_ventas_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
    
    console.log('✅ PDF generado exitosamente');
    showSnackbar('PDF generado exitosamente', 'success');

  } catch (error) {
    console.error('❌ Error en generarPDF:', error);
    
    let errorMessage = 'Error al generar PDF';
    if (error.message) {
      errorMessage += `: ${error.message}`;
    }
    
    showSnackbar(errorMessage, 'error');
    
    // Ofrecer alternativa inmediata
    setTimeout(() => {
      if (window.confirm('No se pudo generar el PDF. ¿Deseas exportar en Excel en su lugar?')) {
        exportarExcel();
      }
    }, 1000);
  }
};

// Función auxiliar (asegúrate de que esté definida)
const getPeriodoText = (periodo, fechaInicio, fechaFin) => {
  switch (periodo) {
    case 'dia': return 'Último día';
    case 'semana': return 'Última semana';
    case 'mes': return 'Último mes';
    case 'trimestre': return 'Último trimestre';
    case 'año': return 'Último año';
    case 'todas': return 'Todas las ventas';
    case 'personalizado': return `Personalizado (${fechaInicio} a ${fechaFin})`;
    default: return 'Período no especificado';
  }
};



  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const getCrecimientoColor = (crecimiento) => {
    if (crecimiento > 0) return 'success';
    if (crecimiento < 0) return 'error';
    return 'warning';
  };

  const getCrecimientoIcon = (crecimiento) => {
    if (crecimiento > 0) return <TrendingUpIcon />;
    if (crecimiento < 0) return <TrendingDownIcon />;
    return <InfoIcon />;
  };

  const hasData = data.metrics.total_ventas > 0;

  if (loading) {
    return (
      <ThemeProvider theme={darkTheme}>
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Stack alignItems="center" spacing={2}>
            <CircularProgress size={60} sx={{ color: 'primary.main' }} />
            <Typography variant="h6" color="text.primary">
              Cargando reportes...
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Analizando datos de ventas
            </Typography>
          </Stack>
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
                  Reportes de Ventas
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {hasData 
                    ? `Análisis de ${data.trend.length} días con ${data.metrics.total_transacciones} transacciones`
                    : 'No hay datos disponibles para el período seleccionado'
                  }
                </Typography>
              </Box>
              <Stack direction="row" spacing={2} sx={{ width: { xs: '100%', sm: 'auto' } }}>
                <Tooltip title="Actualizar datos">
                  <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={fetchData}
                    disabled={loading}
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
                    Actualizar
                  </Button>
                </Tooltip>
                <Tooltip title="Exportar a Excel">
                  <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    onClick={exportarExcel}
                    disabled={!hasData}
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
                    Excel
                  </Button>
                </Tooltip>
                <Button
                  variant="contained"
                  startIcon={<PdfIcon />}
                  onClick={generarPDF}
                  disabled={!hasData}
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
                  PDF
                </Button>
              </Stack>
            </Stack>
          </Box>

          {/* Alertas */}
          {error && (
            <Alert 
              severity="error" 
              sx={{ mb: 3 }}
              action={
                <Button color="inherit" size="small" onClick={fetchData}>
                  Reintentar
                </Button>
              }
            >
              {error}
            </Alert>
          )}

          {!hasData && !loading && (
            <Alert 
              severity="warning" 
              icon={<WarningIcon />}
              sx={{ mb: 3 }}
              action={
                <Button color="inherit" size="small" onClick={() => setPeriodo('todas')}>
                  Ver todos los datos
                </Button>
              }
            >
              No se encontraron ventas en el período seleccionado. 
              {periodo !== 'todas' && ' Intenta cambiar el período o usar "Todas las ventas".'}
            </Alert>
          )}

          {/* Filtros */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 2, bgcolor: 'background.paper', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
              <FilterIcon sx={{ color: 'primary.main' }} />
              <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                Filtros de Reporte
              </Typography>
              {!hasData && (
                <Chip 
                  icon={<WarningIcon />}
                  label="Sin datos"
                  size="small"
                  color="warning"
                  variant="outlined"
                />
              )}
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
                    <MenuItem value="todas">Todas las ventas</MenuItem>
                    <MenuItem value="dia">Último día</MenuItem>
                    <MenuItem value="semana">Última semana</MenuItem>
                    <MenuItem value="mes">Último mes</MenuItem>
                    <MenuItem value="trimestre">Último trimestre</MenuItem>
                    <MenuItem value="año">Último año</MenuItem>
                    <MenuItem value="personalizado">Personalizado</MenuItem>
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

            {/* Información del período */}
            {hasData && (
              <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(79, 127, 255, 0.05)', borderRadius: 1 }}>
                <Typography variant="body2" color="primary.main" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <InfoIcon fontSize="small" />
                  {periodo === 'todas' 
                    ? `Mostrando todas las ventas (${data.trend.length} días)`
                    : `Período seleccionado: ${periodo} (${data.trend.length} días)`
                  }
                </Typography>
              </Box>
            )}
          </Paper>

          {/* Métricas Principales */}
          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                bgcolor: 'background.paper', 
                border: `1px solid ${hasData ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`, 
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
                      <Typography variant="body2" color="text.secondary" mb={1} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <MoneyIcon fontSize="small" />
                        Ventas Totales
                      </Typography>
                      <Typography variant="h4" fontWeight="bold" color={hasData ? "success.main" : "text.secondary"}>
                        {hasData ? formatCurrency(data.metrics.total_ventas) : '$0.00'}
                      </Typography>
                      <Chip 
                        icon={getCrecimientoIcon(data.metrics.crecimiento || 0)}
                        label={`${hasData ? (data.metrics.crecimiento || '+12.5') : '0'}%`} 
                        size="small" 
                        color={getCrecimientoColor(data.metrics.crecimiento || 0)}
                        sx={{ 
                          mt: 1,
                          fontWeight: 600
                        }} 
                      />
                    </Box>
                    <Box sx={{ 
                      bgcolor: hasData ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)', 
                      p: 1.5, 
                      borderRadius: 2 
                    }}>
                      <MoneyIcon sx={{ 
                        color: hasData ? 'success.main' : 'text.secondary', 
                        fontSize: 28 
                      }} />
                    </Box>
                  </Stack>
                  {hasData && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      {data.metrics.total_transacciones} transacciones
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                bgcolor: 'background.paper', 
                border: `1px solid ${hasData ? 'rgba(79, 127, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`, 
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
                      <Typography variant="body2" color="text.secondary" mb={1} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <CartIcon fontSize="small" />
                        Transacciones
                      </Typography>
                      <Typography variant="h4" fontWeight="bold" color={hasData ? "primary.main" : "text.secondary"}>
                        {hasData ? data.metrics.total_transacciones : 0}
                      </Typography>
                      <Chip 
                        label={`${hasData ? data.metrics.total_productos : 0} productos`} 
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
                      bgcolor: hasData ? 'rgba(79, 127, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)', 
                      p: 1.5, 
                      borderRadius: 2 
                    }}>
                      <CartIcon sx={{ 
                        color: hasData ? 'primary.main' : 'text.secondary', 
                        fontSize: 28 
                      }} />
                    </Box>
                  </Stack>
                  {hasData && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      {data.metrics.ventas_promedio_dia ? formatCurrency(data.metrics.ventas_promedio_dia) + '/día' : 'Promedio diario'}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                bgcolor: 'background.paper', 
                border: `1px solid ${hasData ? 'rgba(245, 158, 11, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`, 
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
                      <Typography variant="body2" color="text.secondary" mb={1} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <TrendingUpIcon fontSize="small" />
                        Ticket Promedio
                      </Typography>
                      <Typography variant="h4" fontWeight="bold" color={hasData ? "warning.main" : "text.secondary"}>
                        {hasData ? formatCurrency(data.metrics.ticket_promedio) : '$0.00'}
                      </Typography>
                      <Chip 
                        label="Eficiencia" 
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
                      bgcolor: hasData ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.05)', 
                      p: 1.5, 
                      borderRadius: 2 
                    }}>
                      <TrendingUpIcon sx={{ 
                        color: hasData ? 'warning.main' : 'text.secondary', 
                        fontSize: 28 
                      }} />
                    </Box>
                  </Stack>
                  {hasData && data.metrics.ticket_promedio > 5000 && (
                    <Typography variant="caption" color="success.main" sx={{ mt: 1, display: 'block' }}>
                      ⭐ Alto valor promedio
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                bgcolor: 'background.paper', 
                border: `1px solid ${hasData ? 'rgba(139, 92, 246, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`, 
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
                      <Typography variant="body2" color="text.secondary" mb={1} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <AssessmentIcon fontSize="small" />
                        Productos Vendidos
                      </Typography>
                      <Typography variant="h4" fontWeight="bold" color={hasData ? "text.primary" : "text.secondary"}>
                        {hasData ? data.metrics.total_productos : 0}
                      </Typography>
                      <Chip 
                        label={`${hasData ? data.categories.length : 0} categorías`} 
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
                      bgcolor: hasData ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255, 255, 255, 0.05)', 
                      p: 1.5, 
                      borderRadius: 2 
                    }}>
                      <AssessmentIcon sx={{ 
                        color: hasData ? '#8B5CF6' : 'text.secondary', 
                        fontSize: 28 
                      }} />
                    </Box>
                  </Stack>
                  {hasData && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      {data.topProducts.length} productos destacados
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Gráficas y Tablas */}
          {hasData ? (
            <Grid container spacing={3}>
              {/* Tendencia de Ventas */}
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
                    <ComposedChart data={data.trend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                      <XAxis dataKey="fecha" stroke="#8B95A8" />
                      <YAxis yAxisId="left" stroke="#8B95A8" />
                      <YAxis yAxisId="right" orientation="right" stroke="#8B95A8" />
                      <RechartsTooltip 
                        contentStyle={{ 
                          backgroundColor: '#1A2332', 
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          color: '#E1E8F0'
                        }}
                        formatter={(value, name) => [
                          name === 'Ventas' ? formatCurrency(value) : value,
                          name
                        ]}
                      />
                      <Legend />
                      <Area 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="ventas" 
                        fill="rgba(79, 127, 255, 0.3)" 
                        stroke="#4F7FFF" 
                        name="Ventas" 
                      />
                      <Bar 
                        yAxisId="right"
                        dataKey="cantidad" 
                        fill="rgba(16, 185, 129, 0.5)" 
                        name="Transacciones" 
                        radius={[4, 4, 0, 0]}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>

              {/* Ventas por Categoría */}
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
                        data={data.categories}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="valor"
                        label={({ nombre, porcentaje }) => `${nombre} (${porcentaje}%)`}
                      >
                        {data.categories.map((entry, index) => (
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
                        formatter={(value, name, props) => {
                          if (props.payload.ventas_totales) {
                            return [formatCurrency(props.payload.ventas_totales), 'Ventas totales'];
                          }
                          return [value + '%', name];
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>

              {/* Top Productos */}
              <Grid item xs={12} lg={6}>
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
                    <BarChart data={data.topProducts.slice(0, 5)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                      <XAxis dataKey="nombre" stroke="#8B95A8" angle={-45} textAnchor="end" height={80} />
                      <YAxis stroke="#8B95A8" />
                      <RechartsTooltip 
                        contentStyle={{ 
                          backgroundColor: '#1A2332', 
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          color: '#E1E8F0'
                        }}
                        formatter={(value, name) => [
                          name === 'Ventas' ? formatCurrency(value) : value,
                          name
                        ]}
                      />
                      <Legend />
                      <Bar dataKey="ventas" fill="#4F7FFF" name="Ventas ($)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="cantidad" fill="#10B981" name="Cantidad" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>

              {/* Tabla de Productos Detallada */}
              <Grid item xs={12} lg={6}>
                <Paper sx={{ 
                  p: 3, 
                  borderRadius: 2, 
                  bgcolor: 'background.paper', 
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <Typography variant="h6" fontWeight={600} color="text.primary" mb={3}>
                    Detalle de Productos
                  </Typography>
                  <TableContainer sx={{ maxHeight: 320 }}>
                    <Table stickyHeader size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Producto</TableCell>
                          <TableCell align="right">Cantidad</TableCell>
                          <TableCell align="right">Ventas</TableCell>
                          <TableCell align="right">Margen</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data.topProducts.map((product, index) => (
                          <TableRow key={index} hover>
                            <TableCell>
                              <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                                {product.nombre}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Chip 
                                label={product.cantidad} 
                                size="small" 
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2" fontWeight={600} color="success.main">
                                {formatCurrency(product.ventas)}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2" color="warning.main">
                                {product.margen ? formatCurrency(product.margen) : 'N/A'}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
            </Grid>
          ) : (
            // Estado cuando no hay datos
            <Paper sx={{ 
              p: 6, 
              borderRadius: 2, 
              bgcolor: 'background.paper', 
              border: '1px solid rgba(255, 255, 255, 0.1)',
              textAlign: 'center'
            }}>
              <AssessmentIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No hay datos disponibles
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                No se encontraron ventas en el período seleccionado. 
                Intenta cambiar los filtros o ver todas las ventas.
              </Typography>
              <Button
                variant="contained"
                onClick={() => setPeriodo('todas')}
                startIcon={<RefreshIcon />}
              >
                Ver todas las ventas
              </Button>
            </Paper>
          )}
        </Container>

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
      </Box>
    </ThemeProvider>
  );
}