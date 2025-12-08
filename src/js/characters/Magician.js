import Character from '../Character.js';

export default class Magician extends Character {
  constructor(level) {
    super(level, 'magician');
    this.attack = 10;
    this.defence = 40;
    this.moveMax = 1;
    this.attackMax = 4;
  }
}
