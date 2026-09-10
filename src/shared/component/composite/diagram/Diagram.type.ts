export type DiagramTitle = {
    order: number;
    key: string;
    label: string;
}

export type DiagramConfig = {
    columns: DiagramTitle[];
    rows: DiagramTitle[];

}   