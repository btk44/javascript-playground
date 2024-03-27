<script lang="ts">
    import { accountDictionary, accountCurrencyDictionary, accounts } from '../data-fakes/data'

    const headers = ['id', 'nazwa', 'kwota', '-'] 

    const formatAmount = (amount: number): string => { 
        return amount < 0 ? amount.toString() : `+${amount}` 
    }
</script>

<table>
    <tr>
        {#each headers as header}
        <th class="aln-l">{header}</th>
        {/each}
    </tr>
    {#each accounts.filter(a => a.active) as account}
    <tr on:click={() => { alert("!") }}>
        <td class="aln-l w-10">{account.id}</td>
        <td class="aln-l w-40">{accountDictionary[account.id] ?? ''}</td>
        <td class="aln-l w-30">{formatAmount(account.amount)}</td>
        <td class="aln-l w-20">{accountCurrencyDictionary[account.id] ?? ''}</td>
    </tr>
    {/each}
</table>

<style lang="scss">
    @import '../styles/app.scss';
    
</style>