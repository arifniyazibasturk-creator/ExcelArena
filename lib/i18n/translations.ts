import { InterfaceLocale } from "./types";

export interface TranslationStrings {
  common: {
    appName: string;
    tagline: string;
    continue: string;
    back: string;
    next: string;
    previous: string;
    submit: string;
    checkFormula: string;
    tryAgain: string;
    needHint: string;
    hint: string;
    reset: string;
    close: string;
    loading: string;
    copy: string;
    copied: string;
    completed: string;
    active: string;
    locked: string;
    available: string;
    mastered: string;
    accuracy: string;
    streak: string;
    bestStreak: string;
    solved: string;
    totalMastery: string;
  };
  nav: {
    dashboard: string;
    arena: string;
    levels: string;
    profile: string;
    settings: string;
    progress: string;
  };
  dashboard: {
    title: string;
    continueTraining: string;
    recommendedTopic: string;
    overallProgress: string;
    masteryOverview: string;
    recentActivity: string;
    levelRoadmap: string;
    jumpIn: string;
    allLevelsMastered: string;
    statsSummary: string;
    accuracyRate: string;
    challengesCount: string;
    streakCount: string;
  };
  stages: {
    learn: string;
    practice: string;
    test: string;
    solve: string;
    stageLabel: string;
    stage1Desc: string;
    stage2Desc: string;
    stage3Desc: string;
    stage4Desc: string;
  };
  learnStage: {
    problemTitle: string;
    reasoningQuestion: string;
    showFormula: string;
    conceptBreakdown: string;
    formulaAnatomy: string;
    anatomyTip: string;
    readyForPractice: string;
    stepExplanation: string;
    conceptCheckTitle: string;
    conceptCheckAnswer: string;
    showConceptCheck: string;
    hideConceptCheck: string;
    datasetTitle: string;
    syntaxTitle: string;
  };
  practiceStage: {
    taskTitle: string;
    taskHeaderPrefix: string;
    datasetTitle: string;
    writeFormulaTitle: string;
    formulaInputHint: string;
    formulaInputPlaceholder: string;
    checking: string;
    correctTitle: string;
    correctMessage: string;
    incorrectTitle: string;
    incorrectMessage: string;
    nextChallenge: string;
    syntaxError: string;
    hardcodedWarning: string;
    expectedResult: string;
    yourResult: string;
    formulaEvaluatorBadge: string;
  };
  testStage: {
    title: string;
    subtitle: string;
    questionOf: string;
    selectFormula: string;
    debugFormula: string;
    predictOutput: string;
    orderFormula: string;
    matchScenario: string;
    dragOrClick: string;
    selectedOrder: string;
    clearBlocks: string;
    testComplete: string;
    scoreResult: string;
    passedBadge: string;
    retryTest: string;
    continueToSolve: string;
  };
  solveStage: {
    title: string;
    subtitle: string;
    scenarioTitle: string;
    largeDatasetNotice: string;
    solveTask: string;
    submitSolution: string;
    solvedTitle: string;
    solvedMessage: string;
    topicMastered: string;
    nextTopic: string;
    equivalentFormulaAccepted: string;
    datasetTitle: string;
  };
  table: {
    rows: string;
    columns: string;
    searchPlaceholder: string;
    showingRows: string;
    datasetLabel: string;
  };
  hints: {
    hintTitle: string;
    level: string;
    noMoreHints: string;
    requestNextHint: string;
    aiGeneratedBadge: string;
  };
  profile: {
    title: string;
    userTitle: string;
    overallStats: string;
    topicSkills: string;
    streakRecord: string;
    accuracyStats: string;
    resetProgress: string;
    resetConfirm: string;
  };
  settings: {
    title: string;
    interfaceLanguage: string;
    interfaceLanguageDesc: string;
    formulaLanguage: string;
    formulaLanguageDesc: string;
    autoFormulaDesc: string;
    appearance: string;
    appearanceDesc: string;
    themeLight: string;
    themeDark: string;
    themeSystem: string;
    dangerZone: string;
    resetData: string;
    resetDataDesc: string;
    savedToast: string;
  };
}

