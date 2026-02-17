// ============================================================================
// Mental Monitoring Keyword Pre-Screening
// Ported from legacy/analysis.py check_wellbeing_keywords()
// Translated from German to English for English UI
// ============================================================================

const MILD_KEYWORDS = [
  "stress", "overwhelmed", "exhausted", "tired", "sleep",
  "worried", "anxiety", "doubt", "insecure", "difficult",
  "lonely", "frustrated", "pressure", "nervous", "afraid",
];

const FLAG_KEYWORDS = [
  "hopeless", "helpless", "self-harm", "suicide",
  "can't go on", "no point", "give up", "want to die",
  "hurt myself", "end it all",
];

export function checkMentalMonitoringKeywords(text: string): string[] {
  const textLower = text.toLowerCase();
  const found: string[] = [];

  // Check flag keywords first (higher priority)
  for (const keyword of FLAG_KEYWORDS) {
    if (textLower.includes(keyword)) {
      found.push(keyword);
    }
  }

  for (const keyword of MILD_KEYWORDS) {
    if (textLower.includes(keyword)) {
      found.push(keyword);
    }
  }

  return found;
}
