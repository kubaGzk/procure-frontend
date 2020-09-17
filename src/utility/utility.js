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

export const checkLatinChars = (targetValue) => {
  const charsArr = Array.from(targetValue);
  const copiedValueArr = [];

  for (const ind in charsArr) {
    let charCode = targetValue.charCodeAt(ind);

    if(charCode === 8){
      return targetValue;
    }


    if (
      (charCode >= 65 && charCode <= 90) ||
      (charCode >= 97 && charCode <= 122)
    ) {
      copiedValueArr.push(charsArr[ind]);
    }
  }

  return copiedValueArr.join("");
};

export const checkNumberChars = (targetValue) => {
  const charsArr = Array.from(targetValue);
  const copiedValueArr = [];



  for (const ind in charsArr) {
    let charCode = targetValue.charCodeAt(ind);

    if(charCode === 8){
      return targetValue;
    }

    if ((charCode >= 48 && charCode <= 57)) {
      copiedValueArr.push(charsArr[ind]);
    }
  }

  return copiedValueArr.join("");
};
