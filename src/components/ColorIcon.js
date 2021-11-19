import { WHITE, BLUE, GREEN, RED, BLACK, WILD } from "../constants/colors";
import whiteIcon from '../assets/white.png';
import blueIcon from '../assets/blue.png';
import greenIcon from '../assets/green.png';
import redIcon from '../assets/red.png';
import blackIcon from '../assets/black.png';
import wildIcon from '../assets/wild.png';

export default function ColorIcon(props) {
  const { color, size, floated } = props;
  let imgSrc = null;
  if (color === WHITE) {
    imgSrc = whiteIcon;
  } else if (color === BLUE) {
    imgSrc = blueIcon;
  } else if (color === GREEN) {
    imgSrc = greenIcon;
  } else if (color === RED) {
    imgSrc = redIcon;
  } else if (color === BLACK) {
    imgSrc = blackIcon;
  } else if (color === WILD) {
    imgSrc = wildIcon;
  }
  const classNames = ['icon'];
  if (size) {
    classNames.push(size)
  }
  if (floated) {
    classNames.push(`floated ${floated}`)
  }
  return (
    <img className={classNames.join(" ")} src={imgSrc} />
  )
}