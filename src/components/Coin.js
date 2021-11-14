import ColorIcon from "./ColorIcon";

export default function Coin(props) {
  const {
    color,
    onClick,
    disabled,
    floated,
    children
  } = props;
  const coinContainerClassNames = ['coinContainer'];
  if (floated) {
    coinContainerClassNames.push(`floated ${props.floated}`);
  }
  const circleClassNames = ['circle', color];
  if (disabled) {
    circleClassNames.push('disabled');
  } else if (onClick) {
    circleClassNames.push('selectable');
  }
  return (
    <div className={coinContainerClassNames.join(" ")}>
      <div
        className={circleClassNames.join(" ")}
        onClick={() => { onClick && !disabled ? onClick(color) : void (0) }}
      >
        {children}
      </div>
      <ColorIcon color={color} size={'small'} />
    </div>
  );
}