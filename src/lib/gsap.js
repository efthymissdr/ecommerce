import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Flip } from 'gsap/Flip'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, Flip, useGSAP)

export const REDUCED = '(prefers-reduced-motion: reduce)'
export const FULL = '(prefers-reduced-motion: no-preference)'

export { gsap, ScrollTrigger, Flip, useGSAP }
