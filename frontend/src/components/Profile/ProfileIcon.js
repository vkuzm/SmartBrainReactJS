import React from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

class ProfileIcon extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
    };
  }

  toggle = () => {
    this.setState((prevState) => ({
      dropdownOpen: !prevState.dropdownOpen,
    }));
  };

  render() {
    return (
      <div className="pa4 tc">
        <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
          <DropdownToggle
            tag="span"
            data-toggle="dropdown"
            aria-expanded={this.state.dropdownOpen}>
            <img
              src="http://tachyons.io/img/logo.jpg"
              alt="Avatar"
              className="br-100 ba h3 w3 dib"
            />
          </DropdownToggle>
          <DropdownMenu
            className="b--transparent shadow-5"
            style={{ marginTop: "0", backgroundColor: "rgba(255,255,255,0.5)" }}>
            <DropdownItem onClick={this.props.toggleModal}>View Profile</DropdownItem>
            <DropdownItem>Signout</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    );
  }
}

export default ProfileIcon;
