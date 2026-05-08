// Interceptor global para manejar expiración de token
// Verifica la expiración del token antes de hacer peticiones

// Función para decodificar JWT y obtener el tiempo de expiración
function obtenerTiempoExpiracionToken(token) {
    try {
        const payload = token.split('.')[1];
        const decoded = JSON.parse(atob(payload));
        return decoded.exp ? decoded.exp * 1000 : null; // Convertir a milisegundos
    } catch (error) {
        console.error('Error al decodificar token:', error);
        return null;
    }
}

// Función para redirigir al login
function redirigirAlLogin(razón) {
    console.warn(`Token expirado (${razón}). Redirigiendo al login...`);
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('email');
    window.location.href = 'login.html';
}

// Verificar expiración del token antes de hacer peticiones
function verificarExpiracionToken() {
    const token = localStorage.getItem('token');
    if (!token) return true; // Sin token, seguir
    
    const tiempoExpiracion = obtenerTiempoExpiracionToken(token);
    if (!tiempoExpiracion) return true; // No se pudo decodificar
    
    const ahora = Date.now();
    const tiempoRestante = tiempoExpiracion - ahora;
    
    // Si el token ya expiró
    if (tiempoRestante <= 0) {
        redirigirAlLogin('expiración detected');
        return false;
    }
    
    return true; // Token válido
}

// Verificar token cada segundo
setInterval(() => {
    verificarExpiracionToken();
}, 1000);

// Interceptar fetch para verificar token antes y manejar 401
const originalFetch = window.fetch;

window.fetch = function(...args) {
    // Verificar expiración antes de hacer la petición
    if (!verificarExpiracionToken()) {
        return Promise.reject(new Error('Token expirado'));
    }
    
    return originalFetch.apply(this, args)
        .then(response => {
            // Si el servidor responde con 401, también redirige
            if (response.status === 401) {
                redirigirAlLogin('respuesta del servidor');
                return response;
            }
            return response;
        })
        .catch(error => {
            console.error('Error en la petición:', error);
            throw error;
        });
};