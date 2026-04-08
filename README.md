# proyecto-grupo1-uapa

Proyecto del Grupo 1 - Asignatura Desarrollo Aplicaciones WEB ISW-306

## Integrantes

- **Franklin Alberto Beltré Fernández** - Líder
- Juan De Jesús Germán Rodríguez
- José Angel Graciano Hernández
- Jossian Gutiérrez Rosario
- Andy Andrés Rodríguez Abreu
- Edwin José Tejada Núñez
- Andry Zarzuela Mora

---

## Etapa 1: Maquetación

Estructura HTML y estilos CSS del sitio. Incluye navegación responsive, tarjetas de estadísticas, modales y formularios base.

---

## Etapa 2: Dinamismo y Lógica en el Cliente

Se añadió JavaScript del lado cliente para validaciones en tiempo real y persistencia temporal con LocalStorage.

### Funcionalidades

- Validación de campos al salir del foco (blur): vacíos, formato de correo, longitud de contraseña, teléfono dominicano
- Manipulación del DOM: mensajes de error inline, clases CSS de estado, notificaciones tipo toast
- Registro y autenticación de usuarios guardados en LocalStorage

---

## Etapa 3: Arquitectura de Servidor y Persistencia

Se reemplazó la capa de LocalStorage por una conexión real a base de datos. La lógica de validación del cliente se mantuvo intacta; únicamente cambió la capa de datos.

### Tecnologías utilizadas

- **Node.js** con Express como servidor HTTP
- **MariaDB** como motor de base de datos relacional
- **mysql2** para la conexión desde Node.js
- **express-session** para manejo de sesiones en servidor

### Estructura del proyecto

```
pagina/
├── index.html               # Estructura HTML (Etapa 1)
├── css/
│   └── estilos.css          # Estilos del sitio
├── js/
│   └── validaciones.js      # Validaciones cliente + llamadas al servidor
├── img/
│   └── construc_2.gif
└── backend/
    ├── server.js            # Servidor Express (puerto 3000)
    ├── db.js                # Conexión al pool de MariaDB
    ├── package.json
    ├── routes/
    │   └── usuarios.js      # Rutas de la API
    └── db/
        └── schema.sql       # Script de creación de la base de datos
```

### Base de datos

La base de datos se llama `isw306_grupo1` y contiene la tabla `usuarios`:

```sql
CREATE TABLE IF NOT EXISTS usuarios (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    nombre         VARCHAR(100)  NOT NULL,
    email          VARCHAR(150)  NOT NULL UNIQUE,
    pais           VARCHAR(5)    NOT NULL,
    telefono       VARCHAR(20)   NOT NULL,
    password       VARCHAR(255)  NOT NULL,
    fecha_registro DATETIME      DEFAULT CURRENT_TIMESTAMP
);
```

### Endpoints de la API

| Método | Ruta              | Operación SQL        | Descripción                        |
|--------|-------------------|----------------------|------------------------------------|
| POST   | /api/registrar    | INSERT INTO usuarios | Crea un nuevo usuario              |
| POST   | /api/login        | SELECT con WHERE     | Autentica al usuario               |
| GET    | /api/sesion       | —                    | Consulta si hay sesion activa      |
| POST   | /api/logout       | —                    | Cierra la sesion                   |
| GET    | /api/usuarios     | SELECT todos         | Lista usuarios para el dashboard   |

Las consultas usan parámetros preparados (`?`) para evitar inyección SQL.

### Cómo ejecutar el proyecto

**Requisitos:** Node.js instalado, MariaDB o MySQL corriendo en el puerto 3306.

1. Crear la base de datos ejecutando el script incluido:

```bash
mysql -u root -p < backend/db/schema.sql
```

2. Instalar las dependencias del servidor:

```bash
cd backend
npm install
```

3. Iniciar el servidor:

```bash
node server.js
```

4. Abrir `index.html` en el navegador.

El servidor queda disponible en `http://localhost:3000` y el frontend se conecta automáticamente a esa dirección.

### Flujo de uso

1. Abrir `index.html` en el navegador
2. Hacer clic en "Registrarse" y completar el formulario
3. Los datos se envían al servidor mediante `POST /api/registrar` y se guardan en MariaDB
4. Al iniciar sesión, el servidor verifica las credenciales con `SELECT` y crea una sesión
5. La tabla del dashboard muestra los usuarios registrados consultando `GET /api/usuarios`

### Compatibilidad

- Navegadores modernos con soporte de Fetch API
- Node.js 18 o superior
- MariaDB 10.6 o superior / MySQL 8 o superior

---

## Etapa 4: Cierre del Proyecto

Se profesionalizó la aplicación integrando un framework CSS, completando el ciclo CRUD y reforzando la seguridad de las sesiones.

### Cambios principales

- **Bootstrap 5.3** sustituye los estilos CSS manuales. Se conservan los colores del Grupo 1 (#0b1838 / #F68121) como variables CSS que complementan el framework.
- **Bootstrap Icons** para iconografía consistente en toda la interfaz.
- **CRUD completo:** se agregaron las operaciones Update y Delete que faltaban tras la Etapa 3.
- **Contraseñas encriptadas** con bcryptjs — los registros no se almacenan en texto plano.
- **Autenticación completa:** Login y Logout con sesiones del servidor. Las rutas de edición y eliminación requieren sesión activa.
- **Variables de entorno:** las credenciales de base de datos se mueven a un archivo `.env` que no se sube al repositorio.

### Endpoints de la API (actualizado)

| Método | Ruta                 | Operación SQL                     | Requiere sesión |
|--------|----------------------|-----------------------------------|-----------------|
| POST   | /api/registrar       | INSERT INTO usuarios              | No              |
| POST   | /api/login           | SELECT + bcrypt.compare           | No              |
| GET    | /api/sesion          | —                                 | No              |
| POST   | /api/logout          | —                                 | Sí              |
| GET    | /api/usuarios        | SELECT todos                      | No              |
| PUT    | /api/usuarios/:id    | UPDATE usuarios SET ...           | Sí              |
| DELETE | /api/usuarios/:id    | DELETE FROM usuarios WHERE id = ? | Sí              |

### Configuración de variables de entorno

Copiar el archivo de ejemplo y ajustar los valores antes de iniciar:

```bash
cp backend/.env.example backend/.env
```

Editar `backend/.env` con las credenciales reales de la base de datos.

### Framework CSS utilizado

**Bootstrap 5.3.3** — cargado desde CDN (jsdelivr.net). No requiere instalación local.
