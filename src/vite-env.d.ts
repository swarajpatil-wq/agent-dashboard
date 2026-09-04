/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

import 'styled-components'

declare module 'styled-components' {
  export interface DefaultTheme {
    space: Record<string, number>
    fontSizes: Record<string, number>
    fontWeights: Record<string, number>
    lineHeights: Record<string, number>
    borderRadii: Record<string, number>
    iconSizes: Record<string, number>
    opacity: Record<string, number>
    borders: Record<string, string>
    colors: Record<string, any>
    palette: Record<string, any>
    shadows: Record<string, string>
    fonts: Record<string, string>
    breakpoints: Record<string, number>
    [key: string]: any
  }
}
