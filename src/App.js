import imageCompression from 'browser-image-compression';
import './App.css';

async function handleImageUpload(event) {

  const imageFile = event.target.files[0];
  console.log('originalFile instanceof Blob', imageFile instanceof Blob); // true
  console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);

  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true
  }
  try {
    const compressedFile = await imageCompression(imageFile, options);
    console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
    console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB
    
    console.log(`少了 ${ 100 - (compressedFile.size / imageFile.size * 100) }%`); // smaller than maxSizeMB
    // await uploadToServer(compressedFile); // write your own logic
  } catch (error) {
    console.log(error);
  }

}

function App() {
  return (
    <div className="App">
      <input type="file" onChange={handleImageUpload}/>
    </div>
  );
}

export default App;
