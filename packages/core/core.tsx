/* eslint-disable react-compiler/react-compiler */
import { RefObject, useMemo, useRef } from 'react'
import useMeasure from './use-measure'

const SafeAreaComponent = (ref: RefObject<HTMLDivElement>) => {
  return ({ debug = false, style, ...props }: React.HTMLAttributes<HTMLDivElement> & { debug?: boolean }) => {
    const { visibility } = style || {}

    if (visibility) {
      console.warn('SafeArea: style properties override. Avoid passing visibility property.')
    }

    return (
      <div
        {...props}
        style={{
          visibility: debug ? 'visible' : 'hidden',
          background: debug ? 'rgba(255, 0, 0, 0.25)' : undefined,
          ...style,
        }}
        ref={ref}
      />
    )
  }
}

export const useContainedBounds = (elmSize: { width: number; height: number }) => {
  const boundsRef = useRef<HTMLDivElement>(null)
  const bounds = useMeasure(boundsRef)

  const mediaAspectRatio = elmSize.width / elmSize.height
  const boundsAspectRatio = bounds.width / bounds.height

  let resolvedWidth, resolvedHeight

  if (mediaAspectRatio > boundsAspectRatio) {
    // Scale by width
    resolvedWidth = bounds.width
    resolvedHeight = (bounds.width / elmSize.width) * elmSize.height
  } else {
    // Scale by height
    resolvedHeight = bounds.height
    resolvedWidth = (bounds.height / elmSize.height) * elmSize.width
  }

  const SafeArea = useMemo(() => SafeAreaComponent(boundsRef), [])

  return [
    SafeArea,
    {
      width: resolvedWidth,
      height: resolvedHeight,
    },
  ]
}
