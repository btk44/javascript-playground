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

    onMount(async () => { 
        displayTransactions = await TransactionService.SearchTransactions({ownerId: 1, take: 100, offset: 0})
        dataLoaded = true
    })

    const transactionInputChange = (event: any) => {
        const transaction = event.detail.transaction

        if(addInProgress)
            displayTransactions[displayTransactions.length - 1] = transaction
        
        if(editInProgress)
            displayTransactions[displayTransactions.indexOf(transaction)] = transaction
    }

    const transactionInputSubmit = (event: any) => { 
        if(addInProgress){
            TransactionService.SaveTransactions([currentTransaction]).then((args) => {
                let x = 10
            })
            transactionInputChange(event)
            addInProgress = false
            transactionInputStart()
        }

        if(editInProgress){
            TransactionService.SaveTransactions([currentTransaction])
            transactionInputChange(event)
            editInProgress = false
            transactionInputStart()
            resetSelection()
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
        cancelAddTransaction()
        currentTransaction = event.detail.transaction
        currentTransactionBackup = { ...event.detail.transaction }
        initTransactionInput(currentTransaction)
        editInProgress = true
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
{#if dataLoaded}
<div id="data" class="data">
    <TransactionTable transactions={displayTransactions}
                      on:transactionDoubleClick={transactionTableRowDbClick}
                      bind:resetSelection></TransactionTable>
</div>
<div class="action-panel">
    <TransactionInput bind:initTransaction={initTransactionInput}
                    on:transactionChange={transactionInputChange} 
                    on:transactionSubmit={transactionInputSubmit} 
                    on:transactionEditStart={transactionInputStart}
                    on:transactionCancel={transactionInputCancel}></TransactionInput>
</div>
{/if}
<style lang="scss">
    @import '../styles/app.scss';

    .data{ overflow-y: auto; }
    .action-panel{ text-align: center; position: relative; border-top: 1px solid $primary-color-light; padding: 10px;} 
</style>