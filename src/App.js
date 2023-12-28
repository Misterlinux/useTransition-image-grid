import {
  BrowserRouter as Router,
  Link,
  Route,
  useParams,
  Routes,
  Outlet,
  useRouteError,
} from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import Primo from "./components/Primo";
import Second from "./components/Second";

//The imported task includes in it the useReducer.....
function App() {



  return (
    <div>

      <Primo />
      <Second />

    </div>
  );
}

export default App;
