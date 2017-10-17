const query = require('../query/query');

const Sample = {
  get: (target, format) => {
    return new Promise((resolve) => {
      const formatSample = (sample) => {
        let returnElement = '';
        switch (format) {
          case 'html': {
            const columns = [];
            const header = sample.properties.map((prop) => {
              columns.push(prop.name);
              return `<th>${prop.layName}</th>`;
            }).join('');
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
          default:
            break;
        }
        return returnElement;
      };
      query.get('sample', { _id: Number(target) }, { _id: 0, properties: 1, records: 1 }, 'findOne')
        .then((sample) => {
          if (sample) {
            resolve({
              status: 200,
              clientResponse: {
                status: 200,
                data: formatSample(sample),
              },
            });
          } else {
            resolve({
              status: 500,
              clientResponse: {
                status: 500,
                message: 'There was an error retrieving this sample',
              },
            });
          }
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
