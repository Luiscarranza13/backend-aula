// Servidor de prueba simple para verificar que Railway funciona
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas de prueba
app.get('/', (req, res) => {
  res.json({
    message: 'Aula Virtual API is running',
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  });
});

app.post('/auth/login', (req, res) => {
  const { email, contraseña } = req.body;
  
  // Login de prueba
  if (email === 'admin@aula.com' && contraseña === 'admin123') {
    res.json({
      access_token: 'test-token-123',
      user: {
        id: 1,
        email: 'admin@aula.com',
        nombre: 'Admin',
        apellido: 'Test',
        rol: 'admin',
      },
    });
  } else {
    res.status(401).json({
      message: 'Credenciales inválidas',
    });
  }
});

app.get('/courses', (req, res) => {
  res.json([
    {
      id: 1,
      titulo: 'Curso de Prueba',
      descripcion: 'Este es un curso de prueba',
      docenteId: 1,
    },
  ]);
});

app.get('/users', (req, res) => {
  res.json([
    {
      id: 1,
      email: 'admin@aula.com',
      nombre: 'Admin',
      apellido: 'Test',
      rol: 'admin',
    },
  ]);
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    message: 'Error interno del servidor',
    error: err.message,
  });
});

// Iniciar servidor
app.listen(port, '0.0.0.0', () => {
  console.log(`✅ Servidor de prueba corriendo en puerto ${port}`);
  console.log(`🌐 URL: http://0.0.0.0:${port}`);
  console.log(`📦 Entorno: ${process.env.NODE_ENV || 'development'}`);
});
