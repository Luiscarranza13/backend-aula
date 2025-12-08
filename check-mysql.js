const mysql = require('mysql2/promise');

async function checkMySQL() {
  console.log('🔍 Verificando conexión a MySQL...\n');
  
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '',
    });

    console.log('✅ Conexión a MySQL exitosa!');
    
    // Verificar si la base de datos existe
    const [databases] = await connection.query('SHOW DATABASES');
    const dbExists = databases.some(db => db.Database === 'aula_virtual_nest');
    
    if (dbExists) {
      console.log('✅ Base de datos "aula_virtual_nest" encontrada');
    } else {
      console.log('⚠️  Base de datos "aula_virtual_nest" no existe');
      console.log('📝 Creando base de datos...');
      await connection.query('CREATE DATABASE aula_virtual_nest');
      console.log('✅ Base de datos creada exitosamente');
    }
    
    await connection.end();
    console.log('\n✨ Todo listo! Puedes ejecutar: npm run start:dev');
    
  } catch (error) {
    console.error('❌ Error al conectar con MySQL:');
    console.error(error.message);
    console.log('\n📋 Verifica que:');
    console.log('  1. Laragon esté iniciado');
    console.log('  2. MySQL esté corriendo en el puerto 3306');
    console.log('  3. El usuario root no tenga contraseña');
    process.exit(1);
  }
}

checkMySQL();
