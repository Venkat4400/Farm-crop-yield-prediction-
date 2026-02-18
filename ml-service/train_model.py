"""
Crop Yield Prediction Model Training Script

This script trains a Random Forest Regressor model on the comprehensive Indian crop yield dataset.
It handles data preprocessing, model training, evaluation, and saves the trained model.
"""

import os
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error

# Paths
DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "cleaned_crop_data.csv")
LEGACY_DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "crop_yield.csv")
MODEL_DIR = os.path.join(os.path.dirname(__file__), "model")
MODEL_PATH = os.path.join(MODEL_DIR, "model.pkl")
ENCODERS_PATH = os.path.join(MODEL_DIR, "encoders.pkl")
METRICS_PATH = os.path.join(MODEL_DIR, "metrics.json")


def load_data():
    """Load the crop yield dataset."""
    print("Loading dataset...")
    
    # Try new comprehensive dataset first
    if os.path.exists(DATA_PATH):
        df = pd.read_csv(DATA_PATH)
        print(f"Loaded comprehensive dataset: {len(df)} samples")
    elif os.path.exists(LEGACY_DATA_PATH):
        df = pd.read_csv(LEGACY_DATA_PATH)
        print(f"Loaded legacy dataset: {len(df)} samples")
    else:
        raise FileNotFoundError("No dataset found!")
    
    print(f"Columns: {list(df.columns)}")
    return df


def preprocess_data(df):
    """Preprocess the dataset for training."""
    print("\nPreprocessing data...")
    
    # Create copies of the dataframe
    df = df.copy()
    
    # Clean column names
    df.columns = df.columns.str.strip().str.lower()
    
    # Print column info
    print(f"Available columns: {list(df.columns)}")
    
    # Handle different dataset formats
    if 'annual_rainfall' in df.columns:
        # New comprehensive dataset format
        df['rainfall'] = df['annual_rainfall'].fillna(0)
    
    # Map state to region if region not present
    if 'region' not in df.columns and 'state' in df.columns:
        df['region'] = df['state'].apply(map_state_to_region)
    
    # Handle missing values
    df['crop'] = df['crop'].fillna('unknown').str.lower().str.strip()
    df['season'] = df['season'].fillna('kharif').str.lower().str.strip()
    df['state'] = df['state'].fillna('unknown').str.lower().str.strip()
    df['district'] = df['district'].fillna('unknown').str.lower().str.strip()
    df['region'] = df.get('region', pd.Series(['central-india'] * len(df))).fillna('central-india').str.lower().str.strip()
    
    # Standardize season names
    season_mapping = {
        'winter': 'rabi',
        'summer': 'zaid',
        'autumn': 'kharif',
        'whole year': 'kharif'
    }
    df['season'] = df['season'].replace(season_mapping)
    
    # Convert yield to kg/ha if in tons/ha (values < 100 likely in tons)
    if 'yield' in df.columns:
        df['yield'] = df['yield'].fillna(0)
        # If yield values are mostly < 100, they're likely in tons/ha
        if df['yield'].median() < 100:
            print("Converting yield from tons/ha to kg/ha...")
            df['yield'] = df['yield'] * 1000
    
    # Filter out invalid records
    df = df[df['yield'] > 0]  # Remove zero yields
    df = df[df['yield'] < 100000]  # Remove outliers (> 100 tons/ha)
    
    print(f"Records after filtering: {len(df)}")
    
    # Define categorical columns
    categorical_cols = ['crop', 'state', 'district', 'season', 'region']
    
    # Create label encoders for categorical features
    encoders = {}
    for col in categorical_cols:
        if col in df.columns:
            le = LabelEncoder()
            df[col + '_encoded'] = le.fit_transform(df[col].astype(str))
            encoders[col] = le
            print(f"  Encoded {col}: {len(le.classes_)} unique values")
    
    # Define features
    feature_cols = []
    for col in categorical_cols:
        if col + '_encoded' in df.columns:
            feature_cols.append(col + '_encoded')
    
    # Add numerical features if available
    numerical_cols = ['rainfall', 'year', 'area', 'fertilizer', 'pesticide']
    for col in numerical_cols:
        if col in df.columns:
            df[col] = df[col].fillna(0)
            feature_cols.append(col)
    
    X = df[feature_cols]
    y = df['yield']
    
    print(f"\nFeatures: {list(X.columns)}")
    print(f"Target: yield (kg/ha)")
    print(f"X shape: {X.shape}, y shape: {y.shape}")
    print(f"Yield range: {y.min():.0f} - {y.max():.0f} kg/ha")
    print(f"Yield mean: {y.mean():.0f} kg/ha, median: {y.median():.0f} kg/ha")
    
    return X, y, encoders, df


