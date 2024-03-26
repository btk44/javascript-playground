<script lang="ts">
	import { GetEmptyTransaction, type Transaction }  from '../models/transaction'
    import { accountDictionary, categoryDictionary } from '../data-fakes/data'
	import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    const isNumber = (input: string): boolean => { return !isNaN(+input) }
    const setError = (errorMessage: string | undefined | null): void => { inputError = errorMessage ? errorMessage : '-'}

    const processAccountInput = (inputValue: string): void => {
        let accountId: number | null = null
        if(isNumber(inputValue)) accountId = +inputValue
        if(accountId != null && accountDictionary[accountId]) { 
            transaction.accountId = accountId
        }
        else {
            transaction.accountId = 0
            setError('account id is incorrect')
        }
    }

    const processCategoryInput = (inputValue: string): void => {
        let categoryId: number | null = null
        if(isNumber(inputValue)) categoryId = +inputValue
        if(categoryId != null && categoryDictionary[categoryId]) { 
            transaction.categoryId = categoryId
        }
        else{
            transaction.categoryId = 0
            setError('category id is incorrect')
        } 
    }
    
    const processAmountInput = (inputValue: string): void => {
        transaction.amount = 0
        if(isNumber(inputValue)) transaction.amount = +inputValue
        else setError('amount is incorrect')
    }

    const processInput = (event: any) => {
        setError(null)
        const control = event.target

        if(currentInput.trim() !== ''){
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

                if(event.key === 'Enter' || event.keyCode === 13){
                    dispatch('transactionSubmit', { transaction })
                    currentInput = `${transaction.accountId} `
                    transaction = { ...GetEmptyTransaction(), accountId: transaction.accountId}
                }
                else 
                    dispatch('transactionChange', { transaction })
            }
        }
    }

    const inputFocus = () => dispatch('transactionEditStart')
    const inputBlur = () => dispatch('transactionEditStop')

    let currentInput: string;
    let inputError: string;
    let transaction: Transaction = GetEmptyTransaction()
</script>

<input type="text" name="transaction-input" id="transaction-input" 
        bind:value={currentInput} 
        on:keyup={processInput} 
        on:mouseup={processInput} 
        on:focus={inputFocus}
        on:blur={inputBlur} />
<label for="transaction-input">test</label>

<style lang="scss">
    //@import '../styles/app.scss';

    input { min-width: 300px; min-height: 50px; }
</style>