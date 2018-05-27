/**
 * Returns a promise that resolves to an HTML image element once the image loads
 * @param src The source URL for the image
 * @param anonymous If true, sets cross-origin to anonymous
 */
export function promiseImage(src: string, anonymous: boolean = true): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    if (anonymous) img.crossOrigin = 'Anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}