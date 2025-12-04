# Runway Outcomes Lab - User Manual

## Overview

Runway Outcomes Lab is a full-stack fashion analytics platform that helps you analyze returns, revenue, and predict return risks for fashion products. The platform provides:

- **Collections Analytics Dashboard**: Real-time insights into revenue, return rates, and category performance
- **New Drop Risk Simulator**: Predict return probability for new products before launch
- **Comprehensive Analytics**: Multiple charts and visualizations for data-driven decision making

## Getting Started

### Prerequisites

- **PostgreSQL** (version 16 or higher)
- **Python** (3.9 or higher)
- **Node.js** (18 or higher)
- **npm** or **yarn**

### Initial Setup

1. **Clone the repository** (if not already done):
   ```bash
   git clone <your-repo-url>
   cd StyleSignal
   ```

2. **Set up the database**:
   - Ensure PostgreSQL is running on your machine
   - Create a database named `thelook`:
     ```bash
     psql -U postgres -c "CREATE DATABASE thelook;"
     ```
   - The default connection uses:
     - User: `postgres`
     - Password: `12345`
     - Database: `thelook`
     - Port: `5432`

3. **Download the dataset**:
   - Download TheLook eCommerce dataset from Kaggle:
     - [Looker Ecommerce BigQuery Dataset (CSV)](https://www.kaggle.com/datasets/mustafakeser4/looker-ecommerce-bigquery-dataset)
     - Or [TheLook eCommerce (alternative)](https://www.kaggle.com/datasets/daichiuchigashima/thelook-ecommerce)
   - Place the following CSV files in `data/raw/`:
     - `orders.csv`
     - `order_items.csv`
     - `products.csv`
     - `users.csv`

4. **Set up the backend**:
   ```bash
   cd backend
   pip install -e .
   ```

5. **Load data into the database**:
   ```bash
   python -m app.etl.load_thelook_csvs
   ```
   This will load all CSV files from `data/raw/` into your PostgreSQL database.

6. **Set up the frontend**:
   ```bash
   cd ../frontend
   npm install
   ```

## Running the Application

### Start the Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Start the FastAPI server:
   ```bash
   python3 -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

   The API will be available at:
   - **API**: http://localhost:8000
   - **Interactive Docs**: http://localhost:8000/docs
   - **Health Check**: http://localhost:8000/health

### Start the Frontend

1. Open a new terminal window
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

3. Start the Next.js development server:
   ```bash
   npm run dev
   ```

   The frontend will be available at:
   - **Dashboard**: http://localhost:3001
   - **Simulator**: http://localhost:3001/simulator

## Using the Dashboard

### Collections Analytics Dashboard

The dashboard provides a comprehensive view of your fashion business metrics:

#### Key Metrics Cards

1. **Total Revenue**: Sum of all completed order sales
2. **Overall Return Rate**: Percentage of items returned across all categories
3. **Top Category (Revenue)**: Category generating the highest revenue
4. **Top Category (Returns)**: Category with the highest return rate

#### Analytics Charts

1. **Return Rate by Category** (Bar Chart)
   - Visualizes return rates across different product categories
   - Helps identify risky categories before the next product drop
   - Hover over bars to see detailed return rate percentages

2. **Revenue by Department** (Pie Chart)
   - Shows revenue distribution across departments (Women, Men, Kids, etc.)
   - Displays order counts for each department
   - Helps understand which departments drive the most revenue

3. **Top Brands by Revenue** (Bar Chart)
   - Lists top-performing brands by revenue
   - Shows product count per brand
   - Useful for identifying successful brand partnerships

4. **Customer Age Distribution** (Bar Chart)
   - Displays customer distribution across age ranges
   - Shows average order value per age group
   - Helps understand your customer demographics

#### Insight Cards

- **Quick Insight**: Provides actionable recommendations based on your data
- **Next Step**: Direct link to the Risk Simulator for testing new products

### New Drop Risk Simulator

The simulator helps you predict return probability for new products before launch.

#### How to Use

1. Navigate to the Simulator page from the dashboard or use the link in the "Next Step" card

2. Fill in the product details:
   - **Category**: Product category (e.g., Dresses, Shoes, Tops)
   - **Brand**: Brand name
   - **Department**: Women, Men, Kids, or Accessories
   - **Price**: Product price in USD
   - **Discount %**: Discount percentage (0-100)
   - **Customer Age**: Target customer age
   - **Customer Country**: Target market country code (e.g., US, UK)

3. Click **"Predict New Drop Risk"**

4. Review the results:
   - **Return Probability**: Percentage chance of return (0-100%)
   - **Risk Label**: 
     - **Low**: < 30% return probability
     - **Medium**: 30-50% return probability
     - **High**: > 50% return probability
   - **Visual Progress Bar**: Color-coded risk indicator
   - **Recommendations**: Contextual advice based on risk level

#### Understanding the Results

- **Low Risk (Green)**: Product is likely to perform well with minimal returns
- **Medium Risk (Amber)**: Consider adjusting pricing, discount, or target market
- **High Risk (Red)**: High likelihood of returns - review product strategy

## API Endpoints

### Analytics Endpoints

- `GET /analytics/summary`
  - Returns overall summary metrics (revenue, return rates, top categories)
  
- `GET /analytics/returns-by-category`
  - Returns return rates grouped by product category
  
- `GET /analytics/revenue-by-department`
  - Returns revenue breakdown by department
  
- `GET /analytics/revenue-by-brand?limit=10`
  - Returns top brands by revenue (default limit: 10)
  
- `GET /analytics/returns-by-department`
  - Returns return rates grouped by department
  
- `GET /analytics/age-distribution`
  - Returns customer age distribution with average order values
  
- `GET /analytics/revenue-by-country?limit=10`
  - Returns top countries by revenue (default limit: 10)

### ML Endpoints

- `POST /ml/predict_returns`
  - Predicts return probability for one or more products
  - Request body:
    ```json
    {
      "products": [
        {
          "product_id": 123,
          "category": "Dresses",
          "brand": "Example",
          "department": "Women",
          "price": 129.99,
          "discount_pct": 20,
          "customer_age": 24,
          "customer_country": "US"
        }
      ]
    }
    ```
  - Response:
    ```json
    {
      "predictions": [
        {
          "product_id": 123,
          "return_probability": 0.31,
          "risk_label": "Medium"
        }
      ]
    }
    ```

### Utility Endpoints

- `GET /health`
  - Health check endpoint
  - Returns: `{"status": "ok"}`

- `GET /`
  - Root endpoint with API information

## Troubleshooting

### Backend Issues

**Problem**: Backend won't start
- **Solution**: Check if PostgreSQL is running and the database exists
- **Solution**: Verify database credentials in `backend/app/config.py`

**Problem**: "Connection refused" errors
- **Solution**: Ensure PostgreSQL is running: `pg_isready -U postgres`
- **Solution**: Check if port 8000 is available: `lsof -i :8000`

**Problem**: Data not loading
- **Solution**: Verify CSV files are in `data/raw/` directory
- **Solution**: Check CSV file names match exactly: `orders.csv`, `order_items.csv`, `products.csv`, `users.csv`
- **Solution**: Ensure database tables exist (run migrations if needed)

### Frontend Issues

**Problem**: Frontend shows "API: Disconnected"
- **Solution**: Ensure backend is running on http://localhost:8000
- **Solution**: Check browser console for CORS errors
- **Solution**: Verify API_BASE_URL in frontend code matches your backend URL

**Problem**: Charts not displaying
- **Solution**: Check browser console for errors
- **Solution**: Verify data is loaded in the database
- **Solution**: Check network tab to see if API calls are successful

**Problem**: Port 3001 already in use
- **Solution**: Change port in `frontend/package.json` or use: `npm run dev -- -p 3002`

### Database Issues

**Problem**: "Database does not exist"
- **Solution**: Create the database: `psql -U postgres -c "CREATE DATABASE thelook;"`
- **Solution**: Verify database name in connection string

**Problem**: "Password authentication failed"
- **Solution**: Update password in `backend/app/config.py` to match your PostgreSQL password
- **Solution**: Or set DATABASE_URL environment variable

## Customization

### Changing Database Connection

Edit `backend/app/config.py`:
```python
database_url: str = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:YOUR_PASSWORD@localhost:5432/thelook"
)
```

Or set environment variable:
```bash
export DATABASE_URL="postgresql://user:password@host:port/database"
```

### Changing API Port

Edit the uvicorn command:
```bash
python3 -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
```

Update frontend `API_BASE_URL` in dashboard and simulator pages.

### Changing Frontend Port

Edit `frontend/package.json`:
```json
{
  "scripts": {
    "dev": "next dev -p 3002"
  }
}
```

## Best Practices

1. **Regular Data Updates**: Keep your dataset current for accurate analytics
2. **Monitor Return Rates**: Use the dashboard to track trends over time
3. **Test Before Launch**: Always use the simulator before launching new products
4. **Review High-Risk Categories**: Focus optimization efforts on categories with high return rates
5. **Brand Performance**: Use brand analytics to identify successful partnerships

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review API documentation at http://localhost:8000/docs
3. Check browser console and network tabs for errors
4. Verify all prerequisites are installed and running

## Next Steps

- Explore the interactive API documentation at http://localhost:8000/docs
- Experiment with different product configurations in the simulator
- Analyze trends in your dashboard to optimize your product strategy
- Consider training a custom ML model for more accurate predictions

---

**Happy Analyzing! 🎨✨**

