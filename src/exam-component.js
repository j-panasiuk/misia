// @ts-check

import { exercises, isExerciseId, progression } from "./7th-grade/exercises";
import { renderExercise } from "./exercise-renderer";

/** @typedef {import("./7th-grade/exercises").ExId} ExId */

class ExamComponent extends HTMLElement {
  static searchParams = {
    exId: "exercise",
  };

  constructor() {
    super();
    this.handleKeyUp = this.#handleKeyUp.bind(this);
  }

  connectedCallback() {
    console.log("connected", this);
    this.#render();
    window.addEventListener("keypress", this.handleKeyUp);
  }

  disconnectedCallback() {
    window.removeEventListener("keypress", this.handleKeyUp);
  }

  #handleKeyUp(/** @type {KeyboardEvent} */ evt) {
    console.log("keyup", evt.key);
    switch (evt.key) {
      // @todo [Space] -> reveal next step (hints... -> answer -> next)
      case " ":
        return this.#render();
      // @todo [Enter] -> reveal answer -> next
      case "Enter":
        return this.#render();
    }
  }

  // -- RENDERING --

  #render() {
    const searchParams = new URLSearchParams(location.search);
    const exId = searchParams.get(ExamComponent.searchParams.exId);

    if (!exId) {
      // Setting default exercise
      const firstExId = progression[0];
      let url = new URL(location.href);
      url.searchParams.set(ExamComponent.searchParams.exId, firstExId);
      return location.replace(url);
    }

    if (!isExerciseId(exId)) {
      throw new Error(`invalid exercise search param: ${exId}`);
    }
    if (!(exId in exercises)) {
      throw new Error(`unknown exercise: ${exId}`);
    }

    this.#renderExercise(exId);
    this.#renderHeader(exId);
    this.#renderFooter(exId);
  }

  #renderExercise(/** @type {ExId} */ exId) {
    const exercise = exercises[exId];

    if (typeof exercise !== "function") {
      throw new Error(`unknown exercise: ${exId}`);
    }

    this.$("main").innerHTML = renderExercise(exercise());
  }

  #renderHeader(/** @type {ExId} */ currentExId) {
    const links = progression.map((exId) => {
      let url = new URL(location.href);
      url.searchParams.set(ExamComponent.searchParams.exId, exId);

      let link = document.createElement("a");
      link.innerText = exId;
      link.href = url.href;
      if (exId === currentExId) link.setAttribute("aria-current", "page");
      return link;
    });

    this.$("header > nav").replaceChildren(...links);
  }

  #renderFooter(/** @type {ExId} */ currentExId) {
    const actions = [-1, 1].map((step) => {
      const targetIndex = progression.indexOf(currentExId) + step;
      const targetExId = progression[targetIndex];
      if (!targetExId) return;

      let url = new URL(location.href);
      url.searchParams.set(ExamComponent.searchParams.exId, targetExId);

      let link = document.createElement("a");
      link.innerText = step < 0 ? "←" : "→";
      link.href = url.href;
      return link;
    });

    this.$("footer > nav").replaceChildren(
      ...actions.filter((el) => el instanceof HTMLAnchorElement),
    );
  }

  // -- HELPERS --

  /**
   * @param {"main" | "header > nav" | "footer > nav"} selector
   * @returns element matching selector
   * @throws when element not found
   */
  $(selector) {
    const el = this.querySelector(selector);
    if (!el) throw new Error(`"${selector}" element is missing!`);
    return el;
  }
}

if (!customElements.get("exam-component"))
  customElements.define("exam-component", ExamComponent);
