import { useState, useEffect } from "react";
import axios from 'axios';
import React from "react";
import Spinner from "../../../components/Spinner";
import NotFound from "../../../components/NotFound";
import config from '../../../config/config';

const GetDietPlan = () => {
  const [dietPlan, setDietPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDietPlan = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.post(
          `${config.backendUrl}/get-diet`,
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setDietPlan(response.data.data);
      } catch (err) {
        console.error('Error fetching diet plan:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDietPlan();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (!dietPlan) {
    return <NotFound message="No diet plan found" />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Your Diet Plan</h1>
        <table className="w-full bg-gray-800 rounded-lg overflow-hidden shadow-lg">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-4"></th>
              <th className="px-6 py-4">Food Name</th>
              <th className="px-6 py-4">Quantity</th>
              <th className="px-6 py-4">Calories</th>
            </tr>
          </thead>
          <tbody>
            {dietPlan.dailyDiet.map((diet, dayIndex) => (
              <React.Fragment key={dayIndex}>
                <tr className="bg-gray-700 font-bold text-white">
                  <td colSpan="4" className="px-6 py-3 text-lg">
                    {diet.typeOfMeal}
                  </td>
                </tr>
                {diet.FoodItems.map((item, itemIndex) => (
                  <tr key={itemIndex} className="border-b border-gray-600 hover:bg-gray-700">
                    <td className="px-6 py-4"></td>
                    <td className="px-6 py-4">{item.foodName}</td>
                    <td className="px-6 py-4">{item.quantity}</td>
                    <td className="px-6 py-4">{item.calories}</td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GetDietPlan;