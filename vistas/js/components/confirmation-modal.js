/**
 * Componente Modal de Confirmación Reutilizable
 * Uso: ConfirmationModal.show({
 *   title: 'Eliminar',
 *   message: '¿Está seguro de eliminar este elemento?',
 *   onConfirm: () => { ... },
 *   onCancel: () => { ... }
 * })
 */
class ConfirmationModal {
  static show(options = {}) {
    const {
      title = 'Confirmación',
      message = '¿Está seguro?',
      confirmText = 'Confirmar',
      cancelText = 'Cancelar',
      confirmClass = 'btn-danger',
      onConfirm = () => {},
      onCancel = () => {}
    } = options;

    // Crear modal si no existe
    let modal = document.getElementById('confirmation-modal');
    if (!modal) {
      modal = this._createModal();
      document.body.appendChild(modal);
    }

    // Configurar contenido
    modal.querySelector('.modal-title').textContent = title;
    modal.querySelector('.modal-message').textContent = message;
    
    const confirmBtn = modal.querySelector('.btn-confirm');
    const cancelBtn = modal.querySelector('.btn-cancel');

    confirmBtn.textContent = confirmText;
    confirmBtn.className = `btn ${confirmClass}`;
    cancelBtn.textContent = cancelText;

    // Remover listeners antiguos
    const newConfirmBtn = confirmBtn.cloneNode(true);
    const newCancelBtn = cancelBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
    cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);

    // Agregar nuevos listeners
    newConfirmBtn.addEventListener('click', () => {
      onConfirm();
      this._closeModal(modal);
    });
    newCancelBtn.addEventListener('click', () => {
      onCancel();
      this._closeModal(modal);
    });

    // Cerrar al presionar Escape
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onCancel();
        this._closeModal(modal);
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);

    modal.style.display = 'flex';
  }

  static _createModal() {
    const modal = document.createElement('div');
    modal.id = 'confirmation-modal';
    modal.className = 'confirmation-modal-overlay';
    modal.innerHTML = `
      <div class="confirmation-modal">
        <div class="modal-header">
          <h3 class="modal-title">Confirmación</h3>
          <button class="modal-close" aria-label="Cerrar">&times;</button>
        </div>
        <div class="modal-body">
          <p class="modal-message">¿Está seguro?</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary btn-cancel">Cancelar</button>
          <button class="btn btn-danger btn-confirm">Confirmar</button>
        </div>
      </div>
    `;

    // Cerrar con el botón X
    modal.querySelector('.modal-close').addEventListener('click', () => {
      this._closeModal(modal);
    });

    // Cerrar si se hace click fuera del modal
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this._closeModal(modal);
      }
    });

    return modal;
  }

  static _closeModal(modal) {
    modal.style.display = 'none';
  }
}
