/**
 * Cleans a phone number to only contain digits.
 * Converts local Algerian numbers (e.g., 0550123456) to international format (213550123456).
 */
export function cleanPhoneNumber(phone: string): string {
  // Strip all non-digits
  let cleaned = phone.replace(/\D/g, '');

  // If local Algerian number format (e.g., starts with 05, 06, 07)
  if (cleaned.startsWith('0') && cleaned.length === 10 && ['5', '6', '7'].includes(cleaned[1])) {
    cleaned = '213' + cleaned.substring(1);
  }

  // If starting with 5, 6, 7 and is 9 digits long (missing prefix and leading 0)
  if (cleaned.length === 9 && ['5', '6', '7'].includes(cleaned[0])) {
    cleaned = '213' + cleaned;
  }

  return cleaned;
}

/**
 * Replaces the {{businessName}} placeholder in a template message with the
 * lead's actual business name. Admins can put {{businessName}} anywhere in
 * a template — this is where it gets swapped in before the message is
 * previewed or sent via WhatsApp. Matching is case-insensitive and
 * tolerates stray spaces inside the braces (e.g. "{{ businessName }}").
 */
export function renderTemplateMessage(message: string, businessName: string): string {
  return message.replace(/\{\{\s*businessName\s*\}\}/gi, businessName);
}

/**
 * Builds a standard WhatsApp API URL for a phone number and message.
 */
export function buildWhatsAppUrl(phone: string, message: string): string {
  const cleanedPhone = cleanPhoneNumber(phone);
  return `https://api.whatsapp.com/send?phone=${cleanedPhone}&text=${encodeURIComponent(message)}`;
}

/**
 * Opens a WhatsApp chat in a new tab with the prepared message.
 */
export function openWhatsApp(phone: string, message: string): void {
  if (typeof window !== 'undefined') {
    const url = buildWhatsAppUrl(phone, message);
    window.open(url, '_blank');
  }
}
