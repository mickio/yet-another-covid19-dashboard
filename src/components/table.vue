<template>
    <div class="card">
        <div class="card-header">
            <div class="input-container">
                <div ref="close-icon" @click="clearInput"></div>
                <input v-model="term" class="input is-small" type="text" placeholder="z. B. Neuss">
            </div>
        </div>
        <div class="card-content">
            <div class="table-container">
                <table class="table is-hoverable is-narrow is-fullwidth" >
                    <thead>
                        <tr class="sort-row">
                            <td> <span class="sort" @click="sortLandkreise('a',$event)"></span></td>
                            <td> <span class="sort" @click="sortLandkreise('b',$event)"></span></td>
                            <td> <span class="sort" @click="sortLandkreise('c',$event)"></span></td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="lk in filteredData" :key="lk.id">
                            <!-- <th><button class="button" @click="setSelected(lk,$event)">{{lk.county}}</button></th> -->
                            <th @click="setSelected(lk,$event)">{{lk.county}}</th>
                            <td class="has-text-right">{{lk.cases7_lk}}</td>
                            <td class="has-text-light has-text-right">{{Math.round(lk.cases7_per_100k)}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
<script>
import urls from "../scr/urls.js"
export default {
    data() {
        return {
            urls,
            landkreise: [],
            activeTarget: null,
            activeSortTarget: null,
            term: ''
        };
    },
    methods: {
        clearInput() {
            this.term=''
        },
        sortLandkreise(opt,event) {
            const operator = {
                a: (a,b) => (a.GEN > b.GEN)?1:(a.GEN < b.GEN)?-1:0,
                b: (a,b) => a.cases7_lk - b.cases7_lk,
                c: (a,b) => a.cases7_per_100k - b.cases7_per_100k
            }
            let sortCriterium
            if(this.activeSortTarget && this.activeSortTarget===event.target) {
                if(this.activeSortTarget.classList.contains('sorted-asc')) {
                    this.activeSortTarget.classList.remove('sorted-asc') // highlight Sortierrichtung...
                    this.activeSortTarget.classList.add('sorted-desc')
                    sortCriterium = (a,b) => - operator[opt](a,b) // ... und Sortierktiterium setzen
                }else{
                    this.activeSortTarget.classList.remove('sorted-desc')
                    this.activeSortTarget.classList.add('sorted-asc')
                    sortCriterium = (a,b) => operator[opt](a,b)
                }
            }else if(this.activeSortTarget ) {
                    this.activeSortTarget.classList.remove('sorted-asc','sorted-desc')
                    this.activeSortTarget = event.target
                    this.activeSortTarget.classList.add('sorted-asc')
                    sortCriterium = (a,b) => operator[opt](a,b)
            }else{
                    this.activeSortTarget = event.target
                    this.activeSortTarget.classList.add('sorted-asc')
                    sortCriterium = (a,b) => operator[opt](a,b)
            }
            this.landkreise = this.landkreise.sort((a,b) => sortCriterium(a,b))
        },
        setSelected(opt,event) {
            if(this.activeTarget) {
                this.activeTarget.classList.remove('is-selected')
            }
            this.activeTarget = event.target.parentNode
            this.activeTarget.classList.add('is-selected')
            this.$emit('click',opt)
        }
    },
    computed: {
        filteredData() {
            if(this.$refs['close-icon']) {
                if (this.term) {
                    this.$refs['close-icon'].classList.add('close-icon')
                } else {
                    this.$refs['close-icon'].classList.remove('close-icon')
                }
            }
            return this.landkreise.filter((option) => {
                return option.county && option.county
                    .toString()
                    .toLowerCase()
                    .indexOf(this.term.toLowerCase()) >= 0
            })
        }
    },
    async created() {
        this.landkreise = await this.$root.$loader(this.urls.RKI_snapshot_URL).get()
    }
}
</script>
<style scoped>
.table-container {
    height:85vh;
    overflow-y: scroll;
}
.table {
    /* scroll-behavior: auto; */
    font-family: Arial, Helvetica, sans-serif;
    font-size: 0.8rem;
}
.card-header {
    margin: 0.5rem;
}
.card-content{
    padding: 0.3rem;
}
.is-small {
    height: 1.5rem;
}

.has-text-light {
    color: hsl(0,2%,70%)
}
.has-text-right {
    text-align: right;
}
.table.is-narrow td, .table.is-narrow th {
    padding: 0.25em;
}
/* .input-container {
    width: 100%;
} */
/* .input-container .close-icon {
  position: absolute
} */
.input-container {
    display: contents;
}
.close-icon {
    right:0;
    position: absolute;
    z-index: 10;
    padding:0.5rem;
}
.close-icon::after {
  content: '✖';
  cursor: pointer;
  padding: 0.5rem;
  color: #757576
}
th {
    cursor: pointer;
}
.sort-row {
    height: 1.5rem;
    background-color: hsl(240,20%,10%);
}
thead tr.sort-row th,thead tr.sort-row td {
	padding: 5px;
	border-bottom: var(--strong-border);
	cursor: pointer;
    position: sticky;
    text-align: center;
    background-color: hsl(240,20%,10%);
    top: 0;
}
span.sort::before {
  content: '▲';
  position: absolute;
  top: -0.4em;
  font-size: 0.8rem;
}

span.sort::after {
  content: '▼';
  position: absolute;
  top:0.4em;
  font-size: 0.8rem;
}

tr.sort-row span.sort {
  position:relative;
  height: 1em;
  display: block;
  color: #888;
}

table tr.sort-row th {
  position: sticky;
  text-align: center;
  top: 0;
  background: var(--background-darker);
  border-bottom: none;
}

span.sorted-asc::before,
span.sorted-desc:hover::before {
  color: white;
}

span.sorted-desc::after,
span.sorted-asc:hover::after {
  color: white;
}

span.sort:hover::after {
  color: white;
}

span.symbol {
  font-size: 1.5em;
  position: relative;
  top: 0.1em;
  line-height: 0px;
}

</style>>