/**
 * Validaciones y Lógica del Lado Cliente
 * Etapa 3: Arquitectura de Servidor y Persistencia
 * ISW306 - Grupo 1
 */

const API_BASE = 'http://localhost:3000/api';

// ============================================
// UTILIDADES DE VALIDACIÓN
// ============================================

/**
 * Valida formato de correo electrónico
 * @param {string} email - Correo a validar
 * @returns {boolean} True si el formato es válido
 */
const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

/**
 * Valida formato de teléfono dominicano
 * @param {string} tel - Teléfono a validar
 * @returns {boolean} True si el formato es válido
 */
const validarTelefono = (tel) => {
    const regex = /^[0-9]{3}-[0-9]{4}-[0-9]{4}$|^[0-9]{10}$/;
    return regex.test(tel);
};

/**
 * Valida longitud mínima de contraseña
 * @param {string} pass - Contraseña a validar
 * @param {number} min - Longitud mínima (por defecto 8)
 * @returns {boolean} True si cumple la longitud mínima
 */
const validarLongitudMinima = (pass, min = 8) => {
    return pass.length >= min;
};

/**
 * Verifica si un campo está vacío
 * @param {string} valor - Valor a validar
 * @returns {boolean} True si está vacío o solo tiene espacios
 */
const estaVacio = (valor) => {
    return !valor || valor.trim() === '';
};

// ============================================
// MANIPULACIÓN DEL DOM - MENSAJES
// ============================================

/**
 * Muestra un mensaje de error en un campo
 * @param {HTMLElement} input - Elemento input
 * @param {string} mensaje - Mensaje de error
 */
const mostrarError = (input, mensaje) => {
    const contenedor = input.parentElement;
    const mensajeError = contenedor.querySelector('.mensaje-error');

    input.classList.add('input-error');
    input.classList.remove('input-valido');

    if (mensajeError) {
        mensajeError.innerHTML = mensaje;
        mensajeError.style.display = 'block';
    }
};

/**
 * Muestra que un campo es válido
 * @param {HTMLElement} input - Elemento input
 */
const mostrarValido = (input) => {
    const contenedor = input.parentElement;
    const mensajeError = contenedor.querySelector('.mensaje-error');

    input.classList.remove('input-error');
    input.classList.add('input-valido');

    if (mensajeError) {
        mensajeError.style.display = 'none';
    }
};

/**
 * Muestra una notificación toast
 * @param {string} mensaje - Mensaje a mostrar
 * @param {string} tipo - 'exito' o 'error'
 */
const mostrarNotificacion = (mensaje, tipo = 'exito') => {
    let notificacion = document.getElementById('notificacion-global');

    if (!notificacion) {
        notificacion = document.createElement('div');
        notificacion.id = 'notificacion-global';
        document.body.appendChild(notificacion);
    }

    notificacion.textContent = mensaje;
    notificacion.className = `notificacion notificacion-${tipo}`;
    notificacion.style.display = 'block';

    setTimeout(() => {
        notificacion.style.display = 'none';
    }, 4000);
};

/**
 * Limpia todos los mensajes de error de un formulario
 * @param {HTMLFormElement} form - Formulario a limpiar
 */
const limpiarMensajesError = (form) => {
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.classList.remove('input-error', 'input-valido');
    });

    const mensajes = form.querySelectorAll('.mensaje-error');
    mensajes.forEach(msg => {
        msg.style.display = 'none';
    });
};

// ============================================
// PERSISTENCIA - SERVIDOR (Node.js + MySQL)
// ============================================

/**
 * Registra un nuevo usuario en el servidor
 * @param {Object} usuario - Datos del usuario a registrar
 * @returns {Promise<{ok: boolean, mensaje: string}>}
 */
const guardarUsuario = async (usuario) => {
    const respuesta = await fetch(API_BASE + '/registrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(usuario)
    });
    return respuesta.json();
};

/**
 * Autentica un usuario contra la base de datos
 * @param {string} email - Correo del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {Promise<{ok: boolean, usuario?: Object, mensaje?: string}>}
 */
const autenticarUsuario = async (email, password) => {
    const respuesta = await fetch(API_BASE + '/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
    });
    return respuesta.json();
};

/**
 * Carga la lista de usuarios registrados y la muestra en el dashboard
 */
