/* game.js — Engine, game loop, input, scene manager */
/* eslint-disable no-unused-vars */

(() => {
  // ── Debug overlay ────────────────────────────────────────────────────
  let _frames = 0, _last = performance.now(), _fps = 0, _ft = 0, _prev = 0;
  const debugEl = document.getElementById('debug-overlay');

  function updateDebug() {
    _frames++;
    const n = performance.now();
    _ft = n - (_prev || n);
    _prev = n;
    if (n - _last >= 1000) {
      _fps = (_frames * 1000) / (n - _last);
      _frames = 0;
      _last = n;
      if (debugEl) {
        debugEl.textContent = `FPS:${_fps.toFixed(0)} ${_ft.toFixed(1)}ms`;
        debugEl.style.color = _fps < 30 ? '#f44' : '#0f0';
      }
    }
  }

  // ── Game Class ───────────────────────────────────────────────────────
  class Game {
    constructor() {
      this.canvas = document.getElementById('game-canvas');
      this.ctx = this.canvas.getContext('2d');
      this.sceneStack = [];
      this.player = null;
      this.lastTime = 0;
      this.running = false;

      this.resize();
      window.addEventListener('resize', () => this.resize());

      // Input
      this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
      this.canvas.addEventListener('click', (e) => this.handleClick(e));
      this.canvas.addEventListener('wheel', (e) => this.handleWheel(e), { passive: true });

      // Touch support
      this.canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        this.handleClick({
          clientX: touch.clientX,
          clientY: touch.clientY,
          _x: touch.clientX - rect.left,
          _y: touch.clientY - rect.top
        });
      }, { passive: false });
    }

    resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      this.canvas.width = w * dpr;
      this.canvas.height = h * dpr;
      this.canvas.style.width = w + 'px';
      this.canvas.style.height = h + 'px';
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.canvasW = w;
      this.canvasH = h;
    }

    getEventCoords(e) {
      if (e._x !== undefined) return { x: e._x, y: e._y };
      const rect = this.canvas.getBoundingClientRect();
      // We use ctx.scale(dpr) so coordinates are in CSS pixels
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }

    handleMouseMove(e) {
      const coords = this.getEventCoords(e);
      const scene = this.currentScene();
      if (scene && scene.onMouseMove) scene.onMouseMove(coords.x, coords.y);
    }

    handleClick(e) {
      const coords = this.getEventCoords(e);
      const scene = this.currentScene();
      if (scene && scene.onClick) scene.onClick(coords.x, coords.y);
    }

    handleWheel(e) {
      const scene = this.currentScene();
      if (scene && scene.onWheel) scene.onWheel(e.deltaY);
    }

    currentScene() {
      return this.sceneStack.length > 0 ? this.sceneStack[this.sceneStack.length - 1] : null;
    }

    pushScene(scene) {
      this.sceneStack.push(scene);
      if (scene.enter) scene.enter();
    }

    popScene() {
      const popped = this.sceneStack.pop();
      if (popped && popped.exit) popped.exit();
      // Don't re-enter the scene below — it causes re-triggers
    }

    setScene(scene) {
      this.sceneStack = [scene];
      if (scene.enter) scene.enter();
    }

    startNewGame() {
      this.player = createNewPlayer();
      recalcPlayerStats(this.player);
      this.player.hp = this.player.maxHp;
      this.player.mp = this.player.maxMp;

      const mapScene = new WorldMapScene(this);
      this.setScene(mapScene);

      // Auto-enter starting town
      setTimeout(() => {
        this.pushScene(new TownScene(this, 'it-services'));
      }, 300);
    }

    start() {
      this.running = true;
      this.pushScene(new TitleScene(this));
      this.lastTime = performance.now();
      requestAnimationFrame((t) => this.loop(t));
    }

    loop(timestamp) {
      if (!this.running) return;
      requestAnimationFrame((t) => this.loop(t));

      const dt = Math.min((timestamp - this.lastTime) / 1000, 0.1);
      this.lastTime = timestamp;

      // Update
      const scene = this.currentScene();
      if (scene && scene.update) scene.update(dt);

      UI.updateFade();
      updateDebug();

      // Draw
      const ctx = this.ctx;
      const cw = this.canvasW;
      const ch = this.canvasH;

      ctx.clearRect(0, 0, cw, ch);
      ctx.fillStyle = UI.COLOR_BG;
      ctx.fillRect(0, 0, cw, ch);

      // Draw all scenes in stack (for overlay support)
      this.sceneStack.forEach((s, i) => {
        if (s && s.draw) {
          ctx.save();
          s.draw(ctx, cw, ch);
          ctx.restore();
        }
      });

      UI.drawFade(ctx, cw, ch);
    }
  }

  // ── Wait for fonts and images, then start ────────────────────────────
  function waitForAssets() {
    return new Promise((resolve) => {
      const images = document.querySelectorAll('.preload-images img');
      let loaded = 0;
      const total = images.length;

      function check() {
        loaded++;
        if (loaded >= total) resolve();
      }

      images.forEach(img => {
        if (img.complete) check();
        else {
          img.onload = check;
          img.onerror = check; // Don't block on missing images
        }
      });

      // Fallback timeout
      setTimeout(resolve, 5000);
    });
  }

  document.fonts.ready.then(() => {
    waitForAssets().then(() => {
      const game = new Game();
      game.start();

      // Expose for testing hooks
      window._game = game;
      window.render_game_to_text = () => JSON.stringify({
        scene: game.currentScene()?.constructor?.name,
        sceneStackDepth: game.sceneStack.length,
        player: game.player ? {
          level: game.player.level,
          hp: game.player.hp,
          mp: game.player.mp,
          maxHp: game.player.maxHp,
          maxMp: game.player.maxMp,
          atk: game.player.atk,
          def: game.player.def,
          spd: game.player.spd,
          int: game.player.int,
          insightsRead: game.player.totalInsightsRead,
          fragments: game.player.cognitiveFragments.length,
          currentTown: game.player.currentTown,
          unlockedTowns: game.player.unlockedTowns.length,
          abilities: game.player.abilities.length,
          equipment: game.player.equipment.length
        } : null
      }, null, 2);
    });
  });
})();
