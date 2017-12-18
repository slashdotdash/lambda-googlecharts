'use strict';

const S3 = require('aws-sdk/clients/s3');
const nodeGoogleCharts = require('@slashdotdash/node-googlecharts');

// Render a Google JavaScript chart using the provided `chartOptions`.
// A standard `callback` function must be provided to return the generated chart
// SVG or any error.
function renderChart(chartOptions, callback) {
  nodeGoogleCharts(chartOptions, 'svg')
    .then(chart => callback(null, chart))
    .catch(err => callback(err));
}

// Replace all occurences of templated params (e.g. `${foo}`) with their
// actual value from the given replacements object (e.g. `{foo: 'bar'}`).
function replaceValues(chartOpts, replacements) {
  return Object.keys(replacements)
    .reduce((acc, key) => {
      return acc.replace('${' + key + '}', replacements[key]);
    }, chartOpts);
}

// Render a Google JavaScript chart using chart options provided by the `event`
// arg.
module.exports.renderChart = function(event, context) {
  const chartOptions = event.chartOptions;

  renderChart(chartOptions, context.done);
};

// Render a Google JavaScript chart where the chart options are stored as JSON
// in a file hosted in an S3 bucket.
module.exports.renderS3Chart = function(event, context) {
  const s3Bucket = event.s3Bucket;
  const chart = event.chart;
  const chartData = event.data || {};

  const s3 = new S3({
    region: 'eu-west-2'
  });

  s3.getObject({
    Bucket: s3Bucket,
    Key: `${chart}.json`
  }, function(err, data) {
    if (err) {
      context.done(new Error(err));
      return;
    }

    const content = data.Body.toString('utf-8');
    const substituted = replaceValues(content, chartData);
    const chartOptions = JSON.parse(substituted);

    renderChart(chartOptions, context.done);
  });
}
