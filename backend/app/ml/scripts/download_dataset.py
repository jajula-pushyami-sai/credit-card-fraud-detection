import os
from kaggle.api.kaggle_api_extended import KaggleApi


def download_dataset(dataset_name="mlg-ulb/creditcardfraud", output_dir="../data/raw"):
    print(f"Initializing download for {dataset_name}...")

    # Ensure directory exists
    os.makedirs(output_dir, exist_ok=True)

    # Initialize API (requires ~/.kaggle/kaggle.json or ENV vars)
    api = KaggleApi()
    api.authenticate()

    # Download file
    print("Downloading...")
    api.dataset_download_files(dataset_name, path=output_dir, unzip=True)

    print(f"Dataset successfully downloaded and extracted to {output_dir}")


if __name__ == "__main__":
    download_dataset()
