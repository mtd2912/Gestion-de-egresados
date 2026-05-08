document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.querySelector('.eye-icon');
    const btnLogin = document.querySelector('.btn-login');
    const mensajeDiv = document.getElementById('mensaje');

    // Toggle password visibility
    if (togglePasswordBtn && passwordInput && eyeIcon) {
        togglePasswordBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            if (isPassword) {
                eyeIcon.src = '../img/png/dont_see.png';
                eyeIcon.alt = 'Ocultar';
            } else {
                eyeIcon.src = '../img/png/see.png';
                eyeIcon.alt = 'Ver';
            }
        });
    }

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);

        // Agregar animación de carga
        //LoadingSpinner.show('Iniciando sesión...');
        btnLogin.classList.add('loading');
        btnLogin.disabled = true;

        try {
            const response = await fetch('https://egresados-cul.onrender.com/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.clear();
                localStorage.setItem('token', data.access_token);
                localStorage.setItem('rol', String(data.rol));
                localStorage.setItem('email', username);
                //Toast.success('¡Login exitoso! Redirigiendo...');
                setTimeout(() => {
                    if (data.rol === 3) {
                        window.location.href = 'job_offer_mostrar.html';
                    }
                    else {
                        window.location.href = 'dashboard.html';
                    }
                }, 1500);

            } else {
                Toast.error(data.detail || "Error en el inicio de sesión");
                btnLogin.classList.remove('loading');
                btnLogin.disabled = false;
                LoadingSpinner.hide();
            }
        } catch (error) {
            console.error("Error de conexión:", error);
            Toast.error("No se pudo conectar con el servidor.");
            btnLogin.classList.remove('loading');
            btnLogin.disabled = false;
            LoadingSpinner.hide();
        }
    });
});