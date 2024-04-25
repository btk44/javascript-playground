<script lang="ts">
    import { accountStoreReadOnly, accountCurrencyMap } from '../services/store'
  
    const headers = ['id', 'nazwa', 'kwota', '-'] 
    const accountCurrency = accountCurrencyMap()

    let accounts = $accountStoreReadOnly
    accountStoreReadOnly.subscribe((data) => {accounts = data})

    const formatAmount = (amount: number): string => { 
        return amount < 0 ? amount.toString() : `${amount}` 
    }
</script>

<div class="data">
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
            <td class="aln-l w-10pc">{accountCurrency[accountId] ?? ''}</td>
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