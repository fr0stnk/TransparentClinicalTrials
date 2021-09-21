import { writable } from 'svelte/store';
import { browser } from '$app/env';

export const searchTerms = writable(
	browser && (localStorage.getItem(["searchTerms"]) || [])
	);
searchTerms.subscribe((val) => browser && localStorage.setItem(["searchTerms"], val));

export const searchResultsFiltered = writable(
	browser && (localStorage.getItem("searchResultsFiltered") || "")
	);
searchResultsFiltered.subscribe((val) => browser && localStorage.setItem("searchResultsFiltered", val));
