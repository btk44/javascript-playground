import { type AccountSearchFilters } from '../models/account-search-filters'
import { type CategorySearchFilters } from '../models/cartegory-search-filters'
import { type CurrencySearchFilters } from '../models/currency-search-filters'
import { type Transaction } from '../models/transaction'
import { type TransactionSearchFilters } from '../models/transaction-search-filters'

export const TransactionService = {
    apiUrl: 'http://localhost:5000/api', // windows
    apiUrl1: 'https://localhost:5001/api', // linux
    transactionUrl: 'Transaction',
    accountUrl: 'Account',
    categoryUrl: 'Category',
    currencyUrl: 'Currency',

    SearchTransactions: async function(filters?: TransactionSearchFilters) {    
        try{
            const response = await this.Search(`${this.apiUrl}/${this.transactionUrl}`, { ...(filters || {}) })
            return response.map((t: Transaction) => { return { ...t, date: new Date(t.date)} })
        } catch(error) {
            return []
        }
    },

    SaveTransactions: async function(transactions: Array<Transaction>) {    
        try{
            const processInput = { transactions: transactions }
            const response = await fetch(`${this.apiUrl}/${this.transactionUrl}/process`, 
                                        { method: 'POST', body: JSON.stringify(processInput), headers: this.GetHeaders() })
            return await response.json()
        } catch(error) {
            return []
        }
    },

    SearchAccounts: async function(filters?: AccountSearchFilters) {    
        return await this.Search(`${this.apiUrl}/${this.accountUrl}`, { ...(filters || {}) })
    },

    SearchCategories: async function(filters?: CategorySearchFilters) {    
        return await this.Search(`${this.apiUrl}/${this.categoryUrl}`, { ...(filters || {}) })
    },

    SearchCurrencies: async function(filters?: CurrencySearchFilters) {    
        return await this.Search(`${this.apiUrl}/${this.currencyUrl}`, { ...(filters || {}) })
    },

    Search: async function(url: string, filters: any) {
        try{
            const response = await fetch(`${url}/search`, { method: 'POST', body: JSON.stringify(filters), headers: this.GetHeaders() })
            return await response.json()
        } catch(error) {
            return null
        }
    },

    Get: async function(url: string) {
        try{
            const response = await fetch(`${url}`, { method: 'GET', headers: this.GetHeaders() })
            return await response.json()
        } catch(error) {
            return null
        }
    },

    GetHeaders: function(): Headers {
        const headers = new Headers()
        headers.append('Authorization', 'Bearer to.ke.n')
        headers.append('Access-Control-Allow-Origin', '*')
        headers.append('Content-Type', 'application/json')
        headers.append('accept', 'text/plain')
        
        return headers;
    }
}