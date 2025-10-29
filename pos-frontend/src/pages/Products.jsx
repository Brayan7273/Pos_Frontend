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
  Add,
  Edit,
  Delete,
  Inventory,
  Warning,
  FilterList,
  Download,
  Upload,
  BarChart,
  Visibility
} from "@mui/icons-material"

export default function ProductsList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState(["all"])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      // Simulated data for demo
      setTimeout(() => {
        const mockProducts = [
          {
            id: 1,
            name: "Laptop HP ProBook",
            sku: "LAP-001",
            category: "Electrónica",
            price: 15999.99,
            stock: 5,
            minStock: 10,
            image: null
          },
          {
            id: 2,
            name: "Mouse Logitech MX",
            sku: "MOU-002",
            category: "Accesorios",
            price: 1299.99,
            stock: 25,
            minStock: 15,
            image: null
          },
          {
            id: 3,
            name: "Teclado Mecánico RGB",
            sku: "KEY-003",
            category: "Accesorios",
            price: 2499.99,
            stock: 8,
            minStock: 10,
            image: null
          },
          {
            id: 4,
            name: "Monitor Dell 27\"",
            sku: "MON-004",
            category: "Electrónica",
            price: 8999.99,
            stock: 3,
            minStock: 5,
            image: null
          }
        ]
        setProducts(mockProducts)
        setLoading(false)
      }, 1000)
    } catch (err) {
      setError("Error de conexión con el servidor")
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      setTimeout(() => {
        setCategories(["all", "Electrónica", "Accesorios", "Oficina"])
      }, 500)
    } catch (err) {
      console.error("Error al cargar categorías:", err)
    }
  }

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         p.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const lowStockProducts = products.filter(p => p.stock < p.minStock).length
  const totalInventoryValue = products.reduce((acc, p) => acc + (p.price * p.stock), 0)

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este producto?")) return
    setProducts(products.filter(p => p.id !== id))
  }

  const handleExport = () => {
    alert("Funcionalidad de exportación")
  }

  const handleImport = (e) => {
    const file = e.target.files[0]
    if (file) {
      alert(`Importando: ${file.name}`)
    }
  }

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
            Cargando productos...
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
              Gestión de Productos
            </Typography>
            <Typography variant="body1" sx={{ color: "#9CA3AF" }}>
              Administra tu inventario
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{
              bgcolor: "#2563EB",
              "&:hover": { bgcolor: "#1D4ED8" },
              fontWeight: 600,
              textTransform: "none",
              px: 3
            }}
          >
            Nuevo Producto
          </Button>
        </Box>

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
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
                      Total Productos
                    </Typography>
                    <Typography variant="h4" sx={{ color: "#FFFFFF", fontWeight: "bold" }}>
                      {products.length}
                    </Typography>
                  </Box>
                  <Inventory sx={{ fontSize: 40, color: "#3B82F6" }} />
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
                      Stock Bajo
                    </Typography>
                    <Typography variant="h4" sx={{ color: "#F59E0B", fontWeight: "bold" }}>
                      {lowStockProducts}
                    </Typography>
                  </Box>
                  <Warning sx={{ fontSize: 40, color: "#F59E0B" }} />
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
                      Valor Inventario
                    </Typography>
                    <Typography variant="h5" sx={{ color: "#10B981", fontWeight: "bold" }}>
                      ${totalInventoryValue.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </Typography>
                  </Box>
                  <BarChart sx={{ fontSize: 40, color: "#10B981" }} />
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
                      Categorías
                    </Typography>
                    <Typography variant="h4" sx={{ color: "#8B5CF6", fontWeight: "bold" }}>
                      {categories.length - 1}
                    </Typography>
                  </Box>
                  <FilterList sx={{ fontSize: 40, color: "#8B5CF6" }} />
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
                placeholder="Buscar por nombre o SKU..."
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
                    bgcolor: "#000000",
                    borderColor: "#334155",
                    color: "#D1D5DB",
                    "&:hover": { bgcolor: "#1E293B", borderColor: "#334155" },
                    textTransform: "none"
                  }}
                >
                  Filtros
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={handleExport}
                  sx={{
                    bgcolor: "#000000",
                    borderColor: "#334155",
                    color: "#D1D5DB",
                    "&:hover": { bgcolor: "#1E293B", borderColor: "#334155" },
                    textTransform: "none"
                  }}
                >
                  Exportar
                </Button>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<Upload />}
                  sx={{
                    bgcolor: "#000000",
                    borderColor: "#334155",
                    color: "#D1D5DB",
                    "&:hover": { bgcolor: "#1E293B", borderColor: "#334155" },
                    textTransform: "none"
                  }}
                >
                  Importar
                  <input
                    type="file"
                    hidden
                    accept=".csv,.xlsx,.xls"
                    onChange={handleImport}
                  />
                </Button>
              </Box>
            </Box>

            <Collapse in={showFilters}>
              <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid #334155" }}>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {categories.map(cat => (
                    <Chip
                      key={cat}
                      label={cat === "all" ? "Todas" : cat}
                      onClick={() => setSelectedCategory(cat)}
                      sx={{
                        bgcolor: selectedCategory === cat ? "#2563EB" : "#1E293B",
                        color: selectedCategory === cat ? "#FFFFFF" : "#D1D5DB",
                        "&:hover": {
                          bgcolor: selectedCategory === cat ? "#1D4ED8" : "#334155"
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

        {/* Products Table */}
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
                  <TableCell sx={{ color: "#D1D5DB", fontWeight: 600, borderBottom: "1px solid #334155" }}>
                    SKU
                  </TableCell>
                  <TableCell sx={{ color: "#D1D5DB", fontWeight: 600, borderBottom: "1px solid #334155" }}>
                    Categoría
                  </TableCell>
                  <TableCell align="right" sx={{ color: "#D1D5DB", fontWeight: 600, borderBottom: "1px solid #334155" }}>
                    Precio
                  </TableCell>
                  <TableCell align="right" sx={{ color: "#D1D5DB", fontWeight: 600, borderBottom: "1px solid #334155" }}>
                    Stock
                  </TableCell>
                  <TableCell align="right" sx={{ color: "#D1D5DB", fontWeight: 600, borderBottom: "1px solid #334155" }}>
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow
                    key={product.id}
                    sx={{
                      borderBottom: "1px solid #1E293B",
                      "&:hover": { bgcolor: "rgba(59, 130, 246, 0.05)" }
                    }}
                  >
                    <TableCell sx={{ borderBottom: "1px solid #1E293B" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        {product.image ? (
                          <Avatar src={product.image} variant="rounded" sx={{ width: 40, height: 40 }} />
                        ) : (
                          <Avatar variant="rounded" sx={{ width: 40, height: 40, bgcolor: "#334155" }}>
                            <Inventory sx={{ color: "#6B7280", fontSize: 20 }} />
                          </Avatar>
                        )}
                        <Typography sx={{ color: "#FFFFFF", fontWeight: 500 }}>
                          {product.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: "#9CA3AF", borderBottom: "1px solid #1E293B" }}>
                      {product.sku}
                    </TableCell>
                    <TableCell sx={{ borderBottom: "1px solid #1E293B" }}>
                      <Chip
                        label={product.category}
                        size="small"
                        sx={{
                          bgcolor: "rgba(59, 130, 246, 0.2)",
                          color: "#60A5FA",
                          fontWeight: 500
                        }}
                      />
                    </TableCell>
                    <TableCell align="right" sx={{ color: "#10B981", fontWeight: 600, borderBottom: "1px solid #1E293B" }}>
                      ${parseFloat(product.price).toFixed(2)}
                    </TableCell>
                    <TableCell align="right" sx={{ borderBottom: "1px solid #1E293B" }}>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 1 }}>
                        <Typography
                          sx={{
                            fontWeight: 600,
                            color: product.stock < product.minStock ? "#F59E0B" : "#FFFFFF"
                          }}
                        >
                          {product.stock}
                        </Typography>
                        {product.stock < product.minStock && (
                          <Warning sx={{ color: "#F59E0B", fontSize: 16 }} />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell align="right" sx={{ borderBottom: "1px solid #1E293B" }}>
                      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 0.5 }}>
                        <IconButton size="small" sx={{ color: "#3B82F6" }}>
                          <Visibility fontSize="small" />
                        </IconButton>
                        <IconButton size="small" sx={{ color: "#10B981" }}>
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(product.id)}
                          sx={{ color: "#EF4444" }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {filteredProducts.length === 0 && !loading && (
            <Box sx={{ py: 6, textAlign: "center" }}>
              <Inventory sx={{ fontSize: 64, color: "#4B5563", mb: 2 }} />
              <Typography variant="h6" sx={{ color: "#9CA3AF", mb: 1 }}>
                No se encontraron productos
              </Typography>
              <Typography variant="body2" sx={{ color: "#6B7280" }}>
                Comienza agregando tu primer producto
              </Typography>
            </Box>
          )}
        </Card>
      </Container>
    </Box>
  )
}