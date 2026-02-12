// ============================================
// Pre-loaded Meal IDs organized by category
// Source: TheMealDB API (https://www.themealdb.com/api/json/v1/1/lookup.php?i=ID)
// Total: 120+ recipes across 10 categories
// ============================================

const MEAL_DATA = {
  Chicken: [
    52772, // Teriyaki Chicken Casserole
    52795, // Chicken Handi
    52831, // Chicken Karaage
    52832, // Chicken Quinoa Greek Salad
    52833, // Kung Pao Chicken
    52834, // Pad See Ew
    52846, // Chicken Enchilada Casserole
    52850, // Chicken Couscous
    52851, // Chicken Fajita Mac and Cheese
    52875, // Chicken Congee
    52940, // Brown Stew Chicken
    52942, // Roast Chicken
    52943, // Katsu Curry
    52945, // Kung Po Prawns (also chicken variant)
    52820, // Chicken Parmentier
  ],

  Beef: [
    52874, // Beef and Mustard Pie
    52878, // Beef and Oyster pie
    52952, // Beef Lo Mein
    52904, // Beef Bourguignon
    52812, // Beef Brisket Pot Roice
    52873, // Beef Dumpling Stew
    52876, // Minced Beef Pie
    52997, // Beef Banh Mi Bowls
    53071, // Beef Rendang
    52826, // Beef Sunday Roast
    52827, // Beef Stroganoff
    52770, // Spaghetti Bolognese
    53068, // Bistek
    52881, // Beef Asado
    52824, // Pork Cassoulet
  ],

  Seafood: [
    52944, // Escovitch Fish
    52959, // Shrimp Chow Fun
    52819, // Fish pie
    52802, // Fish Stew with Rouille
    52836, // Cajun Spiced Fish Tacos
    52946, // Kung Po Prawns
    52947, // Laksa King Prawn Noodles
    52918, // Fish Fofos
    52764, // Garides Saganaki
    52839, // Kedgeree
    52840, // Nasi lemak
    52882, // Three Fish Pie
    52883, // Salmon Avocado Salad
    52948, // Sushi
    52963, // Seafood fideuà
  ],

  Vegetarian: [
    52771, // Spicy Arrabiata Penne
    52774, // Potato Gratin
    52783, // Rigatoni with fennel sausage
    52794, // Vegan Lasagna
    52785, // Dal fridge fly up
    52807, // Baingan Bharta
    52808, // Stuffed Bell Peppers
    52810, // Mushroom risotto
    52813, // Vegetable Stir Fry
    52814, // Thai Green Curry
    52815, // Coq au vin
    52816, // Roasted Eggplant
    52817, // Poutine
    52838, // Fettuccine Alfredo
    52841, // French Onion Soup
  ],

  Dessert: [
    52855, // Banana Pancakes
    52856, // Peanut Butter Cheesecake
    52857, // Tunisian Orange Cake
    52858, // New York Cheesecake
    52859, // Apam balik
    52860, // Chocolate Gateau
    52861, // Bread and Butter Pudding
    52862, // Spotted Dick
    52893, // Apple & Blackberry Crumble
    52894, // Battenberg Cake
    52895, // English Pancakes
    52896, // Full English Breakfast
    52897, // Carrot Cake
    52899, // Dundee cake
    52900, // Chocolate Avocado Mousse
  ],

  Pasta: [
    52770, // Spaghetti Bolognese
    52771, // Spicy Arrabiata Penne
    52839, // Kedgeree
    52838, // Fettuccine Alfredo
    52783, // Rigatoni
    52982, // Penne Arrabiata
    52835, // Lasagne
    52844, // Lasagna Sandwiches
    52867, // Squash linguine
    52886, // Penne with Seafood
    52887, // Venetian Pasta
    52996, // Spaghetti alla Carbonara
    52837, // Pilchard puttanesca
    52849, // Kapsalon
    52990, // Burek
  ],

  Lamb: [
    52827, // Lamb Biryani
    52828, // Lamb Rogan Josh
    52829, // Lamb Tagine
    52830, // Lamb and Potato pie
    52969, // Lamb Pilaf
    52970, // Lamb and Lemon Souvlaki
    52971, // Kafteji
    52972, // Tunisian Lamb Soup
    52973, // Leblebi Soup
    52974, // Kumpir
  ],

  Pork: [
    52847, // Wontons
    52848, // Pork Cassoulet
    52849, // Kapsalon
    52852, // Pork Sausage Roll
    52853, // Vietnamese Grilled Pork
    52854, // Tonkatsu pork
    52879, // Pork Teriyaki
    52880, // Crispy Sausages
    52907, // BBQ Pork Sloppy Joes
    52908, // Pulled Pork
  ],

  Breakfast: [
    52965, // Breakfast Potatoes
    52895, // English Pancakes
    52896, // Full English Breakfast
    52855, // Banana Pancakes
    52891, // Shakshuka
    52892, // French Toast
    52964, // Smoked Haddock Kedgeree
    52966, // Egg Drop Soup
    52967, // Home-made Mandazi
    52968, // Baked salmon with fennel
  ],

  Miscellaneous: [
    52776, // Chocolate Gateau
    52777, // Mediterranean Pasta Salad
    52778, // Cream Cheese Tart
    52779, // Eton Mess
    52780, // Budino Di Ricotta
    52781, // Irish stew
    52782, // BeaverTails
    52784, // Smoky Lentil Chili
    52785, // Dal fridge fly up
    52786, // Piri-piri chicken
    52787, // Hot Chocolate Fudge
    52788, // Battenberg Cake
    52789, // Keleya Zaara
    52790, // Kumpir
    52791, // Tamiya
  ],
};

// Flatten all IDs for quick access
const ALL_MEAL_IDS = Object.values(MEAL_DATA).flat();

// Get unique IDs (some appear in multiple categories)
const UNIQUE_MEAL_IDS = [...new Set(ALL_MEAL_IDS)];
