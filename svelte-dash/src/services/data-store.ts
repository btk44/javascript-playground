// to do : this file can be removed

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

const loadFromLocalStorage = (key: string, additionalActionOnValue: any = null) => {
  const localStorageString = localStorage.getItem(key)
  if (localStorageString !== null) {
    const value = JSON.parse(localStorageString)
    if(additionalActionOnValue !== null)
      additionalActionOnValue(value)
    globalStore[key] = value
  }
}

const saveToLocalStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
}

const removeFromLocalStorage = (key: string) => {
  localStorage.removeItem(key);
}

const saveGlobalStoreToLS = () => {
    saveToLocalStorage('accounts', globalStore.accounts)
    saveToLocalStorage('categories', globalStore.categories)
    saveToLocalStorage('currencies', globalStore.currencies)
    saveToLocalStorage('last-init', globalStore.lastInit)
}

const getGlobalStoreFromLS = () => {
    loadFromLocalStorage('accounts')
    loadFromLocalStorage('categories')
    loadFromLocalStorage('currencies')
    getLastInitTime()
}

const getLastInitTime = () => { loadFromLocalStorage('last-init', (dateString: string) => { globalStore.lastInit = new Date(dateString) }) }

export const initDataStore = async (ownerId: number, forceReload?: boolean) => {
  getLastInitTime()
  let now = new Date()
  let timePastLastInitInMin = (+now - +globalStore.lastInit) / 1000 / 60

  if(timePastLastInitInMin < 15 && !forceReload){
      getGlobalStoreFromLS()
      return await Promise.resolve()
  }

  globalStore.loading = true

  const accountsCall = TransactionService.SearchAccounts({ownerId: ownerId, active: true})
  const categoryCall = TransactionService.SearchCategories({ownerId: ownerId, active: true})
  const currencyCall = TransactionService.SearchCurrencies()

  try{
    const [accountsResponse, categoriesResponse, currencyResponse] = await Promise.all([accountsCall, categoryCall, currencyCall])
    globalStore.accounts = Object.assign({}, ...accountsResponse.map((x: Account) => ({[x.id]: x})))
    globalStore.categories = Object.assign({}, ...categoriesResponse.map((x: Category) => ({[x.id]: x})))
    globalStore.currencies = Object.assign({}, ...currencyResponse.map((x: Currency) => ({[x.id]: x})))
    globalStore.loading = false
    globalStore.lastInit = new Date()
    saveGlobalStoreToLS()
    return true
  }
  catch(error){
      globalStore.loading = false
      console.log('There was an error loading data to the store!')
      return false
  }
}

export const getStoreAccounts = () => { return structuredClone(globalStore.accounts) }
export const getStoreCategories = () => { return structuredClone(globalStore.categories) }
export const getStoreCurrencies = () => { return structuredClone(globalStore.currencies) }

export const savePageProperties = (pageName: string, properties: any) => { saveToLocalStorage(pageName, properties) }
export const readPageProperties = (pageName: string) => { return loadFromLocalStorage(pageName) }
export const resetPageProperties = (pageName: string) => { removeFromLocalStorage(pageName) }