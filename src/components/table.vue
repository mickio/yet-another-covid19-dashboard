<template>
    <div class="card">
        <div class="input-container">
            <div ref="close-icon" @click="clearInput"></div>
            <input v-model="term" class="input is-small" type="text" placeholder="type region name to filter data">
        </div>
        <div class="table-container">
            <div class="has-margin has-text-small" ><b class="has-text-small">Kreis </b> | Insgesamt gemeldet | Neu gemeldet | <span class="has-text-light has-text-small" >Neu pro 100.000 EW</span></div>
            <table>
                <thead>
                    <tr class="sort-row">
                        <td> <span class="sort" @click="sortRegionsData($event)"></span></td>
                        <td> <span class="sort" @click="sortRegionsData($event)"></span></td>
                        <td> <span ref="initial-country-target" class="sort" @click="sortRegionsData($event)"></span></td>
                        <td> <span ref="initial-target" class="sort" @click="sortRegionsData($event)"></span></td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="lk in filteredData" :key="lk.id" >
                        <!-- <th><button class="button" @click="setSelected(lk,$event)">{{lk.county}}</button></th> -->
                        <th @click="setSelected(lk,$event)" @mouseover="mouseover(lk)" @mouseout="mouseout(lk)" >{{lk.county?lk.county:lk.country}}</th>
                        <td class="has-text-right">{{Intl.NumberFormat().format(lk.cases?lk.cases:lk.confirmed)}}</td>
                        <td class="has-text-right">{{Intl.NumberFormat().format(lk.cases7_lk?lk.cases7_lk:lk.d_confirmed_7)}}</td>
                        <td class="has-text-light has-text-right">{{Intl.NumberFormat().format(Math.round(lk.cases7_per_100k?lk.cases7_per_100k:(lk.d_confirmed_7 * lk.incidence / lk.confirmed)))}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
            <nav>
                <ul>
                    <li ref="county"><a @click="setRegionType('county')">National</a></li>
                    <li ref="country" ><a @click="setRegionType('country')">International</a></li>
                </ul>
            </nav>
    </div>
</template>
<script>
import endpoints from "../scr/endpoints.js"

const operator_counties = [
    (a,b) => (a.GEN > b.GEN)?1:(a.GEN < b.GEN)?-1:0,
    (a,b) => a.cases - b.cases,
    (a,b) => a.cases7_lk - b.cases7_lk,
    (a,b) => a.cases7_per_100k - b.cases7_per_100k
]
const operator_countries = [
    (a,b) => (a.country > b.country)?1:(a.country < b.county)?-1:0,
    (a,b) => a.confirmed - b.confirmed,
    (a,b) => a.d_confirmed_7 - b.d_confirmed_7,
    (a,b) => a.d_confirmed_7 * a.incidence / a.confirmed - b.d_confirmed_7 * b.incidence / b.confirmed
]


export default {
    data() {
        return {
            endpoints,
            regions: [],
            activeTarget: null,
            activeSortTarget: null,
            activeSortCriterium: null,
            term: '', 
        };
    },
    methods: {
        mouseover(opt) {
            this.$emit('mouseover',opt.county??opt.country)
        },
        mouseout(opt) {
            this.$emit('mouseout',opt.county??opt.country)
        },
        clearInput() {
            this.term=''
        },
        setRegionType(type) {
            this.$store.commit('updateRegion',{type: type, name: type=='country'?'Germany':'Bundesgebiet'})
            history.pushState({...this.$store.state.setting},`COVID19-Dashboard - Infektionsgeschehen ${type=='country'?'Germany':'Bundesgebiet'}`,`/${this.regionType}/${type=='country'?'Germany':'Bundesgebiet'}`)
        },
        setTab(type) {
            let types = ['county','country'].filter(t=>t!==type) 
            this.$refs[type].classList.add('is-active')
            types.forEach(t=>this.$refs[t].classList.remove('is-active'))
        },
        setSelected(opt,event) {
            if(this.activeTarget) {
                this.activeTarget.classList.remove('is-selected')
            }
            this.activeTarget = event.target.parentNode
            this.activeTarget.classList.add('is-selected')
            this.$store.commit('updateRegion', {name: opt.county??opt.country})
            history.pushState({...this.$store.state.setting},`COVID19-Dashboard - Infektionsgeschehen ${opt.county??opt.country}`,`/${this.regionType}/${opt.county??opt.country}`)
        },
        toggleSortDirection() {
            if(this.activeSortTarget.classList.contains('sorted-asc')) {
                this.activeSortTarget.classList.remove('sorted-asc') // highlight Sortierrichtung...
                this.activeSortTarget.classList.add('sorted-desc')
                this.activeSortCriterium = (a,b) => - this.operator_regions[this.activeSortTarget.parentNode.cellIndex](a,b)
            }else{
                this.activeSortTarget.classList.remove('sorted-desc')
                this.activeSortTarget.classList.add('sorted-asc')
                this.activeSortCriterium = this.operator_regions[this.activeSortTarget.parentNode.cellIndex]
            }
        },
        changeSortTarget( target ) {
            this.activeSortTarget.classList.remove('sorted-asc','sorted-desc')
            this.activeSortTarget = target
            this.activeSortTarget.classList.add('sorted-asc')
            this.activeSortCriterium = this.operator_regions[this.activeSortTarget.parentNode.cellIndex]
        },
        sortRegionsData(event) {
            if(this.activeSortTarget===event.target) {
                this.toggleSortDirection()
            }else {
                this.changeSortTarget(event.target)
            }
            this.regions = this.regions.sort((a,b) => this.activeSortCriterium(a,b))
        },
        async initializeTable(regionType){
            if (this.activeSortTarget){
                this.activeSortTarget.classList.remove('sorted-desc', 'sorted-asc')
            }
            if (regionType == 'county') {
               this.regions = await this.$root.$loader(endpoints.RKI_snapshot_endpoint).get()
               this.activeSortTarget = this.$refs['initial-target']
            } else {
                this.regions = await this.$root.$loader(endpoints.JHU_snapshot_endpoint).get() 
               this.activeSortTarget = this.$refs['initial-country-target']
            }
            this.activeSortTarget.classList.add('sorted-desc')
            this.activeSortCriterium = this.operator_regions[this.activeSortTarget.parentNode.cellIndex]
        },
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
            return this.regions.filter((option) => {
                return (
                    option.county && option.county
                    .toString()
                    .toLowerCase()
                    .indexOf(this.term.toLowerCase()) >= 0
                    ) || (
                    option.country && option.country
                    .toString()
                    .toLowerCase()
                    .indexOf(this.term.toLowerCase()) >= 0
                    )
            })
        },
        regionType() {
            return this.$store.state.setting.type
        },
        operator_regions() {
            return this.regionType == 'country'?operator_countries:operator_counties
        }
    },
    watch: {
        regionType(regionType) {
            this.initializeTable(regionType)
            this.setTab(regionType)
        }
    },
    created() {
        this.initializeTable(this.regionType)
    },
    mounted() {
        this.setTab(this.regionType)        
    }
}
</script>
<style scoped>
input {
    margin: 5px 10px 0 10px
}
.is-selected {
    background-color: var(--selected-color);
}
.table-container {
    height:calc(100% - 60px);
    overflow-y: scroll;
    font-size: var(--small-text);
}
.is-small {
    height: 1.5rem;
}
.has-text-small {
  font-size: var(--small-text);
  text-align: justify;
  text-transform: uppercase;
}
.has-margin {
    margin: 10px 0 5px 5px
}
.has-text-light {
    color: var(--light-color)
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
    background-color: var(--dark-color);
}
thead tr.sort-row th,thead tr.sort-row td {
	padding: 5px;
	border-bottom: var(--strong-border);
	cursor: pointer;
    position: sticky;
    text-align: center;
    background-color: var(--dark-color);
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
table tr:hover {
    background-color: var(--hover-color);
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
@media only screen and (max-width: 800px) {
    table {
        width: 100%;
        font-size: var(--header-text);
    }
    .has-text-small{
        font-size: var(--normal-text);
    }
}

</style>>