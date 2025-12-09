// Script completo para poblar la base de datos con datos de prueba
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function seedComplete() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'aula_virtual_nest',
  });

  console.log('🌱 Iniciando seed completo...\n');

  try {
    // 1. USUARIOS
    console.log('👥 Creando usuarios...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const usuarios = [
      { nombre: 'Admin Principal', email: 'admin@aula.com', contraseña: hashedPassword, rol: 'admin' },
      { nombre: 'Prof. Juan García', email: 'juan@aula.com', contraseña: hashedPassword, rol: 'profesor' },
      { nombre: 'Prof. María López', email: 'maria@aula.com', contraseña: hashedPassword, rol: 'profesor' },
      { nombre: 'Prof. Carlos Ruiz', email: 'carlos@aula.com', contraseña: hashedPassword, rol: 'profesor' },
      { nombre: 'Ana Martínez', email: 'ana@aula.com', contraseña: hashedPassword, rol: 'estudiante' },
      { nombre: 'Luis Fernández', email: 'luis@aula.com', contraseña: hashedPassword, rol: 'estudiante' },
      { nombre: 'Sofia Torres', email: 'sofia@aula.com', contraseña: hashedPassword, rol: 'estudiante' },
      { nombre: 'Diego Ramírez', email: 'diego@aula.com', contraseña: hashedPassword, rol: 'estudiante' },
      { nombre: 'Laura Sánchez', email: 'laura@aula.com', contraseña: hashedPassword, rol: 'estudiante' },
      { nombre: 'Pedro Morales', email: 'pedro@aula.com', contraseña: hashedPassword, rol: 'estudiante' },
      { nombre: 'Carmen Vega', email: 'carmen@aula.com', contraseña: hashedPassword, rol: 'estudiante' },
      { nombre: 'Roberto Castro', email: 'roberto@aula.com', contraseña: hashedPassword, rol: 'estudiante' },
    ];

    for (const user of usuarios) {
      await connection.execute(
        'INSERT INTO usuarios (nombre, email, contraseña, rol) VALUES (?, ?, ?, ?)',
        [user.nombre, user.email, user.contraseña, user.rol]
      );
    }
    console.log(`✅ ${usuarios.length} usuarios creados\n`);

    // 2. CURSOS
    console.log('📚 Creando cursos...');
    const cursos = [
      { nombre: 'Matemáticas Avanzadas', descripcion: 'Cálculo diferencial e integral, álgebra lineal y ecuaciones diferenciales', profesorId: 2, creditos: 4 },
      { nombre: 'Programación Web Full Stack', descripcion: 'Desarrollo web moderno con React, Node.js, Express y MongoDB', profesorId: 2, creditos: 5 },
      { nombre: 'Inteligencia Artificial', descripcion: 'Machine Learning, Deep Learning y aplicaciones prácticas de IA', profesorId: 3, creditos: 4 },
      { nombre: 'Base de Datos Avanzadas', descripcion: 'SQL, NoSQL, optimización de consultas y diseño de bases de datos', profesorId: 3, creditos: 4 },
      { nombre: 'Desarrollo Móvil', descripcion: 'Creación de apps nativas con React Native y Flutter', profesorId: 4, creditos: 4 },
      { nombre: 'Ciberseguridad', descripcion: 'Seguridad informática, ethical hacking y protección de sistemas', profesorId: 4, creditos: 3 },
      { nombre: 'Cloud Computing', descripcion: 'AWS, Azure, Google Cloud y arquitecturas en la nube', profesorId: 2, creditos: 4 },
      { nombre: 'DevOps y CI/CD', descripcion: 'Docker, Kubernetes, Jenkins y automatización de despliegues', profesorId: 3, creditos: 3 },
      { nombre: 'Diseño UX/UI', descripcion: 'Principios de diseño, Figma, prototipado y experiencia de usuario', profesorId: 4, creditos: 3 },
      { nombre: 'Blockchain y Criptomonedas', descripcion: 'Tecnología blockchain, smart contracts y desarrollo de DApps', profesorId: 2, creditos: 4 },
    ];

    for (const curso of cursos) {
      await connection.execute(
        'INSERT INTO cursos (nombre, descripcion, profesorId, creditos) VALUES (?, ?, ?, ?)',
        [curso.nombre, curso.descripcion, curso.profesorId, curso.creditos]
      );
    }
    console.log(`✅ ${cursos.length} cursos creados\n`);

    // 3. INSCRIPCIONES (Estudiantes en cursos)
    console.log('📝 Inscribiendo estudiantes...');
    let inscripcionesCount = 0;
    for (let cursoId = 1; cursoId <= 10; cursoId++) {
      for (let estudianteId = 5; estudianteId <= 12; estudianteId++) {
        await connection.execute(
          'INSERT INTO inscripciones (estudianteId, cursoId) VALUES (?, ?)',
          [estudianteId, cursoId]
        );
        inscripcionesCount++;
      }
    }
    console.log(`✅ ${inscripcionesCount} inscripciones creadas\n`);

    // 4. TAREAS
    console.log('📋 Creando tareas...');
    const tareas = [
      // Matemáticas
      { titulo: 'Derivadas e Integrales', descripcion: 'Resolver los ejercicios del capítulo 5', cursoId: 1, fechaEntrega: '2025-01-20', puntajeMaximo: 20 },
      { titulo: 'Matrices y Determinantes', descripcion: 'Problemas de álgebra lineal', cursoId: 1, fechaEntrega: '2025-01-25', puntajeMaximo: 20 },
      { titulo: 'Ecuaciones Diferenciales', descripcion: 'Resolver ecuaciones de primer y segundo orden', cursoId: 1, fechaEntrega: '2025-02-01', puntajeMaximo: 20 },
      
      // Programación Web
      { titulo: 'Proyecto React - Todo App', descripcion: 'Crear una aplicación de tareas con React Hooks', cursoId: 2, fechaEntrega: '2025-01-22', puntajeMaximo: 20 },
      { titulo: 'API REST con Node.js', descripcion: 'Desarrollar una API RESTful con Express', cursoId: 2, fechaEntrega: '2025-01-28', puntajeMaximo: 20 },
      { titulo: 'Proyecto Final Full Stack', descripcion: 'Aplicación completa con frontend y backend', cursoId: 2, fechaEntrega: '2025-02-15', puntajeMaximo: 20 },
      
      // IA
      { titulo: 'Regresión Lineal', descripcion: 'Implementar algoritmo de regresión desde cero', cursoId: 3, fechaEntrega: '2025-01-23', puntajeMaximo: 20 },
      { titulo: 'Red Neuronal Simple', descripcion: 'Crear una red neuronal con TensorFlow', cursoId: 3, fechaEntrega: '2025-02-05', puntajeMaximo: 20 },
      
      // Base de Datos
      { titulo: 'Diseño de Base de Datos', descripcion: 'Modelar una base de datos para e-commerce', cursoId: 4, fechaEntrega: '2025-01-24', puntajeMaximo: 20 },
      { titulo: 'Optimización de Consultas', descripcion: 'Mejorar el rendimiento de queries SQL', cursoId: 4, fechaEntrega: '2025-02-02', puntajeMaximo: 20 },
      
      // Móvil
      { titulo: 'App de Clima', descripcion: 'Aplicación móvil que consume API del clima', cursoId: 5, fechaEntrega: '2025-01-26', puntajeMaximo: 20 },
      { titulo: 'App de Notas', descripcion: 'Aplicación con almacenamiento local', cursoId: 5, fechaEntrega: '2025-02-08', puntajeMaximo: 20 },
      
      // Ciberseguridad
      { titulo: 'Análisis de Vulnerabilidades', descripcion: 'Identificar vulnerabilidades en aplicación web', cursoId: 6, fechaEntrega: '2025-01-27', puntajeMaximo: 20 },
      { titulo: 'Implementar Autenticación Segura', descripcion: 'Sistema de login con JWT y bcrypt', cursoId: 6, fechaEntrega: '2025-02-10', puntajeMaximo: 20 },
    ];

    for (const tarea of tareas) {
      await connection.execute(
        'INSERT INTO tareas (titulo, descripcion, cursoId, fechaEntrega, puntajeMaximo) VALUES (?, ?, ?, ?, ?)',
        [tarea.titulo, tarea.descripcion, tarea.cursoId, tarea.fechaEntrega, tarea.puntajeMaximo]
      );
    }
    console.log(`✅ ${tareas.length} tareas creadas\n`);

    // 5. RECURSOS
    console.log('📁 Creando recursos...');
    const recursos = [
      { titulo: 'Libro: Cálculo de Stewart', tipo: 'pdf', url: 'https://example.com/calculo.pdf', cursoId: 1 },
      { titulo: 'Video: Derivadas Explicadas', tipo: 'video', url: 'https://youtube.com/watch?v=ejemplo', cursoId: 1 },
      { titulo: 'Guía de React Hooks', tipo: 'pdf', url: 'https://example.com/react-hooks.pdf', cursoId: 2 },
      { titulo: 'Tutorial: Node.js y Express', tipo: 'video', url: 'https://youtube.com/watch?v=ejemplo2', cursoId: 2 },
      { titulo: 'Dataset: Iris Flowers', tipo: 'archivo', url: 'https://example.com/iris.csv', cursoId: 3 },
      { titulo: 'Libro: Deep Learning', tipo: 'pdf', url: 'https://example.com/deep-learning.pdf', cursoId: 3 },
      { titulo: 'Cheat Sheet: SQL Commands', tipo: 'pdf', url: 'https://example.com/sql-cheatsheet.pdf', cursoId: 4 },
      { titulo: 'Tutorial: MongoDB', tipo: 'video', url: 'https://youtube.com/watch?v=ejemplo3', cursoId: 4 },
      { titulo: 'Guía: React Native', tipo: 'pdf', url: 'https://example.com/react-native.pdf', cursoId: 5 },
      { titulo: 'Documentación: Flutter', tipo: 'enlace', url: 'https://flutter.dev/docs', cursoId: 5 },
    ];

    for (const recurso of recursos) {
      await connection.execute(
        'INSERT INTO recursos (titulo, tipo, url, cursoId) VALUES (?, ?, ?, ?)',
        [recurso.titulo, recurso.tipo, recurso.url, recurso.cursoId]
      );
    }
    console.log(`✅ ${recursos.length} recursos creados\n`);

    // 6. FOROS
    console.log('💬 Creando foros...');
    const foros = [
      { titulo: 'Dudas sobre Derivadas', descripcion: 'Espacio para consultas del tema', cursoId: 1, creadorId: 2 },
      { titulo: 'Proyecto Final - Consultas', descripcion: 'Preguntas sobre el proyecto', cursoId: 2, creadorId: 2 },
      { titulo: 'Recursos de IA', descripcion: 'Compartir recursos útiles', cursoId: 3, creadorId: 3 },
      { titulo: 'Errores Comunes en SQL', descripcion: 'Discusión de errores frecuentes', cursoId: 4, creadorId: 3 },
    ];

    for (const foro of foros) {
      await connection.execute(
        'INSERT INTO foros (titulo, descripcion, cursoId, creadorId) VALUES (?, ?, ?, ?)',
        [foro.titulo, foro.descripcion, foro.cursoId, foro.creadorId]
      );
    }
    console.log(`✅ ${foros.length} foros creados\n`);

    // 7. MENSAJES EN FOROS
    console.log('💭 Creando mensajes en foros...');
    const mensajes = [
      { contenido: '¿Alguien puede explicar la regla de la cadena?', foroId: 1, autorId: 5 },
      { contenido: 'La regla de la cadena se usa cuando tienes funciones compuestas...', foroId: 1, autorId: 2 },
      { contenido: '¿Qué tecnologías recomiendas para el backend?', foroId: 2, autorId: 6 },
      { contenido: 'Node.js con Express es una excelente opción', foroId: 2, autorId: 2 },
      { contenido: 'Encontré este dataset interesante para practicar', foroId: 3, autorId: 7 },
    ];

    for (const mensaje of mensajes) {
      await connection.execute(
        'INSERT INTO mensajes_foro (contenido, foroId, autorId) VALUES (?, ?, ?)',
        [mensaje.contenido, mensaje.foroId, mensaje.autorId]
      );
    }
    console.log(`✅ ${mensajes.length} mensajes creados\n`);

    console.log('✨ Seed completo exitoso!\n');
    console.log('📊 Resumen:');
    console.log(`   - ${usuarios.length} usuarios (1 admin, 3 profesores, 8 estudiantes)`);
    console.log(`   - ${cursos.length} cursos`);
    console.log(`   - ${inscripcionesCount} inscripciones`);
    console.log(`   - ${tareas.length} tareas`);
    console.log(`   - ${recursos.length} recursos`);
    console.log(`   - ${foros.length} foros`);
    console.log(`   - ${mensajes.length} mensajes\n`);
    
    console.log('🔑 Credenciales de acceso:');
    console.log('   Admin: admin@aula.com / admin123');
    console.log('   Profesor: juan@aula.com / admin123');
    console.log('   Estudiante: ana@aula.com / admin123');

  } catch (error) {
    console.error('❌ Error en seed:', error);
  } finally {
    await connection.end();
  }
}

seedComplete();
