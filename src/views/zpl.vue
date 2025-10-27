<script setup></script>

<template>
    <div class="object-list">
        <div class="object">
            <input type="text" placeholder="x" v-model="object_input.x" />
            <input type="text" placeholder="y" v-model="object_input.y" />
            <template v-if="object_input.type === 'box'">
                <input type="text" placeholder="x1" v-model="object_input.x1" />
                <input type="text" placeholder="y1" v-model="object_input.y1" />
                <input type="text" placeholder="thickness" v-model="object_input.thickness" />

            </template>
            <input type="text" placeholder="size" v-model="object_input.size" />
            <input type="text" placeholder="text" v-model="object_input.text" />
            <select v-model="object_input.type">
                <option value="" disabled selected>
                    Select Type
                </option>
                <option value="text">
                    Text
                </option>
                <option value="line">
                    Line
                </option>
                <option value="box">
                    Box
                </option>
            </select>
        </div>
        <div class="list">
            <div class="item" v-for="(obj, index) in zpl_objects" :key="index">
                <span>
                    {{ index + 1 }}. [{{ obj.type }}] X: {{ obj.x }} Y: {{ obj.y }}
                    <span v-if="obj.type === 'text'">
                        Size: {{ obj.size }} Text: {{ obj.text }}
                    </span>
                    <span v-else>
                        X1: {{ obj.x1 }} Y1: {{ obj.y1 }}
                    </span>
                </span>
            </div>
        </div>
    </div>

    <button @click="
        zpl_objects.push({
            x: object_input.x,
            y: object_input.y,
            x1: object_input.x1,
            y1: object_input.y1,
            size: object_input.size,
            text: object_input.text,
            type: object_input.type,
            thickness: object_input.thickness,
        });
    object_input = {
        x: '',
        y: '',
        x1: '',
        y1: '',
        size: '',
        thickness: '',
        text: '',
        type: '',
    };
    ">
        Add Object
    </button>

    <button @click="zprint()">
        Print ZPL
    </button>
    <button @click="copyCode()">
        Copy code
    </button>
</template>

<script lang="js">
export default {
    data() {
        return {
            zpl_objects: [],
            zpl_configuration: {
                label_width: 800,
                label_height: 601,
                darkness: 10,
                label_quantity: 1,
            },
            object_input: {
                x: '',
                y: '',
                x1: '',
                y1: '',
                size: '',
                text: '',
                type: '',
            },
            zpl_map: {
                text: '^A0N,{size}, {size}^FO{x},{y}^FD{text}^FS\n',
                line: '^FO{x},{y}^GB{x1},{y1},2^FS\n',
                box: '^FO{x},{y}^GB{x1},{y1},2,B,0^FS\n',
            }
        }
    },
    methods: {
        renderCode() {
            let zpl = '^XA\n';
            zpl += `^PW${this.zpl_configuration.label_width}\n`;
            zpl += `^LL${this.zpl_configuration.label_height}\n`;
            zpl += `^PQ${this.zpl_configuration.label_quantity}^MD${this.zpl_configuration.darkness} \n`;
            this.zpl_objects.forEach(obj => {
                let obj_zpl = this.zpl_map[obj.type];
                obj_zpl = obj_zpl.replace('{x}', obj.x);
                obj_zpl = obj_zpl.replace('{y}', obj.y);
                obj_zpl = obj_zpl.replace('{x1}', obj.x1);
                obj_zpl = obj_zpl.replace('{y1}', obj.y1);
                obj_zpl = obj_zpl.replace('{size}', obj.size);
                obj_zpl = obj_zpl.replace('{text}', obj.text);
                zpl += obj_zpl;
            });
            zpl += '^XZ';
            return zpl;
        },
        zprint() {
            let code = this.renderCode();
            // start a print dialog with html containing the zpl code, no header/footer
            const printWindow = window.open('', '_blank', 'width=600,height=400');
            printWindow.document.write('<html><head><title>Print ZPL</title></head><body><pre>' + code + '</pre></body></html>');
            printWindow.document.close();
        },
        copyCode() {
            let code = this.renderCode();
            navigator.clipboard.writeText(code);
            alert('ZPL code copied to clipboard');
        }

    },
    mounted() {
    }
}

</script>

<style lang='scss' scoped>
.object-list {
    display: flex;
    flex-direction: row;
    gap: 20px;

    .object {
        display: flex;
        flex-direction: column;
        gap: 10px;

        input,
        select {
            padding: 5px;
            font-size: 14px;
        }

        button {
            padding: 5px 10px;
            font-size: 14px;
            cursor: pointer;
        }
    }

    .list {
        flex-grow: 1;

        .item {
            padding: 5px 0;
            border-bottom: 1px solid #ccc;
        }
    }
}
</style>
