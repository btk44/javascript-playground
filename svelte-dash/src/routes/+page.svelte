<script lang="ts">
	import Card from "../components/card.svelte"
    import { transactions, accountDictionary, categoryDictionary, accountCurrencyDictionary } from '../data-fakes/data'

    let expandSidebar = false;
    const sidebarButtons = [ 
        { icon: '&#x2661;', text: 'option 1', clickAction: () => { alert("1")}},
        { icon: '&#x2662;', text: 'option 2', clickAction: () => { alert("2")}},
        { icon: '&#x2664;', text: 'option 3', clickAction: () => { alert("3")}},
        { icon: '&#x2667;', text: 'option 4', clickAction: () => { alert("4")}},
    ]

    const formatDate = (date: Date): string => { 
        const addLeadingZero = (number: number): string =>  number < 10 ? `0${number}` : number.toString()

        return `${addLeadingZero(date.getDate())}/${addLeadingZero(date.getMonth()+1)}/${date.getFullYear()}`
    } 

    const formatAmount = (amount: number): string => { 
        return amount < 0 ? amount.toString() : `+${amount}` 
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
            <div class="data">
                <table>
                    <tr>
                        <th class="align-l">data</th>
                        <th class="align-l">konto</th>
                        <th class="align-l">kategoria</th>
                        <th class="align-l">kwota</th>
                        <th class="align-l">-</th>
                        <th class="align-l">komu / od kogo?</th>
                    </tr>
                    {#each transactions as transaction}
                    <tr>
                        <td class="align-l">{formatDate(transaction.date)}</td>
                        <td class="align-l">{accountDictionary[transaction.accountId]}</td>
                        <td class="align-l">{categoryDictionary[transaction.categoryId]}</td>
                        <td class="align-l">{formatAmount(transaction.amount)}</td>
                        <td class="align-l">{accountCurrencyDictionary[transaction.accountId]}</td>
                        <td class="align-l">{transaction.payee}</td>
                    </tr>
                    {/each}
                </table>
            </div>
            <div class="action-panel">
                <input type="text"/>
                <button class="button-outlined">test</button>
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
                table {
                    font-size: small;
                    width: 100%;
                    tr {
                        margin: 1px;
                        height: 40px;
                        th {border: 0 solid lightgray; border-width: 0 0 2px 1px; background-color: lightgray;}
                        td,th { padding: 4px 6px;}
                        td { border: 0 lightgray solid; border-width: 1px 0 0 0; }
                        .align-c { text-align: center; }
                        .align-l { text-align: left; }
                        .align-r { text-align: right; }
                    }
                }
            }

            .action-panel{
                text-align: center;
                button { line-height: normal; }
                input { min-width: 300px; }
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

