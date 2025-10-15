<script setup></script>

<template>
    <h1>
        Toyotetsu XRef Export Tool
    </h1>
    <div class="issues" v-if="issues.length > 0">
        <h2>
            There were potential issue(s) detected with your input, please review them before exporting:
        </h2>
        <ul>
            <li v-for="(issue, index) in issues" :key="index">
                {{ issue }}
            </li>
        </ul>
        <button class="export-btn" @click="export_rows(false)">
            Continue Export
        </button>

        <button class="export-btn" @click="issues = []">
            Cancel Export
        </button>


    </div>
    <div class="infos" v-if="info">
        <img src="@/assets/info.png" />
        <p>
            {{ info }}
        </p>
        <button class="close" @click="info = null">
            &times;
        </button>
    </div>
    <div class="ctl-row">
        <button class="export-btn" @click="export_rows" v-if="issues.length === 0">
            Export
        </button>
    </div>
    <div class="table">
        <div class="row-head">
            <span>
                Part Number
            </span>
            <input type="text" placeholder="Bin" v-model="bin" />-
            <span>
                Location
            </span>
        </div>
        <div class="row content" v-for="(row, index) in rows" :key="index">
            <input class="part-input" type="text" v-model="row.partNumber" placeholder="Part Number" />
            <span class="bin-name">
                {{ bin }}-
            </span>
            <!-- focus the next one -->
            <input type="text" v-model="row.location" placeholder="Location" class="location-input"
                @keyup.enter="rows.push({ partNumber: '', location: '' }); focusLastRow()" />
            <button tabindex="-1" class="remove" v-if="rows.length > 1" @click="rows.splice(index, 1)">
                &times;
            </button>
        </div>
    </div>

</template>

<script lang="js">
export default {
    data() {
        return {
            rows: [
                { partNumber: '', location: '' },
            ],
            bin: '',
            issues: [
            ],
            info: null
        }
    },
    methods: {
        save_progress() {
            // write to localstorage
            localStorage.setItem('xref-data', JSON.stringify(this.rows));
            localStorage.setItem('xref-bin', this.bin);
        },
        load_progress() {
            // read from localstorage
            const data = localStorage.getItem('xref-data');
            let load_str = ''
            if (data) {
                let rows = JSON.parse(data);
                if (Array.isArray(rows) && rows.length > 1) {
                    this.rows = rows;
                }else{
                    return;
                }
            }
            const bin = localStorage.getItem('xref-bin');
            if (bin) {
                this.bin = bin;
            }

            if (bin || data) {
                this.info = 'Restored last session.';
            }

        },
        check_issues() {
            // check for duplicates in part numbers
            const partNumbers = this.rows.map(row => row.partNumber).filter(pn => pn.trim() !== '');
            const duplicates = partNumbers.filter((pn, index) => partNumbers.indexOf(pn) !== index);
            this.issues = [];
            if (duplicates.length > 0) {
                this.issues.push(`Found ${[...new Set(duplicates)].length} duplicate entries for part numbers: ${[...new Set(duplicates)].join(', ')}`);
            }
            // check for empty part numbers
            const emptyPartNumbers = this.rows.filter(row => row.partNumber.trim() === '');
            if (emptyPartNumbers.length > 0) {
                this.issues.push(`Found ${emptyPartNumbers.length} entries with empty part numbers.`);
            }

            // check for empty locations
            const emptyLocations = this.rows.filter(row => row.location.trim() === '');
            if (emptyLocations.length > 0) {
                this.issues.push(`Found ${emptyLocations.length} entries with empty locations.`);
            }
        },
        export_rows(validate) {
            if (validate !== false) {
                this.check_issues();
                if (this.issues.length > 0) {
                    return;
                }
            }
            // opens a tab with html including part-number\tbin-location\n
            let output = '';
            this.rows.forEach(row => {
                if (row.partNumber && row.location) {
                    output += `${row.partNumber}\t${this.bin}-${row.location}\n`;
                }
            });
            const newWindow = window.open();
            newWindow.document.write('<pre>' + output + '</pre>');
            newWindow.document.close();
        },
        focusLastRow() {
            setTimeout(() => {
                const rows = document.querySelectorAll('.row.content');
                if (rows.length > 0) {
                    const lastRow = rows[rows.length - 1];
                    const input = lastRow.querySelector('input.part-input');
                    if (input) {
                        input.focus();
                    }
                }
                // save progress
                this.save_progress();
            }, 0);
        }

    },
    mounted() {
        this.load_progress();
        window.addEventListener('beforeunload', this.save_progress);
    }
}

</script>

<style lang='scss' scoped>
.issues {
    background: #ffdddd;
    border: 1px solid red;
    padding: 10px;
    margin-bottom: 20px;
    width: 400px;

    h2 {
        margin-top: 0;
        font-size: 16px;
    }

    ul {
        margin: 0;
        padding-left: 20px;
        padding-bottom: 20px;
    }
}

.infos {
    background: #ddffdd;
    border: 1px solid green;
    padding: 10px;
    margin-bottom: 20px;
    width: 400px;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;

    img {
        width: 20px;
        height: 20px;
    }

    h1 {
        margin-top: 0;
        font-size: 16px;
    }

    p {
        margin: 0;
        padding-left: 0px;
        padding-bottom: 0px;
    }

    button.close {
        margin-left: auto;
        background: none;
        border: none;
        font-size: 20px;
        line-height: 20px;
        cursor: pointer;
        padding: 0;
        color: grey;

        &:hover {
            color: black;
        }
    }
}

.ctl-row {
    margin-bottom: 20px;
}

button.export-btn {
    padding: 5px 10px;
    margin-right: 10px;
}

.table {
    display: flex;
    flex-direction: column;
    width: 400px;

    .row-head {
        display: flex;
        // gap: 10px;
        align-items: center;
        width: 100%;

        span {
            width: 100px;

        }

        input {
            all: unset;
            color: grey;
            text-align: right;
        }

        border-bottom: 2px solid black;
    }

    .row {
        display: flex;
        // gap: 10px;
        align-items: center;
        width: 100%;
        margin-top: 10px;
        position: relative;

        input {
            all: unset;
            width: 100%;
        }

        .bin-name {
            width: 50px;
            text-align: right;
        }

        .location-input {
            width: 100px;
        }

        button.remove {
            position: absolute;
            right: -25px;
            top: 0;
            bottom: 0;
            margin: auto;
            height: 20px;
            width: 20px;
            padding: 0;
            line-height: 20px;
            text-align: center;
            border-radius: 50%;
            border: 1px solid black;
            background: white;
            cursor: pointer;

            &:hover {
                background: lightgrey;
            }
        }
    }

}

* {
    box-sizing: border-box;
    padding: 0;

}
</style>
