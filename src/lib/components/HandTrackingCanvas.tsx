import {useEffect, useState} from "react";
import { useDistanceContext } from "../contexts";

const euclideanDistance = (p1: [number, number, number], p2: [number, number, number]) => {
  const differences = [p1[0] - p2[0], p1[1] - p2[1], p1[2] - p2[2]]
  const squareDiagonal = Math.sqrt(Math.pow(differences[0], 2) + Math.pow(differences[1], 2));
  const diagonal = Math.sqrt(Math.pow(squareDiagonal, 2) + Math.pow(differences[2], 2));
  return diagonal;
}

function HandTracker () {
  // const video = useRef<HTMLVideoElement | null>(null);
  const video = { current: document.createElement("video") };


  const [fingers, setFingers] = useState<[string, number, number][]>([]);
  const [started, start] = useState(false);
  const [distances, setDistances] = useDistanceContext();

  const toggleCamera = () => {
    if (started) {
      stopWebcam()
    } else {
      startWebcam()
    }
  }

  useEffect(toggleCamera, []);

  const stopWebcam = async () => {
    console.log("Stopping Webcam:")
    if (!video.current) return;

    video.current.pause();
    const tracks: MediaStreamTrack[] = video.current.srcObject?.getTracks();
    if (tracks) tracks.forEach((src) => src.stop());
    video.current.srcObject = null;
    start(false);
  }

  const startWebcam = async () => {
    console.log("Starting Webcam:")
    // Wait to load this javascript because it is beefy
    const hp = await import("@tensorflow-models/hand-pose-detection");

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(async (stream) => {
        if (!video.current) return;

        const detector = await hp.createDetector(
          hp.SupportedModels.MediaPipeHands,
          {
            maxHands: 1,
            runtime: "mediapipe",
            modelType: "full",
            solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/hands",
          },
        );

        const onFrame = async () => {
          if (!video.current) return;
          const predictions = await detector.estimateHands(video.current);
          if (predictions.length > 0) {

            // Set finger points for displaying on canvas
            const points: [string, number, number][] = predictions[0].keypoints
              .map((x) => [x.name ?? "", x.x, x.y]);
            setFingers(points);

            // Get distance from thumb for note activation
            if (predictions[0].keypoints3D) {
            const tips: [number, number, number][] = predictions[0].keypoints3D
              .filter(x => x.name?.endsWith("tip"))
              .map(x => [x.x, x.y, x.z ?? 0]);


            const distances = [
              euclideanDistance(tips[0], tips[1]),
              euclideanDistance(tips[0], tips[2]),
              euclideanDistance(tips[0], tips[3]),
              euclideanDistance(tips[0], tips[4]),
            ]

            setDistances(distances);
            }
          } else {
            setFingers([]);
            setDistances([]);
          }

          video.current.requestVideoFrameCallback(onFrame);
        };

        video.current.srcObject = stream;
        video.current.play().then(() => {
          video.current?.requestVideoFrameCallback(onFrame);
          start(true);
        });
      });
  };

  return (
    // <div>
    //   <div className="relative">
    //     <video className="absolute top-0 left-0"></video>
    //   </div>
    // </div>
    <></>
  );
}

export default HandTracker