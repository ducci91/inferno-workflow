import "babel-polyfill";
import DummyComponent from './DummyComponent.jsx';

/* Your Code goes here */



/* include SVG to DOM */
$.get("public/assets/icons.svg", (data) => {
  $("body").append(data);
});
