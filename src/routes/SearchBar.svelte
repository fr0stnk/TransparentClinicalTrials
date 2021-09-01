

<script>

	import { fly } from 'svelte/transition'
	import { createEventDispatcher } from 'svelte'
	const dispatch = createEventDispatcher()

	export let searchTips;
	export let searchTerm = "";
	export let searchButton = "Text";
	export let searchButtonClicked = false;
	export let chosendElement = -1;

	$ :visibleSearchTips = searchTips.filter((tip) => {
		return tip.toLowerCase().includes(searchTerm.toLowerCase());
	})

	$ :console.log(visibleSearchTips[0])

	function chooseSearchTip (e) {
		searchTerm = e.target.innerHTML;
		searchButtonClicked = true;
	}
	function onKeyPress (e) {
		if (e.charCode == 13) {
			passSearchTerm()
		}
	}
	function passSearchTerm () {
		searchButtonClicked = true;
		dispatch("searchTermPassed", {
			"passedSearchTerm": searchTerm,
		})
	}
	function chooseNextSearchTip (e) {
		if (e.keyCode == 40) {
			e.preventDefault()
			chosendElement += 1;
			searchTerm = visibleSearchTips[chosendElement];
		}
	}
	function choosePreviousSearchTip (e) {
		if (e.keyCode == 38) {
			e.preventDefault()
			chosendElement -= 1;
			searchTerm = visibleSearchTips[chosendElement];
		}
	}

</script>

<main>
	
	<div class="searchBar">
	<input autocomplete="off" placeholder="Введите запрос здесь" onfocus="placeholder=''" id="searchForName" type="text" bind:value={searchTerm} on:keydown={chooseNextSearchTip} on:keydown={choosePreviousSearchTip} on:keypress={onKeyPress} on:input={() => {searchButtonClicked = false} }>
	<button class="searchButton" on:click={passSearchTerm}>Искать</button>
	</div>

	{#if searchTerm.length && !searchButtonClicked}
		<div transition:fly={{ y: 20, duration: 125 }} class="visibleSearchTipsContainer">
		{#each visibleSearchTips as tips}
			<div class="visibleSearchTips">
				<button bind:this={searchButton} on:click={chooseSearchTip}>{tips}</button>
			</div>
		{:else}
			<p>Ничего не нашлось. Измените запрос</p>
		{/each}
		</div>
	{/if}

</main>

<style lang="scss">
	p {
		border: none;
		border-radius: 4px;
		background: none;
		color: none;
		outline: none;
		max-width: 280px;
		margin: 4px;
		padding: 4px;
	}
	main {
		display: flex;
		flex-flow: column;
		align-items: center;
		max-height: 500px;
		font-family: sans-serif;
	}
	.searchBar {
		display: flex;
		justify-content: center;
		align-items: center;
		@media(max-width: 600px) {
			flex-direction: column;
		}
	}
	.visibleSearchTipsContainer {
		position: absolute;
		display: flex;
		flex-flow: column;
		align-items: center;
		margin-top: 50px;
		width: 380px;
		background-color: white;
		box-shadow: rgba(100, 100, 110, 0.08) 0px 2px 29px 0px;
		border-radius: 12px;
	}
	.visibleSearchTips button {
		border: none;
		border-radius: 4px;
		background: none;
		color: none;
		outline: none;
		min-width: 340px;
		margin: 4px;
		padding: 8px;
		text-align: left;
	}
	.visibleSearchTips button:hover {
		background-color: #fcfcfc;
		cursor: pointer;
	}
	.searchButton {
		border: none;
		border-radius: 4px;
		background: #24b2ff;
		color: white;
		outline: none;
		height: 40px;
		margin: 4px;
		padding: 4px;
		cursor: pointer;
		min-width: 40px;
		@media (max-width: 500px) {
			min-width: 100%;
		}
	}
	.searchButton:hover {
		background: #5cc6ff;
	}
	input {
		outline: none;
		border: 1px #ebebeb solid;
		border-radius: 4px;
		padding: 4px;
		width: 320px;
		height: 30px;
	}
</style>