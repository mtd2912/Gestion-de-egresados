document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');

    // Validar token
    if (!token) {
        if (!window.location.pathname.includes('Index.html')) {
            window.location.href = 'Index.html';
        }
        return;
    }
    // Llamados de funciones
    const listaG = document.getElementById('get_all_Graduates');
    if (listaG) {
        cargarGraduados(token, listaG);
    }
    const formCrear = document.getElementById('form_crear_graduate');
    if (formCrear) {
        if (rol !== "1") {
            document.getElementById('Crear_Graduate').style.display = 'none';
        }
        configurarFormularioCrearG(formCrear, token);
    }

    const formBuscar = document.getElementById('form_buscar');
    const contenedorIndividual = document.getElementById('resultado_busqueda');
    if (formBuscar) {
        formBuscar.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('id_search').value;
            await obtenerGraduadoPorId(id, contenedorIndividual, token);
        });
    }

    const formEditar = document.getElementById('form_editar_g');
    if (formEditar) {
        if (rol !== "1") {
            document.getElementById('editar_Graduate').style.display = 'none';
        }
        configurarFormularioEditarG(formEditar, token);
    }

    const formEliminar = document.getElementById('form_eliminar');
    if (formEliminar) {
        if (rol !== "1") {
            document.getElementById('Eliminar_Graduate').style.display = 'none';
        }
        formEliminar.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('id_delete').value;
            ConfirmationModal.show({
                title: 'Eliminar Graduado',
                message: `¿Está seguro de que desea eliminar el graduado con ID ${id}?`,
                confirmText: 'Sí, eliminar',
                onConfirm: async () => {
                    await eliminarGraduado(id, token);
                }
            });
        });
    }
});

// --- FUNCIONES ---

// 1. GET ALL
async function cargarGraduados(token, contenedor) {
    LoadingSpinner.show('Cargando graduados...');
    try {
        const response = await fetch('https://egresados-cul.onrender.com/get_graduates', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const graduados = await response.json();
            contenedor.innerHTML = "";

            if (graduados.length === 0) {
                contenedor.innerHTML = "<p>No hay graduados registrados.</p>";
                LoadingSpinner.hide();
                return;
            }

            // 1. Creamos la estructura base de la tabla
            const tabla = document.createElement('table');
            tabla.className = 'tabla-graduados'; // Para tus estilos CSS
            tabla.innerHTML = `
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre Completo</th>
                        <th>Año de Graduación</th>
                        <th>Programa</th>
                        <th>Email</th>
                        <th>Empleabilidad</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody id="tbody-graduados"></tbody>
            `;
            contenedor.appendChild(tabla);

            const tbody = document.getElementById('tbody-graduados');

            // 2. Insertamos cada graduado como una fila (tr)
            graduados.forEach(g => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${g.id_graduate}</td>
                    <td>${g.first_name} ${g.last_name}</td>
                    <td>${g.graduation_year}</td>
                    <td>${g.program_name}</td>
                    <td>${g.email}</td>
                    <td>${g.employment_status}</td>
                    <td>${g.active ? '<span class="status-active">Activo</span>' : '<span class="status-inactive">Inactivo</span>'}</td>
                `;
                tbody.appendChild(fila);
            });

            // Inicializar DataTable
            setTimeout(() => {
                DatatableInitializer.init(tabla);
            }, 100);

        } else if (response.status === 401) {
            redireccionarAlLogin(); // Usando la función de seguridad que creamos antes
        } else {
            contenedor.innerHTML = "<p>No se pudieron cargar graduados.</p>";
        }
    } catch (e) { 
        console.error("Error:", e);
        Toast.error('Error al cargar graduados');
    } finally {
        LoadingSpinner.hide();
    }
}

// 2. CREAR (Active implícito como true)
function configurarFormularioCrearG(form, token) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            first_name: document.getElementById('first_name_C').value,
            last_name: document.getElementById('last_name_C').value,
            email: document.getElementById('email_C').value,
            phone: document.getElementById('phone_C').value,
            birth_date: document.getElementById('birth_date_C').value,
            graduation_year: parseInt(document.getElementById('graduation_year_C').value),
            id_level: parseInt(document.getElementById('id_level_C').value),
            id_status: parseInt(document.getElementById('id_status_C').value),
            id_program: parseInt(document.getElementById('id_program_C').value),
            active: true
        };
        enviarPeticionG('https://egresados-cul.onrender.com/create_graduates', 'POST', data, token);
    });
}

// 3. GET BY ID
async function obtenerGraduadoPorId(id, contenedor, token) {
    try {
        const response = await fetch(`https://egresados-cul.onrender.com/get_graduates/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            const g = await response.json();
            contenedor.innerHTML = `
                <div style="border: 1px solid #333; padding: 10px; margin-top: 10px;">
                    <p><strong>Nombre:</strong> ${g.first_name} ${g.last_name}</p>
                    <p><strong>Email:</strong> ${g.email}</p>
                    <p><strong>Teléfono:</strong> ${g.phone}</p>
                    <p><strong>Año de Graduación:</strong> ${g.graduation_year}</p>
                    <p><strong>Estado:</strong> ${g.active ? 'Activo' : 'Inactivo'}</p>
                </div>
            `;
        } else {
            alert("Graduado no encontrado");
        }
    } catch (e) { alert("Error de conexión"); }
}

// 4. EDITAR
function configurarFormularioEditarG(form, token) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('id_edit').value;
        const data = {
            first_name: document.getElementById('first_name_E').value,
            last_name: document.getElementById('last_name_E').value,
            email: document.getElementById('email_E').value,
            phone: document.getElementById('phone_E').value,
            birth_date: document.getElementById('birth_date_E').value,
            graduation_year: parseInt(document.getElementById('graduation_year_E').value),
            id_level: parseInt(document.getElementById('id_level_E').value),
            id_status: parseInt(document.getElementById('id_status_E').value),
            id_program: parseInt(document.getElementById('id_program_E').value),
            active: document.getElementById('active_E').value === "true"
        };
        enviarPeticionG(`https://egresados-cul.onrender.com/edit_graduates/${id}`, 'PUT', data, token);
    });
}

