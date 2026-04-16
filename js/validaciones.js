// Lógica del cliente - ISW306 Grupo 1
// Etapa 4: CRUD completo + sesiones

const API = '/api';

// --- Estado de sesión ---

let sesionActiva = false;
let usuarioActual = null;
let idParaEliminar = null;

/**
 * Actualiza la interfaz según el estado de sesión
 */
const actualizarUI = (usuario) => {
    sesionActiva = !!usuario;
    usuarioActual = usuario || null;

    const loginBtn    = document.getElementById('nav-login-btn');
    const registroBtn = document.getElementById('nav-registro-btn');
    const userInfo    = document.getElementById('nav-usuario-info');
    const logoutBtn   = document.getElementById('nav-logout-btn');
    const alertaSesion= document.getElementById('alerta-sesion');

    if (sesionActiva) {
        loginBtn.classList.add('d-none');
        registroBtn.classList.add('d-none');
        userInfo.classList.remove('d-none');
        logoutBtn.classList.remove('d-none');
        alertaSesion.classList.add('d-none');
        document.getElementById('nav-nombre-usuario').textContent = usuario.nombre;
    } else {
        loginBtn.classList.remove('d-none');
        registroBtn.classList.remove('d-none');
        userInfo.classList.add('d-none');
        logoutBtn.classList.add('d-none');
        alertaSesion.classList.remove('d-none');
    }

    cargarTablaUsuarios();
};

// --- Notificaciones (Bootstrap Toast) ---

const mostrarToast = (mensaje, tipo = 'exito') => {
    const toastEl  = document.getElementById('toast-notificacion');
    const msgEl    = document.getElementById('toast-mensaje');
    msgEl.textContent = mensaje;
    toastEl.className = `toast align-items-center border-0 text-white ${tipo === 'exito' ? 'bg-success' : 'bg-danger'}`;
    bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 4000 }).show();
};

// --- Validaciones ---

const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validarTelefono = (tel) => /^\d{3}-\d{3}-\d{4}$/.test(tel);

/**
 * Aplica las clases de Bootstrap de validación a un input
 */
const marcarValido = (input) => {
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
};

const marcarInvalido = (input) => {
    input.classList.remove('is-valid');
    input.classList.add('is-invalid');
};

const limpiarValidacion = (form) => {
    form.querySelectorAll('.form-control, .form-select').forEach(el => {
        el.classList.remove('is-valid', 'is-invalid');
    });
};

// --- Tabla de usuarios ---

const cargarTablaUsuarios = async () => {
    const contenedor = document.getElementById('tabla-usuarios');
    const contador   = document.getElementById('contador-usuarios');
    if (!contenedor) return;

    try {
        const res   = await fetch(API + '/usuarios', { credentials: 'include' });
        const datos = await res.json();

        if (!datos.ok || datos.usuarios.length === 0) {
            contenedor.innerHTML = '<p class="p-3 text-muted">No hay usuarios registrados aún.</p>';
            if (contador) contador.textContent = '0';
            return;
        }

        if (contador) contador.textContent = datos.usuarios.length;

        const filas = datos.usuarios.map(u => {
            const acciones = sesionActiva ? `
                <button class="btn btn-sm btn-outline-primary me-1" onclick="abrirEditar(${u.id},'${escapar(u.nombre)}','${escapar(u.email)}','${u.pais}','${escapar(u.telefono)}')">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="abrirEliminar(${u.id},'${escapar(u.nombre)}')">
                    <i class="bi bi-trash"></i>
                </button>` : `<span class="text-muted small">—</span>`;

            return `<tr>
                <td>${u.id}</td>
                <td>${u.nombre}</td>
                <td>${u.email}</td>
                <td>${u.pais}</td>
                <td>${u.telefono}</td>
                <td>${new Date(u.fecha_registro).toLocaleDateString('es-DO')}</td>
                <td class="acciones-tabla">${acciones}</td>
            </tr>`;
        }).join('');

        contenedor.innerHTML = `
            <div class="table-responsive">
                <table class="table table-striped table-hover mb-0 align-middle">
                    <thead>
                        <tr>
                            <th>#</th><th>Nombre</th><th>Correo</th>
                            <th>País</th><th>Teléfono</th><th>Registro</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>${filas}</tbody>
                </table>
            </div>`;
    } catch {
        contenedor.innerHTML = '<p class="p-3 text-danger">No se pudo conectar al servidor.</p>';
    }
};

const escapar = (str) => String(str).replace(/'/g, "\\'").replace(/"/g, '&quot;');

// --- Editar usuario ---

const abrirEditar = (id, nombre, email, pais, telefono) => {
    document.getElementById('e-id').value     = id;
    document.getElementById('e-nombre').value = nombre;
    document.getElementById('e-email').value  = email;
    document.getElementById('e-pais').value   = pais;
    document.getElementById('e-tel').value    = telefono;
    limpiarValidacion(document.getElementById('form-editar'));
    bootstrap.Modal.getOrCreateInstance(document.getElementById('modalEditar')).show();
};

