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
		document.querySelector("main").style.transform = "scale(0.75)";
		document.querySelector("h1").style.display = "none";
	}

</script>

<main>
	<h1>Поиск РКИ</h1>
	<div class="searchWindow">
	<ConditionSearchBar searchTips={searchTips} on:searchTermPassed={reassignSearchProps} />
	</div>
</main>

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
		box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
	}
</style>
