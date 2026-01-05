 /**
 * main.js
 * OpenProcessing用 統合コード
 */
// ■ 1. インスタンスと変数
const stateManager = new StateManager();
const uiManager = new UIManager();

// 画像管理
let images = {};

// キャラクター管理
let characters = []; 
let activeCharIndex = -1;

// 画面表示設定

// カメラ調整の例

// 変更前
let cameraOffset = { x: 0, y: 250 }; 

// // 変更例（例：全体を500px上にずらす）
// let cameraOffset = { x: 0, y: -500 };

let globalScale = 1.0;
let canvasW = 1776.98;
let canvasH = 2512.67;
let currentBgColor = '#ffffff';
// ■ 2. Preload (画像読み込み)
function preload() {
    // manifest.js が正しく読み込まれているかチェック
    if (typeof manifestData === 'undefined') {
        console.error("エラー: manifest.js が読み込まれていません。index.htmlの順序を確認してください。");
        return;
    }

    // 画像を一括読み込み
    // OpenProcessingでは画像ファイルをFilesにアップロードすればパスはファイル名だけでOKです
    for (let cat in manifestData.categories) {
        let items = manifestData.categories[cat];
        items.forEach(item => {
            images[item.file] = loadImage(item.file);
        });
    }
}

// main.js の setup 関数

function setup() {
    // 1. キャンバスサイズ設定
    if(manifestData.canvasSize) {
        canvasW = manifestData.canvasSize[0];
        canvasH = manifestData.canvasSize[1];
    }

    // 2. キャンバス作成
    let cnv = createCanvas(canvasW, canvasH);
    let wrapper = select('#canvasWrapper');
    if(wrapper) {
        cnv.parent(wrapper);
    } else {
        // コンテナが見つからない場合の保険
        let body = select('body'); 
        if(body) cnv.parent(body);
    }

    // 3. UIをセットアップします
    // UIが作られていないと、次のaddCharacterでの画面更新でエラーになります
    let uiParent = select('#mainContainer') || select('body');
    
    uiManager.setup(uiParent, manifestData, {
        
        // --- プロジェクト保存・読込 ---
        onSave: (name) => {
            let scene = stateManager.createSceneData(canvasW, canvasH, cameraOffset, globalScale, characters);
            stateManager.saveProject(name, scene);
            uiManager.refreshProjectList(); 
            alert('保存しました: ' + name);
        },
        getProjectList: () => stateManager.loadProjects(),
        onLoad: (index) => {
             let proj = stateManager.loadProjects()[index];
             if(proj) restoreState(proj.data);
        },
        onDelete: (index) => stateManager.deleteProject(index),

        // --- システム ---
        onResize: (w, h) => {
            resizeCanvas(w, h);
            canvasW = w; canvasH = h;
        },
        onUndo: performUndo,
        onRedo: performRedo,
		
        // --- キャラクター操作 ---
        onAddChar: () => addCharacter(width/2, height/2),
        onRemoveChar: removeActiveCharacter,
        onLockChange: (isLocked) => {
            if(activeCharIndex >= 0) characters[activeCharIndex].isLocked = isLocked;
        },
        onGlobalScale: (val) => globalScale = val,

        // --- パーツ変更 ---
        onPartChange: (category, itemId) => {
            if(activeCharIndex >= 0) {
                pushUndo();
                characters[activeCharIndex].selected[category] = itemId;
            }
        },
			onUpdate: () => { pushUndo(); }
	
    });

 // キャラクターの配置を調整することができるaddCharacter(x, y)
       addCharacter(width/2, height/2+100);

	// 変更後：もっと下（+300）に置く場合
	 // addCharacter(width/2, height/2 + 100);


	// カメラ自動調整
    
    // 1. 最初のキャラクターを取得
    let char = characters[0];

	// 「体の中心から、顔はどれくらい上にあるか？」を指定します
    // マイナスの数字を大きくするほど、カメラは「上（顔の方）」を向きます
       let faceHeight = -1000; 
		// 「体の中心から、顔はどれくらい右にあるか？」を指定します
    // マイナスの数字を大きくするほど、カメラは「右（顔の方）」を向きます
    let faceWidth = -50

    // 計算ロジック
    if (char) {
        // キャラクターの顔のワールド座標 = 足元の位置 + 顔の高さ
        let targetY = char.pos.y + faceHeight;
        let targetX = char.pos.x + faceWidth;
        // 画面の中心
        let screenCenterY = height / 2;
		  let screenCenterX = width / 2 ;
        // 差分を埋める
        cameraOffset.y = screenCenterY - targetY;
        cameraOffset.x = screenCenterX - targetX;
    }
    
    // ズーム設定
    globalScale = 1.3;

	
    // 初期状態を履歴に保存
    pushUndo();
}

function draw() {
    background(currentBgColor);

    push();
    // カメラ移動などを適用
    translate(width/2, height/2);
    scale(globalScale);
    translate(-width/2, -height/2);
    translate(cameraOffset.x, cameraOffset.y); 

   
    
    // 変更後: 画面よりはるかに大きい四角を描く（無限背景に見せる）
    noStroke();
    fill(255);
    rect(-10000, -10000, 20000, 20000); 
    // ■■■■■■■■■■■■■■

    // キャラクター描画
    characters.forEach((char, index) => {
        drawCharacter(char, index);
    });

    pop();
}

