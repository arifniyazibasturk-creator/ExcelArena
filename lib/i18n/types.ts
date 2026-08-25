export type InterfaceLocale = "en" | "tr";
export type FormulaLocaleSetting = "auto" | "en" | "tr";
export type ResolvedFormulaLocale = "en" | "tr";

export type CanonicalFunctionId =
  | "SUM"
  | "AVERAGE"
  | "MIN"
  | "MAX"
  | "COUNT"
  | "COUNTA"
  | "IF"
  | "IFS"
  | "AND"
  | "OR"
  | "NOT"
  | "COUNTIF"
  | "SUMIF"
  | "AVERAGEIF"
  | "COUNTIFS"
  | "SUMIFS"
  | "AVERAGEIFS"
  | "XLOOKUP"
  | "VLOOKUP"
  | "HLOOKUP"
  | "INDEX"
  | "MATCH"
  | "XMATCH"
  | "IFERROR"
  | "LEFT"
  | "RIGHT"
  | "MID"
  | "LEN"
  | "TRIM"
  | "PROPER"
  | "UPPER"
  | "LOWER"
  | "FIND"
  | "SEARCH"
  | "SUBSTITUTE"
  | "CONCAT"
  | "TEXTJOIN"
  | "DATE"
  | "YEAR"
  | "MONTH"
  | "DAY"
  | "TODAY"
  | "NOW"
  | "FILTER"
  | "SORT"
  | "UNIQUE";

export interface FormulaDefinition {
  canonical: CanonicalFunctionId;
  en: string;
  tr: string;
  trAliases?: string[];
  syntaxEn: string;
  syntaxTr: string;
  separatorEn: string;
  separatorTr: string;
  descriptionEn: string;
  descriptionTr: string;
  category: "math" | "logic" | "conditional" | "text" | "lookup" | "date" | "data";
}
