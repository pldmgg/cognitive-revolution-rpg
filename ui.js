/* ui.js — UI drawing utilities: panels, text, bars, buttons, particles, enemy drawing */
/* eslint-disable no-unused-vars */

const UI = (() => {
  const FONT_DISPLAY = "'Cormorant Garamond', serif";
  const FONT_BODY = "'Inter', sans-serif";
  const COLOR_BG = '#0a0e1a';
  const COLOR_SURFACE = 'rgba(10,14,26,0.85)';
  const COLOR_BORDER = 'rgba(255,255,255,0.12)';
  const COLOR_TEXT = '#e8e8ec';
  const COLOR_MUTED = '#8888a0';
  const COLOR_PRIMARY = '#4af0c0';
  const COLOR_DANGER = '#ff4466';
  const COLOR_WARNING = '#ffaa22';

  // ── Text Drawing ────────────────────────────────────────────────────────
  function drawText(ctx, text, x, y, opts) {
    const o = opts || {};
    const size = o.size || 16;
    const weight = o.weight || '400';
    const family = o.font === 'display' ? FONT_DISPLAY : FONT_BODY;
    const color = o.color || COLOR_TEXT;
    const align = o.align || 'left';
    const baseline = o.baseline || 'top';
    const maxWidth = o.maxWidth || undefined;
    const shadow = o.shadow !== false;

    ctx.save();
    ctx.font = `${weight} ${size}px ${family}`;
    ctx.textAlign = align;
    ctx.textBaseline = baseline;

    if (shadow) {
      ctx.shadowColor = 'rgba(0,0,0,0.7)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetY = 1;
    }

    ctx.fillStyle = color;
    if (maxWidth) {
      ctx.fillText(text, x, y, maxWidth);
    } else {
      ctx.fillText(text, x, y);
    }
    ctx.restore();
  }

  function measureText(ctx, text, size, weight, font) {
    ctx.save();
    const family = font === 'display' ? FONT_DISPLAY : FONT_BODY;
    ctx.font = `${weight || '400'} ${size || 16}px ${family}`;
    const m = ctx.measureText(text);
    ctx.restore();
    return m.width;
  }

  function wrapText(ctx, text, x, y, maxWidth, lineHeight, opts) {
    const words = text.split(' ');
    let line = '';
    let ty = y;
    const o = opts || {};
    const size = o.size || 16;
    const weight = o.weight || '400';
    const family = o.font === 'display' ? FONT_DISPLAY : FONT_BODY;

    ctx.save();
    ctx.font = `${weight} ${size}px ${family}`;

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && i > 0) {
        drawText(ctx, line.trim(), x, ty, opts);
        line = words[i] + ' ';
        ty += lineHeight;
      } else {
        line = testLine;
      }
    }
    drawText(ctx, line.trim(), x, ty, opts);
    ctx.restore();
    return ty + lineHeight;
  }

  // ── Panel Drawing ───────────────────────────────────────────────────────
  function drawPanel(ctx, x, y, w, h, opts) {
    const o = opts || {};
    const radius = o.radius || 8;
    const bg = o.bg || COLOR_SURFACE;
    const border = o.border || COLOR_BORDER;
    const borderWidth = o.borderWidth || 1;
    const glow = o.glow || null;

    ctx.save();

    if (glow) {
      ctx.shadowColor = glow;
      ctx.shadowBlur = 15;
    }

    ctx.beginPath();
    roundRect(ctx, x, y, w, h, radius);
    ctx.fillStyle = bg;
    ctx.fill();

    if (border) {
      ctx.strokeStyle = border;
      ctx.lineWidth = borderWidth;
      ctx.stroke();
    }

    ctx.restore();
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
  }

  // ── Bar Drawing (HP/MP/XP) ──────────────────────────────────────────────
  function drawBar(ctx, x, y, w, h, current, max, color, bgColor, label) {
    const pct = Math.max(0, Math.min(1, current / max));

    // Background
    ctx.save();
    ctx.beginPath();
    roundRect(ctx, x, y, w, h, h / 2);
    ctx.fillStyle = bgColor || 'rgba(0,0,0,0.5)';
    ctx.fill();

    // Fill
    if (pct > 0) {
      ctx.beginPath();
      roundRect(ctx, x, y, w * pct, h, h / 2);
      ctx.fillStyle = color;
      ctx.fill();

      // Shine
      const grad = ctx.createLinearGradient(x, y, x, y + h);
      grad.addColorStop(0, 'rgba(255,255,255,0.2)');
      grad.addColorStop(0.5, 'rgba(255,255,255,0)');
      ctx.beginPath();
      roundRect(ctx, x, y, w * pct, h / 2, h / 2);
      ctx.fillStyle = grad;
      ctx.fill();
    }

    // Border
    ctx.beginPath();
    roundRect(ctx, x, y, w, h, h / 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.restore();

    // Label
    if (label) {
      drawText(ctx, label, x + 6, y + h / 2 - 1, {
        size: 11, weight: '600', color: '#fff', baseline: 'middle', shadow: true
      });
    }

    // Value
    drawText(ctx, `${Math.floor(current)}/${Math.floor(max)}`, x + w - 6, y + h / 2 - 1, {
      size: 11, weight: '600', color: '#fff', align: 'right', baseline: 'middle', shadow: true
    });
  }

  // ── Button Drawing ──────────────────────────────────────────────────────
  function drawButton(ctx, x, y, w, h, text, opts) {
    const o = opts || {};
    const hover = o.hover || false;
    const disabled = o.disabled || false;
    const color = o.color || COLOR_PRIMARY;

    ctx.save();

    if (hover && !disabled) {
      ctx.shadowColor = color;
      ctx.shadowBlur = 12;
    }

    const bg = disabled ? 'rgba(50,50,60,0.6)' : hover ? color : 'rgba(255,255,255,0.08)';
    const textColor = disabled ? COLOR_MUTED : hover ? '#000' : color;
    const borderColor = disabled ? 'rgba(255,255,255,0.05)' : color;

    ctx.beginPath();
    roundRect(ctx, x, y, w, h, 6);
    ctx.fillStyle = bg;
    ctx.fill();
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = hover ? 2 : 1;
    ctx.stroke();

    ctx.restore();

    drawText(ctx, text, x + w / 2, y + h / 2, {
      size: o.fontSize || 14, weight: '600', color: textColor,
      align: 'center', baseline: 'middle', shadow: !hover
    });

    return { x, y, w, h };
  }

  // ── Point in rect test ─────────────────────────────────────────────────
  function pointInRect(px, py, rx, ry, rw, rh) {
    return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh;
  }

  // ── Particle System ────────────────────────────────────────────────────
  class ParticleSystem {
    constructor() {
      this.particles = [];
    }

    emit(x, y, count, opts) {
      const o = opts || {};
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x, y,
          vx: (Math.random() - 0.5) * (o.spread || 3),
          vy: (Math.random() - 0.5) * (o.spread || 3) - (o.upward || 0),
          life: 1,
          decay: 0.01 + Math.random() * (o.decay || 0.02),
          size: (o.size || 3) + Math.random() * 3,
          color: o.color || COLOR_PRIMARY,
          alpha: 1
        });
      }
    }

    update() {
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;
        p.alpha = Math.max(0, p.life);
        p.size *= 0.98;
        if (p.life <= 0) {
          this.particles.splice(i, 1);
        }
      }
    }

    draw(ctx) {
      ctx.save();
      this.particles.forEach(p => {
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
    }
  }

  // ── Floating Text (damage numbers, etc.) ──────────────────────────────
  class FloatingTextManager {
    constructor() {
      this.texts = [];
    }

    add(text, x, y, color, size) {
      this.texts.push({
        text, x, y, color: color || '#fff',
        size: size || 24,
        life: 1, vy: -1.5, alpha: 1
      });
    }

    update() {
      for (let i = this.texts.length - 1; i >= 0; i--) {
        const t = this.texts[i];
        t.y += t.vy;
        t.life -= 0.02;
        t.alpha = Math.max(0, t.life);
        if (t.life <= 0) this.texts.splice(i, 1);
      }
    }

    draw(ctx) {
      this.texts.forEach(t => {
        ctx.save();
        ctx.globalAlpha = t.alpha;
        drawText(ctx, t.text, t.x, t.y, {
          size: t.size, weight: '700', color: t.color,
          align: 'center', baseline: 'middle', font: 'display'
        });
        ctx.restore();
      });
    }
  }

  // ── Enemy Drawing (procedural) ────────────────────────────────────────
  function drawEnemy(ctx, x, y, size, enemy, time) {
    const t = time || 0;
    const pulse = 1 + Math.sin(t * 3) * 0.05;
    const s = size * pulse;
    const c = enemy.color;
    const c2 = enemy.secondaryColor;

    ctx.save();
    ctx.translate(x, y);

    // Glow
    ctx.shadowColor = c;
    ctx.shadowBlur = 15;

    switch (enemy.drawType) {
      case 'triangles': drawTriangles(ctx, s, c, c2, t); break;
      case 'jagged': drawJagged(ctx, s, c, c2, t); break;
      case 'ghost': drawGhost(ctx, s, c, c2, t); break;
      case 'blocks': drawBlocks(ctx, s, c, c2, t); break;
      case 'drone': drawDrone(ctx, s, c, c2, t); break;
      case 'wave': drawWave(ctx, s, c, c2, t); break;
      case 'sprite': drawSprite(ctx, s, c, c2, t); break;
      case 'troll': drawTroll(ctx, s, c, c2, t); break;
      case 'cross': drawCross(ctx, s, c, c2, t); break;
      case 'boss-clone': drawBossClone(ctx, s, c, c2, t); break;
      case 'boss-machine': drawBossMachine(ctx, s, c, c2, t); break;
      case 'boss-robot': drawBossRobot(ctx, s, c, c2, t); break;
      case 'boss-singularity': drawBossSingularity(ctx, s, c, c2, t); break;
      default: drawTriangles(ctx, s, c, c2, t);
    }

    ctx.restore();
  }

  function drawTriangles(ctx, s, c, c2, t) {
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2 + t * 2;
      const dist = s * 0.3;
      const tx = Math.cos(angle) * dist;
      const ty = Math.sin(angle) * dist;
      ctx.fillStyle = i % 2 === 0 ? c : c2;
      ctx.beginPath();
      ctx.moveTo(tx, ty - s * 0.12);
      ctx.lineTo(tx - s * 0.1, ty + s * 0.08);
      ctx.lineTo(tx + s * 0.1, ty + s * 0.08);
      ctx.closePath();
      ctx.fill();
    }
  }

  function drawJagged(ctx, s, c, c2, t) {
    ctx.strokeStyle = c;
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const px = -s * 0.4 + (i / 7) * s * 0.8;
      const py = Math.sin(i * 1.5 + t * 4) * s * 0.25;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Code-like symbols
    ctx.fillStyle = c2;
    ctx.font = `bold ${s * 0.15}px monospace`;
    ctx.textAlign = 'center';
    const symbols = ['{ }', '< >', '0x', '//'];
    symbols.forEach((sym, i) => {
      const angle = (i / 4) * Math.PI * 2 + t;
      ctx.fillText(sym, Math.cos(angle) * s * 0.2, Math.sin(angle) * s * 0.2);
    });
  }

  function drawGhost(ctx, s, c, c2, t) {
    const wobble = Math.sin(t * 2) * s * 0.05;
    ctx.fillStyle = c;
    ctx.globalAlpha = 0.7 + Math.sin(t * 3) * 0.2;
    ctx.beginPath();
    ctx.arc(wobble, -s * 0.1, s * 0.25, Math.PI, 0);
    ctx.lineTo(s * 0.25 + wobble, s * 0.2);
    for (let i = 0; i < 5; i++) {
      const px = s * 0.25 - (i / 4) * s * 0.5 + wobble;
      const py = s * 0.2 + (i % 2 === 0 ? s * 0.08 : 0);
      ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();

    // Eyes
    ctx.globalAlpha = 1;
    ctx.fillStyle = c2;
    ctx.beginPath();
    ctx.arc(-s * 0.08 + wobble, -s * 0.12, s * 0.05, 0, Math.PI * 2);
    ctx.arc(s * 0.08 + wobble, -s * 0.12, s * 0.05, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawBlocks(ctx, s, c, c2, t) {
    const blockSize = s * 0.15;
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 3; col++) {
        const bx = (col - 1) * blockSize * 1.2;
        const by = (row - 1.5) * blockSize * 1.2 + Math.sin(t * 2 + col) * 3;
        ctx.fillStyle = (row + col) % 2 === 0 ? c : c2;
        ctx.fillRect(bx - blockSize / 2, by - blockSize / 2, blockSize, blockSize);
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.lineWidth = 1;
        ctx.strokeRect(bx - blockSize / 2, by - blockSize / 2, blockSize, blockSize);
      }
    }
  }

  function drawDrone(ctx, s, c, c2, t) {
    const hover = Math.sin(t * 3) * 5;
    ctx.fillStyle = c;
    // Body
    ctx.beginPath();
    ctx.ellipse(0, hover, s * 0.2, s * 0.1, 0, 0, Math.PI * 2);
    ctx.fill();
    // Propellers
    ctx.strokeStyle = c2;
    ctx.lineWidth = 2;
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2 + t * 10;
      const px = Math.cos((i / 4) * Math.PI * 2) * s * 0.25;
      const py = Math.sin((i / 4) * Math.PI * 2) * s * 0.12 + hover;
      ctx.beginPath();
      ctx.arc(px, py, s * 0.08, angle, angle + Math.PI);
      ctx.stroke();
    }
    // Eye
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.arc(0, hover, s * 0.04, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawWave(ctx, s, c, c2, t) {
    ctx.strokeStyle = c;
    ctx.lineWidth = 3;
    for (let wave = 0; wave < 3; wave++) {
      ctx.beginPath();
      ctx.globalAlpha = 1 - wave * 0.25;
      for (let i = 0; i < 30; i++) {
        const px = -s * 0.4 + (i / 29) * s * 0.8;
        const py = Math.sin(i * 0.5 + t * 4 + wave) * s * 0.15 + wave * s * 0.1 - s * 0.1;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Arrows
    ctx.fillStyle = c2;
    const arrows = ['▲', '▼', '▲', '▼'];
    ctx.font = `${s * 0.12}px ${FONT_BODY}`;
    ctx.textAlign = 'center';
    arrows.forEach((a, i) => {
      ctx.fillText(a, (i - 1.5) * s * 0.15, Math.sin(t * 3 + i) * s * 0.1);
    });
  }

  function drawSprite(ctx, s, c, c2, t) {
    // Sparkling sprite
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 + t * 2;
      const dist = s * 0.2 + Math.sin(t * 4 + i) * s * 0.08;
      const px = Math.cos(angle) * dist;
      const py = Math.sin(angle) * dist;
      ctx.fillStyle = i % 2 === 0 ? c : c2;
      ctx.globalAlpha = 0.5 + Math.sin(t * 5 + i) * 0.5;
      ctx.beginPath();
      ctx.arc(px, py, s * 0.04, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Core
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(0, 0, s * 0.1, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawTroll(ctx, s, c, c2, t) {
    // Bulky body
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.ellipse(0, s * 0.05, s * 0.22, s * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Shield patterns
    ctx.strokeStyle = c2;
    ctx.lineWidth = 2;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(0, s * 0.05, s * (0.12 + i * 0.05), 0, Math.PI * 2);
      ctx.stroke();
    }

    // Eyes
    ctx.fillStyle = '#ff4444';
    ctx.beginPath();
    ctx.arc(-s * 0.06, -s * 0.1, s * 0.03, 0, Math.PI * 2);
    ctx.arc(s * 0.06, -s * 0.1, s * 0.03, 0, Math.PI * 2);
    ctx.fill();

    // © symbol
    ctx.fillStyle = c2;
    ctx.font = `bold ${s * 0.15}px ${FONT_BODY}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('©', 0, s * 0.08);
  }

  function drawCross(ctx, s, c, c2, t) {
    const pulse = Math.sin(t * 2) * 0.1;
    ctx.fillStyle = c;
    ctx.globalAlpha = 0.8 + pulse;

    // Cross shape
    const arm = s * 0.08;
    const len = s * 0.3;
    ctx.fillRect(-arm, -len, arm * 2, len * 2);
    ctx.fillRect(-len, -arm, len * 2, arm * 2);

    // Rotating ring
    ctx.strokeStyle = c2;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, s * 0.25, t * 2, t * 2 + Math.PI * 1.5);
    ctx.stroke();

    ctx.globalAlpha = 1;
  }

  // Boss drawings
  function drawBossClone(ctx, s, c, c2, t) {
    for (let i = 0; i < 3; i++) {
      ctx.globalAlpha = 0.4 + (i === 1 ? 0.4 : 0);
      const ox = Math.sin(t * 2 + i * 2.1) * s * 0.15;
      const oy = Math.cos(t * 2 + i * 2.1) * s * 0.1;
      ctx.fillStyle = i === 1 ? c : c2;
      ctx.beginPath();
      ctx.arc(ox, oy - s * 0.08, s * 0.15, Math.PI, 0);
      ctx.lineTo(s * 0.15 + ox, s * 0.15 + oy);
      ctx.lineTo(-s * 0.15 + ox, s * 0.15 + oy);
      ctx.closePath();
      ctx.fill();

      // Eyes
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(-s * 0.05 + ox, -s * 0.05 + oy, s * 0.025, 0, Math.PI * 2);
      ctx.arc(s * 0.05 + ox, -s * 0.05 + oy, s * 0.025, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function drawBossMachine(ctx, s, c, c2, t) {
    // Geometric machine
    ctx.fillStyle = c;
    const rot = t * 0.5;
    ctx.save();
    ctx.rotate(rot);

    // Outer hexagon
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const px = Math.cos(angle) * s * 0.35;
      const py = Math.sin(angle) * s * 0.35;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.strokeStyle = c;
    ctx.lineWidth = 3;
    ctx.stroke();

    // Inner gears
    ctx.rotate(-rot * 2);
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const r = s * (0.15 + (i % 2) * 0.05);
      const px = Math.cos(angle) * r;
      const py = Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = c2;
    ctx.fill();

    // Center eye
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(0, 0, s * 0.06, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(0, 0, s * 0.03, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  function drawBossRobot(ctx, s, c, c2, t) {
    // Robot body
    ctx.fillStyle = c2;
    ctx.fillRect(-s * 0.2, -s * 0.25, s * 0.4, s * 0.5);

    // Head
    ctx.fillStyle = c;
    ctx.fillRect(-s * 0.15, -s * 0.38, s * 0.3, s * 0.15);

    // Eyes — random glitch
    const eyeX = Math.sin(t * 8) > 0.8 ? Math.random() * s * 0.05 : 0;
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(-s * 0.08 + eyeX, -s * 0.34, s * 0.06, s * 0.04);
    ctx.fillRect(s * 0.02 + eyeX, -s * 0.34, s * 0.06, s * 0.04);

    // Arms
    ctx.fillStyle = c;
    const armSwing = Math.sin(t * 3) * s * 0.05;
    ctx.fillRect(-s * 0.32, -s * 0.15 + armSwing, s * 0.1, s * 0.3);
    ctx.fillRect(s * 0.22, -s * 0.15 - armSwing, s * 0.1, s * 0.3);

    // Legs
    ctx.fillRect(-s * 0.15, s * 0.25, s * 0.1, s * 0.15);
    ctx.fillRect(s * 0.05, s * 0.25, s * 0.1, s * 0.15);
  }

  function drawBossSingularity(ctx, s, c, c2, t) {
    // Swirling vortex
    for (let ring = 0; ring < 5; ring++) {
      const ringSize = s * (0.1 + ring * 0.07);
      ctx.strokeStyle = ring % 2 === 0 ? c : c2;
      ctx.lineWidth = 3 - ring * 0.3;
      ctx.globalAlpha = 1 - ring * 0.15;
      ctx.beginPath();
      ctx.arc(0, 0, ringSize, t * (3 - ring * 0.5), t * (3 - ring * 0.5) + Math.PI * 1.5);
      ctx.stroke();
    }

    // Core
    ctx.globalAlpha = 1;
    const coreSize = s * 0.08 + Math.sin(t * 5) * s * 0.02;
    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, coreSize);
    grad.addColorStop(0, '#fff');
    grad.addColorStop(0.5, c);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, coreSize, 0, Math.PI * 2);
    ctx.fill();

    // Lightning bolts
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2 + t * 2;
      ctx.strokeStyle = c;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.5 + Math.sin(t * 8 + i) * 0.5;
      ctx.beginPath();
      let px = 0, py = 0;
      ctx.moveTo(0, 0);
      for (let j = 0; j < 4; j++) {
        px += Math.cos(angle) * s * 0.08 + (Math.random() - 0.5) * s * 0.05;
        py += Math.sin(angle) * s * 0.08 + (Math.random() - 0.5) * s * 0.05;
        ctx.lineTo(px, py);
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  // ── Draw background image scaled to cover canvas ──────────────────────
  function drawImageCover(ctx, img, cw, ch) {
    if (!img || !img.complete || !img.naturalWidth) return;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    const scale = Math.max(cw / iw, ch / ih);
    const w = iw * scale;
    const h = ih * scale;
    ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
  }

  // ── Screen transition overlay ─────────────────────────────────────────
  let fadeAlpha = 0;
  let fadeTarget = 0;
  let fadeSpeed = 0.03;
  let fadeCallback = null;

  function startFade(targetAlpha, speed, callback) {
    fadeTarget = targetAlpha;
    fadeSpeed = speed || 0.03;
    fadeCallback = callback || null;
  }

  function updateFade() {
    if (fadeAlpha < fadeTarget) {
      fadeAlpha = Math.min(fadeAlpha + fadeSpeed, fadeTarget);
    } else if (fadeAlpha > fadeTarget) {
      fadeAlpha = Math.max(fadeAlpha - fadeSpeed, fadeTarget);
    }

    if (Math.abs(fadeAlpha - fadeTarget) < 0.01) {
      fadeAlpha = fadeTarget;
      if (fadeCallback) {
        const cb = fadeCallback;
        fadeCallback = null;
        cb();
      }
    }
  }

  function drawFade(ctx, cw, ch) {
    if (fadeAlpha > 0) {
      ctx.fillStyle = `rgba(10,14,26,${fadeAlpha})`;
      ctx.fillRect(0, 0, cw, ch);
    }
  }

  function isFading() {
    return fadeAlpha !== fadeTarget;
  }

  return {
    FONT_DISPLAY, FONT_BODY,
    COLOR_BG, COLOR_SURFACE, COLOR_BORDER, COLOR_TEXT, COLOR_MUTED,
    COLOR_PRIMARY, COLOR_DANGER, COLOR_WARNING,
    drawText, measureText, wrapText,
    drawPanel, roundRect,
    drawBar,
    drawButton, pointInRect,
    ParticleSystem, FloatingTextManager,
    drawEnemy, drawImageCover,
    startFade, updateFade, drawFade, isFading
  };
})();
