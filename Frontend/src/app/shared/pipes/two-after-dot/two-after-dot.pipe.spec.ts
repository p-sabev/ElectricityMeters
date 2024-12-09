import { TwoAfterDotPipe } from './two-after-dot.pipe';

describe('TwoAfterDotPipe', () => {
  let pipe: TwoAfterDotPipe;

  beforeEach(() => {
    pipe = new TwoAfterDotPipe();
  });

  it('should create the pipe', () => {
    expect(pipe).toBeTruthy();
  });

  describe('transform', () => {
    it('should format a valid number with two decimal places', () => {
      expect(pipe.transform(123)).toBe('123.00');
      expect(pipe.transform(123.4)).toBe('123.40');
      expect(pipe.transform(123.456)).toBe('123.46');
    });

    it('should handle zero value and format with two decimal places', () => {
      expect(pipe.transform(0)).toBe('0.00');
    });

    it('should handle string inputs that are valid numbers', () => {
      expect(pipe.transform('123')).toBe('123.00');
      expect(pipe.transform('123.4')).toBe('123.40');
      expect(pipe.transform('123.456')).toBe('123.46');
    });

    it('should return "0.00" for null or undefined values', () => {
      expect(pipe.transform(null)).toBe('0.00');
      expect(pipe.transform(undefined)).toBe('0.00');
    });

    it('should return an empty string for non-numeric inputs', () => {
      expect(pipe.transform('abc')).toBe('');
      expect(pipe.transform({})).toBe('');
    });

    it('should return an empty string for NaN', () => {
      expect(pipe.transform(NaN)).toBe('');
    });
  });
});
