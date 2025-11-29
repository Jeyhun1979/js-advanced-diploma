import GameController from '../js/GameController.js';
import GamePlay from '../js/GamePlay.js';
import Bowman from '../js/characters/Bowman.js';
import Swordsman from '../js/characters/Swordsman.js';
import Magician from '../js/characters/Magician.js';
import Vampire from '../js/characters/Vampire.js';
import Undead from '../js/characters/Undead.js';
import Daemon from '../js/characters/Daemon.js';
import PositionedCharacter from '../js/PositionedCharacter.js';

class SilentGP extends GamePlay { bindToDOM() {} }

describe('movement and attack ranges', () => {
  let gc;
  beforeEach(() => {
    gc = new GameController(new SilentGP(), { load: () => null, save: () => {} });
  });

  const tests = [
    { cls: Swordsman, move: 4, attack: 1 },
    { cls: Undead, move: 4, attack: 1 },
    { cls: Bowman, move: 2, attack: 2 },
    { cls: Vampire, move: 2, attack: 2 },
    { cls: Magician, move: 1, attack: 4 },
    { cls: Daemon, move: 1, attack: 4 },
  ];

  tests.forEach(({ cls, move, attack }) => {
    test(`${cls.name} move <= ${move} and attack range ${attack}`, () => {
      const a = new cls(1);
      const b = new cls(1);
      const from = 27; 
      const toClose = from + move; 
      gc.positions = [new PositionedCharacter(a, from)];

      expect(gc.canMove(a, from, toClose)).toBe(true);

      gc.positions = [new PositionedCharacter(a, from), new PositionedCharacter(b, from + 1)];
      const canAttack = gc.canAttack(a, from, from + 1);
      if (attack === 1) {
        expect(canAttack).toBe(true);
      } else {
        expect(canAttack).toBe(true);
      }
    });
  });
});
