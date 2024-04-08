import { type Account } from "../models/account";
import { type Category } from "../models/category";
import { type Currency } from "../models/currency";
import { TransactionService } from "./transaction-service";


interface DataStore {
    loading: boolean,
    lastInit: Date,
    accounts: { [key: number]: Account },
    categories:  { [key: number]: Category },
    currencies:  { [key: number]: Currency },
    [index: string]: any;
}

const globalStore: DataStore = {
    loading: false,
    lastInit: new Date(2000, 1, 1),
    accounts: [],
    categories: [],
    currencies: []
}

export const initDataStore = async (ownerId: number, forceReload?: boolean) => {
  let now = new Date()
  let timePastLastInitInMin = (+now - +globalStore.lastInit) / 1000 / 60

  if(timePastLastInitInMin < 5 && !forceReload)
    return Promise.resolve()

  const accountsCall = TransactionService.SearchAccounts({ownerId: ownerId})
  const categoryCall = TransactionService.SearchCategories({ownerId: ownerId})
  const currencyCall = TransactionService.SearchCurrencies()

  Promise
    .all([accountsCall, categoryCall, currencyCall])
    .then(([accountsResponse, categoriesResponse, currencyResponse]) => {
      globalStore.accounts = Object.assign({}, ...accountsResponse.map((x: Account) => ({[x.id]: x})))
      globalStore.categories = Object.assign({}, ...categoriesResponse.map((x: Category) => ({[x.id]: x})))
      globalStore.currencies = Object.assign({}, ...currencyResponse.map((x: Currency) => ({[x.id]: x})))
    })
    .catch(() => alert('There was an error loading data!'))
}