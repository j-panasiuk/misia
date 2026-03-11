// @ts-check

import {
  assertValidExerciseId,
  examExerciseTemplates,
} from "./7th-grade/exam-exercises.js";
import {
  renderAnswer,
  renderExpression,
  renderInstruction,
  renderStep,
} from "./exercise-renderer.js";

class ExamExercise extends HTMLElement {
  constructor() {
    super();
    this.render = this.#render();
    this.handleKeyUp = this.#handleKeyUp.bind(this);
  }

  connectedCallback() {
    this.render.next();
    window.addEventListener("keyup", this.handleKeyUp);
  }

  disconnectedCallback() {
    window.removeEventListener("keyup", this.handleKeyUp);
  }

  #handleKeyUp(/** @type {KeyboardEvent} */ evt) {
    switch (evt.key) {
      case "Enter": {
        const { done } = this.render.next();
        if (done) window.dispatchEvent(new CustomEvent("next"));
        break;
      }
    }
  }

  // -- RENDERING --

  *#render() {
    const { instruction, primaryExpr: expr, steps, answer } = this.#exercise;

    // 1. Reveal exercise instruction
    this.$("instruction").innerHTML = renderInstruction(instruction);
    if (expr) this.$("expression").innerHTML = renderExpression(expr, "=");
    yield;

    // 2. Reveal solution steps, one at a time
    for (const step of steps) {
      this.$("solution").insertAdjacentHTML("beforeend", renderStep(step));
      yield;
    }

    // 3. Reveal answer
    this.$("answer").innerHTML = renderAnswer(answer);
    yield;
  }

  // -- HELPERS --

  get #exercise() {
    const exerciseId = this.getAttribute("exercise");
    assertValidExerciseId(exerciseId);
    return examExerciseTemplates[exerciseId]();
  }

  /**
   * @param {"instruction"|"expression"|"solution"|"answer"} selector
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

if (!customElements.get("exam-exercise"))
  customElements.define("exam-exercise", ExamExercise);
