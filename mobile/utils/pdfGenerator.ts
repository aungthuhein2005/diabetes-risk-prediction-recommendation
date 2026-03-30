import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export type RecommendationResult = {
  risk: string;
  probability: number;
  top_factors: { feature: string; impact: string }[];
  advice: string;
};

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function adviceToHtml(advice: string): string {
  return advice
    .replace(/\*\*/g, '')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => `<p>${escapeHtml(line)}</p>`)
    .join('');
}

function buildRecommendationHtml(result: RecommendationResult): string {
  const probabilityPercent = (result.probability * 100).toFixed(1);
  const topFactors = result.top_factors
    .map((factor) => `<li>${escapeHtml(factor.feature)} (${escapeHtml(factor.impact)})</li>`)
    .join('');

  return `
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body {
            font-family: Arial, sans-serif;
            color: #0f172a;
            padding: 24px;
            line-height: 1.55;
          }
          h1 {
            margin: 0 0 4px 0;
            font-size: 24px;
          }
          .subtitle {
            margin: 0 0 18px 0;
            color: #64748b;
            font-size: 13px;
          }
          .row {
            display: flex;
            gap: 12px;
            margin-bottom: 16px;
          }
          .badge {
            flex: 1;
            border-radius: 10px;
            padding: 10px 12px;
          }
          .risk {
            background: #ffe4e6;
            color: #be123c;
          }
          .probability {
            background: #dbeafe;
            color: #1d4ed8;
          }
          h2 {
            margin: 14px 0 8px;
            font-size: 16px;
          }
          ul {
            margin-top: 6px;
            margin-bottom: 0;
            padding-left: 18px;
          }
          p {
            margin: 0 0 8px 0;
            font-size: 14px;
          }
          .note {
            margin-top: 16px;
            color: #64748b;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <h1>DiaPredict Health Recommendation</h1>
        <p class="subtitle">Generated recommendation report</p>

        <div class="row">
          <div class="badge risk"><strong>Risk:</strong> ${escapeHtml(result.risk)}</div>
          <div class="badge probability"><strong>Probability:</strong> ${probabilityPercent}%</div>
        </div>

        <h2>Top Factors</h2>
        <ul>${topFactors}</ul>

        <h2>Advice</h2>
        ${adviceToHtml(result.advice)}

        <p class="note">
          This report is educational and not a diagnosis. Consult a qualified healthcare professional.
        </p>
      </body>
    </html>
  `;
}

export async function generateRecommendationPdf(result: RecommendationResult): Promise<string> {
  const html = buildRecommendationHtml(result);
  const { uri } = await Print.printToFileAsync({ html });
  return uri;
}

export async function downloadRecommendationPdf(result: RecommendationResult): Promise<string> {
  const pdfUri = await generateRecommendationPdf(result);
  const canShare = await Sharing.isAvailableAsync();

  if (canShare) {
    await Sharing.shareAsync(pdfUri, {
      UTI: '.pdf',
      mimeType: 'application/pdf',
      dialogTitle: 'Download Healthcare Recommendation PDF',
    });
  }

  return pdfUri;
}
