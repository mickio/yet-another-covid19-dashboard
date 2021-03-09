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
            let cfrs = current.map(el => el.deaths/el.cases)
            let inc = current.map(el => el.deaths/el.EWZ) 
            const cfrMean = cfrs.reduce((t,s) => t+s,0)/cfrs.length
            const cfrMax = Math.max(...cfrs)
            const cfrMin = Math.min(...cfrs)          
            const incMean = inc.reduce((t,s) => t+s,0)/cfrs.length
            const incMax = Math.max(...inc)
            const incMin = Math.min(...inc)
            console.log(`cfrMean: ${cfrMean},cfrMin: ${cfrMin},cfrMax: ${cfrMax},incMean: ${incMean},incMin: ${incMin}, incMax: ${incMax}`)
            const lightness = val => val<= cfrMean ? 40*(cfrMean - val)/(cfrMean - cfrMin) : 50*(cfrMean - val)/(cfrMax - cfrMean)
            const size = val => val<= incMean ? 1 + 0.5*(val - incMean)/(incMean - incMin) : 1+(val - incMean)/(incMax - incMean)     
            current.forEach(el =>{
                const lw = lastweek.find(elem => elem.IdLandkreis===el.RS);
                const rate = (el.cases7_lk-lw.confirmed7)/lw.confirmed7*100;
                lw.f7=el.cases7_lk/lw.confirmed7
                el.lastweek = lw
                this.options.series.data.push([Math.round(el.cases7_per_100k),Math.round(rate),lw,el,{lightness: 50 + lightness(el.deaths/el.cases),scale: 10*size(el.deaths/el.EWZ)}])
            })
        },
        async loadCountryData(){
            const features = await this.$root.$loader(this.endpoints.JHU_snapshot_endpoint).get()
            let cfrs = features.map(el => el.cfr)
            let inc = features.map(el => el.cfr * el.incidence).filter(e => e > 0) 
            const cfrMean = cfrs.reduce((t,s) => t+s,0)/cfrs.length
            const cfrMax = Math.max(...cfrs)
            const cfrMin = Math.min(...cfrs)          
            const incMean = inc.reduce((t,s) => s < 100000 ? t+s : t,0)/cfrs.length
            const incMax = Math.max(...inc)
            const incMin = Math.min(...inc)
            console.log(`cfrMean: ${cfrMean},cfrMin: ${cfrMin},cfrMax: ${cfrMax},incMean: ${incMean},incMin: ${incMin}, incMax: ${incMax}`)
            const lightness = val => val<= cfrMean ? 40*(cfrMean - val)/(cfrMean - cfrMin) : 50*(cfrMean - val)/(cfrMax - cfrMean)
            const size = val => val == 0 ? 1 : val<= incMean ? 1 + 0.5*(val - incMean)/(incMean - incMin) : 1+(val - incMean)/(incMax - incMean)  
            features.forEach( properties => {
                let incidence = Math.round(properties.d_confirmed_7/properties.confirmed * properties.incidence)
                let delta = Math.round((2**(7*properties.rate_active)-1)*100)
                this.options.series.data.push([incidence,delta,properties,{county: properties.country},{lightness: 50 + lightness(properties.cfr),scale: 10*size(properties.cfr*properties.incidence)}])
            })
        },
        loadRegionData(regionType) {
            if(regionType == 'county') {
                this.loadCountyData()
            } else {
                this.loadCountryData()
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
    created() {
        this.options = getOptions(this.regionType,this.deviceClass) 
        this.loadRegionData(this.regionType)
    },
    watch: {
        regionType(regionType) {
            this.options = getOptions(regionType,this.deviceClass) 
            if (this.options.series.data.length == 0) {
                this.loadRegionData(regionType)
            }
        },
        deviceClass(deviceClass) {
            this.options = getOptions(this.regionType,deviceClass)
        }
    } 
}
</script>