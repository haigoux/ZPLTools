<script setup lang="js">

</script>

<template>
<div class="box" 
:style="{
        left: x1 + 'px',
        top: y1 + 'px',
        width: (x2 - x1) + 'px',
        height: (y2 - y1) + 'px',
        borderWidth: thickness + 'px',
    }">
</div>
</template>

<script lang="js">
export default {
    props: {
        x1: {
            type: Number,
            required: true,
        },
        y1: {
            type: Number,
            required: true,
        },
        x2: {
            type: Number,
            required: true,
        },
        y2: {
            type: Number,
            required: true,
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
.box {
    position: absolute;
    border: solid black;
}
</style>
