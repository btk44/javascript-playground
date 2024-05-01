<script lang="ts">
	import type { Transaction }  from '../models/transaction'
	import { createEventDispatcher } from 'svelte';
	import { accountStoreReadOnly, categoryStoreReadOnly, accountCurrencyMap } from '../services/store';

    export let transactions: Transaction[]
    export let pagerInfo: string
    export const resetSelection = () => { selectedRow = -1 }
    let selectedRow = -1

    const headers = ['data', 'konto', 'kategoria', 'kwota', '-', 'komentarz'] 
    const dispatch = createEventDispatcher()
    const accounts = $accountStoreReadOnly 
    const categories = $categoryStoreReadOnly
    const accountCurrency = accountCurrencyMap()

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

    const nextPageClick = () => { dispatch('nextPageClick') }
    const prevPageClick = () => { dispatch('prevPageClick') }
    const filtersClick = () => {  }
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
        <td class="aln-l w-10pc">{accountCurrency[transaction.accountId] ?? ''}</td>
        <td class="aln-l w-20pc">{transaction.comment}</td>
    </tr>
    {/each}
</table>
<div class="actions">
    <button class="button-outlined" on:click={() => { filtersClick() }}>&#x2637;</button>
    <button class="button-outlined" on:click={() => { prevPageClick() }}>&#x276E;</button>
    <span>{pagerInfo}</span>
    <button class="button-outlined" on:click={() => { nextPageClick() }}>&#x276F;</button>
</div>


<style lang="scss">
    @import '../styles/app.scss';
    
    .actions { margin: 10px; text-align: right; }
    .selected { background-color: $accent-color-light;}
</style>