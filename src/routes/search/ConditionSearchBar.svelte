<script>

	import { fly } from 'svelte/transition'
	import { createEventDispatcher } from 'svelte'

	export let searchTips;
	export let searchTerm = "";
	export let searchButton = "Text";
	export let searchButtonClicked = false;
	export let chosenElement = -1;

	const dispatch = createEventDispatcher()

	$ :visibleSearchTips = searchTips.filter((tip) => {
		return tip.toLowerCase().includes(searchTerm.toLowerCase());
	})

	function chooseSearchTip (e) {
		searchTerm = e.target.innerHTML;
		searchButtonClicked = true;
	}
	function defocusAndDeclick () {
		document.querySelectorAll(".focused").forEach(item => item.classList.toggle("focused"));
		searchButtonClicked = false;
	}
	function chooseSearchTipWithKeys (e) {
    if (e.keyCode == 38) {
        e.preventDefault()
        chosenElement -= 1;
        if (chosenElement < 0) {
            chosenElement = -1;
            document.querySelectorAll("#tipsButton")[0].classList.toggle("focused");
            return;
        } else {
        document.querySelectorAll("#tipsButton")[chosenElement+1].classList.toggle("focused");
        document.querySelectorAll("#tipsButton")[chosenElement].classList.toggle("focused");
        }
    }
    if (e.keyCode == 40) {
        e.preventDefault()
        chosenElement += 1;
        if (chosenElement == visibleSearchTips.length) {
            chosenElement = 0;
            document.querySelectorAll("#tipsButton")[visibleSearchTips.length-1].classList.toggle("focused");
            document.querySelectorAll("#tipsButton")[chosenElement].classList.toggle("focused");
        } else if (chosenElement == 0) {
            document.querySelectorAll("#tipsButton")[chosenElement].classList.toggle("focused");
        } else {
        document.querySelectorAll("#tipsButton")[chosenElement-1].classList.toggle("focused");
        document.querySelectorAll("#tipsButton")[chosenElement].classList.toggle("focused");
        }
    }
}
	function onKeyPress (e) {
		if (e.charCode == 13) {
			e.preventDefault();
			chosenElement = -1;
			if (!searchButtonClicked) {
				searchTerm = document.querySelector(".focused").innerHTML;
				searchButtonClicked = true;
			} else {
				passSearchTerm();
			}
		}
	}
	function passSearchTerm () {
		searchButtonClicked = true;
		dispatch("searchTermPassed", {
			"passedSearchTerm": searchTerm,
		})
	}

</script>

<main>
	
	<div class="searchBar">
		<p class="searchDescription">Здесь укажите название протокола или диагноз:</p>
	<input autocomplete="off" placeholder="Введите запрос здесь" onfocus="placeholder=''" type="text" bind:value={searchTerm} on:keydown={chooseSearchTipWithKeys} on:keypress={onKeyPress} on:input={defocusAndDeclick}>
	<button class="searchButton" on:click={passSearchTerm}>Искать</button>
	</div>

	{#if searchTerm.length && !searchButtonClicked}
		<div transition:fly={{ y: 20, duration: 125 }} class="visibleSearchTipsContainer">
		{#each visibleSearchTips as tips}
			<div class="visibleSearchTips">
				<button id="tipsButton" class="focused" bind:this={searchButton} on:click={chooseSearchTip}>{tips}</button>
			</div>
		{:else}
			<p>Ничего не нашлось. Измените запрос</p>
		{/each}
		</div>
	{/if}

</main>

<style lang="scss">

@use '../base';

	p {
		@include base.reset;
		@include base.sizes($m: 4px, $p: 4px);
		border-radius: 4px;
		max-width: 280px;
	}
	main {
		@include base.flex($flow: column, $justify: flex-start);
		max-height: 500px;
		font-family: sans-serif;
		padding: 4px 20px 20px 20px;
	}
	.searchBar {
		@include base.flex($flow: column);
		align-items: flex-start;
		@media(max-width: base.$phone) {
			flex-direction: column;
		}
	}
	.visibleSearchTipsContainer {
		@include base.flex;
		position: absolute;
		margin-top: 50px;
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
	.searchButton {
		@include base.reset;
		@include base.sizes($h: 40px, $m: 4px, $p: 4px);
		background: base.$button;
		color: base.$white;
		cursor: pointer;
		min-width: 40px;
		border-radius: 4px;
		@media (max-width: base.$phone) {
			min-width: 100%;
		}
		&:hover {
			background: base.$activatedButton;
		}
	}
	.searchDescription {
		@include base.fonts($size: 12px, $weight: 600);
		color: base.$button;
	}
	input {
		@include base.reset;
		@include base.sizes($w: 320px, $h: 30px, $p: 4px);
		@include base.fonts($size: 16px);
		border: 1px base.$lightGrey solid;
		border-radius: 4px;
	}
	.focused {
		background: base.$darkWhite !important;
	}
</style>