import {
  AIProvider,
  GenerateHintParams,
  GenerateHintResult,
  GenerateFeedbackParams,
  GenerateFeedbackResult,
  GenerateScenarioParams,
  GenerateScenarioResult,
} from "./provider";
import { FORMULA_DEFINITIONS } from "../i18n/formulaLocale";

export class FallbackAIProvider implements AIProvider {
  name = "FallbackAI";

  isConfigured(): boolean {
    return true;
  }

  async generateHint(params: GenerateHintParams): Promise<GenerateHintResult> {
    const { expectedConcept, attemptCount, language } = params;
    const def = FORMULA_DEFINITIONS[expectedConcept as keyof typeof FORMULA_DEFINITIONS];

    // Non-function concept handlers
    if (expectedConcept === "CELL_REFERENCE" || expectedConcept === "REFERENCES") {
      if (attemptCount <= 1) {
        return {
          hint:
            language === "tr"
              ? "İlgili hücreleri doğrudan referans göstererek (örn. B2, C2) ve gerekirse sabit hücreleri $ işaretiyle kilitleyerek formülünüzü kurun."
              : "Reference the target cells directly (e.g. B2, C2) and lock fixed parameter cells with the dollar sign ($) as needed.",
          level: 1,
          isConceptual: true,
        };
      } else if (attemptCount === 2) {
        return {
          hint:
            language === "tr"
              ? "Hücreleri matematiksel işleçlerle (+, -, *, /) bağlayın. Örnek: =B2*C2 veya sabit hücre kilitli =B2*$D$1."
              : "Combine cell coordinates using arithmetic operators (+, -, *, /). Example: =B2*C2 or locked =B2*$D$1.",
          level: 2,
          isConceptual: true,
        };
      } else {
        return {
          hint:
            language === "tr"
              ? "Formülünüzün '=' ile başladığından, doğru satır/sütun koordinatlarını referans aldığınızdan emin olun."
              : "Verify your formula starts with '=', and check that your row and column coordinates are exact.",
          level: 3,
          isConceptual: false,
        };
      }
    }

    if (expectedConcept === "ARITHMETIC") {
      if (attemptCount <= 1) {
        return {
          hint:
            language === "tr"
              ? "Excel temel matematiksel işleçlerini (+ toplama, - çıkarma, * çarpma, / bölme, ^ üs) kullanın."
              : "Use standard Excel arithmetic operators (+ addition, - subtraction, * multiplication, / division, ^ power).",
          level: 1,
          isConceptual: true,
        };
      } else if (attemptCount === 2) {
        return {
          hint:
            language === "tr"
              ? "İşlem önceliğini sağlamak için parantez kullanın. Örnek: =(B2+C2)/D2 veya =(B2-C2)*D2."
              : "Use parentheses to enforce calculation order. Example: =(B2+C2)/D2 or =(B2-C2)*D2.",
          level: 2,
          isConceptual: true,
        };
      } else {
        return {
          hint:
            language === "tr"
              ? "Bölünen/çıkarılan hücrelerin sırasını ve parantezlerin kapandığını kontrol edin."
              : "Verify the order of operations and make sure all opened parentheses are properly closed.",
          level: 3,
          isConceptual: false,
        };
      }
    }

    if (expectedConcept === "PERCENTAGE") {
      if (attemptCount <= 1) {
        return {
          hint:
            language === "tr"
              ? "Yüzde payı için Parça / Bütün (=B2/$B$5) veya büyüme oranı için =(Yeni - Eski)/Eski yapısını kullanın."
              : "For percentage share use Part / Total (=B2/$B$5) or for growth rate use =(New - Old) / Old.",
          level: 1,
          isConceptual: true,
        };
      } else if (attemptCount === 2) {
        return {
          hint:
            language === "tr"
              ? "Genel toplam hücresini sabit tutmak için $ işaretiyle kilitleyin ($B$5). Büyüme oranında çıkarmayı paranteze alın."
              : "Lock the grand total cell with dollar signs ($B$5). In growth rates, place subtraction in parentheses.",
          level: 2,
          isConceptual: true,
        };
      } else {
        return {
          hint:
            language === "tr"
              ? "Formülün ondalık bir oran (örn. 0.25) üreteceğini unutmayın, 100 ile çarpmak gerekmez."
              : "Remember that percentages evaluate to decimal proportions (e.g. 0.25), no manual 100 multiplication is needed.",
          level: 3,
          isConceptual: false,
        };
      }
    }

    const funcName = language === "tr" ? (def?.tr || expectedConcept) : (def?.en || expectedConcept);
    const syntax = language === "tr" ? (def?.syntaxTr || `=${funcName}(...)`) : (def?.syntaxEn || `=${funcName}(...)`);

    if (attemptCount <= 1) {
      // Level 1: General direction
      return {
        hint:
          language === "tr"
            ? `Bu problem için ${funcName} fonksiyonunu ve ilgili veri sütunlarını kullanmayı düşünün.`
            : `Consider using the ${funcName} function or checking your referenced data ranges.`,
        level: 1,
        isConceptual: true,
      };
    } else if (attemptCount === 2) {
      // Level 2: Syntax and structure
      return {
        hint:
          language === "tr"
            ? `${funcName} fonksiyonunun standart yapısı şöyledir: ${syntax}`
            : `The standard syntax for ${funcName} is: ${syntax}`,
        level: 2,
        isConceptual: true,
      };
    } else {
      // Level 3: Specific parameters
      return {
        hint:
          language === "tr"
            ? `Ölçüt parametresini tırnak içinde (örn. ">1000" veya "Ankara") ve aralıkları doğru sırayla belirttiğinizden emin olun.`
            : `Ensure criteria is quoted (e.g. ">1000" or "Ankara") and check that range sizes match exactly.`,
        level: 3,
        isConceptual: false,
      };
    }
  }

