'use strict';

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
