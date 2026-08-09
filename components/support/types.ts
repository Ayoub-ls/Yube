export interface SupportOption {
  id: string;
  iconName: 'Layout' | 'KanbanSquare' | 'Megaphone' | 'MessageCircle';
  title: string;
  subtitle?: string;
  description: string;
  bulletPoints?: string[];
  buttonText: string;
  whatsappMessage: string;
  badge?: string;
  accentColor?: string;
}

export interface SupportBubbleProps {
  /** WhatsApp phone number with country code, e.g. "213555123456" */
  phoneNumber?: string;
  /** Custom badge character or text, default is "?" */
  badgeText?: string;
  /** Initial open state of modal */
  defaultOpen?: boolean;
  /** Position on screen, default bottom-8 right-8 */
  positionClass?: string;
  /** Language direction, default 'rtl' */
  dir?: 'rtl' | 'ltr';
  /** Custom callback when WhatsApp link is triggered */
  onOptionClick?: (option: SupportOption, url: string) => void;
}
