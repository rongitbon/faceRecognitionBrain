import React, { Component } from 'react';
import Particles from 'react-particles-js';
import './App.css';
import Navigation from './components/Navigation/Navigation.js';
import Signin from './components/Signin/Signin.js';
import Register from './components/Register/Register.js';
import Logo from './components/Logo/Logo.js';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js';
import Rank from './components/Rank/Rank.js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition.js';

const particlesOptions = {
  particles: {
    number: {
      value: 70,
      density: {
        enable: true,
        value_area:800
      }
    }
  }
}

const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signout',
  isSignendIn: false,
  user: {
    id:'',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}
class App extends Component {
  constructor() {
    super();
    this.state = initialState;
    }

  loadUser = (user_data) => {
    this.setState({user: {
      id: user_data.id,
      name: user_data.name,
      email: user_data.email,
      entries: user_data.entries,
      joined: user_data.joined
    }});
  }

  /*componentDidMount() {
    fetch('https://young-ravine-12915.herokuapp.com')
      .then(response => response.json())
      .then(console.log);
  }*/

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage')
    const width = Number(image.width);
    const height = Number(image.height);
    console.log(width, height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
      this.setState({input: event.target.value});
  }

  onSubmit = () => {
    this.setState({imageUrl: this.state.input});
    fetch('https://young-ravine-12915.herokuapp.com/imageurl' , {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        input : this.state.input
      })
    })
    .then(response => response.json())
    .then(response => {
      if (response){
        fetch('https://young-ravine-12915.herokuapp.com/image' , {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
          id : this.state.user.id
          })
        })
        .then(response => response.json())
        .then(count => {
          this.setState(
            Object.assign(this.state.user, {entries: count})
          )
        })
        .catch(console.log);
      }
      this.displayFaceBox(this.calculateFaceLocation(response))
    })
    .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState);
    } else if (route === 'home') {
      this.setState({isSignendIn: true});
    }
    this.setState({route: route});
  }

  render() {
    const { isSignendIn, imageUrl, route, box ,user } = this.state;
    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions} />
        <Navigation onRouteChange={this.onRouteChange} isSignendIn={isSignendIn}/>
        <Logo />
        { this.state.route === 'home'
          ?<div>
            <Rank
              name={user.name}
              entries={user.entries}
            />
            <ImageLinkForm 
                onInputChange={this.onInputChange} 
                onSubmit={this.onSubmit}
            />
            <FaceRecognition box={box} imageUrl={imageUrl}/>
          </div>
          :(
            route === 'signout'
              ?<Signin
                onRouteChange={this.onRouteChange}
                loadUser={this.loadUser}
              />
              :<Register 
                onRouteChange={this.onRouteChange}
                loadUser={this.loadUser}
              />
            )
        }
        </div>
    );
  }
}

export default App;
