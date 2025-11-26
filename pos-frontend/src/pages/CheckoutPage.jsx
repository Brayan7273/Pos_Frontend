import { useState, useEffect, useRef } from "react";
import PaymentIcon from "@mui/icons-material/Payment";
import { Grid } from "@mui/material";
import {
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  Typography,
  IconButton,
  Avatar,
  Alert,
  CircularProgress,
  Container,
  Divider,
  InputAdornment,
  Modal,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import {
  Delete,
  Inventory,
  Lock,
  Search,
  QrCodeScanner,
  AddShoppingCart,
  CreditCard,
} from "@mui/icons-material";

// --- IMPORTANTE: Importa tu instancia de API ---
// Asumo que está en esta ruta, ajústala si es necesario
// import api from '../services/api'; // <--- Eliminamos esta línea que da error

// --- CLIENT ID DE PAYPAL ---
const PAYPAL_CLIENT_ID = "AQUI_VA_TU_CLIENT_ID_DE_SANDBOX";

// Ícono de PayPal en SVG
const PayPalIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    style={{ marginRight: 8 }}
  >
    <path
      d="M7.74 3.003A1.03 1.03 0 0 0 6.72 4.03l-1.6 10.126c-.05.313.208.584.52.535l2.67-.423c.27-.043.51-.23.6-.49l1.64-4.83c.09-.26.33-.45.6-.49l3.11-.49c2.31-.36 3.42-2.81 2.8-5.02-.16-.57-.48-.9-.98-1.14C14.7 2.05 13.1 2.02 11.53 2.02H9.37c-.55 0-.96.4-1.02.95l-.61.033z"
      fill="#003087"
    />
    <path
      d="M10.74 12.003a1.03 1.03 0 0 0-1.02 1.03l-1.6 10.126c-.05.313.208.584.52.535l2.67-.423c.27-.043.51-.23.6-.49l1.64-4.83c.09-.26.33-.45.6-.49l3.11-.49c2.31-.36 3.42-2.81 2.8-5.02-.16-.57-.48-.9-.98-1.14-1.1-.53-2.7-.56-4.27-.56h-2.16c-.55 0-.96.4-1.02.95l-.6.033z"
      fill="#009CDE"
    />
    <path
      d="M11.63 8.003a1.03 1.03 0 0 0-1.02 1.03l-1.6 10.126c-.05.313.208.584.52.535l2.67-.423c.27-.043.51-.23.6-.49l1.64-4.83c.09-.26.33-.45.6-.49l3.11-.49c2.31-.36 3.42-2.81 2.8-5.02-.16-.57-.48-.9-.98-1.14-1.1-.53-2.7-.56-4.27-.56h-2.16c-.55 0-.96.4-1.02.95l-.6.033z"
      fill="#002F86"
    />
  </svg>
);

// Componente para renderizar botones de PayPal
const PayPalButtonsComponent = ({ total, onApprove, onError }) => {
  const paypalRef = useRef();
  const buttonsRef = useRef(null); 

  useEffect(() => {
    if (!window.paypal || !paypalRef.current) {
      return;
    }
    if (buttonsRef.current) {
      buttonsRef.current.close();
    }
    buttonsRef.current = window.paypal.Buttons({
      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                currency_code: "MXN",
                value: total.toFixed(2),
              },
              description: "Compra en Punto de Venta",
            },
          ],
        });
      },
      onApprove: (data, actions) => {
        return actions.order.capture().then((details) => {
          onApprove(details);
        });
      },
      onError: (err) => {
        onError(err);
      },
    });
    buttonsRef.current.render(paypalRef.current).catch((err) => {
      console.error("Error al renderizar botones de PayPal:", err);
      onError(err);
    });
    return () => {
      if (buttonsRef.current) {
        buttonsRef.current.close();
        buttonsRef.current = null;
      }
    };
  }, [total, onApprove, onError]); 

  return <div ref={paypalRef}></div>;
};

