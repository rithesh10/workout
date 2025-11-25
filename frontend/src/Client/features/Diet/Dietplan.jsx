import { useState } from 'react';
import axios from 'axios';
import config from '../../../config/config';
import BackButton from '../../../components/BackButton';
import { Button } from '../../../components/Button';

export default function DietPlan() {
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    monthlyBudget: '',
    FitnessGoal: '',
    FitnessLevel: '',
    message: ''
  });
  const [dietPlan, setDietPlan] = useState(null);
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
        `${config.backendUrl}/generate-diet`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setDietPlan(response.data.data);
    } catch (err) {
      setError('Failed to generate diet plan. Please try again.');
      console.log(err);
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

  return (
    <div className="w-full flex flex-col items-center justify-center py-6 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
    <div className="w-full max-w-4xl mb-4">
      <BackButton />
    </div>
    <h1 className="text-3xl font-bold text-foreground mb-8 text-center">Create Your Diet Plan</h1>
  
    {/* Form Section */}
    <div className="bg-card border border-border rounded-xl shadow-lg p-6 w-full max-w-4xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Weight (kg)</label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
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
            <label className="block text-sm font-medium text-muted-foreground mb-2">Monthly Budget</label>
            <input
              type="number"
              name="monthlyBudget"
              value={formData.monthlyBudget}
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
              placeholder="Request specifics, e.g., a balanced diet"
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
          Generate Diet Plan
        </Button>
      </form>
    </div>
  
    {/* Display Diet Plan */}
    {dietPlan && (
      <div className="bg-card border border-border rounded-lg shadow-lg mt-12 w-full max-w-4xl p-6">
        <h2 className="text-2xl font-bold text-center text-foreground mb-6">
          Diet Plan for {formData.FitnessGoal}
        </h2>
        <div className="space-y-8">
          {dietPlan.dailyDiet.map((meal, index) => (
            <div
              className="bg-accent/10 p-5 rounded-lg shadow-sm border border-border"
              key={index}
            >
              <h3 className="text-xl font-semibold text-primary">
                {meal.typeOfMeal}
              </h3>
              <ul className="mt-4 space-y-3">
                {meal.FoodItems.map((foodItem) => (
                  <li
                    key={foodItem._id}
                    className="flex justify-between items-center text-muted-foreground"
                  >
                    <span className="font-medium text-foreground">{foodItem.foodName}</span>
                    <span>{foodItem.quantity}</span>
                    <span>{foodItem.calories} Calories</span>
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
