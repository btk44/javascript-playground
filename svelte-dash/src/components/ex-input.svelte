<script lang="ts">
    import { accounts, categories, currencies } from '../data-fakes/data'

    interface Transaction {
        id: number,
        date: Date,
        accountId: number,
        categoryId: number,
        amount: number,
        payee: string
    }

    const savedTransactions: Transaction[] = []
    let transaction: Transaction = { id: 0, date: new Date(), accountId: 0, categoryId: 0, amount: 0, payee: ''}

    const buildCategoryList = () => {
        let categoryFinalList: any = []
        categories
            .filter(cat => cat.active && cat.parentId === 0)
            .forEach(parent => {
                categoryFinalList.push(parent)
                categories.filter(cat => cat.active && cat.parentId === parent.id)
                          .forEach(cat => categoryFinalList.push(cat))
        })

        return categoryFinalList;
    }

    const isNumber = (input: string): boolean => { return !isNaN(+input) }
    const setError = (errorMessage: string | undefined | null): void => { inputError = errorMessage ? errorMessage : '-'}

    const processAccountInput = (inputValue: string): void => {
        let accountId = 0
        if(isNumber(inputValue)) accountId = +inputValue
        if(accounts.some(acc => acc.active && acc.id === accountId)) { 
            transaction.accountId = accountId
        }
        else setError('account id is incorrect')
    }

    const processCategoryInput = (inputValue: string): void => {
        let categoryId = 0
        if(isNumber(inputValue)) categoryId = +inputValue
        if(categories.some(acc => acc.active && acc.id === categoryId)) { 
            transaction.categoryId = categoryId
        }
        else setError('category id is incorrect')
    }

    const processAmountInput = (inputValue: string): void => {
        if(isNumber(inputValue)) transaction.amount = +inputValue
        else setError('amount is incorrect')
    }
    
    
    const categoriesDisplayList = buildCategoryList()

    let inputError: string = '-'
    let currentInput = ''
    let tipContent = ''

    const processInput = (event: any) => {
        setError(null)
        const control = event.target
        const currentFocus = control.selectionStart

        if(currentInput.trim() !== ''){
            const inputValues = currentInput.match(/\s{0,}[^\s]{1,}/g)

            if(inputValues){
                if(inputValues[0]) {
                    processAccountInput(inputValues[0])
                    if(currentFocus <= inputValues[0].length) 
                        tipContent = 'a' 
                }
                if(inputValues[1]){
                    processCategoryInput(inputValues[1])
                    if(currentFocus > inputValues[0].length && currentFocus <= inputValues[1].length + inputValues[0].length)
                        tipContent = 'c'
                }

                if(inputValues[0] && inputValues[1] && currentFocus > inputValues[0].length + inputValues[1].length) 
                    tipContent = ''

                if(inputValues[2]) processAmountInput(inputValues[2])
                transaction.payee = currentInput.replace(inputValues[0], '').replace(inputValues[1], '').replace(inputValues[2], '').trim()
            }
        }
    }

    const processTransaction = () => {
        if(inputError === '-'){
            savedTransactions.push(transaction)
            transaction = { id: 0, date: new Date(), accountId: transaction.accountId, categoryId: transaction.categoryId, amount: 0, payee: ''}
            currentInput = `${transaction.accountId} ${transaction.categoryId} `
        }
    }
</script>

<div class="main-content">
    <input type="date" value="{ new Date().toISOString().split('T')[0] }"/>
    <select id="account" bind:value={transaction.accountId} disabled>
        {#each accounts as account}
        <option value={account.id}>
            {account.id} - {account.name}
        </option>
        {/each}
    </select>
    <select id="category" bind:value={transaction.categoryId} disabled>
        {#each categoriesDisplayList as category}
        <option value={category.id}>
            {category.parentId ? '-- ' : ''} {category.id} - {category.name} {category.parentId ? `(${category.parentId})` : ''}
        </option>
        {/each}
    </select>
    <input type="text" bind:value={transaction.amount} disabled/>
    <input type="text" bind:value={transaction.payee} disabled/>
    <br><br>
    <div class="input-section">
        {#if tipContent !== ''}<div class="tip" style="display: block;">
            {#if tipContent === 'a'}<div>
                {#each accounts as account}
                <div>{account.id} - {account.name}</div>
                {/each}
            </div> {/if}
            {#if tipContent === 'c'}<div>
                {#each categoriesDisplayList as category}
                <div>{category.parentId ? '-- ' : ''} {category.id} - {category.name} {category.parentId ? `(${category.parentId})` : ''}</div>
                {/each}
            </div> {/if}
        </div>{/if}
        <label for="input">account - category - amount - payee</label>
        <input type="text" name="input" id="input" bind:value={currentInput} on:keyup={processInput} on:mouseup={processInput} on:blur={() => {tipContent = ''}}/>
        <label for="input">{ inputError }</label>
    </div>
    <br>
    <button on:click={processTransaction}>OK</button>
</div>
<style lang="scss">
    .main-content { width: 80vw; border: 1px solid black; }
    label { display: block; padding: 1px 4px; font-size: small; margin: 0;}
    input, select, button { display: block; margin: 4px 0; height: 40px; padding: 1px 4px;}
    .input-section { position: relative;}
    .tip { width: 100%; height: 300px; position: absolute; top: -300px; left: 4px; overflow-y: auto; overflow-x: hidden; border: 1px red solid; background-color: white; font-size: small; padding: 4px;}
</style>