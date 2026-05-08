/**
 * Componente Loading Spinner y Skeleton Loader
 * Uso: 
 * - LoadingSpinner.show() / LoadingSpinner.hide()
 * - SkeletonLoader.create(rows)
 */
class LoadingSpinner {
  static show(message = 'Cargando...') {
    let spinner = document.getElementById('loading-spinner');
    
    if (!spinner) {
      spinner = this._createSpinner();
      document.body.appendChild(spinner);
    }

    spinner.querySelector('.spinner-message').textContent = message;
    spinner.style.display = 'flex';
  }

  static hide() {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) {
      spinner.style.display = 'none';
    }
  }

  static _createSpinner() {
    const spinner = document.createElement('div');
    spinner.id = 'loading-spinner';
    spinner.className = 'loading-spinner-overlay';
    spinner.innerHTML = `
      <div class="spinner-container">
        <div class="spinner"></div>
        <p class="spinner-message">Cargando...</p>
      </div>
    `;
    return spinner;
  }
}

/**
 * Skeleton Loader para contenedores mientras se cargan datos
 * Uso: SkeletonLoader.create(parentElement, 5) // 5 filas
 */
class SkeletonLoader {
  static create(parentElement, rows = 3, type = 'list') {
    const skeletonContainer = document.createElement('div');
    skeletonContainer.className = 'skeleton-loader';

    for (let i = 0; i < rows; i++) {
      if (type === 'list') {
        skeletonContainer.appendChild(this._createListSkeleton());
      } else if (type === 'card') {
        skeletonContainer.appendChild(this._createCardSkeleton());
      } else if (type === 'table') {
        skeletonContainer.appendChild(this._createTableRowSkeleton());
      }
    }

    parentElement.appendChild(skeletonContainer);
    return skeletonContainer;
  }

  static _createListSkeleton() {
    const item = document.createElement('div');
    item.className = 'skeleton-item';
    item.innerHTML = `
      <div class="skeleton-avatar"></div>
      <div class="skeleton-content">
        <div class="skeleton-line skeleton-title"></div>
        <div class="skeleton-line skeleton-text"></div>
      </div>
    `;
    return item;
  }

  static _createCardSkeleton() {
    const card = document.createElement('div');
    card.className = 'skeleton-card';
    card.innerHTML = `
      <div class="skeleton-header"></div>
      <div class="skeleton-body">
        <div class="skeleton-line skeleton-title"></div>
        <div class="skeleton-line skeleton-text"></div>
        <div class="skeleton-line skeleton-text"></div>
      </div>
    `;
    return card;
  }

  static _createTableRowSkeleton() {
    const row = document.createElement('tr');
    row.className = 'skeleton-row';
    row.innerHTML = `
      <td><div class="skeleton-line"></div></td>
      <td><div class="skeleton-line"></div></td>
      <td><div class="skeleton-line"></div></td>
      <td><div class="skeleton-line"></div></td>
    `;
    return row;
  }

  static remove(parentElement) {
    const skeleton = parentElement.querySelector('.skeleton-loader');
    if (skeleton) {
      skeleton.remove();
    }
  }
}
