# proyecto-grupo1-uapa

Proyecto del Grupo 1 - Asignatura Desarrollo Aplicaciones WEB ISW-306

## Integrantes:

- **Franklin Alberto Beltré Fernández** - Líder
- Juan De Jesús Germán Rodríguez
- José Angel Graciano Hernández
- Jossian Gutiérrez Rosario
- Andy Andrés Rodríguez Abreu
- Edwin José Tejada Núñez
- Andry Zarzuela Mora

---

## Etapa 2: Dinamismo y Lógica en el Cliente

### Descripción

Se ha implementado JavaScript del lado cliente para añadir interactividad, validaciones en tiempo real y persistencia de datos mediante LocalStorage.

### Funcionalidades Implementadas

#### 1. Validaciones en Tiempo Real

- **Campos vacíos**: Detecta cuando un campo está vacío al salir del foco (evento blur)
- **Formato de correo**: Valida que el email tenga un formato válido usando expresiones regulares
- **Longitud mínima**: Verifica que las contraseñas tengan al menos 8 caracteres
- **Formato de teléfono**: Valida teléfonos en formato dominicano (809-000-0000 o 10 dígitos)

#### 2. Manipulación del DOM

- **getElementById()**: Obtiene referencias a elementos del formulario
- **querySelector()**: Selecciona elementos específicos del DOM
- **innerHTML**: Inserta mensajes de error dinámicamente
- **classList**: Añade o quita clases de validación visual (input-error, input-valido)
- **Mensajes sin recargar**: Todas las validaciones y notificaciones se muestran sin recargar la página

#### 3. Persistencia de Datos (LocalStorage)

- **Registro de usuarios**: Los usuarios registrados se guardan en el navegador
- **Autenticación**: El formulario de login valida contra los datos almacenados
- **Sesión activa**: Mantiene la sesión del usuario actual

### Estructura de Archivos

```
pagina/
├── index.html          # Estructura HTML con formularios
├── css/
│   └── estilos.css     # Estilos incluyendo clases de validación
├── js/
│   └── validaciones.js # Lógica JavaScript (Etapa 2)
└── img/                # Imágenes del proyecto
```

### Uso

1. **Abrir la página**: Cargar `index.html` en un navegador web
2. **Registrarse**: Click en "Registrarse", completar el formulario
3. **Validaciones**: Los errores se muestran en tiempo real al salir de cada campo
4. **Iniciar sesión**: Usar las credenciales registradas para acceder

### Compatibilidad

- Navegadores modernos con soporte de LocalStorage
- JavaScript ES6+
