# Crop Yield Prediction ML Service

A FastAPI-based machine learning service for predicting crop yields using a Random Forest Regressor.

## Setup Instructions

### 1. Install Dependencies

```bash
cd ml-service
pip install -r requirements.txt
```

### 2. Train the Model

```bash
python train_model.py
```

This will:
- Load the sample dataset
- Preprocess the data
- Train a Random Forest Regressor
- Evaluate the model (R², MAE, RMSE)
- Save the model to `model/model.pkl`

### 3. Run the API Server

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at `http://localhost:8000`

## API Endpoints

### POST /predict

Predict crop yield based on input features.

**Request Body:**
```json
{
  "crop": "wheat",
  "soil_type": "loamy",
  "region": "north-india",
  "season": "rabi",
  "rainfall": 150.0,
  "temperature": 28.0,
  "humidity": 65.0
}
```

**Response:**
```json
{
  "predicted_yield": 5420.5,
  "confidence": 87.5,
  "model_accuracy": {
    "r2_score": 0.89,
    "mae": 245.3,
    "rmse": 312.8
  }
}
```

### GET /health

Health check endpoint.

### GET /model-info

Get information about the current model.

## Deployment

### Deploy to Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the following:
   - Build Command: `pip install -r requirements.txt && python train_model.py`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Deploy to Railway

1. Connect your repository
2. Railway will auto-detect the Dockerfile or use the requirements.txt
3. Add environment variable: `PORT=8000`

## Model Details

- **Algorithm**: Random Forest Regressor
- **Features**: Crop type, Soil type, Region, Season, Rainfall, Temperature, Humidity
- **Target**: Predicted yield (kg/ha)
- **Metrics**:
  - R² Score: Measures how well the model fits the data
  - MAE: Mean Absolute Error
  - RMSE: Root Mean Square Error
