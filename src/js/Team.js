import Character from './Character.js';

export default class Team {
  constructor(characters = []) {
    if (!Array.isArray(characters)) {
      throw new Error('characters must be an array');
    }
    this.characters = new Set(characters);
  }

  addCharacter(character) {
    if (!(character instanceof Character)) {
      throw new Error('character must be an instance of Character');
    }
    this.characters.add(character);
  }

  removeCharacter(character) {
    if (!this.characters.has(character)) {
      throw new Error('Character not found in team');
    }
    this.characters.delete(character);
  }

  has(character) {
    return this.characters.has(character);
  }

  getAllCharacters() {
    return Array.from(this.characters);
  }
}