def map_state_to_region(state):
    """Map Indian states to regions."""
    if pd.isna(state):
        return 'central-india'
    
    state_upper = str(state).upper()
    
    region_mapping = {
        'north-india': ['JAMMU', 'KASHMIR', 'HIMACHAL', 'PUNJAB', 'HARYANA', 'UTTARAKHAND', 'UTTAR PRADESH', 'DELHI'],
        'south-india': ['ANDHRA', 'TELANGANA', 'KARNATAKA', 'TAMIL', 'KERALA', 'PUDUCHERRY'],
        'east-india': ['BIHAR', 'JHARKHAND', 'WEST BENGAL', 'ODISHA', 'ASSAM', 'SIKKIM', 'ARUNACHAL', 'NAGALAND', 'MANIPUR', 'MIZORAM', 'TRIPURA', 'MEGHALAYA'],
        'west-india': ['RAJASTHAN', 'GUJARAT', 'MAHARASHTRA', 'GOA'],
        'central-india': ['MADHYA', 'CHHATTISGARH'],
    }
    
    for region, states in region_mapping.items():
        if any(s in state_upper for s in states):
            return region
    
    return 'central-india'


def train_model(X, y):
    """Train the Random Forest Regressor model with optimized hyperparameters."""
    print("\nTraining Random Forest Regressor...")
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    print(f"Train size: {len(X_train)}, Test size: {len(X_test)}")
    
    # Create and train the model with optimized parameters for large dataset
    model = RandomForestRegressor(
        n_estimators=200,       # More trees for better accuracy
        max_depth=15,           # Deeper trees for complex patterns
        min_samples_split=10,   # Prevent overfitting on large dataset
        min_samples_leaf=5,
        max_features='sqrt',    # Feature randomization
        random_state=42,
        n_jobs=-1,              # Use all CPU cores
        verbose=1
    )
    
    print("Training model (this may take a few minutes)...")
    model.fit(X_train, y_train)
    print("Model trained successfully!")
    
    # Evaluate
    y_pred = model.predict(X_test)
    
    r2 = r2_score(y_test, y_pred)
    mae = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    
    print("\n=== Model Evaluation ===")
    print(f"R² Score: {r2:.4f} ({r2*100:.2f}%)")
    print(f"Mean Absolute Error (MAE): {mae:.2f} kg/ha")
    print(f"Root Mean Square Error (RMSE): {rmse:.2f} kg/ha")
    
    # Cross-validation (use fewer folds for large dataset)
    print("\nRunning 5-fold cross-validation...")
    cv_scores = cross_val_score(model, X, y, cv=5, scoring='r2', n_jobs=-1)
    print(f"Cross-validation R² scores: {cv_scores}")
    print(f"Mean CV R²: {cv_scores.mean():.4f} (+/- {cv_scores.std() * 2:.4f})")
    
    # Feature importance
    feature_names = list(X.columns)
    importances = model.feature_importances_
    print("\n=== Feature Importance ===")
    for name, importance in sorted(zip(feature_names, importances), key=lambda x: x[1], reverse=True):
        print(f"  {name}: {importance:.4f}")
    
    metrics = {
        "r2_score": float(r2),
        "mae": float(mae),
        "rmse": float(rmse),
        "cv_mean_r2": float(cv_scores.mean()),
        "cv_std_r2": float(cv_scores.std()),
        "training_samples": int(len(X_train)),
        "test_samples": int(len(X_test)),
        "total_samples": int(len(X)),
        "n_features": int(len(feature_names)),
        "n_estimators": 200,
        "max_depth": 15
    }
    
    return model, metrics


def save_model(model, encoders, metrics):
    """Save the trained model and encoders."""
    print("\nSaving model...")
    
    # Create model directory if it doesn't exist
    os.makedirs(MODEL_DIR, exist_ok=True)
    
    # Save model
    joblib.dump(model, MODEL_PATH)
    print(f"Model saved to: {MODEL_PATH}")
    
    # Save encoders
    joblib.dump(encoders, ENCODERS_PATH)
    print(f"Encoders saved to: {ENCODERS_PATH}")
    
    # Save metrics
    import json
    with open(METRICS_PATH, 'w') as f:
        json.dump(metrics, f, indent=2)
    print(f"Metrics saved to: {METRICS_PATH}")


def analyze_dataset(df):
    """Analyze the dataset for insights."""
    print("\n=== Dataset Analysis ===")
    
    if 'state' in df.columns:
        print(f"\nUnique States: {df['state'].nunique()}")
        print("Top 10 states by records:")
        print(df['state'].value_counts().head(10))
    
    if 'crop' in df.columns:
        print(f"\nUnique Crops: {df['crop'].nunique()}")
        print("Top 10 crops by records:")
        print(df['crop'].value_counts().head(10))
    
    if 'season' in df.columns:
        print(f"\nSeason distribution:")
        print(df['season'].value_counts())
    
    if 'year' in df.columns:
        print(f"\nYear range: {df['year'].min()} - {df['year'].max()}")


def main():
    """Main training pipeline."""
    print("=" * 60)
    print("INDIAN CROP YIELD PREDICTION MODEL TRAINING")
    print("Comprehensive Dataset with 122K+ Records")
    print("=" * 60)
    
    # Load data
    df = load_data()
    
    # Analyze dataset
    analyze_dataset(df)
    
    # Preprocess
    X, y, encoders, processed_df = preprocess_data(df)
    
    # Train
    model, metrics = train_model(X, y)
    
    # Save
    save_model(model, encoders, metrics)
    
    print("\n" + "=" * 60)
    print("TRAINING COMPLETE!")
    print(f"Model trained on {metrics['total_samples']:,} samples")
    print(f"R² Score: {metrics['r2_score']:.4f}")
    print("=" * 60)
    
    return model, encoders, metrics


if __name__ == "__main__":
    main()
