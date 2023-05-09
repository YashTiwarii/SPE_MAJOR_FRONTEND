import { useState } from "react";
import axios from "axios";
import {useNavigate} from 'react-router-dom'
import "../pages/create-workout.css"

import { useCookies } from "react-cookie";

export const CreateWorkout = () => {
    const navigate = useNavigate();
    const userID= window.localStorage.getItem("userID");
    const [cookies, _] = useCookies(["access_token"]);
    const[workout,setWorkout]=useState({
        name:"",
        description: "",
        exercises:[{
            exercise:"",
            sets: 0,
            reps: 0,
            weight: 0,
            stepsToPerform: "",}
            
        ],
        imageUrl: "",
        userOwner: userID,
    });

    

    const handleChange = (event) => {
        const{name,value} = event.target;
        setWorkout({...workout,[name] : value});
    };
    const handleExerciseChange = (index, event) => {
        const { name, value } = event.target;
        const exercises = [...workout.exercises];
        exercises[index][name] = value;
        setWorkout({ ...workout, exercises });
        
      };
      const addExercise = () => {
        setWorkout({
          ...workout,
          exercises: [
            ...workout.exercises,
            {
              exercise: "",
              sets: 0,
              reps: 0,
              weight: 0,
              stepsToPerform: "",
            },
          ],
        });
      };
      const handleSubmit= async(event) =>{
        event.preventDefault();
        try {
            await axios.post("/workouts", {...workout},{headers :{authorization: cookies.access_token}})
            alert("Workout Created");
            navigate("/");
        } catch (err) {
            console.error(err);
        }
      }
    
    return (<div className="create-workout">
        <h2>Create Workout</h2>
        <form onSubmit={handleSubmit}>
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" onChange={handleChange}/>
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description"  onChange={handleChange}  ></textarea>
            <label htmlFor="excercises">Excercises</label>
            {workout.exercises.map((exercise, index) => (
          <div key={index} className="box">
            <br/>
            <label htmlFor={`exercise-${index}`}>Exercise</label>
            
            <input
              type="text"
              id={`exercise-${index}`}
              name="exercise"
              value={exercise.exercise}
              onChange={(event) => handleExerciseChange(index, event)}
            />
            <br/>
            <label htmlFor={`sets-${index}`}>Sets</label>
            <input
              type="number"
              id={`sets-${index}`}
              name="sets"
              value={exercise.sets}
              onChange={(event) => handleExerciseChange(index, event)}
            />
            <br/>
            <label htmlFor={`reps-${index}`}>Reps</label>
            <input
              type="number"
              id={`reps-${index}`}
              name="reps"
              value={exercise.reps}
              onChange={(event) => handleExerciseChange(index, event)}
            />
            <br/>
            <label htmlFor={`weight-${index}`}>Weight</label>
            <input
              type="number"
              id={`weight-${index}`}
              name="weight"
              value={exercise.weight}
              onChange={(event) => handleExerciseChange(index, event)}
            />
            <br/>
            <label htmlFor={`steps-${index}`}>Steps to Perform</label>
            <textarea
              id={`steps-${index}`}
              name="stepsToPerform"
              value={exercise.stepsToPerform}
              onChange={(event) => handleExerciseChange(index, event)}
            />
          </div>
        ))}
            <button type="button" onClick={addExercise} >Add Excercise</button>
            <label htmlFor="imageUrl">Image Url</label>
            <input type="text" id="imageUrl" name ="imageUrl"  onChange={handleChange}/>
          <button type="submit">Create Workout</button>
        </form>
    </div>
    );
};

