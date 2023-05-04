<script setup lang="ts">
import * as App from './renderer/App';

const app  = new App.App();

const onChangeScarf = (param) => {
	app.girl.changeClothes(param);
};

</script>

<template>
	<div>
		<button @click="onChangeScarf({
			'scarf.png': 'girl/sprites/scarf.png'
			})">
			Change 1
		</button>
		<button @click="onChangeScarf({
			'scarf.png': 'girl/sprites/scarf2.png'
			})">
			Change 2
		</button>
	</div>
</template>

<style scoped>
</style>
