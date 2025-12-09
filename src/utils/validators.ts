import { NORMAL_RANGES } from "./constants";

export const validateTestValue = (
  field: keyof typeof NORMAL_RANGES,
  value: number
): { isValid: boolean; message: string } => {
  const range = NORMAL_RANGES[field];
  if (isNaN(value) || value < 0) {
    return { isValid: false, message: "Please enter a valid number" };
  }
  if (value < range.min) {
    return {
      isValid: true,
      message: `Below normal (${range.min}-${range.max} ${range.unit})`,
    };
  }
  if (value > range.max) {
    return {
      isValid: true,
      message: `Above normal (${range.min}-${range.max} ${range.unit})`,
    };
  }
  return {
    isValid: true,
    message: `Normal (${range.min}-${range.max} ${range.unit})`,
  };
};

export const formatNumber = (value: number, decimals: number = 2): string => {
  return value.toFixed(decimals);
};
