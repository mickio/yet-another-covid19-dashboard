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
import options from '../charts/geomap-options.js'
import endpoints from '../scr/endpoints.js'
export default {
    components: {
       Chart
    },
    data() { return {
       options,
       endpoints,
        data_counties: [],
        data_countries: null
    }},
    methods: {
        dispatchAction(option) {
            if(option.name) {
                option.dataIndex = this.options.series.data.findIndex(el => el.county==option.name)
            }
            this.$refs.map.dispatchAction(option)
        },
        select(option) {
            let setting = this.setting
            setting.name = option.data.county
            this.$store.commit("updateRegion", setting)
        }
    },
    async created() {
        const features = await this.$root.$loader(this.endpoints.RKI_snapshot_endpoint).get()
        
        if(this.data_counties.length==0){
            features.forEach(element => {
                this.data_counties.push({
                    name: element.RS,
                    value: element.cases7_per_100k,
                    values: element,
                    county: element.county
                });
            });
        }
        this.options.series.data = this.data_counties
        // this.options.series.boundingCoords = [[13.3199829332097, 52.3761399064255],[13.4274566946754, 52.5049411782812]]
    },
    computed: {
        setting() {
            return this.$store.state.setting
        }
    },
    watch: {
        async setting(setting) {
            let bbox
            if (setting.type == 'county') {
                this.options.series.map = 'landkreise'
                this.options.series.nameProperty = 'RS'
                this.options.series.data = this.data_counties
                bbox = setting.name === "Bundesgebiet" ?
                    this.$root.$worldmap.features.find(el => el.properties.name === 'Germany').bbox :
                    this.$root.$landkreise.features.find(el => el.properties.county === setting.name).bbox
            } else {
                if(! this.data_countries) {
                    this.data_countries = []
                    const features = await this.$root.$loader(this.endpoints.JHU_snapshot_endpoint).get()
                    features.forEach(element => {
                        this.data_countries.push({
                            name: element.country,
                            value: element.d_confirmed_7/element.confirmed*element.incidence,
                            values: element,
                            county: element.country
                        });
                    });
                }
                this.options.series.data = this.data_countries
                bbox = this.$root.$worldmap.features.find(el => el.properties.name === setting.name).bbox
                this.options.series.map = 'worldmap'
                this.options.series.nameProperty = 'name'
            }
            const latLng = [(bbox[0]+bbox[2])/2,(bbox[1]+bbox[3])/2]
            options.series.center = latLng
            options.series.zoom = setting.name == 'Bundesgebiet' ? 1 : 10
            setTimeout(() => {
                this.dispatchAction({type: "highlight", name: setting.name})
            },500)
        }
    } 
}
</script>
