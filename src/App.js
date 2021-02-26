import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import imageCompression from "browser-image-compression";
import ImageItem from "./components/ImageItem";
import "./App.scss";

const options = {
  maxSizeMB: 1,
  maxWidthOrHeight: 800,
  useWebWorker: true,
};

const getImagesFormat = (files) => {
  let result = [];
  for (let file of files) {
    result.push({
      id: uuidv4(),
      filename: file.name,
      loadedCompleted: false,
      imageSrc: "",
      file,
    });
  }
  return result;
};

const getDataUrl = (file, id, images, setImages) => {
  const reader = new FileReader();

  reader.onload = (e) => {
    const currentIndex = images.findIndex((image) => image.id === id);
    const currentImage = images[currentIndex];
    currentImage.imageSrc = e.target.result;
    currentImage.loadedCompleted = true;
    setImages(images);
  };

  reader.readAsDataURL(file);
};

const getTransferData = (images, setImages) => async (event) => {
  event.preventDefault();
  event.stopPropagation();

  for await (let file of event.dataTransfer.files) {
    await compressImage(file, images, setImages);
  }
};

const getUploadImage = (images, setImages) => async (event) => {
  const files = event.target.files;

  const imageSet = getImagesFormat(files);
  setImages((state) => [...state, ...imageSet]);

  for await (let image of imageSet) {
    await compressImage(image.file, image.id, [...images, ...imageSet], setImages);
  }
};

const compressImage = async (imageFile, id, images, setImages) => {
  console.log("是否為 Blob", imageFile instanceof Blob); // true
  console.log(`壓縮前檔案大小 ${imageFile.size / 1024 / 1024} MB`);

  try {
    const compressedFile = await imageCompression(imageFile, options);
    console.log(`壓縮後檔案大小 ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB
    console.log(`少了 ${100 - (compressedFile.size / imageFile.size) * 100}%`); // smaller than maxSizeMB
    getDataUrl(compressedFile, id, images, setImages);
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

  const handleTransferData = getTransferData(images, setImages);
  const handleImageUpload = getUploadImage(images, setImages);

  useEffect(() => {
    const dropArea = dropAreaRef.current;

    if (dropArea !== null) {
      dropArea.addEventListener("dragover", preventDefault, false);
      dropArea.addEventListener("drop", handleTransferData, false);
    }

    return () => {
      if (dropArea !== null) {
        dropArea.removeEventListener("dragover", preventDefault);
        dropArea.removeEventListener("drop", handleTransferData);
      }
    };
  }, [dropAreaRef, handleTransferData]);

  return (
    <div className='App'>
      <div ref={dropAreaRef} className='image-container'>
        <div>
          {images.map((item, index) => {
            return <ImageItem key={`${item.filename}_${index}`} {...item} />;
          })}
        </div>
        <label htmlFor='upload_file' className='upload-image-button'>
          Click to upload image.
        </label>
      </div>
      <input
        multiple
        id='upload_file'
        type='file'
        className='file_input'
        onChange={handleImageUpload}
      />
    </div>
  );
}

export default App;
