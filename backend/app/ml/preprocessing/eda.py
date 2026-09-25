import logging
logger = logging.getLogger(__name__)
import os
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import json


class EDAGenerator:
    def __init__(self, data_path: str, output_dir: str):
        self.data_path = data_path
        self.output_dir = output_dir
        os.makedirs(self.output_dir, exist_ok=True)
        self.df = pd.read_csv(self.data_path)

    def generate_all_reports(self):
        logger.info("Generating EDA Reports...")
        self._missing_values_report()
        self._class_imbalance_report()
        self._correlation_matrix()
        logger.info(f"Reports saved to {self.output_dir}")

    def _missing_values_report(self):
        missing = self.df.isnull().sum()
        duplicates = self.df.duplicated().sum()
        report = {
            "total_rows": len(self.df),
            "duplicates": int(duplicates),
            "missing_values": missing.to_dict(),
        }
        with open(os.path.join(self.output_dir, "missing_report.json"), "w") as f:
            json.dump(report, f, indent=4)

    def _class_imbalance_report(self):
        plt.figure(figsize=(8, 6))
        sns.countplot(x="Class", data=self.df, palette=["#8FAF9B", "#D96B6B"])
        plt.title("Fraud Distribution (Class Imbalance)")
        plt.savefig(os.path.join(self.output_dir, "fraud_distribution.png"))
        plt.close()

        counts = self.df["Class"].value_counts()
        with open(os.path.join(self.output_dir, "class_imbalance.json"), "w") as f:
            json.dump(
                {
                    "legitimate": int(counts[0]),
                    "fraudulent": int(counts[1]),
                    "fraud_percentage": float((counts[1] / len(self.df)) * 100),
                },
                f,
                indent=4,
            )

    def _correlation_matrix(self):
        plt.figure(figsize=(24, 20))
        corr = self.df.corr()
        sns.heatmap(corr, cmap="coolwarm", annot=False)
        plt.title("Feature Correlation Matrix")
        plt.savefig(os.path.join(self.output_dir, "correlation_matrix.png"))
        plt.close()


if __name__ == "__main__":
    generator = EDAGenerator(
        data_path="../data/raw/creditcard.csv", output_dir="../artifacts/eda/"
    )
    generator.generate_all_reports()
