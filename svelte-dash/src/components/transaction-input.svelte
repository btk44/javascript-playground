<script lang="ts">
	import { GetEmptyTransaction, type Transaction }  from '../models/transaction'
    import { accountDictionary, categoryDictionary } from '../data-fakes/data'
	import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    const isNumber = (input: string): boolean => { return !isNaN(+input) }
    const resetErrorFlags = () => { accountError = categoryError = amountError = false }
    let accountError = false
    let categoryError = false
    let amountError = false


    const processAccountInput = (inputValue: string): void => {
        let accountId: number | null = null
        if(isNumber(inputValue)) accountId = +inputValue
        if(accountId != null && accountDictionary[accountId]) { 
            transaction.accountId = accountId
            accountError = false
        }
        else {
            transaction.accountId = 0
            accountError = true
        }
    }

    const processCategoryInput = (inputValue: string): void => {
        let categoryId: number | null = null
        if(isNumber(inputValue)) categoryId = +inputValue
        if(categoryId != null && categoryDictionary[categoryId]) { 
            transaction.categoryId = categoryId
            categoryError = false
        }
        else{
            transaction.categoryId = 0
            categoryError = true
        } 
    }
    
    const processAmountInput = (inputValue: string): void => {
        transaction.amount = 0
        if(isNumber(inputValue)){
            amountError = false
            transaction.amount = +inputValue
        } 
        else amountError = true
    }

    const processInput = (event: any) => {
        resetErrorFlags()

        if(currentInput && currentInput.trim() !== ''){
            const inputValues = currentInput.match(/\s{0,}[^\s]{1,}/g)

            if(inputValues){
                if(inputValues[0]) {
                    processAccountInput(inputValues[0])
                }
                if(inputValues[1]){
                    processCategoryInput(inputValues[1])
                }

                if(inputValues[2]) processAmountInput(inputValues[2])
                transaction.payee = currentInput.replace(inputValues[0], '').replace(inputValues[1], '').replace(inputValues[2], '').trim()

                if(event.key === 'Enter'){
                    if (inputError !== '&nbsp;'){
                        dispatch('transactionChange', { transaction })
                        return
                    }

                    dispatch('transactionSubmit', { transaction })

                    // assumption that user will want to enter another transaction for the same account
                    currentInput = `${transaction.accountId} `
                    transaction = { ...GetEmptyTransaction(), accountId: transaction.accountId}
                    dispatch('transactionChange', { transaction })
                }
                else if (event.key === "Escape"){
                    currentInput = ''
                    resetErrorFlags()
                    transaction = GetEmptyTransaction()
                    dispatch('transactionChange', { transaction })
                }
                else
                    dispatch('transactionChange', { transaction })
            }
        }
        else if (event.key === "Escape") {
            event.currentTarget.blur()
            dispatch('transactionEditStop')
        }
    }

    const inputFocus = () => dispatch('transactionEditStart')
    const inputBlur = () => dispatch('transactionEditStop')

    let currentInput: string;
    let inputError: string = '&nbsp;';
    let transaction: Transaction = GetEmptyTransaction()
</script>

<input type="text" name="transaction-input" id="transaction-input" placeholder="wprowadź transakcję" 
        bind:value={currentInput} 
        on:keyup={processInput} 
        on:mouseup={processInput} 
        on:focus={inputFocus}
        on:blur={inputBlur} />
        <br>
<label for="transaction-input">
    <span class={accountError ? 'error-text': ''}>konto*</span>
    <span class={categoryError ? 'error-text': ''}>kategoria*</span>
    <span class={amountError ? 'error-text': ''}>kwota*</span>
    <span>płatnik</span>
</label>

<style lang="scss">
    @import '../styles/app.scss';

    input { min-width: 50%; text-align: center; }
</style>