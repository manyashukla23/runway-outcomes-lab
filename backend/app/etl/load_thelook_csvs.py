"""
ETL script to load TheLook eCommerce CSV files into Postgres.

Usage:
    python -m app.etl.load_thelook_csvs
"""
import sys
import os
from pathlib import Path
import pandas as pd
from sqlalchemy import create_engine
from app.config import settings
from app.models import Base, User, Product, Order, OrderItem

# Add parent directory to path to allow imports
sys.path.insert(0, str(Path(__file__).parent.parent.parent))


def load_csvs():
    """Load CSV files from data/raw/ into Postgres"""
    
    # Try multiple paths: Docker volume mount, then repo root relative
    data_dir = None
    # Check if /data exists (Docker volume mount)
    if Path("/data/raw").exists():
        data_dir = Path("/data/raw")
    else:
        # Get path to data/raw/ (relative to repo root)
        repo_root = Path(__file__).parent.parent.parent.parent
        data_dir = repo_root / "data" / "raw"
    
    if not data_dir.exists():
        print(f"Error: {data_dir} does not exist. Please create it and add CSV files.")
        return
    
    # Create database engine
    engine = create_engine(settings.database_url)
    
    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)
    
    print("Loading CSV files into Postgres...")
    
    # Load users.csv
    users_file = data_dir / "users.csv"
    if users_file.exists():
        print(f"Loading {users_file}...")
        df_users = pd.read_csv(users_file)
        # Map column names to model fields (handle case variations)
        df_users.columns = df_users.columns.str.lower()
        # Select only columns that exist in our model
        user_columns = ['id', 'first_name', 'last_name', 'gender', 'age', 'country', 'city', 'state', 'email', 'created_at', 'updated_at']
        df_users_filtered = df_users[[col for col in user_columns if col in df_users.columns]].copy()
        df_users_filtered.to_sql("users", engine, if_exists="append", index=False, method="multi", chunksize=1000)
        print(f"Loaded {len(df_users_filtered)} users")
    else:
        print(f"Warning: {users_file} not found")
    
    # Load products.csv
    products_file = data_dir / "products.csv"
    if products_file.exists():
        print(f"Loading {products_file}...")
        df_products = pd.read_csv(products_file)
        df_products.columns = df_products.columns.str.lower()
        # Select only columns that exist in our model
        product_columns = ['id', 'brand', 'department', 'category', 'name', 'retail_price', 'cost', 'created_at']
        df_products_filtered = df_products[[col for col in product_columns if col in df_products.columns]].copy()
        df_products_filtered.to_sql("products", engine, if_exists="append", index=False, method="multi", chunksize=1000)
        print(f"Loaded {len(df_products_filtered)} products")
    else:
        print(f"Warning: {products_file} not found")
    
    # Load orders.csv
    orders_file = data_dir / "orders.csv"
    if orders_file.exists():
        print(f"Loading {orders_file}...")
        df_orders = pd.read_csv(orders_file)
        df_orders.columns = df_orders.columns.str.lower()
        # Map order_id to id if needed
        if 'order_id' in df_orders.columns and 'id' not in df_orders.columns:
            df_orders['id'] = df_orders['order_id']
        # Select only columns that exist in our model
        order_columns = ['id', 'user_id', 'status', 'created_at', 'shipped_at', 'delivered_at', 'returned_at']
        df_orders_filtered = df_orders[[col for col in order_columns if col in df_orders.columns]].copy()
        # Convert date columns if they exist
        for col in ["created_at", "shipped_at", "delivered_at", "returned_at"]:
            if col in df_orders_filtered.columns:
                df_orders_filtered[col] = pd.to_datetime(df_orders_filtered[col], errors="coerce")
        df_orders_filtered.to_sql("orders", engine, if_exists="append", index=False, method="multi", chunksize=1000)
        print(f"Loaded {len(df_orders_filtered)} orders")
    else:
        print(f"Warning: {orders_file} not found")
    
    # Load order_items.csv
    order_items_file = data_dir / "order_items.csv"
    if order_items_file.exists():
        print(f"Loading {order_items_file}...")
        df_order_items = pd.read_csv(order_items_file)
        df_order_items.columns = df_order_items.columns.str.lower()
        # Select only columns that exist in our model
        order_item_columns = ['id', 'order_id', 'user_id', 'product_id', 'sale_price', 'discount', 'status', 'created_at', 'returned_at']
        df_order_items_filtered = df_order_items[[col for col in order_item_columns if col in df_order_items.columns]].copy()
        # Convert date columns if they exist
        for col in ["created_at", "returned_at"]:
            if col in df_order_items_filtered.columns:
                df_order_items_filtered[col] = pd.to_datetime(df_order_items_filtered[col], errors="coerce")
        df_order_items_filtered.to_sql("order_items", engine, if_exists="append", index=False, method="multi", chunksize=1000)
        print(f"Loaded {len(df_order_items_filtered)} order items")
    else:
        print(f"Warning: {order_items_file} not found")
    
    print("ETL complete!")


if __name__ == "__main__":
    load_csvs()

