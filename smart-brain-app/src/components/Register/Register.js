import React from "react";

class Register extends React.Component {
  constructor() {
    super();

    this.state = {
      email: '',  
      password: '',
      name: ''
    }
  }

  onEmailChange = (event) => {
    this.setState({email: event.target.value});
  }

  onPasswordChange = (event) => {
    this.setState({password: event.target.value});
  }

  onNameChange = (event) => {
    this.setState({name: event.target.value});
  } 

  onSubmitRegister = () => {
    fetch('http://localhost:3001/register', {
      method:'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
        name: this.state.name
      })
    })
    .then(res => res.json().then(data => ({status: res.status, body: data})))
    .then(data => {
      if (data.status === 201) {
        this.props.loadUser(data.body);
        this.props.onRouteChange('home');
      } else {
        alert('Email already exists!');
      }
    })
  }

  render() {
    const { onRouteChange } = this.props;

    return (
      <article className="br3 ba dark-gray b--black-10 mv4 w-100 w-50-m w-25-1 mw6 shadow-5 center">
        <main className="pa4 black-80">
          <div className="measure">
            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
              <legend className="f1 fw6 ph0 mh0">Register</legend>
              <div className="mt3">
                <label className="db fw6 lh-copy f6" htmlFor="name">Name</label>
                <input
                  className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  type="text"
                  name="name"
                  onChange={this.onNameChange}
                  id="name"
                />
              </div>
              <div className="mt3">
                <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                <input
                  className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  type="email"
                  name="email-address"
                  onChange={this.onEmailChange}
                  id="email-address"
                />
              </div>
              <div className="mv3">
                <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                <input
                  className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  type="password"
                  name="password"
                  onChange={this.onPasswordChange}
                  id="password"
                />
              </div>
            </fieldset>
            <div>
              <input
                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib "
                onClick={this.onSubmitRegister}
                type="button"
                value="Register"
              />
            </div>
            <div className="lh-copy mt3">
              <p onClick={() => onRouteChange("signin")} className="f6 link dim black db pointer">Sign In</p>
            </div>
          </div>
        </main>
      </article>
    );
  }
}

export default Register;