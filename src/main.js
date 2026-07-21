import {
  createMainEditor,
  createModifyEditor,
  createPlusEditor,
} from "./codes";
import "./style.css";
import "github-markdown-css/github-markdown-light.css";

let templateList = [
  {
    label: "title-and-description",
    body: "# 제목\n\n여기에는 프로젝트에 대한 설명글이 들어갑니다.\n",
  },
  {
    label: "implementation",
    body: "### 구현 방법\n\n짧은 설명이 필요하면 작성합니다.\n\n```bash\nnpm install [package]\n```\n",
  },
  {
    label: "table",
    body: "| 제목      | 내용            | 설명        |\r\n| :-------- | :------------- | :---------- |\r\n| **Table** | table template | description |\r\n",
  },
  {
    label: "hyperlink",
    body: "[github/Hshmaker](https://github.com/HshMaker)",
  },
  {
    label: "toggle",
    body: `<details>
  <summary>여기를 클릭하여 내용을 펼치세요.</summary>
  <div markdown="1">

  여기에 펼쳐질 상세 내용이나 코드를 작성합니다.
  이미지나 리스트도 자유롭게 넣을 수 있습니다.

  </div>
</details>`,
  },
  {
    label: "image",
    body: `![로고](/favicon.ico)`,
  },
];

const templateSavings = templateList;

// delete me
window.test = templateList;

const templateButtons = document.querySelector(".template-buttons");
const refreshButton = document.querySelector(".main-refresh-button");
const plusButton = document.querySelector(".main-plus-button");
const copyButton = document.querySelector("#copy-button");

const modifyModal = document.querySelector(".modify-modal");
const plusModal = document.querySelector(".plus-modal");

const mainEditor = createMainEditor();
const modifyEditor = createModifyEditor();
const plusEditor = createPlusEditor();

templateButtons.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    const li = e.target.closest("li");
    switch (e.target.id) {
      case "modify": // 여기는 수정 구현 공간
        const childList = li.children;

        const span = childList[0];

        const modifyChildList = modifyModal.firstElementChild.children;
        const modifyH2 = modifyChildList[0].firstElementChild;
        const modifyGetOutBtn = modifyChildList[0].lastElementChild;
        const modifySaveAndCloseBtn = modifyChildList[2];

        const h2Saving = modifyH2.innerHTML;

        modifyH2.innerHTML = modifyH2.innerHTML + span.innerText;
        modifyModal.classList.remove("none");
        templateList.forEach((component) => {
          if (li.id === component.label) {
            modifyEditor.setValue(`${component.body}`);
            modifySaveAndCloseBtn.onclick = () => {
              modifyModal.classList.add("none");
              component.body = modifyEditor.getValue();
              saveToLocalStorage();
              modifyH2.innerHTML = h2Saving;
            };
          }
        });
        modifyGetOutBtn.onclick = () => {
          modifyModal.classList.add("none");
          modifyH2.innerHTML = h2Saving;
        };
        break;
      case "delete": // 여기는 삭제 구현 공간
        const deleteState = confirm("위 템플릿을 제거하시겠습니까?");
        if (deleteState) {
          const id = li.id;
          deleteTemplate(id);
          for (let i = 0; i < templateList.length; i++) {
            if (templateList[i].label === id) {
              templateList.splice(i, 1);
            }
          }
          saveToLocalStorage();
        }
        break;
    }

    return;
  }

  // 여기는 코드 붙여넣는곳
  const target = e.target.closest("li");
  if (!target) return;

  templateList.forEach((component) => {
    if (target.id == component.label) {
      if (mainEditor.getValue() === "") {
        mainEditor.setValue(`${component.body}`);
        return;
      }
      mainEditor.setValue(mainEditor.getValue() + `\n${component.body}`);
    }
  });
});

// 이거는 초기화 버튼
refreshButton.addEventListener("click", () => {
  const reallyDoIt = confirm("모든 템플릿을 초기화하시겠습니까?");

  if (!reallyDoIt) return;

  templateList = templateSavings;
  // 커스텀 삭제 로직 (초기화 전용)
  for (let i = templateButtons.children.length - 1; i >= 0; i--) {
    const liElement = templateButtons.children[i];
    if (liElement.id.startsWith("custom-")) {
      deleteTemplate(liElement.id);
    }
  }
  saveToLocalStorage();
});
// 이거는 추가 버튼
plusButton.addEventListener("click", () => {
  plusModal.classList.remove("none");

  const plusTitleInput = plusModal.firstElementChild.children[1];

  const plusButton = plusModal.firstElementChild.children[3];
  const exitButton =
    plusModal.firstElementChild.firstElementChild.lastElementChild;

  plusButton.onclick = () => {
    if (plusTitleInput.value === "") {
      alert("템플릿 제목이 필요합니다.");
      return;
    }
    const label = `custom-${plusTitleInput.value.replaceAll(" ", "-")}`;
    templateList.push({
      label: label,
      body: plusEditor.getValue(),
    });
    addTemplate(label, plusTitleInput.value);
    saveToLocalStorage();
    plusTitleInput.value = "";
    plusEditor.setValue("");
    plusModal.classList.add("none");
  };

  exitButton.onclick = () => {
    plusTitleInput.value = "";
    plusEditor.setValue("");
    plusModal.classList.add("none");
  };
});

// li 추가하는 함수
function addTemplate(id, title) {
  const newLi = document.createElement("li");
  const newSpan = document.createElement("span");
  const newModifyBtn = `<div>
              <button id="delete" class="delete-button">
                <img src="src/assets/minus.svg" />
              </button>
              <button id="modify" class="modify-button">
                <img src="src/assets/modify.svg" />
              </button>
            </div>`;

  newLi.id = id;
  newSpan.innerText = title;

  const parser = new DOMParser();
  const doc = parser.parseFromString(newModifyBtn, "text/html");
  const realModifyBtn = doc.body.firstChild;

  newLi.append(newSpan);
  newLi.append(realModifyBtn);

  templateButtons.append(newLi);
}
// li 지우는 함수
function deleteTemplate(id) {
  templateButtons.childNodes.forEach((li) => {
    if (li.id === id) {
      li.remove();
    }
  });
}

// copy 버튼
copyButton.addEventListener("click", (e) => {
  const text = mainEditor.getValue();

  navigator.clipboard.writeText(text).then(() => {
    copyButton.children[0].innerText = "Copyed";
    setTimeout(() => {
      copyButton.children[0].innerText = "Copy";
    }, 3000);
  });
});

// 로컬 스토리지 영구 저장 구현
function saveToLocalStorage() {
  localStorage.setItem("template-list", JSON.stringify(templateList));
}

// 로컬 스토리지 초기 로딩
function loadLocalStroage() {
  const takenTemplates = localStorage.getItem("template-list");
  if (takenTemplates === null) return;
  const parsedTemplates = JSON.parse(takenTemplates);

  // 개수 안 맞으면 리턴
  if (parsedTemplates.length < templateList.length) return;
  templateList = parsedTemplates;

  // 커스텀 추가 로직
  templateList.forEach((component) => {
    if (component.label.startsWith("custom-")) {
      addTemplate(component.label, component.label.slice(7));
    }
  });
}

loadLocalStroage();

saveToLocalStorage();
