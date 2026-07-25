import type { ComponentProps } from "react";
import { useEffect, useRef, useState } from "react"; // 💡 useState をインポート
import { cn } from "@/shared/lib/util";
import InsideCircleCloseButton from "@/components/InsideCircleCloseButton";

type FilterSearchInputProps = ComponentProps<"input"> & {
  onClear?: () => void;
  isFocusedInitially?: boolean; // 💡 初期フォーカス状態を受け取るプロパティ
};

export function FilterSearchInput({
  className,
  onClear,
  onFocus, // 💡 外部からのイベントハンドラーも受け取れるように分解
  onBlur,
  isFocusedInitially = true, 
  ...props
}: FilterSearchInputProps) {
 const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isFocusedInitially) {
      // DOMの描画完了後にフォーカスするため、わずかに遅らせるかそのまま実行
      inputRef.current?.focus();
    }
  }, []);

  // 💡 フォーカス状態を管理するState
  const [isFocused, setIsFocused] = useState(isFocusedInitially);

  const hasValue = Boolean(props.value);

  // 💡 「文字がある」または「フォーカスされている」どちらか一方でも満たせば表示
  const shouldShowButton = hasValue;// || isFocused;

  return (
    <div className="relative w-full h-9">
      <input
        ref={inputRef}
        className={cn(
          "h-full w-full p-2 pr-8 rounded-sm border border-Outline bg-gray-400/20 text-sm leading-none font-normal text-OnSurfaceVariant outline-none placeholder:text-OnSurfaceVariant/70",
          "focus:border-2 focus:border-Primary focus:bg-SurfaceContainerLow",
          className,
        )}
        type="text"
        {...props}
        // 💡 フォーカスが当たったとき
        onFocus={(e) => {
          setIsFocused(true);
          onFocus?.(e); // 外部から渡された onFocus があれば実行
        }}
        // 💡 フォーカスが外れたとき
        onBlur={(e) => {
          // pointerdown（クリック）との競合を防ぐため、少しだけタイミングを遅らせる
          //   setTimeout(() => {
          //     setIsFocused(false);
          //   }, 150);
          setIsFocused(false);
          onBlur?.(e); // 外部から渡された onBlur があれば実行
        }}
      />

      {/* 💡 条件に合致するときだけボタンを表示 */}
      {shouldShowButton && (
        <InsideCircleCloseButton
          className="absolute right-2 top-1/2 -translate-y-1/2 size-4"
          onClick={onClear}
        />
      )}
    </div>
  );
}
