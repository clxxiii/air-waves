import { ThreeElements } from "@react-three/fiber";
import { useContext, useEffect, useState } from "react";
import { SettingsContext, TimePositionContext } from "../contexts";

function SingleNote(
  props: ThreeElements["mesh"] & { color: number; fade: number }
) {
  return (
    <mesh {...props}>
      <sphereGeometry args={[0.5]} />
      <meshStandardMaterial
        color={props.color}
        opacity={props.fade}
        transparent={true}
      />
    </mesh>
  );
}

function Note(props: { note: ChartFile.Note }) {
  const { note } = props;
  const [timePosition] = useContext(TimePositionContext);
  const settings = useContext(SettingsContext);

  const [z, setZ] = useState(0);
  const [fade, setFade] = useState(1);

  useEffect(() => {
    const a =
      -1 *
      settings.approachDistance *
      ((note.ms - timePosition) / settings.noteSpeed);
    setFade(1 - Math.max(a - settings.fadeDistance, 0));
    setZ(a);
  }, [settings, note, timePosition]);

  return (
    <>
      {note.ms < timePosition + settings.noteSpeed && (
        <>
          {note.notes[0] && (
            <SingleNote color={0x54bed8} fade={fade} position={[-4, -1, z]} />
          )}
          {note.notes[1] && (
            <SingleNote color={0xe15971} fade={fade} position={[-1.3, -1, z]} />
          )}
          {note.notes[2] && (
            <SingleNote color={0xffe113} fade={fade} position={[1.3, -1, z]} />
          )}
          {note.notes[3] && (
            <SingleNote color={0x8f48b7} fade={fade} position={[4, -1, z]} />
          )}
        </>
      )}
    </>
  );
}

export default Note;
