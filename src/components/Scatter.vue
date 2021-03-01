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
import options from '../charts/scatter-options.js'
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
                option.dataIndex = this.options.series.data.findIndex(el => el[3].county==option.name)
            }
            this.$refs.scatter.dispatchAction(option)
        },
        select(option) {
            let setting = this.setting
            setting.name = option.data[3].county
            this.$store.commit('updateRegion', setting)
        }
    },
   async created() {
        const [current, lastweek] = await Promise.all([
            this.$root.$loader(this.endpoints.RKI_snapshot_endpoint).get(),
            this.$root.$loader(this.endpoints.RKI_last_week_snapshot_endpoint).get()
        ]);
        if(this.data_counties==0) {
            current.forEach(el =>{
                const lw = lastweek.find(elem => elem.IdLandkreis===el.RS);
                const rate = (el.cases7_lk-lw.confirmed7)/lw.confirmed7*100;
                lw.f7=el.cases7_lk/lw.confirmed7
                el.lastweek = lw
                this.data_counties.push([Math.round(el.cases7_per_100k),Math.round(rate),lw,el])
            })
            this.options.series.data = this.data_counties
        }
    },
    computed: {
        setting() {
            return this.$store.state.setting
        },
    },
    watch: {
        async setting(setting) {
              this.dispatchAction({type: "showTip", name: setting.name})
            if(setting.type == 'county') {
                this.options.series.data = this.data_counties
            } else {
                if(!this.data_countries) {
                    this.data_countries = []
                    const features = await this.$root.$loader(this.endpoints.JHU_snapshot_endpoint).get()
                    features.forEach( properties => {
                        let incidence = Math.round(properties.d_confirmed_7/properties.confirmed * properties.incidence)
                        let delta = Math.round((2**(7*properties.rate_active)-1)*100)
                        this.data_countries.push([incidence,delta,properties,{county: properties.country}])
                    })
                }
                this.options.series.data = this.data_countries
            }
        }
    } 
}
</script>