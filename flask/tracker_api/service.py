import base64

import cv2
import numpy as np

from tracker_api.pose_processor import PoseProcessor
from tracker_api.settings import EXERCISE_NAMES


class TrackerService:
    def __init__(self):
        self.trackers = {name: PoseProcessor(name) for name in EXERCISE_NAMES}

    def health_payload(self):
        return {"status": "ok", "camera_source": "frontend_only"}

    def reset_counters(self):
        for tracker in self.trackers.values():
            tracker.reset()
        return {"message": "All counters reset"}

    def process_frame_payload(self, payload):
        base64_image = payload.get("image")
        exercise = payload.get("exercise")

        if not base64_image:
            raise ValueError("Missing image")
        if exercise not in self.trackers:
            raise ValueError("Invalid exercise")

        encoded_data = base64_image.split(",", 1)[1] if "," in base64_image else base64_image
        image_bytes = base64.b64decode(encoded_data)
        np_image = np.frombuffer(image_bytes, np.uint8)
        frame = cv2.imdecode(np_image, cv2.IMREAD_COLOR)

        if frame is None:
            raise ValueError("Invalid image payload")

        tracker = self.trackers[exercise]
        annotated_frame, reps, stage, detected, accuracy, feedback = tracker.process(frame)
        ok, buffer = cv2.imencode(".jpg", annotated_frame)
        if not ok:
            raise RuntimeError("Failed to encode annotated frame")

        annotated_b64 = base64.b64encode(buffer).decode("utf-8")
        return {
            "status": "frame processed",
            "exercise": exercise,
            "reps": reps,
            "stage": stage,
            "pose_detected": detected,
            "accuracy": round(accuracy, 2),
            "feedback": feedback,
            "annotated_image": f"data:image/jpeg;base64,{annotated_b64}",
        }
