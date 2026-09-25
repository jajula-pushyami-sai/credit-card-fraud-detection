export interface ShapFeature {
  name: string;
  value: number;
  contribution: number;
}

export interface BusinessExplanation {
  predictionSummary: string[];
  topPositiveFactors: string[];
  topNegativeFactors: string[];
  finalDecision: string;
  confidenceScore: string;
  recommendedAction: 'Approve' | 'Review' | 'Decline';
  analystRecommendation: string;
}

export function getReadableFeatureName(rawName: string): string {
  if (rawName === 'Amount') return 'Transaction Amount';
  
  // Try extracting the VX part
  const match = rawName.match(/^(V\d+)/);
  if (match) {
    return match[1];
  }
  
  return rawName.replace(/\s*\(.*\)\s*/g, ''); // Strip parenthesis if fallback
}

export function generateExplanation(
  features: ShapFeature[], 
  probability: number
): BusinessExplanation {
  const sortedFeatures = [...features].sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));
  
  const positiveContributors = sortedFeatures.filter(f => f.contribution > 0);
  const negativeContributors = sortedFeatures.filter(f => f.contribution <= 0);

  const topPositive = positiveContributors.slice(0, 3).map(f => getReadableFeatureName(f.name));
  const topNegative = negativeContributors.slice(0, 2).map(f => getReadableFeatureName(f.name));

  const summaryBullets: string[] = [];
  
  // Generate reasoning sentences for top contributors
  positiveContributors.slice(0, 4).forEach(f => {
    const readable = getReadableFeatureName(f.name);
    let reasoning = "";
    if (f.name === 'Amount' || readable === 'Transaction Amount') {
      reasoning = `The transaction amount contributed positively to the model's fraud score.`;
    } else {
      reasoning = `This anonymized feature (${readable}) contributed positively to the model's fraud score.`;
    }
    summaryBullets.push(reasoning);
  });

  if (negativeContributors.length > 0) {
    const readable = getReadableFeatureName(negativeContributors[0].name);
    summaryBullets.push(`These factors increased the fraud probability, while ${readable} slightly reduced the risk.`);
  }

  const confidencePercent = (probability * 100).toFixed(1);
  const isHighRisk = probability > 0.75;
  const isMediumRisk = probability > 0.30 && probability <= 0.75;
  
  let recommendedAction: 'Approve' | 'Review' | 'Decline';
  let finalDecision: string;
  let analystRecommendation: string;

  if (isHighRisk) {
    finalDecision = 'High Risk';
    recommendedAction = 'Decline';
    analystRecommendation = 'Immediate decline recommended. Core features indicate a high probability of fraud.';
  } else if (isMediumRisk) {
    finalDecision = 'Elevated Risk';
    recommendedAction = 'Review';
    analystRecommendation = 'Manual review required. While some signals are anomalous, they do not conclusively indicate fraud. Verify customer intent.';
  } else {
    finalDecision = 'Low Risk';
    recommendedAction = 'Approve';
    analystRecommendation = 'Approve transaction. Features align with historical norms.';
  }
  
  summaryBullets.push(`Overall confidence of the ensemble model is ${confidencePercent}%, therefore the transaction is classified as ${finalDecision}.`);

  return {
    predictionSummary: summaryBullets,
    topPositiveFactors: topPositive,
    topNegativeFactors: topNegative,
    finalDecision,
    confidenceScore: `${confidencePercent}%`,
    recommendedAction,
    analystRecommendation
  };
}
