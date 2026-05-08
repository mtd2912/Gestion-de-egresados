document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const id_type = localStorage.getItem('rol');

    // Validar token
    if (!token) {
        if (!window.location.pathname.includes('Index.html')) {
            window.location.href = 'Index.html';
        }
        return;
    }

    // Llamados de funciones
    const listaWS = document.getElementById('get_all_Supervisors');
    if (listaWS) {
        cargarSupervisores(token, listaWS);
    }

    const formCrear = document.getElementById('form_crear_supervisor');
    if (formCrear) {
        if (id_type !== "1") {
            document.getElementById('Crear_Supervisor').style.display = 'none';
        }
        configurarFormularioCrearWS(formCrear, token);
    }

    const formBuscar = document.getElementById('form_buscar');
    const contenedorIndividual = document.getElementById('resultado_busqueda');
    if (formBuscar) {
        formBuscar.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('id_search').value;
            await obtenerSupervisorPorId(id, contenedorIndividual, token);
        });
    }

    const formEditar = document.getElementById('form_editar_ws');
    if (formEditar) {
        if (id_type !== "1") {
            document.getElementById('editar_Supervisor').style.display = 'none';
        }
        configurarFormularioEditarWS(formEditar, token);
    }

    const formEliminar = document.getElementById('form_eliminar');
    if (formEliminar) {
        if (id_type !== "1") {
            document.getElementById('Eliminar_Supervisor').style.display = 'none';
        }
        formEliminar.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('id_delete').value;
            ConfirmationModal.show({
                title: 'Eliminar Supervisor',
                message: '¿Está seguro de que desea eliminar este supervisor? Esta acción no se puede deshacer.',
                confirmText: 'Sí, eliminar',
                cancelText: 'Cancelar',
                onConfirm: async () => {
                    await eliminarSupervisor(id, token);
                }
            });
        });
    }
});

// --- FUNCIONES ---

// 1. GET ALL
async function cargarSupervisores(token, contenedor) {
    LoadingSpinner.show('Cargando supervisores de trabajo...');
    try {
        const response = await fetch('https://egresados-cul.onrender.com/get_all_work_supervisor', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const supervisores = await response.json();
            contenedor.innerHTML = "";

            if (supervisores.length === 0) {
                contenedor.innerHTML = "<p>No hay supervisores registrados.</p>";
                return;
            }

            // 1. Creamos la estructura de la tabla profesional
            const tabla = document.createElement('table');
            tabla.className = 'tabla-pro'; 
            tabla.innerHTML = `
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre del Supervisor</th>
                        <th>Contacto</th>
                        <th>Programa</th>
                        <th>Empresa</th>
                    </tr>
                </thead>
                <tbody id="tbody-supervisores"></tbody>
            `;
            contenedor.appendChild(tabla);

            const tbody = document.getElementById('tbody-supervisores');

            // 2. Llenamos la tabla con los datos
            supervisores.forEach(s => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${s.id_supervisor}</td>
                    <td><strong>${s.first_name} ${s.last_name}</strong></td>
                    <td>${s.contact_job || 'Sin contacto'}</td>
                    <td><span class="badge-info">${s.program_name}</span></td>
                    <td><span class="badge-info">${s.job_company}</span></td>
                `;
                tbody.appendChild(fila);
            });

            // Inicializar DataTable
            setTimeout(() => {
                DatatableInitializer.init(tabla);
            }, 100);

        } else if (response.status === 401) {
            redireccionarAlLogin();
        } else {
            contenedor.innerHTML = "<p>Error al cargar supervisores.</p>";
            Toast.error('Error al cargar supervisores');
        }
    } catch (e) { 
        console.error("Error:", e);
        Toast.error('Error de conexión');
    } finally {
        LoadingSpinner.hide();
    }
}

// 2. CREAR (Active implícito como true)
function configurarFormularioCrearWS(form, token) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            id_program: parseInt(document.getElementById('id_program_C').value),
            frist_name: document.getElementById('first_name_C').value, // Mapea al campo 'frist_name' del modelo
            last_name: document.getElementById('last_name_C').value,
            id_graduate: parseInt(document.getElementById('id_graduate_C').value),
            id_job: parseInt(document.getElementById('id_job_C').value),
            contact_job: document.getElementById('contact_job_C').value,
            active: true
        };
        enviarPeticionWS('https://egresados-cul.onrender.com/create_work_supervisor', 'POST', data, token);
    });
}

// 3. GET BY ID
async function obtenerSupervisorPorId(id, contenedor, token) {
    LoadingSpinner.show('Buscando supervisor...');
    try {
        const response = await fetch(`https://egresados-cul.onrender.com/get_work_supervisor/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            const s = await response.json();
            contenedor.innerHTML = `
                <div style="border: 1px solid #333; padding: 10px; margin-top: 10px;">
                    <p><strong>Nombre completo:</strong> ${s.frist_name} ${s.last_name}</p>
                    <p><strong>Programa (ID):</strong> ${s.id_program}</p>
                    <p><strong>Contacto:</strong> ${s.contact_job}</p>
                    <p><strong>Estado:</strong> ${s.active ? 'Activo' : 'Inactivo'}</p>
                </div>
            `;
            Toast.success('Supervisor encontrado');
        } else {
            Toast.error("Supervisor no encontrado");
        }
    } catch (e) { 
        Toast.error("Error de conexión");
    } finally {
        LoadingSpinner.hide();
    }
}

// 4. EDITAR
function configurarFormularioEditarWS(form, token) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('id_edit').value;
        const data = {
            id_program: parseInt(document.getElementById('id_program_E').value),
            frist_name: document.getElementById('first_name_E').value,
            last_name: document.getElementById('last_name_E').value,
            id_graduate: parseInt(document.getElementById('id_graduate_E').value),
            id_job: parseInt(document.getElementById('id_job_E').value),
            contact_job: document.getElementById('contact_job_E').value,
            active: document.getElementById('active_E').value === "true"
        };
        enviarPeticionWS(`https://egresados-cul.onrender.com/edit_work_supervisor/${id}`, 'PUT', data, token);
    });
}

// 5. ELIMINAR
async function eliminarSupervisor(id, token) {
    LoadingSpinner.show('Eliminando supervisor...');
    try {
        const response = await fetch(`https://egresados-cul.onrender.com/delete_work_supervisor/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            Toast.success("Supervisor eliminado exitosamente");
            setTimeout(() => location.reload(), 1500);
        } else {
            Toast.error("Error al eliminar");
        }
    } catch (e) { 
        Toast.error("Error de conexión");
    } finally {
        LoadingSpinner.hide();
    }
}

// Función genérica
async function enviarPeticionWS(url, metodo, datos, token) {
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
            setTimeout(() => location.reload(), 1500);
        } else {
            const err = await res.json();
            Toast.error("Error: " + (err.detail || "Operación fallida"));
        }
    } catch (e) { 
        Toast.error("Error de conexión");
    } finally {
        LoadingSpinner.hide();
    }
}
