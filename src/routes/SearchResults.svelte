<script>

	import { fly, fade } from 'svelte/transition'

	import Trial from "./Trial.svelte"
	export let searchProps = "-";
	export let DB;
	$ :databaseItems = DB.filter((item) => item.condition.toLowerCase().includes(searchProps.toLowerCase()))

</script>

<main>
{#if searchProps != "-"}
	{#if databaseItems.length}
	<div class="tableContainer" in:fly={{ y: 60, duration: 325}} out:fade={{duration: 2}} >
		<div class="tableTips">
			<p class="name"><span>🏥</span>Название исследования</p>
			<p><span>🤒</span>Диагноз</p>
			<p><span>💊</span>Вмешательство</p>
			<p><span>👩‍👩‍👦‍👦</span>Пациенты</p>
			<p><span>🏨</span>Организация</p>
			<p><span>🏙</span>Город</p>
		</div>
	{#each databaseItems as trials}
	<div class="trial">
		<Trial trialsData={trials}/>
	</div>
	{/each}
	</div>
	{:else}
	<p class="tableTips">Ничего не найдено</p>
	{/if}
{/if}
</main>

<style lang="scss">

@use 'base';

	main {
		display: flex;
		justify-content: center;
	}
	.tableContainer {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		max-width: 1440px;
	}
	.trial {
		flex-grow: 2;
		max-width: 1460px;
	}
	.name {
		max-width: 200px;
		min-width: 200px;
	}
	.tableTips {
		@include base.fonts($family: sans-serif, $size: 12px, $weight: 800);
		@include base.flex($wrap: nowrap, $justify: space-between);
		border-radius: 10px;
		margin: 15px;
		flex-grow: 2;
		@media (max-width: base.$tablet) {
			display: none;
		}
	}
	p {
		@include base.flex($flow: column);
		flex-grow: 2;
		padding: 4px 20px;
		margin: 4px;
		max-width: 90px;
		border-radius: 6px;
	}
</style>
