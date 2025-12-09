# 🚂 Setup de Railway - Aula Virtual Backend

## Variables de Entorno Requeridas

Configura estas variables en Railway → Settings → Variables:

### Base de Datos MySQL
```
DB_HOST=<tu-mysql-host>.railway.app
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=<tu-mysql-password>
DB_DATABASE=railway
```

### Aplicación
```
NODE_ENV=production
JWT_SECRET=aula-virtual-secret-key-2024
```

**NOTA**: Railway asigna automáticamente la variable `PORT`, no la configures manualmente.

---

## Configuración de Build y Deploy

Railway debería detectar automáticamente el proyecto Node.js, pero si necesitas configurarlo manualmente:

### Build Command
```bash
npm install && npm run build
```

### Start Command
```bash
npm start
```

---

## Verificar Deployment

### 1. Revisar Logs
- Ve a Railway → Deployments → Logs
- Busca el mensaje: `✅ Servidor corriendo en puerto XXXX`

### 2. Probar Health Check
```bash
curl https://tu-app.up.railway.app/
```

Debería responder: `Aula Virtual API is running`

### 3. Probar Login
```bash
curl -X POST https://tu-app.up.railway.app/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@aula.com","contraseña":"admin123"}'
```

---

## Troubleshooting

### Error 502: Application failed to respond

**Causas comunes**:
1. Variables de entorno faltantes
2. Error de conexión a MySQL
3. Build fallido

**Solución**:
1. Verifica que todas las variables estén configuradas
2. Revisa los logs de deployment
3. Asegúrate de que MySQL esté corriendo

### Build Fails

**Solución**:
```bash
# Localmente, verifica que el build funcione
npm install
npm run build
npm start
```

### Cannot connect to MySQL

**Solución**:
1. Verifica que el servicio MySQL esté corriendo en Railway
2. Verifica las credenciales en las variables de entorno
3. Asegúrate de usar el host correcto (no localhost)

---

## Scripts Útiles

### Health Check Local
```bash
npm run healthcheck
```

### Build Local
```bash
npm run build
```

### Start Local
```bash
npm start
```

### Development
```bash
npm run start:dev
```
