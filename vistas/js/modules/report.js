const API_BASE = 'https://egresados-cul.onrender.com';

const ESTADOS_EMPLEADO = ['2', '3', '4'];

// ── Estado global del módulo ──
let allGraduates  = [];
let allPrograms   = [];
let allStatuses   = [];
let allLevels     = [];
let filteredData  = [];

// ── Inicialización ──
document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  const rol   = localStorage.getItem('rol');

  if (!token) { window.location.href = '../pages/login.html'; return; }
  if (rol !== '1') {
    document.getElementById('access-denied').style.display = 'flex';
    document.getElementById('report-content').style.display = 'none';
    return;
  }

  LoadingSpinner.show('Cargando datos del sistema...');
  try {
    await Promise.all([
      cargarGraduados(token),
      cargarProgramas(token),
      cargarEstados(token),
      cargarNiveles(token)
    ]);
    poblarSelectores();
    actualizarContadorTotal();
  } catch (e) {
    Toast.error('Error al cargar datos. Verifica tu conexión.');
    console.error(e);
  } finally {
    LoadingSpinner.hide();
  }

  // Botones
  document.getElementById('btn-generar').addEventListener('click', generarReporte);
  document.getElementById('btn-limpiar').addEventListener('click', limpiarFiltros);
  document.getElementById('btn-pdf').addEventListener('click', exportarPDF);
});

// ═══════════════════════════════════════
// CARGA DE DATOS DESDE LA API
// ═══════════════════════════════════════

async function cargarGraduados(token) {
  const res = await fetch(`${API_BASE}/get_graduates`, {
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
  });
  if (!res.ok) throw new Error('Error al cargar graduados');
  allGraduates = await res.json();
}

async function cargarProgramas(token) {
  try {
    const res = await fetch(`${API_BASE}/get_programs`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) allPrograms = await res.json();
  } catch (_) { allPrograms = []; }
}

async function cargarEstados(token) {
  try {
    const res = await fetch(`${API_BASE}/get_employment_statuses`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) allStatuses = await res.json();
  } catch (_) { allStatuses = []; }
}

async function cargarNiveles(token) {
  try {
    const res = await fetch(`${API_BASE}/get_academic_levels`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) allLevels = await res.json();
  } catch (_) { allLevels = []; }
}

// ═══════════════════════════════════════
// POBLAR SELECTORES CON DATOS REALES
// ═══════════════════════════════════════

function poblarSelectores() {
  // Programas
  const selProg = document.getElementById('filter-programa');
  allPrograms.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id_program ?? p.id ?? p.program_id ?? '';
    opt.textContent = p.program_name ?? p.name ?? `Programa ${opt.value}`;
    selProg.appendChild(opt);
  });

  // Estados de empleo
  const selStatus = document.getElementById('filter-estado');
  allStatuses.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s.id_status ?? s.id ?? s.status_id ?? '';
    opt.textContent = s.description ?? s.name ?? `Estado ${opt.value}`;
    selStatus.appendChild(opt);
  });

  // Niveles académicos
  const selLevel = document.getElementById('filter-nivel');
  allLevels.forEach(l => {
    const opt = document.createElement('option');
    opt.value = l.id_level ?? l.id ?? l.level_id ?? '';
    opt.textContent = l.description ?? l.name ?? `Nivel ${opt.value}`;
    selLevel.appendChild(opt);
  });

  // Años dinámicos
  const anios = [...new Set(allGraduates.map(g => g.graduation_year).filter(Boolean))].sort();
  const selDesde = document.getElementById('filter-anio-desde');
  const selHasta = document.getElementById('filter-anio-hasta');
  anios.forEach(a => {
    [selDesde, selHasta].forEach(sel => {
      const opt = document.createElement('option');
      opt.value = a; opt.textContent = a;
      sel.appendChild(opt);
    });
  });
}

function actualizarContadorTotal() {
  const el = document.getElementById('total-bd');
  if (el) el.textContent = allGraduates.length;
}

// ═══════════════════════════════════════
// LÓGICA DE FILTRADO
// ═══════════════════════════════════════

function generarReporte() {
  const programa  = document.getElementById('filter-programa').value;
  const estado    = document.getElementById('filter-estado').value;
  const nivel     = document.getElementById('filter-nivel').value;
  const anioDesde = parseInt(document.getElementById('filter-anio-desde').value) || 0;
  const anioHasta = parseInt(document.getElementById('filter-anio-hasta').value) || 9999;
  const activo    = document.getElementById('filter-activo').value;

  filteredData = allGraduates.filter(g => {
    if (programa && String(g.id_program) !== programa)   return false;
    if (estado   && String(g.id_status)  !== estado)     return false;
    if (nivel    && String(g.id_level)   !== nivel)      return false;
    if (g.graduation_year < anioDesde || g.graduation_year > anioHasta) return false;
    if (activo === 'true'  && !g.active) return false;
    if (activo === 'false' &&  g.active) return false;
    return true;
  });

  renderizarResultados(filteredData);
  actualizarKPIs(filteredData);

  // Habilitar botón PDF
  document.getElementById('btn-pdf').disabled = filteredData.length === 0;
}

