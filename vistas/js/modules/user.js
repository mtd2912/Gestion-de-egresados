document.addEventListener('DOMContentLoaded', () => {
    const formCrear = document.getElementById('form_crear_user');

    if (formCrear) {
        formCrear.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Captura de datos del formulario
            const data = {
                first_name: document.getElementById('first_name_C').value,
                last_name: document.getElementById('last_name_C').value,
                email: document.getElementById('email_C').value,
                password: document.getElementById('password_C').value,
                id_type: 3, // Valor fijo solicitado
                active: true // Valor fijo solicitado
            };

            console.log("Enviando datos de registro:", data);
            
            // Llamada a la función para enviar la petición
            await registrarUsuario(data);
        });
    }
});
/**
 * Envía la petición POST al servidor para registrar el usuario
 * @param {Object} datos - Objeto con la información del usuario
 */
async function registrarUsuario(datos) {
    LoadingSpinner.show('Registrando usuario...');
    try {
        const response = await fetch('https://egresados-cul.onrender.com/create_user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                // No incluimos Authorization aquí porque suele ser un registro abierto
            },
            body: JSON.stringify(datos)
        });

        if (response.ok) {
            Toast.success("Usuario registrado con éxito.");
            // 📧 Notificar al admin y al nuevo usuario
            EmailNotifier.notificarUsuarioRegistrado({
                nombre: `${datos.first_name} ${datos.last_name}`,
                email:  datos.email,
                tipo:   `ID Tipo: ${datos.id_type}`,
            });
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        } else {
            const errorData = await response.json();
            // Mostramos el detalle del error que devuelve FastAPI (error 422, 400, etc)
            Toast.error("Error al registrar: " + (errorData.detail || "Fallo en la operación"));
            console.error("Detalle del error:", errorData);
        }
    } catch (error) {
        console.error("Error de conexión:", error);
        Toast.error("No se pudo conectar con el servidor. Verifica que la API esté activa.");
    } finally {
        LoadingSpinner.hide();
    }
}