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

        const fingerIndices = {
          indexFinger: 8,
          middleFinger: 12,
          ringFinger: 16,
          pinky: 20,
        };

        Object.entries(fingerIndices).forEach(([name, index]) => {
          const tip = landmarks[index];
          const distance =
            (tip[0] - thumbTip[0]) * (tip[0] - thumbTip[0]) +
            (tip[1] - thumbTip[1]) * (tip[1] - thumbTip[1]);

          setFingerInRange((prevState) => {
            const inRange = distance < 2500; 
            if (prevState[name] !== inRange) {
              if (inRange) {
                console.log(`${name} entered the range of the thumb!`);
              } else {
                console.log(`${name} left the range of the thumb!`);
              }
              return { ...prevState, [name]: inRange };
            }
            return prevState;
          });
        });
      });
    }
  };

  useEffect(() => {
    const loadModelAndTrackHands = async () => {
      try {
        await tf.setBackend("webgl");
        const model = await handpose.load();
        const video = document.createElement("video");
        video.autoplay = true;

        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter((device) => device.kind === "videoinput");

        if (videoDevices.length === 0) {
          console.error("No video input devices found.");
          return;
        }

        const selectedDeviceId = videoDevices[1]?.deviceId || videoDevices[0].deviceId;
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: { exact: selectedDeviceId } },
        });

        video.srcObject = stream;

        let frameCount = 0;
        const detectHands = async () => {
          if (video.readyState === 4 && frameCount % 2 === 0) {
            const predictions = await model.estimateHands(video, {
              flipHorizontal: false,
            });
            processHandData(predictions);
          }
          frameCount++;
          requestAnimationFrame(detectHands);
        };

        detectHands();

        return () => {
          const tracks = video.srcObject?.getTracks();
          tracks?.forEach((track) => track.stop());
        };
      } catch (error) {
        console.error("Cant access video", error);
      }
    };

    loadModelAndTrackHands();
  }, []);

  return null;
};

export default HandTrackingCanvas;
