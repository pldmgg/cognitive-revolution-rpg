/* tilemap.js — Isometric tile rendering engine */
/* eslint-disable no-unused-vars */

const TileRenderer = (() => {
  const TILE_W = 64;
  const TILE_H = 32;
  const WALL_HEIGHT = 24;
  const TREE_HEIGHT = 36;

  // Convert tile coords to screen position
  function tileToScreen(tx, ty, camX, camY, canvasW, canvasH) {
    const sx = (tx - ty) * (TILE_W / 2) + canvasW / 2 - camX;
    const sy = (tx + ty) * (TILE_H / 2) + canvasH / 4 - camY;
    return { x: sx, y: sy };
  }

  // Convert screen coords to tile coords (approximate)
  function screenToTile(sx, sy, camX, camY, canvasW, canvasH) {
    const rx = sx - canvasW / 2 + camX;
    const ry = sy - canvasH / 4 + camY;
    const tx = (rx / (TILE_W / 2) + ry / (TILE_H / 2)) / 2;
    const ty = (ry / (TILE_H / 2) - rx / (TILE_W / 2)) / 2;
    return { x: tx, y: ty };
  }

  // Draw an isometric diamond
  function drawDiamond(ctx, sx, sy, w, h) {
    ctx.beginPath();
    ctx.moveTo(sx, sy - h / 2);
    ctx.lineTo(sx + w / 2, sy);
    ctx.lineTo(sx, sy + h / 2);
    ctx.lineTo(sx - w / 2, sy);
    ctx.closePath();
  }

  // Draw isometric cube (for walls/buildings)
  function drawCube(ctx, sx, sy, w, h, height, topColor, leftColor, rightColor) {
    const hw = w / 2;
    const hh = h / 2;

    // Top face
    ctx.fillStyle = topColor;
    ctx.beginPath();
    ctx.moveTo(sx, sy - hh - height);
    ctx.lineTo(sx + hw, sy - height);
    ctx.lineTo(sx, sy + hh - height);
    ctx.lineTo(sx - hw, sy - height);
    ctx.closePath();
    ctx.fill();

    // Left face
    ctx.fillStyle = leftColor;
    ctx.beginPath();
    ctx.moveTo(sx - hw, sy - height);
    ctx.lineTo(sx, sy + hh - height);
    ctx.lineTo(sx, sy + hh);
    ctx.lineTo(sx - hw, sy);
    ctx.closePath();
    ctx.fill();

    // Right face
    ctx.fillStyle = rightColor;
    ctx.beginPath();
    ctx.moveTo(sx + hw, sy - height);
    ctx.lineTo(sx, sy + hh - height);
    ctx.lineTo(sx, sy + hh);
    ctx.lineTo(sx + hw, sy);
    ctx.closePath();
    ctx.fill();
  }

  // ── Individual Tile Drawers ──────────────────────────────────────────

  function drawStone(ctx, sx, sy) {
    drawDiamond(ctx, sx, sy, TILE_W, TILE_H);
    ctx.fillStyle = '#5a5a6e';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 0.5;
    ctx.stroke();
    // Grid lines
    ctx.strokeStyle = 'rgba(0,0,0,0.15)';
    ctx.beginPath();
    ctx.moveTo(sx - 8, sy);
    ctx.lineTo(sx + 8, sy);
    ctx.stroke();
  }

  function drawWall(ctx, sx, sy) {
    drawCube(ctx, sx, sy, TILE_W, TILE_H, WALL_HEIGHT, '#3a3a4e', '#2a2a3e', '#252538');
    // Highlight
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(sx, sy - TILE_H/2 - WALL_HEIGHT);
    ctx.lineTo(sx + TILE_W/2, sy - WALL_HEIGHT);
    ctx.stroke();
  }

  function drawWater(ctx, sx, sy, time) {
    const wave = Math.sin(time * 2 + sx * 0.05) * 2;
    drawDiamond(ctx, sx, sy + wave, TILE_W, TILE_H);
    const grad = ctx.createLinearGradient(sx - 16, sy - 8, sx + 16, sy + 8);
    grad.addColorStop(0, '#1a5fa8');
    grad.addColorStop(0.5, '#2480d0');
    grad.addColorStop(1, '#1a5fa8');
    ctx.fillStyle = grad;
    ctx.fill();
    // Sparkle
    ctx.fillStyle = `rgba(255,255,255,${0.1 + Math.sin(time * 3 + sy * 0.1) * 0.1})`;
    ctx.beginPath();
    ctx.arc(sx + Math.sin(time * 2) * 6, sy + wave - 2, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawGrass(ctx, sx, sy, time) {
    drawDiamond(ctx, sx, sy, TILE_W, TILE_H);
    ctx.fillStyle = '#3a7a3a';
    ctx.fill();
    // Grass tufts
    ctx.strokeStyle = '#4a9a4a';
    ctx.lineWidth = 1;
    const sway = Math.sin(time + sx * 0.1) * 1;
    for (let i = 0; i < 3; i++) {
      const gx = sx - 8 + i * 8;
      const gy = sy - 2 + (i % 2) * 3;
      ctx.beginPath();
      ctx.moveTo(gx, gy);
      ctx.lineTo(gx + sway, gy - 4);
      ctx.stroke();
    }
  }

  function drawTech(ctx, sx, sy, time) {
    drawDiamond(ctx, sx, sy, TILE_W, TILE_H);
    ctx.fillStyle = '#1a1a2e';
    ctx.fill();
    // Circuit lines
    ctx.strokeStyle = `rgba(6, 182, 212, ${0.3 + Math.sin(time * 2) * 0.1})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(sx - 12, sy);
    ctx.lineTo(sx, sy - 4);
    ctx.lineTo(sx + 12, sy);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(sx, sy - 6);
    ctx.lineTo(sx, sy + 6);
    ctx.stroke();
    // Node dots
    ctx.fillStyle = '#06B6D4';
    ctx.beginPath();
    ctx.arc(sx, sy, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawCobble(ctx, sx, sy) {
    drawDiamond(ctx, sx, sy, TILE_W, TILE_H);
    ctx.fillStyle = '#6a6a78';
    ctx.fill();
    // Stone pattern
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    for (let i = 0; i < 5; i++) {
      const cx = sx - 10 + (i * 5);
      const cy = sy - 3 + (i % 2) * 4;
      ctx.beginPath();
      ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawDirt(ctx, sx, sy) {
    drawDiamond(ctx, sx, sy, TILE_W, TILE_H);
    ctx.fillStyle = '#7a6040';
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.1)';
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }

  function drawWood(ctx, sx, sy) {
    drawDiamond(ctx, sx, sy, TILE_W, TILE_H);
    ctx.fillStyle = '#8a6a40';
    ctx.fill();
    // Plank lines
    ctx.strokeStyle = 'rgba(0,0,0,0.2)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(sx - 15, sy - 2);
    ctx.lineTo(sx + 15, sy - 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(sx - 12, sy + 3);
    ctx.lineTo(sx + 12, sy + 3);
    ctx.stroke();
  }

  function drawSand(ctx, sx, sy) {
    drawDiamond(ctx, sx, sy, TILE_W, TILE_H);
    ctx.fillStyle = '#c8b070';
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,220,0.15)';
    ctx.beginPath();
    ctx.arc(sx + 5, sy - 2, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawTree(ctx, sx, sy, time) {
    // Shadow on ground
    drawDiamond(ctx, sx, sy, TILE_W, TILE_H);
    ctx.fillStyle = '#2a5a2a';
    ctx.fill();

    // Trunk
    ctx.fillStyle = '#5a3a1a';
    ctx.fillRect(sx - 3, sy - TREE_HEIGHT + 8, 6, TREE_HEIGHT - 8);

    // Canopy (layered circles)
    const sway = Math.sin(time * 1.5 + sx * 0.05) * 1;
    ctx.fillStyle = '#2a8a2a';
    ctx.beginPath();
    ctx.arc(sx + sway, sy - TREE_HEIGHT + 2, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#3aaa3a';
    ctx.beginPath();
    ctx.arc(sx + sway + 3, sy - TREE_HEIGHT - 2, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#4aba4a';
    ctx.beginPath();
    ctx.arc(sx + sway - 2, sy - TREE_HEIGHT + 6, 11, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawMountain(ctx, sx, sy) {
    drawDiamond(ctx, sx, sy, TILE_W, TILE_H);
    ctx.fillStyle = '#4a4a5a';
    ctx.fill();

    // Mountain shape
    ctx.fillStyle = '#5a5a6a';
    ctx.beginPath();
    ctx.moveTo(sx, sy - 30);
    ctx.lineTo(sx + 16, sy);
    ctx.lineTo(sx - 16, sy);
    ctx.closePath();
    ctx.fill();

    // Snow cap
    ctx.fillStyle = '#dde8f0';
    ctx.beginPath();
    ctx.moveTo(sx, sy - 30);
    ctx.lineTo(sx + 6, sy - 20);
    ctx.lineTo(sx - 6, sy - 20);
    ctx.closePath();
    ctx.fill();

    // Darker side
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.moveTo(sx, sy - 30);
    ctx.lineTo(sx + 16, sy);
    ctx.lineTo(sx, sy);
    ctx.closePath();
    ctx.fill();
  }

  function drawBuilding(ctx, sx, sy, time, color) {
    const bColor = color || '#3a3a5a';
    drawCube(ctx, sx, sy, TILE_W, TILE_H, WALL_HEIGHT + 8,
      bColor,
      shadeColor(bColor, -30),
      shadeColor(bColor, -50)
    );
    // Glowing window
    const glow = 0.4 + Math.sin(time * 2) * 0.2;
    ctx.fillStyle = `rgba(255,200,100,${glow})`;
    ctx.fillRect(sx - 4, sy - WALL_HEIGHT - 2, 3, 4);
    ctx.fillRect(sx + 2, sy - WALL_HEIGHT - 2, 3, 4);
  }

  function shadeColor(hex, amount) {
    let r = parseInt(hex.slice(1,3), 16) + amount;
    let g = parseInt(hex.slice(3,5), 16) + amount;
    let b = parseInt(hex.slice(5,7), 16) + amount;
    r = Math.max(0, Math.min(255, r));
    g = Math.max(0, Math.min(255, g));
    b = Math.max(0, Math.min(255, b));
    return `rgb(${r},${g},${b})`;
  }

  // ── Main Tile Draw ─────────────────────────────────────────────────────

  function drawTile(ctx, tileType, sx, sy, time, color) {
    switch (tileType) {
      case TILE.VOID: return;
      case TILE.STONE: drawStone(ctx, sx, sy); break;
      case TILE.WALL: drawWall(ctx, sx, sy); break;
      case TILE.WATER: drawWater(ctx, sx, sy, time); break;
      case TILE.GRASS: drawGrass(ctx, sx, sy, time); break;
      case TILE.TECH: drawTech(ctx, sx, sy, time); break;
      case TILE.COBBLE: drawCobble(ctx, sx, sy); break;
      case TILE.DIRT: drawDirt(ctx, sx, sy); break;
      case TILE.WOOD: drawWood(ctx, sx, sy); break;
      case TILE.SAND: drawSand(ctx, sx, sy); break;
      case TILE.TREE: drawTree(ctx, sx, sy, time); break;
      case TILE.MOUNTAIN: drawMountain(ctx, sx, sy); break;
      case TILE.BUILDING: drawBuilding(ctx, sx, sy, time, color); break;
    }
  }

  // ── Render entire tilemap ──────────────────────────────────────────────

  function renderMap(ctx, mapData, camX, camY, canvasW, canvasH, time, industryColor) {
    const { width, height, tiles } = mapData;

    // Calculate visible tile range (with padding)
    const pad = 4;
    
    // Draw back-to-front for correct depth
    for (let ty = 0; ty < height; ty++) {
      for (let tx = 0; tx < width; tx++) {
        const screen = tileToScreen(tx, ty, camX, camY, canvasW, canvasH);
        
        // Frustum cull
        if (screen.x < -TILE_W * 2 || screen.x > canvasW + TILE_W * 2) continue;
        if (screen.y < -80 || screen.y > canvasH + TILE_H * 2) continue;
        
        const tile = tiles[ty][tx];
        drawTile(ctx, tile, screen.x, screen.y, time, industryColor);
      }
    }
  }

  // ── Collision check ────────────────────────────────────────────────────

  function isBlocked(mapData, tx, ty) {
    if (tx < 0 || ty < 0 || tx >= mapData.width || ty >= mapData.height) return true;
    const tileType = mapData.tiles[Math.floor(ty)][Math.floor(tx)];
    return BLOCKED_TILES.has(tileType);
  }

  // ── Draw Objects ──────────────────────────────────────────────────────

  function drawNPC(ctx, sx, sy, npcData, time) {
    const color = (npcData && npcData.npcData && npcData.npcData.color) ? npcData.npcData.color : '#aaa';
    const bobY = Math.sin(time * 2) * 1.5;
    
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(sx, sy + 2, 8, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.fillStyle = color;
    ctx.fillRect(sx - 6, sy - 18 + bobY, 12, 14);
    
    // Head
    ctx.fillStyle = '#e8c8a0';
    ctx.beginPath();
    ctx.arc(sx, sy - 22 + bobY, 6, 0, Math.PI * 2);
    ctx.fill();

    // Name label
    if (npcData && (npcData.id || (npcData.npcData && npcData.npcData.name))) {
      const name = npcData.npcData ? npcData.npcData.name : npcData.id;
      ctx.save();
      ctx.font = "600 10px 'Inter', sans-serif";
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillText(name, sx + 1, sy - 31 + bobY);
      ctx.fillStyle = '#fff';
      ctx.fillText(name, sx, sy - 32 + bobY);
      ctx.restore();
    }
  }

  function drawGuardian(ctx, sx, sy, time, industryColor) {
    const bobY = Math.sin(time * 1.5) * 2;
    const glow = 0.3 + Math.sin(time * 3) * 0.15;
    
    // Glow aura
    ctx.save();
    ctx.shadowColor = industryColor || '#4af0c0';
    ctx.shadowBlur = 15;
    
    // Body
    ctx.fillStyle = industryColor || '#4af0c0';
    ctx.fillRect(sx - 7, sy - 20 + bobY, 14, 16);
    
    // Head
    ctx.fillStyle = '#e8c8a0';
    ctx.beginPath();
    ctx.arc(sx, sy - 24 + bobY, 7, 0, Math.PI * 2);
    ctx.fill();
    
    // Crown/indicator
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.moveTo(sx - 5, sy - 31 + bobY);
    ctx.lineTo(sx - 3, sy - 35 + bobY);
    ctx.lineTo(sx, sy - 32 + bobY);
    ctx.lineTo(sx + 3, sy - 35 + bobY);
    ctx.lineTo(sx + 5, sy - 31 + bobY);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();

    // Label
    ctx.save();
    ctx.font = "600 10px 'Inter', sans-serif";
    ctx.textAlign = 'center';
    ctx.fillStyle = '#FFD700';
    ctx.fillText('Town Guardian', sx, sy - 38 + bobY);
    ctx.restore();
  }

  function drawKnowledge(ctx, sx, sy, time, collected) {
    if (collected) return;
    const bobY = Math.sin(time * 3) * 3;
    const glow = 0.5 + Math.sin(time * 4) * 0.3;
    
    ctx.save();
    ctx.shadowColor = '#4af0c0';
    ctx.shadowBlur = 12 + Math.sin(time * 4) * 4;
    
    // Orb
    const grad = ctx.createRadialGradient(sx, sy - 12 + bobY, 0, sx, sy - 12 + bobY, 8);
    grad.addColorStop(0, '#fff');
    grad.addColorStop(0.4, '#4af0c0');
    grad.addColorStop(1, 'rgba(74,240,192,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(sx, sy - 12 + bobY, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Sparkle
    ctx.fillStyle = `rgba(255,255,255,${glow})`;
    ctx.beginPath();
    ctx.arc(sx + 4, sy - 16 + bobY, 1.5, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }

  function drawShopIcon(ctx, sx, sy, type, time) {
    const bobY = Math.sin(time * 2) * 1;
    ctx.save();
    ctx.font = "18px sans-serif";
    ctx.textAlign = 'center';
    const icons = { shop: '🛒', inn: '🏨', weapon: '⚔️' };
    ctx.fillText(icons[type] || '?', sx, sy - 24 + bobY);
    ctx.restore();
  }

  function drawExit(ctx, sx, sy, time) {
    const pulse = 0.3 + Math.sin(time * 3) * 0.2;
    ctx.save();
    ctx.fillStyle = `rgba(74,240,192,${pulse})`;
    drawDiamond(ctx, sx, sy, TILE_W, TILE_H);
    ctx.fill();
    ctx.font = "bold 10px 'Inter', sans-serif";
    ctx.textAlign = 'center';
    ctx.fillStyle = '#4af0c0';
    ctx.fillText('EXIT', sx, sy - 8);
    ctx.restore();
  }

  function drawTownEntrance(ctx, sx, sy, time, townId, color) {
    const pulse = 0.5 + Math.sin(time * 2) * 0.2;
    ctx.save();
    ctx.shadowColor = color || '#4af0c0';
    ctx.shadowBlur = 8;
    
    // Gate pillars
    ctx.fillStyle = '#5a5a6e';
    ctx.fillRect(sx - 10, sy - 24, 4, 20);
    ctx.fillRect(sx + 6, sy - 24, 4, 20);
    
    // Arch
    ctx.strokeStyle = color || '#4af0c0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(sx, sy - 24, 10, Math.PI, 0);
    ctx.stroke();
    
    // Label
    const name = INDUSTRIES[townId] ? INDUSTRIES[townId].name.split('/')[0].trim() : townId;
    ctx.font = "bold 9px 'Inter', sans-serif";
    ctx.textAlign = 'center';
    ctx.fillStyle = `rgba(255,255,255,${pulse + 0.3})`;
    ctx.fillText(name, sx, sy - 30);
    
    ctx.restore();
  }

  function drawCampfire(ctx, sx, sy, time) {
    // Fire base
    ctx.fillStyle = '#5a3a1a';
    ctx.beginPath();
    ctx.ellipse(sx, sy, 6, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Flames
    const flicker = Math.sin(time * 8) * 2;
    ctx.fillStyle = '#ff6622';
    ctx.beginPath();
    ctx.moveTo(sx - 4, sy);
    ctx.quadraticCurveTo(sx + flicker, sy - 14, sx + 4, sy);
    ctx.fill();
    ctx.fillStyle = '#ffaa22';
    ctx.beginPath();
    ctx.moveTo(sx - 2, sy);
    ctx.quadraticCurveTo(sx - flicker, sy - 10, sx + 2, sy);
    ctx.fill();
    
    // Glow
    ctx.save();
    ctx.shadowColor = '#ff8822';
    ctx.shadowBlur = 10;
    ctx.fillStyle = 'rgba(255,136,34,0.3)';
    ctx.beginPath();
    ctx.arc(sx, sy - 4, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    
    // Label
    ctx.font = "bold 9px 'Inter', sans-serif";
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffaa44';
    ctx.fillText('Campfire', sx, sy - 18);
  }

  function drawSignpost(ctx, sx, sy, townId) {
    ctx.fillStyle = '#6a4a2a';
    ctx.fillRect(sx - 1, sy - 16, 2, 16);
    ctx.fillStyle = '#8a6a3a';
    ctx.fillRect(sx - 12, sy - 16, 24, 8);
    const name = INDUSTRIES[townId] ? INDUSTRIES[townId].name.split('/')[0].trim().substring(0,10) : '';
    ctx.font = "bold 7px 'Inter', sans-serif";
    ctx.textAlign = 'center';
    ctx.fillStyle = '#2a1a0a';
    ctx.fillText(name, sx, sy - 10);
  }

  // ── Interaction prompt ─────────────────────────────────────────────────

  function drawInteractionPrompt(ctx, sx, sy, time) {
    const bobY = Math.sin(time * 4) * 2;
    ctx.save();
    ctx.font = "bold 12px 'Inter', sans-serif";
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(sx - 24, sy - 45 + bobY, 48, 18);
    ctx.strokeStyle = '#4af0c0';
    ctx.lineWidth = 1;
    ctx.strokeRect(sx - 24, sy - 45 + bobY, 48, 18);
    ctx.fillStyle = '#4af0c0';
    ctx.fillText('Press E', sx, sy - 32 + bobY);
    ctx.restore();
  }

  return {
    TILE_W, TILE_H, WALL_HEIGHT,
    tileToScreen, screenToTile,
    drawDiamond, drawTile,
    renderMap, isBlocked,
    drawNPC, drawGuardian, drawKnowledge, drawShopIcon, drawExit,
    drawTownEntrance, drawCampfire, drawSignpost,
    drawInteractionPrompt
  };
})();
