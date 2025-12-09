// Health check script para Railway
const mysql = require('mysql2/promise');

async function checkHealth() {
  console.log('🔍 Verificando salud del sistema...\n');

  // 1. Verificar variables de entorno
  console.log('1️⃣ Variables de entorno:');
  const requiredEnvVars = ['DB_HOST', 'DB_PORT', 'DB_USERNAME', 'DB_PASSWORD', 'DB_DATABASE'];
  let allEnvVarsPresent = true;

  requiredEnvVars.forEach((varName) => {
    const value = process.env[varName];
    if (value) {
      console.log(`   ✅ ${varName}: ${varName.includes('PASSWORD') ? '***' : value}`);
    } else {
      console.log(`   ❌ ${varName}: NO DEFINIDA`);
      allEnvVarsPresent = false;
    }
  });

  if (!allEnvVarsPresent) {
    console.error('\n❌ Faltan variables de entorno requeridas');
    process.exit(1);
  }

  // 2. Verificar conexión a MySQL
  console.log('\n2️⃣ Conexión a MySQL:');
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      connectTimeout: 10000,
    });

    console.log('   ✅ Conexión exitosa');

    // Verificar que la base de datos existe
    const [rows] = await connection.execute('SELECT DATABASE() as db');
    console.log(`   ✅ Base de datos: ${rows[0].db}`);

    await connection.end();
  } catch (error) {
    console.error('   ❌ Error de conexión:', error.message);
    process.exit(1);
  }

  // 3. Verificar que el build existe
  console.log('\n3️⃣ Build:');
  const fs = require('fs');
  const path = require('path');
  const distPath = path.join(__dirname, 'dist', 'main.js');

  if (fs.existsSync(distPath)) {
    console.log('   ✅ dist/main.js existe');
  } else {
    console.error('   ❌ dist/main.js NO existe - ejecuta npm run build');
    process.exit(1);
  }

  console.log('\n✅ Todos los checks pasaron - Sistema listo para iniciar\n');
}

checkHealth().catch((error) => {
  console.error('❌ Error en health check:', error);
  process.exit(1);
});
