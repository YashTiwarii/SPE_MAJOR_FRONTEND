import { Link, useNavigate } from "react-router-dom";
import React from "react";
import { useCookies } from "react-cookie";


export const Navbar = () => {
const [cookies, setCookies] = useCookies(["access_token"]);
const navigate = useNavigate();

const logout = () =>{
    setCookies("access_token","");
    window.localStorage.clear();
    navigate("/auth")
}
    return (
    <div className="navbar">
    <Link to="/">Home</Link>
    <Link to="/create-workout">Create Workout</Link>
    
    {!cookies.access_token ? (
    <Link to="/auth">Login/Register</Link>) : 
    (<>
    <Link to="/saved-workouts">Saved Workouts</Link>
    <button onClick={logout}>LogOut</button>
    </>
    )}
    
    </div>
    );
};