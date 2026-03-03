# Manual Técnico de Desarrollo - Proyecto Grupo 01
**Asignatura:** Desarrollo de Aplicaciones WEB (ISW306)  
**Institución:** Universidad Abierta para Adultos (UAPA)

Este manual explica detalladamente la construcción de la plataforma web, la lógica detrás de cada componente y la relación entre el marcado HTML5 y la estilización CSS3.

---

## 1. Estructura Semántica (HTML5)
Se ha seguido el estándar de la W3C utilizando etiquetas semánticas para mejorar el SEO y la accesibilidad:

*   **`<header>`**: Contiene el logo de "Grupo 01" y la navegación principal.
*   **`<nav>`**: Define el bloque de navegación. Dentro de él, usamos un checkbox oculto para el menú móvil.
*   **`<main>`**: Alberga el contenido principal (Dashboard).
*   **`<section>`**: Divide las áreas lógicas como Estadísticas ("grid-stats") y Actividades.
*   **`<article>`**: Utilizado para las tarjetas de estadísticas individuales y el contenedor de actividades.
*   **`<footer>`**: Información institucional y créditos del equipo.

---

## 2. Identidad Visual y CSS (Colores UAPA)
El diseño se basa en la paleta oficial:
*   **Azul Oscuro (`#0b1838`)**: Usado para fondos de header, footer, y textos de encabezados. Da sobriedad y profesionalismo.
*   **Naranja (`#F68121`)**: Usado para acentos, botones de acción principal y el logo. Genera contraste y resalta las llamadas a la acción.

### Relación CSS:
```css
:root {
    --azul-grupo1: #0b1838;
    --naranja-grupo1: #F68121;
}
```

---

## 3. El Dashboard (Panel de Control)
El Dashboard se construyó usando **CSS Grid Layout** para las tarjetas de estadísticas.
*   **Cómo se hizo:** Se definió un contenedor con `display: grid`.
*   **Relación CSS:** `grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));`. Esto permite que las tarjetas se ajusten automáticamente al ancho de la pantalla sin romperse.

---

## 4. Sistema de Navegación y Menú Hamburguesa
Para dispositivos móviles, se implementó un menú que no requiere JavaScript (Checkbox Hack).

*   **HTML:** Un `<input type="checkbox" id="check-menu">` vinculado a un `<label>`.
*   **Lógica CSS:** 
    *   El checkbox está oculto (`display: none`).
    *   Cuando el usuario hace clic en el label (hamburguesa), el checkbox se activa (`:checked`).
    *   El selector `~` (hermano general) detecta el estado: `#check-menu:checked ~ .nav-list { right: 0; }`. Esto despliega el menú lateral.

---

## 5. Ventanas Modales (Acceso y Registro)
Los modales para **Login**, **Registro** y **Miembros** funcionan mediante la pseudo-clase `:target`.

*   **HTML:** Cada modal tiene un ID único (ej: `id="modal-registro"`). Los botones del menú son enlaces a esos IDs (`href="#modal-registro"`).
*   **Lógica CSS:**
    *   Por defecto, el modal tiene `visibility: hidden` y `opacity: 0`.
    *   Cuando el URL cambia a `index.html#modal-registro`, el CSS activa el estilo: `.modal-overlay:target { visibility: visible; opacity: 1; }`.
    *   **Cierre:** El botón de cerrar es un enlace a `#`. Al hacer clic, el target desaparece y el modal se oculta.

---

## 6. Diseño Responsivo (Media Queries)
Se han establecido puntos de interrupción (breakpoints) para asegurar que la página sea "Mobile First":
1.  **768px**: El menú horizontal desaparece, aparece la hamburguesa y las estadísticas pasan a una sola columna.
2.  **480px**: Los formularios modales ocupan el 100% del ancho y la navegación lateral cubre toda la pantalla para facilitar el uso táctil.

### Relación CSS:
```css
@media (max-width: 768px) {
    /* Estilos específicos para tablets y móviles */
}
```

---

## 7. Sección de Actividades (WIP)
Se integró un GIF dinámico para simular una carga de datos en tiempo real. Se aplicó una animación CSS de "palpitación" (`@keyframes palpitar`) al texto para mejorar la experiencia visual.

---

## 8. Miembros del Equipo
Se listaron los 7 integrantes dentro de un modal específico, utilizando bordes izquierdos de 4px en naranja para mantener la coherencia con el diseño de las tarjetas del Dashboard.

---
**Generado por el Equipo de Desarrollo - Grupo 01 (2026)**
