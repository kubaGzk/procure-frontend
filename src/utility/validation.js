const validation = (value, rules) => {
  let isValid = true;
  const foundErrors = {};

  if (!rules.hasOwnProperty("notEmpty") && value.length === 0) {
    return { valid: false, foundErrors };
  }

  for (let rule in rules) {
    switch (rule) {
      case "regularExp":
        isValid = isValid && regularExpValidation(value, rules[rule]);
        if (!regularExpValidation(value, rules[rule])) {
          foundErrors[rule] = true;
        }
        break;

      case "minLength":
        isValid = isValid && minLengthValidation(value.length, rules[rule]);
        if (!minLengthValidation(value.length, rules[rule])) {
          foundErrors[rule] = true;
        }
        break;

      case "maxLength":
        isValid = isValid && maxLengthValidation(value.length, rules[rule]);
        if (!maxLengthValidation(value.length, rules[rule])) {
          foundErrors[rule] = true;
        }
        break;

      case "minValue":
        isValid = isValid && minValueValidation(value, rules[rule]);
        if (!minValueValidation(value, rules[rule])) {
          foundErrors[rule] = true;
        }
        break;

      case "maxValue":
        isValid = isValid && maxValueValidation(value, rules[rule]);
        if (!maxValueValidation(value, rules[rule])) {
          foundErrors[rule] = true;
        }
        break;

      case "notEmpty":
        isValid = isValid && notEmptyValidation(value);
        if (!notEmptyValidation(value)) {
          foundErrors[rule] = true;
        }
        break;

      default:
        isValid = true;
    }
  }

  return { valid: isValid, foundErrors };
};

const minLengthValidation = (length, rule) => {
  return length >= rule;
};

const maxLengthValidation = (length, rule) => {
  return length <= rule;
};

const minValueValidation = (value, rule) => {
  return value >= rule;
};

const maxValueValidation = (value, rule) => {
  return value <= rule;
};

const regularExpValidation = (value, rule) => {
  return rule.test(value);
};

const notEmptyValidation = (value) => {

  return typeof value === "object" ? value.id.length > 0 : value.length > 0;
};

export default validation;