// 5. ELIMINAR
async function eliminarGraduado(id, token) {
    LoadingSpinner.show('Eliminando graduado...');
    try {
        // Obtener el nombre antes de eliminar para el correo
        let nombreCompleto = `ID ${id}`;
        try {
            const resNombre = await fetch(`https://egresados-cul.onrender.com/get_graduates/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (resNombre.ok) {
                const g = await resNombre.json();
                nombreCompleto = `${g.first_name ?? ''} ${g.last_name ?? ''}`.trim() || nombreCompleto;
            }
        } catch (_) { /* si falla, usamos el ID como fallback */ }

        const response = await fetch(`https://egresados-cul.onrender.com/delete_graduates/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            Toast.success("Graduado eliminado con éxito");
            // 📧 Notificación con nombre real
            EmailNotifier.notificarGraduadoEliminado({ id, nombre: nombreCompleto });
            setTimeout(() => location.reload(), 1500);
        } else {
            Toast.error("Error al eliminar");
        }
    } catch (e) { 
        Toast.error("Error de conexión");
        console.error(e);
    } finally {
        LoadingSpinner.hide();
    }
}

// Función genérica para Graduates
async function enviarPeticionG(url, metodo, datos, token) {
    LoadingSpinner.show('Procesando solicitud...');
    try {
        const res = await fetch(url, {
            method: metodo,
            headers: { 
                'Authorization': `Bearer ${token}`, 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(datos)
        });
        if (res.ok) {
            Toast.success("Operación completada exitosamente");
            // 📧 Notificación según el método HTTP
            if (metodo === 'POST') {
                EmailNotifier.notificarGraduadoCreado({
                    nombre: `${datos.first_name ?? ''} ${datos.last_name ?? ''}`.trim(),
                    email:  datos.email,
                    programa: `ID ${datos.id_program}`,
                    anio: datos.graduation_year,
                });
            } else if (metodo === 'PUT') {
                const idEd = url.split('/').pop();
                EmailNotifier.notificarGraduadoEditado({
                    id: idEd,
                    nombre: `${datos.first_name ?? ''} ${datos.last_name ?? ''}`.trim(),
                    camposModificados: Object.keys(datos).join(', '),
                });
            }
            setTimeout(() => location.reload(), 1500);
        } else {
            const err = await res.json();
            Toast.error("Error: " + (err.detail || "Fallo en la operación"));
        }
    } catch (e) { 
        Toast.error("Error de conexión");
        console.error(e);
    } finally {
        LoadingSpinner.hide();
    }
}