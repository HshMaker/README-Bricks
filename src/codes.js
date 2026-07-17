import * as monaco from "monaco-editor";
import { marked, Marked } from "marked";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";

const resultValues = document.querySelector(".result-values");
const modifyResultValues = document.querySelector(".modify-result-values");
const plusResultValues = document.querySelector(".plus-result-values");

let mainEditor;
let modifyEditor;
let plusEditor;

export function createMainEditor() {
  if (mainEditor) return mainEditor;

  mainEditor = monaco.editor.create(document.querySelector(".code-area"), {
    language: "markdown",
    theme: "vs",
    minimap: {
      enabled: false,
    },
    automaticLayout: true,
  });

  function render() {
    resultValues.innerHTML = marked.parse(mainEditor.getValue());
    resultValues.querySelectorAll("pre code").forEach((element) => {
      hljs.highlightElement(element);
    });
  }

  render();
  mainEditor.onDidChangeModelContent(render);

  return mainEditor;
}

export function createModifyEditor() {
  if (modifyEditor) return modifyEditor;

  modifyEditor = monaco.editor.create(
    document.querySelector(".modify-code-area"),
    {
      language: "markdown",
      theme: "vs",
      minimap: {
        enabled: false,
      },
      automaticLayout: true,
    },
  );

  function render() {
    modifyResultValues.innerHTML = marked.parse(modifyEditor.getValue());
    modifyResultValues.querySelectorAll("pre code").forEach((element) => {
      hljs.highlightElement(element);
    });
  }

  render();
  modifyEditor.onDidChangeModelContent(render);

  return modifyEditor;
}

export function createPlusEditor() {
  if (plusEditor) return plusEditor;

  plusEditor = monaco.editor.create(document.querySelector(".plus-code-area"), {
    language: "markdown",
    theme: "vs",
    minimap: {
      enabled: false,
    },
    automaticLayout: true,
  });

  function render() {
    plusResultValues.innerHTML = marked.parse(plusEditor.getValue());
    plusResultValues.querySelectorAll("pre code").forEach((element) => {
      hljs.highlightElement(element);
    });
  }

  render();
  plusEditor.onDidChangeModelContent(render);

  return plusEditor;
}
