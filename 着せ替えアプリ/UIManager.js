// js/UIManager.js

class UIManager {
  constructor() {
    this.elements = {};
    this.callbacks = {};
  }

  setup(parent, manifestData, callbacks) {
    this.callbacks = callbacks || {};
    this.manifest = manifestData;

    // 1. UIパネルの枠を作成
    this.uiPanel = createDiv();
    this.uiPanel.id("uiPanel");
    this.uiPanel.parent(parent);

    // 中身をスクロールできるようにする
    let content = createDiv().class("ui-content").parent(this.uiPanel);

    // 2. 各パネルを作成
    this.createProjectPanel(content);
    this.createSystemPanel(content);
    this.createEditPanel(content);
    this.createLayerPanel(content);
  }

  // --- 共通: 開閉できるパネルを作る便利関数 ---
  createDetailsPanel(parent, title, isOpen) {
    let details = createElement("details");
    details.parent(parent);
    details.style("margin-bottom", "10px");
    details.style("border", "1px solid #ccc");
    details.style("border-radius", "5px");
    details.style("background", "#fff");

    if (isOpen) details.attribute("open", "");

    let summary = createElement("summary", title);
    summary.parent(details);

    let content = createDiv().class("details-content");
    content.parent(details);

    return details;
  }

  // --- プロジェクト管理パネル ---
  createProjectPanel(parent) {
    let details = this.createDetailsPanel(parent, "📂 Project / Export", false);
    let content = details.child()[1];

    // 画像書き出しエリア
    let imgRow = createDiv()
      .parent(content)
      .style("margin-bottom", "15px")
      .style("border-bottom", "1px solid #eee")
      .style("padding-bottom", "10px");
    createDiv("Export Image:")
      .parent(imgRow)
      .style("font-size", "12px")
      .style("color", "#666");
    let exportBox = createDiv()
      .parent(imgRow)
      .style("display", "flex")
      .style("gap", "5px")
      .style("margin-top", "5px");

    let bgPicker = createColorPicker("#ffffff");
    bgPicker.parent(exportBox);
    bgPicker.style("width", "40px");
    bgPicker.style("height", "30px");

    let exportBtn = createButton("📷 Save PNG")
      .parent(exportBox)
      .style("flex-grow", "1");

    bgPicker.input(() => {
      if (this.callbacks.onBgChange)
        this.callbacks.onBgChange(bgPicker.color());
    });
    exportBtn.mousePressed(() => {
      if (this.callbacks.onSaveImage) this.callbacks.onSaveImage();
    });

    // プロジェクト保存エリア
    createDiv("Save Project Data:")
      .parent(content)
      .style("font-size", "12px")
      .style("color", "#666");
    let row1 = createDiv()
      .parent(content)
      .style("display", "flex")
      .style("gap", "5px")
      .style("margin-bottom", "5px");
    let nameInput = createInput("MyChara").parent(row1).style("width", "100px");
    let saveBtn = createButton("Save").parent(row1);

    saveBtn.mousePressed(() => {
      if (this.callbacks.onSave) this.callbacks.onSave(nameInput.value());
    });

    let loadList = createSelect().parent(content).style("width", "100%");
    loadList.option("Select project to load...");
    let loadBtn = createButton("Load Selected")
      .parent(content)
      .style("width", "100%")
      .style("margin-top", "5px");

    loadBtn.mousePressed(() => {
      let val = loadList.value();
      if (val && val !== "Select project to load..." && this.callbacks.onLoad) {
        this.callbacks.onLoad(val);
      }
    });

    this.updateProjectList = (projects) => {
      loadList.elt.innerHTML = "";
      loadList.option("Select project to load...");
      projects.forEach((p) => {
        loadList.option(p.name);
      });
    };
  }

  // --- システムパネル ---
  createSystemPanel(parent) {
    let details = this.createDetailsPanel(parent, "⚙ System", false);
    let content = details.child()[1];

    let row = createDiv()
      .parent(content)
      .style("display", "flex")
      .style("gap", "5px");
    let undoBtn = createButton("Undo").parent(row);
    let redoBtn = createButton("Redo").parent(row);

    undoBtn.mousePressed(() => {
      if (this.callbacks.onUndo) this.callbacks.onUndo();
    });
    redoBtn.mousePressed(() => {
      if (this.callbacks.onRedo) this.callbacks.onRedo();
    });
  }

