<template>
    <div class="card">
        <chart 
            :options='options'
            @click="select"
            @mouseover="option => this.$emit('mouseover',option)"
            @mouseout="option => this.$emit('mouseout',option)"
            ref="map" />
    </div>
</template>
<script>
import Chart from '@/components/Chart'
import {nationalOptions, internationalOptions} from '../charts/geomap-options.js'
import endpoints from '../scr/endpoints.js'
export default {
    components: {
       Chart
    },
    data() { return {
       options:{},
       nationalOptions,
       internationalOptions,
       endpoints,
    }},
    methods: {
        dispatchAction(option) {
            if(option.name) {
                option.dataIndex = this.options.series.data.findIndex(el => el.county==option.name)
            }
            this.$refs.map.dispatchAction(option)
        },
        select(option) {
            this.$store.commit("updateRegion", {name: option.data.county})
            history.pushState({...this.$store.state.setting},`COVID19-Dashboard - Infektionsgeschehen ${option.data.county}`,`/${this.setting.type}/${option.data.county}`)
        },
        async loadNationalMapData(){
            const features = await this.$root.$loader(this.endpoints.RKI_snapshot_endpoint).get()
            features.forEach(element => {
                this.nationalOptions.series.data.push({
                    name: element.RS,
                    value: element.cases7_per_100k,
                    values: element,
                    county: element.county
                });
            });
        },
        async loadInternationalMapData(){
            const features = await this.$root.$loader(this.endpoints.JHU_snapshot_endpoint).get()
            features.forEach(element => {
                this.internationalOptions.series.data.push({
                    name: element.country,
                    value: element.d_confirmed_7/element.confirmed*element.incidence,
                    values: element,
                    county: element.country
                });
            });
        },
        async loadMapDataAndmoveTo(setting){
            let bbox
            if (setting.type == 'county') {
                if(this.nationalOptions.series.data.length == 0) {
                    await this.loadNationalMapData()
                }
                this.options = this.nationalOptions
                bbox = setting.name === "Bundesgebiet" ?
                    this.$root.$worldmap.features.find(el => el.properties.name === 'Germany').bbox :
                    this.$root.$landkreise.features.find(el => el.properties.county === setting.name).bbox
                const latLng = [(bbox[0]+bbox[2])/2,(bbox[1]+bbox[3])/2]
                this.options.series.center = latLng
                this.options.series.zoom = setting.name == 'Bundesgebiet' ? 1 : 10
            } else {
                if(this.internationalOptions.series.data.length == 0) {
                    await this.loadInternationalMapData()
                }
                this.options = this.internationalOptions
                bbox = this.$root.$worldmap.features.find(el => el.properties.name === setting.name).bbox
                const latLng = [(bbox[0]+bbox[2])/2,(bbox[1]+bbox[3])/2]
                this.options.series.center = latLng
                this.options.series.zoom = 5
            }
        }
    },
    async created() {
        this.loadMapDataAndmoveTo(this.setting)
    },
    computed: {
        setting() {
            return this.$store.state.setting
        }
    },
    watch: {
        async setting(setting) {
            await this.loadMapDataAndmoveTo(setting)
            setTimeout(() => {
                this.dispatchAction({type: "highlight", name: setting.name})
            },500)
        }
    } 
}
</script>
