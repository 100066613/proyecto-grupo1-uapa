const express        = require('express');
const session        = require('express-session');
const cors           = require('cors');
const path           = require('path');
const usuariosRouter = require('./routes/usuarios');

const app  = express();
const PORT = 3000;

app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({
    secret:            'isw306-grupo1-clave-sesion',
    resave:            false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 }
}));

app.use('/api', usuariosRouter);

app.use(express.static(path.join(__dirname, '..')));

app.listen(PORT, () => {
    console.log('Servidor ISW306 Grupo 1 activo en http://localhost:' + PORT);
});
