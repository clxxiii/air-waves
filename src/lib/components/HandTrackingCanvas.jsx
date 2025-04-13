import React, { useEffect, useRef, useContext } from "react";
import * as tf from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";
import "@tensorflow/tfjs-backend-webgl";
import { FingerStateContext } from "../context/FingerStateContext";

const HandTrackingCanvas = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const { fingerInRange, setFingerInRange } = useContext(FingerStateContext);

  const fingerJoints = {
    thumb: [0, 1, 2, 3, 4],
    indexFinger: [0, 5, 6, 7, 8],
    middleFinger: [0, 9, 10, 11, 12],
    ringFinger: [0, 13, 14, 15, 16],
    pinky: [0, 17, 18, 19, 20],
  };

  const drawHand = (predictions, ctx) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    if (predictions.length > 0) {
      predictions.forEach((prediction) => {
        const landmarks = prediction.landmarks;

        const thumbTip = landmarks[4]; 

        const fingers = [
          { name: "indexFinger", tip: landmarks[8] },
          { name: "middleFinger", tip: landmarks[12] },
          { name: "ringFinger", tip: landmarks[16] },
          { name: "pinky", tip: landmarks[20] },
        ];

        fingers.forEach(({ name, tip }) => {
          const distance = Math.sqrt(
            Math.pow(tip[0] - thumbTip[0], 2) +
              Math.pow(tip[1] - thumbTip[1], 2)
          );

          setFingerInRange((prevState) => {
            if (distance < 50 && !prevState[name]) {
              console.log(`${name} entered the range of the thumb!`);
              return { ...prevState, [name]: true };
            } else if (distance >= 50 && prevState[name]) {
              console.log(`${name} left the range of the thumb!`);
              return { ...prevState, [name]: false };
            }
            return prevState;
          });
        });

        ctx.beginPath();
        ctx.moveTo(landmarks[0][0], landmarks[0][1]);
        [1, 5, 9, 13, 17, 0].forEach((index) => {
          ctx.lineTo(landmarks[index][0], landmarks[index][1]);
        });
        ctx.closePath();
        ctx.fillStyle = "rgba(255, 192, 203, 1)";
        ctx.fill();

        for (let j = 0; j < Object.keys(fingerJoints).length; j++) {
          let finger = Object.keys(fingerJoints)[j];
          for (let k = 0; k < fingerJoints[finger].length - 1; k++) {
            const firstJointIndex = fingerJoints[finger][k];
            const secondJointIndex = fingerJoints[finger][k + 1];

            ctx.beginPath();
            ctx.moveTo(
              landmarks[firstJointIndex][0],
              landmarks[firstJointIndex][1]
            );
            ctx.lineTo(
              landmarks[secondJointIndex][0],
              landmarks[secondJointIndex][1]
            );
            ctx.strokeStyle = "plum";
            ctx.lineWidth = 4;
            ctx.stroke();
          }
        }

        for (let i = 0; i < landmarks.length; i++) {
          const x = landmarks[i][0];
          const y = landmarks[i][1];
          ctx.beginPath();
          ctx.arc(x, y, 6, 0, 3 * Math.PI);
          ctx.fillStyle = "gold";
          ctx.fill();
        }
      });
    }
  };

  useEffect(() => {
    const loadModelAndTrackHands = async () => {
      await tf.setBackend("webgl");
      const model = await handpose.load();
      const video = videoRef.current;

      const startVideo = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
          video.srcObject = stream;
          video.play();
          console.log("Camera started successfully.");
        } catch (error) {
          console.error("Error accessing the camera:", error);
        }
      };

      const detectHands = async () => {
        if (video.readyState === 4) {
          const ctx = canvasRef.current.getContext("2d");
          const predictions = await model.estimateHands(video, {
            flipHorizontal: false,
          });
          drawHand(predictions, ctx);
        }
        requestAnimationFrame(detectHands);
      };

      await startVideo();
      detectHands();
    };

    loadModelAndTrackHands();
  }, []);

  return (
    <div>
      <video
        ref={videoRef}
        style={{ display: "none" }}
        width="1920"
        height="480"
      />
      <canvas
        ref={canvasRef}
        width="1920"
        height="1080"
        style={{ border: "1px solid black" }}
      />
    </div>
  );
};

export default HandTrackingCanvas;
