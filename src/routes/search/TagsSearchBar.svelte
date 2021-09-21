<script>

import { scale, fly } from 'svelte/transition';
import { quintOut } from 'svelte/easing';

let searchProps = [];
let searchTerm = "";
export let searchTags;

$ :visibleSearchTips = searchTags.filter((tag) => {
		return tag.toLowerCase().includes(searchTerm.toLowerCase());
	})

function removeDiv (e) {
    e.target.parentNode.remove();
}

function onKeyPress (e) {
        if (e.charCode == 13) {
			e.preventDefault();
            if (searchTerm.length) {
            searchProps.push(searchTerm);
            searchProps = searchProps;
            searchTerm = "";
            } else {
                return;
            }
		}
    }

</script>

<main>
    <div class="searchBar">
        <p class="searchDescription">
			Здесь укажите вид терапии, город или статус набора пациентов:
		</p>
        <div class="inputContainer">
            <div class="searchArray">
                {#each searchProps as elem}
                    <div transition:scale="{{duration: 200, delay: 0, opacity: 0.25, start: 0.25, easing: quintOut}}" class="searchArraySpan">{elem}
                        <div on:click={removeDiv} class="removeSearchArraySpan">
                        </div>
                    </div>
                {/each}
            </div>
            <input autocomplete="off" placeholder="Москва, ведется набор, химиотерапия" onfocus="placeholder=''" on:keypress={onKeyPress} bind:value={searchTerm} class="input">
        </div>
    </div>
	{#if searchTerm.length}
    <div transition:fly={{ y: 20, duration: 125 }} class="visibleSearchTipsContainer">
    {#each visibleSearchTips as tips}
        <div class="visibleSearchTips">
            <button id="tipsButton" class="focused">{tips}</button>
        </div>
    {:else}
        <p>Ничего не нашлось. Измените запрос</p>
    {/each}
    </div>
    {/if}
</main>

<style lang='scss'>

@use '../base';

    main {
		@include base.flex($flow: column, $justify: flex-start);
		font-family: sans-serif;
		padding: 4px 20px 20px 20px;
        margin: 10px;
        border-radius: 8px;
        filter: grayscale(100%);
        background: base.$darkWhite;
        pointer-events: none;
	}
    .searchBar {
		@include base.flex($flow: column);
		align-items: flex-start;
	}
    .searchDescription {
		@include base.fonts($size: 12px, $weight: 600);
        max-width: 260px;
		color: base.$button;
		padding: 8px;
	}
    .inputContainer {
        @include base.flex($justify: flex-start, $wrap: wrap, $flow: row);
		@include base.sizes($p: 4px, $m: 6px);
		border: 1px base.$lightGrey solid;
		border-radius: 10px;
        min-height: 30px;
        min-width: 260px;
        max-width: 360px;
		@media (max-width: base.$phone) {
			width: auto;
			min-width: 260px;
		}
	}
    .input {
        @include base.flex($justify: flex-start, $flow: row);
		@include base.reset;
        @include base.sizes($w: 360px, $h: 30px, $p: 2px, $m: 2px);
		@include base.fonts($size: 16px);
        min-height: 20px;
		@media (max-width: base.$phone) {
			width: auto;
			min-width: 260px;
		}
	}
    .searchArray {
        @include base.flex($wrap: wrap, $justify: flex-start);
    }
    .searchArraySpan {
        @include base.flex($wrap: nowrap, $justify: flex-start);
        max-height: 20px;
        padding: 4px;
        margin: 2px 2px 2px 2px;
        background: lightGrey;
        color: color;
        border-radius: 6px;
    }
    .removeSearchArraySpan {
        max-height: 10px;
        font-size: 12px;
        margin: 2px;
        padding: 4px;
        cursor: pointer;
        border-radius: 4px;
        background: darkgrey;
        &:hover {
            background: base.$darkWhite;
        }
    }
    .visibleSearchTipsContainer {
		@include base.flex;
		position: relative;
		// margin-top: 96px;
		width: 380px;
		background: base.$white;
		box-shadow: rgba(100, 100, 110, 0.08) 0px 2px 29px 0px;
		border-radius: 12px;
		& button {
			@include base.reset;
			@include base.sizes($m: 4px, $p: 8px);
			border-radius: 4px;
			min-width: 340px;
			text-align: left;
			&:hover {
				background-color: base.$darkWhite;
				cursor: pointer;
			}
		}
	}

</style>