const initFormEditar = () => {
    const form = document.getElementById('form-editar');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const id       = document.getElementById('e-id').value;
        const nombre   = document.getElementById('e-nombre');
        const email    = document.getElementById('e-email');
        const pais     = document.getElementById('e-pais');
        const telefono = document.getElementById('e-tel');

        let valido = true;

        if (!nombre.value.trim() || nombre.value.trim().length < 3) { marcarInvalido(nombre); valido = false; } else marcarValido(nombre);
        if (!validarEmail(email.value.trim()))                        { marcarInvalido(email);  valido = false; } else marcarValido(email);
        if (!pais.value)                                              { marcarInvalido(pais);   valido = false; } else marcarValido(pais);
        if (!validarTelefono(telefono.value.trim()))                  { marcarInvalido(telefono); valido = false; } else marcarValido(telefono);

        if (!valido) return;

        try {
            const res = await fetch(`${API}/usuarios/${id}`, {
                method:  'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    nombre:   nombre.value.trim(),
                    email:    email.value.trim(),
                    pais:     pais.value,
                    telefono: telefono.value.trim()
                })
            });
            const datos = await res.json();
            if (datos.ok) {
                bootstrap.Modal.getInstance(document.getElementById('modalEditar')).hide();
                mostrarToast('Usuario actualizado correctamente', 'exito');
                cargarTablaUsuarios();
            } else {
                mostrarToast(datos.mensaje || 'Error al actualizar', 'error');
            }
        } catch {
            mostrarToast('No se pudo conectar al servidor', 'error');
        }
    });
};

// --- Eliminar usuario ---

const abrirEliminar = (id, nombre) => {
    idParaEliminar = id;
    document.getElementById('eliminar-nombre').textContent = nombre;
    bootstrap.Modal.getOrCreateInstance(document.getElementById('modalEliminar')).show();
};

const initEliminar = () => {
    const btnConfirmar = document.getElementById('btn-confirmar-eliminar');
    if (!btnConfirmar) return;

    btnConfirmar.addEventListener('click', async () => {
        if (!idParaEliminar) return;

        try {
            const res = await fetch(`${API}/usuarios/${idParaEliminar}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            const datos = await res.json();
            bootstrap.Modal.getInstance(document.getElementById('modalEliminar')).hide();
            if (datos.ok) {
                mostrarToast('Usuario eliminado correctamente', 'exito');
                cargarTablaUsuarios();
            } else {
                mostrarToast(datos.mensaje || 'Error al eliminar', 'error');
            }
        } catch {
            mostrarToast('No se pudo conectar al servidor', 'error');
        } finally {
            idParaEliminar = null;
        }
    });
};

// --- Login ---

const initFormLogin = () => {
    const form  = document.getElementById('form-login');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('l-email');
        const pass  = document.getElementById('l-pass');
        let valido  = true;

        if (!validarEmail(email.value.trim())) { marcarInvalido(email); valido = false; } else marcarValido(email);
        if (!pass.value)                        { marcarInvalido(pass);  valido = false; } else marcarValido(pass);

        if (!valido) return;

        try {
            const res   = await fetch(API + '/login', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email: email.value.trim(), password: pass.value })
            });
            const datos = await res.json();

            if (datos.ok) {
                bootstrap.Modal.getInstance(document.getElementById('modalLogin')).hide();
                form.reset();
                limpiarValidacion(form);
                mostrarToast(`¡Bienvenido, ${datos.usuario.nombre}!`, 'exito');
                actualizarUI(datos.usuario);
            } else {
                mostrarToast(datos.mensaje || 'Credenciales incorrectas', 'error');
            }
        } catch {
            mostrarToast('No se pudo conectar al servidor', 'error');
        }
    });
};

// --- Logout ---

const initLogout = () => {
    const btn = document.getElementById('btn-logout');
    if (!btn) return;

    btn.addEventListener('click', async () => {
        try {
            await fetch(API + '/logout', { method: 'POST', credentials: 'include' });
        } catch { /* ignorar error de red al hacer logout */ }
        mostrarToast('Sesión cerrada correctamente', 'exito');
        actualizarUI(null);
    });
};

// --- Registro ---

const initFormRegistro = () => {
    const form = document.getElementById('form-registro');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nombre   = document.getElementById('r-nombre');
        const email    = document.getElementById('r-email');
        const pais     = document.getElementById('r-pais');
        const telefono = document.getElementById('r-tel');
        const pass     = document.getElementById('r-pass');

        let valido = true;

        if (!nombre.value.trim() || nombre.value.trim().length < 3) { marcarInvalido(nombre);   valido = false; } else marcarValido(nombre);
        if (!validarEmail(email.value.trim()))                        { marcarInvalido(email);    valido = false; } else marcarValido(email);
        if (!pais.value)                                              { marcarInvalido(pais);     valido = false; } else marcarValido(pais);
        if (!validarTelefono(telefono.value.trim()))                  { marcarInvalido(telefono); valido = false; } else marcarValido(telefono);
        if (!pass.value || pass.value.length < 8)                    { marcarInvalido(pass);     valido = false; } else marcarValido(pass);

        if (!valido) return;

        try {
            const res = await fetch(API + '/registrar', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    nombre:   nombre.value.trim(),
                    email:    email.value.trim(),
                    pais:     pais.value,
                    telefono: telefono.value.trim(),
                    password: pass.value
                })
            });
            const datos = await res.json();

            if (datos.ok) {
                bootstrap.Modal.getInstance(document.getElementById('modalRegistro')).hide();
                form.reset();
                limpiarValidacion(form);
                mostrarToast(`¡Bienvenido, ${nombre.value.trim()}! Registro exitoso.`, 'exito');
                cargarTablaUsuarios();
            } else {
                mostrarToast(datos.mensaje || 'Error al registrar', 'error');
            }
        } catch {
            mostrarToast('No se pudo conectar al servidor', 'error');
        }
    });

    form.querySelector('button[type="reset"]').addEventListener('click', () => limpiarValidacion(form));
};

// --- Inicio ---

document.addEventListener('DOMContentLoaded', async () => {
    initFormLogin();
    initFormRegistro();
    initFormEditar();
    initEliminar();
    initLogout();

    // Verificar sesión activa al cargar la página
    try {
        const res   = await fetch(API + '/sesion', { credentials: 'include' });
        const datos = await res.json();
        actualizarUI(datos.sesion ? datos.usuario : null);
    } catch {
        actualizarUI(null);
    }
});
