<script lang="ts">
	import type { Transaction }  from '../models/transaction'
    import { getStoreAccounts, getStoreCategories, getStoreCurrencies } from '../services/data-store'
	import { createEventDispatcher } from 'svelte';

    export let transactions: Transaction[]
    export const resetSelection = () => { selectedRow = -1 }
    let selectedRow = -1

    const headers = ['data', 'konto', 'kategoria', 'kwota', '-', 'komentarz'] 
    const dispatch = createEventDispatcher()
    const accounts = getStoreAccounts()
    const categories = getStoreCategories()
    const accountCurrencyMap = (() => {
        let accountToCurrencyMap = {}
        let currencyDictionary = getStoreCurrencies()
        Object.keys(accounts).forEach(accKey => { accountToCurrencyMap[accKey] = currencyDictionary[accounts[accKey].currencyId].code })
        return accountToCurrencyMap
    })()

    const formatDate = (date: Date): string => { 
        const addLeadingZero = (number: number): string =>  number < 10 ? `0${number}` : number.toString()

        return `${addLeadingZero(date.getDate())}/${addLeadingZero(date.getMonth()+1)}/${date.getFullYear()}`
    } 

    const formatAmount = (amount: number): string => { 
        return amount < 0 ? amount.toString() : `+${amount}` 
    }

    const rowDoubleClick = (transaction: Transaction, index: number) => { 
        dispatch('transactionDoubleClick', { transaction }) 
        selectedRow = index   
    }
</script>

<table>
    <tr>
        {#each headers as header}
        <th class="aln-l">{header}</th>
        {/each}
    </tr>
    {#each transactions as transaction, index}
    <tr class={selectedRow === index ? 'selected' : ''} on:dblclick={() => { rowDoubleClick(transaction, index) }}>
        <td class="aln-l w-20pc">{formatDate(transaction.date)}</td>
        <td class="aln-l w-20pc">{accounts[transaction.accountId]?.name ?? ''}</td>
        <td class="aln-l w-20pc">{categories[transaction.categoryId]?.name ?? ''}</td>
        <td class="aln-l w-10pc">{formatAmount(transaction.amount)}</td>
        <td class="aln-l w-10pc">{accountCurrencyMap[transaction.accountId] ?? ''}</td>
        <td class="aln-l w-20pc">{transaction.comment}</td>
    </tr>
    {/each}
</table>

<style lang="scss">
    @import '../styles/app.scss';
    
    .selected { background-color: $accent-color-light;}
</style>