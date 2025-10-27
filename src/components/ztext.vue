<script setup lang="js">

</script>

<template>
    <div class="text" :style="{ position: 'absolute', left: x + 'px', top: y + 'px', fontSize: size + 'px' }">
        {{ value }}
    </div>
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
        size: {
            type: Number,
            default: 30,
        },
        value: {
            type: String,
            default: '',
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

<style lang='scss' scoped></style>
