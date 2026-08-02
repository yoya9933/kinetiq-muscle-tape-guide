"use client";

import { useEffect } from "react";

const tiltSelector = ".form-card,.question-card,.instruction-panel,.check-panel,.application-choice,.metrics>div,.reason-card,.ar-guide,.analysis-card,.model-panel";

export function useInterfaceEffects() {
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const main = document.querySelector<HTMLElement>("main");
    if (!main) return;

    function move(event: PointerEvent) {
      main!.style.setProperty("--spot-x", `${event.clientX}px`);
      main!.style.setProperty("--spot-y", `${event.clientY}px`);
      const card = (event.target as Element)?.closest<HTMLElement>(tiltSelector);
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      card.style.setProperty("--tilt-x", `${(-y * 4).toFixed(2)}deg`);
      card.style.setProperty("--tilt-y", `${(x * 5).toFixed(2)}deg`);
      card.style.setProperty("--card-light-x", `${((x + .5) * 100).toFixed(0)}%`);
      card.style.setProperty("--card-light-y", `${((y + .5) * 100).toFixed(0)}%`);
    }

    function leave(event: PointerEvent) {
      const card = (event.target as Element)?.closest<HTMLElement>(tiltSelector);
      if (!card || card.contains(event.relatedTarget as Node)) return;
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
    }

    function ripple(event: PointerEvent) {
      const button = (event.target as Element)?.closest<HTMLButtonElement>("button");
      if (!button || button.disabled) return;
      const rect = button.getBoundingClientRect();
      const wave = document.createElement("span");
      wave.className = "click-ripple";
      wave.style.left = `${event.clientX - rect.left}px`;
      wave.style.top = `${event.clientY - rect.top}px`;
      button.appendChild(wave);
      window.setTimeout(() => wave.remove(), 700);
    }

    main.addEventListener("pointermove", move);
    main.addEventListener("pointerout", leave);
    main.addEventListener("pointerdown", ripple);
    return () => {
      main.removeEventListener("pointermove", move);
      main.removeEventListener("pointerout", leave);
      main.removeEventListener("pointerdown", ripple);
    };
  }, []);
}
