# 🚀 Instrucciones para Iniciar el Backend

## Paso 1: Iniciar Laragon

1. Abre **Laragon**
2. Haz clic en **"Start All"** para iniciar Apache y MySQL
3. Espera a que ambos servicios estén en verde

## Paso 2: Verificar MySQL

Ejecuta el siguiente comando para verificar que MySQL esté funcionando:

```bash
npm run check:db
```

Este script:
- ✅ Verifica la conexión a MySQL
- ✅ Crea la base de datos `aula_virtual_nest` si no existe
- ✅ Confirma que todo está listo

## Paso 3: Iniciar el Backend

Una vez que MySQL esté funcionando, ejecuta:

```bash
npm run start:dev
```

Deberías ver el mensaje:
```
🚀 Servidor corriendo en http://localhost:3000
```

## Paso 4: Probar la API

Abre tu navegador o Postman y visita:
```
http://localhost:3000
```

Deberías ver:
```json
{
  "message": "API Aula Virtual funcionando correctamente",
  "status": "OK"
}
```

## 🔧 Solución de Problemas

### Error: "Unable to connect to the database"

**Causa:** MySQL no está corriendo

**Solución:**
1. Abre Laragon
2. Haz clic en "Start All"
3. Espera a que MySQL esté en verde
4. Ejecuta `npm run check:db`
5. Ejecuta `npm run start:dev`

### Error: "ECONNREFUSED ::1:3306"

**Causa:** MySQL no está escuchando en el puerto 3306

**Solución:**
1. Verifica en Laragon que MySQL esté corriendo
2. Haz clic derecho en Laragon > MySQL > Restart

### Error: "Access denied for user 'root'"

**Causa:** La contraseña de MySQL no está vacía

**Solución:**
1. Crea un archivo `.env` en la raíz del proyecto
2. Copia el contenido de `.env.example`
3. Actualiza `DB_PASSWORD` con tu contraseña de MySQL

## 📚 Endpoints Disponibles

Una vez que el servidor esté corriendo, puedes usar estos endpoints:

### Usuarios
- `POST /users` - Crear usuario
- `GET /users` - Listar todos
- `GET /users/:id` - Obtener uno
- `PATCH /users/:id` - Actualizar
- `DELETE /users/:id` - Eliminar

### Autenticación
- `POST /auth/login` - Login

### Cursos
- `POST /courses` - Crear curso
- `GET /courses` - Listar todos
- `GET /courses/:id` - Obtener uno
- `PATCH /courses/:id` - Actualizar
- `DELETE /courses/:id` - Eliminar

### Tareas
- `POST /tasks` - Crear tarea
- `GET /tasks` - Listar todas
- `GET /tasks/:id` - Obtener una
- `PATCH /tasks/:id` - Actualizar
- `DELETE /tasks/:id` - Eliminar

### Recursos
- `POST /resources` - Crear recurso
- `GET /resources` - Listar todos
- `GET /resources/:id` - Obtener uno
- `PATCH /resources/:id` - Actualizar
- `DELETE /resources/:id` - Eliminar

### Foros
- `POST /forums` - Crear foro
- `GET /forums` - Listar todos
- `GET /forums/:id` - Obtener uno
- `PATCH /forums/:id` - Actualizar
- `DELETE /forums/:id` - Eliminar

### Mensajes
- `POST /messages` - Crear mensaje
- `GET /messages` - Listar todos
- `GET /messages/:id` - Obtener uno
- `PATCH /messages/:id` - Actualizar
- `DELETE /messages/:id` - Eliminar

## 📖 Ejemplos de Uso

Ver el archivo `API_EXAMPLES.json` para ejemplos completos de todas las peticiones.

## ✨ Características

- ✅ CRUD completo para todas las entidades
- ✅ Relaciones entre entidades
- ✅ Validación de datos
- ✅ Encriptación de contraseñas con bcrypt
- ✅ Autenticación JWT
- ✅ CORS habilitado
- ✅ TypeORM con sincronización automática
- ✅ Arquitectura modular NestJS
