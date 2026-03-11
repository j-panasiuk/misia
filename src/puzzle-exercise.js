// @ts-check

import { randomPuzzle } from "./7th-grade/puzzle-exercises.js";
import { renderAnswer, renderExpression } from "./exercise-renderer.js";

class PuzzleExercise extends HTMLElement {
  puzzle = randomPuzzle();

  constructor() {
    super();
    this.render = this.#render();
    this.handleKeyUp = this.#handleKeyUp.bind(this);
  }

  connectedCallback() {
    this.render.next();
    window.addEventListener("keypress", this.handleKeyUp);
  }

  disconnectedCallback() {
    window.removeEventListener("keypress", this.handleKeyUp);
  }

  #handleKeyUp(/** @type {KeyboardEvent} */ evt) {
    switch (evt.key) {
      case "Enter": {
        // Ensure we don't insert a newline by pressing enter as we type.
        if (document.activeElement?.hasAttribute("contenteditable")) {
          evt.preventDefault();
        }

        // Check if user has filled in a numeric value
        if (Number.isNaN(this.#userAnswerValue)) return;

        const { done } = this.render.next();
        if (done) this.#nextExercise();

        break;
      }
    }
  }

  // -- RENDERING --

  *#render() {
    const { primaryExpr, answer } = this.puzzle;

    // 1. Reveal exercise
    this.$("expression").innerHTML = renderExpression(primaryExpr);
    window.requestAnimationFrame(() => this.$userAnswer?.focus());
    yield;

    // 2. Reveal answer
    this.$("answer").innerHTML = renderAnswer(answer);
    this.$userAnswer?.blur();
    this.$userAnswer?.classList.add(this.#checkAnswer());
    yield;
  }

  #nextExercise() {
    this.replaceWith(document.createElement(this.tagName));
  }

  // -- HELPERS --

  get $userAnswer() {
    return /** @type {HTMLElement|null} */ (
      this.querySelector("[contenteditable]")
    );
  }

  get #userAnswerValue() {
    const userAnswer = this.$userAnswer?.textContent.trim();
    return userAnswer ? Number(userAnswer) : NaN;
  }

  #checkAnswer() {
    return this.#userAnswerValue === this.puzzle.answer
      ? "correct"
      : "incorrect";
  }

  /**
   * @param {"expression"|"answer"} selector
   * @returns {HTMLElement} element matching selector
   * @throws when element not found
   */
  $(selector) {
    const el = this.querySelector(selector);
    return el instanceof HTMLElement
      ? el
      : this.appendChild(
          /** @type {HTMLElement} */ (document.createElement(selector)),
        );
  }
}

if (!customElements.get("puzzle-exercise"))
  customElements.define("puzzle-exercise", PuzzleExercise);
