/**
 * Inicializador de DataTable para alle las tablas del CRUD
 * Uso: DatatableInitializer.init(tableElement)
 */
const DatatableInitializer = (() => {
    // Verificar si DataTable ya está cargado
    const checkDataTableLoaded = () => {
        return typeof $ !== 'undefined' && $.fn.dataTable;
    };

    const initTable = (tableElement, options = {}) => {
        if (!tableElement) {
            console.warn('DatatableInitializer: Elemento de tabla no encontrado');
            return null;
        }

        // Opciones por defecto
        const defaultOptions = {
            language: {
                url: 'https://cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json'
            },
            responsive: true,
            pageLength: 10,
            lengthMenu: [[10, 25, 50, -1], [10, 25, 50, 'Todos']],
            searching: true,
            ordering: true,
            paging: true,
            info: true,
            dom: '<"top"lf>rt<"bottom"ip><"clear">',
            ...options
        };

        try {
            // Verificar si ya tiene DataTable inicializado
            if ($.fn.dataTable.isDataTable(tableElement)) {
                return $.fn.dataTable.api().table(tableElement);
            }

            // Inicializar DataTable
            const dataTable = $(tableElement).DataTable(defaultOptions);
            return dataTable;
        } catch (error) {
            console.warn('DatatableInitializer: ' + error.message);
            return null;
        }
    };

    const reinitTable = (tableElement, options = {}) => {
        if (!tableElement) return null;

        try {
            // Destruir tabla actual si existe
            if ($.fn.dataTable.isDataTable(tableElement)) {
                $(tableElement).DataTable().destroy();
            }

            // Reinicializar
            return initTable(tableElement, options);
        } catch (error) {
            console.warn('DatatableInitializer: ' + error.message);
            return null;
        }
    };

    return {
        /**
         * Inicializa DataTable en una tabla existente
         * @param {HTMLElement|string} tableSelector - Elemento tabla o selector CSS
         * @param {Object} options - Opciones adicionales de DataTable
         */
        init: function(tableSelector, options = {}) {
            let tableElement;

            if (typeof tableSelector === 'string') {
                tableElement = document.querySelector(tableSelector);
            } else {
                tableElement = tableSelector;
            }

            if (!checkDataTableLoaded()) {
                console.warn('DatatableInitializer: jQuery o DataTable no está cargado');
                return null;
            }

            return initTable(tableElement, options);
        },

        /**
         * Reinicializa una tabla ya existente (útil tras agregar filas dinámicamente)
         * @param {HTMLElement|string} tableSelector - Elemento tabla o selector CSS
         * @param {Object} options - Opciones adicionales de DataTable
         */
        reinit: function(tableSelector, options = {}) {
            let tableElement;

            if (typeof tableSelector === 'string') {
                tableElement = document.querySelector(tableSelector);
            } else {
                tableElement = tableSelector;
            }

            if (!checkDataTableLoaded()) {
                console.warn('DatatableInitializer: jQuery o DataTable no está cargado');
                return null;
            }

            return reinitTable(tableElement, options);
        },

        /**
         * Destruye una tabla DataTable
         * @param {HTMLElement|string} tableSelector - Elemento tabla o selector CSS
         */
        destroy: function(tableSelector) {
            let tableElement;

            if (typeof tableSelector === 'string') {
                tableElement = document.querySelector(tableSelector);
            } else {
                tableElement = tableSelector;
            }

            if (!tableElement) return;

            try {
                if ($.fn.dataTable.isDataTable(tableElement)) {
                    $(tableElement).DataTable().destroy();
                }
            } catch (error) {
                console.warn('DatatableInitializer: ' + error.message);
            }
        },

        /**
         * Obtiene la instancia de DataTable de una tabla
         * @param {HTMLElement|string} tableSelector - Elemento tabla o selector CSS
         */
        getInstance: function(tableSelector) {
            let tableElement;

            if (typeof tableSelector === 'string') {
                tableElement = document.querySelector(tableSelector);
            } else {
                tableElement = tableSelector;
            }

            if (!tableElement) return null;

            try {
                if ($.fn.dataTable.isDataTable(tableElement)) {
                    return $(tableElement).DataTable();
                }
            } catch (error) {
                console.warn('DatatableInitializer: ' + error.message);
            }

            return null;
        }
    };
})();
