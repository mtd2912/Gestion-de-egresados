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
    const listaPG = document.getElementById('get_all_Programs');
    if (listaPG) {
        cargarProgramas(token, listaPG);
    }

    const formCrear = document.getElementById('form_crear_pg');
    if (formCrear) {
        if (id_type !== "1") {
            document.getElementById('Crear_Program').style.display = 'none';
        }
        configurarFormularioCrearPG(formCrear, token);
    }

    const formBuscar = document.getElementById('form_buscar');
    const contenedorIndividual = document.getElementById('resultado_busqueda');
    if (formBuscar) {
        formBuscar.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('id_search').value;
            await obtenerProgramaPorId(id, contenedorIndividual, token);
        });
    }

    const formEditar = document.getElementById('form_editar_pg');
    if (formEditar) {
        if (id_type !== "1") {
            document.getElementById('editar_Program').style.display = 'none';
        }
        configurarFormularioEditarPG(formEditar, token);
    }

    const formEliminar = document.getElementById('form_eliminar');
    if (formEliminar) {
        if (id_type !== "1") {
            document.getElementById('Eliminar_Program').style.display = 'none';
        }
        formEliminar.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('id_delete').value;
            ConfirmationModal.show({
                title: 'Eliminar Programa',
                message: '¿Está seguro de que desea eliminar este programa? Esta acción no se puede deshacer.',
                confirmText: 'Sí, eliminar',
                cancelText: 'Cancelar',
                onConfirm: async () => {
                    await eliminarPrograma(id, token);
                }
            });
        });
    }
});

// --- FUNCIONES ---

// 1. GET ALL
async function cargarProgramas(token, contenedor) {
    LoadingSpinner.show('Cargando programas...');
    try {
        const response = await fetch('https://egresados-cul.onrender.com/get_programs', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const programas = await response.json();
            contenedor.innerHTML = "";

            if (programas.length === 0) {
                contenedor.innerHTML = "<p>No hay programas registrados.</p>";
                return;
            }

            // 1. Creamos la estructura de la tabla
            const tabla = document.createElement('table');
            tabla.className = 'tabla-pro'; // Usamos la clase estándar que ya definimos
            tabla.innerHTML = `
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre del Programa</th>
                        <th>Facultad</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody id="tbody-programas"></tbody>
            `;
            contenedor.appendChild(tabla);

            const tbody = document.getElementById('tbody-programas');

            // 2. Insertamos las filas dinámicamente
            programas.forEach(p => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${p.id_program}</td>
                    <td><strong>${p.program_name}</strong></td>
                    <td>${p.faculty_name || 'Sin Facultad'}</td>
                    <td>
                        <span class="${p.active !== false ? 'status-active' : 'status-inactive'}">
                            ${p.active !== false ? 'Activo' : 'Inactivo'}
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
            contenedor.innerHTML = "<p>Error al cargar programas.</p>";
            Toast.error('Error al cargar programas');
        }
    } catch (e) { 
        console.error("Error:", e);
        Toast.error('Error de conexión');
    } finally {
        LoadingSpinner.hide();
    }
}

// 2. CREAR (Active implícito como true)
function configurarFormularioCrearPG(form, token) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const program_name = document.getElementById('program_name_C').value.trim();
        const faculty = document.getElementById('faculty_C').value;
        
        if (!program_name) {
            Toast.error('El nombre del programa es requerido');
            return;
        }
        
        if (!faculty || isNaN(faculty) || parseInt(faculty) <= 0) {
            Toast.error('El ID de facultad debe ser un número válido');
            return;
        }
        
        const data = {
            program_name: program_name,
            faculty: parseInt(faculty),
            active: true
        };
        
        enviarPeticionPG('https://egresados-cul.onrender.com/create_program', 'POST', data, token);
    });
}

// 3. GET BY ID
async function obtenerProgramaPorId(id, contenedor, token) {
    LoadingSpinner.show('Cargando Programas...'); 
    try {
        const response = await fetch(`https://egresados-cul.onrender.com/get_program/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            const p = await response.json();
            contenedor.innerHTML = `
                <div style="border: 1px solid #333; padding: 10px; margin-top: 10px;">
                    <p><strong>Nombre:</strong> ${p.program_name}</p>
                    <p><strong>Facultad (ID):</strong> ${p.faculty}</p>
                    <p><strong>Estado:</strong> ${p.active ? 'Activo' : 'Inactivo'}</p>
                </div>
            `;
            Toast.success('Programa encontrado');
        } else {
            Toast.error("Programa no encontrado");
        }
    } catch (e) { 
        Toast.error("Error de conexión");
    } finally {
        LoadingSpinner.hide();
    }
}

// 4. EDITAR
function configurarFormularioEditarPG(form, token) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const id = document.getElementById('id_edit').value;
        const program_name = document.getElementById('program_name_E').value.trim();
        const faculty = document.getElementById('faculty_E').value;
        const active = document.getElementById('active_E').value === "true";
        
        if (!id || isNaN(id) || parseInt(id) <= 0) {
            Toast.error('El ID del programa debe ser válido');
            return;
        }
        
        if (!program_name) {
            Toast.error('El nombre del programa es requerido');
            return;
        }
        
        if (!faculty || isNaN(faculty) || parseInt(faculty) <= 0) {
            Toast.error('El ID de facultad debe ser un número válido');
            return;
        }
        
        const data = {
            program_name: program_name,
            faculty: parseInt(faculty),
            active: active
        };
        
        enviarPeticionPG(`https://egresados-cul.onrender.com/edit_program/${id}`, 'PUT', data, token);
    });
}

// 5. ELIMINAR
async function eliminarPrograma(id, token) {
    LoadingSpinner.show('Eliminando programa...');
    try {
        const response = await fetch(`https://egresados-cul.onrender.com/delete_program/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            Toast.success("Programa eliminado exitosamente");
            setTimeout(() => location.reload(), 1500);
        } else {
            Toast.error("Error al eliminar el programa");
        }
    } catch (e) { 
        Toast.error("Error de conexión");
    } finally {
        LoadingSpinner.hide();
    }
}

// Función genérica para Programas
async function enviarPeticionPG(url, metodo, datos, token) {
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
            try {
                const err = await res.json();
                if (err.detail && Array.isArray(err.detail)) {
                    const mensajes = err.detail.map(d => `${d.loc?.join('.') || 'Campo'}: ${d.msg}`).join('\n');
                    Toast.error(mensajes);
                } else {
                    Toast.error(err.detail || "Error en la operación");
                }
            } catch (parseErr) {
                Toast.error("Error en la operación");
            }
        }
    } catch (e) { 
        Toast.error("Error de conexión: " + e.message);
    } finally {
        LoadingSpinner.hide();
    }
}
