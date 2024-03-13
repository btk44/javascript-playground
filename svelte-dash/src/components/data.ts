export const accounts = [
    { id: 1, name: 'mBank', amount: 0, currencyId: 1, active: true, color: "#000000" },
    { id: 2, name: 'Millenium', amount: 0, currencyId: 1, active: true, color: "#000000" },
    { id: 3, name: 'Millenium Profit', amount: 0, currencyId: 1, active: true, color: "#000000" },
    { id: 4, name: 'BGZ Optima', amount: 0, currencyId: 1, active: true, color: "#000000" },
    { id: 5, name: 'Alior', amount: 0, currencyId: 1, active: false, color: "#000000" },
    { id: 6, name: 'Aion', amount: 0, currencyId: 2, active: true, color: "#000000" },
    { id: 7, name: 'Millenium Ania', amount: 0, currencyId: 1, active: true, color: "#000000" },
]

export const currencies = [
    { id: 1, description: "Polish zloty", code: "PLN" },
    { id: 2, description: "Euro", code: "EUR" }
]

export const categories = [
    { id: 1, name: "food", parentId: 0, active: true, color: "#000000" },
    { id: 2, name: "kids", parentId: 0, active: true, color: "#000000" },
    { id: 3, name: "some stuff", parentId: 0, active: true, color: "#000000" },
    { id: 4, name: "restaurant", parentId: 1, active: true, color: "#000000" },
    { id: 5, name: "groceries", parentId: 1, active: true, color: "#000000" },
    { id: 6, name: "transfer", parentId: 0, active: true, color: "#000000" }
]