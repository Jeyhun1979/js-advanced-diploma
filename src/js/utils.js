/**
 * @todo
 * @param index - индекс поля
 * @param boardSize - размер квадратного поля (в длину или ширину)
 * @returns строка - тип ячейки на поле:
 *
 * top-left
 * top-right
 * top
 * bottom-left
 * bottom-right
 * bottom
 * right
 * left
 * center
 *
 * @example
 * ```js
 * calcTileType(0, 8); // 'top-left'
 * calcTileType(1, 8); // 'top'
 * calcTileType(63, 8); // 'bottom-right'
 * calcTileType(7, 7); // 'left'
 * ```
 * */
export function calcTileType(index, boardSize) {
  const lastIndex = boardSize * boardSize - 1;
  const topRow = index < boardSize;
  const bottomRow = index >= lastIndex - boardSize + 1;
  const leftCol = index % boardSize === 0;
  const rightCol = index % boardSize === boardSize - 1;

  if (topRow && leftCol) return 'top-left';
  if (topRow && rightCol) return 'top-right';
  if (bottomRow && leftCol) return 'bottom-left';
  if (bottomRow && rightCol) return 'bottom-right';
  if (topRow) return 'top';
  if (bottomRow) return 'bottom';
  if (leftCol) return 'left';
  if (rightCol) return 'right';
  return 'center';
}

export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}
