import cv2
import time
from HandTracker import HandTracker


def run_demo():
    previous_time = 0
    capture = cv2.VideoCapture(0)
    hand_tracker = HandTracker(max_hands=2)

    while True:
        success, frame = capture.read()
        frame = hand_tracker.draw_hands(frame)
        landmarks = hand_tracker.get_landmark_positions(frame, include_z=True, draw_points=False)

        if landmarks:
            print(landmarks[4])

        current_time = time.time()
        fps = 1 / (current_time - previous_time)
        previous_time = current_time

        cv2.putText(frame, str(int(fps)), (10, 70), cv2.FONT_HERSHEY_PLAIN, 3, (255, 0, 255), 3)
        cv2.imshow("Hand Tracker", frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break


if __name__ == "__main__":
    run_demo()
