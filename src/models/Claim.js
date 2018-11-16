export class Claim {
  constructor(id, type, value = '') {
    
    if(!type) {
      throw new Error('Claim type must not be null or empty!');
    }
    this.id = id;
    this.type = type;
    this.value = value;
  }
}