/**
 * js/Character.js
 * キャラクター1体分のデータと状態を管理するクラス
 */
class Character {
  constructor(x, y, manifestData) {
    // 基本座標とスケール
    this.pos = { x: x, y: y };
    this.scale = 1.0;

    // 着用中のアイテム (例: { body: "body_default", clothes: "shirtA" })
    this.selected = {};

    // ロック状態 (trueならドラッグ移動できない)
    this.isLocked = false;

    // ■■■ 初期装備の設定 ■■■
    // manifestDataを見て、"default": true になっているアイテムを自動で着せる
    if (manifestData && manifestData.categories) {
      const categories = manifestData.categories;

      for (let cat in categories) {
        let items = categories[cat];

        // そのカテゴリ内のデフォルトアイテムを探す
        let defItem = items.find((it) => it.default);

        // デフォルトがあればそれを着用、なければリストの1番目を着用
        if (defItem) {
          this.selected[cat] = defItem.id;
        } else if (items.length > 0) {
          this.selected[cat] = items[0].id;
        } else {
          this.selected[cat] = null;
        }
      }
    }
  }
}
