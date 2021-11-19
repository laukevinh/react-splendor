function History(props) {
  const { status, moves } = props;
  return (
    <>
      <div>{status}</div>
      <ol>{moves}</ol>
    </>
  );
}

export default History;