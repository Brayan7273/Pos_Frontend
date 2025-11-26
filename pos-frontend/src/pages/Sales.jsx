import { useState, useEffect } from "react"
import {
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  Typography,
  IconButton,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  InputAdornment,
  Grid,
  Collapse,
  Avatar,
  Alert,
  CircularProgress,
  Container
} from "@mui/material"
import {
  Search,
  Refresh,
  Download,
  FilterList,
  Receipt,
  TrendingUp,
  Payment,
  CalendarToday,
  BarChart
} from "@mui/icons-material"
import * as XLSX from 'xlsx'
import api from '../services/api'

export default function Sales() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [sales, setSales] = useState([])
  const [filteredSales, setFilteredSales] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: ''
  })

  useEffect(() => {
    fetchSales()
  }, [])

  const fetchSales = async () => {
    try {
      setLoading(true)
      setError("")
      const response = await api.get("/sales-report")
      const sortedSales = response.data.sort((a, b) => new Date(b.date) - new Date(a.date))
      setSales(sortedSales)
      setFilteredSales(sortedSales)
    } catch (err) {
      console.error("Error fetching sales:", err)
      setError("Error de conexión con el servidor: " + (err.response?.data?.message || err.message))
      // Datos de ejemplo para desarrollo
      setSales(getMockSales())
      setFilteredSales(getMockSales())
    } finally {
      setLoading(false)
    }
  }

  // Obtener métodos de pago únicos
  const paymentMethods = ["all", ...new Set(sales.map(s => s.payment_method).filter(Boolean))]

  // Aplicar filtros
  useEffect(() => {
    let filtered = sales
    
    // Filtro de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(s => 
        s.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.id?.toString().includes(searchTerm)
      )
    }
    
    // Filtro por método de pago
    if (selectedPaymentMethod !== "all") {
      filtered = filtered.filter(s => s.payment_method === selectedPaymentMethod)
    }
    
    // Filtro por fecha
    if (filters.startDate) {
      filtered = filtered.filter(s => new Date(s.date) >= new Date(filters.startDate))
    }
    
    if (filters.endDate) {
      filtered = filtered.filter(s => new Date(s.date) <= new Date(filters.endDate))
    }
    
    setFilteredSales(filtered)
  }, [searchTerm, selectedPaymentMethod, filters, sales])

  // Exportar a Excel
  const exportToExcel = () => {
    if (filteredSales.length === 0) {
      alert('No hay datos para exportar')
      return
    }

    const excelData = filteredSales.map(sale => ({
      'ID Venta': sale.id || 'N/A',
      'Producto': sale.product_name,
      'Cantidad': sale.quantity,
      'Precio Unitario': sale.unit_price || (sale.total / sale.quantity),
      'Total': sale.total,
      'Fecha': new Date(sale.date).toLocaleString('es-MX'),
      'Método de Pago': sale.payment_method || 'N/A',
      'Vendedor': sale.seller_name || 'N/A'
    }))

    const ws = XLSX.utils.json_to_sheet(excelData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Historial de Ventas')
    const fileName = `reporte_ventas_${new Date().toISOString().split('T')[0]}.xlsx`
    XLSX.writeFile(wb, fileName)
  }

  // Estadísticas
  const totalSales = filteredSales.length
  const totalRevenue = filteredSales.reduce((sum, sale) => sum + (parseFloat(sale.total) || 0), 0)
  const averageSale = totalSales > 0 ? totalRevenue / totalSales : 0
  const todaySales = filteredSales.filter(s => {
    const saleDate = new Date(s.date)
    const today = new Date()
    return saleDate.toDateString() === today.toDateString()
  }).length

  // Datos mock para desarrollo
  const getMockSales = () => [
    {
      id: 1,
      product_name: "Laptop HP ProBook",
      quantity: 1,
      total: 15999.99,
      date: new Date().toISOString(),
      payment_method: "Tarjeta",
      seller_name: "Juan Pérez",
      unit_price: 15999.99
    },
    {
      id: 2,
      product_name: "Mouse Logitech MX",
      quantity: 2,
      total: 2599.98,
      date: new Date(Date.now() - 86400000).toISOString(),
      payment_method: "Efectivo",
      seller_name: "María García",
      unit_price: 1299.99
    }
  ]

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress size={60} sx={{ color: "#2563EB", mb: 2 }} />
          <Typography variant="h6" sx={{ color: "#FFFFFF" }}>
            Cargando ventas...
          </Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)",
        py: 3,
        px: { xs: 2, sm: 3 }
      }}
    >
      <Container maxWidth="xl">
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            flexWrap: "wrap",
            gap: 2
          }}
        >
          <Box>
            <Typography variant="h4" sx={{ color: "#FFFFFF", fontWeight: "bold", mb: 1 }}>
              Historial de Ventas
            </Typography>
            <Typography variant="body1" sx={{ color: "#9CA3AF" }}>
              Gestiona y exporta tu historial de ventas
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={fetchSales}
              disabled={loading}
              sx={{
                borderColor: "#334155",
                color: "#D1D5DB",
                "&:hover": { bgcolor: "#334155", borderColor: "#475569" },
                textTransform: "none"
              }}
            >
              Actualizar
            </Button>
            <Button
              variant="contained"
              startIcon={<Download />}
              onClick={exportToExcel}
              disabled={filteredSales.length === 0}
              sx={{
                bgcolor: "#059669",
                "&:hover": { bgcolor: "#047857" },
                fontWeight: 600,
                textTransform: "none",
                px: 3
              }}
            >
              Exportar Excel
            </Button>
          </Box>
        </Box>

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {/* Stats Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                bgcolor: "rgba(15, 23, 42, 0.9)",
                border: "1px solid #334155",
                backdropFilter: "blur(20px)"
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Box>
                    <Typography variant="body2" sx={{ color: "#9CA3AF", mb: 1 }}>
                      Total Ventas
                    </Typography>
                    <Typography variant="h4" sx={{ color: "#FFFFFF", fontWeight: "bold" }}>
                      {totalSales}
                    </Typography>
                  </Box>
                  <Receipt sx={{ fontSize: 40, color: "#3B82F6" }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                bgcolor: "rgba(15, 23, 42, 0.9)",
                border: "1px solid #334155",
                backdropFilter: "blur(20px)"
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Box>
                    <Typography variant="body2" sx={{ color: "#9CA3AF", mb: 1 }}>
                      Ingresos Totales
                    </Typography>
                    <Typography variant="h5" sx={{ color: "#10B981", fontWeight: "bold" }}>
                      ${totalRevenue.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </Typography>
                  </Box>
                  <TrendingUp sx={{ fontSize: 40, color: "#10B981" }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                bgcolor: "rgba(15, 23, 42, 0.9)",
                border: "1px solid #334155",
                backdropFilter: "blur(20px)"
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Box>
                    <Typography variant="body2" sx={{ color: "#9CA3AF", mb: 1 }}>
                      Venta Promedio
                    </Typography>
                    <Typography variant="h5" sx={{ color: "#8B5CF6", fontWeight: "bold" }}>
                      ${averageSale.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </Typography>
                  </Box>
                  <BarChart sx={{ fontSize: 40, color: "#8B5CF6" }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                bgcolor: "rgba(15, 23, 42, 0.9)",
                border: "1px solid #334155",
                backdropFilter: "blur(20px)"
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Box>
                    <Typography variant="body2" sx={{ color: "#9CA3AF", mb: 1 }}>
                      Ventas Hoy
                    </Typography>
                    <Typography variant="h4" sx={{ color: "#F59E0B", fontWeight: "bold" }}>
                      {todaySales}
                    </Typography>
                  </Box>
                  <CalendarToday sx={{ fontSize: 40, color: "#F59E0B" }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filters and Actions */}
        <Card
          sx={{
            bgcolor: "rgba(15, 23, 42, 0.9)",
            border: "1px solid #334155",
            backdropFilter: "blur(20px)",
            mb: 3
          }}
        >
          <CardContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                fullWidth
                placeholder="Buscar por producto o ID de venta..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: "#9CA3AF" }} />
                    </InputAdornment>
                  ),
                  sx: {
                    bgcolor: "#1E293B",
                    color: "#FFFFFF",
                    "& fieldset": { borderColor: "#334155" }
                  }
                }}
              />

              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                <Button
                  variant="outlined"
                  startIcon={<FilterList />}
                  onClick={() => setShowFilters(!showFilters)}
                  sx={{
                    bgcolor: "#1E293B",
                    borderColor: "#334155",
                    color: "#D1D5DB",
                    "&:hover": { bgcolor: "#334155", borderColor: "#475569" },
                    textTransform: "none"
                  }}
                >
                  Filtros
                </Button>
              </Box>
            </Box>

            <Collapse in={showFilters}>
              <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid #334155" }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      fullWidth
                      label="Fecha Inicio"
                      type="date"
                      value={filters.startDate}
                      onChange={(e) => setFilters({...filters, startDate: e.target.value})}
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        "& .MuiInputBase-input": { color: "#FFFFFF" },
                        "& .MuiInputLabel-root": { color: "#9CA3AF" },
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": { borderColor: "#334155" },
                          "&:hover fieldset": { borderColor: "#475569" }
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      fullWidth
                      label="Fecha Fin"
                      type="date"
                      value={filters.endDate}
                      onChange={(e) => setFilters({...filters, endDate: e.target.value})}
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        "& .MuiInputBase-input": { color: "#FFFFFF" },
                        "& .MuiInputLabel-root": { color: "#9CA3AF" },
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": { borderColor: "#334155" },
                          "&:hover fieldset": { borderColor: "#475569" }
                        }
                      }}
                    />
                  </Grid>
                </Grid>
                
                <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {paymentMethods.map(method => (
                    <Chip
                      key={method}
                      label={method === "all" ? "Todos" : method}
                      onClick={() => setSelectedPaymentMethod(method)}
                      sx={{
                        bgcolor: selectedPaymentMethod === method ? "#2563EB" : "#1E293B",
                        color: selectedPaymentMethod === method ? "#FFFFFF" : "#D1D5DB",
                        "&:hover": {
                          bgcolor: selectedPaymentMethod === method ? "#1D4ED8" : "#334155"
                        },
                        fontWeight: 500
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Collapse>
          </CardContent>
        </Card>

        {/* Sales Table */}
        <Card
          sx={{
            bgcolor: "rgba(15, 23, 42, 0.9)",
            border: "1px solid #334155",
            backdropFilter: "blur(20px)"
          }}
        >
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: "#1E293B" }}>
                <TableRow>
                  <TableCell sx={{ color: "#D1D5DB", fontWeight: 600, borderBottom: "1px solid #334155" }}>
                    Producto
                  </TableCell>
                  <TableCell align="center" sx={{ color: "#D1D5DB", fontWeight: 600, borderBottom: "1px solid #334155" }}>
                    Cantidad
                  </TableCell>
                  <TableCell align="right" sx={{ color: "#D1D5DB", fontWeight: 600, borderBottom: "1px solid #334155" }}>
                    P. Unitario
                  </TableCell>
                  <TableCell align="right" sx={{ color: "#D1D5DB", fontWeight: 600, borderBottom: "1px solid #334155" }}>
                    Total
                  </TableCell>
                  <TableCell sx={{ color: "#D1D5DB", fontWeight: 600, borderBottom: "1px solid #334155" }}>
                    Fecha
                  </TableCell>
                  <TableCell sx={{ color: "#D1D5DB", fontWeight: 600, borderBottom: "1px solid #334155" }}>
                    Método Pago
                  </TableCell>
                  <TableCell sx={{ color: "#D1D5DB", fontWeight: 600, borderBottom: "1px solid #334155" }}>
                    Vendedor
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSales.map((sale) => (
                  <TableRow
                    key={sale.id}
                    sx={{
                      borderBottom: "1px solid #1E293B",
                      "&:hover": { bgcolor: "rgba(59, 130, 246, 0.05)" }
                    }}
                  >
                    <TableCell sx={{ borderBottom: "1px solid #1E293B" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Avatar variant="rounded" sx={{ width: 40, height: 40, bgcolor: "#334155" }}>
                          <Receipt sx={{ color: "#6B7280", fontSize: 20 }} />
                        </Avatar>
                        <Box>
                          <Typography sx={{ color: "#FFFFFF", fontWeight: 500 }}>
                            {sale.product_name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#9CA3AF", fontSize: "0.75rem" }}>
                            ID: {sale.id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="center" sx={{ color: "#FFFFFF", fontWeight: 600, borderBottom: "1px solid #1E293B" }}>
                      {sale.quantity}
                    </TableCell>
                    <TableCell align="right" sx={{ color: "#9CA3AF", borderBottom: "1px solid #1E293B" }}>
                      ${(sale.unit_price || (sale.total / sale.quantity)).toFixed(2)}
                    </TableCell>
                    <TableCell align="right" sx={{ color: "#10B981", fontWeight: 600, borderBottom: "1px solid #1E293B" }}>
                      ${parseFloat(sale.total).toFixed(2)}
                    </TableCell>
                    <TableCell sx={{ color: "#9CA3AF", borderBottom: "1px solid #1E293B" }}>
                      {new Date(sale.date).toLocaleString('es-MX')}
                    </TableCell>
                    <TableCell sx={{ borderBottom: "1px solid #1E293B" }}>
                      <Chip
                        label={sale.payment_method || "N/A"}
                        size="small"
                        sx={{
                          bgcolor: "rgba(59, 130, 246, 0.2)",
                          color: "#60A5FA",
                          fontWeight: 500
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: "#9CA3AF", borderBottom: "1px solid #1E293B" }}>
                      {sale.seller_name || "N/A"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {filteredSales.length === 0 && !loading && (
            <Box sx={{ py: 6, textAlign: "center" }}>
              <Receipt sx={{ fontSize: 64, color: "#4B5563", mb: 2 }} />
              <Typography variant="h6" sx={{ color: "#9CA3AF", mb: 1 }}>
                No se encontraron ventas
              </Typography>
              <Typography variant="body2" sx={{ color: "#6B7280" }}>
                {searchTerm || selectedPaymentMethod !== "all" || filters.startDate || filters.endDate
                  ? "Intenta con otros términos de búsqueda" 
                  : "Aún no se han registrado ventas"}
              </Typography>
            </Box>
          )}
        </Card>
      </Container>
    </Box>
  )
}