export function createElementSelector() {
  const elements: Element[] = []
  const selectors: Array<Element | string> = []

  return {
    setSelector: (...newSelectors: Array<Element | string>) => {
      selectors.splice(0, selectors.length)
      elements.splice(0, elements.length)
      selectors.push(...newSelectors)
    },
    getElements: () => {
      if (elements.length > 0) return elements

      const elementSet = new Set<Element>()
      for (const selector of selectors) {
        if (selector instanceof Element) {
          elementSet.add(selector)
        }

        if (typeof selector === 'string') {
          const elements = document.querySelectorAll(selector).values()
          for (const element of elements) elementSet.add(element)
        }
      }

      elements.push(...elementSet.values())
      return elements
    }
  }
}
