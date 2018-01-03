const median = require('../helpers/median');
const Permission = require('../permission/permission');
const query = require('../query/query');
const arrUnique = require('../helpers/array-unique');

const Comparison = {
  get: (form, user) => {
    return new Promise((resolve) => {
      // format header
      const formatHeader = (sampleOrder, samples) => {
        return sampleOrder.map((sampleID) => {
          const sampleIndex = samples.findIndex((sample) => { return sample._id === sampleID; });
          let sampleName = samples[sampleIndex].name;
          if (samples[sampleIndex].replicate) {
            sampleName += `, ${samples[sampleIndex].replicate}`;
          }
          if (samples[sampleIndex].concentration) {
            sampleName += `, ${samples[sampleIndex].concentration}`;
          }
          if (samples[sampleIndex].timepoint) {
            sampleName += `, ${samples[sampleIndex].timepoint}`;
          }
          return sampleName;
        });
      };

      // format legend
      const formatLegend = (sample, metric) => {
        const propIndex = sample.properties.findIndex((prop) => {
          return prop.name === metric;
        });
        const legend = {
          valueName: {},
        };
        legend.valueName[metric] = sample.properties[propIndex].layName;
        return {
          legend,
          metricName: sample.properties[propIndex].layName.trim(),
        };
      };

      // format rows for heat map
      const formatRows = (metric, metricName, readout, rows, samples, sampleIDs) => {
        return rows.map((row) => {
          const currColumn = sampleIDs.map((sampleID) => {
            const sampleIndex = samples.findIndex((sample) => {
              return sample._id === sampleID;
            });
            const value = samples[sampleIndex].rows[row];
            const tooltip = {};
            if (value === null) {
              tooltip.text = `${readout} not present in sample set`;
            } else {
              tooltip[metricName] = value;
            }
            const fillValue = {
              tooltip,
            };
            fillValue[metric] = value || 0;
            return fillValue;
          });
          return {
            name: row,
            columns: currColumn,
          };
        });
      };

      // format samples form database
      const formatSamples = (samples, metric, readout) => {
        let rowNames = [];
        const formattedSamples = samples.map((sample) => {
          const rows = {};
          sample.records.forEach((record) => {
            if (Object.prototype.hasOwnProperty.call(rows, record[readout])) {
              rows[record[readout]] += Number(record[metric]);
            } else {
              rows[record[readout]] = Number(record[metric]);
            }
            rowNames.push(record[readout]);
          });
          return {
            _id: sample._id,
            rows,
          };
        });
        rowNames = arrUnique(rowNames).sort();
        return {
          formattedSamples,
          rows: rowNames,
        };
      };

      // get max and min for samples
      const getRange = (samples, metric) => {
        let max = 0;
        let min = 0;
        samples.forEach((sample) => {
          Object.values(sample.rows).forEach((row) => {
            if (row > max) {
              max = row;
            } else if (row < min) {
              min = row;
            }
          });
        });
        const range = {};
        range[metric] = {
          max,
          min,
        };
        return range;
      };

      // normalization
      const normalize = (samples, normCount = 0) => {
        // get summed counts across samples
        const sumCounts = () => {
          return samples.map((sample) => {
            let summed = 0;
            Object.values(sample.rows).forEach((row) => {
              summed += row;
            });
            return summed;
          });
        };

        const summedCounts = sumCounts();
        const normalizeValue = normCount || median(summedCounts);
        return samples.map((sample, sampleIndex) => {
          // normFactor is * 100 for rounding step below;
          const normFactor = 100 * (normalizeValue / summedCounts[sampleIndex]);
          const normalizedRows = Object.assign({}, sample.rows);
          Object.keys(normalizedRows).forEach((key) => {
            normalizedRows[key] = Math.round(normalizedRows[key] * normFactor) / 100;
          });
          return {
            _id: sample._id,
            rows: normalizedRows,
          };
        });
      };

      let formSamples;
      query.get('sample', { _id: { $in: form.design } }, { })
        .then((samples) => {
          formSamples = samples;
          const projects = samples.map((sample) => { return sample.group.project; });
          return Permission.canView.projects(projects, user);
        })
        .then(() => {
          const header = formatHeader(form.design, formSamples);
          const { legend, metricName } = formatLegend(formSamples[0], form.metric);
          const { formattedSamples, rows } = formatSamples(formSamples, form.metric, form.readout);
          const normResults = form.norm ?
            normalize(formattedSamples, form.normCount)
            :
            formattedSamples
          ;
          const range = getRange(normResults, form.metric);
          const formattedRows = formatRows(
            form.metric,
            metricName,
            form.readout,
            rows,
            normResults,
            form.design
          );
          resolve({
            status: 200,
            clientResponse: {
              data: {
                header,
                legend,
                options: {
                  filters: [],
                  valueName: [
                    {
                      text: metricName,
                      value: form.metric,
                    },
                  ],
                },
                range,
                results: formattedRows,
              },
              message: 'Comparison complete',
              status: 200,
            },
          });
        })
      ;
    });
  },
};
module.exports = Comparison;
