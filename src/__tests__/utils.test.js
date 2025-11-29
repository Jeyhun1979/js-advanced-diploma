import { calcTileType } from '../js/utils.js';

describe('calcTileType', () => {
  const size = 8;
  const cases = [
    [0, 'top-left'],
    [1, 'top'],
    [6, 'top'],
    [7, 'top-right'],
    [8, 'left'],
    [15, 'right'],
    [56, 'bottom-left'],
    [62, 'bottom'],
    [63, 'bottom-right'],
    [27, 'center'],
  ];

  test.each(cases)('index %i => %s', (index, expected) => {
    expect(calcTileType(index, size)).toBe(expected);
  });
});
