<script lang="ts">
	import Card from "../components/card.svelte"
    import { transactions, accounts, categories, currencies } from '../data-fakes/data'

    interface Map {
        [key: string | number]: string | number
    }

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

    const getAccountMap = (): any => { 
        let accountMap: Map = {}
        accounts.forEach(a => { accountMap[a.id] = a.name })
        return accountMap
     }

     const getCategoryMap = (): Map => { 
        let categoryMap: Map = {}
        categories.forEach(c => { categoryMap[c.id] = c.name })
        return categoryMap
     }

     const getAccountToCurrencyMap = (): Map => {
        let accountToCurrencyMap: Map = {}
        accounts.forEach(a => { accountToCurrencyMap[a.id] = a.currencyId })
        return accountToCurrencyMap
     }

     const getCurrencyMap = (): Map => { 
        let currencyMap: Map = {}
        currencies.forEach(c => { currencyMap[c.id] = c.code })
        return currencyMap
     }

    const accountMap: Map = getAccountMap();
    const categoryMap: Map = getCategoryMap();
    const currencyMap: Map = getCurrencyMap();
    const accountToCurrencyMap: Map = getAccountToCurrencyMap();
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
                <td class="align-l">{accountMap[transaction.accountId]}</td>
                <td class="align-l">{categoryMap[transaction.categoryId]}</td>
                <td class="align-l">{formatAmount(transaction.amount)}</td>
                <td class="align-l">{currencyMap[accountToCurrencyMap[transaction.accountId]]}</td>
                <td class="align-l">{transaction.payee}</td>
            </tr>
            {/each}
        </table>
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

    button { line-height: $header-size; }
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
        table {
            width: 100%;
            padding: 5px;
            overflow-x: auto;
            overflow-y: auto;
            box-shadow: 1px 1px 3px rgb(125, 121, 121);
            height: 80%;
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
    .sidebar { 
        position: fixed; top: 0; left: 0;
        z-index: 1;
        padding-top: $header-size; 
        border-right: 1px solid $primary-color;
        button {
            background-color: $primary-color-dark;
        }
        width: $side-size;
        height: 100vh;
        background-color: $primary-color-dark;
    }

    .with-sidebar-expanded{
        .header { left: $side-size; width: calc(100vw - $side-size); }
        .content { left: $side-size; width: calc(100vw - $side-size); }
    }

    .header-menu-button { width: $header-size; background-color: $primary-color; }
    .nav-button { width: auto; padding-left: 1rem; padding-right: 1rem; background-color: $primary-color; }
    .side-button { 
        display: grid; grid-template-columns: 60px 1fr; grid-template-rows: 1fr;
        
        .image { grid-column: 1; }
        .text { grid-column: 2; text-align: left; padding-left: 10px; }
    }
</style>

