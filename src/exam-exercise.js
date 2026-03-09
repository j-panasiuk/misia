// @ts-check

import { exercises, isExerciseId } from "./7th-grade/exercises";
import {
  renderAnswer,
  renderExpression,
  renderInstruction,
  renderSteps,
} from "./exercise-renderer";

class ExamExercise extends HTMLElement {
  constructor() {
    super();
    this.handleKeyUp = this.#handleKeyUp.bind(this);
  }

  connectedCallback() {
    this.#render(false);
    window.addEventListener("keyup", this.handleKeyUp);
  }

  disconnectedCallback() {
    window.removeEventListener("keyup", this.handleKeyUp);
  }

  #handleKeyUp(/** @type {KeyboardEvent} */ evt) {
    switch (evt.key) {
      case "Enter": {
        if (!this.isAnswerRevealed) {
          this.#render(true);
        } else {
          window.dispatchEvent(new CustomEvent("next"));
        }
        break;
      }
    }
  }

  // -- RENDERING --

  #render(/** @type {boolean} */ revealSolution) {
    const exercise = this.exercise;

    if (!this.children.length) {
      this.appendChild(document.createElement("instruction"));
      this.appendChild(document.createElement("expression"));
      this.appendChild(document.createElement("solution"));
      this.appendChild(document.createElement("answer"));
    }

    this.$("instruction").innerHTML = renderInstruction(exercise.instruction);

    if (exercise.primaryExpr)
      this.$("expression").innerHTML = renderExpression(
        exercise.primaryExpr,
        "=",
      );

    if (revealSolution && exercise.steps?.length)
      this.$("solution").innerHTML = renderSteps(exercise.steps);

    if (revealSolution)
      this.$("answer").innerHTML = renderAnswer(exercise.answer);
  }

  // -- HELPERS --

  get exercise() {
    const exerciseId = this.getAttribute("exercise");
    if (!isExerciseId(exerciseId))
      throw new Error(`bad exercise id: ${exerciseId}`);
    if (!(exerciseId in exercises) || !exercises[exerciseId])
      throw new Error(`unknown exercise id ${exerciseId}`);
    const exercise = exercises[exerciseId]();
    return exercise;
  }

  get isAnswerRevealed() {
    return this.$("answer").hasChildNodes();
  }

  /**
   * @param {"instruction"|"expression"|"solution"|"answer"} selector
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

if (!customElements.get("exam-exercise"))
  customElements.define("exam-exercise", ExamExercise);
