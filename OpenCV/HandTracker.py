import cv2
import mediapipe as mp


class HandTracker:
    def __init__(self, detect_static=False, max_hands=2, detection_confidence=0.5, tracking_confidence=0.5):
        self.detect_static = detect_static
        self.max_hands = max_hands
        self.detection_confidence = detection_confidence
        self.tracking_confidence = tracking_confidence

        self.mp_hands = mp.solutions.hands
        self.hand_model = self.mp_hands.Hands(
            static_image_mode=self.detect_static,
            max_num_hands=self.max_hands,
            min_detection_confidence=self.detection_confidence,
            min_tracking_confidence=self.tracking_confidence
        )
        self.drawer = mp.solutions.drawing_utils
        self.hand_results = None

    def draw_hands(self, frame, draw_landmarks=True):
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        self.hand_results = self.hand_model.process(rgb)

        if self.hand_results.multi_hand_landmarks:
            for hand_landmarks in self.hand_results.multi_hand_landmarks:
                if draw_landmarks:
                    self.drawer.draw_landmarks(frame, hand_landmarks, self.mp_hands.HAND_CONNECTIONS)

        return frame

    def get_landmark_positions(self, frame, hand_index=0, draw_points=True, point_color=(255, 0, 255), include_z=False):
        landmark_list = []

        if self.hand_results and self.hand_results.multi_hand_landmarks:
            selected_hand = self.hand_results.multi_hand_landmarks[hand_index]
            height, width, _ = frame.shape

            for idx, landmark in enumerate(selected_hand.landmark):
                x = int(landmark.x * width)
                y = int(landmark.y * height)

                if include_z:
                    z = round(landmark.z, 3)
                    landmark_list.append([idx, x, y, z])
                else:
                    landmark_list.append([idx, x, y])

                if draw_points:
                    cv2.circle(frame, (x, y), 5, point_color, cv2.FILLED)

        return landmark_list
