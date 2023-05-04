<script setup lang="ts">
import BaseDemo from './dragonBones/src/BaseDemo.ts';
import skin from './dragonBones/src/AnimationLayer.ts';
// const app  = new App.App();
// console.log(PIXI)
new skin()
const onChangeScarf = () => {
	// app.girl.changeClothes({
	// 	'scarf.png': 'girl/sprites/scarf2.png',
	// });
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
