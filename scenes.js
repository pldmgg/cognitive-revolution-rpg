/* scenes.js — All game scenes */
/* eslint-disable no-unused-vars */

// ════════════════════════════════════════════════════════════════════════════
// TITLE SCENE
// ════════════════════════════════════════════════════════════════════════════
const TitleScene = (() => {
  let titleImg = null;
  let hoverStart = false;
  let blinkTimer = 0;

  function enter() {
    titleImg = document.getElementById('img-title');
  }

  function exit() {}

  function update(dt, time) {
    blinkTimer += dt;
    if (Engine.wasKeyPressed('Enter') || Engine.wasKeyPressed('Space') || Engine.wasMouseClicked()) {
      const mp = Engine.getMousePos();
      const cw = Engine.canvasW, ch = Engine.canvasH;
      const btnX = cw/2 - 100, btnY = ch * 0.62, btnW = 200, btnH = 48;
      if (Engine.wasKeyPressed('Enter') || Engine.wasKeyPressed('Space') || 
          UI.pointInRect(mp.x, mp.y, btnX, btnY, btnW, btnH)) {
        AudioManager.init();
        AudioManager.resume();
        AudioManager.uiClick();
        UI.startFade(1, 0.04, () => {
          Engine.replaceScene('charselect');
          UI.startFade(0, 0.04);
        });
      }
    }
  }

  function render(ctx, cw, ch, time) {
    // Background
    if (titleImg && titleImg.complete && titleImg.naturalWidth) {
      UI.drawImageCover(ctx, titleImg, cw, ch);
      // Dark overlay
      ctx.fillStyle = 'rgba(10,14,26,0.65)';
      ctx.fillRect(0, 0, cw, ch);
    } else {
      ctx.fillStyle = '#0a0e1a';
      ctx.fillRect(0, 0, cw, ch);
    }

    // Vignette
    const vig = ctx.createRadialGradient(cw/2, ch/2, ch*0.2, cw/2, ch/2, ch*0.8);
    vig.addColorStop(0, 'rgba(0,0,0,0)');
    vig.addColorStop(1, 'rgba(0,0,0,0.5)');
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, cw, ch);

    // Title
    UI.drawText(ctx, 'COGNITIVE', cw / 2, ch * 0.28, {
      size: 56, weight: '700', font: 'display', color: '#4af0c0',
      align: 'center', baseline: 'middle'
    });
    UI.drawText(ctx, 'REVOLUTION', cw / 2, ch * 0.36, {
      size: 56, weight: '700', font: 'display', color: '#e8e8ec',
      align: 'center', baseline: 'middle'
    });
    
    // Subtitle
    UI.drawText(ctx, 'The AI Transformation Journey', cw / 2, ch * 0.43, {
      size: 18, weight: '400', color: '#8888a0',
      align: 'center', baseline: 'middle'
    });

    // Start button
    const btnX = cw/2 - 100, btnY = ch * 0.62, btnW = 200, btnH = 48;
    const mp = Engine.getMousePos();
    const hover = UI.pointInRect(mp.x, mp.y, btnX, btnY, btnW, btnH);
    UI.drawButton(ctx, btnX, btnY, btnW, btnH, 'New Game', { hover, fontSize: 18 });

    // Controls hint
    const alpha = 0.4 + Math.sin(time * 2) * 0.2;
    UI.drawText(ctx, 'Arrow Keys = Move  |  E/Space = Interact  |  I = Inventory', cw / 2, ch * 0.82, {
      size: 13, color: `rgba(136,136,160,${alpha})`, align: 'center', baseline: 'middle'
    });

    // Version
    UI.drawText(ctx, 'v2.0 — Octopath Style', cw / 2, ch * 0.92, {
      size: 11, color: '#555', align: 'center', baseline: 'middle'
    });
  }

  return { enter, exit, update, render };
})();

