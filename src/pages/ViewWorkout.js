import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import ReactStars from "react-rating-stars-component";
import { BsFillStarFill } from "react-icons/bs";
import { useCookies } from "react-cookie";


export const ViewWorkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const workoutID =location.state.workoutID;
    const page = location.state.page;
    const userID = window.localStorage.getItem("userID");
    const [workout,setWorkout] = useState([]);
    const [comment,setComment] = useState("");
    const [star ,setStar] = useState(0);
    const [cookies, _] = useCookies(["access_token"]);
    
      


    const handleStars = async (e) => {
        setStar(e);
        alert(`${e}` + " stars given");
        try {
            const response = await axios.put(
              "workouts/rate",{
              workoutID : workoutID,
                userID: userID,
                rating: e

            },
            {
              headers: { authorization: cookies.access_token },
            }
            );
        } catch (err) {
            console.error(err);
        }

    };
    const goBack = () => {
      navigate(page);
    };
  
      const submitComment = async () => {
        if (comment !== "") {
            try {
              const cmt = {
                workoutID : workoutID,
                userID: userID,
                comment: comment,
              };
              const response = await axios.put(
                "workouts/comment",
                cmt,
                {
                  headers: { authorization: cookies.access_token },
                }
              );
              const comments = [
                ...workout.comments,
                {
                  user: userID,
                  comment: comment,
                  _id: workoutID,
                },
              ];
              console.log(comments);
              setWorkout({ ...workout, comments });
              console.log(workout);
            } catch (err) {
              console.error(err);
            }
          }
      };

      
      useEffect(() => {
        const fetchWorkout = async () => {
          try {
            const response = await axios.get(
              `/workouts/get-workout/${workoutID}`
            );
            console.log(response.data);
            setWorkout(response.data);
          } catch (err) {
            console.log(err);
          }
        };
        fetchWorkout();
      }, []);
      

      //if already rated!!
      useEffect(() => {
        if (workout && workout.ratings) {
          const ratingObject = workout.ratings.find(
            (r) => r.user.toString() === userID
          );
          if (ratingObject) {
            console.log("RatingObj");
            console.log(ratingObject.rating);
            setStar(ratingObject.rating);
            console.log("stars value = ");
            console.log(star);
          }
        }
      }, [workout]);
    
      return (
        <div>
          
          <h1>Workout</h1>
          
          <ul >
            <li key={workout._id}>
              <div>
                <h2>{workout.name}</h2>
                <button
                   onClick={() => {
                    goBack();
                  }}
                >
                  Back
                </button>
              </div>
              <div className="discription">
                <h4>Description</h4>
                <p>{workout.description}</p>
              </div>
              <img src={workout.imageUrl} alt={workout.name} />
              <h4>Exercises</h4>
        <ul>
          {workout && workout.exercises &&
          workout.exercises.map((exercise, idx) => (
            <li key={idx}>
              <h5>{exercise.exercise}</h5>
              <p>{`Sets: ${exercise.sets} Reps: ${exercise.reps} Weight: ${exercise.weight}`}</p>
              <p>{exercise.stepsToPerform}</p>
            </li>
          ))}
        </ul> 
               
              <h4>Comments</h4>
              {workout.comments &&
                workout.comments.map((comment, idx) => (
                  <li key={idx}>{comment.comment}</li>
                  // <p>
                  //   {idx + 1}. {comment.comment}
                  // </p>
                ))}
              <div>
                <input
                  type="text"
                  onChange={(event, idx) => {
                    setComment(event.target.value);
                  }}
                />
                <button
                  onClick={() => {
                    submitComment();
                  }}
                >
                  Submit
                </button>
                {star === 0 ? (
                  <>
                    <h4>Please Rate</h4>
                    <ReactStars
                      count={5}
                      onChange={(e) => {
                        handleStars(e);
                      }}
                      size={40}
                      activeColor="#ffd700"
                    />
                  </>
                ) : (
                  <>
                    <h3>Rated {star} <BsFillStarFill color="#ffd700"/> </h3>
                  </>
                )}
              </div>
            </li>
          </ul>
        </div>

        
      );
    };
    
