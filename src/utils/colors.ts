import { screen } from "color-blend";
import { RGBA } from "color-blend/dist/types";

export const parseRGBA = (rgba: string) => {
  const parts = rgba.match(/rgba\((\d+), (\d+), (\d+), (\d+\.?\d*)\)/);

  return parts
    ? {
        r: parseInt(parts[1]),
        g: parseInt(parts[2]),
        b: parseInt(parts[3]),
        a: 1,
      }
    : {
        r: 0,
        g: 0,
        b: 0,
        a: 1,
      };
};

export const rgbaString = ({ r, g, b, a }: RGBA) => {
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

export const averageColors = (colors: RGBA[]) => {
  return colors.reduce((acc, color) => {
    return screen(acc, color);
  }, colors[0]);
};

// export const generateColorCombinations = (colors: string[]) => {
//   const colorArrays = colors;
//   const result = [...colorArrays];

//   const totalCombinations = Math.pow(colorArrays.length, 2);

//   for (let i = colors.length; i < totalCombinations; i++) {
//     result.push(colorArrays[i % colorArrays.length]);
//   }

//   return result;
// };

export const generateColorCombinations = (colors: string[]) => {
  const colorArrays = colors.map(parseRGBA);
  const result: RGBA[] = [...colorArrays];

  const getAllCombinations = (arr: RGBA[], n: number): RGBA[][] => {
    const res: RGBA[][] = [];
    const combination = (prefix: RGBA[], arr: RGBA[], n: number) => {
      if (n === 0) {
        res.push(prefix);
        return;
      }
      for (let i = 0; i < arr.length; i++) {
        combination([...prefix, arr[i]], arr.slice(i + 1), n - 1);
      }
    };
    combination([], arr, n);
    return res;
  };

  for (let i = 2; i <= colorArrays.length; i++) {
    const combinations = getAllCombinations(colorArrays, i);
    combinations.forEach((combination) => {
      result.push(averageColors(combination));
    });
  }

  return result.map(rgbaString);
};

export const combineColors = (colors: string[]) => {
  const colorArrays = colors.map(parseRGBA);

  return averageColors(colorArrays);
};
