import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const randomNumber = (): number => Math.floor(Math.random() * 100);



export const removeSpanishAccents = (str: string): string => {
  if (!str) return "";
  
  return str
    // NFDで文字とダイアクリティカルマーク（アクセント記号など）に分解し、記号を削除
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    // NFDの対象外となる ñ や ª などの特殊文字を個別に置換
    .replace(/ñ/g, "n")
    .replace(/Ñ/g, "N")
    .replace(/ç/g, "c") // スペイン語圏の一部方言や他言語混入対策
    .replace(/Ç/g, "C");
};

/**
 * スペイン語のテキストからアクセント記号やダイアクリティカルマークの有無による全パターンを生成し、
 * すべて小文字にした重複のない配列を返します。
 * 
 * 例: "año de cancún" -> 
 *   [
 *      "año de cancún",
 *      "año de cancun",
 *      "ano de cancún",
 *      "ano de cancun"
 *    ]
 */
export function generateAccentCombinations(text: string): string[] {
    // 1. すべて小文字に変換
    const lowerText = text.toLowerCase();

    // 2. 特殊な文字の置換マップ（ñ や ü など、単なる結合文字分解で処理しきれないもの）
    // 各文字に対して [元の文字/マーク付き, マークなし] のペアを定義
    const charVariants: { [key: string]: string[] } = {
        'á': ['á', 'a'],
        'é': ['é', 'e'],
        'í': ['í', 'i'],
        'ó': ['ó', 'o'],
        'ú': ['ú', 'u'],
        'ü': ['ü', 'u'],
        'ñ': ['ñ', 'n'],
    };

    // 3. 文字列を1文字ずつの配列に分解し、それぞれの文字が持つバリエーションのリストを作る
    const charOptionsList: string[][] = [];

    for (const char of lowerText) {
        if (charVariants[char]) {
            // 定義済みのバリエーションを使用
            charOptionsList.push(charVariants[char]);
        } else {
            // Unicode正規化（NFD）を利用してベース文字と結合アクセント文字（ダイアクリティカルマーク）に分解
            // 例: "à" -> "a" + "̀"
            const normalized = char.normalize('NFD');
            const baseChar = normalized.replace(/[\u0300-\u036f]/g, '');
            
            if (baseChar !== normalized) {
                // マークが存在する場合は、「マーク付き」と「マークなし（ベース文字のみ）」の両方を追加
                charOptionsList.push([normalized, baseChar]);
            } else {
                // マークがない場合はそのまま
                charOptionsList.push([char]);
            }
        }
    }

    // 4. すべての文字のバリエーションを組み合わせる（直積集合の計算）
    let combinations: string[] = [''];

    for (const options of charOptionsList) {
        const nextCombinations: string[] = [];
        for (const current of combinations) {
            for (const option of options) {
                nextCombinations.push(current + option);
            }
        }
        combinations = nextCombinations;
    }

    // 5. 重複を排除して返す（Normalizationを再度かけて文字列を正規化）
    const uniqueResults = Array.from(new Set(combinations)).map(s => s.normalize('NFC'));
    return uniqueResults;
}

