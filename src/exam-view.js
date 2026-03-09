// @ts-check

import { exerciseProgression, isExerciseId } from "./7th-grade/exercises";

class ExamView extends HTMLElement {
  constructor() {
    super();
    this.exerciseId = this.hashExerciseId || exerciseProgression[0];
    this.nextExercise = this.#nextExercise.bind(this);
    this.onHashChange = this.#onHashChange.bind(this);
  }

  connectedCallback() {
    this.#render();
    window.addEventListener("next", this.nextExercise);
    window.addEventListener("hashchange", this.onHashChange);
  }

  disconnectedCallback() {
    window.removeEventListener("next", this.nextExercise);
    window.removeEventListener("hashchange", this.onHashChange);
  }

  // -- RENDERING --

  #onHashChange() {
    const exId = this.hashExerciseId;
    if (exId) {
      this.exerciseId = exId;
      this.#render();
    }
  }

  #render() {
    this.#renderHeader();
    this.#renderExercise();
    this.#renderFooter();
  }

  #nextExercise() {
    const nextExerciseId = this.nextExerciseId;
    if (nextExerciseId) {
      this.exerciseId = nextExerciseId;
      this.#renderExercise();
    } else {
      this.#renderSummary();
    }
  }

  #renderExercise() {
    let el = document.createElement("exam-exercise");
    el.setAttribute("exercise", this.exerciseId);

    this.$("main").replaceChildren(el);
  }

  #renderSummary() {
    this.$("main").innerHTML = "<h2>🐴🐴🐴c :))</h2>";
  }

  #renderHeader() {}

  #renderFooter() {
    let url = new URL(location.href);

    const links = exerciseProgression.map((exId) => {
      url.hash = exId;

      let link = document.createElement("a");
      link.innerText = exId;
      link.href = url.href;
      if (exId === this.exerciseId) link.setAttribute("aria-current", "page");
      return link;
    });

    const nextExerciseId = this.nextExerciseId;
    if (nextExerciseId) {
      url.hash = nextExerciseId;

      const nextLink = document.createElement("a");
      nextLink.innerText = "Next >";
      nextLink.href = url.href;
      nextLink.style = "margin-left: auto";
      links.push(nextLink);
    }

    this.$("footer > nav").replaceChildren(...links);
  }

  // -- HELPERS --

  get hashExerciseId() {
    const exId = location.hash.replace("#", "");
    if (isExerciseId(exId)) return exId;
  }

  get nextExerciseId() {
    return exerciseProgression.at(
      exerciseProgression.indexOf(this.exerciseId) + 1,
    );
  }

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

if (!customElements.get("exam-view"))
  customElements.define("exam-view", ExamView);
