<script setup lang="ts">
import * as App from './renderer/App';

const app  = new App.App();

const onChangeScarf = () => {
	app.girl.changeClothes({
		'scarf.png': 'girl/sprites/scarf2.png',
	});
};

</script>

<template>
	<div>
		<button @click="onChangeScarf()">Change</button>
	</div>
</template>

<style scoped>
</style>
