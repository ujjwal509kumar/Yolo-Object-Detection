'use client';
import { useState, useRef, useEffect } from 'react';

export default function Home() {
  const [imageUrl, setImageUrl] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // to start camera
  useEffect(() => {
    if (showCamera && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      async function startCamera() {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
      }
      startCamera();
    }
  }, [showCamera]);

  // to capture current frame
  const captureFrame = async () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append('file', blob, 'frame.jpg');

      const response = await fetch('http://localhost:8000/detect', {
        method: 'POST',
        body: formData,
      });

      const imageBlob = await response.blob();
      const imageUrl = URL.createObjectURL(imageBlob);
      setImageUrl(imageUrl);
      setShowCamera(false);
    }, 'image/jpeg');
  };

  // to upload file from local computer and send it to backend
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('http://localhost:8000/detect', {
      method: 'POST',
      body: formData,
    });

    const imageBlob = await response.blob();
    const imageUrl = URL.createObjectURL(imageBlob);
    setImageUrl(imageUrl);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">
        YOLOv8 Object Detection
      </h1>

      <div className="flex flex-col md:flex-row justify-center items-center gap-6 w-full max-w-4xl">
        
        <button
          onClick={() => setShowCamera(true)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-indigo-700 transition duration-300 w-full md:w-auto text-center"
        >
          Capture Image with Camera
        </button>

        
        <label className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-indigo-700 transition duration-300 cursor-pointer w-full md:w-auto text-center">
          Upload Image from Device
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {showCamera && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold text-center text-indigo-600 mb-4">
              Camera Preview
            </h2>
            <video ref={videoRef} autoPlay className="w-full rounded-lg shadow-md" />

            <div className="flex justify-between items-center mt-4">
              <button
                onClick={captureFrame}
                className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition duration-300"
              >
                Capture
              </button>
              <button
                onClick={() => setShowCamera(false)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700 transition duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>

      {imageUrl && (
        <div className="mt-8 w-full max-w-4xl">
          <h2 className="text-xl font-semibold text-indigo-600 mb-4">Detected Objects:</h2>
          <img src={imageUrl} alt="Detected Objects" className="rounded-lg shadow-lg w-full" />
        </div>
      )}
    </div>
  );
}
