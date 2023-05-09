import {useEffect,useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { BsFillStarFill } from "react-icons/bs";

export const Home = () => {
    const [workouts,setWorkouts] =useState([]);
    const[savedWorkouts, setSavedWorkouts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const[cookies,_]= useCookies(["access_token"]);
    const userID=window.localStorage.getItem("userID");
    const navigate = useNavigate();

    const goToView = (workout_id) => {
        console.log(workout_id);
        
        navigate("/view",{state :{workoutID : workout_id ,page:"/"},
    });
      };

    useEffect(() => {
        const fetchWorkout = async() => {
            try {
              const response=  await axios.get("/workouts")
              const ratedWorkouts = response.data.map((workout) => {
               const ratings = workout.ratings.map((r) => r.rating);
               const avgRating =
            ratings.reduce((total, rating) => total + rating, 0) /
            ratings.length;
          return { ...workout, avgRating };
              });  
                setWorkouts(ratedWorkouts);
                
                console.log(ratedWorkouts);
                
            } catch (err) {
                console.error(err);
            }
        };


        const fetchSavedWorkouts = async() => {
            try {
              const response=  await axios.get(
                `/workouts/savedWorkouts/ids/${userID}`
                );
              
              
             
             setSavedWorkouts(response.data.savedWorkouts);
                
            } catch (err) {
                console.error(err);
            }
        };
        fetchWorkout();
         if(cookies.access_token)fetchSavedWorkouts();
        
    },[]);

const saveWorkout= async(workoutID)=>{
    try {
        const response=  await axios.put("/workouts",{workoutID,userID},{headers:{authorization : cookies.access_token}});
          
          setSavedWorkouts(response.data.savedWorkouts);
          
      } catch (err) {
          console.error(err);
      }
};
const isWorkoutSaved = (id) => savedWorkouts.includes(id);

const filteredWorkouts = workouts.filter((workout) =>
workout.name &&workout.name.toLowerCase().includes(searchTerm.toLowerCase())
);

    return (<div>
        <h1>Workouts</h1>
        <input
        type="text"
        placeholder="Search for a Workout..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
        <ul>
            {filteredWorkouts.map((workout)=>(
                <li key = {workout._id}>
                    <div>
                        <h2>{workout.name}</h2>
                        <h3>{workout.description}</h3>
                        {workout.avgRating === 0? (<>Not Rated</>) : (<>{workout.avgRating}<BsFillStarFill color ="#ffd700"/> </>)}
                        </div>
                        <div>
                        <button onClick={()=>saveWorkout(workout._id)}
                        disabled={isWorkoutSaved(workout._id)} 
                        >
                           { isWorkoutSaved(workout._id)? "Saved" : "Save"}
                        </button>
                        <button 
                        onClick={() => {
                            goToView(workout._id);
                        }} >
                            
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
}
