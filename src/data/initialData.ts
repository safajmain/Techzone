import { Category, Product, ProductVariant, ProductImage, User, Order, OrderItem } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    category_id: 'cat_headphones',
    category_name: 'سماعات الرأس',
    category_name_en: 'Headphones',
    icon: 'Headphones',
    description: 'سماعات رأس سلكية ولاسلكية احترافية مع عزل صوت فائق الجودة.'
  },
  {
    category_id: 'cat_keyboards',
    category_name: 'لوحات المفاتيح',
    category_name_en: 'Keyboards',
    icon: 'Keyboard',
    description: 'لوحات مفاتيح ميكانيكية ومكتبية بأداء استثنائي وتصميم مريح.'
  },
  {
    category_id: 'cat_mice',
    category_name: 'فأرات التحكم',
    category_name_en: 'Mice',
    icon: 'Mouse',
    description: 'فأرات ألعاب ومكتبية بمستشعرات ضوئية دقيقة وسرعة استجابة فائقة.'
  },
  {
    category_id: 'cat_chargers',
    category_name: 'الشواحن والبطاريات',
    category_name_en: 'Chargers & Power',
    icon: 'Zap',
    description: 'شواحن GaN فائقة السرعة، وبطاريات متنقلة وكوابل متينة معتمدة.'
  },
  {
    category_id: 'cat_smartwatches',
    category_name: 'الساعات الذكية',
    category_name_en: 'Smartwatches',
    icon: 'Watch',
    description: 'ساعات وأساور ذكية لتتبع الصحة واللياقة البدنية والإشعارات الفورية.'
  }
];

