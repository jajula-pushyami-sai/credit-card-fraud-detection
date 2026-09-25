/**
 * FraudShield AI — Frontend Configuration Environment Loader
 */

interface Env {
  API_URL: string;
  IS_DEV: boolean;
}

export const env: Env = {
  API_URL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
  IS_DEV: import.meta.env.DEV,
};
