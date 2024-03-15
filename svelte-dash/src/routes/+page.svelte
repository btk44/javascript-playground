<script lang="ts">
    let expandSidebar = false;
    const sidebarButtons = [ 
        { icon: '&#x2661;', text: 'option 1', clickAction: () => { alert("1")}},
        { icon: '&#x2662;', text: 'option 2', clickAction: () => { alert("2")}},
        { icon: '&#x2664;', text: 'option 3', clickAction: () => { alert("3")}},
        { icon: '&#x2667;', text: 'option 4', clickAction: () => { alert("4")}},
    ]
</script>

<div class={'main-page' + (expandSidebar ? ' with-sidebar-expanded' : '')}>
    <div class="header">
        <button on:click={() => { expandSidebar = !expandSidebar}} class="button-text-only header-menu-button">
            {#if expandSidebar} &#x276E; {:else} &#x2630; {/if} 
        </button>
        <button on:click={() => {  }} class="button-text-only nav-button">
            Page 1
        </button>
    </div>
    <div class="content"></div>
    <div class="sidebar">
        {#each sidebarButtons as button}
        <button class="button-text-only side-button" on:click={button.clickAction}>
            <span class="image">{@html button.icon}</span><span class="text">{button.text}</span>
        </button>
        {/each}
    </div>
</div>

<style lang="scss">
    @import "../styles/app.scss";

    //reset all
    :global(body) { margin: 0; padding: 0; font-family: "Source Code Pro", monospace; font-optical-sizing: auto; font-weight: 500; font-style: normal; }
	:global(*) { box-sizing: border-box; background-color: transparent;	margin: 0; padding: 0; width: 100%; 
                 font-family: inherit; font-optical-sizing: inherit; font-weight: inherit; font-style: inherit; }

    //set global styles
    :global(body) { margin: 0; display: flex; place-items: center; min-width: 320px; min-height: 100vh; background-color: $background-color; }
    

    // main page styles
    $header-size: 60px;
    $side-size: 200px;

    .main-page {
        * {
            -webkit-transition: all 0.1s ease-in-out;
            -moz-transition: all 0.1s ease-in-out;
            -o-transition: all 0.1s ease-in-out;
            transition: all 0.1s ease-in-out;
        }
    }

    button { line-height: $header-size; }
    span { line-height: $header-size;}

    .header { 
        position: fixed; top: 0; left: 0;
        z-index: 3; 
        background-color: $primary-color; 
        color: $text-color; 
        width: 100vw;
    }
    .content { 
        position: fixed; top: 0; left: $header-size;
        z-index: 2; 
        padding: calc(10px + $header-size) 10px 10px 10px;
        background-color: $background-color;
        height: 100vh;
        width: calc(100vw - $header-size);
        overflow-y: auto;
    }
    .sidebar { 
        position: fixed; top: 0; left: 0;
        z-index: 1;
        padding-top: $header-size; 
        border-right: 1px solid $primary-color;
        button {
            background-color: $primary-color-dark;
        }
        width: $side-size;
        height: 100vh;
        background-color: $primary-color-dark;
    }

    .with-sidebar-expanded{
        .header { left: $side-size; width: calc(100vw - $side-size); }
        .content { left: $side-size; width: calc(100vw - $side-size); }
    }

    .header-menu-button { width: $header-size; background-color: $primary-color; }
    .nav-button { width: auto; padding-left: 1rem; padding-right: 1rem; background-color: $primary-color; }
    .side-button { 
        display: grid; grid-template-columns: 60px 1fr; grid-template-rows: 1fr;
        
        .image { grid-column: 1; }
        .text { grid-column: 2; text-align: left; padding-left: 10px; }
    }
</style>

