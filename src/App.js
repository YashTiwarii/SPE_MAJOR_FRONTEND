import './App.css';
import { BrowserRouter as Router, Routes , Route } from "react-router-dom";
import { Home } from './pages/Home';
import { Auth } from './pages/Auth';
import { CreateWorkout } from './pages/CreateWorkout';
import { SavedWorkouts } from './pages/SavedWorkout';
import {Navbar} from "./components/navbar"
import {ViewWorkout} from"./pages/ViewWorkout";

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/auth' element={<Auth />}/>
          <Route path='/create-workout'element={<CreateWorkout />}/>
          <Route path='/saved-workouts'element={<SavedWorkouts />}/>
          <Route path='/view'element={<ViewWorkout />}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
