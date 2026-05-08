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
    const listaAL = document.getElementById('get_all_AcademicLevels');
    if (listaAL) {
        cargarNivelesAcademicos(token, listaAL);
    }

    const formCrear = document.getElementById('form_crear_al');
    if (formCrear) {
        configurarFormularioCrearAL(formCrear, token);
    }

    const formBuscar = document.getElementById('form_buscar');
    const contenedorIndividual = document.getElementById('resultado_busqueda');
    if (formBuscar) {
        formBuscar.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('id_search').value;
            await obtenerNivelPorId(id, contenedorIndividual, token);
        });
    }

    const formEditar = document.getElementById('form_editar_al');
    if (formEditar) {
        if (id_type !== "1") {
            document.getElementById('editar_AcademicLevel').style.display = 'none';
        }
        configurarFormularioEditarAL(formEditar, token);
    }

    const formEliminar = document.getElementById('form_eliminar');
    if (formEliminar) {
        if (id_type !== "1") {
            document.getElementById('Eliminar_AcademicLevel').style.display = 'none';
        }
        formEliminar.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('id_delete').value;
            ConfirmationModal.show({
                title: 'Eliminar Nivel Académico',
                message: '¿Está seguro de que desea eliminar este nivel académico? Esta acción no se puede deshacer.',
                confirmText: 'Sí, eliminar',
                cancelText: 'Cancelar',
                onConfirm: async () => {
                    await eliminarNivelAcademico(id, token);
                }
            });
        });
    }
});

// --- FUNCIONES ---

// 1. GET ALL
async function cargarNivelesAcademicos(token, contenedor) {
    LoadingSpinner.show('Cargando niveles académicos...');
    try {
        const response = await fetch('https://egresados-cul.onrender.com/get_academic_levels', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const niveles = await response.json();
            contenedor.innerHTML = "";

            if (niveles.length === 0) {
                contenedor.innerHTML = "<p>No hay niveles registrados.</p>";
                return;
            }

            // 1. Creamos la estructura de la tabla con la clase estándar
            const tabla = document.createElement('table');
            tabla.className = 'tabla-pro'; 
            tabla.innerHTML = `
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Descripción del Nivel</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody id="tbody-niveles"></tbody>
            `;
            contenedor.appendChild(tabla);

            const tbody = document.getElementById('tbody-niveles');

            // 2. Llenamos la tabla con los datos de FastAPI
            niveles.forEach(n => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${n.id_level}</td>
                    <td><strong>${n.description}</strong></td>
                    <td>
                        <span class="${n.active ? 'status-active' : 'status-inactive'}">
                            ${n.active ? 'Activo' : 'Inactivo'}
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
            // Aplicamos la función de seguridad por si el token expiró
            redireccionarAlLogin();
        } else {
            contenedor.innerHTML = "<p>Error al cargar niveles. Verifica tu sesión.</p>";
            Toast.error('Error al cargar niveles académicos');
        }
    } catch (e) { 
        console.error("Error:", e);
        Toast.error('Error de conexión');
    } finally {
        LoadingSpinner.hide();
    }
}

// 2. CREAR (Active implícito como true)
function configurarFormularioCrearAL(form, token) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            description: document.getElementById('description_C').value,
            active: true
        };
        enviarPeticionAL('https://egresados-cul.onrender.com/create_academic_level', 'POST', data, token);
    });
}

// 3. GET BY ID
async function obtenerNivelPorId(id, contenedor, token) {
    LoadingSpinner.show('Buscando nivel...');
    try {
        const response = await fetch(`https://egresados-cul.onrender.com/get_academic_level/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            const n = await response.json();
            contenedor.innerHTML = `
                <div style="border: 1px solid #333; padding: 10px; margin-top: 10px;">
                    <p><strong>ID:</strong> ${n.id_level}</p>
                    <p><strong>Descripción:</strong> ${n.description}</p>
                    <p><strong>Estado:</strong> ${n.active ? 'Activo' : 'Inactivo'}</p>
                </div>
            `;
            Toast.success('Nivel encontrado');
        } else {
            Toast.error("Nivel académico no encontrado");
        }
    } catch (e) { 
        Toast.error("Error de conexión");
    } finally {
        LoadingSpinner.hide();
    }
}

// 4. EDITAR
function configurarFormularioEditarAL(form, token) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('id_edit').value;
        const data = {
            description: document.getElementById('description_E').value,
            active: document.getElementById('active_E').value === "true"
        };
        enviarPeticionAL(`https://egresados-cul.onrender.com/edit_academic_level/${id}`, 'PUT', data, token);
    });
}

// 5. ELIMINAR
async function eliminarNivelAcademico(id, token) {
    LoadingSpinner.show('Eliminando nivel académico...');
    try {
        const response = await fetch(`https://egresados-cul.onrender.com/delete_academic_level/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            Toast.success("Nivel académico eliminado con éxito");
            setTimeout(() => location.reload(), 1500);
        } else {
            Toast.error("Error al eliminar el nivel");
        }
    } catch (e) { 
        Toast.error("Error de conexión");
    } finally {
        LoadingSpinner.hide();
    }
}

// Función genérica para Academic Levels
async function enviarPeticionAL(url, metodo, datos, token) {
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
    } finally {
        LoadingSpinner.hide();
    }
}