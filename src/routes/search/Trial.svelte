<script>

	export let trialsData;

</script>

<div class="trial">
	<a sveltekit:prefetch href={`./trials/${trialsData.id}`}><p class="name" >{trialsData.name}</p></a>
	<p><span>🤒</span><span>Диагноз</span>{trialsData.condition.substring(0, 30)}</p>
	<p><span>💊</span><span>Вмешательство</span>{trialsData.interventions.substring(0, 45)}</p>
	<p><span>👩‍👩‍👦‍👦</span><span>Пациенты</span>{trialsData.numberOfPatients}</p>
	<p class="organisation"><span>🏨</span><span>Организации</span>{trialsData.organisations.substring(0, 34)}</p>
	<p><span>🏙</span><span>Город</span>{trialsData.city}</p>
</div>

<style lang="scss">

@use '../base';

	a {
		color: white;
		text-decoration: none;
	};
	.name {
		max-width: 200px;
		background: base.$button;
		&:hover {
			background: base.$activatedButton;
			cursor: pointer;
		}
		@media (max-width: 840px) {
			min-height: 60px;
			min-width: 90%;
		}
		@media (max-width: 500px) {
			min-width: 90%;
		}
	}
	.trial {
		font-family: sans-serif;
		font-size: 12px;
		display: flex;
		flex-wrap: nowrap;
		justify-content: space-between;
		border-radius: 10px;
		
		margin: 15px;
		padding: 15px;
		max-width: 1440px;
		@media (max-width:  840px) {
			flex-wrap: wrap;
			max-width: 90%;
			justify-content: center;
		}
		@media (max-width:  500px) {
			background: #fcfcfc;
		}
	}
	.organisation {
		@media (max-width: 840px) {
			display: none;
		}
	}
	p {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-wrap: wrap;
		flex-grow: 2;
		flex-flow: column;
		padding: 4px 20px;
		border-radius: 6px;
		margin: 4px;
		max-width: 90px;
		text-align: center;
		span {
			display: none;
			font-weight: 600;
			margin-bottom: 4px;
			@media (max-width:  840px) {
				display: block;
			}
		}
	}
</style>	