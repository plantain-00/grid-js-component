import { GridData } from "../dist/common";

export const data: GridData = {
    rows: [
        {
            cells: [
                {
                    value: "name",
                },
                {
                    value: "proficiency",
                },
            ],
        },
        {
            cells: [
                {
                    value: "John",
                },
                {
                    value: 50,
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
    ],
};
