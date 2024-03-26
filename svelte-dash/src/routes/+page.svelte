<script lang="ts">
    import TransactionInput from '../components/transaction-input.svelte';
import TransactionTable from '../components/transaction-table.svelte';
import { transactions } from '../data-fakes/data'
	import { GetEmptyTransaction } from '../models/transaction';
    let expandSidebar = false;
    const sidebarButtons = [ 
        { icon: '&#x2661;', text: 'option 1', clickAction: () => { alert("1")}},
        { icon: '&#x2662;', text: 'option 2', clickAction: () => { alert("2")}},
        { icon: '&#x2664;', text: 'option 3', clickAction: () => { alert("3")}},
        { icon: '&#x2667;', text: 'option 4', clickAction: () => { alert("4")}},
    ]

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
</script>

<div class={'main-page' + (expandSidebar ? ' with-sidebar-expanded' : '')}>
    <div class="header">
        <button on:click={() => { expandSidebar = !expandSidebar}} class="button-text-only header-menu-button">
            {#if expandSidebar} &#x276E; {:else} &#x2630; {/if} 
        </button>
        <button on:click={() => {  }} class="button-text-only nav-button">
            Page 1
        </button>
    </div>
    <div class="content">
        <div class="card">
            <div id="data" class="data">
                <TransactionTable transactions={displayTransactions}></TransactionTable>
            </div>
            <div class="action-panel">
                <TransactionInput on:transactionChange={transactionChange} 
                                  on:transactionSubmit={transactionSubmit} 
                                  on:transactionEditStart={transactionEditStart}
                                  on:transactionEditStop={transactionEditStop}></TransactionInput>
            </div>
        </div>
    </div>
    <div class="sidebar">
        {#each sidebarButtons as button}
        <button class="button-text-only side-button" on:click={button.clickAction}>
            <span class="image">{@html button.icon}</span><span class="text">{button.text}</span>
        </button>
        {/each}
    </div>
</div>

<style lang="scss">
    @import "../styles/app.scss";

    //reset all
    :global(body) { margin: 0; padding: 0; font-family: "Source Code Pro", monospace; font-optical-sizing: auto; font-weight: 500; font-style: normal; }
	:global(*) { box-sizing: border-box; background-color: transparent;	margin: 0; padding: 0;  
                 font-family: inherit; font-optical-sizing: inherit; font-weight: inherit; font-style: inherit; }

    //set global styles
    :global(body) { margin: 0; display: flex; place-items: center; min-width: 320px; min-height: 100vh; background-color: $background-color; }
    

    // main page styles
    $header-size: 60px;
    $side-size: 200px;

    .main-page {
        // * {
        //     -webkit-transition: all 0.1s ease-in-out;
        //     -moz-transition: all 0.1s ease-in-out;
        //     -o-transition: all 0.1s ease-in-out;
        //     transition: all 0.1s ease-in-out;
        // }
    }

    span { line-height: $header-size;}

    .header { 
        position: fixed; top: 0; left: 0;
        z-index: 3; 
        background-color: $primary-color; 
        color: $text-color; 
        width: 100vw;
        box-shadow: 0 1px 3px rgb(50, 48, 48);
    }
    .content { 
        position: fixed; top: 0; left: $header-size;
        z-index: 2; 
        padding: calc(10px + $header-size) 10px 10px 10px;
        background-color: $background-color;
        height: 100vh;
        width: calc(100vw - $header-size);
        overflow-y: auto;
        box-shadow: -1px 0 3px rgb(50, 48, 48);
        .card{
            max-height: 500px;
            padding: 5px;
            box-shadow: 1px 1px 3px rgb(125, 121, 121);
            display: flex;
            flex-direction: column;
            gap: 10px;
            .data{
                overflow-y: auto;
            }

            .action-panel{
                text-align: center;
                position: relative; 
            }            
        }


    }
    .sidebar { 
        position: fixed; top: 0; left: 0;
        z-index: 1;
        padding-top: $header-size; 
        border-right: 1px solid $primary-color;
        button {
            background-color: $primary-color-dark;
            padding: 0;
        }
        width: $side-size;
        height: 100vh;
        background-color: $primary-color-dark;
    }

    .with-sidebar-expanded{
        .header { left: $side-size; width: calc(100vw - $side-size); }
        .content { left: $side-size; width: calc(100vw - $side-size); }
    }

    .header-menu-button { width: $header-size; background-color: $primary-color; padding: 0; line-height: $header-size; }
    .nav-button { width: auto; padding-left: 1rem; padding-right: 1rem; background-color: $primary-color; padding: 0; line-height: $header-size;  }
    .side-button { 
        display: grid; grid-template-columns: 60px 1fr; grid-template-rows: 1fr;
        
        .image { grid-column: 1; }
        .text { grid-column: 2; text-align: left; padding-left: 10px; }
    }
</style>

