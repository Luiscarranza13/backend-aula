const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');

async function createAdmin() {
  try {
    // Conectar a la base de datos
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'aula_virtual_nest'
    });

    console.log('✅ Conectado a la base de datos');

    // Hashear la contraseña
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar usuario admin
    const [result] = await connection.execute(
      'INSERT INTO users (nombre, email, contraseña, rol) VALUES (?, ?, ?, ?)',
      ['Administrador', 'admin@test.com', hashedPassword, 'admin']
    );

    console.log('✅ Usuario administrador creado exitosamente');
    console.log('📧 Email: admin@test.com');
    console.log('🔑 Password: admin123');

    // Insertar un docente de ejemplo
    const docentePassword = await bcrypt.hash('docente123', 10);
    await connection.execute(
      'INSERT INTO users (nombre, email, contraseña, rol) VALUES (?, ?, ?, ?)',
      ['Juan Pérez', 'docente@test.com', docentePassword, 'docente']
    );

    console.log('✅ Usuario docente creado');
    console.log('📧 Email: docente@test.com');
    console.log('🔑 Password: docente123');

    // Insertar un estudiante de ejemplo
    const estudiantePassword = await bcrypt.hash('estudiante123', 10);
    await connection.execute(
      'INSERT INTO users (nombre, email, contraseña, rol) VALUES (?, ?, ?, ?)',
      ['María García', 'estudiante@test.com', estudiantePassword, 'estudiante']
    );

    console.log('✅ Usuario estudiante creado');
    console.log('📧 Email: estudiante@test.com');
    console.log('🔑 Password: estudiante123');

    await connection.end();
    console.log('\n🎉 ¡Todos los usuarios creados exitosamente!');
    console.log('\n📝 Puedes iniciar sesión con cualquiera de estos usuarios:');
    console.log('   Admin: admin@test.com / admin123');
    console.log('   Docente: docente@test.com / docente123');
    console.log('   Estudiante: estudiante@test.com / estudiante123');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAdmin();
