'use strict';

const S3 = require('aws-sdk/clients/s3');
const spawn = require('child_process').exec;

function renderChart(chartOptions, callback) {
  const ps = spawn(
    `node node_modules/node-googlecharts/bin/node-googlecharts '${chartOptions}' 'svg'`,
    (error, stdout, stderr) => {
      if (error) {
        callback(new Error('[ServerError] ' + error.message));
      } else if (stderr) {
        callback(new Error('[ServerError] ' + stderr));
      } else {
        callback(null, stdout);
      }
    }
  );
}

module.exports.renderChart = function(event, context) {
  const chartOptions = JSON.stringify(event.chartOptions);

  renderChart(chartOptions, context.done);
};

module.exports.renderS3Chart = function(event, context) {
  const s3Bucket = event.s3Bucket;
  const chart = event.chart;
  const data = event.data;

  const s3 = new S3({
    region: 'eu-west-2'
  });

  s3.getObject({
    Bucket: s3Bucket,
    Key: `${chart}.json`
  }, function(err, data) {
    if (err) {
      context.done(new Error(err));
    }

    const content = data.Body.toString('utf-8');

    renderChart(content, context.done);
  });
}
