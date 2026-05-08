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
    const listaCE = document.getElementById('get_all_ContinuingEducation');
    if (listaCE) {
        cargarEducacionContinua(token, listaCE);
    }

    const formCrear = document.getElementById('form_crear_ce');
    if (formCrear) {
        if (id_type !== "1") {
            document.getElementById('Crear_Educacion_Continua').style.display = 'none';
        }
        configurarFormularioCrearCE(formCrear, token);
    }

    const formBuscar = document.getElementById('form_buscar');
    const contenedorIndividual = document.getElementById('resultado_busqueda');
    if (formBuscar) {
        formBuscar.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('id_search').value;
            await obtenerEducacionPorId(id, contenedorIndividual, token);
        });
    }

    const formEditar = document.getElementById('form_editar_ce');
    if (formEditar) {
        if (id_type !== "1") {
            document.getElementById('editar_ContinuingEducation').style.display = 'none';
        }
        configurarFormularioEditarCE(formEditar, token);
    }

    const formEliminar = document.getElementById('form_eliminar');
    if (formEliminar) {
        if (id_type !== "1") {
            document.getElementById('Eliminar_ContinuingEducation').style.display = 'none';
        }
        formEliminar.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('id_delete').value;
            ConfirmationModal.show({
                title: 'Eliminar Educación Continua',
                message: '¿Está seguro de que desea eliminar este registro? Esta acción no se puede deshacer.',
                confirmText: 'Sí, eliminar',
                cancelText: 'Cancelar',
                onConfirm: async () => {
                    await eliminarEducacionContinua(id, token);
                }
            });
        });
    }
});

// --- FUNCIONES ---

// 1. GET ALL
async function cargarEducacionContinua(token, contenedor) {
    LoadingSpinner.show('Cargando programas de educación continua...');
    try {
        const response = await fetch('https://egresados-cul.onrender.com/get_continuing_education', {
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
                contenedor.innerHTML = "<p>No hay programas registrados actualmente.</p>";
                return;
            }

            // 1. Creamos la estructura de la tabla con el diseño profesional
            const tabla = document.createElement('table');
            tabla.className = 'tabla-pro'; 
            tabla.innerHTML = `
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Descripción del Programa</th>
                        <th>Tipo de Educación</th>
                        <th>Fecha de Realización</th>
                    </tr>
                </thead>
                <tbody id="tbody-educacion-continua"></tbody>
            `;
            contenedor.appendChild(tabla);

            const tbody = document.getElementById('tbody-educacion-continua');

            // 2. Llenamos la tabla con los datos del servidor
            programas.forEach(prog => {
                const fila = document.createElement('tr');
                
                // Formateo básico de fecha si viene en formato YYYY-MM-DD
                const fechaFormateada = prog.education_date ? new Date(prog.education_date).toLocaleDateString() : 'N/A';

                fila.innerHTML = `
                    <td>${prog.id_continuing_education}</td>
                    <td><strong>${prog.description_program}</strong></td>
                    <td>${prog.education_type || 'No especificado'}</td>
                    <td>${fechaFormateada}</td>
                `;
                tbody.appendChild(fila);
            });

            // Inicializar DataTable
            setTimeout(() => {
                DatatableInitializer.init(tabla);
            }, 100);

        } else if (response.status === 401) {
            // Seguridad: Si el token expiró, redirige al login
            redireccionarAlLogin();
        } else {
            contenedor.innerHTML = "<p>Error al cargar. Verifica tu sesión.</p>";
            Toast.error('Error al cargar programas');
        }
    } catch (e) { 
        console.error("Error:", e);
        Toast.error('Error de conexión con el servidor');
    } finally {
        LoadingSpinner.hide();
    }
}
// 2. CREAR
function configurarFormularioCrearCE(form, token) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            id_graduate: parseInt(document.getElementById('id_graduate_C').value),
            description_program: document.getElementById('description_program_C').value,
            education_type: document.getElementById('education_type_C').value,
            time: document.getElementById('time_C').value,
            education_date: document.getElementById('education_date_C').value,
            active: true
        };
        enviarPeticionCE('https://egresados-cul.onrender.com/create_continuing_education', 'POST', data, token);
    });
}
// 3. GET BY ID
async function obtenerEducacionPorId(id, contenedor, token) {
    LoadingSpinner.show('Buscando registro...');
    try {
        const response = await fetch(`https://egresados-cul.onrender.com/get_continuing_education_by_id/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            const prog = await response.json();
            contenedor.innerHTML = `
                <div style="border: 1px solid #ddd; padding: 15px; margin-top: 10px; border-radius: 8px;">
                    <p><strong>Descripción:</strong> ${prog.description_program}</p>
                    <p><strong>Tipo:</strong> ${prog.education_type}</p>
                    <p><strong>Fecha:</strong> ${prog.education_date}</p>
                    <p><strong>Estado:</strong> ${prog.active ? 'Activo' : 'Inactivo'}</p>
                </div>
            `;
            Toast.success('Registro encontrado');
        } else {
            Toast.error("Registro no encontrado");
        }
    } catch (e) { 
        Toast.error("Error de conexión");
    } finally {
        LoadingSpinner.hide();
    }
}
// 4. EDITAR
function configurarFormularioEditarCE(form, token) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('id_edit').value;
        const data = {
            id_graduate: parseInt(document.getElementById('id_graduate_E').value),
            description_program: document.getElementById('description_program_E').value,
            education_type: document.getElementById('education_type_E').value,
            time: document.getElementById('time_E').value,
            education_date: document.getElementById('education_date_E').value,
            active: document.getElementById('active_E').value === "true"
        };
        enviarPeticionCE(`https://egresados-cul.onrender.com/edit_continuing_education/${id}`, 'PUT', data, token);
    });
}
// 5. ELIMINAR
async function eliminarEducacionContinua(id, token) {
    LoadingSpinner.show('Eliminando registro...');
    try {
        const response = await fetch(`https://egresados-cul.onrender.com/delete_continuing_education/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            Toast.success("Registro eliminado exitosamente");
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

// Función genérica para peticiones
async function enviarPeticionCE(url, metodo, datos, token) {
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
