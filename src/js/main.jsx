import DummyComponent from './DummyComponent.jsx';

$.get("public/assets/icons.svg", (data) => {
  $("body").append(data);
});
