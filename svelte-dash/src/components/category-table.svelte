<script lang="ts">
	import { type Category } from "../models/category";
	import { categoryStoreRO } from "../services/store";
    
    const headers = ['id', 'nazwa'] 
    const categories = (() => { 
        const originalCategories = $categoryStoreRO  // subscribe instead
        const originalCategoriesList = Object.entries(originalCategories).map(([k,v])=> v)
        let result: Array<Category> = []
        originalCategoriesList.filter(x => x.parentId === 0).forEach(x => {
            result.push(x)
            result = result.concat(originalCategoriesList.filter(y => y.parentId === x.id))
        })
        
        return result
    })()
</script>

<div class="data">
    <table>
        <tr>
            {#each headers as header}
            <th class="aln-l">{header}</th>
            {/each}
        </tr>
        {#each categories as category}
        <tr>
            <td class="aln-l w-10pc">{category.parentId > 0 ? '-->' : category.id}</td>
            <td class="aln-l w-90pc">{(category.parentId > 0 ? category.id + '  :  ' : '') + category.name}</td>
        </tr>
        {/each}
    </table>
</div>

<style lang="scss">
    @import '../styles/app.scss';
    
    .data{ overflow-y: auto; height: 100%;} 
</style>