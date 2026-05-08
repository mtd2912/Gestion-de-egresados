const EMAIL_CONFIG = {
  publicKey:   'S7k1GUoE2KZlUf-_M',        // Account → API Keys → Public Key
  serviceId:   'service_lmpxsvn',        // Email Services → tu servicio
  templateId:  'template_qfjdbvr',       // Email Templates → tu plantilla
  adminEmail:  'lgcarpiot24@ul.edu.co',     // Correo del administrador
  systemName:  'Sistema CUL',
  systemLogo:  '🎓',
};
// ═══════════════════════════════════════════════════
// TIPOS DE EVENTO (cada uno tiene asunto y color)
// ═══════════════════════════════════════════════════
const EVENTOS = {
  REPORTE_GENERADO: {
    icono:  '📊',
    asunto: '[CUL] Reporte de Egresados Generado',
    color:  '#1e40af',
    nivel:  'info',
  },
  GRADUADO_CREADO: {
    icono:  '🎓',
    asunto: '[CUL] Nuevo Egresado Registrado',
    color:  '#16a34a',
    nivel:  'success',
  },
  GRADUADO_EDITADO: {
    icono:  '✏️',
    asunto: '[CUL] Egresado Modificado',
    color:  '#c9a84c',
    nivel:  'warning',
  },
  GRADUADO_ELIMINADO: {
    icono:  '🗑️',
    asunto: '[CUL] ⚠️ Egresado Eliminado — Acción Crítica',
    color:  '#dc2626',
    nivel:  'danger',
  },
  USUARIO_REGISTRADO: {
    icono:  '👤',
    asunto: '[CUL] Nuevo Usuario Registrado en el Sistema',
    color:  '#16a34a',
    nivel:  'success',
  },
  USUARIO_ELIMINADO: {
    icono:  '🚫',
    asunto: '[CUL] ⚠️ Usuario Eliminado — Acción Crítica',
    color:  '#dc2626',
    nivel:  'danger',
  },
  OFERTA_CREADA: {
    icono:  '📋',
    asunto: '[CUL] Nueva Oferta de Trabajo Publicada',
    color:  '#1e40af',
    nivel:  'info',
  },
  OFERTA_ELIMINADA: {
    icono:  '❌',
    asunto: '[CUL] ⚠️ Oferta de Trabajo Eliminada',
    color:  '#dc2626',
    nivel:  'danger',
  },
  ACCION_CRITICA: {
    icono:  '🔒',
    asunto: '[CUL] ⚠️ Acción Crítica Detectada',
    color:  '#7c3aed',
    nivel:  'danger',
  },
};

// ═══════════════════════════════════════════════════
// GENERADOR DE HTML para el cuerpo del correo
// ═══════════════════════════════════════════════════
function construirHTMLCorreo({ tipo, titulo, cuerpo, detalles = [], accion = null }) {
  const fecha = new Date().toLocaleString('es-CO', { dateStyle: 'long', timeStyle: 'short' });

  const lineasDetalles = detalles.map(({ etiqueta, valor }) =>
    `${etiqueta}: ${valor ?? '—'}`
  ).join('\n');

  return `Sistema CUL - ${fecha}

${titulo}

${cuerpo}

${lineasDetalles}

${accion ? accion.url : ''}

---
Corporación Universitaria Latinoamericana - CUL
Este mensaje fue generado automáticamente.`;
}

// ═══════════════════════════════════════════════════
// CLASE PRINCIPAL — EmailNotifier
// ═══════════════════════════════════════════════════
class EmailNotifier {

  /** Inicializa EmailJS con la clave pública */
  static init() {
    if (typeof emailjs === 'undefined') {
      console.warn('[EmailNotifier] EmailJS no cargado. Agrega el SDK al HTML.');
      return false;
    }
    emailjs.init({ publicKey: EMAIL_CONFIG.publicKey });
    return true;
  }

