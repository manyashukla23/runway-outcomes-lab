import os
import pickle
from pathlib import Path
from typing import List
from app.schemas import ProductInput, PredictionResult


class ReturnPredictionModel:
    """Simple return prediction model (heuristic-based stub)"""
    
    def __init__(self):
        self.model_path = Path(__file__).parent.parent.parent / "models" / "returns_model.pkl"
        self.model = None
        self._load_model()
    
    def _load_model(self):
        """Try to load a trained model, otherwise use heuristic"""
        if self.model_path.exists():
            try:
                with open(self.model_path, "rb") as f:
                    self.model = pickle.load(f)
            except Exception as e:
                print(f"Could not load model: {e}. Using heuristic.")
                self.model = None
        else:
            print("No trained model found. Using heuristic.")
            self.model = None
    
    def predict(self, products: List[ProductInput]) -> List[PredictionResult]:
        """Predict return probability for products"""
        predictions = []
        
        for product in products:
            if self.model:
                # If we had a trained model, use it here
                # For now, this is a stub
                return_prob = 0.25
            else:
                # Heuristic: higher price + high discount + younger customer → higher return risk
                base_risk = 0.15
                
                # Price factor (higher price = higher risk)
                price_factor = min(product.price / 200.0, 1.0) * 0.15
                
                # Discount factor (higher discount = higher risk)
                discount_factor = (product.discount_pct / 100.0) * 0.20
                
                # Age factor (younger = slightly higher risk)
                age_factor = max(0, (30 - product.customer_age) / 30.0) * 0.10
                
                return_prob = min(base_risk + price_factor + discount_factor + age_factor, 0.95)
            
            # Risk label
            if return_prob < 0.2:
                risk_label = "Low"
            elif return_prob < 0.4:
                risk_label = "Medium"
            else:
                risk_label = "High"
            
            predictions.append(
                PredictionResult(
                    product_id=product.product_id,
                    return_probability=round(return_prob, 3),
                    risk_label=risk_label
                )
            )
        
        return predictions


# Global model instance
model = ReturnPredictionModel()

