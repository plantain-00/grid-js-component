import { GridData } from "../dist/common";

const rawData = [
    {
        name: "John",
        proficiency: 30,
        country: "Spain",
        gender: "male",
    },
    {
        name: "Sara",
        proficiency: 90,
        country: "Italy",
        gender: "female",
    },
    {
        name: "Lili",
        proficiency: 10,
        country: "Japan",
        gender: "female",
    },
    {
        name: "Smith",
        proficiency: 70,
        country: "Norway",
        gender: "male",
    },
    {
        name: "Lucy",
        proficiency: 60,
        country: "Peru",
        gender: "female",
    },
    {
        name: "Emily",
        proficiency: 20,
        country: "Greece",
        gender: "female",
    },
];

export function sort(sortColumn: string, sortType: "asc" | "desc") {
    rawData.sort((a: any, b: any) => sortType === "asc"
        ? (typeof a[sortColumn] === "string" ? a[sortColumn].localeCompare(b[sortColumn]) : a[sortColumn] - b[sortColumn])
        : (typeof b[sortColumn] === "string" ? b[sortColumn].localeCompare(a[sortColumn]) : b[sortColumn] - a[sortColumn]));
}

export function getViewData() {
    const data: GridData = {
        sortType: "desc",
        sortColumn: "",
        headers: {
            cells: [
                { value: "proficiency", style: "test-cell-class" },
                { value: "country" },
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
                { value: "gender" },
            ],
        },
        rightRows: [],
    };

    for (const row of rawData) {
        data.rows.push({
            cells: [
                { value: row.proficiency },
                { value: row.country },
            ],
        });
        data.leftRows!.push({
            cells: [
                { value: row.name },
            ],
        });
        data.rightRows!.push({
            cells: [
                { value: row.gender },
            ],
        });
    }
    return data;
}
