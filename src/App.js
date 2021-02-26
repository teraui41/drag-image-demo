import React, { useEffect, useRef, useState } from "react";
import imageCompression from "browser-image-compression";
import ImageItem from "./components/ImageItem";
import "./App.scss";


const options = {
  maxSizeMB: 1,
  maxWidthOrHeight: 800,
  useWebWorker: true,
};


const getDataUrl = (file, setImages) => {
  const reader = new FileReader();

  reader.onload = (e) => {
    const imagePayload = {
      imageSrc: e.target.result,
    };
    setImages((state) => ([ ...state, imagePayload ]));
  };

  reader.readAsDataURL(file);
};

const getTransferData = (setImages) => async (event) => {
  event.preventDefault();
  event.stopPropagation();
  await compressImage(event.dataTransfer.files[0], setImages);
};


const handleImageUpload = (setImages) => async (event) => {
  await compressImage(event.target.files[0], setImages); 
}

const compressImage = async (imageFile, setImages) => {
  console.log("是否為 Blob", imageFile instanceof Blob); // true
  console.log(`壓縮前檔案大小 ${imageFile.size / 1024 / 1024} MB`);

  try {
    const compressedFile = await imageCompression(imageFile, options);
    console.log(
      "compressedFile instanceof Blob",
      compressedFile instanceof Blob
    ); // true
    console.log(`壓縮後檔案大小 ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB
    console.log(`少了 ${100 - (compressedFile.size / imageFile.size) * 100}%`); // smaller than maxSizeMB
    getDataUrl(compressedFile, setImages);
    // await uploadToServer(compressedFile); // write your own logic
  } catch (error) {
    console.log(error);
  }
};

const preventDefault = (event) => {
  event.preventDefault();
  event.stopPropagation();
};

function App() {
  const [images, setImages] = useState([]);
  const dropAreaRef = useRef(null);

  useEffect(() => {
    let register = false;

    if (dropAreaRef !== null && !register) {
      register = true;   
      dropAreaRef.current.addEventListener("dragover", preventDefault, false);
      dropAreaRef.current.addEventListener(
        "drop",
        getTransferData(setImages),
        false
      );
    }

    return () => {
      console.log('undemouny')
      if (dropAreaRef !== null) {
        dropAreaRef.current.removeEventListener("dragover", preventDefault);
        dropAreaRef.current.removeEventListener("drop", getTransferData(setImages));
      }
    };
  }, [dropAreaRef]);

  return (
    <div className='App'>
      <div ref={dropAreaRef} className='image-container'>
        <div>
          {images.map((item) => {
            return <ImageItem key={item.filename} {...item} />;
          })}
        </div>
        <label htmlFor='upload_file' className='upload-image-button'>
          Click to upload image.
        </label>
      </div>
      <input
        id='upload_file'
        type='file'
        className='file_input'
        onChange={handleImageUpload(setImages)}
      />
    </div>
  );
}

export default App;