  /**
   * Envía un correo al administrador.
   * @param {string}   tipo      - Clave de EVENTOS
   * @param {string}   titulo    - Título del banner
   * @param {string}   cuerpo    - Párrafo explicativo
   * @param {Array}    detalles  - [{etiqueta, valor}]
   * @param {Object}   [accion]  - {texto, url} para botón CTA (opcional)
   * @param {string}   [destino] - Email adicional (p.ej. el del propio usuario)
   */
  static async enviar({ tipo, titulo, cuerpo, detalles = [], accion = null, destino = null }) {
    if (typeof emailjs === 'undefined') {
      console.warn('[EmailNotifier] EmailJS no disponible, notificación omitida.');
      return;
    }

    // Inicializar siempre antes de enviar
    emailjs.init({ publicKey: EMAIL_CONFIG.publicKey });

    const html    = construirHTMLCorreo({ tipo, titulo, cuerpo, detalles, accion });
    const evento  = EVENTOS[tipo] ?? EVENTOS.ACCION_CRITICA;
    const usuario = localStorage.getItem('email') || 'Sistema';
    const rol     = localStorage.getItem('rol') === '1' ? 'Administrador' : 'Usuario';

    const destinatarios = [EMAIL_CONFIG.adminEmail];
    if (destino && destino !== EMAIL_CONFIG.adminEmail) destinatarios.push(destino);

    const params = {
      to_email:     destinatarios.join(','),
      to_name:      'Administrador CUL',
      subject:      evento.asunto,
      message:      html,
      html_body:    html,
      event_type:   tipo,
      event_title:  titulo,
      triggered_by: `${usuario} (${rol})`,
      timestamp:    new Date().toLocaleString('es-CO'),
    };

    try {
      await emailjs.send(EMAIL_CONFIG.serviceId, EMAIL_CONFIG.templateId, params);
      console.info(`[EmailNotifier] ✅ Correo "${evento.asunto}" enviado a ${destinatarios.join(', ')}`);
    } catch (err) {
      // No interrumpir el flujo si falla el correo
      console.error('[EmailNotifier] ❌ Error al enviar correo:', err);
    }
  }

  // ─────────────────────────────────────────────────
  // MÉTODOS ESPECÍFICOS por tipo de evento
  // ─────────────────────────────────────────────────

  /** Notifica que se generó un reporte PDF */
  static notificarReporte({ filtros, totalRegistros, usuario }) {
    const detalles = [
      { etiqueta: 'Generado por',       valor: usuario || localStorage.getItem('email') || 'Admin' },
      { etiqueta: 'Total de registros', valor: `<strong>${totalRegistros}</strong> egresados` },
      { etiqueta: 'Filtros aplicados',  valor: filtros || 'Sin filtros (todos los egresados)' },
      { etiqueta: 'Fecha y hora',       valor: new Date().toLocaleString('es-CO') },
      { etiqueta: 'Formato',            valor: 'PDF — jsPDF AutoTable' },
    ];
    return this.enviar({
      tipo:   `REPORTE_GENERADO`,
      titulo: `Reporte de Egresados Exportado`,
      cuerpo: `Se ha generado y descargado un reporte PDF del sistema de seguimiento a egresados.
                A continuación se detallan los parámetros utilizados en la consulta.`,
      detalles,
    });
  }

  /** Notifica la creación de un graduado */
  static notificarGraduadoCreado({ nombre, email, programa, anio }) {
    return this.enviar({
      tipo:   'GRADUADO_CREADO',
      titulo: 'Nuevo Egresado Registrado en el Sistema',
      cuerpo: `Se registró exitosamente un nuevo egresado en la plataforma CUL.`,
      detalles: [
        { etiqueta: 'Nombre completo', valor: nombre },
        { etiqueta: 'Email',           valor: email },
        { etiqueta: 'Programa',        valor: programa || '—' },
        { etiqueta: 'Año graduación',  valor: anio || '—' },
        { etiqueta: 'Registrado por',  valor: localStorage.getItem('email') || 'Sistema' },
        { etiqueta: 'Fecha',           valor: new Date().toLocaleString('es-CO') },
      ],
    });
  }

  /** Notifica la edición de un graduado */
  static notificarGraduadoEditado({ id, nombre, camposModificados }) {
    return this.enviar({
      tipo:   'GRADUADO_EDITADO',
      titulo: `Egresado Modificado — ID ${id}`,
      cuerpo: `Se realizaron cambios sobre el registro de un egresado en el sistema.`,
      detalles: [
        { etiqueta: 'ID Egresado',      valor: id },
        { etiqueta: 'Nombre',           valor: nombre },
        { etiqueta: 'Campos editados',  valor: camposModificados || 'Actualización general' },
        { etiqueta: 'Modificado por',   valor: localStorage.getItem('email') || 'Sistema' },
        { etiqueta: 'Fecha',            valor: new Date().toLocaleString('es-CO') },
      ],
    });
  }

