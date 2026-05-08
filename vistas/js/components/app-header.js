class AppHeader extends HTMLElement {
  connectedCallback() {
    this.render();
    //this.setupLogout();
  }
  render() {
    const title = this.getAttribute('title') || 'Panel';
    const breadcrumb = this.getAttribute('breadcrumb') || 'CUL · Sistema de Egresados';

    const headerHTML = `
      <div class="header-left">
        <div class="header-breadcrumb">${breadcrumb}</div>
        <div class="header-title">${title}</div>
      </div>
      <logout-button></logout-button>
    `;
    this.classList.add('header');
    this.innerHTML = headerHTML;
  }
}
customElements.define('app-header', AppHeader);