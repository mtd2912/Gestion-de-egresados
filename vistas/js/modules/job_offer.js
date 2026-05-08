document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');

    //validar token
    if (!token) {
        if (!window.location.pathname.includes('Index.html')) {
            window.location.href = 'Index.html';
        }
        return;
    }

    // Para la página normal de job_offer.html (admin)
    const lista = document.getElementById('ver_todos_ofertas');
    if (lista) { 
        cargarOfertas(token, lista);
    }
    const formCrear = document.getElementById('CrearJobOffer');
    if (formCrear) {
        if (rol !== "1") {
            //en caso de no ser amdin, se debe de ocultar el formulario
        }
        configurarFormularioCrear(formCrear, token);
    }
    const formEditar = document.getElementById('editarJobOffer');
    if (formEditar) {
        if (rol !== "1") {
        }
        configurarFormularioEditar(formEditar, token);
    }
    const formBuscar = document.getElementById('form_buscar');
    const oferta = document.getElementById('oferta');
    if (formBuscar) {
        formBuscar.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('id_search').value;
            await obtenerOfertaParaEditar(id,oferta,token);
        });
    }
    const formEliminar = document.querySelector('#Eliminar_Oferta form');
    if (formEliminar) {
        formEliminar.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('id_delete').value;
            ConfirmationModal.show({
                title: 'Eliminar Oferta de Trabajo',
                message: '¿Está seguro de que desea eliminar esta oferta? Esta acción no se puede deshacer.',
                confirmText: 'Sí, eliminar',
                cancelText: 'Cancelar',
                onConfirm: async () => {
                    await eliminaroferta(id, token);
                }
            });
        });
    }
});
// funciones
// get_all
async function cargarOfertas(token, contenedor) {
    try {
        const response = await fetch('https://egresados-cul.onrender.com/get_job_offers', {
            method: 'GET', 
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const ofertas = await response.json();
            contenedor.innerHTML = "";
            
            if (ofertas.length === 0) {
                contenedor.innerHTML = "<div class='no-ofertas'><p>No hay ofertas de trabajo disponibles.</p></div>";
                return;
            }
            
            const esPaginaMostrar = window.location.pathname.includes('job_offer_mostrar.html');
            
            // --- NUEVA LÓGICA: Si es ADMIN, creamos la cabecera de la tabla ---
            let tbody; 
            const tabla = null;
            if (!esPaginaMostrar) {
                tabla = document.createElement('table');
                tabla.className = 'tabla-pro'; // Usa la clase que definimos antes
                tabla.innerHTML = `
                    <thead>
                        <tr>
                            <th>Posición</th>
                            <th>Empresa</th>
                            <th>Área</th>
                            <th>Salario</th>
                            <th>Programa</th>
                            <th>Contrato</th>
                        </tr>
                    </thead>
                    <tbody id="tbody-ofertas-admin"></tbody>
                `;
                contenedor.appendChild(tabla);
                tbody = document.getElementById('tbody-ofertas-admin');
            }

            ofertas.forEach(oferta => {
                const empresa = oferta.company || 'N/A';
                const posicion = oferta.position || 'N/A';
                const area = oferta.area || 'N/A';
                const sueldo = oferta.salary || '0.00';
                const email = oferta.email_contact || 'Sin correo';
                const ofertaId = oferta.id_offer || 'N/A';
                const contract_name = oferta.contract_name || 'N/A';
                const program_name = oferta.program_name || 'N/A';
                
                if (esPaginaMostrar) {
                    // MANTIENE EL DISEÑO DE CARDS PARA EGRESADOS
                    const card = document.createElement('div');
                    card.className = 'oferta-card';
                    card.innerHTML = `
                        <div class="oferta-info">
                            <h2>${posicion}</h2>
                            <p><strong>Empresa:</strong> ${empresa}</p>
                            <p><strong>Área:</strong> ${area}</p>
                            <p><strong>Salario:</strong> $${sueldo}</p>
                            <p><strong>Contacto:</strong> ${email}</p>
                        </div>
                        <div class="oferta-buttons">
                            <button class="btn-aplicar" data-id="${ofertaId}">✓ Aplicar</button>
                            <button class="btn-eliminar" data-id="${ofertaId}">✕ No interesa</button>
                        </div>
                    `;
                    contenedor.appendChild(card);

                    card.querySelector('.btn-aplicar').addEventListener('click', async () => {
                        await aplicarOferta(ofertaId, token, card);
                    });
                    card.querySelector('.btn-eliminar').addEventListener('click', () => {
                        card.style.display = 'none';
                    });

                } else {
                    // --- RENDERIZADO EN TABLA PARA ADMINISTRADORES ---
                    const fila = document.createElement('tr');
                    fila.innerHTML = `
                        <td>${ofertaId}</td>
                        <td>${posicion}</td>
                        <td>${empresa}</td>
                        <td>${area}</td>
                        <td>$${parseFloat(sueldo).toLocaleString()}</td>
                        <td>${program_name}</td>
                        <td>${contract_name}</td>
                    `;
                    tbody.appendChild(fila);
                }
            });

            // Inicializar DataTable
            setTimeout(() => {
                DatatableInitializer.init(tabla);
            }, 100);

        } else if (response.status === 401) {
            redireccionarAlLogin();
        } else {
            contenedor.innerHTML = "<p>Error al cargar las ofertas.</p>";
        }
    } catch (error) {
        console.error("Error de conexión:", error);
        contenedor.innerHTML = "<p>El servidor de FastAPI no responde.</p>";
    }
}

// Función para aplicar a una oferta
async function aplicarOferta(ofertaId, token, elemento) {
    LoadingSpinner.show('Procesando solicitud...');
    try {
        // Aquí puedes implementar la lógica para guardar la aplicación
        // Por ahora simplemente mostramos un mensaje
        Toast.success('¡Has aplicado a esta oferta! Tu solicitud ha sido registrada.');
        elemento.style.opacity = '0.5';
        elemento.querySelector('.btn-aplicar').disabled = true;
    } catch (error) {
        console.error("Error al aplicar:", error);
        Toast.error('Hubo un error al aplicar a la oferta.');
    } finally {
        LoadingSpinner.hide();
    }
}

//crear
function configurarFormularioCrear(form, token) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            position: document.getElementById('position_c').value,
            company: document.getElementById('company_c').value,
            salary: parseFloat(document.getElementById('salary_c').value),
            id_type: parseInt(document.getElementById('id_type_c').value),
            area: document.getElementById('area_c').value,
            email_contact: document.getElementById('email_contact_c').value,
            offer_date: document.getElementById('offer_date_c').value,
            program: parseInt(document.getElementById('id_program_c').value),
            //active: document.getElementById('active').value === "true"// en caso ser necesario, activar
            active: true
        }; 
        enviarPeticion('https://egresados-cul.onrender.com/create_job_offer', 'POST', data, token);
    });
}

