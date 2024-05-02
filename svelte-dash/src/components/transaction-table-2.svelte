<script lang="ts">
	import type { Transaction }  from '../models/transaction'
	import { accountStoreReadOnly, categoryStoreReadOnly, accountCurrencyMap } from '../services/store';
	import { onMount } from 'svelte';
	import { TransactionService } from '../services/transaction-service';

    const headers = ['data', 'konto', 'kategoria', 'kwota', '-', 'komentarz'] 
    const accounts = $accountStoreReadOnly 
    const categories = $categoryStoreReadOnly
    const accountCurrency = accountCurrencyMap()
    const pageSize = 15

    let displayTransactions: Array<Transaction> = []
    let dataLoaded = false
    let page = 0
    let pageCount = 0
    $: emptyRowsCount = pageSize - displayTransactions.length > 0 ? pageSize - displayTransactions.length : 0

    let filtersVisible = false
    let selectedRow = -1

    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    onMount(async () => { 
        loadTransactionPage(0)
    })

    const loadTransactionPage = async (pageChange: number) => {
        let nextPage = page + pageChange
        if(nextPage < 0) return
        
        dataLoaded = false
        await sleep(500)       
        try{
            const transactionCountResult = await TransactionService.SearchTransactionsCount({ownerId: 1})
            pageCount = Math.max(Math.ceil(transactionCountResult / pageSize), 1)

            if(pageChange === 0) nextPage = pageCount -1 // initial load -> go to last page

            const transactionSearchResult = await TransactionService.SearchTransactions({ownerId: 1, take: pageSize, offset: nextPage*pageSize})

            if(transactionSearchResult.length > 0){
                page = nextPage
                displayTransactions = transactionSearchResult
            }
        }
        catch{ alert('server error') }
        finally{ dataLoaded = true }
    }

    const formatDate = (date: Date): string => { 
        const addLeadingZero = (number: number): string =>  number < 10 ? `0${number}` : number.toString()

        return `${addLeadingZero(date.getDate())}/${addLeadingZero(date.getMonth()+1)}/${date.getFullYear()}`
    } 

    const formatAmount = (amount: number): string => { 
        return amount < 0 ? amount.toString() : `+${amount}` 
    }

    const rowDoubleClick = (transaction: Transaction, index: number) => { 
        selectedRow = index   
    }

    const filtersClick = () => { filtersVisible = !filtersVisible }
</script>

<div>
    {#if !dataLoaded}
    <div class="mask"><div class="loader"></div></div>
    {/if}
    <table>
        <tr>
            {#each headers as header}
            <th class="aln-l">{header}</th>
            {/each}
        </tr>
        {#each displayTransactions as transaction, index}
        <tr class={selectedRow === index ? 'selected' : ''} on:dblclick={() => { rowDoubleClick(transaction, index) }}>
            <td class="aln-l w-20pc">{formatDate(transaction.date)}</td>
            <td class="aln-l w-20pc">{accounts[transaction.accountId]?.name ?? ''}</td>
            <td class="aln-l w-20pc">{categories[transaction.categoryId]?.name ?? ''}</td>
            <td class="aln-l w-10pc">{formatAmount(transaction.amount)}</td>
            <td class="aln-l w-10pc">{accountCurrency[transaction.accountId] ?? ''}</td>
            <td class="aln-l w-20pc">{transaction.comment}</td>
        </tr>
        {/each}
        {#each {length: emptyRowsCount} as _, index }
        <tr>
            <td class="aln-l w-20pc"></td>
            <td class="aln-l w-20pc"></td>
            <td class="aln-l w-20pc"></td>
            <td class="aln-l w-10pc"></td>
            <td class="aln-l w-10pc"></td>
            <td class="aln-l w-20pc"></td>
        </tr>
        {/each}
    </table>
    <table class={filtersVisible ? '' : 'hidden'}>
        <tr>
            <td class="aln-l w-20pc"><input type="text" placeholder="data: od, do"/></td>
            <td class="aln-l w-20pc"><input type="text" placeholder="konto: id, id"/></td>
            <td class="aln-l w-20pc"><input type="text" placeholder="kategoria: id, id"/></td>
            <td class="aln-l w-20pc"><input type="text" placeholder="kwota: od, do"/></td>
            <td class="aln-l w-20pc"><input type="text" placeholder="komentarz"/></td>
        </tr>
    </table>
    <div class="actions">
        <button class="button-outlined" on:click={() => { filtersClick() }}>{@html filtersVisible ? '&#x2713;' : '&#x2637;'}</button>
        <button class="button-outlined" disabled={page === 0} on:click={() => { loadTransactionPage(-1) }}>&#x276E;</button>
        <span>{`${page + 1} / ${pageCount}`}</span>
        <button class="button-outlined" disabled={page + 1 === pageCount} on:click={() => { loadTransactionPage(1) }}>&#x276F;</button>
    </div>
</div>

<style lang="scss">
    @import '../styles/app.scss';
    
    .actions { margin: 10px; text-align: right; }
    .selected { background-color: $accent-color-light;}
    input { width: 100%;}
    .hidden { visibility: hidden;}
</style>