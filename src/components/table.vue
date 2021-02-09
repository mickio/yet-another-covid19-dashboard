<template>
    <div class="card">
        <div class="card-header">
            <input class="input is-small" type="text" placeholder="z. B. Neuss"/>
        </div>
        <div class="card-content">
            <div class="table-container">
                <table class="table is-hoverable is-narrow" >
                    <thead>
                        <tr class="sort-row">
                            <td> <span class="sort" @click="setSortCriterium('a',$event)"></span></td>
                            <td> <span class="sort" @click="setSortCriterium('b',$event)"></span></td>
                            <td> <span class="sort" @click="setSortCriterium('c',$event)"></span></td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="lk in filteredData" :key="lk.id">
                            <th><button class="button" @click="onclick(lk,$event)">{{lk.county}}</button></th>
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
            sortCriterium: null,
            activeSortTarget: null
        };
    },
    methods: {
        setSortCriterium(opt,event) {
            let key
            if(this.activeSortTarget && this.activeSortTarget===event.target) {
                if(this.activeSortTarget.classList.contains('sorted-asc')) {
                    this.activeSortTarget.classList.remove('sorted-asc')
                    this.activeSortTarget.classList.add('sorted-desc')
                    key = `${opt} desc`
                }else{
                    this.activeSortTarget.classList.remove('sorted-desc')
                    this.activeSortTarget.classList.add('sorted-asc')
                    key = `${opt} asc`
                }
            }else if(this.activeSortTarget ) {
                    this.activeSortTarget.classList.remove('sorted-asc')
                    this.activeSortTarget.classList.remove('sorted-desc')
                    this.activeSortTarget = event.target
                    this.activeSortTarget.classList.add('sorted-asc')
                    key = `${opt} asc`
            }else{
                    this.activeSortTarget = event.target
                    this.activeSortTarget.classList.add('sorted-asc')
                    key = `${opt} asc`
            }
            switch (key) {
                case 'a asc':
                    this.sortCriterium = (a,b) => (a.GEN > b.GEN)?1:(a.GEN < b.GEN)?-1:0
                    break;
                case 'a desc':
                    this.sortCriterium = (a,b) => (a.GEN < b.GEN)?1:(a.GEN > b.GEN)?-1:0
                    break;
                case 'b asc':
                    this.sortCriterium = (a,b) => a.cases7_lk - b.cases7_lk
                    break;
                case 'b desc':
                    this.sortCriterium = (a,b) => b.cases7_lk - a.cases7_lk
                    break;
                case 'c asc':
                    this.sortCriterium = (a,b) => a.cases7_per_100k - b.cases7_per_100k
                    break;
                case 'c desc':
                    this.sortCriterium = (a,b) => b.cases7_per_100k - a.cases7_per_100k
                    break;
            
                default:
                    break;
            }
            this.landkreise = this.landkreise.sort((a,b) => this.sortCriterium(a,b))
        },
        onclick(opt,event) {
            if(this.activeTarget) {
                this.activeTarget.classList.remove('is-selected')
            }
            this.activeTarget = event.target.parentNode.parentNode
            this.activeTarget.classList.add('is-selected')
            this.$emit('click',opt)
        }
    },
    computed: {
        filteredData() {
            return this.landkreise
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
.button {
	background-color:transparent;
	border-color: transparent;
	border-width: 1px;
	color: currentColor;
	cursor: pointer;
	justify-content: center;
	padding: 0;
	text-align: left;
    font-size: 0.8rem;
	/* white-space: nowrap; */
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