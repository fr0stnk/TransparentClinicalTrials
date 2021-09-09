<script context="module">
	export const load = async({ fetch }) => {
		const resDB = await fetch("https://demo-db-server-master.herokuapp.com/cancers");
		const DB = await resDB.json();
		return {
			props: {
				DB
			}
		}
	}
</script>

<script>

	import { fly, fade } from 'svelte/transition'
	import ConditionSearchBar from "./ConditionSearchBar.svelte"
	import SearchResults from "./SearchResults.svelte"

//searchProps is data that is passed from dispatched props of SearchBar and reassigned as soon as searchTermPassed

	export let searchProps;
	export let DB;
	export let searchTips = [];

	DB.forEach(item => {searchTips.push(item.condition)})
	
	export let spreadedProps = {
		searchProps: searchProps,
		DB: DB,
	}

	function reassignSearchProps (e) {
		spreadedProps.searchProps = e.detail.passedSearchTerm;
	}

</script>

{#await load}
	<p>loading</p>
{:then load} 
	<main in:fly={{ y: 40, duration: 325 }} out:fade={{duration: 0}}>
		<h1>Поиск РКИ</h1>
		<div class="searchWindow">
		<ConditionSearchBar searchTips={searchTips} on:searchTermPassed={reassignSearchProps} />
		</div>
	</main>
{/await}


<SearchResults {...spreadedProps}/>

<style lang="scss">

@use '../base';

	main {
		@include base.flex($flow: column);
		transition: 0.4s;
	}
	h1 {
		max-width: 80%;
		text-align: center;
	}
	p {
		@include base.fonts($size: 12px);
		color: base.$button;
		margin: 8px;
	}
	.searchWindow {
		border-radius: 16px;
		box-shadow: rgba(100, 100, 111, 0.14) 0px 8px 24px 0px;
	}
</style>
