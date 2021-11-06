import Price from "./Price";

class Mine {
  constructor(color, points, white, blue, green, red, black) {
    this.color = color;
    this.points = points;
    this.price = new Price(white, blue, green, red, black);
  }
}

export default Mine;