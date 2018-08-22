<template>
  <div class='example-page'>
    <div class="chart">
      <line-chart
        :dataModel='lineChartData'
        propID='example-line-chart'
        metric='Last Sale Price'
        title='Example Line Chart'
      ></line-chart>
    </div>
  </div>
</template>


<script>
  import { D3LineChart } from 'jscatalyst'

  export default {
    data: function() {
      return {
        lineChartData: [
          {"date": "2017-1-1", "value": 2},
          {"date": "2017-4-1", "value": 5},
          {"date": "2017-2-1", "value": 1},
          {"date": "2017-3-1", "value": 6},
          {"date": "2017-1-10", "value": 1}
        ]
      }
    },
    components: {
      'line-chart': D3LineChart
    }
  }
</script>

<style>
  .chart {
    height: 400px;
  }
</style>