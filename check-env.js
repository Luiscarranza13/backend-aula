// Script para verificar variables de entorno en Railway
console.log('🔍 Verificando variables de entorno...\n');

const envVars = [
  'NODE_ENV',
  'PORT',
  'MYSQLHOST',
  'MYSQLPORT',
  'MYSQLUSER',
  'MYSQLPASSWORD',
  'MYSQLDATABASE',
  'DB_HOST',
  'DB_PORT',
  'DB_USERNAME',
  'DB_PASSWORD',
  'DB_DATABASE',
  'JWT_SECRET',
];

envVars.forEach((varName) => {
  const value = process.env[varName];
  if (value) {
    const displayValue = varName.includes('PASSWORD') || varName.includes('SECRET') 
      ? '***' 
      : value;
    console.log(`✅ ${varName}: ${displayValue}`);
  } else {
    console.log(`❌ ${varName}: NO DEFINIDA`);
  }
});

console.log('\n📊 Total variables definidas:', envVars.filter(v => process.env[v]).length);
console.log('📊 Total variables faltantes:', envVars.filter(v => !process.env[v]).length);
