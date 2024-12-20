
## How to run on local machine

Clone the project

```bash
  git clone https://github.com/ujjwal509kumarYolo-Object-Detection.git
```

Go to the project directory

```bash
  cd Yolo-Object-Detection
```

Now open vs code and go to the frontend directory

```bash
  cd frontend
```

Install dependencies

```bash
  npm install
```

Now open another terminal in vs code and go to backend

```bash
  cd backend
```

Now install all the backend dependencies by running this command

```
  pip install -r requirements.txt
```

If the above command is not working then try 
```
  python -m pip install -r requirements.txt
```

Now we will try to run the backend by entering this command 
```
  uvicorn app:app --reload
```

Now go to the other terminal where you have opened your frontend and try to run frontend by running this command
```
  npm run dev
```

To train yolo model train like this 
```
yolo task=detect mode=train model=yolov8n.pt data=./dataset/data.yaml epochs=100 imgsz=640
```

change epochs and imgsz as per the change
