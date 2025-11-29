import GameController from '../js/GameController.js';
import GamePlay from '../js/GamePlay.js';

class MockGP extends GamePlay {
  constructor() {
    super();
    this.drawUi = jest.fn();
    this.redrawPositions = jest.fn();
    this.showError = jest.fn();
    this.showMessage = jest.fn();
  }
  bindToDOM() {}
}

describe('GameStateService handling in GameController.loadState', () => {
  beforeAll(() => { global.alert = jest.fn(); });
  test('on load error GameController should call GamePlay.showError and start new game', () => {
    const gp = new MockGP();
    const stateService = { load: jest.fn(() => { throw new Error('broken'); }), save: jest.fn() };
    const gc = new GameController(gp, stateService);
    gc.startNewGame = jest.fn();

    const spy = jest.spyOn(require('../js/GamePlay.js').default, 'showError');
    gc.loadState();
    expect(spy).toHaveBeenCalled();
    expect(gc.startNewGame).toHaveBeenCalled();
    spy.mockRestore();
  });

  test('on successful load GameController restores positions and teams', () => {
    const gp2 = new MockGP();
    const saved = {
      level: 1,
      score: 0,
      positions: [
        { position: 2, character: { type: 'bowman', level: 1, attack: 25, defence: 25, health: 49 } },
        { position: 9, character: { type: 'daemon', level: 1, attack: 10, defence: 10, health: 50 } },
      ],
      characters: [],
      computerCharacters: [],
    };
    const stateService2 = { load: jest.fn(() => saved), save: jest.fn(), storage: { getItem: () => JSON.stringify(saved) } };
    const gc2 = new GameController(gp2, stateService2);
    gc2.loadState();
    expect(Array.isArray(gc2.positions)).toBe(true);
    expect(gc2.positions.length).toBe(2);
    expect(gc2.team).toBeDefined();
    expect(gc2.computerTeam).toBeDefined();
  });
});
