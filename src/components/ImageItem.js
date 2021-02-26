import React from "react";

const ImageItem = ({ filename, loadedCompleted, imageSrc }) => {
  return (
    <div className='image-item'>
      <div
        className='image'
        style={{ backgroundImage: `url(${imageSrc})` }}
      ></div>
    </div>
  );
};

export default ImageItem;
