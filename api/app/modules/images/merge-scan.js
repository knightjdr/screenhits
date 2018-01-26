const Scan = {
  r: (jimpArr) => {
    return jimpArr[0];
  },
  g: (jimpArr) => {
    return jimpArr[1];
  },
  b: (jimpArr) => {
    return jimpArr[2];
  },
  rg: (jimpArr) => {
    const mergedJimp = jimpArr[0];
    jimpArr[0].scan(
      0,
      0,
      jimpArr[0].bitmap.width,
      jimpArr[0].bitmap.height,
      (x, y, idx) => {
        mergedJimp.bitmap.data[idx + 1] = jimpArr[1].bitmap.data[idx + 1];
      }
    );
    return mergedJimp;
  },
  rb: (jimpArr) => {
    const mergedJimp = jimpArr[0];
    jimpArr[0].scan(
      0,
      0,
      jimpArr[0].bitmap.width,
      jimpArr[0].bitmap.height,
      (x, y, idx) => {
        mergedJimp.bitmap.data[idx + 2] = jimpArr[2].bitmap.data[idx + 2];
      }
    );
    return mergedJimp;
  },
  gb: (jimpArr) => {
    const mergedJimp = jimpArr[1];
    jimpArr[1].scan(
      0,
      0,
      jimpArr[0].bitmap.width,
      jimpArr[0].bitmap.height,
      (x, y, idx) => {
        mergedJimp.bitmap.data[idx + 2] = jimpArr[2].bitmap.data[idx + 2];
      }
    );
    return mergedJimp;
  },
  rgb: (jimpArr) => {
    const mergedJimp = jimpArr[0];
    jimpArr[0].scan(
      0,
      0,
      jimpArr[0].bitmap.width,
      jimpArr[0].bitmap.height,
      (x, y, idx) => {
        mergedJimp.bitmap.data[idx + 1] = jimpArr[1].bitmap.data[idx + 1];
        mergedJimp.bitmap.data[idx + 2] = jimpArr[2].bitmap.data[idx + 2];
      }
    );
    return mergedJimp;
  },
};
module.exports = Scan;
