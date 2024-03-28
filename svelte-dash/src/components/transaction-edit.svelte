<script lang="ts">
	import { transactions } from '../data-fakes/data'
    import { type Transaction } from '../models/transaction'
	import { GetEmptyTransaction } from '../models/transaction'
	import TransactionInput from './transaction-input.svelte'
	import TransactionTable from './transaction-table.svelte'

    let displayTransactions = transactions
    let addInProgress = false
    let editInProgress = false
    let currentTransaction: Transaction = GetEmptyTransaction()
    let currentTransactionBackup: Transaction = GetEmptyTransaction()

    const transactionChange = (event: any) => {
        const transaction = event.detail.transaction

        if(addInProgress)
            displayTransactions[displayTransactions.length - 1] = transaction
        
        if(editInProgress)
            displayTransactions[displayTransactions.indexOf(transaction)] = transaction
    }

    const transactionSubmit = (event: any) => { 
        if(addInProgress){
            transactionChange(event)
            addInProgress = false
            transactionInputStart()
        }

        if(editInProgress){
            transactionChange(event)
            editInProgress = false
            transactionInputStop()
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

    const transactionInputStop = () => {
        if (addInProgress){
            displayTransactions.length = displayTransactions.length -1
            addInProgress = false
        }
    }

    const transactionInputCancel = () => {
        if(editInProgress){
            displayTransactions[displayTransactions.indexOf(currentTransaction)] = currentTransactionBackup
            currentTransaction = GetEmptyTransaction()
            initTransactionInput(currentTransaction)
            editInProgress = false
        }

        if(addInProgress)
            transactionInputStop()
    }

    const transactionRowClick = (event: any) => {
        currentTransaction = event.detail.transaction
        currentTransactionBackup = { ...event.detail.transaction }
        initTransactionInput(currentTransaction)
        editInProgress = true
    } 

    let initTransactionInput: any
</script>

<div id="data" class="data">
    <TransactionTable transactions={displayTransactions}
                      on:transactionDoubleClick={transactionRowClick}></TransactionTable>
</div>
<div class="action-panel">
    <TransactionInput bind:initInput={initTransactionInput}
                    on:transactionChange={transactionChange} 
                    on:transactionSubmit={transactionSubmit} 
                    on:transactionEditStart={transactionInputStart}
                    on:transactionEditCancel={transactionInputCancel}
                    on:transactionEditStop={transactionInputStop}></TransactionInput>
</div>

<style lang="scss">
    //@import '../styles/app.scss';

    .data{ overflow-y: auto; }
    .action-panel{ text-align: center; position: relative; } 
</style>