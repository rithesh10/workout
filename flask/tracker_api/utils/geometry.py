import numpy as np

from tracker_api.settings import EMA_ALPHA, VISIBILITY_THRESHOLD


def calculate_angle(a, b, c):
    a = np.array(a)
    b = np.array(b)
    c = np.array(c)
    radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - np.arctan2(a[1] - b[1], a[0] - b[0])
    angle = np.abs(radians * 180.0 / np.pi)
    if angle > 180.0:
        angle = 360.0 - angle
    return angle


def lm_xy(landmarks, idx):
    point = landmarks[idx]
    return [point.x, point.y]


def lm_vis(landmarks, idx):
    return getattr(landmarks[idx], "visibility", 0.0)


def all_visible(landmarks, indices, threshold=VISIBILITY_THRESHOLD):
    return all(lm_vis(landmarks, idx) >= threshold for idx in indices)


def smooth_angle(state, key, value):
    prev = state.angles.get(key)
    if prev is None:
        state.angles[key] = value
        return value
    smoothed = (EMA_ALPHA * value) + ((1.0 - EMA_ALPHA) * prev)
    state.angles[key] = smoothed
    return smoothed
