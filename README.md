# Cognitive Revolution RPG

An isometric 2.5D browser RPG that transforms real AI industry insights into an interactive game experience. Explore 14 industry towns, learn how AI is reshaping each sector, and use that knowledge to power your combat abilities.

## Play Now

[**Play the game**](https://pldmgg.github.io/cognitive-revolution-rpg/)

## Features

### 🗺️ 14 Industry Towns to Explore
- Software Development, Publishing, Video Production, Music
- Management Consulting, Financial Services, Real Estate
- Education, Healthcare, Legal
- IT Services / MSP, Marketing / Advertising
- Government / Public Sector, Labor Market Impact

### ⚔️ Turn-Based Combat
- Classic RPG combat: Attack, Defend, Use Abilities, Items
- Enemies themed to each region (Bug Swarms, Spreadsheet Golems, Phishing Phantoms, and more)
- 4 Boss battles across the game's story arc
- Strategic depth: knowledge from towns directly powers your combat effectiveness

### 📚 Knowledge = Power
- **44 real AI industry insights** sourced from research and analysis
- Reading insights in towns gives permanent stat boosts (+HP, +MP, +ATK/DEF/INT)
- Complete a town's insights to unlock a unique industry-themed combat ability
- Equipment unlocks at milestone insight counts (3, 6, 10, 15, 20, 30, 44)

### 🎭 Full Narrative
- Story about navigating the AI revolution as a "Digital Pioneer"
- NPC dialogue and quest progression through 5 acts
- Collect all 14 Cognitive Fragments to complete the journey
- The Architect guides you through the world's mysteries

### 🎮 Technical
- Pure HTML5 Canvas + vanilla JavaScript — no frameworks
- Procedural sound effects via Web Audio API
- All custom art generated specifically for this game
- Responsive design: works on desktop and mobile
- ~4,200 lines of handcrafted game code

## Controls

- **Mouse/Touch**: Click to interact with everything
- **World Map**: Click town nodes to enter, paths trigger travel (and possible combat)
- **Towns**: Click Knowledge Points to read insights, talk to NPCs
- **Combat**: Click action buttons (Attack, Defend, Ability, Item)

## Based On

This game is a companion experience to the [Cognitive Revolution Explorer](https://pldmgg.github.io/cognitive-revolution-explorer/), an interactive web app visualizing AI's impact across industries. The RPG transforms that same content into a playable game where learning about AI directly enhances your gameplay.

Content is sourced from:
- [The Industrial Revolution for Cognitive Labor](https://pauldimaggio.substack.com/p/the-industrial-revolution-for-cognitive) (Substack)
- [A General Contractor...But For IT](https://pauldimaggio.substack.com/p/a-general-contractorbut-for-it) (Substack)

## Development

```bash
# Clone and run locally
git clone https://github.com/pldmgg/cognitive-revolution-rpg.git
cd cognitive-revolution-rpg
# Open index.html in a browser — no build step needed
```

## File Structure

```
cognitive-revolution-rpg/
├── index.html     # Entry point with canvas, fonts, image preloading
├── game.js        # Game engine, loop, input handling, scene management
├── scenes.js      # All 6 scene classes (Title, WorldMap, Town, Combat, Dialog, Inventory)
├── combat.js      # Turn-based combat engine with enemy AI
├── data.js        # All game data: industries, enemies, abilities, equipment, dialogue
├── ui.js          # Canvas UI framework: panels, bars, text, particles, enemy drawings
├── audio.js       # Procedural SFX via Web Audio API
└── assets/        # Generated art (title screen, world map, battle backgrounds, character art)
```

## License

MIT

---

*Created with [Perplexity Computer](https://www.perplexity.ai/computer)*