  // --- 編集パネル ---
  createEditPanel(parent) {
    let details = this.createDetailsPanel(parent, "✎ Edit Character", true);
    let content = details.child()[1];

    let row = createDiv()
      .parent(content)
      .style("display", "flex")
      .style("justify-content", "space-between")
      .style("margin-bottom", "10px");
    let addBtn = createButton("+ Add Char").parent(row);
    let delBtn = createButton("🗑 Delete").parent(row);

    addBtn.mousePressed(() => {
      if (this.callbacks.onAddChar) this.callbacks.onAddChar();
    });
    delBtn.mousePressed(() => {
      if (this.callbacks.onRemoveChar) this.callbacks.onRemoveChar();
    });

    createDiv("Global Zoom:").parent(content).style("font-size", "12px");
    let zoomSlider = createSlider(0.5, 3.0, 1.0, 0.1)
      .parent(content)
      .style("width", "100%");
    this.elements.globalScale = zoomSlider;

    zoomSlider.input(() => {
      if (this.callbacks.onZoomChange)
        this.callbacks.onZoomChange(zoomSlider.value());
    });

    let lockCheck = createCheckbox(" Lock Movement", false).parent(content);
    lockCheck.style("margin-top", "10px");
    this.elements.lockCheck = lockCheck;

    lockCheck.changed(() => {
      if (this.callbacks.onLockChange)
        this.callbacks.onLockChange(lockCheck.checked());
    });
  }

  // --- レイヤー（着せ替え）パネル ---
  createLayerPanel(parent) {
    let layers = Object.keys(this.manifest.categories);

    layers.forEach((cat) => {
      if (!this.manifest.categories[cat]) return;
      let items = this.manifest.categories[cat];

      // グループ化
      let groups = {};
      items.forEach((item) => {
        let gId = item.groupId || item.id;
        if (!groups[gId]) groups[gId] = [];
        groups[gId].push(item);
      });

      let details = this.createDetailsPanel(parent, cat, false);
      let content = details.child()[1];

      let styleGrid = createDiv().class("icon-grid").parent(content);
      let colorContainer = createDiv()
        .class("color-picker-container")
        .parent(content);

      if (colorContainer.elt) colorContainer.elt.style.display = "none";
      else colorContainer.style.display = "none";

      let colorLabel = createDiv("Color Variants:")
        .class("sub-label")
        .parent(colorContainer);
      let colorGrid = createDiv()
        .class("icon-grid color-grid")
        .parent(colorContainer);

      // ■■■ 修正：OFFボタンの追加 ■■■
      // 何も選択しない（脱ぐ）ためのボタンを作成
      let offBtn = createDiv("OFF");
      offBtn.class("icon-item icon-none"); // CSSで見た目を調整するためのクラス
      offBtn.parent(styleGrid);

      // 選択状態判定のために 'null' というID属性を持たせておく
      offBtn.attribute("data-id", "null");

      offBtn.mousePressed(() => {
        // 選択枠リセット
        let gridEl = styleGrid.elt ? styleGrid.elt : styleGrid;
        let allStyles = gridEl.getElementsByClassName("style-icon");
        for (let s of allStyles) s.classList.remove("selected-style");

        // OFFボタンを選択状態に
        offBtn.addClass("selected-style");

        // 色違いエリアは非表示
        if (colorContainer.elt) colorContainer.elt.style.display = "none";
        else colorContainer.style.display = "none";

        // データをnull（未装着）に更新
        if (typeof activeCharIndex !== "undefined" && activeCharIndex >= 0) {
          let char = characters[activeCharIndex];
          char.selected[cat] = null; // ★ここが重要
          this.callbacks.onUpdate();
          this.updateUIState(char); // UIを再描画して選択枠を更新
        }
      });
      // ■■■ OFFボタン追加 ここまで ■■■

      // 通常アイテムアイコン生成
      Object.keys(groups).forEach((gId) => {
        let groupItems = groups[gId];
        let repItem = groupItems[0];

        let styleIconPath;
        if (repItem.groupThumb) styleIconPath = repItem.groupThumb;
        else if (repItem.thumbnail) styleIconPath = repItem.thumbnail;
        else styleIconPath = repItem.file;

        let btn = createImg(styleIconPath, repItem.id);
        btn.class("icon-item style-icon");
        btn.parent(styleGrid);

        // 選択状態判定のためにアイテムIDを持たせる
        btn.attribute("data-id", repItem.id);

        btn.mousePressed(() => {
          // OFFボタンの選択を外す
          offBtn.removeClass("selected-style");

          let gridEl = styleGrid.elt ? styleGrid.elt : styleGrid;
          let allStyles = gridEl.getElementsByClassName("style-icon");
          for (let s of allStyles) s.classList.remove("selected-style");

          let btnEl = btn.elt ? btn.elt : btn;
          btnEl.classList.add("selected-style");

          if (groupItems.length > 1) {
            updateColorGrid(groupItems);
            if (colorContainer.elt) colorContainer.elt.style.display = "block";
            else colorContainer.style.display = "block";
          } else {
            if (colorContainer.elt) colorContainer.elt.style.display = "none";
            else colorContainer.style.display = "none";
          }

          if (typeof activeCharIndex !== "undefined" && activeCharIndex >= 0) {
            let char = characters[activeCharIndex];
            char.selected[cat] = repItem.id;
            this.callbacks.onUpdate();
          }
        });
      });

      const updateColorGrid = (groupItems) => {
        colorGrid.html("");
        groupItems.forEach((item) => {
          let colorIconPath = item.thumbnail ? item.thumbnail : item.file;
          let cBtn = createImg(colorIconPath, item.id);
          cBtn.class("icon-item color-icon");
          cBtn.parent(colorGrid);
          cBtn.attribute("data-id", item.id);

          if (typeof activeCharIndex !== "undefined" && activeCharIndex >= 0) {
            let char = characters[activeCharIndex];
            if (char.selected[cat] === item.id) cBtn.addClass("active-color");
          }

          cBtn.mousePressed(() => {
            if (
              typeof activeCharIndex !== "undefined" &&
              activeCharIndex >= 0
            ) {
              let char = characters[activeCharIndex];
              char.selected[cat] = item.id;
              this.callbacks.onUpdate();
            }
          });
        });
      };

      if (!this.elements.layerGrids) this.elements.layerGrids = {};
      this.elements.layerGrids[cat] = styleGrid; // colorGridではなくstyleGridを保存するように変更
    });
  }

