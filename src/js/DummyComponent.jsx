import Inferno from 'inferno';
import Component from 'inferno-component';

class DummyComponent extends Component {
  render() {
    return (
      <div>
        Dummy InfernoJs Component
      </div>
    )
  }
}

Inferno.render(
  <DummyComponent />,
  document.querySelector(".dummy-component")
);
