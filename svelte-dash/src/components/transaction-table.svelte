<script lang="ts">
	import type { Transaction }  from '../models/transaction'
    import { accountDictionary, categoryDictionary, accountCurrencyDictionary } from '../data-fakes/data'

    export let transactions: Transaction[]
    const headers = ['data', 'konto', 'kategoria', 'kwota', '-', 'komu / od kogo?'] 

    const formatDate = (date: Date): string => { 
        const addLeadingZero = (number: number): string =>  number < 10 ? `0${number}` : number.toString()

        return `${addLeadingZero(date.getDate())}/${addLeadingZero(date.getMonth()+1)}/${date.getFullYear()}`
    } 

    const formatAmount = (amount: number): string => { 
        return amount < 0 ? amount.toString() : `+${amount}` 
    }
</script>

<table>
    <tr>
        {#each headers as header}
        <th class="align-l">{header}</th>
        {/each}
    </tr>
    {#each transactions as transaction}
    <tr>
        <td class="align-l">{formatDate(transaction.date)}</td>
        <td class="align-l">{accountDictionary[transaction.accountId] ?? ''}</td>
        <td class="align-l">{categoryDictionary[transaction.categoryId] ?? ''}</td>
        <td class="align-l">{formatAmount(transaction.amount)}</td>
        <td class="align-l">{accountCurrencyDictionary[transaction.accountId] ?? ''}</td>
        <td class="align-l">{transaction.payee}</td>
    </tr>
    {/each}
</table>

<style lang="scss">
    //@import '../styles/app.scss';
    table {
        font-size: small;
        position: relative;
        width: 100%;
        tr {
            margin: 1px;
            height: 40px;
            th {border: 0 solid lightgray; border-width: 0 0 2px 1px; background-color: lightgray;}
            td,th { padding: 4px 6px;}
            th {  position: sticky; top: 0}
            td { border: 0 lightgray solid; border-width: 1px 0 0 0; }
            .align-c { text-align: center; }
            .align-l { text-align: left; }
            .align-r { text-align: right; }
        }
    }
    
</style>