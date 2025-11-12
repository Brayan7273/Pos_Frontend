import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import api from "../services/api"
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Divider,
  IconButton,
  Tooltip,
  Alert,
} from "@mui/material"
import { ArrowBack, Edit, Delete, Inventory2, ErrorOutline } from "@mui/icons-material"

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProduct()
  }, [])

  const fetchProduct = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.get(`/products/${id}`)
      
      // Validar respuesta del servidor
      if (!res || !res.data) {
        throw new Error("Respuesta inválida del servidor.")
      }

      setProduct(res.data)
    } catch (error) {
      console.error("Error al obtener producto:", error)
      if (error.response) {
        // Error del servidor con código HTTP
        if (error.response.status === 404) {
          setError("El producto no fue encontrado en la base de datos.")
        } else if (error.response.status === 500) {
          setError("Error interno del servidor. Intenta más tarde.")
        } else {
          setError(`Error ${error.response.status}: ${error.response.statusText}`)
        }
      } else if (error.request) {
        // Error de conexión o sin respuesta
        setError("No se pudo conectar con el servidor. Verifica tu conexión a internet.")
      } else {
        // Otro tipo de error
        setError(error.message || "Ocurrió un error desconocido.")
      }
    } finally {
      setLoading(false)
    }
  }

  // Estado de carga
  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress sx={{ color: "#60A5FA" }} />
      </Box>
    )

  // Estado de error
  if (error)
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)",
          color: "#E5E7EB",
          textAlign: "center",
          px: 3,
        }}
      >
        <ErrorOutline sx={{ fontSize: 60, color: "#EF4444", mb: 2 }} />
        <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
          Ocurrió un error
        </Typography>
        <Alert severity="error" sx={{ mb: 3, maxWidth: 500, bgcolor: "rgba(239, 68, 68, 0.1)" }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          onClick={() => fetchProduct()}
          sx={{
            bgcolor: "#3B82F6",
            "&:hover": { bgcolor: "#2563EB" },
          }}
        >
          Reintentar
        </Button>
      </Box>
    )

  // Si no hay producto pero sin error explícito
  if (!product)
    return (
      <Typography sx={{ mt: 5, textAlign: "center", color: "#E5E7EB" }}>
        Producto no encontrado
      </Typography>
    )

  // Vista principal
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)",
        py: 5,
        px: { xs: 2, sm: 4 },
      }}
    >
      {/* Encabezado */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
        <IconButton
          onClick={() => navigate("/products")}
          sx={{ color: "#E5E7EB", border: "1px solid #334155" }}
        >
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" sx={{ color: "#FFFFFF", fontWeight: "bold" }}>
          Detalle del producto
        </Typography>
      </Box>

      {/* Contenedor principal */}
      <Card
        sx={{
          maxWidth: 700,
          mx: "auto",
          bgcolor: "rgba(15, 23, 42, 0.9)",
          border: "1px solid #334155",
          boxShadow: "0px 4px 20px rgba(0,0,0,0.4)",
          borderRadius: 3,
        }}
      >
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 1 }}>
            <Inventory2 sx={{ color: "#60A5FA", fontSize: 36 }} />
            <Typography variant="h5" sx={{ color: "#FFFFFF", fontWeight: "bold" }}>
              {product.Name}
            </Typography>
          </Box>

          <Divider sx={{ borderColor: "#334155", mb: 3 }} />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography sx={{ color: "#9CA3AF" }}>Código:</Typography>
              <Typography sx={{ color: "#F9FAFB", fontWeight: "bold" }}>{product.Code}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography sx={{ color: "#9CA3AF" }}>Categoría:</Typography>
              <Typography sx={{ color: "#F9FAFB", fontWeight: "bold" }}>{product.Category || "—"}</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography sx={{ color: "#9CA3AF" }}>Unidad:</Typography>
              <Typography sx={{ color: "#F9FAFB", fontWeight: "bold" }}>{product.Unit}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography sx={{ color: "#9CA3AF" }}>Precio:</Typography>
              <Typography sx={{ color: "#22C55E", fontWeight: "bold" }}>${product.Price}</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography sx={{ color: "#9CA3AF" }}>Stock actual:</Typography>
              <Typography sx={{ color: "#FACC15", fontWeight: "bold" }}>{product.Current_Stock}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography sx={{ color: "#9CA3AF" }}>Stock mínimo:</Typography>
              <Typography sx={{ color: "#F87171", fontWeight: "bold" }}>{product.Minimum_Stock}</Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography sx={{ color: "#9CA3AF" }}>Descripción:</Typography>
              <Typography sx={{ color: "#E5E7EB" }}>
                {product.Description || "Sin descripción"}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ borderColor: "#334155", my: 3 }} />

          {/* Botones de acción */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate("/products")}
              sx={{
                borderColor: "#60A5FA",
                color: "#60A5FA",
                "&:hover": { borderColor: "#3B82F6", color: "#3B82F6" },
              }}
            >
              Volver
            </Button>

            <Box>
              <Tooltip title="Editar">
                <IconButton
                  onClick={() => navigate("/products/new", { state: { product } })}
                  sx={{
                    color: "#10B981",
                    border: "1px solid #10B981",
                    mx: 1,
                  }}
                >
                  <Edit />
                </IconButton>
              </Tooltip>

              <Tooltip title="Eliminar">
                <IconButton
                  onClick={() => alert("Aquí puedes agregar confirmación de eliminación")}
                  sx={{
                    color: "#EF4444",
                    border: "1px solid #EF4444",
                  }}
                >
                  <Delete />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
