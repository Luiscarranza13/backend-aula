# Sistema de Aula Virtual - Backend NestJS

Backend completo desarrollado con NestJS en JavaScript puro, TypeORM y MySQL.

## Instalación

```bash
npm install
```

## Configuración

Asegúrate de tener MySQL corriendo en Laragon con la base de datos `aula_virtual_nest` creada.

La configuración de conexión está en `src/app.module.js`:
- Host: localhost
- Puerto: 3306
- Usuario: root
- Contraseña: (vacía)
- Base de datos: aula_virtual_nest

## Ejecución

```bash
npm run start:dev
```

El servidor estará disponible en: http://localhost:3000

## Endpoints Disponibles

### General
- GET / - Estado del servidor

### Usuarios (/users)
- POST /users - Crear usuario
- GET /users - Listar todos
- GET /users/:id - Obtener uno
- PATCH /users/:id - Actualizar
- DELETE /users/:id - Eliminar

### Autenticación (/auth)
- POST /auth/login - Login

### Cursos (/courses)
- POST /courses - Crear curso
- GET /courses - Listar todos
- GET /courses/:id - Obtener uno
- PATCH /courses/:id - Actualizar
- DELETE /courses/:id - Eliminar

### Tareas (/tasks)
- POST /tasks - Crear tarea
- GET /tasks - Listar todas
- GET /tasks/:id - Obtener una
- PATCH /tasks/:id - Actualizar
- DELETE /tasks/:id - Eliminar

### Recursos (/resources)
- POST /resources - Crear recurso
- GET /resources - Listar todos
- GET /resources/:id - Obtener uno
- PATCH /resources/:id - Actualizar
- DELETE /resources/:id - Eliminar

### Foros (/forums)
- POST /forums - Crear foro
- GET /forums - Listar todos
- GET /forums/:id - Obtener uno
- PATCH /forums/:id - Actualizar
- DELETE /forums/:id - Eliminar

### Mensajes (/messages)
- POST /messages - Crear mensaje
- GET /messages - Listar todos
- GET /messages/:id - Obtener uno
- PATCH /messages/:id - Actualizar
- DELETE /messages/:id - Eliminar

## Ejemplos de Uso

Ver archivo `API_EXAMPLES.json` para ejemplos completos de peticiones.

### Crear Usuario
```json
POST /users
{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "contraseña": "password123",
  "rol": "docente"
}
```

### Login
```json
POST /auth/login
{
  "email": "juan@example.com",
  "contraseña": "password123"
}
```

### Crear Curso
```json
POST /courses
{
  "titulo": "Matemáticas Avanzadas",
  "descripcion": "Curso de cálculo",
  "grado": "11",
  "seccion": "A",
  "docente_id": 1
}
```

## Estructura del Proyecto

```
src/
├── users/          # Módulo de usuarios
├── courses/        # Módulo de cursos
├── tasks/          # Módulo de tareas
├── resources/      # Módulo de recursos
├── forums/         # Módulo de foros
├── messages/       # Módulo de mensajes
├── auth/           # Módulo de autenticación
├── app.module.js   # Módulo principal
└── main.js         # Punto de entrada
```

## Características

- ✅ CRUD completo para todas las entidades
- ✅ Relaciones entre entidades (OneToMany, ManyToOne)
- ✅ Validación de datos con class-validator
- ✅ Encriptación de contraseñas con bcrypt
- ✅ Autenticación básica
- ✅ CORS habilitado
- ✅ TypeORM con sincronización automática
- ✅ Arquitectura modular y escalable
