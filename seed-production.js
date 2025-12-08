// Script para ejecutar seeds en producción usando Railway CLI
const { execSync } = require('child_process');

console.log('🌱 Ejecutando seeds en producción...');

try {
  // Ejecutar seed de datos
  console.log('📦 Ejecutando seed-data.js...');
  execSync('railway run node seed-data.js', { stdio: 'inherit' });
  
  console.log('📝 Ejecutando seed-exams.js...');
  execSync('railway run node seed-exams.js', { stdio: 'inherit' });
  
  console.log('✅ Seeds ejecutados exitosamente!');
} catch (error) {
  console.error('❌ Error ejecutando seeds:', error.message);
  process.exit(1);
}
