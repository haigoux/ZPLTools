<script setup lang="js">
import ZPreview from '@/components/ZPreview.vue';
</script>

<template>
    <h1>
        Label Templates
    </h1>
    <div class="templates-container">

        <div class="template">
            <h2>
                Delivery Label
            </h2>
            <input type="text" placeholder="Customer Name" v-model="customer_name" />
            <input type="text" placeholder="Invoice Number" v-model="invoice_number" />
            <input type="text" placeholder="Sub Location" v-model="sub_location" />
            <span>
                Recent Labels:
            </span>
            <select @change="(e) => {
                const selected = get_recent_templates().find(t => t.name === e.target.value);
                if (selected) {
                    customer_name = selected.data.customer_name;
                    invoice_number = selected.data.invoice_number;
                    sub_location = selected.data.sub_location;
                }
            }">
                <option value="" disabled selected>
                    Select Recent
                </option>
                <option v-for="(template, index) in get_recent_templates()" :key="index" :value="template.name">
                    {{ template.name }} - {{ template.data.customer_name }} - {{ template.data.invoice_number }} -
                    {{ template.data.sub_location }}
                </option>
            </select>
            <button class="optional" @click="import_invoice_from_clipboard()">
                Import from Clipboard
            </button>
            <button @click="printDeliveryLabel()">
                Print
            </button>
        </div>
        <div class="template">
            <h2>
                Pick In Progress Label
            </h2>
            <input type="text" placeholder="Customer Name" v-model="pickProgressLabelData.customer_name" />
            <input type="text" placeholder="Quote Number" v-model="pickProgressLabelData.quote_number" />
            <input type="text" placeholder="Customer Sublocation"
                v-model="pickProgressLabelData.customer_sublocation" />
            <div class="row">

                <input type="checkbox" v-model="pickProgressLabelData.backordered_parts" />
                <span>
                    Backordered Parts?
                </span>
            </div>
            <div class="row">
                <input type="text" placeholder="Start Date" v-model="pickProgressLabelData.start_date" />
                <button @click="pickProgressLabelData.start_date = getPrettyDateToday()">
                    Today
                </button>
            </div>
            <button class="optional" @click="import_from_clipboard()">
                Import from Clipboard
            </button>
            <button @click="printPickInProgressLabel()">
                Print
            </button>

        </div>
    </div>
    <!-- <z-preview></z-preview> -->
</template>

