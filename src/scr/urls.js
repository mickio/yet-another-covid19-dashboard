const ROOT = ''
// const ROOT = 'http://localhost:8000'

export default {
RKI_last_week_snapshot_URL: 'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?f=geojson&groupByFieldsForStatistics=IdLandkreis%2CLandkreis&where=Meldedatum%20%3E%20timestamp%20%272021-01-04%2000%3A00%3A00%27%20AND%20Meldedatum%20%3C%3D%20timestamp%20%272021-01-11%2000%3A00%3A00%27&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=%2A&outStatistics=%5B%7B%22statisticType%22%3A%20%22sum%22%2C%20%22onStatisticField%22%3A%20%22AnzahlFall%22%2C%20%22outStatisticFieldName%22%3A%20%22confirmed7%22%7D%2C%20%7B%22statisticType%22%3A%20%22sum%22%2C%20%22onStatisticField%22%3A%20%22AnzahlTodesfall%22%2C%20%22outStatisticFieldName%22%3A%20%22deaths7%22%7D%5D&resultType=standard&cacheHint=true',
RKI_snapshot_URL: "https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=1%3D1&outFields=*&returnGeometry=false&outSR=4326&f=geojson&orderBy='cases7_per_100k desc'",
RKI_history_URL: 'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?where=AnzahlFall>0&outFields=*&outSR=4326&f=geojson&groupByFieldsForStatistics=Meldedatum,NeuerFall&outStatistics=[{%22statisticType%22:%20%22sum%22,%20%22onStatisticField%22:%20%22AnzahlFall%22,%20%22outStatisticFieldName%22:%20%22GesamtFaelleTag%22}]&orderBy=Meldedatum',
// const RKI_history_deaths_URL = 'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?where=AnzahlTodesfall>0&outFields=*&outSR=4326&f=geojson&groupByFieldsForStatistics=Meldedatum,NeuerTodesfall&outStatistics=[{%22statisticType%22:%20%22sum%22,%20%22onStatisticField%22:%20%22AnzahlTodesfall%22,%20%22outStatisticFieldName%22:%20%22GesamtFaelleTag%22}]&orderBy=Meldedatum',
RKI_history_deaths_URL: 'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?where=NeuerTodesfall in (-1,1)&outFields=*&outSR=4326&f=geojson&groupByFieldsForStatistics=Meldedatum,NeuerTodesfall&outStatistics=[{%22statisticType%22:%20%22sum%22,%20%22onStatisticField%22:%20%22AnzahlTodesfall%22,%20%22outStatisticFieldName%22:%20%22GesamtFaelleTag%22}]&orderBy=Meldedatum',
RKI_county_history_URL: (county) => `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?where=AnzahlFall>0 AND Landkreis='${county}'&outFields=*&outSR=4326&f=geojson&groupByFieldsForStatistics=Meldedatum,NeuerFall&outStatistics=[{%22statisticType%22:%20%22sum%22,%20%22onStatisticField%22:%20%22AnzahlFall%22,%20%22outStatisticFieldName%22:%20%22GesamtFaelleTag%22}]&orderBy=Meldedatum`,
// const RKI_county_history_deaths_URL = (county) => `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?where=AnzahlTodesfall>0 AND Landkreis='${county}'&outFields=*&outSR=4326&f=geojson&groupByFieldsForStatistics=Meldedatum,NeuerTodesfall&outStatistics=[{%22statisticType%22:%20%22sum%22,%20%22onStatisticField%22:%20%22AnzahlTodesfall%22,%20%22outStatisticFieldName%22:%20%22GesamtFaelleTag%22}]&orderBy=Meldedatum`,
RKI_county_history_deaths_URL: (county) => `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?where=NeuerTodesfall in [-1,1] AND Landkreis='${county}'&outFields=*&outSR=4326&f=geojson&groupByFieldsForStatistics=Meldedatum,NeuerTodesfall&outStatistics=[{%22statisticType%22:%20%22sum%22,%20%22onStatisticField%22:%20%22AnzahlTodesfall%22,%20%22outStatisticFieldName%22:%20%22GesamtFaelleTag%22}]&orderBy=Meldedatum`,
RKI_county_total_URL: (county) => `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?where=AnzahlAnzahlFall>0 AND Landkreis='${county}'&outFields=*&outSR=4326&f=geojson&outStatistics=[{%22statisticType%22:%20%22sum%22,%20%22onStatisticField%22:%20%22AnzahlFall%22,%20%22outStatisticFieldName%22:%20%22GesamtFaelleTag%22}]&orderBy=Meldedatum`,
RKI_county_genesen_URL: (county) => `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?where=AnzahlGenesen>0 AND Landkreis='${county}'&outFields=*&outSR=4326&f=geojson&outStatistics=[{%22statisticType%22:%20%22sum%22,%20%22onStatisticField%22:%20%22AnzahlGenesen%22,%20%22outStatisticFieldName%22:%20%22GesamtFaelleTag%22}]&orderBy=Meldedatum`,
JHU_history_URL: (country, state) => `${ROOT}/data?country=${country}${state?'&state='+state:''}`,
JHU_snapshot_URL: (term) => `https://services9.arcgis.com/N9p5hsImWXAccRNI/arcgis/rest/services/Nc2JKvYFoAEOFCG5JSI6/FeatureServer/1/query?f=geojson&where=(Confirmed%20%3E%200)%20AND%20(Deaths%3E0)%20AND%20(Combined_Key%20Like%20%27%${term}%%27)&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=Deaths%20desc%2CCountry_Region%20asc%2CProvince_State%20asc&outSR=102100&resultOffset=0&resultRecordCount=10&cacheHint=true`,
RKI_last_report_county_URL: (county) => `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?f=geojson&where=Landkreis='${county}'%20AND%20NeuerFall%20IN(1,%20-1)&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&outStatistics=[{%22statisticType%22:%22sum%22,%22onStatisticField%22:%22AnzahlFall%22,%22outStatisticFieldName%22:%22diff%22}]&resultType=standard&cacheHint=true`,
RKI_last_report_URL: 'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?f=geojson&where=NeuerFall%20IN(1,%20-1)&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&outStatistics=[{%22statisticType%22:%22sum%22,%22onStatisticField%22:%22AnzahlFall%22,%22outStatisticFieldName%22:%22diff%22}]&resultType=standard&cacheHint=true',
RKI_last_report_deaths_URL: 'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?f=geojson&where=NeuerTodesfall%20IN(1,%20-1)&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&outStatistics=[{%22statisticType%22:%22sum%22,%22onStatisticField%22:%22AnzahlTodesfall%22,%22outStatisticFieldName%22:%22diff%22}]&resultType=standard&cacheHint=true',
RKI_total_URL: 'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?where=AnzahlFall>0&outFields=*&outSR=4326&f=geojson&outStatistics=[{%22statisticType%22:%20%22sum%22,%20%22onStatisticField%22:%20%22AnzahlFall%22,%20%22outStatisticFieldName%22:%20%22GesamtFaelle%22}]&orderBy=Meldedatum',
RKI_genesen_URL: 'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?where=AnzahlGenesen>0&outFields=*&outSR=4326&f=geojson&outStatistics=[{%22statisticType%22:%20%22sum%22,%20%22onStatisticField%22:%20%22AnzahlGenesen%22,%20%22outStatisticFieldName%22:%20%22GesamtFaelle%22}]&orderBy=Meldedatum',
RKI_gestorben_URL: 'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?where=AnzahlTodesfall>0&outFields=*&outSR=4326&f=geojson&outStatistics=[{%22statisticType%22:%20%22sum%22,%20%22onStatisticField%22:%20%22AnzahlTodesfall%22,%20%22outStatisticFieldName%22:%20%22GesamtFaelle%22}]&orderBy=Meldedatum',
RKI_last_report_deaths_county_URL: (county) => `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?f=geojson&where=NeuerTodesfall%20IN(1,%20-1) AND Landkreis='${county}'&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&outStatistics=[{%22statisticType%22:%22sum%22,%22onStatisticField%22:%22AnzahlTodesfall%22,%22outStatisticFieldName%22:%22diff%22}]&resultType=standard&cacheHint=true`,
RKI_total_county_URL: (county) => `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?where=AnzahlFall>0 AND Landkreis='${county}'&outFields=*&outSR=4326&f=geojson&outStatistics=[{%22statisticType%22:%20%22sum%22,%20%22onStatisticField%22:%20%22AnzahlFall%22,%20%22outStatisticFieldName%22:%20%22GesamtFaelle%22}]&orderBy=Meldedatum`,
RKI_genesen_county_URL: (county) => `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?where=AnzahlGenesen>0 AND Landkreis='${county}'&outFields=*&outSR=4326&f=geojson&outStatistics=[{%22statisticType%22:%20%22sum%22,%20%22onStatisticField%22:%20%22AnzahlGenesen%22,%20%22outStatisticFieldName%22:%20%22GesamtFaelle%22}]&orderBy=Meldedatum`,
RKI_gestorben_county_URL: (county) => `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?where=AnzahlTodesfall>0 AND Landkreis='${county}'&outFields=*&outSR=4326&f=geojson&outStatistics=[{%22statisticType%22:%20%22sum%22,%20%22onStatisticField%22:%20%22AnzahlTodesfall%22,%20%22outStatisticFieldName%22:%20%22GesamtFaelle%22}]&orderBy=Meldedatum`,
JHU_snapshot_headers: {'Accept': '*/*',
 'Accept-Encoding': 'gzip, deflate, br',
 'Accept-Language': 'de,en-US;q=0.7,en;q=0.3',
 'Connection': 'keep-alive',
 'DNT': '1',
 'Host': 'services9.arcgis.com',
 'Origin': 'https://www.arcgis.com',
 'Referer': 'https://www.arcgis.com/apps/opsdashboard/index.html',
 'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:74.0) Gecko/20100101 Firefox/74.0'}
}