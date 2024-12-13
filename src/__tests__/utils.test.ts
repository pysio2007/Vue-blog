import { describe, it, expect } from '@jest/globals';

// 示例同步函数
const add = (a: number, b: number) => a + b;

// 示例异步函数
const fetchData = async () => {
  return new Promise<string>((resolve) => {
    setTimeout(() => {
      resolve('data');
    }, 1000);
  });
};

describe('Utils Tests', () => {
  // 同步函数测试
  it('should add two numbers correctly', () => {
    const result = add(1, 2);
    expect(result).toBe(3);
  });

  // 异步函数测试
  it('should fetch data correctly', async () => {
    const data = await fetchData();
    expect(data).toBe('data');
  });

  // 异步函数测试 - 使用 done 回调
  it('should fetch data correctly with done callback', (done) => {
    fetchData().then((data) => {
      expect(data).toBe('data');
      done();
    });
  });

  // 异步函数测试 - 使用 resolves
  it('should fetch data correctly with resolves', () => {
    return expect(fetchData()).resolves.toBe('data');
  });

  // 异步函数测试 - 使用 async/await 和 expect.assertions
  it('should fetch data correctly with async/await and assertions', async () => {
    expect.assertions(1);
    const data = await fetchData();
    expect(data).toBe('data');
  });
});