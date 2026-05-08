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
    const listaJobs = document.getElementById('get_all_Jobs');
    if (listaJobs) {
        cargarEmpleos(token, listaJobs);
    }

    const formCrear = document.getElementById('form_crear_job');
    if (formCrear) {
        if (id_type !== "1") {
            document.getElementById('Crear_Job').style.display = 'none';
        }
        configurarFormularioCrearJob(formCrear, token);
    }

    const formBuscar = document.getElementById('form_buscar');
    const contenedorIndividual = document.getElementById('resultado_busqueda');
    if (formBuscar) {
        formBuscar.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('id_search').value;
            await obtenerEmpleoPorId(id, contenedorIndividual, token);
        });
    }

    const formEditar = document.getElementById('form_editar_j');
    if (formEditar) {
        if (id_type !== "1") {
            document.getElementById('editar_Job').style.display = 'none';
        }
        configurarFormularioEditarJob(formEditar, token);
    }

    const formEliminar = document.getElementById('form_eliminar');
    if (formEliminar) {
        if (id_type !== "1") {
            document.getElementById('Eliminar_Job').style.display = 'none';
        }
        formEliminar.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('id_delete').value;
            // Mostrar modal de confirmación en lugar de directo
            ConfirmationModal.show({
                title: 'Eliminar Empleo',
                message: `¿Está seguro de que desea eliminar el empleo con ID ${id}?`,
                confirmText: 'Sí, eliminar',
                onConfirm: async () => {
                    await eliminarEmpleo(id, token);
                }
            });
        });
    }
});

// --- FUNCIONES ---

// 1. GET ALL
async function cargarEmpleos(token, contenedor) {
    LoadingSpinner.show('Cargando empleos...');
    try {
        const response = await fetch('https://egresados-cul.onrender.com/get_jobs', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const empleos = await response.json();
            contenedor.innerHTML = "";

            if (empleos.length === 0) {
                contenedor.innerHTML = "<p>No hay empleos registrados.</p>";
                LoadingSpinner.hide();
                return;
            }

            // 1. Crear la estructura de la tabla
            const tabla = document.createElement('table');
            tabla.className = 'tabla-pro'; // Clase para aplicar los estilos de index.css o los nuevos
            tabla.innerHTML = `
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Empresa</th>
                        <th>Cargo</th>
                        <th>Sector</th>
                        <th>Contrato</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody id="tbody-empleos"></tbody>
            `;
            contenedor.appendChild(tabla);

            const tbody = document.getElementById('tbody-empleos');

            // 2. Llenar la tabla con los datos
            empleos.forEach(j => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${j.id_job}</td>
                    <td>${j.company}</td>
                    <td>${j.position}</td>
                    <td>${j.sector_name || 'N/A'}</td>
                    <td>${j.contract_name || 'N/A'}</td>
                    <td>
                        <span class="${j.active ? 'status-active' : 'status-inactive'}">
                            ${j.active ? 'Activo' : 'Inactivo'}
                        </span>
                    </td>
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
            contenedor.innerHTML = "<p>Error al cargar empleos.</p>";
        }
    } catch (e) { 
        console.error("Error:", e);
        Toast.error('Error al cargar empleos');
    } finally {
        LoadingSpinner.hide();
    }
}

// 2. CREAR (Active implícito como true)
function configurarFormularioCrearJob(form, token) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            id_graduate: parseInt(document.getElementById('id_graduate_C').value),
            company: document.getElementById('company_C').value,
            id_sector: parseInt(document.getElementById('id_sector_C').value),
            position: document.getElementById('position_C').value,
            salary: parseFloat(document.getElementById('salary_C').value),
            start_date: document.getElementById('start_date_C').value,
            end_date: document.getElementById('end_date_C').value || null, // Permite nulo si sigue trabajando allí
            id_type: parseInt(document.getElementById('id_type_C').value),
            related_to_career: document.getElementById('related_to_career_C').value === "true",
            active: true
        };
        enviarPeticionJob('https://egresados-cul.onrender.com/create_job', 'POST', data, token);
    });
}
// 3. GET BY ID
async function obtenerEmpleoPorId(id, contenedor, token) {
    try {
        const response = await fetch(`https://egresados-cul.onrender.com/get_job/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            const j = await response.json();
            contenedor.innerHTML = `
                <div style="border: 1px solid #333; padding: 10px; margin-top: 10px;">
                    <p><strong>Empresa:</strong> ${j.company}</p>
                    <p><strong>Cargo:</strong> ${j.position}</p>
                    <p><strong>Salario:</strong> $${j.salary}</p>
                    <p><strong>Relacionado a carrera:</strong> ${j.related_to_career ? 'Sí' : 'No'}</p>
                </div>
            `;
        } else {
            alert("Empleo no encontrado");
        }
    } catch (e) { alert("Error de conexión"); }
}

// 4. EDITAR
function configurarFormularioEditarJob(form, token) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('id_edit').value;
        const data = {
            id_graduate: parseInt(document.getElementById('id_graduate_E').value),
            company: document.getElementById('company_E').value,
            id_sector: parseInt(document.getElementById('id_sector_E').value),
            position: document.getElementById('position_E').value,
            salary: parseFloat(document.getElementById('salary_E').value),
            start_date: document.getElementById('start_date_E').value,
            end_date: document.getElementById('end_date_E').value || null,
            id_type: parseInt(document.getElementById('id_type_E').value),
            related_to_career: document.getElementById('related_to_career_E').value === "true",
            active: document.getElementById('active_E').value === "true"
        };
        enviarPeticionJob(`https://egresados-cul.onrender.com/edit_job/${id}`, 'PUT', data, token);
    });
}

// 5. ELIMINAR
async function eliminarEmpleo(id, token) {
    LoadingSpinner.show('Eliminando empleo...');
    try {
        const response = await fetch(`https://egresados-cul.onrender.com/delete_job/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            Toast.success("Empleo eliminado con éxito");
            setTimeout(() => location.reload(), 1500);
        } else {
            Toast.error("Error al eliminar el empleo");
        }
    } catch (e) { 
        Toast.error("Error de conexión");
        console.error(e);
    } finally {
        LoadingSpinner.hide();
    }
}

// Función genérica para Jobs
async function enviarPeticionJob(url, metodo, datos, token) {
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
            Toast.error("Error: " + (err.detail || "Fallo en la operación"));
        }
    } catch (e) { 
        Toast.error("Error de conexión");
        console.error(e);
    } finally {
        LoadingSpinner.hide();
    }
}
