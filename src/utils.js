import 'semantic-ui-css/semantic.min.css';
import { Grid } from 'semantic-ui-react';

export default function renderPrice(price) {
  let prices = [];
  for (let [color, colorPrice] of Object.entries(price)) {
    if (colorPrice > 0) {
      prices.push(
        <Grid.Row>
          <div className={"coin " + color}>
            {colorPrice}
          </div>
        </Grid.Row>
      );
    }
  }
  return (prices);
}