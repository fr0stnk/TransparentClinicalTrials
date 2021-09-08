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
import SearchResults from "./SearchResults.svelte";
export let searchProps;
export let DB;
export let spreadedProps = {
		searchProps: searchProps,
		DB: DB,
	}
</script>

<SearchResults {...spreadedProps}/>