import GamePlay from './GamePlay.js';
import GameState from './GameState.js';
import { generateTeam } from './generators.js';
import PositionedCharacter from './PositionedCharacter.js';
import Team from './Team.js';
import Bowman from './characters/Bowman.js';  
import Swordsman from './characters/Swordsman.js';
import Magician from './characters/Magician.js';
import Daemon from './characters/Daemon.js';
import Undead from './characters/Undead.js';
import Vampire from './characters/Vampire.js';
import cursors from './cursors.js';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.team = null;
    this.computerTeam = null;
    this.positions = [];
    this.selectedCell = null;
    this.gameState = new GameState();
    this.isPlayerTurn = true;
  }

  init() {
    this.gamePlay.drawUi('prairie');
    this.loadState();
    this.gamePlay.redrawPositions(this.positions);
    this.addGamePlayListeners();
  }

  addGamePlayListeners() {
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addNewGameListener(this.onNewGame.bind(this));
    this.gamePlay.addSaveGameListener(this.onSaveGame.bind(this));
    this.gamePlay.addLoadGameListener(this.onLoadGame.bind(this));
  }

  loadState() {
    try {
      const saved = this.stateService.load();
      if (saved) {
        const state = GameState.from(saved);
        this.gameState = state;

        const revive = (data) => {
          if (!data || !data.type) return null;
          const map = {
            bowman: Bowman,
            swordsman: Swordsman,
            magician: Magician,
            daemon: Daemon,
            undead: Undead,
            vampire: Vampire,
          };
          const Cls = map[data.type];
          if (!Cls) return null;
          const inst = new Cls(data.level || 1);
          inst.level = data.level || inst.level;
          inst.attack = data.attack;
          inst.defence = data.defence;
          inst.health = data.health;
          return inst;
        };

        if (state.positions && state.positions.length) {
          const positioned = state.positions.map((p) => {
            const ch = revive(p.character);
            return ch ? new PositionedCharacter(ch, p.position) : null;
          }).filter(x => x);

          this.positions = positioned;
          const playerChars = positioned.map(p => p.character).filter(c => ['bowman', 'swordsman', 'magician'].includes(c.type));
          const compChars = positioned.map(p => p.character).filter(c => !['bowman', 'swordsman', 'magician'].includes(c.type));
          this.team = new Team(playerChars);
          this.computerTeam = new Team(compChars);
        } else {
          const playerChars = (state.characters || []).map(revive).filter(c => c);
          const compChars = (state.computerCharacters || []).map(revive).filter(c => c);

          this.team = new Team(playerChars);
          this.computerTeam = new Team(compChars);

          const boardSize = 8;
          const getPositions = (count, cols) => {
            const all = [];
            for (let row = 0; row < boardSize; row += 1) {
              for (const col of cols) all.push(row * boardSize + col);
            }
            for (let i = all.length - 1; i > 0; i -= 1) {
              const j = Math.floor(Math.random() * (i + 1));
              [all[i], all[j]] = [all[j], all[i]];
            }
            return all.slice(0, count);
          };

          const playerPositions = getPositions(this.team.getAllCharacters().length, [0, 1]);
          const compPositions = getPositions(this.computerTeam.getAllCharacters().length, [6, 7]);

          const positionedPlayerTeam = this.team.getAllCharacters().map((char, index) => new PositionedCharacter(char, playerPositions[index]));
          const positionedComputerTeam = this.computerTeam.getAllCharacters().map((char, index) => new PositionedCharacter(char, compPositions[index]));
          this.positions = [...positionedPlayerTeam, ...positionedComputerTeam];
        }
      } else {
        this.startNewGame();
      }
    } catch (error) {
      GamePlay.showError('Failed to load saved game: ' + (error && error.message ? error.message : error));
      this.startNewGame();
    }
  }

  startNewGame() {
    const playerTypes = [Bowman, Swordsman, Magician];
    const computerTypes = [Daemon, Vampire, Undead];
    this.team = generateTeam(playerTypes, 1, 3);
    this.computerTeam = generateTeam(computerTypes, 1, 3);

    const boardSize = 8;
    const getPositions = (count, cols) => {
      const all = [];
      for (let row = 0; row < boardSize; row += 1) {
        for (const col of cols) all.push(row * boardSize + col);
      }
      for (let i = all.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [all[i], all[j]] = [all[j], all[i]];
      }
      return all.slice(0, count);
    };

    const playerPositions = getPositions(this.team.getAllCharacters().length, [0, 1]);
    const compPositions = getPositions(this.computerTeam.getAllCharacters().length, [6, 7]);

    const positionedPlayerTeam = this.team.getAllCharacters().map((char, index) => new PositionedCharacter(char, playerPositions[index]));
    const positionedComputerTeam = this.computerTeam.getAllCharacters().map((char, index) => new PositionedCharacter(char, compPositions[index]));
    this.positions = [...positionedPlayerTeam, ...positionedComputerTeam];

    this.gamePlay.redrawPositions(this.positions);

    this.gameState = new GameState();
    this.gameState.setTeam(this.team);
    this.gameState.setComputerTeam(this.computerTeam);
    this.gameState.positions = this.serializePositions();
    this.stateService.save(this.gameState);
  }

  onCellClick(index) {
    if (!this.isPlayerTurn) return;

    const clickedCharacter = this.getCharacterByCell(index);

    if (clickedCharacter && this.isPlayerCharacter(clickedCharacter)) {
      if (this.selectedCell !== null) this.gamePlay.deselectCell(this.selectedCell);
      this.selectedCell = index;
      this.gamePlay.selectCell(index);
      this.gamePlay.setCursor(cursors.pointer);
      return;
    }

    if (this.selectedCell === null) {
      GamePlay.showError('Select your character first');
      this.gamePlay.setCursor(cursors.notallowed);
      return;
    }

    const selectedCharacter = this.getCharacterByCell(this.selectedCell);

    if (!clickedCharacter) {
      if (this.canMove(selectedCharacter, this.selectedCell, index)) {
        this.moveCharacter(selectedCharacter, index);
        try { this.gamePlay.deselectCell(this.selectedCell); } catch (err) { console.warn('deselect failed', err); }
        this.selectedCell = null;
        this.nextTurn();
      } else {
        GamePlay.showError('You cannot move there');
        this.gamePlay.setCursor(cursors.notallowed);
      }
      return;
    }

    if (!this.isPlayerCharacter(clickedCharacter)) {
      if (this.canAttack(selectedCharacter, this.selectedCell, index)) {
        this.attackCharacter(selectedCharacter, clickedCharacter);
        try { this.gamePlay.deselectCell(this.selectedCell); } catch (err) { console.warn('deselect failed', err); }
        this.selectedCell = null;
      } else {
        GamePlay.showError('Target out of range');
        this.gamePlay.setCursor(cursors.notallowed);
      }
      return;
    }
  }

  onCellEnter(index) {
    const character = this.getCharacterByCell(index);
    if (character) {
      this.gamePlay.showCellTooltip(
        `🎖${character.level} ⚔${character.attack} 🛡${character.defence} ❤${character.health}`,
        index
      );
    }
    
    if (this.selectedCell !== null && this.selectedCell !== index) {
      const selectedCharacter = this.getCharacterByCell(this.selectedCell);
      if (!selectedCharacter) return;
      
      const targetCharacter = this.getCharacterByCell(index);
      
      if (!targetCharacter) {
        if (this.canMove(selectedCharacter, this.selectedCell, index)) {
          this.gamePlay.selectCell(index, 'green');
          this.gamePlay.setCursor('pointer');
        } else {
          this.gamePlay.setCursor('notallowed');
        }
      } else if (!this.isPlayerCharacter(targetCharacter)) {
        if (this.canAttack(selectedCharacter, this.selectedCell, index)) {
          this.gamePlay.selectCell(index, 'red');
          this.gamePlay.setCursor('crosshair');
        } else {
          this.gamePlay.setCursor('notallowed');
        }
      } else {
        this.gamePlay.setCursor('pointer');
      }
    }
  }

  onCellLeave(index) {
    this.gamePlay.hideCellTooltip(index);
    if (this.selectedCell !== null && this.selectedCell !== index) {
      try { this.gamePlay.deselectCell(index); } catch (err) { console.warn('deselect failed', err); }
    }
  }

  getCharacterByCell(index) {
    return this.positions.find(p => p.position === index)?.character || null;
  }

  isPlayerCharacter(character) {
    return this.team.has(character);
  }

  canMove(character, from, to) {
    if (this.getCharacterByCell(to)) return false;
    const dist = this.calculateDistance(from, to);
    return dist <= character.moveMax;
  }

  canAttack(character, from, to) {
    if (!this.getCharacterByCell(to)) return false;
    const dist = this.calculateDistance(from, to);
    return dist <= character.attackMax;
  }

  calculateDistance(from, to) {
    const size = 8;
    const x1 = from % size;
    const y1 = Math.floor(from / size);
    const x2 = to % size;
    const y2 = Math.floor(to / size);
    return Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2));
  }

  serializePositions() {
    return this.positions.map(p => ({
      position: p.position,
      character: {
        type: p.character.type,
        level: p.character.level,
        attack: p.character.attack,
        defence: p.character.defence,
        health: p.character.health,
      },
    }));
  }

  moveCharacter(character, to) {
    const pos = this.positions.find(p => p.character === character);
    if (pos) {
      pos.position = to;
    }
    for (let i = 0; i < 64; i++) {
      this.gamePlay.deselectCell(i);
    }
    this.gamePlay.redrawPositions(this.positions);
    if (this.gameState) {
      this.gameState.positions = this.serializePositions();
      try { this.stateService.save(this.gameState); } catch (err) { console.warn('Save failed', err); }
    }
  }

  attackCharacter(attacker, target) {
    const damage = Math.max(attacker.attack - target.defence, attacker.attack * 0.1);
    target.health -= damage;
    const targetPos = this.positions.find(p => p.character === target)?.position;
    this.gamePlay.showDamage(targetPos, damage).then(() => {
      if (target.health <= 0) {
        this.positions = this.positions.filter(p => p.character !== target);
        if (this.team.has(target)) {
          this.team.removeCharacter(target);
        } else {
          this.computerTeam.removeCharacter(target);
        }
      }
      this.gamePlay.redrawPositions(this.positions);
      for (let i = 0; i < 64; i++) {
        this.gamePlay.deselectCell(i);
      }
      this.selectedCell = null;
      if (this.gameState) {
        this.gameState.positions = this.serializePositions();
        try { this.stateService.save(this.gameState); } catch (err) { console.warn('Save failed', err); }
      }
      if (this.isPlayerCharacter(attacker)) {
        this.nextTurn();
      } else {
        this.isPlayerTurn = true;
      }
    });
  }

  nextTurn() {
    if (this.computerTeam.characters.size === 0) {
      this.levelUpPlayer();
      this.startNewLevel();
      return;
    }
    if (this.team.characters.size === 0) {
      GamePlay.showError('Game Over');
      return;
    }
    this.isPlayerTurn = false;
    setTimeout(() => this.computerMove(), 500);
  }

  computerMove() {
    const target = this.team.getAllCharacters()[0];
    const attacker = this.computerTeam.getAllCharacters()[0];
    const attackerPos = this.positions.find(p => p.character === attacker)?.position;
    const targetPos = this.positions.find(p => p.character === target)?.position;

    if (attackerPos === undefined || targetPos === undefined) {
      this.isPlayerTurn = true;
      return;
    }

    if (this.canAttack(attacker, attackerPos, targetPos)) {
      this.attackCharacter(attacker, target);
      return;
    }

    const moveRange = attacker.moveMax;
    const boardSize = 8;
    const occupiedPos = this.positions.map(p => p.position);
    const distanceToTarget = this.calculateDistance(attackerPos, targetPos);

    const candidates = [];
    for (let pos = 0; pos < boardSize * boardSize; pos += 1) {
      if (pos === attackerPos) continue;
      if (occupiedPos.includes(pos)) continue;
      const distFromAttacker = this.calculateDistance(attackerPos, pos);
      if (distFromAttacker > moveRange) continue;
      const distToTargetFromPos = this.calculateDistance(pos, targetPos);
      if (distToTargetFromPos < distanceToTarget) {
        candidates.push({ pos, distToTargetFromPos, distFromAttacker });
      }
    }

    if (candidates.length > 0) {
      candidates.sort((a, b) => (a.distToTargetFromPos - b.distToTargetFromPos) || (a.distFromAttacker - b.distFromAttacker));
      const best = candidates[0].pos;
      this.moveCharacter(attacker, best);
      this.isPlayerTurn = true;
      return;
    }

    for (let pos = 0; pos < boardSize * boardSize; pos += 1) {
      if (pos === attackerPos) continue;
      if (occupiedPos.includes(pos)) continue;
      const distFromAttacker = this.calculateDistance(attackerPos, pos);
      if (distFromAttacker <= moveRange) {
        this.moveCharacter(attacker, pos);
        this.isPlayerTurn = true;
        return;
      }
    }

    console.warn('Computer has no valid moves');
    this.isPlayerTurn = true;
  }

  levelUpPlayer() {
    this.team.getAllCharacters().forEach(c => {
      c.level += 1;
      c.health = Math.min(80 + c.health, 100);
      c.attack = Math.max(c.attack, c.attack * (80 + c.health) / 100);
      c.defence = Math.max(c.defence, c.defence * (80 + c.health) / 100);
    });
  }

  startNewLevel() {
    this.gameState.level = (this.gameState.level || 0) + 1;
    const themes = ['prairie', 'desert', 'arctic', 'mountain'];
    const currentTheme = themes[Math.min(this.gameState.level - 1, themes.length - 1)];
    this.gamePlay.drawUi(currentTheme);
    this.startNewGame();
  }

  onNewGame() {
    this.gameState = new GameState();
    this.startNewGame();
  }

  onSaveGame() {
    try {
      this.stateService.save(this.gameState);
    } catch (err) {
      GamePlay.showError('Save failed: ' + (err && err.message ? err.message : err));
    }
  }

  onLoadGame() {
    try {
      this.loadState();
      const themes = ['prairie', 'desert', 'arctic', 'mountain'];
      const themeIndex = Math.min(Math.max(this.gameState.level - 1, 0), themes.length - 1);
      const currentTheme = themes[themeIndex];
      this.gamePlay.drawUi(currentTheme);
      this.gamePlay.redrawPositions(this.positions);
      this.selectedCell = null;
      this.isPlayerTurn = true;
    } catch (err) {
      GamePlay.showError('Load failed: ' + (err && err.message ? err.message : err));
    }
  }
}
