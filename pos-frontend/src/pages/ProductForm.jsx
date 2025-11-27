import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
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
  Container,
  InputAdornment,
  Tooltip
} from "@mui/material"
import {
  Save,
  ArrowBack,
  Inventory,
  AttachMoney,
  BarChart,
  Category,
  Add,
  Warning,
  CheckCircle,
  Info
} from "@mui/icons-material"
import api from '../services/api';

// Reglas de validación centralizadas
const validationRules = {
  Name: {
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-\&\.\(\)]+$/,
    message: {
      required: 'El nombre es requerido',
      minLength: 'Mínimo 2 caracteres',
      maxLength: 'Máximo 100 caracteres',
      pattern: 'Solo letras, números, espacios y los caracteres - & . ( )'
    }
  },
  Code: {
    required: true,
    minLength: 3,
    maxLength: 50,
    pattern: /^[A-Z0-9\-_]+$/,
    message: {
      required: 'El código es requerido',
      minLength: 'Mínimo 3 caracteres',
      maxLength: 'Máximo 50 caracteres',
      pattern: 'Solo mayúsculas, números, guiones y guiones bajos'
    }
  },
  Barcode: {
    required: false,
    pattern: /^[0-9]{8,14}$|^$/,
    message: {
      pattern: 'Código de barras inválido (8-14 dígitos)'
    }
  },
  Category: {
    required: true,
    message: {
      required: 'La categoría es requerida'
    }
  },
  Brand: {
    required: false,
    maxLength: 50,
    pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-\.]*$/,
    message: {
      maxLength: 'Máximo 50 caracteres',
      pattern: 'Solo letras, números, espacios, guiones y puntos'
    }
  },
  Description: {
    required: false,
    maxLength: 500,
    message: {
      maxLength: 'Máximo 500 caracteres'
    }
  },
  CostPrice: {
    required: false,
    min: 0,
    max: 9999999.99,
    message: {
      min: 'El costo no puede ser negativo',
      max: 'El costo no puede exceder 9,999,999.99'
    }
  },
  Price: {
    required: true,
    min: 0.01,
    max: 9999999.99,
    message: {
      required: 'El precio de venta es requerido',
      min: 'El precio debe ser mayor a 0',
      max: 'El precio no puede exceder 9,999,999.99'
    }
  },
  Current_Stock: {
    required: false,
    min: 0,
    max: 999999,
    message: {
      min: 'El stock no puede ser negativo',
      max: 'El stock no puede exceder 999,999'
    }
  },
  Minimum_Stock: {
    required: false,
    min: 0,
    max: 999999,
    message: {
      min: 'El stock mínimo no puede ser negativo',
      max: 'El stock mínimo no puede exceder 999,999'
    }
  },
  Maximum_Stock: {
    required: false,
    min: 0,
    max: 999999,
    message: {
      min: 'El stock máximo no puede ser negativo',
      max: 'El stock máximo no puede exceder 999,999'
    }
  },
  TaxRate: {
    required: true,
    message: {
      required: 'La tasa de impuesto es requerida'
    }
  },
  Supplier: {
    required: false,
    maxLength: 100,
    message: {
      maxLength: 'Máximo 100 caracteres'
    }
  },
  Location: {
    required: false,
    maxLength: 100,
    message: {
      maxLength: 'Máximo 100 caracteres'
    }
  }
};

// ** LISTAS DE DATOS POR DEFECTO (Reinstaladas) **
const defaultCategories = ["Bebidas", "Panadería", "Lácteos", "Granos", "Limpieza", "Snacks", "Abarrotes", "Electrónica", "Accesorios", "Oficina"];
const defaultUnits = ["pz", "kg", "lt", "m", "caja", "paquete", "unidad", "galón"];
// ** FIN DE DATOS POR DEFECTO **

const OTHER_CATEGORY_VALUE = "OTHER_CUSTOM_CATEGORY";


