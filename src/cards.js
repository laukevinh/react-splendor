var level0 = [
    ['black',0,1,1,1,1,0],
    ['black',0,1,2,1,1,0],
    ['black',0,2,2,0,1,0],
    ['black',0,0,0,1,3,1],
    ['black',0,0,0,2,1,0],
    ['black',0,2,0,2,0,0],
    ['black',0,0,0,3,0,0],
    ['black',1,0,4,0,0,0],
    ['blue',0,1,0,1,1,1],
    ['blue',0,1,0,1,2,1],
    ['blue',0,1,0,2,2,0],
    ['blue',0,0,1,3,1,0],
    ['blue',0,1,0,0,0,2],
    ['blue',0,0,0,2,0,2],
    ['blue',0,0,0,0,0,3],
    ['blue',1,0,0,0,4,0],
    ['white',0,0,1,1,1,1],
    ['white',0,0,1,2,1,1],
    ['white',0,0,2,2,0,1],
    ['white',0,3,1,0,0,1],
    ['white',0,0,0,0,2,1],
    ['white',0,0,2,0,0,2],
    ['white',0,0,3,0,0,0],
    ['white',1,0,0,4,0,0],
    ['green',0,1,1,0,1,1],
    ['green',0,1,1,0,1,2],
    ['green',0,0,1,0,2,2],
    ['green',0,1,3,1,0,0],
    ['green',0,2,1,0,0,0],
    ['green',0,0,2,0,2,0],
    ['green',0,0,0,0,3,0],
    ['green',1,0,0,0,0,4],
    ['red',0,1,1,1,0,1],
    ['red',0,2,1,1,0,1],
    ['red',0,2,0,1,0,2],
    ['red',0,1,0,0,1,3],
    ['red',0,0,2,1,0,0],
    ['red',0,2,0,0,2,0],
    ['red',0,3,0,0,0,0],
    ['red',1,4,0,0,0,0],
];

var level1 = [
    ['black',1,3,2,2,0,0],
    ['black',1,3,0,3,0,2],
    ['black',2,0,1,4,2,0],
    ['black',2,0,0,5,3,0],
    ['black',2,5,0,0,0,0],
    ['black',3,0,0,0,0,6],
    ['blue',1,0,2,2,3,0],
    ['blue',1,0,2,3,0,3],
    ['blue',2,5,3,0,0,0],
    ['blue',2,2,0,0,1,4],
    ['blue',2,0,5,0,0,0],
    ['blue',3,0,6,0,0,0],
    ['white',1,0,0,3,2,2],
    ['white',1,2,3,0,3,0],
    ['white',2,0,0,1,4,2],
    ['white',2,0,0,0,5,3],
    ['white',2,0,0,0,5,0],
    ['white',3,6,0,0,0,0],
    ['green',1,3,0,2,3,0],
    ['green',1,2,3,0,0,2],
    ['green',2,4,2,0,0,1],
    ['green',2,0,5,3,0,0],
    ['green',2,0,0,5,0,0],
    ['green',3,0,0,6,0,0],
    ['red',1,2,0,0,2,3],
    ['red',1,0,3,0,2,3],
    ['red',2,1,4,2,0,0],
    ['red',2,3,0,0,0,5],
    ['red',2,0,0,0,0,5],
    ['red',3,0,0,0,6,0]
];

var level2 = [
    ['black',3,3,3,5,3,0],
    ['black',4,0,0,0,7,0],
    ['black',4,0,0,3,6,3],
    ['black',5,0,0,0,7,3],
    ['blue',3,3,0,3,3,5],
    ['blue',4,7,0,0,0,0],
    ['blue',4,6,3,0,0,3],
    ['blue',5,7,3,0,0,0],
    ['white',3,0,3,3,5,3],
    ['white',4,0,0,0,0,7],
    ['white',4,3,0,0,3,6],
    ['white',5,3,0,0,0,7],
    ['green',3,5,3,0,3,3],
    ['green',4,0,7,0,0,0],
    ['green',4,3,6,3,0,0],
    ['green',5,0,7,3,0,0],
    ['red',3,3,5,3,0,3],
    ['red',4,0,0,7,0,0],
    ['red',4,0,3,6,3,0],
    ['red',5,0,0,7,3,0],
];

export class Price {
  constructor(white, blue, green, red, black) {
    this.white = white;
    this.blue = blue;
    this.green = green;
    this.red = red;
    this.black = black;
  }
}

class CardBase {
  constructor(color, points, white, blue, green, red, black) {
    this.color = color;
    this.points = points;
    this.price = new Price(white, blue, green, red, black);
  }
}

function convertLevel(level) {
  return level.map(([color, points, white, blue, green, red, black]) => new CardBase(color, points, white, blue, green, red, black));
}

var decks = [convertLevel(level0), convertLevel(level1), convertLevel(level2)];

export default decks;