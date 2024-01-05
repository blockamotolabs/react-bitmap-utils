import { clamp, remapValue } from './utils';

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

describe('remapValue', () => {
  it('should map a value from one range to another', () => {
    expect(remapValue(-1, 0, 10, 0, 100)).toBe(-10);
    expect(remapValue(0, 0, 10, 0, 100)).toBe(0);
    expect(remapValue(5, 0, 10, 0, 100)).toBe(50);
    expect(remapValue(10, 0, 10, 0, 100)).toBe(100);
    expect(remapValue(11, 0, 10, 0, 100)).toBe(110);

    expect(remapValue(-1, 0, 10, 100, 0)).toBe(110);
    expect(remapValue(0, 0, 10, 100, 0)).toBe(100);
    expect(remapValue(5, 0, 10, 100, 0)).toBe(50);
    expect(remapValue(10, 0, 10, 100, 0)).toBe(0);
    expect(remapValue(11, 0, 10, 100, 0)).toBe(-10);

    expect(remapValue(-1, 10, 0, 100, 0)).toBe(-10);
    expect(remapValue(0, 10, 0, 100, 0)).toBe(0);
    expect(remapValue(5, 10, 0, 100, 0)).toBe(50);
    expect(remapValue(10, 10, 0, 100, 0)).toBe(100);
    expect(remapValue(11, 10, 0, 100, 0)).toBe(110);

    expect(remapValue(-1, 10, 0, 0, 100)).toBe(110);
    expect(remapValue(0, 10, 0, 0, 100)).toBe(100);
    expect(remapValue(5, 10, 0, 0, 100)).toBe(50);
    expect(remapValue(10, 10, 0, 0, 100)).toBe(0);
    expect(remapValue(11, 10, 0, 0, 100)).toBe(-10);
  });

  it('should map a value from one range to another and clamp them', () => {
    expect(remapValue(-1, 0, 10, 0, 100, true)).toBe(0);
    expect(remapValue(0, 0, 10, 0, 100, true)).toBe(0);
    expect(remapValue(5, 0, 10, 0, 100, true)).toBe(50);
    expect(remapValue(10, 0, 10, 0, 100, true)).toBe(100);
    expect(remapValue(11, 0, 10, 0, 100, true)).toBe(100);

    expect(remapValue(-1, 0, 10, 100, 0, true)).toBe(100);
    expect(remapValue(0, 0, 10, 100, 0, true)).toBe(100);
    expect(remapValue(5, 0, 10, 100, 0, true)).toBe(50);
    expect(remapValue(10, 0, 10, 100, 0, true)).toBe(0);
    expect(remapValue(11, 0, 10, 100, 0, true)).toBe(0);

    expect(remapValue(-1, 10, 0, 100, 0, true)).toBe(0);
    expect(remapValue(0, 10, 0, 100, 0, true)).toBe(0);
    expect(remapValue(5, 10, 0, 100, 0, true)).toBe(50);
    expect(remapValue(10, 10, 0, 100, 0, true)).toBe(100);
    expect(remapValue(11, 10, 0, 100, 0, true)).toBe(100);

    expect(remapValue(-1, 10, 0, 0, 100, true)).toBe(100);
    expect(remapValue(0, 10, 0, 0, 100, true)).toBe(100);
    expect(remapValue(5, 10, 0, 0, 100, true)).toBe(50);
    expect(remapValue(10, 10, 0, 0, 100, true)).toBe(0);
    expect(remapValue(11, 10, 0, 0, 100, true)).toBe(0);
  });
});
