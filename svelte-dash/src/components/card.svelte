<div class="card">
    <slot/>
</div>

<style lang="scss">
    @import '../styles/app.scss';

    .card {
        display: inline-block;
        height: 40px; width: 100%;
        margin: 1px 0;
        background-color: $background-color;
        border: 1px solid lightgray;
        box-shadow: 1px 1px 3px rgb(125, 121, 121);
    }
</style>