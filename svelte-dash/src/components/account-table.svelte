<script lang="ts">
	import { getStoreAccounts, getStoreCurrencies } from "../services/data-store";
	import { TransactionService } from "../services/transaction-service";
  

    const headers = ['id', 'nazwa', 'kwota', '-', ''] 
    const accounts = getStoreAccounts()
    const accountCurrencyMap = (() => {
        let accountToCurrencyMap = {}
        let currencyDictionary = getStoreCurrencies()
        Object.keys(accounts).forEach(accKey => { accountToCurrencyMap[accKey] = currencyDictionary[accounts[accKey].currencyId].code })
        return accountToCurrencyMap
    })()

    const formatAmount = (amount: number): string => { 
        return amount < 0 ? amount.toString() : `${amount}` 
    }

    const getAccountAmount = async (accountId: number) => {
        dataLoaded = false
        try{
            await TransactionService.CalculateAccountsAmount({ownerId: 1, accounts: [accountId]})
            const accountSearchResult = await TransactionService.SearchAccounts({ownerId: 1, id: accountId})
            accounts[accountId].amount = accountSearchResult[0].amount
        }
        catch{ 
            alert('server error') 
            accounts[accountId].amount = 0
        }
        finally{ dataLoaded = true }
    }

    let dataLoaded = true
</script>

<div class="data">
    {#if !dataLoaded}
    <div class="mask"><div class="loader"></div></div>
    {/if}
    <table>
        <tr>
            {#each headers as header}
            <th class="aln-l">{header}</th>
            {/each}
        </tr>
        {#each Object.entries(accounts) as [accountId, account]}
        {#if account.active}
        <tr>
            <td class="aln-l w-10pc">{accountId}</td>
            <td class="aln-l w-35pc">{account.name}</td>
            <td class="aln-l w-30pc">{formatAmount(account.amount)}</td>
            <td class="aln-l w-10pc">{accountCurrencyMap[accountId] ?? ''}</td>
            <td class="aln-c w-15pc"><button class="button-text-only" on:click={() => {getAccountAmount(account.id)}}>&#10226;</button></td>
        </tr>
        {/if}
        {/each}
    </table>
</div>

<style lang="scss">
    @import '../styles/app.scss';
    
    .data{ overflow-y: auto; height: 100%;} 
    .inactive { background-color: $accent-color-light;}
    tr { position: relative; }
</style>