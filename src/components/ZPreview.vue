<script setup lang="js">
import zbox from './zbox.vue';
import ztext from './ztext.vue';
import zline from './zline.vue';
</script>

<template>
    <div class="zpl-preview" :style="{ width: width + 'px', height: height + 'px' }">
        <zbox v-for="(obj, index) in objects.filter(o => o.type === 'box')" :key="index" :x1="obj.x" :y1="obj.y"
            :x2="obj.x1" :y2="obj.y1" :thickness="obj.thickness" />
        <ztext v-for="(obj, index) in objects.filter(o => o.type === 'text')" :key="index" :x="obj.x" :y="obj.y"
            :size="obj.size" :value="obj.value" />
        <zline v-for="(obj, index) in objects.filter(o => o.type === 'line')" :key="index" :x="obj.x" :y="obj.y"
            :x1="obj.x1" :y1="obj.y1" :thickness="obj.thickness" />
    </div>
</template>

<script lang="js">
export default {
    props: {
        width: {
            type: Number,
            default: 800,
        },
        height: {
            type: Number,
            default: 600,
        },
    },
    data() {
        return {
            objects: [
                {
                    type: 'text',
                    x: 150,
                    y: 150,
                    size: 30,
                    value: 'Sample Text',
                },
                {
                    type: 'line',
                    x: 20,
                    y: 150,
                    x1: 300,
                    y1: 150,
                    thickness: 2,
                },
                {
                    type: 'box',
                    x: 50,
                    y: 200,
                    x1: 250,
                    y1: 350,
                    thickness: 3
                }
            ],
        }
    },
    methods: {
        codify() {
            // tempaltes for objects in zpl code
            let text_zpl = `^FO{x},{y}^A0,N,{size},{size}^FD{value}^FS`;
            let box_zpl = `^FO{x},{y}^GB{width},{height},{thickness}^FS`;
            let line_zpl = `^FO{x},{y}^GB{width},{height},{thickness}^FS`;
            let zpl = '';
            zpl += '^XA\n'
            zpl += '^PW680\n'
            zpl += '^LL590\n'
            zpl += '^PQ1^MD15 \n'
            for (let obj of this.objects) {
                if (obj.type === 'text') {
                    let segment = text_zpl
                        .replace('{x}', obj.x)
                        .replace('{y}', obj.y)
                        .replace('{size}', obj.size)
                        .replace('{value}', obj.value);
                    zpl += segment + '\n';
                } else if (obj.type === 'box') {
                    let width = obj.x1 - obj.x;
                    let height = obj.y1 - obj.y;
                    let segment = box_zpl
                        .replace('{x}', obj.x)
                        .replace('{y}', obj.y)
                        .replace('{width}', width)
                        .replace('{height}', height)
                        .replace('{thickness}', obj.thickness);
                    zpl += segment + '\n';
                } else if (obj.type === 'line') {
                    let width = obj.x1 - obj.x;
                    let height = obj.y1 - obj.y;
                    let segment = line_zpl
                        .replace('{x}', obj.x)
                        .replace('{y}', obj.y)
                        .replace('{width}', width)
                        .replace('{height}', height)
                        .replace('{thickness}', obj.thickness);
                    zpl += segment + '\n';
                }
            }

       
            zpl += '^XZ';
            return zpl;
        },
        objectify(zpl) {
            let object_map= {
                rectangle: '^GB',
                text: '^FD',
                line: '^GB',
            }
            let objects = [];
            let lines = zpl.split('\n');
            for (let line of lines) {
                if (line.includes(object_map.rectangle)) {
                    // parse rectangle
                    let obj = {
                        type: 'box',
                        x: 0,
                        y: 0,
                        x1: 0,
                        y1: 0,
                        thickness: 0,
                    };
                } else if (line.includes(object_map.text)) {
                    // parse text
                } else if (line.includes(object_map.line)) {
                    // parse line
                }
            }
            return objects;
        },
        printzpl() {
            let zpl = this.codify();
            const printWindow = window.open('', 'Print', 'width=800,height=600');
            printWindow.document.write('<pre>' + zpl + '</pre>');
            printWindow.document.close();
        }

    },
    mounted() {
        this.printzpl();
    }
}

</script>

<style lang='scss' scoped>
.zpl-preview {
    border: 2px solid #000;
    position: relative;
    background-color: #fff;

    .box {
        box-sizing: border-box;
    }
}
</style>
