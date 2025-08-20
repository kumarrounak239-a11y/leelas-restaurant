
// ---- Data (Bihar affordable pricing) ----
const MENU = {
  south:[
    ["Idli (2 pcs)",40],["Medu Vada (2 pcs)",50],["Plain Dosa",60],["Masala Dosa",80],["Mysore Masala Dosa",90],["Onion Uttapam",80],["Rava Dosa",90]
  ],
  chinese:[
    ["Veg Hakka Noodles",100],["Schezwan Noodles",120],["Veg Fried Rice",100],["Egg Fried Rice",120],["Chicken Fried Rice",140],["Veg Manchurian (Dry/Gravy)",110],["Chilli Paneer",130],["Chilli Chicken",150]
  ],
  snacks:[
    ["Samosa (2 pcs)",30],["Aloo Tikki",40],["Pav Bhaji",70],["Chole Bhature",90],["French Fries",70],["Veg Momos (6)",70],["Spring Roll",80],["Filter Coffee",25],["Cold Coffee",60],["Masala Tea",20]
  ],
  bihar:[
    ["Litti Chokha (3)",60],["Sattu Paratha + Curd",70],["Dal Pitha (4)",60],["Khichdi + Papad + Chokha",90],["Champaran Mutton (half)",280],["Bihari Fish Curry",200]
  ],
  mainVeg:[
    ["Veg Thali",120],["Special Veg Thali",160],["Dal Tadka",80],["Paneer Butter Masala",150],["Shahi Paneer",160],["Mix Veg Curry",110],["Aloo Gobi",90]
  ],
  mainNonVeg:[
    ["Butter Chicken",180],["Chicken Curry",150],["Mutton Curry",220],["Veg Biryani",130],["Chicken Biryani",180],["Mutton Biryani",220]
  ],
  breadsRice:[
    ["Tandoori Roti",12],["Butter Roti",15],["Naan (Plain)",20],["Naan (Butter)",25],["Lachha Paratha",30],["Steamed Rice",60],["Jeera Rice",80]
  ],
  sweets:[
    ["Gulab Jamun (2)",30],["Rasgulla (2)",25],["Rasmalai (2)",50],["Kaju Katli (100g)",80],["Khaja",40],["Balushahi",35],["Tilkut (seasonal)",40],["Malpua",50],["Thekua (2)",30]
  ]
};

// Categories map used for filter chips (display label -> key)
const CATEGORY_MAP = [
  ["All","all"],
  ["South Indian","south"],
  ["Chinese","chinese"],
  ["Snacks & Coffee","snacks"],
  ["Bihar Specials","bihar"],
  ["Veg Mains","mainVeg"],
  ["Non‑Veg Mains","mainNonVeg"],
  ["Breads & Rice","breadsRice"],
  ["Sweets","sweets"]
];
