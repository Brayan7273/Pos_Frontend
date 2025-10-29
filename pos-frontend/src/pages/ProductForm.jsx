import { useState } from "react"
import {
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  Typography,
  IconButton,
  Grid,
  MenuItem,
  Alert,
  Avatar,
  Container,
  Paper
} from "@mui/material"
import {
  Save,
  ArrowBack,
  Upload,
  Close,
  Inventory,
  AttachMoney,
  BarChart,
  Category
} from "@mui/icons-material"

export default function ProductForm() {
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    barcode: "",
    category: "",
    brand: "",
    description: "",
    costPrice: "",
    salePrice: "",
    stock: "",
    minStock: "",
    maxStock: "",
    unit: "pz",
    taxRate: "16",
    supplier: "",
    location: "",
  })

  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const categories = ["Bebidas", "Panadería", "Lácteos", "Granos", "Limpieza", "Snacks", "Abarrotes"]
  const units = ["pz", "kg", "lt", "m", "caja", "paquete"]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    const newImages = files.map(file => ({
      id: Date.now() + Math.random(),
      url: URL.createObjectURL(file),
      file
    }))
    setImages(prev => [...prev, ...newImages])
  }

  const removeImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id))
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name) newErrors.name = "El nombre es requerido"
    if (!formData.sku) newErrors.sku = "El SKU es requerido"
    if (!formData.category) newErrors.category = "La categoría es requerida"
    if (!formData.salePrice || parseFloat(formData.salePrice) <= 0) {
      newErrors.salePrice = "El precio de venta debe ser mayor a 0"
    }
    if (formData.costPrice && formData.salePrice && parseFloat(formData.costPrice) >= parseFloat(formData.salePrice)) {
      newErrors.costPrice = "El costo debe ser menor al precio de venta"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) return

    setLoading(true)
    setTimeout(() => {
      alert("Producto guardado exitosamente")
      setLoading(false)
    }, 1000)
  }

  const calculateMargin = () => {
    const cost = parseFloat(formData.costPrice) || 0
    const sale = parseFloat(formData.salePrice) || 0
    if (cost === 0 || sale === 0) return "0.00"
    return (((sale - cost) / sale) * 100).toFixed(2)
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
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <IconButton
            sx={{
              border: "1px solid #334155",
              color: "#D1D5DB",
              bgcolor: "transparent",
              "&:hover": { bgcolor: "#1E293B" }
            }}
          >
            <ArrowBack />
          </IconButton>
          <Box>
            <Typography variant="h4" sx={{ color: "#FFFFFF", fontWeight: "bold" }}>
              Nuevo Producto
            </Typography>
            <Typography variant="body2" sx={{ color: "#9CA3AF" }}>
              Completa la información del producto
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Columna Principal */}
          <Grid item xs={12} lg={8}>
            {/* Información Básica */}
            <Card
              sx={{
                bgcolor: "rgba(15, 23, 42, 0.9)",
                border: "1px solid #334155",
                backdropFilter: "blur(20px)",
                mb: 3
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                  <Inventory sx={{ color: "#3B82F6", fontSize: 28 }} />
                  <Typography variant="h6" sx={{ color: "#FFFFFF", fontWeight: 600 }}>
                    Información Básica
                  </Typography>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ color: "#D1D5DB", mb: 1, fontWeight: 500 }}>
                      Nombre del Producto *
                    </Typography>
                    <TextField
                      fullWidth
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Ej: Coca Cola 600ml"
                      error={!!errors.name}
                      helperText={errors.name}
                      InputProps={{
                        sx: {
                          bgcolor: "#1E293B",
                          color: "#FFFFFF",
                          "& fieldset": { borderColor: "#334155" },
                          "&:hover fieldset": { borderColor: "#475569" },
                          "&.Mui-focused fieldset": { borderColor: "#3B82F6" }
                        }
                      }}
                      FormHelperTextProps={{
                        sx: { color: "#EF4444" }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ color: "#D1D5DB", mb: 1, fontWeight: 500 }}>
                      SKU *
                    </Typography>
                    <TextField
                      fullWidth
                      name="sku"
                      value={formData.sku}
                      onChange={handleChange}
                      placeholder="Ej: BEB001"
                      error={!!errors.sku}
                      helperText={errors.sku}
                      InputProps={{
                        sx: {
                          bgcolor: "#1E293B",
                          color: "#FFFFFF",
                          "& fieldset": { borderColor: "#334155" },
                          "&:hover fieldset": { borderColor: "#475569" },
                          "&.Mui-focused fieldset": { borderColor: "#3B82F6" }
                        }
                      }}
                      FormHelperTextProps={{
                        sx: { color: "#EF4444" }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ color: "#D1D5DB", mb: 1, fontWeight: 500 }}>
                      Código de Barras
                    </Typography>
                    <TextField
                      fullWidth
                      name="barcode"
                      value={formData.barcode}
                      onChange={handleChange}
                      placeholder="7501234567890"
                      InputProps={{
                        sx: {
                          bgcolor: "#1E293B",
                          color: "#FFFFFF",
                          "& fieldset": { borderColor: "#334155" },
                          "&:hover fieldset": { borderColor: "#475569" },
                          "&.Mui-focused fieldset": { borderColor: "#3B82F6" }
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ color: "#D1D5DB", mb: 1, fontWeight: 500 }}>
                      Marca
                    </Typography>
                    <TextField
                      fullWidth
                      name="brand"
                      value={formData.brand}
                      onChange={handleChange}
                      placeholder="Ej: Coca-Cola"
                      InputProps={{
                        sx: {
                          bgcolor: "#1E293B",
                          color: "#FFFFFF",
                          "& fieldset": { borderColor: "#334155" },
                          "&:hover fieldset": { borderColor: "#475569" },
                          "&.Mui-focused fieldset": { borderColor: "#3B82F6" }
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="body2" sx={{ color: "#D1D5DB", mb: 1, fontWeight: 500 }}>
                      Descripción
                    </Typography>
                    <TextField
                      fullWidth
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Descripción detallada del producto..."
                      multiline
                      rows={3}
                      InputProps={{
                        sx: {
                          bgcolor: "#1E293B",
                          color: "#FFFFFF",
                          "& fieldset": { borderColor: "#334155" },
                          "&:hover fieldset": { borderColor: "#475569" },
                          "&.Mui-focused fieldset": { borderColor: "#3B82F6" }
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Precios */}
            <Card
              sx={{
                bgcolor: "rgba(15, 23, 42, 0.9)",
                border: "1px solid #334155",
                backdropFilter: "blur(20px)",
                mb: 3
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                  <AttachMoney sx={{ color: "#10B981", fontSize: 28 }} />
                  <Typography variant="h6" sx={{ color: "#FFFFFF", fontWeight: 600 }}>
                    Precios e Impuestos
                  </Typography>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" sx={{ color: "#D1D5DB", mb: 1, fontWeight: 500 }}>
                      Precio de Costo
                    </Typography>
                    <TextField
                      fullWidth
                      name="costPrice"
                      type="number"
                      value={formData.costPrice}
                      onChange={handleChange}
                      placeholder="0.00"
                      error={!!errors.costPrice}
                      helperText={errors.costPrice}
                      InputProps={{
                        sx: {
                          bgcolor: "#1E293B",
                          color: "#FFFFFF",
                          "& fieldset": { borderColor: "#334155" },
                          "&:hover fieldset": { borderColor: "#475569" },
                          "&.Mui-focused fieldset": { borderColor: "#3B82F6" }
                        }
                      }}
                      FormHelperTextProps={{
                        sx: { color: "#EF4444" }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" sx={{ color: "#D1D5DB", mb: 1, fontWeight: 500 }}>
                      Precio de Venta *
                    </Typography>
                    <TextField
                      fullWidth
                      name="salePrice"
                      type="number"
                      value={formData.salePrice}
                      onChange={handleChange}
                      placeholder="0.00"
                      error={!!errors.salePrice}
                      helperText={errors.salePrice}
                      InputProps={{
                        sx: {
                          bgcolor: "#1E293B",
                          color: "#FFFFFF",
                          "& fieldset": { borderColor: "#334155" },
                          "&:hover fieldset": { borderColor: "#475569" },
                          "&.Mui-focused fieldset": { borderColor: "#3B82F6" }
                        }
                      }}
                      FormHelperTextProps={{
                        sx: { color: "#EF4444" }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" sx={{ color: "#D1D5DB", mb: 1, fontWeight: 500 }}>
                      IVA (%)
                    </Typography>
                    <TextField
                      fullWidth
                      select
                      name="taxRate"
                      value={formData.taxRate}
                      onChange={handleChange}
                      InputProps={{
                        sx: {
                          bgcolor: "#1E293B",
                          color: "#FFFFFF",
                          "& fieldset": { borderColor: "#334155" },
                          "&:hover fieldset": { borderColor: "#475569" },
                          "&.Mui-focused fieldset": { borderColor: "#3B82F6" }
                        }
                      }}
                      SelectProps={{
                        MenuProps: {
                          PaperProps: {
                            sx: {
                              bgcolor: "#1E293B",
                              "& .MuiMenuItem-root": {
                                color: "#FFFFFF",
                                "&:hover": { bgcolor: "#334155" },
                                "&.Mui-selected": { bgcolor: "#3B82F6" }
                              }
                            }
                          }
                        }
                      }}
                    >
                      <MenuItem value="0">0%</MenuItem>
                      <MenuItem value="8">8%</MenuItem>
                      <MenuItem value="16">16%</MenuItem>
                    </TextField>
                  </Grid>
                </Grid>

                {formData.costPrice && formData.salePrice && (
                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      bgcolor: "rgba(59, 130, 246, 0.2)",
                      border: "1px solid rgba(59, 130, 246, 0.5)",
                      borderRadius: 2
                    }}
                  >
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography sx={{ color: "#D1D5DB" }}>
                        Margen de Ganancia:
                      </Typography>
                      <Typography variant="h5" sx={{ color: "#60A5FA", fontWeight: "bold" }}>
                        {calculateMargin()}%
                      </Typography>
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* Inventario */}
            <Card
              sx={{
                bgcolor: "rgba(15, 23, 42, 0.9)",
                border: "1px solid #334155",
                backdropFilter: "blur(20px)"
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                  <BarChart sx={{ color: "#8B5CF6", fontSize: 28 }} />
                  <Typography variant="h6" sx={{ color: "#FFFFFF", fontWeight: 600 }}>
                    Control de Inventario
                  </Typography>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" sx={{ color: "#D1D5DB", mb: 1, fontWeight: 500 }}>
                      Stock Actual
                    </Typography>
                    <TextField
                      fullWidth
                      name="stock"
                      type="number"
                      value={formData.stock}
                      onChange={handleChange}
                      placeholder="0"
                      InputProps={{
                        sx: {
                          bgcolor: "#1E293B",
                          color: "#FFFFFF",
                          "& fieldset": { borderColor: "#334155" },
                          "&:hover fieldset": { borderColor: "#475569" },
                          "&.Mui-focused fieldset": { borderColor: "#3B82F6" }
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" sx={{ color: "#D1D5DB", mb: 1, fontWeight: 500 }}>
                      Stock Mínimo
                    </Typography>
                    <TextField
                      fullWidth
                      name="minStock"
                      type="number"
                      value={formData.minStock}
                      onChange={handleChange}
                      placeholder="0"
                      InputProps={{
                        sx: {
                          bgcolor: "#1E293B",
                          color: "#FFFFFF",
                          "& fieldset": { borderColor: "#334155" },
                          "&:hover fieldset": { borderColor: "#475569" },
                          "&.Mui-focused fieldset": { borderColor: "#3B82F6" }
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" sx={{ color: "#D1D5DB", mb: 1, fontWeight: 500 }}>
                      Stock Máximo
                    </Typography>
                    <TextField
                      fullWidth
                      name="maxStock"
                      type="number"
                      value={formData.maxStock}
                      onChange={handleChange}
                      placeholder="0"
                      InputProps={{
                        sx: {
                          bgcolor: "#1E293B",
                          color: "#FFFFFF",
                          "& fieldset": { borderColor: "#334155" },
                          "&:hover fieldset": { borderColor: "#475569" },
                          "&.Mui-focused fieldset": { borderColor: "#3B82F6" }
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" sx={{ color: "#D1D5DB", mb: 1, fontWeight: 500 }}>
                      Unidad
                    </Typography>
                    <TextField
                      fullWidth
                      select
                      name="unit"
                      value={formData.unit}
                      onChange={handleChange}
                      InputProps={{
                        sx: {
                          bgcolor: "#1E293B",
                          color: "#FFFFFF",
                          "& fieldset": { borderColor: "#334155" },
                          "&:hover fieldset": { borderColor: "#475569" },
                          "&.Mui-focused fieldset": { borderColor: "#3B82F6" }
                        }
                      }}
                      SelectProps={{
                        MenuProps: {
                          PaperProps: {
                            sx: {
                              bgcolor: "#1E293B",
                              "& .MuiMenuItem-root": {
                                color: "#FFFFFF",
                                "&:hover": { bgcolor: "#334155" },
                                "&.Mui-selected": { bgcolor: "#3B82F6" }
                              }
                            }
                          }
                        }
                      }}
                    >
                      {units.map(unit => (
                        <MenuItem key={unit} value={unit}>{unit}</MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ color: "#D1D5DB", mb: 1, fontWeight: 500 }}>
                      Proveedor
                    </Typography>
                    <TextField
                      fullWidth
                      name="supplier"
                      value={formData.supplier}
                      onChange={handleChange}
                      placeholder="Nombre del proveedor"
                      InputProps={{
                        sx: {
                          bgcolor: "#1E293B",
                          color: "#FFFFFF",
                          "& fieldset": { borderColor: "#334155" },
                          "&:hover fieldset": { borderColor: "#475569" },
                          "&.Mui-focused fieldset": { borderColor: "#3B82F6" }
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ color: "#D1D5DB", mb: 1, fontWeight: 500 }}>
                      Ubicación en Almacén
                    </Typography>
                    <TextField
                      fullWidth
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Ej: Pasillo 3, Estante B"
                      InputProps={{
                        sx: {
                          bgcolor: "#1E293B",
                          color: "#FFFFFF",
                          "& fieldset": { borderColor: "#334155" },
                          "&:hover fieldset": { borderColor: "#475569" },
                          "&.Mui-focused fieldset": { borderColor: "#3B82F6" }
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Columna Lateral */}
          <Grid item xs={12} lg={4}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Categoría */}
              <Card
                sx={{
                  bgcolor: "rgba(15, 23, 42, 0.9)",
                  border: "1px solid #334155",
                  backdropFilter: "blur(20px)"
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                    <Category sx={{ color: "#F59E0B", fontSize: 24 }} />
                    <Typography variant="h6" sx={{ color: "#FFFFFF", fontWeight: 600 }}>
                      Categoría
                    </Typography>
                  </Box>

                  <Typography variant="body2" sx={{ color: "#D1D5DB", mb: 1, fontWeight: 500 }}>
                    Categoría *
                  </Typography>
                  <TextField
                    fullWidth
                    select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    error={!!errors.category}
                    helperText={errors.category}
                    InputProps={{
                      sx: {
                        bgcolor: "#1E293B",
                        color: "#FFFFFF",
                        "& fieldset": { borderColor: "#334155" },
                        "&:hover fieldset": { borderColor: "#475569" },
                        "&.Mui-focused fieldset": { borderColor: "#3B82F6" }
                      }
                    }}
                    FormHelperTextProps={{
                      sx: { color: "#EF4444" }
                    }}
                    SelectProps={{
                      displayEmpty: true,
                      MenuProps: {
                        PaperProps: {
                          sx: {
                            bgcolor: "#1E293B",
                            "& .MuiMenuItem-root": {
                              color: "#FFFFFF",
                              "&:hover": { bgcolor: "#334155" },
                              "&.Mui-selected": { bgcolor: "#3B82F6" }
                            }
                          }
                        }
                      }
                    }}
                  >
                    <MenuItem value="">Seleccionar...</MenuItem>
                    {categories.map(cat => (
                      <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                    ))}
                  </TextField>
                </CardContent>
              </Card>

              {/* Imágenes */}
              <Card
                sx={{
                  bgcolor: "rgba(15, 23, 42, 0.9)",
                  border: "1px solid #334155",
                  backdropFilter: "blur(20px)"
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                    <Upload sx={{ color: "#06B6D4", fontSize: 24 }} />
                    <Typography variant="h6" sx={{ color: "#FFFFFF", fontWeight: 600 }}>
                      Imágenes
                    </Typography>
                  </Box>

                  <Button
                    component="label"
                    fullWidth
                    sx={{
                      height: 128,
                      border: "2px dashed #334155",
                      bgcolor: "transparent",
                      color: "#9CA3AF",
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                      "&:hover": {
                        border: "2px dashed #475569",
                        bgcolor: "rgba(30, 41, 59, 0.5)"
                      }
                    }}
                  >
                    <Upload sx={{ fontSize: 32 }} />
                    <Typography variant="body2">Subir imágenes</Typography>
                    <input
                      type="file"
                      hidden
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </Button>

                  {images.length > 0 && (
                    <Grid container spacing={1} sx={{ mt: 2 }}>
                      {images.map(img => (
                        <Grid item xs={6} key={img.id}>
                          <Paper
                            sx={{
                              position: "relative",
                              paddingTop: "100%",
                              bgcolor: "#1E293B",
                              borderRadius: 2,
                              overflow: "hidden"
                            }}
                          >
                            <Box
                              component="img"
                              src={img.url}
                              alt="Preview"
                              sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                objectFit: "cover"
                              }}
                            />
                            <IconButton
                              size="small"
                              onClick={() => removeImage(img.id)}
                              sx={{
                                position: "absolute",
                                top: 4,
                                right: 4,
                                bgcolor: "#DC2626",
                                color: "#FFFFFF",
                                "&:hover": { bgcolor: "#B91C1C" },
                                width: 24,
                                height: 24
                              }}
                            >
                              <Close sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </CardContent>
              </Card>

              {/* Botón Guardar */}
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleSubmit}
                disabled={loading}
                startIcon={<Save />}
                sx={{
                  bgcolor: "#2563EB",
                  py: 1.5,
                  fontWeight: 600,
                  fontSize: 16,
                  textTransform: "none",
                  "&:hover": { bgcolor: "#1D4ED8" },
                  "&:disabled": { bgcolor: "#475569" }
                }}
              >
                {loading ? "Guardando..." : "Guardar Producto"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}