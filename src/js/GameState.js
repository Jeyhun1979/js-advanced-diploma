export default class GameState {
  constructor() {
    this.level = 1;
    this.score = 0;
    this.positions = [];
    this.characters = [];
    this.computerCharacters = [];
  }

  setTeam(team) {
    this.characters = team.getAllCharacters();
  }

  setComputerTeam(team) {
    this.computerCharacters = team.getAllCharacters();
  }

  static from(object) {
    if (!object || typeof object !== 'object') {
      throw new Error('Invalid object for GameState');
    }
    const state = new GameState();
    state.level = object.level || 1;
    state.score = object.score || 0;
    state.positions = object.positions ? [...object.positions] : [];
    state.characters = object.characters ? [...object.characters] : [];
    state.computerCharacters = object.computerCharacters ? [...object.computerCharacters] : [];
    return state;
  }
}
