import cv2
import mediapipe as mp
import numpy as np

from tracker_api.exercise_handlers import build_exercise_handlers
from tracker_api.models import ExerciseState


class PoseProcessor:
    def __init__(self, exercise_name):
        self.exercise_name = exercise_name
        self.state = ExerciseState()
        self.mp_pose = mp.solutions.pose
        self.mp_drawing = mp.solutions.drawing_utils
        self.handlers = build_exercise_handlers()
        self.pose = self.mp_pose.Pose(
            model_complexity=1,
            smooth_landmarks=True,
            min_detection_confidence=0.6,
            min_tracking_confidence=0.6,
        )

    def reset(self):
        self.state = ExerciseState()

    def _draw_overlay(self, frame, accuracy):
        cv2.rectangle(frame, (8, 8), (390, 150), (20, 20, 20), -1)
        cv2.putText(
            frame,
            f"Exercise: {self.exercise_name}",
            (18, 35),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            (0, 255, 255),
            2,
        )
        cv2.putText(
            frame,
            f"Reps: {self.state.counter}",
            (18, 65),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.8,
            (245, 117, 16),
            2,
        )
        cv2.putText(
            frame,
            f"Stage: {self.state.stage or '-'}",
            (18, 95),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.8,
            (245, 117, 16),
            2,
        )
        cv2.putText(
            frame,
            f"Accuracy: {accuracy:.1f}%",
            (18, 125),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            (0, 220, 0),
            2,
        )

    def process(self, frame):
        image_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.pose.process(image_rgb)
        accuracy = 0.0

        if results.pose_landmarks:
            landmarks = results.pose_landmarks.landmark
            handler = self.handlers.get(self.exercise_name)
            if handler:
                handler(landmarks, self.state, self.mp_pose)

            visibility_values = [getattr(lm, "visibility", 0.0) for lm in landmarks]
            accuracy = float(np.mean(visibility_values)) * 100.0

            self.mp_drawing.draw_landmarks(
                frame,
                results.pose_landmarks,
                self.mp_pose.POSE_CONNECTIONS,
                self.mp_drawing.DrawingSpec(color=(0, 255, 0), thickness=4, circle_radius=4),
                self.mp_drawing.DrawingSpec(color=(255, 120, 0), thickness=3, circle_radius=3),
            )
        else:
            self.state.feedback = "No full pose detected"

        self._draw_overlay(frame, accuracy)
        return frame, self.state.counter, self.state.stage, bool(results.pose_landmarks), accuracy, self.state.feedback