  // --- UIの状態更新 ---
  updateUIState(activeChar, globalZoom) {
    if (globalZoom !== undefined && this.elements.globalScale) {
      this.elements.globalScale.value(globalZoom);
    }

    if (!activeChar) {
      if (this.elements.lockCheck) this.elements.lockCheck.checked(false);
      return;
    }

    if (this.elements.lockCheck)
      this.elements.lockCheck.checked(activeChar.isLocked);

    // アイコンの選択状態を更新
    if (this.elements.layerGrids) {
      for (let cat in this.elements.layerGrids) {
        let currentItemId = activeChar.selected[cat];
        let gridBox = this.elements.layerGrids[cat];
        this.updateIconSelection(gridBox, currentItemId);
      }
    }
  }

  // ■■■ 修正：アイコン選択表示の更新ロジック ■■■
  updateIconSelection(gridBox, selectedId) {
    if (!gridBox) return;

    // 未選択(null)の場合は文字列の'null'として扱う
    let targetId =
      selectedId === null || selectedId === undefined ? "null" : selectedId;

    let el = gridBox.elt ? gridBox.elt : gridBox;
    if (!el) return;

    // icon-item クラスを持つ要素（OFFボタン含む）を走査
    let icons = el.getElementsByClassName("icon-item");

    for (let icon of icons) {
      // data-id 属性 または alt/id 属性をチェック
      let iconId = icon.getAttribute("data-id") || icon.alt || icon.id;

      // IDが一致したら選択クラスをつける
      if (String(iconId) === String(targetId)) {
        icon.classList.add("selected-style");
        // icon.style.border = "2px solid #ff4081";
      } else {
        icon.classList.remove("selected-style");
        // icon.style.border = "";
      }
    }
  }
}
