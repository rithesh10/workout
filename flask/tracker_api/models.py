import time


class ExerciseState:
    def __init__(self):
        self.counter = 0
        self.stage = None
        self.last_rep_time = time.time()
        self.angles = {}
        self.feedback = "Align full body in camera"
