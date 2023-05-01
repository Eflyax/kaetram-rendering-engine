<script setup lang="ts">
import * as App from './renderer/App';

const app  = new App.App();

const onChangeScarf = () => {
	app.girl.draw({
		'body.png': 'girl/sprites/body.png',
		'eyes-closed.png': 'girl/sprites/eyes-closed.png',
		'eyes-open.png': 'girl/sprites/eyes-open.png',
		'head.png': 'girl/sprites/head.png',
		'leg-left.png': 'girl/sprites/leg-left.png',
		'leg-right.png': 'girl/sprites/leg-right.png',
		'scarf.png': 'girl/sprites/scarf2.png',
	});
};

</script>

<template>
	<div>
		<button @click="onChangeScarf()">Change scarf</button>
	</div>
</template>

<style scoped>
</style>
