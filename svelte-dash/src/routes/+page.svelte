<script>
	import SideDrawer from '../components/side-drawer.svelte';

    let showSideDrawer = true;
</script>

<div class={'main-page' + (showSideDrawer ? ' with-side' : '')}>
    <div class="header">
        <button on:click={() => { showSideDrawer = !showSideDrawer}} class="button-text-only side-menu-button">
            &#x2630;
        </button>
        <button on:click={() => { }} class="button-text-only nav-button">
            Page 1
        </button>
    </div>
    {#if showSideDrawer}
    <div class="side">
        <SideDrawer></SideDrawer>
    </div>
    {/if}
    <div class="content">
    </div>
</div>

<style lang="scss">
    @import "../styles/app.scss";

    $header-size: 60px;
    $side-size: 200px;

    .main-page {
        display: grid;
        grid-template-columns: 0 1fr;
        grid-template-rows: $header-size 1fr;
        grid-template-areas: 
            "side header"
            "side content";
        -webkit-transition: all 1s linear;
        -moz-transition: all 1s linear;
        -o-transition: all 1s linear;
        transition: all 1s linear;
    }

    .with-side {
        grid-template-columns: $side-size 1fr;
        -webkit-transition: all 1s linear;
        -moz-transition: all 1s linear;
        -o-transition: all 1s linear;
        transition: all 1s linear;
    }

    button { line-height: $header-size; width: auto; padding-left: 1rem; padding-right: 1rem; }
    span { line-height: $header-size;}

    .header { grid-area: header; background-color: lightblue; }
    .side { grid-area: side; padding-top: $header-size; background-color: gray;}
    .content { grid-area: content; }

    .side-menu-button { width: $header-size; }
</style>

