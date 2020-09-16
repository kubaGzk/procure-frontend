export const copyObject = (obj) => {
  const copiedObj = {};

  for (let key in obj) {
    if (typeof obj[key] === "object") {
      copiedObj[key] = copyObject(obj[key]);
    } else {
      copiedObj[key] = obj[key];
    }
  }

  return copiedObj;
};

export const copyArray = (obj) => {
  const copiedObj = [];

  for (let key in obj) {
    if (typeof obj[key] === "object") {
      copiedObj[key] = copyObject(obj[key]);
    } else {
      copiedObj[key] = obj[key];
    }
  }

  return copiedObj;
};
