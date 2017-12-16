'use strict';

const S3 = require('aws-sdk/clients/s3');
const spawn = require('child_process').exec;

module.exports.renderChart = function(event, context) {
  const ps = spawn(
    `node node_modules/node-googlecharts/bin/node-googlecharts '${JSON.stringify(event.chartOptions)}' 'svg'`,
    (error, stdout, stderr) => {
      if (error) {
        context.done(new Error('[ServerError] ' + error.message));
      } else if (stderr) {
        context.done(new Error('[ServerError] ' + stderr));
      } else {
        context.done(null, stdout);
      }
    }
  );
};

module.exports.renderS3Chart = function(event, context) {
  console.log('event', event);

  const s3Bucket = event.s3Bucket;
  const chart = event.chart;
  const data = event.data;

  console.log('s3Bucket', s3Bucket);
  console.log('chart', chart);
  console.log('data', data);

  const s3 = new S3({
    region: 'eu-west-2'
  });

  console.log('Getting from S3', s3Bucket, `${chart}.json`);

  s3.getObject({
    Bucket: s3Bucket,
    Key: `${chart}.json`
  }, function(err, data) {
    if (err) {
      console.log('s3 error', err);
      context.done(new Error(err));
    }

    console.log('s3 ok', data);
    context.done(null, data);
  });
}
