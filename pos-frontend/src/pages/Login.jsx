import { useState } from 'react';
import {
  TextField,
  Button,
  Paper,
  Typography,
  Alert,
  CircularProgress,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [showRecoverUser, setShowRecoverUser] = useState(false);
  const [showRecoverPassword, setShowRecoverPassword] = useState(false);
  const [recoverEmail, setRecoverEmail] = useState('');
  const [recoverLoading, setRecoverLoading] = useState(false);
  const navigate = useNavigate();

  // 🔹 Validar campos de login
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

  // 🔹 Enviar formulario de login
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
      console.error('Login error:', error);
      if (error.response?.status === 409) {
        setAlert({
          type: 'error',
          message: 'Ya tienes una sesión activa. Por favor, cierra sesión primero o contacta al administrador.',
        });
      } else {
        setAlert({
          type: 'error',
          message: error.response?.data?.error || 'Error al conectar con el servidor.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Recuperar nombre de usuario
  const handleRecoverUser = async () => {
    if (!recoverEmail || !/\S+@\S+\.\S+/.test(recoverEmail)) {
      setAlert({
        type: 'error',
        message: 'Por favor ingresa un correo electrónico válido.',
      });
      return;
    }

    setRecoverLoading(true);
    try {
      const res = await api.post('/auth/recover-user', { email: recoverEmail });
      
      if (res.status === 200) {
        setAlert({
          type: 'success',
          message: 'Se ha enviado tu nombre de usuario a tu correo electrónico.',
        });
        setShowRecoverUser(false);
        setRecoverEmail('');
      }
    } catch (error) {
      console.error('Recover user error:', error);
      setAlert({
        type: 'error',
        message: error.response?.data?.error || 'Error al recuperar el usuario. Intenta nuevamente.',
      });
    } finally {
      setRecoverLoading(false);
    }
  };

  // 🔹 Recuperar contraseña
  const handleRecoverPassword = async () => {
    if (!recoverEmail || !/\S+@\S+\.\S+/.test(recoverEmail)) {
      setAlert({
        type: 'error',
        message: 'Por favor ingresa un correo electrónico válido.',
      });
      return;
    }

    setRecoverLoading(true);
    try {
      const res = await api.post('/auth/recover-password', { email: recoverEmail });
      
      if (res.status === 200) {
        setAlert({
          type: 'success',
          message: 'Se ha enviado un enlace de recuperación a tu correo electrónico.',
        });
        setShowRecoverPassword(false);
        setRecoverEmail('');
      }
    } catch (error) {
      console.error('Recover password error:', error);
      setAlert({
        type: 'error',
        message: error.response?.data?.error || 'Error al recuperar la contraseña. Intenta nuevamente.',
      });
    } finally {
      setRecoverLoading(false);
    }
  };

  // 🔹 Cerrar diálogos y resetear estado
  const handleCloseDialog = (dialogType) => {
    if (dialogType === 'user') {
      setShowRecoverUser(false);
    } else {
      setShowRecoverPassword(false);
    }
    setRecoverEmail('');
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

        {/* Enlaces de recuperación */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          mt: 2,
          gap: 1
        }}>
          {/*
          <Button
            variant="text"
            sx={{
              color: '#38bdf8',
              fontSize: '0.875rem',
              textTransform: 'none',
              fontWeight: 'normal',
              '&:hover': {
                backgroundColor: 'rgba(56, 189, 248, 0.1)',
              }
            }}
            onClick={() => setShowRecoverUser(true)}
          >
            ¿Olvidaste tu usuario?
          </Button>
          */}
          
          <Button
            variant="text"
            sx={{
              color: '#38bdf8',
              fontSize: '0.875rem',
              textTransform: 'none',
              fontWeight: 'normal',
              '&:hover': {
                backgroundColor: 'rgba(56, 189, 248, 0.1)',
              }
            }}
            onClick={() => setShowRecoverPassword(true)}
          >
            ¿Olvidaste tu contraseña?
          </Button>
        </Box>

        <Typography
          variant="body2"
          sx={{ mt: 3, textAlign: 'center', color: '#94a3b8' }}
        >
          © {new Date().getFullYear()} POS-ML
        </Typography>
      </Paper>

      {/* Diálogo para recuperar usuario */}
      <Dialog
        open={showRecoverUser}
        onClose={() => handleCloseDialog('user')}
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            borderRadius: 3,
            border: '1px solid rgba(148,163,184,0.2)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            minWidth: 400,
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            textAlign: 'center',
            fontWeight: 'bold',
            color: '#38bdf8',
            fontSize: '1.5rem',
            pb: 1,
          }}
        >
          Recuperar Usuario
        </DialogTitle>
        
        <DialogContent sx={{ pt: 3, pb: 2 }}>
          <Typography 
            sx={{ 
              color: '#e2e8f0', 
              mb: 2,
              textAlign: 'center',
              fontSize: '0.95rem'
            }}
          >
            Ingresa tu correo electrónico para recuperar tu nombre de usuario.
          </Typography>
          
          <TextField
            fullWidth
            label="Correo electrónico"
            type="email"
            value={recoverEmail}
            onChange={(e) => setRecoverEmail(e.target.value)}
            variant="filled"
            InputProps={{
              disableUnderline: true,
              style: { color: '#e2e8f0', backgroundColor: 'rgba(15,23,42,0.5)', borderRadius: 6 },
            }}
            InputLabelProps={{ style: { color: '#94a3b8' } }}
          />
        </DialogContent>
        
        <DialogActions sx={{ 
          justifyContent: 'center', 
          gap: 2, 
          pb: 3,
          px: 3 
        }}>
          <Button 
            onClick={() => handleCloseDialog('user')}
            variant="outlined"
            sx={{
              color: '#94a3b8',
              borderColor: '#475569',
              borderRadius: 2,
              px: 3,
              py: 1,
              fontWeight: 'bold',
              '&:hover': {
                borderColor: '#64748b',
                backgroundColor: 'rgba(100, 116, 139, 0.1)',
              }
            }}
          >
            Cancelar
          </Button>
          
          <Button
            variant="contained"
            onClick={handleRecoverUser}
            disabled={recoverLoading}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
              fontWeight: 'bold',
              background: 'linear-gradient(90deg, #6366f1, #38bdf8)',
              '&:hover': {
                background: 'linear-gradient(90deg, #4f46e5, #0ea5e9)',
              }
            }}
          >
            {recoverLoading ? <CircularProgress size={24} color="inherit" /> : 'Enviar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para recuperar contraseña */}
      <Dialog
        open={showRecoverPassword}
        onClose={() => handleCloseDialog('password')}
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            borderRadius: 3,
            border: '1px solid rgba(148,163,184,0.2)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            minWidth: 400,
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            textAlign: 'center',
            fontWeight: 'bold',
            color: '#38bdf8',
            fontSize: '1.5rem',
            pb: 1,
          }}
        >
          Recuperar Contraseña
        </DialogTitle>
        
        <DialogContent sx={{ pt: 3, pb: 2 }}>
          <Typography 
            sx={{ 
              color: '#e2e8f0', 
              mb: 2,
              textAlign: 'center',
              fontSize: '0.95rem'
            }}
          >
            Ingresa tu correo electrónico para recibir un enlace de recuperación.
          </Typography>
          
          <TextField
            fullWidth
            label="Correo electrónico"
            type="email"
            value={recoverEmail}
            onChange={(e) => setRecoverEmail(e.target.value)}
            variant="filled"
            InputProps={{
              disableUnderline: true,
              style: { color: '#e2e8f0', backgroundColor: 'rgba(15,23,42,0.5)', borderRadius: 6 },
            }}
            InputLabelProps={{ style: { color: '#94a3b8' } }}
          />
        </DialogContent>
        
        <DialogActions sx={{ 
          justifyContent: 'center', 
          gap: 2, 
          pb: 3,
          px: 3 
        }}>
          <Button 
            onClick={() => handleCloseDialog('password')}
            variant="outlined"
            sx={{
              color: '#94a3b8',
              borderColor: '#475569',
              borderRadius: 2,
              px: 3,
              py: 1,
              fontWeight: 'bold',
              '&:hover': {
                borderColor: '#64748b',
                backgroundColor: 'rgba(100, 116, 139, 0.1)',
              }
            }}
          >
            Cancelar
          </Button>
          
          <Button
            variant="contained"
            onClick={handleRecoverPassword}
            disabled={recoverLoading}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
              fontWeight: 'bold',
              background: 'linear-gradient(90deg, #6366f1, #38bdf8)',
              '&:hover': {
                background: 'linear-gradient(90deg, #4f46e5, #0ea5e9)',
              }
            }}
          >
            {recoverLoading ? <CircularProgress size={24} color="inherit" /> : 'Enviar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}