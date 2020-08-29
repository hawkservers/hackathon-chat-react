import Home from "../../../Pages/Home";
import Lobby from "../../../Pages/Lobby";

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
