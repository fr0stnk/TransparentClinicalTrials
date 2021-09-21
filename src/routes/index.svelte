<main>
	<div class="roles">
		<div class="role">
			<a sveltekit:prefetch href="/search/searchPage"><div class="cube">👩🏻‍⚕️</div></a>
			<p>Я доктор</p>
		</div>
		<div class="role">
			<div class="cube not-available">🙋🏼‍♂️</div>
			<p>Я пациент</p>
		</div>
		<div class="role">
			<div class="cube not-available">🏨</div>
			<p>Фармкомпания</p>
		</div>
	</div>
</main>

<style lang="scss">

@use 'base';

	main {
		@include base.flex;
		min-height: 90vh;
		
	}
	.roles {
		@include base.flex ($justify: space-between);
		width: 50%;
		text-align: center;
		@media (max-width: base.$phone) {
			justify-content: center;
		}
	}
	.cube {
		@include base.flex;
		@include base.sizes($w: 120px, $h: 120px);
		@include base.fonts($size: 40px);
		background: base.$button;
		border-radius: 8px;
		&:hover {
			background: base.$activatedButton;
		}
	}
	.not-available {
		filter: grayscale(100%);
		cursor: unset;
		&:hover {
			background: base.$button;
		}
	}

</style>