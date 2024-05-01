<script lang="ts">
	import { onMount } from 'svelte';
    import { type Transaction } from '../models/transaction'
	import { GetEmptyTransaction } from '../models/transaction'
	import { TransactionService } from '../services/transaction-service';
	import TransactionInput from './transaction-input.svelte'
	import TransactionTable from './transaction-table.svelte'
	import { reloadAccount } from '../services/store';

    let displayTransactions: Array<Transaction> = []
    let addInProgress = false
    let editInProgress = false
    let currentTransaction: Transaction = GetEmptyTransaction()
    let currentTransactionBackup: Transaction = GetEmptyTransaction()
    let dataLoaded = false
    let saving = false
    let page = 0
    let pageCount = 0
    const pageSize = 15

    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    onMount(async () => { 
        loadTransactionPage(0)
    })

    const loadTransactionPage = async (pageChange: number) => {
        let nextPage = page + pageChange
        if(nextPage < 0) return
        
        transactionInputCancel()
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

    const transactionInputChange = (event: any) => {
        const transaction = event.detail.transaction

        if(addInProgress)
            displayTransactions[displayTransactions.length - 1] = transaction
        
        if(editInProgress)
            displayTransactions[displayTransactions.indexOf(transaction)] = transaction
    }

    const transactionInputSubmit = async (event: any) => { 
        if(addInProgress){
            saving = true
            try {
                await sleep(500)
                event.detail.transaction.id = (await TransactionService.SaveTransactions([currentTransaction]))[0].id
                await reloadAccount(1, currentTransaction.accountId)
                transactionInputChange(event)
                addInProgress = false
                transactionInputStart()
            }
            catch { 
                transactionInputChange(event) 
                alert('server error')
            } finally {
                saving = false
            }
        }

        if(editInProgress){
            saving = true
            try {
                await sleep(2000)
                await TransactionService.SaveTransactions([currentTransaction])
                await reloadAccount(1, currentTransaction.accountId)
                transactionInputChange(event)
                editInProgress = false
                initTransactionInput(GetEmptyTransaction())
                resetSelection()
                blurInput()
            }
            catch { 
                transactionInputChange(event) 
                alert('server error')
            } finally {
                saving = false
            }
        }
    }

    const transactionInputStart = () => {
        if(editInProgress) return
        if(addInProgress) return

        if(!addInProgress){
            currentTransaction = GetEmptyTransaction()
            displayTransactions[displayTransactions.length] = currentTransaction
            initTransactionInput(currentTransaction)
            const objDiv = document.getElementById('data')
            if(objDiv)
                setTimeout(() => { if(displayTransactions.length > 10) objDiv.scrollTop = objDiv.scrollHeight }, 40) // this is a hack :(
            addInProgress = true
        }
    }

    const transactionInputCancel = () => {
        if(editInProgress){
            displayTransactions[displayTransactions.indexOf(currentTransaction)] = currentTransactionBackup
            currentTransaction = GetEmptyTransaction()
            initTransactionInput(currentTransaction)
            editInProgress = false
            resetSelection()
        }

        cancelAddTransaction()
        blurInput()
    }

    const transactionTableRowDbClick = (event: any) => {
        editInProgress = true
        cancelAddTransaction()
        currentTransaction = event.detail.transaction
        currentTransactionBackup = { ...event.detail.transaction }
        initTransactionInput(currentTransaction)
    } 

    const cancelAddTransaction = () => {
        if (addInProgress){
            displayTransactions.length = displayTransactions.length -1
            addInProgress = false
        }
    }

    let initTransactionInput: any
    let resetSelection: any
    let focusInput: any
    let blurInput: any
</script>

<div class="transaction-edit">
    {#if !dataLoaded}
    <div class="mask"><div class="loader"></div></div>
    {/if}
    <div id="data" class="data">
        <TransactionTable transactions={displayTransactions}
                        pagerInfo={`${page + 1} / ${pageCount}`}
                        on:transactionDoubleClick={transactionTableRowDbClick}
                        bind:resetSelection

                        on:nextPageClick={() => {loadTransactionPage(1)}}
                        on:prevPageClick={() => {loadTransactionPage(-1)}}></TransactionTable>
    </div>
    <div class="action-panel">
        {#if saving}
        <div class="mask"><div class="loader"></div></div>
        {/if}
        <div>
            <TransactionInput bind:initTransaction={initTransactionInput}
                              bind:focus={focusInput}
                              bind:blur={blurInput}
                        readonly={saving}
                        disabled={page !== pageCount -1 && !editInProgress}
                        on:transactionChange={transactionInputChange} 
                        on:transactionSubmit={transactionInputSubmit} 
                        on:transactionEditStart={transactionInputStart}
                        on:transactionCancel={transactionInputCancel}></TransactionInput>
        </div>
    </div>
</div>

<style lang="scss">
    @import '../styles/app.scss';

    .transaction-edit { position: relative; height: 100%;}
    .data{ overflow-y: auto; height: 90%;} 
    .action-panel{ display: flex; gap: 5px; flex-direction: row; justify-content: space-between;
        position: relative; border-top: 1px solid $primary-color-light; padding: 10px; height: 10%;} 
</style>