const cargarListaUsuarios = async () => {
    const contenedor = document.getElementById('tabla-usuarios');
    if (!contenedor) return;

    try {
        const respuesta = await fetch(API_BASE + '/usuarios', { credentials: 'include' });
        const datos = await respuesta.json();

        if (!datos.ok || datos.usuarios.length === 0) {
            contenedor.innerHTML = '<p class="texto-wip">No hay usuarios registrados aun.</p>';
            return;
        }

        const filas = datos.usuarios.map(u => `
            <tr>
                <td>${u.id}</td>
                <td>${u.nombre}</td>
                <td>${u.email}</td>
                <td>${u.pais}</td>
                <td>${u.telefono}</td>
                <td>${new Date(u.fecha_registro).toLocaleDateString('es-DO')}</td>
            </tr>`).join('');

        contenedor.innerHTML = `
            <table class="tabla-datos">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Pais</th>
                        <th>Telefono</th>
                        <th>Registro</th>
                    </tr>
                </thead>
                <tbody>${filas}</tbody>
            </table>`;
    } catch (e) {
        contenedor.innerHTML = '<p class="texto-wip">No se pudo conectar al servidor.</p>';
    }
};

// ============================================
// FORMULARIO DE REGISTRO
// ============================================

const initFormRegistro = () => {
    const form = document.querySelector('#modal-registro .form-modal');
    if (!form) return;

    const nombreInput = document.getElementById('r-nombre');
    const emailInput = document.getElementById('r-email');
    const paisInput = document.getElementById('r-pais');
    const telInput = document.getElementById('r-tel');
    const passInput = document.getElementById('r-pass');

    // Validación en tiempo real - Nombre
    nombreInput.addEventListener('blur', () => {
        if (estaVacio(nombreInput.value)) {
            mostrarError(nombreInput, 'El nombre es obligatorio');
        } else if (nombreInput.value.trim().length < 3) {
            mostrarError(nombreInput, 'El nombre debe tener al menos 3 caracteres');
        } else {
            mostrarValido(nombreInput);
        }
    });

    // Validación en tiempo real - Email
    emailInput.addEventListener('blur', () => {
        if (estaVacio(emailInput.value)) {
            mostrarError(emailInput, 'El correo es obligatorio');
        } else if (!validarEmail(emailInput.value)) {
            mostrarError(emailInput, 'Formato de correo inválido');
        } else {
            mostrarValido(emailInput);
        }
    });

    // Validación en tiempo real - País
    paisInput.addEventListener('change', () => {
        if (estaVacio(paisInput.value)) {
            mostrarError(paisInput, 'Debe seleccionar un país');
        } else {
            mostrarValido(paisInput);
        }
    });

    // Validación en tiempo real - Teléfono
    telInput.addEventListener('blur', () => {
        if (estaVacio(telInput.value)) {
            mostrarError(telInput, 'El teléfono es obligatorio');
        } else if (!validarTelefono(telInput.value)) {
            mostrarError(telInput, 'Formato: 809-000-0000 o 10 dígitos');
        } else {
            mostrarValido(telInput);
        }
    });

    // Validación en tiempo real - Contraseña
    passInput.addEventListener('blur', () => {
        if (estaVacio(passInput.value)) {
            mostrarError(passInput, 'La contraseña es obligatoria');
        } else if (!validarLongitudMinima(passInput.value, 8)) {
            mostrarError(passInput, 'Mínimo 8 caracteres requeridos');
        } else {
            mostrarValido(passInput);
        }
    });

    // Submit del formulario
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validar todos los campos
        let valido = true;

        if (estaVacio(nombreInput.value) || nombreInput.value.trim().length < 3) {
            mostrarError(nombreInput, 'Nombre inválido');
            valido = false;
        }

        if (estaVacio(emailInput.value) || !validarEmail(emailInput.value)) {
            mostrarError(emailInput, 'Correo inválido');
            valido = false;
        }

        if (estaVacio(paisInput.value)) {
            mostrarError(paisInput, 'Seleccione un país');
            valido = false;
        }

        if (estaVacio(telInput.value) || !validarTelefono(telInput.value)) {
            mostrarError(telInput, 'Teléfono inválido');
            valido = false;
        }

        if (estaVacio(passInput.value) || !validarLongitudMinima(passInput.value, 8)) {
            mostrarError(passInput, 'Contraseña inválida');
            valido = false;
        }

        if (!valido) {
            mostrarNotificacion('Por favor, corrija los errores antes de continuar', 'error');
            return;
        }

        const nuevoUsuario = {
            nombre:   nombreInput.value.trim(),
            email:    emailInput.value.trim(),
            pais:     paisInput.value,
            telefono: telInput.value.trim(),
            password: passInput.value
        };

        try {
            const resultado = await guardarUsuario(nuevoUsuario);
            if (resultado.ok) {
                mostrarNotificacion(`¡Bienvenido ${nuevoUsuario.nombre}! Registro exitoso.`, 'exito');
                form.reset();
                limpiarMensajesError(form);
                cargarListaUsuarios();
                setTimeout(() => { window.location.hash = ''; }, 2000);
            } else {
                mostrarNotificacion(resultado.mensaje || 'El correo ya está registrado. Use otro o inicie sesión.', 'error');
            }
        } catch (err) {
            mostrarNotificacion('No se pudo conectar al servidor. Verifique que esté activo.', 'error');
        }
    });

    // Botón limpiar
    const btnReset = form.querySelector('button[type="reset"]');
    if (btnReset) {
        btnReset.addEventListener('click', () => {
            limpiarMensajesError(form);
        });
    }
};

