document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const id_type = localStorage.getItem('rol');

    if (!token) {
        window.location.href = 'Index.html';
        return;
    }

    // 1. GET ALL (Resumido)
    const contenedorLista = document.getElementById('contenedor_lista_statuses');
    if (contenedorLista) cargarEstados(token, contenedorLista);

    // 2. POST (Solo Rol 1)
    const formCrear = document.getElementById('form_crear_status');
    if (formCrear) {
        if (id_type !== "1") document.getElementById('Crear_Status').style.display = 'none';
        configurarFormularioCrear(formCrear, token);
    }

    // 3. GET BY ID (Detallado)
    const formBuscar = document.getElementById('form_buscar_status');
    if (formBuscar) {
        formBuscar.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('id_search_status').value;
            await obtenerEstadoPorId(id, document.getElementById('resultado_busqueda_status'), token);
        });
    }

    // 4. PUT (Solo Rol 1)
    const formEditar = document.getElementById('form_editar_status');
    if (formEditar) {
        if (id_type !== "1") document.getElementById('editar_Status').style.display = 'none';
        configurarFormularioEditar(formEditar, token);
    }

    // 5. DELETE (Solo Rol 1)
    const formEliminar = document.getElementById('form_eliminar_status');
    if (formEliminar) {
        if (id_type !== "1") document.getElementById('Eliminar_Status').style.display = 'none';
        formEliminar.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('id_delete_status').value;
            ConfirmationModal.show({
                title: 'Eliminar Estado Laboral',
                message: '¿Está seguro de que desea eliminar este estado? Esta acción no se puede deshacer.',
                confirmText: 'Sí, eliminar',
                cancelText: 'Cancelar',
                onConfirm: async () => {
                    await eliminarEstado(id, token);
                }
            });
        });
    }
});

// --- FUNCIONES ---

async function cargarEstados(token, contenedor) {
    LoadingSpinner.show('Cargando estados laborales...');
    try {
        const res = await fetch('https://egresados-cul.onrender.com/get_employment_statuses', {
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (res.ok) {
            const data = await res.json();
            contenedor.innerHTML = ""; // Limpiamos el contenedor

            if (data.length === 0) {
                contenedor.innerHTML = "<p>No hay estados laborales registrados.</p>";
                return;
            }

            // 1. Creamos la estructura de la tabla con la clase estándar tabla-pro
            const tabla = document.createElement('table');
            tabla.className = 'tabla-pro'; 
            tabla.innerHTML = `
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Descripción del Estado</th>
                        <th>Estado del Registro</th>
                    </tr>
                </thead>
                <tbody id="tbody-estados"></tbody>
            `;
            contenedor.appendChild(tabla);

            const tbody = document.getElementById('tbody-estados');

            // 2. Mapeamos los datos a las filas de la tabla
            data.forEach(s => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${s.id_status}</td>
                    <td><strong>${s.description}</strong></td>
                    <td>
                        <span class="${s.active !== false ? 'status-active' : 'status-inactive'}">
                            ${s.active !== false ? 'Habilitado' : 'Deshabilitado'}
                        </span>
                    </td>
                `;
                tbody.appendChild(fila);
            });

            // Inicializar DataTable
            setTimeout(() => {
                DatatableInitializer.init(tabla);
            }, 100);

            Toast.success('Estados cargados exitosamente');

        } else if (res.status === 401) {
            // Seguridad: Redirección automática si el token expiró
            redireccionarAlLogin();
        } else {
            contenedor.innerHTML = "<p>Error al obtener los estados desde el servidor.</p>";
            Toast.error('Error al cargar estados laborales');
        }
    } catch (e) { 
        console.error("Error cargando estados:", e);
        Toast.error('Error de conexión con el servidor');
    } finally {
        LoadingSpinner.hide();
    }
}

async function obtenerEstadoPorId(id, contenedor, token) {
    LoadingSpinner.show('Buscando estado...');
    try {
        const res = await fetch(`https://egresados-cul.onrender.com/get_employment_status/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            const s = await res.json();
            contenedor.innerHTML = `
                    <p><strong>ID Estado:</strong> ${s.id_status}</p>
                    <p><strong>Descripción:</strong> ${s.description}</p>
                    <p><strong>Activo:</strong> ${s.active ? 'Sí' : 'No'}</p>
                    <p><strong>Fecha Creación:</strong> ${s.creation_date}</p>
                    <p><strong>Última Actualización:</strong> ${s.update_date}</p>
                </div>
            `;
            Toast.success('Estado encontrado');
        } else { 
            Toast.error("Estado no encontrado");
        }
    } catch (e) { 
        console.error(e);
        Toast.error('Error de conexión');
    } finally {
        LoadingSpinner.hide();
    }
}

function configurarFormularioCrear(form, token) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            description: document.getElementById('description_C').value,
            active: true
        };
        enviarPeticion('https://egresados-cul.onrender.com/create_employment_status', 'POST', data, token);
    });
}

function configurarFormularioEditar(form, token) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('id_edit_status').value;
        const data = {
            description: document.getElementById('description_E').value,
            active: document.getElementById('active_E').value === "true"
        };
        enviarPeticion(`https://egresados-cul.onrender.com/edit_employment_status/${id}`, 'PUT', data, token);
    });
}

async function eliminarEstado(id, token) {
    LoadingSpinner.show('Eliminando estado...');
    try {
        const res = await fetch(`https://egresados-cul.onrender.com/delete_employment_status/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) { 
            Toast.success("Estado eliminado exitosamente");
            setTimeout(() => location.reload(), 1500);
        } else {
            Toast.error('Error al eliminar el estado');
        }
    } catch (e) { 
        Toast.error("Error de conexión");
    } finally {
        LoadingSpinner.hide();
    }
}

async function enviarPeticion(url, metodo, datos, token) {
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
            Toast.success("Operación realizada exitosamente");
            setTimeout(() => location.reload(), 1500);
        } else {
            const err = await res.json();
            Toast.error("Error: " + (err.detail || "Fallo en la operación"));
        }
    } catch (e) { 
        Toast.error("Error de conexión");
    } finally {
        LoadingSpinner.hide();
    }
}