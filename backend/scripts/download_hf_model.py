import os
import shutil
from huggingface_hub import hf_hub_download

def download_model():
    repo_id = "yahiaehab10/fraud-ccf-lightgbm"
    
    print(f"Downloading model pipeline from {repo_id}...")
    pipeline_path = hf_hub_download(
        repo_id=repo_id,
        filename="pipeline.pkl"
    )
    
    print(f"Downloading threshold from {repo_id}...")
    threshold_path = hf_hub_download(
        repo_id=repo_id,
        filename="threshold.json"
    )
    
    # Destination directory
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    dest_dir = os.path.join(base_dir, "models", "fraud-ccf-lightgbm")
    
    os.makedirs(dest_dir, exist_ok=True)
    
    shutil.copy(pipeline_path, os.path.join(dest_dir, "pipeline.pkl"))
    shutil.copy(threshold_path, os.path.join(dest_dir, "threshold.json"))
    
    print(f"Model successfully saved to {dest_dir}")

if __name__ == '__main__':
    download_model()
