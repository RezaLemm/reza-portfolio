"use client"

export type TargetLang = "fa" | "en"

type ChangeLanguageOptions = {
  nextLang: TargetLang
  navigate: () => void
}

export function emitLanguageIntent(nextLang: TargetLang) {
  window.dispatchEvent(
    new CustomEvent("app:language-change-intent", {
      detail: {lang: nextLang},
    })
  )

  window.dispatchEvent(
    new CustomEvent("lemm:language-transition", {
      detail: {lang: nextLang},
    })
  )
}

export function changeLanguageWithTransition({nextLang, navigate}: ChangeLanguageOptions) {
  emitLanguageIntent(nextLang)
  navigate()
}