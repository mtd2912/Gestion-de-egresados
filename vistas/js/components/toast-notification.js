/**
 * Componente Toast/Notificaciones
 * Uso: 
 * Toast.success('Guardado correctamente')
 * Toast.error('Error al procesar')
 * Toast.warning('Advertencia')
 * Toast.info('Información')
 */
class Toast {
  static show(message, type = 'info', duration = 4000) {
    if (!message) return null;
    
    const container = this._getContainer();
    const toast = this._createToast(message, type);
    
    container.appendChild(toast);

    // Permitir cerrar manualmente
    const closeBtn = toast.querySelector('.toast-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this._removeToast(toast);
      });
    }

    // Auto cerrar
    if (duration > 0) {
      const timeoutId = setTimeout(() => {
        this._removeToast(toast);
      }, duration);

      // Extender duración si el usuario pasa el mouse
      toast.addEventListener('mouseenter', () => clearTimeout(timeoutId));
      toast.addEventListener('mouseleave', () => {
        setTimeout(() => {
          this._removeToast(toast);
        }, duration);
      });
    }

    return toast;
  }

  static success(message, duration) {
    return this.show(message, 'success', duration ?? 3500);
  }

  static error(message, duration) {
    return this.show(message, 'error', duration ?? 5000);
  }

  static warning(message, duration) {
    return this.show(message, 'warning', duration ?? 4000);
  }

  static info(message, duration) {
    return this.show(message, 'info', duration ?? 3500);
  }

  static _createToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type} fade-in`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');
    
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };

    toast.innerHTML = `
      <div class="toast-icon" aria-hidden="true">${icons[type] || icons.info}</div>
      <div class="toast-message">${this._escapeHtml(message)}</div>
      <button class="toast-close" aria-label="Cerrar notificación" type="button">&times;</button>
    `;

    return toast;
  }

  static _removeToast(toast) {
    if (!toast) return;
    
    toast.classList.add('fade-out');
    setTimeout(() => {
      if (toast.parentElement) {
        toast.remove();
      }
    }, 300);
  }

  static _getContainer() {
    let container = document.getElementById('toast-container');
    
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      container.setAttribute('aria-live', 'polite');
      container.setAttribute('aria-atomic', 'false');
      document.body.appendChild(container);
    }

    return container;
  }

  static _escapeHtml(text) {
    if (typeof text !== 'string') {
      text = String(text);
    }
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }
}
