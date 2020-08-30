import Home from "../../../Pages/Home.jsx";
import Lobby from "../../../Pages/Lobby.jsx";
import Callback from "../../../Pages/Auth/Callback";

export default [
  {
    path: '/',
    component: Home
  },
  {
    path: '/auth/:token',
    component: Callback
  },
  {
    path: '/:lobby',
    component: Lobby
  }
];
