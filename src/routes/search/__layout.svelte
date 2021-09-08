
<div class="navbar">
    <p><a href="/">На главную</a></p>
    <p><a href="/search/searchPage">К поиску</a></p>
</div>
<div class="style">
	<slot />
</div>

<style lang="scss"> 

@use '../base';

	* {
		font-family: sans-serif;
	}
    .navbar {
        @include base.flex($flow: row, $justify: center);
        & p {
            @include base.flex();
            @include base.sizes($w: 200px, $h: 40px, $m: 6px);
            background: base.$button;
            border-radius: 4px;
            color: base.$white;
            cursor: pointer;
            &:hover {
                background: base.$activatedButton;
            }
            & a {
                @include base.reset;
                color: base.$white;
            }
        }
    }

</style>