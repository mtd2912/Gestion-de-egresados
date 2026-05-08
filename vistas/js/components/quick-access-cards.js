class QuickAccessCards extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    const cards = [
      {
        id: 'reports',
        icon: 'fas fa-chart-bar',
        emoji: '📊',
        label: 'Reportes',
        href: 'reports.html',
        color: '#c9a84c',
        description: 'Ver análisis y reportes'
      },
      {
        id: 'graduates',
        icon: 'fas fa-graduation-cap',
        emoji: '🎓',
        label: 'Egresados',
        href: 'graduates.html',
        color: '#3b82f6',
        description: 'Gestionar egresados'
      },
      {
        id: 'jobs',
        icon: 'fas fa-briefcase',
        emoji: '💼',
        label: 'Empleos',
        href: 'jobs.html',
        color: '#10b981',
        description: 'Gestionar empleos'
      },
      {
        id: 'job_offers',
        icon: 'fas fa-handshake',
        emoji: '🤝',
        label: 'Ofertas',
        href: 'job_offer.html',
        color: '#f59e0b',
        description: 'Ofertas de trabajo'
      }
    ];

    const cardHTML = cards.map(card => `
      <button 
        class="quick-access-card" 
        onclick="window.location.href='${card.href}'"
        title="${card.description}"
        style="--card-color: ${card.color}"
      >
        <div class="card-header">
          <div class="card-icon">
            <span class="icon-emoji">${card.emoji}</span>
          </div>
          <div class="card-arrow">
            <i class="fas fa-arrow-right"></i>
          </div>
        </div>
        <div class="card-content">
          <h3 class="card-title">${card.label}</h3>
          <p class="card-description">${card.description}</p>
        </div>
        <div class="card-footer">
          <span class="card-action">Acceder →</span>
        </div>
      </button>
    `).join('');

    this.innerHTML = `
      <div class="quick-access-section">
        <div class="section-header">
          <h2 class="section-title">
            <i class="fas fa-lightning-bolt"></i> Accesos Rápidos
          </h2>
          <p class="section-subtitle">Accede rápidamente a las herramientas más usadas</p>
        </div>
        <div class="cards-grid">
          ${cardHTML}
        </div>
      </div>
    `;
  }
}

customElements.define('quick-access-cards', QuickAccessCards);
