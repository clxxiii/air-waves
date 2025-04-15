import cv2
import time
import math
import numpy as np
import pyautogui
import HandTracker as htm
from ctypes import cast, POINTER
from comtypes import CLSCTX_ALL
from pycaw.pycaw import AudioUtilities, IAudioEndpointVolume

# --------------------- CONFIGURATION ---------------------
CAM_WIDTH, CAM_HEIGHT = 640, 480
SMOOTHING = 3
TIP_IDS = [4, 8, 12, 16, 20]
pyautogui.FAILSAFE = False

# Audio setup
speakers = AudioUtilities.GetSpeakers()
interface = speakers.Activate(IAudioEndpointVolume._iid_, CLSCTX_ALL, None)
volumeCtrl = cast(interface, POINTER(IAudioEndpointVolume))
minVol = -63
maxVol = volumeCtrl.GetVolumeRange()[1]

volRangeMin, volRangeMax = 50, 200

# --------------------- SETUP ---------------------
cap = cv2.VideoCapture(0)
cap.set(3, CAM_WIDTH)
cap.set(4, CAM_HEIGHT)

detector = htm.HandTracker(max_hands=1, detection_confidence=0.85, tracking_confidence=0.8)

prevLocX, prevLocY = 0, 0
currLocX, currLocY = 0, 0
volBar = 400
gestureMode = ''
gestureActive = 0
prevTime = 0

def drawModeText(frame, text, pos=(250, 450), color=(0, 255, 255)):
    cv2.putText(frame, str(text), pos, cv2.FONT_HERSHEY_COMPLEX_SMALL, 3, color, 3)

# --------------------- MAIN LOOP ---------------------
while True:
    success, frame = cap.read()
    frame = detector.draw_hands(frame)
    landmarks = detector.get_landmark_positions(frame, draw_points=False)
    fingers = []

    # Finger detectio
    if landmarks:
        fingers.append(1 if landmarks[4][1] > landmarks[3][1] else 0)
        for i in range(1, 5):
            fingers.append(1 if landmarks[TIP_IDS[i]][2] < landmarks[TIP_IDS[i] - 2][2] else 0)

        print("Fingers:", fingers)

        if fingers == [0, 0, 0, 0, 0] and not gestureActive:
            gestureMode = 'None'
        elif fingers in ([0, 1, 0, 0, 0], [0, 1, 1, 0, 0]) and not gestureActive:
            gestureMode = 'Scroll'
            gestureActive = 1
        elif fingers == [1, 1, 0, 0, 0] and not gestureActive:
            gestureMode = 'Volume'
            gestureActive = 1
        elif fingers == [1, 1, 1, 1, 1] and not gestureActive:
            gestureMode = 'Cursor'
            gestureActive = 1

    # -------- SCROLLING --------
    if gestureMode == 'Scroll':
        drawModeText(frame, gestureMode)
        cv2.rectangle(frame, (200, 410), (245, 460), (255, 255, 255), cv2.FILLED)
        if fingers == [0, 1, 0, 0, 0]:
            drawModeText(frame, 'U', pos=(200, 455), color=(0, 255, 0))
            pyautogui.scroll(300)
        elif fingers == [0, 1, 1, 0, 0]:
            drawModeText(frame, 'D', pos=(200, 455), color=(0, 0, 255))
            pyautogui.scroll(-300)
        elif fingers == [0, 0, 0, 0, 0]:
            gestureMode = 'None'
            gestureActive = 0

    # -------- VOLUME CONTROL --------
    if gestureMode == 'Volume':
        drawModeText(frame, gestureMode)

        if landmarks:
            if fingers[-1] == 0:
                x1, y1 = landmarks[4][1:]
                x2, y2 = landmarks[8][1:]
                centerX, centerY = (x1 + x2) // 2, (y1 + y2) // 2

                cv2.circle(frame, (x1, y1), 10, (0, 215, 255), cv2.FILLED)
                cv2.circle(frame, (x2, y2), 10, (0, 215, 255), cv2.FILLED)
                cv2.line(frame, (x1, y1), (x2, y2), (0, 215, 255), 3)
                cv2.circle(frame, (centerX, centerY), 8, (0, 215, 255), cv2.FILLED)

                distance = math.hypot(x2 - x1, y2 - y1)
                volumeLevel = np.interp(distance, [volRangeMin, volRangeMax], [minVol, maxVol])
                volBar = np.interp(volumeLevel, [minVol, maxVol], [400, 150])
                volPercent = np.interp(volumeLevel, [minVol, maxVol], [0, 100])
                volumeCtrl.SetMasterVolumeLevel(volumeLevel, None)

                if distance < 50:
                    cv2.circle(frame, (centerX, centerY), 11, (0, 0, 255), cv2.FILLED)

                cv2.rectangle(frame, (30, 150), (55, 400), (209, 206, 0), 3)
                cv2.rectangle(frame, (30, int(volBar)), (55, 400), (215, 255, 127), cv2.FILLED)
                cv2.putText(frame, f'{int(volPercent)}%', (25, 430), cv2.FONT_HERSHEY_COMPLEX, 0.9, (209, 206, 0), 3)

            elif fingers[-1] == 1:
                gestureMode = 'None'
                gestureActive = 0

    # -------- CURSOR CONTROL --------
    if gestureMode == 'Cursor':
        drawModeText(frame, gestureMode)
        cv2.rectangle(frame, (110, 20), (620, 350), (255, 255, 255), 3)
        if fingers[1:] == [0, 0, 0, 0]:
            gestureMode = 'None'
            gestureActive = 0
        elif landmarks:
            xIndex, yIndex = landmarks[8][1:]
            screenWidth, screenHeight = pyautogui.size()
            targetX = int(np.interp(xIndex, [110, 620], [screenWidth - 1, 0]))
            targetY = int(np.interp(yIndex, [20, 350], [0, screenHeight - 1]))

            currLocX = prevLocX + (targetX - prevLocX) / SMOOTHING
            currLocY = prevLocY + (targetY - prevLocY) / SMOOTHING
            pyautogui.moveTo(currLocX, currLocY)
            prevLocX, prevLocY = currLocX, currLocY

            cv2.circle(frame, (xIndex, yIndex), 7, (255, 255, 255), cv2.FILLED)
            cv2.circle(frame, (landmarks[4][1], landmarks[4][2]), 10, (0, 255, 0), cv2.FILLED)

            if fingers[0] == 0:
                cv2.circle(frame, (landmarks[4][1], landmarks[4][2]), 10, (0, 0, 255), cv2.FILLED)
                print("Click!")
                pyautogui.click()

    if fingers == [1, 1, 1, 1, 0]:
        print("Pinky-only gesture detected! Sending 's' key...")
        pyautogui.press("s")
        time.sleep(0.3)
        cap.release()
        cv2.destroyAllWindows()
        break

    #Display FPS
    currTime = time.time()
    fps = 1 / ((currTime + 0.01) - prevTime)
    prevTime = currTime
    cv2.putText(frame, f'FPS:{int(fps)}', (480, 50), cv2.FONT_ITALIC, 1, (255, 0, 0), 2)

    cv2.imshow('Hand LiveFeed', frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break
