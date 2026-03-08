/* engine.js — Game loop, input, scene manager, camera, global state */
/* eslint-disable no-unused-vars */

const Engine = (() => {
  let canvas, ctx;
  let canvasW = 1280, canvasH = 720;
  let lastTime = 0;
  let gameTime = 0;
  
  // ── Input ─────────────────────────────────────────────────────────────
  const keys = {};
  const justPressed = {};
  let mouseX = 0, mouseY = 0;
  let mouseDown = false;
  let mouseClicked = false;

  function initInput() {
    document.addEventListener('keydown', (e) => {
      if (!keys[e.code]) justPressed[e.code] = true;
      keys[e.code] = true;
      // Prevent arrow keys from scrolling
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code)) {
        e.preventDefault();
      }
    });
    document.addEventListener('keyup', (e) => { keys[e.code] = false; });
    
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = (e.clientX - rect.left) * (canvasW / rect.width);
      mouseY = (e.clientY - rect.top) * (canvasH / rect.height);
    });
    canvas.addEventListener('mousedown', (e) => {
      mouseDown = true;
      mouseClicked = true;
      AudioManager.init();
      AudioManager.resume();
    });
    canvas.addEventListener('mouseup', () => { mouseDown = false; });
    
    // Touch support
    canvas.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      mouseX = (touch.clientX - rect.left) * (canvasW / rect.width);
      mouseY = (touch.clientY - rect.top) * (canvasH / rect.height);
      mouseDown = true;
      mouseClicked = true;
      AudioManager.init();
      AudioManager.resume();
    }, { passive: true });
    canvas.addEventListener('touchend', () => { mouseDown = false; }, { passive: true });
  }

  function clearInput() {
    for (const k in justPressed) delete justPressed[k];
    mouseClicked = false;
  }

  function isKeyDown(code) { return !!keys[code]; }
  function wasKeyPressed(code) { return !!justPressed[code]; }
  function getMousePos() { return { x: mouseX, y: mouseY }; }
  function wasMouseClicked() { return mouseClicked; }

  // ── Scene Manager ─────────────────────────────────────────────────────
  const scenes = {};
  const sceneStack = [];

  function registerScene(name, scene) { scenes[name] = scene; }

  function pushScene(name, data) {
    const scene = scenes[name];
    if (!scene) return;
    sceneStack.push({ name, scene });
    if (scene.enter) scene.enter(data);
  }

  function popScene() {
    const entry = sceneStack.pop();
    if (entry && entry.scene.exit) entry.scene.exit();
    return currentScene();
  }

  function replaceScene(name, data) {
    const entry = sceneStack.pop();
    if (entry && entry.scene.exit) entry.scene.exit();
    pushScene(name, data);
  }

  function currentScene() {
    return sceneStack.length > 0 ? sceneStack[sceneStack.length - 1].scene : null;
  }

  function currentSceneName() {
    return sceneStack.length > 0 ? sceneStack[sceneStack.length - 1].name : '';
  }

  // ── Camera ────────────────────────────────────────────────────────────
  let camX = 0, camY = 0;
  let camTargetX = 0, camTargetY = 0;
  const CAM_SMOOTH = 0.08;

  function setCameraTarget(tx, ty, mapW, mapH) {
    const screen = TileRenderer.tileToScreen(tx, ty, 0, 0, 0, 0);
    camTargetX = screen.x;
    camTargetY = screen.y;
  }

  function setCameraImmediate(tx, ty) {
    const screen = TileRenderer.tileToScreen(tx, ty, 0, 0, 0, 0);
    camX = screen.x;
    camY = screen.y;
    camTargetX = screen.x;
    camTargetY = screen.y;
  }

  function updateCamera() {
    camX += (camTargetX - camX) * CAM_SMOOTH;
    camY += (camTargetY - camY) * CAM_SMOOTH;
  }

  function getCameraPos() { return { x: camX, y: camY }; }

  // ── Game State ────────────────────────────────────────────────────────
  let player = null;
  let currentMapData = null;

  function getPlayer() { return player; }
  function setPlayer(p) { player = p; }
  function getCurrentMap() { return currentMapData; }
  function setCurrentMap(m) { currentMapData = m; }

  // ── Game Loop ─────────────────────────────────────────────────────────
  function gameLoop(timestamp) {
    requestAnimationFrame(gameLoop);
    
    const dt = Math.min((timestamp - lastTime) / 1000, 0.1);
    lastTime = timestamp;
    gameTime += dt;
    
    // Resize
    const cw = Math.max(canvas.clientWidth, 800);
    const ch = Math.max(canvas.clientHeight, 600);
    if (canvas.width !== cw || canvas.height !== ch) {
      canvas.width = cw;
      canvas.height = ch;
      canvasW = cw;
      canvasH = ch;
    }
    
    // Update
    const scene = currentScene();
    if (scene && scene.update) scene.update(dt, gameTime);
    
    updateCamera();
    UI.updateFade();
    
    // Render - draw entire scene stack so overlays render on top of base scenes
    ctx.clearRect(0, 0, canvasW, canvasH);
    ctx.fillStyle = UI.COLOR_BG;
    ctx.fillRect(0, 0, canvasW, canvasH);
    
    // Render from bottom of stack up so overlays appear on top
    for (let i = 0; i < sceneStack.length; i++) {
      const s = sceneStack[i].scene;
      if (s && s.render) s.render(ctx, canvasW, canvasH, gameTime);
    }
    
    UI.drawFade(ctx, canvasW, canvasH);
    
    clearInput();
  }

  // ── Init ──────────────────────────────────────────────────────────────
  function init() {
    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext('2d');
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    canvasW = canvas.width;
    canvasH = canvas.height;
    
    initInput();
    
    // Register all scenes
    registerScene('title', TitleScene);
    registerScene('charselect', CharacterSelectScene);
    registerScene('town', TownScene);
    registerScene('overworld', OverworldScene);
    registerScene('combat', CombatScene);
    registerScene('dialog', DialogScene);
    registerScene('shop', ShopScene);
    registerScene('inventory', InventoryScene);
    registerScene('insight', InsightScene);
    
    // Start with title
    pushScene('title');
    
    requestAnimationFrame(gameLoop);
  }

  return {
    init,
    isKeyDown, wasKeyPressed, getMousePos, wasMouseClicked,
    registerScene, pushScene, popScene, replaceScene, currentScene, currentSceneName,
    setCameraTarget, setCameraImmediate, updateCamera, getCameraPos,
    getPlayer, setPlayer, getCurrentMap, setCurrentMap,
    get canvasW() { return canvasW; },
    get canvasH() { return canvasH; },
    get gameTime() { return gameTime; },
    get ctx() { return ctx; }
  };
})();
