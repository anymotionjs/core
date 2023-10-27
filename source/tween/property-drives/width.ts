import type { TweenPropertyDrive } from '..'

declare global {
  interface TweenProperties {
    width?: number | string
  }
}

export const width: TweenPropertyDrive = {
  transform: (propertiesPair, progress, element) => {
    const { from, to } = propertiesPair
    const { width: fromWidth } = from || {}
    const { width: toWidth } = to

    if (typeof fromWidth !== 'undefined' && typeof toWidth !== 'undefined') {
      const currentValue = calculateCurrentValue(fromWidth, toWidth, progress)
      element.style.width = `${currentValue}`
    }
  }
}

// 辅助函数：根据动画进度计算当前值
function calculateCurrentValue(fromValue: number | string, toValue: number | string, progress: number): number | string {
  const numericFromValue = toNumericValue(fromValue)
  const numericToValue = toNumericValue(toValue)

  if (typeof numericFromValue === 'number' && typeof numericToValue === 'number') {
    const range = numericToValue - numericFromValue
    return numericFromValue + range * progress
  } else {
    return toValue
  }
}

// 辅助函数：将值转换为数值形式
function toNumericValue(value: number | string): number | undefined {
  if (typeof value === 'number') {
    return value
  } else if (typeof value === 'string' && /^[\d.-]+$/.test(value)) {
    return parseFloat(value)
  }
  return undefined
}