export default function ProductForm() {
  const navigate = useNavigate()
  const location = useLocation()
  
  const productToEdit = location.state?.product
  
  const [formData, setFormData] = useState({
    Name: "",
    Code: "",
    Barcode: "",
    Category: "",
    Brand: "",
    Description: "",
    CostPrice: "",
    Price: "",
    Current_Stock: "",
    Minimum_Stock: "",
    Maximum_Stock: "",
    Unit: "pz",
    TaxRate: "16",
    Supplier: "",
    Location: "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  
  // Nuevo estado para la categoría personalizada si se selecciona "Otro"
  const [customCategory, setCustomCategory] = useState("");
  const [isCustomCategoryMode, setIsCustomCategoryMode] = useState(false);

  // Usar los valores por defecto
  const categories = defaultCategories; 
  const units = defaultUnits; 

  useEffect(() => {
    if (productToEdit) {
      let initialCategory = productToEdit.Category || "";
      let customCatValue = "";
      let isCustomMode = false;

      // Si la categoría guardada NO está en la lista de categorías predefinidas, asumimos que es personalizada.
      if (initialCategory && !categories.includes(initialCategory)) {
        isCustomMode = true;
        initialCategory = OTHER_CATEGORY_VALUE;
        customCatValue = productToEdit.Category;
      }
      
      setIsCustomCategoryMode(isCustomMode);
      setCustomCategory(customCatValue);

      setFormData({
        Name: productToEdit.Name || "",
        Code: productToEdit.Code || "",
        Barcode: productToEdit.Barcode || "",
        Category: initialCategory,
        Brand: productToEdit.Brand || "",
        Description: productToEdit.Description || "",
        CostPrice: productToEdit.CostPrice?.toString() || "",
        Price: productToEdit.Price?.toString() || "",
        Current_Stock: productToEdit.Current_Stock?.toString() || "",
        Minimum_Stock: productToEdit.Minimum_Stock?.toString() || "",
        Maximum_Stock: productToEdit.Maximum_Stock?.toString() || "",
        // Asegurar un valor válido si la unidad guardada no está en la lista actual
        Unit: units.includes(productToEdit.Unit) ? productToEdit.Unit : "pz", 
        TaxRate: productToEdit.TaxRate?.toString() || "16",
        Supplier: productToEdit.Supplier || "",
        Location: productToEdit.Location || "",
      })
    }
  }, [productToEdit, categories, units])


  // Función de validación de campos
  const validateField = (name, value) => {
    const rules = validationRules[name];
    if (!rules) return '';

    // Si la categoría es requerida y estamos en modo personalizado, el valor a validar
    // es `customCategory`, no `formData.Category` (que es 'OTHER_CUSTOM_CATEGORY')
    let valueToValidate = value;

    if (name === 'Category' && isCustomCategoryMode) {
      // Si estamos en modo personalizado, comprobamos que el campo de texto libre no esté vacío
      if (rules.required && (!customCategory || customCategory.trim() === '')) {
        return 'La categoría personalizada es requerida';
      }
      // No aplicamos otras reglas de validación (longitud/patrón) al valor simbólico 'OTHER_CUSTOM_CATEGORY'
      if (value === OTHER_CATEGORY_VALUE) {
        return '';
      }
    }
    
    // Validación de campo requerido
    if (rules.required && (!valueToValidate || valueToValidate.toString().trim() === '')) {
      return rules.message.required;
    }

    // Si el campo no es requerido y está vacío, no validar
    if (!rules.required && (!valueToValidate || valueToValidate.toString().trim() === '')) {
      return '';
    }

    // El resto de validaciones aplican al campo si no es la lógica de categoría personalizada
    if (name !== 'Category') {
      // Validación de longitud mínima
      if (rules.minLength && valueToValidate.length < rules.minLength) {
        return rules.message.minLength;
      }

      // Validación de longitud máxima
      if (rules.maxLength && valueToValidate.length > rules.maxLength) {
        return rules.message.maxLength;
      }

      // Validación de patrón
      if (rules.pattern && !rules.pattern.test(valueToValidate)) {
        return rules.message.pattern;
      }

      // Validación de valores numéricos mínimos
      if (rules.min !== undefined && parseFloat(valueToValidate) < rules.min) {
        return rules.message.min;
      }

      // Validación de valores numéricos máximos
      if (rules.max !== undefined && parseFloat(valueToValidate) > rules.max) {
        return rules.message.max;
      }
    }
    

    return '';
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Forzar validación de CustomCategory en blur si estamos en ese modo
    if (name === 'Category' && isCustomCategoryMode) {
        const error = validateField(name, customCategory);
        setErrors(prev => ({ ...prev, [name]: error }));
        return;
    }

    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    
    setFormData(prev => ({ ...prev, Category: value }));
    
    if (value === OTHER_CATEGORY_VALUE) {
      setIsCustomCategoryMode(true);
      setCustomCategory(""); // Limpiar el campo de texto libre al seleccionar "Otro"
      setErrors(prev => ({ ...prev, Category: 'La categoría personalizada es requerida' })); // Forzar error de requerido
    } else {
      setIsCustomCategoryMode(false);
      setCustomCategory("");
      // Validar la categoría seleccionada (normalmente solo para asegurar que no sea el valor vacío)
      const error = validateField('Category', value);
      setErrors(prev => ({ ...prev, Category: error }));
    }
    
    if (error) setError("");
    if (success) setSuccess("");
  }
  
  const handleCustomCategoryChange = (e) => {
      const value = e.target.value;
      
      // Aplicar reglas de limpieza y validación al valor de texto libre
      let cleanedValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-\&\.\(\)]/g, '');

      setCustomCategory(cleanedValue);
      
      if (touched.Category) {
          // Revalidar el campo Category usando el nuevo valor de customCategory
          const rules = validationRules.Name; // Reutilizar reglas de nombre para el campo libre
          let error = '';
          if (rules.required && (!cleanedValue || cleanedValue.trim() === '')) {
            error = 'La categoría personalizada es requerida';
          } else if (rules.maxLength && cleanedValue.length > rules.maxLength) {
            error = rules.message.maxLength;
          } else if (rules.pattern && !rules.pattern.test(cleanedValue)) {
            error = rules.message.pattern;
          }
          
          setErrors(prev => ({ ...prev, Category: error }));
      }
      
      if (error) setError("");
      if (success) setSuccess("");
  }


  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Manejo especial si el campo cambiado es el de categoría
    if (name === 'Category') {
        handleCategoryChange(e);
        return;
    }
    
    // Limpieza de datos según el campo (lógica original)
    let cleanedValue = value;
    
    if (name === 'Name' || name === 'Brand') {
      cleanedValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-\&\.\(\)]/g, '');
    } else if (name === 'Code') {
      cleanedValue = value.toUpperCase().replace(/[^A-Z0-9\-_]/g, '');
    } else if (name === 'Barcode') {
      cleanedValue = value.replace(/[^0-9]/g, '');
    } else if (['CostPrice', 'Price', 'TaxRate'].includes(name)) {
      if (value === '' || /^\d*\.?\d*$/.test(value)) {
        cleanedValue = value;
      } else {
        return; 
      }
    } else if (['Current_Stock', 'Minimum_Stock', 'Maximum_Stock'].includes(name)) {
      cleanedValue = value.replace(/[^0-9]/g, '');
    }
    
    setFormData(prev => ({ ...prev, [name]: cleanedValue }));

    if (error) setError("");
    if (success) setSuccess("");

    // Validación en tiempo real si el campo ya fue tocado
    if (touched[name]) {
      const error = validateField(name, cleanedValue);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  }

  const validateForm = () => {
    const newErrors = {};
    const newTouched = {};
    
    // Validar todos los campos requeridos
    Object.keys(validationRules).forEach(field => {
      newTouched[field] = true;
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });
    
    // ** VALIDAR CAMPO PERSONALIZADO SI ESTÁ ACTIVO **
    if (isCustomCategoryMode) {
        const rules = validationRules.Name; // Reutilizar reglas de nombre para el campo libre
        let customError = '';
        if (rules.required && (!customCategory || customCategory.trim() === '')) {
          customError = 'La categoría personalizada es requerida';
        } else if (rules.maxLength && customCategory.length > rules.maxLength) {
          customError = rules.message.maxLength;
        } else if (rules.pattern && !rules.pattern.test(customCategory)) {
          customError = rules.message.pattern;
        }
        
        if (customError) {
            newErrors.Category = customError;
        } else {
            // Si la categoría personalizada es válida, eliminar cualquier error anterior
            delete newErrors.Category; 
        }
    } else if (formData.Category === "") {
         newErrors.Category = validationRules.Category.message.required;
    }
    
    // Validaciones de negocio adicionales
    if (formData.CostPrice && formData.Price) {
      const cost = parseFloat(formData.CostPrice);
      const price = parseFloat(formData.Price);
      
      if (cost >= price) {
        newErrors.CostPrice = 'El costo debe ser menor al precio de venta';
        newErrors.Price = 'El precio de venta debe ser mayor al costo';
      }
    }

    if (formData.Minimum_Stock && formData.Maximum_Stock) {
      const minStock = parseInt(formData.Minimum_Stock);
      const maxStock = parseInt(formData.Maximum_Stock);
      
      if (minStock >= maxStock) {
        newErrors.Minimum_Stock = 'El stock mínimo debe ser menor al máximo';
        newErrors.Maximum_Stock = 'El stock máximo debe ser mayor al mínimo';
      }
    }

    if (formData.Current_Stock && formData.Maximum_Stock) {
      const currentStock = parseInt(formData.Current_Stock);
      const maxStock = parseInt(formData.Maximum_Stock);
      
      if (currentStock > maxStock) {
        newErrors.Current_Stock = 'El stock actual no puede exceder el stock máximo';
      }
    }
    
    setTouched(newTouched);
    setErrors(newErrors);
    
    return Object.keys(newErrors).length === 0;
  }

  const resetForm = () => {
    setFormData({
      Name: "",
      Code: "",
      Barcode: "",
      Category: "",
      Brand: "",
      Description: "",
      CostPrice: "",
      Price: "",
      Current_Stock: "",
      Minimum_Stock: "",
      Maximum_Stock: "",
      Unit: units.length > 0 ? units[0] : "pz", 
      TaxRate: "16",
      Supplier: "",
      Location: "",
    })
    setCustomCategory("");
    setIsCustomCategoryMode(false);
    setError("")
    setSuccess("")
    setErrors({})
    setTouched({})
  }

  const handleSubmit = async (action = "save") => {
    if (!validateForm()) {
      setError("Por favor corrige los errores en el formulario");
      return;
    }

    setLoading(true)
    setError("")
    setSuccess("")

    try {
      // Determinar el valor final de la categoría
      const finalCategory = isCustomCategoryMode 
        ? customCategory.trim() 
        : formData.Category;
        
      const productData = {
        Name: formData.Name.trim(),
        Code: formData.Code.trim(),
        Barcode: formData.Barcode.trim(),
        Category: finalCategory, // Usar la categoría final
        Brand: formData.Brand.trim(),
        Description: formData.Description.trim(),
        CostPrice: formData.CostPrice ? parseFloat(formData.CostPrice) : null,
        Price: parseFloat(formData.Price),
        Current_Stock: parseInt(formData.Current_Stock) || 0,
        Minimum_Stock: parseInt(formData.Minimum_Stock) || 0,
        Maximum_Stock: parseInt(formData.Maximum_Stock) || 0,
        Unit: formData.Unit,
        TaxRate: parseFloat(formData.TaxRate) || 0,
        Supplier: formData.Supplier.trim(),
        Location: formData.Location.trim(),
      }

      let response
      
      if (isEditMode) {
        response = await api.put(`/products/${productToEdit.Product_ID}`, productData)
        setSuccess(`Producto "${formData.Name}" actualizado exitosamente`)
      } else {
        response = await api.post("/products/", productData)
        setSuccess(`Producto "${formData.Name}" creado exitosamente`)
      }

      setLoading(false)
      
      if (action === "saveAndNew") {
        resetForm()
        setTimeout(() => setSuccess(""), 3000)
      } else {
        setTimeout(() => {
          navigate("/products")
        }, 2000)
      }
    } catch (err) {
      console.error("Error saving product:", err)
      setError("Error al guardar el producto: " + (err.response?.data?.message || err.message))
      setLoading(false)
    }
  }

  const handleSaveAndNew = () => {
    handleSubmit("saveAndNew")
  }

  const handleBack = () => {
    navigate("/products")
  }

  const calculateMargin = () => {
    const cost = parseFloat(formData.CostPrice) || 0
    const sale = parseFloat(formData.Price) || 0
    if (cost === 0 || sale === 0) return "0.00"
    return (((sale - cost) / sale) * 100).toFixed(2)
  }

  const calculateProfit = () => {
    const cost = parseFloat(formData.CostPrice) || 0
    const sale = parseFloat(formData.Price) || 0
    return (sale - cost).toFixed(2)
  }

  // Función para obtener propiedades de ayuda del campo
  const getFieldHelperText = (name) => {
    const rules = validationRules[name];
    if (!rules) return '';
    
    const helperTexts = [];
    
    if (rules.required) {
      helperTexts.push('Requerido');
    }
    
    if (rules.minLength && rules.maxLength) {
      helperTexts.push(`${rules.minLength}-${rules.maxLength} caracteres`);
    } else if (rules.minLength) {
      helperTexts.push(`Mín. ${rules.minLength} caracteres`);
    } else if (rules.maxLength) {
      helperTexts.push(`Máx. ${rules.maxLength} caracteres`);
    }

    if (rules.min !== undefined && rules.max !== undefined) {
      helperTexts.push(`${rules.min} - ${rules.max}`);
    }
    
    return helperTexts.join(' • ');
  };

  // Función para renderizar el icono de estado del campo
  const renderFieldStatus = (name) => {
    if (!touched[name]) return null;
    
    // Si estamos en modo personalizado, el error se muestra en el campo de texto libre
    if (name === 'Category' && isCustomCategoryMode) return null;
    
    if (errors[name]) {
      return (
        <Tooltip title={errors[name]}>
          <Warning sx={{ color: "#EF4444", fontSize: 18 }} />
        </Tooltip>
      );
    } else if (formData[name] || (name === 'Category' && isCustomCategoryMode && customCategory)) {
      return <CheckCircle sx={{ color: "#10B981", fontSize: 18 }} />;
    }
    return null;
  };

  const isEditMode = Boolean(productToEdit)
  
  // Se eliminan los avisos de listas vacías ya que ahora tienen datos

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
            onClick={handleBack}
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
              {isEditMode ? "Editar Producto" : "Nuevo Producto"}
            </Typography>
            <Typography variant="body2" sx={{ color: "#9CA3AF" }}>
              {isEditMode ? `Editando: ${productToEdit?.Name || 'Producto'}` : "Completa la información del producto"}
            </Typography>
          </Box>
        </Box>

        {isEditMode && (
          <Alert 
            severity="info" 
            sx={{ 
              mb: 3,
              bgcolor: "rgba(59, 130, 246, 0.2)",
              color: "#60A5FA",
              border: "1px solid rgba(59, 130, 246, 0.5)"
            }}
          >
            Estás editando el producto: <strong>{productToEdit.Name}</strong> (Código: {productToEdit.Code})
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess("")}>
            {success}
          </Alert>
        )}

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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="body2" sx={{ color: "#D1D5DB", fontWeight: 500 }}>
                        Nombre del Producto *
                      </Typography>
                      {renderFieldStatus('Name')}
                    </Box>
                    <TextField
                      fullWidth
                      name="Name"
                      value={formData.Name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={!!errors.Name}
                      helperText={errors.Name || getFieldHelperText('Name')}
                      placeholder="Ej: Laptop HP ProBook"
                      InputProps={{
                        sx: {
                          bgcolor: "#1E293B",
                          color: "#FFFFFF",
                          "& fieldset": { borderColor: errors.Name ? "#EF4444" : "#334155" },
                          "&:hover fieldset": { borderColor: errors.Name ? "#EF4444" : "#475569" },
                          "&.Mui-focused fieldset": { borderColor: errors.Name ? "#EF4444" : "#3B82F6" }
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="body2" sx={{ color: "#D1D5DB", fontWeight: 500 }}>
                        Código *
                      </Typography>
                      {renderFieldStatus('Code')}
                    </Box>
                    <TextField
                      fullWidth
                      name="Code"
                      value={formData.Code}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={!!errors.Code}
                      helperText={errors.Code || getFieldHelperText('Code')}
                      placeholder="Ej: LAP-001"
                      InputProps={{
                        sx: {
                          bgcolor: "#1E293B",
                          color: "#FFFFFF",
                          "& fieldset": { borderColor: errors.Code ? "#EF4444" : "#334155" },
                          "&:hover fieldset": { borderColor: errors.Code ? "#EF4444" : "#475569" },
                          "&.Mui-focused fieldset": { borderColor: errors.Code ? "#EF4444" : "#3B82F6" }
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="body2" sx={{ color: "#D1D5DB", fontWeight: 500 }}>
                        Código de Barras
                      </Typography>
                      {renderFieldStatus('Barcode')}
                    </Box>
                    <TextField
                      fullWidth
                      name="Barcode"
                      value={formData.Barcode}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={!!errors.Barcode}
                      helperText={errors.Barcode || getFieldHelperText('Barcode')}
                      placeholder="7501234567890"
                      InputProps={{
                        sx: {
                          bgcolor: "#1E293B",
                          color: "#FFFFFF",
                          "& fieldset": { borderColor: errors.Barcode ? "#EF4444" : "#334155" },
                          "&:hover fieldset": { borderColor: errors.Barcode ? "#EF4444" : "#475569" },
                          "&.Mui-focused fieldset": { borderColor: errors.Barcode ? "#EF4444" : "#3B82F6" }
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="body2" sx={{ color: "#D1D5DB", fontWeight: 500 }}>
                        Marca
                      </Typography>
                      {renderFieldStatus('Brand')}
                    </Box>
                    <TextField
                      fullWidth
                      name="Brand"
                      value={formData.Brand}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={!!errors.Brand}
                      helperText={errors.Brand || getFieldHelperText('Brand')}
                      placeholder="Ej: HP"
                      InputProps={{
                        sx: {
                          bgcolor: "#1E293B",
                          color: "#FFFFFF",
                          "& fieldset": { borderColor: errors.Brand ? "#EF4444" : "#334155" },
                          "&:hover fieldset": { borderColor: errors.Brand ? "#EF4444" : "#475569" },
                          "&.Mui-focused fieldset": { borderColor: errors.Brand ? "#EF4444" : "#3B82F6" }
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="body2" sx={{ color: "#D1D5DB", fontWeight: 500 }}>
                        Descripción
                      </Typography>
                      {renderFieldStatus('Description')}
                    </Box>
                    <TextField
                      fullWidth
                      name="Description"
                      value={formData.Description}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={!!errors.Description}
                      helperText={errors.Description || `${formData.Description.length}/500 • ${getFieldHelperText('Description')}`}
                      placeholder="Descripción detallada del producto..."
                      multiline
                      rows={3}
                      InputProps={{
                        sx: {
                          bgcolor: "#1E293B",
                          color: "#FFFFFF",
                          "& fieldset": { borderColor: errors.Description ? "#EF4444" : "#334155" },
                          "&:hover fieldset": { borderColor: errors.Description ? "#EF4444" : "#475569" },
                          "&.Mui-focused fieldset": { borderColor: errors.Description ? "#EF4444" : "#3B82F6" }
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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="body2" sx={{ color: "#D1D5DB", fontWeight: 500 }}>
                        Precio de Costo
                      </Typography>
                      {renderFieldStatus('CostPrice')}
                    </Box>
                    <TextField
                      fullWidth
                      name="CostPrice"
                      type="number"
                      value={formData.CostPrice}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={!!errors.CostPrice}
                      helperText={errors.CostPrice || getFieldHelperText('CostPrice')}
                      placeholder="0.00"
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        sx: {
                          bgcolor: "#1E293B",
                          color: "#FFFFFF",
                          "& fieldset": { borderColor: errors.CostPrice ? "#EF4444" : "#334155" },
                          "&:hover fieldset": { borderColor: errors.CostPrice ? "#EF4444" : "#475569" },
                          "&.Mui-focused fieldset": { borderColor: errors.CostPrice ? "#EF4444" : "#3B82F6" }
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="body2" sx={{ color: "#D1D5DB", fontWeight: 500 }}>
                        Precio de Venta *
                      </Typography>
                      {renderFieldStatus('Price')}
                    </Box>
                    <TextField
                      fullWidth
                      name="Price"
                      type="number"
                      value={formData.Price}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={!!errors.Price}
                      helperText={errors.Price || getFieldHelperText('Price')}
                      placeholder="0.00"
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        sx: {
                          bgcolor: "#1E293B",
                          color: "#FFFFFF",
                          "& fieldset": { borderColor: errors.Price ? "#EF4444" : "#334155" },
                          "&:hover fieldset": { borderColor: errors.Price ? "#EF4444" : "#475569" },
                          "&.Mui-focused fieldset": { borderColor: errors.Price ? "#EF4444" : "#3B82F6" }
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="body2" sx={{ color: "#D1D5DB", fontWeight: 500 }}>
                        IVA (%) *
                      </Typography>
                      {renderFieldStatus('TaxRate')}
                    </Box>
                    <TextField
                      fullWidth
                      select
                      name="TaxRate"
                      value={formData.TaxRate}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={!!errors.TaxRate}
                      helperText={errors.TaxRate || getFieldHelperText('TaxRate')}
                      InputProps={{
                        sx: {
                          bgcolor: "#1E293B",
                          color: "#FFFFFF",
                          "& fieldset": { borderColor: errors.TaxRate ? "#EF4444" : "#334155" },
                          "&:hover fieldset": { borderColor: errors.TaxRate ? "#EF4444" : "#475569" },
                          "&.Mui-focused fieldset": { borderColor: errors.TaxRate ? "#EF4444" : "#3B82F6" }
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

                {(formData.CostPrice || formData.Price) && (
                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      bgcolor: "rgba(59, 130, 246, 0.2)",
                      border: "1px solid rgba(59, 130, 246, 0.5)",
                      borderRadius: 2
                    }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" sx={{ color: "#D1D5DB" }}>
                          Margen de Ganancia:
                        </Typography>
                        <Typography variant="h6" sx={{ color: "#60A5FA", fontWeight: "bold" }}>
                          {calculateMargin()}%
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" sx={{ color: "#D1D5DB" }}>
                          Ganancia por Unidad:
                        </Typography>
                        <Typography variant="h6" sx={{ color: "#10B981", fontWeight: "bold" }}>
                          ${calculateProfit()}
                        </Typography>
                      </Grid>
                    </Grid>
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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="body2" sx={{ color: "#D1D5DB", fontWeight: 500 }}>
                        Stock Actual
                      </Typography>
                      {renderFieldStatus('Current_Stock')}
                    </Box>
                    <TextField
                      fullWidth
                      name="Current_Stock"
                      type="number"
                      value={formData.Current_Stock}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={!!errors.Current_Stock}
                      helperText={errors.Current_Stock || getFieldHelperText('Current_Stock')}
                      placeholder="0"
                      InputProps={{
                        sx: {
                          bgcolor: "#1E293B",
                          color: "#FFFFFF",
                          "& fieldset": { borderColor: errors.Current_Stock ? "#EF4444" : "#334155" },
                          "&:hover fieldset": { borderColor: errors.Current_Stock ? "#EF4444" : "#475569" },
                          "&.Mui-focused fieldset": { borderColor: errors.Current_Stock ? "#EF4444" : "#3B82F6" }
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={6} sm={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="body2" sx={{ color: "#D1D5DB", fontWeight: 500 }}>
                        Stock Mínimo
                      </Typography>
                      {renderFieldStatus('Minimum_Stock')}
                    </Box>
                    <TextField
                      fullWidth
                      name="Minimum_Stock"
                      type="number"
                      value={formData.Minimum_Stock}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={!!errors.Minimum_Stock}
                      helperText={errors.Minimum_Stock || getFieldHelperText('Minimum_Stock')}
                      placeholder="0"
                      InputProps={{
                        sx: {
                          bgcolor: "#1E293B",
                          color: "#FFFFFF",
                          "& fieldset": { borderColor: errors.Minimum_Stock ? "#EF4444" : "#334155" },
                          "&:hover fieldset": { borderColor: errors.Minimum_Stock ? "#EF4444" : "#475569" },
                          "&.Mui-focused fieldset": { borderColor: errors.Minimum_Stock ? "#EF4444" : "#3B82F6" }
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={6} sm={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="body2" sx={{ color: "#D1D5DB", fontWeight: 500 }}>
                        Stock Máximo
                      </Typography>
                      {renderFieldStatus('Maximum_Stock')}
                    </Box>
                    <TextField
                      fullWidth
                      name="Maximum_Stock"
                      type="number"
                      value={formData.Maximum_Stock}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={!!errors.Maximum_Stock}
                      helperText={errors.Maximum_Stock || getFieldHelperText('Maximum_Stock')}
                      placeholder="0"
                      InputProps={{
                        sx: {
                          bgcolor: "#1E293B",
                          color: "#FFFFFF",
                          "& fieldset": { borderColor: errors.Maximum_Stock ? "#EF4444" : "#334155" },
                          "&:hover fieldset": { borderColor: errors.Maximum_Stock ? "#EF4444" : "#475569" },
                          "&.Mui-focused fieldset": { borderColor: errors.Maximum_Stock ? "#EF4444" : "#3B82F6" }
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
                      name="Unit"
                      value={formData.Unit}
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
                      {/* Unidades por defecto */}
                      {units.map(unit => (
                        <MenuItem key={unit} value={unit}>{unit}</MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="body2" sx={{ color: "#D1D5DB", fontWeight: 500 }}>
                        Proveedor
                      </Typography>
                      {renderFieldStatus('Supplier')}
                    </Box>
                    <TextField
                      fullWidth
                      name="Supplier"
                      value={formData.Supplier}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={!!errors.Supplier}
                      helperText={errors.Supplier || getFieldHelperText('Supplier')}
                      placeholder="Nombre del proveedor"
                      InputProps={{
                        sx: {
                          bgcolor: "#1E293B",
                          color: "#FFFFFF",
                          "& fieldset": { borderColor: errors.Supplier ? "#EF4444" : "#334155" },
                          "&:hover fieldset": { borderColor: errors.Supplier ? "#EF4444" : "#475569" },
                          "&.Mui-focused fieldset": { borderColor: errors.Supplier ? "#EF4444" : "#3B82F6" }
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="body2" sx={{ color: "#D1D5DB", fontWeight: 500 }}>
                        Ubicación en Almacén
                      </Typography>
                      {renderFieldStatus('Location')}
                    </Box>
                    <TextField
                      fullWidth
                      name="Location"
                      value={formData.Location}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={!!errors.Location}
                      helperText={errors.Location || getFieldHelperText('Location')}
                      placeholder="Ej: Pasillo 3, Estante B"
                      InputProps={{
                        sx: {
                          bgcolor: "#1E293B",
                          color: "#FFFFFF",
                          "& fieldset": { borderColor: errors.Location ? "#EF4444" : "#334155" },
                          "&:hover fieldset": { borderColor: errors.Location ? "#EF4444" : "#475569" },
                          "&.Mui-focused fieldset": { borderColor: errors.Location ? "#EF4444" : "#3B82F6" }
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

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography variant="body2" sx={{ color: "#D1D5DB", fontWeight: 500 }}>
                      Categoría *
                    </Typography>
                    {renderFieldStatus('Category')}
                  </Box>
                  
                  {/* Campo de selección de Categoría (Select/Dropdown) */}
                  <TextField
                    fullWidth
                    select
                    name="Category"
                    value={formData.Category}
                    onChange={handleCategoryChange}
                    onBlur={handleBlur}
                    error={!!errors.Category}
                    helperText={errors.Category || getFieldHelperText('Category')}
                    disabled={isCustomCategoryMode} // Deshabilitar si se está usando el campo libre
                    InputProps={{
                      sx: {
                        bgcolor: "#1E293B",
                        color: isCustomCategoryMode ? "#9CA3AF" : "#FFFFFF", // Color gris si está deshabilitado
                        "& fieldset": { borderColor: errors.Category ? "#EF4444" : "#334155" },
                        "&:hover fieldset": { borderColor: errors.Category ? "#EF4444" : "#475569" },
                        "&.Mui-focused fieldset": { borderColor: errors.Category ? "#EF4444" : "#3B82F6" }
                      }
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
                    {/* Opción para categoría personalizada */}
                    <MenuItem value={OTHER_CATEGORY_VALUE} sx={{ fontWeight: 'bold', color: "#F59E0B" }}>
                       — Otra / Personalizada —
                    </MenuItem>
                  </TextField>
                  
                  {/* Campo de texto libre para categoría personalizada (Solo visible si se selecciona "Otra") */}
                  {isCustomCategoryMode && (
                      <Box sx={{ mt: 2 }}>
                          <Typography variant="body2" sx={{ color: "#D1D5DB", fontWeight: 500, mb: 1 }}>
                              Ingresa la Categoría Personalizada *
                          </Typography>
                          <TextField
                              fullWidth
                              name="CustomCategory"
                              value={customCategory}
                              onChange={handleCustomCategoryChange}
                              onBlur={(e) => {
                                  setTouched(prev => ({ ...prev, Category: true }));
                                  handleCustomCategoryChange(e); // Trigger validation on blur
                              }}
                              error={!!errors.Category}
                              helperText={errors.Category || `Máx. ${validationRules.Name.maxLength} caracteres • Solo letras y números`}
                              placeholder="Ej: Papelería Fina"
                              InputProps={{
                                sx: {
                                  bgcolor: "#1E293B",
                                  color: "#FFFFFF",
                                  "& fieldset": { borderColor: errors.Category ? "#EF4444" : "#334155" },
                                  "&:hover fieldset": { borderColor: errors.Category ? "#EF4444" : "#475569" },
                                  "&.Mui-focused fieldset": { borderColor: errors.Category ? "#EF4444" : "#3B82F6" }
                                }
                              }}
                          />
                      </Box>
                  )}
                </CardContent>
              </Card>

              {/* Botones de Acción */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={() => handleSubmit("save")}
                  disabled={loading || Object.keys(errors).some(key => errors[key])}
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
                  {loading 
                    ? "Guardando..." 
                    : isEditMode 
                      ? "Actualizar Producto" 
                      : "Guardar Producto"
                  }
                </Button>

                {!isEditMode && (
                  <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    onClick={handleSaveAndNew}
                    disabled={loading || Object.keys(errors).some(key => errors[key])}
                    startIcon={<Add />}
                    sx={{
                      borderColor: "#10B981",
                      color: "#10B981",
                      py: 1.5,
                      fontWeight: 600,
                      fontSize: 16,
                      textTransform: "none",
                      "&:hover": {
                        borderColor: "#059669",
                        bgcolor: "rgba(16, 185, 129, 0.1)"
                      },
                      "&:disabled": {
                        borderColor: "#475569",
                        color: "#475569"
                      }
                    }}
                  >
                    {loading ? "Guardando..." : "Agregar y Registrar Otro"}
                  </Button>
                )}
              </Box>
              
              {/* Se elimina el bloque de advertencia de listas vacías ya que ahora tienen datos */}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}