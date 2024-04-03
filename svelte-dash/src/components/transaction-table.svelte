<script lang="ts">
	import type { Transaction }  from '../models/transaction'
    import { accountDictionary, categoryDictionary, accountCurrencyDictionary } from '../data-fakes/data'
	import { createEventDispatcher } from 'svelte';

    export let transactions: Transaction[]
    export const resetSelection = () => { selectedRow = -1 }
    let selectedRow = -1

    const headers = ['data', 'konto', 'kategoria', 'kwota', '-', 'komu / od kogo?'] 
    const dispatch = createEventDispatcher()

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
        <td class="aln-l w-20">{formatDate(transaction.date)}</td>
        <td class="aln-l w-20">{accountDictionary[transaction.accountId] ?? ''}</td>
        <td class="aln-l w-20">{categoryDictionary[transaction.categoryId] ?? ''}</td>
        <td class="aln-l w-10">{formatAmount(transaction.amount)}</td>
        <td class="aln-l w-10">{accountCurrencyDictionary[transaction.accountId] ?? ''}</td>
        <td class="aln-l w-20">{transaction.payee}</td>
    </tr>
    {/each}
</table>

<style lang="scss">
    @import '../styles/app.scss';
    
    .selected { background-color: $primary-color-light;}
</style>