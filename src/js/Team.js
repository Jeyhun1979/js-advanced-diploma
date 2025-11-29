import Character from './Character.js';
/**
 * Класс, представляющий персонажей команды
 *
 * @example
 * ```js
 * const characters = [new Swordsman(2), new Bowman(1)]
 * const team = new Team(characters);
 *
 * team.characters // [swordsman, bowman]
 * ```
 */
export default class Team {
  constructor(characters = []) {
    // Проверяем, что в массиве все элементы — это персонажи
    if (!Array.isArray(characters)) {
      throw new Error('characters must be an array');
    }
    this.characters = characters;
  }

  /**
   * Добавить персонажа в команду
   * @param {Character} character Персонаж, который будет добавлен
   */
  addCharacter(character) {
    if (!(character instanceof Character)) {
      throw new Error('character must be an instance of Character');
    }
    this.characters.push(character);
  }

  /**
   * Удалить персонажа из команды
   * @param {Character} character Персонаж, который будет удалён
   */
  removeCharacter(character) {
    const index = this.characters.indexOf(character);
    if (index === -1) {
      throw new Error('Character not found in team');
    }
    this.characters.splice(index, 1);
  }

  /**
   * Получить всех персонажей в команде
   * @returns {Character[]} Массив персонажей
   */
  getAllCharacters() {
    return this.characters;
  }
}
