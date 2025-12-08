const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configuración de la base de datos
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'aula_virtual_nest'
};

// Crear pool de conexiones
const pool = mysql.createPool(dbConfig);

// ==================== AUTH ROUTES ====================

// Login
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.contraseña);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const { contraseña, ...userWithoutPassword } = user;
    res.json({
      message: 'Login exitoso',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// ==================== USERS ROUTES ====================

// Get all users
app.get('/users', async (req, res) => {
  try {
    const [users] = await pool.execute('SELECT id, nombre, email, rol FROM users');
    res.json(users);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Create user
app.post('/users', async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.execute(
      'INSERT INTO users (nombre, email, contraseña, rol) VALUES (?, ?, ?, ?)',
      [nombre, email, hashedPassword, rol]
    );

    res.status(201).json({
      id: result.insertId,
      nombre,
      email,
      rol
    });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Update user
app.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, password, rol } = req.body;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await pool.execute(
        'UPDATE users SET nombre = ?, email = ?, contraseña = ?, rol = ? WHERE id = ?',
        [nombre, email, hashedPassword, rol, id]
      );
    } else {
      await pool.execute(
        'UPDATE users SET nombre = ?, email = ?, rol = ? WHERE id = ?',
        [nombre, email, rol, id]
      );
    }

    res.json({ message: 'Usuario actualizado' });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Delete user
app.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM users WHERE id = ?', [id]);
    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// ==================== COURSES ROUTES ====================

// Get all courses
app.get('/courses', async (req, res) => {
  try {
    const [courses] = await pool.execute(`
      SELECT c.*, u.nombre as docente_nombre 
      FROM courses c 
      LEFT JOIN users u ON c.docenteId = u.id
    `);
    
    const coursesWithDocente = courses.map(course => ({
      ...course,
      docente: course.docente_nombre ? { nombre: course.docente_nombre } : null
    }));
    
    res.json(coursesWithDocente);
  } catch (error) {
    console.error('Error al obtener cursos:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Get course by ID
app.get('/courses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [courses] = await pool.execute(`
      SELECT c.*, u.nombre as docente_nombre 
      FROM courses c 
      LEFT JOIN users u ON c.docenteId = u.id 
      WHERE c.id = ?
    `, [id]);

    if (courses.length === 0) {
      return res.status(404).json({ message: 'Curso no encontrado' });
    }

    const course = courses[0];
    res.json({
      ...course,
      docente: course.docente_nombre ? { nombre: course.docente_nombre } : null
    });
  } catch (error) {
    console.error('Error al obtener curso:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Create course
app.post('/courses', async (req, res) => {
  try {
    const { titulo, grado, seccion, docenteId } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO courses (titulo, grado, seccion, docenteId) VALUES (?, ?, ?, ?)',
      [titulo, grado, seccion, docenteId || null]
    );

    res.status(201).json({
      id: result.insertId,
      titulo,
      grado,
      seccion,
      docenteId
    });
  } catch (error) {
    console.error('Error al crear curso:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Update course
app.put('/courses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, grado, seccion, docenteId } = req.body;

    await pool.execute(
      'UPDATE courses SET titulo = ?, grado = ?, seccion = ?, docenteId = ? WHERE id = ?',
      [titulo, grado, seccion, docenteId || null, id]
    );

    res.json({ message: 'Curso actualizado' });
  } catch (error) {
    console.error('Error al actualizar curso:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Delete course
app.delete('/courses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM courses WHERE id = ?', [id]);
    res.json({ message: 'Curso eliminado' });
  } catch (error) {
    console.error('Error al eliminar curso:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// ==================== TASKS ROUTES ====================

app.get('/tasks', async (req, res) => {
  try {
    const { courseId } = req.query;
    let query = 'SELECT * FROM tasks';
    let params = [];

    if (courseId) {
      query += ' WHERE cursoId = ?';
      params.push(courseId);
    }

    const [tasks] = await pool.execute(query, params);
    res.json(tasks);
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// ==================== RESOURCES ROUTES ====================

app.get('/resources', async (req, res) => {
  try {
    const { courseId } = req.query;
    let query = 'SELECT * FROM resources';
    let params = [];

    if (courseId) {
      query += ' WHERE cursoId = ?';
      params.push(courseId);
    }

    const [resources] = await pool.execute(query, params);
    res.json(resources);
  } catch (error) {
    console.error('Error al obtener recursos:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// ==================== FORUMS ROUTES ====================

app.get('/forums', async (req, res) => {
  try {
    const { courseId } = req.query;
    let query = 'SELECT * FROM forums';
    let params = [];

    if (courseId) {
      query += ' WHERE cursoId = ?';
      params.push(courseId);
    }

    const [forums] = await pool.execute(query, params);
    res.json(forums);
  } catch (error) {
    console.error('Error al obtener foros:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

app.get('/forums/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [forums] = await pool.execute('SELECT * FROM forums WHERE id = ?', [id]);

    if (forums.length === 0) {
      return res.status(404).json({ message: 'Foro no encontrado' });
    }

    res.json(forums[0]);
  } catch (error) {
    console.error('Error al obtener foro:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// ==================== FORUM MESSAGES ROUTES ====================

app.get('/forum-messages', async (req, res) => {
  try {
    const { forumId } = req.query;
    const [messages] = await pool.execute(`
      SELECT m.*, u.nombre as usuario_nombre 
      FROM messages m 
      LEFT JOIN users u ON m.usuarioId = u.id 
      WHERE m.foroId = ?
      ORDER BY m.createdAt DESC
    `, [forumId]);

    const messagesWithUser = messages.map(msg => ({
      ...msg,
      usuario: msg.usuario_nombre ? { nombre: msg.usuario_nombre } : null
    }));

    res.json(messagesWithUser);
  } catch (error) {
    console.error('Error al obtener mensajes:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

app.post('/forum-messages', async (req, res) => {
  try {
    const { forumId, contenido, usuarioId } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO messages (foroId, contenido, usuarioId, createdAt) VALUES (?, ?, ?, NOW())',
      [forumId, contenido, usuarioId]
    );

    res.status(201).json({
      id: result.insertId,
      forumId,
      contenido,
      usuarioId
    });
  } catch (error) {
    console.error('Error al crear mensaje:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// ==================== START SERVER ====================

app.listen(PORT, () => {
  console.log('');
  console.log('🚀 ========================================');
  console.log('🚀  Servidor Express corriendo exitosamente');
  console.log('🚀 ========================================');
  console.log('');
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log('');
  console.log('📝 Endpoints disponibles:');
  console.log('   POST   /auth/login');
  console.log('   GET    /users');
  console.log('   POST   /users');
  console.log('   PUT    /users/:id');
  console.log('   DELETE /users/:id');
  console.log('   GET    /courses');
  console.log('   GET    /courses/:id');
  console.log('   POST   /courses');
  console.log('   PUT    /courses/:id');
  console.log('   DELETE /courses/:id');
  console.log('   GET    /tasks');
  console.log('   GET    /resources');
  console.log('   GET    /forums');
  console.log('   GET    /forums/:id');
  console.log('   GET    /forum-messages');
  console.log('   POST   /forum-messages');
  console.log('');
  console.log('✅ Listo para recibir peticiones!');
  console.log('');
});
