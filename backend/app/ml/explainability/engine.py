import shap
import numpy as np
import os
import matplotlib.pyplot as plt


class ExplainabilityEngine:
    def __init__(self, predict_proba_fn, background_data, feature_names):
        """
        predict_proba_fn: A function that takes a numpy array of shape (n_samples, n_features) 
                          and returns probabilities of shape (n_samples, 2).
        background_data: A numpy array representing the background dataset (e.g. scaler mean)
        feature_names: List of feature names.
        """
        self.predict_proba = predict_proba_fn
        self.background_data = background_data
        self.feature_names = feature_names

        # Always use KernelExplainer for the full ensemble pipeline
        # (Since we must explain the entire pipeline from original 30 features -> Meta learner output)
        self.shap_explainer = shap.KernelExplainer(self.predict_proba, self.background_data)

    def explain_local_shap(self, instance, output_path=None):
        instance_arr = np.array(instance).reshape(1, -1)

        # Calculate SHAP values for the instance
        shap_values = self.shap_explainer.shap_values(instance_arr)
        
        # KernelExplainer returns a list of arrays for classification (one array per class)
        # or in newer versions a 3D ndarray (n_samples, n_features, n_classes)
        if isinstance(shap_values, list):
            vals = shap_values[1] if len(shap_values) > 1 else shap_values[0]
            val_vector = np.array(vals[0], dtype=float).flatten()
        elif isinstance(shap_values, np.ndarray) and shap_values.ndim == 3:
            val_vector = np.array(shap_values[0, :, 1] if shap_values.shape[2] > 1 else shap_values[0, :, 0], dtype=float).flatten()
        else:
            val_vector = np.array(shap_values, dtype=float).flatten()
        
        base_val_raw = self.shap_explainer.expected_value
        if isinstance(base_val_raw, (list, np.ndarray)):
            base_value = base_val_raw[1] if len(base_val_raw) > 1 else base_val_raw[0]
        else:
            base_value = base_val_raw

        if output_path:
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            plt.figure()
            shap.waterfall_plot(
                shap.Explanation(
                    values=val_vector,
                    base_values=float(base_value),
                    data=instance_arr[0],
                    feature_names=self.feature_names,
                ),
                show=False,
            )
            plt.savefig(output_path, bbox_inches="tight")
            plt.close()

        return float(base_value), val_vector.tolist()