// --- 個別のキャラ描画関数 ---
// main.js の drawCharacter 関数



function drawCharacter(char, index) {
    push();
    // 1. キャラクター全体の基準位置へ移動
    translate(char.pos.x, char.pos.y);
    scale(char.scale); // キャラ全体の拡大縮小

    // 選択中のマーク（足元）
    if(index === activeCharIndex){
        noFill();
        stroke(char.isLocked ? '#FFA500' : '#ff4081'); 
        strokeWeight(3);
        ellipse(0, 350, 150, 30); 
    }

    // レイヤー順に描画
    for (let layer of manifestData.layersOrder){
        let selId = char.selected[layer];
        if(!selId) continue; 
        
        let catItems = manifestData.categories[layer];
        if(!catItems) continue;
        
        let item = catItems.find(it => it.id === selId);
        
        // 画像が存在する場合のみ描画
        if(item && images[item.file]){
            
            // --- A. パラメータの準備 ---
            let offsetX = 0;
            let offsetY = 0;
            let partScale = 1.0; 
            let partRot = 0;     

            // 1. カテゴリごとのデフォルト設定 (manifest.offsets)
            if (manifestData.offsets && manifestData.offsets[layer]) {
                let off = manifestData.offsets[layer];
                if (off.x !== undefined) offsetX = off.x;
                if (off.y !== undefined) offsetY = off.y;
                if (off.scale !== undefined) partScale = off.scale;
                if (off.rotation !== undefined) partRot = off.rotation;
            }

            // 2. アイテム個別の設定 (manifest.categories内のitem)
            // 個別の設定があれば、カテゴリ設定を上書きする
            if (item.x !== undefined) offsetX = item.x;
            if (item.y !== undefined) offsetY = item.y;
            if (item.scale !== undefined) partScale = item.scale;
            if (item.rotation !== undefined) partRot = item.rotation;

          
            push(); // このパーツのためだけの座標系を開始
            
            // [手順1] まず移動する (元の位置からズレる)
            translate(offsetX, offsetY); 
            
            // [手順2] その場で回転する
            rotate(radians(partRot));    
            
            // [手順3] その場で拡大縮小する
            // ※ここで拡大しても、もう移動済みなので位置はズレません！
            scale(partScale);            
            
            // [手順4] 中心を (0,0) にして描画
            imageMode(CENTER);
            image(images[item.file], 0, 0); 
            
            pop(); // このパーツの座標系を終了
        }
    }
    pop();
}

// ■ 5. マウス操作
function mousePressed() {
    // 変換されたマウス座標を計算
    let mx = (mouseX - width/2) / globalScale + width/2 - cameraOffset.x;
    let my = (mouseY - height/2) / globalScale + height/2 - cameraOffset.y;

    let clickedIndex = -1;
    // 手前のキャラから判定
    for (let i = characters.length - 1; i >= 0; i--) {
        let c = characters[i];
        if (dist(mx, my, c.pos.x, c.pos.y) < 100) { 
            clickedIndex = i;
            break;
        }
    }

    if (clickedIndex >= 0) {
        activeCharIndex = clickedIndex;
        updateUI();
    }
}

function mouseDragged() {
    // キャラ移動 or カメラ移動
    if (activeCharIndex >= 0 && !characters[activeCharIndex].isLocked) {
        characters[activeCharIndex].pos.x += (movedX / globalScale);
        characters[activeCharIndex].pos.y += (movedY / globalScale);
    } else {
        cameraOffset.x += (movedX / globalScale);
        cameraOffset.y += (movedY / globalScale);
    }
}

// ■ 6. ヘルパー関数
function addCharacter(x, y) {
    pushUndo();
    let newChar = new Character(x, y, manifestData); 
    characters.push(newChar);
    activeCharIndex = characters.length - 1;
    updateUI();
}

function removeActiveCharacter() {
    if(activeCharIndex >= 0) {
        pushUndo();
        characters.splice(activeCharIndex, 1);
        activeCharIndex = -1;
        updateUI();
    }
}

function updateUI() {
    let char = (activeCharIndex >= 0) ? characters[activeCharIndex] : null;
    uiManager.updateUIState(char, globalScale);
}

// ■ 7. 履歴・保存復元
function pushUndo() {
    let scene = stateManager.createSceneData(canvasW, canvasH, cameraOffset, globalScale, characters);
    stateManager.pushHistory(scene);
}

function performUndo() {
    let curr = stateManager.createSceneData(canvasW, canvasH, cameraOffset, globalScale, characters);
    let prev = stateManager.undo(curr);
    if(prev) restoreState(prev);
}

function performRedo() {
    let curr = stateManager.createSceneData(canvasW, canvasH, cameraOffset, globalScale, characters);
    let next = stateManager.redo(curr);
    if(next) restoreState(next);
}

function restoreState(data) {
    canvasW = data.canvasSize[0];
    canvasH = data.canvasSize[1];
    resizeCanvas(canvasW, canvasH);
    cameraOffset = data.cameraOffset;
    globalScale = data.zoom;
    
    characters = data.characters.map(cData => {
        let c = new Character(cData.pos.x, cData.pos.y, manifestData);
        c.scale = cData.scale || 1;
        c.selected = cData.selected;
        c.isLocked = cData.isLocked;
        return c;
    });
    activeCharIndex = -1;
    updateUI();
}