import ColumnTitle from "@/shared/component/composite/diagram/ColumnTitle";
import RowTitle from "@/shared/component/composite/diagram/RowTitle";

type Props = {
	semesters: readonly number[];
	positions: readonly number[];
	children: React.ReactNode;
};

export default function Diagram({ semesters, positions, children }: Props) {
	return (
		<div
			className="w-fit"
			style={{
				display: "grid",
				gridTemplateColumns: `auto repeat(${semesters.length}, minmax(13rem, 1fr))`,
				gridAutoRows: "min-content",
				gap: "1rem",
			}}
		>
			<div
				key="table-edge"
				className="w-fit"
				style={{
					gridColumnStart: 1,
					gridRowStart: 1,
					position: "sticky",
					top: 0,
					left: 0,
					zIndex: 30,
					background: "transparent",
				}}
			>
				<div className="w-4" />
			</div>

			{positions.map((position, index) => {
				return (
					<div
						key={`position-${position}`}
						style={{
							gridColumnStart: 1,
							gridRowStart: index + 2,
							position: "sticky",
							left: 0,
							zIndex: 20,
						}}
					>
						<RowTitle text={String.fromCharCode(65 + position)} />
					</div>
				);
			})}

			{semesters.map((semester, index) => {
				return (
					<div
						key={`semester-${semester}`}
						style={{
							gridColumnStart: index + 2,
							gridRowStart: 1,
							position: "sticky",
							top: 0,
							zIndex: 25,
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
