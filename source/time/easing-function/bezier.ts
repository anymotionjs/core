import type { EasingFunction } from '.'

// 计算贝塞尔插值
function computedBezier(t: number, controlPoints: number[]): number {
  const n = controlPoints.length - 1;
  let value = 0;
  for (let i = 0; i <= n; i++) {
    value += controlPoints[i] * Math.pow(1 - t, n - i) * Math.pow(t, i) * binomialCoefficient(n, i);
  }
  return value;
}

// 计算二项式系数
function binomialCoefficient(n: number, k: number): number {
  let result = 1;
  for (let i = 1; i <= k; i++) {
    result *= (n - i + 1) / i;
  }
  return result;
}

// 创建自定义贝塞尔缓动函数
export function bezier(...controlPoints: number[]): EasingFunction {
  return function(t: number): number {
    // 使用二分法近似计算 t 对应的插值
    let start = 0;
    let end = 1;
    const epsilon = 1e-6;

    while (end - start > epsilon) {
      const mid = (start + end) / 2;
      const value = computedBezier(mid, controlPoints);
      if (value < t) {
        start = mid;
      } else {
        end = mid;
      }
    }

    return computedBezier(start, controlPoints);
  };
}
