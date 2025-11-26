import { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  useTheme,
  useMediaQuery,
  Fade,
  Slide,
  Zoom,
  Avatar,
  Chip,
  Container
} from '@mui/material';
import {
  Code,
  Group,
  Rocket,
  Security,
  Speed,
  DesignServices,
  SupportAgent,
  TrendingUp,
  Store,
  PointOfSale
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Datos del equipo de desarrollo
  const teamMembers = [
    {
      name: 'Brayan García',
      role: 'Full Stack Developer',
      avatar: <Avatar sx={{ bgcolor: '#6366f1' }}>A</Avatar>,
      specialty: 'Bases de Datos & API'
    },
    {
      name: 'Gerardo Hernández',
      role: 'UI/UX Designer',
      avatar: <Avatar sx={{ bgcolor: '#10b981' }}>M</Avatar>,
      specialty: 'Diseño & Experiencia'
    },
    {
      name: 'Fernando martínez',
      role: 'Backend Developer',
      avatar: <Avatar sx={{ bgcolor: '#f59e0b' }}>D</Avatar>,
      specialty: 'React & Node.js'
    }
  ];

  const features = [
    {
      icon: <Speed sx={{ fontSize: 40 }} />,
      title: 'Rendimiento Óptimo',
      description: 'Sistema rápido y responsive diseñado para tu productividad'
    },
    {
      icon: <Security sx={{ fontSize: 40 }} />,
      title: 'Seguridad Integral',
      description: 'Tus datos protegidos con tecnología de última generación'
    },
    {
      icon: <DesignServices sx={{ fontSize: 40 }} />,
      title: 'Diseño Intuitivo',
      description: 'Interfaz limpia y fácil de usar para cualquier persona'
    },
    {
      icon: <SupportAgent sx={{ fontSize: 40 }} />,
      title: 'Soporte Continuo',
      description: 'Equipo siempre disponible para ayudarte a crecer'
    }
  ];

  const quickActions = [
    {
      icon: <PointOfSale sx={{ fontSize: 28 }} />,
      title: 'Punto de Venta',
      description: 'Iniciar nueva venta',
      path: '/pos',
      color: '#6366f1'
    },
    {
      icon: <Store sx={{ fontSize: 28 }} />,
      title: 'Inventario',
      description: 'Gestionar productos',
      path: '/inventory',
      color: '#10b981'
    },
    {
      icon: <TrendingUp sx={{ fontSize: 28 }} />,
      title: 'Reportes',
      description: 'Ver análisis',
      path: '/reports',
      color: '#f59e0b'
    }
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        color: '#e2e8f0',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Elementos decorativos de fondo */}
      <Box
        sx={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 300,
          height: 300,
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 6s ease-in-out infinite'
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -100,
          left: -100,
          width: 400,
          height: 400,
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 8s ease-in-out infinite reverse'
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: 4 }}>
        {/* Hero Section */}
        <Fade in={animated} timeout={800}>
          <Box sx={{ textAlign: 'center', mb: 8, mt: 4 }}>
            <Slide in={animated} direction="down" timeout={500}>
              <Box>
                <Chip
                  icon={<Rocket />}
                  label="Nueva Generación de Desarrollo"
                  sx={{
                    mb: 3,
                    background: 'linear-gradient(135deg, #6366f1, #38bdf8)',
                    color: 'white',
                    fontWeight: 'bold',
                    py: 1
                  }}
                />
                <Typography
                  variant="h1"
                  sx={{
                    fontWeight: 'bold',
                    background: 'linear-gradient(135deg, #38bdf8 0%, #6366f1 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    mb: 2,
                    fontSize: { xs: '2.5rem', md: '4rem' },
                    lineHeight: 1.2
                  }}
                >
                  POS-ML
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    color: '#94a3b8',
                    maxWidth: '600px',
                    mx: 'auto',
                    lineHeight: 1.6,
                    mb: 4,
                    fontWeight: 300
                  }}
                >
                  Desarrollado con pasión por un equipo emergente que cree en el
                  poder de la tecnología para transformar negocios
                </Typography>
              </Box>
            </Slide>
          </Box>
        </Fade>

        {/* Acciones Rápidas */}
        <Fade in={animated} timeout={1000}>
          <Box sx={{ mb: 8 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'bold',
                color: '#f1f5f9',
                mb: 4,
                textAlign: 'center'
              }}
            >
              Comienza Ahora
            </Typography>
            <Grid container spacing={3} justifyContent="center">
              {quickActions.map((action, index) => (
                <Grid item xs={12} sm={6} md={4} key={action.title}>
                  <Zoom in={animated} timeout={1200 + index * 200}>
                    <Card
                      sx={{
                        background: 'rgba(30, 41, 59, 0.7)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(148, 163, 184, 0.1)',
                        borderRadius: 4,
                        p: 3,
                        height: '100%',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          borderColor: action.color,
                          boxShadow: `0 20px 40px ${action.color}20`
                        }
                      }}
                      onClick={() => navigate(action.path)}
                    >
                      <CardContent sx={{
                        p: 0,
                        textAlign: 'center',
                        '&:last-child': { pb: 0 }
                      }}>
                        <Box
                          sx={{
                            color: action.color,
                            mb: 2,
                            display: 'flex',
                            justifyContent: 'center'
                          }}
                        >
                          {action.icon}
                        </Box>
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: 'bold',
                            color: '#f8fafc',
                            mb: 1
                          }}
                        >
                          {action.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#94a3b8',
                            lineHeight: 1.5
                          }}
                        >
                          {action.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Zoom>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Fade>

        {/* Nuestro Equipo */}
        <Fade in={animated} timeout={1200}>
          <Box sx={{ mb: 8 }}>
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Chip
                icon={<Group />}
                label="Conoce al Equipo"
                sx={{
                  mb: 2,
                  background: 'rgba(56, 189, 248, 0.1)',
                  color: '#38bdf8',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  fontWeight: 'bold'
                }}
              />
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 'bold',
                  color: '#f1f5f9',
                  mb: 2
                }}
              >
                Talentos Emergentes
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: '#94a3b8',
                  maxWidth: '700px',
                  mx: 'auto',
                  lineHeight: 1.6,
                  fontWeight: 300
                }}
              >
                Un grupo de desarrolladores apasionados que comienza su journey profesional,
                combinando innovación, dedicación y ganas de crear soluciones que marquen la diferencia
              </Typography>
            </Box>

            {/* CAMBIO: Grid centrado con 3 columnas */}
            <Grid container spacing={4} justifyContent="center">
              {teamMembers.map((member, index) => (
                <Grid item xs={12} sm={6} md={4} key={member.name}>
                  <Slide in={animated} direction="up" timeout={1400 + index * 200}>
                    <Paper
                      sx={{
                        background: 'rgba(30, 41, 59, 0.5)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(148, 163, 184, 0.1)',
                        borderRadius: 3,
                        p: 4,
                        textAlign: 'center',
                        height: '100%',
                        transition: 'all 0.3s ease',
                        mx: 'auto',
                        maxWidth: 320,
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          borderColor: 'rgba(56, 189, 248, 0.3)',
                          background: 'rgba(30, 41, 59, 0.7)',
                          boxShadow: '0 12px 28px rgba(0,0,0,0.25)'
                        }
                      }}
                    >
                      <Box sx={{ mb: 3 }}>
                        <Avatar
                          sx={{
                            width: 80,
                            height: 80,
                            mx: 'auto',
                            bgcolor: member.avatar.props.sx.bgcolor,
                            fontSize: '1.5rem',
                            fontWeight: 'bold'
                          }}
                        >
                          {member.name.charAt(0)}
                        </Avatar>
                      </Box>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 'bold',
                          color: '#f8fafc',
                          mb: 1
                        }}
                      >
                        {member.name}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: '#38bdf8',
                          fontWeight: 'medium',
                          mb: 2,
                          fontSize: '0.95rem'
                        }}
                      >
                        {member.role}
                      </Typography>
                      <Chip
                        label={member.specialty}
                        size="medium"
                        variant="outlined"
                        sx={{
                          borderColor: 'rgba(148, 163, 184, 0.3)',
                          color: '#94a3b8',
                          fontSize: '0.8rem',
                          fontWeight: 'medium'
                        }}
                      />
                    </Paper>
                  </Slide>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Fade>

        {/* Características */}
        <Fade in={animated} timeout={1600}>
          <Box sx={{ mb: 8 }}>
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Chip
                icon={<Code />}
                label="Lo que Ofrecemos"
                sx={{
                  mb: 2,
                  background: 'rgba(16, 185, 129, 0.1)',
                  color: '#10b981',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  fontWeight: 'bold'
                }}
              />
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 'bold',
                  color: '#f1f5f9',
                  mb: 3
                }}
              >
                Innovación con Propósito
              </Typography>
            </Box>

            {/* CAMBIO: Grid de 4 columnas en lugar de 2 */}
            <Grid container spacing={3}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} md={3} key={feature.title}>
                  <Zoom in={animated} timeout={1800 + index * 200}>
                    <Card
                      sx={{
                        background: 'rgba(30, 41, 59, 0.4)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(148, 163, 184, 0.1)',
                        borderRadius: 3,
                        p: 3,
                        height: '100%',
                        transition: 'all 0.3s ease',
                        textAlign: 'center',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          borderColor: 'rgba(56, 189, 248, 0.3)',
                          boxShadow: '0 12px 28px rgba(0,0,0,0.25)'
                        }
                      }}
                    >
                      <CardContent sx={{ p: 0 }}>
                        <Box
                          sx={{
                            color: '#38bdf8',
                            mb: 2,
                            display: 'flex',
                            justifyContent: 'center'
                          }}
                        >
                          {feature.icon}
                        </Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 'bold',
                            color: '#f8fafc',
                            mb: 2
                          }}
                        >
                          {feature.title}
                        </Typography>
                        <Typography
                          sx={{
                            color: '#94a3b8',
                            lineHeight: 1.5,
                            fontSize: '0.9rem'
                          }}
                        >
                          {feature.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Zoom>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Fade>

        {/* Call to Action */}
        <Fade in={animated} timeout={2000}>
          <Paper
            sx={{
              background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(56, 189, 248, 0.2)',
              borderRadius: 4,
              p: 6,
              textAlign: 'center'
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'bold',
                color: '#f1f5f9',
                mb: 2
              }}
            >
              ¿Listo para Transformar tu Negocio?
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: '#94a3b8',
                mb: 4,
                maxWidth: '600px',
                mx: 'auto',
                fontWeight: 300
              }}
            >
              Únete a esta journey de crecimiento junto a nuestro equipo emergente
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<Rocket />}
              sx={{
                background: 'linear-gradient(135deg, #6366f1 0%, #38bdf8 100%)',
                borderRadius: 3,
                px: 4,
                py: 1.5,
                fontWeight: 'bold',
                fontSize: '1.1rem',
                '&:hover': {
                  background: 'linear-gradient(135deg, #4f46e5 0%, #0ea5e9 100%)',
                  transform: 'translateY(-2px)'
                }
              }}
              onClick={() => navigate('/pos')}
            >
              Comenzar Ahora
            </Button>
          </Paper>
        </Fade>

        {/* Footer */}
        <Fade in={animated} timeout={2200}>
          <Box
            sx={{
              mt: 8,
              pt: 4,
              borderTop: '1px solid rgba(148, 163, 184, 0.1)',
              textAlign: 'center'
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: '#64748b',
                fontSize: '0.875rem',
                mb: 1
              }}
            >
              Desarrollado con ❤️ por un equipo emergente de desarrolladores
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#475569',
                fontSize: '0.75rem'
              }}
            >
              © {new Date().getFullYear()} POS-ML - Punto de Venta Moderno | Versión 1.0
            </Typography>
          </Box>
        </Fade>
      </Container>

      {/* Estilos de animación globales */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
        
        @keyframes glow {
          0%, 100% {
            opacity: 0.6;
          }
          50% {
            opacity: 0.9;
          }
        }
      `}</style>
    </Box>
  );
}