  async generateFeedback(params: GenerateFeedbackParams): Promise<GenerateFeedbackResult> {
    const { expectedConcept, userFormula, evaluationResult, expectedResult, language } = params;
    const def = FORMULA_DEFINITIONS[expectedConcept as keyof typeof FORMULA_DEFINITIONS];
    const funcName = language === "tr" ? (def?.tr || expectedConcept) : (def?.en || expectedConcept);

    if (expectedConcept === "CELL_REFERENCE" || expectedConcept === "REFERENCES" || expectedConcept === "ARITHMETIC") {
      if (language === "tr") {
        return {
          title: "Hücre Referansı Geri Bildirimi",
          explanation: `Yazdığınız formül '${String(userFormula)}', tablodan '${String(evaluationResult ?? "hatalı")}' sonucunu üretti ancak beklenen sonuç '${String(expectedResult)}' idi.`,
          conceptualIssue: "Hücre koordinatları, işlem işaretleri (+, -, *, /) veya mutlak referans ($) kilitlemeleri kontrol edilmelidir.",
          suggestedAction: "İlgili hücrelerin satır/sütun koordinatlarını ve formül işlem işaretlerini gözden geçirin.",
        };
      }

      return {
        title: "Cell Reference Feedback",
        explanation: `Your formula '${String(userFormula)}' evaluated to '${String(evaluationResult ?? "error")}', but '${String(expectedResult)}' was expected.`,
        conceptualIssue: "Review your cell coordinates, arithmetic operators (+, -, *, /), or absolute reference ($) locking.",
        suggestedAction: "Verify row/column coordinates and check mathematical operator order.",
      };
    }

    if (language === "tr") {
      return {
        title: "Kavramsal Geri Bildirim",
        explanation: `Formülünüz '${String(userFormula)}', tablodan '${String(evaluationResult ?? "hatalı")}' sonucunu üretti ancak beklenen sonuç '${String(expectedResult)}' idi.`,
        conceptualIssue: `Bu tür problemlerde ${funcName} fonksiyonu ile doğru aralık ve ölçüt eşleştirmesi yapılmalıdır.`,
        suggestedAction: "Ölçüt aralığınızın ve toplanacak sütunun satır numaralarını kontrol edin.",
      };
    }

    return {
      title: "Conceptual Feedback",
      explanation: `Your formula '${String(userFormula)}' evaluated to '${String(evaluationResult ?? "error")}', but '${String(expectedResult)}' was expected.`,
      conceptualIssue: `This challenge requires applying the ${funcName} function across matching rows.`,
      suggestedAction: "Check that your criteria range and aggregation range have identical row boundaries.",
    };
  }

  async generateScenario(params: GenerateScenarioParams): Promise<GenerateScenarioResult> {
    const { topic, language } = params;
    const def = FORMULA_DEFINITIONS[topic as keyof typeof FORMULA_DEFINITIONS];
    const funcName = language === "tr" ? (def?.tr || topic) : (def?.en || topic);

    if (language === "tr") {
      return {
        title: `${funcName} ile Satış Analizi`,
        scenario: "Şirket yönetim kurulu, belirli bölge ve departmanlardaki satış performansını analiz etmek istemektedir.",
        task: `${funcName} fonksiyonunu kullanarak hedeflenen toplamı hesaplayın.`,
        dataset: {
          columns: [
            { key: "rep", name: "Temsilci", colLetter: "A" },
            { key: "city", name: "Şehir", colLetter: "B" },
            { key: "sales", name: "Satış (TL)", colLetter: "C", type: "number" },
          ],
          rows: [
            { rep: "Ali", city: "Ankara", sales: 15000 },
            { rep: "Buse", city: "Istanbul", sales: 22000 },
            { rep: "Cem", city: "Ankara", sales: 18000 },
            { rep: "Duygu", city: "Izmir", sales: 12000 },
          ],
        },
        expectedResult: 33000,
        suggestedFormula: '=ETOPLA(B2:B5; "Ankara"; C2:C5)',
      };
    }

    return {
      title: `Sales Analysis with ${funcName}`,
      scenario: "The executive team wants to audit quarterly performance for regional business units.",
      task: `Calculate the targeted metric using the ${funcName} function.`,
      dataset: {
        columns: [
          { key: "rep", name: "Representative", colLetter: "A" },
          { key: "city", name: "City", colLetter: "B" },
          { key: "sales", name: "Sales ($)", colLetter: "C", type: "number" },
        ],
        rows: [
          { rep: "Alex", city: "London", sales: 15000 },
          { rep: "Emma", city: "Paris", sales: 22000 },
          { rep: "David", city: "London", sales: 18000 },
          { rep: "Sarah", city: "Berlin", sales: 12000 },
        ],
      },
      expectedResult: 33000,
      suggestedFormula: '=SUMIF(B2:B5, "London", C2:C5)',
    };
  }
}
