from tracker_api.utils.geometry import all_visible, calculate_angle, lm_vis, lm_xy, smooth_angle


def _best_side_triplet(landmarks, left_ids, right_ids):
    left_score = sum(lm_vis(landmarks, idx) for idx in left_ids)
    right_score = sum(lm_vis(landmarks, idx) for idx in right_ids)
    return left_ids if left_score >= right_score else right_ids


def handle_left_bicep_curl(landmarks, state, mp_pose):
    ids = [
        mp_pose.PoseLandmark.LEFT_SHOULDER.value,
        mp_pose.PoseLandmark.LEFT_ELBOW.value,
        mp_pose.PoseLandmark.LEFT_WRIST.value,
    ]
    if not all_visible(landmarks, ids):
        state.feedback = "Show full left arm"
        return

    angle = smooth_angle(
        state,
        "left_bicep",
        calculate_angle(lm_xy(landmarks, ids[0]), lm_xy(landmarks, ids[1]), lm_xy(landmarks, ids[2])),
    )
    if angle > 160:
        state.stage = "down"
        state.feedback = "Lower slowly"
    elif angle < 40 and state.stage == "down":
        state.stage = "up"
        state.counter += 1
        state.feedback = "Good rep"


def handle_right_bicep_curl(landmarks, state, mp_pose):
    ids = [
        mp_pose.PoseLandmark.RIGHT_SHOULDER.value,
        mp_pose.PoseLandmark.RIGHT_ELBOW.value,
        mp_pose.PoseLandmark.RIGHT_WRIST.value,
    ]
    if not all_visible(landmarks, ids):
        state.feedback = "Show full right arm"
        return

    angle = smooth_angle(
        state,
        "right_bicep",
        calculate_angle(lm_xy(landmarks, ids[0]), lm_xy(landmarks, ids[1]), lm_xy(landmarks, ids[2])),
    )
    if angle > 160:
        state.stage = "down"
        state.feedback = "Lower slowly"
    elif angle < 40 and state.stage == "down":
        state.stage = "up"
        state.counter += 1
        state.feedback = "Good rep"


def handle_squat(landmarks, state, mp_pose):
    left_ids = [
        mp_pose.PoseLandmark.LEFT_HIP.value,
        mp_pose.PoseLandmark.LEFT_KNEE.value,
        mp_pose.PoseLandmark.LEFT_ANKLE.value,
    ]
    right_ids = [
        mp_pose.PoseLandmark.RIGHT_HIP.value,
        mp_pose.PoseLandmark.RIGHT_KNEE.value,
        mp_pose.PoseLandmark.RIGHT_ANKLE.value,
    ]
    ids = _best_side_triplet(landmarks, left_ids, right_ids)
    if not all_visible(landmarks, ids):
        state.feedback = "Keep side profile visible"
        return

    angle = smooth_angle(
        state,
        "squat_knee",
        calculate_angle(lm_xy(landmarks, ids[0]), lm_xy(landmarks, ids[1]), lm_xy(landmarks, ids[2])),
    )
    if angle > 160:
        state.stage = "up"
        state.feedback = "Go down"
    elif angle < 90 and state.stage == "up":
        state.stage = "down"
        state.counter += 1
        state.feedback = "Good squat"


def handle_shoulder_press(landmarks, state, mp_pose):
    ids = [
        mp_pose.PoseLandmark.LEFT_SHOULDER.value,
        mp_pose.PoseLandmark.LEFT_ELBOW.value,
        mp_pose.PoseLandmark.LEFT_WRIST.value,
    ]
    if not all_visible(landmarks, ids):
        state.feedback = "Keep left arm in frame"
        return

    angle = smooth_angle(
        state,
        "left_press",
        calculate_angle(lm_xy(landmarks, ids[0]), lm_xy(landmarks, ids[1]), lm_xy(landmarks, ids[2])),
    )
    if angle < 90:
        state.stage = "down"
        state.feedback = "Press up"
    elif angle > 160 and state.stage == "down":
        state.stage = "up"
        state.counter += 1
        state.feedback = "Good rep"


