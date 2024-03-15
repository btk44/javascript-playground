<script lang="ts">

</script>

<button class="button-text-only" on:click={() => { alert("x")}}>&#x2661; option 1</button>
<button class="button-text-only" on:click={() => { alert("x")}}>&#x2662; option 2</button>
<button class="button-text-only" on:click={() => { alert("x")}}>&#x2664; option 3</button>
<button class="button-text-only" on:click={() => { alert("x")}}>&#x2667; option 4</button>

<style lang="scss">
    @import '../styles/app.scss';

    button { display: block; height: 60px; }
</style>