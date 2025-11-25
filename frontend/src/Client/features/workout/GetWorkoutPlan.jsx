import React, { useState, useEffect, createContext, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dumbbell, Search, User, Utensils, X, Menu } from 'lucide-react';
import axios from 'axios';
import Spinner from '../../../components/Spinner';
import PerformanceModal from './Performance';
import config from '../../../config/config';
import NotFound from '../../../components/NotFound';
import BackButton from '../../../components/BackButton';

// Context for search functionality
const SearchContext = createContext();

// Search Provider
const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchExercises = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.get(
        `${config.backendUrl}/get-exercises`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setExercises(response.data.data || []);
    } catch (err) {
      console.error('Error fetching exercises:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.length > 1) {
      const results = exercises.filter((exercise) =>
        exercise.name.toLowerCase().includes(query.toLowerCase()) ||
        exercise.muscleGroup.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleExerciseSelect = (exercise) => {
    navigate(`/getexercise`, { state: { exercise } });
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <SearchContext.Provider value={{ searchQuery, searchResults, handleSearch, handleExerciseSelect }}>
      {loading ? <Spinner/> : children}
    </SearchContext.Provider>
  );
};

// Custom Hook for using Search Context
const useSearch = () => {
  return useContext(SearchContext);
};

// Search Bar Component
const SearchBar = ({ className = '' }) => {
  const { searchQuery, searchResults, handleSearch, handleExerciseSelect } = useSearch();

  return (
    <div className={`relative w-full max-w-lg ${className}`}>
      <div className="flex items-center bg-gray-800 rounded-full p-2 w-full border border-gray-700">
        <Search className="text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search exercises..."
          className="bg-transparent w-full focus:outline-none text-white placeholder-gray-500"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {searchResults.length > 0 && (
        <div className="absolute w-full bg-gray-800 text-white shadow-lg rounded-b-lg mt-1 max-h-64 overflow-y-auto border border-gray-700 z-50">
          {searchResults.map((exercise) => (
            <div
              key={exercise.id}
              className="p-2 hover:bg-gray-700 cursor-pointer border-b border-gray-700 last:border-b-0"
              onClick={() => handleExerciseSelect(exercise)}
            >
              <div className="font-semibold">{exercise.name}</div>
              <div className="text-xs text-gray-400">{exercise.muscleGroup}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Workout Plan Component
const GetWorkoutPlan = ({ onOpenModal }) => {
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const handleOpen = (exercise) => {
    onOpenModal(exercise);
  };

  useEffect(() => {
    const fetchWorkoutPlan = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.post(
          `${config.backendUrl}/get-user-workout-plan`,
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setWorkoutPlan(response.data.data);
      } catch (err) {
        console.error('Error fetching workout plan:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkoutPlan();
  }, []);

  if (loading) return <NotFound/>;
  if (!workoutPlan) return <NotFound/>;

  return (
    <div className="flex justify-center items-center w-full my-10 text-gray-200 p-6">
      <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-6xl overflow-x-auto">
        <div className="flex justify-between items-center p-4">
           {/* Back button logic is handled by parent or global back button */}
        </div>
        <div className="text-center font-bold text-2xl text-white py-4">Current Workout Plan</div>
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="bg-gray-700 text-gray-200 uppercase">
            <tr>
              <th className="px-6 py-4">Day</th>
              <th className="px-6 py-4">Exercise</th>
              <th className="px-6 py-4">Performance</th>
              <th className="px-6 py-4">Sets</th>
              <th className="px-6 py-4">Reps</th>
            </tr>
          </thead>
          <tbody>
            {workoutPlan.dailyWorkouts.map((workout, dayIndex) => (
              <React.Fragment key={dayIndex}>
                <tr className="bg-gray-700 text-gray-100 font-bold">
                  <td colSpan="5" className="px-6 py-4 text-lg">
                    {workout.day}
                  </td>
                </tr>
                {workout.exercises.map((exercise, exerciseIndex) => (
                  <tr key={exerciseIndex} className="border-b border-gray-600 hover:bg-gray-700">
                    <td className="px-6 py-4"></td>
                    <td className="px-6 py-4">{exercise.name}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleOpen(exercise.name)}
                        className="px-3 py-2 bg-gradient-to-r from-indigo-400 to-purple-400 shadow-lg text-gray-200 rounded-lg shadow-lg hover:bg-gray-500 focus:outline-none border-none transition-all"
                      >
                        Add Performance
                      </button>
                    </td>
                    <td className="px-6 py-4">{exercise.sets}</td>
                    <td className="px-6 py-4">{exercise.reps}</td>
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

// Unified Component
export default function WorkoutPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [exerciseName, setExerciseName] = useState('');

  const openModal = (exercise) => {
    setExerciseName(exercise);
    setIsModalOpen(true);
  };

  return (
    <div className='w-full p-4'>
      <SearchProvider>
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
           <div className="self-start sm:self-center">
             <BackButton />
           </div>
           <SearchBar className="w-full sm:w-auto flex-1" />
        </div>
        
        <GetWorkoutPlan onOpenModal={openModal} />
        
        {isModalOpen && (
          <PerformanceModal
            exerciseName={exerciseName}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </SearchProvider>
    </div>
  );
}