<script lang="ts">
	import type { Transaction }  from '../models/transaction'
	import { accountStoreReadOnly, categoryStoreReadOnly, accountCurrencyMap } from '../services/store';
	import { onMount } from 'svelte';
	import { TransactionService } from '../services/transaction-service';
	import { type TransactionSearchFilters } from '../models/transaction-search-filters';

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
    // filters: 
    let dateFilterText = ''
    let accountFilterText = ''
    let categoryFilterText = ''
    let amountFilterText = ''
    let commentFilterText = ''

    let filtersVisible = false
    let selectedRow = -1

    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    onMount(async () => { 
        loadTransactionPage(0)
    })

    const getFilters = (): TransactionSearchFilters => {
        const getDate = (dateString: string) => {
            return new Date((new Date()).setTime(new Date(dateString).getTime()+12*60*60*1000))
        } 

        const searchFilters: TransactionSearchFilters = {ownerId: 1}

        if(dateFilterText.length){
            const dateStrings = dateFilterText.split(',')
            console.log(dateStrings.length)
            console.log(Date.parse(dateStrings[0]))
            console.log(dateStrings[1])
            //this is all wrong - welcome fucking timezones and time formats!
            if (dateStrings.length > 0 && !isNaN(Date.parse(dateStrings[0]))) { searchFilters.dateFrom = getDate(dateStrings[0])}
            if (dateStrings.length > 1 && !isNaN(Date.parse(dateStrings[1]))) { searchFilters.dateTo = getDate(dateStrings[1]) }
        }

        if (accountFilterText.length){
            const accountIds = accountFilterText.split(',').filter(x => x.length && !isNaN(+x)).map(x => parseInt(x) )
            if (accountIds.length) { searchFilters.accounts = accountIds }
        }

        if (categoryFilterText.length){
            const categoryIds = categoryFilterText.split(',').filter(x => x.length && !isNaN(+x)).map(x => parseInt(x) )
            if (categoryIds.length) { searchFilters.categories = categoryIds }
        }

        if (amountFilterText.length){
            const amountStrings = amountFilterText.split(',')
            if (amountStrings.length > 0 && !isNaN(+amountStrings[0])) { searchFilters.amountFrom = +amountStrings[0] }
            if (amountStrings.length > 1 && !isNaN(+amountStrings[1])) { searchFilters.amountTo = +amountStrings[1] }
        }

        if (commentFilterText.length){ searchFilters.comment = commentFilterText }

        console.log(searchFilters)

        return searchFilters
    }

    const loadTransactionPage = async (pageChange: number) => {
        let nextPage = page + pageChange
        if(nextPage < 0) return
        
        dataLoaded = false
        await sleep(500)       
        try{
            const transactionCountResult = await TransactionService.SearchTransactionsCount(getFilters())
            pageCount = Math.max(Math.ceil(transactionCountResult / pageSize), 1)

            if(pageChange === 0) nextPage = pageCount -1 // initial load -> go to last page

            const transactionSearchResult = await TransactionService.SearchTransactions({...getFilters(), take: pageSize, offset: nextPage*pageSize})

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
    const filtersConfirmed = () => { filtersVisible = false; loadTransactionPage(0) }
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
            <td class="aln-l w-20pc"><input type="text" bind:value={dateFilterText} placeholder="data: od, do"/></td>
            <td class="aln-l w-20pc"><input type="text" bind:value={accountFilterText} placeholder="konto: id, id"/></td>
            <td class="aln-l w-20pc"><input type="text" bind:value={categoryFilterText} placeholder="kategoria: id, id"/></td>
            <td class="aln-l w-20pc"><input type="text" bind:value={amountFilterText} placeholder="kwota: od, do"/></td>
            <td class="aln-l w-20pc"><input type="text" bind:value={commentFilterText} placeholder="komentarz"/></td>
        </tr>
    </table>
    <div class="actions">
        {#if filtersVisible}
        <button class="button-outlined" on:click={() => { filtersConfirmed() }}>&#x2699;</button>
        {/if}
        <button class="button-outlined" on:click={() => { filtersClick() }}>&#x2637;</button>
        <button class="button-outlined" disabled={page === 0} on:click={() => { loadTransactionPage(-1) }}>&#x276E;</button>
        <div>{`${page + 1} / ${pageCount}`}</div>
        <button class="button-outlined" disabled={page + 1 === pageCount} on:click={() => { loadTransactionPage(1) }}>&#x276F;</button>
    </div>
</div>

<style lang="scss">
    @import '../styles/app.scss';
    
    .actions { margin: 10px; display: flex; align-items: center; gap: 10px; justify-content: end;}
    .selected { background-color: $accent-color-light;}
    input { width: 100%;}
    .hidden { visibility: hidden;}
</style>