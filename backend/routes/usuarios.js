const express = require('express');
const router  = express.Router();
const db      = require('../db');

// POST /api/registrar
router.post('/registrar', async (req, res) => {
    const { nombre, email, pais, telefono, password } = req.body;

    if (!nombre || !email || !pais || !telefono || !password) {
        return res.status(400).json({ ok: false, mensaje: 'Todos los campos son obligatorios' });
    }

    try {
        const sql = 'INSERT INTO usuarios (nombre, email, pais, telefono, password) VALUES (?, ?, ?, ?, ?)';
        await db.execute(sql, [nombre.trim(), email.trim().toLowerCase(), pais, telefono.trim(), password]);
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
        const sql = 'SELECT id, nombre, email, pais, telefono, fecha_registro FROM usuarios WHERE email = ? AND password = ?';
        const [filas] = await db.execute(sql, [email.trim().toLowerCase(), password]);

        if (filas.length === 0) {
            return res.status(401).json({ ok: false, mensaje: 'Credenciales incorrectas' });
        }

        req.session.usuario = filas[0];
        res.json({ ok: true, usuario: filas[0] });
    } catch (err) {
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
        res.status(500).json({ ok: false, mensaje: 'Error al consultar usuarios' });
    }
});

module.exports = router;
