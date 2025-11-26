import { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Paper,
  Typography,
  Alert,
  CircularProgress,
  Box,
  Container
} from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [token, setToken] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (!tokenFromUrl) {
      setAlert({
        type: 'error',
        message: 'Enlace inválido. Solicita un nuevo enlace de recuperación.'
      });
    }
    setToken(tokenFromUrl);
  }, [searchParams]);

  // 🔹 Validar campos - VERSIÓN MEJORADA
  const validate = () => {
    const newErrors = {};

    // Validación de contraseña
    if (!form.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (form.password.length < 8) {
      newErrors.password = 'Debe tener al menos 8 caracteres';
    } else {
      // Validaciones de seguridad mejoradas
      const securityChecks = {
        minLength: form.password.length >= 8,
        hasUpperCase: /[A-Z]/.test(form.password),
        hasLowerCase: /[a-z]/.test(form.password),
        hasNumbers: /\d/.test(form.password),
        hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(form.password),
        noSpaces: !/\s/.test(form.password)
      };

      const failedChecks = Object.keys(securityChecks).filter(check => !securityChecks[check]);

      if (failedChecks.length > 0) {
        const errorMessages = {
          minLength: 'al menos 8 caracteres',
          hasUpperCase: 'una letra mayúscula',
          hasLowerCase: 'una letra minúscula',
          hasNumbers: 'un número',
          hasSpecialChar: 'un carácter especial',
          noSpaces: 'no contener espacios'
        };

        const missingRequirements = failedChecks.map(check => errorMessages[check]).join(', ');
        newErrors.password = `La contraseña debe contener: ${missingRequirements}`;
      }
    }

    // Validación de confirmación de contraseña
    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔹 Calcular fortaleza de la contraseña (opcional - para feedback visual)
  const calculatePasswordStrength = (password) => {
    if (!password) return 0;

    let strength = 0;
    if (password.length >= 8) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[a-z]/.test(password)) strength += 20;
    if (/\d/.test(password)) strength += 20;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength += 20;

    return strength;
  };

  // 🔹 Obtener texto de fortaleza (opcional)
  const getStrengthText = (strength) => {
    if (strength === 0) return '';
    if (strength <= 40) return 'Débil';
    if (strength <= 60) return 'Media';
    if (strength <= 80) return 'Fuerte';
    return 'Muy fuerte';
  };

  // 🔹 Enviar formulario de reset
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setAlert({ type: '', message: '' });

    try {
      const res = await api.post('/auth/reset-password', {
        token: token,
        new_password: form.password
      });

      if (res.status === 200) {
        setAlert({
          type: 'success',
          message: '¡Contraseña actualizada correctamente! Redirigiendo al login...'
        });

        // Redirigir al login después de 3 segundos
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setAlert({
        type: 'error',
        message: error.response?.data?.error || 'Error al actualizar la contraseña. Intenta nuevamente.'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <Box
        sx={{
          height: '100vh',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={6}
            sx={{
              p: 4,
              borderRadius: 3,
              backgroundColor: 'rgba(30, 41, 59, 0.85)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(148,163,184,0.2)',
              textAlign: 'center'
            }}
          >
            <Alert severity="error" sx={{ mb: 2 }}>
              Enlace inválido o expirado
            </Alert>
            <Button
              variant="contained"
              onClick={() => navigate('/')}
              sx={{
                background: 'linear-gradient(90deg, #6366f1, #38bdf8)',
                '&:hover': {
                  background: 'linear-gradient(90deg, #4f46e5, #0ea5e9)',
                }
              }}
            >
              Volver al Login
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

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
      <Container maxWidth="sm">
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 3,
            backgroundColor: 'rgba(30, 41, 59, 0.85)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(148,163,184,0.2)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          }}
        >
          <Typography
            variant="h4"
            sx={{
              mb: 1,
              textAlign: 'center',
              fontWeight: 'bold',
              color: '#38bdf8',
            }}
          >
            Restablecer Contraseña
          </Typography>

          <Typography
            variant="body1"
            sx={{
              mb: 3,
              textAlign: 'center',
              color: '#94a3b8',
            }}
          >
            Ingresa tu nueva contraseña
          </Typography>

          {alert.message && (
            <Alert severity={alert.type} sx={{ mb: 2 }}>
              {alert.message}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              label="Nueva Contraseña"
              type="password"
              fullWidth
              margin="normal"
              value={form.password}
              onChange={(e) => {
                setForm({ ...form, password: e.target.value });
                setPasswordStrength(calculatePasswordStrength(e.target.value));
              }}
              error={!!errors.password}
              helperText={errors.password || (form.password && `Fortaleza: ${getStrengthText(passwordStrength)} (${passwordStrength}%)`)}
              variant="filled"
              InputProps={{
                disableUnderline: true,
                style: { color: '#e2e8f0', backgroundColor: 'rgba(15,23,42,0.5)', borderRadius: 6 },
              }}
              InputLabelProps={{ style: { color: '#94a3b8' } }}
            />

            <TextField
              label="Confirmar Contraseña"
              type="password"
              fullWidth
              margin="normal"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              variant="filled"
              InputProps={{
                disableUnderline: true,
                style: { color: '#e2e8f0', backgroundColor: 'rgba(15,23,42,0.5)', borderRadius: 6 },
              }}
              InputLabelProps={{ style: { color: '#94a3b8' } }}
            />

            <Button
              type="submit"
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
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Actualizar Contraseña'}
            </Button>

            <Button
              fullWidth
              variant="text"
              sx={{
                mt: 2,
                color: '#94a3b8',
                '&:hover': {
                  backgroundColor: 'rgba(148, 163, 184, 0.1)',
                }
              }}
              onClick={() => navigate('/')}
            >
              Volver al Login
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}