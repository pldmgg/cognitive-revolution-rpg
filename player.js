/* player.js — Player entity: movement, rendering, interaction detection */
/* eslint-disable no-unused-vars */

const PlayerEntity = (() => {
  let tileX = 15;
  let tileY = 15;
  let renderX = 15;
  let renderY = 15;
  let targetX = 15;
  let targetY = 15;
  let moving = false;
  let moveTimer = 0;
  const MOVE_DURATION = 0.18; // seconds
  let facing = 'down'; // up, down, left, right
  let color = '#4af0c0';
  let stepCount = 0;

  function init(startX, startY, playerColor) {
    tileX = startX;
    tileY = startY;
    renderX = startX;
    renderY = startY;
    targetX = startX;
    targetY = startY;
    moving = false;
    moveTimer = 0;
    color = playerColor || '#4af0c0';
    stepCount = 0;
  }

  function getPosition() { return { x: tileX, y: tileY }; }
  function getRenderPosition() { return { x: renderX, y: renderY }; }
  function getFacing() { return facing; }
  function getStepCount() { return stepCount; }
  function isMoving() { return moving; }

  function setPosition(x, y) {
    tileX = x; tileY = y;
    renderX = x; renderY = y;
    targetX = x; targetY = y;
    moving = false;
  }

  function tryMove(dx, dy, mapData) {
    if (moving) return false;
    
    const newX = tileX + dx;
    const newY = tileY + dy;
    
    // Set facing
    if (dx > 0) facing = 'right';
    else if (dx < 0) facing = 'left';
    else if (dy > 0) facing = 'down';
    else if (dy < 0) facing = 'up';
    
    // Check collision
    if (TileRenderer.isBlocked(mapData, newX, newY)) {
      return false;
    }
    
    // Check if any NPC or guardian is blocking
    if (mapData.objects) {
      for (const obj of mapData.objects) {
        if ((obj.type === 'npc' || obj.type === 'guardian') && 
            Math.floor(obj.x) === Math.floor(newX) && Math.floor(obj.y) === Math.floor(newY)) {
          return false;
        }
      }
    }
    
    targetX = newX;
    targetY = newY;
    moving = true;
    moveTimer = 0;
    stepCount++;
    return true;
  }

  function update(dt) {
    if (!moving) return;
    
    moveTimer += dt;
    const t = Math.min(1, moveTimer / MOVE_DURATION);
    
    // Ease out quad
    const ease = t * (2 - t);
    
    renderX = tileX + (targetX - tileX) * ease;
    renderY = tileY + (targetY - tileY) * ease;
    
    if (t >= 1) {
      tileX = targetX;
      tileY = targetY;
      renderX = tileX;
      renderY = tileY;
      moving = false;
      moveTimer = 0;
    }
  }

  function draw(ctx, camX, camY, canvasW, canvasH, time) {
    const screen = TileRenderer.tileToScreen(renderX, renderY, camX, camY, canvasW, canvasH);
    const sx = screen.x;
    const sy = screen.y;
    const bobY = moving ? Math.sin(time * 12) * 1.5 : 0;
    
    // Glow ring under player
    ctx.save();
    ctx.shadowColor = color;
    ctx.shadowBlur = 12;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(sx, sy + 2, 10, 5, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
    
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.beginPath();
    ctx.ellipse(sx, sy + 2, 10, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Legs
    ctx.fillStyle = '#2a2a4a';
    const legSpread = moving ? Math.sin(time * 10) * 3 : 0;
    ctx.fillRect(sx - 5 - legSpread, sy - 8 + bobY, 4, 10);
    ctx.fillRect(sx + 1 + legSpread, sy - 8 + bobY, 4, 10);
    
    // Body
    ctx.fillStyle = color;
    ctx.fillRect(sx - 8, sy - 24 + bobY, 16, 18);
    
    // Body accent
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.fillRect(sx - 8, sy - 24 + bobY, 16, 5);
    
    // Belt
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(sx - 8, sy - 10 + bobY, 16, 2);
    
    // Arms
    ctx.fillStyle = color;
    const armSwing = moving ? Math.sin(time * 10) * 4 : 0;
    ctx.fillRect(sx - 12, sy - 22 + bobY + armSwing, 4, 14);
    ctx.fillRect(sx + 8, sy - 22 + bobY - armSwing, 4, 14);
    
    // Head
    ctx.fillStyle = '#e8c8a0';
    ctx.beginPath();
    ctx.arc(sx, sy - 30 + bobY, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Hair
    ctx.fillStyle = '#3a2a1a';
    ctx.beginPath();
    ctx.arc(sx, sy - 32 + bobY, 8, Math.PI * 1.1, Math.PI * 1.9);
    ctx.fill();
    
    // Eyes (based on facing)
    ctx.fillStyle = '#222';
    if (facing === 'left') {
      ctx.fillRect(sx - 5, sy - 31 + bobY, 2, 2);
    } else if (facing === 'right') {
      ctx.fillRect(sx + 3, sy - 31 + bobY, 2, 2);
    } else {
      ctx.fillRect(sx - 3, sy - 31 + bobY, 2, 2);
      ctx.fillRect(sx + 2, sy - 31 + bobY, 2, 2);
    }
    
    // Direction indicator glow (arrow above head)
    ctx.save();
    ctx.shadowColor = color;
    ctx.shadowBlur = 8;
    ctx.fillStyle = color;
    const arrowY = sy - 42 + bobY + Math.sin(time * 3) * 2;
    ctx.beginPath();
    ctx.moveTo(sx, arrowY - 4);
    ctx.lineTo(sx + 4, arrowY + 2);
    ctx.lineTo(sx - 4, arrowY + 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Get the tile the player is facing toward
  function getFacingTile() {
    switch (facing) {
      case 'up': return { x: tileX, y: tileY - 1 };
      case 'down': return { x: tileX, y: tileY + 1 };
      case 'left': return { x: tileX - 1, y: tileY };
      case 'right': return { x: tileX + 1, y: tileY };
    }
    return { x: tileX, y: tileY + 1 };
  }

  // Check what interactable object is at the facing tile
  function getInteractable(mapData) {
    const ft = getFacingTile();
    if (!mapData.objects) return null;
    
    for (const obj of mapData.objects) {
      if (Math.floor(obj.x) === Math.floor(ft.x) && Math.floor(obj.y) === Math.floor(ft.y)) {
        return obj;
      }
    }
    return null;
  }

  // Check what object is at the player's current tile
  function getObjectAtPosition(mapData) {
    if (!mapData.objects) return null;
    for (const obj of mapData.objects) {
      if (Math.floor(obj.x) === Math.floor(tileX) && Math.floor(obj.y) === Math.floor(tileY)) {
        return obj;
      }
    }
    return null;
  }

  // Check if there's an interactable adjacent to the player
  function getAdjacentInteractable(mapData) {
    if (!mapData.objects) return null;
    const directions = [
      { x: tileX, y: tileY - 1 },
      { x: tileX, y: tileY + 1 },
      { x: tileX - 1, y: tileY },
      { x: tileX + 1, y: tileY }
    ];
    
    for (const dir of directions) {
      for (const obj of mapData.objects) {
        if (Math.floor(obj.x) === Math.floor(dir.x) && Math.floor(obj.y) === Math.floor(dir.y)) {
          return obj;
        }
      }
    }
    return null;
  }

  return {
    init, getPosition, getRenderPosition, getFacing, getStepCount, isMoving,
    setPosition, tryMove, update, draw,
    getFacingTile, getInteractable, getObjectAtPosition, getAdjacentInteractable
  };
})();
