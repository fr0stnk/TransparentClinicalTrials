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

@use '../../base';

	main {
		@include base.flex;
		min-height: 90vh;
	}
	.listsContainer {
		display: flex;
		max-width: 1440px;
		@media (max-width: base.$tablet) {
			flex-wrap: wrap;
			justify-content: center;
		}
	}
	.listOfOrganisations {
		@include base.flex($flow: column, $justify: flex-start);
		text-align: center;
	}
	.organisation {
		@include base.sizes($m: 10px, $p: 12px);
		background: base.$button;
		color: base.$white;
		border-radius: 12px;
		@media (max-width: 840px) {
			min-width: 65%;
		}
	}
	.valueOfListItem {
		@include base.sizes($m: 0px 20px, $p: 8px);
		@include base.fonts($weight: 200);
		background:  base.$darkWhite;
		border-radius: 10px;
		flex-basis: 34%;
		text-align: center;
	}
	img {
		@include base.sizes($w: 50px, $h: 50px);
		border-radius: 40px;
	}
	li {
		@include base.flex($justify: space-between);
		margin: 12px 12px 12px 0px;
		list-style-type: none;
		@media (max-width: base.$phone) {
			margin-right: 34px;
			flex-flow: column;
		}
	}
	a {
		text-decoration: none;
		color: white;
		padding: 6px;
		border-radius: 8px;
		&:hover {
			background: base.$activatedButton;
		}
	}
</style>

