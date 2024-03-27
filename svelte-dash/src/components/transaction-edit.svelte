<script lang="ts">
	import { transactions } from "../data-fakes/data";
	import { GetEmptyTransaction } from "../models/transaction";
	import TransactionInput from "./transaction-input.svelte";
	import TransactionTable from "./transaction-table.svelte";

    let displayTransactions = transactions
    let editInProgress = false

    const transactionChange = (event: any) => {
        displayTransactions[displayTransactions.length-1] = event.detail.transaction // edit existing? +scroll issue
    }

    const transactionSubmit = (event: any) => { 
        transactionChange(event)
        editInProgress = false
        transactionEditStart()
    }

    const transactionEditStart = () => {
        if(!editInProgress){
            displayTransactions[displayTransactions.length] = GetEmptyTransaction()
            const objDiv = document.getElementById("data")
            if(objDiv)
                setTimeout(() => objDiv.scrollTop = objDiv.scrollHeight, 40)
            editInProgress = true
        }
    }

    const transactionEditStop = () => {
        if (editInProgress){
            displayTransactions.length = displayTransactions.length -1
            editInProgress = false
        }
    }

    const transactionRowClick = (event: any) => {  } 
</script>

<div id="data" class="data">
    <TransactionTable transactions={displayTransactions}
                      on:transactionDoubleClick={transactionRowClick}></TransactionTable>
</div>
<div class="action-panel">
    <TransactionInput on:transactionChange={transactionChange} 
                        on:transactionSubmit={transactionSubmit} 
                        on:transactionEditStart={transactionEditStart}
                        on:transactionEditStop={transactionEditStop}></TransactionInput>
</div>

<style lang="scss">
    //@import '../styles/app.scss';

    .data{ overflow-y: auto; }
    .action-panel{ text-align: center; position: relative; }            
</style>