// edit 
function configurarFormularioEditar(form, token) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('id_edit').value;
        const data = {
            position: document.getElementById('position_e').value,
            company: document.getElementById('company_e').value,
            salary: parseFloat(document.getElementById('salary_e').value),
            id_type: parseInt(document.getElementById('id_type_e').value),
            area: document.getElementById('area_e').value,
            email_contact: document.getElementById('email_contact_e').value,
            offer_date: document.getElementById('offer_date_e').value,
            program: parseInt(document.getElementById('id_program_e').value), // Nombre corregido
            active: document.getElementById('active_e').value === "true"
        };
        enviarPeticion(`https://egresados-cul.onrender.com/edit_job_offer/${id}`, 'PUT', data, token);
    });
}
// get by id
async function obtenerOfertaParaEditar(id,contenedor,token) {
    LoadingSpinner.show('Buscando oferta...');
    try {
        const response = await fetch(`https://egresados-cul.onrender.com/get_job_offer/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            contenedor.innerHTML = "";
            const oferta = await response.json();
            const card2 = document.createElement('div');
            const cost = oferta.salary || '0.00';
            card2.innerHTML = `
                <h2>Puesto: ${oferta.position}</h2>
                <p><strong>Empresa:</strong> ${oferta.company}</p>
                <p><strong>Área:</strong> ${oferta.area}</p>
                <p><strong>Salario:</strong> $${cost}</p>
                <p><strong>Contacto:</strong>${oferta.email_contact}</p>
            `;
            document.getElementById('oferta').appendChild(card2);
            Toast.success('Oferta cargada exitosamente');
        } else {
            const err = await response.json();
            Toast.error("Error: " + (err.detail || "Fallo en la operación"));
        }
    } catch (e) { 
        Toast.error("Error de conexión");
    } finally {
        LoadingSpinner.hide();
    }
}
// delete
async function eliminaroferta(id,token) {
    LoadingSpinner.show('Eliminando oferta...');
    try {
        const response = await fetch(`https://egresados-cul.onrender.com/delete_job_offer/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            Toast.success("Oferta eliminada exitosamente");
            // 📧 Notificación de eliminación
            EmailNotifier.notificarOfertaEliminada({ id, titulo: `Oferta ID ${id}` });
            setTimeout(() => location.reload(), 1500);
        } else {
            const err = await response.json();
            Toast.error("Error: " + (err.detail || "Fallo en la operación"));
        }
    } catch (e) { 
        Toast.error("Error de conexión");
    } finally {
        LoadingSpinner.hide();
    }
}
// Función genérica para enviar peticiones
async function enviarPeticion(url, metodo, datos, token) {
    LoadingSpinner.show('Procesando solicitud...');
    try {
        const res = await fetch(url, {
            method: metodo,
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });
        if (res.ok) {
            Toast.success("Operación realizada exitosamente");
            // 📧 Notificación de nueva oferta
            if (metodo === 'POST') {
                EmailNotifier.notificarOfertaCreada({
                    titulo:    datos.title ?? datos.job_title ?? 'Nueva oferta',
                    empresa:   datos.company ?? datos.employer ?? '—',
                    modalidad: datos.modality ?? datos.work_mode ?? '—',
                });
            }
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

function logout() {
    localStorage.clear();
    window.location.href = 'Index.html';
}
