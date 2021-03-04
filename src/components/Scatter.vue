<template>
    <div class="card">
        <chart 
            ref="scatter"
            @click="select"
            @mouseover="option => this.$emit('mouseover',option)"
            @mouseout="option => this.$emit('mouseout',option)"
            :options='options'/>
    </div>
</template>
<script>
import Chart from '@/components/Chart'
import {getOptions} from '../charts/scatter-options.js'
import endpoints from '../scr/endpoints.js'
export default {
    components: {
        Chart
    },
    data() { return {
        endpoints,
        options: {}
    }},
    methods: {
        dispatchAction(option) {
            if(option.name) {
                option.dataIndex = this.options.series.data.findIndex(el => el[3].county==option.name)
            }
            this.$refs.scatter.dispatchAction(option)
        },
        select(option) {
            this.$store.commit('updateRegion', {name: option.data[3].county})
            history.pushState({...this.$store.state.setting},`COVID19-Dashboard - Infektionsgeschehen ${option.data[3].county}`,`/${this.regionType}/${option.data[3].county}`)
        },
        async loadCountyData() {
            const [current, lastweek] = await Promise.all([
                this.$root.$loader(this.endpoints.RKI_snapshot_endpoint).get(),
                this.$root.$loader(this.endpoints.RKI_last_week_snapshot_endpoint).get()
            ]);
            current.forEach(el =>{
                const lw = lastweek.find(elem => elem.IdLandkreis===el.RS);
                const rate = (el.cases7_lk-lw.confirmed7)/lw.confirmed7*100;
                lw.f7=el.cases7_lk/lw.confirmed7
                el.lastweek = lw
                getOptions(this.regionType,this.deviceClass).series.data.push([Math.round(el.cases7_per_100k),Math.round(rate),lw,el])
            })
        },
        async loadCountryData(){
            const features = await this.$root.$loader(this.endpoints.JHU_snapshot_endpoint).get()
            features.forEach( properties => {
                let incidence = Math.round(properties.d_confirmed_7/properties.confirmed * properties.incidence)
                let delta = Math.round((2**(7*properties.rate_active)-1)*100)
                getOptions(this.regionType,this.deviceClass).series.data.push([incidence,delta,properties,{county: properties.country}])
            })
        },
        async loadRegionData(regionType) {
            if(regionType == 'county') {
                await this.loadCountyData()
            } else {
                await this.loadCountryData()
            }
        },
    },
    computed: {
        regionType() {
            return this.$store.state.setting.type
        },
        deviceClass() {
            return this.$store.state.deviceClass
        },
    },
    async created() {
        await this.loadRegionData(this.regionType)
        this.options = getOptions(this.regionType,this.deviceClass)
    },
    watch: {
        async regionType(regionType) {
            if (this.options.series.data.length == 0) {
                await this.loadRegionData(regionType)
            }
            this.options = getOptions(regionType,this.deviceClass)
        },
        deviceClass(deviceClass) {
            this.options = getOptions(this.regionType,deviceClass)
            console.log(`Device class set to ${deviceClass}`)
        }
    } 
}
</script>