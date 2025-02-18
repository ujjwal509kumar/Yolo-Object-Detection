from fastapi import FastAPI, File, UploadFile
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
import io
import logging
from PIL import Image
import numpy as np
import cv2
import torch 

logging.basicConfig(level=logging.DEBUG)

# Dynamically select device 
device = 'cuda' if torch.cuda.is_available() else 'cpu'
logging.info(f"Using device: {device}")
model = YOLO('yolov8x.pt').to(device)

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/detect")
async def detect(file: UploadFile = File(...)):
    try:
        image_data = await file.read()
        image = Image.open(io.BytesIO(image_data))
        frame = np.array(image)

        results = model(frame)
        annotated_frame = results[0].plot()
        _, encoded_img = cv2.imencode('.jpg', annotated_frame)
        img_bytes = encoded_img.tobytes()

        return StreamingResponse(io.BytesIO(img_bytes), media_type="image/jpeg")
    except Exception as e:
        logging.error(f"Error during detection: {e}")
        return {"error": str(e)}