<script lang="js">
export default {
    data() {
        return {
            customer_name: '',
            invoice_number: '',
            sub_location: '',
            pickProgressLabelData: {
                customer_name: '',
                quote_number: '',
                start_date: '',
                customer_sublocation: '',
                backordered_parts: false,
                _customer_number: '',
            }
        }

    },
    methods: {
        getPrettyDateToday() {
            const today = new Date();
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return today.toLocaleDateString(undefined, options);
        },
        printPickInProgressLabel() {
            let zpl = ''
            zpl += '^XA\n'
            zpl += '^PW680\n'
            zpl += '^LL590\n'
            zpl += '^PQ1^MD15 \n'
            zpl += '^FO25,40^A0N,100,80^FDPick in Progress^FS\n'
            if (this.pickProgressLabelData.customer_name.length > 30) {
                zpl += `^FO25,140^A0N,45,30^FD${this.pickProgressLabelData.customer_name}^FS\n`
            } else{
                zpl += `^FO25,140^A0N,55,39^FD${this.pickProgressLabelData.customer_name}^FS\n`
            }
            zpl += '^FO25,205^A0N,40,40^FDQuote #: ^FS\n'
            zpl += `^FO25,240^A0N,40,40^FD${this.pickProgressLabelData.quote_number}^FS\n`
            zpl += '^FO25,285^A0N,40,40^FDSublocation:^FS\n'
            zpl += `^FO25,320^A0N,40,40^FD${this.pickProgressLabelData.customer_sublocation}^FS\n`
            zpl += '^FO25,365^A0N,40,40^FDStart Date:^FS\n'
            zpl += `^FO25,400^A0N,40,40^FD${this.pickProgressLabelData.start_date}^FS\n`

            if (this.pickProgressLabelData.backordered_parts) {
                zpl += '^FO25,450^A0N,40,40^FD[BACKORDERED PARTS]^FS\n'
            }

            zpl += '^FO480,540^A0N,40,40^FDFASTENAL^FS\n'
            zpl += `^FO15,195^GB415,410,3^FS\n` // box around quote, sublocation, start date
            zpl += '^XZ\n'
            zpl += '^XA\n'
            zpl += '^MD0\n'
            zpl += '^XZ\n'
            // start print dialog
            console.log(zpl);
            // save to recents
            this.saveToRecents('pick_in_progress', {
                customer_name: this.pickProgressLabelData.customer_name,
                quote_number: this.pickProgressLabelData.quote_number,
                start_date: this.pickProgressLabelData.start_date,
            });
            const printWindow = window.open('', 'Print', 'width=800,height=600');
            printWindow.document.write('<html><head><title>Print</title></head><body><pre>' + zpl + '</pre></body></html>');
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
            printWindow.close();
        },
        printDeliveryLabel() {
            let zpl = ''
            zpl += '^XA\n'
            zpl += '^PW680\n'
            zpl += '^LL590\n'
            zpl += '^PQ1^MD15 \n'
            zpl += '^FO25,40^A0N,100,80^FDDelivery^FS\n'
            if (this.customer_name.length > 30) {
                zpl += `^FO25,140^A0N,45,30^FD${this.customer_name}^FS\n`
            } else{
                zpl += `^FO25,140^A0N,55,39^FD${this.customer_name}^FS\n`
            }
            zpl += '^FO25,205^A0N,40,40^FDInvoice #: ^FS\n'
            zpl += `^FO25,240^A0N,40,40^FD${this.invoice_number}^FS\n`
            zpl += '^FO25,285^A0N,40,40^FDLocation:^FS\n'
            zpl += `^FO25,320^A0N,40,40^FD${this.sub_location}^FS\n`
            zpl += '^FO450,500^A0N,25,25^FDproudly delivered by^FS\n'
            zpl += '^FO480,540^A0N,40,40^FDFASTENAL^FS\n'
            zpl += `^FO15,195^GB415,410,3^FS\n` // box around quote, sublocation, start date
            zpl += '^XZ\n'
            zpl += '^XA\n'
            zpl += '^MD0\n'
            zpl += '^XZ\n'
            // start print dialog
            console.log(zpl);
            // save to recents
            this.saveToRecents('delivery', {
                customer_name: this.customer_name,
                invoice_number: this.invoice_number,
                sub_location: this.sub_location,
                _customer_number: this.customer_number,
            });
            const printWindow = window.open('', 'Print', 'width=800,height=600');
            printWindow.document.write('<html><head><title>Print</title></head><body><pre>' + zpl + '</pre></body></html>');
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
            printWindow.close();
        },
        saveToRecents(template_name, template_data) {
            let recents = localStorage.getItem('label-recents');
            let recents_array = [];
            if (recents) {
                recents_array = JSON.parse(recents);
            }
            recents_array.unshift({
                name: template_name,
                data: template_data,
                date: new Date().toISOString(),
            });
            // keep only 10
            if (recents_array.length > 10) {
                recents_array = recents_array.slice(0, 10);
            }
            localStorage.setItem('label-recents', JSON.stringify(recents_array));
        },
        get_recent_templates(template_name) {
            let recents = localStorage.getItem('label-recents');
            let recents_array = [];
            if (recents) {
                recents_array = JSON.parse(recents);
            }
            return recents_array;
        },
        import_invoice_from_clipboard() {
            navigator.clipboard.readText().then(text => {
                // example clipboard data
                //Invoice #	Packing Slip #	Packing Slip Date	Status	Customer #	Customer Name	PO	Job	Signature	Delivery Date	Carrier	Tracking #	Container Id	Complete
                // 65477	34799	10/23/2025	Deliver	SITX0906	PETROLEUM SOLUTIONS INC. (VENDING)	10200914074	PSI 3	Unchecked	10/23/2025				Unchecked
                const line = text.split('\n')[1]; // take first line only
                const parts = line.split('\t');
                if (parts.length >= 6) {
                    this.customer_name = parts[5];
                    this.invoice_number = parts[0];
                    this.sub_location = parts[7];   
                }
            });
        },
        import_from_clipboard() {
            navigator.clipboard.readText().then(text => {
                                // example clipboard data
//                 Quote #	Customer #	Customer Name	Ship To	PO	Job	Due Date	Printed	All BO In	Amount	Comments	Status	Account Representative	Zone	Sector	Pick Wave #
                // 118684	SITX0906	PETROLEUM SOLUTIONS INC. (VENDING)			PSI 3B	10/29/2025	Unchecked	Unchecked	$107.66		Delivered	Josef Cuevas	1		
                text = text.split('\n')[1]; // take first line only
                const parts = text.split('\t');
                if (parts.length >= 5) {
                    this.pickProgressLabelData.quote_number = parts[0];
                    this.pickProgressLabelData.customer_name = parts[2];
                    this.pickProgressLabelData.customer_sublocation = parts[5];
                    this.pickProgressLabelData._customer_number = parts[1];
                    this.pickProgressLabelData.customer_name = this.pickProgressLabelData.customer_name + '/' + this.pickProgressLabelData._customer_number;
                }
            });
        }

    },
    mounted() {
    }
}

</script>

<style lang='scss' scoped>
.templates-container {
    display: flex;
    gap: 2em;
    flex-wrap: wrap;
    width: 50%;
}

.template {
    border: 1px solid #ccc;
    padding: 1em;
    margin-bottom: 1em;
    border-radius: 8px;
    background: #f9f9f9;
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    width: 300px;

    span {
        font-weight: bold;
        font-family: Arial, sans-serif;
    }

    select {
        padding: 0.5em;
        font-size: 1em;
        border: 1px solid #ccc;
        border-radius: 4px;
        background-color: white;
    }

    .row {
        display: flex;
        gap: 0.5em;

        span {
            font-family: Arial, sans-serif;
            font-weight: 500;
        }
    }

    input {
        padding: 0.5em;
        font-size: 1em;
        border: 1px solid #ccc;
        border-radius: 4px;
        width: 100%;
    }

    input[type="checkbox"] {
        width: auto;
        margin-right: 0.1em;
    }

    h2 {
        margin: 0;
        font-size: 1.2em;
        font-family: Arial, sans-serif;
    }

    button {
        padding: 0.5em;
        font-size: 1em;
        border: none;
        border-radius: 4px;
        background-color: #007bff;
        color: white;
        cursor: pointer;
        transition: background-color 0.3s;

        &:hover {
            background-color: #0056b3;
        }

        &.optional {
            background-color: #6c757d00;
            color: #000;
            border: 1px solid #ccc;

            &:hover {
                background-color: #0056b3;
                color: white;

            }
        }
    }
}

* {
    box-sizing: border-box;
}
</style>
