import { clamp } from './utils';

describe('clamp', () => {
  it('should constrain a value between a min and max value', () => {
    expect(clamp(0, 1, 10)).toBe(1);
    expect(clamp(11, 1, 10)).toBe(10);
    expect(clamp(5, 1, 10)).toBe(5);
    expect(clamp(0, 10, 1)).toBe(1);
    expect(clamp(11, 10, 1)).toBe(10);
    expect(clamp(5, 10, 1)).toBe(5);
    expect(clamp(1, 10, 10)).toBe(10);
  });
});