def handle_push_up(landmarks, state, mp_pose):
    left_ids = [
        mp_pose.PoseLandmark.LEFT_SHOULDER.value,
        mp_pose.PoseLandmark.LEFT_ELBOW.value,
        mp_pose.PoseLandmark.LEFT_WRIST.value,
    ]
    right_ids = [
        mp_pose.PoseLandmark.RIGHT_SHOULDER.value,
        mp_pose.PoseLandmark.RIGHT_ELBOW.value,
        mp_pose.PoseLandmark.RIGHT_WRIST.value,
    ]
    ids = _best_side_triplet(landmarks, left_ids, right_ids)
    if not all_visible(landmarks, ids):
        state.feedback = "Keep shoulder-elbow-wrist visible"
        return

    angle = smooth_angle(
        state,
        "pushup_arm",
        calculate_angle(lm_xy(landmarks, ids[0]), lm_xy(landmarks, ids[1]), lm_xy(landmarks, ids[2])),
    )
    if angle > 160:
        state.stage = "up"
        state.feedback = "Go lower"
    elif angle < 70 and state.stage == "up":
        state.stage = "down"
        state.counter += 1
        state.feedback = "Good push-up"


def handle_side_plank(landmarks, state, mp_pose):
    ids = [
        mp_pose.PoseLandmark.LEFT_SHOULDER.value,
        mp_pose.PoseLandmark.LEFT_HIP.value,
        mp_pose.PoseLandmark.LEFT_ANKLE.value,
    ]
    if not all_visible(landmarks, ids):
        state.feedback = "Show shoulder-hip-ankle"
        return

    body_angle = smooth_angle(
        state,
        "side_plank",
        calculate_angle(lm_xy(landmarks, ids[0]), lm_xy(landmarks, ids[1]), lm_xy(landmarks, ids[2])),
    )
    if state.stage == "down" and body_angle >= 160:
        state.stage = "up"
        state.counter += 1
        state.feedback = "Strong hold"
    elif body_angle < 160:
        state.stage = "down"
        state.feedback = "Lift hips"


def handle_deadlift(landmarks, state, mp_pose):
    ids = [
        mp_pose.PoseLandmark.LEFT_SHOULDER.value,
        mp_pose.PoseLandmark.LEFT_HIP.value,
        mp_pose.PoseLandmark.LEFT_KNEE.value,
    ]
    if not all_visible(landmarks, ids):
        state.feedback = "Show side body clearly"
        return

    back_angle = smooth_angle(
        state,
        "deadlift_back",
        calculate_angle(lm_xy(landmarks, ids[0]), lm_xy(landmarks, ids[1]), lm_xy(landmarks, ids[2])),
    )
    if back_angle > 150:
        state.stage = "up"
        state.feedback = "Hinge down"
    elif back_angle < 90 and state.stage == "up":
        state.stage = "down"
        state.counter += 1
        state.feedback = "Good rep"


def handle_plank(landmarks, state, mp_pose):
    ids = [
        mp_pose.PoseLandmark.LEFT_SHOULDER.value,
        mp_pose.PoseLandmark.LEFT_HIP.value,
        mp_pose.PoseLandmark.LEFT_ANKLE.value,
    ]
    if not all_visible(landmarks, ids):
        state.feedback = "Align side view"
        return

    body_angle = smooth_angle(
        state,
        "plank_body",
        calculate_angle(lm_xy(landmarks, ids[0]), lm_xy(landmarks, ids[1]), lm_xy(landmarks, ids[2])),
    )
    if body_angle < 150:
        state.stage = "incorrect"
        state.feedback = "Keep body straight"
    else:
        state.stage = "hold"
        state.feedback = "Good plank"


def handle_lunge(landmarks, state, mp_pose):
    ids = [
        mp_pose.PoseLandmark.LEFT_HIP.value,
        mp_pose.PoseLandmark.LEFT_KNEE.value,
        mp_pose.PoseLandmark.LEFT_ANKLE.value,
    ]
    if not all_visible(landmarks, ids):
        state.feedback = "Show front leg fully"
        return

    knee_angle = smooth_angle(
        state,
        "lunge_knee",
        calculate_angle(lm_xy(landmarks, ids[0]), lm_xy(landmarks, ids[1]), lm_xy(landmarks, ids[2])),
    )
    if knee_angle > 160:
        state.stage = "up"
        state.feedback = "Step and drop"
    elif knee_angle < 90 and state.stage == "up":
        state.stage = "down"
        state.counter += 1
        state.feedback = "Good lunge"


def build_exercise_handlers():
    return {
        "left_bicep_curl": handle_left_bicep_curl,
        "right_bicep_curl": handle_right_bicep_curl,
        "squat": handle_squat,
        "shoulder_press": handle_shoulder_press,
        "push_up": handle_push_up,
        "side_plank": handle_side_plank,
        "deadlift": handle_deadlift,
        "plank": handle_plank,
        "lunge": handle_lunge,
    }
