import GameStateService from '../js/GameStateService.js';
import GameState from '../js/GameState.js';

describe('GameStateService', () => {
  test('save and load state with positions', () => {
    const mockStorage = {
      data: {},
      setItem(key, value) {
        this.data[key] = value;
      },
      getItem(key) {
        return this.data[key] || null;
      },
    };

    const service = new GameStateService(mockStorage);
    const state = new GameState();
    state.level = 1;
    state.score = 0;
    state.positions = [
      { position: 2, character: { type: 'bowman', level: 1, attack: 25, defence: 25, health: 50 } },
    ];

    service.save(state);

    const raw = service.load();
    expect(raw).toBeDefined();
    const restored = GameState.from(raw);
    expect(restored.positions).toBeDefined();
    expect(Array.isArray(restored.positions)).toBeTruthy();
    expect(restored.positions.length).toBe(1);
    expect(restored.positions[0].position).toBe(2);
    expect(restored.positions[0].character.type).toBe('bowman');
  });
});
