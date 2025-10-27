<script setup></script>

<template>
    <div class="nav">
        <router-link to="/">XRef Tool</router-link> | 
        <router-link to="/labels">Custom Labels</router-link> | 
        <router-link to="/zpledit">ZPL Editor</router-link> | 
        
    </div>
    <router-view/>
</template>

<script lang="js">
export default {
    data() {
        return {
        }
    },
    methods: {

 
    },
    mounted() {
    }
}

</script>

<style lang='scss' scoped>

</style>
