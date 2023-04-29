<script setup lang="ts">
import * as App from './renderer/App';

const app  = new App.App();

const onChangeScarf = () => {
	app.girl.changeScarf();
};

</script>

<template>
	<div>
		<button @click="onChangeScarf()">Change scarf</button>
	</div>
</template>

<style scoped>
</style>