export const INITIAL_USERS: User[] = [
  {
    user_id: 'usr_admin_01',
    role: 'admin',
    full_name: 'مدير النظام (Admin)',
    email: 'admin@techzone.demo',
    password: 'Admin123!',
    created_at: '2026-01-01T08:00:00Z'
  },
  {
    user_id: 'usr_cust_01',
    role: 'customer',
    full_name: 'أحمد المجالي',
    email: 'ahmad@techzone.demo',
    password: 'Customer123!',
    created_at: '2026-02-10T11:30:00Z'
  },
  {
    user_id: 'usr_cust_02',
    role: 'customer',
    full_name: 'ليلى خريس',
    email: 'layla@techzone.demo',
    password: 'Customer123!',
    created_at: '2026-02-15T14:20:00Z'
  },
  {
    user_id: 'usr_cust_03',
    role: 'customer',
    full_name: 'عمر المصري',
    email: 'omar@techzone.demo',
    password: 'Customer123!',
    created_at: '2026-03-01T09:45:00Z'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    product_id: 'prod_sony_wh1000xm5',
    category_id: 'cat_headphones',
    product_name: 'سماعة سوني اللاسلكية Sony WH-1000XM5',
    brand: 'Sony',
    description: 'سماعات الرأس الرائدة عالمياً في إلغاء الضوضاء الفعال مع معالج V1 المتكامل وصوت عالي الدقة بدون أسلاك، بطارية تدوم حتى 30 ساعة مع شحن فائق السرعة، وميكروفونات متعددة لمكالمات فائقة النقاء.',
    specifications: {
      'نوع الاتصال': 'Bluetooth 5.2 / 3.5mm سلكي',
      'عمر البطارية': 'حتى 30 ساعة مع تشغيل عزل الضوضاء',
      'تقنية العزل': 'معالجين مع 8 ميكروفونات متطورة',
      'الوزن': '250 غرام',
      'المقاومة': '48 أوم'
    },
    price: 245,
    is_active: true,
    created_at: '2026-01-10T10:00:00Z',
    updated_at: '2026-01-10T10:00:00Z'
  },
  {
    product_id: 'prod_bose_qc45',
    category_id: 'cat_headphones',
    product_name: 'سماعة بوز Bose QuietComfort 45',
    brand: 'Bose',
    description: 'الراحة الأسطورية مع عزل الصوت الهادئ والوضع الشفاف. صوت متوازن ودقيق في جميع مستويات الصوت، وسائد أذن ناعمة للغاية مناسبة للاستخدام لساعات طويلة.',
    specifications: {
      'عمر البطارية': 'حتى 24 ساعة',
      'منفذ الشحن': 'USB-C فائق السرعة',
      'الوزن': '240 غرام'
    },
    price: 195,
    is_active: true,
    created_at: '2026-01-12T12:00:00Z',
    updated_at: '2026-01-12T12:00:00Z'
  },
  {
    product_id: 'prod_airpods_max',
    category_id: 'cat_headphones',
    product_name: 'سماعة أبل Apple AirPods Max',
    brand: 'Apple',
    description: 'تصميم صوتي هندسي متطور مع مشغل ديناميكي مصمم من Apple يوفر صوتاً عالي الدقة، ميزة الصوت المكاني المخصص مع ميزة التتبع الديناميكي للرأس، وهيكل من الفولاذ المقاوم للصدأ.',
    specifications: {
      'الشريحة': 'شريحة H1 في كل غطاء أذن',
      'البطارية': 'حتى 20 ساعة مع ميزة إلغاء الضوضاء',
      'الصوت المكاني': 'مدعوم مع تتبع ديناميكي'
    },
    price: 360,
    is_active: true,
    created_at: '2026-01-15T15:00:00Z',
    updated_at: '2026-01-15T15:00:00Z'
  },
  {
    product_id: 'prod_logitech_g733',
    category_id: 'cat_headphones',
    product_name: 'سماعة ألعاب لوجيتك Logitech G733 LIGHTSPEED',
    brand: 'Logitech',
    description: 'سماعة ألعاب لاسلكية خفيفة الوزن للغاية مع إضاءة RGB قابلة للتخصيص، مشغلات PRO-G مقاس 40 مم، وصوت محيطي من الجيل التالي DTS Headphone:X 2.0.',
    specifications: {
      'الاتصال': 'لاسلكي LIGHTSPEED حتى 20 متر',
      'الوزن': '278 غرام فقط',
      'البطارية': 'حتى 29 ساعة بدون إضاءة'
    },
    price: 95,
    is_active: true,
    created_at: '2026-01-18T09:00:00Z',
    updated_at: '2026-01-18T09:00:00Z'
  },
  {
    product_id: 'prod_keychron_k2',
    category_id: 'cat_keyboards',
    product_name: 'لوحة مفاتيح ميكانيكية Keychron K2 Pro Wireless',
    brand: 'Keychron',
    description: 'لوحة مفاتيح ميكانيكية لاسلكية بحجم 75% مدمجة وقابلة للتبديل السريع للسويتشات (Hot-swappable)، تدعم برمجة المفاتيح عبر QMK/VIA وتعمل مع أنظمة Mac و Windows بسلاسة.',
    specifications: {
      'التصميم': '75% (84 مفتاح)',
      'نوع الاتصال': 'Bluetooth 5.1 أو سلكي USB-C',
      'البطارية': '4000mAh تدوم حتى 300 ساعة',
      'نوع المفاتيح': 'Gateron G Pro Brown / Red'
    },
    price: 78,
    is_active: true,
    created_at: '2026-01-20T11:00:00Z',
    updated_at: '2026-01-20T11:00:00Z'
  },
  {
    product_id: 'prod_logitech_mx_mechanical',
    category_id: 'cat_keyboards',
    product_name: 'لوحة مفاتيح لوجيتك Logitech MX Mechanical',
    brand: 'Logitech',
    description: 'لوحة مفاتيح ميكانيكية ذات مظهر جانبي منخفض تقدم إحساساً مذهلاً بالطباعة، ومفاتيح هادئة ملموسة، وإضاءة خلفية ذكية تستشعر اقتراب يديك وتتكيف تلقائياً مع الإضاءة المحيطة.',
    specifications: {
      'التخطيط': 'كامل مع لوحة أرقام Numpad',
      'الاتصال': 'Bluetooth Low Energy و Logi Bolt',
      'الشحن': 'USB-C يدوم حتى 15 يوماً'
    },
    price: 135,
    is_active: true,
    created_at: '2026-01-22T14:00:00Z',
    updated_at: '2026-01-22T14:00:00Z'
  },
  {
    product_id: 'prod_razer_huntsman_mini',
    category_id: 'cat_keyboards',
    product_name: 'كيبورد قيمنق رايزر Razer Huntsman Mini 60%',
    brand: 'Razer',
    description: 'لوحة مفاتيح ألعاب مدمجة بنسبة 60% مزودة بمفاتيح بصرية متطورة من Razer لتفعيل فوري بسرعة الضوء، مع أغطية مفاتيح PBT متينة ومقاومة للتآكل.',
    specifications: {
      'المفاتيح': 'Razer Linear Optical Switches',
      'الحجم': '60% مدمج وسهل النقل',
      'الكابل': 'منفصل ومضفر USB-C'
    },
    price: 85,
    is_active: true,
    created_at: '2026-01-25T16:00:00Z',
    updated_at: '2026-01-25T16:00:00Z'
  },
  {
    product_id: 'prod_steelseries_apex_pro',
    category_id: 'cat_keyboards',
    product_name: 'كيبورد ستيل سيريز SteelSeries Apex Pro TKL',
    brand: 'SteelSeries',
    description: 'أسرع لوحة مفاتيح في العالم مع مفاتيح OmniPoint 2.0 القابلة لتعديل نقطة التشغيل من 0.2 مم إلى 3.8 مم، وشاشة OLED ذكية لعرض معلومات الألعاب والتطبيقات.',
    specifications: {
      'المفاتيح': 'OmniPoint 2.0 Adjustable Switches',
      'الشاشة': 'OLED Smart Display',
      'الهيكل': 'ألمنيوم من فئة الطائرات 5000'
    },
    price: 185,
    is_active: true,
    created_at: '2026-01-28T10:00:00Z',
    updated_at: '2026-01-28T10:00:00Z'
  },
  {
    product_id: 'prod_logitech_mx_master_3s',
    category_id: 'cat_mice',
    product_name: 'فأرة لوجيتك الاحترافية Logitech MX Master 3S',
    brand: 'Logitech',
    description: 'الفأرة الرائدة للمحترفين والمصممين مع نقرات صامتة تماماً، ومستشعر ضوئي بدقة 8000 نقطة لكل بوصة يعمل حتى على الزجاج، وعجلة التمرير الكهرومغناطيسية MagSpeed.',
    specifications: {
      'الدقة': 'من 200 إلى 8000 DPI',
      'البطارية': 'تدوم حتى 70 يوماً بشحنة واحدة',
      'الاتصال': 'يدعم التبديل بين 3 أجهزة'
    },
    price: 82,
    is_active: true,
    created_at: '2026-02-01T12:00:00Z',
    updated_at: '2026-02-01T12:00:00Z'
  },
  {
    product_id: 'prod_razer_deathadder_v3_pro',
    category_id: 'cat_mice',
    product_name: 'ماوس ألعاب رايزر Razer DeathAdder V3 Pro',
    brand: 'Razer',
    description: 'ماوس ألعاب احترافي للرياضات الإلكترونية بوزن فائق الخفة 63 غرام، مستشعر بصري Focus Pro 30K ومفاتيح بصرية من الجيل الثالث بدون مشاكل النقر المزدوج.',
    specifications: {
      'الوزن': '63 غرام فائق الخفة',
      'المستشعر': 'Focus Pro 30K Optical Sensor',
      'عمر البطارية': 'حتى 90 ساعة'
    },
    price: 110,
    is_active: true,
    created_at: '2026-02-03T15:00:00Z',
    updated_at: '2026-02-03T15:00:00Z'
  },
  {
    product_id: 'prod_logitech_g502_hero',
    category_id: 'cat_mice',
    product_name: 'ماوس لوجيتك Logitech G502 HERO Gaming Mouse',
    brand: 'Logitech',
    description: 'الفأرة الأسطورية الأكثر شعبية بين اللاعبين مع 11 زراً قابلاً للبرمجة، ومستشعر HERO 25K فائق الدقة، وأوزان قابلة للتعديل للحصول على التوازن المثالي.',
    specifications: {
      'المستشعر': 'HERO 25,600 DPI',
      'الأزرار': '11 زر قابل للبرمجة',
      'الأوزان': '5 قطع وزن 3.6 غرام مرفقة'
    },
    price: 45,
    is_active: true,
    created_at: '2026-02-05T08:30:00Z',
    updated_at: '2026-02-05T08:30:00Z'
  },
  {
    product_id: 'prod_apple_magic_mouse',
    category_id: 'cat_mice',
    product_name: 'فأرة أبل السحرية Apple Magic Mouse',
    brand: 'Apple',
    description: 'ماوس لاسلكي قابل للشحن مع تصميم سفلي انسيابي وسطح Multi-Touch يتيح لك تنفيذ الإيماءات البسيطة مثل التمرير بين صفحات الويب والتمرير السلس للمستندات.',
    specifications: {
      'السطح': 'Multi-Touch زجاجي تفاعلي',
      'التوصيل': 'Bluetooth ومنفذ شحن USB-C',
      'التوافق': 'أجهزة Mac و iPad'
    },
    price: 68,
    is_active: true,
    created_at: '2026-02-07T13:00:00Z',
    updated_at: '2026-02-07T13:00:00Z'
  },
  {
    product_id: 'prod_anker_737_powerbank',
    category_id: 'cat_chargers',
    product_name: 'بطارية متنقلة أنكر Anker 737 Power Bank (PowerCore 24K)',
    brand: 'Anker',
    description: 'باور بانك عملاق بسعة 24,000 مللي أمبير بقوة إجمالية 140 واط، مزود بشاشة رقمية ذكية لعرض طاقة الإدخال والإخراج والوقت المتبقي للشحن بدقة متناهية.',
    specifications: {
      'السعة': '24,000mAh',
      'أقصى قدرة إخراج': '140W عبر منفذ USB-C PD 3.1',
      'المنافذ': '2x USB-C + 1x USB-A',
      'الشاشة': 'شاشة ملونة ذكية'
    },
    price: 115,
    is_active: true,
    created_at: '2026-02-10T10:00:00Z',
    updated_at: '2026-02-10T10:00:00Z'
  },
  {
    product_id: 'prod_anker_prime_67w_charger',
    category_id: 'cat_chargers',
    product_name: 'شاحن جداري أنكر Anker Prime 67W GaN Wall Charger',
    brand: 'Anker',
    description: 'شاحن GaN مدمج للغاية بقوة 67 واط مع 3 منافذ لشحن أجهزة الكمبيوتر المحمولة والهواتف والأجهزة اللوحية في وقت واحد، وتوزيع ذكي للتيار.',
    specifications: {
      'القوة': '67 واط كحد أقصى',
      'المنافذ': '2x USB-C و 1x USB-A',
      'تقنية الشحن': 'GaNPrime مع نظام أمان ActiveShield 2.0'
    },
    price: 38,
    is_active: true,
    created_at: '2026-02-12T11:00:00Z',
    updated_at: '2026-02-12T11:00:00Z'
  },
  {
    product_id: 'prod_magsafe_duo_charger',
    category_id: 'cat_chargers',
    product_name: 'شاحن أبل المزدوج Apple MagSafe Duo Charger',
    brand: 'Apple',
    description: 'شاحن قابل للطي يتيح لك شحن هاتف iPhone وساعة Apple Watch في نفس الوقت، بتصميم محمول ومثالي للسفر والاستخدام اليومي.',
    specifications: {
      'التوافق': 'iPhone 12 فما أحدث، Apple Watch',
      'التصميم': 'قابل للطي وقماش ناعم الملمس',
      'المدخل': 'Lightning إلى USB-C'
    },
    price: 92,
    is_active: true,
    created_at: '2026-02-14T14:30:00Z',
    updated_at: '2026-02-14T14:30:00Z'
  },
  {
    product_id: 'prod_apple_watch_ultra_2',
    category_id: 'cat_smartwatches',
    product_name: 'ساعة أبل Apple Watch Ultra 2 GPS + Cellular',
    brand: 'Apple',
    description: 'الساعة الرياضية الأكثر صلابة وقوة من Apple بهيكل متين من التيتانيوم مقاس 49 مم، شاشة فائقة السطوع 3000 شمعة، نظام GPS مزدوج التردد عالي الدقة، وبطارية تدوم حتى 72 ساعة في نمط توفير الطاقة.',
    specifications: {
      'حجم الهيكل': '49 مم تيتانيوم مقاوم للتآكل',
      'مقاومة الماء': 'حتى 100 متر (معيار EN13319 للغوص)',
      'عمر البطارية': '36 ساعة استخدام عادي / 72 ساعة توفير'
    },
    price: 580,
    is_active: true,
    created_at: '2026-02-18T16:00:00Z',
    updated_at: '2026-02-18T16:00:00Z'
  },
  {
    product_id: 'prod_samsung_galaxy_watch_6',
    category_id: 'cat_smartwatches',
    product_name: 'ساعة سامسونج Samsung Galaxy Watch 6 Classic',
    brand: 'Samsung',
    description: 'ساعة ذكية متميزة بإطار دوار فيزيائي كلاسيكي وشاشة أكبر بنسبة 20%، تحليل متقدم للنوم وتكوين الجسم BIA، ومراقبة دقيقة لنبضات القلب وتخطيط القلب ECG.',
    specifications: {
      'الهيكل': 'ستانلس ستيل مع زجاج كريستال ياقوتي',
      'الشاشة': 'Super AMOLED ملونة بتقنية Always On',
      'المقاومة': 'معيار IP68 ومقاومة ماء 5ATM'
    },
    price: 215,
    is_active: true,
    created_at: '2026-02-20T10:15:00Z',
    updated_at: '2026-02-20T10:15:00Z'
  },
  {
    product_id: 'prod_garmin_forerunner_265',
    category_id: 'cat_smartwatches',
    product_name: 'ساعة جارمن الرياضية Garmin Forerunner 265',
    brand: 'Garmin',
    description: 'ساعة ذكية مخصصة للرياضيين مع شاشة AMOLED لمسية ملونة ومشرقة، إحصاءات تدريب متقدمة واستعداد للتمارين وتتبع HRV، وعمر بطارية مذهل يصل إلى 13 يوماً.',
    specifications: {
      'الشاشة': 'AMOLED مقاس 1.3 بوصة فائقة الوضوح',
      'عمر البطارية': 'حتى 13 يوماً في وضع الساعة الذكية',
      'نظام التموضع': 'نظام GPS متعدد النطاقات'
    },
    price: 310,
    is_active: true,
    created_at: '2026-02-22T13:40:00Z',
    updated_at: '2026-02-22T13:40:00Z'
  },
  {
    product_id: 'prod_belkin_boostcharge_pro',
    category_id: 'cat_chargers',
    product_name: 'منصة شحن بيلكن اللاسلكية Belkin 3-in-1 MagSafe Charger',
    brand: 'Belkin',
    description: 'محطة شحن لاسلكية 3 في 1 معتمدة رسمياً من Apple توفر شحناً سريعاً بقدرة 15 واط لهاتف iPhone وساعة Apple Watch وسماعات AirPods في مكان واحد أنيق.',
    specifications: {
      'القدرة': 'شحن MagSafe سريع بقوة 15 واط',
      'الأجهزة': 'شحن متزامن لـ 3 أجهزة',
      'المواد': 'تشطيب من الفولاذ والسيليكون الفاخر'
    },
    price: 110,
    is_active: false, // Testing inactive product rule!
    created_at: '2026-02-24T09:00:00Z',
    updated_at: '2026-02-24T09:00:00Z'
  }
];

