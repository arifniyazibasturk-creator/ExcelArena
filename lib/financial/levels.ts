import { FinancialLevel } from "./types";
import { LEVEL_01_FINANCIAL } from "./content/level01";

export const FINANCIAL_LEVELS: FinancialLevel[] = [
  LEVEL_01_FINANCIAL,
  {
    id: "fin-level-02",
    number: 2,
    code: "02",
    titleEn: "Financial Ratios & Performance Analysis",
    titleTr: "Finansal Oranlar ve Performans Analizi",
    descriptionEn:
      "Calculate and interpret key profitability, liquidity, solvency, leverage, and asset efficiency ratios in Excel.",
    descriptionTr:
      "Kârlılık, likidite, borçluluk, kaldıraç ve operasyonel etkinlik oranlarını Excel formülleriyle hesaplayın ve yorumlayın.",
    topics: [
      { id: "profitability-ratios", titleEn: "Profitability Ratios", titleTr: "Kârlılık Oranları", descEn: "Gross, Operating, and Net margins, ROE and ROA.", descTr: "Brüt, Faaliyet ve Net kâr marjları, Özkaynak ve Aktif Kârlılığı." },
      { id: "liquidity-ratios", titleEn: "Liquidity Ratios", titleTr: "Likidite Oranları", descEn: "Current Ratio, Quick Ratio, and Cash Ratio.", descTr: "Cari Oran, Likidite Oranı (Asit-Test) ve Nakit Oran." },
      { id: "leverage-ratios", titleEn: "Leverage & Solvency", titleTr: "Kaldıraç ve Borçluluk", descEn: "Debt-to-Equity, Net Debt / EBITDA, Interest Coverage.", descTr: "Borç/Özkaynak, Net Borç / FAVÖK, Faiz Karşılama Oranı." },
      { id: "efficiency-ratios", titleEn: "Operational Efficiency", titleTr: "Operasyonel Etkinlik", descEn: "Asset turnover, inventory turnover, and DSO/DPO cycles.", descTr: "Varlık devir hızı, stok devir hızı ve alacak/borç günleri." },
      { id: "ratio-interpretation", titleEn: "Ratio Interpretation", titleTr: "Oran Yorumlama", descEn: "Extracting actionable insights from trends.", descTr: "Trendlerden operasyonel ve finansal çıkarımlar yapma." },
      { id: "industry-comparison", titleEn: "Industry Benchmarking", titleTr: "Sektörel Kıyaslama", descEn: "Comparing company performance against peer cohorts.", descTr: "Şirket performansını sektör medyanları ile karşılaştırma." },
    ],
    isLocked: true,
    learnLessons: [],
    practiceExercises: [],
    solveExercises: [],
    testQuestions: [],
    project: {} as any,
  },
  {
    id: "fin-level-03",
    number: 3,
    code: "03",
    titleEn: "Model Structure & Assumptions Architecture",
    titleTr: "Model Mimarisi ve Varsayımlar",
    descriptionEn:
      "Design institutional-grade financial models: clear separation of inputs, calculations, schedules, and dynamic outputs.",
    descriptionTr:
      "Kurumsal düzeyde model tasarımı: Girdi varsayımları, hesaplama tabloları, yardımcı çizelgeler ve dinamik çıktıların ayrımı.",
    topics: [
      { id: "inputs-calc-outputs", titleEn: "Inputs vs Calculations vs Outputs", titleTr: "Girdi, Hesaplama ve Çıktı Mimarisi", descEn: "Color coding standards, dynamic formula integrity.", descTr: "Renk kodlama standartları, formül tutarlılığı." },
      { id: "timeline-periods", titleEn: "Historical vs Forecast Timelines", titleTr: "Tarihsel ve Tahmin Zaman Çizelgeleri", descEn: "Setting up periodic model headers and dynamic flags.", descTr: "Dönemsel sütun başlıkları ve dinamik bayraklar." },
      { id: "assumption-cells", titleEn: "Assumption Cell Management", titleTr: "Varsayım Hücresi Yönetimi", descEn: "Centralizing model drivers in dedicated blocks.", descTr: "Model sürücülerinin tek bir varsayım bloğunda toplanması." },
      { id: "anti-hardcoding", titleEn: "Zero-Hardcode Rule", titleTr: "Sıfır Sabit Sayı Kuralı", descEn: "Eliminating static numbers from dynamic calculations.", descTr: "Hesaplama hücrelerinden sabit sayıların temizlenmesi." },
      { id: "model-integrity-checks", titleEn: "Automated Error & Model Checks", titleTr: "Otomatik Hata ve Denge Kontrolleri", descEn: "Building universal check blocks that alert on imbalances.", descTr: "Kopuk bağları ve dengesizlikleri yakalayan kontrol panelleri." },
    ],
    isLocked: true,
    learnLessons: [],
    practiceExercises: [],
    solveExercises: [],
    testQuestions: [],
    project: {} as any,
  },
  {
    id: "fin-level-04",
    number: 4,
    code: "04",
    titleEn: "Sales & Top-Line Forecasting",
    titleTr: "Satış ve Hasılat Tahminleme",
    descriptionEn:
      "Forecast company revenues using historical CAGRs, unit economics (Price × Volume), market penetration, and store rollouts.",
    descriptionTr:
      "Tarihsel BBYO (CAGR), birim ekonomi (Fiyat × Adet), pazar payı ve yeni mağaza açılışlarıyla hasılat tahminleme.",
    topics: [
      { id: "historical-growth", titleEn: "Historical CAGR & Growth Trends", titleTr: "Tarihsel BBYO ve Büyüme Trendleri", descEn: "Calculating Compound Annual Growth Rates.", descTr: "Bileşik Yıllık Büyüme Oranı (CAGR) formülü." },
      { id: "growth-rate-forecasting", titleEn: "Growth-Rate Forecasting", titleTr: "Büyüme Oranı ile Modelleme", descEn: "Base Sales × (1 + Growth Rate) modeling.", descTr: "Baz Hasılat × (1 + Büyüme Oranı) modelleri." },
      { id: "multi-period-forecast", titleEn: "Multi-Period Compound Forecasts", titleTr: "Çok Dönemli Bileşik Tahminler", descEn: "Base × (1 + g)^n compound forecasting in Excel.", descTr: "Excel'de üslü büyüme formülleri." },
      { id: "price-volume", titleEn: "Price × Volume Unit Economics", titleTr: "Fiyat × Hacim Birim Analizi", descEn: "Decomposing revenue into units sold and ASP.", descTr: "Hasılatı satılan adet ve ortalama satış fiyatına ayırma." },
      { id: "forecast-limitations", titleEn: "Forecast Sensitivity & Boundaries", titleTr: "Tahmin Sınırları ve Gerçekçilik", descEn: "Addressing market saturation and cyclical drag.", descTr: "Pazar doygunluğu ve döngüsel riskleri hesaba katma." },
    ],
    isLocked: true,
    learnLessons: [],
    practiceExercises: [],
    solveExercises: [],
    testQuestions: [],
    project: {} as any,
  },
  {
    id: "fin-level-05",
    number: 5,
    code: "05",
    titleEn: "Cost Structure & Income Statement Forecasting",
    titleTr: "Maliyet Yapısı ve Gelir Tablosu Tahmini",
    descriptionEn:
      "Model fixed vs. variable cost behavior, gross margin percentage rules, operating expenses (SG&A), and EBITDA progression.",
    descriptionTr:
      "Sabit ve değişken maliyet davranışları, brüt kâr marjı kuralları, faaliyet giderleri ve FAVÖK projeksiyonu.",
    topics: [
      { id: "fixed-vs-variable", titleEn: "Fixed vs. Variable Cost Behavior", titleTr: "Sabit ve Değişken Maliyet Ayrımı", descEn: "Operating leverage and cost sensitivity.", descTr: "Faaliyet kaldıracı ve maliyet esnekliği." },
      { id: "cogs-margin-modeling", titleEn: "COGS & Gross Margin Modeling", titleTr: "SMM ve Brüt Kâr Marjı", descEn: "COGS = Sales × (1 - Gross Margin).", descTr: "SMM = Hasılat × (1 - Brüt Marj) formülleri." },
      { id: "operating-expenses", titleEn: "SG&A & Operating Expenses", titleTr: "Genel Yönetim ve Faaliyet Giderleri", descEn: "Headcount costs, marketing, rent, and overhead.", descTr: "Personel maliyetleri, pazarlama ve genel giderler." },
      { id: "ebitda-ebit-bridge", titleEn: "EBITDA, EBIT & Margin Progression", titleTr: "FAVÖK, EBIT ve Marj Gelişimi", descEn: "Tracing operational profitability bridges.", descTr: "Operasyonel kârlılık köprülerinin kurulması." },
      { id: "net-income-forecast", titleEn: "Bottom-Line Net Income", titleTr: "Net Dönem Kârı Tahmini", descEn: "Factoring financing costs and statutory tax rates.", descTr: "Finansman giderleri ve kurumlar vergisi hesabı." },
    ],
    isLocked: true,
    learnLessons: [],
    practiceExercises: [],
    solveExercises: [],
    testQuestions: [],
    project: {} as any,
  },
  {
    id: "fin-level-06",
    number: 6,
    code: "06",
    titleEn: "Working Capital & Balance Sheet Schedules",
    titleTr: "İşletme Sermayesi ve Bilanço Çizelgeleri",
    descriptionEn:
      "Project Accounts Receivable, Inventory, and Accounts Payable using DSO, DIO, and DPO operational day metrics.",
    descriptionTr:
      "DSO, DIO ve DPO gün metriklerini kullanarak Alacak, Stok ve Ticari Borçları dinamik olarak modelleyin.",
    topics: [
      { id: "accounts-receivable-dso", titleEn: "Accounts Receivable & DSO", titleTr: "Ticari Alacaklar ve DSO", descEn: "Receivables = (Sales / 365) * DSO.", descTr: "Alacaklar = (Hasılat / 365) * DSO modellemesi." },
      { id: "inventory-dio", titleEn: "Inventory & Days Inventory (DIO)", titleTr: "Stoklar ve Stokta Kalma Süresi (DIO)", descEn: "Inventory = (COGS / 365) * DIO.", descTr: "Stok = (SMM / 365) * DIO formülü." },
      { id: "accounts-payable-dpo", titleEn: "Accounts Payable & Days Payable (DPO)", titleTr: "Ticari Borçlar ve Ödeme Süresi (DPO)", descEn: "Payables = (COGS / 365) * DPO.", descTr: "Ticari Borç = (SMM / 365) * DPO." },
      { id: "cash-conversion-cycle", titleEn: "Cash Conversion Cycle (CCC)", titleTr: "Nakit Dönüşüm Süresi (CCC)", descEn: "CCC = DSO + DIO - DPO.", descTr: "CCC = DSO + DIO - DPO hesabı." },
      { id: "nwc-delta", titleEn: "Working Capital Cash Flow Impact", titleTr: "İşletme Sermayesi Nakit Etkisi", descEn: "Why working capital growth consumes cash.", descTr: "İşletme sermayesi artışının nakdi nasıl tükettiği." },
    ],
    isLocked: true,
    learnLessons: [],
    practiceExercises: [],
    solveExercises: [],
    testQuestions: [],
    project: {} as any,
  },
  {
    id: "fin-level-07",
    number: 7,
    code: "07",
    titleEn: "PP&E, CapEx & Depreciation Schedules",
    titleTr: "MDV, CapEx ve Amortisman Çizelgesi",
    descriptionEn:
      "Build a professional multi-year PP&E schedule: capital expenditures, straight-line depreciation, asset sales, and Net PP&E.",
    descriptionTr:
      "Profesyonel çok yıllı Maddi Duran Varlık çizelgesi: Yatırım harcamaları (CapEx), doğrusal amortisman ve Net MDV devri.",
    topics: [
      { id: "fixed-assets-capex", titleEn: "CapEx Modeling", titleTr: "CapEx (Yatırım Harcaması) Modellemesi", descEn: "Growth CapEx vs Maintenance CapEx.", descTr: "Büyüme yatırımları ve idame yatırımları ayrımı." },
      { id: "straight-line-depr", titleEn: "Straight-Line Depreciation", titleTr: "Doğrusal Amortisman", descEn: "Depreciation = Asset Cost / Useful Life.", descTr: "Amortisman = Maliyet / Faydalı Ömür." },
      { id: "ppe-rollforward", titleEn: "PP&E Roll-Forward Schedule", titleTr: "MDV Devir Çizelgesi", descEn: "Ending PP&E = Beginning + CapEx - Depr.", descTr: "Dönem Sonu = Dönem Başı + CapEx - Amortisman." },
      { id: "fixed-asset-turnover", titleEn: "Fixed Asset Turnover Ratio", titleTr: "Maddi Duran Varlık Devir Hızı", descEn: "Sales / PP&E efficiency modeling.", descTr: "Hasılat / MDV operasyonel verimliliği." },
    ],
    isLocked: true,
    learnLessons: [],
    practiceExercises: [],
    solveExercises: [],
    testQuestions: [],
    project: {} as any,
  },
  {
    id: "fin-level-08",
    number: 8,
    code: "08",
    titleEn: "Financing, Debt Schedules & Interest Expense",
    titleTr: "Finansman, Borç Çizelgesi ve Faiz Gideri",
    descriptionEn:
      "Model debt tranches, repayments, revolving credit facilities, average debt interest calculation, and circular references.",
    descriptionTr:
      "Kredi dilimleri, anapara geri ödemeleri, rotatif krediler, ortalama borç faiz hesabı ve döngüsel referans yönetimi.",
    topics: [
      { id: "debt-tranches", titleEn: "Debt Tranches & Repayment Schedules", titleTr: "Kredi Dilimleri ve Geri Ödeme Planı", descEn: "Senior debt, bonds, and scheduled amortizations.", descTr: "Kıdemli krediler, tahviller ve itfa planları." },
      { id: "average-debt-interest", titleEn: "Average Debt Interest Expense", titleTr: "Ortalama Borç Üzerinden Faiz Hesabı", descEn: "=Average(Beginning, Ending) * Rate.", descTr: "=Ortalama(Dönem Başı, Dönem Sonu) * Faiz Oranı." },
      { id: "circular-references", titleEn: "Circular References & Circuit Breakers", titleTr: "Döngüsel Referanslar ve Hata Kesiciler", descEn: "Managing cash-debt-interest calculation loops.", descTr: "Nakit-borç-faiz döngülerini yönetme teknikleri." },
    ],
    isLocked: true,
    learnLessons: [],
    practiceExercises: [],
    solveExercises: [],
    testQuestions: [],
    project: {} as any,
  },
  {
    id: "fin-level-09",
    number: 9,
    code: "09",
    titleEn: "Shareholders' Equity & Retained Earnings",
    titleTr: "Özkaynaklar ve Dağıtılmamış Kârlar",
    descriptionEn:
      "Model share capital issuances, buybacks, dividends payout policies, and the complete equity roll-forward bridge.",
    descriptionTr:
      "Sermaye artırımları, hisse geri alımları, temettü dağıtım politikaları ve eksiksiz özkaynak devir köprüsü.",
    topics: [
      { id: "share-capital", titleEn: "Common & Preferred Share Capital", titleTr: "Ödenmiş Sermaye ve İhraçlar", descEn: "Paid-in capital and share issuance mechanics.", descTr: "Hisse senedi ihraçları ve sermaye hareketleri." },
      { id: "dividends-payout", titleEn: "Dividend Payout Policies", titleTr: "Temettü Dağıtım Politikaları", descEn: "Dividends = Net Income * Payout Ratio.", descTr: "Temettü = Net Kâr * Dağıtım Oranı." },
      { id: "equity-schedule", titleEn: "Comprehensive Equity Roll-Forward", titleTr: "Kapsamlı Özkaynak Devir Tablosu", descEn: "Connecting net income to balance sheet equity.", descTr: "Net kârın bilançodaki özkaynaklara bağlanışı." },
    ],
    isLocked: true,
    learnLessons: [],
    practiceExercises: [],
    solveExercises: [],
    testQuestions: [],
    project: {} as any,
  },
  {
    id: "fin-level-10",
    number: 10,
    code: "10",
    titleEn: "Cash Flow Statement & Three-Statement Linking",
    titleTr: "Nakit Akış Tablosu ve 3 Tablonun Bağlanması",
    descriptionEn:
      "Complete the fully dynamic three-statement integration loop with Operating, Investing, and Financing cash flows.",
    descriptionTr:
      "İşletme, Yatırım ve Finansman nakit akışlarıyla 3 tablonun dinamik kapalı devre entegrasyonunu tamamlayın.",
    topics: [
      { id: "cfo-integration", titleEn: "Operating Cash Flow Integration", titleTr: "İşletme Nakit Akışı Entegrasyonu", descEn: "Non-cash add-backs and working capital deltas.", descTr: "Gayrinakdi düzeltmeler ve işletme sermayesi farkları." },
      { id: "cfi-integration", titleEn: "Investing Cash Flow Integration", titleTr: "Yatırım Nakit Akışı Entegrasyonu", descEn: "CapEx and acquisition cash outflows.", descTr: "CapEx ve şirket satın alma nakit çıkışları." },
      { id: "cff-integration", titleEn: "Financing Cash Flow Integration", titleTr: "Finansman Nakit Akışı Entegrasyonu", descEn: "Debt issuances, repayments, and dividends.", descTr: "Kredi kullanımı, geri ödemeleri ve temettü çıkışları." },
      { id: "balance-sheet-cash-plug", titleEn: "Balance Sheet Cash Plug & Check", titleTr: "Bilanço Nakit Bağlantısı ve Denge Testi", descEn: "Plugging ending cash to ensure Assets = L + E.", descTr: "Dönem sonu nakdi bağlayarak Aktif = Pasif eşitliğini sağlama." },
    ],
    isLocked: true,
    learnLessons: [],
    practiceExercises: [],
    solveExercises: [],
    testQuestions: [],
    project: {} as any,
  },
  {
    id: "fin-level-11",
    number: 11,
    code: "11",
    titleEn: "Scenario, Sensitivity & Stress-Test Analysis",
    titleTr: "Senaryo, Duyarlılık ve Stres Testi Analizi",
    descriptionEn:
      "Create dynamic scenario switchers (Base, Upside, Downside), 2-variable data tables, Goal Seek, and break-even models.",
    descriptionTr:
      "Dinamik senaryo anahtarları (Baz, İyimser, Kötümser), 2 değişkenli veri tabloları, Hedef Arama ve başabaş analizi.",
    topics: [
      { id: "scenario-switches", titleEn: "Dynamic Scenario Switchers (CHOOSE/INDEX)", titleTr: "Dinamik Senaryo Anahtarı (ELEMAN/İNDİS)", descEn: "Switching models between Base, Bull, and Bear.", descTr: "Modeli Baz, İyimser ve Kötümser arasında tek tıkla geçirme." },
      { id: "data-tables", titleEn: "1-Way & 2-Way Data Tables", titleTr: "Tek ve Çift Girişli Veri Tabloları", descEn: "Testing price vs volume sensitivity matrices.", descTr: "Fiyat ve hacim duyarlılık matrisleri oluşturma." },
      { id: "breakeven-goalseek", titleEn: "Break-Even Analysis & Goal Seek", titleTr: "Başabaş Analizi ve Hedef Arama", descEn: "Finding the exact sales volume needed to avoid loss.", descTr: "Zarar etmemek için gereken asgari satış hacmini bulma." },
    ],
    isLocked: true,
    learnLessons: [],
    practiceExercises: [],
    solveExercises: [],
    testQuestions: [],
    project: {} as any,
  },
  {
    id: "fin-level-12",
    number: 12,
    code: "12",
    titleEn: "Full Corporate Financial Model Capstone Project",
    titleTr: "Kapsamlı Şirket Finansal Modeli Bitirme Projesi",
    descriptionEn:
      "Build a complete institutional 5-year integrated 3-statement model from raw company audit filings from start to finish.",
    descriptionTr:
      "Ham şirket denetim raporlarından yola çıkarak 5 yıllık tam entegre 3 tablolu kurumsal modeli sıfırdan inşa edin.",
    topics: [
      { id: "historical-financials", titleEn: "Structuring Historical Actuals", titleTr: "Tarihsel Verilerin Düzenlenmesi", descEn: "Standardizing 3 years of audited financials.", descTr: "3 yıllık denetlenmiş mali tabloların standartlaştırılması." },
      { id: "assumption-engine", titleEn: "Operating & Financial Assumptions", titleTr: "Operasyonel ve Finansal Varsayımlar", descEn: "Driver modeling across revenue, margins, and capex.", descTr: "Büyüme, marj ve yatırım sürücülerinin kurulması." },
      { id: "integrated-forecast", titleEn: "Full 3-Statement Forecast Engine", titleTr: "Tam Entegre 3 Tablolu Tahmin Motoru", descEn: "5-year forecast with automated balancing and zero hardcodes.", descTr: "Sıfır sabit sayı ile 5 yıllık kusursuz denkleşen model." },
      { id: "executive-presentation", titleEn: "Executive Summary & Valuation Outputs", titleTr: "Yönetici Özeti ve Çıktı Raporlaması", descEn: "Presenting findings and valuation metrics to stakeholders.", descTr: "Model bulgularını karar vericilere profesyonelce sunma." },
    ],
    isLocked: true,
    learnLessons: [],
    practiceExercises: [],
    solveExercises: [],
    testQuestions: [],
    project: {} as any,
  },
];

export function getFinancialLevelById(levelId: string): FinancialLevel | undefined {
  return FINANCIAL_LEVELS.find((l) => l.id === levelId);
}

export function getTotalFinancialLevels(): number {
  return FINANCIAL_LEVELS.length;
}
