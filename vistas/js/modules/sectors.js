document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const id_type = localStorage.getItem('rol');

    if (!token) {
        window.location.href = 'Index.html';
        return;
    }

    // 1. Cargar lista resumida
    const contenedorLista = document.getElementById('contenedor_lista_sectors');
    if (contenedorLista) cargarSectores(token, contenedorLista);

    // 2. Configurar creación (Solo Admin)
    const formCrear = document.getElementById('form_crear_sector');
    if (formCrear) {
        if (id_type !== "1") document.getElementById('Crear_Sector').style.display = 'none';
        configurarFormularioCrear(formCrear, token);
    }

    // 3. Configurar búsqueda detallada
    const formBuscar = document.getElementById('form_buscar_sector');
    if (formBuscar) {
        formBuscar.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('id_search_sector').value;
            await obtenerSectorPorId(id, document.getElementById('resultado_busqueda_sector'), token);
        });
    }

    // 4. Configurar edición (Solo Admin)
    const formEditar = document.getElementById('form_editar_sector');
    if (formEditar) {
        if (id_type !== "1") document.getElementById('editar_Sector').style.display = 'none';
        configurarFormularioEditar(formEditar, token);
    }

    // 5. Configurar eliminación (Solo Admin)
    const formEliminar = document.getElementById('form_eliminar_sector');
    if (formEliminar) {
        if (id_type !== "1") document.getElementById('Eliminar_Sector').style.display = 'none';
        formEliminar.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('id_delete_sector').value;
            ConfirmationModal.show({
                title: 'Eliminar Sector',
                message: `¿Está seguro de que desea eliminar el sector con ID ${id}?`,
                confirmText: 'Sí, eliminar',
                onConfirm: async () => {
                    await eliminarSector(id, token);
                }
            });
        });
    }
});

// --- FUNCIONES API ---

async function cargarSectores(token, contenedor) {
    LoadingSpinner.show('Cargando sectores...');
    try {
        const res = await fetch('https://egresados-cul.onrender.com/get_sectors', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
            const data = await res.json();
            contenedor.innerHTML = ""; // Limpiamos el contenedor del mensaje "Cargando..."

            if (data.length === 0) {
                contenedor.innerHTML = "<p>No hay sectores registrados.</p>";
                return;
            }

            // 1. Creamos la estructura de la tabla con la clase estándar tabla-pro
            const tabla = document.createElement('table');
            tabla.className = 'tabla-pro'; 
            tabla.innerHTML = `
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre del Sector</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody id="tbody-sectores"></tbody>
            `;
            contenedor.appendChild(tabla);

            const tbody = document.getElementById('tbody-sectores');

            // 2. Mapeamos los sectores a las filas de la tabla
            data.forEach(s => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${s.id_sector}</td>
                    <td><strong>${s.name}</strong></td>
                    <td>
                        <span class="${s.active !== false ? 'status-active' : 'status-inactive'}">
                            ${s.active !== false ? 'Activo' : 'Inactivo'}
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
            // Si el token expiró (seguridad que implementamos al inicio)
            redireccionarAlLogin();
        } else {
            contenedor.innerHTML = "<p>Error al obtener los sectores desde el servidor.</p>";
        }
    } catch (e) { 
        console.error("Error cargando sectores:", e);
        Toast.error('Error al cargar sectores');
    } finally {
        LoadingSpinner.hide();
    }
}

async function obtenerSectorPorId(id, contenedor, token) {
    try {
        const res = await fetch(`https://egresados-cul.onrender.com/get_sector/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            const s = await res.json();
            contenedor.innerHTML = `
                <div style="background: #f8f9fa; padding: 15px; border-left: 5px solid #17a2b8;">
                    <p><strong>ID Sector:</strong> ${s.id_sector}</p>
                    <p><strong>Nombre:</strong> ${s.name}</p>
                    <p><strong>Estado:</strong> ${s.active ? 'Activo' : 'Inactivo'}</p>
                    <p><strong>Creado el:</strong> ${s.creation_date}</p>
                    <p><strong>Actualizado el:</strong> ${s.update_date}</p>
                </div>
            `;
        } else { alert("Sector no encontrado"); }
    } catch (e) { console.error(e); }
}

function configurarFormularioCrear(form, token) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            name: document.getElementById('name_C').value,
            active: true
        };
        enviarPeticion('https://egresados-cul.onrender.com/create_sector', 'POST', data, token);
    });
}

function configurarFormularioEditar(form, token) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('id_edit_sector').value;
        const data = {
            name: document.getElementById('name_E').value,
            active: document.getElementById('active_E').value === "true"
        };
        enviarPeticion(`https://egresados-cul.onrender.com/edit_sector/${id}`, 'PUT', data, token);
    });
}

async function eliminarSector(id, token) {
    LoadingSpinner.show('Eliminando sector...');
    try {
        const res = await fetch(`https://egresados-cul.onrender.com/delete_sector/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) { 
            Toast.success("Sector eliminado");
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
