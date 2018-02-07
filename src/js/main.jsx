import "babel-polyfill";
import DummyComponent from './DummyComponent.jsx';


class lalaland {
  constructor() {
    console.log("YO");
  }
}

const t = new lalaland();

console.log(t);


$.get("public/assets/icons.svg", (data) => {
  $("body").append(data);
});