// ════════════════════════════════════════════════════════════════════════════
// CHARACTER SELECT SCENE
// ════════════════════════════════════════════════════════════════════════════
const CharacterSelectScene = (() => {
  let selectedKey = null;
  let hoverKey = null;
  let scrollY = 0;

  function enter() {
    selectedKey = null;
    hoverKey = null;
    scrollY = 0;
  }
  function exit() {}

  function update(dt, time) {
    const mp = Engine.getMousePos();
    hoverKey = null;

    const keys = Object.keys(CHARACTER_DATA);
    const cw = Engine.canvasW, ch = Engine.canvasH;
    const cols = 7;
    const cardW = 155, cardH = 190, gap = 10;
    const totalW = cols * (cardW + gap) - gap;
    const startX = (cw - totalW) / 2;
    const startY = 80;

    keys.forEach((key, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const cx = startX + col * (cardW + gap);
      const cy = startY + row * (cardH + gap) - scrollY;
      if (UI.pointInRect(mp.x, mp.y, cx, cy, cardW, cardH)) {
        hoverKey = key;
      }
    });

    if (Engine.wasMouseClicked()) {
      if (hoverKey) {
        selectedKey = hoverKey;
        AudioManager.uiClick();
      }
      // Check Start button
      if (selectedKey) {
        const btnX = cw/2 - 100, btnY = ch - 70, btnW = 200, btnH = 44;
        if (UI.pointInRect(mp.x, mp.y, btnX, btnY, btnW, btnH)) {
          startGame(selectedKey);
        }
      }
    }

    if (Engine.wasKeyPressed('Enter') && selectedKey) {
      startGame(selectedKey);
    }
  }

  function startGame(industryKey) {
    AudioManager.mapTravel();
    const player = createNewPlayer(industryKey);
    Engine.setPlayer(player);
    
    UI.startFade(1, 0.04, () => {
      const townMap = getTownMap(industryKey);
      Engine.setCurrentMap(townMap);
      
      // Find a good starting position (center of town)
      PlayerEntity.init(15, 16, player.color);
      Engine.setCameraImmediate(15, 16);
      
      Engine.replaceScene('town', { townId: industryKey });
      UI.startFade(0, 0.03);
    });
  }

  function render(ctx, cw, ch, time) {
    ctx.fillStyle = '#0a0e1a';
    ctx.fillRect(0, 0, cw, ch);

    // Title
    UI.drawText(ctx, 'Choose Your Character', cw / 2, 36, {
      size: 32, weight: '700', font: 'display', color: '#4af0c0',
      align: 'center', baseline: 'middle'
    });

    const keys = Object.keys(CHARACTER_DATA);
    const cols = 7;
    const cardW = 155, cardH = 190, gap = 10;
    const totalW = cols * (cardW + gap) - gap;
    const startX = (cw - totalW) / 2;
    const startY = 70;

    keys.forEach((key, i) => {
      const char = CHARACTER_DATA[key];
      const ind = INDUSTRIES[key];
      const col = i % cols;
      const row = Math.floor(i / cols);
      const cx = startX + col * (cardW + gap);
      const cy = startY + row * (cardH + gap);
      const isSelected = selectedKey === key;
      const isHover = hoverKey === key;

      // Card background
      UI.drawPanel(ctx, cx, cy, cardW, cardH, {
        bg: isSelected ? 'rgba(74,240,192,0.15)' : isHover ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
        border: isSelected ? char.color : isHover ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)',
        borderWidth: isSelected ? 2 : 1,
        glow: isSelected ? char.color : null
      });

      // Portrait circle
      ctx.save();
      ctx.fillStyle = char.color;
      ctx.globalAlpha = 0.3;
      ctx.beginPath();
      ctx.arc(cx + cardW/2, cy + 30, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      // Character silhouette
      ctx.fillStyle = char.color;
      ctx.fillRect(cx + cardW/2 - 6, cy + 18, 12, 16);
      ctx.fillStyle = '#e8c8a0';
      ctx.beginPath();
      ctx.arc(cx + cardW/2, cy + 15, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Name
      UI.drawText(ctx, char.name, cx + cardW/2, cy + 56, {
        size: 12, weight: '700', color: '#fff', align: 'center'
      });
      // Title
      UI.drawText(ctx, char.title, cx + cardW/2, cy + 70, {
        size: 10, weight: '500', color: char.color, align: 'center'
      });
      // Town
      UI.drawText(ctx, ind ? ind.name.split('/')[0].trim() : key, cx + cardW/2, cy + 84, {
        size: 9, weight: '400', color: '#8888a0', align: 'center'
      });

      // Stats
      const s = char.stats;
      const statY = cy + 100;
      const statLabels = ['HP','MP','ATK','DEF','SPD','INT'];
      const statValues = [s.hp, s.mp, s.atk, s.def, s.spd, s.int];
      statLabels.forEach((label, si) => {
        const sy = statY + si * 13;
        UI.drawText(ctx, label, cx + 10, sy, { size: 9, weight: '600', color: '#8888a0' });
        UI.drawText(ctx, '' + statValues[si], cx + cardW - 10, sy, { size: 9, weight: '600', color: '#e8e8ec', align: 'right' });
        // Mini bar
        const maxVal = label === 'HP' ? 120 : label === 'MP' ? 70 : 16;
        const pct = Math.min(1, statValues[si] / maxVal);
        ctx.fillStyle = 'rgba(255,255,255,0.06)';
        ctx.fillRect(cx + 36, sy + 2, 80, 5);
        ctx.fillStyle = char.color;
        ctx.fillRect(cx + 36, sy + 2, 80 * pct, 5);
      });
    });

    // Start button
    if (selectedKey) {
      const btnX = cw/2 - 100, btnY = ch - 70, btnW = 200, btnH = 44;
      const mp = Engine.getMousePos();
      const hover = UI.pointInRect(mp.x, mp.y, btnX, btnY, btnW, btnH);
      UI.drawButton(ctx, btnX, btnY, btnW, btnH, 'Start Journey', { hover, fontSize: 16 });
      
      const char = CHARACTER_DATA[selectedKey];
      UI.drawText(ctx, `Playing as ${char.name} — ${char.title}`, cw/2, ch - 28, {
        size: 13, color: char.color, align: 'center'
      });
    } else {
      UI.drawText(ctx, 'Click a character to select', cw / 2, ch - 40, {
        size: 14, color: '#8888a0', align: 'center'
      });
    }
  }

  return { enter, exit, update, render };
})();

// ════════════════════════════════════════════════════════════════════════════
// TOWN SCENE
// ════════════════════════════════════════════════════════════════════════════
const TownScene = (() => {
  let townId = '';
  let mapData = null;
  let moveDelay = 0;
  const MOVE_REPEAT_DELAY = 0.12;

  function enter(data) {
    townId = (data && data.townId) || 'it-services';
    mapData = getTownMap(townId);
    Engine.setCurrentMap(mapData);
    moveDelay = 0;
    
    if (data && data.playerX !== undefined) {
      PlayerEntity.setPosition(data.playerX, data.playerY);
      Engine.setCameraImmediate(data.playerX, data.playerY);
    }
  }

  function exit() {}

  function update(dt, time) {
    if (UI.isFading()) return;
    
    moveDelay -= dt;
    PlayerEntity.update(dt);
    
    const player = Engine.getPlayer();
    const pos = PlayerEntity.getRenderPosition();
    Engine.setCameraTarget(pos.x, pos.y);

    // Movement
    if (!PlayerEntity.isMoving() && moveDelay <= 0) {
      let moved = false;
      if (Engine.isKeyDown('ArrowUp') || Engine.isKeyDown('KeyW')) {
        moved = PlayerEntity.tryMove(0, -1, mapData);
      } else if (Engine.isKeyDown('ArrowDown') || Engine.isKeyDown('KeyS')) {
        moved = PlayerEntity.tryMove(0, 1, mapData);
      } else if (Engine.isKeyDown('ArrowLeft') || Engine.isKeyDown('KeyA')) {
        moved = PlayerEntity.tryMove(-1, 0, mapData);
      } else if (Engine.isKeyDown('ArrowRight') || Engine.isKeyDown('KeyD')) {
        moved = PlayerEntity.tryMove(1, 0, mapData);
      }
      if (moved) moveDelay = MOVE_REPEAT_DELAY;
    }

    // Check step-on triggers
    if (!PlayerEntity.isMoving()) {
      const atObj = PlayerEntity.getObjectAtPosition(mapData);
      if (atObj && atObj.type === 'exit') {
        handleExit(player);
      }
    }

    // Interaction
    if (Engine.wasKeyPressed('KeyE') || Engine.wasKeyPressed('Space')) {
      const interactable = PlayerEntity.getInteractable(mapData);
      if (interactable) handleInteraction(interactable, player);
    }

    // Inventory
    if (Engine.wasKeyPressed('KeyI')) {
      Engine.pushScene('inventory');
    }
    
    // Escape
    if (Engine.wasKeyPressed('Escape')) {
      // Nothing to do at top level
    }
  }

  function handleExit(player) {
    AudioManager.mapTravel();
    UI.startFade(1, 0.04, () => {
      // Find this town's position on overworld
      const owMap = OVERWORLD_MAP;
      const townPos = owMap.townPositions[townId];
      const px = townPos ? townPos.x : 40;
      const py = townPos ? townPos.y + 1 : 30;
      
      player.currentMap = 'overworld';
      Engine.setCurrentMap(owMap);
      PlayerEntity.setPosition(px, py);
      Engine.setCameraImmediate(px, py);
      Engine.replaceScene('overworld');
      UI.startFade(0, 0.03);
    });
  }

  function handleInteraction(obj, player) {
    switch (obj.type) {
      case 'npc': {
        AudioManager.uiClick();
        const dialogue = obj.npcData ? obj.npcData.dialogue : ['...'];
        const name = obj.npcData ? obj.npcData.name : obj.id;
        const color = obj.npcData ? obj.npcData.color : '#aaa';
        Engine.pushScene('dialog', { name, dialogue, color });
        break;
      }
      case 'guardian': {
        AudioManager.uiClick();
        const ind = INDUSTRIES[obj.industryKey];
        if (!ind) break;
        // Check if all insights for this town are read
        const allRead = ind.insights.every(ins => player.insightsRead.includes(ins.id));
        if (allRead && !player.cognitiveFragments.includes(obj.industryKey)) {
          player.cognitiveFragments.push(obj.industryKey);
          if (!player.completedTowns.includes(obj.industryKey)) {
            player.completedTowns.push(obj.industryKey);
          }
          unlockAdjacentTowns(player, obj.industryKey);
          AudioManager.fragmentCollect();
          Engine.pushScene('dialog', {
            name: 'Town Guardian', 
            dialogue: [...ind.guardianDialogue, '** Cognitive Fragment Acquired! **'],
            color: '#FFD700'
          });
        } else if (allRead) {
          Engine.pushScene('dialog', { 
            name: 'Town Guardian', 
            dialogue: ['You already carry this town\'s fragment. Safe travels!'],
            color: '#FFD700'
          });
        } else {
          const remaining = ind.insights.filter(ins => !player.insightsRead.includes(ins.id)).length;
          Engine.pushScene('dialog', { 
            name: 'Town Guardian', 
            dialogue: [`You still need to read ${remaining} more insight(s) in this town.`, 'Visit the Knowledge Archive to the south.'],
            color: '#FFD700'
          });
        }
        break;
      }
      case 'knowledge': {
        AudioManager.insightRead();
        const insight = findInsight(obj.insightId);
        if (insight && !player.insightsRead.includes(obj.insightId)) {
          Engine.pushScene('insight', { insight, player });
        } else {
          Engine.pushScene('dialog', {
            name: 'Knowledge Point',
            dialogue: ['You have already absorbed this insight.'],
            color: '#4af0c0'
          });
        }
        break;
      }
      case 'shop': {
        AudioManager.uiClick();
        Engine.pushScene('shop', { items: SHOP_GENERAL, title: 'General Store' });
        break;
      }
      case 'weapon': {
        AudioManager.uiClick();
        Engine.pushScene('shop', { items: SHOP_WEAPON, title: 'Weapon Shop' });
        break;
      }
      case 'inn': {
        AudioManager.uiClick();
        if (player.gold >= 100) {
          player.gold -= 100;
          player.hp = player.maxHp;
          player.mp = player.maxMp;
          AudioManager.heal();
          Engine.pushScene('dialog', {
            name: 'Innkeeper',
            dialogue: ['Welcome! Rest well... (-100g)', 'HP and MP fully restored!'],
            color: '#F59E0B'
          });
        } else {
          Engine.pushScene('dialog', {
            name: 'Innkeeper',
            dialogue: ['Rest costs 100 gold. You don\'t have enough...'],
            color: '#F59E0B'
          });
        }
        break;
      }
    }
  }

  function findInsight(insightId) {
    for (const ind of Object.values(INDUSTRIES)) {
      const ins = ind.insights.find(i => i.id === insightId);
      if (ins) return ins;
    }
    return null;
  }

  function render(ctx, cw, ch, time) {
    const cam = Engine.getCameraPos();
    const player = Engine.getPlayer();
    const ind = INDUSTRIES[townId];
    const industryColor = ind ? ind.color : '#4af0c0';

    // Render tilemap
    TileRenderer.renderMap(ctx, mapData, cam.x, cam.y, cw, ch, time, industryColor);

    // Render objects (sorted by Y for depth)
    const sortedObjects = [...(mapData.objects || [])].sort((a, b) => a.y - b.y);
    const playerPos = PlayerEntity.getRenderPosition();
    let playerDrawn = false;

    sortedObjects.forEach(obj => {
      // Draw player at correct depth
      if (!playerDrawn && playerPos.y <= obj.y) {
        PlayerEntity.draw(ctx, cam.x, cam.y, cw, ch, time);
        playerDrawn = true;
      }

      const screen = TileRenderer.tileToScreen(obj.x, obj.y, cam.x, cam.y, cw, ch);
      if (screen.x < -100 || screen.x > cw + 100 || screen.y < -100 || screen.y > ch + 100) return;

      switch (obj.type) {
        case 'npc':
          TileRenderer.drawNPC(ctx, screen.x, screen.y, obj, time);
          break;
        case 'guardian':
          TileRenderer.drawGuardian(ctx, screen.x, screen.y, time, industryColor);
          break;
        case 'knowledge':
          TileRenderer.drawKnowledge(ctx, screen.x, screen.y, time, player && player.insightsRead.includes(obj.insightId));
          break;
        case 'shop': case 'inn': case 'weapon':
          TileRenderer.drawShopIcon(ctx, screen.x, screen.y, obj.type, time);
          break;
        case 'exit':
          TileRenderer.drawExit(ctx, screen.x, screen.y, time);
          break;
      }
    });

    if (!playerDrawn) {
      PlayerEntity.draw(ctx, cam.x, cam.y, cw, ch, time);
    }

    // Interaction prompt
    const interactable = PlayerEntity.getInteractable(mapData);
    if (interactable) {
      const screen = TileRenderer.tileToScreen(interactable.x, interactable.y, cam.x, cam.y, cw, ch);
      TileRenderer.drawInteractionPrompt(ctx, screen.x, screen.y, time);
    }

    // HUD
    drawHUD(ctx, cw, ch, player, ind ? ind.name : townId, time);
  }

  return { enter, exit, update, render };
})();

// ════════════════════════════════════════════════════════════════════════════
// OVERWORLD SCENE
// ════════════════════════════════════════════════════════════════════════════
const OverworldScene = (() => {
  let mapData = null;
  let moveDelay = 0;
  const MOVE_REPEAT_DELAY = 0.15;
  let encounterCooldown = 0;
  let showAlert = false;
  let alertTimer = 0;

  function enter() {
    mapData = OVERWORLD_MAP;
    Engine.setCurrentMap(mapData);
    moveDelay = 0;
    encounterCooldown = 3; // grace period
  }

  function exit() {}

  function update(dt, time) {
    if (UI.isFading()) return;
    
    if (showAlert) {
      alertTimer -= dt;
      if (alertTimer <= 0) {
        showAlert = false;
        triggerEncounter();
      }
      return;
    }
    
    moveDelay -= dt;
    encounterCooldown -= dt;
    PlayerEntity.update(dt);

    const player = Engine.getPlayer();
    const pos = PlayerEntity.getRenderPosition();
    Engine.setCameraTarget(pos.x, pos.y);

    // Movement
    if (!PlayerEntity.isMoving() && moveDelay <= 0) {
      let moved = false;
      if (Engine.isKeyDown('ArrowUp') || Engine.isKeyDown('KeyW')) {
        moved = PlayerEntity.tryMove(0, -1, mapData);
      } else if (Engine.isKeyDown('ArrowDown') || Engine.isKeyDown('KeyS')) {
        moved = PlayerEntity.tryMove(0, 1, mapData);
      } else if (Engine.isKeyDown('ArrowLeft') || Engine.isKeyDown('KeyA')) {
        moved = PlayerEntity.tryMove(-1, 0, mapData);
      } else if (Engine.isKeyDown('ArrowRight') || Engine.isKeyDown('KeyD')) {
        moved = PlayerEntity.tryMove(1, 0, mapData);
      }
      if (moved) {
        moveDelay = MOVE_REPEAT_DELAY;
      }
    }

    // Check step-on triggers
    if (!PlayerEntity.isMoving()) {
      const pPos = PlayerEntity.getPosition();
      
      // Town entrance
      const atObj = PlayerEntity.getObjectAtPosition(mapData);
      if (atObj && atObj.type === 'town-entrance') {
        if (Engine.wasKeyPressed('KeyE') || Engine.wasKeyPressed('Space')) {
          enterTown(atObj.townId, player);
        }
      }
      
      // Campfire
      if (atObj && atObj.type === 'campfire') {
        if (Engine.wasKeyPressed('KeyE') || Engine.wasKeyPressed('Space')) {
          player.hp = player.maxHp;
          player.mp = player.maxMp;
          AudioManager.heal();
          Engine.pushScene('dialog', {
            name: 'Campfire',
            dialogue: ['You rest by the warm campfire...', 'HP and MP fully restored!'],
            color: '#ffaa44'
          });
        }
      }

      // Signpost
      if (atObj && atObj.type === 'signpost') {
        // Just show prompt, handled by E key
      }
      
      // Random encounter check
      if (encounterCooldown <= 0) {
        const tileType = mapData.tiles[Math.floor(pPos.y)] && mapData.tiles[Math.floor(pPos.y)][Math.floor(pPos.x)];
        const rate = getEncounterRate(tileType || TILE.GRASS);
        if (rate > 0 && Math.random() < rate) {
          showAlert = true;
          alertTimer = 0.6;
          AudioManager.enemyAppear();
          encounterCooldown = 5;
        }
      }
    }

    // Interaction
    if (Engine.wasKeyPressed('KeyE') || Engine.wasKeyPressed('Space')) {
      const interactable = PlayerEntity.getInteractable(mapData);
      if (interactable) {
        if (interactable.type === 'town-entrance') {
          enterTown(interactable.townId, player);
        } else if (interactable.type === 'campfire') {
          player.hp = player.maxHp;
          player.mp = player.maxMp;
          AudioManager.heal();
          Engine.pushScene('dialog', {
            name: 'Campfire',
            dialogue: ['You rest by the warm campfire...', 'HP and MP fully restored!'],
            color: '#ffaa44'
          });
        } else if (interactable.type === 'signpost') {
          const name = INDUSTRIES[interactable.townId] ? INDUSTRIES[interactable.townId].name : interactable.townId;
          Engine.pushScene('dialog', {
            name: 'Signpost',
            dialogue: [`→ ${name}`],
            color: '#8a6a3a'
          });
        }
      }
    }

    // Inventory
    if (Engine.wasKeyPressed('KeyI')) {
      Engine.pushScene('inventory');
    }
  }

  function enterTown(tId, player) {
    AudioManager.mapTravel();
    UI.startFade(1, 0.04, () => {
      player.currentTown = tId;
      player.currentMap = 'town';
      if (!player.unlockedTowns.includes(tId)) player.unlockedTowns.push(tId);
      const townMap = getTownMap(tId);
      Engine.setCurrentMap(townMap);
      PlayerEntity.setPosition(15, 27);
      Engine.setCameraImmediate(15, 27);
      Engine.replaceScene('town', { townId: tId, playerX: 15, playerY: 27 });
      UI.startFade(0, 0.03);
    });
  }

  function triggerEncounter() {
    const player = Engine.getPlayer();
    const pPos = PlayerEntity.getPosition();
    
    // Determine region based on nearest town
    let nearestTown = 'it-services';
    let nearestDist = Infinity;
    for (const [key, pos] of Object.entries(mapData.townPositions)) {
      const d = Math.abs(pos.x - pPos.x) + Math.abs(pos.y - pPos.y);
      if (d < nearestDist) { nearestDist = d; nearestTown = key; }
    }
    
    const region = getRegionForTown(nearestTown);
    const enemyPool = getEnemiesForRegion(region);
    const enemyId = enemyPool[Math.floor(Math.random() * enemyPool.length)];
    const enemy = ENEMIES[enemyId];
    
    UI.startFade(1, 0.06, () => {
      Engine.pushScene('combat', {
        enemy: enemy,
        region: region,
        isBoss: false
      });
      UI.startFade(0, 0.04);
    });
  }

  function render(ctx, cw, ch, time) {
    const cam = Engine.getCameraPos();
    const player = Engine.getPlayer();

    TileRenderer.renderMap(ctx, mapData, cam.x, cam.y, cw, ch, time);

    // Render objects sorted by Y
    const sortedObjects = [...(mapData.objects || [])].sort((a, b) => a.y - b.y);
    const playerPos = PlayerEntity.getRenderPosition();
    let playerDrawn = false;

    sortedObjects.forEach(obj => {
      if (!playerDrawn && playerPos.y <= obj.y) {
        PlayerEntity.draw(ctx, cam.x, cam.y, cw, ch, time);
        playerDrawn = true;
      }

      const screen = TileRenderer.tileToScreen(obj.x, obj.y, cam.x, cam.y, cw, ch);
      if (screen.x < -100 || screen.x > cw + 100 || screen.y < -100 || screen.y > ch + 100) return;

      switch (obj.type) {
        case 'town-entrance':
          TileRenderer.drawTownEntrance(ctx, screen.x, screen.y, time, obj.townId, 
            INDUSTRIES[obj.townId] ? INDUSTRIES[obj.townId].color : '#4af0c0');
          break;
        case 'campfire':
          TileRenderer.drawCampfire(ctx, screen.x, screen.y, time);
          break;
        case 'signpost':
          TileRenderer.drawSignpost(ctx, screen.x, screen.y, obj.townId);
          break;
      }
    });

    if (!playerDrawn) {
      PlayerEntity.draw(ctx, cam.x, cam.y, cw, ch, time);
    }

    // Interaction prompt
    const interactable = PlayerEntity.getInteractable(mapData) || PlayerEntity.getObjectAtPosition(mapData);
    if (interactable && (interactable.type === 'town-entrance' || interactable.type === 'campfire' || interactable.type === 'signpost')) {
      const screen = TileRenderer.tileToScreen(interactable.x, interactable.y, cam.x, cam.y, cw, ch);
      TileRenderer.drawInteractionPrompt(ctx, screen.x, screen.y, time);
    }

    // Encounter alert
    if (showAlert) {
      ctx.save();
      ctx.font = "bold 72px 'Cormorant Garamond', serif";
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ff4466';
      ctx.shadowColor = '#ff4466';
      ctx.shadowBlur = 20;
      ctx.fillText('!', cw/2, ch/2);
      ctx.restore();
    }

    // HUD
    drawHUD(ctx, cw, ch, player, 'Overworld', time);

    // Minimap
    drawMinimap(ctx, cw, ch, mapData, player);
  }

  return { enter, exit, update, render };
})();

// ════════════════════════════════════════════════════════════════════════════
// COMBAT SCENE
// ════════════════════════════════════════════════════════════════════════════
const CombatScene = (() => {
  let combatState = null;
  let enemyData = null;
  let region = 'digital';
  let isBoss = false;
  let bgImg = null;
  let phase = 'choose'; // choose, player-anim, enemy-turn, enemy-anim, result
  let animTimer = 0;
  let selectedAction = 0;
  let selectedAbility = -1;
  let selectedItem = -1;
  let showAbilities = false;
  let showItems = false;
  let floatingTexts = null;
  let particles = null;
  let resultTimer = 0;

  function enter(data) {
    enemyData = data.enemy;
    region = data.region || 'digital';
    isBoss = data.isBoss || false;
    
    const player = Engine.getPlayer();
    combatState = CombatEngine.createCombatState(player, enemyData, isBoss);
    
    const bgId = getBattleBgForRegion(region);
    bgImg = document.getElementById(bgId);
    
    phase = 'choose';
    selectedAction = 0;
    showAbilities = false;
    showItems = false;
    floatingTexts = new UI.FloatingTextManager();
    particles = new UI.ParticleSystem();
    resultTimer = 0;
  }

  function exit() {}

  function update(dt, time) {
    if (UI.isFading()) return;
    
    floatingTexts.update();
    particles.update();
    
    if (combatState.shakeTimer > 0) combatState.shakeTimer -= dt;

    switch (phase) {
      case 'choose': updateChoose(dt); break;
      case 'player-anim': updatePlayerAnim(dt); break;
      case 'enemy-turn': updateEnemyTurn(dt); break;
      case 'enemy-anim': updateEnemyAnim(dt); break;
      case 'result': updateResult(dt); break;
    }
  }

  function updateChoose(dt) {
    const player = Engine.getPlayer();
    const actions = ['Attack', 'Defend', 'Ability', 'Item'];

    if (showAbilities) {
      if (Engine.wasKeyPressed('Escape')) { showAbilities = false; return; }
      if (Engine.wasKeyPressed('ArrowUp')) selectedAbility = Math.max(0, selectedAbility - 1);
      if (Engine.wasKeyPressed('ArrowDown')) selectedAbility = Math.min(player.abilities.length - 1, selectedAbility + 1);
      if (Engine.wasKeyPressed('Enter') || Engine.wasKeyPressed('Space')) {
        if (player.abilities[selectedAbility]) {
          const success = CombatEngine.doAbility(combatState, player.abilities[selectedAbility], player, floatingTexts);
          if (success) { showAbilities = false; phase = 'player-anim'; animTimer = 0.5; }
        }
      }
      // Mouse click on abilities
      if (Engine.wasMouseClicked()) {
        const mp = Engine.getMousePos();
        const cw = Engine.canvasW, ch = Engine.canvasH;
        player.abilities.forEach((ab, i) => {
          const by = ch * 0.5 + i * 36;
          if (UI.pointInRect(mp.x, mp.y, cw * 0.35, by, 200, 30)) {
            const success = CombatEngine.doAbility(combatState, ab, player, floatingTexts);
            if (success) { showAbilities = false; phase = 'player-anim'; animTimer = 0.5; }
          }
        });
      }
      return;
    }

    if (showItems) {
      if (Engine.wasKeyPressed('Escape')) { showItems = false; return; }
      const usableItems = player.items.filter(i => i.qty > 0);
      if (Engine.wasKeyPressed('ArrowUp')) selectedItem = Math.max(0, selectedItem - 1);
      if (Engine.wasKeyPressed('ArrowDown')) selectedItem = Math.min(usableItems.length - 1, selectedItem + 1);
      if (Engine.wasKeyPressed('Enter') || Engine.wasKeyPressed('Space')) {
        if (usableItems[selectedItem]) {
          const success = CombatEngine.doItem(combatState, usableItems[selectedItem].id, player);
          if (success) { showItems = false; phase = 'player-anim'; animTimer = 0.5; }
        }
      }
      // Mouse
      if (Engine.wasMouseClicked()) {
        const mp = Engine.getMousePos();
        const cw = Engine.canvasW, ch = Engine.canvasH;
        usableItems.forEach((item, i) => {
          const by = ch * 0.5 + i * 36;
          if (UI.pointInRect(mp.x, mp.y, cw * 0.35, by, 200, 30)) {
            const success = CombatEngine.doItem(combatState, item.id, player);
            if (success) { showItems = false; phase = 'player-anim'; animTimer = 0.5; }
          }
        });
      }
      return;
    }

    if (Engine.wasKeyPressed('ArrowUp')) selectedAction = (selectedAction - 1 + 4) % 4;
    if (Engine.wasKeyPressed('ArrowDown')) selectedAction = (selectedAction + 1) % 4;
    if (Engine.wasKeyPressed('Enter') || Engine.wasKeyPressed('Space')) {
      executeAction(actions[selectedAction], player);
    }

    // Mouse click on action buttons
    if (Engine.wasMouseClicked()) {
      const mp = Engine.getMousePos();
      const cw = Engine.canvasW, ch = Engine.canvasH;
      actions.forEach((action, i) => {
        const bx = cw * 0.05 + (i % 2) * 140;
        const by = ch * 0.72 + Math.floor(i / 2) * 44;
        if (UI.pointInRect(mp.x, mp.y, bx, by, 130, 38)) {
          selectedAction = i;
          executeAction(action, player);
        }
      });
    }
  }

  function executeAction(action, player) {
    switch (action) {
      case 'Attack':
        CombatEngine.doAttack(combatState, floatingTexts);
        phase = 'player-anim';
        animTimer = 0.5;
        break;
      case 'Defend':
        CombatEngine.doDefend(combatState);
        phase = 'player-anim';
        animTimer = 0.4;
        break;
      case 'Ability':
        if (player.abilities.length > 0) {
          showAbilities = true;
          selectedAbility = 0;
        }
        break;
      case 'Item':
        if (player.items.some(i => i.qty > 0)) {
          showItems = true;
          selectedItem = 0;
        }
        break;
    }
  }

  function updatePlayerAnim(dt) {
    animTimer -= dt;
    if (animTimer <= 0) {
      // Check result
      const result = CombatEngine.checkResult(combatState);
      if (result) { phase = 'result'; combatState.result = result; resultTimer = 0; return; }
      phase = 'enemy-turn';
      animTimer = 0.3;
    }
  }

  function updateEnemyTurn(dt) {
    animTimer -= dt;
    if (animTimer <= 0) {
      CombatEngine.doEnemyTurn(combatState, floatingTexts);
      CombatEngine.processHelperAndViral(combatState, floatingTexts);
      CombatEngine.endTurn(combatState);
      phase = 'enemy-anim';
      animTimer = 0.6;
    }
  }

  function updateEnemyAnim(dt) {
    animTimer -= dt;
    if (animTimer <= 0) {
      const result = CombatEngine.checkResult(combatState);
      if (result) { phase = 'result'; combatState.result = result; resultTimer = 0; return; }
      phase = 'choose';
    }
  }

  function updateResult(dt) {
    resultTimer += dt;
    if (resultTimer > 1 && (Engine.wasKeyPressed('Enter') || Engine.wasKeyPressed('Space') || Engine.wasMouseClicked())) {
      const player = Engine.getPlayer();
      
      if (combatState.result === 'victory') {
        AudioManager.victory();
        player.gold += enemyData.goldReward;
        const leveledUp = gainXP(player, enemyData.xpReward);
        
        // Loot
        const loot = CombatEngine.getRandomLoot();
        loot.forEach(itemId => {
          const existing = player.items.find(i => i.id === itemId);
          if (existing) existing.qty++;
          else player.items.push({ id: itemId, qty: 1 });
        });
      } else {
        AudioManager.defeat();
        // Revive with half HP
        player.hp = Math.floor(player.maxHp / 2);
        player.mp = Math.floor(player.maxMp / 2);
      }
      
      // Sync combat state back to player
      if (combatState.result === 'victory') {
        player.hp = combatState.player.hp;
        player.mp = combatState.player.mp;
      }
      
      UI.startFade(1, 0.04, () => {
        Engine.popScene();
        UI.startFade(0, 0.03);
      });
    }
  }

  function render(ctx, cw, ch, time) {
    // Background
    if (bgImg && bgImg.complete && bgImg.naturalWidth) {
      UI.drawImageCover(ctx, bgImg, cw, ch);
      ctx.fillStyle = 'rgba(10,14,26,0.4)';
      ctx.fillRect(0, 0, cw, ch);
    }

    const cs = combatState;
    const shake = cs.shakeTimer > 0 ? (Math.random() - 0.5) * 8 : 0;
    const enemyShake = cs.shakeTarget === 'enemy' && cs.shakeTimer > 0 ? shake : 0;
    const playerShake = cs.shakeTarget === 'player' && cs.shakeTimer > 0 ? shake : 0;

    // Player portrait area
    const ppx = cw * 0.12, ppy = ch * 0.35;
    drawCombatPlayer(ctx, ppx + playerShake, ppy, time);

    // Enemy
    const epx = cw * 0.75, epy = ch * 0.3;
    UI.drawEnemy(ctx, epx + enemyShake, epy, 140, cs.enemy, time);

    // Enemy info
    UI.drawText(ctx, cs.enemy.name, epx, epy - 90, {
      size: 20, weight: '700', font: 'display', color: '#fff', align: 'center'
    });
    UI.drawText(ctx, `Lv. ${cs.enemy.level}`, epx, epy - 70, {
      size: 13, color: '#8888a0', align: 'center'
    });
    UI.drawBar(ctx, epx - 60, epy - 58, 120, 10, cs.enemy.currentHp, cs.enemy.maxHp, '#ff4466', null, 'HP');

    // Player stats panel
    UI.drawPanel(ctx, cw * 0.02, ch * 0.6, 280, 160, { bg: 'rgba(10,14,26,0.85)' });
    const player = Engine.getPlayer();
    UI.drawText(ctx, player.name, cw * 0.04, ch * 0.62, {
      size: 16, weight: '700', color: player.color
    });
    UI.drawText(ctx, `Lv. ${player.level}`, cw * 0.04 + 160, ch * 0.62, {
      size: 13, color: '#8888a0'
    });
    UI.drawBar(ctx, cw * 0.04, ch * 0.66, 240, 12, cs.player.hp, cs.player.maxHp, '#4af0c0', null, 'HP');
    UI.drawBar(ctx, cw * 0.04, ch * 0.70, 240, 12, cs.player.mp, cs.player.maxMp, '#6366f1', null, 'MP');

    // Action buttons
    if (phase === 'choose' && !showAbilities && !showItems) {
      const actions = ['Attack', 'Defend', 'Ability', 'Item'];
      const mp = Engine.getMousePos();
      actions.forEach((action, i) => {
        const bx = cw * 0.05 + (i % 2) * 140;
        const by = ch * 0.76 + Math.floor(i / 2) * 44;
        const hover = UI.pointInRect(mp.x, mp.y, bx, by, 130, 38) || i === selectedAction;
        UI.drawButton(ctx, bx, by, 130, 38, action, { hover, fontSize: 14 });
      });
    }

    // Ability list
    if (showAbilities) {
      UI.drawPanel(ctx, cw * 0.33, ch * 0.45, 240, Math.min(200, player.abilities.length * 36 + 20), { bg: 'rgba(10,14,26,0.92)' });
      player.abilities.forEach((abId, i) => {
        const ab = ABILITIES[abId];
        if (!ab) return;
        const by = ch * 0.48 + i * 36;
        const hover = i === selectedAbility;
        UI.drawText(ctx, ab.name, cw * 0.35, by, {
          size: 13, weight: hover ? '700' : '500', color: hover ? '#4af0c0' : '#e8e8ec'
        });
        UI.drawText(ctx, `${ab.cost} MP`, cw * 0.35 + 180, by, {
          size: 11, color: cs.player.mp >= ab.cost ? '#6366f1' : '#ff4466', align: 'right'
        });
      });
    }

    // Item list
    if (showItems) {
      const usableItems = player.items.filter(i => i.qty > 0);
      UI.drawPanel(ctx, cw * 0.33, ch * 0.45, 240, Math.min(200, usableItems.length * 36 + 20), { bg: 'rgba(10,14,26,0.92)' });
      usableItems.forEach((item, i) => {
        const itemData = ITEMS[item.id];
        if (!itemData) return;
        const by = ch * 0.48 + i * 36;
        const hover = i === selectedItem;
        UI.drawText(ctx, `${itemData.name} x${item.qty}`, cw * 0.35, by, {
          size: 13, weight: hover ? '700' : '500', color: hover ? '#4af0c0' : '#e8e8ec'
        });
      });
    }

    // Combat log
    UI.drawPanel(ctx, cw * 0.55, ch * 0.7, cw * 0.42, ch * 0.26, { bg: 'rgba(10,14,26,0.8)' });
    const logStart = Math.max(0, cs.log.length - 5);
    cs.log.slice(logStart).forEach((msg, i) => {
      UI.drawText(ctx, msg, cw * 0.57, ch * 0.73 + i * 18, {
        size: 12, color: i === cs.log.length - logStart - 1 ? '#e8e8ec' : '#8888a0'
      });
    });

    // Floating texts
    floatingTexts.texts.forEach(t => {
      t.x = t.x || epx;
      t.y = t.y || epy - 40;
    });
    floatingTexts.draw(ctx);
    particles.draw(ctx);

    // Result overlay
    if (phase === 'result') {
      ctx.fillStyle = `rgba(10,14,26,${Math.min(0.7, resultTimer * 0.5)})`;
      ctx.fillRect(0, 0, cw, ch);
      
      if (combatState.result === 'victory') {
        UI.drawText(ctx, 'VICTORY!', cw/2, ch * 0.35, {
          size: 48, weight: '700', font: 'display', color: '#4af0c0', align: 'center'
        });
        UI.drawText(ctx, `+${enemyData.xpReward} XP   +${enemyData.goldReward} Gold`, cw/2, ch * 0.45, {
          size: 18, color: '#e8e8ec', align: 'center'
        });
      } else {
        UI.drawText(ctx, 'DEFEATED', cw/2, ch * 0.35, {
          size: 48, weight: '700', font: 'display', color: '#ff4466', align: 'center'
        });
        UI.drawText(ctx, 'You revive with half HP...', cw/2, ch * 0.45, {
          size: 18, color: '#8888a0', align: 'center'
        });
      }
      
      if (resultTimer > 1) {
        UI.drawText(ctx, 'Press Enter to continue', cw/2, ch * 0.6, {
          size: 14, color: `rgba(136,136,160,${0.5 + Math.sin(Engine.gameTime * 3) * 0.3})`, align: 'center'
        });
      }
    }
  }

  function drawCombatPlayer(ctx, x, y, time) {
    const player = Engine.getPlayer();
    const c = player ? player.color : '#4af0c0';
    const bob = Math.sin(time * 2) * 2;
    
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(x, y + 40, 20, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Body
    ctx.fillStyle = c;
    ctx.fillRect(x - 14, y - 10 + bob, 28, 36);
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.fillRect(x - 14, y - 10 + bob, 28, 8);
    
    // Head
    ctx.fillStyle = '#e8c8a0';
    ctx.beginPath();
    ctx.arc(x, y - 18 + bob, 14, 0, Math.PI * 2);
    ctx.fill();
    
    // Eyes
    ctx.fillStyle = '#333';
    ctx.fillRect(x - 5, y - 20 + bob, 3, 3);
    ctx.fillRect(x + 2, y - 20 + bob, 3, 3);
    
    // Hair
    ctx.fillStyle = '#3a2a1a';
    ctx.beginPath();
    ctx.arc(x, y - 22 + bob, 14, Math.PI * 1.1, Math.PI * 1.9);
    ctx.fill();
    
    // Arms
    ctx.fillStyle = c;
    const armSwing = Math.sin(time * 3) * 3;
    ctx.fillRect(x - 20, y - 4 + bob + armSwing, 6, 20);
    ctx.fillRect(x + 14, y - 4 + bob - armSwing, 6, 20);
    
    // Legs
    ctx.fillStyle = '#2a2a4a';
    ctx.fillRect(x - 8, y + 26 + bob, 6, 14);
    ctx.fillRect(x + 2, y + 26 + bob, 6, 14);
    
    // Glow
    ctx.save();
    ctx.shadowColor = c;
    ctx.shadowBlur = 10;
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(x, y - 34 + bob, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  return { enter, exit, update, render };
})();

// ════════════════════════════════════════════════════════════════════════════
// DIALOG SCENE (overlay)
// ════════════════════════════════════════════════════════════════════════════
const DialogScene = (() => {
  let name = '';
  let dialogue = [];
  let color = '#aaa';
  let currentLine = 0;
  let charIndex = 0;
  let charTimer = 0;
  const CHAR_SPEED = 0.03;
  let fullyRevealed = false;

  function enter(data) {
    name = data.name || '';
    dialogue = data.dialogue || ['...'];
    color = data.color || '#aaa';
    currentLine = 0;
    charIndex = 0;
    charTimer = 0;
    fullyRevealed = false;
  }

  function exit() {}

  function update(dt) {
    if (!fullyRevealed) {
      charTimer += dt;
      while (charTimer >= CHAR_SPEED && charIndex < dialogue[currentLine].length) {
        charIndex++;
        charTimer -= CHAR_SPEED;
        if (charIndex % 3 === 0) AudioManager.textBlip();
      }
      if (charIndex >= dialogue[currentLine].length) fullyRevealed = true;
    }

    if (Engine.wasKeyPressed('Enter') || Engine.wasKeyPressed('Space') || Engine.wasKeyPressed('KeyE') || Engine.wasMouseClicked()) {
      if (!fullyRevealed) {
        charIndex = dialogue[currentLine].length;
        fullyRevealed = true;
      } else {
        currentLine++;
        if (currentLine >= dialogue.length) {
          AudioManager.uiClick();
          Engine.popScene();
          return;
        }
        charIndex = 0;
        charTimer = 0;
        fullyRevealed = false;
      }
    }

    if (Engine.wasKeyPressed('Escape')) {
      Engine.popScene();
    }
  }

  function render(ctx, cw, ch, time) {
    // Draw underlying scene
    const stack = Engine.currentScene();
    
    // Semi-transparent overlay
    ctx.fillStyle = 'rgba(10,14,26,0.3)';
    ctx.fillRect(0, 0, cw, ch);

    // Dialog box
    const boxW = Math.min(700, cw * 0.8);
    const boxH = 140;
    const boxX = (cw - boxW) / 2;
    const boxY = ch - boxH - 40;

    UI.drawPanel(ctx, boxX, boxY, boxW, boxH, { bg: 'rgba(10,14,26,0.92)', glow: color });

    // Portrait circle
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(boxX + 40, boxY + 40, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#e8c8a0';
    ctx.beginPath();
    ctx.arc(boxX + 40, boxY + 36, 10, 0, Math.PI * 2);
    ctx.fill();

    // Name
    UI.drawText(ctx, name, boxX + 75, boxY + 16, {
      size: 16, weight: '700', font: 'display', color: color
    });

    // Text
    const displayText = dialogue[currentLine] ? dialogue[currentLine].substring(0, charIndex) : '';
    UI.wrapText(ctx, displayText, boxX + 75, boxY + 40, boxW - 95, 20, {
      size: 14, color: '#e8e8ec'
    });

    // Continue prompt
    if (fullyRevealed) {
      const alpha = 0.5 + Math.sin(time * 4) * 0.3;
      const nextText = currentLine < dialogue.length - 1 ? '▼ Next' : '▼ Close';
      UI.drawText(ctx, nextText, boxX + boxW - 20, boxY + boxH - 20, {
        size: 12, color: `rgba(74,240,192,${alpha})`, align: 'right'
      });
    }

    // Page indicator
    UI.drawText(ctx, `${currentLine + 1}/${dialogue.length}`, boxX + boxW - 20, boxY + 12, {
      size: 11, color: '#555', align: 'right'
    });
  }

  return { enter, exit, update, render };
})();

// ════════════════════════════════════════════════════════════════════════════
// INSIGHT SCENE (overlay for knowledge points)
// ════════════════════════════════════════════════════════════════════════════
const InsightScene = (() => {
  let insight = null;
  let player = null;
  let awarded = false;

  function enter(data) {
    insight = data.insight;
    player = data.player || Engine.getPlayer();
    awarded = false;
    if (insight && player) {
      awarded = addInsight(player, insight.id);
    }
  }

  function exit() {}

  function update(dt) {
    if (Engine.wasKeyPressed('Enter') || Engine.wasKeyPressed('Space') || Engine.wasKeyPressed('Escape') || Engine.wasMouseClicked()) {
      AudioManager.uiClick();
      Engine.popScene();
    }
  }

  function render(ctx, cw, ch, time) {
    ctx.fillStyle = 'rgba(10,14,26,0.6)';
    ctx.fillRect(0, 0, cw, ch);

    const panelW = Math.min(500, cw * 0.6);
    const panelH = 280;
    const px = (cw - panelW) / 2;
    const py = (ch - panelH) / 2;

    UI.drawPanel(ctx, px, py, panelW, panelH, { bg: 'rgba(10,14,26,0.95)', glow: '#4af0c0' });

    if (!insight) return;

    // Type badge
    const typeColors = { trend: '#3B82F6', tension: '#ff4466', impact: '#4af0c0' };
    const typeColor = typeColors[insight.type] || '#4af0c0';
    UI.drawText(ctx, (insight.type || '').toUpperCase(), px + 20, py + 20, {
      size: 11, weight: '600', color: typeColor
    });

    // Title
    UI.drawText(ctx, insight.title, px + 20, py + 42, {
      size: 20, weight: '700', font: 'display', color: '#fff'
    });

    // Stat
    UI.drawText(ctx, insight.stat, px + panelW / 2, py + 90, {
      size: 42, weight: '700', font: 'display', color: '#4af0c0', align: 'center'
    });
    UI.drawText(ctx, insight.statLabel, px + panelW / 2, py + 130, {
      size: 13, color: '#8888a0', align: 'center'
    });

    // Summary
    UI.wrapText(ctx, insight.summary, px + 20, py + 160, panelW - 40, 18, {
      size: 13, color: '#c8c8d0'
    });

    // Award notice
    if (awarded) {
      UI.drawText(ctx, '✦ Knowledge Absorbed! Stats increased!', px + panelW / 2, py + panelH - 30, {
        size: 14, weight: '600', color: '#4af0c0', align: 'center'
      });
    }

    // Close hint
    UI.drawText(ctx, 'Press Enter to close', px + panelW / 2, py + panelH - 12, {
      size: 11, color: '#555', align: 'center'
    });
  }

  return { enter, exit, update, render };
})();

// ════════════════════════════════════════════════════════════════════════════
// SHOP SCENE (overlay)
// ════════════════════════════════════════════════════════════════════════════
const ShopScene = (() => {
  let items = [];
  let title = 'Shop';
  let selectedIdx = 0;
  let message = '';
  let messageTimer = 0;

  function enter(data) {
    items = data.items || [];
    title = data.title || 'Shop';
    selectedIdx = 0;
    message = '';
    messageTimer = 0;
  }

  function exit() {}

  function update(dt) {
    if (messageTimer > 0) messageTimer -= dt;
    
    if (Engine.wasKeyPressed('Escape')) {
      AudioManager.uiClick();
      Engine.popScene();
      return;
    }
    
    if (Engine.wasKeyPressed('ArrowUp')) selectedIdx = Math.max(0, selectedIdx - 1);
    if (Engine.wasKeyPressed('ArrowDown')) selectedIdx = Math.min(items.length - 1, selectedIdx + 1);
    
    if (Engine.wasKeyPressed('Enter') || Engine.wasKeyPressed('Space')) {
      buyItem(selectedIdx);
    }
    
    if (Engine.wasMouseClicked()) {
      const mp = Engine.getMousePos();
      const cw = Engine.canvasW, ch = Engine.canvasH;
      const panelW = Math.min(500, cw * 0.6);
      const px = (cw - panelW) / 2;
      const py = (ch - 400) / 2;
      
      items.forEach((itemId, i) => {
        const iy = py + 70 + i * 40;
        if (UI.pointInRect(mp.x, mp.y, px + 10, iy, panelW - 20, 35)) {
          selectedIdx = i;
          buyItem(i);
        }
      });
      
      // Leave button
      if (UI.pointInRect(mp.x, mp.y, px + panelW/2 - 50, py + 370, 100, 36)) {
        AudioManager.uiClick();
        Engine.popScene();
      }
    }
  }

  function buyItem(idx) {
    const itemId = items[idx];
    const itemData = ITEMS[itemId];
    if (!itemData) return;
    
    const player = Engine.getPlayer();
    if (player.gold >= itemData.cost) {
      player.gold -= itemData.cost;
      const existing = player.items.find(i => i.id === itemId);
      if (existing) existing.qty++;
      else player.items.push({ id: itemId, qty: 1 });
      AudioManager.equipItem();
      message = `Bought ${itemData.name}!`;
      messageTimer = 1.5;
    } else {
      message = 'Not enough gold!';
      messageTimer = 1.5;
    }
  }

  function render(ctx, cw, ch, time) {
    ctx.fillStyle = 'rgba(10,14,26,0.6)';
    ctx.fillRect(0, 0, cw, ch);

    const panelW = Math.min(500, cw * 0.6);
    const panelH = 400;
    const px = (cw - panelW) / 2;
    const py = (ch - panelH) / 2;

    UI.drawPanel(ctx, px, py, panelW, panelH, { bg: 'rgba(10,14,26,0.95)' });

    const player = Engine.getPlayer();

    // Title
    UI.drawText(ctx, title, px + 20, py + 16, {
      size: 22, weight: '700', font: 'display', color: '#4af0c0'
    });
    UI.drawText(ctx, `Gold: ${player.gold}`, px + panelW - 20, py + 20, {
      size: 14, weight: '600', color: '#EAB308', align: 'right'
    });

    // Items
    items.forEach((itemId, i) => {
      const item = ITEMS[itemId];
      if (!item) return;
      const iy = py + 70 + i * 40;
      const hover = i === selectedIdx;
      
      if (hover) {
        ctx.fillStyle = 'rgba(74,240,192,0.08)';
        ctx.fillRect(px + 10, iy, panelW - 20, 35);
      }
      
      UI.drawText(ctx, item.name, px + 20, iy + 8, {
        size: 14, weight: hover ? '700' : '500', color: hover ? '#4af0c0' : '#e8e8ec'
      });
      UI.drawText(ctx, item.desc, px + 20, iy + 24, {
        size: 11, color: '#8888a0'
      });
      UI.drawText(ctx, `${item.cost}g`, px + panelW - 30, iy + 12, {
        size: 14, weight: '600', color: player.gold >= item.cost ? '#EAB308' : '#ff4466', align: 'right'
      });
    });

    // Message
    if (messageTimer > 0 && message) {
      UI.drawText(ctx, message, px + panelW / 2, py + panelH - 60, {
        size: 14, weight: '600', color: '#4af0c0', align: 'center'
      });
    }

    // Leave button
    const mp = Engine.getMousePos();
    const leaveHover = UI.pointInRect(mp.x, mp.y, px + panelW/2 - 50, py + panelH - 40, 100, 36);
    UI.drawButton(ctx, px + panelW/2 - 50, py + panelH - 40, 100, 36, 'Leave', { hover: leaveHover, fontSize: 14 });
  }

  return { enter, exit, update, render };
})();

// ════════════════════════════════════════════════════════════════════════════
// INVENTORY SCENE (overlay)
// ════════════════════════════════════════════════════════════════════════════
const InventoryScene = (() => {
  let tab = 0; // 0=Stats, 1=Abilities, 2=Items, 3=Knowledge
  const tabs = ['Stats', 'Abilities', 'Items', 'Knowledge'];

  function enter() { tab = 0; }
  function exit() {}

  function update(dt) {
    if (Engine.wasKeyPressed('Escape') || Engine.wasKeyPressed('KeyI')) {
      AudioManager.uiClick();
      Engine.popScene();
      return;
    }
    
    if (Engine.wasKeyPressed('ArrowLeft')) tab = (tab - 1 + tabs.length) % tabs.length;
    if (Engine.wasKeyPressed('ArrowRight')) tab = (tab + 1) % tabs.length;
    
    if (Engine.wasMouseClicked()) {
      const mp = Engine.getMousePos();
      const cw = Engine.canvasW, ch = Engine.canvasH;
      const panelW = Math.min(600, cw * 0.7);
      const px = (cw - panelW) / 2;
      const py = (ch - 450) / 2;
      
      tabs.forEach((t, i) => {
        const tx = px + 10 + i * (panelW / tabs.length);
        if (UI.pointInRect(mp.x, mp.y, tx, py + 8, panelW / tabs.length - 10, 28)) {
          tab = i;
          AudioManager.uiClick();
        }
      });
      
      // Close button
      if (UI.pointInRect(mp.x, mp.y, px + panelW - 40, py + 8, 30, 30)) {
        AudioManager.uiClick();
        Engine.popScene();
      }
    }
  }

  function render(ctx, cw, ch, time) {
    ctx.fillStyle = 'rgba(10,14,26,0.6)';
    ctx.fillRect(0, 0, cw, ch);

    const player = Engine.getPlayer();
    if (!player) return;

    const panelW = Math.min(600, cw * 0.7);
    const panelH = 450;
    const px = (cw - panelW) / 2;
    const py = (ch - panelH) / 2;

    UI.drawPanel(ctx, px, py, panelW, panelH, { bg: 'rgba(10,14,26,0.95)' });

    // Tabs
    tabs.forEach((t, i) => {
      const tx = px + 10 + i * (panelW / tabs.length);
      const selected = i === tab;
      UI.drawText(ctx, t, tx + (panelW / tabs.length) / 2, py + 20, {
        size: 14, weight: selected ? '700' : '400',
        color: selected ? '#4af0c0' : '#8888a0', align: 'center'
      });
      if (selected) {
        ctx.fillStyle = '#4af0c0';
        ctx.fillRect(tx + 10, py + 36, panelW / tabs.length - 20, 2);
      }
    });

    // Close X
    UI.drawText(ctx, '✕', px + panelW - 25, py + 16, {
      size: 16, weight: '700', color: '#8888a0', align: 'center'
    });

    const contentY = py + 50;
    const contentH = panelH - 60;

    switch (tab) {
      case 0: renderStats(ctx, px, contentY, panelW, contentH, player); break;
      case 1: renderAbilities(ctx, px, contentY, panelW, contentH, player); break;
      case 2: renderItems(ctx, px, contentY, panelW, contentH, player); break;
      case 3: renderKnowledge(ctx, px, contentY, panelW, contentH, player); break;
    }
  }

  function renderStats(ctx, px, py, w, h, player) {
    // Character info
    UI.drawText(ctx, player.name, px + 20, py + 10, {
      size: 22, weight: '700', font: 'display', color: player.color
    });
    UI.drawText(ctx, player.title, px + 20, py + 36, {
      size: 14, color: '#8888a0'
    });
    UI.drawText(ctx, `Level ${player.level}`, px + 20, py + 54, {
      size: 14, weight: '600', color: '#e8e8ec'
    });

    // XP bar
    UI.drawBar(ctx, px + 20, py + 72, w - 40, 10, player.xp, player.xpToNext, '#EAB308', null, 'XP');

    // Stats
    const stats = [
      ['HP', player.hp, player.maxHp, '#4af0c0'],
      ['MP', player.mp, player.maxMp, '#6366f1'],
      ['ATK', player.atk, 50, '#ff4466'],
      ['DEF', player.def, 50, '#3B82F6'],
      ['SPD', player.spd, 30, '#F59E0B'],
      ['INT', player.int, 50, '#A855F7']
    ];

    stats.forEach(([label, val, max, color], i) => {
      const sy = py + 100 + i * 30;
      UI.drawText(ctx, label, px + 20, sy + 4, { size: 13, weight: '600', color: '#8888a0' });
      UI.drawBar(ctx, px + 60, sy, w * 0.4, 14, val, max, color, null, '');
      UI.drawText(ctx, `${Math.floor(val)}`, px + 60 + w * 0.4 + 10, sy + 2, {
        size: 13, weight: '600', color: '#e8e8ec'
      });
    });

    // Equipment
    UI.drawText(ctx, 'Equipment:', px + 20, py + 290, {
      size: 14, weight: '600', color: '#e8e8ec'
    });
    if (player.equipment.length === 0) {
      UI.drawText(ctx, 'None', px + 20, py + 310, { size: 13, color: '#555' });
    }
    player.equipment.forEach((eqId, i) => {
      const eq = EQUIPMENT.find(e => e.id === eqId);
      if (!eq) return;
      UI.drawText(ctx, `${eq.name} — ${eq.desc}`, px + 20, py + 310 + i * 18, {
        size: 12, color: '#c8c8d0'
      });
    });

    // Gold
    UI.drawText(ctx, `Gold: ${player.gold}`, px + w - 30, py + 10, {
      size: 16, weight: '700', color: '#EAB308', align: 'right'
    });
    // Fragments
    UI.drawText(ctx, `Fragments: ${player.cognitiveFragments.length}/14`, px + w - 30, py + 32, {
      size: 13, color: '#4af0c0', align: 'right'
    });
    // Insights
    UI.drawText(ctx, `Insights: ${player.totalInsightsRead}`, px + w - 30, py + 50, {
      size: 13, color: '#8888a0', align: 'right'
    });
  }

  function renderAbilities(ctx, px, py, w, h, player) {
    if (player.abilities.length === 0) {
      UI.drawText(ctx, 'No abilities unlocked yet.', px + 20, py + 20, { size: 14, color: '#555' });
      UI.drawText(ctx, 'Read all insights in a town to unlock its ability.', px + 20, py + 42, { size: 12, color: '#555' });
      return;
    }
    player.abilities.forEach((abId, i) => {
      const ab = ABILITIES[abId];
      if (!ab) return;
      const ay = py + 10 + i * 50;
      UI.drawText(ctx, ab.name, px + 20, ay, {
        size: 16, weight: '700', color: '#4af0c0'
      });
      UI.drawText(ctx, `${ab.cost} MP — ${ab.desc}`, px + 20, ay + 20, {
        size: 12, color: '#8888a0'
      });
    });
  }

  function renderItems(ctx, px, py, w, h, player) {
    const usable = player.items.filter(i => i.qty > 0);
    if (usable.length === 0) {
      UI.drawText(ctx, 'No items.', px + 20, py + 20, { size: 14, color: '#555' });
      return;
    }
    usable.forEach((item, i) => {
      const data = ITEMS[item.id];
      if (!data) return;
      const iy = py + 10 + i * 36;
      UI.drawText(ctx, `${data.name} x${item.qty}`, px + 20, iy, {
        size: 14, weight: '600', color: '#e8e8ec'
      });
      UI.drawText(ctx, data.desc, px + 20, iy + 18, {
        size: 12, color: '#8888a0'
      });
    });
  }

  function renderKnowledge(ctx, px, py, w, h, player) {
    let y = py + 10;
    const industryKeys = Object.keys(INDUSTRIES);
    
    industryKeys.forEach(key => {
      const ind = INDUSTRIES[key];
      const read = player.insightsByIndustry[key] || [];
      const total = ind.insights.length;
      const complete = read.length >= total;
      const hasFragment = player.cognitiveFragments.includes(key);
      
      UI.drawText(ctx, `${hasFragment ? '◆' : '◇'} ${ind.name}`, px + 20, y, {
        size: 13, weight: '600', color: complete ? '#4af0c0' : '#8888a0'
      });
      UI.drawText(ctx, `${read.length}/${total}`, px + w - 30, y, {
        size: 12, color: complete ? '#4af0c0' : '#555', align: 'right'
      });
      y += 24;
    });
  }

  return { enter, exit, update, render };
})();

// ════════════════════════════════════════════════════════════════════════════
// SHARED HUD
// ════════════════════════════════════════════════════════════════════════════
function drawHUD(ctx, cw, ch, player, locationName, time) {
  if (!player) return;

  // Top-left: HP/MP bars
  UI.drawPanel(ctx, 10, 10, 220, 70, { bg: 'rgba(10,14,26,0.8)' });
  UI.drawText(ctx, `${player.name} Lv.${player.level}`, 20, 18, {
    size: 12, weight: '600', color: player.color
  });
  UI.drawBar(ctx, 20, 34, 190, 12, player.hp, player.maxHp, '#4af0c0', null, 'HP');
  UI.drawBar(ctx, 20, 50, 190, 12, player.mp, player.maxMp, '#6366f1', null, 'MP');
  UI.drawText(ctx, `${player.gold}g`, 200, 18, {
    size: 12, weight: '600', color: '#EAB308', align: 'right'
  });

  // Top-center: Location
  UI.drawText(ctx, locationName, cw / 2, 20, {
    size: 14, weight: '600', color: '#8888a0', align: 'center'
  });

  // Fragments count
  UI.drawText(ctx, `◆ ${player.cognitiveFragments.length}/14`, cw - 20, 20, {
    size: 12, weight: '600', color: '#4af0c0', align: 'right'
  });

  // Controls hint (bottom)
  UI.drawText(ctx, 'I = Inventory  |  E = Interact  |  Arrow Keys = Move', cw / 2, ch - 12, {
    size: 11, color: 'rgba(136,136,160,0.4)', align: 'center'
  });
}

function drawMinimap(ctx, cw, ch, mapData, player) {
  if (!mapData || !player) return;
  
  const mmW = 140, mmH = 100;
  const mmX = cw - mmW - 14, mmY = 40;
  
  UI.drawPanel(ctx, mmX, mmY, mmW, mmH, { bg: 'rgba(10,14,26,0.8)' });
  
  const scaleX = (mmW - 10) / mapData.width;
  const scaleY = (mmH - 10) / mapData.height;
  
  // Draw terrain as tiny dots
  for (let y = 0; y < mapData.height; y += 2) {
    for (let x = 0; x < mapData.width; x += 2) {
      const tile = mapData.tiles[y][x];
      let color = null;
      switch (tile) {
        case TILE.GRASS: color = '#2a5a2a'; break;
        case TILE.WATER: color = '#1a5fa8'; break;
        case TILE.DIRT: case TILE.COBBLE: color = '#6a6a78'; break;
        case TILE.TREE: color = '#1a4a1a'; break;
        case TILE.MOUNTAIN: color = '#4a4a5a'; break;
        case TILE.SAND: color = '#c8b070'; break;
      }
      if (color) {
        ctx.fillStyle = color;
        ctx.fillRect(mmX + 5 + x * scaleX, mmY + 5 + y * scaleY, Math.max(1, scaleX * 2), Math.max(1, scaleY * 2));
      }
    }
  }
  
  // Town markers
  if (mapData.objects) {
    mapData.objects.forEach(obj => {
      if (obj.type === 'town-entrance') {
        const ind = INDUSTRIES[obj.townId];
        ctx.fillStyle = ind ? ind.color : '#fff';
        ctx.fillRect(mmX + 5 + obj.x * scaleX - 1, mmY + 5 + obj.y * scaleY - 1, 3, 3);
      }
    });
  }
  
  // Player dot
  const pPos = PlayerEntity.getPosition();
  ctx.fillStyle = '#fff';
  ctx.fillRect(mmX + 5 + pPos.x * scaleX - 1, mmY + 5 + pPos.y * scaleY - 1, 3, 3);
  // Blinking
  if (Math.sin(Engine.gameTime * 6) > 0) {
    ctx.fillStyle = player.color;
    ctx.fillRect(mmX + 5 + pPos.x * scaleX - 1, mmY + 5 + pPos.y * scaleY - 1, 3, 3);
  }
}
