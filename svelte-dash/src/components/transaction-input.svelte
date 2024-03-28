<script lang="ts">
	import { GetEmptyTransaction, type Transaction }  from '../models/transaction'
    import { accountDictionary, categoryDictionary } from '../data-fakes/data'
	import { createEventDispatcher } from 'svelte';

    export const initInput = (initTransaction: Transaction) => {  
        transaction = initTransaction
        if(transaction.id > 0){
            currentInput = `${initTransaction.accountId} ${initTransaction.categoryId} ${initTransaction.amount} ${initTransaction.payee ?? ''}`
        }
        else 
            currentInput =  ''
    }

    const dispatch = createEventDispatcher();

    const isNumber = (input: string): boolean => { return !isNaN(+input) }
    const resetErrorFlags = () => { accountError = categoryError = amountError = false }
    const emptyHtml = '&nbsp;'

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

        let currentInput = event.target.value

        if (event.key === "Escape") {
            event.target.value = ''
            resetErrorFlags()
            event.currentTarget.blur()
            dispatch('transactionEditCancel')
        }

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
                    if (inputError !== emptyHtml){
                        dispatch('transactionChange', { transaction })
                        return
                    }

                    dispatch('transactionSubmit', { transaction })
                    event.target.value = ''
                }
                else
                    dispatch('transactionChange', { transaction })
            }
        }
    }

    const inputFocus = () => dispatch('transactionEditStart')
    const inputBlur = () => dispatch('transactionEditStop')

    let transaction: Transaction = GetEmptyTransaction()
    let currentInput: string = ''
    let inputError: string = emptyHtml;
</script>

<input type="text" name="transaction-input" id="transaction-input" placeholder="wprowadź transakcję" 
        on:keyup={processInput} 
        on:focus={inputFocus}
        on:blur={inputBlur} 
        bind:value={currentInput}/>
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