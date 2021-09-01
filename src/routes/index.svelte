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

//searchProps is data that is passed from dispatched props of SearchBar and reassigned as soon as searchTermPassed

	export let searchProps;
	export let DB;
	export let searchTips = [];

	DB.forEach(item => {searchTips.push(item.condition)})
	
	export let spreadedProps = {
		searchProps: searchProps,
		DB: DB,
	}
	import SearchBar from "./SearchBar.svelte"
	import SearchResults from "./SearchResults.svelte"

	function reassignSearchProps (e) {
		spreadedProps.searchProps = e.detail.passedSearchTerm;
		document.querySelector("main").style.transform = "scale(0.75)";
		document.querySelector("h1").style.display = "none";
	}

</script>

<main>
	<h1>Введите наименование диагноза или название протокола:</h1>
	<SearchBar searchTips={searchTips} on:searchTermPassed={reassignSearchProps} />
</main>

<SearchResults {...spreadedProps}/>

<style lang="scss">
	main {
		display: flex;
		flex-flow: column;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		transition: 0.4s
	}
	h1 {
		font-family: sans-serif;
		max-width: 80%;
		text-align: center;
	}
</style>
