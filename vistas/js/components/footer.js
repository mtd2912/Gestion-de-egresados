class AppFooter extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = `
        <footer class="footer">
          <div class="footer-container">
            <div class="footer-col logo">
              <img src="../img/png/logo.png" alt="CUL Logo">
              <p>Calle 58 #55 - 24A<br>
              Barranquilla, Colombia<br>
              Tel: (605) 344 4158<br>
              Cel: +57 314 8962734</p>
            </div>
            <div class="footer-col">
              <h3>Redes Sociales</h3>
              <p>Facebook</p>
              <p>Instagram</p>
              <p>Youtube</p>
              <p>LinkedIn</p>
            </div>
            <div class="footer-col">
              <h3>Enlaces de Interés</h3>
              <p>Directorio</p>
              <p>Atención al usuario</p>
              <p>Reserva de audiovisuales</p>
              <p>Asesoría psicológica</p>
              <p>Solicitud de tutorías</p>
            </div>
            <div class="footer-col">
              <p>Corporación Universitaria Latinoamericana – CUL<br>
              Institución de Educación Superior<br>
              Aprobada mediante Resolución No. 8103<br>
              del 19 de diciembre de 2006 del MEN.</p>
              <br>
              <p>Política de protección de datos</p>
              <p>Buzón de sugerencias</p>
            </div>
        </footer>
        </div>
            <div class="footer-copyright">
                © 2026 Corporación Universitaria Latinoamericana. Todos los derechos reservados.
            </div>`;
    }
}
customElements.define('app-footer', AppFooter);