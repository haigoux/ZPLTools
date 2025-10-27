<script setup lang="js">

</script>

<template>
<div class="line"></div>
</template>

<script lang="js">
export default {
    props: {
        x: {
            type: Number,
            default: 0,
        },
        y: {
            type: Number,
            default: 0,
        },
        x1: {
            type: Number,
            default: 0,
        },
        y1: {
            type: Number,
            default: 0,
        },
        thickness: {
            type: Number,
            default: 1,
        },
    },
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
.line {
    position: absolute;
    border-top: solid;
    border-width: v-bind(thickness + 'px');
    left: v-bind(x + 'px');
    top: v-bind(y + 'px');
    width: v-bind((x1 - x) + 'px');
    height: 0px;
}
</style>
