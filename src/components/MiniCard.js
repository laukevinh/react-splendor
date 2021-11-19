export default function MiniCard(props) {
  const {
    size,
    color,
    fluid,
    onClick,
    disabled,
    children
  } = props;
  let classNames = ['mini-card'];
  if (color) {
    classNames.push(color);
  } else {
    classNames.push('beige');
  }
  if (size) {
    classNames.push(size);
  }
  if (fluid) {
    classNames.push('fluid');
  }
  if (onClick) {
    classNames.push('selectable');
  }
  if (disabled) {
    classNames.push('disabled');
  }
  return (
    <div className={classNames.join(" ")} {...props}>
      {children}
    </div>
  );
}