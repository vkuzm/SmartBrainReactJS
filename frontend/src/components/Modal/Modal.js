import React from "react";
import ReactDOM from "react-dom";
import "./Modal.css";

const modalRoot = document.getElementById("modal-root");

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.element = document.createElement("div");
  }

  componentDidMount() {
    modalRoot.appendChild(this.element);
  }

  componentWillUnmount() {
    modalRoot.removeChild(this.element);
  }

  render() {
    return ReactDOM.createPortal(this.props.children, this.element);
  }
}

export default Modal;
