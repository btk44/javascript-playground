<script lang="ts">
	import { onMount } from 'svelte';
    import { type Transaction } from '../models/transaction'
	import { GetEmptyTransaction } from '../models/transaction'
	import { TransactionService } from '../services/transaction-service';
	import TransactionInput from './transaction-input.svelte'
	import TransactionTable from './transaction-table.svelte'

    let displayTransactions: Array<Transaction> = []
    let addInProgress = false
    let editInProgress = false
    let currentTransaction: Transaction = GetEmptyTransaction()
    let currentTransactionBackup: Transaction = GetEmptyTransaction()
    let dataLoaded = false
    let saving = false
    let page = 0
    let pageCount = 0
    const pageSize = 10

    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    onMount(async () => { 
        loadTransactionPage(0)
    })

    const loadTransactionPage = async (pageChange: number) => {
        const nextPage = page + pageChange
        if(nextPage < 0) return
        
        dataLoaded = false
        editInProgress = false
        currentTransaction = currentTransactionBackup = null
        cancelAddTransaction()
        await sleep(500)
        try{
            const transactionSearchCall = TransactionService.SearchTransactions({ownerId: 1, take: pageSize, offset: nextPage*pageSize})
            const transactionCountCall = TransactionService.SearchTransactionsCount({ownerId: 1})
            const [transactionResult, countResult] = await Promise.all([transactionSearchCall, transactionCountCall])
            if(transactionResult.length > 0){
                page = nextPage
                displayTransactions = transactionResult.length > 0 ? transactionResult : displayTransactions
                pageCount = Math.ceil(countResult / pageSize)
            }
        }
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
            try {
                saving = true
                await sleep(500)
                event.detail.transaction.id = (await TransactionService.SaveTransactions([currentTransaction]))[0].id
                transactionInputChange(event)
                addInProgress = false
                transactionInputStart()
            }
            catch { 
                transactionInputChange(event) 
            } finally {
                saving = false
            }
        }

        if(editInProgress){
            try {
                saving = true
                await sleep(2000)
                await TransactionService.SaveTransactions([currentTransaction])
                transactionInputChange(event)
                editInProgress = false
                transactionInputStart()
                resetSelection()
            }
            catch { 
                transactionInputChange(event) 
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
                setTimeout(() => objDiv.scrollTop = objDiv.scrollHeight, 40)
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
</script>

<div class="transaction-edit">
    {#if !dataLoaded}
    <div class="mask"><div class="loader"></div></div>
    {/if}
    <div id="data" class="data">
        <TransactionTable transactions={displayTransactions}
                        rowsVisible={pageSize}
                        on:transactionDoubleClick={transactionTableRowDbClick}
                        bind:resetSelection></TransactionTable>
    </div>
    <div class="action-panel">
        {#if saving}
        <div class="mask"><div class="loader"></div></div>
        {/if}
        <div>
            <TransactionInput bind:initTransaction={initTransactionInput}
                        readonly={saving}
                        on:transactionChange={transactionInputChange} 
                        on:transactionSubmit={transactionInputSubmit} 
                        on:transactionEditStart={transactionInputStart}
                        on:transactionCancel={transactionInputCancel}></TransactionInput>
        </div>
        <div>
            <button class="button-outlined" on:click={() => {loadTransactionPage(-1)}}>&#x276E;</button>
            <span>{`${page + 1} / ${pageCount}`}</span>
            <button class="button-outlined" on:click={() => {loadTransactionPage(1)}}>&#x276F;</button>
        </div>
    </div>
</div>

<style lang="scss">
    @import '../styles/app.scss';

    .transaction-edit { position: relative;  }
    .data{ overflow-y: auto; height: 11.7*$control-min-height;}
    .action-panel{ display: flex; gap: 5px; flex-direction: row; justify-content: space-between;
        position: relative; border-top: 1px solid $primary-color-light; padding: 10px;} 
</style>