export const TRANSLATIONS: Record<InterfaceLocale, TranslationStrings> = {
  en: {
    common: {
      appName: "Excel Arena",
      tagline: "Master Excel Through Practical Challenges",
      continue: "Continue",
      back: "Back",
      next: "Next",
      previous: "Previous",
      submit: "Submit",
      checkFormula: "Check Formula",
      tryAgain: "Try Again",
      needHint: "Need a Hint",
      hint: "Hint",
      reset: "Reset",
      close: "Close",
      loading: "Loading...",
      copy: "Copy",
      copied: "Copied!",
      completed: "Completed",
      active: "Active",
      locked: "Locked",
      available: "Available",
      mastered: "Mastered",
      accuracy: "Accuracy",
      streak: "Current Streak",
      bestStreak: "Best Streak",
      solved: "Challenges Solved",
      totalMastery: "Overall Mastery",
    },
    nav: {
      dashboard: "Dashboard",
      arena: "Arena",
      levels: "Levels",
      profile: "Profile",
      settings: "Settings",
      progress: "Progress",
    },
    dashboard: {
      title: "Excel Arena",
      continueTraining: "Continue Training",
      recommendedTopic: "Recommended for You",
      overallProgress: "Your Progress",
      masteryOverview: "Mastery Overview",
      recentActivity: "Recent Challenges",
      levelRoadmap: "Arena Roadmap",
      jumpIn: "Start Training",
      allLevelsMastered: "Outstanding! All available topics mastered.",
      statsSummary: "Summary Metrics",
      accuracyRate: "Accuracy",
      challengesCount: "Challenges Solved",
      streakCount: "Day Streak",
    },
    stages: {
      learn: "Learn",
      practice: "Practice",
      test: "Test",
      solve: "Solve",
      stageLabel: "Stage",
      stage1Desc: "Understand the concept & reasoning",
      stage2Desc: "Hands-on formula writing with feedback",
      stage3Desc: "Fast recognition & debugging challenges",
      stage4Desc: "Real-world dataset problem solving",
    },
    learnStage: {
      problemTitle: "The Problem",
      reasoningQuestion: "How should we think about this?",
      showFormula: "Reveal Formula Solution",
      conceptBreakdown: "How It Works",
      formulaAnatomy: "Interactive Formula Anatomy",
      anatomyTip: "Hover over each argument to highlight its position and purpose in the formula.",
      readyForPractice: "Start Practice Stage",
      stepExplanation: "Reasoning Step",
      conceptCheckTitle: "CONCEPT CHECK",
      conceptCheckAnswer: "Explanation",
      showConceptCheck: "Show Conceptual Check",
      hideConceptCheck: "Hide",
      datasetTitle: "SPREADSHEET DATASET",
      syntaxTitle: "FORMULA SYNTAX",
    },
    practiceStage: {
      taskTitle: "TASK DEFINITION",
      taskHeaderPrefix: "TASK DEFINITION",
      datasetTitle: "SPREADSHEET DATASET",
      writeFormulaTitle: "WRITE YOUR FORMULA",
      formulaInputHint: 'Type your formula below starting with "="',
      formulaInputPlaceholder: "e.g. =SUM(B2:B6)...",
      checking: "Evaluating formula...",
      correctTitle: "CORRECT",
      correctMessage: "Your formula produces the expected result and matches the required logic.",
      incorrectTitle: "NOT QUITE",
      incorrectMessage: "Your formula does not satisfy the required condition.",
      nextChallenge: "Next Challenge",
      syntaxError: "Syntax Error: Please check parentheses and argument separators.",
      hardcodedWarning: "Formula must reference cells or ranges, not hardcoded constant numbers.",
      expectedResult: "Expected Result",
      yourResult: "Your Formula Output",
      formulaEvaluatorBadge: "Deterministic Engine",
    },
    testStage: {
      title: "Speed & Recognition Test",
      subtitle: "Quick challenges to test your syntax, recognition, and debugging skills.",
      questionOf: "Question",
      selectFormula: "Select the correct formula for this requirement:",
      debugFormula: "Find and fix the error in the given formula:",
      predictOutput: "Predict the output of the following formula on the dataset:",
      orderFormula: "Arrange the formula blocks in the correct order:",
      matchScenario: "Which Excel function best fits this business scenario?",
      dragOrClick: "Click blocks to arrange the formula syntax:",
      selectedOrder: "Your Formula Structure:",
      clearBlocks: "Clear",
      testComplete: "Test Complete",
      scoreResult: "Score",
      passedBadge: "Passed!",
      retryTest: "Retake Test",
      continueToSolve: "Continue to Solve Stage",
    },
    solveStage: {
      title: "Mastery Challenge",
      subtitle: "Solve an unguided real-world business case using any valid equivalent formula.",
      scenarioTitle: "Business Scenario",
      largeDatasetNotice: "Production-grade dataset (scroll to inspect data)",
      solveTask: "Objective",
      submitSolution: "Submit Solution",
      solvedTitle: "CHALLENGE SOLVED",
      solvedMessage: "Excellent! Your solution successfully satisfied all problem constraints.",
      topicMastered: "Topic Mastery Completed!",
      nextTopic: "Proceed to Next Topic",
      equivalentFormulaAccepted: "Logically equivalent formulas are accepted.",
      datasetTitle: "SPREADSHEET DATASET",
    },
    table: {
      rows: "rows",
      columns: "cols",
      searchPlaceholder: "Search dataset...",
      showingRows: "Showing",
      datasetLabel: "SPREADSHEET DATASET",
    },
    hints: {
      hintTitle: "Progressive Hint",
      level: "Level",
      noMoreHints: "All hints revealed.",
      requestNextHint: "Get More Specific Hint",
      aiGeneratedBadge: "Contextual Hint",
    },
    profile: {
      title: "Player Profile",
      userTitle: "Excel Arena Practitioner",
      overallStats: "Performance Analytics",
      topicSkills: "Mastery Breakdown by Topic",
      streakRecord: "Consistency & Streaks",
      accuracyStats: "Formula Accuracy Rate",
      resetProgress: "Reset All Progress",
      resetConfirm: "Are you sure you want to reset all your progress data?",
    },
    settings: {
      title: "Settings & Preferences",
      interfaceLanguage: "Interface Language",
      interfaceLanguageDesc: "Choose the language for menus, instructions, and explanations.",
      formulaLanguage: "Excel Formula Language",
      formulaLanguageDesc: "Select whether formula syntax uses English (=SUM) or Turkish (=TOPLA) function names.",
      autoFormulaDesc: "Auto (Matches Interface Language)",
      appearance: "Appearance",
      appearanceDesc: "Select interface color scheme.",
      themeLight: "Light",
      themeDark: "Dark",
      themeSystem: "System Default",
      dangerZone: "Data Management",
      resetData: "Clear Local Progress",
      resetDataDesc: "Reset all topic completions, test scores, and streak history stored in this browser.",
      savedToast: "Preferences saved successfully.",
    },
  },
  tr: {
    common: {
      appName: "Excel Arena",
      tagline: "Problemleri Çözerek Excel'de Ustalaşın",
      continue: "Devam Et",
      back: "Geri",
      next: "İleri",
      previous: "Önceki",
      submit: "Gönder",
      checkFormula: "Formülü Kontrol Et",
      tryAgain: "Tekrar Dene",
      needHint: "İpucu İste",
      hint: "İpucu",
      reset: "Sıfırla",
      close: "Kapat",
      loading: "Yükleniyor...",
      copy: "Kopyala",
      copied: "Kopyalandı!",
      completed: "Tamamlandı",
      active: "Aktif",
      locked: "Kilitli",
      available: "Erişilebilir",
      mastered: "Ustalaşıldı",
      accuracy: "Doğruluk",
      streak: "Mevcut Seri",
      bestStreak: "En İyi Seri",
      solved: "Çözülen Problem",
      totalMastery: "Genel Ustalık",
    },
    nav: {
      dashboard: "Ana Sayfa",
      arena: "Arena",
      levels: "Seviyeler",
      profile: "Profil",
      settings: "Ayarlar",
      progress: "İlerleme",
    },
    dashboard: {
      title: "Excel Arena",
      continueTraining: "Eğitime Devam Et",
      recommendedTopic: "Sizin İçin Önerilen",
      overallProgress: "İlerlemeniz",
      masteryOverview: "Ustalık Genel Bakışı",
      recentActivity: "Son Çalışmalar",
      levelRoadmap: "Arena Yol Haritası",
      jumpIn: "Eğitime Başla",
      allLevelsMastered: "Tebrikler! Mevcut tüm konular tamamlandı.",
      statsSummary: "Özet İstatistikler",
      accuracyRate: "Doğruluk Oranı",
      challengesCount: "Çözülen Meydan Okumalar",
      streakCount: "Günlük Seri",
    },
    stages: {
      learn: "Öğren",
      practice: "Pratik",
      test: "Test",
      solve: "Çöz",
      stageLabel: "Aşama",
      stage1Desc: "Mantığı ve düşünme adımlarını kavrayın",
      stage2Desc: "Anında geri bildirimle formül yazma",
      stage3Desc: "Hızlı tanıma ve hata ayıklama soruları",
      stage4Desc: "Gerçek iş senaryoları ve serbest çözüm",
    },
    learnStage: {
      problemTitle: "Problem",
      reasoningQuestion: "Bu probleme nasıl yaklaşmalıyız?",
      showFormula: "Formül Çözümünü Göster",
      conceptBreakdown: "Nasıl Çalışır?",
      formulaAnatomy: "İnteraktif Formül Anatomisi",
      anatomyTip: "Formülün parçalarını ve tabloda karşılık geldiği alanları görmek için üzerlerine gelin.",
      readyForPractice: "Pratik Aşamasına Geç",
      stepExplanation: "Düşünce Adımı",
      conceptCheckTitle: "MANTIK SINAMASI",
      conceptCheckAnswer: "Açıklama",
      showConceptCheck: "Mantık Sınamasını Göster",
      hideConceptCheck: "Gizle",
      datasetTitle: "ELEKTRONİK TABLO VERİ SETİ",
      syntaxTitle: "FORMÜL SÖZDİZİMİ",
    },
    practiceStage: {
      taskTitle: "GÖREV TANIMI",
      taskHeaderPrefix: "GÖREV TANIMI",
      datasetTitle: "ELEKTRONİK TABLO VERİ SETİ",
      writeFormulaTitle: "FORMÜLÜNÜZÜ YAZIN",
      formulaInputHint: '"=" ile başlayan formülünüzü aşağıya yazın',
      formulaInputPlaceholder: "örn. =TOPLA(B2:B6)...",
      checking: "Formül değerlendiriliyor...",
      correctTitle: "DOĞRU",
      correctMessage: "Formülünüz beklenen sonucu üretiyor.",
      incorrectTitle: "TAM DEĞİL",
      incorrectMessage: "Formülünüz gerekli koşulu karşılamıyor.",
      nextChallenge: "Sonraki Alıştırma",
      syntaxError: "Sözdizimi Hatası: Lütfen parantezleri ve noktalı virgül (;) ayırıcılarını kontrol edin.",
      hardcodedWarning: "Formül doğrudan sabit sayı değil, hücre veya aralık referansı içermelidir.",
      expectedResult: "Beklenen Sonuç",
      yourResult: "Formülünüzün Çıktısı",
      formulaEvaluatorBadge: "Deterministik Motor",
    },
    testStage: {
      title: "Hız & Tanıma Testi",
      subtitle: "Sözdizimi, hata ayıklama ve formül tanıma becerilerinizi ölçün.",
      questionOf: "Soru",
      selectFormula: "Bu gereksinim için hangi formül uygundur?",
      debugFormula: "Verilen formüldeki hatayı bulun ve düzeltin:",
      predictOutput: "Aşağıdaki formülün tabloda üreteceği sonucu tahmin edin:",
      orderFormula: "Formül parçalarını doğru sıraya dizin:",
      matchScenario: "Bu iş senaryosuna en uygun Excel fonksiyonu hangisidir?",
      dragOrClick: "Parçalara tıklayarak formülü sırasıyla oluşturun:",
      selectedOrder: "Oluşturulan Formül Dizilimi:",
      clearBlocks: "Temizle",
      testComplete: "Test Tamamlandı",
      scoreResult: "Sonuç",
      passedBadge: "Başarılı!",
      retryTest: "Testi Tekrar Çöz",
      continueToSolve: "Çözüm Aşamasına Geç",
    },
    solveStage: {
      title: "Ustalık Meydan Okuması",
      subtitle: "İpucu olmadan, büyük bir iş veri setinde mantıksal olarak geçerli herhangi bir formülle sonuca ulaşın.",
      scenarioTitle: "İş Senaryosu",
      largeDatasetNotice: "Kapsamlı veri seti (verileri incelemek için kaydırın)",
      solveTask: "Görev",
      submitSolution: "Çözümü Gönder",
      solvedTitle: "TEBRİKLER, ÇÖZÜLDÜ!",
      solvedMessage: "Harika! Çözümünüz senaryodaki tüm koşulları başarıyla karşıladı.",
      topicMastered: "Konu Ustalığı Tamamlandı!",
      nextTopic: "Sonraki Konuya Geç",
      equivalentFormulaAccepted: "Mantıksal olarak doğru sonuç üreten eşdeğer formüller kabul edilir.",
      datasetTitle: "ELEKTRONİK TABLO VERİ SETİ",
    },
    table: {
      rows: "satır",
      columns: "sütun",
      searchPlaceholder: "Veri setinde ara...",
      showingRows: "Gösterilen",
      datasetLabel: "ELEKTRONİK TABLO VERİ SETİ",
    },
    hints: {
      hintTitle: "Aşamalı İpucu",
      level: "Aşama",
      noMoreHints: "Tüm ipuçları gösterildi.",
      requestNextHint: "Daha Ayrıntılı İpucu Al",
      aiGeneratedBadge: "Akıllı İpucu",
    },
    profile: {
      title: "Kullanıcı Profili",
      userTitle: "Excel Arena Öğrencisi",
      overallStats: "Performans Analizi",
      topicSkills: "Konu Bazlı Ustalık Durumu",
      streakRecord: "İstikrar ve Seri",
      accuracyStats: "Formül Doğruluk Oranı",
      resetProgress: "Tüm İlerlemeyi Sıfırla",
      resetConfirm: "Tüm ilerleme verilerinizi sıfırlamak istediğinize emin misiniz?",
    },
    settings: {
      title: "Ayarlar ve Tercihler",
      interfaceLanguage: "Arayüz Dili",
      interfaceLanguageDesc: "Menüler, açıklamalar ve talimatlar için dil seçin.",
      formulaLanguage: "Excel Formül Dili",
      formulaLanguageDesc: "Formül yazarken İngilizce (=SUM) veya Türkçe (=TOPLA) fonksiyon adlarının kullanımını belirleyin.",
      autoFormulaDesc: "Otomatik (Arayüz Dili ile Uyumlu)",
      appearance: "Görünüm",
      appearanceDesc: "Arayüz tema modunu belirleyin.",
      themeLight: "Açık",
      themeDark: "Koyu",
      themeSystem: "Sistem Varsayılanı",
      dangerZone: "Veri Yönetimi",
      resetData: "Tarayıcı Verilerini Sıfırla",
      resetDataDesc: "Tamamlanan konuları, test puanlarını ve seri geçmişini bu tarayıcıdan temizleyin.",
      savedToast: "Tercihleriniz başarıyla kaydedildi.",
    },
  },
};
