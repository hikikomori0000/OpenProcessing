// js/StateManager.js
class StateManager {
  constructor() {
    this.historyStack = [];
    this.redoStack = [];
    this.KEYS = { PROJECT: "char_maker_projects_v1" };
  }

  // --- 履歴 (Undo/Redo) ---
  pushHistory(stateData) {
    const stateStr = JSON.stringify(stateData);
    if (this.historyStack.length > 0) {
      // 直前と同じなら保存しない
      if (
        JSON.stringify(this.historyStack[this.historyStack.length - 1]) ===
        stateStr
      )
        return;
    }
    this.historyStack.push(JSON.parse(stateStr));
    this.redoStack = []; // 新しい操作をしたらRedoは消える
    if (this.historyStack.length > 50) this.historyStack.shift();
  }

  undo(current) {
    if (this.historyStack.length === 0) return null;
    this.redoStack.push(current);
    return this.historyStack.pop();
  }

  redo(current) {
    if (this.redoStack.length === 0) return null;
    this.historyStack.push(current);
    return this.redoStack.pop();
  }

  // --- プロジェクト保存 ---
  saveProject(name, sceneData) {
    let projects = this.loadProjects();
    const idx = projects.findIndex((p) => p.name === name);
    const data = { name: name, data: sceneData, timestamp: Date.now() };

    if (idx >= 0) projects[idx] = data; // 上書き
    else projects.push(data); // 新規

    localStorage.setItem(this.KEYS.PROJECT, JSON.stringify(projects));
  }

  loadProjects() {
    const json = localStorage.getItem(this.KEYS.PROJECT);
    return json ? JSON.parse(json) : [];
  }

  deleteProject(index) {
    let projects = this.loadProjects();
    projects.splice(index, 1);
    localStorage.setItem(this.KEYS.PROJECT, JSON.stringify(projects));
  }

  // 現在の画面の状態をオブジェクトにまとめる
  createSceneData(canvasW, canvasH, cameraOffset, zoom, characters) {
    return {
      canvasSize: [canvasW, canvasH],
      cameraOffset: { ...cameraOffset },
      zoom: zoom,
      characters: JSON.parse(JSON.stringify(characters)),
    };
  }
}
