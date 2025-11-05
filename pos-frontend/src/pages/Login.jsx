import { useState } from 'react';
import {
  TextField,
  Button,
  Paper,
  Typography,
  Alert,
  CircularProgress,
  Box,
} from '@mui/material';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const navigate = useNavigate();

  // 🔹 Validar campos
  const validate = () => {
    const newErrors = {};
    if (!form.email) {
      newErrors.email = 'El correo es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Formato de correo inválido';
    }

    if (!form.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (form.password.length < 6) {
      newErrors.password = 'Debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔹 Enviar formulario
  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    setAlert({ type: '', message: '' });

    try {
      const res = await api.post('/auth/login', form);

      if (res.data && res.status === 200 && res.data.token) {
        localStorage.setItem('token', res.data.token);
        navigate('/home');
      } else {
        setAlert({
          type: 'error',
          message: 'Credenciales incorrectas. Verifique sus datos.',
        });
      }
    } catch (error) {
      console.error(error);
      setAlert({
        type: 'error',
        message:
          error.response?.data?.error ||
          'Error al conectar con el servidor. Intente nuevamente.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#e2e8f0',
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          maxWidth: 400,
          width: '90%',
          borderRadius: 3,
          backgroundColor: 'rgba(30, 41, 59, 0.85)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(148,163,184,0.2)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}
      >
        <Typography
          variant="h5"
          sx={{
            mb: 3,
            textAlign: 'center',
            fontWeight: 'bold',
            color: '#38bdf8',
          }}
        >
          Iniciar Sesión
        </Typography>

        {alert.message && (
          <Alert severity={alert.type} sx={{ mb: 2 }}>
            {alert.message}
          </Alert>
        )}

        <TextField
          label="Correo electrónico"
          type="email"
          fullWidth
          margin="normal"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          error={!!errors.email}
          helperText={errors.email}
          variant="filled"
          InputProps={{
            disableUnderline: true,
            style: { color: '#e2e8f0', backgroundColor: 'rgba(15,23,42,0.5)', borderRadius: 6 },
          }}
          InputLabelProps={{ style: { color: '#94a3b8' } }}
        />

        <TextField
          label="Contraseña"
          type="password"
          fullWidth
          margin="normal"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          error={!!errors.password}
          helperText={errors.password}
          variant="filled"
          InputProps={{
            disableUnderline: true,
            style: { color: '#e2e8f0', backgroundColor: 'rgba(15,23,42,0.5)', borderRadius: 6 },
          }}
          InputLabelProps={{ style: { color: '#94a3b8' } }}
        />

        <Button
          fullWidth
          variant="contained"
          sx={{
            mt: 3,
            py: 1.2,
            fontWeight: 'bold',
            borderRadius: 2,
            background: 'linear-gradient(90deg, #6366f1, #38bdf8)',
            '&:hover': {
              background: 'linear-gradient(90deg, #4f46e5, #0ea5e9)',
            },
          }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Entrar'}
        </Button>

        <Typography
          variant="body2"
          sx={{ mt: 3, textAlign: 'center', color: '#94a3b8' }}
        >
          © {new Date().getFullYear()} POS-ML
        </Typography>
      </Paper>
    </Box>
  );
}