function limpiarFiltros() {
  ['filter-programa','filter-estado','filter-nivel','filter-anio-desde','filter-anio-hasta','filter-activo']
    .forEach(id => { document.getElementById(id).value = ''; });
  filteredData = [];
  document.getElementById('report-results').innerHTML = estadoVacioHTML('Aplica los filtros para generar un reporte.', '🔍');
  document.getElementById('kpi-section').style.display = 'none';
  document.getElementById('btn-pdf').disabled = true;
}

// ═══════════════════════════════════════
// RENDER DE RESULTADOS
// ═══════════════════════════════════════

function renderizarResultados(data) {
  const container = document.getElementById('report-results');

  if (data.length === 0) {
    container.innerHTML = estadoVacioHTML('No se encontraron egresados con los filtros seleccionados.', '🗂️');
    return;
  }

  container.innerHTML = `
    <div class="results-header">
      <span class="results-title">📊 Resultados del Reporte</span>
      <span class="results-count">${data.length} egresado${data.length !== 1 ? 's' : ''}</span>
    </div>
    <div class="report-table-wrapper">
      <table class="report-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre Completo</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Año Grad.</th>
            <th>Programa</th>
            <th>Nivel</th>
            <th>Estado</th>
            <th>Activo</th>
          </tr>
        </thead>
        <tbody>
          ${data.map((g, i) => `
            <tr>
              <td style="color:var(--text-muted);font-size:12px;">${i + 1}</td>
              <td><strong>${g.first_name ?? ''} ${g.last_name ?? ''}</strong></td>
              <td style="color:var(--text-secondary)">${g.email ?? '—'}</td>
              <td>${g.phone ?? '—'}</td>
              <td><span style="font-weight:700;color:var(--gold-dim)">${g.graduation_year ?? '—'}</span></td>
              <td>${nombrePrograma(g.id_program)}</td>
              <td>${nombreNivel(g.id_level)}</td>
              <td>${badgeEstado(g.id_status)}</td>
              <td>${g.active 
                ? '<span class="badge badge-active">Activo</span>' 
                : '<span class="badge badge-unemployed">Inactivo</span>'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function actualizarKPIs(data) {
  const total      = data.length;
  const activos    = data.filter(g => g.active).length;
  const empleados  = data.filter(g => ESTADOS_EMPLEADO.includes(String(g.id_status))).length;
  const anios      = [...new Set(data.map(g => g.graduation_year).filter(Boolean))];
  const pctEmp     = total > 0 ? Math.round((empleados / total) * 100) : 0;

  document.getElementById('kpi-total').textContent    = total;
  document.getElementById('kpi-activos').textContent  = activos;
  document.getElementById('kpi-empleados').textContent = `${pctEmp}%`;
  document.getElementById('kpi-anios').textContent    = anios.length > 0
    ? `${Math.min(...anios)} – ${Math.max(...anios)}`
    : '—';
  document.getElementById('kpi-section').style.display = 'grid';
}

// ── Helpers de nombres ──
function nombrePrograma(id) {
  const p = allPrograms.find(x => String(x.id_program ?? x.id) === String(id));
  return p ? (p.program_name ?? p.name ?? `ID ${id}`) : (id ? `ID ${id}` : '—');
}
function nombreNivel(id) {
  const l = allLevels.find(x => String(x.id_level ?? x.id) === String(id));
  return l ? (l.description ?? l.name ?? `ID ${id}`) : (id ? `ID ${id}` : '—');
}
function badgeEstado(id) {
  const s = allStatuses.find(x => String(x.id_status ?? x.id) === String(id));
  const nombre = s ? (s.description ?? s.name ?? `ID ${id}`) : (id ? `ID ${id}` : '—');
  const isEmp  = ESTADOS_EMPLEADO.includes(String(id));
  return `<span class="badge ${isEmp ? 'badge-employed' : 'badge-unemployed'}">${nombre}</span>`;
}

function estadoVacioHTML(msg, icon = '📋') {
  return `
    <div class="empty-state">
      <span class="empty-icon">${icon}</span>
      <p>${msg}</p>
    </div>
  `;
}

// ═══════════════════════════════════════
// EXPORTACIÓN A PDF con jsPDF + AutoTable
// ═══════════════════════════════════════

async function exportarPDF() {
  if (filteredData.length === 0) { Toast.error('No hay datos para exportar.'); return; }

  const btn = document.getElementById('btn-pdf');
  btn.disabled = true;
  btn.innerHTML = '⏳ Generando PDF...';

  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const GOLD   = [201, 168, 76];
    const BLUE   = [30,  64, 175];
    const BLUEDARK = [30, 58, 138];
    const WHITE  = [255, 255, 255];
    const GRAY   = [75,  85,  99];
    const BGROW  = [249, 250, 251];
    const W = doc.internal.pageSize.getWidth();
    const H = doc.internal.pageSize.getHeight();
    const generatedDate = new Date().toLocaleDateString('es-CO', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

    // ── Función de cabecera por página ──
    const drawHeader = () => {
      // Fondo azul degradado superior
      doc.setFillColor(...BLUEDARK);
      doc.rect(0, 0, W, 22, 'F');

      // Franja dorada
      doc.setFillColor(...GOLD);
      doc.rect(0, 22, W, 2, 'F');

      // Logo / Nombre institución
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(...WHITE);
      doc.text('CUL', 12, 14);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(200, 200, 200);
      doc.text('Corporación Universitaria del Litoral', 12, 19.5);

      // Título del reporte
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(...WHITE);
      doc.text('REPORTE DE EGRESADOS', W / 2, 11, { align: 'center' });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...GOLD);
      doc.text('Sistema de Seguimiento a Graduados', W / 2, 17, { align: 'center' });

      // Fecha — derecha
      doc.setTextColor(200, 200, 200);
      doc.setFontSize(7.5);
      doc.text(`Generado: ${generatedDate}`, W - 12, 14, { align: 'right' });
    };

    // ── Función de pie de página ──
    const drawFooter = (pageNum, totalPages) => {
      doc.setFillColor(...BLUEDARK);
      doc.rect(0, H - 12, W, 12, 'F');
      doc.setFillColor(...GOLD);
      doc.rect(0, H - 13.5, W, 1.5, 'F');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(...WHITE);
      doc.text('© CUL — Corporación Universitaria del Litoral | Documento Confidencial', 12, H - 4.5);
      doc.text(`Página ${pageNum} de ${totalPages}`, W - 12, H - 4.5, { align: 'right' });
    };

    // ── Resumen de filtros aplicados ──
    const getResumenFiltros = () => {
      const partes = [];
      const pId = document.getElementById('filter-programa').value;
      const sId = document.getElementById('filter-estado').value;
      const lId = document.getElementById('filter-nivel').value;
      const ad  = document.getElementById('filter-anio-desde').value;
      const ah  = document.getElementById('filter-anio-hasta').value;
      const act = document.getElementById('filter-activo').value;
      if (pId) partes.push(`Programa: ${nombrePrograma(pId)}`);
      if (sId) partes.push(`Estado: ${allStatuses.find(x=>String(x.id_status??x.id)===sId)?.description ?? allStatuses.find(x=>String(x.id_status??x.id)===sId)?.name ?? sId}`);
      if (lId) partes.push(`Nivel: ${nombreNivel(lId)}`);
      if (ad || ah) partes.push(`Años: ${ad||'inicio'} – ${ah||'actual'}`);
      if (act === 'true')  partes.push('Solo Activos');
      if (act === 'false') partes.push('Solo Inactivos');
      return partes.length ? partes.join('   |   ') : 'Sin filtros aplicados (todos los egresados)';
    };

    // ── Bloque de KPIs en PDF ──
    const drawKPIs = () => {
      const total     = filteredData.length;
      const activos   = filteredData.filter(g => g.active).length;
      const empleados = filteredData.filter(g => ESTADOS_EMPLEADO.includes(String(g.id_status))).length;
      const pctEmp    = total > 0 ? Math.round((empleados / total) * 100) : 0;
      const anios     = filteredData.map(g => g.graduation_year).filter(Boolean);
      const kpis = [
        { label: 'Total Egresados', value: String(total),    color: BLUE },
        { label: 'Activos',         value: String(activos),  color: [22, 163, 74] },
        { label: 'Empleabilidad',   value: `${pctEmp}%`,    color: GOLD },
        { label: 'Rango de Años',   value: anios.length ? `${Math.min(...anios)}–${Math.max(...anios)}` : '—', color: GRAY },
      ];

      const boxW  = (W - 24 - (kpis.length - 1) * 5) / kpis.length;
      let x = 12;
      const y = 30;

      kpis.forEach(k => {
        doc.setFillColor(...WHITE);
        doc.roundedRect(x, y, boxW, 18, 2, 2, 'F');
        doc.setDrawColor(...k.color);
        doc.setLineWidth(0.6);
        doc.roundedRect(x, y, boxW, 18, 2, 2, 'S');

        // Línea inferior de color
        doc.setFillColor(...k.color);
        doc.rect(x, y + 15.5, boxW, 2.5, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.setTextColor(...k.color);
        doc.text(k.value, x + boxW / 2, y + 9, { align: 'center' });

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.5);
        doc.setTextColor(...GRAY);
        doc.text(k.label.toUpperCase(), x + boxW / 2, y + 13.5, { align: 'center' });

        x += boxW + 5;
      });

      // Filtros aplicados
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7);
      doc.setTextColor(...GRAY);
      doc.text(`Filtros: ${getResumenFiltros()}`, 12, y + 23);
    };

    // ── Construir tabla de datos ──
    const columns = [
      { header: '#',              dataKey: 'idx'    },
      { header: 'Nombre',         dataKey: 'nombre' },
      { header: 'Email',          dataKey: 'email'  },
      { header: 'Teléfono',       dataKey: 'phone'  },
      { header: 'Año Grad.',      dataKey: 'anio'   },
      { header: 'Programa',       dataKey: 'prog'   },
      { header: 'Nivel',          dataKey: 'nivel'  },
      { header: 'Estado Empleo',  dataKey: 'estado' },
      { header: 'Condición',      dataKey: 'activo' },
    ];

    const rows = filteredData.map((g, i) => ({
      idx:    i + 1,
      nombre: `${g.first_name ?? ''} ${g.last_name ?? ''}`.trim(),
      email:  g.email  ?? '—',
      phone:  g.phone  ?? '—',
      anio:   g.graduation_year ?? '—',
      prog:   nombrePrograma(g.id_program),
      nivel:  nombreNivel(g.id_level),
      estado: (() => { const s = allStatuses.find(x=>String(x.id_status??x.id)===String(g.id_status)); return s?(s.description??s.name??'—'):'—'; })(),
      activo: g.active ? 'Activo' : 'Inactivo',
    }));

    // ── Primera página ──
    drawHeader();
    drawKPIs();

    // Tabla con autoTable
    doc.autoTable({
      columns,
      body: rows,
      startY: 57,
      margin: { left: 12, right: 12, bottom: 18 },
      styles: {
        font: 'helvetica',
        fontSize: 8,
        cellPadding: { top: 4, bottom: 4, left: 5, right: 5 },
        textColor: [17, 24, 39],
        lineColor: [229, 231, 235],
        lineWidth: 0.3,
        overflow: 'linebreak',
      },
      headStyles: {
        fillColor: BLUE,
        textColor: WHITE,
        fontSize: 7.5,
        fontStyle: 'bold',
        halign: 'left',
        cellPadding: { top: 5, bottom: 5, left: 5, right: 5 },
      },
      alternateRowStyles: {
        fillColor: BGROW,
      },
      columnStyles: {
        idx:    { cellWidth: 8,  halign: 'center', textColor: GRAY },
        anio:   { cellWidth: 18, halign: 'center', fontStyle: 'bold', textColor: [180, 140, 50] },
        activo: { cellWidth: 18, halign: 'center' },
        email:  { cellWidth: 45 },
        phone:  { cellWidth: 28 },
        prog:   { cellWidth: 40 },
        nivel:  { cellWidth: 30 },
      },
      didParseCell: (data) => {
        if (data.column.dataKey === 'activo' && data.section === 'body') {
          data.cell.styles.textColor = data.cell.raw === 'Activo'
            ? [21, 128, 61] : [185, 28, 28];
          data.cell.styles.fontStyle = 'bold';
        }
      },
      didDrawPage: (data) => {
        const totalPages = doc.internal.getNumberOfPages();
        drawFooter(data.pageNumber, totalPages);
        // Repintar cabecera en páginas siguientes
        if (data.pageNumber > 1) {
          drawHeader();
        }
      },
    });

    // Actualizar pies en todas las páginas con total correcto
    const totalPages = doc.internal.getNumberOfPages();
    for (let p = 1; p <= totalPages; p++) {
      doc.setPage(p);
      drawFooter(p, totalPages);
    }

    // ── Guardar PDF ──
    const fileName = `Reporte_Egresados_CUL_${new Date().toISOString().slice(0,10)}.pdf`;
    doc.save(fileName);

    // 📧 Notificar al admin sobre el reporte generado
    EmailNotifier.notificarReporte({
      filtros:         getResumenFiltros(),
      totalRegistros:  filteredData.length,
      usuario:         localStorage.getItem('email') || 'Administrador',
    });

    Toast.success(`✅ PDF generado: ${fileName}`);
  } catch (err) {
    console.error(err);
    Toast.error('Error al generar el PDF. Intenta de nuevo.');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Exportar PDF';
  }
}