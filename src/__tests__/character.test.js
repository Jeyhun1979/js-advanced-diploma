import Character from '../js/Character.js';
import Bowman from '../js/characters/Bowman.js';
import Swordsman from '../js/characters/Swordsman.js';
import Magician from '../js/characters/Magician.js';
import Vampire from '../js/characters/Vampire.js';
import Undead from '../js/characters/Undead.js';
import Daemon from '../js/characters/Daemon.js';

describe('Character base and subclasses', () => {
  test('cannot instantiate Character directly', () => {
    expect(() => new Character(1)).toThrow();
  });

  test('subclasses can be instantiated and have correct stats for level 1', () => {
    const b = new Bowman(1);
    expect(b.level).toBe(1);
    expect(b.attack).toBe(25);
    expect(b.defence).toBe(25);
    expect(b.type).toBe('bowman');

    const s = new Swordsman(1);
    expect(s.attack).toBe(40);
    expect(s.defence).toBe(10);
    expect(s.type).toBe('swordsman');

    const m = new Magician(1);
    expect(m.attack).toBe(10);
    expect(m.defence).toBe(40);
    expect(m.type).toBe('magician');

    const v = new Vampire(1);
    expect(v.attack).toBe(25);
    expect(v.defence).toBe(25);
    expect(v.type).toBe('vampire');

    const u = new Undead(1);
    expect(u.attack).toBe(40);
    expect(u.defence).toBe(10);
    expect(u.type).toBe('undead');

    const d = new Daemon(1);
    expect(d.attack).toBe(10);
    expect(d.defence).toBe(10);
    expect(d.type).toBe('daemon');
  });
});
