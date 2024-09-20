import {ReactNode} from "react";

export interface ColumnProps<T> {
    header: ReactNode,
    valueMapper: (row: T, index: number) => ReactNode
}

export interface TableProps<T extends object> {
    columns: ColumnProps<T>[],
    keyLens: (row: T, index: number) => string | number
    data: T[],
    emptyMessage?: string,
}

export function Table<T extends object>({columns, keyLens, data, emptyMessage}: TableProps<T>) {
    return <table>
        <thead>
            <tr>
                {columns.map(({header}, i) => <th key={i}>{header}</th>)}
            </tr>
        </thead>
        <tbody>
            {data.length === 0 && <tr><td colSpan={columns.length}>{emptyMessage ?? 'No data'}</td></tr>}
            {data.map((row, rowIndex) => <tr key={keyLens(row, rowIndex)}>
                {Object.values(columns).map(({valueMapper}, headerIndex) => <td key={headerIndex}>{valueMapper(row, rowIndex)}</td>)}
            </tr> )}
        </tbody>
    </table>
}
