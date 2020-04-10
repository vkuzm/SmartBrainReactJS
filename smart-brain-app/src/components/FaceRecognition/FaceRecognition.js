import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({ imageUrl, boxes }) => {
	const boxeDivs = boxes.map((box, index) => {
		return <div key={index} className="box" style={{top: box.top, right: box.right, bottom: box.bottom, left: box.left}}></div>;
  });

	return (
		<div className="center ma">
			<div className="absolute mt2">
				<img src={imageUrl} alt="" id="input-image" />
				{boxeDivs}
			</div>
		</div>
	);
}

export default FaceRecognition;