import { cn } from "@/shared/lib/util";


type AvatorProps = React.ComponentPropsWithRef<"div"> & {
  fullName: string;
  size: "small" | "medium" | "large";
};

export default function Avator({ fullName,size ,className, ...props}: AvatorProps) { 
    return (
        <div className={cn(
          "text-xl relative aspect-square rounded-full flex items-center justify-center text-white font-semibold",
          size === "small" && "size-4.5 text-xs",
          size === "medium" && "size-6 text-[0.6875rem]",//11px
          size === "large" && "size-8 text-sm",
          className
        )}
        {...props}
        >
           <span className="leading-none">{getInitials(size,fullName)}</span>
         
        </div>
    );
}




function getInitials(size: "small" | "medium" | "large", fullName: string): string {
  if (size === "small") {
    // 小さいサイズの場合は、先頭の1文字だけを返す
    return fullName.trim().charAt(0).toUpperCase();
  }
  
  return fullName
    .trim()                           // 前後の余計な空白を削除
    .split(/\s+/)                     // 連続した空白（スペースやタブ）で分割して配列にする
    .map(word => word.charAt(0))      // 各単語の先頭の1文字を取り出す
    .slice(0, 2)                      // 先頭の2文字分だけを確保（ミドルネーム等があっても2文字に絞る）
    .join('')                         // 文字列に結合する
    .toUpperCase();                   // 大文字に変換する
}


// const AVATAR_PALETTE = [
//   '#FF6B6B', // ターメリック・レッド
//   '#4D96FF', // スカイ・ブルー
//   '#6BCB77', // フレッシュ・グリーン
//   '#FFD93D', // サン・イエロー
//   '#9B5DE5', // アメジスト・パープル
//   '#F15BB5', // マゼンタ・ピンク
//   '#00BBF9', // シアン・ブルー
//   '#00F5D4', // ティール・グリーン
// ];

// /**
//  * 定義されたパレットからランダムに背景色を選択する
//  */
// export function getAvatarColorFromPalette(): string {
//   const randomIndex = Math.floor(Math.random() * AVATAR_PALETTE.length);
//   return AVATAR_PALETTE[randomIndex];
// }