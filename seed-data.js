const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function seedData() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'aula_virtual_nest'
    });

    console.log('✅ Conectado a la base de datos\n');
    console.log('🔄 Creando datos de prueba...\n');

    // ============ USUARIOS ============
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const usuarios = [
      { nombre: 'Administrador Sistema', email: 'admin@test.com', rol: 'admin' },
      { nombre: 'Prof. María García', email: 'docente@test.com', rol: 'docente' },
      { nombre: 'Prof. Carlos López', email: 'carlos.lopez@test.com', rol: 'docente' },
      { nombre: 'Prof. Ana Martínez', email: 'ana.martinez@test.com', rol: 'docente' },
      { nombre: 'Juan Pérez', email: 'estudiante@test.com', rol: 'estudiante' },
      { nombre: 'María Rodríguez', email: 'maria.rodriguez@test.com', rol: 'estudiante' },
      { nombre: 'Pedro Sánchez', email: 'pedro.sanchez@test.com', rol: 'estudiante' },
      { nombre: 'Laura Torres', email: 'laura.torres@test.com', rol: 'estudiante' },
      { nombre: 'Diego Ramírez', email: 'diego.ramirez@test.com', rol: 'estudiante' },
    ];

    for (const user of usuarios) {
      try {
        await connection.execute(
          'INSERT INTO users (nombre, email, contraseña, rol) VALUES (?, ?, ?, ?)',
          [user.nombre, user.email, hashedPassword, user.rol]
        );
        console.log(`✅ Usuario: ${user.nombre} (${user.rol})`);
      } catch (err) {
        if (err.code !== 'ER_DUP_ENTRY') console.log(`⚠️  ${user.email}: ${err.message}`);
      }
    }

    // Obtener IDs de docentes
    const [docentes] = await connection.execute('SELECT id, nombre FROM users WHERE rol = "docente"');
    const [estudiantes] = await connection.execute('SELECT id FROM users WHERE rol = "estudiante" LIMIT 5');

    // ============ CURSOS ============
    const cursos = [
      { titulo: 'Matemáticas Avanzadas', descripcion: 'Curso de matemáticas para nivel avanzado. Incluye álgebra, geometría y cálculo básico.', grado: '5to', seccion: 'A' },
      { titulo: 'Historia Universal', descripcion: 'Recorrido por los principales eventos históricos de la humanidad.', grado: '4to', seccion: 'B' },
      { titulo: 'Ciencias Naturales', descripcion: 'Exploración del mundo natural: biología, química y física básica.', grado: '3ro', seccion: 'A' },
      { titulo: 'Literatura Española', descripcion: 'Análisis de las obras más importantes de la literatura en español.', grado: '5to', seccion: 'C' },
      { titulo: 'Física Fundamental', descripcion: 'Principios básicos de la física: mecánica, termodinámica y ondas.', grado: '6to', seccion: 'A' },
      { titulo: 'Química Orgánica', descripcion: 'Estudio de los compuestos del carbono y sus reacciones.', grado: '5to', seccion: 'B' },
      { titulo: 'Inglés Intermedio', descripcion: 'Desarrollo de habilidades de comunicación en inglés nivel B1.', grado: '4to', seccion: 'A' },
      { titulo: 'Programación Básica', descripcion: 'Introducción a la programación con Python y JavaScript.', grado: '6to', seccion: 'B' },
    ];

    const cursosCreados = [];
    for (let i = 0; i < cursos.length; i++) {
      const curso = cursos[i];
      const docente = docentes[i % docentes.length];
      try {
        const [result] = await connection.execute(
          'INSERT INTO courses (titulo, descripcion, grado, seccion, docenteId) VALUES (?, ?, ?, ?, ?)',
          [curso.titulo, curso.descripcion, curso.grado, curso.seccion, docente?.id || null]
        );
        cursosCreados.push({ id: result.insertId, titulo: curso.titulo });
        console.log(`✅ Curso: ${curso.titulo} (${curso.grado}-${curso.seccion})`);
      } catch (err) {
        if (err.code !== 'ER_DUP_ENTRY') console.log(`⚠️  ${curso.titulo}: ${err.message}`);
      }
    }

    // ============ TAREAS ============
    console.log('\n📝 Creando tareas...');
    const tareasTemplate = [
      { titulo: 'Investigación del tema', descripcion: 'Realizar una investigación detallada sobre el tema asignado. Mínimo 3 páginas.', dias: 7 },
      { titulo: 'Ejercicios prácticos', descripcion: 'Completar los ejercicios del capítulo correspondiente.', dias: 5 },
      { titulo: 'Proyecto grupal', descripcion: 'Desarrollar un proyecto en equipo de 3-4 personas.', dias: 14 },
      { titulo: 'Examen parcial', descripcion: 'Evaluación de los temas vistos hasta la fecha.', dias: 10 },
      { titulo: 'Presentación oral', descripcion: 'Preparar y exponer un tema de 10 minutos.', dias: 12 },
    ];

    for (const curso of cursosCreados) {
      for (const tarea of tareasTemplate) {
        const fechaEntrega = new Date(Date.now() + tarea.dias * 24 * 60 * 60 * 1000);
        const estado = Math.random() > 0.7 ? 'completada' : 'pendiente';
        try {
          await connection.execute(
            'INSERT INTO tasks (titulo, descripcion, fecha_entrega, estado, cursoId) VALUES (?, ?, ?, ?, ?)',
            [`${tarea.titulo} - ${curso.titulo.split(' ')[0]}`, tarea.descripcion, fechaEntrega, estado, curso.id]
          );
        } catch (err) {}
      }
      console.log(`   ✅ 5 tareas para: ${curso.titulo}`);
    }

    // ============ RECURSOS ============
    console.log('\n📚 Creando recursos...');
    const recursosTemplate = [
      { nombre: 'Guía de estudio.pdf', tipo: 'documento', url: 'https://example.com/guia.pdf' },
      { nombre: 'Presentación Clase 1.pptx', tipo: 'presentacion', url: 'https://example.com/clase1.pptx' },
      { nombre: 'Video explicativo', tipo: 'video', url: 'https://youtube.com/watch?v=example' },
      { nombre: 'Ejercicios resueltos.pdf', tipo: 'documento', url: 'https://example.com/ejercicios.pdf' },
      { nombre: 'Material complementario.zip', tipo: 'otro', url: 'https://example.com/material.zip' },
    ];

    for (const curso of cursosCreados) {
      for (const recurso of recursosTemplate) {
        try {
          await connection.execute(
            'INSERT INTO resources (nombre_archivo, tipo_recurso, url, cursoId) VALUES (?, ?, ?, ?)',
            [`${recurso.nombre.split('.')[0]} - ${curso.titulo.split(' ')[0]}.${recurso.nombre.split('.')[1] || 'pdf'}`, recurso.tipo, recurso.url, curso.id]
          );
        } catch (err) {}
      }
      console.log(`   ✅ 5 recursos para: ${curso.titulo}`);
    }

    // ============ FOROS ============
    console.log('\n💬 Creando foros...');
    const forosTemplate = [
      { titulo: 'Dudas generales', descripcion: 'Espacio para resolver dudas sobre el curso.' },
      { titulo: 'Discusión del tema principal', descripcion: 'Debate y análisis del contenido principal.' },
      { titulo: 'Ayuda con tareas', descripcion: 'Colaboración entre estudiantes para las tareas.' },
    ];

    for (const curso of cursosCreados) {
      for (const foro of forosTemplate) {
        try {
          const [result] = await connection.execute(
            'INSERT INTO forums (titulo, descripcion, cursoId) VALUES (?, ?, ?)',
            [`${foro.titulo} - ${curso.titulo.split(' ')[0]}`, foro.descripcion, curso.id]
          );
          
          // Crear mensajes de ejemplo
          if (estudiantes.length > 0) {
            const mensajes = [
              '¡Hola a todos! Espero que este curso sea muy interesante.',
              '¿Alguien puede explicar el tema de la última clase?',
              'Gracias por la información, me fue muy útil.',
              'Tengo una duda sobre el ejercicio 3.',
            ];
            for (let i = 0; i < Math.min(mensajes.length, estudiantes.length); i++) {
              await connection.execute(
                'INSERT INTO messages (contenido, foroId, usuarioId, createdAt) VALUES (?, ?, ?, NOW())',
                [mensajes[i], result.insertId, estudiantes[i].id]
              );
            }
          }
        } catch (err) {}
      }
      console.log(`   ✅ 3 foros para: ${curso.titulo}`);
    }

    // ============ RESUMEN ============
    const [countUsers] = await connection.execute('SELECT COUNT(*) as total FROM users');
    const [countCourses] = await connection.execute('SELECT COUNT(*) as total FROM courses');
    const [countTasks] = await connection.execute('SELECT COUNT(*) as total FROM tasks');
    const [countResources] = await connection.execute('SELECT COUNT(*) as total FROM resources');
    const [countForums] = await connection.execute('SELECT COUNT(*) as total FROM forums');
    const [countMessages] = await connection.execute('SELECT COUNT(*) as total FROM messages');

    console.log('\n' + '='.repeat(50));
    console.log('🎉 ¡DATOS DE PRUEBA CREADOS EXITOSAMENTE!');
    console.log('='.repeat(50));
    console.log(`\n📊 RESUMEN:`);
    console.log(`   👥 Usuarios:  ${countUsers[0].total}`);
    console.log(`   📚 Cursos:    ${countCourses[0].total}`);
    console.log(`   📝 Tareas:    ${countTasks[0].total}`);
    console.log(`   📁 Recursos:  ${countResources[0].total}`);
    console.log(`   💬 Foros:     ${countForums[0].total}`);
    console.log(`   ✉️  Mensajes:  ${countMessages[0].total}`);
    console.log('\n🔐 CREDENCIALES DE PRUEBA:');
    console.log('   Admin:      admin@test.com / admin123');
    console.log('   Docente:    docente@test.com / admin123');
    console.log('   Estudiante: estudiante@test.com / admin123');
    console.log('\n✨ ¡Sistema listo para usar!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

seedData();
