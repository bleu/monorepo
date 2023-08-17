import { trimTrailingValues } from "./utils";

describe('trimTrailingValues function', () => {
    it('should trim trailing values from number arrays', () => {
      const inputNumbersIn = [100, 200, 300, 100, 150, 100, 100, 100];
      const inputNumbersOut = [50, 100, 150, 100, 200, 100, 100, 100];
      const valueToTrim = 100;
  
      const result = trimTrailingValues(inputNumbersIn, inputNumbersOut, valueToTrim);
  
      expect(result.trimmedIn).toEqual([100, 200, 300, 100, 150]);
      expect(result.trimmedOut).toEqual([50, 100, 150, 100, 200]);
    });
  
    it('should trim trailing values from string arrays', () => {
      const inputStringsIn = ['one', 'two', 'three', 'four', 'one', 'one', 'one'];
      const inputStringsOut = ['five', 'one', 'two', 'one', 'three', 'one', 'one'];
      const valueToTrim = 'one';
  
      const result = trimTrailingValues(inputStringsIn, inputStringsOut, valueToTrim);
  
      expect(result.trimmedIn).toEqual(['one', 'two', 'three', 'four', 'one']);
      expect(result.trimmedOut).toEqual(['five', 'one', 'two', 'one', 'three']);
    });
  
    it('should handle no trailing values', () => {
      const inputNumbersIn = [100, 200, 300];
      const inputNumbersOut = [50, 100, 150];
      const valueToTrim = 100;
  
      const result = trimTrailingValues(inputNumbersIn, inputNumbersOut, valueToTrim);
  
      expect(result.trimmedIn).toEqual([100, 200, 300]);
      expect(result.trimmedOut).toEqual([50, 100, 150]);
    });
  
    it('should handle empty arrays', () => {
      const inputStringsIn: string[] = [];
      const inputStringsOut: string[] = [];
      const valueToTrim = 'one';
  
      const result = trimTrailingValues(inputStringsIn, inputStringsOut, valueToTrim);
  
      expect(result.trimmedIn).toEqual([]);
      expect(result.trimmedOut).toEqual([]);
    });
  });
