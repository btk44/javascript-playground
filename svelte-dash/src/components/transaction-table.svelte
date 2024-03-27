<script lang="ts">
	import type { Transaction }  from '../models/transaction'
    import { accountDictionary, categoryDictionary, accountCurrencyDictionary } from '../data-fakes/data'
	import { createEventDispatcher } from 'svelte';

    export let transactions: Transaction[]
    const headers = ['data', 'konto', 'kategoria', 'kwota', '-', 'komu / od kogo?'] 
    const dispatch = createEventDispatcher()

    const formatDate = (date: Date): string => { 
        const addLeadingZero = (number: number): string =>  number < 10 ? `0${number}` : number.toString()

        return `${addLeadingZero(date.getDate())}/${addLeadingZero(date.getMonth()+1)}/${date.getFullYear()}`
    } 

    const formatAmount = (amount: number): string => { 
        return amount < 0 ? amount.toString() : `+${amount}` 
    }

    const rowDoubleClick = (transaction: Transaction) => { dispatch('transactionDoubleClick', { transaction }) }
</script>

<table>
    <tr>
        {#each headers as header}
        <th class="aln-l">{header}</th>
        {/each}
    </tr>
    {#each transactions as transaction}
    <tr on:dblclick={() => { rowDoubleClick(transaction) }}>
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
    
</style>