from fastapi import APIRouter
from app.schemas import PredictReturnsRequest, PredictReturnsResponse
from app.ml.model import model

router = APIRouter(prefix="/ml", tags=["ml"])


@router.post("/predict_returns", response_model=PredictReturnsResponse)
def predict_returns(request: PredictReturnsRequest):
    """Predict return probability for products"""
    predictions = model.predict(request.products)
    return PredictReturnsResponse(predictions=predictions)

