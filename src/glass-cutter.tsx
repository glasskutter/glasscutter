import { useState } from 'react';
import { Plus, X, Printer, Download, HelpCircle, Scissors, LayoutGrid } from "lucide-react";

const theme = {
  colors: {
    primary: '#2563eb',
    primaryHover: '#1d4ed8',
    primaryLight: '#dbeafe',
    secondary: '#f1f5f9',
    secondaryHover: '#e2e8f0',
    text: '#0f172a',
    textMuted: '#64748b',
    border: '#e2e8f0',
    background: '#f8fafc',
    surface: '#ffffff',
    success: '#22c55e',
    warning: '#f59e0b',
  },
  radius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    full: '9999px',
  }
};

function BentoButton({ children, variant = 'primary', size = 'md', icon = null, disabled = false, className = '', ...props }) {
  const baseStyles = "inline-flex items-center justify-center font-semibold transition-all duration-200 active:scale-[0.98]";
  const sizes = { sm: 'px-4 py-2 text-sm gap-1.5', md: 'px-6 py-3 text-base gap-2', lg: 'px-8 py-4 text-lg gap-2', icon: 'p-2.5' };
  const sizeRadius = { sm: theme.radius.md, md: theme.radius.lg, lg: theme.radius.lg, icon: theme.radius.md };

  return (
    <button 
      className={`${baseStyles} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      style={{
        borderRadius: sizeRadius[size],
        backgroundColor: variant === 'primary' ? theme.colors.primary : variant === 'secondary' ? theme.colors.secondary : variant === 'outline' ? 'white' : 'transparent',
        color: variant === 'primary' ? 'white' : variant === 'outline' ? theme.colors.primary : theme.colors.text,
        border: variant === 'outline' ? `2px solid ${theme.colors.primary}` : 'none',
      }}
      disabled={disabled}
      {...props}
    >
      {icon && icon}
      {children}
    </button>
  );
}

function BentoCard({ children, className = '', padding = 'md' }) {
  const paddings = { sm: 'p-4', md: 'p-6', lg: 'p-8' };
  return (
    <div className={`bg-white shadow-sm ${paddings[padding]} ${className}`} style={{ borderRadius: theme.radius.xl, border: `1px solid ${theme.colors.border}` }}>
      {children}
    </div>
  );
}

function BentoInput({ className = '', disabled = false, style = {}, ...props }) {
  return (
    <input
      className={`w-full px-4 py-3 text-base outline-none transition-all duration-200 ${className}`}
      style={{ 
        borderRadius: theme.radius.md, 
        border: `2px solid ${theme.colors.border}`,
        backgroundColor: disabled ? theme.colors.secondary : theme.colors.surface,
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? 'not-allowed' : 'text',
        ...style
      }}
      disabled={disabled}
      onFocus={(e) => { if (!disabled) e.target.style.borderColor = theme.colors.primary }}
      onBlur={(e) => { e.target.style.borderColor = theme.colors.border }}
      {...props}
    />
  );
}

function BentoSwitch({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="relative w-12 h-7 rounded-full transition-colors duration-200 flex-shrink-0"
      style={{ backgroundColor: checked ? theme.colors.primary : theme.colors.border, border: `2px solid ${checked ? theme.colors.primary : theme.colors.border}` }}
    >
      <span className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200" style={{ left: checked ? '22px' : '2px' }} />
    </button>
  );
}

function BentoBadge({ children, variant = 'default' }) {
  const variants = { default: { bg: theme.colors.secondary, color: theme.colors.text }, primary: { bg: theme.colors.primaryLight, color: theme.colors.primary }, success: { bg: '#dcfce7', color: '#16a34a' } };
  const v = variants[variant];
  return <span className="inline-flex items-center justify-center w-7 h-7 text-sm font-bold rounded-full" style={{ backgroundColor: v.bg, color: v.color }}>{children}</span>;
}

function BentoTooltip({ children, content, show, onToggle }) {
  return (
    <div className="relative inline-block">
      <button type="button" onClick={onToggle} className="w-6 h-6 rounded-full flex items-center justify-center transition-colors" style={{ backgroundColor: theme.colors.secondary, color: theme.colors.textMuted }}>{children}</button>
      {show && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-4 text-sm text-white shadow-xl" style={{ backgroundColor: theme.colors.text, borderRadius: theme.radius.lg }}>
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0" style={{ borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderTop: `8px solid ${theme.colors.text}` }} />
        </div>
      )}
    </div>
  );
}

function parseInches(str) {
  if (!str || str.trim() === '') return 0;
  str = str.trim().replace(/\s+/g, ' ');
  if (/^\d+\.?\d*$/.test(str)) return parseFloat(str);
  if (/^\d+\/\d+$/.test(str)) { const [n, d] = str.split('/').map(Number); return d !== 0 ? n / d : 0; }
  const match = str.match(/^(\d+)[\s\-]+(\d+)\/(\d+)$/);
  if (match) { const [, whole, num, den] = match.map(Number); return den !== 0 ? whole + num / den : whole; }
  return parseFloat(str) || 0;
}

function toFraction(dec) {
  if (dec === 0) return '0';
  const whole = Math.floor(dec);
  const frac = dec - whole;
  if (frac < 0.01) return `${whole}`;
  const fracs = [[1,16],[1,8],[3,16],[1,4],[5,16],[3,8],[7,16],[1,2],[9,16],[5,8],[11,16],[3,4],[13,16],[7,8],[15,16]];
  let closest = fracs[0], minDiff = Math.abs(frac - fracs[0][0]/fracs[0][1]);
  for (const f of fracs) { const diff = Math.abs(frac - f[0]/f[1]); if (diff < minDiff) { minDiff = diff; closest = f; } }
  if (minDiff < 0.02) return whole > 0 ? `${whole} ${closest[0]}/${closest[1]}` : `${closest[0]}/${closest[1]}`;
  return dec.toFixed(2);
}

function optimizeCuts(sheetW, sheetH, pieces, kerf) {
  const sheets = [];
  let remaining = [];
  pieces.forEach((p, i) => { for (let q = 0; q < p.qty; q++) remaining.push({ ...p, id: `${i}-${q}`, w: p.w, h: p.h }); });
  // Sort by area descending (largest pieces first)
  remaining.sort((a, b) => (b.w * b.h) - (a.w * a.h));

  while (remaining.length > 0) {
    const placed = [];
    const spaces = [{ x: 0, y: 0, w: sheetW, h: sheetH }];

    // Process largest pieces first (iterate forward through sorted array)
    let i = 0;
    while (i < remaining.length) {
      const piece = remaining[i];
      let bestSpace = -1, bestFit = Infinity, rotated = false;
      for (let s = 0; s < spaces.length; s++) {
        const sp = spaces[s];
        // Try normal orientation
        if (piece.w + kerf <= sp.w + 0.001 && piece.h + kerf <= sp.h + 0.001) {
          const fit = sp.w * sp.h - piece.w * piece.h;
          if (fit < bestFit) { bestFit = fit; bestSpace = s; rotated = false; }
        }
        // Try rotated orientation
        if (piece.h + kerf <= sp.w + 0.001 && piece.w + kerf <= sp.h + 0.001) {
          const fit = sp.w * sp.h - piece.w * piece.h;
          if (fit < bestFit) { bestFit = fit; bestSpace = s; rotated = true; }
        }
      }
      if (bestSpace !== -1) {
        const sp = spaces[bestSpace];
        const pw = rotated ? piece.h : piece.w, ph = rotated ? piece.w : piece.h;
        placed.push({ ...piece, x: sp.x, y: sp.y, pw, ph, rotated });
        spaces.splice(bestSpace, 1);
        const rightW = sp.w - pw - kerf, bottomH = sp.h - ph - kerf;
        // Create new spaces from the cut
        if (rightW > 0.5) spaces.push({ x: sp.x + pw + kerf, y: sp.y, w: rightW, h: ph });
        if (bottomH > 0.5) spaces.push({ x: sp.x, y: sp.y + ph + kerf, w: sp.w, h: bottomH });
        spaces.sort((a, b) => a.w * a.h - b.w * b.h);
        remaining.splice(i, 1);
        // Don't increment i since we removed current element
      } else {
        i++;
      }
    }
    if (placed.length === 0 && remaining.length > 0) { sheets.push({ placed: [], unplaced: remaining }); break; }
    const usedArea = placed.reduce((s, p) => s + p.pw * p.ph, 0);
    const totalArea = sheetW * sheetH;
    sheets.push({ placed, waste: ((totalArea - usedArea) / totalArea * 100).toFixed(1), usage: (usedArea / totalArea * 100).toFixed(1) });
  }
  return sheets;
}

export default function GlassCutter() {
  const [sheetW, setSheetW] = useState('96');
  const [sheetH, setSheetH] = useState('48');
  const [useKerf, setUseKerf] = useState(false);
  const [kerfVal, setKerfVal] = useState('1/8');
  const [showKerfTip, setShowKerfTip] = useState(false);
  const [cuts, setCuts] = useState([{ w: '24', h: '18', qty: 2 }, { w: '12 1/2', h: '12 1/2', qty: 4 }]);
  const [sheets, setSheets] = useState([]);
  const [activeSheet, setActiveSheet] = useState(0);
  const [generating, setGenerating] = useState(false);

  const addCut = () => setCuts([...cuts, { w: '', h: '', qty: 1 }]);
  const updateCut = (i, field, val) => { const n = [...cuts]; n[i][field] = field === 'qty' ? Math.max(1, parseInt(val) || 1) : val; setCuts(n); };
  const removeCut = (i) => setCuts(cuts.filter((_, idx) => idx !== i));

  const sw = parseInches(sheetW), sh = parseInches(sheetH);
  const scale = sw > 0 && sh > 0 ? Math.min(520 / sw, 320 / sh) : 1;

  const calculate = () => {
    const kerf = useKerf ? parseInches(kerfVal) : 0;
    const pieces = cuts.map((c, i) => ({ w: parseInches(c.w), h: parseInches(c.h), qty: c.qty, idx: i })).filter(p => p.w > 0 && p.h > 0);
    if (sw <= 0 || sh <= 0 || pieces.length === 0) return;
    setSheets(optimizeCuts(sw, sh, pieces, kerf));
    setActiveSheet(0);
  };

  const handlePrint = () => {
    const svgEl = document.getElementById('cutting-diagram');
    if (!svgEl) return;
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const win = window.open('', '_blank');
    if (!win) { alert('Permite ventanas emergentes para imprimir'); return; }
    win.document.write(`<!DOCTYPE html><html><head><title>Corte - Lámina ${activeSheet + 1}</title><style>body{font-family:system-ui,sans-serif;padding:20px}h1{font-size:16px}p{font-size:12px;color:#666}table{width:100%;border-collapse:collapse;margin-top:20px;font-size:12px}th,td{border:1px solid #ddd;padding:8px;text-align:left}th{background:#f5f5f5}</style></head><body><h1>CORTE DE VIDRIO - Lámina ${activeSheet + 1}/${sheets.length}</h1><p>Tamaño: ${toFraction(sw)}" × ${toFraction(sh)}" | Uso: ${sheets[activeSheet]?.usage}% | Desperdicio: ${sheets[activeSheet]?.waste}%</p>${svgData}<table><thead><tr><th>No.</th><th>Ancho</th><th>Alto</th></tr></thead><tbody>${sheets[activeSheet]?.placed?.map((p, i) => `<tr><td><strong>${i + 1}</strong></td><td>${toFraction(p.rotated ? p.ph : p.pw)}"</td><td>${toFraction(p.rotated ? p.pw : p.ph)}"</td></tr>`).join('')}</tbody></table></body></html>`);
    win.document.close();
    setTimeout(() => win.print(), 250);
  };

  const handleDownloadPDF = async () => {
    if (sheets.length === 0) return;
    setGenerating(true);
    try {
      if (!window.jspdf) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF('landscape', 'pt', 'letter');
      const pageW = pdf.internal.pageSize.getWidth(), pageH = pdf.internal.pageSize.getHeight();
      
      for (let sheetIdx = 0; sheetIdx < sheets.length; sheetIdx++) {
        if (sheetIdx > 0) pdf.addPage();
        const sheet = sheets[sheetIdx];
        const margin = 50;
        
        pdf.setDrawColor(0); pdf.setLineWidth(1);
        pdf.rect(margin - 10, margin - 30, pageW - 2 * margin + 20, pageH - 2 * margin + 40);
        pdf.setFontSize(14); pdf.setFont('helvetica', 'bold');
        pdf.text('DISEÑO DE CORTE DE VIDRIO', margin, margin - 10);
        pdf.setFontSize(10); pdf.setFont('helvetica', 'normal');
        pdf.text(`Lámina ${sheetIdx + 1}/${sheets.length} | ${toFraction(sw)}" x ${toFraction(sh)}" | Uso: ${sheet.usage}% | Desperdicio: ${sheet.waste}%`, pageW - margin, margin - 10, { align: 'right' });
        
        const diagramW = pageW - margin * 2 - 60, diagramH = pageH - 200;
        const pdfScale = Math.min(diagramW / sw, diagramH / sh);
        const offsetX = margin + 40, offsetY = margin + 20;
        
        pdf.setLineWidth(0.3);
        pdf.line(offsetX, offsetY - 5, offsetX, offsetY - 15);
        pdf.line(offsetX + sw * pdfScale, offsetY - 5, offsetX + sw * pdfScale, offsetY - 15);
        pdf.line(offsetX, offsetY - 10, offsetX + sw * pdfScale, offsetY - 10);
        pdf.setFillColor(0);
        pdf.triangle(offsetX, offsetY - 10, offsetX + 5, offsetY - 7, offsetX + 5, offsetY - 13, 'F');
        pdf.triangle(offsetX + sw * pdfScale, offsetY - 10, offsetX + sw * pdfScale - 5, offsetY - 7, offsetX + sw * pdfScale - 5, offsetY - 13, 'F');
        pdf.setFontSize(9); pdf.text(`${toFraction(sw)}"`, offsetX + sw * pdfScale / 2, offsetY - 15, { align: 'center' });
        
        pdf.line(offsetX - 5, offsetY, offsetX - 15, offsetY);
        pdf.line(offsetX - 5, offsetY + sh * pdfScale, offsetX - 15, offsetY + sh * pdfScale);
        pdf.line(offsetX - 10, offsetY, offsetX - 10, offsetY + sh * pdfScale);
        pdf.triangle(offsetX - 10, offsetY, offsetX - 7, offsetY + 5, offsetX - 13, offsetY + 5, 'F');
        pdf.triangle(offsetX - 10, offsetY + sh * pdfScale, offsetX - 7, offsetY + sh * pdfScale - 5, offsetX - 13, offsetY + sh * pdfScale - 5, 'F');
        pdf.text(`${toFraction(sh)}"`, offsetX - 25, offsetY + sh * pdfScale / 2, { angle: 90 });
        
        pdf.setLineWidth(0.8); pdf.setFillColor(245, 245, 245);
        pdf.rect(offsetX, offsetY, sw * pdfScale, sh * pdfScale, 'FD');
        
        sheet.placed?.forEach((p, i) => {
          const x = offsetX + p.x * pdfScale, y = offsetY + p.y * pdfScale;
          const w = p.pw * pdfScale, h = p.ph * pdfScale;
          pdf.setLineWidth(0.8); pdf.setFillColor(255, 255, 255); pdf.setDrawColor(0);
          pdf.rect(x, y, w, h, 'FD');
          pdf.setFillColor(37, 99, 235); pdf.circle(x + w / 2, y + h / 2, 10, 'F');
          pdf.setFontSize(11); pdf.setFont('helvetica', 'bold'); pdf.setTextColor(255, 255, 255);
          pdf.text(`${i + 1}`, x + w / 2, y + h / 2 + 4, { align: 'center' });
          pdf.setTextColor(0, 0, 0); pdf.setFont('helvetica', 'normal'); pdf.setFontSize(8);
          if (w > 50) pdf.text(`${toFraction(p.rotated ? p.ph : p.pw)}"`, x + w / 2, y + 12, { align: 'center' });
          if (h > 50) pdf.text(`${toFraction(p.rotated ? p.pw : p.ph)}"`, x + 10, y + h / 2, { angle: 90 });
        });
        
        const tableY = offsetY + sh * pdfScale + 25;
        pdf.setFontSize(10); pdf.setFont('helvetica', 'bold'); pdf.setTextColor(0);
        pdf.text('LISTA DE CORTES:', margin, tableY);
        pdf.setFontSize(8);
        const colX = [margin, margin + 30, margin + 100, margin + 170];
        pdf.text('No.', colX[0], tableY + 15); pdf.text('ANCHO', colX[1], tableY + 15); pdf.text('ALTO', colX[2], tableY + 15);
        pdf.setLineWidth(0.3); pdf.line(margin, tableY + 18, margin + 220, tableY + 18);
        pdf.setFont('helvetica', 'normal');
        sheet.placed?.forEach((p, i) => {
          const rowY = tableY + 28 + i * 12;
          pdf.text(`${i + 1}`, colX[0], rowY);
          pdf.text(`${toFraction(p.rotated ? p.ph : p.pw)}"`, colX[1], rowY);
          pdf.text(`${toFraction(p.rotated ? p.pw : p.ph)}"`, colX[2], rowY);
        });
      }
      pdf.save('diseno-corte-vidrio.pdf');
    } catch (err) { console.error('Error PDF:', err); }
    finally { setGenerating(false); }
  };

  return (
    <div className="min-h-screen p-4 md:p-6" style={{ backgroundColor: theme.colors.background }}>
      <div className="max-w-4xl mx-auto space-y-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 flex items-center justify-center" style={{ backgroundColor: theme.colors.primary, borderRadius: theme.radius.lg }}>
            <LayoutGrid className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: theme.colors.text }}>Optimizador de Corte de Vidrio</h1>
            <p className="text-sm" style={{ color: theme.colors.textMuted }}>Minimiza desperdicio, maximiza eficiencia</p>
          </div>
        </div>

        <BentoCard>
          <div className="flex items-center gap-3 mb-5">
            <BentoBadge variant="primary">1</BentoBadge>
            <h2 className="font-semibold text-base" style={{ color: theme.colors.text }}>Dimensiones de la Lámina</h2>
          </div>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-32 space-y-2">
              <label className="text-xs font-medium" style={{ color: theme.colors.textMuted }}>Ancho (pulgadas)</label>
              <BentoInput value={sheetW} onChange={e => setSheetW(e.target.value)} placeholder="ej. 96 o 48 1/2" />
            </div>
            <div className="flex-1 min-w-32 space-y-2">
              <label className="text-xs font-medium" style={{ color: theme.colors.textMuted }}>Alto (pulgadas)</label>
              <BentoInput value={sheetH} onChange={e => setSheetH(e.target.value)} placeholder="ej. 48 o 36 3/4" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium invisible">Kerf</label>
              <div className="flex items-center gap-3 h-[50px]">
                <BentoSwitch checked={useKerf} onChange={setUseKerf} />
                <span className="text-sm font-medium" style={{ color: theme.colors.text }}>Kerf</span>
                <BentoTooltip show={showKerfTip} onToggle={() => setShowKerfTip(!showKerfTip)} content={<><p className="font-semibold mb-1">¿Qué es el Kerf?</p><p className="text-xs opacity-80">El kerf es el ancho del material que se pierde durante el corte debido al grosor de la hoja.</p></>}>
                  <HelpCircle className="w-3.5 h-3.5" />
                </BentoTooltip>
                <BentoInput value={kerfVal} onChange={e => setKerfVal(e.target.value)} placeholder="1/8" className="!w-20" disabled={!useKerf} />
              </div>
            </div>
          </div>

          <div className="my-6" style={{ height: '1px', backgroundColor: theme.colors.border }} />

          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <BentoBadge variant="primary">2</BentoBadge>
              <h2 className="font-semibold text-base" style={{ color: theme.colors.text }}>Piezas a Cortar</h2>
            </div>
            <BentoButton variant="secondary" size="sm" icon={<Plus className="w-4 h-4" />} onClick={addCut}>Agregar</BentoButton>
          </div>
          
          {cuts.length > 0 ? (
            <div style={{ borderRadius: theme.radius.lg, border: `1px solid ${theme.colors.border}`, overflow: 'hidden' }}>
              <table className="w-full text-sm">
                <thead style={{ backgroundColor: theme.colors.secondary }}>
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold w-16" style={{ color: theme.colors.textMuted }}>No.</th>
                    <th className="px-4 py-3 text-left font-semibold" style={{ color: theme.colors.textMuted }}>Ancho</th>
                    <th className="px-4 py-3 text-left font-semibold" style={{ color: theme.colors.textMuted }}>Alto</th>
                    <th className="px-4 py-3 text-left font-semibold w-24" style={{ color: theme.colors.textMuted }}>Cant.</th>
                    <th className="px-4 py-3 w-12"></th>
                  </tr>
                </thead>
                <tbody>
                  {cuts.map((c, i) => (
                    <tr key={i} style={{ borderTop: `1px solid ${theme.colors.border}` }}>
                      <td className="px-4 py-3 font-semibold" style={{ color: theme.colors.primary }}>{i + 1}</td>
                      <td className="px-4 py-3"><BentoInput value={c.w} onChange={e => updateCut(i, 'w', e.target.value)} placeholder="24 1/2" className="!py-2" /></td>
                      <td className="px-4 py-3"><BentoInput value={c.h} onChange={e => updateCut(i, 'h', e.target.value)} placeholder="18 3/4" className="!py-2" /></td>
                      <td className="px-4 py-3"><BentoInput type="number" min="1" value={c.qty} onChange={e => updateCut(i, 'qty', e.target.value)} className="!py-2" /></td>
                      <td className="px-4 py-3"><BentoButton variant="ghost" size="icon" onClick={() => removeCut(i)}><X className="w-4 h-4" style={{ color: theme.colors.textMuted }} /></BentoButton></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12" style={{ color: theme.colors.textMuted }}>
              <Scissors className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="text-sm">Agrega piezas para comenzar</p>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <BentoButton onClick={calculate} size="lg" className="w-full md:w-auto">Calcular Diseño Óptimo</BentoButton>
          </div>
        </BentoCard>

        {sheets.length > 0 && (
          <BentoCard>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <BentoBadge variant="success">✓</BentoBadge>
                <h2 className="font-semibold text-base" style={{ color: theme.colors.text }}>Diseño de Corte</h2>
              </div>
              <div className="flex items-center gap-2">
                <BentoButton variant="secondary" size="sm" icon={<Printer className="w-4 h-4" />} onClick={handlePrint}>Imprimir</BentoButton>
                <BentoButton variant="primary" size="sm" icon={<Download className="w-4 h-4" />} onClick={handleDownloadPDF} disabled={generating}>{generating ? 'Generando...' : 'PDF'}</BentoButton>
              </div>
            </div>

            {sheets.length > 1 && (
              <div className="flex gap-2 mb-5 p-1.5" style={{ backgroundColor: theme.colors.secondary, borderRadius: theme.radius.lg }}>
                {sheets.map((_, i) => (
                  <button key={i} onClick={() => setActiveSheet(i)} className="px-5 py-2 text-sm font-medium transition-all" style={{ borderRadius: theme.radius.md, backgroundColor: activeSheet === i ? 'white' : 'transparent', color: activeSheet === i ? theme.colors.text : theme.colors.textMuted, boxShadow: activeSheet === i ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>
                    Lámina {i + 1}
                  </button>
                ))}
              </div>
            )}

            <div className="flex items-center gap-5 p-4 mb-4" style={{ backgroundColor: theme.colors.secondary, borderRadius: theme.radius.lg }}>
              <div className="flex-1">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span style={{ color: theme.colors.textMuted }}>Uso del Material</span>
                  <span className="font-bold" style={{ color: theme.colors.text }}>{sheets[activeSheet]?.usage}%</span>
                </div>
                <div className="h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: theme.colors.border }}>
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${sheets[activeSheet]?.usage}%`, backgroundColor: theme.colors.success }} />
                </div>
              </div>
              <div className="text-right pl-5" style={{ borderLeft: `1px solid ${theme.colors.border}` }}>
                <div className="text-xs" style={{ color: theme.colors.textMuted }}>Desperdicio</div>
                <div className="text-2xl font-bold" style={{ color: theme.colors.text }}>{sheets[activeSheet]?.waste}%</div>
              </div>
            </div>

            <div className="text-sm mb-3" style={{ color: theme.colors.textMuted }}>
              Lámina {activeSheet + 1} de {sheets.length} — <span className="font-semibold" style={{ color: theme.colors.text }}>{toFraction(sw)}" × {toFraction(sh)}"</span>
            </div>

            <div className="flex justify-center p-5 mb-4" style={{ backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg, border: `1px solid ${theme.colors.border}` }}>
              <svg id="cutting-diagram" width={sw * scale + 80} height={sh * scale + 80} className="font-mono">
                <defs>
                  <marker id="arrowStart" markerWidth="6" markerHeight="6" refX="0" refY="3" orient="auto"><path d="M6,0 L6,6 L0,3 Z" fill="#000" /></marker>
                  <marker id="arrowEnd" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 Z" fill="#000" /></marker>
                </defs>
                <rect x="40" y="40" width={sw * scale} height={sh * scale} fill="#f5f5f5" stroke="#000" strokeWidth="1.5" />
                <line x1="40" y1="25" x2="40" y2="35" stroke="#000" strokeWidth="0.5" />
                <line x1={40 + sw * scale} y1="25" x2={40 + sw * scale} y2="35" stroke="#000" strokeWidth="0.5" />
                <line x1="40" y1="30" x2={40 + sw * scale} y2="30" stroke="#000" strokeWidth="0.5" markerStart="url(#arrowStart)" markerEnd="url(#arrowEnd)" />
                <text x={40 + sw * scale / 2} y="18" textAnchor="middle" fontSize="11" fontWeight="600">{toFraction(sw)}"</text>
                <line x1="25" y1="40" x2="35" y2="40" stroke="#000" strokeWidth="0.5" />
                <line x1="25" y1={40 + sh * scale} x2="35" y2={40 + sh * scale} stroke="#000" strokeWidth="0.5" />
                <line x1="30" y1="40" x2="30" y2={40 + sh * scale} stroke="#000" strokeWidth="0.5" markerStart="url(#arrowStart)" markerEnd="url(#arrowEnd)" />
                <text x="15" y={40 + sh * scale / 2} textAnchor="middle" fontSize="11" fontWeight="600" transform={`rotate(-90, 15, ${40 + sh * scale / 2})`}>{toFraction(sh)}"</text>
                {sheets[activeSheet]?.placed?.map((p, i) => {
                  const x = 40 + p.x * scale, y = 40 + p.y * scale, w = p.pw * scale, h = p.ph * scale;
                  const pieceW = toFraction(p.rotated ? p.ph : p.pw), pieceH = toFraction(p.rotated ? p.pw : p.ph);
                  const circleR = w > 70 && h > 70 ? 12 : w > 45 && h > 45 ? 10 : Math.min(w, h) / 3;
                  const numFont = w > 70 && h > 70 ? 11 : w > 45 && h > 45 ? 9 : 7;
                  return (
                    <g key={i}>
                      <rect x={x} y={y} width={w} height={h} fill="#fff" stroke="#000" strokeWidth="1" />
                      <circle cx={x + w / 2} cy={y + h / 2} r={circleR} fill={theme.colors.primary} />
                      <text x={x + w / 2} y={y + h / 2 + numFont / 3} textAnchor="middle" fontSize={numFont} fontWeight="700" fill="#fff">{i + 1}</text>
                      {w > 55 && <><line x1={x + 5} y1={y + 12} x2={x + w - 5} y2={y + 12} stroke="#000" strokeWidth="0.4" markerStart="url(#arrowStart)" markerEnd="url(#arrowEnd)" /><rect x={x + w/2 - 18} y={y + 6} width="36" height="11" fill="#fff" /><text x={x + w / 2} y={y + 14} textAnchor="middle" fontSize="8" fontWeight="500">{pieceW}"</text></>}
                      {h > 55 && <><line x1={x + 12} y1={y + 5} x2={x + 12} y2={y + h - 5} stroke="#000" strokeWidth="0.4" markerStart="url(#arrowStart)" markerEnd="url(#arrowEnd)" /><rect x={x + 6} y={y + h/2 - 13} width="11" height="26" fill="#fff" /><text x={x + 12} y={y + h / 2} textAnchor="middle" fontSize="8" fontWeight="500" transform={`rotate(-90, ${x + 12}, ${y + h / 2})`}>{pieceH}"</text></>}
                    </g>
                  );
                })}
                <text x={40 + sw * scale - 5} y={40 + sh * scale - 8} textAnchor="end" fontSize="9" fill="#666">DESPERDICIO: {sheets[activeSheet]?.waste}%</text>
              </svg>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-3" style={{ color: theme.colors.text }}>Lista de Cortes</h3>
              <div style={{ borderRadius: theme.radius.lg, border: `1px solid ${theme.colors.border}`, overflow: 'hidden' }}>
                <table className="w-full text-sm">
                  <thead style={{ backgroundColor: theme.colors.secondary }}>
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold w-16" style={{ color: theme.colors.textMuted }}>No.</th>
                      <th className="px-4 py-3 text-left font-semibold" style={{ color: theme.colors.textMuted }}>Ancho</th>
                      <th className="px-4 py-3 text-left font-semibold" style={{ color: theme.colors.textMuted }}>Alto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sheets[activeSheet]?.placed?.map((p, i) => (
                      <tr key={i} style={{ borderTop: `1px solid ${theme.colors.border}` }}>
                        <td className="px-4 py-3 font-bold" style={{ color: theme.colors.primary }}>{i + 1}</td>
                        <td className="px-4 py-3 font-mono">{toFraction(p.rotated ? p.ph : p.pw)}"</td>
                        <td className="px-4 py-3 font-mono">{toFraction(p.rotated ? p.pw : p.ph)}"</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {sheets[activeSheet]?.unplaced?.length > 0 && (
              <div className="flex items-start gap-3 p-4 mt-5" style={{ backgroundColor: '#fef3c7', borderRadius: theme.radius.lg, border: '1px solid #fcd34d' }}>
                <span className="text-xl">⚠️</span>
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#92400e' }}>Algunas piezas no caben</p>
                  <p className="text-sm" style={{ color: '#a16207' }}>{sheets[activeSheet].unplaced.length} pieza(s) no caben.</p>
                </div>
              </div>
            )}
          </BentoCard>
        )}

        {sheets.length === 0 && (
          <BentoCard className="border-dashed !border-2">
            <div className="py-10 text-center">
              <LayoutGrid className="w-14 h-14 mx-auto mb-4 opacity-30" style={{ color: theme.colors.textMuted }} />
              <p style={{ color: theme.colors.textMuted }}>Ingresa el tamaño de la lámina y las piezas, luego haz clic en Calcular</p>
            </div>
          </BentoCard>
        )}
      </div>
    </div>
  );
}
