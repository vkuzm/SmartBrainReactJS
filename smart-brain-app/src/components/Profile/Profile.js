import React from "react";
import "./Profile.css";

class Profile extends React.Component {
  constructor(props) {
    super(props);
    const { email, name, age, pet } = this.props.user;

    this.state = {
      email: email,
      name: name,
      age: age,
      pet: pet,
    };
  }

  onFormChange = (event) => {
    switch (event.target.name) {
      case "user-name":
        this.setState({ name: event.target.value });
        break;
      case "user-password":
        this.setState({ password: event.target.value });
        break;
      case "user-age":
        this.setState({ age: event.target.value });
        break;
      case "user-pet":
        this.setState({ pet: event.target.value });
        break;
      default:
        return;
    }
  };

  onProfileUpdate = (data) => {
    fetch(`http://localhost:3001/profile/${this.props.user.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: this.props.getAuthToken(),
      },
      body: JSON.stringify({ formInput: data }),
    })
      .then((res) =>
        res.json().then((body) => ({ status: res.status, body: body }))
      )
      .then((res) => {
        if (res.status === 200 || res.status === 304) {
          this.props.loadUser({ ...this.props.user, ...data });
          this.props.toggleModal();
        } else {
          alert(res.body);
        }
      })
      .catch(console.log);
  };

  render() {
    const { user } = this.props;
    const { name, password, email, age, pet } = this.state;

    return (
      <div className="profile-modal">
        <article className="br3 ba dark-gray b--black-10 mv4 w-100 w-50-m w-25-1 mw6 shadow-5 center bg-white">
          <main className="pa4 black-80 w-80">
            <img
              src="http://tachyons.io/img/logo.jpg"
              alt="Avatar"
              className="h3 w3 dib"
            />
            <h1>{name}, {age}</h1>
            <h4>{`Images submitted: ${user.entries}`}</h4>
            <p>{`Member since: ${user.joined}`}</p>
            <hr />
            <label className="mt2 fw6" htmlFor="user-name">Name:</label>
            <input
              onKeyUp={this.onFormChange}
              className="pa2 ba w-100"
              placeholder={user.name}
              type="text"
              name="user-name"
              id="user-name"
            />
            <label className="mt2 fw6" htmlFor="age-name">Age:</label>
            <input
              onKeyUp={this.onFormChange}
              className="pa2 ba w-100"
              placeholder={user.age}
              type="text"
              name="user-age"
              id="user-age"
            />
            <label className="mt2 fw6" htmlFor="user-name">Pet:</label>
            <input
              onKeyUp={this.onFormChange}
              className="pa2 ba w-100"
              placeholder={user.pet}
              type="text"
              name="user-pet"
              id="user-pet"
            />
            <label className="mt2 fw6" htmlFor="user-password">Password:</label>
            <input
              onKeyUp={this.onFormChange}
              className="pa2 ba w-100"
              placeholder="Enter your new password"
              type="text"
              name="user-password"
              id="user-password"
            />
            <div
              className="mt4"
              style={{ display: "flex", justifyContent: "space-evenly" }}>
              <button
                onClick={() => this.onProfileUpdate({ name, password, email, age, pet })}
                className="b pa2 grow pointer hover-white w-40 bg-light-blue b--black-20">
                Save
              </button>
              <button
                className="b pa2 grow pointer hover-white w-40 bg-light-red b--black-20"
                onClick={this.props.toggleModal}>
                Cancel
              </button>
            </div>
          </main>
          <div className="modal-close" onClick={this.props.toggleModal}>&times;</div>
        </article>
      </div>
    );
  }
}

export default Profile;
