<template>
    <div class="card">
        <chart 
            :options='options'
            @click="option => this.$emit('click',option)"
            @mouseover="option => this.$emit('mouseover',option)"
            @mouseout="option => this.$emit('mouseout',option)"
            ref="map" />
    </div>
</template>
<script>
import Chart from '@/components/Chart'
import options from '../charts/geomap-options.js'
import urls from '../scr/urls.js'
export default {
   components: {
       Chart
   },
   data() { return {
       options,
       urls,

   }},
//    async computed() { return {
//        county: this.$store
//    }},
    methods: {
        dispatchAction(option) {
            console.log(option)
            if(option.name) {
                option.dataIndex = this.options.series.data.findIndex(el => el.county==option.name)
                console.log(option)
            }
            this.$refs.map.dispatchAction(option)
        },
    },
   async created() {
        const features = await this.$root.$loader(this.urls.RKI_snapshot_URL).get()
        if(this.options.series.data.length==0){
            features.forEach(element => {
                this.options.series.data.push({
                    name: element.RS,
                    value: element.cases7_per_100k,
                    values: element,
                    county: element.county
                });
            });
        }
        // this.options.series.boundingCoords = [[13.3199829332097, 52.3761399064255],[13.4274566946754, 52.5049411782812]]
    },
    computed: {
        county() {
            return this.$store.state.name
        },
    },
    watch: {
        county(name) {
            const bbox = this.$root.$landkreise.features.find(el => el.properties.county === name).bbox
            const latLng = [(bbox[0]+bbox[2])/2,(bbox[1]+bbox[3])/2]
            options.series.center = latLng
            options.series.zoom = 10
            setTimeout(() => {
                this.dispatchAction({type: "highlight", name: name})
            },500)
        }
    } 
}
</script>