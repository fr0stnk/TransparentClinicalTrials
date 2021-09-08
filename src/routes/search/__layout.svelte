
<div class="navbar">
    <p><a sveltekit:prefetch href="/">На главную</a></p>
    <p><a sveltekit:prefetch href="/search/searchPage">К поиску</a></p>
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
        @include base.flex($flow: row, $justify: flex-start);
        & p a {
            @include base.flex();
            @include base.sizes($w: 160px, $h: 40px, $m: 6px);
            @include base.reset;
            background: base.$darkWhite;
            border-radius: 8px;
            cursor: pointer;
            color: black;
            &:hover {
                background: base.$lightGrey;
            }
        }
    }

</style>