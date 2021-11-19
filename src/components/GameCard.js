import { Card } from 'semantic-ui-react';
import renderPrice from '../utils';
import ColorIcon from './ColorIcon';

export default function GameCard(props) {
  const {
    card,
    size
  } = props;
  let classNames = [];
  if (card) {
    classNames.push(card.color);
  }
  if (size) {
    classNames.push(size);
  }
  return (
    <Card className={size} {...props}>
      {
        card !== null &&
        <Card.Content className={classNames.join(" ")}>
          <ColorIcon
            color={card.color}
            floated={'left'}
            size={size || 'medium'}
          />
          <Card.Header textAlign="right" className={"pointValue"}>
            {card.points}
          </Card.Header>
          <Card.Description>
            {renderPrice(card.price, "coin")}
          </Card.Description>
        </Card.Content>
      }
    </Card>
  );
}