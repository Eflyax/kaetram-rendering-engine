<script setup lang="ts">
import BaseDemo from './dragonBones/src/BaseDemo.ts';
import skin from './dragonBones/src/ReplaceSkin.ts';
// const app  = new App.App();
// console.log(PIXI)

console.log({skin});
class Foo extends BaseDemo {

}

console.log(BaseDemo);
console.log(new Foo())
const onChangeScarf = () => {
	// app.girl.changeClothes({
	// 	'scarf.png': 'girl/sprites/scarf2.png',
	// });
};

</script>

<template>
	<div>
		<button @click="onChangeScarf()">Change</button>
	</div>
</template>

<style scoped>
</style>
