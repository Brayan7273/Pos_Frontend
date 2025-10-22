import { Typography, Box, Paper } from '@mui/material';

export default function Dashboard() {
  return (
    <Box sx={{ p: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Bienvenido al Punto de Venta
        </Typography>
        <Typography>
          Desde aquí puedes administrar productos, revisar ventas y gestionar tu sistema POS.
        </Typography>
      </Paper>
    </Box>
  );
}