// Campo de texto estilizado oscuro
const StyledTextField = (props) => (
  <TextField
    fullWidth
    variant="outlined"
    InputLabelProps={{
      sx: { color: "#9CA3AF" },
    }}
    InputProps={{
      sx: {
        bgcolor: "#1E293B",
        color: "#FFFFFF",
        "& .MuiOutlinedInput-notchedOutline": { borderColor: "#334155" },
        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#475569" },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#2563EB" },
      },
    }}
    {...props}
  />
);

// --- Componente Principal ---
export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [barcode, setBarcode] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("tarjeta");
  const [sdkReady, setSdkReady] = useState(false);

  // --- Carga del Script de PayPal ---
  useEffect(() => {
    if (window.paypal) {
      setSdkReady(true);
      return;
    }
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=MXN&intent=capture`;
    script.type = "text/javascript";
    script.async = true;
    script.onload = () => {
      setSdkReady(true);
    };
    script.onerror = () => {
      console.error("Error al cargar el script de PayPal.");
      setError("No se pudo cargar el método de pago PayPal.");
    };
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []); 

  // --- Lógica del Carrito ---
  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      setTimeout(() => {
        const mockCart = [
          { id: 1, name: "Laptop HP ProBook", sku: "LAP-001", price: 15999.99 },
          { id: 2, name: "Mouse Inalámbrico Logitech", sku: "MOU-002", price: 799.99 },
          { id: 3, name: "Teclado Mecánico RGB", sku: "KEY-003", price: 2499.99 },
          { id: 4, name: "Monitor Samsung 24''", sku: "MON-004", price: 3899.99 },
        ];
        setCartItems(mockCart);
        setLoading(false);
      }, 1000);
    } catch {
      setError("Error al cargar los productos");
      setLoading(false);
    }
  };

  const handleAddProduct = (product) => {
    setSelectedProducts((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  const handleRemoveProduct = (id) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const subtotal = selectedProducts.reduce((acc, p) => acc + p.price * p.quantity, 0);
  const taxes = subtotal * 0.16;
  const total = subtotal + taxes;

  // --- NUEVA FUNCIÓN PARA GUARDAR LA VENTA ---
  const recordSaleTransaction = async (paymentMethodName) => {
    const transactionDate = new Date().toISOString();
    
    // 1. Crear un array de promesas, una por cada producto vendido
    const salePromises = selectedProducts.map(item => {
      const saleRecord = {
        product_name: item.name,
        quantity: item.quantity,
        total: (item.price * item.quantity).toFixed(2),
        date: transactionDate,
        payment_method: paymentMethodName, // Dato extra, útil para tu tabla
      };
      
      // 2. Enviar cada item a la API usando fetch (reemplazando api.post)
      return fetch('/sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(saleRecord)
      }).then(response => {
        if (!response.ok) {
          // Si la respuesta no es OK, lanzar un error para que Promise.all lo capture
          throw new Error(`Error al registrar item: ${item.name}`);
        }
        // Asumimos que la API devuelve JSON, si no, usa response.text()
        return response.json(); 
      });
    });

    try {
      // 3. Esperar a que todas las ventas se guarden
      await Promise.all(salePromises);
      console.log("Venta registrada exitosamente en la API");
    } catch (err) {
      console.error("Error al registrar la venta:", err);
      // Opcional: Mostrar un error al usuario, pero no detener el flujo
      // ya que el pago ya se hizo.
      setError("El pago se completó, pero hubo un error al guardar el recibo.");
    }
  };
  
  // --- PAGO CON TARJETA (ACTUALIZADO) ---
  const handleCardPayment = async (e) => { // Convertido a async
    e.preventDefault();
    
    // 1. Guardar la venta en la API
    await recordSaleTransaction('Tarjeta');
    
    // 2. Mostrar éxito y limpiar
    alert(`Pago (simulado) realizado con ${paymentMethod}`);
    setShowPaymentModal(false);
    setSelectedProducts([]);
  };

  // --- PAGO CON PAYPAL (ACTUALIZADO) ---
  const handlePayPalApprove = async (details) => { // Convertido a async
    
    // 1. Guardar la venta en la API
    await recordSaleTransaction('PayPal');

    // 2. Mostrar éxito y limpiar
    alert("¡Pago completado exitosamente por " + details.payer.name.given_name + "!");
    setShowPaymentModal(false);
    setSelectedProducts([]);
    console.log("Detalles de la transacción:", details);
  };

  const handlePayPalError = (err) => {
    console.error("Error en el pago de PayPal:", err);
    setError("Hubo un error al procesar el pago con PayPal. Intenta de nuevo.");
  };

  const filteredProducts = cartItems.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    // ... (Indicador de carga)
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress size={60} sx={{ color: "#2563EB", mb: 2 }} />
          <Typography variant="h6" sx={{ color: "#FFFFFF" }}>
            Cargando productos...
          </Typography>
        </Box>
      </Box>
    );
  }

  // --- Renderizado del Componente ---
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)",
        py: 3,
        px: { xs: 2, sm: 3 },
      }}
    >
      <Container maxWidth="lg">
        {/* HEADER */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ color: "#FFFFFF", fontWeight: "bold", mb: 1 }}>
            Punto de Venta
          </Typography>
          <Typography variant="body1" sx={{ color: "#9CA3AF" }}>
            Busca productos o escanea un código para agregar al carrito
          </Typography>
        </Box>

        {/* BUSCADOR Y ESCÁNER */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={8}>
            <StyledTextField
              label="Buscar producto"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: "#9CA3AF" }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <StyledTextField
              label="Lector de código de barras"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <QrCodeScanner sx={{ color: "#9CA3AF" }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Productos */}
          <Grid item xs={12} md={7}>
            <Card
              sx={{
                bgcolor: "rgba(15, 23, 42, 0.9)",
                border: "1px solid #334155",
                backdropFilter: "blur(20px)",
                mb: 3,
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ color: "#FFFFFF", mb: 2 }}>
                  Productos Disponibles
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, maxHeight: 300, overflowY: 'auto' }}>
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((item) => (
                      <Box
                        key={item.id}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          borderBottom: "1px solid #1E293B",
                          pb: 1,
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <Avatar variant="rounded" sx={{ bgcolor: "#334155" }}>
                            <Inventory sx={{ color: "#6B7280", fontSize: 20 }} />
                          </Avatar>
                          <Box>
                            <Typography sx={{ color: "#FFFFFF", fontWeight: 500 }}>
                              {item.name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#9CA3AF" }}>
                              ${item.price.toFixed(2)}
                            </Typography>
                          </Box>
                        </Box>
                        <Button
                          size="small"
                          variant="contained"
                          startIcon={<AddShoppingCart />}
                          onClick={() => handleAddProduct(item)}
                          sx={{
                            bgcolor: "#2563EB",
                            "&:hover": { bgcolor: "#1D4ED8" },
                            textTransform: "none",
                          }}
                        >
                          Agregar
                        </Button>
                      </Box>
                    ))
                  ) : (
                    <Typography sx={{ color: "#9CA3AF", textAlign: "center" }}>
                      No se encontraron productos.
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
            <Card
              sx={{
                bgcolor: "rgba(15, 23, 42, 0.9)",
                border: "1px solid #334155",
                backdropFilter: "blur(20px)",
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ color: "#FFFFFF", mb: 2 }}>
                  Detalle de productos seleccionados
                </Typography>
                <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
                  {selectedProducts.length > 0 ? (
                    selectedProducts.map((item) => (
                      <Box
                        key={item.id}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 1,
                          pb: 1,
                          borderBottom: "1px solid #1E293B",
                        }}
                      >
                        <Typography sx={{ color: "#FFFFFF" }}>
                          {item.name} x {item.quantity}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Typography sx={{ color: "#10B981" }}>
                            ${(item.price * item.quantity).toFixed(2)}
                          </Typography>
                          <IconButton
                            size="small"
                            sx={{ color: "#EF4444" }}
                            onClick={() => handleRemoveProduct(item.id)}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    ))
                  ) : (
                    <Typography sx={{ color: "#9CA3AF" }}>No hay productos agregados.</Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Resumen */}
          <Grid item xs={12} md={5}>
            <Card
              sx={{
                bgcolor: "rgba(15, 23, 42, 0.9)",
                border: "1px solid #334155",
                backdropFilter: "blur(20px)",
                position: "sticky",
                top: "24px",
              }}
            >
              <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Typography variant="h6" sx={{ color: "#FFFFFF", fontWeight: "bold" }}>
                  Resumen de Venta
                </Typography>

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography sx={{ color: "#9CA3AF" }}>Subtotal</Typography>
                  <Typography sx={{ color: "#FFFFFF" }}>
                    ${subtotal.toFixed(2)}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography sx={{ color: "#9CA3AF" }}>IVA (16%)</Typography>
                  <Typography sx={{ color: "#FFFFFF" }}>
                    ${taxes.toFixed(2)}
                  </Typography>
                </Box>

                <Divider sx={{ borderColor: "#334155", my: 1 }} />

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="h5" sx={{ color: "#FFFFFF" }}>
                    Total
                  </Typography>
                  <Typography variant="h5" sx={{ color: "#10B981" }}>
                    ${total.toFixed(2)}
                  </Typography>
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={<Lock />}
                  onClick={() => setShowPaymentModal(true)}
                  disabled={selectedProducts.length === 0}
                  sx={{
                    bgcolor: "#2563EB",
                    "&:hover": { bgcolor: "#1D4ED8" },
                    fontWeight: 600,
                    textTransform: "none",
                    py: 1.5,
                    mt: 2,
                  }}
                >
                  Pagar Ahora
                </Button>

                <Typography
                  variant="body2"
                  sx={{
                    color: "#9CA3AF",
                    textAlign: "center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 0.5,
                    mt: 1,
                  }}
                >
                  <Lock sx={{ fontSize: 14 }} /> Pago 100% Seguro
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* MODAL DE PAGO */}
      <Modal open={showPaymentModal} onClose={() => setShowPaymentModal(false)}>
        <Box
          sx={{
            bgcolor: "#1E293B",
            color: "#FFFFFF",
            p: 4,
            borderRadius: 3,
            maxWidth: 400,
            mx: "auto",
            mt: "10%",
            boxShadow: 24,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
            Selecciona Método de Pago
          </Typography>

          <ToggleButtonGroup
            value={paymentMethod}
            exclusive
            onChange={(e, val) => val && setPaymentMethod(val)}
            sx={{ display: "flex", justifyContent: "center", mb: 3 }}
          >
            <ToggleButton
              value="tarjeta"
              sx={{
                bgcolor: paymentMethod === "tarjeta" ? "#2563EB" : "#334155",
                color: "#FFFFFF",
                "&:hover": { bgcolor: "#2563EB" },
              }}
            >
              <CreditCard sx={{ mr: 1 }} /> Tarjeta
            </ToggleButton>
            <ToggleButton
              value="paypal"
              sx={{
                bgcolor: paymentMethod === "paypal" ? "#2563EB" : "#334155",
                color: "#FFFFFF",
                "&:hover": { bgcolor: "#2563EB" },
              }}
            >
              <PayPalIcon /> PayPal
            </ToggleButton>
          </ToggleButtonGroup>

          {paymentMethod === "tarjeta" ? (
            <form onSubmit={handleCardPayment}>
              <StyledTextField label="Número de tarjeta" required sx={{ mb: 2 }} />
              <StyledTextField label="Nombre en la tarjeta" required sx={{ mb: 2 }} />
              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <StyledTextField label="MM/AA" required />
                <StyledTextField label="CVV" required />
              </Box>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                sx={{
                  bgcolor: "#10B981",
                  "&:hover": { bgcolor: "#059669" },
                  fontWeight: 600,
                }}
              >
                Confirmar Pago
              </Button>
            </form>
          ) : (
            <Box sx={{ mt: 2, minHeight: "150px" }}>
              {sdkReady ? (
                <PayPalButtonsComponent
                  total={total}
                  onApprove={handlePayPalApprove}
                  onError={handlePayPalError}
                />
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <CircularProgress sx={{ color: "#2563EB" }} />
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Modal>
    </Box>
  );
}