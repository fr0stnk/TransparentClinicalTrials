<script context="module">

	export const load = async ({ page, fetch }) => {
		const id = page.params.trial;
		const res = await fetch(`https://demo-db-server-master.herokuapp.com/cancers/${id}`);
		const trialPage = await res.json();
		return {
			props: {
				trialPage,
			}
		}
	}

</script>

<script>
	export let trialPage;
	let arrayOfOrganisations = trialPage.clinicalCentres
</script>

<main>
	<div class="listsContainer">
		<div class="listOfProperties">
			<ul>
				<li><b>Название исследования:</b> <span class="valueOfListItem">{trialPage.name}</span></li>
				<li><b>Диагноз:</b> <span class="valueOfListItem">{trialPage.condition}</span></li>
				<li><b>Виды вмешательства:</b> <span class="valueOfListItem">{trialPage.interventions}</span></li>
				<li><b>Дата начала:</b> <span class="valueOfListItem">{trialPage.start}</span></li>
				<li><b>Дата окончания:</b> <span class="valueOfListItem">{trialPage.finish}</span></li>
				<li><b>Организация, проводящая КИ:</b> <span class="valueOfListItem">{trialPage.organisations}</span></li>
				<li><b>Фаза:</b> <span class="valueOfListItem">{trialPage.phase}</span></li>
				<li><b>Количество пациентов:</b> <span class="valueOfListItem">{trialPage.numberOfPatients}</span></li>
				<li><b>Тип исследования:</b> <span class="valueOfListItem">{trialPage.type}</span></li>
				<li><b>Цель исследования:</b> <span class="valueOfListItem">{trialPage.aim}</span></li>
				<li><b>Город(а), где проводится исследования:</b> <span class="valueOfListItem">{trialPage.city}</span></li>
				<li><b>Количество клиник, участвующих в исследовании:</b> <span class="valueOfListItem">{trialPage.numberOfClinics}</span></li>
			</ul>
		</div>
		<div class="listOfOrganisations">
			{#if arrayOfOrganisations.length}
			<h1>Центры, в которых проводится исследование</h1>
			{#each arrayOfOrganisations as item}
			<div class="organisation">
				<img src="{item.image}" alt="Логотип центра">
				<p>{item.name}</p>
				<p><a href="tel:{item.number}">{item.number}</a></p>
				<p><a href="mailto:{item.email}">{item.email}</a></p>
			</div>
			{/each}
			{/if}
		</div>
	</div>
</main>

<style lang="scss">
	main {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 90vh;
	}
	.listsContainer {
		display: flex;
		max-width: 1440px;
		@media (max-width: 840px) {
			flex-wrap: wrap;
			justify-content: center;
		}
	}
	.listOfOrganisations {
		display: flex;
		flex-flow: column;
		justify-content: center;
		align-items: center;
		text-align: center;
	}
	.organisation {
		background: #24b2ff;
		color: white;
		margin: 10px;
		border-radius: 4px;
		padding: 12px;
		@media (max-width: 840px) {
			min-width: 65%;
		}
	}
	.listOfProperties {

	}
	.valueOfListItem {
		background:  #fcfcfc;
		border-radius: 4px;
		margin: 0px 20px;
		padding: 8px;
		flex-basis: 34%;
		text-align: center;
		font-weight: 200;
	}
	img {
		height: 50px;
		width: 50px;
		border-radius: 40px;
	}
	div {
		font-family: sans-serif;
		font-size: 14px;
	}
	ul {

	}
	li {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 12px 12px 12px 0px;
		list-style-type: none;
		@media (max-width: 500px) {
			flex-flow: column;
		}
	}
	a {
		text-decoration: none;
		color: white;
		padding: 6px;
		border-radius: 4px;
	}
	a:hover {
		background: #5cc6ff;
	}
</style>

