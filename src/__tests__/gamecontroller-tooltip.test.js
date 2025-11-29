import GameController from '../js/GameController.js';
import GamePlay from '../js/GamePlay.js';
import PositionedCharacter from '../js/PositionedCharacter.js';
import Bowman from '../js/characters/Bowman.js';

class MockGamePlay extends GamePlay {
  constructor() {
    super();
    this.showCellTooltip = jest.fn();
  }
  bindToDOM() {}
}

describe('GameController tooltip on cell enter', () => {
  test('onCellEnter shows correct formatted tooltip for character', () => {
    const gp = new MockGamePlay();
    const stateService = { load: () => null, save: () => {} };
    const gc = new GameController(gp, stateService);

    const char = new Bowman(2);
    const positioned = new PositionedCharacter(char, 5);
    gc.positions = [positioned];

    gc.onCellEnter(5);

    expect(gp.showCellTooltip).toHaveBeenCalled();
    const msg = gp.showCellTooltip.mock.calls[0][0];
    expect(msg).toContain(`🎖${char.level}`);
    expect(msg).toContain(`⚔${char.attack}`);
    expect(msg).toContain(`🛡${char.defence}`);
    expect(msg).toContain(`❤${char.health}`);
  });
});
