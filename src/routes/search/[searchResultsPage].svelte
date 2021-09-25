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
import { searchResultsFiltered } from "../../stores.js";
import { searchTerms } from "../../stores.js";
import { searchTermInStore } from "../../stores.js";

export let DB;

export let result = DB.filter(
	(item) => {
		if (typeof($searchTerms) == "string") {
			let test = $searchTerms.split(",");
			$searchTerms = test;
				return $searchTerms.some(
				(i) => {
					const condition = item.condition.toLowerCase();
					const interventions = item.interventions.toLowerCase();
					const city = item.city.toLowerCase();
					const phase = item.phase.toLowerCase()
					i = i.toLowerCase();
					return (condition.includes(i) ||
							city.includes(i) || 
							interventions.includes(i) || 
							phase.includes(i)
					);
				}
			)
		} else {
			return $searchTerms.some(
				(i) => {
					const condition = item.condition.toLowerCase();
					const interventions = item.interventions.toLowerCase();
					const city = item.city.toLowerCase();
					const phase = item.phase.toLowerCase()
					i = i.toLowerCase();
					return (condition.includes(i) ||
							city.includes(i) || 
							interventions.includes(i) || 
							phase.includes(i)
					);
				}
			)
		}
	}
)


$searchResultsFiltered = result;


</script>

<SearchResults />