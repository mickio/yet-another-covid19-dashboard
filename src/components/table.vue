<template>
    <div class="card">
        <div class="card-header">
            <input class="input is-small" type="text" placeholder="z. B. Neuss"/>
        </div>
        <div class="card-content">
            <div class="table is-hoverable is-narrow">
                <tbody>
                    <tr v-for="lk in landkreise" :key="lk.id">
                        <th>{{lk.county}}</th>
                        <td class="has-text-right">{{lk.cases7_lk}}</td>
                        <td class="has-text-light has-text-right">{{Math.round(lk.cases7_per_100k)}}</td>
                    </tr>
                </tbody>
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
            landkreise: []
        };
    },
    async created() {
        this.landkreise = await this.$root.$loader(this.urls.RKI_snapshot_URL).get()
    }
}
</script>
<style scoped>
.table {
    scroll-behavior: auto;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 0.8rem;
    max-height: 70vh;
}
.card-content {
    scroll-behavior: auto;
    max-height: 80vh;
    padding: 1rem;
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
</style>>