/**
 * Control de acceso basado en id_type
 * Solo egresados (id_type=3) son redirigidos a job_offer_mostrar.html
 * Admin (1) y Administrativo (2) pueden ver TODO
 */

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');
    const currentPath = window.location.pathname;

    // Si no hay token, redirigir a login (esto lo maneja session-validator)
    if (!token) return;

    // Páginas de egresados (SOLO para id_type 3)
    const graduatesPages = [
        'job_offer_mostrar.html'
    ];

    // Si es egresado (id_type=3), solo puede ver job_offer_mostrar.html
    if (rol === "3") {
        // Si está en cualquier otra página que no sea job_offer_mostrar.html, redirigir
        const isGraduatesPage = graduatesPages.some(page => currentPath.includes(page));
        if (!isGraduatesPage) {
            window.location.href = 'job_offer_mostrar.html';
            return;
        }
    }
});

// Detectar cambios en la sesión desde otra pestaña
window.addEventListener('storage', (e) => {
    if (e.key === 'token' && !e.newValue) {
        // Token fue removido en otra pestaña
        window.location.href = 'login.html';
    }
});