  /** ⚠️ Notifica eliminación de un graduado */
  static notificarGraduadoEliminado({ id, nombre }) {
    return this.enviar({
      tipo:   'GRADUADO_ELIMINADO',
      titulo: `⚠️ Egresado Eliminado  — ID ${id} - ${nombre}`,
      cuerpo: `Se eliminó el registro de un egresado del sistema. Si esta acción fue un error, contacta con administración`,
      detalles: [
        { etiqueta: 'ID Eliminado',  valor: id},
        { etiqueta: 'Nombre',        valor: nombre || 'No disponible' },
        { etiqueta: 'Eliminado por', valor: localStorage.getItem('email') || 'Sistema' },
        { etiqueta: 'Fecha y hora',  valor: new Date().toLocaleString('es-CO') },
        { etiqueta: 'Severidad',     valor: 'Alta' },
      ],
    });
  }

  /** Notifica el registro de un nuevo usuario */
  static notificarUsuarioRegistrado({ nombre, email, tipo }) {
    return this.enviar({
      tipo:   'USUARIO_REGISTRADO',
      titulo: 'Nuevo Usuario Registrado',
      cuerpo: `Un nuevo usuario ha sido creado en el sistema CUL. Verifica que los datos sean correctos.`,
      detalles: [
        { etiqueta: 'Nombre',    valor: nombre },
        { etiqueta: 'Email',     valor: email },
        { etiqueta: 'Tipo',      valor: tipo || 'Estándar' },
        { etiqueta: 'Fecha',     valor: new Date().toLocaleString('es-CO') },
      ],
      destino: email, // También notifica al propio usuario
    });
  }

  /** ⚠️ Notifica eliminación de un usuario */
  static notificarUsuarioEliminado({ id, nombre, email }) {
    return this.enviar({
      tipo:   'USUARIO_ELIMINADO',
      titulo: `⚠️ Usuario Eliminado — ID ${id}`,
      cuerpo: `<span style="color:#dc2626;font-weight:700;">ACCIÓN CRÍTICA:</span>
               Se eliminó un usuario del sistema. Verifica que esta acción sea correcta.`,
      detalles: [
        { etiqueta: 'ID',           valor: `<span style="color:#dc2626;font-weight:700;">${id}</span>` },
        { etiqueta: 'Nombre',       valor: nombre || '—' },
        { etiqueta: 'Email',        valor: email || '—' },
        { etiqueta: 'Eliminado por',valor: localStorage.getItem('email') || 'Sistema' },
        { etiqueta: 'Fecha',        valor: new Date().toLocaleString('es-CO') },
        { etiqueta: 'Severidad',    valor: '<span style="color:#dc2626;font-weight:700;">🔴 CRÍTICA</span>' },
      ],
    });
  }

  /** Notifica publicación de una oferta de trabajo */
  static notificarOfertaCreada({ titulo: tituloOferta, empresa, modalidad }) {
    return this.enviar({
      tipo:   'OFERTA_CREADA',
      titulo: 'Nueva Oferta de Trabajo Publicada',
      cuerpo: `Se publicó una nueva oferta laboral disponible para los egresados de CUL.`,
      detalles: [
        { etiqueta: 'Título',       valor: tituloOferta },
        { etiqueta: 'Empresa',      valor: empresa || '—' },
        { etiqueta: 'Modalidad',    valor: modalidad || '—' },
        { etiqueta: 'Publicado por',valor: localStorage.getItem('email') || 'Sistema' },
        { etiqueta: 'Fecha',        valor: new Date().toLocaleString('es-CO') },
      ],
    });
  }

  /** ⚠️ Notifica eliminación de oferta de trabajo */
  static notificarOfertaEliminada({ id, titulo: tituloOferta }) {
    return this.enviar({
      tipo:   'OFERTA_ELIMINADA',
      titulo: `⚠️ Oferta Eliminada — ID ${id}`,
      cuerpo: `Se eliminó una oferta de trabajo del sistema.`,
      detalles: [
        { etiqueta: 'ID Oferta',    valor: id },
        { etiqueta: 'Título',       valor: tituloOferta || '—' },
        { etiqueta: 'Eliminado por',valor: localStorage.getItem('email') || 'Sistema' },
        { etiqueta: 'Fecha',        valor: new Date().toLocaleString('es-CO') },
      ],
    });
  }

  /** Notificación genérica para cualquier acción crítica */
  static notificarAccionCritica({ titulo, descripcion, detalles = [] }) {
    return this.enviar({
      tipo:   'ACCION_CRITICA',
      titulo,
      cuerpo: descripcion,
      detalles: [
        ...detalles,
        { etiqueta: 'Ejecutado por', valor: localStorage.getItem('email') || 'Sistema' },
        { etiqueta: 'Fecha y hora',  valor: new Date().toLocaleString('es-CO') },
      ],
    });
  }
}

// Exporta para uso en módulos y también disponible globalmente
window.EmailNotifier = EmailNotifier;