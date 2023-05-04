<script setup lang="ts">
// import Character from './dragonBones/src/Character.ts';

// new Character();
import { App } from './renderer/App';

app = new App();

const onChangeScarf = () => {
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
