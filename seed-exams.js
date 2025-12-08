const mysql = require('mysql2/promise');

async function seedExams() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'aula_virtual_nest'
  });

  console.log('Conectado a MySQL');

  // Obtener cursos existentes
  const [courses] = await connection.execute('SELECT id, titulo as nombre FROM courses');
  console.log(`Encontrados ${courses.length} cursos`);

  // Obtener docentes
  const [docentes] = await connection.execute("SELECT id FROM users WHERE rol = 'docente' LIMIT 1");
  const docenteId = docentes[0]?.id || 1;

  for (const course of courses) {
    console.log(`\nCreando exámenes para: ${course.nombre}`);

    // Crear 2 exámenes por curso
    const exams = [
      {
        titulo: `Examen Parcial - ${course.nombre}`,
        descripcion: `Evaluación parcial del curso ${course.nombre}. Incluye los temas vistos en las primeras semanas.`,
        tiempoLimite: 45,
        intentosPermitidos: 2,
      },
      {
        titulo: `Examen Final - ${course.nombre}`,
        descripcion: `Evaluación final del curso ${course.nombre}. Cubre todos los temas del curso.`,
        tiempoLimite: 90,
        intentosPermitidos: 1,
      }
    ];

    for (const exam of exams) {
      // Insertar examen
      const [result] = await connection.execute(
        `INSERT INTO exams (titulo, descripcion, cursoId, docenteId, tiempoLimite, intentosPermitidos, mostrarResultados, activo, createdAt) 
         VALUES (?, ?, ?, ?, ?, ?, 1, 1, NOW())`,
        [exam.titulo, exam.descripcion, course.id, docenteId, exam.tiempoLimite, exam.intentosPermitidos]
      );
      
      const examId = result.insertId;
      console.log(`  - Creado: ${exam.titulo} (ID: ${examId})`);

      // Crear preguntas para el examen
      const questions = [
        {
          pregunta: `¿Cuál es el objetivo principal del curso ${course.nombre}?`,
          tipo: 'multiple',
          opciones: JSON.stringify(['Aprender conceptos básicos', 'Desarrollar habilidades prácticas', 'Ambas anteriores', 'Ninguna de las anteriores']),
          respuestaCorrecta: 'Ambas anteriores',
          puntos: 10
        },
        {
          pregunta: 'El aprendizaje continuo es fundamental para el éxito profesional.',
          tipo: 'true_false',
          opciones: null,
          respuestaCorrecta: 'Verdadero',
          puntos: 5
        },
        {
          pregunta: `¿Qué metodología se utiliza principalmente en ${course.nombre}?`,
          tipo: 'multiple',
          opciones: JSON.stringify(['Teórica', 'Práctica', 'Mixta', 'Autodidacta']),
          respuestaCorrecta: 'Mixta',
          puntos: 10
        },
        {
          pregunta: 'La evaluación formativa ayuda a mejorar el proceso de aprendizaje.',
          tipo: 'true_false',
          opciones: null,
          respuestaCorrecta: 'Verdadero',
          puntos: 5
        },
        {
          pregunta: `Menciona un concepto clave del curso ${course.nombre}.`,
          tipo: 'short_answer',
          opciones: null,
          respuestaCorrecta: 'aprendizaje',
          puntos: 10
        }
      ];

      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        await connection.execute(
          `INSERT INTO exam_questions (examId, pregunta, tipo, opciones, respuestaCorrecta, puntos, orden) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [examId, q.pregunta, q.tipo, q.opciones, q.respuestaCorrecta, q.puntos, i]
        );
      }
      console.log(`    + ${questions.length} preguntas agregadas`);
    }
  }

  await connection.end();
  console.log('\n✅ Exámenes de prueba creados exitosamente');
}

seedExams().catch(console.error);
