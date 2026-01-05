// ■■■■■ データ設定 ■■■■■
const manifestData = {
  canvasSize: [1776.98, 2512.67],
  // "canvasSize": [800, 1200],
  layersOrder: [
    "back_hair",
    "body",
    "clothes",
    "bottoms",
    "tops",
    "necklace",
    "eyes",
    "brows",
    "mouth",
    "front_hair",
    "hair_accessory",
    "accessory",
    "jacket",
    "socks",
    "shoes",
  ],
  // ★ここを追加：パーツごとの基準位置 (中心からのズレ)
  // xがプラスで右、yがプラスで下に行きます
  offsets: {
    body: { x: 0, y: 0 }, // 省略すれば scale:1, rotation:0 になります
    eyes: { x: 0, y: 3, scale: 1, rotation: 0 }, // 少し上, 1.1倍拡大, 0°回転
    brows: { x: 0, y: 0 }, // 目のさらに上に
    mouth: { x: 0, y: 0 }, // 少し下に
    clothes: { x: 0, y: 0, scale: 1, rotation: 0 }, // 体に合わせて調整
    back_hair: { x: 0, y: 15 },
    front_hair: { x: 0, y: 2 },
    socks: { x: 0, y: 2 },
    shoes: { x: 0, y: 2 },
  },
  categories: {
    body: [
      { id: "body1", file: "body1.png", default: true },
      { id: "body2", file: "body2.png", default: false },
      { id: "body3", file: "body3.png", default: false },
      { id: "body4", file: "body4.png", default: false },
    ],
    hair_accessory: [
      { id: "hair_ornament1", file: "hair_ornament1.png", default: true },
      {
        id: "hair_accessory_pinkribbon",
        file: "hair_accessory_pinkribbon.png",
        default: true,
      },
    ],
    /*画像の追加方法

--- 必須 --- 
id: 画像の名称を決める
file: 表示する画像を決める
default: 初期表示されるものを決める（Trueと設定されているものが最初表示される。Trueが複数あるまたは一つもない場合、一番上にあるアイテムが優先）

--- オプション（任意）---

   --- UIに関するもの ---
groupThumb>thumbnail>fileの順に画像が設定される
groupId: カテゴリー内でさらにグループわけすることができる
thumbnail: アイコンを設定できる（未設定であればfileで設定した画像がそのままアイコンになる）
groupThumb: グループ全体のアイコンを設定できる（未設定であればthumbnailと同様のもの）
　　--- UI系おわり ---
  
   --- 配置に関するもの ---
   x: デフォルトの設定に対し、さらに個別で横に動かせる（"x":10ptであれば, そのアイテムだけ10pt右に動く）
   y: デフォルトの設定に対し、さらに個別で下に動かせる（"y":20ptであれば, そのアイテムだけ20pt下に動く）
   scale: デフォルトの設定に対し、さらに個別で拡大縮小（"scale":1.2であれば, そのアイテムだけ1.2倍大きくなる）
   rotation: デフォルトの設定に対し、さらに個別で回転（"scale":60であれば, そのアイテムだけ60°右回転）
   --- 配置系おわり ---

   --- 全部付けた例 ---
   { "id": "back_hair_blacklong", "file": "back_hair_blacklong.png","groupId":"long","thumbnail": "icon_hair_long.png","groupThumb": "test.png", "default": false , "x": 10, "y":200,"scale":1.0, "rotation": 0},
   --- 例おわり ---
   
--- オプションおわり ---   

*/
    back_hair: [
      {
        id: "back_hair_blackbob",
        file: "back_hair_blackbob.png",
        groupId: "bob",
        default: true,
      },
      {
        id: "back_hair_blacklong",
        file: "back_hair_blacklong.png",
        groupId: "long",
        default: false,
      },
      {
        id: "back_hair_blackwave",
        file: "back_hair_blackwave.png",
        groupId: "wave",
        default: false,
      },
      {
        id: "back_hair_brownbob",
        file: "back_hair_brownbob.png",
        groupId: "bob",
        default: false,
      },
      {
        id: "back_hair_brownlong",
        file: "back_hair_brownlong.png",
        groupId: "long",
        default: false,
      },
      {
        id: "back_hair_brownwave",
        file: "back_hair_brownwave.png",
        groupId: "wave",
        default: false,
      },
      {
        id: "back_hair_goldbob",
        file: "back_hair_goldbob.png",
        groupId: "bob",
        default: false,
      },
      {
        id: "back_hair_goldlong",
        file: "back_hair_goldlong.png",
        groupId: "long",
        default: false,
      },
      {
        id: "back_hair_goldwave",
        file: "back_hair_goldwave.png",
        groupId: "wave",
        default: false,
      },
    ],

    front_hair: [
      {
        id: "front_hair_black on eyebrow bangs",
        file: "front_hair_black%20on%20eyebrow%20bangs.png",
        groupId: "eyebrow_bangs",
        default: true,
      },
      {
        id: "front_hair_blackbluntbangs",
        file: "front_hair_blackbluntbangs.png",
        groupId: "blunt_bangs",
        default: false,
      },
      {
        id: "front_hair_blackidolbangs",
        file: "front_hair_blackidolbangs.png",
        groupId: "idol_bangs",
        default: false,
      },
      {
        id: "front_hair_brown on eyebrow bangs",
        file: "front_hair_brown%20on%20eyebrow%20bangs.png",
        groupId: "eyebrow_bangs",
        default: false,
      },
      {
        id: "front_hair_brownbluntbangs",
        file: "front_hair_brownbluntbangs.png",
        groupId: "blunt_bangs",
        default: false,
      },
      {
        id: "front_hair_brownidolbangs",
        file: "front_hair_brownidolbangs.png",
        default: false,
      },
      {
        id: "front_hair_gold on eyebrow bangs",
        file: "front_hair_gold%20on%20eyebrow%20bangs.png",
        groupId: "eyebrow_bangs",
        default: false,
      },
      {
        id: "front_hair_goldbluntbangs",
        file: "front_hair_goldbluntbangs.png",
        groupId: "blunt_bangs",
        default: false,
      },
      {
        id: "front_hair_goldidolbang",
        file: "front_hair_goldidolbang.png",
        groupId: "idol_bangs",
        default: false,
      },
      {
        id: "front_hair_black_centerpart",
        file: "front_hair_black_centerpart.png",
        groupId: "centerpart",
        default: false,
      },
      {
        id: "front_hair_brown_centerpart",
        file: "front_hair_brown_centerpart.png",
        groupId: "centerpart",
        default: false,
      },
      {
        id: "front_hair_gold_centerpart",
        file: "front_hair_gold_centerpart.png",
        groupId: "centerpart",
        default: false,
      },
    ],

    eyes: [
      {
        id: "eye_black_slanted",
        file: "eye_black_slanted.png",
        groupId: "slanted",
        default: true,
      },
      {
        id: "eye_pink_slanted",
        file: "eye_pink_slanted.png",
        groupId: "slanted",
        default: true,
      },
      {
        id: "eye_blue_slanted",
        file: "eye_blue_slanted.png",
        groupId: "slanted",
        default: false,
      },
      {
        id: "eye_purple_slanted",
        file: "eye_purple_slanted.png",
        groupId: "slanted",
        default: false,
      },
      {
        id: "eye_green_slanted",
        file: "eye_green_slanted.png",
        groupId: "slanted",
        default: false,
      },
      {
        id: "eye_red_slanted",
        file: "eye_red_slanted.png",
        groupId: "slanted",
        default: false,
      },
      {
        id: "eye_yellow_slanted",
        file: "eye_yellow_slanted.png",
        groupId: "slanted",
        default: false,
      },
      {
        id: "eye_brown_slanted",
        file: "eye_brown_slanted.png",
        groupId: "slanted",
        default: false,
      },
      {
        id: "eye_black_circle",
        file: "eye_black_circle.png",
        groupId: "circle",
        default: false,
      },
      {
        id: "eye_yellow_circle",
        file: "eye_yellow_circle.png",
        groupId: "circle",
        default: false,
      },
      {
        id: "eye_blue_circle",
        file: "eye_blue_circle.png",
        groupId: "circle",
        default: false,
      },
      {
        id: "eye_red_circie",
        file: "eye_red_circie.png",
        groupId: "circle",
        default: false,
      },
      {
        id: "eye_purple_circle",
        file: "eye_purple_circle.png",
        groupId: "circle",
        default: false,
      },
      {
        id: "eye_green_circle",
        file: "eye_green_circle.png",
        groupId: "circle",
        default: false,
      },
      {
        id: "eye_brown_circle",
        file: "eye_brown_circle.png",
        groupId: "circle",
        default: false,
      },
      {
        id: "eye_pink_circle",
        file: "eye_pink_circle.png",
        groupId: "circle",
        default: false,
      },
      {
        id: "eye_black_sagging",
        file: "eye_black_sagging.png",
        groupId: "sagging",
        default: false,
      },
      {
        id: "eye_blue_sagging",
        file: "eye_blue_sagging.png",
        groupId: "sagging",
        default: false,
      },
      {
        id: "eye_brown_sagging",
        file: "eye_green_sagging.png",
        groupId: "sagging",
        default: false,
      },
      {
        id: "eye_green_sagging",
        file: "eye_brown_sagging.png",
        groupId: "sagging",
        default: false,
      },
      {
        id: "eye_pink_sagging",
        file: "eye_pink_sagging.png",
        groupId: "sagging",
        default: false,
      },
      {
        id: "eye_purple_sagging",
        file: "eye_purple_sagging.png",
        groupId: "sagging",
        default: false,
      },
      {
        id: "eye_red_sagging",
        file: "eye_red_sagging.png",
        groupId: "sagging",
        default: false,
      },
      {
        id: "eye_yellow_sagging",
        file: "eye_yellow_sagging.png",
        groupId: "sagging",
        default: false,
      },
      {
        id: "eye_black_singlelayer",
        file: "eye_black_singlelayer.png",
        groupId: "singlelayer",
        default: false,
      },
      {
        id: "eye_blue_singlelayer",
        file: "eye_blue_singlelayer.png",
        groupId: "singlelayer",
        default: false,
      },
      {
        id: "eye_brown_singlelayer",
        file: "eye_brown_singlelayer.png",
        groupId: "singlelayer",
        default: false,
      },
      {
        id: "eye_green_singlelayer",
        file: "eye_green_singlelayer.png",
        groupId: "singlelayer",
        default: false,
      },
      {
        id: "eye_pink_singlelayer",
        file: "eye_pink_singlelayer.png",
        groupId: "singlelayer",
        default: false,
      },
      {
        id: "eye_purple_singlelayer",
        file: "eye_purple_singlelayer.png",
        groupId: "singlelayer",
        default: false,
      },
      {
        id: "eye_red_singlelayer",
        file: "eye_black_singlelayer.png",
        groupId: "singlelayer",
        default: false,
      },
      {
        id: "eye_yellow_singlelayer",
        file: "eye_yellow_singlelayer.png",
        groupId: "singlelayer",
        default: false,
      },
    ],
    brows: [{ id: "eyebrows1", file: "eyebrows1.png", default: true }],
    mouth: [
      {
        id: "mouth_straightface_bluishpink",
        file: "mouth_straightface_bluishpink.png",
        groupId: "mouth_straight",
        default: true,
      },
      {
        id: "mouth_straightface_dark",
        file: "mouth_straightface_dark%20pink.png",
        groupId: "mouth_straight",
        default: false,
      },
      {
        id: "mouth_straightface_orang",
        file: "mouth_straightface_orang.png",
        groupId: "mouth_straight",
        default: false,
      },
      {
        id: "mouth_straightface_pink",
        file: "mouth_straightface_pink.png",
        groupId: "mouth_straight",
        default: false,
      },
    ],

    tops: [
      {
        id: "tops_shirt",
        file: "tops_shirt.png",
        groupId: "dress",
        default: true,
      },
      {
        id: "onepiece_pinkdress",
        file: "onepiece_pinkdress.png",
        groupId: "dress",
        default: true,
      },
    ],
    bottoms: [
      {
        id: "bottoms_skirt_gray",
        file: "bottoms_skirt_gray.png",
        groupId: "skirt",
        default: true,
      },
      {
        id: "bottoms_skirt_black",
        file: "bottoms_skirt_black.png",
        groupId: "skirt",
        default: true,
      },
    ],
    jacket: [
      {
        id: "jacket_black",
        file: "jacket_black.png",
        groupId: "jacket",
        default: true,
      },
    ],
    clothes: [
      {
        id: "onepiece1",
        file: "onepiece1.png",
        groupId: "dress",
        default: true,
      },
      {
        id: "onepiece_pinkdress",
        file: "onepiece_pinkdress.png",
        groupId: "dress",
        default: true,
      },
    ],
    accessory: [
      // { "id": "hair_ornament1", "file": "hair_ornament1.png", "default": true, }
    ],
    necklace: [
      {
        id: "necklace_pinkchoker",
        file: "necklace_pinkchoker.png",
        default: true,
      },
      {
        id: "necklace_redribbon",
        file: "necklace_redribbon.png",
        default: true,
      },
    ],
    socks: [
      { id: "socks1", file: "socks1.png", default: false },
      { id: "socks_school", file: "socks_school.png", default: false },
      {
        id: "socks_pinkfurifuri",
        file: "socks_pinkfurifuri.png",
        default: false,
      },
    ],
    shoes: [
      { id: "shoes1", file: "shoes1.png", default: false },
      { id: "shoes_school", file: "shoes_school.png", default: false },
      { id: "shoes_pinkribbon", file: "shoes_pinkribbon.png", default: false },
    ],
  },
};
