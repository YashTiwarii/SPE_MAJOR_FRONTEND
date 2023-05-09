import {useEffect,useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


export const SavedWorkouts = () => {
    const [savedWorkouts,setSavedWorkouts] =useState([]);
   const navigate = useNavigate();
    
    const userID=window.localStorage.getItem("userID");

    const removeWorkout = async (workout) => {
        try {
            const response = await axios.delete("/workouts",{
                data :{
                    workoutID:workout._id,
                    userID: userID,
                },
            });
            setSavedWorkouts(response.data.savedWorkouts);
        } catch (err) {
            console.log(err);
        }
    };
    const goToView =(workout_id) => { 
        console.log(workout_id);
        navigate("/view",{
            state :{workoutID:workout_id ,page:"/saved-workouts"},
        });
    };
    useEffect(() => {
       
      const fetchSavedWorkout = async() => {
            try {
              const response=  await axios.get(`/workouts/savedWorkouts/${userID}`);
              setSavedWorkouts(response.data.savedWorkouts);  
              console.log(response.data);
                
                
            } catch (err) {
                console.error(err);
            }
        };
        
        fetchSavedWorkout();
    },[]);




    return (<div>
        <h1>Saved Workouts</h1>
        <ul>
            {savedWorkouts.map((workout)=>(
                <li key = {workout._id}>
                    <div>
                        <h2>{workout.name}</h2>
                        <h3>{workout.description}</h3>
                        <button 
                        onClick={() => {removeWorkout(workout);
                        }}
                        >
                            Remove
                        </button>
                        <button
                        onClick={()=>{
                            goToView(workout._id);
                        }}
                        >
                            {" "}
                            View{" "}
                        </button>
                        </div>
                        
                   <img src={workout.imageUrl} alt={workout.name}/>
                </li>
            ))}
        </ul>
        </div>
    );
};
