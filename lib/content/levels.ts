import { LevelDefinition, TopicContent } from "./types";
import { LEVEL_01_TOPICS } from "./topics/level01-foundations";
import { LEVEL_02_TOPICS } from "./topics/level02-logic";
import { LEVEL_03_TOPICS } from "./topics/level03-conditionals";
import { LEVEL_04_TOPICS } from "./topics/level04-text";
import { LEVEL_05_TOPICS } from "./topics/level05-lookup";
import { LEVEL_06_TOPICS } from "./topics/level06-data-analysis";

export const LEVELS: LevelDefinition[] = [
  {
    id: "level-01",
    number: 1,
    code: "01",
    titleEn: "Excel Foundations",
    titleTr: "Excel Temelleri",
    descriptionEn: "Master cell references, relative & absolute references, basic arithmetic operators, essential aggregations, percentages, and date/time.",
    descriptionTr: "Hücre referansları, göreceli ve mutlak başvurular, temel operatörler, toplulaştırma fonksiyonları, yüzdeler ve tarih/saat fonksiyonlarını öğrenin.",
    iconName: "Binary",
    topics: LEVEL_01_TOPICS,
    isLocked: false,
  },
  {
    id: "level-02",
    number: 2,
    code: "02",
    titleEn: "Logic & Branching",
    titleTr: "Mantık ve Karar Yapıları",
    descriptionEn: "Build dynamic logical rules using IF, IFS, AND, OR, NOT, nested IFs, and compound condition evaluations.",
    descriptionTr: "EĞER, ÇOKEĞER, VE, YADA, DEĞİL, iç içe EĞER ve birleşik koşullarla dinamik karar kuralları oluşturun.",
    iconName: "GitFork",
    topics: LEVEL_02_TOPICS,
    isLocked: false,
  },
  {
    id: "level-03",
    number: 3,
    code: "03",
    titleEn: "Conditional Functions",
    titleTr: "Koşullu Fonksiyonlar",
    descriptionEn: "Aggregate data conditionally across single and multi-criteria ranges (COUNTIF, SUMIF, AVERAGEIF, COUNTIFS, SUMIFS, AVERAGEIFS, Wildcards).",
    descriptionTr: "Tekli ve çoklu ölçüt aralıklarında verileri koşullu olarak toplayın, sayın ve ortalamasını alın (EĞERSAY, ETOPLA, EĞERORTALAMA, ÇOKEĞERSAY, ÇOKETOPLA, ÇOKEĞERORTALAMA, Joker Karakterler).",
    iconName: "Layers",
    topics: LEVEL_03_TOPICS,
    isLocked: false,
  },
  {
    id: "level-04",
    number: 4,
    code: "04",
    titleEn: "Text Functions",
    titleTr: "Metin Fonksiyonları",
    descriptionEn: "Extract, clean, format, and parse text strings with LEFT, RIGHT, MID, LEN, TRIM, PROPER, UPPER/LOWER, FIND/SEARCH, SUBSTITUTE, and TEXTJOIN.",
    descriptionTr: "SOLDAN, SAĞDAN, PARÇAAL, UZUNLUK, KIRP, YAZIM.DÜZENİ, BÜYÜK/KÜÇÜK HARF, BUL/MBUL, YERİNEKOY ve METİNBİRLEŞTİR ile metinleri ayıklayın ve dönüştürün.",
    iconName: "FileText",
    topics: LEVEL_04_TOPICS,
    isLocked: false,
  },
  {
    id: "level-05",
    number: 5,
    code: "05",
    titleEn: "Lookup & Reference",
    titleTr: "Arama ve Başvuru",
    descriptionEn: "Perform modern and classic table lookups with XLOOKUP, VLOOKUP, HLOOKUP, INDEX, MATCH, XMATCH, IFERROR, and Multiple-condition lookups.",
    descriptionTr: "ÇAPRAZARA, DÜŞEYARA, YATAYARA, İNDİS, KAÇINCI, ÇAPRAZKAÇINCI, EĞERHATA ve Çok Koşullu Aramalar ile dinamik veri aramaları yapın.",
    iconName: "Search",
    topics: LEVEL_05_TOPICS,
    isLocked: false,
  },
  {
    id: "level-06",
    number: 6,
    code: "06",
    titleEn: "Data Analysis & Cleaning",
    titleTr: "Veri Analizi ve Temizleme",
    descriptionEn: "Master real-world data prep: Deduplication, Missing Values, Text-to-Columns, Excel Tables, Structured References, Dynamic Arrays (SORT/FILTER), Conditional Formatting, and Pivot concepts.",
    descriptionTr: "Gerçek dünya veri hazırlığı: Tekilleştirme, Eksik Değerler, Metni Sütunlara Bölme, Excel Tabloları, Yapılandırılmış Referanslar, Dinamik Diziler (SIRALA/FİLTRE), Koşullu Biçimlendirme ve Özet Tablo mantığı.",
    iconName: "BarChart2",
    topics: LEVEL_06_TOPICS,
    isLocked: false,
  },
];

export function getAllLevels(): LevelDefinition[] {
  return LEVELS;
}

export function getLevelById(levelId: string): LevelDefinition | undefined {
  return LEVELS.find((lvl) => lvl.id === levelId);
}

export function getTopicById(levelId: string, topicId: string): TopicContent | undefined {
  const level = getLevelById(levelId);
  if (!level) return undefined;
  return level.topics.find((t) => t.id === topicId);
}

export function getNextTopic(levelId: string, currentTopicId: string): { levelId: string; topicId: string } | null {
  const currentLevel = getLevelById(levelId);
  if (!currentLevel) return null;

  const currentIdx = currentLevel.topics.findIndex((t) => t.id === currentTopicId);
  if (currentIdx !== -1 && currentIdx < currentLevel.topics.length - 1) {
    return {
      levelId: currentLevel.id,
      topicId: currentLevel.topics[currentIdx + 1].id,
    };
  }

  // Check next level
  const currentLevelIdx = LEVELS.findIndex((lvl) => lvl.id === levelId);
  if (currentLevelIdx !== -1 && currentLevelIdx < LEVELS.length - 1) {
    const nextLevel = LEVELS[currentLevelIdx + 1];
    if (nextLevel && !nextLevel.isLocked && nextLevel.topics.length > 0) {
      return {
        levelId: nextLevel.id,
        topicId: nextLevel.topics[0].id,
      };
    }
  }

  return null;
}

export function getTotalTopicCount(): number {
  return LEVELS.reduce((acc, lvl) => acc + lvl.topics.length, 0);
}
