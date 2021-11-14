export default function DeckCard(props) {
  const {
    size,
    fluid,
    onClick,
    disabled,
    children
  } = props;
  let classNames = ['deck-card', 'beige'];
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
  if (children) {

  }
  return (
    <div className={classNames.join(" ")} {...props}>
      <div>{'...'}</div>
      {
        children &&
        <div>{children}</div>
      }
    </div>
  );
}