export const getCalendarDailyQueryKey = (date: string) => [
    "calendar",
    "daily",
    date,
];

export const getCalendarMonthQueryKey = (month: string) => [
    "calendar",
    "monthly",
    month,
];