export const INITIAL_VARIANTS: ProductVariant[] = [
  // Sony WH-1000XM5 (Black: 1 [low stock!], Silver: 6, Midnight Blue: 0 [out of stock!])
  { variant_id: 'var_sony_black', product_id: 'prod_sony_wh1000xm5', color_name: 'أسود فاحم (Black)', color_hex: '#111827', stock_quantity: 1 },
  { variant_id: 'var_sony_silver', product_id: 'prod_sony_wh1000xm5', color_name: 'فضي بلاتيني (Silver)', color_hex: '#CBD5E1', stock_quantity: 6 },
  { variant_id: 'var_sony_blue', product_id: 'prod_sony_wh1000xm5', color_name: 'أزرق ليلي (Midnight Blue)', color_hex: '#1E3A8A', stock_quantity: 0 },

  // Bose QuietComfort 45 (Black: 4 [low stock!], White Smoke: 8)
  { variant_id: 'var_bose_black', product_id: 'prod_bose_qc45', color_name: 'أسود مطفي (Triple Black)', color_hex: '#18181B', stock_quantity: 4 },
  { variant_id: 'var_bose_white', product_id: 'prod_bose_qc45', color_name: 'أبيض دخاني (White Smoke)', color_hex: '#F1F5F9', stock_quantity: 8 },

  // Apple AirPods Max (Space Gray: 3, Silver: 5, Sky Blue: 2 [low stock!], Pink: 0 [out of stock!])
  { variant_id: 'var_airpods_gray', product_id: 'prod_airpods_max', color_name: 'رمادي فلكي (Space Gray)', color_hex: '#374151', stock_quantity: 3 },
  { variant_id: 'var_airpods_silver', product_id: 'prod_airpods_max', color_name: 'فضي ناصع (Silver)', color_hex: '#E2E8F0', stock_quantity: 5 },
  { variant_id: 'var_airpods_blue', product_id: 'prod_airpods_max', color_name: 'أزرق سماوي (Sky Blue)', color_hex: '#60A5FA', stock_quantity: 2 },
  { variant_id: 'var_airpods_pink', product_id: 'prod_airpods_max', color_name: 'وردي ناعم (Pink)', color_hex: '#F472B6', stock_quantity: 0 },

  // Logitech G733 (Black: 5, White: 4, Lilac Purple: 1 [low stock!])
  { variant_id: 'var_g733_black', product_id: 'prod_logitech_g733', color_name: 'أسود (Black)', color_hex: '#1E293B', stock_quantity: 5 },
  { variant_id: 'var_g733_white', product_id: 'prod_logitech_g733', color_name: 'أبيض ثلجي (White)', color_hex: '#F8FAFC', stock_quantity: 4 },
  { variant_id: 'var_g733_purple', product_id: 'prod_logitech_g733', color_name: 'بنفسجي ليلكي (Lilac)', color_hex: '#A855F7', stock_quantity: 1 },

  // Keychron K2 Pro (Carbon Black: 12, Retro Gray: 5)
  { variant_id: 'var_k2_black', product_id: 'prod_keychron_k2', color_name: 'أسود كاربون (Carbon)', color_hex: '#1F2937', stock_quantity: 12 },
  { variant_id: 'var_k2_gray', product_id: 'prod_keychron_k2', color_name: 'رمادي كلاسيكي (Retro Gray)', color_hex: '#9CA3AF', stock_quantity: 5 },

  // Logitech MX Mechanical (Graphite: 9, Pale Gray: 2 [low stock!])
  { variant_id: 'var_mxmech_graphite', product_id: 'prod_logitech_mx_mechanical', color_name: 'جرافيت داكن (Graphite)', color_hex: '#334155', stock_quantity: 9 },
  { variant_id: 'var_mxmech_palegray', product_id: 'prod_logitech_mx_mechanical', color_name: 'رمادي فاتح (Pale Gray)', color_hex: '#E2E8F0', stock_quantity: 2 },

  // Razer Huntsman Mini (Classic Black: 7, Mercury White: 0 [out of stock!])
  { variant_id: 'var_huntsman_black', product_id: 'prod_razer_huntsman_mini', color_name: 'أسود كلاسيكي (Classic Black)', color_hex: '#111827', stock_quantity: 7 },
  { variant_id: 'var_huntsman_white', product_id: 'prod_razer_huntsman_mini', color_name: 'أبيض ميركوري (Mercury White)', color_hex: '#FFFFFF', stock_quantity: 0 },

  // SteelSeries Apex Pro TKL (Deep Black: 4 [low stock!])
  { variant_id: 'var_apex_black', product_id: 'prod_steelseries_apex_pro', color_name: 'أسود أنودايز (Matte Black)', color_hex: '#18181B', stock_quantity: 4 },

  // Logitech MX Master 3S (Graphite: 8, Pale Gray: 3 [low stock!], Space Black: 0 [out of stock!])
  { variant_id: 'var_mx3s_graphite', product_id: 'prod_logitech_mx_master_3s', color_name: 'جرافيت (Graphite)', color_hex: '#374151', stock_quantity: 8 },
  { variant_id: 'var_mx3s_gray', product_id: 'prod_logitech_mx_master_3s', color_name: 'رمادي فاتح (Pale Gray)', color_hex: '#E5E7EB', stock_quantity: 3 },
  { variant_id: 'var_mx3s_black', product_id: 'prod_logitech_mx_master_3s', color_name: 'أسود فضائي (Space Black)', color_hex: '#0F172A', stock_quantity: 0 },

  // Razer DeathAdder V3 Pro (Black: 6, White: 2 [low stock!], Faker Red: 1 [low stock!])
  { variant_id: 'var_da3_black', product_id: 'prod_razer_deathadder_v3_pro', color_name: 'أسود (Black)', color_hex: '#18181B', stock_quantity: 6 },
  { variant_id: 'var_da3_white', product_id: 'prod_razer_deathadder_v3_pro', color_name: 'أبيض (White)', color_hex: '#F9FAFB', stock_quantity: 2 },
  { variant_id: 'var_da3_red', product_id: 'prod_razer_deathadder_v3_pro', color_name: 'أحمر مخصص (Edition Red)', color_hex: '#EF4444', stock_quantity: 1 },

  // Logitech G502 HERO (Black: 15)
  { variant_id: 'var_g502_black', product_id: 'prod_logitech_g502_hero', color_name: 'أسود مطفي (Matte Black)', color_hex: '#111827', stock_quantity: 15 },

  // Apple Magic Mouse (Silver: 7, Space Black: 3 [low stock!])
  { variant_id: 'var_magic_silver', product_id: 'prod_apple_magic_mouse', color_name: 'فضي أبيض (White/Silver)', color_hex: '#F3F4F6', stock_quantity: 7 },
  { variant_id: 'var_magic_black', product_id: 'prod_apple_magic_mouse', color_name: 'أسود فلكي (Black)', color_hex: '#1F2937', stock_quantity: 3 },

  // Anker 737 Power Bank (Black Charcoal: 8)
  { variant_id: 'var_anker737_black', product_id: 'prod_anker_737_powerbank', color_name: 'فحم حجري (Dark Charcoal)', color_hex: '#1F2937', stock_quantity: 8 },

  // Anker Prime 67W Charger (Black: 14, White: 5)
  { variant_id: 'var_anker67_black', product_id: 'prod_anker_prime_67w_charger', color_name: 'أسود (Black)', color_hex: '#111827', stock_quantity: 14 },
  { variant_id: 'var_anker67_white', product_id: 'prod_anker_prime_67w_charger', color_name: 'أبيض ناصع (White)', color_hex: '#FFFFFF', stock_quantity: 5 },

  // Apple MagSafe Duo (White: 4 [low stock!])
  { variant_id: 'var_magsafe_white', product_id: 'prod_magsafe_duo_charger', color_name: 'أبيض ناصع (Pure White)', color_hex: '#FFFFFF', stock_quantity: 4 },

  // Apple Watch Ultra 2 (Titanium Orange: 4 [low stock!], Titanium White: 3, Titanium Blue: 1 [low stock!])
  { variant_id: 'var_ultra2_orange', product_id: 'prod_apple_watch_ultra_2', color_name: 'تيتانيوم مع سوار برتقالي (Orange Ocean)', color_hex: '#F97316', stock_quantity: 4 },
  { variant_id: 'var_ultra2_white', product_id: 'prod_apple_watch_ultra_2', color_name: 'تيتانيوم مع سوار أبيض (White Ocean)', color_hex: '#E2E8F0', stock_quantity: 3 },
  { variant_id: 'var_ultra2_blue', product_id: 'prod_apple_watch_ultra_2', color_name: 'تيتانيوم مع سوار أزرق (Blue Trail)', color_hex: '#2563EB', stock_quantity: 1 },

  // Samsung Galaxy Watch 6 Classic (Black: 6, Silver: 2 [low stock!])
  { variant_id: 'var_gw6_black', product_id: 'prod_samsung_galaxy_watch_6', color_name: 'أسود كلاسيكي (Black)', color_hex: '#18181B', stock_quantity: 6 },
  { variant_id: 'var_gw6_silver', product_id: 'prod_samsung_galaxy_watch_6', color_name: 'فضي برّاق (Silver)', color_hex: '#CBD5E1', stock_quantity: 2 },

  // Garmin Forerunner 265 (Black/Gray: 5, Aqua Teal: 2 [low stock!], Whitestone: 0 [out of stock!])
  { variant_id: 'var_fr265_black', product_id: 'prod_garmin_forerunner_265', color_name: 'أسود ورمادي (Black/Gray)', color_hex: '#1E293B', stock_quantity: 5 },
  { variant_id: 'var_fr265_aqua', product_id: 'prod_garmin_forerunner_265', color_name: 'أكوا تركواز (Aqua)', color_hex: '#06B6D4', stock_quantity: 2 },
  { variant_id: 'var_fr265_white', product_id: 'prod_garmin_forerunner_265', color_name: 'أبيض حجري (Whitestone)', color_hex: '#F1F5F9', stock_quantity: 0 },

  // Belkin BoostCharge Pro (White: 5) [Inactive product]
  { variant_id: 'var_belkin_white', product_id: 'prod_belkin_boostcharge_pro', color_name: 'أبيض ناصع (White)', color_hex: '#FFFFFF', stock_quantity: 5 }
];

