import Character from '../Character.js';

export default class Vampire extends Character {
  constructor(level) {
    super(level, 'vampire');
    this.attack = 25;
    this.defence = 25;
    this.moveMax = 2;
    this.attackMax = 2;
  }
}
