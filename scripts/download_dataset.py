#!/usr/bin/env python3
"""
Download TheLook eCommerce dataset from Kaggle.

This script downloads the dataset and extracts the CSV files to data/raw/
"""
import os
import sys
import zipfile
from pathlib import Path

try:
    import kagglehub
except ImportError:
    print("Installing kagglehub...")
    os.system(f"{sys.executable} -m pip install kagglehub --quiet")
    import kagglehub


def download_dataset():
    """Download TheLook dataset from Kaggle"""
    
    # Ensure data/raw directory exists
    repo_root = Path(__file__).parent.parent
    data_dir = repo_root / "data" / "raw"
    data_dir.mkdir(parents=True, exist_ok=True)
    
    print("Downloading TheLook eCommerce dataset from Kaggle...")
    print("This may take a few minutes (170 MB)...")
    
    try:
        # Download the dataset
        path = kagglehub.dataset_download("mustafakeser4/looker-ecommerce-bigquery-dataset")
        print(f"\nDataset downloaded to: {path}")
        
        # Find the zip file or CSV files
        dataset_path = Path(path)
        
        # Look for zip file
        zip_files = list(dataset_path.glob("*.zip"))
        if zip_files:
            zip_path = zip_files[0]
            print(f"\nExtracting {zip_path.name}...")
            with zipfile.ZipFile(zip_path, 'r') as zip_ref:
                # Extract all CSV files to data/raw/
                for member in zip_ref.namelist():
                    if member.endswith('.csv'):
                        # Get just the filename
                        filename = os.path.basename(member)
                        target_path = data_dir / filename
                        with zip_ref.open(member) as source, open(target_path, 'wb') as target:
                            target.write(source.read())
                        print(f"  Extracted: {filename}")
        else:
            # Look for CSV files directly
            csv_files = list(dataset_path.rglob("*.csv"))
            if csv_files:
                print(f"\nFound {len(csv_files)} CSV files, copying to data/raw/...")
                for csv_file in csv_files:
                    filename = csv_file.name
                    target_path = data_dir / filename
                    import shutil
                    shutil.copy2(csv_file, target_path)
                    print(f"  Copied: {filename}")
            else:
                print("\nWarning: No CSV files found in downloaded dataset.")
                print(f"Please check the downloaded files in: {path}")
                return False
        
        # Verify required files
        required_files = ["orders.csv", "order_items.csv", "products.csv", "users.csv"]
        missing = []
        for file in required_files:
            if not (data_dir / file).exists():
                missing.append(file)
        
        if missing:
            print(f"\n⚠️  Warning: Missing required files: {', '.join(missing)}")
            print(f"Please check {data_dir} for available files.")
        else:
            print("\n✅ Success! All required CSV files are in data/raw/")
            print("\nNext step: Load the data into Postgres:")
            print("  docker-compose exec backend python -m app.etl.load_thelook_csvs")
        
        return True
        
    except Exception as e:
        print(f"\n❌ Error downloading dataset: {e}")
        print("\nAlternative: Download manually from Kaggle:")
        print("  1. Click 'Download dataset as zip (170 MB)' on the Kaggle page")
        print("  2. Extract the zip file")
        print("  3. Copy orders.csv, order_items.csv, products.csv, users.csv to data/raw/")
        return False


if __name__ == "__main__":
    download_dataset()

