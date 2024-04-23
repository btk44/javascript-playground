<script lang="ts">
	import { GetEmptyTransaction, type Transaction }  from '../models/transaction'
    import { getStoreAccounts, getStoreCategories } from '../services/data-store'
	import { createEventDispatcher } from 'svelte';

    const inputId = 'transaction-input'

    export const initTransaction = (initTransaction: Transaction) => {  
        transaction = initTransaction
        if(transaction.id > 0){
            currentInput = `${initTransaction.accountId} ${initTransaction.categoryId} ${initTransaction.amount} ${initTransaction.comment ?? ''}`
        }
        else 
            currentInput =  ''
    }

    export let readonly: boolean
    export let disabled: boolean
    export const focus = () => { document.getElementById(inputId).focus() }
    export const blur = () => { document.getElementById(inputId).blur() }

    const dispatch = createEventDispatcher();
    const isNumber = (input: string): boolean => { return !isNaN(+input) }
    const resetErrorFlags = () => { accountError = categoryError = amountError = false }
    const accounts = getStoreAccounts()
    const categories = getStoreCategories()

    let accountError = false
    let categoryError = false
    let amountError = false
    $: hasError = categoryError || accountError || amountError
    $: isDataMissing = !(transaction.accountId > 0 && transaction.categoryId > 0)

    const processAccountInput = (inputValue: string | undefined | null): void => {
        if(!inputValue){
            transaction.accountId = 0
            return
        }
        
        let accountId: number | null = null
        if(isNumber(inputValue)) accountId = +inputValue
        if(accountId != null && accounts[accountId]) { 
            transaction.accountId = accountId
            accountError = false
        }
        else {
            transaction.accountId = 0
            accountError = true
        }
    }

    const processCategoryInput = (inputValue: string | undefined | null): void => {
        if(!inputValue){
            transaction.categoryId = 0
            return
        }

        let categoryId: number | null = null
        if(isNumber(inputValue)) categoryId = +inputValue
        if(categoryId != null && categories[categoryId]) { 
            transaction.categoryId = categoryId
            categoryError = false
        }
        else{
            transaction.categoryId = 0
            categoryError = true
        } 
    }
    
    const processAmountInput = (inputValue: string | undefined | null): void => {
        if(!inputValue){
            transaction.amount = 0
            return
        }

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

        if (event.key === "Escape") inputCancel()

        if(currentInput && currentInput.trim() !== ''){
            const inputValues = currentInput.match(/\s{0,}[^\s]{1,}/g)

            if(inputValues){
                processAccountInput(inputValues[0])
                processCategoryInput(inputValues[1])
                processAmountInput(inputValues[2])

                transaction.comment = currentInput.replace(inputValues[0], '')
                                                  .replace(inputValues[1], '')
                                                  .replace(inputValues[2], '').trim()

                if(event.key === 'Enter') inputSubmit()
                else inputUpdate()
            }
        }
    }

    const inputFocus = () => dispatch('transactionEditStart')
    const inputBlur = () => dispatch('transactionEditStop')
    const inputUpdate = () => dispatch('transactionChange', { transaction })

    const inputSubmit = () => {
        if(!hasError && !isDataMissing){
            dispatch('transactionSubmit', { transaction })
        }
    }
    const inputCancel = () => {
        currentInput = ''
        resetErrorFlags()
        dispatch('transactionCancel')
    }

    let transaction: Transaction = GetEmptyTransaction()
    let currentInput: string = ''
</script>
<div class="transaction-input">
    <div class="input-group">
        <input type="text" name={inputId} id={inputId} placeholder="0 0 -0.00 xxxx" 
                on:keyup={processInput} 
                on:focus={inputFocus}
                on:blur={inputBlur} 
                bind:value={currentInput}
                readonly={readonly}
                disabled={disabled}/>
        <label for={inputId}>
            <span class={accountError ? 'error-text': ''}>konto*</span>
            <span class={categoryError ? 'error-text': ''}>kategoria*</span>
            <span class={amountError ? 'error-text': ''}>kwota*</span>
            <span>płatnik</span>
        </label>
    </div>
    <div class="button-group">
        <button class="button-outlined" on:click={inputSubmit} disabled={hasError || isDataMissing || disabled}>&#x2713;</button>
        <button class="button-outlined" on:click={inputCancel} disabled={disabled}>&#x2715;</button>
    </div>
</div>


<style lang="scss">
    @import '../styles/app.scss';

    .transaction-input {  
        display: flex; gap: 5px; flex-direction: row; justify-content: left;
        .input-group { display: flex; flex-direction: column; align-items: center;
                       flex-grow: 0; }
        .button-group { display: flex; gap: inherit; align-items: flex-start; 
                        flex-grow: 0; }
    }

    input { width: 400px; text-align: center;}
    label { margin-top: 5px;}
</style>