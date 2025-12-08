// Script para poblar los nuevos módulos con datos de ejemplo
const mysql = require('mysql2/promise');

async function seedNewModules() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'aula_virtual_nest',
  });

  console.log('🌱 Iniciando seed de nuevos módulos...');

  try {
    // 1. Badges/Insignias
    console.log('📛 Creando insignias...');
    const badges = [
      { nombre: 'Primera Tarea', descripcion: 'Completó su primera tarea', icono: '🎯', color: '#10b981', nivel: 'bronce', criterio: 'Entregar primera tarea' },
      { nombre: 'Asistencia Perfecta', descripcion: '100% de asistencia en un mes', icono: '⭐', color: '#f59e0b', nivel: 'oro', criterio: 'Asistir a todas las clases' },
      { nombre: 'Participación Activa', descripcion: 'Más de 50 mensajes en foros', icono: '💬', color: '#3b82f6', nivel: 'plata', criterio: 'Participar en foros' },
      { nombre: 'Examen Perfecto', descripcion: 'Obtuvo 20/20 en un examen', icono: '🏆', color: '#8b5cf6', nivel: 'oro', criterio: 'Sacar nota perfecta' },
      { nombre: 'Estudiante del Mes', descripcion: 'Mejor promedio del mes', icono: '👑', color: '#ec4899', nivel: 'platino', criterio: 'Mejor promedio' },
    ];

    for (const badge of badges) {
      await connection.execute(
        'INSERT INTO insignias (nombre, descripcion, icono, color, nivel, criterio) VALUES (?, ?, ?, ?, ?, ?)',
        [badge.nombre, badge.descripcion, badge.icono, badge.color, badge.nivel, badge.criterio]
      );
    }
    console.log(`✅ ${badges.length} insignias creadas`);

    // 2. Anuncios
    console.log('📢 Creando anuncios...');
    const announcements = [
      { titulo: 'Bienvenidos al Aula Virtual', contenido: 'Les damos la bienvenida a nuestra plataforma educativa. Aquí encontrarán todos los recursos necesarios para su aprendizaje.', autorId: 1, cursoId: null, prioridad: 'importante' },
      { titulo: 'Examen Final - Matemáticas', contenido: 'El examen final de Matemáticas será el próximo viernes. Repasen los temas 1-10.', autorId: 1, cursoId: 1, prioridad: 'urgente' },
      { titulo: 'Nueva Tarea Disponible', contenido: 'Se ha publicado una nueva tarea en el curso de Programación. Fecha límite: 15 de enero.', autorId: 1, cursoId: 2, prioridad: 'normal' },
      { titulo: 'Mantenimiento Programado', contenido: 'La plataforma estará en mantenimiento el domingo de 2am a 6am.', autorId: 1, cursoId: null, prioridad: 'info' },
    ];

    for (const announcement of announcements) {
      await connection.execute(
        'INSERT INTO anuncios (titulo, contenido, autorId, cursoId, prioridad, activo) VALUES (?, ?, ?, ?, ?, ?)',
        [announcement.titulo, announcement.contenido, announcement.autorId, announcement.cursoId, announcement.prioridad, true]
      );
    }
    console.log(`✅ ${announcements.length} anuncios creados`);

    // 3. Grupos
    console.log('👥 Creando grupos...');
    const groups = [
      { nombre: 'Grupo A - Matemáticas', descripcion: 'Grupo de estudio para el proyecto final', cursoId: 1, creadorId: 1, maxIntegrantes: 5 },
      { nombre: 'Equipo Backend', descripcion: 'Desarrollo del backend del proyecto', cursoId: 2, creadorId: 1, maxIntegrantes: 4 },
      { nombre: 'Grupo de Investigación', descripcion: 'Investigación sobre IA', cursoId: 3, creadorId: 1, maxIntegrantes: 6 },
    ];

    for (const group of groups) {
      await connection.execute(
        'INSERT INTO grupos (nombre, descripcion, cursoId, creadorId, maxIntegrantes) VALUES (?, ?, ?, ?, ?)',
        [group.nombre, group.descripcion, group.cursoId, group.creadorId, group.maxIntegrantes]
      );
    }
    console.log(`✅ ${groups.length} grupos creados`);

    // 4. Asistencias (ejemplo para el primer curso)
    console.log('📅 Creando registros de asistencia...');
    const today = new Date();
    const dates = [];
    for (let i = 0; i < 10; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }

    let attendanceCount = 0;
    for (const date of dates) {
      // Asistencia para estudiantes 2-6 en curso 1
      for (let estudianteId = 2; estudianteId <= 6; estudianteId++) {
        const estados = ['presente', 'presente', 'presente', 'ausente', 'tardanza'];
        const estado = estados[Math.floor(Math.random() * estados.length)];
        
        await connection.execute(
          'INSERT INTO asistencias (estudianteId, cursoId, fecha, estado) VALUES (?, ?, ?, ?)',
          [estudianteId, 1, date, estado]
        );
        attendanceCount++;
      }
    }
    console.log(`✅ ${attendanceCount} registros de asistencia creados`);

    console.log('✨ Seed completado exitosamente!');
    console.log('\n📊 Resumen:');
    console.log(`   - ${badges.length} insignias`);
    console.log(`   - ${announcements.length} anuncios`);
    console.log(`   - ${groups.length} grupos`);
    console.log(`   - ${attendanceCount} asistencias`);

  } catch (error) {
    console.error('❌ Error en seed:', error);
  } finally {
    await connection.end();
  }
}

seedNewModules();
