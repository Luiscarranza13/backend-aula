const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Configuración - REEMPLAZA CON TUS CREDENCIALES DE RAILWAY
const config = {
  host: process.env.RAILWAY_MYSQL_HOST || 'containers-us-west-xxx.railway.app',
  port: parseInt(process.env.RAILWAY_MYSQL_PORT || '6543'),
  user: process.env.RAILWAY_MYSQL_USER || 'root',
  password: process.env.RAILWAY_MYSQL_PASSWORD || 'tu_password_aqui',
  database: process.env.RAILWAY_MYSQL_DATABASE || 'railway',
  multipleStatements: true,
  connectTimeout: 60000,
};

async function importSQL() {
  console.log('🔄 Conectando a Railway MySQL...');
  console.log(`📍 Host: ${config.host}:${config.port}`);
  
  let connection;
  
  try {
    // Conectar a MySQL
    connection = await mysql.createConnection(config);
    console.log('✅ Conectado a Railway MySQL');

    // Leer el archivo SQL
    const sqlFile = path.join(__dirname, '..', 'aula_virtual_nest.sql');
    
    if (!fs.existsSync(sqlFile)) {
      console.error('❌ No se encontró el archivo SQL en:', sqlFile);
      console.log('💡 Asegúrate de que el archivo aula_virtual_nest.sql esté en la raíz del proyecto');
      process.exit(1);
    }

    console.log('📖 Leyendo archivo SQL...');
    const sql = fs.readFileSync(sqlFile, 'utf8');
    
    console.log('📦 Importando base de datos...');
    console.log('⏳ Esto puede tomar unos minutos...');
    
    // Ejecutar el SQL
    await connection.query(sql);
    
    console.log('✅ Base de datos importada exitosamente!');
    
    // Verificar tablas
    const [tables] = await connection.query('SHOW TABLES');
    console.log(`\n📊 Tablas creadas (${tables.length}):`);
    tables.forEach(table => {
      const tableName = Object.values(table)[0];
      console.log(`   - ${tableName}`);
    });
    
    // Verificar usuarios
    const [users] = await connection.query('SELECT COUNT(*) as count FROM usuarios');
    console.log(`\n👥 Usuarios en la base de datos: ${users[0].count}`);
    
    console.log('\n🎉 ¡Importación completada con éxito!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Verifica que:');
      console.log('   1. MySQL esté creado en Railway');
      console.log('   2. Las credenciales sean correctas');
      console.log('   3. El host y puerto sean correctos');
    }
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Conexión cerrada');
    }
  }
}

// Ejecutar
importSQL();