// ============================================
// FORMULARIO DE LOGIN
// ============================================

const initFormLogin = () => {
    const form = document.querySelector('#modal-login .form-modal');
    if (!form) return;

    const emailInput = document.getElementById('l-email');
    const passInput = document.getElementById('l-pass');

    // Poner foco en el email cuando se abre el modal
    window.addEventListener('hashchange', () => {
        if (window.location.hash === '#modal-login') {
            setTimeout(() => emailInput.focus(), 300);
        }
    });

    // También verificar al cargar la página si ya está el modal abierto
    if (window.location.hash === '#modal-login') {
        setTimeout(() => emailInput.focus(), 300);
    }

    // Validación en tiempo real - Email
    emailInput.addEventListener('blur', () => {
        if (estaVacio(emailInput.value)) {
            mostrarError(emailInput, 'El correo es obligatorio');
        } else if (!validarEmail(emailInput.value)) {
            mostrarError(emailInput, 'Formato de correo inválido');
        } else {
            mostrarValido(emailInput);
        }
    });

    // Validación en tiempo real - Contraseña
    passInput.addEventListener('blur', () => {
        if (estaVacio(passInput.value)) {
            mostrarError(passInput, 'La contraseña es obligatoria');
        } else {
            mostrarValido(passInput);
        }
    });

    // Submit del formulario
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        let valido = true;

        if (estaVacio(emailInput.value) || !validarEmail(emailInput.value)) {
            mostrarError(emailInput, 'Correo inválido');
            valido = false;
        }

        if (estaVacio(passInput.value)) {
            mostrarError(passInput, 'Ingrese su contraseña');
            valido = false;
        }

        if (!valido) {
            mostrarNotificacion('Por favor, complete todos los campos correctamente', 'error');
            return;
        }

        try {
            const resultado = await autenticarUsuario(emailInput.value.trim(), passInput.value);

            if (resultado.ok) {
                mostrarNotificacion(`¡Hola ${resultado.usuario.nombre}! Has iniciado sesión.`, 'exito');
                form.reset();
                limpiarMensajesError(form);
                setTimeout(() => { window.location.hash = ''; }, 1500);
            } else {
                mostrarNotificacion('Credenciales incorrectas. Verifique o regístrese.', 'error');
            }
        } catch (err) {
            mostrarNotificacion('No se pudo conectar al servidor. Verifique que esté activo.', 'error');
        }
    });
};

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initFormLogin();
    initFormRegistro();

    // Cerrar notificaciones al hacer clic
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('notificacion')) {
            e.target.style.display = 'none';
        }
    });

    // Cargar lista de usuarios registrados en el dashboard
    cargarListaUsuarios();

    // Verificar si hay sesion activa en el servidor
    fetch(API_BASE + '/sesion', { credentials: 'include' })
        .then(r => r.json())
        .then(datos => {
            if (datos.sesion) {
                console.log('Sesion activa:', datos.usuario.nombre);
            }
        })
        .catch(() => {});
});
