import { OutreachLead, MessageTemplate } from '../types';

const LEADS_KEY = 'yube_outreach_leads';
const TEMPLATES_KEY = 'yube_outreach_templates';

const DEFAULT_TEMPLATES: MessageTemplate[] = [
  {
    id: 'tpl-1',
    name: 'Product Page Intro',
    lead_type: 'product_page',
    message: `السلام عليكم خويا، دخلت لصفحة المنتج ديالكم وعجبني بزاف التصميم والخدمة ديالكم!
حبيت نقترح عليكم تحسين الصفحة باش تزيدو في نسبة المبيعات وتسهلو الطلب على الزبائن.
خدمنا منصة Yube خصيصاً للتجار في الجزائر لتصميم صفحات هبوط احترافية وسريعة.
حبيت نرسلك رابط لمثال لصفحة هبوط مخصصة لمنتجكم تشوفها مجاناً؟`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'tpl-2',
    name: 'DM Conversion Intro',
    lead_type: 'dm',
    message: `السلام عليكم، شفت بلي تبيعو بزاف في الخاص (DM) والأنستغرام.
حابين نساعدوكم تسهلو عملية الشراء على الزبائن وتجمعو كامل الطلبيات في بلاصة وحدة بلا ما تضيعو الوقت في المحادثات.
منصة Yube تعطيكم استمارة سريعة ومحترفة لـ 58 ولاية، مدمجة مع نظام إدارة الطلبيات (CRM).
حاب نبعتلك تجربة مجانية للمنصة لمدة شهر كامل؟`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

const DEFAULT_LEADS: OutreachLead[] = [
  {
    id: 'lead-1',
    business_name: 'Elegance Boutique DZ',
    whatsapp_number: '0550123456',
    lead_type: 'product_page',
    created_at: new Date().toISOString(),
  },
  {
    id: 'lead-2',
    business_name: 'Algeria Streetwear',
    whatsapp_number: '0660987654',
    lead_type: 'dm',
    created_at: new Date().toISOString(),
  }
];

// Helper to access localStorage safely on both client and server
function getStorageItem(key: string): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key);
  }
  return null;
}

function setStorageItem(key: string, value: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, value);
  }
}

export const storageService = {
  getLeads(): OutreachLead[] {
    const data = getStorageItem(LEADS_KEY);
    if (!data) {
      setStorageItem(LEADS_KEY, JSON.stringify(DEFAULT_LEADS));
      return DEFAULT_LEADS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return DEFAULT_LEADS;
    }
  },

  getTemplates(): MessageTemplate[] {
    const data = getStorageItem(TEMPLATES_KEY);
    if (!data) {
      setStorageItem(TEMPLATES_KEY, JSON.stringify(DEFAULT_TEMPLATES));
      return DEFAULT_TEMPLATES;
    }
    try {
      return JSON.parse(data);
    } catch {
      return DEFAULT_TEMPLATES;
    }
  },

  addLead(lead: Omit<OutreachLead, 'id' | 'created_at'>): OutreachLead {
    const leads = this.getLeads();
    const newLead: OutreachLead = {
      ...lead,
      id: 'lead-' + Date.now(),
      created_at: new Date().toISOString(),
    };
    leads.unshift(newLead);
    setStorageItem(LEADS_KEY, JSON.stringify(leads));
    return newLead;
  },

  deleteLead(id: string): void {
    const leads = this.getLeads().filter((l) => l.id !== id);
    setStorageItem(LEADS_KEY, JSON.stringify(leads));
  },

  addTemplate(template: Omit<MessageTemplate, 'id' | 'created_at' | 'updated_at'>): MessageTemplate {
    const templates = this.getTemplates();
    const newTemplate: MessageTemplate = {
      ...template,
      id: 'tpl-' + Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    templates.unshift(newTemplate);
    setStorageItem(TEMPLATES_KEY, JSON.stringify(templates));
    return newTemplate;
  },

  updateTemplate(id: string, updates: Partial<MessageTemplate>): MessageTemplate | null {
    const templates = this.getTemplates();
    const index = templates.findIndex((t) => t.id === id);
    if (index === -1) return null;

    const updated: MessageTemplate = {
      ...templates[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    templates[index] = updated;
    setStorageItem(TEMPLATES_KEY, JSON.stringify(templates));
    return updated;
  },

  deleteTemplate(id: string): void {
    const templates = this.getTemplates().filter((t) => t.id !== id);
    setStorageItem(TEMPLATES_KEY, JSON.stringify(templates));
  },

  resetDefaults(): void {
    setStorageItem(LEADS_KEY, JSON.stringify(DEFAULT_LEADS));
    setStorageItem(TEMPLATES_KEY, JSON.stringify(DEFAULT_TEMPLATES));
  }
};
