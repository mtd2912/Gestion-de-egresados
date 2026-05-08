document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const id_type = localStorage.getItem('rol');

    if (!token) {
        window.location.href = 'Index.html';
        return;
    }

    // 1. GET ALL (Resumido: Solo Nombre e ID)
    const contenedorLista = document.getElementById('contenedor_lista_faculties');
    if (contenedorLista) cargarFacultades(token, contenedorLista);

    // 2. POST (Solo Rol 1)
    const formCrear = document.getElementById('form_crear_faculty');
    if (formCrear) {
        if (id_type !== "1") document.getElementById('Crear_Faculty').style.display = 'none';
        configurarFormularioCrear(formCrear, token);
    }

    // 3. GET BY ID (Detallado)
    const formBuscar = document.getElementById('form_buscar_faculty');
    if (formBuscar) {
        formBuscar.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('id_search_faculty').value;
            await obtenerFacultadPorId(id, document.getElementById('resultado_busqueda_faculty'), token);
        });
    }

    // 4. PUT (Solo Rol 1)
    const formEditar = document.getElementById('form_editar_faculty');
    if (formEditar) {
        if (id_type !== "1") document.getElementById('editar_Faculty').style.display = 'none';
        configurarFormularioEditar(formEditar, token);
    }

    // 5. DELETE (Solo Rol 1)
    const formEliminar = document.getElementById('form_eliminar_faculty');
    if (formEliminar) {
        if (id_type !== "1") document.getElementById('Eliminar_Faculty').style.display = 'none';
        formEliminar.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('id_delete_faculty').value;
            ConfirmationModal.show({
                title: 'Eliminar Facultad',
                message: `¿Está seguro de que desea eliminar la facultad con ID ${id}?`,
                confirmText: 'Sí, eliminar',
                onConfirm: async () => {
                    await eliminarFacultad(id, token);
                }
            });
        });
    }
});

// --- FUNCIONES ---

async function cargarFacultades(token, contenedor) {
    LoadingSpinner.show('Cargando facultades...'); 
    try {
        const res = await fetch('https://egresados-cul.onrender.com/get_faculties', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
            const data = await res.json();
            contenedor.innerHTML = ""; // Limpiamos el contenedor

            if (data.length === 0) {
                contenedor.innerHTML = "<p>No hay facultades registradas.</p>";
                return;
            }

            // 1. Creamos la estructura de la tabla
            const tabla = document.createElement('table');
            tabla.className = 'tabla-pro'; // Usamos tu clase estándar
            tabla.innerHTML = `
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre de la Facultad</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody id="tbody-facultades"></tbody>
            `;
            contenedor.appendChild(tabla);

            const tbody = document.getElementById('tbody-facultades');

            // 2. Mapeamos los datos a las filas de la tabla
            data.forEach(f => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${f.id_faculty}</td>
                    <td><strong>${f.name}</strong></td>
                    <td>
                        <span class="${f.active !== false ? 'status-active' : 'status-inactive'}">
                            ${f.active !== false ? 'Activa' : 'Inactiva'}
                        </span>
                    </td>
                `;
                tbody.appendChild(fila);
            });

            // Inicializar DataTable
            setTimeout(() => {
                DatatableInitializer.init(tabla);
            }, 100);

        } else if (res.status === 401) {
            redireccionarAlLogin();
        } else {
            contenedor.innerHTML = "<p>Error al obtener los datos del servidor.</p>";
        }
    } catch (e) { 
        console.error("Error: ", e);
        Toast.error('Error al cargar facultades');
    } finally {
        LoadingSpinner.hide();
    }
}

async function obtenerFacultadPorId(id, contenedor, token) {
    try {
        const res = await fetch(`https://egresados-cul.onrender.com/get_faculty/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            const f = await res.json();
            contenedor.innerHTML = `
                <div style="background: #f4f4f4; padding: 15px; border-radius: 8px; border-left: 5px solid #6c757d;">
                    <p><strong>ID Facultad:</strong> ${f.id_faculty}</p>
                    <p><strong>Nombre:</strong> ${f.name}</p>
                    <p><strong>Estado:</strong> ${f.active ? 'Activa' : 'Inactiva'}</p>
                    <p><strong>Fecha Creación:</strong> ${f.creation_date}</p>
                    <p><strong>Última Actualización:</strong> ${f.update_date}</p>
                </div>
            `;
        } else { alert("Facultad no encontrada"); }
    } catch (e) { console.error(e); }
}

function configurarFormularioCrear(form, token) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            name: document.getElementById('name_C').value,
            active: true
        };
        enviarPeticion('https://egresados-cul.onrender.com/create_faculties', 'POST', data, token);
    });
}

function configurarFormularioEditar(form, token) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('id_edit_faculty').value;
        const data = {
            name: document.getElementById('name_E').value,
            active: document.getElementById('active_E').value === "true"
        };
        enviarPeticion(`https://egresados-cul.onrender.com/edit_faculty/${id}`, 'PUT', data, token);
    });
}

async function eliminarFacultad(id, token) {
    LoadingSpinner.show('Eliminando facultad...');
    try {
        const res = await fetch(`https://egresados-cul.onrender.com/delete_faculty/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) { 
            Toast.success("Facultad eliminada");
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
            location.reload(); 
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
            Toast.success("Operación completada exitosamente");
            setTimeout(() => location.reload(), 1500);
        } else {
            const err = await res.json();
            Toast.error("Error: " + (err.detail || "Fallo en la solicitud"));
        }
    } catch (e) { 
        Toast.error("Error de conexión");
        console.error(e);
    } finally {
        LoadingSpinner.hide();
    }
}