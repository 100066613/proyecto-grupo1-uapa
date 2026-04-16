const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcryptjs');
const db      = require('../db');

// POST /api/registrar
router.post('/registrar', async (req, res) => {
    const { nombre, email, pais, telefono, password } = req.body;

    if (!nombre || !email || !pais || !telefono || !password) {
        return res.status(400).json({ ok: false, mensaje: 'Todos los campos son obligatorios' });
    }

    try {
        const hash = bcrypt.hashSync(password, 10);
        const sql  = 'INSERT INTO usuarios (nombre, email, pais, telefono, password) VALUES (?, ?, ?, ?, ?)';
        await db.execute(sql, [nombre.trim(), email.trim().toLowerCase(), pais, telefono.trim(), hash]);
        res.json({ ok: true, mensaje: 'Usuario registrado correctamente' });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ ok: false, mensaje: 'El correo ya esta registrado' });
        }
        res.status(500).json({ ok: false, mensaje: 'Error interno del servidor' });
    }
});

// POST /api/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ ok: false, mensaje: 'Correo y contrasena son obligatorios' });
    }

    try {
        const sql = 'SELECT id, nombre, email, pais, telefono, password, fecha_registro FROM usuarios WHERE email = ?';
        const [filas] = await db.execute(sql, [email.trim().toLowerCase()]);

        if (filas.length === 0 || !bcrypt.compareSync(password, filas[0].password)) {
            return res.status(401).json({ ok: false, mensaje: 'Credenciales incorrectas' });
        }

        const usuarioSinPass = { ...filas[0] };
        delete usuarioSinPass.password;
        req.session.usuario = usuarioSinPass;
        res.json({ ok: true, usuario: usuarioSinPass });
    } catch (err) {
        console.error('Error en login:', err);
        res.status(500).json({ ok: false, mensaje: 'Error interno del servidor' });
    }
});

// GET /api/sesion
router.get('/sesion', (req, res) => {
    if (req.session.usuario) {
        return res.json({ sesion: true, usuario: req.session.usuario });
    }
    res.json({ sesion: false });
});

// POST /api/logout
router.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.json({ ok: true });
    });
});

// GET /api/usuarios  (READ - muestra lista para el dashboard)
router.get('/usuarios', async (req, res) => {
    try {
        const sql = 'SELECT id, nombre, email, pais, telefono, fecha_registro FROM usuarios ORDER BY fecha_registro DESC';
        const [filas] = await db.execute(sql);
        res.json({ ok: true, usuarios: filas });
    } catch (err) {
        console.error('Error al consultar usuarios:', err);
        res.status(500).json({ ok: false, mensaje: 'Error al consultar usuarios' });
    }
});

// PUT /api/usuarios/:id  (UPDATE)
router.put('/usuarios/:id', async (req, res) => {
    if (!req.session.usuario) {
        return res.status(401).json({ ok: false, mensaje: 'Debe iniciar sesion para realizar esta accion' });
    }

    const { id } = req.params;
    const { nombre, email, pais, telefono } = req.body;

    if (!nombre || !email || !pais || !telefono) {
        return res.status(400).json({ ok: false, mensaje: 'Todos los campos son obligatorios' });
    }

    try {
        const sql = 'UPDATE usuarios SET nombre = ?, email = ?, pais = ?, telefono = ? WHERE id = ?';
        const [resultado] = await db.execute(sql, [nombre.trim(), email.trim().toLowerCase(), pais, telefono.trim(), id]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ ok: false, mensaje: 'Usuario no encontrado' });
        }

        res.json({ ok: true, mensaje: 'Usuario actualizado correctamente' });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ ok: false, mensaje: 'El correo ya esta en uso por otro usuario' });
        }
        res.status(500).json({ ok: false, mensaje: 'Error interno del servidor' });
    }
});

// DELETE /api/usuarios/:id  (DELETE)
router.delete('/usuarios/:id', async (req, res) => {
    if (!req.session.usuario) {
        return res.status(401).json({ ok: false, mensaje: 'Debe iniciar sesion para realizar esta accion' });
    }

    const { id } = req.params;

    try {
        const sql = 'DELETE FROM usuarios WHERE id = ?';
        const [resultado] = await db.execute(sql, [id]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ ok: false, mensaje: 'Usuario no encontrado' });
        }

        res.json({ ok: true, mensaje: 'Usuario eliminado correctamente' });
    } catch (err) {
        console.error('Error al eliminar usuario:', err);
        res.status(500).json({ ok: false, mensaje: 'Error interno del servidor' });
    }
});

module.exports = router;
