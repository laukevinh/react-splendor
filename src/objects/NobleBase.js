import Price from "./Price";

export class NobleBase {
  constructor(points, white, blue, green, red, black, isDisplayed) {
    this.points = points;
    this.price = new Price(white, blue, green, red, black);
    this.isDisplayed = isDisplayed;
  }
}