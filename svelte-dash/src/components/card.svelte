<div class="card">
    <slot/>
</div>

<style lang="scss">
    @import '../styles/app.scss';

    .card {
        padding: 5px;
        box-shadow: $control-box-shadow;
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
        //height: 100%;
    }
</style>