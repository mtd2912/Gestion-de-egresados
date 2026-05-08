class AppSidebar extends HTMLElement {
  connectedCallback() { 
    this.render();
  }

  render() {
    const currentPage = this.getCurrentPage();
    
    const sidebarHTML = `
      <h2><a href="../index.html">CUL</a></h2>
      
      <div class="sidebar-section-label">Principal</div>
      <a href="dashboard.html" ${currentPage === 'dashboard.html' ? 'class="active"' : ''}>🏠 Inicio</a>
      <a href="graduates.html" ${currentPage === 'graduates.html' ? 'class="active"' : ''}>👤 Egresados</a>
      <a href="jobs.html" ${currentPage === 'jobs.html' ? 'class="active"' : ''}>💼 Empleos</a>
      <a href="job_offer.html" ${currentPage === 'job_offer.html' ? 'class="active"' : ''}>📋 Ofertas de Trabajo</a>
      
      <div class="sidebar-section-label">Académico</div>
      <a href="programa.html" ${currentPage === 'programa.html' ? 'class="active"' : ''}>📚 Programas</a>
      <a href="faculty.html" ${currentPage === 'faculty.html' ? 'class="active"' : ''}>🏛 Facultades</a>
      <a href="academic_level.html" ${currentPage === 'academic_level.html' ? 'class="active"' : ''}>🎓 Niveles Académicos</a>
      <a href="countinuing_education.html" ${currentPage === 'countinuing_education.html' ? 'class="active"' : ''}>📖 Educación Continua</a>
      
      <div class="sidebar-section-label">Configuración</div>
      <a href="sectors.html" ${currentPage === 'sectors.html' ? 'class="active"' : ''}>🏭 Sectores</a>
      <a href="work_supervisor.html" ${currentPage === 'work_supervisor.html' ? 'class="active"' : ''}>👔 Supervisores</a>
      <a href="contract_types.html" ${currentPage === 'contract_types.html' ? 'class="active"' : ''}>📄 Tipos de Contrato</a>
      <a href="employment_statuses.html" ${currentPage === 'employment_statuses.html' ? 'class="active"' : ''}>🔖 Estados de Empleo</a>
    `;

    this.innerHTML = sidebarHTML;
    this.classList.add('sidebar');
  }

  getCurrentPage() {
    const path = window.location.pathname;
    const fileName = path.split('/').pop();
    return fileName || 'index.html';
  }
}

customElements.define('app-sidebar', AppSidebar);
