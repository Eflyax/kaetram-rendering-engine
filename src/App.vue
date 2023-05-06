<script setup lang="ts">
import {App} from './renderer/App';

app = new App();

const onChangeScarf = () => {
	const boneNameToTexture = {
		'pelvis': 'girl/sprites/head.png'
	};

	app.changeTexture();
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
