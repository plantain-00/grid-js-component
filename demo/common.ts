import { GridData } from "../dist/common";

export const data: GridData = {
    headers: {
        cells: [
            {
                value: "name",
            },
            {
                value: "proficiency",
                style: "test-class",
            },
        ],
    },
    rows: [
        {
            cells: [
                {
                    value: "John",
                },
                {
                    value: 30,
                    component: "proficiency-percent",
                },
            ],
        },
        {
            cells: [
                {
                    value: "Sara",
                },
                {
                    value: 90,
                    component: "proficiency-percent",
                },
            ],
        },
        {
            cells: [
                {
                    value: "Lili",
                },
                {
                    value: 10,
                    component: "proficiency-percent",
                },
            ],
        },
        {
            cells: [
                {
                    value: "Smith",
                },
                {
                    value: 70,
                    component: "proficiency-percent",
                },
            ],
        },
        {
            cells: [
                {
                    value: "Lucy",
                },
                {
                    value: 60,
                    component: "proficiency-percent",
                },
            ],
        },
        {
            cells: [
                {
                    value: "Emily",
                },
                {
                    value: 20,
                    component: "proficiency-percent",
                },
            ],
        },
    ],
};
