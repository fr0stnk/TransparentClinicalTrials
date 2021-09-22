<script>

	import { fly, scale } from 'svelte/transition'
	import { quintOut } from 'svelte/easing'
	import { createEventDispatcher } from 'svelte'
	import { searchTerms } from '../../stores.js'

	export let searchTips;
	export let searchPropsArray = [];
	export let searchTerm = "";
	export let searchButton = "Text";
	export let searchButtonClicked = false;
	export let chosenElement = -1;
	$ :$searchTerms = searchPropsArray;

	const dispatch = createEventDispatcher()

	$: uniqueSearchTips = searchTips.filter(function(item, pos) {
		return searchTips.indexOf(item) == pos;
	})

	$ :visibleSearchTips = uniqueSearchTips.filter((tip) => {
		return tip.toLowerCase().includes(searchTerm.toLowerCase());
	})
	function removeDiv (i) {
		if ($searchTerms.length > -1) {
			searchPropsArray.splice(i, 1);
			$searchTerms = searchPropsArray;
    		event.target.parentNode.remove();
    	}
	}
	function chooseSearchTip (e) {
		searchPropsArray.push(e.target.innerHTML);
		searchPropsArray = searchPropsArray;
		searchTerm = "";
		searchButtonClicked = true;
		// $searchTerms = searchPropsArray;
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
			if (!searchButtonClicked && document.querySelectorAll(".focused").length > 0) {
				searchTerm = document.querySelector(".focused").innerHTML;
				searchPropsArray.push(searchTerm);
				searchPropsArray = searchPropsArray;
				searchTerm = "";
				searchButtonClicked = true;
			} else {
				passSearchTerm();
			}
		}
	}
	function passSearchTerm () {
		searchButtonClicked = true;
		dispatch("searchTermPassed", {
			"passedSearchTerm": searchPropsArray,
		})
	}

	let focus = false;

</script>

<main>
	
	<div class="searchBar">
		<p class="searchDescription">
			Здесь укажите название протокола или диагноз:
		</p>
		<div class="inputContainer">
			<div class="searchArray">
				{#each searchPropsArray as elem, i}
					<div transition:scale="{{duration: 200, delay: 0, opacity: 0.25, start: 0.25, easing: quintOut}}" class="searchArraySpan">{elem}
						<div on:click={() => removeDiv(i)} class="removeSearchArraySpan">
						</div>
					</div>
				{/each}
			</div>
			<input autocomplete="off" 
			placeholder="Рак легких, рак мозга" 
			onfocus="placeholder=''"
			type="text" 
			bind:value={searchTerm} 
			on:keydown={chooseSearchTipWithKeys} 
			on:keypress={onKeyPress} 
			on:click={defocusAndDeclick} 
			on:input={defocusAndDeclick} 
			on:focus={() => {focus = true}} 
			on:blur={() => {focus = false}}>
		</div>
	</div>

	{#if searchTerm.length && !searchButtonClicked && focus == true}
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
		align-items: center;
	}
	.visibleSearchTipsContainer {
		@include base.flex;
		flex-flow: column;
		position: sticky;
		min-width: fit-content;
		max-width: 240px;
		max-height: fit-content;
		background: base.$white;
		box-shadow: rgba(100, 100, 110, 0.08) 0px 2px 29px 0px;
		border-radius: 12px;
		overflow: hidden;
		overflow-y: scroll;
		@media (max-width: base.$phone) {
			max-width: 85%;
		}
		& button {
			@include base.reset;
			@include base.sizes($m: 4px, $p: 8px);
			border-radius: 4px;
			min-width: fit-content;
			max-width: 360px;
			text-align: center;
			@media (max-width: base.$phone) {
				min-width: fit-content;
			}
			&:hover {
				background-color: base.$darkWhite;
				cursor: pointer;
			}
		}
	}
	.searchButton {
		@include base.reset;
		@include base.sizes($h: 40px, $p: 4px);
		background: base.$button;
		color: base.$white;
		cursor: pointer;
		min-width: 40px;
		border-radius: 4px;
		margin-top: 16px;
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
		padding: 8px;
	}
	.searchArray {
        @include base.flex($wrap: wrap, $justify: flex-start);
    }
    .searchArraySpan {
        @include base.flex($wrap: nowrap, $justify: flex-start);
        max-height: fit-content;
        padding: 4px;
        margin: 2px 2px 2px 2px;
        background: lightGrey;
        color: color;
        border-radius: 6px;
    }
    .removeSearchArraySpan {
        max-height: 10px;
        font-size: 14px;
        margin: 2px;
        padding: 4px;
        cursor: pointer;
        border-radius: 4px;
        background: darkgrey;
        &:hover {
            background: base.$darkWhite;
        }
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
	input {
		@include base.reset;
		@include base.sizes($h: 30px, $p: 4px);
		@include base.fonts($size: 16px);
		min-width: 200px;
		@media (max-width: base.$phone) {
			width: auto;
			min-width: 260px;
		}
	}
	.focused {
		background: base.$darkWhite !important;
	}
</style>