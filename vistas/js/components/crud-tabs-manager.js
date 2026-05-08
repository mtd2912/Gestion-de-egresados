/**
 * CRUD Tabs Manager
 * Gestiona la visibilidad de secciones CRUD usando botones de acción
 * Compatible con cualquier página CRUD existente
 */
const rol = localStorage.getItem('rol');
class CRUDTabsManager {
    constructor() {
        this.actionButtons = document.querySelectorAll('.action-button');
        const allSections = {
            create: document.getElementById('Crear') || document.querySelector('[id$="Crear"]'),
            search: document.getElementById('Buscar') || document.querySelector('[id$="buscar"], [id*="buscar"]'),
            view: document.getElementById('ver_todos') || document.querySelector('[id*="get_all"]'),
            edit: document.getElementById('Editar') || document.querySelector('[id$="Editar"], [id*="editar"]'),
            delete: document.getElementById('Eliminar') || document.querySelector('[id$="Eliminar"], [id*="eliminar"]')
        };
        if (parseInt(rol) === 2) {
            this.sections = {
                search: allSections.search,
                view: allSections.view
            };
            this.actionButtons = Array.from(this.actionButtons).filter(btn => btn.dataset.action === 'search' || btn.dataset.action === 'view');
            const allButtons = document.querySelectorAll('.action-button');
            allButtons.forEach(btn => {
                if (!this.actionButtons.includes(btn)) {
                    btn.style.display = 'none';
                }
            });
        } else {
            this.sections = allSections;
        }
        this.init();
    }
    init() {
        // Configurar event listeners para los botones de acción
        this.actionButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = btn.dataset.action;
                this.toggleSection(action, true);
            });
        });
        // Ocultar todas las secciones al inicio
        this.hideAllSections();
        const rolActual = localStorage.getItem('rol');
        if (rolActual && parseInt(rolActual) === 2) {
            this.toggleSection('search', false);
        } else {
            this.toggleSection('create', false);
        }
    }
    toggleSection(action, isUserClick = false) {
        // Cerrar todas las demás secciones
        this.hideAllSections();
        // Abrir la sección solicitada
        const section = this.getSection(action);
        if (section) {
            section.style.display = 'block';
            section.classList.add('active');
            // Solo hacer scroll si es click del usuario, no en carga inicial
            if (isUserClick) {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
        // Actualizar estado del botón
        this.updateButtonStates(action);
    }
    getSection(action) {
        const sectionMap = {
            'create': () => this.findElementByPattern(['Crear']),
            'search': () => this.findElementByPattern(['Buscar', 'buscar', 'busqueda']),
            'view': () => this.findElementByPattern(['get_all', 'ver_todos', 'Lista']),
            'edit': () => this.findElementByPattern(['Editar', 'editar']),
            'delete': () => this.findElementByPattern(['Eliminar', 'eliminar', 'Delete'])
        };

        return sectionMap[action] ? sectionMap[action]() : null;
    }
    findElementByPattern(patterns) {
        for (let pattern of patterns) {
            // Buscar todos los divs con clase crud-section y verificar case-insensitive
            const allSections = document.querySelectorAll('[class*="crud-section"]');
            for (let section of allSections) {
                if (section.id.toLowerCase().includes(pattern.toLowerCase())) {
                    return section;
                }
            }
        }
        return null;
    }
    hideAllSections() {
        // Ocultar todos los divs con clase crud-section
        const crudDivs = document.querySelectorAll('.crud-section');
        
        crudDivs.forEach(div => {
            div.style.display = 'none';
            div.classList.remove('active');
        });
    }
    updateButtonStates(activeAction) {
        this.actionButtons.forEach(btn => {
            if (btn.dataset.action === activeAction) {
                btn.classList.add('active-btn');
            } else {
                btn.classList.remove('active-btn');
            }
        });
    }
}
// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Esperar un poco para asegurar que otros scripts estén listos
    setTimeout(() => {
        if (document.querySelector('.action-button')) {
            new CRUDTabsManager();
        }
    }, 100);
});