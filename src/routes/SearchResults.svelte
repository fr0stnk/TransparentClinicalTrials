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
	main {
		display: flex;
		justify-content: center;
	}
	.tableContainer {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		max-width: 1440px;
	}
	.trial {
		flex-grow: 2;
	}
	.name {
		max-width: 200px;
		min-width: 200px;
	}
	.tableTips {
		font-family: sans-serif;
		font-size: 12px;
		font-weight: 800;
		display: flex;
		flex-wrap: nowrap;
		justify-content: space-between;
		border-radius: 10px;
		margin: 15px;
		flex-grow: 2;
		@media (max-width: 840px) {
			display: none;
		}
	}
	p {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		flex-wrap: wrap;
		flex-grow: 2;
		padding: 4px 20px;
		border-radius: 6px;
		margin: 4px;
		max-width: 90px;
		text-align: center;
	}
</style>
