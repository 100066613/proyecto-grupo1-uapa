-- ISW306 Grupo 1 - Etapa 4: Cierre del Proyecto
-- Script de creacion de base de datos y tabla de usuarios

CREATE DATABASE IF NOT EXISTS isw306_grupo1;
USE isw306_grupo1;

CREATE TABLE IF NOT EXISTS usuarios (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    nombre         VARCHAR(100)  NOT NULL,
    email          VARCHAR(150)  NOT NULL UNIQUE,
    pais           VARCHAR(5)    NOT NULL,
    telefono       VARCHAR(20)   NOT NULL,
    password       VARCHAR(255)  NOT NULL,
    fecha_registro DATETIME      DEFAULT CURRENT_TIMESTAMP
);
