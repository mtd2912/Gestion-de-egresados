class LogoutButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
  connectedCallback() {
    this.render();
    this.setupEvents();
  }
  setupEvents() {
    const btn = this.shadowRoot.querySelector('.logout-link');
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('token'); 
      localStorage.removeItem('rol');
      localStorage.removeItem('email');
      sessionStorage.clear();
      window.location.href = 'login.html'; 
    });
  }
  render() {
    this.shadowRoot.innerHTML = `
    <style>
.user-menu {
    list-style: none;
    position: relative;
}
.user-menu a {
    text-decoration: none;
    color: black;
    display: block;
    padding: 10px;
}
.user-menu a:hover {
    background-color: #e0e0e0;
}
.user-menu:focus-within > a {
    background-color: #d6d6d6;
}
.dropdown-menu {
    display: none;
    position: absolute;
    background: white;
    list-style: none;
    padding: 0;
    margin: 0;
    border: 1px solid #ccc;
}
.user-menu:focus-within .dropdown-menu {
    display: block;
}
.dropdown-menu li {
    list-style: none;
}
.logout-link {
    background: none;
    border: none;
    width: 100%;
    padding: 10px;
    text-align: left;
    cursor: pointer;
}
.logout-link:hover {
    background-color: #e0e0e0;
}
    </style>
    <li class="dropdown user-menu">
    <a href="#" tabindex="0">Usuario <b class="caret"></b></a>
    <ul class="dropdown-menu">
        <li>
            <button class="logout-link">Salir</button>
        </li>
    </ul>
    </li>
    `;
  }
}
customElements.define('logout-button', LogoutButton);