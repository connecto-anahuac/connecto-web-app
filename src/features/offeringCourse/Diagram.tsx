import ColumnTitle from "@/components/ColumnTitle";
import RowTitle from "@/components/RowTitle";

type Props = {
  maxSemester: number;
  maxPosition: number;
  children: React.ReactNode;
};
export default function Diagram({ maxSemester, maxPosition, children }: Props) {
  return (
    <div
      className="w-fit"
      style={{
        display: "grid",
        // first column for row titles should size to its content; remaining columns are responsive
        gridTemplateColumns: `auto repeat(${maxSemester}, minmax(13rem, 1fr))`,
        gridAutoRows: "min-content",
        gap: "1rem",
      }}
    >
      <div
        key={`table-edge`}
        className="w-fit"
        style={{
          gridColumnStart: 1,
          gridRowStart: 1,
          // corner cell — keep above others when scrolling
          position: "sticky",
          top: 0,
          left: 0,
          zIndex: 30,
          background: "transparent",
        }}
      >
        <div className="w-4" />
      </div>

      {Array.from({ length: maxPosition }, (_, i) => {
        const position = i + 1;
        return (
          <div
            key={`position-${position}`}
            style={{
              gridColumnStart: 1,
              gridRowStart: position + 1,
              position: "sticky",
              left: 0,
              zIndex: 20,
              // background: "rgba(243,244,246,1)",
            }}
          >
            <RowTitle text={String.fromCharCode(64 + position)} />
          </div>
        );
      })}

      {Array.from({ length: maxSemester }, (_, i) => {
        const semester = i + 1;
        return (
          <div
            key={`semester-${semester}`}
            style={{
              gridColumnStart: semester + 1,
              gridRowStart: 1,
              position: "sticky",
              top: 0,
              zIndex: 25,
              // background: "rgba(229,231,235,1)",
            }}
          >
            <ColumnTitle text={`Semestre ${semester}`} />
          </div>
        );
      })}

      {children}
    </div>
  );
}
