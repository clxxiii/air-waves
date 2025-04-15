import React, { useEffect, useContext } from "react";
import * as tf from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";
import "@tensorflow/tfjs-backend-webgl";
import { FingerStateContext } from "../context/FingerStateContext";

const HandTrackingCanvas = () => {
  const { setFingerInRange } = useContext(FingerStateContext);

  const processHandData = (predictions) => {
    if (predictions.length > 0) {
      predictions.forEach((prediction) => {
        const landmarks = prediction.landmarks;
        const thumbTip = landmarks[4];

        const fingers = [
          { name: "indexFinger", tip: landmarks[8] },
          { name: "middleFinger", tip: landmarks[12] },
          { name: "ringFinger", tip: landmarks[16] },
          { name: "pinky", tip: landmarks[20] }
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
      });
    }
  };

  useEffect(() => {
    const loadModelAndTrackHands = async () => {
      await tf.setBackend("webgl");
      const model = await handpose.load();

      const video = document.createElement("video");
      video.style.display = "none";

      const startVideo = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true
          });
          video.srcObject = stream;
          await video.play();
          console.log("Camera started successfully.");
        } catch (error) {
          console.error("Error accessing the camera:", error);
        }
      };

      let frameCount = 0;
      const detectHands = async () => {
        if (video.readyState === 4 && frameCount % 2 === 0) {
          const predictions = await model.estimateHands(video, false);
          processHandData(predictions);
        }
        frameCount++;
        requestAnimationFrame(detectHands);
      };

      await startVideo();
      detectHands();

      return () => {
        const tracks = video.srcObject?.getTracks();
        tracks?.forEach((track) => track.stop());
        video.remove();
      };
    };

    loadModelAndTrackHands();
  }, []);

  return <></>;
};

export default HandTrackingCanvas;
