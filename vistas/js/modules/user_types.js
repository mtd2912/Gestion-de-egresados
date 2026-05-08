document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const id_type = localStorage.getItem('rol');

    if (!token) {
        window.location.href = 'Index.html';
        return;
    }

    // 1. GET ALL (Resumido)
    const contenedorLista = document.getElementById('contenedor_lista_ut');
    if (contenedorLista) cargarUserTypes(token, contenedorLista);

    // 2. POST (Solo Rol 1)
    const formCrear = document.getElementById('form_crear_ut');
    if (formCrear) {
        if (id_type !== "1") document.getElementById('Crear_UserType').style.display = 'none';
        configurarFormularioCrear(formCrear, token);
    }

    // 3. GET BY ID (Detallado)
    const formBuscar = document.getElementById('form_buscar_ut');
    if (formBuscar) {
        formBuscar.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('id_search_ut').value;
            await obtenerUserTypePorId(id, document.getElementById('resultado_busqueda_ut'), token);
        });
    }

    // 4. PUT (Solo Rol 1)
    const formEditar = document.getElementById('form_editar_ut');
    if (formEditar) {
        if (id_type !== "1") document.getElementById('editar_UserType').style.display = 'none';
        configurarFormularioEditar(formEditar, token);
    }

    // 5. DELETE (Solo Rol 1)
    const formEliminar = document.getElementById('form_eliminar_ut');
    if (formEliminar) {
        if (id_type !== "1") document.getElementById('Eliminar_UserType').style.display = 'none';
        formEliminar.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('id_delete_ut').value;
            ConfirmationModal.show({
                title: 'Eliminar Tipo de Usuario',
                message: '¿Está seguro de que desea eliminar este tipo de usuario? Esta acción no se puede deshacer.',
                confirmText: 'Sí, eliminar',
                cancelText: 'Cancelar',
                onConfirm: async () => {
                    await eliminarUserType(id, token);
                }
            });
        });
    }
});

// --- FUNCIONES ---

async function cargarUserTypes(token, contenedor) {
    LoadingSpinner.show('Cargando tipos de usuario...');
    try {
        const res = await fetch('https://egresados-cul.onrender.com/get_all_user_type', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            const data = await res.json();
            contenedor.innerHTML = data.map(ut => `
                <p><strong>ID:</strong> ${ut.id_type} | <strong>Rol:</strong> ${ut.description}</p>
            `).join('<hr>');
            Toast.success('Tipos de usuario cargados');
        } else {
            Toast.error('Error al cargar tipos de usuario');
        }
    } catch (e) { 
        console.error(e);
        Toast.error('Error de conexión');
    } finally {
        LoadingSpinner.hide();
    }
}

async function obtenerUserTypePorId(id, contenedor, token) {
    LoadingSpinner.show('Buscando tipo de usuario...');
    try {
        const res = await fetch(`https://egresados-cul.onrender.com/get_user_type/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            const ut = await res.json();
            contenedor.innerHTML = `
                <div style="background: #f4f4f4; padding: 15px; border-radius: 8px; border-left: 5px solid #6c757d;">
                    <p><strong>ID Tipo:</strong> ${ut.id_type}</p>
                    <p><strong>Descripción:</strong> ${ut.description}</p>
                    <p><strong>Estado:</strong> ${ut.active ? 'Activo' : 'Inactivo'}</p>
                    <p><strong>Creado:</strong> ${ut.creation_date}</p>
                    <p><strong>Actualizado:</strong> ${ut.update_date}</p>
                </div>
            `;
            Toast.success('Tipo de usuario encontrado');
        } else { 
            Toast.error("Tipo de usuario no encontrado");
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
        enviarPeticion('https://egresados-cul.onrender.com/create_user_type', 'POST', data, token);
    });
}

function configurarFormularioEditar(form, token) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('id_edit_ut').value;
        const data = {
            description: document.getElementById('description_E').value,
            active: document.getElementById('active_E').value === "true"
        };
        enviarPeticion(`https://egresados-cul.onrender.com/edit_user_type/${id}`, 'PUT', data, token);
    });
}

async function eliminarUserType(id, token) {
    LoadingSpinner.show('Eliminando tipo de usuario...');
    try {
        const res = await fetch(`https://egresados-cul.onrender.com/delete_user_type/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) { 
            Toast.success("Eliminado correctamente");
            setTimeout(() => location.reload(), 1500);
        } else {
            Toast.error('Error al eliminar');
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
            Toast.success("Operación exitosa");
            setTimeout(() => location.reload(), 1500);
        } else {
            const err = await res.json();
            Toast.error("Error: " + (err.detail || "No se pudo completar la acción"));
        }
    } catch (e) { 
        Toast.error("Error de servidor");
    } finally {
        LoadingSpinner.hide();
    }
}
