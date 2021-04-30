import React from "react";
import "./FaceRecognition.css";

const FaceRecognition = ({ imageUrl, boxes }) => {
  const boxDivs = boxes.map((box, index) => {
    return (
      <div
        key={index}
        className="box"
        style={{
          top: box.top,
          right: box.right,
          bottom: box.bottom,
          left: box.left,
        }}
      />
    );
  });

  return (
    <div className="center ma">
      <div className="absolute mt2">
        <img src={imageUrl} alt="" id="input-image" />
        {boxDivs}
      </div>
    </div>
  );
};

export default FaceRecognition;
