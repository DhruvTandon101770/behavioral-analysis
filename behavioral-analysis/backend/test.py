import pickle

import joblib

scaler = joblib.load("scaler.pkl")
print(type(scaler))  # Should be <class 'sklearn.preprocessing._data.StandardScaler'>

# Check its attributes
print(type(scaler))  # Should be <class 'sklearn.preprocessing._data.StandardScaler'>
print(f"Scaler expects {scaler.n_features_in_} features.")  # Should print 11 features

