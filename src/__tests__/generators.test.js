import { characterGenerator, generateTeam } from '../js/generators.js';
import Bowman from '../js/characters/Bowman.js';
import Swordsman from '../js/characters/Swordsman.js';
import Magician from '../js/characters/Magician.js';

describe('generators', () => {
  test('characterGenerator yields instances of allowed types and levels in range', () => {
    const types = [Bowman, Swordsman, Magician];
    const maxLevel = 3;
    const gen = characterGenerator(types, maxLevel);
    for (let i = 0; i < 20; i += 1) {
      const ch = gen.next().value;
      expect(types.some((T) => ch instanceof T)).toBeTruthy();
      expect(ch.level).toBeGreaterThanOrEqual(1);
      expect(ch.level).toBeLessThanOrEqual(maxLevel);
    }
  });

  test('generateTeam creates Team with requested size and levels within range', () => {
    const types = [Bowman, Swordsman, Magician];
    const team = generateTeam(types, 2, 5);
    expect(team.getAllCharacters().length).toBe(5);
    team.getAllCharacters().forEach((c) => {
      expect(c.level).toBeGreaterThanOrEqual(1);
      expect(c.level).toBeLessThanOrEqual(2);
      expect(types.some((T) => c instanceof T)).toBeTruthy();
    });
  });
});
