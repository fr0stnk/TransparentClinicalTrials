import sveltePreprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-netlify';

export default {
	preprocess: sveltePreprocess(),
	kit: {
		adapter: adapter(), // currently the adapter does not take any options
		target: '#svelte'
	}
};