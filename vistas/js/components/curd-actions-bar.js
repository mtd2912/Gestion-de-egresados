class CrudActionsBar extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = `
            <div class="crud-actions-bar">
                <button class="action-button" data-action="create">
                    <span>➕</span><span>Crear</span>
                </button>
                <button class="action-button" data-action="search">
                    <span>🔍</span><span>Buscar</span>
                </button>
                <button class="action-button" data-action="view">
                    <span>👁️</span><span>Ver Todos</span>
                </button>
                <button class="action-button" data-action="edit">
                    <span>✏️</span><span>Editar</span>
                </button>
                <button class="action-button" data-action="delete">
                    <span>🗑️</span><span>Eliminar</span>
                </button>
            </div>
        `;
        this.setupEventListeners();
    }
    setupEventListeners() {
        const buttons = this.querySelectorAll('.action-button');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const action = button.getAttribute('data-action');
                if (typeof openTab === 'function') {
                    openTab(e, action);
                }
            });
        });
    }
}
customElements.define('crud-actions-bar', CrudActionsBar);