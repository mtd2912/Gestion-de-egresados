// Tabs Module - Gestion de tabs sin Bootstrap
const TabsModule = (() => {
    function init() {
        console.log('Inicializando TabsModule...');
        bindEvents();
    }

    function bindEvents() {
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const tabName = this.getAttribute('data-tab');
                switchTab(tabName);
            });
        });
        console.log('Eventos de tabs vinculados');
    }

    function switchTab(tabName) {
        const allButtons = document.querySelectorAll('.tab-button');
        const allPanes = document.querySelectorAll('.tab-pane');
        
        allButtons.forEach(btn => btn.classList.remove('active'));
        allPanes.forEach(pane => pane.classList.remove('active'));
        
        const selectedButton = document.querySelector('[data-tab="' + tabName + '"]');
        const selectedPane = document.getElementById(tabName);
        
        if (selectedButton && selectedPane) {
            selectedButton.classList.add('active');
            selectedPane.classList.add('active');
            console.log('Tab cambiada a: ' + tabName);
        }
    }

    return {
        init: init
    };
})();

// Inicializar
document.addEventListener('DOMContentLoaded', function() {
    TabsModule.init();
});
