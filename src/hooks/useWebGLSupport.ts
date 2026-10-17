import { useEffect, useState } from 'react'

export function useWebGLSupport(): { supported: boolean; checking: boolean } {
  const [supported, setSupported] = useState<boolean>(true)
  const [checking, setChecking] = useState<boolean>(true)

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      const gl = (canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as (WebGLRenderingContext | null)
      const hasSupport = Boolean(gl)
      if (gl) {
        const ext = gl.getExtension('WEBGL_lose_context')
        if (ext) ext.loseContext()
      }
      setSupported(hasSupport)
    } catch {
      setSupported(false)
    } finally {
      setChecking(false)
    }
  }, [])

  return { supported, checking }
}
