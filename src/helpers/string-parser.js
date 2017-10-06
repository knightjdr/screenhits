// parsing csv and tsv strings
// modified from https://stackoverflow.com/a/8497474/3182448

const stringParser = {
  csv: (text) => {
    const reValid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
    const reValue = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
    return stringParser.parser(text, reValid, reValue);
  },
  parser: (text, reValid, reValue) => {
    // Return NULL if input string is not well formed CSV string.
    if (!reValid.test(text)) {
      return null;
    }
    const parsedArray = [];
    // "Walk" the string using replace with callback.
    text.replace(reValue, (m0, m1, m2, m3) => {
      if (m1 !== undefined) {
        // Remove backslash from \' in single quoted values.
        parsedArray.push(m1.replace(/\\'/g, "'"));
      } else if (m2 !== undefined) {
        // Remove backslash from \" in double quoted values.
        parsedArray.push(m2.replace(/\\"/g, '"'));
      } else if (m3 !== undefined) {
        parsedArray.push(m3);
      }
      return ''; // Return empty string.
    });
    // Handle special case of empty last value.
    if (/,\s*$/.test(text)) {
      parsedArray.push('');
    }
    return parsedArray;
  },
  tsv: (text) => {
    return text.split('\t');
  },
};
export default stringParser;
