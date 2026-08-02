import { Order } from '@/src/types/crm';

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: '#DZ-8942',
    customerName: 'محمد أمين بوعزيز',
    phone: '0554123456',
    altPhone: '0771987654',
    productName: 'قفطان مخملي عصري VIP',
    productImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=300&q=80',
    color: 'أخضر ملكي',
    colorHex: '#065f46',
    size: 'XL',
    quantity: 1,
    price: 8500,
    shippingFee: 600,
    totalAmount: 9100,
    city: 'الجزائر (16)',
    wilayaCode: '16',
    address: 'حي 500 مسكن، دالي إبراهيم',
    deliveryType: 'home',
    creationDate: '2026-07-31T07:15:00Z',
    status: 'pending',
    priority: 'urgent',
    callAttempts: 0,
    landingPage: 'caftan-luxe.dz',
    notes: [
      {
        id: 'note-1',
        author: 'سارة - موظفة التأكيد',
        text: 'طلب جديد من صفحة الهبوط. العميل طلب التوصيل للمنزل في دالي إبراهيم.',
        timestamp: '2026-07-31T07:16:00Z',
        tag: 'طلب جديد'
      }
    ],
    activities: [
      {
        id: 'act-1',
        type: 'created',
        title: 'استلام الطلب',
        description: 'تم تسجيل الطلب تلقائياً من صفحة caftan-luxe.dz',
        timestamp: '2026-07-31T07:15:00Z',
        actor: 'النظام'
      }
    ]
  },
  {
    id: 'ord-102',
    orderNumber: '#DZ-8943',
    customerName: 'أحمد زروقي',
    phone: '0661882233',
    productName: 'ساعة ذكية Ultra 8 VIP',
    productImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80',
    color: 'أسود مات',
    colorHex: '#18181b',
    size: 'Standard',
    quantity: 2,
    price: 4900,
    shippingFee: 700,
    totalAmount: 10500,
    city: 'وهران (31)',
    wilayaCode: '31',
    address: 'حي العكيد لطفي، مقابل المسجد',
    deliveryType: 'desk',
    creationDate: '2026-07-31T06:40:00Z',
    status: 'calling',
    priority: 'high',
    callAttempts: 1,
    lastCallAt: '2026-07-31T07:30:00Z',
    landingPage: 'smart-watch.dz',
    notes: [
      {
        id: 'note-2',
        author: 'كريم - موظف الهاتف',
        text: 'تم الاتصال بالعميل، خط مغلق. سيتم إعادة المحاولة بعد 30 دقيقة.',
        timestamp: '2026-07-31T07:31:00Z',
        tag: 'اتصال لم يكتمل'
      }
    ],
    activities: [
      {
        id: 'act-2',
        type: 'created',
        title: 'استلام الطلب',
        description: 'تم استلام الطلب من Landing Page',
        timestamp: '2026-07-31T06:40:00Z',
        actor: 'النظام'
      },
      {
        id: 'act-3',
        type: 'called',
        title: 'محاولة اتصال أولى',
        description: 'تم الاتصال بالرقم 0661882233 (الهاتف مغلق)',
        timestamp: '2026-07-31T07:30:00Z',
        actor: 'كريم'
      }
    ]
  },
  {
    id: 'ord-103',
    orderNumber: '#DZ-8944',
    customerName: 'يوسف بن علي',
    phone: '0770994411',
    productName: 'حذاء كلاسيكي جلد طبيعي',
    productImage: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=300&q=80',
    color: 'بني داكن',
    colorHex: '#78350f',
    size: '42',
    quantity: 1,
    price: 6400,
    shippingFee: 800,
    totalAmount: 7200,
    city: 'سطيف (19)',
    wilayaCode: '19',
    address: 'وسط المدينة، بالقرب من عين الفوارة',
    deliveryType: 'home',
    creationDate: '2026-07-30T18:20:00Z',
    status: 'call_later',
    priority: 'normal',
    callAttempts: 2,
    lastCallAt: '2026-07-31T08:00:00Z',
    landingPage: 'cuir-algerie.dz',
    reminder: {
      id: 'rem-1',
      orderId: 'ord-103',
      date: '2026-07-31',
      time: '14:30',
      reason: 'الزبون في عمله، طلب الإتصال بعد 14:30',
      createdAt: '2026-07-31T08:02:00Z',
      completed: false
    },
    notes: [
      {
        id: 'note-3',
        author: 'مريم - مسؤول التأكيد',
        text: 'الزبون مشغول في اجتماع، طلب إعادة الاتصال بعد الساعة 14:30 لتأكيد المقاس.',
        timestamp: '2026-07-31T08:02:00Z',
        tag: 'طلب تأجيل'
      }
    ],
    activities: [
      {
        id: 'act-4',
        type: 'created',
        title: 'إنشاء الطلب',
        description: 'طلب من صفحة الأحذية الجلدية',
        timestamp: '2026-07-30T18:20:00Z',
        actor: 'النظام'
      },
      {
        id: 'act-5',
        type: 'no_answer',
        title: 'رد الزبون: مشغول',
        description: 'طلب إعادة الاتصال ظهراً',
        timestamp: '2026-07-31T08:00:00Z',
        actor: 'مريم'
      },
      {
        id: 'act-6',
        type: 'reminder_set',
        title: 'جدولة تذكير',
        description: 'تذكير بالاتصال اليوم الساعة 14:30',
        timestamp: '2026-07-31T08:02:00Z',
        actor: 'مريم'
      }
    ]
  },
  {
    id: 'ord-104',
    orderNumber: '#DZ-8945',
    customerName: 'إلياس سليماني',
    phone: '0550112233',
    altPhone: '0560998877',
    productName: 'مجموعة العناية بالبشرة والوجه',
    productImage: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=300&q=80',
    color: 'طبيعي',
    colorHex: '#fef3c7',
    size: 'مجموعة 3 قطع',
    quantity: 1,
    price: 3900,
    shippingFee: 600,
    totalAmount: 4500,
    city: 'قسنطينة (25)',
    wilayaCode: '25',
    address: 'حي زواغي سليمان، عمارة ب رقم 12',
    deliveryType: 'home',
    creationDate: '2026-07-31T05:10:00Z',
    status: 'confirmed',
    priority: 'high',
    callAttempts: 1,
    lastCallAt: '2026-07-31T07:10:00Z',
    landingPage: 'beauty-care.dz',
    notes: [
      {
        id: 'note-4',
        author: 'سارة - موظفة التأكيد',
        text: 'تم التأكيد بنجاح! العميل أكد العنوان ويطلب التوصيل قبل يوم الجمعة.',
        timestamp: '2026-07-31T07:12:00Z',
        tag: 'تأكيد نائي'
      }
    ],
    activities: [
      {
        id: 'act-7',
        type: 'created',
        title: 'استلام الطلب',
        description: 'تم تسجيل الطلب عبر الإنترنت',
        timestamp: '2026-07-31T05:10:00Z',
        actor: 'النظام'
      },
      {
        id: 'act-8',
        type: 'called',
        title: 'مكالمة ناجحة',
        description: 'تم التحدث مع الزبون وإجابة كل أسئلته حول المكونات',
        timestamp: '2026-07-31T07:10:00Z',
        actor: 'سارة'
      },
      {
        id: 'act-9',
        type: 'confirmed',
        title: 'تأكيد الطلبية',
        description: 'تم تحويل الطلبية لقسم التغليف والشحن (Yalidine)',
        timestamp: '2026-07-31T07:12:00Z',
        actor: 'سارة'
      }
    ]
  },
  {
    id: 'ord-105',
    orderNumber: '#DZ-8946',
    customerName: 'فاطمة الزهراء قاسمي',
    phone: '0671334455',
    productName: 'حقيبة يد نسائية فاخرة',
    productImage: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=300&q=80',
    color: 'أسود ورودي',
    colorHex: '#831843',
    size: 'M',
    quantity: 1,
    price: 5200,
    shippingFee: 700,
    totalAmount: 5900,
    city: 'عنابة (23)',
    wilayaCode: '23',
    address: 'حي السهل الجميل، عنابة',
    deliveryType: 'home',
    creationDate: '2026-07-30T14:15:00Z',
    status: 'cancelled',
    priority: 'normal',
    callAttempts: 3,
    lastCallAt: '2026-07-30T17:00:00Z',
    landingPage: 'bags-luxe.dz',
    notes: [
      {
        id: 'note-5',
        author: 'حمزة - فريق الدعم',
        text: 'الزبونة ألغت الطلب بسبب وجود منتج مشابه قامت بشرائه سابقاً.',
        timestamp: '2026-07-30T17:01:00Z',
        tag: 'إلغاء'
      }
    ],
    activities: [
      {
        id: 'act-10',
        type: 'created',
        title: 'تسجيل الطلب',
        description: 'طلب من صفحة الحقائب',
        timestamp: '2026-07-30T14:15:00Z',
        actor: 'النظام'
      },
      {
        id: 'act-11',
        type: 'cancelled',
        title: 'إلغاء الطلب',
        description: 'الزبونة رفضت التثبيت وتراجعت عن الشراء',
        timestamp: '2026-07-30T17:01:00Z',
        actor: 'حمزة'
      }
    ]
  },
  {
    id: 'ord-106',
    orderNumber: '#DZ-8947',
    customerName: 'عبد القادر رحماني',
    phone: '0555778899',
    productName: 'ماكينة حلاقة احترافية VGR',
    productImage: 'https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=300&q=80',
    color: 'ذهبي',
    colorHex: '#d97706',
    size: 'Kit Pro',
    quantity: 1,
    price: 3200,
    shippingFee: 600,
    totalAmount: 3800,
    city: 'البليدة (09)',
    wilayaCode: '09',
    address: 'اولاد يعيش، قرب الجامعة',
    deliveryType: 'desk',
    creationDate: '2026-07-29T10:00:00Z',
    status: 'delivered',
    priority: 'normal',
    callAttempts: 1,
    lastCallAt: '2026-07-29T11:30:00Z',
    landingPage: 'barber-tools.dz',
    notes: [
      {
        id: 'note-6',
        author: 'سارة - موظفة التأكيد',
        text: 'تم التسليم وقبض المبلغ كاملاً 3800 د.ج عبر شركة التوصيل.',
        timestamp: '2026-07-30T16:00:00Z',
        tag: 'تسليم ناجح'
      }
    ],
    activities: [
      {
        id: 'act-12',
        type: 'created',
        title: 'إنشاء الطلب',
        description: 'طلب جديد عبر Landing Page',
        timestamp: '2026-07-29T10:00:00Z',
        actor: 'النظام'
      },
      {
        id: 'act-13',
        type: 'confirmed',
        title: 'تأكيد الطلب',
        description: 'تأكيد الهاتف وتجهيز الشحن',
        timestamp: '2026-07-29T11:30:00Z',
        actor: 'سارة'
      },
      {
        id: 'act-14',
        type: 'delivered',
        title: 'تم الاستلام والتسليم',
        description: 'وصلت الشحنة للزبون وتم التحصيل بنجاح',
        timestamp: '2026-07-30T16:00:00Z',
        actor: 'شركة التوصيل'
      }
    ]
  },
  {
    id: 'ord-107',
    orderNumber: '#DZ-8948',
    customerName: 'مريم حداد',
    phone: '0662334411',
    productName: 'قفطان مخملي عصري VIP',
    productImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=300&q=80',
    color: 'كحلي ملكي',
    colorHex: '#1e3a8a',
    size: 'L',
    quantity: 1,
    price: 8500,
    shippingFee: 700,
    totalAmount: 9200,
    city: 'تلمسان (13)',
    wilayaCode: '13',
    address: 'حي منصورة، ولاية تلمسان',
    deliveryType: 'home',
    creationDate: '2026-07-31T08:05:00Z',
    status: 'pending',
    priority: 'urgent',
    callAttempts: 0,
    landingPage: 'caftan-luxe.dz',
    notes: [],
    activities: [
      {
        id: 'act-15',
        type: 'created',
        title: 'استلام الطلب',
        description: 'طلب قادم حديثاً من الإعلان المموت على فيسبوك',
        timestamp: '2026-07-31T08:05:00Z',
        actor: 'النظام'
      }
    ]
  },
  {
    id: 'ord-108',
    orderNumber: '#DZ-8949',
    customerName: 'طارق بوخالفة',
    phone: '0772556677',
    productName: 'ساعة ذكية Ultra 8 VIP',
    productImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80',
    color: 'فضة معدني',
    colorHex: '#94a3b8',
    size: 'Standard',
    quantity: 1,
    price: 4900,
    shippingFee: 700,
    totalAmount: 5600,
    city: 'باتنة (05)',
    wilayaCode: '05',
    address: 'حي كشيدة، باتنة',
    deliveryType: 'desk',
    creationDate: '2026-07-31T07:45:00Z',
    status: 'calling',
    priority: 'high',
    callAttempts: 1,
    lastCallAt: '2026-07-31T08:15:00Z',
    landingPage: 'smart-watch.dz',
    notes: [
      {
        id: 'note-7',
        author: 'كريم - موظف الهاتف',
        text: 'أرسلت رسالة واتساب للعميل للتذكير بعد أن تعذر الوصول بالهاتف.',
        timestamp: '2026-07-31T08:17:00Z',
        tag: 'واتساب'
      }
    ],
    activities: [
      {
        id: 'act-16',
        type: 'created',
        title: 'تسجيل الطلب',
        description: 'تسجيل الطلب عبر landing page',
        timestamp: '2026-07-31T07:45:00Z',
        actor: 'النظام'
      },
      {
        id: 'act-17',
        type: 'whatsapp',
        title: 'إرسال رسالة WhatsApp',
        description: 'تم إرسال قوالب التأكيد السريع عبر واتساب',
        timestamp: '2026-07-31T08:17:00Z',
        actor: 'كريم'
      }
    ]
  }
];

export const ALGERIAN_WILAYAS = [
  'الكل',
  'الجزائر (16)',
  'وهران (31)',
  'سطيف (19)',
  'قسنطينة (25)',
  'عنابة (23)',
  'البليدة (09)',
  'تلمسان (13)',
  'باتنة (05)',
  'الشلف (02)',
  'بومرداس (35)'
];

export const PRODUCT_LIST = [
  'الكل',
  'قفطان مخملي عصري VIP',
  'ساعة ذكية Ultra 8 VIP',
  'حذاء كلاسيكي جلد طبيعي',
  'مجموعة العناية بالبشرة والوجه',
  'حقيبة يد نسائية فاخرة',
  'ماكينة حلاقة احترافية VGR'
];
