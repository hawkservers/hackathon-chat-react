import Home from "../../../Pages/Home.jsx";
import Lobby from "../../../Pages/Lobby.jsx";

export default [
  {
    path: '/',
    component: Home
  },
  {
    path: '/:lobby',
    component: Lobby
  }
];
