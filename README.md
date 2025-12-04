# Runway Outcomes Lab

A full-stack data science project for analyzing fashion e-commerce returns and revenue using TheLook eCommerce dataset.

## Project Structure

```
StyleSignal/
├── backend/          # FastAPI + ML + DB access
├── frontend/         # Next.js (TypeScript) UI
├── warehouse/        # dbt project skeleton (semantic layer)
├── data/raw/         # CSV files from TheLook dataset
└── docker-compose.yml
```

## Prerequisites

- Docker and Docker Compose
- Node.js 18+ and npm
- Python 3.9+ (for local development)
- Kaggle account (to download TheLook dataset)

## Getting Started

### 1. Download TheLook Dataset

Download the following CSV files from Kaggle and place them in `data/raw/`:

- [TheLook eCommerce Dataset](https://www.kaggle.com/datasets/mustafakeser4/looker-ecommerce-bigquery-dataset)
- Alternative: [TheLook eCommerce (mirror)](https://www.kaggle.com/datasets/daichiuchigashima/thelook-ecommerce)

Required files:
- `orders.csv`
- `order_items.csv`
- `products.csv`
- `users.csv`

### 2. Start Database and Backend

```bash
docker-compose up -d
```

This will:
- Start a Postgres database on port 5432
- Start the FastAPI backend on port 8000

Wait a few seconds for services to be ready.

### 3. Load Data into Database

Once the database is running, load the CSV files:

```bash
# Option 1: From within the backend container
docker-compose exec backend python -m app.etl.load_thelook_csvs

# Option 2: From your local machine (if you have dependencies installed)
cd backend
pip install -e .
python -m app.etl.load_thelook_csvs
```

The script will read CSVs from `data/raw/` and load them into Postgres.

### 4. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at http://localhost:3000

## Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Database**: localhost:5432
  - User: `thelook_user`
  - Password: `thelook_password`
  - Database: `thelook`

## Features

### Dashboard (`/dashboard`)
- Total Revenue metric
- Overall Return Rate
- Top Category by Revenue
- Top Category by Return Rate
- Return Rate by Category chart

### Simulator (`/simulator`)
- New Drop Risk Simulator
- Input product details (category, brand, price, discount, customer info)
- Get return probability prediction and risk label

## Backend API Endpoints

- `GET /health` - Health check
- `GET /analytics/summary` - Overall summary metrics
- `GET /analytics/returns-by-category` - Return rates by category
- `POST /ml/predict_returns` - Predict return probability for products

## Development

### Backend

```bash
cd backend
pip install -e .
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend

```bash
cd frontend
npm run dev
```

### Database Access

```bash
# Connect to Postgres
docker-compose exec db psql -U thelook_user -d thelook
```

### dbt (Data Warehouse)

The `warehouse/` directory contains a dbt project for creating a semantic layer.

1. Install dbt-postgres:
   ```bash
   pip install dbt-postgres
   ```

2. Configure `~/.dbt/profiles.yml`:
   ```yaml
   runway_thelook:
     outputs:
       dev:
         type: postgres
         host: localhost
         user: thelook_user
         password: thelook_password
         port: 5432
         dbname: thelook
         schema: public
     target: dev
   ```

3. Run dbt:
   ```bash
   cd warehouse
   dbt run
   dbt test
   ```

See `warehouse/README.md` for more details.

## Environment Variables

Backend environment variables (optional, defaults work with docker-compose):

- `DATABASE_URL`: PostgreSQL connection string
  - Default: `postgresql://thelook_user:thelook_password@db:5432/thelook`

Create a `.env` file in `backend/` to override defaults.

## Troubleshooting

### Database Connection Issues

If the backend can't connect to the database:
1. Ensure `docker-compose up` is running
2. Wait for the database health check to pass
3. Check logs: `docker-compose logs db`

### CSV Loading Issues

If CSV loading fails:
1. Verify files exist in `data/raw/`
2. Check file names match exactly: `orders.csv`, `order_items.csv`, `products.csv`, `users.csv`
3. Ensure CSV files have headers
4. Check column names match expected schema (case-insensitive)

### Frontend Can't Connect to Backend

1. Ensure backend is running: `docker-compose ps`
2. Check backend logs: `docker-compose logs backend`
3. Verify CORS is enabled for `http://localhost:3000`
4. Check browser console for errors

## Next Steps

- Train a proper ML model for return prediction (currently uses heuristic)
- Add more analytics endpoints
- Enhance dashboard with additional visualizations
- Set up dbt models for production use
- Add authentication and user management

## License

MIT

