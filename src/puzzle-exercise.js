// @ts-check

import { randomPuzzle } from "./7th-grade/puzzle-exercises.js";
import { renderAnswer, renderExpression } from "./exercise-renderer.js";

class PuzzleExercise extends HTMLElement {
  puzzle = randomPuzzle();

  /** @type {undefined|Solved} */
  solved = undefined;

  constructor() {
    super();
    this.handleKeyUp = this.#handleKeyUp.bind(this);
  }

  connectedCallback() {
    this.#render();
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
        return this.solved ? this.#nextExercise() : this.#checkAnswer();
      }
    }
  }

  // -- RENDERING --

  #nextExercise() {
    this.replaceWith(document.createElement(this.tagName));
  }

  #checkAnswer() {
    const userAnswer = this.$("[contenteditable]").textContent.trim();
    const userAnswerValue = userAnswer ? Number(userAnswer) : NaN;

    if (Number.isFinite(userAnswerValue)) {
      this.solved =
        userAnswerValue === this.puzzle.answer ? "correct" : "incorrect";

      this.#render();
    }
  }

  #render() {
    if (!this.children.length) {
      this.appendChild(document.createElement("expression"));
      this.appendChild(document.createElement("answer"));
    }

    const expression = this.$("expression");

    if (!expression.children.length) {
      expression.innerHTML = renderExpression(this.puzzle.primaryExpr);
    }

    const answer = this.$("answer");
    const editable = this.$("[contenteditable]");

    if (!this.solved) {
      requestAnimationFrame(() => editable.focus());
    } else {
      answer.innerHTML = renderAnswer(this.puzzle.answer);
      editable.blur();
      editable.classList.add(this.solved);
    }
  }

  // -- HELPERS --

  /**
   * @param {"expression"|"answer"|"[contenteditable]"} selector
   * @returns {HTMLElement} element matching selector
   * @throws when element not found
   */
  $(selector) {
    const el = this.querySelector(selector);
    if (!(el instanceof HTMLElement))
      throw new Error(`"${selector}" element is missing!`);
    return el;
  }
}

if (!customElements.get("puzzle-exercise"))
  customElements.define("puzzle-exercise", PuzzleExercise);
