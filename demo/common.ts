import { GridData } from "../dist/common";

export const data: GridData = {
    headers: {
        cells: [
            { value: "proficiency", style: "test-cell-class" },
            { value: "country" },
        ],
        style: "test-row-class",
    },
    rows: [
        {
            cells: [
                { value: 30 },
                { value: "Spain" },
            ],
        },
        {
            cells: [
                { value: 90 },
                { value: "Italy" },
            ],
        },
        {
            cells: [
                { value: 10 },
                { value: "Japan" },
            ],
        },
        {
            cells: [
                { value: 70 },
                { value: "Norway" },
            ],
        },
        {
            cells: [
                { value: 60 },
                { value: "Peru" },
            ],
        },
        {
            cells: [
                { value: 20 },
                { value: "Greece" },
            ],
        },
    ],
    leftHeaders: {
        cells: [
            { value: "name" },
        ],
    },
    leftRows: [
        {
            cells: [
                { value: "John" },
            ],
        },
        {
            cells: [
                { value: "Sara" },
            ],
        },
        {
            cells: [
                { value: "Lili" },
            ],
        },
        {
            cells: [
                { value: "Smith" },
            ],
        },
        {
            cells: [
                { value: "Lucy" },
            ],
        },
        {
            cells: [
                { value: "Emily" },
            ],
        },
    ],
    rightHeaders: {
        cells: [
            { value: "gender" },
        ],
    },
    rightRows: [
        {
            cells: [
                { value: "male" },
            ],
        },
        {
            cells: [
                { value: "female" },
            ],
        },
        {
            cells: [
                { value: "female" },
            ],
        },
        {
            cells: [
                { value: "male" },
            ],
        },
        {
            cells: [
                { value: "female" },
            ],
        },
        {
            cells: [
                { value: "female" },
            ],
        },
    ],
};
