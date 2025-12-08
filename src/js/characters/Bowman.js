import Character from '../Character.js';

export default class Bowman extends Character {
  constructor(level) {
    super(level, 'bowman');
    this.attack = 25;
    this.defence = 25;
    this.moveMax = 2;
    this.attackMax = 2;
  }
}
