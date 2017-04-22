import { GridData } from "../dist/common";

let rawData = [
    {
        id: 1,
        name: "John",
        proficiency: 30,
        country: "Spain",
        gender: "male",
    },
    {
        id: 2,
        name: "Sara",
        proficiency: 90,
        country: "Italy",
        gender: "female",
    },
    {
        id: 3,
        name: "Lili",
        proficiency: 10,
        country: "Japan",
        gender: "female",
    },
    {
        id: 4,
        name: "Smith",
        proficiency: 70,
        country: "Norway",
        gender: "male",
    },
    {
        id: 5,
        name: "Lucy",
        proficiency: 60,
        country: "Peru",
        gender: "female",
    },
    {
        id: 6,
        name: "Emily",
        proficiency: 20,
        country: "Greece",
        gender: "female",
    },
    {
        id: 7,
        name: "Alice",
        proficiency: 65,
        country: "Japan",
        gender: "female",
    },
];

export function sort(sortColumn: string, sortType: "asc" | "desc") {
    rawData.sort((a: any, b: any) => sortType === "asc"
        ? (typeof a[sortColumn] === "string" ? a[sortColumn].localeCompare(b[sortColumn]) : a[sortColumn] - b[sortColumn])
        : (typeof b[sortColumn] === "string" ? b[sortColumn].localeCompare(a[sortColumn]) : b[sortColumn] - a[sortColumn]));
}

export function deleteOne(id: number) {
    rawData = rawData.filter(d => d.id !== id);
}

export function getViewData() {
    const data: GridData = {
        sortType: "desc",
        sortColumn: "",
        headers: {
            cells: [
                { value: "proficiency", style: "test-cell-class" },
                { value: "country" },
                { value: "gender" },
            ],
            style: "test-row-class",
        },
        rows: [],
        leftHeaders: {
            cells: [
                { value: "name" },
            ],
        },
        leftRows: [],
        rightHeaders: {
            cells: [
                { value: "" },
            ],
        },
        rightRows: [],
    };

    for (const row of rawData) {
        data.rows.push({
            cells: [
                { value: row.proficiency },
                { value: row.country },
                { value: row.gender },
            ],
        });
        data.leftRows!.push({
            cells: [
                { value: row.name },
            ],
        });
        data.rightRows!.push({
            cells: [
                { value: row.id },
            ],
        });
    }
    return data;
}
