import React from "react";
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Rank from "./components/Rank/Rank";
import SignIn from "./components/SignIn/SignIn";
import Register from "./components/Register/Register";
import Particles from "react-particles-js";
import Modal from "./components/Modal/Modal";
import Profile from "./components/Profile/Profile";
import Loading from "./components/Loading/Loading";
import "./App.css";

const particlesOptions = {
  particles: {
    number: {
      value: 40,
      density: {
        enable: true,
        value_area: 200,
      },
    },
  },
};

const initialState = {
  input: "",
  imageUrl: "",
  boxes: [],
  route: "loading",
  isSignedIn: false,
  isProfileOpen: false,
  user: {
    id: "",
    name: "",
    age: "",
    pet: "",
    email: "",
    entries: 0,
    joined: "",
  },
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  componentDidMount() {
    const token = this.getAuthToken();
    if (token) {
      fetch("http://localhost:3001/signin", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: this.getAuthToken(),
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data && data.id) {
            this.getUserAndLoad(data.id);
          } else {
            this.onRouteChange("signin");
            console.log("Unable to authorize");
          }
        })
        .catch(console.log);
    } else {
      this.onRouteChange("signin");
    }
  }

  getUserAndLoad = (userId) => {
    fetch(`http://localhost:3001/profile/${userId}`, {
      method: "GET",
      headers: { Authorization: this.getAuthToken() },
    })
      .then((response) => response.json())
      .then((user) => {
        if (user && user.email) {
          this.loadUser(user);
          this.onRouteChange("home");
        }
      })
      .catch(() => console.log("Unable to get user"));
  };

  loadUser = (user) => {
    this.setState({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        age: user.age,
        pet: user.pet,
        entries: user.entries,
        joined: user.joined,
      },
    });
  };

  getAuthToken = () => {
    const token = localStorage.getItem("token");
    return token ? token : "";
  };

  saveAuthToken = (token) => {
    localStorage.setItem("token", token);
  };

  removeAuthToken = () => {
    localStorage.removeItem("token");
  };

  calculateFaceLocation = (data) => {
    if (data && data.outputs) {
      const image = document.getElementById("input-image");
      const width = Number(image.width);
      const height = Number(image.height);

      const regions = data.outputs[0].data.regions;
      const boxes = [];

      regions.forEach((region) => {
        const boundingBox = region.region_info.bounding_box;
        const box = {
          left: boundingBox.left_col * width,
          top: boundingBox.top_row * height,
          right: width - boundingBox.right_col * width,
          bottom: height - boundingBox.bottom_row * height,
        };

        boxes.push(box);
      });

      this.increaseCounter(boxes.length);
      return boxes;
    }
  };

  displayFaceBoxes = (boxes) => {
    if (boxes && boxes.length > 0) {
      this.setState({ boxes: boxes });
    }
  };

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });

    fetch("http://localhost:3001/imageurl", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: this.getAuthToken(),
      },
      body: JSON.stringify({
        input: this.state.input,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          this.displayFaceBoxes(this.calculateFaceLocation(data));
        }
      })
      .catch((err) => console.log(err));
  };

  increaseCounter = (count) => {
    fetch("http://localhost:3001/image", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: this.getAuthToken(),
      },
      body: JSON.stringify({
        id: this.state.user.id,
        count: count,
      }),
    })
      .then((response) => response.json())
      .then((counter) => {
        return this.setState(
          Object.assign(this.state.user, { entries: counter })
        );
      });
  };

  onRouteChange = (route) => {
    if (route === "signout") {
      this.removeAuthToken();
      this.setState({ initialState });
      route = "signin";
    } else if (route === "home") {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  };

  displayContent = () => {
    const route = this.state.route;

    switch (route) {
      case "home":
        return (
          <div className="content">
            <Logo />
            <Rank user={this.state.user} />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition
              boxes={this.state.boxes}
              imageUrl={this.state.imageUrl}
            />
          </div>
        );
      case "register":
        return (
          <Register
            onRouteChange={this.onRouteChange}
            getUserAndLoad={this.getUserAndLoad}
            saveAuthToken={this.saveAuthToken}
          />
        );
      case "signin":
        return (
          <SignIn
            onRouteChange={this.onRouteChange}
            getUserAndLoad={this.getUserAndLoad}
            saveAuthToken={this.saveAuthToken}
          />
        );
      default:
        return <Loading />;
    }
  };

  toggleModal = () => {
    this.setState((prevState) => ({
      ...prevState,
      isProfileOpen: !prevState.isProfileOpen,
    }));
  };

  render() {
    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions} />
        <Navigation
          onRouteChange={this.onRouteChange}
          isSignedIn={this.state.isSignedIn}
          toggleModal={this.toggleModal}
        />
        {this.state.isProfileOpen && (
          <Modal>
            <Profile
              toggleModal={this.toggleModal}
              loadUser={this.loadUser}
              user={this.state.user}
              getAuthToken={this.getAuthToken}
            />
          </Modal>
        )}
        {this.displayContent()}
      </div>
    );
  }
}

export default App;
