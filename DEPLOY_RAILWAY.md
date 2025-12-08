# Guía de Despliegue en Railway

## Requisitos Previos

1. Cuenta en [Railway](https://railway.app)
2. Repositorio en GitHub con el código del backend

## Pasos para Desplegar

### 1. Crear Proyecto en Railway

1. Ve a [Railway](https://railway.app) e inicia sesión
2. Click en "New Project"
3. Selecciona "Deploy from GitHub repo"
4. Conecta tu repositorio

### 2. Agregar Base de Datos MySQL

1. En tu proyecto de Railway, click en "New"
2. Selecciona "Database" > "MySQL"
3. Railway creará automáticamente la base de datos

### 3. Configurar Variables de Entorno

En Railway, ve a tu servicio del backend y configura estas variables:

```
DB_HOST=${{MySQL.MYSQLHOST}}
DB_PORT=${{MySQL.MYSQLPORT}}
DB_USERNAME=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
DB_DATABASE=${{MySQL.MYSQLDATABASE}}
NODE_ENV=production
```

O si prefieres valores directos (los obtienes de la pestaña "Variables" de MySQL):

```
DB_HOST=containers-us-west-xxx.railway.app
DB_PORT=6543
DB_USERNAME=root
DB_PASSWORD=tu_password_generado
DB_DATABASE=railway
NODE_ENV=production
```

### 4. Configurar el Servicio

Railway detectará automáticamente que es un proyecto Node.js y usará:
- Build Command: `npm install && npm run build`
- Start Command: `npm run start`

### 5. Desplegar

Railway desplegará automáticamente cuando hagas push a tu repositorio.

## Variables de Entorno Necesarias

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| DB_HOST | Host de MySQL | containers-us-west-xxx.railway.app |
| DB_PORT | Puerto de MySQL | 6543 |
| DB_USERNAME | Usuario de MySQL | root |
| DB_PASSWORD | Contraseña de MySQL | (generada por Railway) |
| DB_DATABASE | Nombre de la BD | railway |
| NODE_ENV | Entorno | production |
| PORT | Puerto (automático) | (Railway lo asigna) |

## Después del Despliegue

### Obtener la URL del Backend

1. En Railway, ve a tu servicio
2. Click en "Settings" > "Networking"
3. Genera un dominio público (ej: `tu-app.up.railway.app`)

### Actualizar el Frontend

En tu frontend (Netlify), actualiza la variable de entorno:

```
NEXT_PUBLIC_API_URL=https://tu-app.up.railway.app
```

## Comandos Útiles

```bash
# Build local
npm run build

# Ejecutar en producción local
npm run start:prod

# Ver logs en Railway
railway logs
```

## Solución de Problemas

### Error de conexión a MySQL
- Verifica que las variables de entorno estén correctas
- Asegúrate de que MySQL esté corriendo en Railway

### Error de build
- Verifica que TypeScript compile sin errores: `npm run build`
- Revisa los logs en Railway

### CORS errors
- Agrega tu dominio de Netlify en `src/main.ts` en la configuración de CORS

## Estructura del Proyecto

```
aula1/
├── src/
│   ├── main.ts          # Punto de entrada
│   ├── app.module.ts    # Módulo principal
│   └── ...              # Módulos de la API
├── dist/                # Código compilado (generado)
├── package.json
├── tsconfig.json
├── railway.json         # Configuración de Railway
└── Procfile            # Comando de inicio
```

## Contacto

Si tienes problemas, revisa:
- [Documentación de Railway](https://docs.railway.app)
- [Documentación de NestJS](https://docs.nestjs.com)
