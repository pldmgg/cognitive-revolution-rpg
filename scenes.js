/* scenes.js — All scene classes */
/* eslint-disable no-unused-vars */

// ═══════════════════════════════════════════════════════════════════════════
// TITLE SCENE
// ═══════════════════════════════════════════════════════════════════════════
class TitleScene {
  constructor(game) {
    this.game = game;
    this.time = 0;
    this.bgImg = document.getElementById('img-title');
    this.particles = new UI.ParticleSystem();
    this.buttons = [];
    this.hoverIdx = -1;
  }

  enter() {
    this.time = 0;
  }

  update(dt) {
    this.time += dt;
    this.particles.update();
    if (Math.random() < 0.1) {
      const cw = this.game.canvas.width;
      const ch = this.game.canvas.height;
      this.particles.emit(
        Math.random() * cw, Math.random() * ch, 1,
        { color: UI.COLOR_PRIMARY, spread: 1, decay: 0.005, size: 2, upward: 0.5 }
      );
    }
  }

  draw(ctx, cw, ch) {
    // Background
    UI.drawImageCover(ctx, this.bgImg, cw, ch);

    // Dark overlay — strong enough to hide background image text
    ctx.fillStyle = 'rgba(10,14,26,0.78)';
    ctx.fillRect(0, 0, cw, ch);

    // Extra dark band behind title text area
    const grad = ctx.createLinearGradient(0, ch * 0.1, 0, ch * 0.55);
    grad.addColorStop(0, 'rgba(10,14,26,0.4)');
    grad.addColorStop(0.3, 'rgba(10,14,26,0.7)');
    grad.addColorStop(0.7, 'rgba(10,14,26,0.7)');
    grad.addColorStop(1, 'rgba(10,14,26,0.3)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, ch * 0.1, cw, ch * 0.45);

    // Particles behind text
    this.particles.draw(ctx);

    // Title
    const titleY = ch * 0.25;
    const glow = 0.5 + Math.sin(this.time * 2) * 0.3;

    ctx.save();
    ctx.shadowColor = UI.COLOR_PRIMARY;
    ctx.shadowBlur = 20 * glow;
    UI.drawText(ctx, 'COGNITIVE', cw / 2, titleY, {
      size: Math.min(72, cw * 0.08), weight: '700', font: 'display',
      color: '#fff', align: 'center', baseline: 'middle'
    });
    UI.drawText(ctx, 'REVOLUTION', cw / 2, titleY + Math.min(60, cw * 0.06), {
      size: Math.min(56, cw * 0.06), weight: '700', font: 'display',
      color: UI.COLOR_PRIMARY, align: 'center', baseline: 'middle'
    });
    ctx.restore();

    // Subtitle
    UI.drawText(ctx, 'An AI Industry RPG', cw / 2, titleY + Math.min(110, cw * 0.11), {
      size: 16, weight: '400', color: UI.COLOR_MUTED, align: 'center', baseline: 'middle'
    });

    // Tagline
    UI.drawText(ctx, 'Knowledge is your greatest weapon', cw / 2, titleY + Math.min(140, cw * 0.14), {
      size: 14, weight: '400', color: 'rgba(255,255,255,0.5)', align: 'center', baseline: 'middle', font: 'display'
    });

    // New Game button
    const btnW = 200;
    const btnH = 48;
    const btnX = cw / 2 - btnW / 2;
    const btnY = ch * 0.6;

    this.buttons = [];
    this.buttons.push(UI.drawButton(ctx, btnX, btnY, btnW, btnH, 'New Game', {
      hover: this.hoverIdx === 0, color: UI.COLOR_PRIMARY, fontSize: 18
    }));

    // Version / credit
    UI.drawText(ctx, 'v1.0 — 14 Industries · Turn-Based Combat · 44 AI Insights', cw / 2, ch * 0.85, {
      size: 11, weight: '400', color: 'rgba(255,255,255,0.4)', align: 'center'
    });
  }

  onMouseMove(x, y) {
    this.hoverIdx = -1;
    this.buttons.forEach((b, i) => {
      if (UI.pointInRect(x, y, b.x, b.y, b.w, b.h)) this.hoverIdx = i;
    });
  }

  onClick(x, y) {
    if (this.buttons[0] && UI.pointInRect(x, y, this.buttons[0].x, this.buttons[0].y, this.buttons[0].w, this.buttons[0].h)) {
      AudioManager.init();
      AudioManager.resume();
      AudioManager.uiClick();
      this.game.startNewGame();
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// WORLD MAP SCENE
// ═══════════════════════════════════════════════════════════════════════════
class WorldMapScene {
  constructor(game) {
    this.game = game;
    this.bgImg = document.getElementById('img-world');
    this.time = 0;
    this.hoverNode = null;
    this.particles = new UI.ParticleSystem();
    this.playerAnimX = 0;
    this.playerAnimY = 0;
    this.playerTargetX = 0;
    this.playerTargetY = 0;
    this.traveling = false;
    this.travelTarget = null;
  }

  enter() {
    this.time = 0;
    const p = this.game.player;
    const node = MAP_NODES[p.currentTown];
    const cw = this.game.canvas.width;
    const ch = this.game.canvas.height;
    this.playerAnimX = node.x * cw;
    this.playerAnimY = node.y * ch;
    this.playerTargetX = this.playerAnimX;
    this.playerTargetY = this.playerAnimY;
  }

  update(dt) {
    this.time += dt;
    this.particles.update();

    // Animate player movement
    if (this.traveling) {
      const speed = 3;
      const dx = this.playerTargetX - this.playerAnimX;
      const dy = this.playerTargetY - this.playerAnimY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < speed) {
        this.playerAnimX = this.playerTargetX;
        this.playerAnimY = this.playerTargetY;
        this.traveling = false;
        this.arriveAtTown();
      } else {
        this.playerAnimX += (dx / dist) * speed;
        this.playerAnimY += (dy / dist) * speed;
      }
    }

    // Ambient particles on unlocked nodes
    if (Math.random() < 0.05) {
      const p = this.game.player;
      const cw = this.game.canvas.width;
      const ch = this.game.canvas.height;
      const towns = p.unlockedTowns;
      if (towns.length > 0) {
        const t = towns[Math.floor(Math.random() * towns.length)];
        const node = MAP_NODES[t];
        const ind = INDUSTRIES[t];
        this.particles.emit(node.x * cw, node.y * ch, 1, {
          color: ind ? ind.color : UI.COLOR_PRIMARY,
          spread: 2, decay: 0.008, size: 2
        });
      }
    }
  }

  draw(ctx, cw, ch) {
    // Background
    UI.drawImageCover(ctx, this.bgImg, cw, ch);
    ctx.fillStyle = 'rgba(10,14,26,0.4)';
    ctx.fillRect(0, 0, cw, ch);

    const p = this.game.player;

    // Draw paths
    MAP_PATHS.forEach(([a, b]) => {
      const na = MAP_NODES[a];
      const nb = MAP_NODES[b];
      const ax = na.x * cw, ay = na.y * ch;
      const bx = nb.x * cw, by = nb.y * ch;

      const unlocked = p.unlockedTowns.includes(a) && p.unlockedTowns.includes(b);

      ctx.save();
      ctx.strokeStyle = unlocked ? 'rgba(74,240,192,0.3)' : 'rgba(255,255,255,0.08)';
      ctx.lineWidth = unlocked ? 2 : 1;
      if (unlocked) {
        ctx.shadowColor = UI.COLOR_PRIMARY;
        ctx.shadowBlur = 8;
      }
      ctx.setLineDash(unlocked ? [] : [4, 6]);
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx, by);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    });

    // Draw nodes
    for (const [townId, node] of Object.entries(MAP_NODES)) {
      const x = node.x * cw;
      const y = node.y * ch;
      const ind = INDUSTRIES[townId];
      const unlocked = p.unlockedTowns.includes(townId);
      const completed = p.completedTowns.includes(townId);
      const isHover = this.hoverNode === townId;
      const isCurrent = p.currentTown === townId;
      const radius = isHover ? 18 : (isCurrent ? 16 : 12);

      ctx.save();

      if (unlocked) {
        ctx.shadowColor = ind.color;
        ctx.shadowBlur = isHover ? 20 : 10;
      }

      // Node circle
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);

      if (!unlocked) {
        ctx.fillStyle = 'rgba(40,40,60,0.6)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.1)';
        ctx.lineWidth = 1;
        ctx.stroke();
      } else if (completed) {
        ctx.fillStyle = ind.color;
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
        // Checkmark
        UI.drawText(ctx, '✓', x, y, {
          size: 14, weight: '700', color: '#000', align: 'center', baseline: 'middle', shadow: false
        });
      } else {
        // Pulsing ring for unlocked
        const pulse = 1 + Math.sin(this.time * 3) * 0.15;
        ctx.fillStyle = isHover ? ind.color : 'rgba(10,14,26,0.8)';
        ctx.fill();
        ctx.strokeStyle = ind.color;
        ctx.lineWidth = isHover ? 3 : 2;
        ctx.stroke();

        // Pulsing outer ring
        ctx.beginPath();
        ctx.arc(x, y, radius * pulse + 4, 0, Math.PI * 2);
        ctx.strokeStyle = ind.color + '44';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      ctx.restore();

      // Town name label
      if (unlocked) {
        const labelY = y + radius + 12;
        // Background for readability
        const textW = UI.measureText(ctx, ind.name, 11, '600') + 12;
        UI.drawPanel(ctx, x - textW / 2, labelY - 4, textW, 18, {
          radius: 4, bg: 'rgba(10,14,26,0.8)', border: null
        });
        UI.drawText(ctx, ind.name, x, labelY + 4, {
          size: 11, weight: '600', color: isHover ? ind.color : '#ccc',
          align: 'center', baseline: 'middle'
        });
      }
    }

    // Draw player token (if not traveling, draw at node)
    const tokenX = this.playerAnimX;
    const tokenY = this.playerAnimY;
    const bob = Math.sin(this.time * 4) * 3;

    ctx.save();
    ctx.shadowColor = UI.COLOR_PRIMARY;
    ctx.shadowBlur = 15;
    ctx.fillStyle = UI.COLOR_PRIMARY;
    ctx.beginPath();
    // Diamond shape
    ctx.moveTo(tokenX, tokenY - 12 + bob);
    ctx.lineTo(tokenX + 8, tokenY + bob);
    ctx.lineTo(tokenX, tokenY + 12 + bob);
    ctx.lineTo(tokenX - 8, tokenY + bob);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();

    // Particles
    this.particles.draw(ctx);

    // HUD at top
    this.drawHUD(ctx, cw, ch);
  }

  drawHUD(ctx, cw) {
    const p = this.game.player;
    const hudW = Math.min(400, cw - 40);
    const hudX = 20;
    const hudY = 20;

    UI.drawPanel(ctx, hudX, hudY, hudW, 70, { bg: 'rgba(10,14,26,0.85)' });

    UI.drawText(ctx, `Lv.${p.level} ${p.name}`, hudX + 12, hudY + 10, {
      size: 14, weight: '600', color: UI.COLOR_PRIMARY
    });

    UI.drawBar(ctx, hudX + 12, hudY + 30, hudW / 2 - 20, 14, p.hp, p.maxHp, '#44cc66', null, 'HP');
    UI.drawBar(ctx, hudX + hudW / 2 + 8, hudY + 30, hudW / 2 - 20, 14, p.mp, p.maxMp, '#4488ff', null, 'MP');

    // Fragment count
    UI.drawText(ctx, `Fragments: ${p.cognitiveFragments.length}/14`, hudX + 12, hudY + 52, {
      size: 12, weight: '500', color: UI.COLOR_WARNING
    });

    // Insights count
    UI.drawText(ctx, `Insights: ${p.totalInsightsRead}/44`, hudX + 160, hudY + 52, {
      size: 12, weight: '500', color: UI.COLOR_MUTED
    });

    // Inventory button at top-right
    const invBtnW = 100;
    const invBtnH = 32;
    const invBtnX = cw - invBtnW - 20;
    const invBtnY = 25;
    this._invBtn = UI.drawButton(ctx, invBtnX, invBtnY, invBtnW, invBtnH, 'Inventory', {
      hover: this._invHover, fontSize: 12
    });
  }

  getNodeAt(x, y) {
    const cw = this.game.canvas.width;
    const ch = this.game.canvas.height;
    for (const [townId, node] of Object.entries(MAP_NODES)) {
      const nx = node.x * cw;
      const ny = node.y * ch;
      const dist = Math.sqrt((x - nx) ** 2 + (y - ny) ** 2);
      if (dist < 25) return townId;
    }
    return null;
  }

  onMouseMove(x, y) {
    this.hoverNode = this.getNodeAt(x, y);
    this._invHover = this._invBtn && UI.pointInRect(x, y, this._invBtn.x, this._invBtn.y, this._invBtn.w, this._invBtn.h);
  }

  onClick(x, y) {
    if (this.traveling) return;

    // Inventory button
    if (this._invBtn && UI.pointInRect(x, y, this._invBtn.x, this._invBtn.y, this._invBtn.w, this._invBtn.h)) {
      AudioManager.uiClick();
      this.game.pushScene(new InventoryScene(this.game));
      return;
    }

    const townId = this.getNodeAt(x, y);
    if (!townId) return;

    const p = this.game.player;
    if (!p.unlockedTowns.includes(townId)) return;

    AudioManager.uiClick();

    if (townId === p.currentTown) {
      // Enter town directly
      this.game.pushScene(new TownScene(this.game, townId));
    } else {
      // Check if adjacent
      const adj = getAdjacentTowns(p.currentTown);
      if (adj.includes(townId)) {
        this.travelTo(townId);
      } else {
        // Try to find a path through connected towns
        // For simplicity, only allow direct adjacent travel
        // Show notification
      }
    }
  }

  travelTo(townId) {
    const cw = this.game.canvas.width;
    const ch = this.game.canvas.height;
    const node = MAP_NODES[townId];
    this.playerTargetX = node.x * cw;
    this.playerTargetY = node.y * ch;
    this.traveling = true;
    this.travelTarget = townId;
    AudioManager.mapTravel();
  }

  arriveAtTown() {
    const p = this.game.player;
    const prev = p.currentTown;
    const dest = this.travelTarget;
    p.currentTown = dest;

    // Check for boss encounter
    const bossKey = prev + '|' + dest;
    if (BOSS_TRIGGERS[bossKey] && !p.bossesDefeated.includes(BOSS_TRIGGERS[bossKey])) {
      const bossId = BOSS_TRIGGERS[bossKey];
      const boss = BOSSES[bossId];
      // Show boss dialogue then combat
      this.game.pushScene(new DialogScene(this.game, boss.name, boss.preDialogue, boss.color || '#ff4444', () => {
        const bgId = getBattleBgForPath(prev, dest);
        this.game.pushScene(new CombatScene(this.game, boss, bgId, true, bossId));
      }));
      return;
    }

    // Random encounter (50% chance)
    if (Math.random() < 0.5) {
      const pathKey = prev + '|' + dest;
      const possibleEnemies = PATH_ENEMIES[pathKey] || ['bug-swarm'];
      const enemyId = possibleEnemies[Math.floor(Math.random() * possibleEnemies.length)];
      const enemy = Object.assign({}, ENEMIES[enemyId]);
      const bgId = getBattleBgForPath(prev, dest);
      this.game.pushScene(new CombatScene(this.game, enemy, bgId, false, null));
      return;
    }

    // Auto enter town
    this.game.pushScene(new TownScene(this.game, dest));
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// TOWN SCENE
// ═══════════════════════════════════════════════════════════════════════════
class TownScene {
  constructor(game, townId) {
    this.game = game;
    this.townId = townId;
    this.industry = INDUSTRIES[townId];
    this.time = 0;
    this.particles = new UI.ParticleSystem();
    this.hoverIdx = -1;
    this.scrollY = 0;
    this.showInsight = null; // currently displayed insight
    this.npcIdx = -1;
    this.npcDialogueIdx = 0;
    this.showingGuardian = false;
    this.guardianDialogueIdx = 0;
    this.buttons = [];
  }

  enter() {
    this.time = 0;
    // Check if we should auto-open prologue NPC in it-services (only once)
    const p = this.game.player;
    if (this.townId === 'it-services' && p.totalInsightsRead === 0 && p.cognitiveFragments.length === 0 && !this._prologueShown) {
      this._prologueShown = true;
      const architect = this.industry.npcs[0];
      setTimeout(() => {
        this.game.pushScene(new DialogScene(
          this.game, architect.name, architect.dialogue, architect.color, null
        ));
      }, 500);
    }
  }

  update(dt) {
    this.time += dt;
    this.particles.update();

    if (Math.random() < 0.08) {
      const cw = this.game.canvas.width;
      const ch = this.game.canvas.height;
      this.particles.emit(
        Math.random() * cw, Math.random() * ch, 1,
        { color: this.industry.color + '88', spread: 1.5, decay: 0.006, size: 2 }
      );
    }
  }

  draw(ctx, cw, ch) {
    // Dark background with industry color tint
    ctx.fillStyle = UI.COLOR_BG;
    ctx.fillRect(0, 0, cw, ch);

    // Subtle radial gradient with industry color
    const grad = ctx.createRadialGradient(cw / 2, ch * 0.3, 0, cw / 2, ch * 0.3, cw * 0.6);
    grad.addColorStop(0, this.industry.color + '15');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, cw, ch);

    this.particles.draw(ctx);

    const p = this.game.player;
    const ind = this.industry;
    const contentX = 40;
    const contentW = Math.min(cw - 80, 800);
    let y = 40 - this.scrollY;

    // Town header
    UI.drawPanel(ctx, contentX - 10, y - 5, contentW + 20, 90, {
      bg: 'rgba(10,14,26,0.85)', glow: ind.color + '33'
    });

    UI.drawText(ctx, ind.name, contentX, y, {
      size: 32, weight: '700', font: 'display', color: ind.color
    });
    UI.drawText(ctx, ind.subtitle, contentX, y + 36, {
      size: 14, weight: '500', color: UI.COLOR_MUTED
    });
    UI.drawText(ctx, ind.tagline, contentX, y + 56, {
      size: 12, weight: '400', color: 'rgba(255,255,255,0.5)', maxWidth: contentW
    });

    y += 110;

    // Knowledge Points header
    UI.drawText(ctx, 'KNOWLEDGE POINTS', contentX, y, {
      size: 12, weight: '600', color: ind.color
    });
    y += 25;

    // Insight cards
    this.buttons = [];
    ind.insights.forEach((insight, i) => {
      const isRead = p.insightsRead.includes(insight.id);
      const isHover = this.hoverIdx === i;
      const cardH = 80;

      UI.drawPanel(ctx, contentX, y, contentW, cardH, {
        bg: isRead ? 'rgba(74,240,192,0.08)' : isHover ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)',
        glow: isHover ? ind.color + '44' : null,
        border: isRead ? UI.COLOR_PRIMARY + '44' : UI.COLOR_BORDER
      });

      // Type indicator
      const typeColors = { trend: '#4488ff', tension: '#ff4466', impact: '#ffaa22' };
      ctx.fillStyle = typeColors[insight.type] || '#888';
      ctx.beginPath();
      ctx.arc(contentX + 16, y + 20, 5, 0, Math.PI * 2);
      ctx.fill();

      UI.drawText(ctx, insight.title, contentX + 30, y + 12, {
        size: 15, weight: '600', color: isRead ? UI.COLOR_PRIMARY : '#fff'
      });
      UI.drawText(ctx, `${insight.stat} — ${insight.statLabel}`, contentX + 30, y + 32, {
        size: 12, weight: '500', color: ind.color
      });
      UI.drawText(ctx, insight.summary, contentX + 30, y + 50, {
        size: 11, weight: '400', color: UI.COLOR_MUTED, maxWidth: contentW - 50
      });

      if (isRead) {
        UI.drawText(ctx, '✓ READ', contentX + contentW - 60, y + 12, {
          size: 11, weight: '600', color: UI.COLOR_PRIMARY
        });
      }

      this.buttons.push({ x: contentX, y, w: contentW, h: cardH, type: 'insight', idx: i });
      y += cardH + 8;
    });

    y += 20;

    // NPCs
    UI.drawText(ctx, 'NPCs', contentX, y, {
      size: 12, weight: '600', color: ind.color
    });
    y += 25;

    ind.npcs.forEach((npc, i) => {
      const isHover = this.hoverIdx === 100 + i;
      const npcH = 50;

      UI.drawPanel(ctx, contentX, y, contentW, npcH, {
        bg: isHover ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)',
        glow: isHover ? npc.color + '44' : null
      });

      // NPC icon circle
      ctx.save();
      ctx.fillStyle = npc.color + '33';
      ctx.beginPath();
      ctx.arc(contentX + 24, y + npcH / 2, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = npc.color;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      UI.drawText(ctx, npc.icon, contentX + 24, y + npcH / 2, {
        size: 16, align: 'center', baseline: 'middle', shadow: false
      });

      UI.drawText(ctx, npc.name, contentX + 50, y + 12, {
        size: 14, weight: '600', color: npc.color
      });
      UI.drawText(ctx, 'Click to talk', contentX + 50, y + 30, {
        size: 11, weight: '400', color: UI.COLOR_MUTED
      });

      this.buttons.push({ x: contentX, y, w: contentW, h: npcH, type: 'npc', idx: i });
      y += npcH + 8;
    });

    y += 20;

    // Town Guardian / Fragment
    const allRead = ind.insights.every(ins => p.insightsRead.includes(ins.id));
    const hasFragment = p.cognitiveFragments.includes(this.townId);

    if (allRead && !hasFragment) {
      const guardH = 60;
      const isHover = this.hoverIdx === 200;
      UI.drawPanel(ctx, contentX, y, contentW, guardH, {
        bg: 'rgba(255,170,34,0.1)',
        glow: UI.COLOR_WARNING + '66',
        border: UI.COLOR_WARNING + '66'
      });

      UI.drawText(ctx, '⬡ Town Guardian', contentX + 16, y + 12, {
        size: 16, weight: '700', color: UI.COLOR_WARNING, font: 'display'
      });
      UI.drawText(ctx, 'All insights read! Click to receive Cognitive Fragment', contentX + 16, y + 36, {
        size: 12, weight: '500', color: UI.COLOR_WARNING
      });

      this.buttons.push({ x: contentX, y, w: contentW, h: guardH, type: 'guardian' });
      y += guardH + 8;
    } else if (hasFragment) {
      UI.drawText(ctx, '✓ Cognitive Fragment collected', contentX, y, {
        size: 14, weight: '600', color: UI.COLOR_PRIMARY
      });
      y += 25;
    }

    y += 30;

    // Return button
    const retBtn = UI.drawButton(ctx, contentX, y, 180, 40, '← World Map', {
      hover: this.hoverIdx === 300, fontSize: 14
    });
    this.buttons.push({ x: retBtn.x, y: retBtn.y, w: retBtn.w, h: retBtn.h, type: 'return' });
  }

  onMouseMove(x, y) {
    this.hoverIdx = -1;
    this.buttons.forEach(b => {
      if (UI.pointInRect(x, y, b.x, b.y, b.w, b.h)) {
        if (b.type === 'insight') this.hoverIdx = b.idx;
        else if (b.type === 'npc') this.hoverIdx = 100 + b.idx;
        else if (b.type === 'guardian') this.hoverIdx = 200;
        else if (b.type === 'return') this.hoverIdx = 300;
      }
    });
  }

  onClick(x, y) {
    for (const b of this.buttons) {
      if (!UI.pointInRect(x, y, b.x, b.y, b.w, b.h)) continue;

      AudioManager.uiClick();

      if (b.type === 'insight') {
        const insight = this.industry.insights[b.idx];
        const p = this.game.player;
        const wasNew = addInsight(p, insight.id);
        if (wasNew) {
          AudioManager.insightRead();
          // Show insight detail dialog
          const msgs = [
            `${insight.title}`,
            `${insight.stat} — ${insight.statLabel}`,
            insight.summary,
            `+5 HP, +3 MP, +2 ${insight.type === 'trend' ? 'INT' : insight.type === 'tension' ? 'DEF' : 'ATK'}`
          ];
          this.game.pushScene(new DialogScene(this.game, 'Knowledge Gained', msgs, this.industry.color, null));
        }
        return;
      }

      if (b.type === 'npc') {
        const npc = this.industry.npcs[b.idx];
        this.game.pushScene(new DialogScene(this.game, npc.name, npc.dialogue, npc.color, null));
        return;
      }

      if (b.type === 'guardian') {
        const p = this.game.player;
        p.cognitiveFragments.push(this.townId);
        if (!p.completedTowns.includes(this.townId)) {
          p.completedTowns.push(this.townId);
        }
        unlockAdjacentTowns(p, this.townId);
        AudioManager.fragmentCollect();

        const msgs = this.industry.guardianDialogue;
        this.game.pushScene(new DialogScene(this.game, 'Town Guardian', msgs, UI.COLOR_WARNING, null));
        return;
      }

      if (b.type === 'return') {
        this.game.popScene();
        return;
      }
    }
  }

  onWheel(dy) {
    this.scrollY = Math.max(0, this.scrollY + dy * 0.5);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// COMBAT SCENE
// ═══════════════════════════════════════════════════════════════════════════
class CombatScene {
  constructor(game, enemyTemplate, bgImgId, isBoss, bossId) {
    this.game = game;
    this.bgImg = document.getElementById(bgImgId);
    this.playerImg = document.getElementById('img-player');
    this.isBoss = isBoss;
    this.bossId = bossId;
    this.cs = CombatEngine.createCombatState(game.player, enemyTemplate, isBoss);
    this.time = 0;
    this.particles = new UI.ParticleSystem();
    this.floatingTexts = new UI.FloatingTextManager();
    this.actionButtons = [];
    this.hoverIdx = -1;
    this.subMenu = null; // 'ability' or 'item'
    this.subButtons = [];
    this.animating = false;
    this.animTimer = 0;
    this.showResult = false;
    this.resultTimer = 0;
    this.enemyTurnDelay = 0;
  }

  enter() {
    this.time = 0;
    AudioManager.enemyAppear();
    if (this.isBoss) AudioManager.bossAppear();
  }

  update(dt) {
    this.time += dt;
    this.particles.update();
    this.floatingTexts.update();

    if (this.cs.shakeTimer > 0) {
      this.cs.shakeTimer -= dt;
    }

    // Animation timer
    if (this.animating) {
      this.animTimer -= dt;
      if (this.animTimer <= 0) {
        this.animating = false;
        this.afterPlayerAction();
      }
    }

    // Enemy turn delay
    if (this.enemyTurnDelay > 0) {
      this.enemyTurnDelay -= dt;
      if (this.enemyTurnDelay <= 0) {
        this.doEnemyTurn();
      }
    }

    // Result display timer
    if (this.showResult) {
      this.resultTimer += dt;
    }
  }

  afterPlayerAction() {
    // Check result after player action
    const result = CombatEngine.checkResult(this.cs);
    if (result) {
      this.finishCombat(result);
      return;
    }

    // Process ongoing effects
    CombatEngine.processHelperAndViral(this.cs, this.floatingTexts);

    // Check again after effects
    const result2 = CombatEngine.checkResult(this.cs);
    if (result2) {
      this.finishCombat(result2);
      return;
    }

    // Enemy turn after a delay
    this.enemyTurnDelay = 0.8;
  }

  doEnemyTurn() {
    // Set floating text positions relative to enemy/player drawing positions
    CombatEngine.doEnemyTurn(this.cs, this.floatingTexts);

    // Check result
    const result = CombatEngine.checkResult(this.cs);
    if (result) {
      this.finishCombat(result);
      return;
    }

    CombatEngine.endTurn(this.cs);
    this.cs.phase = 'choose';
    this.subMenu = null;
  }

  finishCombat(result) {
    this.cs.result = result;
    this.showResult = true;
    this.resultTimer = 0;

    if (result === 'victory') {
      AudioManager.victory();
      this.cs.xpGained = this.cs.enemy.xpReward;
      this.cs.itemsFound = CombatEngine.getRandomLoot();

      const p = this.game.player;
      const leveledUp = gainXP(p, this.cs.xpGained);
      if (leveledUp) AudioManager.levelUp();

      // Add loot
      this.cs.itemsFound.forEach(itemId => {
        const existing = p.items.find(i => i.id === itemId);
        if (existing) existing.qty++;
        else p.items.push({ id: itemId, qty: 1 });
      });

      // Update HP/MP
      p.hp = this.cs.player.hp;
      p.mp = this.cs.player.mp;

      if (this.bossId) {
        p.bossesDefeated.push(this.bossId);
      }
    } else {
      AudioManager.defeat();
    }
  }

  draw(ctx, cw, ch) {
    // Background
    UI.drawImageCover(ctx, this.bgImg, cw, ch);
    ctx.fillStyle = 'rgba(10,14,26,0.3)';
    ctx.fillRect(0, 0, cw, ch);

    const cs = this.cs;
    const shakeX = cs.shakeTimer > 0 ? (Math.random() - 0.5) * 8 : 0;
    const shakeY = cs.shakeTimer > 0 ? (Math.random() - 0.5) * 8 : 0;

    // Player (left side)
    const playerX = cw * 0.2;
    const playerY = ch * 0.45;
    const pShakeX = cs.shakeTarget === 'player' ? shakeX : 0;
    const pShakeY = cs.shakeTarget === 'player' ? shakeY : 0;

    if (this.playerImg && this.playerImg.complete) {
      const imgSize = Math.min(180, cw * 0.2);
      ctx.save();
      // Circular clip for player portrait
      ctx.beginPath();
      ctx.arc(playerX + pShakeX, playerY + pShakeY, imgSize / 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(this.playerImg, playerX - imgSize / 2 + pShakeX, playerY - imgSize / 2 + pShakeY, imgSize, imgSize);
      ctx.restore();

      // Portrait border
      ctx.save();
      ctx.strokeStyle = UI.COLOR_PRIMARY;
      ctx.lineWidth = 2;
      ctx.shadowColor = UI.COLOR_PRIMARY;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(playerX, playerY, imgSize / 2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Enemy (right side)
    const enemyX = cw * 0.75;
    const enemyY = ch * 0.35;
    const eShakeX = cs.shakeTarget === 'enemy' ? shakeX : 0;
    const eShakeY = cs.shakeTarget === 'enemy' ? shakeY : 0;
    const enemySize = this.isBoss ? Math.min(220, cw * 0.22) : Math.min(160, cw * 0.16);

    UI.drawEnemy(ctx, enemyX + eShakeX, enemyY + eShakeY, enemySize, cs.enemy, this.time);

    // Enemy name & HP
    UI.drawPanel(ctx, enemyX - 100, enemyY - enemySize / 2 - 55, 200, 50, {
      bg: 'rgba(10,14,26,0.85)'
    });
    UI.drawText(ctx, cs.enemy.name + (this.isBoss ? ' ★' : ''), enemyX, enemyY - enemySize / 2 - 48, {
      size: 14, weight: '600', color: cs.enemy.color, align: 'center'
    });
    UI.drawBar(ctx, enemyX - 90, enemyY - enemySize / 2 - 30, 180, 12, cs.enemy.currentHp, cs.enemy.maxHp, UI.COLOR_DANGER, null, 'HP');

    // Floating texts (offset to enemy/player positions)
    this.floatingTexts.texts.forEach(ft => {
      if (!ft._offsetApplied) {
        ft._offsetApplied = true;
        // Position near the target
        if (ft.color === UI.COLOR_DANGER || ft.color === '#ff0044') {
          ft.x += playerX;
          ft.y += playerY - 60;
        } else {
          ft.x += enemyX;
          ft.y += enemyY - 60;
        }
      }
    });
    this.floatingTexts.draw(ctx);

    // Particles
    this.particles.draw(ctx);

    // Player HUD (bottom-left)
    const hudX = 20;
    const hudY = ch - 160;
    const hudW = Math.min(280, cw * 0.35);

    UI.drawPanel(ctx, hudX, hudY, hudW, 140, { bg: 'rgba(10,14,26,0.9)' });

    UI.drawText(ctx, `Lv.${this.game.player.level} Digital Pioneer`, hudX + 12, hudY + 10, {
      size: 13, weight: '600', color: UI.COLOR_PRIMARY
    });

    UI.drawBar(ctx, hudX + 12, hudY + 30, hudW - 24, 16, cs.player.hp, cs.player.maxHp, '#44cc66', null, 'HP');
    UI.drawBar(ctx, hudX + 12, hudY + 52, hudW - 24, 16, cs.player.mp, cs.player.maxMp, '#4488ff', null, 'MP');

    // Stats line
    const atkEff = CombatEngine.getEffectiveAtk(cs);
    const defEff = CombatEngine.getEffectiveDef(cs);
    const intEff = CombatEngine.getEffectiveInt(cs);
    UI.drawText(ctx, `ATK:${atkEff}  DEF:${defEff}  INT:${intEff}  SPD:${this.game.player.spd}`, hudX + 12, hudY + 76, {
      size: 11, weight: '500', color: UI.COLOR_MUTED
    });

    // Active effects
    let effectY = hudY + 92;
    if (cs.player.helperTurns > 0) {
      UI.drawText(ctx, `Helper: ${cs.player.helperTurns} turns`, hudX + 12, effectY, { size: 10, color: '#06B6D4' });
      effectY += 14;
    }
    if (cs.player.viralTurns > 0) {
      UI.drawText(ctx, `Viral: ${cs.player.viralTurns} turns`, hudX + 12, effectY, { size: 10, color: '#E11D48' });
      effectY += 14;
    }
    if (cs.player.boostTurns > 0) {
      UI.drawText(ctx, `Boost: ${cs.player.boostTurns} turns`, hudX + 12, effectY, { size: 10, color: '#F97316' });
      effectY += 14;
    }
    if (cs.player.defending) {
      UI.drawText(ctx, 'Defending!', hudX + 12, effectY, { size: 10, color: '#4488ff' });
    }

    // Combat log (last 3 messages)
    const logX = hudX;
    const logY = hudY - 60;
    const logW = Math.min(cw - 40, 600);
    UI.drawPanel(ctx, logX, logY, logW, 50, { bg: 'rgba(10,14,26,0.8)' });
    const logMsgs = cs.log.slice(-3);
    logMsgs.forEach((msg, i) => {
      UI.drawText(ctx, msg, logX + 10, logY + 8 + i * 15, {
        size: 11, weight: '400', color: i === logMsgs.length - 1 ? '#fff' : UI.COLOR_MUTED
      });
    });

    // Action menu (bottom-right) — only if choosing
    if (!this.showResult && !this.animating && this.enemyTurnDelay <= 0) {
      this.drawActionMenu(ctx, cw, ch);
    }

    // Result overlay
    if (this.showResult) {
      this.drawResult(ctx, cw, ch);
    }
  }

  drawActionMenu(ctx, cw, ch) {
    const menuX = cw - 320;
    const menuY = ch - 160;
    const menuW = 300;

    this.actionButtons = [];

    if (!this.subMenu) {
      UI.drawPanel(ctx, menuX, menuY, menuW, 140, { bg: 'rgba(10,14,26,0.9)' });

      UI.drawText(ctx, 'ACTIONS', menuX + 12, menuY + 8, {
        size: 11, weight: '600', color: UI.COLOR_PRIMARY
      });

      const bw = 130, bh = 36;
      const actions = [
        { label: 'Attack', x: menuX + 12, y: menuY + 28 },
        { label: 'Defend', x: menuX + 155, y: menuY + 28 },
        { label: 'Ability', x: menuX + 12, y: menuY + 72 },
        { label: 'Item', x: menuX + 155, y: menuY + 72 }
      ];

      actions.forEach((a, i) => {
        const disabled = (a.label === 'Ability' && this.game.player.abilities.length === 0) ||
                         (a.label === 'Item' && this.game.player.items.filter(it => it.qty > 0).length === 0);
        this.actionButtons.push(UI.drawButton(ctx, a.x, a.y, bw, bh, a.label, {
          hover: this.hoverIdx === i, disabled, fontSize: 14
        }));
        this.actionButtons[this.actionButtons.length - 1]._action = a.label.toLowerCase();
        this.actionButtons[this.actionButtons.length - 1]._disabled = disabled;
      });
    } else if (this.subMenu === 'ability') {
      const abilities = this.game.player.abilities;
      const panelH = Math.min(ch - 40, abilities.length * 44 + 50);
      UI.drawPanel(ctx, menuX - 40, menuY - panelH + 140, menuW + 40, panelH, { bg: 'rgba(10,14,26,0.95)' });

      UI.drawText(ctx, 'ABILITIES (click to use, or click outside to cancel)', menuX - 30, menuY - panelH + 148, {
        size: 11, weight: '600', color: UI.COLOR_PRIMARY
      });

      this.subButtons = [];
      abilities.forEach((aId, i) => {
        const ab = ABILITIES[aId];
        let cost = ab.cost;
        if (this.game.player.equipment.includes('architects-mantle')) cost = Math.floor(cost / 2);
        const canUse = this.cs.player.mp >= cost;
        const by = menuY - panelH + 170 + i * 44;

        const btn = UI.drawButton(ctx, menuX - 30, by, menuW + 20, 38, '', {
          hover: this.hoverIdx === 1000 + i, disabled: !canUse
        });

        UI.drawText(ctx, ab.name, menuX - 20, by + 10, {
          size: 13, weight: '600', color: canUse ? '#fff' : UI.COLOR_MUTED
        });
        UI.drawText(ctx, `${ab.desc}  [${cost} MP]`, menuX - 20, by + 25, {
          size: 10, weight: '400', color: canUse ? UI.COLOR_MUTED : 'rgba(255,255,255,0.3)'
        });

        btn._abilityId = aId;
        btn._disabled = !canUse;
        this.subButtons.push(btn);
      });
    } else if (this.subMenu === 'item') {
      const items = this.game.player.items.filter(i => i.qty > 0);
      const panelH = Math.min(ch - 40, items.length * 44 + 50);
      UI.drawPanel(ctx, menuX - 40, menuY - panelH + 140, menuW + 40, panelH, { bg: 'rgba(10,14,26,0.95)' });

      UI.drawText(ctx, 'ITEMS (click to use, or click outside to cancel)', menuX - 30, menuY - panelH + 148, {
        size: 11, weight: '600', color: UI.COLOR_PRIMARY
      });

      this.subButtons = [];
      items.forEach((inv, i) => {
        const item = ITEMS[inv.id];
        const by = menuY - panelH + 170 + i * 44;

        const btn = UI.drawButton(ctx, menuX - 30, by, menuW + 20, 38, '', {
          hover: this.hoverIdx === 2000 + i
        });

        UI.drawText(ctx, `${item.name} (×${inv.qty})`, menuX - 20, by + 10, {
          size: 13, weight: '600', color: '#fff'
        });
        UI.drawText(ctx, item.desc, menuX - 20, by + 25, {
          size: 10, weight: '400', color: UI.COLOR_MUTED
        });

        btn._itemId = inv.id;
        this.subButtons.push(btn);
      });
    }
  }

  drawResult(ctx, cw, ch) {
    const alpha = Math.min(1, this.resultTimer * 2);
    ctx.fillStyle = `rgba(10,14,26,${alpha * 0.7})`;
    ctx.fillRect(0, 0, cw, ch);

    if (alpha < 0.5) return;

    const cs = this.cs;
    const isVictory = cs.result === 'victory';

    const panelW = Math.min(400, cw - 60);
    const panelH = isVictory ? 220 : 160;
    const px = (cw - panelW) / 2;
    const py = (ch - panelH) / 2;

    UI.drawPanel(ctx, px, py, panelW, panelH, {
      bg: 'rgba(10,14,26,0.95)',
      glow: isVictory ? UI.COLOR_PRIMARY + '44' : UI.COLOR_DANGER + '44'
    });

    if (isVictory) {
      UI.drawText(ctx, 'VICTORY!', cw / 2, py + 30, {
        size: 36, weight: '700', font: 'display',
        color: UI.COLOR_PRIMARY, align: 'center'
      });
      UI.drawText(ctx, `${cs.enemy.name} defeated!`, cw / 2, py + 65, {
        size: 14, weight: '500', color: UI.COLOR_MUTED, align: 'center'
      });
      UI.drawText(ctx, `+${cs.xpGained} XP`, cw / 2, py + 90, {
        size: 16, weight: '600', color: UI.COLOR_WARNING, align: 'center'
      });

      if (cs.itemsFound.length > 0) {
        const itemNames = cs.itemsFound.map(id => ITEMS[id] ? ITEMS[id].name : id).join(', ');
        UI.drawText(ctx, `Found: ${itemNames}`, cw / 2, py + 115, {
          size: 12, weight: '400', color: UI.COLOR_MUTED, align: 'center'
        });
      }

      this._continueBtn = UI.drawButton(ctx, cw / 2 - 80, py + panelH - 55, 160, 40, 'Continue', {
        hover: this.hoverIdx === 9000, fontSize: 16
      });
    } else {
      UI.drawText(ctx, 'DEFEATED', cw / 2, py + 30, {
        size: 36, weight: '700', font: 'display',
        color: UI.COLOR_DANGER, align: 'center'
      });
      UI.drawText(ctx, `${cs.enemy.name} was too strong...`, cw / 2, py + 65, {
        size: 14, weight: '500', color: UI.COLOR_MUTED, align: 'center'
      });

      this._retryBtn = UI.drawButton(ctx, cw / 2 - 170, py + panelH - 55, 150, 40, 'Retry', {
        hover: this.hoverIdx === 9001, fontSize: 14
      });
      this._retreatBtn = UI.drawButton(ctx, cw / 2 + 20, py + panelH - 55, 150, 40, 'World Map', {
        hover: this.hoverIdx === 9002, fontSize: 14, color: UI.COLOR_DANGER
      });
    }
  }

  onMouseMove(x, y) {
    this.hoverIdx = -1;

    if (this.showResult) {
      if (this.cs.result === 'victory' && this._continueBtn) {
        if (UI.pointInRect(x, y, this._continueBtn.x, this._continueBtn.y, this._continueBtn.w, this._continueBtn.h)) {
          this.hoverIdx = 9000;
        }
      }
      if (this.cs.result === 'defeat') {
        if (this._retryBtn && UI.pointInRect(x, y, this._retryBtn.x, this._retryBtn.y, this._retryBtn.w, this._retryBtn.h)) {
          this.hoverIdx = 9001;
        }
        if (this._retreatBtn && UI.pointInRect(x, y, this._retreatBtn.x, this._retreatBtn.y, this._retreatBtn.w, this._retreatBtn.h)) {
          this.hoverIdx = 9002;
        }
      }
      return;
    }

    if (this.subMenu) {
      this.subButtons.forEach((b, i) => {
        const base = this.subMenu === 'ability' ? 1000 : 2000;
        if (UI.pointInRect(x, y, b.x, b.y, b.w, b.h)) this.hoverIdx = base + i;
      });
    } else {
      this.actionButtons.forEach((b, i) => {
        if (UI.pointInRect(x, y, b.x, b.y, b.w, b.h)) this.hoverIdx = i;
      });
    }
  }

  onClick(x, y) {
    AudioManager.uiClick();

    // Result screen clicks
    if (this.showResult) {
      if (this.cs.result === 'victory' && this._continueBtn) {
        if (UI.pointInRect(x, y, this._continueBtn.x, this._continueBtn.y, this._continueBtn.w, this._continueBtn.h)) {
          this.game.popScene();
          return;
        }
      }
      if (this.cs.result === 'defeat') {
        if (this._retryBtn && UI.pointInRect(x, y, this._retryBtn.x, this._retryBtn.y, this._retryBtn.w, this._retryBtn.h)) {
          // Retry: reset player HP/MP and restart combat
          const p = this.game.player;
          p.hp = p.maxHp;
          p.mp = p.maxMp;
          this.cs = CombatEngine.createCombatState(p, this.cs.enemy, this.isBoss);
          this.cs.enemy.currentHp = this.cs.enemy.maxHp;
          this.showResult = false;
          this.resultTimer = 0;
          this.subMenu = null;
          return;
        }
        if (this._retreatBtn && UI.pointInRect(x, y, this._retreatBtn.x, this._retreatBtn.y, this._retreatBtn.w, this._retreatBtn.h)) {
          // Retreat: heal player partially and return to map
          const p = this.game.player;
          p.hp = Math.floor(p.maxHp * 0.5);
          p.mp = Math.floor(p.maxMp * 0.5);
          this.game.popScene();
          return;
        }
      }
      return;
    }

    if (this.animating || this.enemyTurnDelay > 0) return;

    // Sub-menu clicks
    if (this.subMenu === 'ability') {
      for (const btn of this.subButtons) {
        if (UI.pointInRect(x, y, btn.x, btn.y, btn.w, btn.h) && !btn._disabled) {
          const success = CombatEngine.doAbility(this.cs, btn._abilityId, this.game.player, this.floatingTexts);
          if (success) {
            this.subMenu = null;
            this.animating = true;
            this.animTimer = 0.5;
            // Particle burst
            const cw = this.game.canvas.width;
            this.particles.emit(cw * 0.75, this.game.canvas.height * 0.35, 20, {
              color: ABILITIES[btn._abilityId] ? INDUSTRIES[ABILITIES[btn._abilityId].industry]?.color || UI.COLOR_PRIMARY : UI.COLOR_PRIMARY,
              spread: 5, decay: 0.02, size: 4
            });
          }
          return;
        }
      }
      // Click outside sub-menu = cancel
      this.subMenu = null;
      return;
    }

    if (this.subMenu === 'item') {
      for (const btn of this.subButtons) {
        if (UI.pointInRect(x, y, btn.x, btn.y, btn.w, btn.h)) {
          const success = CombatEngine.doItem(this.cs, btn._itemId, this.game.player);
          if (success) {
            this.subMenu = null;
            this.animating = true;
            this.animTimer = 0.4;
          }
          return;
        }
      }
      this.subMenu = null;
      return;
    }

    // Main action buttons
    for (const btn of this.actionButtons) {
      if (UI.pointInRect(x, y, btn.x, btn.y, btn.w, btn.h) && !btn._disabled) {
        const action = btn._action;
        if (action === 'attack') {
          CombatEngine.doAttack(this.cs, this.floatingTexts);
          this.particles.emit(this.game.canvas.width * 0.75, this.game.canvas.height * 0.35, 10, {
            color: '#ff6644', spread: 4, decay: 0.03
          });
          this.animating = true;
          this.animTimer = 0.5;
        } else if (action === 'defend') {
          CombatEngine.doDefend(this.cs);
          this.animating = true;
          this.animTimer = 0.3;
        } else if (action === 'ability') {
          this.subMenu = 'ability';
        } else if (action === 'item') {
          this.subMenu = 'item';
        }
        return;
      }
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// DIALOG SCENE (overlay)
// ═══════════════════════════════════════════════════════════════════════════
class DialogScene {
  constructor(game, speakerName, messages, color, onClose) {
    this.game = game;
    this.speakerName = speakerName;
    this.messages = messages;
    this.color = color || UI.COLOR_PRIMARY;
    this.onClose = onClose;
    this.msgIdx = 0;
    this.charIdx = 0;
    this.charTimer = 0;
    this.time = 0;
    this.hoverNext = false;
    this.displayedText = '';
    this.textSpeed = 0.03;
  }

  enter() {
    this.time = 0;
    this.msgIdx = 0;
    this.charIdx = 0;
    this.displayedText = '';
  }

  update(dt) {
    this.time += dt;
    this.charTimer += dt;

    const currentMsg = this.messages[this.msgIdx] || '';
    if (this.charIdx < currentMsg.length) {
      while (this.charTimer >= this.textSpeed && this.charIdx < currentMsg.length) {
        this.charIdx++;
        this.charTimer -= this.textSpeed;
        this.displayedText = currentMsg.substring(0, this.charIdx);
        if (this.charIdx % 3 === 0) AudioManager.textBlip();
      }
    }
  }

  draw(ctx, cw, ch) {
    // Semi-transparent overlay
    ctx.fillStyle = 'rgba(10,14,26,0.6)';
    ctx.fillRect(0, 0, cw, ch);

    const panelW = Math.min(700, cw - 60);
    const panelH = 180;
    const px = (cw - panelW) / 2;
    const py = ch - panelH - 40;

    UI.drawPanel(ctx, px, py, panelW, panelH, {
      bg: 'rgba(10,14,26,0.95)',
      glow: this.color + '22',
      border: this.color + '44'
    });

    // Speaker portrait circle
    const circleR = 28;
    const circleX = px + 35;
    const circleY = py + 35;
    ctx.save();
    ctx.fillStyle = this.color + '33';
    ctx.beginPath();
    ctx.arc(circleX, circleY, circleR, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    // Speaker initial
    UI.drawText(ctx, this.speakerName.charAt(0), circleX, circleY, {
      size: 24, weight: '700', font: 'display', color: this.color,
      align: 'center', baseline: 'middle'
    });

    // Speaker name
    UI.drawText(ctx, this.speakerName, px + 75, py + 16, {
      size: 16, weight: '700', color: this.color, font: 'display'
    });

    // Message counter
    UI.drawText(ctx, `${this.msgIdx + 1}/${this.messages.length}`, px + panelW - 50, py + 18, {
      size: 11, weight: '500', color: UI.COLOR_MUTED
    });

    // Message text
    UI.wrapText(ctx, this.displayedText, px + 75, py + 42, panelW - 100, 20, {
      size: 14, weight: '400', color: UI.COLOR_TEXT
    });

    // Next button
    const isComplete = this.charIdx >= (this.messages[this.msgIdx] || '').length;
    const isLast = this.msgIdx >= this.messages.length - 1;
    const btnLabel = isLast && isComplete ? 'Close' : isComplete ? 'Next ▸' : 'Skip ▸';

    this._nextBtn = UI.drawButton(ctx, px + panelW - 110, py + panelH - 45, 95, 32, btnLabel, {
      hover: this.hoverNext, fontSize: 13
    });
  }

  onMouseMove(x, y) {
    this.hoverNext = this._nextBtn && UI.pointInRect(x, y, this._nextBtn.x, this._nextBtn.y, this._nextBtn.w, this._nextBtn.h);
  }

  onClick(x, y) {
    AudioManager.uiClick();

    const currentMsg = this.messages[this.msgIdx] || '';
    const isComplete = this.charIdx >= currentMsg.length;

    if (!isComplete) {
      // Skip to end of current message
      this.charIdx = currentMsg.length;
      this.displayedText = currentMsg;
      return;
    }

    // Advance to next message
    if (this.msgIdx < this.messages.length - 1) {
      this.msgIdx++;
      this.charIdx = 0;
      this.charTimer = 0;
      this.displayedText = '';
    } else {
      // Close dialog
      if (this.onClose) {
        this.game.popScene();
        this.onClose();
      } else {
        this.game.popScene();
      }
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// INVENTORY SCENE (overlay)
// ═══════════════════════════════════════════════════════════════════════════
class InventoryScene {
  constructor(game) {
    this.game = game;
    this.time = 0;
    this.hoverIdx = -1;
    this.scrollY = 0;
    this.tab = 'stats'; // 'stats', 'abilities', 'items', 'log'
    this._buttons = [];
  }

  enter() {
    this.time = 0;
  }

  update(dt) {
    this.time += dt;
  }

  draw(ctx, cw, ch) {
    // Overlay
    ctx.fillStyle = 'rgba(10,14,26,0.85)';
    ctx.fillRect(0, 0, cw, ch);

    const panelW = Math.min(700, cw - 60);
    const panelH = Math.min(ch - 60, 600);
    const px = (cw - panelW) / 2;
    const py = (ch - panelH) / 2;

    UI.drawPanel(ctx, px, py, panelW, panelH, { bg: 'rgba(10,14,26,0.95)' });

    const p = this.game.player;
    this._buttons = [];

    // Title
    UI.drawText(ctx, 'INVENTORY', px + panelW / 2, py + 20, {
      size: 28, weight: '700', font: 'display', color: UI.COLOR_PRIMARY, align: 'center'
    });

    // Tabs
    const tabs = ['Stats', 'Abilities', 'Items', 'Knowledge Log'];
    const tabKeys = ['stats', 'abilities', 'items', 'log'];
    const tabW = (panelW - 40) / tabs.length;
    tabs.forEach((label, i) => {
      const tx = px + 20 + i * tabW;
      const ty = py + 50;
      const isActive = this.tab === tabKeys[i];

      ctx.fillStyle = isActive ? UI.COLOR_PRIMARY + '22' : 'transparent';
      ctx.fillRect(tx, ty, tabW - 4, 28);
      if (isActive) {
        ctx.fillStyle = UI.COLOR_PRIMARY;
        ctx.fillRect(tx, ty + 26, tabW - 4, 2);
      }

      UI.drawText(ctx, label, tx + (tabW - 4) / 2, ty + 14, {
        size: 12, weight: isActive ? '600' : '400',
        color: isActive ? UI.COLOR_PRIMARY : UI.COLOR_MUTED,
        align: 'center', baseline: 'middle'
      });

      this._buttons.push({ x: tx, y: ty, w: tabW - 4, h: 28, type: 'tab', key: tabKeys[i] });
    });

    const contentY = py + 90;
    const contentH = panelH - 140;

    ctx.save();
    ctx.beginPath();
    ctx.rect(px, contentY, panelW, contentH);
    ctx.clip();

    const cy = contentY - this.scrollY;

    if (this.tab === 'stats') {
      this.drawStats(ctx, px + 20, cy, panelW - 40, p);
    } else if (this.tab === 'abilities') {
      this.drawAbilities(ctx, px + 20, cy, panelW - 40, p);
    } else if (this.tab === 'items') {
      this.drawItems(ctx, px + 20, cy, panelW - 40, p);
    } else if (this.tab === 'log') {
      this.drawLog(ctx, px + 20, cy, panelW - 40, p);
    }

    ctx.restore();

    // Close button
    this._closeBtn = UI.drawButton(ctx, px + panelW / 2 - 60, py + panelH - 45, 120, 35, 'Close', {
      hover: this.hoverIdx === 999, fontSize: 14
    });
    this._buttons.push({ x: this._closeBtn.x, y: this._closeBtn.y, w: this._closeBtn.w, h: this._closeBtn.h, type: 'close' });
  }

  drawStats(ctx, x, y, w, p) {
    const stats = [
      { label: 'Level', value: p.level, color: UI.COLOR_PRIMARY },
      { label: 'XP', value: `${p.xp}/${p.xpToNext}`, color: UI.COLOR_WARNING },
      { label: 'HP', value: `${p.hp}/${p.maxHp}`, color: '#44cc66' },
      { label: 'MP', value: `${p.mp}/${p.maxMp}`, color: '#4488ff' },
      { label: 'ATK', value: p.atk, color: '#ff6644' },
      { label: 'DEF', value: p.def, color: '#4488ff' },
      { label: 'SPD', value: p.spd, color: '#ffcc44' },
      { label: 'INT', value: p.int, color: '#aa88ff' },
      { label: 'Insights Read', value: `${p.totalInsightsRead}/44`, color: UI.COLOR_MUTED },
      { label: 'Fragments', value: `${p.cognitiveFragments.length}/14`, color: UI.COLOR_WARNING }
    ];

    stats.forEach((s, i) => {
      const sy = y + 10 + i * 32;
      UI.drawText(ctx, s.label, x, sy, { size: 14, weight: '500', color: UI.COLOR_MUTED });
      UI.drawText(ctx, String(s.value), x + 200, sy, { size: 14, weight: '700', color: s.color });
    });

    // Equipment section
    let ey = y + 10 + stats.length * 32 + 20;
    UI.drawText(ctx, 'EQUIPMENT', x, ey, { size: 12, weight: '600', color: UI.COLOR_PRIMARY });
    ey += 20;

    if (p.equipment.length === 0) {
      UI.drawText(ctx, 'No equipment yet. Read more insights!', x, ey, { size: 12, color: UI.COLOR_MUTED });
    } else {
      p.equipment.forEach(eqId => {
        const eq = EQUIPMENT.find(e => e.id === eqId);
        if (eq) {
          UI.drawText(ctx, `${eq.name} — ${eq.desc}`, x + 10, ey, {
            size: 13, weight: '500', color: '#ddd'
          });
          ey += 22;
        }
      });
    }
  }

  drawAbilities(ctx, x, y, w, p) {
    if (p.abilities.length === 0) {
      UI.drawText(ctx, 'No abilities yet.', x, y + 10, { size: 14, color: UI.COLOR_MUTED });
      UI.drawText(ctx, 'Read ALL insights in an industry to unlock its ability.', x, y + 30, { size: 12, color: UI.COLOR_MUTED });
      return;
    }

    p.abilities.forEach((aId, i) => {
      const ab = ABILITIES[aId];
      const ay = y + 10 + i * 55;
      UI.drawPanel(ctx, x, ay, w, 48, { bg: 'rgba(255,255,255,0.04)' });
      UI.drawText(ctx, ab.name, x + 10, ay + 10, { size: 15, weight: '600', color: '#fff' });

      const ind = INDUSTRIES[ab.industry];
      UI.drawText(ctx, ind ? ind.name : '', x + 10, ay + 28, { size: 11, color: ind ? ind.color : UI.COLOR_MUTED });
      UI.drawText(ctx, `${ab.desc}  [${ab.cost} MP]`, x + 180, ay + 28, { size: 11, color: UI.COLOR_MUTED });
    });
  }

  drawItems(ctx, x, y, w, p) {
    const items = p.items.filter(i => i.qty > 0);
    if (items.length === 0) {
      UI.drawText(ctx, 'No items in inventory.', x, y + 10, { size: 14, color: UI.COLOR_MUTED });
      return;
    }

    items.forEach((inv, i) => {
      const item = ITEMS[inv.id];
      const iy = y + 10 + i * 40;
      UI.drawText(ctx, `${item.name} (×${inv.qty})`, x + 10, iy, { size: 14, weight: '600', color: '#fff' });
      UI.drawText(ctx, item.desc, x + 10, iy + 18, { size: 11, color: UI.COLOR_MUTED });
    });
  }

  drawLog(ctx, x, y, w, p) {
    if (p.insightsRead.length === 0) {
      UI.drawText(ctx, 'No insights read yet. Explore towns to learn!', x, y + 10, { size: 14, color: UI.COLOR_MUTED });
      return;
    }

    let ly = y + 10;
    for (const [indId, ind] of Object.entries(INDUSTRIES)) {
      const readInThisInd = ind.insights.filter(ins => p.insightsRead.includes(ins.id));
      if (readInThisInd.length === 0) continue;

      UI.drawText(ctx, `${ind.name} (${readInThisInd.length}/${ind.insights.length})`, x, ly, {
        size: 13, weight: '600', color: ind.color
      });
      ly += 20;

      readInThisInd.forEach(ins => {
        UI.drawText(ctx, `• ${ins.title}: ${ins.stat}`, x + 15, ly, {
          size: 11, weight: '400', color: UI.COLOR_MUTED
        });
        ly += 16;
      });
      ly += 8;
    }
  }

  onMouseMove(x, y) {
    this.hoverIdx = -1;
    if (this._closeBtn && UI.pointInRect(x, y, this._closeBtn.x, this._closeBtn.y, this._closeBtn.w, this._closeBtn.h)) {
      this.hoverIdx = 999;
    }
  }

  onClick(x, y) {
    AudioManager.uiClick();

    for (const btn of this._buttons) {
      if (UI.pointInRect(x, y, btn.x, btn.y, btn.w, btn.h)) {
        if (btn.type === 'tab') {
          this.tab = btn.key;
          this.scrollY = 0;
          return;
        }
        if (btn.type === 'close') {
          this.game.popScene();
          return;
        }
      }
    }
  }

  onWheel(dy) {
    this.scrollY = Math.max(0, this.scrollY + dy * 0.5);
  }
}
