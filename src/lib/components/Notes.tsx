function Notes(props: { chart: ChartFile.Chart }) {
  const { chart } = props;

  return <>{chart.notes.expert?.map((note, k) => <mesh key={k}></mesh>)}</>;
}

export default Notes;
