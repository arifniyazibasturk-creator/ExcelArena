import { FinancialLevel } from "../types";

export const LEVEL_01_FINANCIAL: FinancialLevel = {
  id: "fin-level-01",
  number: 1,
  code: "01",
  titleEn: "Financial Statement Basics",
  titleTr: "Finansal Tablo Temelleri",
  descriptionEn:
    "Master the Income Statement, Balance Sheet, and Cash Flow Statement, their accounting equations, and how they dynamically interconnect in financial models.",
  descriptionTr:
    "Gelir Tablosu, Bilanço ve Nakit Akış Tablosu arasındaki dinamik bağlantıları, temel muhasebe denkliklerini ve finansal modelleme prensiplerini öğrenin.",
  isLocked: false,
  topics: [
    {
      id: "income-statement",
      titleEn: "Income Statement (P&L)",
      titleTr: "Gelir Tablosu (P&L)",
      descEn: "Revenues, COGS, Gross Profit, Operating Expenses, EBIT, and Net Income.",
      descTr: "Hasılat, SMM, Brüt Kâr, Faaliyet Giderleri, FAVÖK/EBIT ve Net Kâr.",
    },
    {
      id: "balance-sheet",
      titleEn: "Balance Sheet",
      titleTr: "Bilanço",
      descEn: "Assets, Liabilities, Shareholders' Equity, and the fundamental accounting check.",
      descTr: "Varlıklar, Yükümlülükler, Özkaynaklar ve temel denklik kontrolü.",
    },
    {
      id: "cash-flow-statement",
      titleEn: "Cash Flow Statement",
      titleTr: "Nakit Akış Tablosu",
      descEn: "Operating, Investing, and Financing cash flows and non-cash reconciliation.",
      descTr: "İşletme, Yatırım ve Finansman nakit akışları ile gayrinakdi düzeltmeler.",
    },
    {
      id: "three-statement-interconnection",
      titleEn: "Three-Statement Interconnection",
      titleTr: "Üç Tablonun Entegrasyonu",
      descEn: "How Net Income, CapEx, Depreciation, and Cash link across all three statements.",
      descTr: "Net Kâr, CapEx, Amortisman ve Nakit tutarlarının tablolar arası dinamik akışı.",
    },
    {
      id: "profit-vs-cash",
      titleEn: "Profit versus Cash",
      titleTr: "Kâr ve Nakit Ayrımı",
      descEn: "Accrual accounting principles, revenue timing, and working capital cash drag.",
      descTr: "Tahakkuk esası, tahsilat gecikmeleri ve işletme sermayesinin nakde etkisi.",
    },
    {
      id: "historical-vs-forecast",
      titleEn: "Historical vs. Forecast Periods",
      titleTr: "Tarihsel ve Tahmin Dönemleri",
      descEn: "Differentiating static historical actuals from dynamic formula-driven assumptions.",
      descTr: "Sabit geçmiş veriler ile formüle dayalı dinamik tahmin girdilerinin ayrımı.",
    },
  ],
  learnLessons: [
    {
      id: "lesson-01-three-statements",
      titleEn: "1. The Three Core Financial Statements",
      titleTr: "1. Üç Temel Finansal Tablo",
      conceptEn:
        "Every company's financial story is told through three interrelated statements: the Income Statement (measuring profitability over a period of time), the Balance Sheet (a snapshot of assets, liabilities, and equity at a specific point in time), and the Cash Flow Statement (measuring actual cash inflows and outflows). In financial modeling, these three statements are never modeled in isolation; they form an integrated closed-loop mathematical system.",
      conceptTr:
        "Her şirketin finansal performansı birbirine bağlı üç temel tablo üzerinden okunur: Gelir Tablosu (belirli bir dönemdeki kârlılık akışı), Bilanço (belirli bir andaki varlık, borç ve özkaynak fotoğrafı) ve Nakit Akış Tablosu (gerçek nakit giriş ve çıkışları). Finansal modellemede bu üç tablo asla birbirinden bağımsız inşa edilmez; birbirini besleyen kapalı bir matematiksel sistem oluştururlar.",
      whyItMattersEn:
        "Relying on only one statement gives a dangerous, incomplete picture. A company can show strong net income on its Income Statement while burning through cash and nearing insolvency on its Cash Flow Statement.",
      whyItMattersTr:
        "Yalnızca tek bir tabloya bakmak yanıltıcı ve risklidir. Bir şirket Gelir Tablosunda yüksek net kâr açıklarken, Nakit Akış Tablosunda hızla nakit tüketip iflasın eşiğine gelebilir.",
      whenToUseEn:
        "Use when building corporate forecasts, evaluating financial health, or assessing valuation models.",
      whenToUseTr:
        "Şirket bütçeleri, 3 tablolu finansal modeller, şirket değerleme ve finansal sıhhat analizlerinde kullanılır.",
      statementsAffected: ["Income Statement", "Balance Sheet", "Cash Flow Statement"],
      keyFormulas: [
        {
          nameEn: "Gross Profit",
          nameTr: "Brüt Kâr",
          formula: "=Revenue - COGS",
          explanationEn: "Sales revenue minus the direct cost of goods sold.",
          explanationTr: "Hasılat eksi satılan malların doğrudan maliyeti.",
        },
        {
          nameEn: "Accounting Equation",
          nameTr: "Temel Bilanço Denkliği",
          formula: "=Assets - (Liabilities + Equity)",
          explanationEn: "Must evaluate to zero; total assets must exactly equal liabilities plus equity.",
          explanationTr: "Her zaman sıfıra eşit olmalıdır; varlıklar borçlar ve özkaynak toplamına tam eşit olmalıdır.",
        },
        {
          nameEn: "Ending Cash Check",
          nameTr: "Dönem Sonu Nakit",
          formula: "=Beginning_Cash + Net_Change_In_Cash",
          explanationEn: "Cash at start of period plus total net cash flow across OCF, ICF, and FCF.",
          explanationTr: "Dönem başı nakit artı işletme, yatırım ve finansmandan gelen net nakit değişimi.",
        },
      ],
      commonMistakesEn: [
        "Confusing Net Income with Cash Balance.",
        "Hardcoding total rows instead of using dynamic SUM / arithmetic formulas.",
        "Ignoring the fundamental balance sheet check (Assets must equal Liabilities + Equity).",
      ],
      commonMistakesTr: [
        "Net Kâr ile Kasadaki Nakit miktarını birbirine karıştırmak.",
        "Toplam satırlarına dinamik formül yazmak yerine elle sabit sayı yazmak.",
        "Bilanço denklik kontrolünü ihmal etmek (Aktif = Pasif eşitliği).",
      ],
      practicalExample: {
        descriptionEn: "High-level summary structure of the 3 interconnected statements:",
        descriptionTr: "Birbirine bağlı 3 tablonun özet mimarisi:",
        headers: ["Statement", "Primary Purpose", "Time Horizon", "Key Output / Connector"],
        rows: [
          ["Income Statement", "Measures operating performance", "Period (e.g. FY2024)", "Net Income"],
          ["Balance Sheet", "Snapshot of financial position", "Point in Time (Dec 31)", "Retained Earnings & Cash"],
          ["Cash Flow Statement", "Tracks physical cash movement", "Period (e.g. FY2024)", "Ending Cash"],
        ],
        notesEn: "Net Income links to both Retained Earnings (Balance Sheet) and Operating Cash Flow.",
        notesTr: "Net Kâr hem Dağıtılmamış Kârlara (Bilanço) hem de İşletme Nakit Akışına bağlanır.",
      },
    },
    {
      id: "lesson-02-cash-vs-profit",
      titleEn: "2. Cash vs. Profit: The Accrual Accounting Gap",
      titleTr: "2. Kâr ve Nakit: Tahakkuk Esası ile Nakit Akışı Ayrımı",
      conceptEn:
        "Under accrual accounting (IFRS / US GAAP), revenue is recorded when goods or services are delivered, not when customer payments are collected. Similarly, expenses are matched against revenues when incurred, not when paid. Furthermore, capital expenditures (CapEx) are capitalized on the balance sheet and expensed gradually over time as non-cash Depreciation. Consequently, Net Income and Net Cash Movement almost never equal each other.",
      conceptTr:
        "Tahakkuk esaslı muhasebede (UFRS / VUK), hasılat mal teslim edildiğinde veya hizmet verildiğinde kaydedilir; nakit tahsil edildiğinde değil. Benzer şekilde harcamalar oluştuğu dönemde eşleştirilir. Ayrıca maddi duran varlık yatırımları (CapEx) doğrudan gider yazılmayıp bilançoya aktarılır ve yıllara yayılarak nakit çıkışı gerektirmeyen Amortisman olarak düşülür. Bu sebeple Net Kâr ile Kasaya Giren Nakit neredeyse hiçbir zaman birbirine eşit çıkmaz.",
      whyItMattersEn:
        "A fast-growing business can have skyrocketing Net Income, but if its receivables are uncollected and inventory is piling up, it will run out of cash and face bankruptcy.",
      whyItMattersTr:
        "Hızlı büyüyen bir şirket rekor Net Kâr elde edebilir; fakat müşterilerinden vadeli alacaklarını tahsil edemez ve stokları şişerse nakitsiz kalıp operasyonlarını durdurmak zorunda kalabilir.",
      whenToUseEn:
        "Crucial when forecasting working capital, analyzing debt repayment capacity, and evaluating dividend sustainability.",
      whenToUseTr:
        "İşletme sermayesi tahmini, borç ödeme kapasitesi analizi ve temettü dağıtılabilirliği değerlendirilirken esastır.",
      statementsAffected: ["Income Statement", "Balance Sheet", "Cash Flow Statement"],
      keyFormulas: [
        {
          nameEn: "Operating Cash Flow Bridge",
          nameTr: "İşletme Nakit Akışı Köprüsü",
          formula: "=Net_Income + Non_Cash_Expenses - Increase_In_Working_Capital",
          explanationEn: "Reconciles accounting net income to actual operating cash.",
          explanationTr: "Net kârı gayrinakdi giderler ve işletme sermayesi değişimini düzelterek gerçek nakde bağlar.",
        },
        {
          nameEn: "Working Capital Delta",
          nameTr: "İşletme Sermayesi Değişimi",
          formula: "=(Current_Assets - Cash) - (Current_Liabilities - Short_Term_Debt)",
          explanationEn: "Non-cash working capital tied up in operations.",
          explanationTr: "Operasyonlara bağlanan nakit dışı net işletme sermayesi.",
        },
      ],
      commonMistakesEn: [
        "Treating CapEx as an immediate Income Statement expense.",
        "Forgetting to add back Depreciation on the Cash Flow Statement.",
        "Assuming that higher sales automatically translate to immediate cash in the bank.",
      ],
      commonMistakesTr: [
        "Yatırım harcamasını (CapEx) doğrudan Gelir Tablosunda gider gibi yazmak.",
        "Nakit Akış Tablosunda nakit çıkışı olmayan Amortismanı net kâra geri eklemeyi unutmak.",
        "Cironun artmasının bankadaki nakdi anında artıracağını varsaymak.",
      ],
      practicalExample: {
        descriptionEn: "Example of a profitable company with negative operating cash flow:",
        descriptionTr: "Net kârı pozitif fakat işletme nakit akışı negatif olan şirket örneği:",
        headers: ["Metric", "Amount ($)", "Accounting / Cash Interpretation"],
        rows: [
          ["Sales Revenue", 1000000, "Delivered to clients on 90-day credit term"],
          ["Cost of Goods & Opex", -700000, "Paid suppliers and employees"],
          ["Net Income", 300000, "Appears highly profitable on paper!"],
          ["Uncollected Receivables (A/R)", -350000, "Clients have not paid cash yet"],
          ["Operating Cash Flow", -50000, "Cash balance shrank by $50K despite $300K profit!"],
        ],
        notesEn: "Without external financing or debt, this company could bounce payroll checks.",
        notesTr: "Dış finansman veya kredi olmadan bu şirket kârlı olmasına rağmen maaşları ödeyemeyebilir.",
      },
    },
    {
      id: "lesson-03-three-statement-linkage",
      titleEn: "3. Three-Statement Dynamic Linkages",
      titleTr: "3. Üç Tablonun Dinamik Matematiksel Entegrasyonu",
      conceptEn:
        "The power of financial modeling lies in automated connectivity. When an assumption changes (such as next year's sales growth), the entire model must recalculate dynamically through four universal linkages: Net Income flows into Retained Earnings and Cash Flow from Operations; D&A reduces Net PP&E and is added back to Cash Flow; CapEx increases PP&E and drains Cash Flow from Investing; Ending Cash from the Cash Flow Statement plugs into Balance Sheet Cash.",
      conceptTr:
        "Finansal modellemenin gücü dinamik entegrasyonda yatar. Modeldeki bir varsayım (örneğin satış büyüme oranı) değiştiğinde, dört evrensel köprü üzerinden tüm tablolar anında yeniden hesaplanmalıdır: Net Kâr, Dağıtılmamış Kârlara ve İşletme Nakit Akışına akar; Amortisman, Duran Varlığı azaltırken Nakit Akışına geri eklenir; CapEx, Duran Varlığı artırırken Yatırım Nakit Akışından çıkar; Nakit Akışının sonundaki Dönem Sonu Nakit, Bilançonun Hazır Değerler satırına bağlanır.",
      whyItMattersEn:
        "Models that use broken links or manual copy-pasting break instantly under stress-testing and fail audit checks in investment banking and corporate finance.",
      whyItMattersTr:
        "Kopuk bağlar veya elle kopyala-yapıştır yapılan modeller senaryo analizlerinde çöker; kurumsal finansman ve yatırım bankacılığı denetimlerinden geçemez.",
      whenToUseEn:
        "Every time you build a 3-statement model, DCF model, LBO model, or corporate budgeting tool.",
      whenToUseTr:
        "3 tablolu finansal model, DCF değerleme, şirket bütçeleme veya LBO modeli kurarken her zaman uygulanır.",
      statementsAffected: ["Income Statement", "Balance Sheet", "Cash Flow Statement"],
      keyFormulas: [
        {
          nameEn: "Retained Earnings Roll-Forward",
          nameTr: "Dağıtılmamış Kârlar Devri",
          formula: "=Beginning_RE + Net_Income - Dividends",
          explanationEn: "Links Income Statement Net Income into Balance Sheet Shareholders' Equity.",
          explanationTr: "Gelir Tablosundaki Net Kârı Bilançodaki Özkaynaklara bağlayan ana köprüdür.",
        },
        {
          nameEn: "Net PP&E Roll-Forward",
          nameTr: "Maddi Duran Varlık Devri",
          formula: "=Beginning_Net_PPE + CapEx - Depreciation",
          explanationEn: "Integrates capital investments and non-cash depreciation into Net PP&E.",
          explanationTr: "Yatırımları ve amortismanı net duran varlığa bağlar.",
        },
        {
          nameEn: "Balance Sheet Check (Equilibrium)",
          nameTr: "Bilanço Denge Kontrolü",
          formula: "=Total_Assets - (Total_Liabilities + Total_Equity)",
          explanationEn: "Must evaluate exactly to 0. Any non-zero value indicates a broken link.",
          explanationTr: "Tam 0 olmalıdır. 0 dışındaki herhangi bir değer kopuk veya hatalı formülü gösterir.",
        },
      ],
      commonMistakesEn: [
        "Typing raw numbers into forecast rows instead of dynamic cell references.",
        "Subtracting dividends from net income on the income statement instead of equity schedule.",
        "Forgetting to tie Balance Sheet Cash directly to Ending Cash on the Cash Flow statement.",
      ],
      commonMistakesTr: [
        "Tahmin satırlarına hücre referansı yerine elle sabit sayı girmek.",
        "Temettüleri Gelir Tablosunda düşmeye çalışmak (temettü kâr dağıtımıdır, özkaynak devrinde düşülür).",
        "Bilançodaki Nakit hücresini Nakit Akış Tablosunun sonundaki nakde bağlamayı unutmak.",
      ],
      practicalExample: {
        descriptionEn: "The 4 Universal Integration Pillars:",
        descriptionTr: "4 Temel Entegrasyon Köprüsü:",
        headers: ["Link Pillar", "Source Statement", "Target Statement", "Dynamic Impact"],
        rows: [
          ["1. Net Income", "Income Statement (Bottom)", "Balance Sheet & Cash Flow", "Increases Retained Earnings & starts CFO"],
          ["2. Depreciation", "Income Statement / Schedule", "Cash Flow (Add-back) & Balance Sheet", "Added back to OCF, reduces Net PP&E"],
          ["3. CapEx", "Investing Schedule", "Cash Flow (CFI) & Balance Sheet", "Cash outflow in CFI, increases Gross PP&E"],
          ["4. Cash Plug", "Cash Flow Statement (Bottom)", "Balance Sheet (Top)", "Completes the balance sheet loop"],
        ],
        notesEn: "If any of these 4 links is hardcoded or missing, the Balance Sheet will fail to balance.",
        notesTr: "Bu 4 köprüden biri bile elle yazılır veya koparsa, Bilanço asla denkleşmez.",
      },
    },
  ],
  practiceExercises: [
    {
      id: "fin-ex-prac-01",
      type: "build_formula",
      titleEn: "1. Revenue Growth Rate Forecasting",
      titleTr: "1. Satış Büyüme Oranı ile Hasılat Tahmini",
      taskEn:
        "Calculate the 2025 Forecasted Revenue in cell C3 by applying the 12% Growth Rate in cell C2 to the 2024 Actual Revenue in cell B3. Use dynamic cell references only.",
      taskTr:
        "C3 hücresine, C2'deki %12 büyüme oranını B3'teki 2024 hasılatına uygulayarak 2025 Hasılat Tahminini hesaplayan dinamik formülü yazın. Asla sabit sayı kullanmayın.",
      contextEn:
        "In financial forecasting, future periods are driven by growth assumptions rather than static values. The universal formula is: Base Sales × (1 + Growth Rate).",
      contextTr:
        "Finansal modellemede gelecek dönemler sabit değerlerle değil, büyüme varsayımlarıyla modellenir. Evrensel formül: Baz Hasılat × (1 + Büyüme Oranı)'dır.",
      dataset: {
        columns: [
          { key: "metric", name: "Metric", colLetter: "A" },
          { key: "act2024", name: "2024 Actual", colLetter: "B", type: "number" },
          { key: "fc2025", name: "2025 Forecast", colLetter: "C", type: "number" },
        ],
        rows: [
          { metric: "Growth Rate Assumption", act2024: "-", fc2025: 0.12 },
          { metric: "Sales Revenue", act2024: 500000, fc2025: null },
        ],
        hasHeaderRow: true,
      },
      targetCell: "C3",
      expectedFormula: "=B3*(1+C2)",
      expectedResult: 560000,
      requiredDependencies: ["B3", "C2"],
      forbiddenHardcodes: [500000, 560000, 0.12, 1.12],
      assumptionCell: "C2",
      assumptionPerturbation: 0.2,
      expectedPerturbedResult: 600000,
      hintsEn: [
        "Reference cell B3 for 2024 Revenue and cell C2 for the growth rate.",
        "Remember the mathematical pattern: Base * (1 + Rate).",
        "Write: =B3*(1+C2)",
      ],
      hintsTr: [
        "2024 hasılatı için B3, büyüme oranı için C2 hücresini referans alın.",
        "Matematiksel formülü hatırlayın: Baz * (1 + Oran).",
        "Yazmanız gereken: =B3*(1+C2)",
      ],
      explanationEn:
        "Formula =B3*(1+C2) multiplies the $500,000 baseline by (1 + 0.12) = 1.12, yielding $560,000. When growth assumptions change, the model updates automatically.",
      explanationTr:
        "=B3*(1+C2) formülü, 500.000 TL'lik baz hasılatı (1 + 0.12) ile çarparak 560.000 TL üretir. Varsayım hücresi değiştiğinde tahmin anında güncellenir.",
      statementContext: "Income Statement",
    },
    {
      id: "fin-ex-prac-02",
      type: "build_formula",
      titleEn: "2. Gross Profit Calculation",
      titleTr: "2. Brüt Kâr Hesabı",
      taskEn:
        "In cell B4, calculate Gross Profit by subtracting Cost of Goods Sold (B3) from Sales Revenue (B2).",
      taskTr:
        "B4 hücresine, Satış Hasılatından (B2) Satılan Malların Maliyetini (B3) düşerek Brüt Kârı hesaplayan formülü yazın.",
      contextEn:
        "Gross Profit reflects the core profitability of a company's production or merchandise before operating expenses.",
      contextTr:
        "Brüt Kâr, şirketin genel faaliyet giderlerinden önce ana üretim veya ticaretinin ne kadar kârlı olduğunu gösterir.",
      dataset: {
        columns: [
          { key: "item", name: "Income Statement Line", colLetter: "A" },
          { key: "amount", name: "Amount ($)", colLetter: "B", type: "number" },
        ],
        rows: [
          { item: "Sales Revenue", amount: 850000 },
          { item: "Cost of Goods Sold (COGS)", amount: 510000 },
          { item: "Gross Profit", amount: null },
        ],
        hasHeaderRow: true,
      },
      targetCell: "B4",
      expectedFormula: "=B2-B3",
      expectedResult: 340000,
      requiredDependencies: ["B2", "B3"],
      forbiddenHardcodes: [850000, 510000, 340000],
      assumptionCell: "B3",
      assumptionPerturbation: 500000,
      expectedPerturbedResult: 350000,
      hintsEn: [
        "Subtract the COGS row from the Sales Revenue row.",
        "Use standard cell subtraction: =B2-B3",
      ],
      hintsTr: [
        "Hasılat satırından SMM satırını çıkarın.",
        "Standart hücre çıkarma işlemi uygulayın: =B2-B3",
      ],
      explanationEn:
        "Gross Profit = Revenue - COGS. With $850,000 revenue and $510,000 COGS, Gross Profit equals $340,000 (representing a 40% Gross Margin).",
      explanationTr:
        "Brüt Kâr = Hasılat - SMM. 850.000 TL hasılat ve 510.000 TL SMM ile Brüt Kâr 340.000 TL (%40 brüt marj) olarak hesaplanır.",
      statementContext: "Income Statement",
    },
    {
      id: "fin-ex-prac-03",
      type: "driver_selection",
      titleEn: "3. Financial Driver Selection for Receivables",
      titleTr: "3. Ticari Alacaklar İçin Finansal Sürücü Seçimi",
      taskEn:
        "Select the most robust and standard financial modeling driver for forecasting future Accounts Receivable.",
      taskTr:
        "Finansal modellemede gelecek dönem Ticari Alacakları tahmin etmek için en doğru ve standart finansal sürücüyü seçin.",
      contextEn:
        "In three-statement modeling, working capital accounts should not be hardcoded; they must be tied to operational efficiency metrics.",
      contextTr:
        "3 tablolu modellemede işletme sermayesi kalemleri elle yazılmaz; operasyonel etkinlik oranlarına bağlanır.",
      optionsEn: [
        "Arbitrary fixed percentage of Net Income",
        "Days Sales Outstanding (DSO) applied to daily sales: =(Sales / 365) * DSO",
        "Fixed dollar amount copied from the prior year balance sheet",
        "Total debt divided by cash balance",
      ],
      optionsTr: [
        "Net Kârın rastgele sabit bir yüzdesi",
        "Günlük satışa uygulanan Alacak Tahsil Süresi (DSO): =(Hasılat / 365) * DSO",
        "Önceki yıl bilançosundan doğrudan kopyalanan sabit bir tutar",
        "Toplam borcun nakit bakiyesine oranı",
      ],
      correctOptionIndex: 1,
      hintsEn: [
        "Think about what drives customers to pay: their payment terms in days.",
        "DSO measures how many days on average it takes to collect revenue.",
      ],
      hintsTr: [
        "Müşterilerin ödeme alışkanlığını düşünün: gün cinsinden tahsilat vadesi.",
        "DSO (Alacak Tahsil Süresi), hasılatın ortalama kaç günde tahsil edildiğini ölçer.",
      ],
      explanationEn:
        "Accounts Receivable is driven by credit terms. The standard modeling formula is (Sales / 365) × DSO, linking receivables directly to revenue volume and collection efficiency.",
      explanationTr:
        "Ticari alacaklar vadeli satış politikası ile belirlenir. Standart modelleme kuralı: (Hasılat / 365) × DSO'dur; alacakları doğrudan satış hacmine bağlar.",
      statementContext: "Balance Sheet",
    },
    {
      id: "fin-ex-prac-04",
      type: "build_formula",
      titleEn: "4. Retained Earnings Roll-Forward Link",
      titleTr: "4. Dağıtılmamış Kârlar Devir Formülü",
      taskEn:
        "In cell B5, write the dynamic formula to calculate Ending Retained Earnings using Beginning Retained Earnings (B2), Net Income (B3), and Dividends Paid (B4).",
      taskTr:
        "B5 hücresine, Dönem Başı Dağıtılmamış Kârlar (B2), Net Kâr (B3) ve Ödenen Temettüleri (B4) kullanarak Dönem Sonu Dağıtılmamış Kârları hesaplayan dinamik formülü yazın.",
      contextEn:
        "The Retained Earnings schedule is the primary bridge connecting the Income Statement to the Balance Sheet's Equity section.",
      contextTr:
        "Dağıtılmamış kârlar devir tablosu, Gelir Tablosunu Bilançodaki Özkaynaklara bağlayan ana köprüdür.",
      dataset: {
        columns: [
          { key: "item", name: "Retained Earnings Roll-Forward", colLetter: "A" },
          { key: "amount", name: "Amount ($)", colLetter: "B", type: "number" },
        ],
        rows: [
          { item: "Beginning Retained Earnings", amount: 120000 },
          { item: "Net Income (from P&L)", amount: 45000 },
          { item: "Dividends Paid to Shareholders", amount: 15000 },
          { item: "Ending Retained Earnings", amount: null },
        ],
        hasHeaderRow: true,
      },
      targetCell: "B5",
      expectedFormula: "=B2+B3-B4",
      expectedResult: 150000,
      requiredDependencies: ["B2", "B3", "B4"],
      forbiddenHardcodes: [120000, 45000, 15000, 150000],
      assumptionCell: "B3",
      assumptionPerturbation: 55000,
      expectedPerturbedResult: 160000,
      hintsEn: [
        "Ending Balance = Beginning Balance + Inflows (Net Income) - Outflows (Dividends).",
        "Write: =B2+B3-B4",
      ],
      hintsTr: [
        "Dönem Sonu = Dönem Başı + Girişler (Net Kâr) - Çıkışlar (Temettü).",
        "Yazmanız gereken formül: =B2+B3-B4",
      ],
      explanationEn:
        "Ending Retained Earnings equals Beginning RE ($120,000) + Net Income ($45,000) - Dividends ($15,000) = $150,000. This directly updates Shareholders' Equity on the Balance Sheet.",
      explanationTr:
        "Dönem Sonu Dağıtılmamış Kârlar = 120.000 + 45.000 - 15.000 = 150.000 TL'dir. Bu tutar doğrudan Bilançonun Özkaynaklar bölümüne aktarılır.",
      statementContext: "Integrated",
    },
    {
      id: "fin-ex-prac-05",
      type: "model_linking",
      titleEn: "5. Balance Sheet Equilibrium Check",
      titleTr: "5. Bilanço Denge ve Eşitlik Kontrolü",
      taskEn:
        "In cell B5, write the balance check formula that subtracts Total Liabilities (B3) and Total Equity (B4) from Total Assets (B2). The result must evaluate to 0.",
      taskTr:
        "B5 hücresine, Toplam Varlıklardan (B2) Toplam Borçlar (B3) ve Toplam Özkaynakları (B4) çıkaran denge kontrol formülünü yazın. Doğru sonuç tam 0 olmalıdır.",
      contextEn:
        "Every professional financial model includes a balance check row. If Assets ≠ Liabilities + Equity, the check flags an error immediately.",
      contextTr:
        "Tüm profesyonel finansal modeller bir denge kontrol satırı içerir. Aktif ≠ Pasif durumunda kontrol hücresi anında hata bayrağı kaldırır.",
      dataset: {
        columns: [
          { key: "section", name: "Balance Sheet Section", colLetter: "A" },
          { key: "amount", name: "Amount ($)", colLetter: "B", type: "number" },
        ],
        rows: [
          { section: "Total Assets", amount: 750000 },
          { section: "Total Liabilities", amount: 320000 },
          { section: "Total Shareholders' Equity", amount: 430000 },
          { section: "Balance Check Delta", amount: null },
        ],
        hasHeaderRow: true,
      },
      targetCell: "B5",
      expectedFormula: "=B2-(B3+B4)",
      expectedResult: 0,
      requiredDependencies: ["B2", "B3", "B4"],
      forbiddenHardcodes: [750000, 320000, 430000],
      assumptionCell: "B2",
      assumptionPerturbation: 760000,
      expectedPerturbedResult: 10000,
      hintsEn: [
        "Formula pattern: Assets - (Liabilities + Equity) or Assets - Liabilities - Equity.",
        "Write: =B2-(B3+B4) or =B2-B3-B4",
      ],
      hintsTr: [
        "Formül mantığı: Varlıklar - (Borçlar + Özkaynaklar) veya Varlıklar - Borçlar - Özkaynaklar.",
        "Yazabileceğiniz formül: =B2-(B3+B4) veya =B2-B3-B4",
      ],
      explanationEn:
        "Assets ($750,000) minus Liabilities ($320,000) and Equity ($430,000) equals 0. The Balance Sheet is perfectly in balance.",
      explanationTr:
        "Toplam Varlıklar (750.000 TL) eksi Borçlar (320.000 TL) ve Özkaynaklar (430.000 TL) = 0. Bilanço kusursuz bir şekilde dengededir.",
      statementContext: "Balance Sheet",
    },
  ],
  solveExercises: [
    {
      id: "fin-ex-solve-01",
      type: "build_formula",
      titleEn: "1. EBITDA to Pre-Tax Income (EBT) Bridge",
      titleTr: "1. FAVÖK'ten Vergi Öncesi Kâra (VÖK) Geçiş",
      taskEn:
        "In cell B5, calculate Pre-Tax Income (EBT) by subtracting Depreciation & Amortization (B3) and Interest Expense (B4) from EBITDA (B2).",
      taskTr:
        "B5 hücresine, FAVÖK'ten (B2) Amortisman Giderlerini (B3) ve Faiz Giderini (B4) çıkararak Vergi Öncesi Kârı (VÖK) hesaplayan formülü yazın.",
      contextEn:
        "EBITDA reflects pure cash operating profitability before capital structure (interest) and non-cash depreciation.",
      contextTr:
        "FAVÖK, sermaye yapısı (faiz) ve nakit dışı amortisman öncesi saf operasyonel kârlılığı temsil eder.",
      dataset: {
        columns: [
          { key: "item", name: "P&L Bridge Item", colLetter: "A" },
          { key: "amount", name: "2025 Projected ($)", colLetter: "B", type: "number" },
        ],
        rows: [
          { item: "EBITDA", amount: 250000 },
          { item: "Less: Depreciation & Amortization", amount: 40000 },
          { item: "Less: Interest Expense", amount: 15000 },
          { item: "Pre-Tax Income (EBT)", amount: null },
        ],
        hasHeaderRow: true,
      },
      targetCell: "B5",
      expectedFormula: "=B2-B3-B4",
      expectedResult: 195000,
      requiredDependencies: ["B2", "B3", "B4"],
      forbiddenHardcodes: [250000, 40000, 15000, 195000],
      assumptionCell: "B2",
      assumptionPerturbation: 300000,
      expectedPerturbedResult: 245000,
      hintsEn: [
        "Subtract both expense rows from the top EBITDA figure.",
        "Formula: =B2-B3-B4",
      ],
      hintsTr: [
        "Her iki gider satırını da en üstteki FAVÖK değerinden düşün.",
        "Formül: =B2-B3-B4",
      ],
      explanationEn:
        "Pre-Tax Income = EBITDA ($250,000) - D&A ($40,000) - Interest ($15,000) = $195,000.",
      explanationTr:
        "Vergi Öncesi Kâr = 250.000 - 40.000 - 15.000 = 195.000 TL.",
      statementContext: "Income Statement",
    },
    {
      id: "fin-ex-solve-02",
      type: "build_formula",
      titleEn: "2. Accounts Receivable from Days Sales Outstanding (DSO)",
      titleTr: "2. Tahsilat Süresinden (DSO) Ticari Alacak Modellemesi",
      taskEn:
        "In cell B5, calculate the Projected Accounts Receivable using the formula: =(Forecasted Sales / Days in Year) * DSO.",
      taskTr:
        "B5 hücresine, =(Tahmini Hasılat / Yıldaki Gün) * DSO formülüyle Gelecek Yıl Ticari Alacaklarını hesaplayan dinamik formülü yazın.",
      contextEn:
        "When sales grow, receivables grow proportionally unless collection efficiency (DSO) improves.",
      contextTr:
        "Satışlar arttığında, tahsilat süresi (DSO) kısalmadığı sürece alacaklar da doğru orantılı olarak büyür.",
      dataset: {
        columns: [
          { key: "driver", name: "Driver / Input", colLetter: "A" },
          { key: "val", name: "Value", colLetter: "B", type: "number" },
        ],
        rows: [
          { driver: "Forecasted Sales Revenue ($)", val: 730000 },
          { driver: "Days Sales Outstanding (DSO)", val: 45 },
          { driver: "Days in Year Assumption", val: 365 },
          { driver: "Projected Accounts Receivable ($)", val: null },
        ],
        hasHeaderRow: true,
      },
      targetCell: "B5",
      expectedFormula: "=(B2/B4)*B3",
      expectedResult: 90000,
      requiredDependencies: ["B2", "B3"],
      forbiddenHardcodes: [730000, 45, 90000],
      assumptionCell: "B3",
      assumptionPerturbation: 60,
      expectedPerturbedResult: 120000,
      hintsEn: [
        "Daily sales is B2 / B4 (or 365). Multiply that by the DSO in B3.",
        "Write: =(B2/B4)*B3 or =(B2/365)*B3",
      ],
      hintsTr: [
        "Günlük hasılat B2 / B4 (veya 365). Bunu B3'teki DSO ile çarpın.",
        "Yazın: =(B2/B4)*B3 veya =(B2/365)*B3",
      ],
      explanationEn:
        "Daily sales = $730,000 / 365 = $2,000/day. With a 45-day collection window, Accounts Receivable is $2,000 × 45 = $90,000.",
      explanationTr:
        "Günlük hasılat = 730.000 / 365 = 2.000 TL/gün. 45 günlük tahsilat vadesiyle Ticari Alacaklar = 2.000 × 45 = 90.000 TL olur.",
      statementContext: "Balance Sheet",
    },
    {
      id: "fin-ex-solve-03",
      type: "formula_debugging",
      titleEn: "3. Correcting Broken Debt Interest Formula",
      titleTr: "3. Hatalı Faiz Gideri Formülünü Düzeltme",
      taskEn:
        "Cell B6 has a broken formula that multiplies Ending Debt by a hardcoded 0.06. Rewrite cell B6 to calculate Interest Expense dynamically using Average Debt and the Interest Rate in cell B5: =((B2+B4)/2)*B5.",
      taskTr:
        "B6 hücresinde sabit 0.06 ile çarpılmış hatalı bir formül bulunuyor. B6'yı Ortalama Borç ve B5'teki faiz oranını kullanan dinamik formülle yeniden yazın: =((B2+B4)/2)*B5.",
      contextEn:
        "Best practice corporate finance calculates interest expense on the average debt balance throughout the year ((Beginning + Ending) / 2) to account for debt repayments during the period.",
      contextTr:
        "Finansal modelleme standartlarında faiz gideri, yıl içindeki borç geri ödemelerini dikkate almak için ortalama borç bakiyesi üzerinden hesaplanır: ((Dönem Başı + Dönem Sonu) / 2) * Faiz Oranı.",
      dataset: {
        columns: [
          { key: "item", name: "Debt Schedule Line", colLetter: "A" },
          { key: "val", name: "Value ($)", colLetter: "B", type: "number" },
        ],
        rows: [
          { item: "Beginning Debt Balance", val: 200000 },
          { item: "Debt Principal Repayment", val: 50000 },
          { item: "Ending Debt Balance", val: 150000 },
          { item: "Interest Rate Assumption", val: 0.06 },
          { item: "Annual Interest Expense", val: 9000 },
        ],
        hasHeaderRow: true,
      },
      targetCell: "B6",
      initialFormula: "=B4*0.06",
      expectedFormula: "=((B2+B4)/2)*B5",
      expectedResult: 10500,
      requiredDependencies: ["B2", "B4", "B5"],
      forbiddenHardcodes: [0.06, 200000, 150000, 10500],
      assumptionCell: "B5",
      assumptionPerturbation: 0.08,
      expectedPerturbedResult: 14000,
      hintsEn: [
        "Average Debt is (B2 + B4) / 2.",
        "Multiply Average Debt by the interest rate in B5.",
        "Write: =((B2+B4)/2)*B5",
      ],
      hintsTr: [
        "Ortalama Borç: (B2 + B4) / 2.",
        "Ortalama borcu B5'teki faiz oranı ile çarpın.",
        "Yazmanız gereken: =((B2+B4)/2)*B5",
      ],
      explanationEn:
        "Average Debt is ($200,000 + $150,000) / 2 = $175,000. Multiplied by the 6% rate in B5, correct Interest Expense is $10,500 (not $9,000).",
      explanationTr:
        "Ortalama Borç = (200.000 + 150.000) / 2 = 175.000 TL. B5'teki %6 faiz oranı ile çarpıldığında doğru faiz gideri 10.500 TL olur.",
      statementContext: "Integrated",
    },
    {
      id: "fin-ex-solve-04",
      type: "build_formula",
      titleEn: "4. Net PP&E Roll-Forward Schedule",
      titleTr: "4. Net Maddi Duran Varlık Devir Tablosu",
      taskEn:
        "In cell B5, write the roll-forward formula for Ending Net PP&E: =Beginning Net PP&E (B2) + CapEx (B3) - Depreciation (B4).",
      taskTr:
        "B5 hücresine, Dönem Sonu Net Maddi Duran Varlığı hesaplayan devir formülünü yazın: =Dönem Başı Net MDV (B2) + CapEx (B3) - Amortisman (B4).",
      contextEn:
        "Property, Plant & Equipment (PP&E) increases with new investments (CapEx) and decreases with non-cash Depreciation.",
      contextTr:
        "Maddi Duran Varlıklar (PP&E), yeni yatırımlarla (CapEx) büyür ve nakit çıkışı gerektirmeyen Amortisman ile azalır.",
      dataset: {
        columns: [
          { key: "item", name: "PP&E Schedule Item", colLetter: "A" },
          { key: "amount", name: "Amount ($)", colLetter: "B", type: "number" },
        ],
        rows: [
          { item: "Beginning Net PP&E", amount: 450000 },
          { item: "Capital Expenditures (CapEx)", amount: 80000 },
          { item: "Depreciation Expense", amount: 55000 },
          { item: "Ending Net PP&E", amount: null },
        ],
        hasHeaderRow: true,
      },
      targetCell: "B5",
      expectedFormula: "=B2+B3-B4",
      expectedResult: 475000,
      requiredDependencies: ["B2", "B3", "B4"],
      forbiddenHardcodes: [450000, 80000, 55000, 475000],
      assumptionCell: "B3",
      assumptionPerturbation: 100000,
      expectedPerturbedResult: 495000,
      hintsEn: [
        "Add CapEx to Beginning Net PP&E, then subtract Depreciation.",
        "Write: =B2+B3-B4",
      ],
      hintsTr: [
        "Dönem başı net MDV'ye CapEx ekleyin, ardından Amortismanı çıkarın.",
        "Yazın: =B2+B3-B4",
      ],
      explanationEn:
        "Ending Net PP&E = $450,000 + $80,000 - $55,000 = $475,000. This ending value feeds directly into the non-current assets section of the Balance Sheet.",
      explanationTr:
        "Dönem Sonu Net MDV = 450.000 + 80.000 - 55.000 = 475.000 TL. Bu değer Bilançonun Duran Varlıklar grubuna aktarılır.",
      statementContext: "Balance Sheet",
    },
    {
      id: "fin-ex-solve-05",
      type: "build_formula",
      titleEn: "5. Cash Flow from Operations (CFO) Reconciliation",
      titleTr: "5. İşletme Faaliyetlerinden Nakit Akışı Mutabakatı",
      taskEn:
        "In cell B6, calculate Cash Flow from Operations by adding Depreciation (B3), subtracting A/R increase (B4), and adding A/P increase (B5) to Net Income (B2).",
      taskTr:
        "B6 hücresine, Net Kâra (B2) Amortismanı ekleyen (B3), Alacak artışını düşen (B4) ve Borç artışını ekleyen (B5) İşletme Nakit Akışı formülünü yazın.",
      contextEn:
        "Operating Cash Flow reconciles Net Income for non-cash items and changes in operating working capital.",
      contextTr:
        "İşletme Nakit Akışı, muhasebesel Net Kârı gayrinakdi kalemler ve işletme sermayesi değişimleri ile düzelterek gerçek operasyonel nakde ulaşır.",
      dataset: {
        columns: [
          { key: "item", name: "Cash Flow Line", colLetter: "A" },
          { key: "amount", name: "2025 Forecast ($)", colLetter: "B", type: "number" },
        ],
        rows: [
          { item: "Net Income (from P&L)", amount: 110000 },
          { item: "Add: Depreciation Expense (Non-cash)", amount: 35000 },
          { item: "Less: Increase in Accounts Receivable", amount: 20000 },
          { item: "Add: Increase in Accounts Payable", amount: 10000 },
          { item: "Cash Flow from Operations (CFO)", amount: null },
        ],
        hasHeaderRow: true,
      },
      targetCell: "B6",
      expectedFormula: "=B2+B3-B4+B5",
      expectedResult: 135000,
      requiredDependencies: ["B2", "B3", "B4", "B5"],
      forbiddenHardcodes: [110000, 35000, 20000, 10000, 135000],
      assumptionCell: "B4",
      assumptionPerturbation: 30000,
      expectedPerturbedResult: 125000,
      hintsEn: [
        "Net Income + Depreciation - Receivable Increase + Payable Increase.",
        "Write: =B2+B3-B4+B5",
      ],
      hintsTr: [
        "Net Kâr + Amortisman - Alacak Artışı + Borç Artışı.",
        "Yazın: =B2+B3-B4+B5",
      ],
      explanationEn:
        "CFO = $110,000 (Net Income) + $35,000 (D&A) - $20,000 (Cash tied up in A/R) + $10,000 (Cash preserved via A/P) = $135,000.",
      explanationTr:
        "İşletme Nakit Akışı = 110.000 + 35.000 - 20.000 + 10.000 = 135.000 TL olarak gerçekleşir.",
      statementContext: "Cash Flow",
    },
  ],
  testQuestions: [
    {
      id: "fin-q1",
      type: "multiple_choice",
      questionEn: "Which financial statement provides a snapshot of a company's financial condition at a specific point in time?",
      questionTr: "Hangi finansal tablo bir şirketin belirli bir andaki finansal durumunun fotoğrafını sunar?",
      optionsEn: [
        "Income Statement (P&L)",
        "Balance Sheet",
        "Cash Flow Statement",
        "Statement of Retained Earnings",
      ],
      optionsTr: [
        "Gelir Tablosu (P&L)",
        "Bilanço",
        "Nakit Akış Tablosu",
        "Dağıtılmamış Kârlar Tablosu",
      ],
      correctIndex: 1,
      explanationEn: "The Balance Sheet is the only statement measured at a specific date (point in time), whereas the P&L and Cash Flow measure flows over a period.",
      explanationTr: "Bilanço belirli bir tarihteki anlık durumu gösterir; Gelir ve Nakit Akış tabloları ise belirli bir döneme yayılan akışları ölçer.",
    },
    {
      id: "fin-q2",
      type: "interpretation",
      questionEn: "If a company sells $200,000 of goods on 60-day credit, how is Cash Flow from Operations affected at the exact moment of sale?",
      questionTr: "Bir şirket 60 gün vadeli 200.000 TL'lik satış yaptığında, satış anında İşletme Nakit Akışı nasıl etkilenir?",
      optionsEn: [
        "Cash increases immediately by $200,000",
        "Cash Flow is completely unchanged ($0 net impact)",
        "Cash Flow decreases by $200,000",
        "Cash Flow increases by the Gross Margin percentage",
      ],
      optionsTr: [
        "Kasadaki nakit anında 200.000 TL artar",
        "Nakit Akışı tamamen değişmez (0 TL net etki)",
        "Nakit Akışı 200.000 TL azalır",
        "Nakit Akışı brüt kâr marjı oranında artar",
      ],
      correctIndex: 1,
      explanationEn: "On credit sales, Net Income increases by $200K, but Accounts Receivable increases by $200K (a cash outflow adjustment on the cash flow statement), netting to zero immediate cash impact.",
      explanationTr: "Vadeli satışta Gelir Tablosunda net kâr artsa da, Alacaklar 200.000 TL arttığı için nakit akışında düşülür; kasaya giren nakit 0 TL'dir.",
    },
    {
      id: "fin-q3",
      type: "formula_selection",
      questionEn: "Which formula dynamically calculates Ending Retained Earnings on the Balance Sheet roll-forward?",
      questionTr: "Bilançoda Dağıtılmamış Kârları dinamik olarak devreden doğru formül hangisidir?",
      optionsEn: [
        "=Beginning_RE + Net_Income - Dividends",
        "=Beginning_RE - Net_Income + Dividends",
        "=Net_Income * (1 - Tax_Rate)",
        "=Total_Assets - Total_Liabilities",
      ],
      optionsTr: [
        "=Dönem_Başı_DK + Net_Kâr - Temettüler",
        "=Dönem_Başı_DK - Net_Kâr + Temettüler",
        "=Net_Kâr * (1 - Vergi_Oranı)",
        "=Toplam_Varlıklar - Toplam_Borçlar",
      ],
      correctIndex: 0,
      explanationEn: "Ending Retained Earnings = Beginning Retained Earnings + Net Income - Dividends Paid.",
      explanationTr: "Dönem Sonu Dağıtılmamış Kârlar = Dönem Başı + Net Kâr - Dağıtılan Temettüler formülüyle hesaplanır.",
    },
    {
      id: "fin-q4",
      type: "debugging",
      questionEn: "In a financial model, cell C4 contains '=C2 - 350000' where 350000 represents COGS. Why is this model cell flawed?",
      questionTr: "Bir finansal modelde C4 hücresinde '=C2 - 350000' formülü var (350000 SMM'yi temsil ediyor). Bu hücre neden hatalıdır?",
      optionsEn: [
        "Subtraction is not allowed in Excel formulas",
        "Hardcoding 350,000 prevents dynamic scenario updates when operational costs change",
        "It must use the SUM function instead of minus",
        "It violates IFRS tax depreciation guidelines",
      ],
      optionsTr: [
        "Excel formüllerinde çıkarma işlemi kullanılamaz",
        "350.000'in elle sabit yazılması maliyetler değiştiğinde modelin dinamik tepki vermesini engeller",
        "Eksi işareti yerine TOPLA fonksiyonu kullanılmalıdır",
        "UFRS vergi mevzuatına aykırıdır",
      ],
      correctIndex: 1,
      explanationEn: "Hardcoding numbers into calculation formulas destroys model dynamism. The formula should reference the COGS driver cell: '=C2-C3'.",
      explanationTr: "Hesaplama hücrelerine sabit sayı gömmek model dinamizmini bozar. Formül '=C2-C3' şeklinde hücre referansı ile yazılmalıdır.",
    },
    {
      id: "fin-q5",
      type: "interpretation",
      questionEn: "A company reports $50M in Net Income but -$15M in Cash Flow from Operations. What is the most plausible economic explanation?",
      questionTr: "Bir şirket 50M$ Net Kâr açıklarken İşletme Nakit Akışı -15M$ negatif çıkmıştır. En olası açıklama nedir?",
      optionsEn: [
        "The company paid off all its long-term bank loans",
        "Rapid revenue growth led to massive uncollected customer receivables and unsold inventory accumulation",
        "The company purchased a new factory with cash",
        "The accounting department forgot to record depreciation",
      ],
      optionsTr: [
        "Şirket tüm uzun vadeli banka kredilerini defaten ödemiştir",
        "Hızlı satış büyümesi sebebiyle müşterilerden alacaklar tahsil edilememiş ve devasa stok birikmiştir",
        "Şirket nakit parayla yeni bir fabrika satın almıştır",
        "Muhasebe departmanı amortisman kaydetmeyi unutmuştur",
      ],
      correctIndex: 1,
      explanationEn: "Working capital expansion (uncollected receivables and inventory buildup) absorbs massive amounts of cash, causing cash flow to turn negative despite paper accounting profit.",
      explanationTr: "İşletme sermayesinin genişlemesi (ödenmeyen alacaklar ve stok birikimi) büyük miktarda nakit emer; kâğıt üzerinde kâr varken kasadaki nakit erir.",
    },
    {
      id: "fin-q6",
      type: "model_linking",
      questionEn: "Where does the Ending Cash balance from the Cash Flow Statement link on the Balance Sheet?",
      questionTr: "Nakit Akış Tablosunun en altındaki Dönem Sonu Nakit bakiyesi Bilançoda nereye bağlanır?",
      optionsEn: [
        "Directly to Retained Earnings in Shareholders' Equity",
        "To Cash & Cash Equivalents in Current Assets",
        "To Short-Term Debt in Current Liabilities",
        "It does not link to the Balance Sheet",
      ],
      optionsTr: [
        "Doğrudan Özkaynaklardaki Dağıtılmamış Kârlara",
        "Dönen Varlıklardaki Hazır Değerler / Kasa ve Bankalar satırına",
        "Kısa Vadeli Borçlardaki Banka Kredileri satırına",
        "Bilançoya hiçbir şekilde bağlanmaz",
      ],
      correctIndex: 1,
      explanationEn: "Ending Cash from the Cash Flow Statement plugs into the Cash & Cash Equivalents line in Current Assets, closing the three-statement loop.",
      explanationTr: "Nakit Akış Tablosunun sonundaki nakit, Bilançoda Dönen Varlıklar altındaki Kasa ve Banka satırına bağlanarak döngüyü tamamlar.",
    },
    {
      id: "fin-q7",
      type: "multiple_choice",
      questionEn: "Why is Depreciation added back to Net Income when constructing the Cash Flow Statement?",
      questionTr: "Nakit Akış Tablosu hazırlanırken Amortisman neden Net Kâra geri eklenir?",
      optionsEn: [
        "Because it is a non-cash expense that reduced accounting profit without any cash leaving the bank",
        "Because depreciation represents incoming cash from suppliers",
        "Because the government reimburses companies for depreciation",
        "To increase executive bonus payouts",
      ],
      optionsTr: [
        "Çünkü kasadan nakit çıkışı gerektirmeyen, sadece muhasebesel kârı azaltan gayrinakdi bir giderdir",
        "Çünkü amortisman tedarikçilerden gelen nakit girişini temsil eder",
        "Çünkü devlet amortisman tutarını nakit olarak şirkete iade eder",
        "Yönetici primlerini yüksek göstermek için",
      ],
      correctIndex: 0,
      explanationEn: "Depreciation reduces Net Income on the P&L for tax and matching purposes, but no cash actually leaves the company. Therefore, it must be added back to determine true cash generated.",
      explanationTr: "Amortisman Gelir Tablosunda kârı azaltır ancak şirketin banka hesabından tek bir kuruş bile çıkmaz. Bu nedenle gerçek nakdi bulmak için geri eklenir.",
    },
    {
      id: "fin-q8",
      type: "model_linking",
      questionEn: "If Net Income increases by $100 and no dividends are distributed, how does the fundamental accounting equation (Assets = Liabilities + Equity) maintain equilibrium?",
      questionTr: "Net Kâr 100 TL artarsa ve hiç temettü ödenmezse, temel muhasebe denkliği (Aktif = Pasif) nasıl dengede kalır?",
      optionsEn: [
        "Equity increases by $100 (via Retained Earnings) and Assets increase by $100 (via Cash)",
        "Liabilities increase by $100 and Equity decreases by $100",
        "Assets decrease by $100 and Liabilities increase by $100",
        "Only the Income Statement changes; the Balance Sheet is unaffected",
      ],
      optionsTr: [
        "Özkaynaklar 100 TL artar (Dağıtılmamış Kârlar ile) ve Varlıklar 100 TL artar (Kasadaki Nakit ile)",
        "Yabancı Kaynaklar 100 TL artar, Özkaynaklar 100 TL azalır",
        "Varlıklar 100 TL azalır, Yabancı Kaynaklar 100 TL artar",
        "Yalnızca Gelir Tablosu değişir; Bilanço bundan etkilenmez",
      ],
      correctIndex: 0,
      explanationEn: "Net Income flows to Retained Earnings (increasing Equity by $100). That same $100 flows through CFO to ending cash (increasing Assets by $100). Both sides expand equally by $100.",
      explanationTr: "Net kâr Özkaynakları 100 TL artırır; nakit akışı üzerinden de Kasayı 100 TL artırır. Aktif ve Pasif eşit şekilde 100 TL büyüyerek denk kalır.",
    },
    {
      id: "fin-q9",
      type: "formula_selection",
      questionEn: "Which formula correctly computes the Gross Profit Margin percentage?",
      questionTr: "Brüt Kâr Marjı yüzdesini doğru hesaplayan formül hangisidir?",
      optionsEn: [
        "=Gross_Profit / Sales_Revenue",
        "=COGS / Sales_Revenue",
        "=Net_Income / Total_Assets",
        "=Gross_Profit * (1 - Tax_Rate)",
      ],
      optionsTr: [
        "=Brüt_Kâr / Satış_Hasılatı",
        "=SMM / Satış_Hasılatı",
        "=Net_Kâr / Toplam_Varlıklar",
        "=Brüt_Kâr * (1 - Vergi_Oranı)",
      ],
      correctIndex: 0,
      explanationEn: "Gross Profit Margin = Gross Profit / Sales Revenue. It reveals what percentage of revenue remains after direct manufacturing/merchandise costs.",
      explanationTr: "Brüt Kâr Marjı = Brüt Kâr / Hasılat. Satışların doğrudan ürün maliyetinden sonra yüzde kaç kâr bıraktığını gösterir.",
    },
    {
      id: "fin-q10",
      type: "debugging",
      questionEn: "When testing a model under a recession scenario, the analyst changes the Sales Growth Rate from 15% to -5%, but Total Revenue in 2025 does not change. What is the cause of this bug?",
      questionTr: "Modeli resesyon senaryosunda test eden analist Büyüme Oranını %15'ten -%5'e düşürür fakat 2025 Hasılatı hiç değişmez. Bu hatanın sebebi nedir?",
      optionsEn: [
        "The Revenue cell contains a hardcoded static value instead of a dynamic formula linked to the growth assumption cell",
        "Excel does not support negative growth rates",
        "Recessions cannot be modeled in spreadsheets",
        "The computer's memory is overloaded",
      ],
      optionsTr: [
        "Hasılat hücresinde büyüme varsayımı hücresine bağlı formül yerine elle yazılmış sabit bir sayı bulunmaktadır",
        "Excel negatif büyüme oranlarını desteklemez",
        "Ekonomik krizler tablolarda modellenemez",
        "Bilgisayarın bellek kapasitesi yetersiz kalmıştır",
      ],
      correctIndex: 0,
      explanationEn: "If changing an assumption cell produces zero change in output, the output is hardcoded or disconnected from its upstream driver.",
      explanationTr: "Varsayım hücresi değiştiğinde sonuç değişmiyorsa, sonuç hücresine elle sabit sayı yazılmıştır veya formül bağlantısı kopuktur.",
    },
  ],
  project: {
    id: "fin-proj-01",
    titleEn: "Capstone Mini Project: Nordic Retail Co. 3-Statement Model",
    titleTr: "Bitirme Projesi: Nordic Retail Co. 3-Tablolu Entegre Model",
    companyName: "Nordic Retail Co.",
    industryEn: "Specialty Consumer Apparel & Footwear",
    industryTr: "Tüketici Giyim ve Ayakkabı Perakendesi",
    scenarioEn:
      "Nordic Retail Co. is preparing its FY2025 financial model. You have been given raw trial balance accounts and key operational assumptions. Your task is to classify accounts, calculate dynamic P&L figures, roll forward Retained Earnings, verify Balance Sheet equilibrium, and interpret why operating cash differs from net income.",
    scenarioTr:
      "Nordic Retail Co. 2025 yılı finansal modelini hazırlamaktadır. Size şirketin mizan hesapları ve temel operasyonel varsayımları verilmiştir. Göreviniz hesapları sınıflandırmak, dinamik P&L formüllerini kurmak, Dağıtılmamış Kârları devretmek, Bilanço denkliğini sağlamak ve kâr ile nakit arasındaki farkı analiz etmektir.",
    dataset: {
      columns: [
        { key: "item", name: "Model Line Item", colLetter: "A" },
        { key: "act2024", name: "2024 Actual", colLetter: "B", type: "number" },
        { key: "fc2025", name: "2025 Forecast", colLetter: "C", type: "number" },
      ],
      rows: [
        { item: "Revenue Growth Rate", act2024: "-", fc2025: 0.15 },
        { item: "Sales Revenue", act2024: 1000000, fc2025: null },
        { item: "Cost of Goods Sold (COGS)", act2024: 600000, fc2025: 690000 },
        { item: "Gross Profit", act2024: 400000, fc2025: null },
        { item: "Operating Expenses (SG&A)", act2024: 220000, fc2025: 250000 },
        { item: "Operating Income (EBIT)", act2024: 180000, fc2025: null },
        { item: "Interest & Taxes (30%)", act2024: 54000, fc2025: null },
        { item: "Net Income", act2024: 126000, fc2025: null },
      ],
      hasHeaderRow: true,
    },
    classificationItems: [
      { id: "c1", accountEn: "Accounts Receivable", accountTr: "Ticari Alacaklar", amount: 180000, correctStatement: "balance_sheet" },
      { id: "c2", accountEn: "Cost of Goods Sold", accountTr: "Satılan Malların Maliyeti", amount: 690000, correctStatement: "income_statement" },
      { id: "c3", accountEn: "Capital Expenditures (CapEx)", accountTr: "Yatırım Harcamaları (CapEx)", amount: 75000, correctStatement: "cash_flow" },
      { id: "c4", accountEn: "Common Share Capital", accountTr: "Ödenmiş Sermaye", amount: 300000, correctStatement: "balance_sheet" },
      { id: "c5", accountEn: "Store Rental Expenses", accountTr: "Mağaza Kira Giderleri", amount: 95000, correctStatement: "income_statement" },
      { id: "c6", accountEn: "Bank Loan Repayment", accountTr: "Banka Kredi Geri Ödemesi", amount: 40000, correctStatement: "cash_flow" },
    ],
    steps: [
      {
        stepId: "step-1-classification",
        stepNumber: 1,
        titleEn: "Step 1: Trial Balance Account Classification",
        titleTr: "1. Adım: Mizan Hesaplarını Sınıflandırma",
        instructionEn: "Classify each account into its correct financial statement: Income Statement, Balance Sheet, or Cash Flow Statement.",
        instructionTr: "Verilen hesapları ait oldukları doğru finansal tabloya yerleştirin: Gelir Tablosu, Bilanço veya Nakit Akış Tablosu.",
        type: "classification",
        hintEn: "Think whether the account measures a periodic expense/revenue, an asset/liability, or cash flow activity.",
        hintTr: "Hesabın dönemsel kâr/zarar, anlık varlık/borç veya nakit hareketi olup olmadığını değerlendirin.",
      },
      {
        stepId: "step-2-revenue-forecast",
        stepNumber: 2,
        titleEn: "Step 2: 2025 Revenue & Gross Profit Forecast",
        titleTr: "2. Adım: 2025 Hasılat ve Brüt Kâr Tahmini",
        instructionEn: "In cell C3, calculate 2025 Revenue using 2024 Revenue (B3) and Growth Rate (C2): =B3*(1+C2). Then calculate Gross Profit in C5 (with 60% COGS margin): =C3-C4.",
        instructionTr: "C3 hücresinde 2025 Hasılatını hesaplayın: =B3*(1+C2). Ardından C5'te Brüt Kârı hesaplayın: =C3-C4.",
        type: "formula",
        targetCell: "C3",
        expectedResult: 1150000,
        requiredDependencies: ["B3", "C2"],
        hintEn: "Multiply baseline revenue B3 by (1 + C2).",
        hintTr: "B3'teki baz hasılatı (1 + C2) ile çarpın.",
      },
      {
        stepId: "step-3-retained-earnings",
        stepNumber: 3,
        titleEn: "Step 3: Equity & Retained Earnings Roll-Forward",
        titleTr: "3. Adım: Özkaynaklar ve Dağıtılmamış Kârlar Devri",
        instructionEn: "Calculate Ending Retained Earnings: Beginning RE ($210,000) + Net Income ($147,000) - Dividends ($35,000).",
        instructionTr: "Dönem Sonu Dağıtılmamış Kârları hesaplayın: Dönem Başı (210.000 TL) + Net Kâr (147.000 TL) - Temettüler (35.000 TL).",
        type: "formula",
        expectedResult: 322000,
        hintEn: "=210000 + 147000 - 35000 = 322000",
        hintTr: "=210000 + 147000 - 35000 = 322000",
      },
      {
        stepId: "step-4-balance-check",
        stepNumber: 4,
        titleEn: "Step 4: Balance Sheet Equilibrium Verification",
        titleTr: "4. Adım: Bilanço Denge Doğrulaması",
        instructionEn: "Verify that Total Assets ($850,000) minus Total Liabilities ($228,000) and Total Equity ($622,000) equals zero.",
        instructionTr: "Toplam Varlıklar (850.000 TL) eksi Toplam Borçlar (228.000 TL) ve Toplam Özkaynakların (622.000 TL) tam sıfıra eşit olduğunu doğrulayın.",
        type: "balance_check",
        expectedResult: 0,
        hintEn: "Total Assets - (Total Liabilities + Total Equity) = 0",
        hintTr: "Toplam Varlıklar - (Toplam Borçlar + Toplam Özkaynaklar) = 0",
      },
      {
        stepId: "step-5-interpretation",
        stepNumber: 5,
        titleEn: "Step 5: Executive Financial Interpretation",
        titleTr: "5. Adım: Yönetici Düzeyinde Finansal Yorum",
        instructionEn: "Nordic Retail generated $147,000 in Net Income, but its net cash only increased by $45,000. Select the correct primary driver explaining this discrepancy.",
        instructionTr: "Nordic Retail 147.000 TL Net Kâr üretmesine rağmen kasasındaki nakit sadece 45.000 TL artmıştır. Bu farkı açıklayan temel sebebi seçin.",
        type: "interpretation",
        optionsEn: [
          "The company experienced large cash drains from inventory purchases and new store CapEx investments",
          "The CFO miscalculated taxes on the income statement",
          "Customers paid 100% upfront in cash, inflating the bank balance",
          "Depreciation was an outflow of physical banknotes",
        ],
        optionsTr: [
          "Şirket artan satışlar için stok yatırımı yapmış ve yeni mağaza yatırımlarına (CapEx) nakit bağlamıştır",
          "Mali işler müdürü vergi hesaplamasında aritmetik hata yapmıştır",
          "Müşteriler tüm ödemeleri peşin yapmış ve kasayı şişirmiştir",
          "Amortisman kasadan fiziksel kâğıt para çıkışına yol açmıştır",
        ],
        correctOptionIndex: 0,
        hintEn: "Remember that CapEx and working capital investments absorb cash without appearing immediately on the P&L.",
        hintTr: "CapEx ve işletme sermayesi yatırımlarının Gelir Tablosunda anında görünmeden nakit tükettiğini unutmayın.",
      },
    ],
  },
};
