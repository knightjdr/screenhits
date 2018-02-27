const Permission = require('../permission/permission');
const query = require('../query/query');

const Sample = {
  get: (target, format, user) => {
    return new Promise((resolve) => {
      const contentType = {
        html: 'text/html',
        tsv: 'text/tab-separated-values',
      };
      const formatSample = (sample) => {
        let returnElement = '';
        // get all properties stored as records and sample props
        const recordKeys = Object.keys(sample.records[0]);
        const sampleKeys = sample.properties.map((prop) => { return prop.name; });
        // check which properties were added from database (not supplied by user)
        const addedKeys = recordKeys.filter((x) => { return !sampleKeys.includes(x); });
        // format
        switch (format) {
          case 'html': {
            const columns = [];
            // format header
            const header = sample.properties.map((prop) => {
              columns.push(prop.name);
              return `<th>${prop.layName}</th>`;
            }).concat(addedKeys.map((prop) => {
              columns.push(prop);
              return `<th>${prop}</th>`;
            })).join('');
            // create rows
            const body = sample.records.map((record) => {
              let row = '';
              columns.forEach((column) => {
                row += `<td>${record[column]}</td>`;
              });
              return `<tr>${row}</tr>`;
            }).join('');
            returnElement += `
              <table width="100%" style="font-family: courier, font-size: 10px;">
                <tr>
                  ${header}
                </tr>
                ${body}
              </table>`
            ;
            break;
          }
          case 'tsv': {
            const columns = [];
            // create tab separated header
            returnElement = sample.properties.map((prop) => {
              columns.push(prop.name);
              return prop.layName;
            }).concat(addedKeys.map((prop) => {
              columns.push(prop);
              return prop;
            })).join('\t');
            returnElement += '\n';
            // create rows
            sample.records.forEach((record) => {
              returnElement += columns.map((column) => {
                return `${record[column]}`;
              }).join('\t');
              returnElement += '\n';
            });
            break;
          }
          default:
            break;
        }
        return returnElement;
      };
      let sampleObj = {};
      query.get('sample', { _id: target }, { _id: 0, group: 1, properties: 1, records: 1 }, 'findOne')
        .then((sample) => {
          sampleObj = sample;
          return Permission.canView.project(sample.group.project, user);
        })
        .then(() => {
          resolve({
            status: 200,
            clientResponse: {
              status: 200,
              contentType: contentType[format],
              data: formatSample(sampleObj),
            },
          });
        })
        .catch((error) => {
          resolve({
            status: 500,
            clientResponse: {
              status: 500,
              message: `There was an error retrieving this sample: ${error}`,
            },
          });
        })
      ;
    });
  },
};
module.exports = Sample;
