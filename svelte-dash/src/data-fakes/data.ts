import type { Account } from "../models/account"
import type { Category } from "../models/category"
import type { Currency } from "../models/currency"
import type { Transaction } from "../models/transaction"

export const accounts: Account[] = [
    { id: 1, name: 'mBank', amount: 1000, currencyId: 1, active: true },
    { id: 2, name: 'Millenium', amount: -4230, currencyId: 1, active: true },
    { id: 3, name: 'Millenium Profit', amount: 12310, currencyId: 1, active: true },
    { id: 4, name: 'BGZ Optima', amount: 20, currencyId: 1, active: true  },
    { id: 5, name: 'Alior', amount: -150, currencyId: 1, active: false  },
    { id: 6, name: 'Aion', amount: 3650, currencyId: 2, active: true  },
    { id: 7, name: 'Millenium Ania', amount: 7123, currencyId: 1, active: true  },
]

export const currencies: Currency[] = [
    { id: 1, description: "Polish zloty", code: "PLN" },
    { id: 2, description: "Euro", code: "EUR" }
]

export const categories: Category[] = [
    { id: 1, name: "food", parentId: 0, active: true  },
    { id: 2, name: "kids", parentId: 0, active: true  },
    { id: 3, name: "some stuff", parentId: 0, active: true  },
    { id: 4, name: "restaurant", parentId: 1, active: true  },
    { id: 5, name: "groceries", parentId: 1, active: true  },
    { id: 6, name: "transfer", parentId: 0, active: true  }
]

export const transactions: Transaction[] = [
    { id: 1, date: new Date(), accountId: 1, categoryId: 5, amount: -10, payee: 'biedronka', gid: '', active: true },
    { id: 2, date: new Date(), accountId: 2, categoryId: 5, amount: -10.03, payee: 'biedronka', gid: '', active: true },
    { id: 3, date: new Date(), accountId: 2, categoryId: 3, amount: 190, payee: 'firma', gid: '', active: true },
    { id: 4, date: new Date(), accountId: 3, categoryId: 3, amount: 43.32, payee: 'jakiś bank', gid: '', active: true },
    { id: 5, date: new Date(), accountId: 4, categoryId: 2, amount: 823.3, payee: 'komputerowy', gid: '', active: true },
    { id: 6, date: new Date(), accountId: 4, categoryId: 2, amount: -218, payee: 'księgarnia', gid: '', active: true },
    { id: 7, date: new Date(), accountId: 4, categoryId: 3, amount: 92.4, payee: 'Andrzej', gid: '', active: true },
    { id: 8, date: new Date(), accountId: 6, categoryId: 5, amount: 0, payee: 'lidl', gid: '', active: true },
    { id: 9, date: new Date(), accountId: 7, categoryId: 3, amount: -3.2, payee: 'mpk', gid: '', active: true },
    { id: 10, date: new Date(), accountId: 7, categoryId: 5, amount: -1.99, payee: 'biedronka', gid: '', active: true },
    { id: 11, date: new Date(), accountId: 1, categoryId: 4, amount: -94, payee: 'szkoła', gid: '', active: true },
    { id: 12, date: new Date(), accountId: 1, categoryId: 1, amount: -23.87, payee: 'sportowy', gid: '', active: true },
    { id: 13, date: new Date(), accountId: 2, categoryId: 6, amount: -30, payee: 'szkoła', gid: '123', active: true },
    { id: 14, date: new Date(), accountId: 1, categoryId: 6, amount: 30, payee: 'sportowy', gid: '123', active: true },

    { id: 15, date: new Date(), accountId: 1, categoryId: 5, amount: -10, payee: 'biedronka', gid: '', active: true },
    { id: 21, date: new Date(), accountId: 2, categoryId: 5, amount: -10.03, payee: 'biedronka', gid: '', active: true },
    { id: 32, date: new Date(), accountId: 2, categoryId: 3, amount: 190, payee: 'firma', gid: '', active: true },
    { id: 41, date: new Date(), accountId: 3, categoryId: 3, amount: 43.32, payee: 'jakiś bank', gid: '', active: true },
    { id: 51, date: new Date(), accountId: 4, categoryId: 2, amount: 823.3, payee: 'komputerowy', gid: '', active: true },
    { id: 61, date: new Date(), accountId: 4, categoryId: 2, amount: -218, payee: 'księgarnia', gid: '', active: true },
    { id: 71, date: new Date(), accountId: 4, categoryId: 3, amount: 92.4, payee: 'Andrzej', gid: '', active: true },
    { id: 81, date: new Date(), accountId: 6, categoryId: 5, amount: 0, payee: 'lidl', gid: '', active: true },
    { id: 91, date: new Date(), accountId: 7, categoryId: 3, amount: -3.2, payee: 'mpk', gid: '', active: true },
    { id: 101, date: new Date(), accountId: 7, categoryId: 5, amount: -1.99, payee: 'biedronka', gid: '', active: true },
    { id: 111, date: new Date(), accountId: 1, categoryId: 4, amount: -94, payee: 'szkoła', gid: '', active: true },
    { id: 121, date: new Date(), accountId: 1, categoryId: 1, amount: -23.87, payee: 'sportowy', gid: '', active: true },
    { id: 131, date: new Date(), accountId: 2, categoryId: 6, amount: -30, payee: 'szkoła', gid: '123', active: true },
    { id: 141, date: new Date(), accountId: 1, categoryId: 6, amount: 30, payee: 'sportowy', gid: '123', active: true },
]

interface Map {
    [key: string | number]: string | number
}

const getAccountDictionary = (): any => { 
    let accountMap: Map = {}
    accounts.forEach(a => { accountMap[a.id] = a.name })
    return accountMap
 }

 const getCategoryDictionary = (): Map => { 
    let categoryMap: Map = {}
    categories.forEach(c => { categoryMap[c.id] = c.name })
    return categoryMap
 }

 const getCurrencyDictionary = (): Map => { 
    let currencyMap: Map = {}
    currencies.forEach(c => { currencyMap[c.id] = c.code })
    return currencyMap
 }

 const getAccountCurrencyDictionary = (): Map => {
    let accountToCurrencyMap: Map = {}
    let currencyDictionary: Map = getCurrencyDictionary()
    accounts.forEach(a => { accountToCurrencyMap[a.id] = currencyDictionary[a.currencyId] })
    return accountToCurrencyMap
 }

 export const accountDictionary = getAccountDictionary()
 export const categoryDictionary = getCategoryDictionary()
 export const accountCurrencyDictionary = getAccountCurrencyDictionary()
