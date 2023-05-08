<script setup lang="ts">
import {Game} from './game/Game';

const game = new Game();

const onChangeScarf = () => {
	const boneNameToTexture = {
		'pelvis': 'girl/sprites/head.png'
	};
	// 'pelvis': 'hand/dragonbones-export/MechArm_ARM.png'

	game.changeTexture(boneNameToTexture);
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
