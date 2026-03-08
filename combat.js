/* combat.js — Turn-based combat system */
/* eslint-disable no-unused-vars */

const CombatEngine = (() => {

  function createCombatState(player, enemyTemplate, isBoss) {
    const e = Object.assign({}, enemyTemplate);
    e.maxHp = e.hp;
    e.currentHp = e.hp;
    e.stunTurns = 0;
    e.defReduction = 0;
    e.isBoss = isBoss || false;

    return {
      player: {
        hp: player.hp,
        mp: player.mp,
        maxHp: player.maxHp,
        maxMp: player.maxMp,
        atk: player.atk,
        def: player.def,
        spd: player.spd,
        int: player.int,
        defending: false,
        helperTurns: 0,
        viralTurns: 0,
        viralDamage: 0,
        boostTurns: 0,
        boostAtk: 0,
        boostDef: 0,
        boostInt: 0,
        boostSpd: 0,
        buffAtk: 0,
        buffDef: 0,
        buffAtkTurns: 0,
        buffDefTurns: 0
      },
      enemy: e,
      turn: 'player', // 'player' or 'enemy'
      phase: 'choose', // 'choose', 'animate', 'enemy-turn', 'result'
      log: [],
      result: null, // 'victory' or 'defeat'
      animTimer: 0,
      animType: null,
      xpGained: 0,
      itemsFound: [],
      turnCount: 0,
      shakeTimer: 0,
      shakeTarget: null, // 'player' or 'enemy'
    };
  }

  function getEffectiveAtk(cs) {
    let atk = cs.player.atk;
    if (cs.player.boostTurns > 0) atk += cs.player.boostAtk;
    if (cs.player.buffAtkTurns > 0) atk += cs.player.buffAtk;
    return atk;
  }

  function getEffectiveDef(cs) {
    let def = cs.player.def;
    if (cs.player.defending) def *= 1.5;
    if (cs.player.boostTurns > 0) def += cs.player.boostDef;
    if (cs.player.buffDefTurns > 0) def += cs.player.buffDef;
    return def;
  }

  function getEffectiveInt(cs) {
    let int_ = cs.player.int;
    if (cs.player.boostTurns > 0) int_ += cs.player.boostInt;
    return int_;
  }

  function getEnemyEffDef(cs) {
    return Math.max(0, cs.enemy.def - cs.enemy.defReduction);
  }

  function calcDamage(atk, def) {
    const raw = Math.max(1, atk - def * 0.5);
    return Math.floor(raw * (0.9 + Math.random() * 0.2));
  }

  // ── Player Actions ────────────────────────────────────────────────────

  function doAttack(cs, floatingTexts) {
    const atk = getEffectiveAtk(cs);
    const def = getEnemyEffDef(cs);
    const dmg = calcDamage(atk, def);
    cs.enemy.currentHp = Math.max(0, cs.enemy.currentHp - dmg);
    cs.log.push(`You attack for ${dmg} damage!`);
    cs.shakeTimer = 0.3;
    cs.shakeTarget = 'enemy';
    if (floatingTexts) floatingTexts.add(`-${dmg}`, 0, 0, UI.COLOR_DANGER, 28);
    AudioManager.attackHit();
    return dmg;
  }

  function doDefend(cs) {
    cs.player.defending = true;
    const healAmt = Math.floor(cs.player.maxHp * 0.05);
    cs.player.hp = Math.min(cs.player.maxHp, cs.player.hp + healAmt);
    cs.log.push(`You defend! (+${healAmt} HP regen)`);
    AudioManager.defend();
  }

  function doAbility(cs, abilityId, player, floatingTexts) {
    const ability = ABILITIES[abilityId];
    if (!ability) return false;

    let cost = ability.cost;
    // Check for Architect's Mantle
    if (player.equipment.includes('architects-mantle')) cost = Math.floor(cost / 2);

    if (cs.player.mp < cost) {
      cs.log.push('Not enough MP!');
      return false;
    }

    cs.player.mp -= cost;
    AudioManager.abilityUse();

    const int_ = getEffectiveInt(cs);

    switch (abilityId) {
      case 'vibe-code': {
        let dmg = Math.floor(int_ * 3);
        cs.enemy.currentHp = Math.max(0, cs.enemy.currentHp - dmg);
        cs.log.push(`Vibe Code deals ${dmg} damage!`);
        if (floatingTexts) floatingTexts.add(`-${dmg}`, 0, 0, '#3B82F6', 28);
        if (Math.random() < 0.3) {
          const dmg2 = Math.floor(int_ * 3 * 0.7);
          cs.enemy.currentHp = Math.max(0, cs.enemy.currentHp - dmg2);
          cs.log.push(`Double hit! +${dmg2} damage!`);
          if (floatingTexts) floatingTexts.add(`-${dmg2}`, 20, 10, '#60A5FA', 24);
        }
        cs.shakeTimer = 0.3;
        cs.shakeTarget = 'enemy';
        break;
      }
      case 'content-flood': {
        const dmg = Math.floor(int_ * 1.5);
        cs.enemy.currentHp = Math.max(0, cs.enemy.currentHp - dmg);
        cs.log.push(`Content Flood deals ${dmg} damage!`);
        if (floatingTexts) floatingTexts.add(`-${dmg}`, 0, 0, '#F59E0B', 28);
        cs.shakeTimer = 0.3;
        cs.shakeTarget = 'enemy';
        break;
      }
      case 'deep-fake': {
        if (Math.random() < 0.5) {
          const dmg = Math.floor(cs.enemy.atk * 0.8);
          cs.enemy.currentHp = Math.max(0, cs.enemy.currentHp - dmg);
          cs.log.push(`Deep Fake! Enemy attacks itself for ${dmg}!`);
          if (floatingTexts) floatingTexts.add(`-${dmg}`, 0, 0, '#EC4899', 28);
        } else {
          cs.log.push('Deep Fake failed — enemy saw through it!');
        }
        break;
      }
      case 'harmonic-disruption': {
        cs.enemy.stunTurns = 1;
        const dmg = Math.floor(int_ * 0.8);
        cs.enemy.currentHp = Math.max(0, cs.enemy.currentHp - dmg);
        cs.log.push(`Harmonic Disruption! Enemy confused (${dmg} damage)!`);
        if (floatingTexts) floatingTexts.add(`-${dmg}`, 0, 0, '#A855F7', 28);
        break;
      }
      case 'strategic-analysis': {
        cs.enemy.defReduction = Math.floor(cs.enemy.def * 0.3);
        cs.log.push(`Strategic Analysis! Enemy DEF reduced by 30%!`);
        if (floatingTexts) floatingTexts.add('DEF↓', 0, 0, '#10B981', 24);
        break;
      }
      case 'capital-strike': {
        const dmg = Math.floor(int_ * 4);
        cs.enemy.currentHp = Math.max(0, cs.enemy.currentHp - dmg);
        cs.log.push(`Capital Strike deals ${dmg} MASSIVE damage!`);
        if (floatingTexts) floatingTexts.add(`-${dmg}`, 0, 0, '#6366F1', 32);
        cs.shakeTimer = 0.5;
        cs.shakeTarget = 'enemy';
        AudioManager.criticalHit();
        break;
      }
      case 'accelerated-learning': {
        cs.player.boostTurns = 3;
        cs.player.boostAtk = Math.floor(cs.player.atk * 0.2);
        cs.player.boostDef = Math.floor(cs.player.def * 0.2);
        cs.player.boostInt = Math.floor(cs.player.int * 0.2);
        cs.player.boostSpd = Math.floor(cs.player.spd * 0.2);
        cs.log.push('Accelerated Learning! All stats +20% for 3 turns!');
        if (floatingTexts) floatingTexts.add('BOOST!', 0, 0, '#F97316', 28);
        break;
      }
      case 'neural-repair': {
        const healAmt = Math.floor(cs.player.maxHp * 0.4);
        cs.player.hp = Math.min(cs.player.maxHp, cs.player.hp + healAmt);
        cs.log.push(`Neural Repair heals ${healAmt} HP!`);
        if (floatingTexts) floatingTexts.add(`+${healAmt}`, 0, 0, '#14B8A6', 28);
        AudioManager.heal();
        break;
      }
      case 'regulatory-freeze': {
        cs.enemy.stunTurns = 2;
        cs.log.push('Regulatory Freeze! Enemy stunned for 2 turns!');
        if (floatingTexts) floatingTexts.add('STUN!', 0, 0, '#64748B', 28);
        break;
      }
      case 'digital-architect': {
        cs.player.helperTurns = 3;
        cs.log.push('Digital Architect! Helper summoned for 3 turns!');
        if (floatingTexts) floatingTexts.add('SUMMON!', 0, 0, '#06B6D4', 28);
        break;
      }
      case 'market-crash': {
        const dmg = Math.floor(cs.enemy.maxHp * 0.25);
        cs.enemy.currentHp = Math.max(0, cs.enemy.currentHp - dmg);
        cs.log.push(`Market Crash deals ${dmg} damage (25% max HP)!`);
        if (floatingTexts) floatingTexts.add(`-${dmg}`, 0, 0, '#D97706', 28);
        cs.shakeTimer = 0.4;
        cs.shakeTarget = 'enemy';
        break;
      }
      case 'viral-campaign': {
        cs.player.viralTurns = 3;
        cs.player.viralDamage = Math.floor(int_ * 0.5);
        cs.log.push('Viral Campaign active! Damage increases each turn!');
        if (floatingTexts) floatingTexts.add('VIRAL!', 0, 0, '#E11D48', 28);
        break;
      }
      case 'executive-order': {
        const dmg = Math.floor(int_ * 4 + cs.player.atk * 2);
        cs.enemy.currentHp = Math.max(0, cs.enemy.currentHp - dmg);
        cs.log.push(`Executive Order! Guaranteed crit: ${dmg} damage!`);
        if (floatingTexts) floatingTexts.add(`-${dmg}`, 0, 0, '#1D4ED8', 32);
        cs.shakeTimer = 0.5;
        cs.shakeTarget = 'enemy';
        AudioManager.criticalHit();
        break;
      }
      case 'automation-wave': {
        let total = 0;
        for (let i = 0; i < 3; i++) {
          const dmg = Math.floor(int_ * (1 + i * 0.5));
          cs.enemy.currentHp = Math.max(0, cs.enemy.currentHp - dmg);
          total += dmg;
        }
        cs.log.push(`Automation Wave: 3 hits for ${total} total damage!`);
        if (floatingTexts) floatingTexts.add(`-${total}`, 0, 0, '#EF4444', 32);
        cs.shakeTimer = 0.5;
        cs.shakeTarget = 'enemy';
        AudioManager.criticalHit();
        break;
      }
    }
    return true;
  }

  function doItem(cs, itemId, player) {
    const item = ITEMS[itemId];
    if (!item) return false;

    // Find in player inventory
    const inv = player.items.find(i => i.id === itemId);
    if (!inv || inv.qty <= 0) {
      cs.log.push('No items left!');
      return false;
    }

    inv.qty--;

    switch (item.effect) {
      case 'hp':
        cs.player.hp = Math.min(cs.player.maxHp, cs.player.hp + item.value);
        cs.log.push(`Used ${item.name}! +${item.value} HP`);
        AudioManager.heal();
        break;
      case 'mp':
        cs.player.mp = Math.min(cs.player.maxMp, cs.player.mp + item.value);
        cs.log.push(`Used ${item.name}! +${item.value} MP`);
        AudioManager.heal();
        break;
      case 'buff-atk':
        cs.player.buffAtk = item.value;
        cs.player.buffAtkTurns = 3;
        cs.log.push(`Used ${item.name}! +${item.value} ATK for 3 turns`);
        break;
      case 'buff-def':
        cs.player.buffDef = item.value;
        cs.player.buffDefTurns = 3;
        cs.log.push(`Used ${item.name}! +${item.value} DEF for 3 turns`);
        break;
      case 'full':
        cs.player.hp = Math.min(cs.player.maxHp, cs.player.hp + 100);
        cs.player.mp = Math.min(cs.player.maxMp, cs.player.mp + 50);
        cs.log.push(`Used ${item.name}! +100 HP, +50 MP`);
        AudioManager.heal();
        break;
    }
    return true;
  }

  // ── Enemy Turn ────────────────────────────────────────────────────────

  function doEnemyTurn(cs, floatingTexts) {
    if (cs.enemy.stunTurns > 0) {
      cs.enemy.stunTurns--;
      cs.log.push(`${cs.enemy.name} is stunned!`);
      return;
    }

    // Check enemy abilities
    const useAbility = cs.enemy.abilities.length > 0 && Math.random() < 0.3;

    if (useAbility) {
      const abilityName = cs.enemy.abilities[Math.floor(Math.random() * cs.enemy.abilities.length)];
      switch (abilityName) {
        case 'glitch': {
          const dmg = Math.floor(cs.enemy.int * 2);
          const actualDmg = Math.max(1, dmg - getEffectiveDef(cs) * 0.3);
          cs.player.hp = Math.max(0, cs.player.hp - actualDmg);
          cs.log.push(`${cs.enemy.name} uses Glitch! ${Math.floor(actualDmg)} damage!`);
          if (floatingTexts) floatingTexts.add(`-${Math.floor(actualDmg)}`, 0, 0, UI.COLOR_DANGER, 24);
          break;
        }
        case 'confuse':
          cs.log.push(`${cs.enemy.name} tries to confuse you!`);
          // Simple: skip player's next attack damage reduction
          break;
        case 'scan':
          cs.log.push(`${cs.enemy.name} scans your weaknesses!`);
          break;
        case 'chaos': {
          const dmg = Math.floor((cs.enemy.atk + cs.enemy.int) * (0.5 + Math.random()));
          const actualDmg = Math.max(1, dmg - getEffectiveDef(cs) * 0.3);
          cs.player.hp = Math.max(0, cs.player.hp - actualDmg);
          cs.log.push(`${cs.enemy.name} unleashes Chaos! ${Math.floor(actualDmg)} damage!`);
          if (floatingTexts) floatingTexts.add(`-${Math.floor(actualDmg)}`, 0, 0, UI.COLOR_DANGER, 28);
          break;
        }
        case 'debuff':
          cs.log.push(`${cs.enemy.name} curses you! ATK reduced!`);
          cs.player.boostAtk = Math.max(cs.player.boostAtk - 2, 0);
          break;
        case 'shield':
          cs.enemy.defReduction = Math.max(0, cs.enemy.defReduction - 5);
          cs.log.push(`${cs.enemy.name} reinforces its defenses!`);
          break;
        case 'heal': {
          const healAmt = Math.floor(cs.enemy.maxHp * 0.1);
          cs.enemy.currentHp = Math.min(cs.enemy.maxHp, cs.enemy.currentHp + healAmt);
          cs.log.push(`${cs.enemy.name} heals for ${healAmt}!`);
          if (floatingTexts) floatingTexts.add(`+${healAmt}`, 0, 0, '#44ff44', 24);
          break;
        }
        case 'slow':
          cs.log.push(`${cs.enemy.name} slows you down!`);
          break;
        case 'steal':
          cs.player.mp = Math.max(0, cs.player.mp - 10);
          cs.log.push(`${cs.enemy.name} steals 10 MP!`);
          break;
        // Boss abilities
        case 'clone': {
          const dmg = Math.floor(cs.enemy.atk * 1.5);
          const actualDmg = Math.max(1, dmg - getEffectiveDef(cs) * 0.3);
          cs.player.hp = Math.max(0, cs.player.hp - actualDmg);
          cs.log.push(`${cs.enemy.name} creates a clone that attacks for ${Math.floor(actualDmg)}!`);
          if (floatingTexts) floatingTexts.add(`-${Math.floor(actualDmg)}`, 0, 0, UI.COLOR_DANGER, 28);
          break;
        }
        case 'optimize': {
          cs.enemy.atk = Math.floor(cs.enemy.atk * 1.1);
          cs.log.push(`${cs.enemy.name} optimizes! ATK increased!`);
          if (floatingTexts) floatingTexts.add('ATK↑', 0, 0, '#ff8844', 24);
          break;
        }
        case 'random-strike': {
          const hits = 1 + Math.floor(Math.random() * 3);
          let total = 0;
          for (let i = 0; i < hits; i++) {
            const dmg = Math.floor(cs.enemy.atk * (0.5 + Math.random() * 0.5));
            total += Math.max(1, dmg - getEffectiveDef(cs) * 0.2);
          }
          cs.player.hp = Math.max(0, cs.player.hp - total);
          cs.log.push(`${cs.enemy.name} unleashes ${hits} random strikes for ${Math.floor(total)} total!`);
          if (floatingTexts) floatingTexts.add(`-${Math.floor(total)}`, 0, 0, UI.COLOR_DANGER, 28);
          break;
        }
        case 'omega-strike': {
          const dmg = Math.floor(cs.enemy.atk * 2 + cs.enemy.int * 2);
          const actualDmg = Math.max(1, dmg - getEffectiveDef(cs) * 0.3);
          cs.player.hp = Math.max(0, cs.player.hp - actualDmg);
          cs.log.push(`${cs.enemy.name} uses OMEGA STRIKE for ${Math.floor(actualDmg)}!`);
          if (floatingTexts) floatingTexts.add(`-${Math.floor(actualDmg)}`, 0, 0, '#ff0044', 32);
          AudioManager.criticalHit();
          break;
        }
        case 'phase-shift':
          cs.enemy.def += 5;
          cs.log.push(`${cs.enemy.name} phase-shifts! DEF increased!`);
          break;
        case 'absorb': {
          const absorb = Math.floor(cs.enemy.int * 1.5);
          cs.enemy.currentHp = Math.min(cs.enemy.maxHp, cs.enemy.currentHp + absorb);
          cs.player.mp = Math.max(0, cs.player.mp - 15);
          cs.log.push(`${cs.enemy.name} absorbs ${absorb} HP and drains 15 MP!`);
          break;
        }
        default: break;
      }
    } else {
      // Basic attack
      const dmg = calcDamage(cs.enemy.atk, getEffectiveDef(cs));
      cs.player.hp = Math.max(0, cs.player.hp - dmg);
      cs.log.push(`${cs.enemy.name} attacks for ${dmg} damage!`);
      if (floatingTexts) floatingTexts.add(`-${dmg}`, 0, 0, UI.COLOR_DANGER, 24);
      AudioManager.damageTaken();
    }

    cs.shakeTimer = 0.3;
    cs.shakeTarget = 'player';
  }

  // ── Turn Progression ──────────────────────────────────────────────────

  function processHelperAndViral(cs, floatingTexts) {
    // Helper attacks
    if (cs.player.helperTurns > 0) {
      cs.player.helperTurns--;
      const dmg = Math.floor(cs.player.int * 1.5);
      cs.enemy.currentHp = Math.max(0, cs.enemy.currentHp - dmg);
      cs.log.push(`Digital helper attacks for ${dmg}!`);
      if (floatingTexts) floatingTexts.add(`-${dmg}`, 20, 20, '#06B6D4', 22);
    }

    // Viral damage
    if (cs.player.viralTurns > 0) {
      cs.player.viralTurns--;
      cs.player.viralDamage = Math.floor(cs.player.viralDamage * 1.5);
      cs.enemy.currentHp = Math.max(0, cs.enemy.currentHp - cs.player.viralDamage);
      cs.log.push(`Viral Campaign deals ${cs.player.viralDamage}!`);
      if (floatingTexts) floatingTexts.add(`-${cs.player.viralDamage}`, -20, 20, '#E11D48', 22);
    }

    // Buff timers
    if (cs.player.boostTurns > 0) cs.player.boostTurns--;
    if (cs.player.buffAtkTurns > 0) cs.player.buffAtkTurns--;
    if (cs.player.buffDefTurns > 0) cs.player.buffDefTurns--;
  }

  function endTurn(cs) {
    cs.player.defending = false;
    cs.turnCount++;
  }

  function checkResult(cs) {
    if (cs.enemy.currentHp <= 0) return 'victory';
    if (cs.player.hp <= 0) return 'defeat';
    return null;
  }

  function getRandomLoot() {
    const lootTable = [
      { id: 'health-potion', chance: 0.5 },
      { id: 'energy-potion', chance: 0.3 },
      { id: 'power-crystal', chance: 0.15 },
      { id: 'shield-matrix', chance: 0.1 },
      { id: 'neural-stim', chance: 0.05 }
    ];

    const items = [];
    lootTable.forEach(l => {
      if (Math.random() < l.chance) {
        items.push(l.id);
      }
    });
    return items;
  }

  return {
    createCombatState,
    doAttack, doDefend, doAbility, doItem,
    doEnemyTurn,
    processHelperAndViral, endTurn, checkResult,
    getRandomLoot,
    getEffectiveAtk, getEffectiveDef, getEffectiveInt, getEnemyEffDef
  };
})();
