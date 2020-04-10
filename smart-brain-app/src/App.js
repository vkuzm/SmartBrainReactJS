import React from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Rank from './components/Rank/Rank';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import './App.css';

const app = new Clarifai.App({
  apiKey: 'd012da56ea7e409b9fbdbf0c775d5b0d'
})

const particlesOptions = {
  particles: {
    number: {
      value: 40,
      density: {
        enable: true,
        value_area: 200
      }
    }
  }
}

const initialState = {
  input: '',
  imageUrl: '',
  boxes: [],
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends React.Component {
  constructor() {
    super();

    this.state = initialState;
  }

  loadUser = (user) => {
    this.setState({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        entries: user.entries,
        joined: user.joined
      }
    })
  }

  calculateFaceLocation = (data) => {
    const image = document.getElementById("input-image");
    const width = Number(image.width);
    const height = Number(image.height);

    const regions = data.outputs[0].data.regions;
    const boxes = [];

    regions.forEach((region => {
      const boundingBox = region.region_info.bounding_box;
      const box = {
        left: boundingBox.left_col * width,
        top: boundingBox.top_row * height,
        right: width - (boundingBox.right_col * width),
        bottom: height - (boundingBox.bottom_row * height)
      }

      boxes.push(box)
    }));

    this.increaseCounter(boxes.length);
    return boxes;   
  }

  displayFaceBoxes = (boxes) => {
    this.setState({boxes: boxes});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});

    app.models
    .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
    .then(response => this.calculateFaceLocation(response))
    .then(boxes => this.displayFaceBoxes(boxes))
    .catch(error => console.log('Clarifai error:', error));
  }

  increaseCounter = (count) => {
    console.log(this.state.user)
    fetch('http://localhost:3001/image', {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        id: this.state.user.id,
        count: count
      })
    })
    .then(response => response.json())
    .then(count => {
      return this.setState(Object.assign(this.state.user, {entries: count}));
    })
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState);  
    } else if (route === 'home') {
      this.setState({isSignedIn: true});
    }
    
    this.setState({route: route});
  }

  displayContent = () => {
    const route = this.state.route;

    switch (route) {
      case 'home':
        return (
          <div className="content">
            <Logo />
            <Rank user={this.state.user} /> 
            <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
            <FaceRecognition boxes={this.state.boxes} imageUrl={this.state.imageUrl} /> 
          </div>
        );
      case 'register':
        return <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser} />;
      default:
        return <SignIn onRouteChange={this.onRouteChange} loadUser={this.loadUser} />;
    }
  }

  render() {
    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions} />
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={this.state.isSignedIn} />
        {this.displayContent()}
      </div>
    );
  }
}

export default App;
