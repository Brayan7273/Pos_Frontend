import { useState } from 'react';
import { TextField, Button, Paper, Typography } from '@mui/material';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const res = await api.post('/login', form);
      if (res.data.success) {
        navigate('/dashboard');
      } else {
        alert('Credenciales incorrectas');
      }
    } catch {
      alert('Error en el servidor');
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 400, mx: 'auto', mt: 10 }}>
      <Typography variant="h5" sx={{ mb: 2, textAlign: 'center' }}>
        Iniciar Sesión
      </Typography>
      <TextField
        label="Usuario"
        fullWidth
        margin="normal"
        onChange={(e) => setForm({ ...form, username: e.target.value })}
      />
      <TextField
        label="Contraseña"
        type="password"
        fullWidth
        margin="normal"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={handleSubmit}>
        Entrar
      </Button>
    </Paper>
  );
}
