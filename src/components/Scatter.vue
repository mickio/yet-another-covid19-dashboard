<template>
    <div class="card">
        <chart 
            ref="scatter"
            @click="option => this.$emit('click',option)"
            @mouseover="option => this.$emit('mouseover',option)"
            @mouseout="option => this.$emit('mouseout',option)"
            :options='options'/>
    </div>
</template>
<script>
import Chart from '@/components/Chart'
import options from '../charts/scatter-options.js'
import urls from '../scr/urls.js'
export default {
    components: {
        Chart
    },
    data() { return {
        options,
        urls,
    }},
    methods: {
        dispatchAction(option) {
            if(option.name) {
                option.dataIndex = this.options.series.data.findIndex(el => el[3].county==option.name)
            }
            this.$refs.scatter.dispatchAction(option)
        },
    },
   async created() {
        const [current, lastweek] = await Promise.all([
            this.$root.$loader(this.urls.RKI_snapshot_URL).get(),
            this.$root.$loader(this.urls.RKI_last_week_snapshot_URL).get()
        ]);
        if(this.options.series.data.length==0) {
            current.forEach(el =>{
                const lw = lastweek.find(elem => elem.IdLandkreis===el.RS);
                const rate = (el.cases7_lk-lw.confirmed7)/lw.confirmed7*100;
                lw.f7=el.cases7_lk/lw.confirmed7
                el.lastweek = lw
                this.options.series.data.push([Math.round(el.cases7_per_100k),Math.round(rate),lw,el])
            })
        }
        // this.options.series.boundingCoords = [[13.3199829332097, 52.3761399064255],[13.4274566946754, 52.5049411782812]]
    } 
}
</script>