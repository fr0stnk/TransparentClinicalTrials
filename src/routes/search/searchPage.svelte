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
	import ConditionSearchBar from './ConditionSearchBar.svelte'
	import SearchResults from './SearchResults.svelte'
	import TagsSearchBar from './TagsSearchBar.svelte'
	import { searchTerms } from '../../stores.js'

//searchProps is the data that is passed from dispatched props of SearchBar and reassigned as soon as searchTermPassed

	export let searchProps;
	export let DB;
	export let searchTips = [];
	export let searchTags = [];

	DB.forEach(item => {searchTips.push(item.condition)})
	DB.forEach(item => {searchTags.push(item.interventions, item.city, item.phase)})
	
	export let spreadedProps = {
		searchProps: searchProps,
		DB: DB,
	}

	function reassignSearchProps (e) {
		spreadedProps.searchProps = e.detail.passedSearchTerm;
	}

	function passSearchProps () {
		$searchTerms = searchPropsArray;
	}

</script>


	<main in:fly={{ y: 40, duration: 325 }} out:fade={{duration: 0}}>
		<h1>Поиск РКИ</h1>
		<div class="searchWindow">
		<ConditionSearchBar searchTips={searchTips} on:searchTermPassed={reassignSearchProps} />
		<TagsSearchBar searchTags={searchTags} />
		</div>
		<a href={`./${$searchTerms}`}><button class="searchButton">Искать</button></a>
	</main>

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
	.searchWindow {
		@include base.flex($flow: column, $justify: center);
		border-radius: 16px;
		max-width: 537px;
		box-shadow: rgba(100, 100, 111, 0.14) 0px 8px 24px 0px;
	}
	.searchButton {
		@include base.reset;
		@include base.sizes($h: 40px, $p: 4px);
		background: base.$button;
		color: base.$white;
		cursor: pointer;
		min-width: 40px;
		border-radius: 8px;
		margin-top: 16px;
		& a {
			@include base.reset;
			color: white;
		}
		@media (max-width: base.$phone) {
			min-width: 100%;
		}
		&:hover {
			background: base.$activatedButton;
		}
	}
</style>
