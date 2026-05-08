/**
 * Validador de sesión - Previene acceso después de logout
 * Se ejecuta antes que otros scripts para evitar mostrar contenido no autorizado
 */

// Prevenir cacheo de páginas protegidas
(function() {
    // Agregar headers de no-cacheo
    const noCache = document.createElement('meta');
    noCache.httpEquiv = 'Cache-Control';
    noCache.content = 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0';
    document.head.appendChild(noCache);

    const pragma = document.createElement('meta');
    pragma.httpEquiv = 'Pragma';
    pragma.content = 'no-cache';
    document.head.appendChild(pragma);

    const expires = document.createElement('meta');
    expires.httpEquiv = 'Expires';
    expires.content = '0';
    document.head.appendChild(expires);

    // Validar sesión al cargar
    function validateSession() {
        const token = localStorage.getItem('token');
        const rol = localStorage.getItem('rol');
        const currentPath = window.location.pathname;
        
        // Lista de páginas que requieren autenticación
        const protectedPages = [
            'dashboard.html',
            'faculty.html',
            'academic_level.html',
            'employment_statuses.html',
            'sectors.html',
            'user_types.html',
            'programa.html',
            'jobs.html',
            'countinuing_education.html',
            'graduates.html',
            'contract_types.html',
            'job_offer.html',
            'job_offer_mostrar.html',
            'reports.html',
            'work_supervisor.html'
        ];

        // Verificar si la página actual está protegida
        const isProtected = protectedPages.some(page => currentPath.includes(page));

        if (isProtected && !token) {
            // Sin token, redirigir a login
            window.location.href = 'login.html';
            return false;
        }

        return true;
    }

    // Validar al cargar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', validateSession);
    } else {
        validateSession();
    }

    // Validar periódicamente (cada 30 segundos)
    setInterval(function() {
        const token = localStorage.getItem('token');
        const currentPath = window.location.pathname;
        
        const protectedPages = [
            'dashboard.html',
            'faculty.html',
            'academic_level.html',
            'employment_statuses.html',
            'sectors.html',
            'user_types.html',
            'programa.html',
            'jobs.html',
            'countinuing_education.html',
            'graduates.html',
            'contract_types.html',
            'job_offer.html',
            'job_offer_mostrar.html',
            'reports.html',
            'work_supervisor.html'
        ];

        const isProtected = protectedPages.some(page => currentPath.includes(page));
        
        if (isProtected && !token) {
            window.location.href = 'login.html';
        }
    }, 30000);

    // Detectar cambios en localStorage (logout desde otra pestaña)
    window.addEventListener('storage', function(e) {
        if (e.key === 'token' && !e.newValue) {
            // Token fue eliminado
            window.location.href = 'login.html';
        }
    });

    // Prevenir navegación hacia atrás a páginas sin sesión
    window.addEventListener('pageshow', function(event) {
        if (event.persisted) {
            // Página vino del cache (back button)
            const token = localStorage.getItem('token');
            const currentPath = window.location.pathname;
            
            const protectedPages = [
                'dashboard.html',
                'faculty.html',
                'academic_level.html',
                'employment_statuses.html',
                'sectors.html',
                'user_types.html',
                'programa.html',
                'jobs.html',
                'countinuing_education.html',
                'graduates.html',
                'contract_types.html',
                'job_offer.html',
                'job_offer_mostrar.html',
                'reports.html',
                'work_supervisor.html'
            ];

            const isProtected = protectedPages.some(page => currentPath.includes(page));
            
            if (isProtected && !token) {
                window.location.href = 'login.html';
            }
        }
    });
})();
