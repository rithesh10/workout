import { useState } from 'react';
import axios from 'axios';
import config from '../../../config/config';
import BackButton from '../../../components/BackButton';
import { Button } from '../../../components/Button';

export default function WorkoutPlan() {
  const [formData, setFormData] = useState({
    age: '',
    height: '',
    weight:'',
    FitnessGoal: '',
    FitnessLevel: '',
    message: ''
  });
  const [workoutPlan, setworkoutPlan] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.FitnessGoal || !formData.FitnessLevel || !formData.message) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      setError('');
      setIsLoading(true);

      const accessToken = localStorage.getItem('accessToken'); // Get token from localStorage

      const response = await axios.post(
        `${config.backendUrl}/generate-workout`, // Replace with your backend URL
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response.data);
      console.log(response.data.data);

      setworkoutPlan(response.data.data);
    } catch (err) {
      setError('Failed to generate diet plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  console.log(workoutPlan);
  
  

  return (
    <div className="w-full flex flex-col items-center justify-center py-6 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
    <div className="w-full max-w-4xl mb-4">
      <BackButton />
    </div>
    <h1 className="text-3xl font-bold text-foreground mb-8 text-center">Create Your Workout Plan</h1>
  
    {/* Form Section */}
    <div className="rounded-xl shadow-lg p-6 w-full bg-card border border-border max-w-4xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-input bg-background text-foreground rounded-md focus:ring-primary focus:border-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Height (cm)</label>
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-input bg-background text-foreground rounded-md focus:ring-primary focus:border-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Weight</label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-input bg-background text-foreground rounded-md focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Fitness Goal</label>
            <input
              type="text"
              name="FitnessGoal"
              value={formData.FitnessGoal}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-input bg-background text-foreground rounded-md focus:ring-primary focus:border-primary"
              placeholder="e.g., muscle gain"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Fitness Level</label>
            <input
              type="text"
              name="FitnessLevel"
              value={formData.FitnessLevel}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-input bg-background text-foreground rounded-md focus:ring-primary focus:border-primary"
              placeholder="e.g., beginner"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Message</label>
            <input
              type="text"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-input bg-background text-foreground rounded-md focus:ring-primary focus:border-primary"
              placeholder="Request specifics, e.g., a workout plan"
              required
            />
          </div>
        </div>
        {error && <p className="text-destructive text-sm">{error}</p>}
        <Button
          type="submit"
          isLoading={isLoading}
          className="bg-gradient-to-r from-indigo-600 to-purple-700 hover:opacity-90"
        >
          Generate Workout Plan
        </Button>
      </form>
    </div>
  
    {/* Display Diet Plan */}
    {workoutPlan && (
      <div className="bg-card border border-border rounded-lg shadow-lg mt-12 w-full max-w-4xl p-6">
        <h2 className="text-2xl font-bold text-center text-foreground mb-6">Workout Plan for {formData.FitnessGoal}</h2>
        <div className="space-y-8">
          {workoutPlan.dailyWorkouts.map((workout, index) => (
            <div className="bg-accent/10 p-5 rounded-lg shadow-sm border border-border" key={index}>
              <h3 className="text-xl font-semibold text-primary">{workout.day}</h3>
              <ul className="mt-4 space-y-3">
                {workout.exercises.map((exercise) => (
                  <li key={exercise._id} className="flex justify-between items-center text-muted-foreground">
                    <span className="font-medium text-foreground">{exercise.name}</span>
                    <span>{exercise.sets}</span>
                    <span>{exercise.reps} Reps</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>  
    )}
  </div>
  
  );
}
