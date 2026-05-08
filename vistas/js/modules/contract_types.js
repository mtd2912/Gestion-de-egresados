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
    const listaCT = document.getElementById('get_all_ContractTypes');
    if (listaCT) {
        cargarTiposContrato(token, listaCT);
    }

    const formCrear = document.getElementById('form_crear_ct');
    if (formCrear) {
        if (id_type !== "1") {
            document.getElementById('Crear_ContractType').style.display = 'none';
        }
        configurarFormularioCrearCT(formCrear, token);
    }

    const formBuscar = document.getElementById('form_buscar');
    const contenedorIndividual = document.getElementById('resultado_busqueda');
    if (formBuscar) {
        formBuscar.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('id_search').value;
            await obtenerContratoPorId(id, contenedorIndividual, token);
        });
    }

    const formEditar = document.getElementById('form_editar_ct');
    if (formEditar) {
        if (id_type !== "1") {
            document.getElementById('editar_ContractType').style.display = 'none';
        }
        configurarFormularioEditarCT(formEditar, token);
    }

    const formEliminar = document.getElementById('form_eliminar');
    if (formEliminar) {
        if (id_type !== "1") {
            document.getElementById('Eliminar_ContractType').style.display = 'none';
        }
        formEliminar.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('id_delete').value;
            ConfirmationModal.show({
                title: 'Eliminar Tipo de Contrato',
                message: '¿Está seguro de que desea eliminar este tipo de contrato? Esta acción no se puede deshacer.',
                confirmText: 'Sí, eliminar',
                cancelText: 'Cancelar',
                onConfirm: async () => {
                    await eliminarTipoContrato(id, token);
                }
            });
        });
    }
});

// --- FUNCIONES ---

// 1. GET ALL
async function cargarTiposContrato(token, contenedor) {
    LoadingSpinner.show('Cargando tipos de contrato...');
    try {
        const response = await fetch('https://egresados-cul.onrender.com/get_contract_types', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const tipos = await response.json();
            contenedor.innerHTML = "";

            if (tipos.length === 0) {
                contenedor.innerHTML = "<p>No hay tipos de contrato registrados.</p>";
                return;
            }

            // 1. Creamos la estructura de la tabla con la clase estándar tabla-pro
            const tabla = document.createElement('table');
            tabla.className = 'tabla-pro'; 
            tabla.innerHTML = `
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre del Contrato</th>
                        <th>Descripción</th>
                        <th>Duración Estimada</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody id="tbody-contratos"></tbody>
            `;
            contenedor.appendChild(tabla);

            const tbody = document.getElementById('tbody-contratos');

            // 2. Mapeamos los tipos de contrato a las filas de la tabla
            tipos.forEach(tipo => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${tipo.id_type}</td>
                    <td>${tipo.contract_name}</td>
                    <td>${tipo.description || 'Sin descripción'}</td>
                    <td>${tipo.duration || 'No definida'}</td>
                    <td>
                        <span class="${tipo.active !== false ? 'status-active' : 'status-inactive'}">
                            ${tipo.active !== false ? 'Activo' : 'Inactivo'}
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
            // Aplicamos la redirección automática si el token expiró
            redireccionarAlLogin();
        } else {
            contenedor.innerHTML = "<p>Error al cargar tipos de contrato. Verifica tu sesión.</p>";
            Toast.error('Error al cargar tipos de contrato');
        }
    } catch (e) { 
        console.error("Error:", e);
        Toast.error('Error de conexión con el servidor');
    } finally {
        LoadingSpinner.hide();
    }
}

// 2. CREAR (Active implícito como true)
function configurarFormularioCrearCT(form, token) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            contract_name: document.getElementById('contract_name_C').value,
            description: document.getElementById('description_C').value,
            duration: document.getElementById('duration_C').value,
            active: true
        };
        enviarPeticionCT('https://egresados-cul.onrender.com/create_contract_type', 'POST', data, token);
    });
}

// 3. GET BY ID
async function obtenerContratoPorId(id, contenedor, token) {
    LoadingSpinner.show('Buscando tipo de contrato...');
    try {
        const response = await fetch(`https://egresados-cul.onrender.com/get_contract_type/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            const tipo = await response.json();
            contenedor.innerHTML = `
                <div style="border: 1px solid #ddd; padding: 15px; margin-top: 10px; border-radius: 8px;">
                    <p><strong>Nombre:</strong> ${tipo.contract_name}</p>
                    <p><strong>Descripción:</strong> ${tipo.description}</p>
                    <p><strong>Duración:</strong> ${tipo.duration}</p>
                </div>
            `;
            Toast.success('Tipo de contrato encontrado');
        } else {
            Toast.error("Tipo de contrato no encontrado");
        }
    } catch (e) { 
        Toast.error("Error de conexión");
    } finally {
        LoadingSpinner.hide();
    }
}

// 4. EDITAR
function configurarFormularioEditarCT(form, token) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('id_edit').value;
        const data = {
            contract_name: document.getElementById('contract_name_E').value,
            description: document.getElementById('description_E').value,
            duration: document.getElementById('duration_E').value,
            active: document.getElementById('active_E').value === "true"
        };
        enviarPeticionCT(`https://egresados-cul.onrender.com/edit_contract_type/${id}`, 'PUT', data, token);
    });
}

// 5. ELIMINAR
async function eliminarTipoContrato(id, token) {
    LoadingSpinner.show('Eliminando tipo de contrato...');
    try {
        const response = await fetch(`https://egresados-cul.onrender.com/delete_contract_type/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            Toast.success("Tipo de contrato eliminado con éxito");
            setTimeout(() => location.reload(), 1500);
        } else {
            Toast.error("Error al eliminar el tipo de contrato");
        }
    } catch (e) { 
        Toast.error("Error de conexión");
    } finally {
        LoadingSpinner.hide();
    }
}

// Función genérica para Contract Types
async function enviarPeticionCT(url, metodo, datos, token) {
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
            Toast.success("Operación realizada con éxito");
            setTimeout(() => location.reload(), 1500);
        } else {
            const err = await res.json();
            Toast.error("Error: " + (err.detail || "No se pudo completar la acción"));
        }
    } catch (e) { 
        Toast.error("Error de conexión");
    } finally {
        LoadingSpinner.hide();
    }
}