export const INITIAL_IMAGES: ProductImage[] = [
  // Sony WH-1000XM5
  { image_id: 'img_sony_1', product_id: 'prod_sony_wh1000xm5', image_path: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80', is_primary: true },
  { image_id: 'img_sony_2', product_id: 'prod_sony_wh1000xm5', image_path: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80', is_primary: false },
  { image_id: 'img_sony_3', product_id: 'prod_sony_wh1000xm5', image_path: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80', is_primary: false },

  // Bose QC45
  { image_id: 'img_bose_1', product_id: 'prod_bose_qc45', image_path: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80', is_primary: true },
  { image_id: 'img_bose_2', product_id: 'prod_bose_qc45', image_path: 'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?auto=format&fit=crop&w=800&q=80', is_primary: false },

  // AirPods Max
  { image_id: 'img_airpods_1', product_id: 'prod_airpods_max', image_path: 'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?auto=format&fit=crop&w=800&q=80', is_primary: true },
  { image_id: 'img_airpods_2', product_id: 'prod_airpods_max', image_path: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80', is_primary: false },

  // Logitech G733
  { image_id: 'img_g733_1', product_id: 'prod_logitech_g733', image_path: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80', is_primary: true },
  { image_id: 'img_g733_2', product_id: 'prod_logitech_g733', image_path: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80', is_primary: false },

  // Keychron K2 Pro
  { image_id: 'img_k2_1', product_id: 'prod_keychron_k2', image_path: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80', is_primary: true },
  { image_id: 'img_k2_2', product_id: 'prod_keychron_k2', image_path: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80', is_primary: false },

  // Logitech MX Mechanical
  { image_id: 'img_mxmech_1', product_id: 'prod_logitech_mx_mechanical', image_path: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80', is_primary: true },
  { image_id: 'img_mxmech_2', product_id: 'prod_logitech_mx_mechanical', image_path: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80', is_primary: false },

  // Razer Huntsman Mini
  { image_id: 'img_huntsman_1', product_id: 'prod_razer_huntsman_mini', image_path: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80', is_primary: true },
  { image_id: 'img_huntsman_2', product_id: 'prod_razer_huntsman_mini', image_path: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80', is_primary: false },

  // SteelSeries Apex Pro
  { image_id: 'img_apex_1', product_id: 'prod_steelseries_apex_pro', image_path: 'https://images.unsplash.com/photo-1625948515291-696130d11798?auto=format&fit=crop&w=800&q=80', is_primary: true },

  // Logitech MX Master 3S
  { image_id: 'img_mx3s_1', product_id: 'prod_logitech_mx_master_3s', image_path: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80', is_primary: true },
  { image_id: 'img_mx3s_2', product_id: 'prod_logitech_mx_master_3s', image_path: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80', is_primary: false },

  // Razer DeathAdder V3 Pro
  { image_id: 'img_da3_1', product_id: 'prod_razer_deathadder_v3_pro', image_path: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80', is_primary: true },

  // Logitech G502 HERO
  { image_id: 'img_g502_1', product_id: 'prod_logitech_g502_hero', image_path: 'https://images.unsplash.com/photo-1626218174358-7769486c4b79?auto=format&fit=crop&w=800&q=80', is_primary: true },

  // Apple Magic Mouse
  { image_id: 'img_magic_1', product_id: 'prod_apple_magic_mouse', image_path: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80', is_primary: true },

  // Anker 737 Power Bank
  { image_id: 'img_anker737_1', product_id: 'prod_anker_737_powerbank', image_path: 'https://images.unsplash.com/photo-1609592424368-24d17336696b?auto=format&fit=crop&w=800&q=80', is_primary: true },
  { image_id: 'img_anker737_2', product_id: 'prod_anker_737_powerbank', image_path: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80', is_primary: false },

  // Anker Prime 67W Charger
  { image_id: 'img_anker67_1', product_id: 'prod_anker_prime_67w_charger', image_path: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80', is_primary: true },

  // Apple MagSafe Duo
  { image_id: 'img_magsafe_1', product_id: 'prod_magsafe_duo_charger', image_path: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=800&q=80', is_primary: true },

  // Apple Watch Ultra 2
  { image_id: 'img_ultra2_1', product_id: 'prod_apple_watch_ultra_2', image_path: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80', is_primary: true },
  { image_id: 'img_ultra2_2', product_id: 'prod_apple_watch_ultra_2', image_path: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80', is_primary: false },

  // Samsung Galaxy Watch 6 Classic
  { image_id: 'img_gw6_1', product_id: 'prod_samsung_galaxy_watch_6', image_path: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80', is_primary: true },

  // Garmin Forerunner 265
  { image_id: 'img_fr265_1', product_id: 'prod_garmin_forerunner_265', image_path: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80', is_primary: true },

  // Belkin BoostCharge Pro
  { image_id: 'img_belkin_1', product_id: 'prod_belkin_boostcharge_pro', image_path: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=800&q=80', is_primary: true }
];

export const INITIAL_ORDERS: Order[] = [
  // 1. Delivered order: for Omar (contributes to Total Sales on Admin Dashboard: 245 JOD)
  {
    order_id: 'ord_1001',
    user_id: 'usr_cust_03',
    recipient_name: 'عمر المصري',
    phone: '0791234567',
    city: 'الزرقاء',
    full_address: 'الزرقاء الجديدة - شارع 36 - عمارة 14',
    order_notes: 'يرجى الاتصال قبل الوصول بنصف ساعة',
    total_amount: 245,
    payment_method: 'الدفع عند الاستلام',
    order_status: 'Delivered',
    created_at: '2026-03-05T14:30:00Z'
  },
  // 2. Shipped order: for Layla (Active for Layla: visible in My Orders)
  {
    order_id: 'ord_1002',
    user_id: 'usr_cust_02',
    recipient_name: 'ليلى خريس',
    phone: '0787654321',
    city: 'إربد',
    full_address: 'شارع الجامعة - قرب دوار القبة',
    order_notes: '',
    total_amount: 120,
    payment_method: 'الدفع عند الاستلام',
    order_status: 'Shipped',
    created_at: '2026-03-06T10:15:00Z'
  },
  // 3. Processing order: for Ahmad (Active for Ahmad, cancellation NOT allowed because it is Processing)
  {
    order_id: 'ord_1003',
    user_id: 'usr_cust_01',
    recipient_name: 'أحمد المجالي',
    phone: '0779876543',
    city: 'عمّان',
    full_address: 'خلدا - دوار الواحة - مجمع النخبة',
    order_notes: 'التسليم في أوقات العمل الرسمية',
    total_amount: 195,
    payment_method: 'الدفع عند الاستلام',
    order_status: 'Processing',
    created_at: '2026-03-07T08:00:00Z'
  },
  // 4. Pending order: for Ahmad, created 25 minutes ago! (Active for Ahmad, cancellation IS allowed!)
  {
    order_id: 'ord_1004',
    user_id: 'usr_cust_01',
    recipient_name: 'أحمد المجالي',
    phone: '0779876543',
    city: 'عمّان',
    full_address: 'أم أذينة - شارع المدينة المنورة - بناية 22',
    order_notes: 'طلب تجريبي حديث للتأكد من إمكانية الإلغاء',
    total_amount: 82,
    payment_method: 'الدفع عند الاستلام',
    order_status: 'Pending',
    // Created 25 minutes ago relative to current demo time
    created_at: new Date(Date.now() - 25 * 60 * 1000).toISOString()
  }
];

export const INITIAL_ORDER_ITEMS: OrderItem[] = [
  // Items for ord_1001 (Sony WH-1000XM5)
  {
    order_item_id: 'item_1001_1',
    order_id: 'ord_1001',
    variant_id: 'var_sony_silver',
    product_id: 'prod_sony_wh1000xm5',
    product_name_snapshot: 'سماعة سوني اللاسلكية Sony WH-1000XM5',
    color_snapshot: 'فضي بلاتيني (Silver)',
    image_snapshot: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
    unit_price: 245,
    quantity: 1,
    subtotal: 245
  },
  // Items for ord_1002 (Logitech MX Mechanical Pale Gray)
  {
    order_item_id: 'item_1002_1',
    order_id: 'ord_1002',
    variant_id: 'var_mxmech_palegray',
    product_id: 'prod_logitech_mx_mechanical',
    product_name_snapshot: 'لوحة مفاتيح لوجيتك Logitech MX Mechanical',
    color_snapshot: 'رمادي فاتح (Pale Gray)',
    image_snapshot: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80',
    unit_price: 120,
    quantity: 1,
    subtotal: 120
  },
  // Items for ord_1003 (Bose QuietComfort 45 Triple Black)
  {
    order_item_id: 'item_1003_1',
    order_id: 'ord_1003',
    variant_id: 'var_bose_black',
    product_id: 'prod_bose_qc45',
    product_name_snapshot: 'سماعة بوز Bose QuietComfort 45',
    color_snapshot: 'أسود مطفي (Triple Black)',
    image_snapshot: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80',
    unit_price: 195,
    quantity: 1,
    subtotal: 195
  },
  // Items for ord_1004 (Logitech MX Master 3S Graphite)
  {
    order_item_id: 'item_1004_1',
    order_id: 'ord_1004',
    variant_id: 'var_mx3s_graphite',
    product_id: 'prod_logitech_mx_master_3s',
    product_name_snapshot: 'فأرة لوجيتك الاحترافية Logitech MX Master 3S',
    color_snapshot: 'جرافيت (Graphite)',
    image_snapshot: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
    unit_price: 82,
    quantity: 1,
    subtotal: 82
  }
];
