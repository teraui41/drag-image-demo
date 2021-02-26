import React from "react";

const ImageItem = ({ filename, loadedCompleted, imageSrc }) => {
  return (
    <div className='image-item'>
      { !loadedCompleted && <div className="loading-text">壓縮中</div> }
      <div
        className='image'
        style={{ backgroundImage: `url(${imageSrc})` }}
      ></div>
      <div className="filename">{ filename }</div>
    </div>
  );
};

export default ImageItem;
