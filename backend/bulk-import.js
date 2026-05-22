// bulk-import.js
// Place this file in: backend/bulk-import.js
// Run: node bulk-import.js
//
// This imports all 50 Home Decor products directly into MongoDB
// Images use Amazon CDN URLs directly — no upload needed
const cloudinary = require('./config/cloudinary')
const fs = require('fs')

require('dotenv').config();
const mongoose = require('mongoose');
const Product  = require('./models/Product');

const products = [
  { title: "Rousrie Wooden Wall Hanging For Home Décor, Set of 11, Living Room, Bedroom, Office Decoration (Rajasthani)", price: "₹199", rating: "3.9 out of 5", image: "https://m.media-amazon.com/images/I/81Ota-b141L._AC_UL320_.jpg", affiliate: "https://www.amazon.in/dp/B0DNMTMMF5/?tag=mydeals03c-21" },
  { title: "Global Grabbers New Limited Edition 25 Centimetre Meditating Sitting Buddha Idol Statue showpiece Home Decor Decoration Items for Living Room and Gifts (1, Orange Black)", price: "₹371", rating: "4.2 out of 5", image: "https://m.media-amazon.com/images/I/815eXSPF+4L._AC_UL320_.jpg", affiliate: "https://www.amazon.in/dp/B07LF3PQYF/?tag=mydeals03c-21" },
  { title: "Dekorly Artificial Potted Plants, Artificial Plastic Eucalyptus Plants Small Indoor Potted Houseplants, Small Faux Plants for Home Decor Bathroom Office Farmhouse (Set 0F 8)", price: "₹299", rating: "4.2 out of 5", image: "https://m.media-amazon.com/images/I/8139T8YbdkL._AC_UL320_.jpg", affiliate: "https://www.amazon.in/dp/B0BCKLM33P/?tag=mydeals03c-21" },
  { title: "JaipurCrafts Premium Sparkle Square Gramophone Showpiece - 23 cm (Brass, Brown, Gold) (Black, Gold)", price: "₹299", rating: "3.3 out of 5", image: "https://m.media-amazon.com/images/I/715dmJcuJZL._AC_UL320_.jpg", affiliate: "https://www.amazon.in/dp/B018LX0NAO/?tag=mydeals03c-21" },
  { title: "SPHINX White Ceramic Donut Vase, 6 Inch Modern Flower Vase for Pampas Grass, Dried Flowers, Home & Office Decor, Centerpiece, Handcrafted Gift Vase Only", price: "₹179", rating: "4.3 out of 5", image: "https://m.media-amazon.com/images/I/813Kzy7rfqL._AC_UL320_.jpg", affiliate: "https://www.amazon.in/dp/B0CQ23K1SB/?tag=mydeals03c-21" },
  { title: "Artvibes Bless This Home Wall Art Wooden Wall Hanging for Living Room | Quotes Decor | Wall Art For Hall", price: "₹221", rating: "4.4 out of 5", image: "https://m.media-amazon.com/images/I/71vBYh7o5lL._AC_UL320_.jpg", affiliate: "https://www.amazon.in/dp/B0B94444P5/?tag=mydeals03c-21" },
  { title: "NYRWANA Table Lamp | 2000mAh Battery | Home Decor, Lamps for Bedroom, Stepless Dimming, 3 Colour Touch Control, USB-c Charging (Metal - Gold)", price: "₹488", rating: "4.2 out of 5", image: "https://m.media-amazon.com/images/I/61J3nHsyp6L._AC_UL320_.jpg", affiliate: "https://www.amazon.in/dp/B0CT2SBYKT/?tag=mydeals03c-21" },
  { title: "Webelkart Premium Home Keys Wooden Key Holder 7 Hook - Decorative Items for Home Decor (Brown)", price: "₹168", rating: "4.3 out of 5", image: "https://m.media-amazon.com/images/I/91iK3Q9JfYL._AC_UL320_.jpg", affiliate: "https://www.amazon.in/dp/B08PPL3ZM8/?tag=mydeals03c-21" },
  { title: "Xtore Home Decor Lucky Deer Family Matte Finish Ceramic Figures - (Set of 3, Matte Brown)", price: "₹829", rating: "4.3 out of 5", image: "https://m.media-amazon.com/images/I/71qdMrPodaL._AC_UL320_.jpg", affiliate: "https://www.amazon.in/dp/B08MD5J7Z5/?tag=mydeals03c-21" },
  { title: "fancymart Artificial Plants with Pot (Pack of 2, 45 cm) – Hanging Plants for Home Decor | Fake Plants Vine Creeper for Living Room, Wall, Office & Indoor Decoration", price: "₹235", rating: "4.2 out of 5", image: "https://m.media-amazon.com/images/I/713NePqdaeL._AC_UL320_.jpg", affiliate: "https://www.amazon.in/dp/B0C1W5BKK2/?tag=mydeals03c-21" },
  { title: "One94Store Astronaut Galaxy Projector Night Light – 360° Rotating Nebula Star Projector with Remote Control, Timer & Adjustable Head – Space Lamp for Kids Bedroom", price: "₹649", rating: "4.1 out of 5", image: "https://m.media-amazon.com/images/I/81r6tIbS1cL._AC_UL640_QL65_.jpg", affiliate: "https://www.amazon.in/dp/B0DN1RWNSQ/?tag=mydeals03c-21" },
  { title: "Amazon Basics Artificial Plants with Pot | Realistic Looking | Multi Variety | Durable Plastic | No Maintenance | Home Decor (Pack of 8)", price: "₹298", rating: "4.1 out of 5", image: "https://m.media-amazon.com/images/I/710jjgj13jL._AC_UL320_.jpg", affiliate: "https://www.amazon.in/dp/B0D25C6QP2/?tag=mydeals03c-21" },
  { title: "Global Grabbers New 25 Centimetre Meditating Sitting Buddha Statue showpiece Idol Home Decor Items for Living Room and Gifts (Golden2)", price: "₹448", rating: "4.2 out of 5", image: "https://m.media-amazon.com/images/I/91z86Cjd5zL._AC_UL320_.jpg", affiliate: "https://www.amazon.in/dp/B095JZW7B4/?tag=mydeals03c-21" },
  { title: "Xtore 12pcs 3D Home Decor Butterfly with Sticking Pad (Shimmer Golden, Set of 12)", price: "₹299", rating: "4.1 out of 5", image: "https://m.media-amazon.com/images/I/71tNwTNO3TL._AC_UL320_.jpg", affiliate: "https://www.amazon.in/dp/B0774X1QCB/?tag=mydeals03c-21" },
  { title: "PUREZENTO Unique White Ceramic Donut Vase 8.5 & 5.7 Inch - Set of 2 | Decorative Donut Vase for Dried Flowers & Pampas Grass", price: "₹544", rating: "4.4 out of 5", image: "https://m.media-amazon.com/images/I/61NA2BGm89L._AC_UL320_.jpg", affiliate: "https://www.amazon.in/dp/B0DQQ2GXRB/?tag=mydeals03c-21" },
  { title: "Homesake Modern Small Crystal Table Lamp, Contemporary Bedroom Bedside Nightstand Lamp, Desk Globe Lamp for Living Room Girls Kids Room, Fabric Shade (White)", price: "₹729", rating: "3.9 out of 5", image: "https://m.media-amazon.com/images/I/71OdSxSTnJL._AC_UL320_.jpg", affiliate: "https://www.amazon.in/dp/B0CK6W443Y/?tag=mydeals03c-21" },
  { title: "Dekorly Artificial Lavender Plant in White Pot, 18cm – Realistic Faux Flower Arrangement for Home & Office Decor (Set of 1)", price: "₹259", rating: "4.0 out of 5", image: "https://m.media-amazon.com/images/I/61oHjuL-ZNL._AC_UL320_.jpg", affiliate: "https://www.amazon.in/dp/B0G2C4KYR3/?tag=mydeals03c-21" },
  { title: "Crosscut Furniture LED Tripod Floor Lamp with 3 Shelves, Fresh Flower, Yellow, Metal Corner Floor Lamp for Living Room & Bedroom Decoration", price: "₹1795", rating: "4.5 out of 5", image: "https://m.media-amazon.com/images/I/81JL7n7CM5L._AC_UL320_.jpg", affiliate: "https://www.amazon.in/dp/B0CK4BZZKG/?tag=mydeals03c-21" },
  { title: "Webelkart Premium HD UV Printed Mahindra Thar Car Shape Designer Wooden Key Holder Home and Office Decor (Yellow)", price: "₹187", rating: "4.3 out of 5", image: "https://m.media-amazon.com/images/I/61v0BuK+r2L._AC_UL320_.jpg", affiliate: "https://www.amazon.in/dp/B0DB249WGP/?tag=mydeals03c-21" },
  { title: "DECORIQUE Wooden Wall Hanging Welcome Sign Decorative Quote Board For Home, Door, Entrance, Hall & Office - Rustic Wall Art, 25 Cm", price: "₹194", rating: "4.0 out of 5", image: "https://m.media-amazon.com/images/I/617+4Y2FDTL._AC_UL320_.jpg", affiliate: "https://www.amazon.in/dp/B0F7HXKH7R/?tag=mydeals03c-21" },
  { title: "Wooden 1 Glass Test Tube Home Decor Planter Modern Flower Vase with Wood Stand Plant Propagation (17x12.5) cm", price: "₹99", rating: "4.3 out of 5", image: "https://m.media-amazon.com/images/I/4176Z641npL._AC_UL320_.jpg", affiliate: "https://www.amazon.in/dp/B0CJ744N7Z/?tag=mydeals03c-21" },
  { title: "eCraftIndia Resin Set of 4 Little Monk Buddha Statue Think No Evil Speak No Evil Hear No Evil See No Evil Showpiece for Home Decor Living Room Office", price: "₹278", rating: "4.4 out of 5", image: "https://m.media-amazon.com/images/I/71W0D-K-tBL._AC_UL320_.jpg", affiliate: "https://www.amazon.in/dp/B07P41VGFP/?tag=mydeals03c-21" },
  { title: "Artvibes Royal Fort And Rides Modern Art Decorative Wall Art MDF Wooden Wall Hanger for Home | Room Decoration | Handcrafted Art | Aesthetic Wooden Decor", price: "₹223", rating: "4.4 out of 5", image: "https://m.media-amazon.com/images/I/81AdAsrHv8L._AC_UL320_.jpg", affiliate: "https://www.amazon.in/dp/B0F8P3WVCR/?tag=mydeals03c-21" },
  { title: "Peacock Candle Holders Set of 2 - Decorative Brass Tea Light Stand with Green & Gold Finish - Home Decor Centerpiece for Living Room, Dining Table, Wedding, Festival", price: "₹499", rating: "5.0 out of 5", image: "https://m.media-amazon.com/images/I/61ZpPhxFrQL._AC_UL320_.jpg", affiliate: "https://www.amazon.in/dp/B0G4S8WMF8/?tag=mydeals03c-21" },
  { title: "TIED RIBBONS Set of 4 Miniature Buddha Monk Statues for Home Decor and Gifts (Small, Multicolour) Resin", price: "₹199", rating: "4.4 out of 5", image: "https://m.media-amazon.com/images/I/71WBIhxYlZL._AC_UL320_.jpg", affiliate: "https://www.amazon.in/dp/B07P8SYN87/?tag=mydeals03c-21" },
  { title: "Global Grabbers Buddha Statue Showpiece Idol Home Decor Items for Living Room and Gifts (Golden RED Blue)", price: "₹995", rating: "4.6 out of 5", image: "https://m.media-amazon.com/images/I/81oRooa2aCL._AC_UL320_.jpg", affiliate: "https://www.amazon.in/dp/B0F1VB96TH/?tag=mydeals03c-21" },
  { title: "Modern White Flower Pot with Legs | Big Planter | Indoor Outdoor Planter for Home, Garden, Balcony Decor | Italian Ribbed Design (Pack of 2)", price: "₹598", rating: "4.5 out of 5", image: "https://m.media-amazon.com/images/I/71aqPsHSEiL._AC_UL320_.jpg", affiliate: "https://www.amazon.in/dp/B0G6124JLC/?tag=mydeals03c-21" },
  { title: "Desidiya Metal Modern Chirpy LED Bird Light for Living Room, Bird Pendant Light for Wall Luxury & Elegant, Night Light Decor Bedroom", price: "₹713", rating: "4.1 out of 5", image: "https://m.media-amazon.com/images/I/5104C9aAQtL._AC_UL320_.jpg", affiliate: "https://www.amazon.in/dp/B0F9PPBQRW/?tag=mydeals03c-21" },
  { title: "Xtore Hand Crafted Swan Pair Home Decor Figurine | Decorative Showpiece (Pack of 2, Blue)", price: "₹1509", rating: "4.2 out of 5", image: "https://m.media-amazon.com/images/I/81YIVj3bicL._AC_UL320_.jpg", affiliate: "https://www.amazon.in/dp/B0C2HNBNNM/?tag=mydeals03c-21" },
  { title: "Goelite Key Holder for Home Without Drill with Storage | No Drilling Required | Home Keyholders with 8 Hooks with 2 Powerful Wall Hooks", price: "₹243", rating: "4.2 out of 5", image: "https://m.media-amazon.com/images/I/81JLf7q+KmL._AC_UL320_.jpg", affiliate: "https://www.amazon.in/dp/B0FG38YDLM/?tag=mydeals03c-21" },
  { title: "Homesake Retro Down to the Wire Metal Table Lamp with Fabric Shade, Bedside Lamp Gift Housewarming Home Living Room, Pleated Shade (Off-White)", price: "₹409", rating: "4.2 out of 5", image: "https://m.media-amazon.com/images/I/61xO0lWxdOL._AC_UL320_.jpg", affiliate: "https://www.amazon.in/dp/B0DQP38PJD/?tag=mydeals03c-21" },
  { title: "Amazon Brand Solimo Leaves Metal Wall Decor | Elegant Nature-Inspired Iron Wall Hanging | Set of 3", price: "₹749", rating: "4.1 out of 5", image: "https://m.media-amazon.com/images/I/81xos4fqbZL._AC_UL320_.jpg", affiliate: "https://www.amazon.in/dp/B0DS5FDDGL/?tag=mydeals03c-21" },
  { title: "White 19 Inch Running 7 Victory Horses Resin Statue for Vastu and Feng Shui | Home Office Living Room Decor Showpiece", price: "₹2726", rating: "4.1 out of 5", image: "https://m.media-amazon.com/images/I/61Pdpdoc05L._AC_UL320_.jpg", affiliate: "https://www.amazon.in/dp/B0DZVTXHBW/?tag=mydeals03c-21" },
  { title: "DSH CRAFTING YOUR CURIOSITY Metal Wall Decor Wall Hanging Multi Color Wall Arts for Home Hotel Office Living Room Bedroom (Size 46X19 Inch)", price: "₹1884", rating: "4.2 out of 5", image: "https://m.media-amazon.com/images/I/81tEiLoHJGL._AC_UL320_.jpg", affiliate: "https://www.amazon.in/dp/B09TJCNM6H/?tag=mydeals03c-21" },
  { title: "Amazon Basics Creative Resin Golden Reindeer Sculptures | Beautiful Home Decor Handicraft Resin | Elevates Energy of Your Room (Pack of 2, Blue)", price: "₹999", rating: "4.2 out of 5", image: "https://m.media-amazon.com/images/I/61K82n5tf3L._AC_UL320_.jpg", affiliate: "https://www.amazon.in/dp/B0DG32K4FJ/?tag=mydeals03c-21" },
  { title: "Artvibes Rules for Life Quotes MDF Wooden Hanging for Home Livingroom Art Items | Wall Accent | Deep Quote | Paintings | Couple Gifts", price: "₹230", rating: "4.5 out of 5", image: "https://m.media-amazon.com/images/I/711lkE4nyPL._AC_UL320_.jpg", affiliate: "https://www.amazon.in/dp/B0CZDRHYHQ/?tag=mydeals03c-21" },
  { title: "CDM Handcrafted Rajasthani Wall Hanging | Ethnic Decorative Hanging with Beads & Bell | Home Decor for Door, Wall, Balcony", price: "₹197", rating: "4.3 out of 5", image: "https://m.media-amazon.com/images/I/71qIifBB3OL._AC_UL320_.jpg", affiliate: "https://www.amazon.in/dp/B0FCMKV87F/?tag=mydeals03c-21" },
  { title: "Desidiya 16-Color LED Night Light Sunset Lamp with Remote & USB – 360° Rotating Projection Light for Room Ambience, Wall Decor, Photography & Mood Lighting", price: "₹277", rating: "4.0 out of 5", image: "https://m.media-amazon.com/images/I/713fAW3HyUL._AC_UL320_.jpg", affiliate: "https://www.amazon.in/dp/B0FD9T4NPJ/?tag=mydeals03c-21" },
  { title: "SPHINX Decorative Glass Vase for Flowers Plants Home Decor Office Living Table Decorations (Crystal Amber, Approx 9 Inches Height)", price: "₹213", rating: "4.1 out of 5", image: "https://m.media-amazon.com/images/I/71jwO2MnbML._AC_UL320_.jpg", affiliate: "https://www.amazon.in/dp/B0CSWJ39V4/?tag=mydeals03c-21" },
  { title: "Seven Chakra Gemstone Tree of Life, Positive Energy, Feng Shui Decor, Bonsai, Crystals and Healing Stones, Money Tree, Room Decor Stone, Healing Crystals", price: "₹399", rating: "4.1 out of 5", image: "https://m.media-amazon.com/images/I/819gqQRVvHL._AC_UL320_.jpg", affiliate: "https://www.amazon.in/dp/B0D67H9HKM/?tag=mydeals03c-21" },
  { title: "999 Pure Silver Plated & 24K Gold Plated Ganesh Shankh | Sacred 5.2 Inch Dual-Tone Conch Shell | Vastu Showpiece for Success & Wealth | Auspicious Pooja Gift", price: "₹1998", rating: "4.4 out of 5", image: "https://m.media-amazon.com/images/I/71so7UTYquL._AC_UL320_.jpg", affiliate: "https://www.amazon.in/dp/B0FTVJ8TV7/?tag=mydeals03c-21" },
  { title: "Ekhasa Lord Krishna Hands with Flute Idol (Small Size) | Krishnaji Divine Hands Idol with Flute and Peacock Feather | Krishna Statue for Car Dashboard & Griha Pravesh Gift", price: "₹674", rating: "4.4 out of 5", image: "https://m.media-amazon.com/images/I/71XzWZZStwL._AC_UL320_.jpg", affiliate: "https://www.amazon.in/dp/B0D1GK2FYP/?tag=mydeals03c-21" },
  { title: "Collectible India Peacock Design Radha Krishna Idol Showpiece with Diya for Puja and Home Decor (7 x 5 Inches), Metal, Gold (1 Piece)", price: "₹355", rating: "4.1 out of 5", image: "https://m.media-amazon.com/images/I/814wwnDQ1gL._AC_UL320_.jpg", affiliate: "https://www.amazon.in/dp/B07VYL7FSF/?tag=mydeals03c-21" },
  { title: "Homesake Tealight Candle Holders for Home Decor, Mosaic Glass, Flowers, Decorations for Home, Item for Diwali Festival Home Decor Item | Pack of 2", price: "₹309", rating: "4.3 out of 5", image: "https://m.media-amazon.com/images/I/81VKKLl4lFL._AC_UL320_.jpg", affiliate: "https://www.amazon.in/dp/B07FF4V7LZ/?tag=mydeals03c-21" },
  { title: "SPHINX Ribbed Pipe Ceramic Vase for Flowers, Pampas Grass, or Live Plants | Decorative Home & Office Centerpiece Gift (White, 6 Inch)", price: "₹247", rating: "4.2 out of 5", image: "https://m.media-amazon.com/images/I/61Lt6ZEiQUL._AC_UL320_.jpg", affiliate: "https://www.amazon.in/dp/B0CWY4TKNW/?tag=mydeals03c-21" },
  { title: "LIFEHAXTORE Home Decor Lucky Deer Family | Metallic Golden Finish Ceramic Figurine for Decor - (Set of 3, Golden)", price: "₹1079", rating: "4.3 out of 5", image: "https://m.media-amazon.com/images/I/710BO7DUxcL._AC_UL320_.jpg", affiliate: "https://www.amazon.in/dp/B09TDQFY54/?tag=mydeals03c-21" },
  { title: "SATYAM KRAFT 1 Set (3 Pcs) LED Tea Light Candles | Flameless, Smokeless, Unscented | for Gifting, Home Decor, Room Decoration Lights, Balcony & Festival, Wedding Decoration Items", price: "₹379", rating: "4.2 out of 5", image: "https://m.media-amazon.com/images/I/61haQBFBlyL._AC_UL320_.jpg", affiliate: "https://www.amazon.in/dp/B0C3D5TV4W/?tag=mydeals03c-21" },
  { title: "Purav Light Home Decor Cotton Carpets for Living Room 5x7 feet Multi-Use Flower Design Carpet Mats (Blue Colour)", price: "₹457", rating: "3.9 out of 5", image: "https://m.media-amazon.com/images/I/71ImIbUKkIL._AC_UL320_.jpg", affiliate: "https://www.amazon.in/dp/B07GCMLN1G/?tag=mydeals03c-21" },
  { title: "Artvibes Artistic Elephant Peacock & Tomb Pichwai Art Wooden Wall Hanger for Home Decor | Living Room | Office | Wall Art Painting For Hall | Graphic Artwork", price: "₹223", rating: "3.9 out of 5", image: "https://m.media-amazon.com/images/I/81T1U-TDQZL._AC_UL320_.jpg", affiliate: "https://www.amazon.in/dp/B0F8P2NTK8/?tag=mydeals03c-21" },
    {
        "title": "MARS Matte Lip Liner | One Swipe Smooth Application | Long Lasting Lip Pencil (1.4gm) (03-BLOOD BATH)",
        "price": "₹67",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/61K1KjkHEBL._AC_UL320_.jpg",
        "asin": "B0C9MVCV9Z",
        "affiliate": "https://www.amazon.in/dp/B0C9MVCV9Z/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "Gleva 4Pcs Makeup Blender Sponge Set, Soft Egg Shaped Blending Puff For Flawles Makeup, Blender for Liquid Foundation, Cream, Powder, Wet And Dry Makeup Applicator For Girls, Women (Pink)",
        "price": "₹149",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/51EdSBwUm5L._AC_UL320_.jpg",
        "asin": "B0DCK7P5X1",
        "affiliate": "https://www.amazon.in/dp/B0DCK7P5X1/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "NIVEA Pearl and Beauty 50ml Deo Underarm Roll On | With Pearl Extracts & Avocado Oil | 72 H Long Lasting Floral Scent | 0% Alcohol and Dermat Approved | For Women",
        "price": "₹160",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/31Ip4aURUpL.png",
        "asin": "B006LXDVTM",
        "affiliate": "https://www.amazon.in/dp/B006LXDVTM/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "Beauty of Joseon Relief Sun Aqua-fresh Rice + B5, SPF 50+ PA++++ Sun Cream, Moisturizing & Calming Formula, Korean Skincare, 50ml",
        "price": "₹1,275",
        "rating": "4.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/518ZII9nOxL._AC_UL320_.jpg",
        "asin": "B0DFMGBZ9Z",
        "affiliate": "https://www.amazon.in/dp/B0DFMGBZ9Z/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "POND'S Bright Beauty Spot Less Fairness Face Wash|| Removes Dead Skin And Dark Spots|| 200 g",
        "price": "₹228",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/512dChFNuXL._AC_UL320_.jpg",
        "asin": "B08NYD1GGK",
        "affiliate": "https://www.amazon.in/dp/B08NYD1GGK/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "Swiss Beauty Jelly Verse Eyeshadow Glow Stick | Rich Colour Payoff | Crease-Proof | Sparkling Shine | 6 Stellar Shades | Shade- 1. Star Shower, 3g",
        "price": "₹426",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/61n+rAl01vL._AC_UL320_.jpg",
        "asin": "B0FVM8JN3P",
        "affiliate": "https://www.amazon.in/dp/B0FVM8JN3P/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "Cetaphil Gentle Skin Hydrating Face Wash 118ml, Paraben Free, Sulphate-Free Gentle Skin Hydrating Cleanser with Niacinamide, Vitamin B5 for Dry to Normal, Sensitive Skin",
        "price": "₹389",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/61Ti2uv6V3L._AC_UL320_.jpg",
        "asin": "B01CCGW4OE",
        "affiliate": "https://www.amazon.in/dp/B01CCGW4OE/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "Maybelline New York Kajal, Black, Matte Finish",
        "price": "₹129",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/61b2tDBxhlL._AC_UL320_.jpg",
        "asin": "B06WGZP21B",
        "affiliate": "https://www.amazon.in/dp/B06WGZP21B/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "Swiss Beauty Long lasting Misty Finish Professional Makeup Fixer Spray for Face makeup | With Aloe Vera and Vitamin- E | Light weight, quick dry makeup Setting spray |70 ML|",
        "price": "₹245",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/61yLwQTM2SS._AC_UL320_.jpg",
        "asin": "B07SR3WV5N",
        "affiliate": "https://www.amazon.in/dp/B07SR3WV5N/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "NICONI Tan Vanish Gluta-Kojic Skin Polish | Instant Tan Removal & Glow | Infused with Kojic Acid & Glutathione | Ideal for All Skin Types | Lightens Suntan | 180g",
        "price": "₹1,396",
        "rating": "3.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/51l44UDSZSL._AC_UL640_QL65_.jpg",
        "asin": "B0F1TDDNGD",
        "affiliate": "https://www.amazon.in/dp/B0F1TDDNGD/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "BiE Superpower - Eternal Youth Cream | Anti-Aging Cream with Squalane, Almond Oil & Ginseng Stem Cells | Reduces Wrinkles & Fine Lines | Unisex | For All Skin Types | 50gm",
        "price": "₹2,999",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/51Tapc21LWL._AC_UL320_.jpg",
        "asin": "B0BRJH8HLL",
        "affiliate": "https://www.amazon.in/dp/B0BRJH8HLL/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "Cosrx Advanced Snail 96 Mucin Power Essence (100ml)",
        "price": "₹1,080",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/416kUGx2rQL._AC_UL320_.jpg",
        "asin": "B00PBX3L7K",
        "affiliate": "https://www.amazon.in/dp/B00PBX3L7K/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "Multi-Shape Makeup Sponge Set | 20 Piece Beauty Puff Collection with Headband and Clean Sponge | Pink, Purple, Beige & Bright Sets | Face Blender Kit for Cream, Liquid & Powder | Aesthetic and Functional Makeup Tool (Brown, 20Pcs)",
        "price": "₹299",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/81cn5ubXbHL._AC_UL320_.jpg",
        "asin": "B0F8JD36CQ",
        "affiliate": "https://www.amazon.in/dp/B0F8JD36CQ/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "Beauty of Joseon Relief Sun Rice + Probiotics 50 ml SPF 50+ PA++++ Lightweight Korean Sunscreen for Oily Skin",
        "price": "₹1,275",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/61DA-VH24GL._AC_UL320_.jpg",
        "asin": "B09JVNZVH3",
        "affiliate": "https://www.amazon.in/dp/B09JVNZVH3/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "FACES CANADA Strobe Cream Mini- Rose Gold, 18ml | Primer + Highlighter + Moisturizer | Shea Butter & Hyaluronic Acid | Intense Hydration | Flawless Radiant Dewy Skin | Illuminating & Glowing Makeup Base",
        "price": "₹280",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/51yKs+HlJkL._AC_UL320_.jpg",
        "asin": "B0FSQB83XJ",
        "affiliate": "https://www.amazon.in/dp/B0FSQB83XJ/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "Beauty of Joseon Revive Eye Serum with Ginseng & Retinal (30m) | Anti-Aging, Wrinkle Care, Korean Eye Cream for Dark Circles & Fine Lines",
        "price": "₹1,207",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/51jLIIpp2lL._AC_UL320_.jpg",
        "asin": "B0B45LL4DD",
        "affiliate": "https://www.amazon.in/dp/B0B45LL4DD/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "Swiss Beauty Awaken Eyeshadow Palette | Matte + Shimmer Finish | Long-Lasting | Blendable | Shade- 1. Blooming Rose, 11g",
        "price": "₹314",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/61CE8TnEDqL._AC_UL320_.jpg",
        "asin": "B0FYQ7L8PK",
        "affiliate": "https://www.amazon.in/dp/B0FYQ7L8PK/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "13 Pcs Make up Brushes Set, Foundation Powder Concealer Eyeshadow Blush Highlighter Eyebrow Brush Make up Brush Set, Travel Makeup Brushes with Cloth Bag for Beginner and Make up Artist (Green)",
        "price": "₹179",
        "rating": "3.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/61xj0G7cnLL._AC_UL320_.jpg",
        "asin": "B0F1LKMWF9",
        "affiliate": "https://www.amazon.in/dp/B0F1LKMWF9/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "Typsy Beauty Pout Cloud Matte Lip Balm | Blurring Finish, Tinted Lip Balm with Peptides, Ceramides & Vitamin C & E | Rich colour payoff with long-lasting stain I Terracotta -Milk and Cookies 01 | 8g",
        "price": "₹664",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/51bsqCoyTiL._AC_UL320_.jpg",
        "asin": "B0G2XQXTL5",
        "affiliate": "https://www.amazon.in/dp/B0G2XQXTL5/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "Swiss Beauty Perfect Liquid Light Weight Concealer With Full Coverage |Easily Blendable Concealer For Face Makeup With Matte Finish | Shade- Medium Beige, 6g",
        "price": "₹212",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/51XwTvwzT7L._AC_UL320_.jpg",
        "asin": "B07NBLWN5G",
        "affiliate": "https://www.amazon.in/dp/B07NBLWN5G/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "Mila Beauté Gloss Girl Lip Gloss | Enriched With Mango Seed Butter & Hyaluronic Acid | Light Weight & Non-Sticky Formula | Gives Fuller-Lip Effect & Extra Hydration | High Shine Finish - Dont Know, 2.8 ml",
        "price": "₹199",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/7111ClVhujL._AC_UL320_.jpg",
        "asin": "B0DK5NB1BK",
        "affiliate": "https://www.amazon.in/dp/B0DK5NB1BK/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "Swiss Beauty Kiss Kandy Tinted Lip Balm | Moisturising Non-Sticky Formula with Olive Oil & Vitamin E | Soft, Smooth & Hydrated Lips All Day | Water Melon, 10ml",
        "price": "₹110",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/51ARDhWwr-L._AC_UL320_.jpg",
        "asin": "B0BSQVN3KL",
        "affiliate": "https://www.amazon.in/dp/B0BSQVN3KL/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "Swiss Beauty Bold Matt Lip Liner | Set of 12 | Long-lasting |Matte Finish | Non-drying, 19.2gm",
        "price": "₹629",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/61D5PnuVl2L._AC_UL320_.jpg",
        "asin": "B07Y3F85BV",
        "affiliate": "https://www.amazon.in/dp/B07Y3F85BV/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "SWISS BEAUTY Craze 2-N 1 Gel Semi-Matte Eyeliner With Wing Stamp | Waterproof And Smudgeproof Eyeliner With Fine Tip For Precise Application | Black, 2.8Ml",
        "price": "₹224",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/51lI17yYXHL._AC_UL320_.jpg",
        "asin": "B0CY5B96NC",
        "affiliate": "https://www.amazon.in/dp/B0CY5B96NC/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "Beauty Garage Botoplex K9 Shampoo And Conditioner For Women | 300ml + 300ml Combo | Sulfate Phosphate Paraben Free Duo With Frizz Control | Shampoo And Conditioner For Color Maintenance",
        "price": "₹2,550",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/41sOjpwez0L._AC_UL320_.jpg",
        "asin": "B0BB1ZNC7P",
        "affiliate": "https://www.amazon.in/dp/B0BB1ZNC7P/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "Lakme SPF 50 PA++++ Sunscreen Lotion for Bright Skin | In Vivo Tested | UVA UVB Blue Light Protection | Waterlight| No White Cast | Niacinamide| For All Skin Types | 100 ml",
        "price": "₹362",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/51+gSgH2c4L._AC_UL320_.jpg",
        "asin": "B00CS1KT96",
        "affiliate": "https://www.amazon.in/dp/B00CS1KT96/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "Pond's Bright Beauty Light Cream with UV Filter | Niasorcinol | 100x Better than Vitamin C | Niacinamide | Fades Dark Spots, Brightens Skin, 50g",
        "price": "₹215",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/51qbCjJYqEL._AC_UL320_.jpg",
        "asin": "B099QVJGCR",
        "affiliate": "https://www.amazon.in/dp/B099QVJGCR/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "Swiss Beauty Lustre Eyeshadow Palette | 4 Highly Pigmented Shades in Matte & Shine |Long-Lasting | All Skin Types | Shade- Rose n Petals, 5gm",
        "price": "₹216",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/61HycKa-csL._AC_UL320_.jpg",
        "asin": "B0C6XX4421",
        "affiliate": "https://www.amazon.in/dp/B0C6XX4421/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "Beauty of Joseon Dynasty Cream Hydrating Face Moisturizer for Dry, Sensitive Skin, Korean Skincare for Men and Women 50ml",
        "price": "₹1,700",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/51CKPzqhNLL._AC_UL320_.jpg",
        "asin": "B08WJQ3XJD",
        "affiliate": "https://www.amazon.in/dp/B08WJQ3XJD/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "Beauty of Joseon Red Bean Pore Refreshing Mask Mud Cream Hydrating Wash Off Pack, Pore Cleansing Exfoliator, Korean Skin Care for Men and Women 140ml",
        "price": "₹1,503",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/71ExVUWZQEL._AC_UL320_.jpg",
        "asin": "B0BJPKX14D",
        "affiliate": "https://www.amazon.in/dp/B0BJPKX14D/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "Beauty of Joseon Ground Rice and Honey Glow Mask for Pore and Sebum Care for Dry Sensitive Skin Korean Skin Care 150ml",
        "price": "₹1,275",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/71i25DwdOEL._AC_UL320_.jpg",
        "asin": "B0D4517144",
        "affiliate": "https://www.amazon.in/dp/B0D4517144/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "d'alba Piedmont Italian White Truffle First Spray Serum, Vegan Skin Care, Hydrating Face Moisturizer, Glow Serum for Radiant Skin, Non Comedogenic, All In One Mist, Korean Skin Care - 100ml",
        "price": "₹1,520",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/51Hyi1zkxYL._AC_UL320_.jpg",
        "asin": "B0BFQ9RD5B",
        "affiliate": "https://www.amazon.in/dp/B0BFQ9RD5B/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "FACESCANADA Strobe Cream - Rose Gold, 30Ml | Primer + Highlighter + Moisturizer | Shea Butter & Hyaluronic Acid | Intense Hydration | Flawless Radiant Dewy Skin | Illuminating & Glowing Makeup Base",
        "price": "₹444",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/515W5cQZxDL._AC_UL320_.jpg",
        "asin": "B0BR585QS2",
        "affiliate": "https://www.amazon.in/dp/B0BR585QS2/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "Swiss Beauty Makeup Buddy Beauty Blender for Face Makeup | Reusable Multi-Use Sponge | Flawless & Airbrushed Finish | Soft & Blendable | Shade 02",
        "price": "₹103",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/61fHYr2mYwL._AC_UL320_.jpg",
        "asin": "B09V1KXDCK",
        "affiliate": "https://www.amazon.in/dp/B09V1KXDCK/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "Dove Cream Beauty Bathing Bar 100g + 20g FREE",
        "price": "₹60",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/31Ip4aURUpL.png",
        "asin": "B008KH5FBE",
        "affiliate": "https://www.amazon.in/dp/B008KH5FBE/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "Fae Beauty Lip Whip 12Hr Comfortable Matte Liquid Lipstick (10ml) | Waterproof | Long Wear | Non Drying | Soft Mousse Smudgeproof Formula | Vegan | With Moisture Lock Technology | Enriched with Vitamin E and Cherry Coffee - Tease",
        "price": "₹585",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/41m3ssIBvtL._AC_UL320_.jpg",
        "asin": "B0DM93H2M4",
        "affiliate": "https://www.amazon.in/dp/B0DM93H2M4/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "Lakme Powerplay Priming Matte Lipstick, Smooth Matte Finish, Lightweight Lipstick, Smudgeproof, Lasts 16hrs, Hydrates Lips, Chocolate Crush, 3.6g",
        "price": "₹302",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/51POGA-K5NL._AC_UL320_.jpg",
        "asin": "B08N7XBHLW",
        "affiliate": "https://www.amazon.in/dp/B08N7XBHLW/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "Swiss Beauty Cream It Up Blush | Highly pigmented | Super-blendable | Long-lasting | Enriched with Shea Butter | Multipurpose | Shade-03 Cheeky Peach, 10ml",
        "price": "₹252",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/51k6u8kYKNL._AC_UL320_.jpg",
        "asin": "B0C6XM5LYZ",
        "affiliate": "https://www.amazon.in/dp/B0C6XM5LYZ/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "POND'S Bright Beauty Day Cream 35 g, Non-Oily, Mattifying Daily Face Moisturizer, SPF 15 - With Niacinamide to Lighten Dark Spots for Glowing Skin",
        "price": "₹125",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/51+hz8BNKjL._AC_UL320_.jpg",
        "asin": "B077ND8562",
        "affiliate": "https://www.amazon.in/dp/B077ND8562/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "Swiss Beauty Real Makeup Base Highlighting Primer| Skin-Hydrating Poreless Primer With Natural Glow Finish For Face Makeup |Shade - 02 Golden-Tint, 32Ml",
        "price": "₹318",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/51zTa6QWfqL._AC_UL320_.jpg",
        "asin": "B07X9KMG88",
        "affiliate": "https://www.amazon.in/dp/B07X9KMG88/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "Lakme 9 to 5 CC Cream Beige with 3% Niacinamide Complex SPF 30 PA++| 9g",
        "price": "₹115",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/51TjBxQilYL._AC_UL320_.jpg",
        "asin": "B01BBNF6C6",
        "affiliate": "https://www.amazon.in/dp/B01BBNF6C6/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "Swiss Beauty Pure Matte Creamy Lipstick | Non-drying, Highly pigmented Lipstick | Shade- Hazelnut, 3.8gm|",
        "price": "₹183",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/512Spr0b8yL._AC_UL320_.jpg",
        "asin": "B07SZ1TK1D",
        "affiliate": "https://www.amazon.in/dp/B07SZ1TK1D/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "L'Oreal Paris Fresh Hyaluron Moisture 72HR Moisture Sealing Conditioner Powered By Hyaluronic Acid, For Frizz-Free, Hydrated And Bouncy Hair Full Of Life For All Hair Types | 175 Millilitres",
        "price": "₹199",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/511fPrnY+bL._AC_UL320_.jpg",
        "asin": "B0B6Y3FNV7",
        "affiliate": "https://www.amazon.in/dp/B0B6Y3FNV7/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "Garnier Vitamin C + Face Serum for Skin Brightening & Anti-Dark Spots|100X Stronger than Vit C |2% Niacinamide 0.5% Salicylic Acid/BHA |Suitable for Oily, Dry, Sensitive Skin |For Men & Women 30ml",
        "price": "₹371",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/51-0Yb6kfJL._AC_UL320_.jpg",
        "asin": "B08FTQXWC7",
        "affiliate": "https://www.amazon.in/dp/B08FTQXWC7/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "Garnier Bright Complete Vitamin C Face Wash, For Brightening & Glowing Skin | Daily Cleanser Suitable For all Skin Types | Vitamin C Facewash for Women & Men, 160g",
        "price": "₹224",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/51O4CZnsiZL._AC_UL320_.jpg",
        "asin": "B0G4WQX1WR",
        "affiliate": "https://www.amazon.in/dp/B0G4WQX1WR/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "Garnier Skin Naturals Bright Complete Vitamin C Serum UV Cream, Vitamin C Day Cream for Sun Protection and Skin Brightening - Suitable For all Skin Types, 45g",
        "price": "₹184",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/31Ip4aURUpL.png",
        "asin": "B07DL94CPX",
        "affiliate": "https://www.amazon.in/dp/B07DL94CPX/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "Pilgrim Korean Beauty White Lotus Refreshing Face Mist & Toner | Toner for glowing skin | Alcohol-Free Mist & toner for open pores Tightening | Korean skin care products | Women & Men | 100 ml",
        "price": "₹201",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/51HybJepgGL._AC_UL320_.jpg",
        "asin": "B0836XVS63",
        "affiliate": "https://www.amazon.in/dp/B0836XVS63/?tag=mydeals03c-21",
        "category": "Beauty"
    },
  {
        "title": "MARS Matte Lip Liner | One Swipe Smooth Application | Long Lasting Lip Pencil (1.4gm) (03-BLOOD BATH)",
        "price": "₹67",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/61K1KjkHEBL._AC_UL320_.jpg",
        "asin": "B0C9MVCV9Z",
        "affiliate": "https://www.amazon.in/dp/B0C9MVCV9Z/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "Gleva 4Pcs Makeup Blender Sponge Set, Soft Egg Shaped Blending Puff For Flawles Makeup, Blender for Liquid Foundation, Cream, Powder, Wet And Dry Makeup Applicator For Girls, Women (Pink)",
        "price": "₹149",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/51EdSBwUm5L._AC_UL320_.jpg",
        "asin": "B0DCK7P5X1",
        "affiliate": "https://www.amazon.in/dp/B0DCK7P5X1/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "NIVEA Pearl and Beauty 50ml Deo Underarm Roll On | With Pearl Extracts & Avocado Oil | 72 H Long Lasting Floral Scent | 0% Alcohol and Dermat Approved | For Women",
        "price": "₹160",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/31Ip4aURUpL.png",
        "asin": "B006LXDVTM",
        "affiliate": "https://www.amazon.in/dp/B006LXDVTM/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "Beauty of Joseon Relief Sun Aqua-fresh Rice + B5, SPF 50+ PA++++ Sun Cream, Moisturizing & Calming Formula, Korean Skincare, 50ml",
        "price": "₹1,275",
        "rating": "4.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/518ZII9nOxL._AC_UL320_.jpg",
        "asin": "B0DFMGBZ9Z",
        "affiliate": "https://www.amazon.in/dp/B0DFMGBZ9Z/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "POND'S Bright Beauty Spot Less Fairness Face Wash|| Removes Dead Skin And Dark Spots|| 200 g",
        "price": "₹228",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/512dChFNuXL._AC_UL320_.jpg",
        "asin": "B08NYD1GGK",
        "affiliate": "https://www.amazon.in/dp/B08NYD1GGK/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "Swiss Beauty Jelly Verse Eyeshadow Glow Stick | Rich Colour Payoff | Crease-Proof | Sparkling Shine | 6 Stellar Shades | Shade- 1. Star Shower, 3g",
        "price": "₹426",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/61n+rAl01vL._AC_UL320_.jpg",
        "asin": "B0FVM8JN3P",
        "affiliate": "https://www.amazon.in/dp/B0FVM8JN3P/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "Cetaphil Gentle Skin Hydrating Face Wash 118ml, Paraben Free, Sulphate-Free Gentle Skin Hydrating Cleanser with Niacinamide, Vitamin B5 for Dry to Normal, Sensitive Skin",
        "price": "₹389",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/61Ti2uv6V3L._AC_UL320_.jpg",
        "asin": "B01CCGW4OE",
        "affiliate": "https://www.amazon.in/dp/B01CCGW4OE/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "Maybelline New York Kajal, Black, Matte Finish",
        "price": "₹129",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/61b2tDBxhlL._AC_UL320_.jpg",
        "asin": "B06WGZP21B",
        "affiliate": "https://www.amazon.in/dp/B06WGZP21B/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "Swiss Beauty Long lasting Misty Finish Professional Makeup Fixer Spray for Face makeup | With Aloe Vera and Vitamin- E | Light weight, quick dry makeup Setting spray |70 ML|",
        "price": "₹245",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/61yLwQTM2SS._AC_UL320_.jpg",
        "asin": "B07SR3WV5N",
        "affiliate": "https://www.amazon.in/dp/B07SR3WV5N/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "NICONI Tan Vanish Gluta-Kojic Skin Polish | Instant Tan Removal & Glow | Infused with Kojic Acid & Glutathione | Ideal for All Skin Types | Lightens Suntan | 180g",
        "price": "₹1,396",
        "rating": "3.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/51l44UDSZSL._AC_UL640_QL65_.jpg",
        "asin": "B0F1TDDNGD",
        "affiliate": "https://www.amazon.in/dp/B0F1TDDNGD/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "BiE Superpower - Eternal Youth Cream | Anti-Aging Cream with Squalane, Almond Oil & Ginseng Stem Cells | Reduces Wrinkles & Fine Lines | Unisex | For All Skin Types | 50gm",
        "price": "₹2,999",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/51Tapc21LWL._AC_UL320_.jpg",
        "asin": "B0BRJH8HLL",
        "affiliate": "https://www.amazon.in/dp/B0BRJH8HLL/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "Cosrx Advanced Snail 96 Mucin Power Essence (100ml)",
        "price": "₹1,080",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/416kUGx2rQL._AC_UL320_.jpg",
        "asin": "B00PBX3L7K",
        "affiliate": "https://www.amazon.in/dp/B00PBX3L7K/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "Multi-Shape Makeup Sponge Set | 20 Piece Beauty Puff Collection with Headband and Clean Sponge | Pink, Purple, Beige & Bright Sets | Face Blender Kit for Cream, Liquid & Powder | Aesthetic and Functional Makeup Tool (Brown, 20Pcs)",
        "price": "₹299",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/81cn5ubXbHL._AC_UL320_.jpg",
        "asin": "B0F8JD36CQ",
        "affiliate": "https://www.amazon.in/dp/B0F8JD36CQ/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "Beauty of Joseon Relief Sun Rice + Probiotics 50 ml SPF 50+ PA++++ Lightweight Korean Sunscreen for Oily Skin",
        "price": "₹1,275",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/61DA-VH24GL._AC_UL320_.jpg",
        "asin": "B09JVNZVH3",
        "affiliate": "https://www.amazon.in/dp/B09JVNZVH3/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "FACES CANADA Strobe Cream Mini- Rose Gold, 18ml | Primer + Highlighter + Moisturizer | Shea Butter & Hyaluronic Acid | Intense Hydration | Flawless Radiant Dewy Skin | Illuminating & Glowing Makeup Base",
        "price": "₹280",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/51yKs+HlJkL._AC_UL320_.jpg",
        "asin": "B0FSQB83XJ",
        "affiliate": "https://www.amazon.in/dp/B0FSQB83XJ/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "Beauty of Joseon Revive Eye Serum with Ginseng & Retinal (30m) | Anti-Aging, Wrinkle Care, Korean Eye Cream for Dark Circles & Fine Lines",
        "price": "₹1,207",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/51jLIIpp2lL._AC_UL320_.jpg",
        "asin": "B0B45LL4DD",
        "affiliate": "https://www.amazon.in/dp/B0B45LL4DD/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "Swiss Beauty Awaken Eyeshadow Palette | Matte + Shimmer Finish | Long-Lasting | Blendable | Shade- 1. Blooming Rose, 11g",
        "price": "₹314",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/61CE8TnEDqL._AC_UL320_.jpg",
        "asin": "B0FYQ7L8PK",
        "affiliate": "https://www.amazon.in/dp/B0FYQ7L8PK/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "13 Pcs Make up Brushes Set, Foundation Powder Concealer Eyeshadow Blush Highlighter Eyebrow Brush Make up Brush Set, Travel Makeup Brushes with Cloth Bag for Beginner and Make up Artist (Green)",
        "price": "₹179",
        "rating": "3.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/61xj0G7cnLL._AC_UL320_.jpg",
        "asin": "B0F1LKMWF9",
        "affiliate": "https://www.amazon.in/dp/B0F1LKMWF9/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "Typsy Beauty Pout Cloud Matte Lip Balm | Blurring Finish, Tinted Lip Balm with Peptides, Ceramides & Vitamin C & E | Rich colour payoff with long-lasting stain I Terracotta -Milk and Cookies 01 | 8g",
        "price": "₹664",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/51bsqCoyTiL._AC_UL320_.jpg",
        "asin": "B0G2XQXTL5",
        "affiliate": "https://www.amazon.in/dp/B0G2XQXTL5/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "Swiss Beauty Perfect Liquid Light Weight Concealer With Full Coverage |Easily Blendable Concealer For Face Makeup With Matte Finish | Shade- Medium Beige, 6g",
        "price": "₹212",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/51XwTvwzT7L._AC_UL320_.jpg",
        "asin": "B07NBLWN5G",
        "affiliate": "https://www.amazon.in/dp/B07NBLWN5G/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "Mila Beauté Gloss Girl Lip Gloss | Enriched With Mango Seed Butter & Hyaluronic Acid | Light Weight & Non-Sticky Formula | Gives Fuller-Lip Effect & Extra Hydration | High Shine Finish - Dont Know, 2.8 ml",
        "price": "₹199",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/7111ClVhujL._AC_UL320_.jpg",
        "asin": "B0DK5NB1BK",
        "affiliate": "https://www.amazon.in/dp/B0DK5NB1BK/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "Swiss Beauty Kiss Kandy Tinted Lip Balm | Moisturising Non-Sticky Formula with Olive Oil & Vitamin E | Soft, Smooth & Hydrated Lips All Day | Water Melon, 10ml",
        "price": "₹110",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/51ARDhWwr-L._AC_UL320_.jpg",
        "asin": "B0BSQVN3KL",
        "affiliate": "https://www.amazon.in/dp/B0BSQVN3KL/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "Swiss Beauty Bold Matt Lip Liner | Set of 12 | Long-lasting |Matte Finish | Non-drying, 19.2gm",
        "price": "₹629",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/61D5PnuVl2L._AC_UL320_.jpg",
        "asin": "B07Y3F85BV",
        "affiliate": "https://www.amazon.in/dp/B07Y3F85BV/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "SWISS BEAUTY Craze 2-N 1 Gel Semi-Matte Eyeliner With Wing Stamp | Waterproof And Smudgeproof Eyeliner With Fine Tip For Precise Application | Black, 2.8Ml",
        "price": "₹224",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/51lI17yYXHL._AC_UL320_.jpg",
        "asin": "B0CY5B96NC",
        "affiliate": "https://www.amazon.in/dp/B0CY5B96NC/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "Beauty Garage Botoplex K9 Shampoo And Conditioner For Women | 300ml + 300ml Combo | Sulfate Phosphate Paraben Free Duo With Frizz Control | Shampoo And Conditioner For Color Maintenance",
        "price": "₹2,550",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/41sOjpwez0L._AC_UL320_.jpg",
        "asin": "B0BB1ZNC7P",
        "affiliate": "https://www.amazon.in/dp/B0BB1ZNC7P/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "Lakme SPF 50 PA++++ Sunscreen Lotion for Bright Skin | In Vivo Tested | UVA UVB Blue Light Protection | Waterlight| No White Cast | Niacinamide| For All Skin Types | 100 ml",
        "price": "₹362",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/51+gSgH2c4L._AC_UL320_.jpg",
        "asin": "B00CS1KT96",
        "affiliate": "https://www.amazon.in/dp/B00CS1KT96/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "Pond's Bright Beauty Light Cream with UV Filter | Niasorcinol | 100x Better than Vitamin C | Niacinamide | Fades Dark Spots, Brightens Skin, 50g",
        "price": "₹215",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/51qbCjJYqEL._AC_UL320_.jpg",
        "asin": "B099QVJGCR",
        "affiliate": "https://www.amazon.in/dp/B099QVJGCR/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "Swiss Beauty Lustre Eyeshadow Palette | 4 Highly Pigmented Shades in Matte & Shine |Long-Lasting | All Skin Types | Shade- Rose n Petals, 5gm",
        "price": "₹216",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/61HycKa-csL._AC_UL320_.jpg",
        "asin": "B0C6XX4421",
        "affiliate": "https://www.amazon.in/dp/B0C6XX4421/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "Beauty of Joseon Dynasty Cream Hydrating Face Moisturizer for Dry, Sensitive Skin, Korean Skincare for Men and Women 50ml",
        "price": "₹1,700",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/51CKPzqhNLL._AC_UL320_.jpg",
        "asin": "B08WJQ3XJD",
        "affiliate": "https://www.amazon.in/dp/B08WJQ3XJD/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "Beauty of Joseon Red Bean Pore Refreshing Mask Mud Cream Hydrating Wash Off Pack, Pore Cleansing Exfoliator, Korean Skin Care for Men and Women 140ml",
        "price": "₹1,503",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/71ExVUWZQEL._AC_UL320_.jpg",
        "asin": "B0BJPKX14D",
        "affiliate": "https://www.amazon.in/dp/B0BJPKX14D/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "Beauty of Joseon Ground Rice and Honey Glow Mask for Pore and Sebum Care for Dry Sensitive Skin Korean Skin Care 150ml",
        "price": "₹1,275",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/71i25DwdOEL._AC_UL320_.jpg",
        "asin": "B0D4517144",
        "affiliate": "https://www.amazon.in/dp/B0D4517144/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "d'alba Piedmont Italian White Truffle First Spray Serum, Vegan Skin Care, Hydrating Face Moisturizer, Glow Serum for Radiant Skin, Non Comedogenic, All In One Mist, Korean Skin Care - 100ml",
        "price": "₹1,520",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/51Hyi1zkxYL._AC_UL320_.jpg",
        "asin": "B0BFQ9RD5B",
        "affiliate": "https://www.amazon.in/dp/B0BFQ9RD5B/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "FACESCANADA Strobe Cream - Rose Gold, 30Ml | Primer + Highlighter + Moisturizer | Shea Butter & Hyaluronic Acid | Intense Hydration | Flawless Radiant Dewy Skin | Illuminating & Glowing Makeup Base",
        "price": "₹444",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/515W5cQZxDL._AC_UL320_.jpg",
        "asin": "B0BR585QS2",
        "affiliate": "https://www.amazon.in/dp/B0BR585QS2/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "Swiss Beauty Makeup Buddy Beauty Blender for Face Makeup | Reusable Multi-Use Sponge | Flawless & Airbrushed Finish | Soft & Blendable | Shade 02",
        "price": "₹103",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/61fHYr2mYwL._AC_UL320_.jpg",
        "asin": "B09V1KXDCK",
        "affiliate": "https://www.amazon.in/dp/B09V1KXDCK/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "Dove Cream Beauty Bathing Bar 100g + 20g FREE",
        "price": "₹60",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/31Ip4aURUpL.png",
        "asin": "B008KH5FBE",
        "affiliate": "https://www.amazon.in/dp/B008KH5FBE/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "Fae Beauty Lip Whip 12Hr Comfortable Matte Liquid Lipstick (10ml) | Waterproof | Long Wear | Non Drying | Soft Mousse Smudgeproof Formula | Vegan | With Moisture Lock Technology | Enriched with Vitamin E and Cherry Coffee - Tease",
        "price": "₹585",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/41m3ssIBvtL._AC_UL320_.jpg",
        "asin": "B0DM93H2M4",
        "affiliate": "https://www.amazon.in/dp/B0DM93H2M4/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "Lakme Powerplay Priming Matte Lipstick, Smooth Matte Finish, Lightweight Lipstick, Smudgeproof, Lasts 16hrs, Hydrates Lips, Chocolate Crush, 3.6g",
        "price": "₹302",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/51POGA-K5NL._AC_UL320_.jpg",
        "asin": "B08N7XBHLW",
        "affiliate": "https://www.amazon.in/dp/B08N7XBHLW/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "Swiss Beauty Cream It Up Blush | Highly pigmented | Super-blendable | Long-lasting | Enriched with Shea Butter | Multipurpose | Shade-03 Cheeky Peach, 10ml",
        "price": "₹252",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/51k6u8kYKNL._AC_UL320_.jpg",
        "asin": "B0C6XM5LYZ",
        "affiliate": "https://www.amazon.in/dp/B0C6XM5LYZ/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "POND'S Bright Beauty Day Cream 35 g, Non-Oily, Mattifying Daily Face Moisturizer, SPF 15 - With Niacinamide to Lighten Dark Spots for Glowing Skin",
        "price": "₹125",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/51+hz8BNKjL._AC_UL320_.jpg",
        "asin": "B077ND8562",
        "affiliate": "https://www.amazon.in/dp/B077ND8562/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "Swiss Beauty Real Makeup Base Highlighting Primer| Skin-Hydrating Poreless Primer With Natural Glow Finish For Face Makeup |Shade - 02 Golden-Tint, 32Ml",
        "price": "₹318",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/51zTa6QWfqL._AC_UL320_.jpg",
        "asin": "B07X9KMG88",
        "affiliate": "https://www.amazon.in/dp/B07X9KMG88/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "Lakme 9 to 5 CC Cream Beige with 3% Niacinamide Complex SPF 30 PA++| 9g",
        "price": "₹115",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/51TjBxQilYL._AC_UL320_.jpg",
        "asin": "B01BBNF6C6",
        "affiliate": "https://www.amazon.in/dp/B01BBNF6C6/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "Swiss Beauty Pure Matte Creamy Lipstick | Non-drying, Highly pigmented Lipstick | Shade- Hazelnut, 3.8gm|",
        "price": "₹183",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/512Spr0b8yL._AC_UL320_.jpg",
        "asin": "B07SZ1TK1D",
        "affiliate": "https://www.amazon.in/dp/B07SZ1TK1D/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "L'Oreal Paris Fresh Hyaluron Moisture 72HR Moisture Sealing Conditioner Powered By Hyaluronic Acid, For Frizz-Free, Hydrated And Bouncy Hair Full Of Life For All Hair Types | 175 Millilitres",
        "price": "₹199",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/511fPrnY+bL._AC_UL320_.jpg",
        "asin": "B0B6Y3FNV7",
        "affiliate": "https://www.amazon.in/dp/B0B6Y3FNV7/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "Garnier Vitamin C + Face Serum for Skin Brightening & Anti-Dark Spots|100X Stronger than Vit C |2% Niacinamide 0.5% Salicylic Acid/BHA |Suitable for Oily, Dry, Sensitive Skin |For Men & Women 30ml",
        "price": "₹371",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/51-0Yb6kfJL._AC_UL320_.jpg",
        "asin": "B08FTQXWC7",
        "affiliate": "https://www.amazon.in/dp/B08FTQXWC7/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "Garnier Bright Complete Vitamin C Face Wash, For Brightening & Glowing Skin | Daily Cleanser Suitable For all Skin Types | Vitamin C Facewash for Women & Men, 160g",
        "price": "₹224",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/51O4CZnsiZL._AC_UL320_.jpg",
        "asin": "B0G4WQX1WR",
        "affiliate": "https://www.amazon.in/dp/B0G4WQX1WR/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "Garnier Skin Naturals Bright Complete Vitamin C Serum UV Cream, Vitamin C Day Cream for Sun Protection and Skin Brightening - Suitable For all Skin Types, 45g",
        "price": "₹184",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/31Ip4aURUpL.png",
        "asin": "B07DL94CPX",
        "affiliate": "https://www.amazon.in/dp/B07DL94CPX/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    {
        "title": "Pilgrim Korean Beauty White Lotus Refreshing Face Mist & Toner | Toner for glowing skin | Alcohol-Free Mist & toner for open pores Tightening | Korean skin care products | Women & Men | 100 ml",
        "price": "₹201",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/51HybJepgGL._AC_UL320_.jpg",
        "asin": "B0836XVS63",
        "affiliate": "https://www.amazon.in/dp/B0836XVS63/?tag=mydeals03c-21",
        "category": "Beauty"
    },
    
    {
        "title": "Portronics Snapcase 3 60W Multifunctional Fast Charging Data Cable Kit, Conversion Set USB A & Type C to Male Micro/Type C/Lightning, Data Transfer, Sim Storage, Sim Eject Pin, Pocket Size(Blue)",
        "price": "₹299",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/61t1Q0eNs7L._AC_UY218_.jpg",
        "asin": "B0DTPGC83R",
        "affiliate": "https://www.amazon.in/dp/B0DTPGC83R/?tag=mydeals03c-21",
        "category": "Electronics"
    },
    {
        "title": "Ambrane Magsafe Wireless 10000Mah Fast Charging Power Bank, Strong Magnet, Micro USB Input, 22.5W Output For Iphone 12 Above, Android & Other Qi Enabled Devices + Magnetic Ring (Aerosync Snap, Purple)",
        "price": "₹1,499",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/6199hEwNH6L._AC_UY218_.jpg",
        "asin": "B0D9S9TV5Q",
        "affiliate": "https://www.amazon.in/dp/B0D9S9TV5Q/?tag=mydeals03c-21",
        "category": "Electronics"
    },
    {
        "title": "Portronics Snapcase 2 60W Multifunctional Fast Charging Data Cable Kit With Retractable Cable, Conversion Set USB A & Type C to Male Micro/Lightning,Sim Storage,Sim Eject Pin",
        "price": "₹449",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/61U53pEqNwL._AC_UY218_.jpg",
        "asin": "B0DPX6M4L5",
        "affiliate": "https://www.amazon.in/dp/B0DPX6M4L5/?tag=mydeals03c-21",
        "category": "Electronics"
    },
    {
        "title": "OnePlus Nord Buds 3r TWS Earbuds up to 54 Hours Playback, 2-mic Clear Calls, 3D Spatial Audio, AI Translation, 12.4mm Drivers, Dual-Device Connectivity, 47ms Low Latency - Ash Black",
        "price": "₹1,999",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/51nBTTG3hNL._AC_UY218_.jpg",
        "asin": "B0FMDL81GS",
        "affiliate": "https://www.amazon.in/dp/B0FMDL81GS/?tag=mydeals03c-21",
        "category": "Electronics"
    },
    {
        "title": "GLUN® Electronic Portable Digital LED Screen Luggage Weighing Scale, 50 kg/110 Lb For Multi-Purpose Use.",
        "price": "₹255",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/61Z35SZs7lL._AC_UY218_.jpg",
        "asin": "B07PK41FL4",
        "affiliate": "https://www.amazon.in/dp/B07PK41FL4/?tag=mydeals03c-21",
        "category": "Electronics"
    },
    {
        "title": "AGARO Elite Rechargeable Mini Electric Chopper, Food Grade Bowl, Stainless Steel Blades, Rechargeable, One Touch Operation, for Chopping Garlic, Ginger, Onion, Vegetable, Nuts, 250 Ml, Black",
        "price": "₹599",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/71JxqRoEC9L._AC_UY218_.jpg",
        "asin": "B0C897PVVM",
        "affiliate": "https://www.amazon.in/dp/B0C897PVVM/?tag=mydeals03c-21",
        "category": "Electronics"
    },
    {
        "title": "Electrobot Starter Kit (70 ITEMS) 20+ DIY Projects with Electronics Components Breadboard, LEDs, Resistors, Switches etc",
        "price": "₹270",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/71uNKkKiTDL._AC_UY218_.jpg",
        "asin": "B0CX5HY9N1",
        "affiliate": "https://www.amazon.in/dp/B0CX5HY9N1/?tag=mydeals03c-21",
        "category": "Electronics"
    },
    {
        "title": "Portronics Trifusion 16W HD Sound Bluetooth Speaker with 15W Wireless Charging, 360°RGB LED Lights, Digital Clock with Alarm Setting, Built-in White Noise, USB/SD Card/AUX in, Type C Charging(Black)",
        "price": "₹1,699",
        "rating": "3.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/71KVLuFXPIL._AC_UY218_.jpg",
        "asin": "B0DJ33F2JQ",
        "affiliate": "https://www.amazon.in/dp/B0DJ33F2JQ/?tag=mydeals03c-21",
        "category": "Electronics"
    },
    {
        "title": "Portronics Tornado, Mini Handheld High Speed Air Duster, Rechargeable Type-C, for Cleaning Computers, Cars, Backyard and Home Appliances, Cordless & Compact, Adjustable Speed, Up to 130000 RPM (Black)",
        "price": "₹2,399",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/61+N9FyfSzL._AC_UY218_.jpg",
        "asin": "B0F9LKX5XG",
        "affiliate": "https://www.amazon.in/dp/B0F9LKX5XG/?tag=mydeals03c-21",
        "category": "Electronics"
    },
    {
        "title": "Butterfly EduFields 5in1 STEM Robotics kit | Robotics Kits for Kids Ages 8 9 10 11 12 Years Old Boys Girls | Electronics Sensor Toy Modules | No Coding Required | Birthday Gift for Kids Ages 8+",
        "price": "₹998",
        "rating": "3.7 out of 5",
        "image": "https://m.media-amazon.com/images/I/816zf6oGygL._AC_UL640_QL65_.jpg",
        "asin": "B0FKB51BPR",
        "affiliate": "https://www.amazon.in/dp/B0FKB51BPR/?tag=mydeals03c-21",
        "category": "Electronics"
    },
    {
        "title": "Shocknshop Digital Sports Stylish Multifunctional Electronic LED Black Dial Wrist Watch for Men Boys -WCH78",
        "price": "₹499",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/71CxgCKczdL._AC_UY218_.jpg",
        "asin": "B0BW3RBC3K",
        "affiliate": "https://www.amazon.in/dp/B0BW3RBC3K/?tag=mydeals03c-21",
        "category": "Electronics"
    },
    {
        "title": "Portronics Ruffpad 15 Re-Writable LCD Screen 38.1cm (15-inch) Writing Pad for Drawing, Playing, Handwriting Gifts for Kids & Adults",
        "price": "₹1,166",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/61Wf0pRWiRL._AC_UY218_.jpg",
        "asin": "B08XNL93PL",
        "affiliate": "https://www.amazon.in/dp/B08XNL93PL/?tag=mydeals03c-21",
        "category": "Electronics"
    },
    {
        "title": "THEMISTO - built with passion Themisto Beginners 8 In 1 Corded_electric Soldering Iron Kit",
        "price": "₹299",
        "rating": "3.7 out of 5",
        "image": "https://m.media-amazon.com/images/I/61rO8eQB4ZL._AC_UY218_.jpg",
        "asin": "B07PM6134P",
        "affiliate": "https://www.amazon.in/dp/B07PM6134P/?tag=mydeals03c-21",
        "category": "Electronics"
    },
    {
        "title": "Sounce Shutter Remote Control with Bluetooth Wireless Technology - Create Amazing Photos and Videos Hands-Free - Works with Most Smartphones and Tablets (iOS and Android) (Black)",
        "price": "₹169",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/51x9HSFrFrL._AC_UY218_.jpg",
        "asin": "B0922XL7SH",
        "affiliate": "https://www.amazon.in/dp/B0922XL7SH/?tag=mydeals03c-21",
        "category": "Electronics"
    },
    {
        "title": "LED Digital Display Keychain Watch, Plastic, Small, Unisex Sports Style, Square Electronic Clock with Keyring, Portable Digital Timepiece for Kids and Students Multicolor",
        "price": "₹169",
        "rating": "3.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/41DAHwiBsmL._AC_UY218_.jpg",
        "asin": "B0FZBCH9BS",
        "affiliate": "https://www.amazon.in/dp/B0FZBCH9BS/?tag=mydeals03c-21",
        "category": "Electronics"
    },
    {
        "title": "Practical Electronics for Inventors",
        "price": "₹3,574",
        "rating": "4.7 out of 5",
        "image": "https://m.media-amazon.com/images/I/61JtUKEfXQL._AC_UY218_.jpg",
        "asin": "1259587541",
        "affiliate": "https://www.amazon.in/dp/1259587541/?tag=mydeals03c-21",
        "category": "Electronics"
    },
    {
        "title": "GoTrippin by Destinio Weight Machine for Luggage - 50 kg capacity, Steel body, Lifetime replacement - Digital Portable Electronic Luggage Weighing Scale for home, travel, flights, bags (Silver, 50 kg)",
        "price": "₹610",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/71M6MiefSYL._AC_UY218_.jpg",
        "asin": "B07Q822CWX",
        "affiliate": "https://www.amazon.in/dp/B07Q822CWX/?tag=mydeals03c-21",
        "category": "Electronics"
    },
    
    {
        "title": "ATOM ALISTON K1 Series Digital Kitchen Weighing Scale 10 kg, Electronic Weight Machine with LCD Display for Baking, Cooking, Food & Diet, SF-400/A121. 6Months Warranty (Colour May Vary)",
        "price": "₹249",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/71775fRr+gL._AC_UL320_.jpg",
        "asin": "B083C6XMKQ",
        "affiliate": "https://www.amazon.in/dp/B083C6XMKQ/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Pigeon Polypropylene Mini Handy and Compact Chopper with 3 Blades for Effortlessly Chopping Vegetables and Fruits for Your Kitchen (12420, Green, 400 ml)",
        "price": "₹183",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/51RXzjrUmkL._AC_UL320_.jpg",
        "asin": "B01LWYDEQ7",
        "affiliate": "https://www.amazon.in/dp/B01LWYDEQ7/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Btag SF-400 Digital Kitchen Weighing Scale | 10Kg x 1g Precision | 1 year (6+6 months) warranty | Food Scale with LCD Display for Cooking, Baking, Meal Prep & Healthy Diet | (White)",
        "price": "₹202",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/51WMzZq09cL._AC_UL320_.jpg",
        "asin": "B0D8Y9FNF3",
        "affiliate": "https://www.amazon.in/dp/B0D8Y9FNF3/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Ganesh Stainless Steel Handy Plus Peeler Kitchen Tool for Home & Professional Use",
        "price": "₹53",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/51Qa1dFkFwL._AC_UL320_.jpg",
        "asin": "B0C818TWXW",
        "affiliate": "https://www.amazon.in/dp/B0C818TWXW/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "GANESH Stainless Steel Potato Crusher Vegetable Smasher Pav Bhaji Masher with Handle for Effortless Kitchen Uses (Pack of 1, Assorted)",
        "price": "₹91",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/31R+zHQ1K8L._AC_UL320_.jpg",
        "asin": "B0BRSXGY2J",
        "affiliate": "https://www.amazon.in/dp/B0BRSXGY2J/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "ZUDELLA Professional Kitchen Knife Set, 3-Piece Black Chef Knives with Ergonomic Handles Sharp Manual Sharpening for Home Kitchen & Restaurant (Black)",
        "price": "₹194",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/61ZTQhUobxL._AC_UL320_.jpg",
        "asin": "B0GQC4D2LZ",
        "affiliate": "https://www.amazon.in/dp/B0GQC4D2LZ/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Gala Sponge Wipe for Kitchen 5 Pcs Pack (Multipurpose) (148995)",
        "price": "₹281",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/31Ip4aURUpL.png",
        "asin": "B00M6P68NU",
        "affiliate": "https://www.amazon.in/dp/B00M6P68NU/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Leawall 3-in-1 Soap Dispenser with Sponge Holder – Bathroom Liquid Soap Pump for Kitchen Sink handwash Dispenser Bottle soap Dispenser for wash Basin Kitchen Accessories Items for Home (Multicolor)",
        "price": "₹169",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/51DS8h5RqhL._AC_UL320_.jpg",
        "asin": "B0F99V85S7",
        "affiliate": "https://www.amazon.in/dp/B0F99V85S7/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Beco Reusable Kitchen Towel Roll-2000 Times Washable|Soft & Highly Absorbent|Better Alternative to Dishcloth, Kitchen Tissue Paper Roll/Paper Towel|Eco Bamboo Wipes for Home Cleaning|20 Sheets",
        "price": "₹251",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/614AH2GZ6zL._AC_UL320_.jpg",
        "asin": "B07PJQX981",
        "affiliate": "https://www.amazon.in/dp/B07PJQX981/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Clazkit Food Strainer Colander, Fruit Basket, Pasta Strainer, Vegetable Strainer, Kitchen Sieve, Washing Bowl, Unbreakable, (Color May Vary), Plastic - 11.3 x 18 x 24.1 Centimeters",
        "price": "₹80",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/41Oinc187fL._AC_UL320_.jpg",
        "asin": "B0C7VCGG2K",
        "affiliate": "https://www.amazon.in/dp/B0C7VCGG2K/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Kettlekane 200ml Glass Olive Oil Dispenser Bottle with Silicone Brush for Cooking Vinegar Sauce BBQ Grill Frying Baking, Air Fryer (Pack of 1) (Multi Color)",
        "price": "₹263",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/71BKua7oNtL._AC_UL640_QL65_.jpg",
        "asin": "B0DB99G49T",
        "affiliate": "https://www.amazon.in/dp/B0DB99G49T/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Scotch-Brite Small wiper for Kitchen, Bathroom, Dinning tables, car windows wiping, instant dry surface, Superior TPE Blade, moulded handle",
        "price": "₹155",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/31Ip4aURUpL.png",
        "asin": "B07DWKC8TB",
        "affiliate": "https://www.amazon.in/dp/B07DWKC8TB/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "SOFTSPUN Microfiber Cleaning Cloths, 12pcs 30x30cms 220 GSM Multi-Colour! Highly Absorbent Lint and Streak Free Multi -Purpose Wash Cloth for Kitchen Window Stainless Steel Silverware.",
        "price": "₹262",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/91tyVf3xovL._AC_UL320_.jpg",
        "asin": "B0CXM5DT52",
        "affiliate": "https://www.amazon.in/dp/B0CXM5DT52/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "MILTON Divine Jr. Inner Stainless Steel Serving Casserole Gift Set of 3 (430 ml, 830 ml, 1400 ml), PU Insulated Kitchen Hot Pot, Keeps Food hot & Fresh for Roti, Biryani, Orange",
        "price": "₹719",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/71ZKcnCACML._AC_UL320_.jpg",
        "asin": "B08BLRY3ZJ",
        "affiliate": "https://www.amazon.in/dp/B08BLRY3ZJ/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Hit Anti Roach Gel - Cockroach Killer (20G) | Kitchen Safe | Odourless | Fast And Convenient, Pack Of 1",
        "price": "₹199",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/71hhQA1kthL._AC_UL320_.jpg",
        "asin": "B00YUNKKP8",
        "affiliate": "https://www.amazon.in/dp/B00YUNKKP8/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Ezee Live Life Ezee Way Black Garbage Bags for Dustbin|90 Pcs|Medium 19 X 21 Inches|30 Pcs X Pack of 3, 3 count",
        "price": "₹159",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/71erHCKJ3WL._AC_UL320_.jpg",
        "asin": "B06VX8YR6Q",
        "affiliate": "https://www.amazon.in/dp/B06VX8YR6Q/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Happi Planet Magic Eraser | Pack of 4 | No Scratch Multi-Surface Cleaning Sponge | Removes 100+ Tough Stains | Just Add Water | Walls, Kitchen, Bathroom, Shoes & Switch Boards",
        "price": "₹229",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/51CEc354bZL._AC_UL320_.jpg",
        "asin": "B0GPN9R146",
        "affiliate": "https://www.amazon.in/dp/B0GPN9R146/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "HomeWiz plastic Oil Dispenser 1 Litre | Pack of 2 | Transparent, Leak-Proof, BPA-Free Oil Container for Cooking Oils & Vinegar | Kitchen accessories items for home | 2000ml |",
        "price": "₹169",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/61-g1HhY5dL._AC_UL320_.jpg",
        "asin": "B0DKXH2V53",
        "affiliate": "https://www.amazon.in/dp/B0DKXH2V53/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Fridge Storage Containers for Vegetables – 1200 ml (Pack of 6) | Refrigerator Organiser Boxes | Freezer Safe, BPA Free Plastic Fridge Containers | Kitchen Storage Box for Vegetables & Fruits",
        "price": "₹278",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/61SHt9PVEML._AC_UL320_.jpg",
        "asin": "B0DZT3QQ59",
        "affiliate": "https://www.amazon.in/dp/B0DZT3QQ59/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Pigeon by Stovekraft Shears Kitchen Knifes 6 Piece Set with Wooden Block",
        "price": "₹399",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/51BgScyg2qL._AC_UL320_.jpg",
        "asin": "B088HBW6KV",
        "affiliate": "https://www.amazon.in/dp/B088HBW6KV/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Xmart India Chopper for Kitchen Use, 900ml Push Chopper with 5 Blades, Vegetable Cutter Kitchen Accessories Items for Home Cutting Vegetables, Onion, Ginger, Garlic, Salad, Tomato, Potato (Pista)",
        "price": "₹279",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/71lMeNgPvfL._AC_UL320_.jpg",
        "asin": "B0G821YMW4",
        "affiliate": "https://www.amazon.in/dp/B0G821YMW4/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "THE SR BRAND Plastic Fridge Storage Boxes Freezer Storage Containers, Container For Kitchen Storage Set, Storage In Kitchen, Vegetable Storage,Refrigerator Food Box(6 Grid Box(Pack Of 1)),Multicolor",
        "price": "₹193",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/51lILbTu8nL._AC_UL320_.jpg",
        "asin": "B0D7Q91MSZ",
        "affiliate": "https://www.amazon.in/dp/B0D7Q91MSZ/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Go Store 2 in 1 Stainless Steel Julienne Vegetable Peeler Multi-Functional Fruit & Veggie Shredder Slicer and Grater for Potatoes, Carrots, Cucumbers (Silver, 18 x 8.2 x 2.3 cm)",
        "price": "₹279",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/717nGHcgNPL._AC_UL320_.jpg",
        "asin": "B0DY51ZQTN",
        "affiliate": "https://www.amazon.in/dp/B0DY51ZQTN/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "VOLTURI Air Tight Containers for Kitchen Storage (Pack of 6, 1200 ML), Kitchen Storage Box, Airtight Container Set, Fridge Storage Containers for Pulses, Cereals, Grains, Fruits, Vegetables",
        "price": "₹599",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/91TMD0-NUWL._AC_UL320_.jpg",
        "asin": "B0DK9NLF75",
        "affiliate": "https://www.amazon.in/dp/B0DK9NLF75/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "ShineXPro Microfiber Cleaning Cloth Roll, 20Pcs, 4000 Times Washable - 10X Cheaper Than Paper Kitchen Towel Roll - Ultra Absorbent Lint Free Microfiber Cleaning Cloth for Kitchen - Tearable, Reusable",
        "price": "₹299",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/81AmuAwEVVL._AC_UL320_.jpg",
        "asin": "B0FS1VB862",
        "affiliate": "https://www.amazon.in/dp/B0FS1VB862/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "UCRAVO Reusable Kitchen Towel Roll microfiber cleaning cloth - 2000 Times Washable | Soft & Highly Absorbent| Alternative to Dishcloth Kitchen Tissue Paper Roll | 20 Sheets for Home Glass Cleaning",
        "price": "₹199",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/71ptWwJCB9L._AC_UL320_.jpg",
        "asin": "B0GCDGTYV4",
        "affiliate": "https://www.amazon.in/dp/B0GCDGTYV4/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "AERYS Digital Alarm Clock with Automatic Sensor, Date and Temperature Display, Compact Desk Table Clock for Students, Home, Office, Bedroom, Living Room,Home Decor, Corporate Use (Black Digital)",
        "price": "₹299",
        "rating": "3.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/51MctYF8BiL._AC_UL320_.jpg",
        "asin": "B0CQH5N1DY",
        "affiliate": "https://www.amazon.in/dp/B0CQH5N1DY/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Amazon Brand - Presto! Garbage Bags | Medium | 180 Count | 30 Bags X 6 Rolls | 19 X 21 Inches | For Dry & Wet Waste | Black",
        "price": "₹355",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/61fn1xtHO4L._AC_UL320_.jpg",
        "asin": "B0821PN8L4",
        "affiliate": "https://www.amazon.in/dp/B0821PN8L4/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "JIALTO Adhesive Hooks, Heavy Duty 5 kg Wall Hooks, Nail-Free Reusable Stainless Steel Sticky Hangers for Multipurpose Kitchen, Bathroom & Home (10 Pcs)",
        "price": "₹149",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/61eTBX8egPL._AC_UL320_.jpg",
        "asin": "B09WDQTDHK",
        "affiliate": "https://www.amazon.in/dp/B09WDQTDHK/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Kuber Industries Plastic Pedal Dustbin With Handle For Home, Kitchen, Office, Bathroom, 7 Litre (Brown)-47KM0750",
        "price": "₹196",
        "rating": "3.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/61Jn6jYySJL._AC_UL320_.jpg",
        "asin": "B09NGVX72K",
        "affiliate": "https://www.amazon.in/dp/B09NGVX72K/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Herrlich Homes Premium 304 Stainless Steel Rectangle Chopping Board for Kitchen | 36 x 25 cm | with 2 Steel Straw & Anti-Skid Silicon Pad | for Cutting Vegetables, Fruits, Meat | Reversible | Large",
        "price": "₹587",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/61kJcwhWJrL._AC_UL320_.jpg",
        "asin": "B0DK5QSTHC",
        "affiliate": "https://www.amazon.in/dp/B0DK5QSTHC/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Seznik Sealing Machine for Food Packets - Portable Handheld Sealing for Food Packets, Snacks, Chips, Fresh Storage - Mini Sealing Machine, 1 YEAR Warranty (White)",
        "price": "₹332",
        "rating": "3.7 out of 5",
        "image": "https://m.media-amazon.com/images/I/61Ug9kTwzoL._AC_UL320_.jpg",
        "asin": "B0CZ23FJJT",
        "affiliate": "https://www.amazon.in/dp/B0CZ23FJJT/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "ESPERO Multi Purpose Made In Japan Kitchen Scissors, food scissors,Premium Stainless Steel Solid Kitchen Shears for Meat, Seafood, Chicken, Vegetables, Herbs, BBQ, Bottle Opener (Black)",
        "price": "₹192",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/61ixZ7o1lRL._AC_UL320_.jpg",
        "asin": "B0DWJYPYYF",
        "affiliate": "https://www.amazon.in/dp/B0DWJYPYYF/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "HOME SKILL®Kitchen Knife Set Stainless Steel 3 Pieces Professional Meat Knife Chef Knife with Non-Slip Ergonomic Handle Sharp Manual Sharpening for Home Kitchen High Carbon Knife Set (Black)",
        "price": "₹289",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/61zTbHaEe7L._AC_UL320_.jpg",
        "asin": "B0D8YJ6VFZ",
        "affiliate": "https://www.amazon.in/dp/B0D8YJ6VFZ/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Kitchen Organizer Rack Stainless Steel 2 Tier Kitchen Shelf Organizer for Countertop Storage Spice Stand Multipurpose Rack for Kitchen Storage Shelf Stand for Home and Office Use",
        "price": "₹299",
        "rating": "5.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/71BmnBrE19L._AC_UL320_.jpg",
        "asin": "B0GTFQFYRP",
        "affiliate": "https://www.amazon.in/dp/B0GTFQFYRP/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Egles Kitchen Dishcloths 12pcs 11x12 Inches Bulk Cotton Kitchen Dish Cloths Scrubbing Wash Cloths Sets (Mix Color)",
        "price": "₹299",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/81BtcaeJQCL._AC_UL320_.jpg",
        "asin": "B074PNXCS7",
        "affiliate": "https://www.amazon.in/dp/B074PNXCS7/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Godrej Cartini Personal Scissors, Silver;Black, 10.5 x 5.3 Centimeters",
        "price": "₹70",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/61K7E5WiKfL._AC_UL320_.jpg",
        "asin": "B08FMYYXZT",
        "affiliate": "https://www.amazon.in/dp/B08FMYYXZT/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Ella Garbage Bags Large 24x32 Inches | 60 Bags 4 Rolls | Leak Proof & Tear Resistant Trash Bags for Kitchen Home & Commercial Use | Dustbin Bags For Dry & Wet Waste With Free Check Duster Cloth -Black",
        "price": "₹187",
        "rating": "3.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/71k61z6eG1L._AC_UL320_.jpg",
        "asin": "B0CCSGYBCJ",
        "affiliate": "https://www.amazon.in/dp/B0CCSGYBCJ/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Stainless Steel Utensils Dish Rack/Multipurpose Rustproof Shelf/Storage Shelves/Stand For Home & Kitchen Cabinet, Cupboard & Pantry (Pack Of 2, Nhsp, Under Cabinet, Floating Shelves)",
        "price": "₹249",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/51V+Gns31SL._AC_UL320_.jpg",
        "asin": "B0CLVGZBSG",
        "affiliate": "https://www.amazon.in/dp/B0CLVGZBSG/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Vega General Scissor Set of 2 – Stainless Steel Blades Multipurpose Scissor for Home, Office, School, Sewing & Craft Use, Sharp Blades, Long-Lasting Sharpness, Comfortable Grip, (GCSS-01)",
        "price": "₹294",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/71aCeaqRRnL._AC_UL320_.jpg",
        "asin": "B00BOLGIRS",
        "affiliate": "https://www.amazon.in/dp/B00BOLGIRS/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "TEKCOOL Anti Fatigue Kitchen Rug Sets 2 Piece Non Slip Kitchen Mats for Floor Cushioned Kitchen Rugs & Mats Waterproof Comfort Standing Mat Runner for Kitchen,Home Office,Sink,Laundry(Line MAT) Rubber",
        "price": "₹459",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/61zk2PLVx3L._AC_UL320_.jpg",
        "asin": "B0DJP95C74",
        "affiliate": "https://www.amazon.in/dp/B0DJP95C74/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "VYOOX 2-in-1 Toilet Cleaning Brush with Wiper | Long Handle Floor&Bathroom Cleaning Brush | 180° Rotating Head | Multipurpose Home & Kitchen Cleaning Brush|Cleaning Accessories(Pack of 1)",
        "price": "₹300",
        "rating": "3.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/61PfQJSNmaL._AC_UL320_.jpg",
        "asin": "B0C74C6821",
        "affiliate": "https://www.amazon.in/dp/B0C74C6821/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Amazon Brand - Presto! Non-Woven Kitchen Towel Roll | 80 Pulls (Pack of 2) | Size: 23 x 21 cm | Wavy Pattern (Red & Blue) | Washable and Reusable | Highly Absorbent | For Daily Use",
        "price": "₹255",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/71wkziBQHvL._AC_UL320_.jpg",
        "asin": "B0DKF2N6RQ",
        "affiliate": "https://www.amazon.in/dp/B0DKF2N6RQ/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Chopper for Kitchen Use 1100 ML, Push Chopper with 5 Blades, Vegetable Chopper Kitchen Items for Home Cutting Vegetables, Onion, Ginger, Garlic, Salad, Tomato, Potato (Multicolour)",
        "price": "₹219",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/71AWOE2H8YL._AC_UL320_.jpg",
        "asin": "B0GWF81KHV",
        "affiliate": "https://www.amazon.in/dp/B0GWF81KHV/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Mumma's LIFE 5L Dustbin for Bathroom with Lid – Stainless Steel Silver Pedal Bin with Plastic Inner Bucket & Lid | Round Garbage Bin, Trash Can, Steel Dustbin for Home, Kitchen, Office – 7x11 inch",
        "price": "₹569",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/51c+dkd6yvL._AC_UL320_.jpg",
        "asin": "B0CDS6X1NK",
        "affiliate": "https://www.amazon.in/dp/B0CDS6X1NK/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Ganesh 14 in 1 Multipurpose Chopper, Fruits & Vegetable Cutters, Grater Peeler Chipser, Unbreakable Food Grade Body, Easy Push to Clean Button Slicer Dicer, Chopper for Kitchen (Green, Plastic)",
        "price": "₹639",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/71SSpHadzXL._AC_UL320_.jpg",
        "asin": "B01BVDS1BE",
        "affiliate": "https://www.amazon.in/dp/B01BVDS1BE/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "JIALTO 2 Pieces Stainless Steel Broom Holder with Hook - Wall-Mounted Adhesive Waterproof Rustproof Heavy Duty Broom and Mop Stick Holder for Home, Kitchen,",
        "price": "₹180",
        "rating": "3.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/71fulhRE-HL._AC_UL320_.jpg",
        "asin": "B0CMTX2SVY",
        "affiliate": "https://www.amazon.in/dp/B0CMTX2SVY/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "WonderStand Iron 2-Tier Countertop MultipurposeOrganizer|Tiered Shelf Storage Rack, Counter Top Organiser Storage Shelf For Home Kitchen And Bathroom",
        "price": "₹499",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/61uDpiEO7pL._AC_UL320_.jpg",
        "asin": "B0CYM12DPZ",
        "affiliate": "https://www.amazon.in/dp/B0CYM12DPZ/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Pixel Home Cotton Apron 100% Cotton Check Kitchen Apron with Front Center Pocket Best Design Apron",
        "price": "₹145",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/81Nv4V5pcHL._AC_UL320_.jpg",
        "asin": "B083H1WLNG",
        "affiliate": "https://www.amazon.in/dp/B083H1WLNG/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    
    {
        "title": "Samsung Galaxy S26 5G (White, 12GB RAM, 256GB Storage), AI Phone, Photo Assist, Creative Studio, 50MP Camera with ProVisual Engine, Powerful Customized Processor and 4300mAh Battery",
        "price": "₹79,999",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/61UYcLy4YVL._AC_UY218_.jpg",
        "asin": "B0GL88WCV8",
        "affiliate": "https://www.amazon.in/dp/B0GL88WCV8/?tag=mydeals03c-21",
        "category": "Mobiles"
    },
    {
        "title": "OnePlus 15 | 16GB+512GB | Sand Storm | India's First Snapdragon® 8 Elite Gen 5 | 7300mAh Battery | Personalised AI | Game-Changing 165Hz Display | Triple 50MP Camera with 4K 120fps Dolby Vision",
        "price": "₹85,999",
        "rating": "4.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/616kkUbRg4L._AC_UY218_.jpg",
        "asin": "B0FTR2PJTV",
        "affiliate": "https://www.amazon.in/dp/B0FTR2PJTV/?tag=mydeals03c-21",
        "category": "Mobiles"
    },
    {
        "title": "OnePlus 15R | 12GB+512GB | Charcoal Black | World's First Snapdragon® 8 Gen 5 | 7400mAh Battery | Personalised AI | Game-Changing 165Hz Display | IP68 IP69 IP66 & IP69K | 4K 120fps Video",
        "price": "₹59,999",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/61AsNTuJ6mL._AC_UY218_.jpg",
        "asin": "B0FZSXYV6K",
        "affiliate": "https://www.amazon.in/dp/B0FZSXYV6K/?tag=mydeals03c-21",
        "category": "Mobiles"
    },
    {
        "title": "Samsung Galaxy S25 Ultra 5G AI Smartphone (Titanium Silverblue, 12GB RAM, 512GB Storage), 200MP Camera, S Pen Included, Long Battery Life",
        "price": "₹1,29,999",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/71tz3adVWaL._AC_UY218_.jpg",
        "asin": "B0DSBTKP5Q",
        "affiliate": "https://www.amazon.in/dp/B0DSBTKP5Q/?tag=mydeals03c-21",
        "category": "Mobiles"
    },
    {
        "title": "iQOO 15R (Dark Knight, 12GB RAM, 512GB Storage) | Snapdragon® 8 Gen 5 Processor | India’s Slimmest Smartphone in 7600mAh Battery* | Segment's Most Stable 144FPS Gaming*",
        "price": "₹57,999",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/616mnp2HZ7L._AC_UY218_.jpg",
        "asin": "B0GL8FZP8Y",
        "affiliate": "https://www.amazon.in/dp/B0GL8FZP8Y/?tag=mydeals03c-21",
        "category": "Mobiles"
    },
    {
        "title": "OnePlus 13R | Smarter with OnePlus AI (12GB RAM, 256GB Storage Astral Trail)",
        "price": "₹41,999",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/61NOlG6S9CL._AC_UY218_.jpg",
        "asin": "B0DQ8S38R8",
        "affiliate": "https://www.amazon.in/dp/B0DQ8S38R8/?tag=mydeals03c-21",
        "category": "Mobiles"
    },
    {
        "title": "OnePlus 13 | Smarter with OnePlus AI | Lifetime Display Warranty |16GB RAM 512GB Storage Black Eclipse | Official Smartphone for BGMS 2025",
        "price": "₹64,999",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/71YZnH481OL._AC_UY218_.jpg",
        "asin": "B0DQ8W9CTT",
        "affiliate": "https://www.amazon.in/dp/B0DQ8W9CTT/?tag=mydeals03c-21",
        "category": "Mobiles"
    },
    {
        "title": "iQOO Neo 10 (Alpine White, 12GB RAM, 256GB Storage) | Segment's Fastest Processor* with Snapdragon 8s Gen 4 & Supercomputing chip Q1 | 120W FlashCharge | Segment's Brightest AMOLED Display*",
        "price": "₹42,999",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/610fFRcR-+L._AC_UY218_.jpg",
        "asin": "B0GXZ1NPHT",
        "affiliate": "https://www.amazon.in/dp/B0GXZ1NPHT/?tag=mydeals03c-21",
        "category": "Mobiles"
    },
    {
        "title": "iQOO 15R (Triumph Silver, 12GB RAM, 512GB Storage) | Snapdragon® 8 Gen 5 Processor | India’s Slimmest Smartphone in 7600mAh Battery* | Segment's Most Stable 144FPS Gaming*",
        "price": "₹57,999",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/61D48zQmROL._AC_UY218_.jpg",
        "asin": "B0GL8B68FP",
        "affiliate": "https://www.amazon.in/dp/B0GL8B68FP/?tag=mydeals03c-21",
        "category": "Mobiles"
    },
    {
        "title": "iPhone Charger Adapter 20W Type C (MFi-Certified) for iPhone 17/17 Air/17 Pro/17 Pro Max,16/16 Plus/Pro/Pro Max, 15/14/13/12/11 Series with PD 3.0 USB-C Fast Charging Adaptor BIS Certified",
        "price": "₹472",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/51EwFMH52wL._AC_UL640_QL65_.jpg",
        "asin": "B0D5YQWKYL",
        "affiliate": "https://www.amazon.in/dp/B0D5YQWKYL/?tag=mydeals03c-21",
        "category": "Mobiles"
    },
    {
        "title": "Samsung Galaxy S26 Ultra 5G (White, 12GB RAM, 512GB Storage) with Built-in Privacy Display, AI Phone, Photo Assist, Creative Studio, 200MP Camera, 5000mAh Battery and Snapdragon 8 Elite Gen 5",
        "price": "₹1,50,999",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/71X1rPizzVL._AC_UY218_.jpg",
        "asin": "B0GL8BNV58",
        "affiliate": "https://www.amazon.in/dp/B0GL8BNV58/?tag=mydeals03c-21",
        "category": "Mobiles"
    },
    {
        "title": "realme NARZO 80 Pro 5G (Speed Silver,8GB+256GB) | Segment's 1st MediaTek Dimensity 7400 Chipset | 6000mAh Titan Battery + 80W Ultra Charge | 4500nits HyperGlow Esports Display | IP69 Waterproof",
        "price": "₹21,999",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/71J+dpjrzhL._AC_UY218_.jpg",
        "asin": "B0F1D9LCK3",
        "affiliate": "https://www.amazon.in/dp/B0F1D9LCK3/?tag=mydeals03c-21",
        "category": "Mobiles"
    },
    {
        "title": "OnePlus Nord 6 | 8GB+256GB | Quick Silver | Snapdragon 8s Gen 4 | Segment's First Stable 165FPS Gaming | Segment's Largest 9000mAh Battery | Most Complete IP Rating | Personalized AI",
        "price": "₹41,999",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/61aAC4zDc9L._AC_UY218_.jpg",
        "asin": "B0GRB5C1HW",
        "affiliate": "https://www.amazon.in/dp/B0GRB5C1HW/?tag=mydeals03c-21",
        "category": "Mobiles"
    },
    {
        "title": "Samsung Galaxy S23 Ultra 5G AI Smartphone (Phantom Black, 12GB, 256GB Storage)",
        "price": "₹99,999",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/71goZuIha-L._AC_UY218_.jpg",
        "asin": "B0BT9FDZ8N",
        "affiliate": "https://www.amazon.in/dp/B0BT9FDZ8N/?tag=mydeals03c-21",
        "category": "Mobiles"
    },
    {
        "title": "XIAOMI 17 Ultra (Black, 16GB+512GB) |World's First Leica 1-Inch LOFIC Sensor |Snapdragon 8 Elite Gen 5 |2K AMOLED Display | 90W HyperCharge HyperOS 3 | HyperAI Flagship Experience",
        "price": "₹1,39,997",
        "rating": "4.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/71E+NLQFhgL._AC_UY218_.jpg",
        "asin": "B0GMQG7QM5",
        "affiliate": "https://www.amazon.in/dp/B0GMQG7QM5/?tag=mydeals03c-21",
        "category": "Mobiles"
    },
    {
        "title": "Samsung Galaxy S25 FE 5G Smartphone with Galaxy AI (JetBlack, 8GB RAM, 128GB Storage), 12MP Front Camera, ProVisual Engine, Long Battery Life",
        "price": "₹48,430",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/4143cMel2GL._AC_UY218_.jpg",
        "asin": "B0FNMQW9HW",
        "affiliate": "https://www.amazon.in/dp/B0FNMQW9HW/?tag=mydeals03c-21",
        "category": "Mobiles"
    },
    {
        "title": "OnePlus Nord CE6 Lite | 6GB+128GB | Hyper Black | Segment's Fastest Dimensity 7400 Apex Processor | 7000mAh Battery | Segment's Highest 144Hz Refresh Rate | 50MP Main Camera, 4K Video Recording",
        "price": "₹22,999",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/61T18EfkX0L._AC_UY218_.jpg",
        "asin": "B0GVYDLJJQ",
        "affiliate": "https://www.amazon.in/dp/B0GVYDLJJQ/?tag=mydeals03c-21",
        "category": "Mobiles"
    },
    {
        "title": "Verilux® USB Hub for Laptop with Ethernet RJ45 7 in 1 USB Type C Hub with 4K@60Hz HDMI for Nintendo Switch 2 SD/TF Card Reader PD Charge Multi USB 3.0 Port for MacBook iPhone 17 with 24CM Cable",
        "price": "₹1,546",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/61oMHXCdZ0L._AC_UL640_QL65_.jpg",
        "asin": "B09TDYMKJJ",
        "affiliate": "https://www.amazon.in/dp/B09TDYMKJJ/?tag=mydeals03c-21",
        "category": "Mobiles"
    },
    {
        "title": "Acer Aspire One, Intel Core Celeron N4500, Office 2024 + M365 Basic, 12GB LPDDR4X RAM/ 256GB SSD, 14.0\"/35.56cm TN HD Display, Win 11 Home, Pure Silver, 1.3KG, A114-45, Thin and Light Laptop",
        "price": "₹35,990",
        "rating": "3.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/71uoRYyilhL._AC_UY218_.jpg",
        "asin": "B0GW8KXZMF",
        "affiliate": "https://www.amazon.in/dp/B0GW8KXZMF/?tag=mydeals03c-21",
        "category": "Laptops"
    },
    {
        "title": "HP 15, 13th Gen Intel Core i3-1315U Laptop (8GB DDR4,512GB SSD) Anti-Glare, Micro-Edge,15.6''/39.6cm, FHD, Win11,M365 Basic(1yr),Office Home24, Silver,1.59kg, FHD Camera w/Privacy Shutter, fd0569TU",
        "price": "₹49,950",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/61R5Ecv7i-L._AC_UY218_.jpg",
        "asin": "B0F4R5W1NC",
        "affiliate": "https://www.amazon.in/dp/B0F4R5W1NC/?tag=mydeals03c-21",
        "category": "Laptops"
    },
    {
        "title": "ASUS Vivobook 15, Smartchoice,Intel Core i3 13th Gen 1315U, 12GB RAM, 512GB SSD, FHD 15.6\", Win 11, Office 2024, Quiet Blue, 1.7Kg, X1504VA-BQ332WS, Intel UHD iGPU, M365 Basic (1Year)*, 42Whrs Laptop",
        "price": "₹50,990",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/61JUHhbEMxL._AC_UY218_.jpg",
        "asin": "B0FKBM4SWJ",
        "affiliate": "https://www.amazon.in/dp/B0FKBM4SWJ/?tag=mydeals03c-21",
        "category": "Laptops"
    },
    {
        "title": "Apple 2026 MacBook Neo 13″ Laptop with A18 Pro chip: Built for AI and Apple Intelligence, Liquid Retina Display, 8GB Unified Memory, 256GB SSD Storage, 1080p FaceTime HD Camera; Indigo",
        "price": "₹65,900",
        "rating": "4.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/61vTx-Qa1QL._AC_UY218_.jpg",
        "asin": "B0GR64G4H6",
        "affiliate": "https://www.amazon.in/dp/B0GR64G4H6/?tag=mydeals03c-21",
        "category": "Laptops"
    },
    {
        "title": "ASUS TUF A15 (2025), AMD Ryzen 7 7445HS,RTX 3050-4GB,75W TGP,16GB DDR5(Upgradeable Upto 64GB) 512GB SSD,FHD,15.6\",144Hz,RGB Keyboard,Windows 11,Graphite Black,2.3 Kg FA506NCG-HN199W, Gaming Laptop",
        "price": "₹73,990",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/81nPkLHN3vL._AC_UY218_.jpg",
        "asin": "B0FM3C4L2F",
        "affiliate": "https://www.amazon.in/dp/B0FM3C4L2F/?tag=mydeals03c-21",
        "category": "Laptops"
    },
    {
        "title": "ASUS Vivobook 15, Smartchoice, AMD Ryzen 7 5825U, 16GB RAM, 512GB SSD, FHD 15.6\", Windows 11, Office Home 2024, Quiet Blue, 1.7Kg, M1502YA-BQ703WS, AMD Radeon iGPU, M365 Basic (1Year)*, 42Whr Laptop",
        "price": "₹54,990",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/71zMooVIVAL._AC_UY218_.jpg",
        "asin": "B0FC2LKFSC",
        "affiliate": "https://www.amazon.in/dp/B0FC2LKFSC/?tag=mydeals03c-21",
        "category": "Laptops"
    },
    {
        "title": "acer SmartChoice Aspire Lite, AMD Ryzen 5-5625U Processor, 16 GB/512 GB, Full HD, 15.6\"/39.62 cm, Windows 11 Home, Steel Gray, 1.59 kg, AL15-41, Metal Body, Thin and Light Laptop",
        "price": "₹45,990",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/718UBZxpxrL._AC_UY218_.jpg",
        "asin": "B0DG2GCTD7",
        "affiliate": "https://www.amazon.in/dp/B0DG2GCTD7/?tag=mydeals03c-21",
        "category": "Laptops"
    },
    {
        "title": "EBook 11.6\" HD Laptop | Best Student & Office Work Laptop | Celeron N4020 | 4GB DDR4 | 128GB eMMC + M.2 SSD Expandable Slot | Win 11 Home |31Wh Battery | UHD Graphics 600 | Black",
        "price": "₹11,990",
        "rating": "3.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/71F8TUSryhL._AC_UY218_.jpg",
        "asin": "B0G2MT8YVV",
        "affiliate": "https://www.amazon.in/dp/B0G2MT8YVV/?tag=mydeals03c-21",
        "category": "Laptops"
    },
    {
        "title": "Dell 15, Intel Core i3/Core 3 14th Gen-100U, 16GB DDR4, 512GB SSD, FHD IPS, 15.6\"/39.62cm, Windows 11, Microsoft Office Home 2024, Carbon Black, 1.63Kg, Thin & Light, Laptop Model NO - Dell 15 DCU5250",
        "price": "₹49,990",
        "rating": "3.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/71I4NoKj-oL._AC_UY218_.jpg",
        "asin": "B0FDWH5WTL",
        "affiliate": "https://www.amazon.in/dp/B0FDWH5WTL/?tag=mydeals03c-21",
        "category": "Laptops"
    },
    {
        "title": "Dell 15 (Previously Inspiron) Laptop, 14th Gen Intel Core i3/Core 3 100U Processor, 8GB DDR4, 512 SSD, 15.6\" FHD 120Hz IPS 250 nit Display, Win 11 + Office H&S 2024, Carbon Black, Thin & Light 1.63Kg",
        "price": "₹46,490",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/717WZ7WriwL._AC_UY218_.jpg",
        "asin": "B0BQJ68HHC",
        "affiliate": "https://www.amazon.in/dp/B0BQJ68HHC/?tag=mydeals03c-21",
        "category": "Laptops"
    },
    {
        "title": "HP Victus, AMD Ryzen 7 7445HS, 4GB RTX 2050, 16GB DDR5(Upgradable) 512GB SSD, FHD, 144Hz, 300 nits, IPS, 15.6''/39.6cm, Win11, M365* Office24, Mica Silver, 2.29kg, fb3123AX, Backlit, Gaming Laptop",
        "price": "₹66,990",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/71qIJPTTD3L._AC_UY218_.jpg",
        "asin": "B0G9239R5S",
        "affiliate": "https://www.amazon.in/dp/B0G9239R5S/?tag=mydeals03c-21",
        "category": "Laptops"
    },
    {
        "title": "𝗗𝗲𝗹𝗹Laptop Model 3420 | 𝗜𝗡𝗧𝗘𝗟i5 11th Gen Processor |8GB DDR4 RAM |256GB SSD |14\" FHD Display | Win10 | A+ Condition Laptop (Refab)",
        "price": "₹28,500",
        "rating": "",
        "image": "https://m.media-amazon.com/images/I/31q2-8TNSZL._AC_UY218_.jpg",
        "asin": "B0H25K3QFJ",
        "affiliate": "https://www.amazon.in/dp/B0H25K3QFJ/?tag=mydeals03c-21",
        "category": "Laptops"
    },
    {
        "title": "Lenovo V15 G4 AMD Ryzen 5 7520U 15.6 inch FHD Laptop, AMD Graphics, 16GB DDR5 5500Mhz Ram, 512GB SSD NVMe, Windows 11, Dolby Audio, Arctic Grey, 1 Year Onsite Brand Warranty",
        "price": "₹49,720",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/71aup0IO2ZL._AC_UY218_.jpg",
        "asin": "B0F29HNJL1",
        "affiliate": "https://www.amazon.in/dp/B0F29HNJL1/?tag=mydeals03c-21",
        "category": "Laptops"
    },
    {
        "title": "Price, product page",
        "price": "₹44,500",
        "rating": "",
        "image": "https://m.media-amazon.com/images/I/11hfR5Cq9GL._SS200_.png",
        "asin": "B09MM58Y7Q",
        "affiliate": "https://www.amazon.in/dp/B09MM58Y7Q/?tag=mydeals03c-21",
        "category": "Laptops"
    },
    {
        "title": "HP Victus, AMD Ryzen 7 7445HS, 4GB RTX 2050, 16GB DDR5(Upgradeable) 512GB SSD, FHD, 144Hz, 300 nits, IPS, 15.6'', Win11, M365* Office24, Blue, 2.29kg, fb3189ax /3122/ 23ax Backlit, Gaming Laptop",
        "price": "₹65,990",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/71EyWp8nvUL._AC_UY218_.jpg",
        "asin": "B0FQWH1TT3",
        "affiliate": "https://www.amazon.in/dp/B0FQWH1TT3/?tag=mydeals03c-21",
        "category": "Laptops"
    },
    {
        "title": "Lenovo V15 G4 AMD Athlon Silver 7120U Laptop 8GB LPDDR5 Ram, 512 GB SSD PCIe, Windows 11 Lifetime Validity,15.6\" FHD Screen, AMD Radeon 610M, Silver, 1 Year Brand Warranty",
        "price": "₹41,999",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/61AccNkmFFL._AC_UY218_.jpg",
        "asin": "B0CL7CMTXS",
        "affiliate": "https://www.amazon.in/dp/B0CL7CMTXS/?tag=mydeals03c-21",
        "category": "Laptops"
    },
    {
        "title": "TABLE MAGIC Multipurpose Laptop Table Mat Finish Top PP Steel Metal 52.5 * 40 * 73cm 6 Heights 3 Angles Adjustable Foldable (Alder, Modern Without footrest)",
        "price": "₹1,645",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/51EPQgaC3sL._AC_UL640_QL65_.jpg",
        "asin": "B07TZ5TKHH",
        "affiliate": "https://www.amazon.in/dp/B07TZ5TKHH/?tag=mydeals03c-21",
        "category": "Laptops"
    },
    {
        "title": "JioBook 11 with Lifetime Office | Android 4G Laptop Mediatek 8788 (JioOS) | Octa-core | 4GB RAM | 64 eMMC Storage | Thin and Light Laptop (11.6 inch, 990 Grams) | Dual Band WiFi + SIM | Blue",
        "price": "₹9,999",
        "rating": "2.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/61IDcxw27+L._AC_UY218_.jpg",
        "asin": "B0CKX9PY1H",
        "affiliate": "https://www.amazon.in/dp/B0CKX9PY1H/?tag=mydeals03c-21",
        "category": "Laptops"
    },
    {
        "title": "Lenovo Chromebook Intel Celeron N4500 (4GB RAM/64GB eMMC 5.1/11.6 Inch (29.46cm)/HD Display/2Wx2 Stereo Speakers/HD Camera/Chrome OS/Blue/1.21Kg), 82UY0014HA",
        "price": "₹21,990",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/61aQ9BYq89L._AC_UY218_.jpg",
        "asin": "B0F2TMZJ24",
        "affiliate": "https://www.amazon.in/dp/B0F2TMZJ24/?tag=mydeals03c-21",
        "category": "Laptops"
    },
    {
        "title": "Primebook 2 Neo (2026) | 6GB RAM, 128GB Storage (Upgradable Upto 512GB) | MediaTek Helio G99 | Android 15 (PrimeOS3.0) | in-Built AI | 11.6” Thin & Light Laptop | Type-C, USB, MicroSD Ports",
        "price": "₹19,990",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/713cu-sW3TL._AC_UY218_.jpg",
        "asin": "B0FDLB7BQZ",
        "affiliate": "https://www.amazon.in/dp/B0FDLB7BQZ/?tag=mydeals03c-21",
        "category": "Laptops"
    },
    {
        "title": "Ultimus Pentium Quad Core Laptop|Student & Office Work Laptop|Dual Storage SSD Expandable~1TB|1.2Kg|180° Hinge|Win 11 Home|8GB RAM 256GB|HDMI SD Card Slot | ‎Dual Speaker|Space Gray",
        "price": "₹17,990",
        "rating": "1.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/71XTn2IVpFL._AC_UY218_.jpg",
        "asin": "B0FL7BN8ZV",
        "affiliate": "https://www.amazon.in/dp/B0FL7BN8ZV/?tag=mydeals03c-21",
        "category": "Laptops"
    },
    {
        "title": "Primebook 2 Max (2026) | 8GB RAM, 256GB UFS Storage | 15.6-Inch Full HD IPS Display | 12hrs Battery | MediaTek Helio G99 | Android 15 (PrimeOS 3.0) | Backlit Keyboard | in-Built AI (Gray)",
        "price": "₹28,990",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/51JTBldTCXL._AC_UY218_.jpg",
        "asin": "B0FFMQB3KL",
        "affiliate": "https://www.amazon.in/dp/B0FFMQB3KL/?tag=mydeals03c-21",
        "category": "Laptops"
    },
    {
        "title": "Primebook 2 Pro (2026) | 8GB RAM, 128GB UFS Storage | 14.1-Inch FHD IPS Display | 14 Hours Battery | MediaTek Helio G99 | Android 15 (PrimeOS 3.0) | Backlit Keyboard | in-Built AI (Gray)",
        "price": "₹24,990",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/51CIIx6l+VL._AC_UY218_.jpg",
        "asin": "B0FFM8M9B5",
        "affiliate": "https://www.amazon.in/dp/B0FFM8M9B5/?tag=mydeals03c-21",
        "category": "Laptops"
    },
    {
        "title": "Thomson NEO 14.1 Inch IN-P14C Intel Celeron Dual Core N4020 Processor & Window 11 Home Notebook (4 GB RAM DDR4/ 128 GB SSD/Numeric Touch Pad/Thin & Light Weight/Silver)",
        "price": "₹12,990",
        "rating": "3.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/71IWq5rtazL._AC_UY218_.jpg",
        "asin": "B0DYVQYGP9",
        "affiliate": "https://www.amazon.in/dp/B0DYVQYGP9/?tag=mydeals03c-21",
        "category": "Laptops"
    },
    {
        "title": "Lenovo Idea Tab Smartchoice with Pen|Wi-Fi| 11 Inch, 2.5K Display, 500 Nits Brightness| 8GB RAM + 256GB ROM (Expandable Up to 2TB) |Mediatek Dimensity 6300|Android 15|4-Speakers with Dolby Atmos, Grey",
        "price": "₹24,999",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/811f0wwClAL._AC_UY218_.jpg",
        "asin": "B0FJG1V6RJ",
        "affiliate": "https://www.amazon.in/dp/B0FJG1V6RJ/?tag=mydeals03c-21",
        "category": "Laptops"
    },
    {
        "title": "ASUS Chromebook CX1405 (2026), Smartchoice,Intel N50 Processor, Intel UHD iGPU, 8GB RAM, 128GB SSD, FHD, 14\" (35.5 cm), Chrome OS, Pure Grey, 1.39 Kg, CX1405CTA-S60622, 42WHrs, Thin & Light Laptop",
        "price": "₹32,990",
        "rating": "3.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/616Jpqwdp3L._AC_UY218_.jpg",
        "asin": "B0GV15KBMK",
        "affiliate": "https://www.amazon.in/dp/B0GV15KBMK/?tag=mydeals03c-21",
        "category": "Laptops"
    },
    {
        "title": "acer Aspire 3, Intel Pentium N6000, 12GB LPDDR4X RAM, 512GB SSD, HD, 15.6\"/39.62cm, Windows 11 Home, Pure Silver, 1.5KG, A325-45, Thin and Light Laptop",
        "price": "₹39,990",
        "rating": "2.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/61CISrp2PzL._AC_UY218_.jpg",
        "asin": "B0GLXWY8ZX",
        "affiliate": "https://www.amazon.in/dp/B0GLXWY8ZX/?tag=mydeals03c-21",
        "category": "Laptops"
    },
    {
        "title": "AXL Laptop (Vayu Book) Newly Launched Thin & Light | 15.6 Inch HD Display (4GB/256GB SSD)",
        "price": "₹14,990",
        "rating": "2.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/51IQKUhwNeL._AC_UY218_.jpg",
        "asin": "B0F4K6RV7J",
        "affiliate": "https://www.amazon.in/dp/B0F4K6RV7J/?tag=mydeals03c-21",
        "category": "Laptops"
    },
    {
        "title": "ASUS Chromebook CX1405 (2026), Smartchoice,Intel N50 Processor, Intel UHD iGPU, 8GB RAM, 128GB SSD, FHD, 14\" (35.5 cm), Chrome OS, Pure Grey, 1.39 Kg, CX1405CTA-S60622, 42WHrs, Thin & Light Laptop",
        "price": "₹30,990",
        "rating": "2.7 out of 5",
        "image": "https://m.media-amazon.com/images/I/616Jpqwdp3L._AC_UY218_.jpg",
        "asin": "B0GN2Y3T6M",
        "affiliate": "https://www.amazon.in/dp/B0GN2Y3T6M/?tag=mydeals03c-21",
        "category": "Laptops"
    },
    {
        "title": "Acer Aspire One, Intel Core Celeron N4500, Office 2024 + M365 Basic, 12GB LPDDR4X RAM/ 256GB SSD, 14.0\"/35.56cm TN HD Display, Win 11 Home, Pure Silver, 1.3KG, A114-45, Thin and Light Laptop",
        "price": "₹35,990",
        "rating": "3.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/71uoRYyilhL._AC_UY218_.jpg",
        "asin": "B0GW8KXZMF",
        "affiliate": "https://www.amazon.in/dp/B0GW8KXZMF/?tag=mydeals03c-21",
        "category": "Laptops"
    },
    {
        "title": "Thomson NEO 14.1 Inch IN-P14C Intel Celeron Dual Core N4020 Processor & Window 11 Notebook (8 GB RAM DDR4/ 256 GB SSD/Numeric Touch Pad/1MP Webcam/Silver)",
        "price": "₹21,990",
        "rating": "2.7 out of 5",
        "image": "https://m.media-amazon.com/images/I/71IWq5rtazL._AC_UY218_.jpg",
        "asin": "B0DYVR777M",
        "affiliate": "https://www.amazon.in/dp/B0DYVR777M/?tag=mydeals03c-21",
        "category": "Laptops"
    },
    {
        "title": "PLIXIO Adjustable Laptop Stand with 360° Rotating Base Tabletop Ergonomic Foldable Portable Holder Compatible for MacBook, HP, Dell, Lenovo & All Other Notebook (Sliver) (A06)",
        "price": "₹3,957",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/61tqKNI0nTL._AC_UL640_QL65_.jpg",
        "asin": "B0CN2LGZ67",
        "affiliate": "https://www.amazon.in/dp/B0CN2LGZ67/?tag=mydeals03c-21",
        "category": "Laptops"
    },
    {
        "title": "pTron Bassbuds Astra in-Ear TWS Earbuds w/Stereo Sound, 34Hrs Playtime, Stereo Calls, Custom EQ, Mobile App, BTv5.3 Headphones, Touch Control, Voice Assistant, Type C Charging & IPX4 (Black)",
        "price": "₹597",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/51n+XKUSplL._AC_UY218_.jpg",
        "asin": "B0D78XSMSM",
        "affiliate": "https://www.amazon.in/dp/B0D78XSMSM/?tag=mydeals03c-21",
        "category": "Headphones"
    },
    {
        "title": "ZEBRONICS Thunder (2026 Upgrade) Wireless Headphones, BT v6.0, True 60 hrs Playback, 40mm Drivers, ENC, Gaming Mode, Dual Pairing, AUX & microSD, Rapid Charging, Call Function (Sea Green)",
        "price": "₹685",
        "rating": "3.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/61FpBOJiWHL._AC_UY218_.jpg",
        "asin": "B09B5CPV71",
        "affiliate": "https://www.amazon.in/dp/B09B5CPV71/?tag=mydeals03c-21",
        "category": "Headphones"
    },
    {
        "title": "pTron Studio Evo 70hrs Playtime Wireless Over Ear Headphones with HD Mic, Low-Latency Game/Movie/Music Modes, Punchy Bass, BT5.3, Dual Device Pairing, Voice Assistant & Type-C Fast Charging (Black)",
        "price": "₹799",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/51ZX74-s9DL._AC_UY218_.jpg",
        "asin": "B0DQ212KP4",
        "affiliate": "https://www.amazon.in/dp/B0DQ212KP4/?tag=mydeals03c-21",
        "category": "Headphones"
    },
    {
        "title": "Wireless Bluetooth Headphones with Deep Bass Sound, Foldable Design, Comfortable Cushioned Earpads, Built-in Mic for Music & Calls, Average Battery(1-3 Hours) Backup, Stylish Everyday Use",
        "price": "₹299",
        "rating": "2.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/71GYkqELJsL._AC_UY218_.jpg",
        "asin": "B0GXDP9V8C",
        "affiliate": "https://www.amazon.in/dp/B0GXDP9V8C/?tag=mydeals03c-21",
        "category": "Headphones"
    },
    {
        "title": "Original-Galaxy Wired In Ear Earphones For All Samsung Smartphones With Mic | Pure Bass Sound | One Button Multi-Functional Remote | Comfort Fit | 6 Months Warranty (White)",
        "price": "₹329",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/51fQJaiOO2L._AC_UY218_.jpg",
        "asin": "B0BLLH74WV",
        "affiliate": "https://www.amazon.in/dp/B0BLLH74WV/?tag=mydeals03c-21",
        "category": "Headphones"
    },
    {
        "title": "truke Newly Launched BTG 500 Over The Ear Gaming Headphone with 40mm Drivers, 10H of Playtime, Dual Pairing, Gaming Mode (50ms Latency) with RGB LEDs, TF Card with Volume Control, BT 5.4 (Sky Blue)",
        "price": "₹899",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/61zSmicfuzL._AC_UY218_.jpg",
        "asin": "B0D9YNNSJ3",
        "affiliate": "https://www.amazon.in/dp/B0D9YNNSJ3/?tag=mydeals03c-21",
        "category": "Headphones"
    },
    {
        "title": "Wireless Bluetooth Headphones, Over-Ear Sports Headset for All Phones, Best Sound and Comfort, Black",
        "price": "₹399",
        "rating": "",
        "image": "https://m.media-amazon.com/images/I/616QJdNWdiL._AC_UY218_.jpg",
        "asin": "B0GZBM5LJ5",
        "affiliate": "https://www.amazon.in/dp/B0GZBM5LJ5/?tag=mydeals03c-21",
        "category": "Headphones"
    },
    {
        "title": "pTron Tangent Rush w/ 50Hrs Playtime, Pristine Sound, Dual-Device Pairing, Bluetooth 5.4 Wireless in-Ear Earphones with Mic, Voice Assistant, Type-C Fast Charging & IPX5 Water Resistant (Forest Green)",
        "price": "₹498",
        "rating": "3.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/51QXIJUo+lL._AC_UY218_.jpg",
        "asin": "B0FZC8CKPG",
        "affiliate": "https://www.amazon.in/dp/B0FZC8CKPG/?tag=mydeals03c-21",
        "category": "Headphones"
    },
    {
        "title": "pTron Tangentbeat in Ear Bluetooth Wireless Headphones with Mic, Punchy Bass, 10mm Drivers, Clear Calls, Dual Pairing, Fast Charging, Magnetic Buds, Voice Assist & IPX4 Wireless Neckband (Dark Blue)",
        "price": "₹499",
        "rating": "3.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/51Bwb1NwUvL._AC_UY218_.jpg",
        "asin": "B091MC66JP",
        "affiliate": "https://www.amazon.in/dp/B091MC66JP/?tag=mydeals03c-21",
        "category": "Headphones"
    },
    {
        "title": "ZEBRONICS Duke (2026 Upgrade) Wireless Headphone, BT v5.3, Upto 60 hrs Playback, 40mm Drivers, Deep Bass, ENC, Gaming Mode, Dual Pairing, LED Lights, Media/Volume Control, Call Function (Black)",
        "price": "₹919",
        "rating": "3.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/61r-vi2d5HL._AC_UY218_.jpg",
        "asin": "B088FM4QG4",
        "affiliate": "https://www.amazon.in/dp/B088FM4QG4/?tag=mydeals03c-21",
        "category": "Headphones"
    },
    {
        "title": "pTron Bassbuds Rogue W/ 40Ms Low-Latency Gaming,Clear Calls,50Hrs Playtime,Pristine Sound,V5.3 Bluetooth in Ear Headphones,Snug-Fit,RGB Lights,Touch Control,Voice Assist,IPX5 Water Resistant(Blue)",
        "price": "₹698",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/51n2MpdXT+L._AC_UY218_.jpg",
        "asin": "B0F7LZC3ZD",
        "affiliate": "https://www.amazon.in/dp/B0F7LZC3ZD/?tag=mydeals03c-21",
        "category": "Headphones"
    },
    {
        "title": "Zebronics Zeb-Storm On Ear Wired Headphone with 3.5mm Jack, Built in Microphone for Calling, 1.5 Meter Cable, Soft Ear Cushion, Adjustable Headband, Foldable Ear Cups and Lightweight Design (Black)",
        "price": "₹499",
        "rating": "3.7 out of 5",
        "image": "https://m.media-amazon.com/images/I/61FrvQMXxJL._AC_UY218_.jpg",
        "asin": "B0B4G44RFS",
        "affiliate": "https://www.amazon.in/dp/B0B4G44RFS/?tag=mydeals03c-21",
        "category": "Headphones"
    },
    {
        "title": "Boat Rockerz 421, 60H Battery, Low Latency(40Ms), 40Mm Drivers, ENx Tech, Stream Ad Free Music via App Support, Bluetooth Headphones, Wireless Over Ear Headphone with Mic (Black Sabre)",
        "price": "₹1,499",
        "rating": "3.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/71bUXVCt5EL._AC_UY218_.jpg",
        "asin": "B0F7M3Q8DV",
        "affiliate": "https://www.amazon.in/dp/B0F7M3Q8DV/?tag=mydeals03c-21",
        "category": "Headphones"
    },
    {
        "title": "Boat Rockerz 411, 40Ms Low Latency, 40Hrs Battery, 40Mm Drivers, ENx Tech, Stream Ad Free Music via App Support, Bluetooth Headphones, Wireless Over Ear Headphone with Mic (Bold Blue)",
        "price": "₹1,499",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/61RbNdlNWIL._AC_UY218_.jpg",
        "asin": "B0FC2W8WJM",
        "affiliate": "https://www.amazon.in/dp/B0FC2W8WJM/?tag=mydeals03c-21",
        "category": "Headphones"
    },
    {
        "title": "P9 Wireless Bluetooth Headphones Over Ear | Foldable Design | Deep Bass Sound | Up to 20 Hours Battery | Built-in Mic | Comfortable Cushions | Budget Friendly Headset",
        "price": "₹439",
        "rating": "5.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/31qvUB5-6qL._AC_UY218_.jpg",
        "asin": "B0GYKPPCJY",
        "affiliate": "https://www.amazon.in/dp/B0GYKPPCJY/?tag=mydeals03c-21",
        "category": "Headphones"
    },
    {
        "title": "Noise Two Wireless On Ear Headphones with 50 Hours Playtime, Low Latency(up to 45ms), 4 Play Modes, Dual Pairing, BT v5.3 (Serene Blue)",
        "price": "₹1,499",
        "rating": "3.7 out of 5",
        "image": "https://m.media-amazon.com/images/I/517lSvEVVsL._AC_UY218_.jpg",
        "asin": "B0B1PXM75C",
        "affiliate": "https://www.amazon.in/dp/B0B1PXM75C/?tag=mydeals03c-21",
        "category": "Headphones"
    },
    {
        "title": "Fastrack Limitless Glide X 1.83\" Smart Watch with Ultra UV HD Display, SpO2, Heart Rate & Sleep Tracking, Bluetooth Calling, 100+ Sports Modes, 5-Day Battery, Smartwatch for Men & Women (Black)",
        "price": "₹1,299",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/71rNSvzQGlL._AC_UY218_.jpg",
        "asin": "B0D9629NJQ",
        "affiliate": "https://www.amazon.in/dp/B0D9629NJQ/?tag=mydeals03c-21",
        "category": "Smart Watches"
    },
    {
        "title": "Bouncefit M I D116 Fitness Band Smart Watch for Men, Women, Boys, Girls, Kids – Single Touch Interface, Water Resistant, Workout Modes, Quick Charge Sports Smartwatch – Black I",
        "price": "₹396",
        "rating": "3.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/61kjHG3wqrL._AC_UY218_.jpg",
        "asin": "B0D45BT2S2",
        "affiliate": "https://www.amazon.in/dp/B0D45BT2S2/?tag=mydeals03c-21",
        "category": "Smart Watches"
    },
    {
        "title": "Fire-Boltt Talk Round Smart Watch 1.39″ TFT Display with Bluetooth Calling, Dual Button, Voice Assistance, SPO₂ & Heart Rate Monitor, 120+ Sports Modes, Smartwatch for Men & Women - Green",
        "price": "₹1,099",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/718aQSkSKmL._AC_UY218_.jpg",
        "asin": "B0F2Z2TRK9",
        "affiliate": "https://www.amazon.in/dp/B0F2Z2TRK9/?tag=mydeals03c-21",
        "category": "Smart Watches"
    },
    {
        "title": "Bouncefit D20 Y68 Fitness Band Smart Watch for Men, Women, Boys, Girls, Kids – Single Touch Interface, Water Resistant, Workout Modes, Quick Charge Sports Smartwatch – Jet Black",
        "price": "₹396",
        "rating": "3.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/51VZN8HIAFL._AC_UY218_.jpg",
        "asin": "B0BSGXWTGP",
        "affiliate": "https://www.amazon.in/dp/B0BSGXWTGP/?tag=mydeals03c-21",
        "category": "Smart Watches"
    },
    {
        "title": "Fire-Boltt Ninja Call Pro Plus Bluetooth Calling Smart Watch, 1.83″ HD Display, AI Voice Assistant, 120+ Sports Modes, IP67 Waterproof, SpO2 & Heart Rate Monitor Smartwatch for Men & Women - Black",
        "price": "₹1,399",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/61rmkmqD5VL._AC_UY218_.jpg",
        "asin": "B0BF57RN3K",
        "affiliate": "https://www.amazon.in/dp/B0BF57RN3K/?tag=mydeals03c-21",
        "category": "Smart Watches"
    },
    {
        "title": "Noise Twist Round dial Smart Watch with Bluetooth Calling, 1.38\" TFT Display, up-to 7 Days Battery, 100+ Watch Faces, IP68, Heart Rate Monitor, Sleep Tracking (Jet Black)",
        "price": "₹1,599",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/61-vRq2ulOL._AC_UY218_.jpg",
        "asin": "B0BJ72WZQ7",
        "affiliate": "https://www.amazon.in/dp/B0BJ72WZQ7/?tag=mydeals03c-21",
        "category": "Smart Watches"
    },
    {
        "title": "Fire‑Boltt Rise Smart Watch 1.85″ HD Display with Bluetooth Calling, AI Voice Assistant, Rotating Crown, SpO2 & Heart Rate Monitor, 120+ Sports Modes,IP67 Waterproof Smart Watch for Men & Women - Grey",
        "price": "₹1,399",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/61GTQaNz14L._AC_UY218_.jpg",
        "asin": "B0D2K6JJNX",
        "affiliate": "https://www.amazon.in/dp/B0D2K6JJNX/?tag=mydeals03c-21",
        "category": "Smart Watches"
    },
    {
        "title": "T800 Ultra Smart Watch, Orange Ocean Band, Wireless Charging, 1.99 Inch Infinite Display Orange",
        "price": "₹439",
        "rating": "3.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/71iH1Vz0jKL._AC_UY218_.jpg",
        "asin": "B0GXCKY88C",
        "affiliate": "https://www.amazon.in/dp/B0GXCKY88C/?tag=mydeals03c-21",
        "category": "Smart Watches"
    },
    {
        "title": "Ultra Smartwatch with Bluetooth Calling, T800, Heart Rate Monitor, Orange Silicon Band, Square Display, Magnetic Fast Charging Cable",
        "price": "₹557",
        "rating": "",
        "image": "https://m.media-amazon.com/images/I/51ZVSi9CtvL._AC_UY218_.jpg",
        "asin": "B0GWCZ5614",
        "affiliate": "https://www.amazon.in/dp/B0GWCZ5614/?tag=mydeals03c-21",
        "category": "Smart Watches"
    },
    {
        "title": "OLEVS Men's Business Watch Gold Blue with Large Easy-Read Analog Quartz Date Display Luxury Stainless Steel Band Waterproof Luminous Hands",
        "price": "₹3,420",
        "rating": "3.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/61n666vFxWL._AC_UL640_QL65_.jpg",
        "asin": "B0DBZ6PY64",
        "affiliate": "https://www.amazon.in/dp/B0DBZ6PY64/?tag=mydeals03c-21",
        "category": "Smart Watches"
    },
    {
        "title": "Fire-Boltt Phoenix Pro Round Smart Watch 1.39″ HD Display with Bluetooth Calling, AI Voice Assistant, SpO2 & Heart Rate Monitor, 120+ Sports Modes, IP67 Waterproof Smartwatch for Men & Women - Brown",
        "price": "₹1,099",
        "rating": "3.7 out of 5",
        "image": "https://m.media-amazon.com/images/I/61Cx3vx0mLL._AC_UY218_.jpg",
        "asin": "B0DY7YPBJL",
        "affiliate": "https://www.amazon.in/dp/B0DY7YPBJL/?tag=mydeals03c-21",
        "category": "Smart Watches"
    },
    {
        "title": "Bouncefit M I D18 Round Fitness Band Smart Watch for Men, Women, Boys, Girls, Kids – Single Touch Interface, Water Resistant, Workout Modes, Quick Charge Sports Smartwatch – Black (GG)",
        "price": "₹399",
        "rating": "2.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/61Cwg96VKjL._AC_UY218_.jpg",
        "asin": "B0FJ76MNXR",
        "affiliate": "https://www.amazon.in/dp/B0FJ76MNXR/?tag=mydeals03c-21",
        "category": "Smart Watches"
    },
    {
        "title": "Fire-Boltt Ninja X Ring Smart Watch with 1.96” Large Display, Bluetooth Calling, Wireless Charging, AI Voice Assistant, 500+ Watch Faces, Health Suite, Smart Watch for Man & Woman – Pink S",
        "price": "₹1,099",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/61wT6-UtrlL._AC_UY218_.jpg",
        "asin": "B0G61F9SDY",
        "affiliate": "https://www.amazon.in/dp/B0G61F9SDY/?tag=mydeals03c-21",
        "category": "Smart Watches"
    },
    {
        "title": "Boat Wave Call 3 Smartwatch 1.83” HD Display with Animated Watch Faces; BT Calling, Functional Crown, Multiple Sports Modes, IP68, HR, SpO2 Monitor, Smart Watches for Men & Women (Metallic Black)",
        "price": "₹1,599",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/715bkDP5MML._AC_UY218_.jpg",
        "asin": "B0FLF35YV4",
        "affiliate": "https://www.amazon.in/dp/B0FLF35YV4/?tag=mydeals03c-21",
        "category": "Smart Watches"
    },
    {
        "title": "Samsung Galaxy Watch6 Classic (Smartchoice) (Black, 47mm) | Rotating Bezel | LTE | Monitor BP and ECG | Track Sleep and Health | Upto 40hrs Charge with Fast Charging | Galaxy Ecosystem | IP68",
        "price": "₹16,999",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/71sRBqqrOpL._AC_UY218_.jpg",
        "asin": "B0CCV8DBFH",
        "affiliate": "https://www.amazon.in/dp/B0CCV8DBFH/?tag=mydeals03c-21",
        "category": "Smart Watches"
    },
    {
        "title": "Boat Lunar Discovery w/ 1.39\" (3.5 cm) HD Display, Turn-by-Turn Navigation, DIY Watch Face Studio, Bluetooth Calling, Emergency SOS, QR Tray, Smart Watch for Men & Women(Active Black)",
        "price": "₹1,499",
        "rating": "3.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/71Iit7U1S+L._AC_UY218_.jpg",
        "asin": "B0DFYL4635",
        "affiliate": "https://www.amazon.in/dp/B0DFYL4635/?tag=mydeals03c-21",
        "category": "Smart Watches"
    },
    {
        "title": "Noise Pulse 2 Max 1.85\" Display, Bluetooth Calling Smart Watch, 10 Days Battery, 550 NITS Brightness, Smart DND, 100 Sports Modes, Smartwatch for Men and Women (Deep Wine)",
        "price": "₹1,499",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/610BF3kqBZL._AC_UY218_.jpg",
        "asin": "B0B6BPTFT5",
        "affiliate": "https://www.amazon.in/dp/B0B6BPTFT5/?tag=mydeals03c-21",
        "category": "Smart Watches"
    },
    {
        "title": "OLEVS Men's Business Watch Gold Blue with Large Easy-Read Analog Quartz Date Display Luxury Stainless Steel Band Waterproof Luminous Hands",
        "price": "₹3,420",
        "rating": "3.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/6137Q5gE6VL._AC_UL640_QL65_.jpg",
        "asin": "B0DBZ6VTB8",
        "affiliate": "https://www.amazon.in/dp/B0DBZ6VTB8/?tag=mydeals03c-21",
        "category": "Smart Watches"
    },
    
    {
        "title": "TWINZFIT Pushup Board, 15 in 1 Push Up Stand, Multi-Function Flex Board for Chest, Triceps, Shoulder, Back Muscles, Home Workout Gym Equipment, Multicolour",
        "price": "₹290",
        "rating": "3.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/71UFD+kyMfL._AC_UL320_.jpg",
        "asin": "B0DKJZX382",
        "affiliate": "https://www.amazon.in/dp/B0DKJZX382/?tag=mydeals03c-21",
        "category": "Fitness"
    },
    {
        "title": "Protoner PVC 3 in 1 convertible DM 4-40 Kg Dumbbells Set and Fitness Kit for Men and Women Whole Body Workout (20 kg (2 kg x 4, 3 kg x 4), 3 in 1 convertible)",
        "price": "₹849",
        "rating": "3.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/81yi8OiYIRL._AC_UL320_.jpg",
        "asin": "B0C55FP5TX",
        "affiliate": "https://www.amazon.in/dp/B0C55FP5TX/?tag=mydeals03c-21",
        "category": "Fitness"
    },
    {
        "title": "ALN® Portable Resistance Bands (11pcs) with Door Anchor, Foam Handles, Legs Ankle Straps for Resistance Training, Physical Therapy, Home Workouts For Men and Women Full body Exercise fitness Equipment",
        "price": "₹399",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/51760FwF-CL._AC_UL320_.jpg",
        "asin": "B0FQ464CL3",
        "affiliate": "https://www.amazon.in/dp/B0FQ464CL3/?tag=mydeals03c-21",
        "category": "Fitness"
    },
    {
        "title": "SILENCIO Sit-Up Bar With Foam Handle and Rubber Suction Seat Up Fitness Equipment Sit-ups and Push-ups Assistant Device For Weight Lose Gym Workout Abdominal Curl Exercise Work Out Trainer (Pack of 1)",
        "price": "₹422",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/61nX-qFqz7L._AC_UL320_.jpg",
        "asin": "B09CR1CVW7",
        "affiliate": "https://www.amazon.in/dp/B09CR1CVW7/?tag=mydeals03c-21",
        "category": "Fitness"
    },
    {
        "title": "Boldfit Skipping Rope for Men and Women Jumping Rope With Adjustable Height Speed Skipping Rope for Exercise, Gym, Sports Fitness Adjustable Jump Rope Black",
        "price": "₹143",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/71vlhBkVs3L._AC_UL320_.jpg",
        "asin": "B0BC47M9YL",
        "affiliate": "https://www.amazon.in/dp/B0BC47M9YL/?tag=mydeals03c-21",
        "category": "Fitness"
    },
    {
        "title": "Boldfit Forearm Strengthener Wrist Exercise Equipment Arm Strengthener Grip Strengthener Fitness Equipment Home Gym Equipment For Men & Gym Equipment For Women Grip Workout Forearm Wrist Grip, Black",
        "price": "₹349",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/61-XFKFYCbL._AC_UL320_.jpg",
        "asin": "B0BS3YY9ZQ",
        "affiliate": "https://www.amazon.in/dp/B0BS3YY9ZQ/?tag=mydeals03c-21",
        "category": "Fitness"
    },
    {
        "title": "Push Up Board: Versatile Push Up Stand for Chest Workout & Home Gym Exercise Pushup Stand, Ideal Home Gym Equipment for Strength Training and Fitness, Durable and Ergonomic",
        "price": "₹285",
        "rating": "3.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/71cjth7t1nL._AC_UL320_.jpg",
        "asin": "B0DTQXLXHD",
        "affiliate": "https://www.amazon.in/dp/B0DTQXLXHD/?tag=mydeals03c-21",
        "category": "Fitness"
    },
    {
        "title": "Lifelong PVC Hex Fixed Dumbbells Pack of 2 (1kg*2) Black Color for Home Gym Equipment Fitness Barbell|Gym Exercise|Home Workout, Gym | Weights for Men & Women (6 Months Warranty)",
        "price": "₹154",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/710SxepIfiL._AC_UL320_.jpg",
        "asin": "B09W5F6KGB",
        "affiliate": "https://www.amazon.in/dp/B09W5F6KGB/?tag=mydeals03c-21",
        "category": "Fitness"
    },
    {
        "title": "Boldfit Hand Gripper for Men & Women Hand Grip Strengthener for Forearm, Wrist & Finger Workout Fitness Equipment for Home & Gym Training",
        "price": "₹199",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/61sb10nOi-L._AC_UL320_.jpg",
        "asin": "B08G8R7TRM",
        "affiliate": "https://www.amazon.in/dp/B08G8R7TRM/?tag=mydeals03c-21",
        "category": "Fitness"
    },
    {
        "title": "Fitness Mantra® 12 Pairs Sports Ankle Cotton Socks | Free Size| Breathable| Daily Use| Multicolor| 12 Pairs|",
        "price": "₹198",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/81SEVBzTWhL._AC_UL320_.jpg",
        "asin": "B0CTQ4RSMB",
        "affiliate": "https://www.amazon.in/dp/B0CTQ4RSMB/?tag=mydeals03c-21",
        "category": "Fitness"
    },
    {
        "title": "Boldfit Skin Tummy Tucker Nude Colour Body Shaper, Supports in Body, Waist and HIPS in Workout, Training-Exercise Neoprene Being (Small-Medium) (28\"-32\") for Women and Men",
        "price": "₹379",
        "rating": "3.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/71C-47J0dSL._AC_UL640_QL65_.jpg",
        "asin": "B0B65LFJ6S",
        "affiliate": "https://www.amazon.in/dp/B0B65LFJ6S/?tag=mydeals03c-21",
        "category": "Fitness"
    },
    {
        "title": "Spike Tummy Trimmer Yoga Pedal Puller for Home Gym Exercise - Resistance Band for Abs, Legs, Arms, Full Body Workout (Men & Women)",
        "price": "₹1,499",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/61DTbNQQZjL._AC_UL320_.jpg",
        "asin": "B0CT8ST4BF",
        "affiliate": "https://www.amazon.in/dp/B0CT8ST4BF/?tag=mydeals03c-21",
        "category": "Fitness"
    },
    {
        "title": "PulseITStep 4-Tube Resistance Band Exercise Puller, Yoga Pedal Tension Rope, Home Fitness Equipment for Full Body Workout (Black-Purple)",
        "price": "₹399",
        "rating": "3.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/71VGfwYHDsL._AC_UL320_.jpg",
        "asin": "B0DTFBRXFD",
        "affiliate": "https://www.amazon.in/dp/B0DTFBRXFD/?tag=mydeals03c-21",
        "category": "Fitness"
    },
    {
        "title": "Fitkit by Cult FK7004 Premium Magnetic Spin Bike | 130kg Support | Stepless Resistance & 8kg Flywheel | LCD Display with Heart-Rate Tracking | Tablet Holder | Smooth & Silent Ride for Home Fitness",
        "price": "₹13,999",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/41fogv7RlzL._AC_UL320_.jpg",
        "asin": "B0G496T2BW",
        "affiliate": "https://www.amazon.in/dp/B0G496T2BW/?tag=mydeals03c-21",
        "category": "Fitness"
    },
    {
        "title": "Bodyband Abs Roller for Men & Women Stomach Abs Roller Wheel for Home Workout, Gym Ab Roller for Men Abs Workout Equipment for Abdominal Ab Roller Home Exercise Equipment With Knee Mat -Yellow Black",
        "price": "₹248",
        "rating": "3.7 out of 5",
        "image": "https://m.media-amazon.com/images/I/71Vt2Pgy4hL._AC_UL320_.jpg",
        "asin": "B0CR7G9V56",
        "affiliate": "https://www.amazon.in/dp/B0CR7G9V56/?tag=mydeals03c-21",
        "category": "Fitness"
    },
    {
        "title": "PRO365 Ultimate Home Workout Combo – 4-Piece Fitness Kit with Ab Roller, Push-Up Bars, Tummy Trimmer & Toning Tube",
        "price": "₹798",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/61IlTDvjDpL._AC_UL320_.jpg",
        "asin": "B0DJ3BDZP8",
        "affiliate": "https://www.amazon.in/dp/B0DJ3BDZP8/?tag=mydeals03c-21",
        "category": "Fitness"
    },
    {
        "title": "Lifelong Yoga Mat for Gym, Yoga & Home Workout | EVA Material 4mm Thick Anti-Slip Exercise & Fitness Mat with Carry Strap for Men & Women | Blue",
        "price": "₹349",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/611jmiOOWpL._AC_UL320_.jpg",
        "asin": "B0G12SRPB9",
        "affiliate": "https://www.amazon.in/dp/B0G12SRPB9/?tag=mydeals03c-21",
        "category": "Fitness"
    },
    {
        "title": "QUXIS Resistance Bands Set for Men and Women, Pack of 5 Different Levels Elastic Band for Home Gym Long Exercise Workout – Great Fitness Equipment for Training, Yoga – Free Carrying Bag",
        "price": "₹399",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/71eUwv9BxoL._AC_UL320_.jpg",
        "asin": "B0C17FWR59",
        "affiliate": "https://www.amazon.in/dp/B0C17FWR59/?tag=mydeals03c-21",
        "category": "Fitness"
    },
    {
        "title": "Pull Reducer Training Bands Natural Rubber 4 Tubes Body Pedal Exerciser Yoga Crossfit Exercise, Arm Exercise, Body Building Training Men and Women (Multicolor)",
        "price": "₹284",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/71OfIa7B4pL._AC_UL320_.jpg",
        "asin": "B0F6QJ55X5",
        "affiliate": "https://www.amazon.in/dp/B0F6QJ55X5/?tag=mydeals03c-21",
        "category": "Fitness"
    },
    {
        "title": "Slovic Dumbbell Set [5 Kg Each] | Home Gym Dumbbells for Daily Workout | Quality Fitness Equipment for Strength Training | Non-Slip Coated Handle | Perfect for Women & Men",
        "price": "₹499",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/81QeeKGrKeL._AC_UL320_.jpg",
        "asin": "B0FCCNHPYX",
        "affiliate": "https://www.amazon.in/dp/B0FCCNHPYX/?tag=mydeals03c-21",
        "category": "Fitness"
    },
    {
        "title": "RoarCraft Figure 8 Exercise Band Chest Stretcher with Comfortable Handles - Belt Elastic Rope Back Trainer Rubber Band - Shoulder and Neck Stretching, Home Fitness Equipment(1 pcs, Random Colour)",
        "price": "₹285",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/51+4Gf8NCiL._AC_UL320_.jpg",
        "asin": "B0DCBT17BW",
        "affiliate": "https://www.amazon.in/dp/B0DCBT17BW/?tag=mydeals03c-21",
        "category": "Fitness"
    },
    {
        "title": "De Jure Fitness Tummy Twister & Abs Trimmer | Exercise Roller & Waist Shaper for Men & Women | Non-Slip Home Workout Equipment for Weight Loss & Core Training - Black",
        "price": "₹399",
        "rating": "3.7 out of 5",
        "image": "https://m.media-amazon.com/images/I/51RVFSasXFL._AC_UL320_.jpg",
        "asin": "B0FTSSJT65",
        "affiliate": "https://www.amazon.in/dp/B0FTSSJT65/?tag=mydeals03c-21",
        "category": "Fitness"
    },
    {
        "title": "Kore K-Pvc 20Kg Combo 3 Leather Home Gym And Fitness Kit, Grey",
        "price": "₹1,449",
        "rating": "3.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/81XNzjmXi+L._AC_UL320_.jpg",
        "asin": "B01N0TFA7M",
        "affiliate": "https://www.amazon.in/dp/B01N0TFA7M/?tag=mydeals03c-21",
        "category": "Fitness"
    },
    {
        "title": "Huawei Band 10 Smartwatch with AI-Powered Fitness Monitoring, Pro-Level Sleep Analysis, Emotional Wellbeing Assistant,Streamlined Metallic Design,Fast Charging,iOS Android (Band 10, Strap Black)",
        "price": "₹3,799",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/41abF4vT-OL._AC_UL320_.jpg",
        "asin": "B0DWFQCY3V",
        "affiliate": "https://www.amazon.in/dp/B0DWFQCY3V/?tag=mydeals03c-21",
        "category": "Fitness"
    },
    {
        "title": "KPM India's No.1 Tummy Trimmer Double Spring Ab Exerciser with Foot Pedals & Anti-Slip Foam Handles, Full Body Home Workout Equipment for Abs, Arms, Legs & Core Fitness (Made in India)",
        "price": "₹598",
        "rating": "4.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/81+u4XEtYtL._AC_UL320_.jpg",
        "asin": "B0FPRGQNJN",
        "affiliate": "https://www.amazon.in/dp/B0FPRGQNJN/?tag=mydeals03c-21",
        "category": "Fitness"
    },
    {
        "title": "Garmin Vivosmart 5 with OLED Display, Health and Fitness Tracker,SPO2 and 24/7 Heart Rate, Battery Upto 7 Days, Advance Sleep Monitoring and Stress Tracking, 5ATM Water Rating - Black with Large Band",
        "price": "₹12,990",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/71sGEWFWkxL._AC_UL320_.jpg",
        "asin": "B09ZSNRX3B",
        "affiliate": "https://www.amazon.in/dp/B09ZSNRX3B/?tag=mydeals03c-21",
        "category": "Fitness"
    },
    {
        "title": "Lifelong Polypropylene Exercise Fitness Stepper for Exercise Aerobics Stepper | Max Weight 200kg",
        "price": "₹899",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/61WJSeHTvuL._AC_UL320_.jpg",
        "asin": "B089SNPGMS",
        "affiliate": "https://www.amazon.in/dp/B089SNPGMS/?tag=mydeals03c-21",
        "category": "Fitness"
    },
    {
        "title": "Cult Davie 7HP Peak, Max Weight: 150 Kg, Auto Incline with Massager Motorized Treadmill for Home Gym Fitness & 1 Year Warranty",
        "price": "₹65,749",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/61hL2r1EDGL._AC_UL320_.jpg",
        "asin": "B0CK1MHXSX",
        "affiliate": "https://www.amazon.in/dp/B0CK1MHXSX/?tag=mydeals03c-21",
        "category": "Fitness"
    },
    {
        "title": "5 PCS Resistance Bands, Resistance Loop Exercise Bands for Women and Men, Skin-Friendly Resistance Fitness Exercise Loop Bands with 5 Different Resistance Levels, Ideal for Home, Gym, Yoga, Training",
        "price": "₹146",
        "rating": "3.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/61f5jzNLNyL._AC_UL320_.jpg",
        "asin": "B0D74G34MZ",
        "affiliate": "https://www.amazon.in/dp/B0D74G34MZ/?tag=mydeals03c-21",
        "category": "Fitness"
    },
    {
        "title": "WHOOP One – 12-Month Membership – 5.0 Health and Fitness Wearable – 24/7 Activity Tracker with VO2 Max, Sleep Tracking, Personalized Coaching, Menstrual Cycle Insights – 14+ Days Battery Life",
        "price": "₹21,990",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/61ryxDMqRUL._AC_UL320_.jpg",
        "asin": "B0DY2VVZWZ",
        "affiliate": "https://www.amazon.in/dp/B0DY2VVZWZ/?tag=mydeals03c-21",
        "category": "Fitness"
    },
    {
        "title": "Boldfit Resistance Tube with Foam Handles, Door Anchor for Exercise & Stretching, Suitable in Home & Gym Workout for Men & Women-10kg-Red",
        "price": "₹175",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/71l0xZ29TfS._AC_UL320_.jpg",
        "asin": "B08NDNFGTP",
        "affiliate": "https://www.amazon.in/dp/B08NDNFGTP/?tag=mydeals03c-21",
        "category": "Fitness"
    },
    {
        "title": "FitBox Sports Adjustable Hand Grip (5kg - 60kg) Strengthener with Counter for Men & Women for Gym Workout Hand Exercise Equipment to Use in Home for Forearm Exercise (Black) Stainless Steel Spring",
        "price": "₹151",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/512egbgZqsL._AC_UL320_.jpg",
        "asin": "B0D8H1JBHQ",
        "affiliate": "https://www.amazon.in/dp/B0D8H1JBHQ/?tag=mydeals03c-21",
        "category": "Fitness"
    },
    {
        "title": "De Jure Fitness Adjustable Ankle & Wrist Weights Pair (0.5KG x 2) for Men & Women | Strength Training, Walking, Running, Workout, Yoga | Comfortable, Durable | Black – 1KG",
        "price": "₹189",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/61mHnWqM9QL._AC_UL320_.jpg",
        "asin": "B08P21B5C2",
        "affiliate": "https://www.amazon.in/dp/B08P21B5C2/?tag=mydeals03c-21",
        "category": "Fitness"
    },
    {
        "title": "GreenGrey Tension Rope 6 Tube Elastic Yoga Pedal Puller Fitness Equipment Abdomen Waist Stretching Slimming Tummy Trimmer Home Gym, Ab Exercise Belly Fat Exercise Equipment",
        "price": "₹649",
        "rating": "3.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/61sJ9oEdPrL._AC_UL320_.jpg",
        "asin": "B0DVH7T2JM",
        "affiliate": "https://www.amazon.in/dp/B0DVH7T2JM/?tag=mydeals03c-21",
        "category": "Fitness"
    },
    {
        "title": "Figure 8 Resistance Exercise Band with Comfortable Handles – Chest, Shoulder & Neck Stretching | Home Fitness Equipment for Yoga, Pilates, Physical Therapy & Gym – Men & Women (1)",
        "price": "₹285",
        "rating": "3.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/61GnolJ1KVL._AC_UL320_.jpg",
        "asin": "B0F5N12M49",
        "affiliate": "https://www.amazon.in/dp/B0F5N12M49/?tag=mydeals03c-21",
        "category": "Fitness"
    },
    {
        "title": "De Jure Fitness PVC Kettlebell 3kg for Men & Women, Strength & Cardio Training, Soft Grip, Crushed Concrete Filled, Full Body Workout Equipment for Home & Gym (Black)",
        "price": "₹230",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/61m39FaFGsL._AC_UL320_.jpg",
        "asin": "B09SG3X1SK",
        "affiliate": "https://www.amazon.in/dp/B09SG3X1SK/?tag=mydeals03c-21",
        "category": "Fitness"
    },
    {
        "title": "HASHTAG FITNESS Wall mount pull up bar, 3 in 1, dips station, home gym equipments, height increasing equipments for men,kids and women (Black)",
        "price": "₹2,326",
        "rating": "3.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/61HObZ65q9L._AC_UL320_.jpg",
        "asin": "B09RPYLL28",
        "affiliate": "https://www.amazon.in/dp/B09RPYLL28/?tag=mydeals03c-21",
        "category": "Fitness"
    },
    {
        "title": "Pebble Newly Launched Qore 2 Premium Metal Fitness Band | 45 Days Battery Life, Heart Rate, SpO2, HRV & Body Temp Monitor, Sleep Tracker, AI Health Analysis, Smart Notifications (Cosmic Black)",
        "price": "₹3,699",
        "rating": "3.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/71KDdMgGJ4L._AC_UL320_.jpg",
        "asin": "B0GG4W7N66",
        "affiliate": "https://www.amazon.in/dp/B0GG4W7N66/?tag=mydeals03c-21",
        "category": "Fitness"
    },
    {
        "title": "PRO365 6-in-1 Home Fitness Equipment Kit | Ab Roller Wheel, Resistance Band, Jump Rope, Push Up Bars, Hand Gripper & Chest Expander | Full Body Workout Set for Men & Women (Multicolour)",
        "price": "₹949",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/61c1aPQPG1L._AC_UL320_.jpg",
        "asin": "B0G64S38MD",
        "affiliate": "https://www.amazon.in/dp/B0G64S38MD/?tag=mydeals03c-21",
        "category": "Fitness"
    },
    {
        "title": "Floor Muscle Trainer Exerciser Bladder Control Device with 360 Rotating Baffle Hip Trainer Correction Thigh Master Muscle Fitness Equipment Pelvic Floor Exerciser Device Home Office Fitness",
        "price": "₹499",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/61fPjmur8KL._AC_UL320_.jpg",
        "asin": "B0F5X12PRG",
        "affiliate": "https://www.amazon.in/dp/B0F5X12PRG/?tag=mydeals03c-21",
        "category": "Fitness"
    },
    {
        "title": "Fitbit Inspire 3 Health & Fitness Tracker (Midnight Zen/Black) with 6-Month Premium Membership",
        "price": "₹8,998",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/61AeGQhwjxL._AC_UL320_.jpg",
        "asin": "B0B75RC9C3",
        "affiliate": "https://www.amazon.in/dp/B0B75RC9C3/?tag=mydeals03c-21",
        "category": "Fitness"
    },
    {
        "title": "Hydrobeast Hydrogen Water Bottle with LED Display | 8000+ PPB Generator | BPA-Free Tritan Gym Bottle | Energy Boost Antioxidant Rich Water Detox & Portable Fitness Bottle for Men Women -1500Ml",
        "price": "₹14,999",
        "rating": "5.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/51KPK7eedRL._AC_UL320_.jpg",
        "asin": "B0FH5Q9GN8",
        "affiliate": "https://www.amazon.in/dp/B0FH5Q9GN8/?tag=mydeals03c-21",
        "category": "Fitness"
    },
    {
        "title": "Cult Tummy Trimmer Ab Exerciser for Men & Women – Dual Spring Resistance Fitness Tool with Anti-Slip Handles & Foot Pedals – Compact Abdominal Core Workout Equipment for Home Gym & Outdoor Training",
        "price": "₹463",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/51APLWdbYnL._AC_UL320_.jpg",
        "asin": "B0FCYNSNRK",
        "affiliate": "https://www.amazon.in/dp/B0FCYNSNRK/?tag=mydeals03c-21",
        "category": "Fitness"
    },
    {
        "title": "Dr Trust USA 526 Legend BMI Weight Scale & Body Fat Analyzer with IOS/Android App Sync,14 Essential Composition Metrics Weighing Machine for Home Health Monitoring (Black)",
        "price": "₹779",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/71NTdqTLhlL._AC_UL320_.jpg",
        "asin": "B0D6NBHSY7",
        "affiliate": "https://www.amazon.in/dp/B0D6NBHSY7/?tag=mydeals03c-21",
        "category": "Fitness"
    },
    {
        "title": "Boldfit Double Spring Tummy Trimmer Men and Women for Abs Workout Stomach Exercise Machine for Women and Men Exercise in Gym, Home for Abdominal, Belly Exercise Waist Trimmer, Tummy Twister Red",
        "price": "₹278",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/71CaTu2mMQL._AC_UL320_.jpg",
        "asin": "B0CYH2GH66",
        "affiliate": "https://www.amazon.in/dp/B0CYH2GH66/?tag=mydeals03c-21",
        "category": "Fitness"
    },
    {
        "title": "PowerMax Fitness BU-201 Dual Action Air Bike/Exercise Bike for Home |Gym Cycle for Workout With Adjustable Cushioned Seat | Non-Slip Pedals | Moving Handles Black Gym Bike, Max user weight 120 KG",
        "price": "₹7,499",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/511Mk4tRMmL._AC_UL320_.jpg",
        "asin": "B08696STKB",
        "affiliate": "https://www.amazon.in/dp/B08696STKB/?tag=mydeals03c-21",
        "category": "Fitness"
    },
    {
        "title": "Gopendra Hip & Pelvis Trainer | Thigh Master and Inner Thigh Exercise Equipment | Pelvic Floor Exerciser Device | Training Tool | for Home, Gym, Fitness, Workout, Stretcher | for Men & Women",
        "price": "₹419",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/61qa5iARhFL._AC_UL320_.jpg",
        "asin": "B0C6TZYMN9",
        "affiliate": "https://www.amazon.in/dp/B0C6TZYMN9/?tag=mydeals03c-21",
        "category": "Fitness"
    },
    {
        "title": "Premium Bells 5 IN 1 Tummy Twister Waist Disc Magnetic Therapy Board for Weight Loss, Tummy Reduction & Core Workout | Home Gym Fitness Equipment for Men & Women 1 Year Warranty Multicolour",
        "price": "₹251",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/71Ye10MXEbL._AC_UL320_.jpg",
        "asin": "B0FFHNZTR9",
        "affiliate": "https://www.amazon.in/dp/B0FFHNZTR9/?tag=mydeals03c-21",
        "category": "Fitness"
    },
    {
        "title": "PRO365 Drill Free Pull Up Bar for Home Workout | No Screws Required | Tightening Key Included | Chin-Up Bar with Non-Slip Foam Grips Premium Suction Cups | Heavy Duty Steel Body | Fits Doorways 60–100 cm |100 KG | Home Gym Fitness Equipment | 1 Year Warranty",
        "price": "₹695",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/615l+9VbvPL._AC_UL320_.jpg",
        "asin": "B0GWTZM8DC",
        "affiliate": "https://www.amazon.in/dp/B0GWTZM8DC/?tag=mydeals03c-21",
        "category": "Fitness"
    },
    
    {
        "title": "You Can by George Matthew Adams | The Classic Guide to Self-Belief, Self-Help, Motivation & Personal Growth | A Life Changing Book on Success and Inner Strength | Premium Paperback Edition | Best Seller",
        "price": "₹99",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/81T05w0B3lL._AC_UY218_.jpg",
        "asin": "9389931843",
        "affiliate": "https://www.amazon.in/dp/9389931843/?tag=mydeals03c-21",
        "category": "Books"
    },
    {
        "title": "Ikigai: The Japanese secret to a long and happy life",
        "price": "₹357",
        "rating": "4.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/81l3rZK4lnL._AC_UY218_.jpg",
        "asin": "178633089X",
        "affiliate": "https://www.amazon.in/dp/178633089X/?tag=mydeals03c-21",
        "category": "Books"
    },
    {
        "title": "The Psychology of Money",
        "price": "₹290",
        "rating": "4.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/71XEsXS5RlL._AC_UY218_.jpg",
        "asin": "9390166268",
        "affiliate": "https://www.amazon.in/dp/9390166268/?tag=mydeals03c-21",
        "category": "Books"
    },
    {
        "title": "The Art of Letting Go: Move Beyond the Hurt, Find Emotional Freedom and Restore Your Inner Peace",
        "price": "₹201",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/71pEaSYkhsL._AC_UY218_.jpg",
        "asin": "0143465066",
        "affiliate": "https://www.amazon.in/dp/0143465066/?tag=mydeals03c-21",
        "category": "Books"
    },
    {
        "title": "Don't Believe Everything You Think (English)",
        "price": "₹179",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/71l4V5QookL._AC_UY218_.jpg",
        "asin": "935543135X",
        "affiliate": "https://www.amazon.in/dp/935543135X/?tag=mydeals03c-21",
        "category": "Books"
    },
    {
        "title": "World’s Greatest Books For Personal Growth & Wealth (Set of 4 Books) : Perfect Motivational Gift Set | How to Win Friends and Influence People | Think and Grow Rich | The Richest Man in Babylon | The Power of Your Subconscious Mind | Premium Paperback for Gifting",
        "price": "₹349",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/71eVoJQz9-L._AC_UY218_.jpg",
        "asin": "9389432014",
        "affiliate": "https://www.amazon.in/dp/9389432014/?tag=mydeals03c-21",
        "category": "Books"
    },
    {
        "title": "How to Be Happy with Who You Are | Puffin Chapter Book | Full-colour, Gorgeous Illustrations | Perfect Introduction to Sudha Murty | Ages 5+",
        "price": "₹172",
        "rating": "4.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/81Oo6fpigLL._AC_UY218_.jpg",
        "asin": "0143458205",
        "affiliate": "https://www.amazon.in/dp/0143458205/?tag=mydeals03c-21",
        "category": "Books"
    },
    {
        "title": "Courage To Be Disliked, The: How to free yourself, change your life and achieve real happiness",
        "price": "₹362",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/710cYy40DUL._AC_UY218_.jpg",
        "asin": "1760630721",
        "affiliate": "https://www.amazon.in/dp/1760630721/?tag=mydeals03c-21",
        "category": "Books"
    },
    {
        "title": "THE SECRET | Life-Changing Self-Help Book on Law of Attraction | Personal Transformation, Positive Thinking & Motivation | Paperback for Mindset, Success & Happiness",
        "price": "₹165",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/81Wz6-l3pkL._AC_UY218_.jpg",
        "asin": "B0FVXWJ55T",
        "affiliate": "https://www.amazon.in/dp/B0FVXWJ55T/?tag=mydeals03c-21",
        "category": "Books"
    },
    {
        "title": "Why I am an Atheist and Other Works | Letters & Jail Diary of Bhagat Singh on Revolution, Religion & Politics",
        "price": "₹110",
        "rating": "4.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/61MCDl9XbqL._AC_UL640_QL65_.jpg",
        "asin": "9387022811",
        "affiliate": "https://www.amazon.in/dp/9387022811/?tag=mydeals03c-21",
        "category": "Books"
    },
    {
        "title": "The Alchemist",
        "price": "₹245",
        "rating": "4.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/617lxveUjYL._AC_UY218_.jpg",
        "asin": "8172234988",
        "affiliate": "https://www.amazon.in/dp/8172234988/?tag=mydeals03c-21",
        "category": "Books"
    },
    {
        "title": "READ PEOPLE LIKE A BOOK | Master Human Behavior and Body Language | Analyze Emotions, Thoughts, and Intentions | Psychology-Based Guide to Improve Communication, and Social Intelligence",
        "price": "₹169",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/51eysN903mL._AC_UY218_.jpg",
        "asin": "B0GHMRK98B",
        "affiliate": "https://www.amazon.in/dp/B0GHMRK98B/?tag=mydeals03c-21",
        "category": "Books"
    },
    {
        "title": "The Monk Who Sold His Ferrari",
        "price": "₹198",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/61OByUf1TfL._AC_UY218_.jpg",
        "asin": "817992162X",
        "affiliate": "https://www.amazon.in/dp/817992162X/?tag=mydeals03c-21",
        "category": "Books"
    },
    {
        "title": "Manifest Anything in 100 Days: Manifestation & Law of Attraction Self-Help Book | 100-Day Challenge for Mindset, Abundance, Confidence & Goal Achievement",
        "price": "₹319",
        "rating": "4.7 out of 5",
        "image": "https://m.media-amazon.com/images/I/711IYLZFLZL._AC_UY218_.jpg",
        "asin": "0143477269",
        "affiliate": "https://www.amazon.in/dp/0143477269/?tag=mydeals03c-21",
        "category": "Books"
    },
    {
        "title": "Horrors Next Door: Short Stories of Rabindranath Tagore",
        "price": "₹99",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/81omK4hNhIL._AC_UY218_.jpg",
        "asin": "9370896317",
        "affiliate": "https://www.amazon.in/dp/9370896317/?tag=mydeals03c-21",
        "category": "Books"
    },
    {
        "title": "Who Will Cry When You Die?",
        "price": "₹182",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/71yu8CAKbgL._AC_UY218_.jpg",
        "asin": "8179922324",
        "affiliate": "https://www.amazon.in/dp/8179922324/?tag=mydeals03c-21",
        "category": "Books"
    },
    {
        "title": "The Psychology of Money & The Subtle Art of Not Giving a F*ck – Bestselling Personal Finance and Self-Help Books on Wealth, Mindset, and Living a Better Life",
        "price": "₹298",
        "rating": "4.7 out of 5",
        "image": "https://m.media-amazon.com/images/I/41p7iej06cL._AC_UY218_.jpg",
        "asin": "B0GSB45KVV",
        "affiliate": "https://www.amazon.in/dp/B0GSB45KVV/?tag=mydeals03c-21",
        "category": "Books"
    },
    
    {
        "title": "TOYTONIC Handheld Gaming Console for Kids & Adults | 520 Classic Built-in Games | Retro Video Game Player | Portable, Rechargeable, TV Output | Toy & Gift for Boys Girls Ages 6-14 | Mini Game Box",
        "price": "₹779",
        "rating": "3.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/518hbhY2uwL._AC_UL320_.jpg",
        "asin": "B0DRSRVQ4C",
        "affiliate": "https://www.amazon.in/dp/B0DRSRVQ4C/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "AirConsole - Gaming Console for TV",
        "price": "₹0",
        "rating": "3.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/71fX+1vwXjL._AC_UL320_.png",
        "asin": "B085H7Z1XC",
        "affiliate": "https://www.amazon.in/dp/B085H7Z1XC/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "BLUE BIG HORSE M15 RetroX 2.4G Wireless Game Console with 24000 Games, Dual Controllers, HDMI TV Output, 128GB TF Support, Plug & Play Retro Gaming System for Kids & Adults",
        "price": "₹2,099",
        "rating": "",
        "image": "https://m.media-amazon.com/images/I/61KyqV+Se5L._AC_UL320_.jpg",
        "asin": "B0GZ74T8ZN",
        "affiliate": "https://www.amazon.in/dp/B0GZ74T8ZN/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "VikriDA G5 500-in-1 Retro Handheld Game Console for Kids – 2 Players Classic TV-Compatible Game Box with Controller – Multicolor",
        "price": "₹749",
        "rating": "3.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/81LK8v6EnJL._AC_UL640_QL65_.jpg",
        "asin": "B0D4J24X5C",
        "affiliate": "https://www.amazon.in/dp/B0D4J24X5C/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "TOYTONIC R36S Retro Emulator Handheld Video Game Console, Built-in 22,000+ Games, 3.5 Inch IPS HD Screen,Up to 6 Hours Play Time,Rechargeable Portable Gaming Device,Gift for Boys & Girls (Assorted)",
        "price": "₹3,299",
        "rating": "3.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/71wSYNyZ9hL._AC_UL320_.jpg",
        "asin": "B0GF8SBBY5",
        "affiliate": "https://www.amazon.in/dp/B0GF8SBBY5/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "Inefable® (10 Pcs with Black Pouch) Pubg Anti-Slip Thumb Sleeve, Slip-Proof Sweat-Proof Professional Touch Screen Thumbs Finger Sleeve for Pubg Mobile Phone Game Gaming Gloves Multi Colour",
        "price": "₹149",
        "rating": "3.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/61mxMXM+sWL._AC_UL320_.jpg",
        "asin": "B09735ZGQ3",
        "affiliate": "https://www.amazon.in/dp/B09735ZGQ3/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "TOYTONIC Retro Handheld Gaming Console for Kids & Adults – 666-In-1 Built-in Classic Video Games – Rechargeable Game Console for Boys 7-14 Years – TV Output – Portable Toy Gift",
        "price": "₹1,099",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/61-n4lM4AJL._AC_UL320_.jpg",
        "asin": "B0DSVVCM9D",
        "affiliate": "https://www.amazon.in/dp/B0DSVVCM9D/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "Smartcam® Retro Handheld Gaming Console for Kids & Adults | 520+ Built-in Classic Video Games | Portable Rechargeable Mini Game Player | TV Output | Gift for Boys & Girls Ages 6–14",
        "price": "₹689",
        "rating": "3.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/61Gv-wRMX+L._AC_UL320_.jpg",
        "asin": "B0FYWSTM4J",
        "affiliate": "https://www.amazon.in/dp/B0FYWSTM4J/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "RC Car Complete Racing Simulator: Driving Games (Thrill Ride)",
        "price": "₹0",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/81Ly129EsYL._AC_UL320_.png",
        "asin": "B0CLKW669B",
        "affiliate": "https://www.amazon.in/dp/B0CLKW669B/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "EvoFox Fireblade TKL Semi-Mechanical Gaming Keyboard with Rainbow Backlit& Breathing Effect, Floating Keycaps, 19 Anti-Ghosting & 12 Multimedia Keys, Windows Lock Key, Braided Cable (Black)",
        "price": "₹899",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/617q9MVCT9L._AC_UL320_.jpg",
        "asin": "B085366TJW",
        "affiliate": "https://www.amazon.in/dp/B085366TJW/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "TOYTONIC Portable Retro Handheld Game Console for Kids | Classic Gaming with Preloaded 620 Games | 3.5\" Color Screen, Built-in Power Cell, TV Output | Video Games Player 𝐋𝐢𝐦𝐢𝐭𝐞𝐝 𝐓𝐨𝐝𝐚𝐲",
        "price": "₹999",
        "rating": "3.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/61dF-1B1-lL._AC_UL320_.jpg",
        "asin": "B0G1GYMRV4",
        "affiliate": "https://www.amazon.in/dp/B0G1GYMRV4/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "GOBOULT Mustang Torq Wireless in Ear Earbuds with 60H Playtime, App Support, Quad Mic ENC, 45ms Low Latency, 13mm Driver, Breathing LEDs, Made in India Ear Buds Wireless (Green)",
        "price": "₹1,799",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/71ON19cuoHL._AC_UL320_.jpg",
        "asin": "B0GK1GSRLJ",
        "affiliate": "https://www.amazon.in/dp/B0GK1GSRLJ/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "Kreo Surge Ultra Wireless Gaming Controller for PC, Nintendo Switch, Android & iOS | Hall Effect Joysticks, 1000Hz Polling, 2.4GHz + Bluetooth + Wired | Back Buttons, Turbo Mode, Adjustable Triggers, Vibration Gamepad",
        "price": "₹3,999",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/518ARk8zuYL._AC_UL320_.jpg",
        "asin": "B0GHN2NLG1",
        "affiliate": "https://www.amazon.in/dp/B0GHN2NLG1/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "Asphalt 8 Car Racing Game - Drive & Drift",
        "price": "₹0",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/71MJ6jg1PlL._AC_UL320_.png",
        "asin": "B00EQ0CKRQ",
        "affiliate": "https://www.amazon.in/dp/B00EQ0CKRQ/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "STRIFF World Map Extended Size (800 mm x 300 mm x 2 mm) Gaming Mouse Pad| Desk Mat | Stitched Edges| Non-Slip Rubber Base|Computer Laptop|Keyboard Mouse Pad for Office & Home (World Map)",
        "price": "₹229",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/61s6d6BxW4L._AC_UL320_.jpg",
        "asin": "B0CXDN7V9N",
        "affiliate": "https://www.amazon.in/dp/B0CXDN7V9N/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "SNAPTRON G5 Handheld Game Console for Kids, Retro Portable Console with Built-in 500 Classic Video Games, Retro Mini Game with HD Screen, Rechargable Handheld Console for Girls & Boys, Random Color",
        "price": "₹648",
        "rating": "3.7 out of 5",
        "image": "https://m.media-amazon.com/images/I/71uv6qCnulL._AC_UL320_.jpg",
        "asin": "B0G38K9N2S",
        "affiliate": "https://www.amazon.in/dp/B0G38K9N2S/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "ZEBRONICS Jet PRO Premium Gaming Headphone with LED for Headband + earcups, 40mm Neodymium Drivers, 2 Meter Braided Cable, Flexible mic, Suspension Design, 3.5mm + USB Connector & in-line Controller",
        "price": "₹888",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/71VR6c3j2bL._AC_UL320_.jpg",
        "asin": "B0B5RMKMJL",
        "affiliate": "https://www.amazon.in/dp/B0B5RMKMJL/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "ZEBRONICS PHERO Wired Gaming Mouse with up to 1600 DPI, Rainbow LED Lights, DPI Switch, High Precision, Plug & Play, 4 Buttons",
        "price": "₹184",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/71PfyTreJIL._AC_UL320_.jpg",
        "asin": "B0CG13FJ5M",
        "affiliate": "https://www.amazon.in/dp/B0CG13FJ5M/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "ZEBRONICS Optimus Gaming Keyboard & Mouse Combo, Braided Cable, Gold Plated USB, Upto 3600 DPI, 6 Buttons, High Resolution Sensor, Multicolor LED, Dedicated Macro Keys, 117 Keys (White)",
        "price": "₹1,049",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/71j5yvTZNOL._AC_UL320_.jpg",
        "asin": "B0CT3PYNZ7",
        "affiliate": "https://www.amazon.in/dp/B0CT3PYNZ7/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "Xbox",
        "price": "₹0",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/41amEfnVeyL._AC_UL320_.png",
        "asin": "B09MVCQJBJ",
        "affiliate": "https://www.amazon.in/dp/B09MVCQJBJ/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "ASUS TUF A15 (2025), AMD Ryzen 7 7445HS,RTX 3050-4GB,75W TGP,16GB DDR5(Upgradeable Upto 64GB) 512GB SSD,FHD,15.6\",144Hz,RGB Keyboard,Windows 11,Graphite Black,2.3 Kg FA506NCG-HN199W, Gaming Laptop",
        "price": "₹73,990",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/81nPkLHN3vL._AC_UL320_.jpg",
        "asin": "B0FM3C4L2F",
        "affiliate": "https://www.amazon.in/dp/B0FM3C4L2F/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "EvoFox Elite X RGB Wired Gaming Controller for PC with 2 Programmable Macro Back Buttons, Adjustable Dual Vibration Motors,Turbo Mode,Analog Triggers, High Precision joysticks,Low Latency Plug and Play,Translucent Shell Gamepad for pc",
        "price": "₹1,199",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/71ghAT0kkNL._AC_UL320_.jpg",
        "asin": "B0DFWDTZ73",
        "affiliate": "https://www.amazon.in/dp/B0DFWDTZ73/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "ASUS ROG XBOX Ally (2025), AMD Ryzen Z2 A Processor,16GB RAM, 512GB SSD, 7\"/17.8cm, FHD, Touchscreen,120Hz, 500 nits, Windows 11 Home, White, 670g, RC73YA-NH010W,AMD Radeon Graphics,Gaming Handheld PC",
        "price": "₹67,990",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/61c0Ufa7IdL._AC_UL320_.jpg",
        "asin": "B0FSDNXVG8",
        "affiliate": "https://www.amazon.in/dp/B0FSDNXVG8/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "CodersParadise Gaming Aesthetic Wall Collage Kit – 54 PCS 4×6\" Premium Cardstock Posters | Gamer Room Decor for Bedroom, Setup & Dorm | Cool Gaming Wall Art + Glue Dots Included",
        "price": "₹180",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/71VdZ2+zuAL._AC_UL320_.jpg",
        "asin": "B0CF2KHXWW",
        "affiliate": "https://www.amazon.in/dp/B0CF2KHXWW/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "EvoFox Katana X2 FS Mechanical Gaming Keyboard | 3‑Pin Replaceable Clicky Blue Switches, Dynamic Backlighting, All Keys Anti‑Ghosting, Volume Knob, Copilot, Xbox Gamebar, Screenshot & More (Black)",
        "price": "₹1,899",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/61S2i2cin6L._AC_UL320_.jpg",
        "asin": "B0FDGFZCRJ",
        "affiliate": "https://www.amazon.in/dp/B0FDGFZCRJ/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "ZEBRONICS Transformer M Plus Wired Gaming Mouse, Up to 12800 DPI, 6 Buttons with a 6-Level DPI Switch, 8 RGB Modes, 1000Hz Polling Rate, 1.5m Detachable Cable, Gaming Grade Sensor (Grey + Blue)",
        "price": "₹699",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/71ezQFgSl7L._AC_UL320_.jpg",
        "asin": "B0FF4ZJNM3",
        "affiliate": "https://www.amazon.in/dp/B0FF4ZJNM3/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "Storio Rechargeable Pocket Video Game for Kids 400 in 1 Retro Game Box Console Handheld Game Box with TV Output, Multicolour",
        "price": "₹597",
        "rating": "3.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/61F5A02wl3L._AC_UL320_.jpg",
        "asin": "B0F1XQ1L2H",
        "affiliate": "https://www.amazon.in/dp/B0F1XQ1L2H/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "Amisha Gift Gallery 500 in 1 Handheld Game Console for Kids, Retro Video Game Player with Rechargeable Battery, TV Connect Portable Pocket Gaming Device with Controller, Classic Arcade Games for Boys",
        "price": "₹785",
        "rating": "3.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/61LeN75i3HL._AC_UL320_.jpg",
        "asin": "B0FF4FLXWR",
        "affiliate": "https://www.amazon.in/dp/B0FF4FLXWR/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "Ant Globe 12 Wired Optical Gaming Mouse - 2400 DPI High-Precision Sensor, Multicolour RGB Backlight, 4 Responsive Buttons, Ergonomic Lightweight Design for PC, Mac, Laptop & Desktop (Black)",
        "price": "₹149",
        "rating": "5.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/61AGGrlMd6L._AC_UL320_.jpg",
        "asin": "B0GK1RGQMG",
        "affiliate": "https://www.amazon.in/dp/B0GK1RGQMG/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "Ant Esports GM100 V2 Optical Gaming Mouse,7 Button Wired USB Mouse, 4000 FPS Sensor, 3600 DPI, RGB Lighting,1.5m PVC Cable, Ergonomic Design, for Windows PC, Laptop,Gaming & Office Use- Black & White",
        "price": "₹399",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/715OxxoEkML._AC_UL320_.jpg",
        "asin": "B08D5ZLRCD",
        "affiliate": "https://www.amazon.in/dp/B08D5ZLRCD/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "Razer BlackShark V2 X Smartchoice Wired Gaming Headset with Mic, 7.1 Surround Sound, 50mm Drivers, Memory Foam Cushions, Multi-Platform (PC/PS/Xbox/Switch/Mobile), 3.5mm Jack_Black",
        "price": "₹3,999",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/51vUMenoNkL._AC_UL320_.jpg",
        "asin": "B08WBJHVYV",
        "affiliate": "https://www.amazon.in/dp/B08WBJHVYV/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "EvoFox Elite X2 Wireless Gaming Controller For PC with 1000Hz Polling Rate, Dual-Mode (2.4G & Type C), Hallsense™ Magnetic Hall 3D Joysticks & Triggers, EZ Click Macros, Dual Vibration Motors(White)",
        "price": "₹1,799",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/61XixU5Jp6L._AC_UL320_.jpg",
        "asin": "B0FKN7KV9X",
        "affiliate": "https://www.amazon.in/dp/B0FKN7KV9X/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "Alienware Area-51 Gaming Desktop | Core Ultra 9 285K | 32GB DDR5 | 2TB SSD | Win 11 + Office H&S 2024 | NVIDIA RTX 5080 16GB GDDR7 | 1 Year Alienware Care Service",
        "price": "₹5,49,990",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/61MBTTbb4bL._AC_UL320_.jpg",
        "asin": "B0FG38X8LB",
        "affiliate": "https://www.amazon.in/dp/B0FG38X8LB/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "GS5Pro Retro Gaming Console - Wireless Controller Gamepad- 1080P HD Graphics, 64GB Storage,Video Game TV Stick for All Ages",
        "price": "₹4,899",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/71yN0gfOf1L._AC_UL320_.jpg",
        "asin": "B0GT1BSNLL",
        "affiliate": "https://www.amazon.in/dp/B0GT1BSNLL/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "NXTGN Core i9 12900K 12th Gen Gaming PC | RTX 5060 TI 16GB | 64GB DDR5 RAM | 1TB NVMe SSD + 4TB HDD | ARGB Display Liquid Cooler | WiFi & BT | Win11 Pro | Editing, Trading, Streaming Desktop PC",
        "price": "₹3,24,990",
        "rating": "5.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/61K6NbUiQzL._AC_UL320_.jpg",
        "asin": "B0FBSP9V61",
        "affiliate": "https://www.amazon.in/dp/B0FBSP9V61/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "HP Victus, AMD Ryzen 7 7445HS, 4GB RTX 2050, 16GB DDR5(Upgradable) 512GB SSD, FHD, 144Hz, 300 nits, IPS, 15.6''/39.6cm, Win11, M365* Office24, Mica Silver, 2.29kg, fb3123AX, Backlit, Gaming Laptop",
        "price": "₹66,990",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/71qIJPTTD3L._AC_UL320_.jpg",
        "asin": "B0G9239R5S",
        "affiliate": "https://www.amazon.in/dp/B0G9239R5S/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "Alienware 16 Aurora Gaming Laptop, Intel Core 7 240H, 16GB, 1TB SSD, 16\" (40.64cm) WQXGA 300 Nits, NVIDIA RTX 4050, 6GB GDDR6, Backlit KB, Windows 11+Microsoft Office Home 2024, Indigo, 2.57kg",
        "price": "₹1,11,990",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/81pdPogh8CL._AC_UL320_.jpg",
        "asin": "B0G8ZBMQ46",
        "affiliate": "https://www.amazon.in/dp/B0G8ZBMQ46/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "EvoFox Starter Series Spectre USB Wired Gaming Mouse with Upto 3600 DPI Gaming Sensor | 6 Buttons Design | Upto 7 Million Clicks | 7 Colours Rainbow Lighting | 1.5m Braided Cable (White)",
        "price": "₹349",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/51J1tnBewIL._AC_UL320_.jpg",
        "asin": "B0DGVH47HW",
        "affiliate": "https://www.amazon.in/dp/B0DGVH47HW/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "HOPPUP Xo6 Gaming Earbuds with 35MS Low Latency, RGB LED, 13MM Drivers & 50H Playtime Bluetooth (Cobalt Blue, True Wireless)",
        "price": "₹799",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/61xUny0zw5L._AC_UL320_.jpg",
        "asin": "B0DHVRK6KZ",
        "affiliate": "https://www.amazon.in/dp/B0DHVRK6KZ/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "ASUS TUF Gaming F16,Intel Core 5 Processor 210H,14thGen Gaming Laptop(RTX 3050-6GB/65WTGP/16GB/512GB/FHD+/16\"/144Hz/Windows 11/M365 Basic(1Year)*/Office 2024/Mecha Gray/2.20 Kg) FX607VJB-RL179WS",
        "price": "₹83,900",
        "rating": "4.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/612vvgfTg1L._AC_UL320_.jpg",
        "asin": "B0GC5T8YXL",
        "affiliate": "https://www.amazon.in/dp/B0GC5T8YXL/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "VGRASSP 400 in 1 Handheld Video Game Console for Kids – Retro Portable Console with Built-in Classic Games, Rechargeable Battery, Gift for Boys & Girls - Multicolor",
        "price": "₹585",
        "rating": "3.7 out of 5",
        "image": "https://m.media-amazon.com/images/I/817JeirX84L._AC_UL320_.jpg",
        "asin": "B0FP19Y8SW",
        "affiliate": "https://www.amazon.in/dp/B0FP19Y8SW/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "Alienware Area-15 Gaming Laptop,Intel Core Ultra 9 275HX+24GB RTX 5090,64GB,2TB SSD with Logitech G502 LS Wireless Gaming Mouse, 25000DPI Programmable and Logitech GProX Wired Gaming Headset",
        "price": "₹5,14,480",
        "rating": "",
        "image": "https://m.media-amazon.com/images/I/51MMQy-ZrXL._AC_UL320_.jpg",
        "asin": "B0GPD4J955",
        "affiliate": "https://www.amazon.in/dp/B0GPD4J955/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "HP Omen, AMD Ryzen AI 7 350, 8GB RTX 5060, 24GB DDR5(Upgradeable) 1TB SSD, 165Hz, 2k WUXGA, 3ms, 400 nits, 16''/40.6cm, Win11, M365* Office24, Black, 2.44kg, ap0183AX, RGB, AI Gaming Laptop",
        "price": "₹1,59,990",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/71L-15NzerL._AC_UL320_.jpg",
        "asin": "B0FMFQMXHF",
        "affiliate": "https://www.amazon.in/dp/B0FMFQMXHF/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "EvoFox Phantom Air Ultra Lightweight Gaming Mouse 54g | Upto 1000Hz Polling Rate, 7000 FPS, 12800 DPI | Honeycomb RGB Lighting | Fully Programmable with Windows Software & On-Board Memory | Black",
        "price": "₹599",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/61Czf25EF9L._AC_UL320_.jpg",
        "asin": "B0FN84VLKL",
        "affiliate": "https://www.amazon.in/dp/B0FN84VLKL/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "VGRASSP Two Player 400 in 1 Handheld Video Game Console for Kids – Retro Portable Console with Built-in Classic Games, Rechargeable Battery, Gift for Boys & Girls - Color As Per Stock",
        "price": "₹679",
        "rating": "3.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/81qBl-7NAkL._AC_UL320_.jpg",
        "asin": "B0FP1KZR2S",
        "affiliate": "https://www.amazon.in/dp/B0FP1KZR2S/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "FRONTECH KB-0008P Dragon Fox Rainbow Backlit Gaming Keyboard | 35 Anti-Ghosting & Mechanical Keys | USB Wired Compact Keyboard for PC & Laptop | Windows Compatible | Plug & Play",
        "price": "₹606",
        "rating": "3.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/71OhscS9ltL._AC_UL320_.jpg",
        "asin": "B0FDL2DD2S",
        "affiliate": "https://www.amazon.in/dp/B0FDL2DD2S/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "Acer 4 in 1 Wired Gaming Combo, 7 Color LED Backlit Keyboard, RGB Mouse (800/1600/2400/3200 DPI), Premium Gaming Headset (50mm Driver, 120dB) with Mixed Light Effect, Fabric Weave Mousepad (Black)",
        "price": "₹1,999",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/81JilIXX68L._AC_UL320_.jpg",
        "asin": "B0DT9TMYHW",
        "affiliate": "https://www.amazon.in/dp/B0DT9TMYHW/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "EvoFox Blaze Ultra Value 8 Button Programmable Gaming Mouse with 1000Hz Polling Rate | Gaming Grade DPI 200 to 12800 | Ultra-Responsive 7000fps | RGB Lights with Music sync Mode | Windows Software",
        "price": "₹629",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/51UtqOFkheL._AC_UL320_.jpg",
        "asin": "B0D66VB4TH",
        "affiliate": "https://www.amazon.in/dp/B0D66VB4TH/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "ZEBRONICS WAR M, Wired Gaming Mouse with 6 Buttons, High Precision Sensor, up to 4200 DPI, Gold Plated USB Interface, Breathing LED, 1.8m Braided Cable",
        "price": "₹399",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/61rsqNfYbVL._AC_UL320_.jpg",
        "asin": "B0D2RHG5TK",
        "affiliate": "https://www.amazon.in/dp/B0D2RHG5TK/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    
    {
        "title": "VEBETO Remote Control Drift Stunt Car Toy | 1 Year Warranty | 4x4 RC Car for Kids & Adult | High Speed Racing Car | Omni-Directional Wheels | 360° Rotation | Double Sided Driving | RGB Lights Music",
        "price": "₹999",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/713NJZEMfKL._AC_UL320_.jpg",
        "asin": "B0G1Z4RYT2",
        "affiliate": "https://www.amazon.in/dp/B0G1Z4RYT2/?tag=mydeals03c-21",
        "category": "Toys"
    },
    {
        "title": "popsugar Off Roader Rechargeable Remote Control Car | RC Car Monster Truck | 4 Headlight Modes | Lithium Battery | C-Type Charging | 2.4GHz Remote Controller | Made in India, Red",
        "price": "₹1,199",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/71oLyiFeseL._AC_UL320_.jpg",
        "asin": "B0CQK691XQ",
        "affiliate": "https://www.amazon.in/dp/B0CQK691XQ/?tag=mydeals03c-21",
        "category": "Toys"
    },
    {
        "title": "TEC TAVAKKAL Duck Slide Toy Set, Funny Automatic Stair-Climbing Ducklings Cartoon Race Track Set Duck Roller Coaster Escalator Toy with Flashing Lights & Music (Duck Slide Track Set)",
        "price": "₹298",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/61w13QOIVmL._AC_UL320_.jpg",
        "asin": "B0CNCY6G5K",
        "affiliate": "https://www.amazon.in/dp/B0CNCY6G5K/?tag=mydeals03c-21",
        "category": "Toys"
    },
    {
        "title": "Kidology Geometric Shape and Color Matching Puzzle Board Game with Bell for Kids 3+ Years | Sensory Educational, Fun and Learning Toy for Children | Ideal for Gifting, Multicolor",
        "price": "₹298",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/71MO8pWqpSL._AC_UL640_QL65_.jpg",
        "asin": "B0CV7L8DXY",
        "affiliate": "https://www.amazon.in/dp/B0CV7L8DXY/?tag=mydeals03c-21",
        "category": "Toys"
    },
    {
        "title": "Toy Imagine Kids Digital Camera 3.0MP &1080p Video Photos 2-Inch Screen, USB Rechargeable & Portable Fun Mini Toy Camera for Boys & Girls Age 3–12 Educational Birthday Gift Supports 32GB SD Card(Pink)",
        "price": "₹598",
        "rating": "3.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/51qNm+iP4aL._AC_UL320_.jpg",
        "asin": "B0DQXQD16C",
        "affiliate": "https://www.amazon.in/dp/B0DQXQD16C/?tag=mydeals03c-21",
        "category": "Toys"
    },
    {
        "title": "Storio Rechargeable Toys Talking Cactus Baby Toys for Kids Dancing Cactus Toys Can Sing Wriggle & Singing Recording Repeat What You Say Funny Education Toys for Children Playing Home Decor for Kids",
        "price": "₹336",
        "rating": "3.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/61YVpEBCUhL._AC_UL320_.jpg",
        "asin": "B08D8J88X3",
        "affiliate": "https://www.amazon.in/dp/B08D8J88X3/?tag=mydeals03c-21",
        "category": "Toys"
    },
    {
        "title": "VGRASSP Remote Control Helicopter Toy for Kids with Up and Down Function - Rechargeable RC Chopper with Hand Sensor Auto-Lift - Indoor and Outdoor Flying Toy - Color As Per Stock",
        "price": "₹449",
        "rating": "2.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/61xwlKZ6xFL._AC_UL320_.jpg",
        "asin": "B0FDBFQQDC",
        "affiliate": "https://www.amazon.in/dp/B0FDBFQQDC/?tag=mydeals03c-21",
        "category": "Toys"
    },
    {
        "title": "Graphene Airplane Launcher Gun Flying Aeroplanes Toys for Boys Safe & Fun Shooting Guns for Kids 4 Paper Foam Gliders Air Battle Pistol Toy Gun Catapult Aircraft Ideal for Kids 3 4 5 6 7 8 Years",
        "price": "₹279",
        "rating": "3.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/7124HJIsLNL._AC_UL320_.jpg",
        "asin": "B0BJ2B85HG",
        "affiliate": "https://www.amazon.in/dp/B0BJ2B85HG/?tag=mydeals03c-21",
        "category": "Toys"
    },
    {
        "title": "Kids Phone – Rechargeable Toy for Kids with 24 Learning Modes | Talking Dummy Mobile for Boys & Girls Age 2–12 | Educational Mobile Phone Toy with, Music & Games Flash Card Phone",
        "price": "₹384",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/61MenUa6psL._AC_UL320_.jpg",
        "asin": "B0GSZ14C55",
        "affiliate": "https://www.amazon.in/dp/B0GSZ14C55/?tag=mydeals03c-21",
        "category": "Toys"
    },
    {
        "title": "VGRASSP Bot Robot Pioneer Colorful Lights and Music All Direction Movement Dancing Robot Toys for Boys and Girls (Color as per Stock Availability)",
        "price": "₹679",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/81yj+9PwIJL._AC_UL320_.jpg",
        "asin": "B0844ZC51G",
        "affiliate": "https://www.amazon.in/dp/B0844ZC51G/?tag=mydeals03c-21",
        "category": "Toys"
    },
    {
        "title": "VGRASSP 32 Holes Bubble Maker Gatling Bubble Gun Machine Toy for Kids with Bubble Solution Indoor and Outdoor Toddlers Bubble Launcher Machine for Girls and Boys - Multicolor (Color As Per Stock)",
        "price": "₹339",
        "rating": "3.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/81ALgDjTaqL._AC_UL320_.jpg",
        "asin": "B0CMD7LZTP",
        "affiliate": "https://www.amazon.in/dp/B0CMD7LZTP/?tag=mydeals03c-21",
        "category": "Toys"
    },
    {
        "title": "VikriDA Rechargeable Remote Control Robot Lizard | 360° Rotation, Low Noise, LED Lights | Fun Wall Crawler Prank Toy for Kids Ages 4+ (Green)",
        "price": "₹1,649",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/81SkMMpVw7L._AC_UL320_.jpg",
        "asin": "B0G4MH4ZVP",
        "affiliate": "https://www.amazon.in/dp/B0G4MH4ZVP/?tag=mydeals03c-21",
        "category": "Toys"
    },
    {
        "title": "Gooyo GY-231CH Hi-Speed Rechargeable RC Car Toy with Glowing Headlights Feature | User-Friendly RC Car Toy for Kids | Black | in-Built Battery | Gift Box Packaging",
        "price": "₹399",
        "rating": "3.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/71nfeuKUVjL._AC_UL320_.jpg",
        "asin": "B0CBQ4N649",
        "affiliate": "https://www.amazon.in/dp/B0CBQ4N649/?tag=mydeals03c-21",
        "category": "Toys"
    },
    {
        "title": "Babique Penguin Stuffed Plush Animal | Teddy Bear Soft Toy |Ideal for Birthdays & Special Occasions Girls/Boys, Baby Kids (17Cm)",
        "price": "₹139",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/612aRPcUH0L._AC_UL320_.jpg",
        "asin": "B0F64GBC72",
        "affiliate": "https://www.amazon.in/dp/B0F64GBC72/?tag=mydeals03c-21",
        "category": "Toys"
    },
    {
        "title": "Mini Explorer 5 in 1 Police Trucks Boy Toys for 3-5 Year Old Toddlers - Toys for 3 4 5 6 7 Years Old Transport Vehicle Carrier Truck Sets Kids Boys & Girls",
        "price": "₹999",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/71Nl4LsqYtL._AC_UL320_.jpg",
        "asin": "B0FLKF9SDL",
        "affiliate": "https://www.amazon.in/dp/B0FLKF9SDL/?tag=mydeals03c-21",
        "category": "Toys"
    },
    {
        "title": "Storio Kids Piano Keyboard with Mic | 37 Keys, 8 Rhythms, 8 Tones & 6 Demo Songs | Electronic Musical Toy for Boys & Girls Age 2-5 | Educational & Recording Keyboard for Beginners",
        "price": "₹684",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/61LPC9XBeEL._AC_UL320_.jpg",
        "asin": "B0FBJYMQ45",
        "affiliate": "https://www.amazon.in/dp/B0FBJYMQ45/?tag=mydeals03c-21",
        "category": "Toys"
    },
    {
        "title": "Hopping Walking Dog Toy with Sounds, Jumping Dog Wiggling Tails, Twitching Mouth and Nose, Educational Interactive Dog Toy for Baby Kids Children",
        "price": "₹299",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/61jTkdQO2KL._AC_UL320_.jpg",
        "asin": "B0GD64WHT3",
        "affiliate": "https://www.amazon.in/dp/B0GD64WHT3/?tag=mydeals03c-21",
        "category": "Toys"
    },
    {
        "title": "VELINOR Pull-Back Action Toy P729 Gun with 200 BB Bullets | Long Range Shooting Pistol for Kids & Adults | Removable Magazine | Strong Spring Power | Safe Plastic BB Pellets",
        "price": "₹99",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/41-2cHaryzL._AC_UL320_.jpg",
        "asin": "B0G9XTRK5L",
        "affiliate": "https://www.amazon.in/dp/B0G9XTRK5L/?tag=mydeals03c-21",
        "category": "Toys"
    },
    {
        "title": "GRAPHENE 1:32 Scale DieCast Metal Toy Car Pull Back Action Openable Doors 4x4 Thar/Jeep Premium Car Toy Light Music for Kids Realistic Miniature Model Best Gift 2+yrs Girls Boys Random Colors",
        "price": "₹328",
        "rating": "3.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/51pGit1uTFL._AC_UL320_.jpg",
        "asin": "B0DFY9YY73",
        "affiliate": "https://www.amazon.in/dp/B0DFY9YY73/?tag=mydeals03c-21",
        "category": "Toys"
    },
    {
        "title": "Galaxy Hi-Tech Mini Metal Die Cast Car Set of-6 Toy Vehicle Play Set Free Wheel High Speed Unbreakable Car for Kids, Small Racing Exciting Playtime Adventures, Movie Vehicles for Kids",
        "price": "₹365",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/71XiWPwcVoL._AC_UL320_.jpg",
        "asin": "B0D5B81RCT",
        "affiliate": "https://www.amazon.in/dp/B0D5B81RCT/?tag=mydeals03c-21",
        "category": "Toys"
    },
    {
        "title": "Storio Rechargeable Wireless Mini Portable Bluetooth Karaoke Machine | Bluetooth Speaker with Microphone & LED Lights - Kids Music Singing Toys for Girl Boy Birthday Gift Ideas",
        "price": "₹499",
        "rating": "3.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/71hl6aKmHdL._AC_UL320_.jpg",
        "asin": "B09CTQJ6FR",
        "affiliate": "https://www.amazon.in/dp/B09CTQJ6FR/?tag=mydeals03c-21",
        "category": "Toys"
    },
    {
        "title": "Wembley Educational Kids Laptop Learning Toy for 2-5 Years Boys Girls Computer Toys for 3 Years Fun Activity Learning Alphabet,Letter,Words,Games,Mathematics,Music,Logic Memory Tool - Blue",
        "price": "₹754",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/71KBMy1AVbL._AC_UL320_.jpg",
        "asin": "B0CM9MHFQP",
        "affiliate": "https://www.amazon.in/dp/B0CM9MHFQP/?tag=mydeals03c-21",
        "category": "Toys"
    },
    {
        "title": "Gooyo DB2069 360° Rotating & Rolling Stunt Car Toy with Demo Functions | Spin, Stunt, Flip Functions | Remote Control Stunt Car Toy for Kids | Red | in-Built Battery | Gift Box Packaging",
        "price": "₹389",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/61GEMvbzgFL._AC_UL320_.jpg",
        "asin": "B0BLBW79NQ",
        "affiliate": "https://www.amazon.in/dp/B0BLBW79NQ/?tag=mydeals03c-21",
        "category": "Toys"
    },
    {
        "title": "Toy Imagine Foam Pogo Jumper for Kids – Indoor & Outdoor Bouncing Toy for Boys & Girls | Fun Jumping Stick for Ages 3+ | Safe, Durable & Supports Up to 250 Lbs | Birthday Gift (Color May Vary)",
        "price": "₹275",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/51-e-f4VndL._AC_UL320_.jpg",
        "asin": "B0DJJY2Z3G",
        "affiliate": "https://www.amazon.in/dp/B0DJJY2Z3G/?tag=mydeals03c-21",
        "category": "Toys"
    },
    {
        "title": "Storio Blaze Storm Soft Bullet Gun Toy with 10 Safe Soft Foam Bullets, Fun Target Shooting Battle Fight Game for Kids Boys (Super Gun), Multicolor",
        "price": "₹299",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/61NHH-nk6dL._AC_UL320_.jpg",
        "asin": "B0BVZR2WYS",
        "affiliate": "https://www.amazon.in/dp/B0BVZR2WYS/?tag=mydeals03c-21",
        "category": "Toys"
    },
    {
        "title": "Wembley Dancing Monkey Musical Toy for Kids Baby Spinning Rolling Doll Tumble Toy with Voice Control Musical Light and Sound Effects with Sensor - ISI Mark - Multicolor",
        "price": "₹224",
        "rating": "3.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/61XmQq9EqXL._AC_UL320_.jpg",
        "asin": "B0BHHKR9DN",
        "affiliate": "https://www.amazon.in/dp/B0BHHKR9DN/?tag=mydeals03c-21",
        "category": "Toys"
    },
    {
        "title": "EITHEO Geometric Angle Blocks for Kids | 26 Pcs Montessori Sorting & Stacking Educational Toy | Colorful Shape Sorter Puzzle for Toddlers 1-3 Years | Learning Activity Toy for Boys & Girls",
        "price": "₹153",
        "rating": "3.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/817az4dHG2L._AC_UL320_.jpg",
        "asin": "B0FQCHD1DX",
        "affiliate": "https://www.amazon.in/dp/B0FQCHD1DX/?tag=mydeals03c-21",
        "category": "Toys"
    },
    {
        "title": "GRAPHENE 4WD Friction Powered Monster Truck Toy Push & Go Off-Road Car for Kids Amazing 360° Stunts All-Terrain Grip Vibrant Colors for Boys Girls Birthday Christmas Fun Play",
        "price": "₹69",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/81iA9xlbqjL._AC_UL320_.jpg",
        "asin": "B0CDSBQ9FH",
        "affiliate": "https://www.amazon.in/dp/B0CDSBQ9FH/?tag=mydeals03c-21",
        "category": "Toys"
    },
    {
        "title": "GRAPHENE 2 Pcs Squishy Stress Ball for Kids Squeeze Toy Pressure Relieve Anti-Stress Anti Anxiety Multicolor Magic Slime Mesh Ball Squeeze Grape Balls Return Gifts",
        "price": "₹159",
        "rating": "3.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/818YvJxt7GL._AC_UL320_.jpg",
        "asin": "B0CRR7HZ16",
        "affiliate": "https://www.amazon.in/dp/B0CRR7HZ16/?tag=mydeals03c-21",
        "category": "Toys"
    },
    {
        "title": "Storio Kids Digital Camera Toy 3.0MP 1080P HD Video Camera with 2-Inch Screen | USB Rechargeable Mini Camera | Educational Toy & Birthday Gift for Boys & Girls Age 3–12 | Supports 32GB SD Card - Blue",
        "price": "₹599",
        "rating": "3.7 out of 5",
        "image": "https://m.media-amazon.com/images/I/61MaXYRGQeL._AC_UL320_.jpg",
        "asin": "B0G1C2TGWX",
        "affiliate": "https://www.amazon.in/dp/B0G1C2TGWX/?tag=mydeals03c-21",
        "category": "Toys"
    },
    {
        "title": "Centy Toys Plastic Pull Back Auto Rickshaw, Number Of Pieces: 1, Multicolour, 36 Months",
        "price": "₹152",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/51uB7i1cw+L._AC_UL320_.jpg",
        "asin": "B011NXA79Q",
        "affiliate": "https://www.amazon.in/dp/B011NXA79Q/?tag=mydeals03c-21",
        "category": "Toys"
    },
    {
        "title": "GRAPHENE Pull Back Friction Powered Monster Car Truck Telescopic DTX Toy Car for Kids Non Electric Gift for 2 3 4 5 6 Year Boys Girls Push and GO 4 Wheel Off-Road Vehicles Racing Stunt Car",
        "price": "₹159",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/71jad-DzyyL._AC_UL320_.jpg",
        "asin": "B0F9LDY2Q1",
        "affiliate": "https://www.amazon.in/dp/B0F9LDY2Q1/?tag=mydeals03c-21",
        "category": "Toys"
    },
    {
        "title": "Toy Imagine Magnetic Building Blocks for Kids | Construction STEM Building Toys for Kids 2–5 Years | Safe Magnetic Blocks for Toddlers, Boys & Girls | Educational Blocks & Magnet Toys (36pcs)",
        "price": "₹499",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/61yqiJ4BVTL._AC_UL320_.jpg",
        "asin": "B0G9TT7DVK",
        "affiliate": "https://www.amazon.in/dp/B0G9TT7DVK/?tag=mydeals03c-21",
        "category": "Toys"
    },
    {
        "title": "VGRASSP Classic Dial Receiver Simulation Telephone Toy for Kids - Rotating Number Dial with Calling Sound Effect - Storytelling Toy Phone Accompanied with Lights - Color As Per Stock",
        "price": "₹679",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/81CAevJ5rWL._AC_UL320_.jpg",
        "asin": "B0CXPX7R27",
        "affiliate": "https://www.amazon.in/dp/B0CXPX7R27/?tag=mydeals03c-21",
        "category": "Toys"
    },
    {
        "title": "Toy Imagine Astronaut Galaxy Projector Night Light 360° Rotating Nebula Star Lamp Projector with Remote Control Ideal for Bedroom Ceiling, Home Decor, and Parties Lighting Gift to Boys & Girls",
        "price": "₹699",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/8144IKE445L._AC_UL320_.jpg",
        "asin": "B0D7MQYRDK",
        "affiliate": "https://www.amazon.in/dp/B0D7MQYRDK/?tag=mydeals03c-21",
        "category": "Toys"
    },
    {
        "title": "Storio Blaze Storm Hot Fire Soft Bullet Gun Toy With 10 Safe Soft Foam Bullets, Fun Target Shooting Battle Fight Game For Kids Boys (Blaze Storm- Hot Fire),Multicolor",
        "price": "₹199",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/71HwYi43pUL._AC_UL320_.jpg",
        "asin": "B07Q5N5BTT",
        "affiliate": "https://www.amazon.in/dp/B07Q5N5BTT/?tag=mydeals03c-21",
        "category": "Toys"
    },
    {
        "title": "VGRASSP Wrist Watch Remote Controlled Mini Car Toy for Kids with USB Charging Cable - Rechargeable 2 Function Remote Watch - Color and Design As Per Stock",
        "price": "₹697",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/81WOqVtBHiL._AC_UL320_.jpg",
        "asin": "B0D3QQ1GNY",
        "affiliate": "https://www.amazon.in/dp/B0D3QQ1GNY/?tag=mydeals03c-21",
        "category": "Toys"
    },
    {
        "title": "Toy Imagine Interactive Sound Book for Kids with Marker (Ages 2–7) Learn Alphabets, Numbers, Shapes & Phonics Educational Talking Book with Music & Touch Features Multicolor Learning Toy for Toddlers",
        "price": "₹257",
        "rating": "3.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/71gNV4kOFAL._AC_UL320_.jpg",
        "asin": "B0BW9P96FM",
        "affiliate": "https://www.amazon.in/dp/B0BW9P96FM/?tag=mydeals03c-21",
        "category": "Toys"
    },
    {
        "title": "Toy Imagine Wooden Color Memory Chess Game for Kids Age 3+ | Wooden Memory Match Stick Chess Board Game | Brain Puzzle Toy for Boys, Girls & Adults | Montessori Learning & Family Game",
        "price": "₹259",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/714fyFURHVL._AC_UL320_.jpg",
        "asin": "B0FC692YW3",
        "affiliate": "https://www.amazon.in/dp/B0FC692YW3/?tag=mydeals03c-21",
        "category": "Toys"
    },
    {
        "title": "Gooyo GY-2020A Educational Learning Laptop Toy with LED Display and Musical Effects | Play & Learn with Fun | Indoor Toy for Kids | Educational Toy | Pink | 3xAA Battery (Not Included)",
        "price": "₹338",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/61hTruiYV2L._AC_UL320_.jpg",
        "asin": "B0BF585KKH",
        "affiliate": "https://www.amazon.in/dp/B0BF585KKH/?tag=mydeals03c-21",
        "category": "Toys"
    },
    {
        "title": "TOYTONIC Retro Handheld Gaming Console for Kids & Adults – 666-In-1 Built-in Classic Video Games – Rechargeable Game Console for Boys 7-14 Years – TV Output – Portable Toy Gift",
        "price": "₹1,099",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/61-n4lM4AJL._AC_UL320_.jpg",
        "asin": "B0DSVVCM9D",
        "affiliate": "https://www.amazon.in/dp/B0DSVVCM9D/?tag=mydeals03c-21",
        "category": "Toys"
    },
    {
        "title": "Yellow RC Car Rock Crawler Remote Control Car with LED Headlight, Rechargeable Battery High Speed Off Road RC Car, Monster Truck Toy Car for Kids & Boys 7-14 Years | Remote Control Car Toy Gift",
        "price": "₹799",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/71aAkXcTE4L._AC_UL320_.jpg",
        "asin": "B0GPDCZXMP",
        "affiliate": "https://www.amazon.in/dp/B0GPDCZXMP/?tag=mydeals03c-21",
        "category": "Toys"
    },
    {
        "title": "Gooyo GY-2029 Voice Control Banana Dancing Monkey Toy | Spinning, Rolling and Tumbling Toy for Kids with Bright LED Lights & Sound Effects | Blue | 3xAAA Battery (Not Included)",
        "price": "₹199",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/61arOQAds9L._AC_UL320_.jpg",
        "asin": "B0C77VNZ5D",
        "affiliate": "https://www.amazon.in/dp/B0C77VNZ5D/?tag=mydeals03c-21",
        "category": "Toys"
    },
    {
        "title": "Storio Click and Catch Twin Ball Launcher Game with 3 Balls Indoor Outdoor Toy Set, Pop & Catch Ball Play Fun Boys & Girls - Multicolor",
        "price": "₹192",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/71SG7+k7-WL._AC_UL320_.jpg",
        "asin": "B0BQC9PMYS",
        "affiliate": "https://www.amazon.in/dp/B0BQC9PMYS/?tag=mydeals03c-21",
        "category": "Toys"
    },
    {
        "title": "Storio Learning Educational Computer Kids Piano Laptop with Led Screen & Music | Fun Activities Toy Computer Tablet for Kids Toddlers 1 2 3 4 5 6 + Year Old Boy and Girls, Multicolor",
        "price": "₹475",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/71Ouz+16MSL._AC_UL320_.jpg",
        "asin": "B0DFWQF8VK",
        "affiliate": "https://www.amazon.in/dp/B0DFWQF8VK/?tag=mydeals03c-21",
        "category": "Toys"
    },
    {
        "title": "VGRASSP Radish Style Cute Rabbit Face Pretend Play Cell Phone Toy for Kids, Toddlers with Music, Ringtones, Lights - Birthday Party Favors and Gifts for Boys and Girls(Multicolor)",
        "price": "₹242",
        "rating": "3.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/71DveLn+vTL._AC_UL320_.jpg",
        "asin": "B0BKZMHP48",
        "affiliate": "https://www.amazon.in/dp/B0BKZMHP48/?tag=mydeals03c-21",
        "category": "Toys"
    },
    {
        "title": "Amazon Brand - Jam & Honey Ball Drop Ramp Toy for Kids 3+ Years, BIS Certified Safe for Kids, 5 Level Rolling Ball Tower with 4 Balls, Toddler Learning Activity Toy",
        "price": "₹239",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/51EFTujEusL._AC_UL320_.jpg",
        "asin": "B0BXKPQVPL",
        "affiliate": "https://www.amazon.in/dp/B0BXKPQVPL/?tag=mydeals03c-21",
        "category": "Toys"
    },
    {
        "title": "VGRASSP Walking and Jumping Puppy Toy for Kids - Battery Operated Back Flip Jump Dog with Sound - Color As Per Stock",
        "price": "₹679",
        "rating": "3.7 out of 5",
        "image": "https://m.media-amazon.com/images/I/814QAmzvMvL._AC_UL320_.jpg",
        "asin": "B08G1QW5QR",
        "affiliate": "https://www.amazon.in/dp/B08G1QW5QR/?tag=mydeals03c-21",
        "category": "Toys"
    },
    {
        "title": "Toy Imagine 4-Level Car Ramp Racer Toy with 4 Cars – Rolling Track Toy for Kids Ages 2–7 | Birthday Gift for Boys & Girls | Educational & Fun Car Toy Set | Colorful Racing Action",
        "price": "₹299",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/61vqwuJHSYL._AC_UL320_.jpg",
        "asin": "B0D41P7TNQ",
        "affiliate": "https://www.amazon.in/dp/B0D41P7TNQ/?tag=mydeals03c-21",
        "category": "Toys"
    },
    
    {
        "title": "Tata Salt 1 Kg, Free Flowing and Iodised Namak, Vacuum Evaporated, Salt in Fresh",
        "price": "₹27",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/31Ip4aURUpL.png",
        "asin": "B07575FPC3",
        "affiliate": "https://www.amazon.in/dp/B07575FPC3/?tag=mydeals03c-21",
        "category": "Grocery"
    },
    {
        "title": "Delicious Salted Pistachios | Pista Nuts and Dry Fruits | Healthy Snacks Items | Pistachio 50 grams",
        "price": "₹103",
        "rating": "3.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/818ERivyWjS._AC_UL320_.jpg",
        "asin": "B098LMDPGK",
        "affiliate": "https://www.amazon.in/dp/B098LMDPGK/?tag=mydeals03c-21",
        "category": "Grocery"
    },
    {
        "title": "Fortune Sunlite Refined Sunflower Oil, 870gm/800gm Pouch (Weight May Vary)",
        "price": "₹189",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/31Ip4aURUpL.png",
        "asin": "B00NYZTGEO",
        "affiliate": "https://www.amazon.in/dp/B00NYZTGEO/?tag=mydeals03c-21",
        "category": "Grocery"
    },
    {
        "title": "Surf Excel Easy Wash Detergent Powder - 1.5 kg",
        "price": "₹230",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/31Ip4aURUpL.png",
        "asin": "B00TS89BSW",
        "affiliate": "https://www.amazon.in/dp/B00TS89BSW/?tag=mydeals03c-21",
        "category": "Grocery"
    },
    {
        "title": "Tata Sampann Unpolished Toor Dal/Arhar Dal, 1kg",
        "price": "₹169",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/31Ip4aURUpL.png",
        "asin": "B074N7VHV4",
        "affiliate": "https://www.amazon.in/dp/B074N7VHV4/?tag=mydeals03c-21",
        "category": "Grocery"
    },
    {
        "title": "Exo Dishwash Bar, 360gm (90gm X (3 + 1 Bar Free) | Complete Dishwashing Solution With Anti-Bacterial Efficacy & Goodness of Ginger Remove Tough Grime Stains | Experience Hygienic & Superior Cleaning",
        "price": "₹30",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/31Ip4aURUpL.png",
        "asin": "B078HC9V8B",
        "affiliate": "https://www.amazon.in/dp/B078HC9V8B/?tag=mydeals03c-21",
        "category": "Grocery"
    },
    {
        "title": "MAGGI 2-Minute Instant Noodles, Favourite Masala Taste, Masala Noodles With Goodness Of Iron, Made With Choicest Quality Spices, 840/900g Pouch (Pack of 12, 70/75g each) (weight may vary)",
        "price": "₹158",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/71R+kuYnovL._AC_UL320_.jpg",
        "asin": "B07B4KQRZG",
        "affiliate": "https://www.amazon.in/dp/B07B4KQRZG/?tag=mydeals03c-21",
        "category": "Grocery"
    },
    {
        "title": "Go Vegan Healthy Nutmix 500gm, Dried Almonds, Black Raisins, Cashewnuts, Cranberries, Black Dates & Many More. (Jar Pack)",
        "price": "₹289",
        "rating": "3.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/61J60jF4XgL._AC_UL320_.jpg",
        "asin": "B0F63HJXSR",
        "affiliate": "https://www.amazon.in/dp/B0F63HJXSR/?tag=mydeals03c-21",
        "category": "Grocery"
    },
    {
        "title": "Amazon Brand - Vedaka Raw Peanuts, Pink, 1kg",
        "price": "₹289",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/31Ip4aURUpL.png",
        "asin": "B07KXGFGSS",
        "affiliate": "https://www.amazon.in/dp/B07KXGFGSS/?tag=mydeals03c-21",
        "category": "Grocery"
    },
    {
        "title": "Santoor Sandal & Turmeric Soap for Total Skin Care, 125g (Pack of 4)",
        "price": "₹148",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/31Ip4aURUpL.png",
        "asin": "B006L7Q3OS",
        "affiliate": "https://www.amazon.in/dp/B006L7Q3OS/?tag=mydeals03c-21",
        "category": "Grocery"
    },
    {
        "title": "Pureheart Cherokee Premium Trail Mix | An Eclectic Mix of 8 Healthy Superfoods Nuts- Cashews, Almonds, Pistachio | Dry Fruits - Cranberries, Raisins | Seeds - Pumpkin, Sunflower | Reusable Jar (1000g)",
        "price": "₹1,379",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/718Jd+a2UAL._AC_UL640_QL65_.jpg",
        "asin": "B0D6YZWTNF",
        "affiliate": "https://www.amazon.in/dp/B0D6YZWTNF/?tag=mydeals03c-21",
        "category": "Grocery"
    },
    {
        "title": "Tata Sampann Unpolished Moong Dal (Split), 1Kg",
        "price": "₹188",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/31Ip4aURUpL.png",
        "asin": "B075335G7N",
        "affiliate": "https://www.amazon.in/dp/B075335G7N/?tag=mydeals03c-21",
        "category": "Grocery"
    },
    {
        "title": "NRIP Premium Dried Afghani Anjeer 200g I Low in Fat | Dry Fruits in Fresh | Healthy Snacks I Rich Source of Vitamins Dietary Fiber | Dry Figs",
        "price": "₹239",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/8150ABL+9-L._AC_UL320_.jpg",
        "asin": "B09WDZK4NJ",
        "affiliate": "https://www.amazon.in/dp/B09WDZK4NJ/?tag=mydeals03c-21",
        "category": "Grocery"
    },
    {
        "title": "NRIP Premium Walnut Kernels California 200g (Pack of 1) | Walnuts without Shell | Akhrot Giri | Dry Fruits, Healthy Snacks | Natural Walnut Kernels | Rich in Protein, Iron & Source of Omega-3",
        "price": "₹319",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/81GhdJGmHHL._AC_UL320_.jpg",
        "asin": "B09WDYWBKN",
        "affiliate": "https://www.amazon.in/dp/B09WDYWBKN/?tag=mydeals03c-21",
        "category": "Grocery"
    },
    {
        "title": "Tata Sampann Unpolished Green Moong Dal (Whole), 500gm",
        "price": "₹92",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/31Ip4aURUpL.png",
        "asin": "B077X8MD39",
        "affiliate": "https://www.amazon.in/dp/B077X8MD39/?tag=mydeals03c-21",
        "category": "Grocery"
    },
    {
        "title": "Surf Excel Matic Top Load Liquid Detergent 3kg Refill ||Specially Designed To Remove Tough Dried Stains, 1st time In Washing Machine",
        "price": "₹419",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/31Ip4aURUpL.png",
        "asin": "B0BHJ1HVTH",
        "affiliate": "https://www.amazon.in/dp/B0BHJ1HVTH/?tag=mydeals03c-21",
        "category": "Grocery"
    },
    {
        "title": "Tata Sampann Chana Dal, 500g",
        "price": "₹65",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/31Ip4aURUpL.png",
        "asin": "B077X8G5DK",
        "affiliate": "https://www.amazon.in/dp/B077X8G5DK/?tag=mydeals03c-21",
        "category": "Grocery"
    },
    {
        "title": "Tata Sampann Unpolished Kala (Black, Brown) Chana, 1kg",
        "price": "₹108",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/31Ip4aURUpL.png",
        "asin": "B077X8K4RG",
        "affiliate": "https://www.amazon.in/dp/B077X8K4RG/?tag=mydeals03c-21",
        "category": "Grocery"
    },
    {
        "title": "Tata Sampann Masoor Dal, Whole, 1kg",
        "price": "₹144",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/31Ip4aURUpL.png",
        "asin": "B077XDK8HT",
        "affiliate": "https://www.amazon.in/dp/B077XDK8HT/?tag=mydeals03c-21",
        "category": "Grocery"
    },
    {
        "title": "Tide Naturals 3Kg Detergent Powder - Lemon And Chandan",
        "price": "₹230",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/31Ip4aURUpL.png",
        "asin": "B0D312WB2C",
        "affiliate": "https://www.amazon.in/dp/B0D312WB2C/?tag=mydeals03c-21",
        "category": "Grocery"
    },
    {
        "title": "Comfort Morning Fresh Fabric Conditioner 2 L Refill Pack|| After Wash Liquid Fabric Softener - For Softness|| Shine & Long Lasting Freshness",
        "price": "₹379",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/31Ip4aURUpL.png",
        "asin": "B07F8H9NYY",
        "affiliate": "https://www.amazon.in/dp/B07F8H9NYY/?tag=mydeals03c-21",
        "category": "Grocery"
    },
    {
        "title": "Vedaka Cumin (Safed Zeera) whole, 200 g",
        "price": "₹113",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/31Ip4aURUpL.png",
        "asin": "B07BXWC1QT",
        "affiliate": "https://www.amazon.in/dp/B07BXWC1QT/?tag=mydeals03c-21",
        "category": "Grocery"
    },
    {
        "title": "Vim Antismell Dishwash Bar with Pudina|| 190 g (Buy 4 Get 1 Free)",
        "price": "₹125",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/31Ip4aURUpL.png",
        "asin": "B079H72M8L",
        "affiliate": "https://www.amazon.in/dp/B079H72M8L/?tag=mydeals03c-21",
        "category": "Grocery"
    },
    {
        "title": "Kellogg's Muesli Fruit Nut & Seeds | 12 In 1 Power Breakfast | No Maida No Palm Oil | India's No 1 Muesli | 750g | Super Saver Pack with Ziplock",
        "price": "₹376",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/31Ip4aURUpL.png",
        "asin": "B083JP2NZX",
        "affiliate": "https://www.amazon.in/dp/B083JP2NZX/?tag=mydeals03c-21",
        "category": "Grocery"
    },
    {
        "title": "Harpic Disinfectant Toilet Cleaner Liquid, Original - 1 L | India's # 1 Toilet Cleaner",
        "price": "₹216",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/31Ip4aURUpL.png",
        "asin": "B00NWFVVG2",
        "affiliate": "https://www.amazon.in/dp/B00NWFVVG2/?tag=mydeals03c-21",
        "category": "Grocery"
    },
    {
        "title": "Dettol Liquid Handwash Refill - Original Hand Wash- 1350ml | Germ Defence Formula | 10x Better Germ Protection",
        "price": "₹179",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/31Ip4aURUpL.png",
        "asin": "B01LNA2MQK",
        "affiliate": "https://www.amazon.in/dp/B01LNA2MQK/?tag=mydeals03c-21",
        "category": "Grocery"
    },
    {
        "title": "Pears Original Glycerin Soap Bar - Pure & Gentle Glow | With 98% Pure Glycerin | For Hydration & Glow | With Plant Based Cleanser for Skin & Body | Paraben-free | 125gms x 8",
        "price": "₹406",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/51hE0ECac6L._AC_UL320_.jpg",
        "asin": "B07BNS25DB",
        "affiliate": "https://www.amazon.in/dp/B07BNS25DB/?tag=mydeals03c-21",
        "category": "Grocery"
    },
    {
        "title": "Tata Sampann Turmeric Powder With Natural Oils, 200g, Haldi Powder",
        "price": "₹84",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/31Ip4aURUpL.png",
        "asin": "B079H8D8M6",
        "affiliate": "https://www.amazon.in/dp/B079H8D8M6/?tag=mydeals03c-21",
        "category": "Grocery"
    },
    {
        "title": "Aashirvaad Salt,with 4-Step advantage, 1kg",
        "price": "₹20",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/31Ip4aURUpL.png",
        "asin": "B00PCCMDGA",
        "affiliate": "https://www.amazon.in/dp/B00PCCMDGA/?tag=mydeals03c-21",
        "category": "Grocery"
    },
    {
        "title": "Amazon Brand - Vedaka Popular Unpolished Toor Dal | 1 Kg Pack | Naturally Rich Source Of Protein | Naturally Cholesterol-Free",
        "price": "₹181",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/31Ip4aURUpL.png",
        "asin": "B07BL6K3S1",
        "affiliate": "https://www.amazon.in/dp/B07BL6K3S1/?tag=mydeals03c-21",
        "category": "Grocery"
    },
    {
        "title": "Tata Tea Premium | Desh Ki Chai | Unique Blend Crafted For Chai Lovers Across India | Black Tea | 1.5kg",
        "price": "₹533",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/61-egYVRN5L._AC_UL320_.jpg",
        "asin": "B08H654828",
        "affiliate": "https://www.amazon.in/dp/B08H654828/?tag=mydeals03c-21",
        "category": "Grocery"
    },
    {
        "title": "Jivo Extra Light Daily Cooking Olive Oil 5 LTR (Tin) + 1 LTR (Pet Bottle) | | Recommendable for Roasting, Frying, Baking All type of Cuisines| Low Saturated Fat, Low Saturated Fat (Pack of 2)",
        "price": "₹2,999",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/71DpptiG0NL._AC_UL320_.jpg",
        "asin": "B092JKPCGP",
        "affiliate": "https://www.amazon.in/dp/B092JKPCGP/?tag=mydeals03c-21",
        "category": "Grocery"
    },
    {
        "title": "Vedaka Premium White Urad Whole, 1kg",
        "price": "₹179",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/31Ip4aURUpL.png",
        "asin": "B07H2SZV43",
        "affiliate": "https://www.amazon.in/dp/B07H2SZV43/?tag=mydeals03c-21",
        "category": "Grocery"
    },
    {
        "title": "GreenFinity Mixed Dry Fruits Pack – 1kg (500g x 2) | Nutritious Snack with Almonds, Cashews, Raisins & Cranberries | Resealable Pack for Freshness",
        "price": "₹572",
        "rating": "3.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/91Ba2na9jYL._AC_UL320_.jpg",
        "asin": "B0F7QC6CKQ",
        "affiliate": "https://www.amazon.in/dp/B0F7QC6CKQ/?tag=mydeals03c-21",
        "category": "Grocery"
    },
    {
        "title": "Beco Natural Disinfectant Surface & Floor Cleaning Liquid | 5 Litre | Non Toxic Germ Kill Formula | Lemongrass & Basil Freshness | Safer than Phenyl | Kids Safe & Pet Friendly Floor Cleaner Liquid",
        "price": "₹499",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/61UKjYbsiiL._AC_UL320_.jpg",
        "asin": "B0CSWJ1LXB",
        "affiliate": "https://www.amazon.in/dp/B0CSWJ1LXB/?tag=mydeals03c-21",
        "category": "Grocery"
    },
    {
        "title": "Surf Excel Matic Front Load Liquid Detergent 5Kg Refill Pouch, Specially designed to remove Tough Dried Stains, 1st time in Washing Machine",
        "price": "₹748",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/616R3X-B5cL._AC_UL320_.jpg",
        "asin": "B0DPX9FBC8",
        "affiliate": "https://www.amazon.in/dp/B0DPX9FBC8/?tag=mydeals03c-21",
        "category": "Grocery"
    },
    {
        "title": "Tata Sampann 100% Chana Dal Fine Besan, Gram Flour, 1 Kg",
        "price": "₹111",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/31Ip4aURUpL.png",
        "asin": "B077X87TTS",
        "affiliate": "https://www.amazon.in/dp/B077X87TTS/?tag=mydeals03c-21",
        "category": "Grocery"
    },
    {
        "title": "Tide Plus Detergent Washing Powder - 8kg Super Saver Pack | Jasmine & Rose Fragrance | 2X Deep Clean Power | World's No. 1 Detergent Brand",
        "price": "₹865",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/31Ip4aURUpL.png",
        "asin": "B079QBSYSX",
        "affiliate": "https://www.amazon.in/dp/B079QBSYSX/?tag=mydeals03c-21",
        "category": "Grocery"
    },
    {
        "title": "Tata Simply Better Pure & Unrefined Cold Pressed Mustard Oil,Naturally Cholesterol Free, 1L, Rich Aroma & Flavour of Real Mustard Seeds, A1 Grade Mustard Seeds",
        "price": "₹247",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/61TJmUT3h1L._AC_UL320_.jpg",
        "asin": "B0C81GZF1H",
        "affiliate": "https://www.amazon.in/dp/B0C81GZF1H/?tag=mydeals03c-21",
        "category": "Grocery"
    },
    {
        "title": "Harpic Disinfectant Bathroom Cleaner Liquid, Lemon - 1 L | India's # 1 Bathroom Cleaner",
        "price": "₹190",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/31Ip4aURUpL.png",
        "asin": "B01HGN96GW",
        "affiliate": "https://www.amazon.in/dp/B01HGN96GW/?tag=mydeals03c-21",
        "category": "Grocery"
    },
    {
        "title": "Del Monte Royal Arabian Fresh Dates 500 g | Healthy Snack | Rich in Potassium | High in Fiber | No Added Sugar| Premium Quality | Dry Fruit",
        "price": "₹149",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/61v8WrtR4iL._AC_UL320_.jpg",
        "asin": "B0C1V5WPC9",
        "affiliate": "https://www.amazon.in/dp/B0C1V5WPC9/?tag=mydeals03c-21",
        "category": "Grocery"
    },
    {
        "title": "Harpic Disinfectant Toilet Cleaner Liquid, Original - 1 L (Pack of 3) | India's # 1 Toilet Cleaner",
        "price": "₹574",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/31Ip4aURUpL.png",
        "asin": "B077MCF1YR",
        "affiliate": "https://www.amazon.in/dp/B077MCF1YR/?tag=mydeals03c-21",
        "category": "Grocery"
    },
    {
        "title": "Dabur Red Paste - India's No.1 Ayurvedic Paste, Provides Protection Plaque Removal, Toothache, Yellow Teeth, Bad Breath- 800g (200gm*4)",
        "price": "₹354",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/81APBzS5IYL._AC_UL320_.jpg",
        "asin": "B07HKXSC6K",
        "affiliate": "https://www.amazon.in/dp/B07HKXSC6K/?tag=mydeals03c-21",
        "category": "Grocery"
    },
    {
        "title": "Patanjali Haldi Chandan Kanti Body Cleanser Soap for Men and Women(150g, Pack of 4), Nourishing & Moisturizing, Natural Aloe Vera Soap for Soft Skin",
        "price": "₹117",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/61lslD-aedL._AC_UL320_.jpg",
        "asin": "B0DX1YLDRT",
        "affiliate": "https://www.amazon.in/dp/B0DX1YLDRT/?tag=mydeals03c-21",
        "category": "Grocery"
    },
    {
        "title": "Liril Lime Bathing Bar | Feel the Citrus Burst of Freshness | Pack of 6 (6 x 125g)",
        "price": "₹231",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/51Sa8svAovL._AC_UL320_.jpg",
        "asin": "B093TJD298",
        "affiliate": "https://www.amazon.in/dp/B093TJD298/?tag=mydeals03c-21",
        "category": "Grocery"
    },
    
    {
        "title": "WALKAROO",
        "price": "₹375",
        "rating": "3.7 out of 5",
        "image": "https://m.media-amazon.com/images/I/5153idsGT3L._AC_UL320_.jpg",
        "asin": "B0FN49598L",
        "affiliate": "https://www.amazon.in/dp/B0FN49598L/?tag=mydeals03c-21",
        "category": "Footwear"
    },
    {
        "title": "DRACKFOOT",
        "price": "₹298",
        "rating": "2.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/51M92AO0T9L._AC_UL320_.jpg",
        "asin": "B0G3PSR2YJ",
        "affiliate": "https://www.amazon.in/dp/B0G3PSR2YJ/?tag=mydeals03c-21",
        "category": "Footwear"
    },
    {
        "title": "WALKAROO",
        "price": "₹419",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/61nm8yoJKoL._AC_UL320_.jpg",
        "asin": "B0CL79XJ7L",
        "affiliate": "https://www.amazon.in/dp/B0CL79XJ7L/?tag=mydeals03c-21",
        "category": "Footwear"
    },
    {
        "title": "Woodland",
        "price": "₹2,698",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/81B-Ep78FWL._AC_UL320_.jpg",
        "asin": "B0BR5SMB7W",
        "affiliate": "https://www.amazon.in/dp/B0BR5SMB7W/?tag=mydeals03c-21",
        "category": "Footwear"
    },
    {
        "title": "DOCTOR EXTRA SOFT",
        "price": "₹494",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/51Qi6jsPskL._AC_UL320_.jpg",
        "asin": "B0BFBRJ351",
        "affiliate": "https://www.amazon.in/dp/B0BFBRJ351/?tag=mydeals03c-21",
        "category": "Footwear"
    },
    {
        "title": "Flow Feet",
        "price": "₹299",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/71R2TkiR3NL._AC_UL320_.jpg",
        "asin": "B0GN2QFPMD",
        "affiliate": "https://www.amazon.in/dp/B0GN2QFPMD/?tag=mydeals03c-21",
        "category": "Footwear"
    },
    {
        "title": "Liberty",
        "price": "₹349",
        "rating": "3.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/51eWVlXLFuL._AC_UL320_.jpg",
        "asin": "B0BM5QMGLF",
        "affiliate": "https://www.amazon.in/dp/B0BM5QMGLF/?tag=mydeals03c-21",
        "category": "Footwear"
    },
    {
        "title": "SPARX",
        "price": "₹727",
        "rating": "3.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/71cctoYFQsL._AC_UL320_.jpg",
        "asin": "B09BJXJT36",
        "affiliate": "https://www.amazon.in/dp/B09BJXJT36/?tag=mydeals03c-21",
        "category": "Footwear"
    },
    {
        "title": "Bata",
        "price": "₹499",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/51ejDqSmFlL._AC_UL320_.jpg",
        "asin": "B095X59LF4",
        "affiliate": "https://www.amazon.in/dp/B095X59LF4/?tag=mydeals03c-21",
        "category": "Footwear"
    },
    {
        "title": "GENERIC",
        "price": "₹299",
        "rating": "5.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/41nzAguCAmL._AC_UL320_.jpg",
        "asin": "B0GT4XVXFC",
        "affiliate": "https://www.amazon.in/dp/B0GT4XVXFC/?tag=mydeals03c-21",
        "category": "Footwear"
    },
    {
        "title": "YOHO Hacker Clogs for Men | Trendy & Stylish Sandals| Lightweight & Cushioned Footwear",
        "price": "₹792",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/71FHm3o57lL._AC_UL640_QL65_.jpg",
        "asin": "B0DZ6PN9SV",
        "affiliate": "https://www.amazon.in/dp/B0DZ6PN9SV/?tag=mydeals03c-21",
        "category": "Footwear"
    },
    {
        "title": "Bata",
        "price": "₹649",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/51s8-iTI3NL._AC_UL320_.jpg",
        "asin": "B09W5GKP3F",
        "affiliate": "https://www.amazon.in/dp/B09W5GKP3F/?tag=mydeals03c-21",
        "category": "Footwear"
    },
    {
        "title": "Bata",
        "price": "₹599",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/61CzK5VUjHL._AC_UL320_.jpg",
        "asin": "B0B7JP7RDX",
        "affiliate": "https://www.amazon.in/dp/B0B7JP7RDX/?tag=mydeals03c-21",
        "category": "Footwear"
    },
    {
        "title": "SPARX",
        "price": "₹619",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/61aA9wz1ZEL._AC_UL320_.jpg",
        "asin": "B072C9FY8S",
        "affiliate": "https://www.amazon.in/dp/B072C9FY8S/?tag=mydeals03c-21",
        "category": "Footwear"
    },
    {
        "title": "GENERIC",
        "price": "₹229",
        "rating": "3.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/51hmXQ3rIOL._AC_UL320_.jpg",
        "asin": "B0F143DFWZ",
        "affiliate": "https://www.amazon.in/dp/B0F143DFWZ/?tag=mydeals03c-21",
        "category": "Footwear"
    },
    {
        "title": "SPARX",
        "price": "₹294",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/61dgP8XDIoL._AC_UL320_.jpg",
        "asin": "B00IZ932WG",
        "affiliate": "https://www.amazon.in/dp/B00IZ932WG/?tag=mydeals03c-21",
        "category": "Footwear"
    },
    {
        "title": "SPARX",
        "price": "₹261",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/61hzO3dROKL._AC_UL320_.jpg",
        "asin": "B00IZ935OG",
        "affiliate": "https://www.amazon.in/dp/B00IZ935OG/?tag=mydeals03c-21",
        "category": "Footwear"
    },
    {
        "title": "HotStyle",
        "price": "₹299",
        "rating": "2.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/51zN65yHCEL._AC_UL320_.jpg",
        "asin": "B0F3D44D91",
        "affiliate": "https://www.amazon.in/dp/B0F3D44D91/?tag=mydeals03c-21",
        "category": "Footwear"
    },
    {
        "title": "WALKAROO",
        "price": "₹415",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/51chlFuZZeL._AC_UL320_.jpg",
        "asin": "B0GXFPY64L",
        "affiliate": "https://www.amazon.in/dp/B0GXFPY64L/?tag=mydeals03c-21",
        "category": "Footwear"
    },
    {
        "title": "Max",
        "price": "₹749",
        "rating": "4.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/41Bd8O8UOzL._AC_UL320_.jpg",
        "asin": "B0DTGFR3NZ",
        "affiliate": "https://www.amazon.in/dp/B0DTGFR3NZ/?tag=mydeals03c-21",
        "category": "Footwear"
    },
    {
        "title": "HotStyle",
        "price": "₹299",
        "rating": "3.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/51hSlt1CEhL._AC_UL320_.jpg",
        "asin": "B0G5PDDC5H",
        "affiliate": "https://www.amazon.in/dp/B0G5PDDC5H/?tag=mydeals03c-21",
        "category": "Footwear"
    },
    {
        "title": "Bata",
        "price": "₹998",
        "rating": "3.7 out of 5",
        "image": "https://m.media-amazon.com/images/I/51WOk5Gij7L._AC_UL320_.jpg",
        "asin": "B08VJG37YK",
        "affiliate": "https://www.amazon.in/dp/B08VJG37YK/?tag=mydeals03c-21",
        "category": "Footwear"
    },
    {
        "title": "HotStyle",
        "price": "₹259",
        "rating": "5.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/51mi9ACFfBL._AC_UL320_.jpg",
        "asin": "B0GNHL2JPF",
        "affiliate": "https://www.amazon.in/dp/B0GNHL2JPF/?tag=mydeals03c-21",
        "category": "Footwear"
    },
    {
        "title": "Bata",
        "price": "₹269",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/51QMSR9a9lL._AC_UL320_.jpg",
        "asin": "B09W5XCMWV",
        "affiliate": "https://www.amazon.in/dp/B09W5XCMWV/?tag=mydeals03c-21",
        "category": "Footwear"
    },
    {
        "title": "Bata",
        "price": "₹649",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/81t3XGmXkhL._AC_UL320_.jpg",
        "asin": "B0B2S2N5MH",
        "affiliate": "https://www.amazon.in/dp/B0B2S2N5MH/?tag=mydeals03c-21",
        "category": "Footwear"
    },
    {
        "title": "Centrino",
        "price": "₹799",
        "rating": "3.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/71F-bnRFV2L._AC_UL320_.jpg",
        "asin": "B0D1VH3YLJ",
        "affiliate": "https://www.amazon.in/dp/B0D1VH3YLJ/?tag=mydeals03c-21",
        "category": "Footwear"
    },
    {
        "title": "CLYMB",
        "price": "₹399",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/61pnwjryPxL._AC_UL320_.jpg",
        "asin": "B0G7D3CSKQ",
        "affiliate": "https://www.amazon.in/dp/B0G7D3CSKQ/?tag=mydeals03c-21",
        "category": "Footwear"
    },
    {
        "title": "Bata",
        "price": "₹449",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/51vaGOSeC2L._AC_UL320_.jpg",
        "asin": "B091Q74F5N",
        "affiliate": "https://www.amazon.in/dp/B091Q74F5N/?tag=mydeals03c-21",
        "category": "Footwear"
    },
    {
        "title": "Red Tape",
        "price": "₹549",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/71PenfVqjqL._AC_UL320_.jpg",
        "asin": "B0CSWN33CZ",
        "affiliate": "https://www.amazon.in/dp/B0CSWN33CZ/?tag=mydeals03c-21",
        "category": "Footwear"
    },
    {
        "title": "Bata",
        "price": "₹299",
        "rating": "3.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/71sUjiG7w0L._AC_UL320_.jpg",
        "asin": "B0GSVYSJ9G",
        "affiliate": "https://www.amazon.in/dp/B0GSVYSJ9G/?tag=mydeals03c-21",
        "category": "Footwear"
    },
    {
        "title": "Bata",
        "price": "₹276",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/519XD0LKSzL._AC_UL320_.jpg",
        "asin": "B095X1QN4Q",
        "affiliate": "https://www.amazon.in/dp/B095X1QN4Q/?tag=mydeals03c-21",
        "category": "Footwear"
    },
    {
        "title": "CANVI - TAKE CHANGE TO MAKE CHANGE",
        "price": "₹499",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/61ZLrNSnihL._AC_UL320_.jpg",
        "asin": "B09RPVKCSP",
        "affiliate": "https://www.amazon.in/dp/B09RPVKCSP/?tag=mydeals03c-21",
        "category": "Footwear"
    },
    {
        "title": "Vendoz",
        "price": "₹439",
        "rating": "3.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/51qbe3vwKyL._AC_UL320_.jpg",
        "asin": "B0FJ2PZW8J",
        "affiliate": "https://www.amazon.in/dp/B0FJ2PZW8J/?tag=mydeals03c-21",
        "category": "Footwear"
    },
    {
        "title": "DRACKFOOT",
        "price": "₹273",
        "rating": "2.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/61c0r-YspzL._AC_UL320_.jpg",
        "asin": "B0G3PSQFPR",
        "affiliate": "https://www.amazon.in/dp/B0G3PSQFPR/?tag=mydeals03c-21",
        "category": "Footwear"
    },
    {
        "title": "WALKAROO",
        "price": "₹299",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/713fmh5yKEL._AC_UL320_.jpg",
        "asin": "B0G921CDDW",
        "affiliate": "https://www.amazon.in/dp/B0G921CDDW/?tag=mydeals03c-21",
        "category": "Footwear"
    },
    {
        "title": "Mochi",
        "price": "₹1,075",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/713o9x-8dUL._AC_UL320_.jpg",
        "asin": "B0BM7Y17XQ",
        "affiliate": "https://www.amazon.in/dp/B0BM7Y17XQ/?tag=mydeals03c-21",
        "category": "Footwear"
    },
    {
        "title": "SPARX",
        "price": "₹294",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/61dgP8XDIoL._AC_UL320_.jpg",
        "asin": "B00IZ933FM",
        "affiliate": "https://www.amazon.in/dp/B00IZ933FM/?tag=mydeals03c-21",
        "category": "Footwear"
    },
    {
        "title": "Bata",
        "price": "₹449",
        "rating": "3.7 out of 5",
        "image": "https://m.media-amazon.com/images/I/51zA3Xl-12L._AC_UL320_.jpg",
        "asin": "B00SWEFA1U",
        "affiliate": "https://www.amazon.in/dp/B00SWEFA1U/?tag=mydeals03c-21",
        "category": "Footwear"
    },
    {
        "title": "Bata",
        "price": "₹369",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/51QuHNYZYbL._AC_UL320_.jpg",
        "asin": "B08XB8TM3V",
        "affiliate": "https://www.amazon.in/dp/B08XB8TM3V/?tag=mydeals03c-21",
        "category": "Footwear"
    },
    {
        "title": "Centrino",
        "price": "₹799",
        "rating": "3.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/61LeRV26ylL._AC_UL320_.jpg",
        "asin": "B0DCK5MV31",
        "affiliate": "https://www.amazon.in/dp/B0DCK5MV31/?tag=mydeals03c-21",
        "category": "Footwear"
    },
    {
        "title": "GENERIC",
        "price": "₹259",
        "rating": "2.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/51hmXQ3rIOL._AC_UL320_.jpg",
        "asin": "B0GMJXH37Z",
        "affiliate": "https://www.amazon.in/dp/B0GMJXH37Z/?tag=mydeals03c-21",
        "category": "Footwear"
    },
    {
        "title": "Shoetopia",
        "price": "₹600",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/51J+9FrvecL._AC_UL320_.jpg",
        "asin": "B0D2TV9PCS",
        "affiliate": "https://www.amazon.in/dp/B0D2TV9PCS/?tag=mydeals03c-21",
        "category": "Footwear"
    },
    {
        "title": "Centrino",
        "price": "₹699",
        "rating": "3.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/71eSmlEhIrL._AC_UL320_.jpg",
        "asin": "B0CCJT2LMD",
        "affiliate": "https://www.amazon.in/dp/B0CCJT2LMD/?tag=mydeals03c-21",
        "category": "Footwear"
    },
    {
        "title": "Bata",
        "price": "₹602",
        "rating": "3.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/51Qfj6dYJlL._AC_UL320_.jpg",
        "asin": "B09QQMM676",
        "affiliate": "https://www.amazon.in/dp/B09QQMM676/?tag=mydeals03c-21",
        "category": "Footwear"
    },
    {
        "title": "Bata",
        "price": "₹459",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/518DIMXsr3L._AC_UL320_.jpg",
        "asin": "B0C679GBHH",
        "affiliate": "https://www.amazon.in/dp/B0C679GBHH/?tag=mydeals03c-21",
        "category": "Footwear"
    },
    {
        "title": "Hygear",
        "price": "₹333",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/61pBOCruYNL._AC_UL320_.jpg",
        "asin": "B0C6XDKLMM",
        "affiliate": "https://www.amazon.in/dp/B0C6XDKLMM/?tag=mydeals03c-21",
        "category": "Footwear"
    },
    {
        "title": "JOSMOS",
        "price": "₹539",
        "rating": "3.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/51jB3DzHjOL._AC_UL320_.jpg",
        "asin": "B0FNMRTDPL",
        "affiliate": "https://www.amazon.in/dp/B0FNMRTDPL/?tag=mydeals03c-21",
        "category": "Footwear"
    },
    {
        "title": "YOHO",
        "price": "₹659",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/51qI3GOScgL._AC_UL320_.jpg",
        "asin": "B09X5P9MRL",
        "affiliate": "https://www.amazon.in/dp/B09X5P9MRL/?tag=mydeals03c-21",
        "category": "Footwear"
    },
    {
        "title": "Centrino",
        "price": "₹849",
        "rating": "3.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/81YGP5ZLhPL._AC_UL320_.jpg",
        "asin": "B08C39TTF4",
        "affiliate": "https://www.amazon.in/dp/B08C39TTF4/?tag=mydeals03c-21",
        "category": "Footwear"
    },
       {
        "title": "Waterproof Casual Backpack for Girls & Women Stylish Trendy School and College Bag 17\" x 12\" Durable Daily Use Black",
        "price": "₹273",
        "rating": "3.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/31v1C488LwL._AC_UY218_.jpg",
        "asin": "B0GKVQD2W2",
        "affiliate": "https://www.amazon.in/dp/B0GKVQD2W2/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Aristocrat Nova 15L Laptop Backpack for Men & Women with Bottle Pocket | Padded Shoulder Straps, Multi Compartments | Travel & College Bag | Dark Black",
        "price": "₹349",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/71aYGrOy6gL._AC_UY218_.jpg",
        "asin": "B0D8BG7S4P",
        "affiliate": "https://www.amazon.in/dp/B0D8BG7S4P/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "PrettyKrafts 45L Non Woven Wave Printed Round Foldable Large Laundry Bag/Basket With Handle, Freestanding Cloth Storage Organizer for Bedroom, Bathroom (36x36x45cm, Black & White, Set of 1)",
        "price": "₹169",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/71xiEY0q9lL._AC_UY218_.jpg",
        "asin": "B07WW1DTZF",
        "affiliate": "https://www.amazon.in/dp/B07WW1DTZF/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Safari Omega spacious/large laptop backpack with Raincover, college bag, travel bag for men and women, Black, 30 Litre",
        "price": "₹649",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/71maWXZscfL._AC_UY218_.jpg",
        "asin": "B097JJ2CK6",
        "affiliate": "https://www.amazon.in/dp/B097JJ2CK6/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Medium 35L Durable Fancy Modern Unisex School Bag,Ofice Bag,Travel Bag,Cabin Bag And Luggage Bag(Black Tiranga)",
        "price": "₹299",
        "rating": "5.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/51XVyVOm2oL._AC_UY218_.jpg",
        "asin": "B0GW11SSRD",
        "affiliate": "https://www.amazon.in/dp/B0GW11SSRD/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Aristocrat Lava 17 Inch Compatible Laptop Backpack 25L | Premium Durable Fabric | 2 Compartments with Side Bottle Pocket | Padded Backpanel | Office & Travel Backpack for Men & Women",
        "price": "₹427",
        "rating": "3.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/71nXs0aNQSL._AC_UY218_.jpg",
        "asin": "B0FMY7DLJT",
        "affiliate": "https://www.amazon.in/dp/B0FMY7DLJT/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Aristocrat Nova 15L Laptop Backpack for Men & Women with Bottle Pocket | Padded Shoulder Straps, Multi Compartments | Travel & College Bag | Dark Blue",
        "price": "₹349",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/61chxvJ9RdL._AC_UY218_.jpg",
        "asin": "B0FPWJX447",
        "affiliate": "https://www.amazon.in/dp/B0FPWJX447/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "GLUN® Round Laundry Bag, Gray & Black Foldable Waterproof 45 Liter Capacity, Non-Woven Toys & Cloth Storage Bag Pack Of 1",
        "price": "₹145",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/61eKCPhnXYL._AC_UY218_.jpg",
        "asin": "B0BRFRVQMX",
        "affiliate": "https://www.amazon.in/dp/B0BRFRVQMX/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "FUR JADEN Anti Theft Number Lock Backpack Bag with 15.6 Inch Laptop Compartment, USB Charging Port & Organizer Pocket for Men Women Boys Girls",
        "price": "₹699",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/71PRQKJNdHL._AC_UY218_.jpg",
        "asin": "B09VTCNN75",
        "affiliate": "https://www.amazon.in/dp/B09VTCNN75/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "ProArch Backpack Purse for Women Leather | Stylish Ladies Shoulder Backpack Bag for Office, College, Travel & Shopping | Birthday Gift for Sister, Mom & Wife",
        "price": "₹899",
        "rating": "3.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/81xoOAcC-CL._AC_UL640_QL65_.jpg",
        "asin": "B0FPR5F46C",
        "affiliate": "https://www.amazon.in/dp/B0FPR5F46C/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Large Capacity Waterproof Backpack, Lightweight Travel Laptop Bag with Multiple Compartments, Black School Office Shoulder Bag",
        "price": "₹499",
        "rating": "2.7 out of 5",
        "image": "https://m.media-amazon.com/images/I/313QdeKraYL._AC_UY218_.jpg",
        "asin": "B0FQTVLFKF",
        "affiliate": "https://www.amazon.in/dp/B0FQTVLFKF/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Wesley Spartan Unisex Travel Hiking Laptop Bag fits Upto 17.3 inch with Raincover and Internal Organiser Backpack Rucksack College Backpack",
        "price": "₹748",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/810b7vGgpkL._AC_UY218_.jpg",
        "asin": "B0D5QTFT2T",
        "affiliate": "https://www.amazon.in/dp/B0D5QTFT2T/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "IRMAO 2021 New Flower Embroidered Artistic National Style Oxford Small Capacity Women's Bag Generation Backpack",
        "price": "₹499",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/61hre5NAPiL._AC_UY218_.jpg",
        "asin": "B09NNG1P81",
        "affiliate": "https://www.amazon.in/dp/B09NNG1P81/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Safari Omega Spacious/Large 5 Compartment Laptop Backpack With Raincover, College Bag, Travel Bag For Unisex, Navy Blue, 30 Litre",
        "price": "₹619",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/81Fbfx0fpuL._AC_UY218_.jpg",
        "asin": "B097LC1DJ6",
        "affiliate": "https://www.amazon.in/dp/B097LC1DJ6/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Safari Hitech Large Size 35 Ltrs Water Resistant Standard 4 Compartment Backpack - Black",
        "price": "₹899",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/61I6joqxQPL._AC_UY218_.jpg",
        "asin": "B09B267161",
        "affiliate": "https://www.amazon.in/dp/B09B267161/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Safari Omega Spacious/Large 5 Compartment Laptop Backpack With Raincover, College Bag, Travel Bag For Unisex, Teal, 30 Litre",
        "price": "₹649",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/71XqKCamGaL._AC_UY218_.jpg",
        "asin": "B097JH4V5G",
        "affiliate": "https://www.amazon.in/dp/B097JH4V5G/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Umadiya Womens Large Capacity Folding Travel Tote Bag|Oxford Fabric Waterproof Lightweight Foldable Duffel Bag Portable Expandable Travel Bag|Dry And Wet Carry On Bag(Colors As Per Stock),White",
        "price": "₹348",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/61uZljHgEBL._AC_UY218_.jpg",
        "asin": "B0CQK4B9PY",
        "affiliate": "https://www.amazon.in/dp/B0CQK4B9PY/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "VISMIINTREND Backpack Bags for Women & Girls | Stylish,Office,College,Travel,Tuition Use | Rakhi Gifts for Sisters/Bhabhi | Birthday Gift for Wife/Girl | Trendy, Hand,Shoulder,Sling Bag | Ladies Bags",
        "price": "₹1,399",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/71Ycs383U+L._AC_UL640_QL65_.jpg",
        "asin": "B0CXQ49RPJ",
        "affiliate": "https://www.amazon.in/dp/B0CXQ49RPJ/?tag=mydeals03c-21",
        "category": "Bags"
    },
      {
        "title": "Shining Diva Fashion",
        "price": "₹299",
        "rating": "3.7 out of 5",
        "image": "https://m.media-amazon.com/images/I/713ZDAwhQuL._AC_UL320_.jpg",
        "asin": "B0DYVPP86H",
        "affiliate": "https://www.amazon.in/dp/B0DYVPP86H/?tag=mydeals03c-21",
        "category": "Jewellery"
    },
    {
        "title": "Sukkhi",
        "price": "₹316",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/71Lo2RqdZKL._AC_UL320_.jpg",
        "asin": "B0FB46QM2X",
        "affiliate": "https://www.amazon.in/dp/B0FB46QM2X/?tag=mydeals03c-21",
        "category": "Jewellery"
    },
    {
        "title": "YouBella",
        "price": "₹177",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/71P8z0DrFRL._AC_UL320_.jpg",
        "asin": "B071CMQ6N2",
        "affiliate": "https://www.amazon.in/dp/B071CMQ6N2/?tag=mydeals03c-21",
        "category": "Jewellery"
    },
    {
        "title": "Clara",
        "price": "₹2,184",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/41Y9X0BRpAL._AC_UL320_.jpg",
        "asin": "B079MB3VCJ",
        "affiliate": "https://www.amazon.in/dp/B079MB3VCJ/?tag=mydeals03c-21",
        "category": "Jewellery"
    },
    {
        "title": "Shining Diva Fashion",
        "price": "₹299",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/71R2QnSdv+L._AC_UL320_.jpg",
        "asin": "B0D3DCP7JQ",
        "affiliate": "https://www.amazon.in/dp/B0D3DCP7JQ/?tag=mydeals03c-21",
        "category": "Jewellery"
    },
    {
        "title": "Shining Diva Fashion",
        "price": "₹315",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/81vLw-6u5NL._AC_UL320_.jpg",
        "asin": "B08L13PPNS",
        "affiliate": "https://www.amazon.in/dp/B08L13PPNS/?tag=mydeals03c-21",
        "category": "Jewellery"
    },
    {
        "title": "ZENEME",
        "price": "₹239",
        "rating": "3.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/51iszhAlVkL._AC_UL320_.jpg",
        "asin": "B0BFN3P659",
        "affiliate": "https://www.amazon.in/dp/B0BFN3P659/?tag=mydeals03c-21",
        "category": "Jewellery"
    },
    {
        "title": "Shining Diva Fashion",
        "price": "₹599",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/81C+3Hz9emL._AC_UL320_.jpg",
        "asin": "B0C4TDNPRZ",
        "affiliate": "https://www.amazon.in/dp/B0C4TDNPRZ/?tag=mydeals03c-21",
        "category": "Jewellery"
    },
    {
        "title": "Shining Diva Fashion",
        "price": "₹499",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/61-Pjc6MqXL._AC_UL320_.jpg",
        "asin": "B0CV4YFLBR",
        "affiliate": "https://www.amazon.in/dp/B0CV4YFLBR/?tag=mydeals03c-21",
        "category": "Jewellery"
    },
    {
        "title": "Shining Diva Fashion",
        "price": "₹399",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/61jI8OEddbL._AC_UL320_.jpg",
        "asin": "B0756YR9LG",
        "affiliate": "https://www.amazon.in/dp/B0756YR9LG/?tag=mydeals03c-21",
        "category": "Jewellery"
    },
    {
        "title": "Sukkhi",
        "price": "₹254",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/71vIqsskd2L._AC_UL320_.jpg",
        "asin": "B0FB47SJMB",
        "affiliate": "https://www.amazon.in/dp/B0FB47SJMB/?tag=mydeals03c-21",
        "category": "Jewellery"
    },
    {
        "title": "ZENEME",
        "price": "₹629",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/71ooQyvpGCL._AC_UL320_.jpg",
        "asin": "B0C1V48SCX",
        "affiliate": "https://www.amazon.in/dp/B0C1V48SCX/?tag=mydeals03c-21",
        "category": "Jewellery"
    },
    {
        "title": "KEYMAX",
        "price": "₹209",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/71Y44QANv-L._AC_UL320_.jpg",
        "asin": "B0GQG75VFH",
        "affiliate": "https://www.amazon.in/dp/B0GQG75VFH/?tag=mydeals03c-21",
        "category": "Jewellery"
    },
    {
        "title": "ISHTAARA",
        "price": "₹299",
        "rating": "3.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/610XzjEODZL._AC_UL320_.jpg",
        "asin": "B0GTDVDL6P",
        "affiliate": "https://www.amazon.in/dp/B0GTDVDL6P/?tag=mydeals03c-21",
        "category": "Jewellery"
    },
    {
        "title": "GIVA",
        "price": "₹1,673",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/514yeFMU+0L._AC_UL320_.jpg",
        "asin": "B0CJVBLMR6",
        "affiliate": "https://www.amazon.in/dp/B0CJVBLMR6/?tag=mydeals03c-21",
        "category": "Jewellery"
    },
    {
        "title": "Fashion Frill",
        "price": "₹299",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/71NXGfCQM4L._AC_UL320_.jpg",
        "asin": "B0CW9YPK9L",
        "affiliate": "https://www.amazon.in/dp/B0CW9YPK9L/?tag=mydeals03c-21",
        "category": "Jewellery"
    },
    {
        "title": "GIVA",
        "price": "₹10,439",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/61qGyxdm1tL._AC_UL320_.jpg",
        "asin": "B0BT7J3C3F",
        "affiliate": "https://www.amazon.in/dp/B0BT7J3C3F/?tag=mydeals03c-21",
        "category": "Jewellery"
    },
    {
        "title": "Sri Jagdamba Pearls Dealer",
        "price": "₹1,999",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/51M1HeTQ02L._AC_UL320_.jpg",
        "asin": "B00FLNWZM2",
        "affiliate": "https://www.amazon.in/dp/B00FLNWZM2/?tag=mydeals03c-21",
        "category": "Jewellery"
    },
    {
        "title": "ANKRI",
        "price": "₹199",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/810ucogQzeL._AC_UL320_.jpg",
        "asin": "B0GVFDWY5X",
        "affiliate": "https://www.amazon.in/dp/B0GVFDWY5X/?tag=mydeals03c-21",
        "category": "Jewellery"
    },
    {
        "title": "YouBella",
        "price": "₹227",
        "rating": "3.7 out of 5",
        "image": "https://m.media-amazon.com/images/I/610kKHwQM8L._AC_UL320_.jpg",
        "asin": "B0D873HJTT",
        "affiliate": "https://www.amazon.in/dp/B0D873HJTT/?tag=mydeals03c-21",
        "category": "Jewellery"
    },
    {
        "title": "Atasi International",
        "price": "₹299",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/717FdzlctpL._AC_UL320_.jpg",
        "asin": "B0CVV1799Z",
        "affiliate": "https://www.amazon.in/dp/B0CVV1799Z/?tag=mydeals03c-21",
        "category": "Jewellery"
    },
    {
        "title": "MEENAZ",
        "price": "₹204",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/61YkmNVTTSL._AC_UL320_.jpg",
        "asin": "B0DRS7PV8Y",
        "affiliate": "https://www.amazon.in/dp/B0DRS7PV8Y/?tag=mydeals03c-21",
        "category": "Jewellery"
    },
    {
        "title": "Shining Diva Fashion",
        "price": "₹299",
        "rating": "3.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/71UCk9VMVrL._AC_UL320_.jpg",
        "asin": "B0C1N366XM",
        "affiliate": "https://www.amazon.in/dp/B0C1N366XM/?tag=mydeals03c-21",
        "category": "Jewellery"
    },
    {
        "title": "Yellow Chimes",
        "price": "₹229",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/51wj1q5oA0L._AC_UL320_.jpg",
        "asin": "B0B5LGY67X",
        "affiliate": "https://www.amazon.in/dp/B0B5LGY67X/?tag=mydeals03c-21",
        "category": "Jewellery"
    },
    {
        "title": "Shining Diva Fashion",
        "price": "₹299",
        "rating": "3.7 out of 5",
        "image": "https://m.media-amazon.com/images/I/61Emq89LIUL._AC_UL320_.jpg",
        "asin": "B0D3DDQH3T",
        "affiliate": "https://www.amazon.in/dp/B0D3DDQH3T/?tag=mydeals03c-21",
        "category": "Jewellery"
    },
    {
        "title": "SEKOU",
        "price": "₹249",
        "rating": "3.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/61X8rHMGamL._AC_UL320_.jpg",
        "asin": "B0GDFG92CW",
        "affiliate": "https://www.amazon.in/dp/B0GDFG92CW/?tag=mydeals03c-21",
        "category": "Jewellery"
    },
    {
        "title": "Shining Diva Fashion",
        "price": "₹281",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/61XmlqLOduL._AC_UL320_.jpg",
        "asin": "B0CXQ41KD4",
        "affiliate": "https://www.amazon.in/dp/B0CXQ41KD4/?tag=mydeals03c-21",
        "category": "Jewellery"
    },
    {
        "title": "KEYMAX",
        "price": "₹619",
        "rating": "3.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/71r2PDfPPoL._AC_UL320_.jpg",
        "asin": "B0GQGM9SGM",
        "affiliate": "https://www.amazon.in/dp/B0GQGM9SGM/?tag=mydeals03c-21",
        "category": "Jewellery"
    },
    {
        "title": "Shining Diva Fashion",
        "price": "₹299",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/617BH0hUF1L._AC_UL320_.jpg",
        "asin": "B0B15GYNS4",
        "affiliate": "https://www.amazon.in/dp/B0B15GYNS4/?tag=mydeals03c-21",
        "category": "Jewellery"
    },
    {
        "title": "Sukkhi",
        "price": "₹398",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/71YXlhrKVVL._AC_UL320_.jpg",
        "asin": "B0CBC1MGKJ",
        "affiliate": "https://www.amazon.in/dp/B0CBC1MGKJ/?tag=mydeals03c-21",
        "category": "Jewellery"
    },
    {
        "title": "Cerrito",
        "price": "₹149",
        "rating": "3.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/61zL5N+6fsL._AC_UL320_.jpg",
        "asin": "B0FRSQGM12",
        "affiliate": "https://www.amazon.in/dp/B0FRSQGM12/?tag=mydeals03c-21",
        "category": "Jewellery"
    },
    {
        "title": "ZAVERI PEARLS",
        "price": "₹410",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/71eaAiL-wjL._AC_UL320_.jpg",
        "asin": "B07Q538CC5",
        "affiliate": "https://www.amazon.in/dp/B07Q538CC5/?tag=mydeals03c-21",
        "category": "Jewellery"
    },
    {
        "title": "Rubans",
        "price": "₹799",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/71WObmkeDyL._AC_UL320_.jpg",
        "asin": "B0D6GBLYNP",
        "affiliate": "https://www.amazon.in/dp/B0D6GBLYNP/?tag=mydeals03c-21",
        "category": "Jewellery"
    },
    {
        "title": "Shining Diva Fashion",
        "price": "₹498",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/71rDTCqTo3L._AC_UL320_.jpg",
        "asin": "B0CRB914VD",
        "affiliate": "https://www.amazon.in/dp/B0CRB914VD/?tag=mydeals03c-21",
        "category": "Jewellery"
    },
    {
        "title": "Sprqcart",
        "price": "₹998",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/61aTyq5vbuL._AC_UL320_.jpg",
        "asin": "B0FKTMYJN2",
        "affiliate": "https://www.amazon.in/dp/B0FKTMYJN2/?tag=mydeals03c-21",
        "category": "Jewellery"
    },
    {
        "title": "GIVA",
        "price": "₹7,019",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/41-T8+9wbpL._AC_UL320_.jpg",
        "asin": "B0CMTW9GN1",
        "affiliate": "https://www.amazon.in/dp/B0CMTW9GN1/?tag=mydeals03c-21",
        "category": "Jewellery"
    },
    {
        "title": "DIKSHA COLLECTION",
        "price": "₹499",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/71PFEL-qGoL._AC_UL320_.jpg",
        "asin": "B0GVTBJ33Y",
        "affiliate": "https://www.amazon.in/dp/B0GVTBJ33Y/?tag=mydeals03c-21",
        "category": "Jewellery"
    },
    {
        "title": "GIVA",
        "price": "₹2,000",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/51kYmR1xvJL._AC_UL320_.jpg",
        "asin": "B0BBW8LKJ4",
        "affiliate": "https://www.amazon.in/dp/B0BBW8LKJ4/?tag=mydeals03c-21",
        "category": "Jewellery"
    },
    {
        "title": "YouBella",
        "price": "₹345",
        "rating": "3.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/61hMMT+72SL._AC_UL320_.jpg",
        "asin": "B07LH5JMHQ",
        "affiliate": "https://www.amazon.in/dp/B07LH5JMHQ/?tag=mydeals03c-21",
        "category": "Jewellery"
    },
    {
        "title": "ZAVERI PEARLS",
        "price": "₹498",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/713cJ24cXNL._AC_UL320_.jpg",
        "asin": "B0CZXTDT1G",
        "affiliate": "https://www.amazon.in/dp/B0CZXTDT1G/?tag=mydeals03c-21",
        "category": "Jewellery"
    },
    {
        "title": "GIVA",
        "price": "₹1,600",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/51aIvHyXPiL._AC_UL320_.jpg",
        "asin": "B0BYZG691R",
        "affiliate": "https://www.amazon.in/dp/B0BYZG691R/?tag=mydeals03c-21",
        "category": "Jewellery"
    },
    {
        "title": "ANKRI",
        "price": "₹199",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/713jnhKVsZL._AC_UL320_.jpg",
        "asin": "B0GVFJTPQ2",
        "affiliate": "https://www.amazon.in/dp/B0GVFJTPQ2/?tag=mydeals03c-21",
        "category": "Jewellery"
    },
    {
        "title": "Sukkhi",
        "price": "₹163",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/71MpKeU8XSL._AC_UL320_.jpg",
        "asin": "B0FB45HLKZ",
        "affiliate": "https://www.amazon.in/dp/B0FB45HLKZ/?tag=mydeals03c-21",
        "category": "Jewellery"
    },
    {
        "title": "Shining Diva Fashion",
        "price": "₹699",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/61E8ZN+K+5L._AC_UL320_.jpg",
        "asin": "B0F9WQ873F",
        "affiliate": "https://www.amazon.in/dp/B0F9WQ873F/?tag=mydeals03c-21",
        "category": "Jewellery"
    },
    {
        "title": "Shining Diva Fashion",
        "price": "₹299",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/51zqJUDBnWL._AC_UL320_.jpg",
        "asin": "B0CNH38J1K",
        "affiliate": "https://www.amazon.in/dp/B0CNH38J1K/?tag=mydeals03c-21",
        "category": "Jewellery"
    },
    {
        "title": "DIKSHA COLLECTION",
        "price": "₹399",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/51sav6icTiL._AC_UL320_.jpg",
        "asin": "B0GFWB2Z4W",
        "affiliate": "https://www.amazon.in/dp/B0GFWB2Z4W/?tag=mydeals03c-21",
        "category": "Jewellery"
    },
    {
        "title": "Clara",
        "price": "₹2,849",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/51sR7Zq4wkL._AC_UL320_.jpg",
        "asin": "B07JJ2D8QM",
        "affiliate": "https://www.amazon.in/dp/B07JJ2D8QM/?tag=mydeals03c-21",
        "category": "Jewellery"
    },
    {
        "title": "MEENAZ",
        "price": "₹284",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/51YU60HM7DL._AC_UL320_.jpg",
        "asin": "B0BY5FGBDK",
        "affiliate": "https://www.amazon.in/dp/B0BY5FGBDK/?tag=mydeals03c-21",
        "category": "Jewellery"
    },
    
    {
        "title": "Glamveda Korean 7 Step Winter Skincare Kit for Women | Rice & Ceramide Routine | Gift Box | Skin Brightening, Anti-Ageing | Face Wash + Toner + Moisturizer + Serum + Mask + Sunscreen+ Under Eye Cream",
        "price": "₹832",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/61Vr0i7spvL._AC_UL320_.jpg",
        "asin": "B0C93R3JN9",
        "affiliate": "https://www.amazon.in/dp/B0C93R3JN9/?tag=mydeals03c-21",
        "category": "Skincare"
    },
    {
        "title": "Foxtale Glow On Heartbeat Skincare Gift Set | Hydrating Cleanser, 12% Niacinamide serum, Super Glow moisturizer & SPF 50 Glow sunscreen | Travel-Friendly Kit for Radiant skin | For Men & Women",
        "price": "₹560",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/719jDZfBPfL._AC_UL320_.jpg",
        "asin": "B0FKT2BYDQ",
        "affiliate": "https://www.amazon.in/dp/B0FKT2BYDQ/?tag=mydeals03c-21",
        "category": "Skincare"
    },
    {
        "title": "Glamveda Glutathione Skin Brightening | Face Wash, Peel-Off Mask, Serum, Cream, Sunscreen & Under Eye Cream | 6-Step Skincare Kit for Even-Toned Radiant Glow",
        "price": "₹770",
        "rating": "4.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/61qIn+0+BLL._AC_UL320_.jpg",
        "asin": "B0GMR1Z97L",
        "affiliate": "https://www.amazon.in/dp/B0GMR1Z97L/?tag=mydeals03c-21",
        "category": "Skincare"
    },
    {
        "title": "Kimirica Love Story Luxury Bath and Body Care Gift Set Box | Bath Salt, Body Wash, Body Lotion, Bathing Bar and Hand cream | Pack of 5 | For Men and Women | Pampering Kit for Birthday ,Anniversary & All Special Occasions | Premium Gift Packaging 100% Vegan",
        "price": "₹1,146",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/51MWkSY171L._AC_UL320_.jpg",
        "asin": "B09S3SRKMT",
        "affiliate": "https://www.amazon.in/dp/B09S3SRKMT/?tag=mydeals03c-21",
        "category": "Skincare"
    },
    {
        "title": "mCaffeine Body Care Gift Set for Women & Men | Bodywash Gift Box with Berries Body Wash, Body Scrub & Body Butter | Hydrating, Moisturizing Skin Care Kit for Birthday , Anniversary Gifts | Hampers for Him & Her for all special occasions",
        "price": "₹254",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/61MtHYrWWfL._AC_UL320_.jpg",
        "asin": "B0C27HJBXV",
        "affiliate": "https://www.amazon.in/dp/B0C27HJBXV/?tag=mydeals03c-21",
        "category": "Skincare"
    },
    {
        "title": "Foxtale On the Glow Travel Kit | Vitamin C, Niacinamide & Peptides | Brightening & Hydrating Skincare Set | For Glowing Skin | Travel Pouch Included | Pack of 4 | Travel & Pocket Friendly | Gift for Birthday and Anniversary",
        "price": "₹719",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/51qaaKhzC2L._AC_UL320_.jpg",
        "asin": "B0DP4SHXB7",
        "affiliate": "https://www.amazon.in/dp/B0DP4SHXB7/?tag=mydeals03c-21",
        "category": "Skincare"
    },
    {
        "title": "Glamveda Rice & Ceramide 4 Step Skincare Kit | Face Wash, Moisturizer, Face Serum & SPF 50 PA++ Sunscreen | Hydrating, Barrier Repair & Glass Glow Korean Skincare Set for Women",
        "price": "₹579",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/51dDaIhW92L._AC_UL320_.jpg",
        "asin": "B0C5TCQ1TD",
        "affiliate": "https://www.amazon.in/dp/B0C5TCQ1TD/?tag=mydeals03c-21",
        "category": "Skincare"
    },
    {
        "title": "Mamaearth Rice Facial Kit With Rice Water & Niacinamide for Glass Skin - 60 g | Salon-Like Glowing Skin in 6 Easy Steps | Improves Skin Texture | Instant Glow | Suitable for all skin types",
        "price": "₹327",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/61oOaG79HRL._AC_UL320_.jpg",
        "asin": "B0CH8SRX8M",
        "affiliate": "https://www.amazon.in/dp/B0CH8SRX8M/?tag=mydeals03c-21",
        "category": "Skincare"
    },
    {
        "title": "Plum BodyLovin' Vanilla Vibes Bath & Body Gift Set | Wash | Mist | Oil | Long-Lasting Fragrance | For Women | Gifting For Rakhi & Special Occasions| Pack Of 3",
        "price": "₹614",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/51Gdk2ZZoXL._AC_UL320_.jpg",
        "asin": "B0D5B6GZM1",
        "affiliate": "https://www.amazon.in/dp/B0D5B6GZM1/?tag=mydeals03c-21",
        "category": "Skincare"
    },
    {
        "title": "Plum Niacinamide Brightening Skincare Routine Combo | Oil-Free Hydration, Oil Control & SPF 50 PA++++ Protection | Face Wash, Serum, Moisturiser & Sunscreen",
        "price": "₹1,259",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/51JfRD9bVFL._AC_UL320_.jpg",
        "asin": "B0G8LPFXW3",
        "affiliate": "https://www.amazon.in/dp/B0G8LPFXW3/?tag=mydeals03c-21",
        "category": "Skincare"
    },
    {
        "title": "Blue Nectar Luxe Earth Gift Box for Women & Men | Premium Skincare with Bakuchi Serum, Kumkumadi Scrub, Honey Face Wash, Saffron Cream & Green Tea Lotion | Gift Set for All Occasions | Pack of 5",
        "price": "₹1,555",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/81XHltYCBkL._AC_UL640_QL65_.jpg",
        "asin": "B08YRKJZGZ",
        "affiliate": "https://www.amazon.in/dp/B08YRKJZGZ/?tag=mydeals03c-21",
        "category": "Skincare"
    },
    {
        "title": "Globus Naturals Valentine Special Rice Ceramide Korean Glass Skin 7 Step Skincare Gift Set | Face Wash, Scrub, Cream, Serum, Toner, Peel off Mask, Sheet Mask | Brightening & Glow Care for Men & Women",
        "price": "₹835",
        "rating": "4.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/71F1akGynzL._AC_UL320_.jpg",
        "asin": "B0GCCQ5QJT",
        "affiliate": "https://www.amazon.in/dp/B0GCCQ5QJT/?tag=mydeals03c-21",
        "category": "Skincare"
    },
    {
        "title": "Aqualogica Glow+ Born to Glow | With Sling Bag & Charms | For fresh & glowing skin | Gently Cleanses | 24-Hour Hydration | SPF 50+ PA++++ | Anti-Pollution Factor | Travel-friendly | Gift Set For Women | Gifting For Birthday, Valentine's, Anniversary, Rakhi & Special Occasions | Premium Gift Pack | Pack Of 3",
        "price": "₹996",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/71hrlTDtyZL._AC_UL320_.jpg",
        "asin": "B0GHR8PC5Y",
        "affiliate": "https://www.amazon.in/dp/B0GHR8PC5Y/?tag=mydeals03c-21",
        "category": "Skincare"
    },
    {
        "title": "Aqualogica Refresh+ Vanilla Body Care Gift Set for Women | Perfume Body Wash, Mist & Moisturizer | Perfect Valentine’s, Birthday & Anniversary Gift",
        "price": "₹598",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/61N-VKCimfL._AC_UL320_.jpg",
        "asin": "B0DVTG1D26",
        "affiliate": "https://www.amazon.in/dp/B0DVTG1D26/?tag=mydeals03c-21",
        "category": "Skincare"
    },
    {
        "title": "SKIN1004 Madagascar Centella Travel Kit, Toner, Ampoule, Soothing Cream, Cleansing Oil, Ampoule Foam, Basic Skincare Box, Compact Size, Gift Sets, Mothers Day Gifts for Mom Gifts for Women, Trial Kit",
        "price": "₹2,429",
        "rating": "4.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/61weUfgP3WL._AC_UL320_.jpg",
        "asin": "B08BZ89KKR",
        "affiliate": "https://www.amazon.in/dp/B08BZ89KKR/?tag=mydeals03c-21",
        "category": "Skincare"
    },
    {
        "title": "FoxTale Skincare Starter Kit, Skincare Beginners, Moisturized And Glowing Skin With Refreshing Face Wash - 100Ml, Nourishing Moisturizer - 50Ml, Glow Sunscreen - 50Ml, Men & Women, All Skin Types",
        "price": "₹677",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/71PGdotNMrL._AC_UL320_.jpg",
        "asin": "B0C69WW749",
        "affiliate": "https://www.amazon.in/dp/B0C69WW749/?tag=mydeals03c-21",
        "category": "Skincare"
    },
    {
        "title": "The Derma Co Anti Acne Skincare Routine Kit For All Skin 1% Salicylic Acid Gel Face Wash+2% Salicylic Acid Serum+1% Hyaluronic Sunscreen Aqua Gel|Broad Spectrum Protection Spf 50 Pa++++|Unisex,3 Count",
        "price": "₹970",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/61lsJWpRjxL._AC_UL320_.jpg",
        "asin": "B0D7PXGJ29",
        "affiliate": "https://www.amazon.in/dp/B0D7PXGJ29/?tag=mydeals03c-21",
        "category": "Skincare"
    },
    {
        "title": "mCaffeine Gift Kit Set for Women & Men with Pure Coffee Skincare | For Him & Her with Face Wash, Scrub, Body Wash & Sunscreen | Suitable for All Occasions & All Skin Types | Present for Him/Her, Birthday, Anniversary |",
        "price": "₹1,031",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/61NdtOdUwcL._AC_UL320_.jpg",
        "asin": "B0BSQLGSL7",
        "affiliate": "https://www.amazon.in/dp/B0BSQLGSL7/?tag=mydeals03c-21",
        "category": "Skincare"
    },
    {
        "title": "Glamveda Glutathione 8-Step Skin Brightening Skincare Routine Kit for Radiant, Even-Toned Skin | Face Wash, Peel-Off Mask, Serum, Face Cream, Sunscreen, Under Eye Cream, Bath Soap & Body Lotion",
        "price": "₹950",
        "rating": "4.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/6193HxG+PRL._AC_UL320_.jpg",
        "asin": "B0GMRJ3R9Q",
        "affiliate": "https://www.amazon.in/dp/B0GMRJ3R9Q/?tag=mydeals03c-21",
        "category": "Skincare"
    },
    {
        "title": "Foxtale Morning Skincare Kit for Women, Men | Cleanser Face Wash-100 ml, Vitamin C Face Serum- 30 ml, Ceramide Moisturizer-50 ml, Dewy Sunscreen SPF 70- 50 ml | Skincare Gift Set for Glowing Skin",
        "price": "₹1,488",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/7161lqBzRjL._AC_UL320_.jpg",
        "asin": "B09YD1NWTZ",
        "affiliate": "https://www.amazon.in/dp/B09YD1NWTZ/?tag=mydeals03c-21",
        "category": "Skincare"
    },
    {
        "title": "Freeskin Korean Glass Skin Facial Kit 6 Steps | Advanced Brightening, Smoothing & Hydrating Facial for Luminous Glass-Like Glow | Paraben Free | Sulphate Free | Mineral Oil Free | Silicone Free",
        "price": "₹249",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/61aaV79potL._AC_UL320_.jpg",
        "asin": "B0G8KD18V1",
        "affiliate": "https://www.amazon.in/dp/B0G8KD18V1/?tag=mydeals03c-21",
        "category": "Skincare"
    },
    {
        "title": "Glamveda Korean Rice & Ceramide 3 Step Skincare Routine| Face Wash, Facial Kit & Peel Off Mask | Skin Brightening & Anti Dullness | For Men and Women",
        "price": "₹232",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/61y1YpERGDL._AC_UL320_.jpg",
        "asin": "B0BWJTNZ53",
        "affiliate": "https://www.amazon.in/dp/B0BWJTNZ53/?tag=mydeals03c-21",
        "category": "Skincare"
    },
    {
        "title": "KIMIRICA Gift Set Love Story Moment For Women & Men| Luxury Bath And Body Care Set For Husband & Wife |Birthday Gift Kits|Anniversary To Pamper Your Loved Ones For All Occasion & Ages|Pack Of 7",
        "price": "₹1,557",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/51tdkWxkawL._AC_UL320_.jpg",
        "asin": "B0CHYWK8JN",
        "affiliate": "https://www.amazon.in/dp/B0CHYWK8JN/?tag=mydeals03c-21",
        "category": "Skincare"
    },
    {
        "title": "Foxtale Glow Getter Skincare Gift Set with Lactic Acid, Hyaluronic Acid & Niacinamide | For Glowing, Radiant Skin | Skincare Kit for Women & Men | Ideal Self-Care & Gifting Combo | Gift for Her",
        "price": "₹1,199",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/71EqC4AqudL._AC_UL320_.jpg",
        "asin": "B0DSJJ7JGL",
        "affiliate": "https://www.amazon.in/dp/B0DSJJ7JGL/?tag=mydeals03c-21",
        "category": "Skincare"
    },
    {
        "title": "Minimalist Anti-Pigmentation Kit, Skin Care Routine Kit For Unisex, Face Wash, Serum & Sunscreen Combo, 180g",
        "price": "₹1,281",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/51VX+QeZjRL._AC_UL320_.jpg",
        "asin": "B0BCSZL5SF",
        "affiliate": "https://www.amazon.in/dp/B0BCSZL5SF/?tag=mydeals03c-21",
        "category": "Skincare"
    },
    {
        "title": "Minimalist Glow & Protect Skincare Kit | Premium Gift Set for Women & Men | All Skin Types | Limited Edition Combo | Unisex Gift Hamper For All Festive Occasions | Birthday Gift For Her & Him",
        "price": "₹1,349",
        "rating": "3.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/51n+FZKRY2L._AC_UL320_.jpg",
        "asin": "B0BFX41ZMN",
        "affiliate": "https://www.amazon.in/dp/B0BFX41ZMN/?tag=mydeals03c-21",
        "category": "Skincare"
    },
    {
        "title": "Hyphen CSMS Normal to dry Skin Combo for Women and Men | Hyphen | Skincare Routine | Value Pack",
        "price": "₹1,566",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/61MHXkq4R1L._AC_UL320_.jpg",
        "asin": "B0D97PQLL2",
        "affiliate": "https://www.amazon.in/dp/B0D97PQLL2/?tag=mydeals03c-21",
        "category": "Skincare"
    },
    {
        "title": "Aroma Magic 7 step Bridal Glow Facial Kit| Enhance Natural glow + Dazzling radiance & Revitalises | with Turmeric & Rose Extracts| All Skin type| Single Use| Pack of 1 (20g + 18ml)",
        "price": "₹128",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/51JYXsFmuDL._AC_UL320_.jpg",
        "asin": "B08FCSBJPS",
        "affiliate": "https://www.amazon.in/dp/B08FCSBJPS/?tag=mydeals03c-21",
        "category": "Skincare"
    },
    {
        "title": "Foxtale Glow On Heartbeat Skincare Gift Set | Hydrating Cleanser, Tan-Removing Face Mask, Nourishing Lip Oil & Free Heart-Shaped Pouch | Travel-Friendly Self-Care Kit for Radiant, Glowing Skin",
        "price": "₹599",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/51K5iI5RDmL._AC_UL320_.jpg",
        "asin": "B0DSL74PHS",
        "affiliate": "https://www.amazon.in/dp/B0DSL74PHS/?tag=mydeals03c-21",
        "category": "Skincare"
    },
    {
        "title": "The Face Shop Rice&Ceramide Moisturizing Skincare And Cream Set, 75 Ml (Pack Of 3), Pink",
        "price": "₹807",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/51VUFu7xLLL._AC_UL320_.jpg",
        "asin": "B091DC8Z3Y",
        "affiliate": "https://www.amazon.in/dp/B091DC8Z3Y/?tag=mydeals03c-21",
        "category": "Skincare"
    },
    {
        "title": "NutriGlow NATURAL'S Advanced Pro Formula Facial Kit For Glowing Skin, Tan Removal, All Type of Skin Solution for men & women, skincare Set 60 gm ( Pack of 4 )",
        "price": "₹279",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/71MalaMNHWL._AC_UL320_.jpg",
        "asin": "B09P89V6X4",
        "affiliate": "https://www.amazon.in/dp/B09P89V6X4/?tag=mydeals03c-21",
        "category": "Skincare"
    },
    {
        "title": "Glamveda 2% Kojic Acid 4 Step Skincare Routine Facewash, Spot Corrector, Serum & Gel Cream For Remove Dark Spots, Pigmentation, Acne Scars, Clear and Glowing Skin | For Men & Women | All Skin Type",
        "price": "₹592",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/71bge1eSf2L._AC_UL320_.jpg",
        "asin": "B0FJLTHQ5K",
        "affiliate": "https://www.amazon.in/dp/B0FJLTHQ5K/?tag=mydeals03c-21",
        "category": "Skincare"
    },
    {
        "title": "Asaya Travel Kit | Gift for Women | With Free Travel Pouch Bag | Face Wash Cleanser, Serum, Moisturizer & Sunscreen (CSMS Combo) | Melame™ Complex, Alpha Arbutin, Kojic Acid, Niacinamide | All Skin Types | For Women & Men",
        "price": "₹696",
        "rating": "4.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/61h87ADWDFL._AC_UL320_.jpg",
        "asin": "B0G6MDCH3Q",
        "affiliate": "https://www.amazon.in/dp/B0G6MDCH3Q/?tag=mydeals03c-21",
        "category": "Skincare"
    },
    {
        "title": "Globus Naturals Rice Ceramide Korean Glass Skin 4 Step Skincare Range | Face Wash, Cream, Serum, Toner | Brightening & Glow Care for Men & Women",
        "price": "₹509",
        "rating": "4.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/713szpIUG-L._AC_UL320_.jpg",
        "asin": "B0GCCLLPTM",
        "affiliate": "https://www.amazon.in/dp/B0GCCLLPTM/?tag=mydeals03c-21",
        "category": "Skincare"
    },
    {
        "title": "Globus Naturals Rice Ceramide Skincare Gift Box for Glass Skin - 6 Pcs Set: Face Wash, Cream, Scrub, Peel-Off Mask, Serum, Toner - Korean Beauty Regimen",
        "price": "₹765",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/71af7giFqhL._AC_UL320_.jpg",
        "asin": "B0DMJWM4J7",
        "affiliate": "https://www.amazon.in/dp/B0DMJWM4J7/?tag=mydeals03c-21",
        "category": "Skincare"
    },
    {
        "title": "Plum Unisex Head To Toe Travel Kit | Hawaiian Rumba Shower Gel | Coconut Milk & Peptides Shampoo | Vanilla Caramello Body Lotion | Travel Friendly Personal Care Set",
        "price": "₹171",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/61cMLN-aQyL._AC_UL320_.jpg",
        "asin": "B0CW3G9YMG",
        "affiliate": "https://www.amazon.in/dp/B0CW3G9YMG/?tag=mydeals03c-21",
        "category": "Skincare"
    },
    {
        "title": "Kimirica Travel Kit Bath set Five Elements Luxury Bath and Body Care Travel Pouch Loofah| 6 in 1 self-care travel kit with a reusable pouch 100% Vegan",
        "price": "₹276",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/511foOInkcL._AC_UL320_.jpg",
        "asin": "B0DMF3B5X5",
        "affiliate": "https://www.amazon.in/dp/B0DMF3B5X5/?tag=mydeals03c-21",
        "category": "Skincare"
    },
    {
        "title": "Lacto Calamine Premium Face Care Kit for Women | Facewash, Sunscreen, Wet Wipes, Toner, Face Lotion | Pack of 5 Signature Products Skincare Set | Valentines Day Gifts",
        "price": "₹564",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/61Ggb1dD2KL._AC_UL320_.jpg",
        "asin": "B0CDLPLHN9",
        "affiliate": "https://www.amazon.in/dp/B0CDLPLHN9/?tag=mydeals03c-21",
        "category": "Skincare"
    },
    {
        "title": "THE LOVE CO. Warm Vanilla Bath & Body Gift Set Pack Of 3 | Body Wash | Body Lotion | Shampoo | Long-Lasting Warm Vanilla Fragrance | Gift Set For Women | Gifting For Birthday, Valentine's, Anniversary, Rakhi & Special Occasions| Premium Gift Packaging",
        "price": "₹235",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/61Asi1b6bJL._AC_UL320_.jpg",
        "asin": "B0D9P7C4Z7",
        "affiliate": "https://www.amazon.in/dp/B0D9P7C4Z7/?tag=mydeals03c-21",
        "category": "Skincare"
    },
    {
        "title": "Minimalist Anti-Acne Kit, Skincare Routine Kit for Unisex, Salicylic Acid Face Wash, Vitamin B5 Moisturizer, and Salicylic Acid Serum Combo",
        "price": "₹1,137",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/51Q3a6S8goL._AC_UL320_.jpg",
        "asin": "B0B9SN8P4M",
        "affiliate": "https://www.amazon.in/dp/B0B9SN8P4M/?tag=mydeals03c-21",
        "category": "Skincare"
    },
    {
        "title": "Glamveda 2% Kojic Acid 6 Step Skincare Kit for Glowing Skin | Facewash, Serum, Spot Corrector, Body Lotion, Cream, BB Cream (Dark Tone) | Brightens Skin, Reduce Dark Spots & Pigmentation | Women & Men",
        "price": "₹861",
        "rating": "5.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/71YkGjVLfML._AC_UL320_.jpg",
        "asin": "B0FYWHN982",
        "affiliate": "https://www.amazon.in/dp/B0FYWHN982/?tag=mydeals03c-21",
        "category": "Skincare"
    },
    {
        "title": "Garnier Bright Complete Vitamin C Brightening Regime Kit for Skincare | Cleanse, Treat and Seal | Reduces Dark Spots, Face Wash + Serum + SPF 40 Serum Cream, for all skin types, For Men and Women",
        "price": "₹669",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/51aohOimdxL._AC_UL320_.jpg",
        "asin": "B0BZP79STZ",
        "affiliate": "https://www.amazon.in/dp/B0BZP79STZ/?tag=mydeals03c-21",
        "category": "Skincare"
    },
    {
        "title": "NutriGlow Wine Facial Kit for Women for Glowing Skin, 6-Pieces Skin Care Set with Deep Cleanser, Scrub, Nourishing Gel, Tan Removal, Mask Pack and Serum, 250gm+10ml Free Face Massager",
        "price": "₹476",
        "rating": "3.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/71UwTXntVIL._AC_UL320_.jpg",
        "asin": "B07DXVJSQ5",
        "affiliate": "https://www.amazon.in/dp/B07DXVJSQ5/?tag=mydeals03c-21",
        "category": "Skincare"
    },
    {
        "title": "Blue Nectar Indulgent Nature Beauty Gift Set | Skincare Combo with Kumkumadi Cream, Vitamin C Serum, Nargis SPF Lotion, Honey Face Wash & Rose Face Mist | Gift for Women & Men | Pack of 5",
        "price": "₹2,945",
        "rating": "5.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/81buZUc31dL._AC_UL320_.jpg",
        "asin": "B0CQC2JW7F",
        "affiliate": "https://www.amazon.in/dp/B0CQC2JW7F/?tag=mydeals03c-21",
        "category": "Skincare"
    },
    {
        "title": "NutriGlow Red Wine Facial Kit for Glowing Skin – 6-Step At-Home Parlour Facial with Resveratrol & Red Grape Extracts for Tan Removal, Anti-Ageing & Radiant Skin | All Skin Types | 250g + 10ml Serum",
        "price": "₹299",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/71+jsRqgp3L._AC_UL320_.jpg",
        "asin": "B07DQPTZ4Z",
        "affiliate": "https://www.amazon.in/dp/B07DQPTZ4Z/?tag=mydeals03c-21",
        "category": "Skincare"
    },
    {
        "title": "Minimalist Anti-Aging Skincare Kit, Routine Kit For Unisex, Face Wash, Serum & Sunscreen Combo, 180g",
        "price": "₹1,104",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/51E-5iW4lNL._AC_UL320_.jpg",
        "asin": "B0BCFNRSNQ",
        "affiliate": "https://www.amazon.in/dp/B0BCFNRSNQ/?tag=mydeals03c-21",
        "category": "Skincare"
    },
    {
        "title": "Kimirica Gift Set luxury lavender gift box for Men & Women Set of 3",
        "price": "₹475",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/51NFHovNt6L._AC_UL320_.jpg",
        "asin": "B0DPFW1YMX",
        "affiliate": "https://www.amazon.in/dp/B0DPFW1YMX/?tag=mydeals03c-21",
        "category": "Skincare"
    },
    {
        "title": "Kimirica Luxury Gift Set For Men & Women Love Story Little Heart Hamper | Luxury Bath & Body Care Gift Set For All Ocassions | Perfect Birthday & Anniversary Premium Gift Pack of 3",
        "price": "₹816",
        "rating": "4.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/51XJLrt-mIL._AC_UL320_.jpg",
        "asin": "B0DTHHPYRS",
        "affiliate": "https://www.amazon.in/dp/B0DTHHPYRS/?tag=mydeals03c-21",
        "category": "Skincare"
    },
    {
        "title": "THE LOVE CO. Japanese Cherry Blossom Gift Set for Women – Pack of 3 (Body Wash, Lotion & Mist) | Luxury Vegan Bath Gift | Birthday & Anniversary",
        "price": "₹315",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/61SLONZo2cL._AC_UL320_.jpg",
        "asin": "B0DPML8L5B",
        "affiliate": "https://www.amazon.in/dp/B0DPML8L5B/?tag=mydeals03c-21",
        "category": "Skincare"
    },
    
    {
        "title": "Cureskin Head Massager with Medical-Grade Silicone Bristles | Hair Massager for Hair Growth | Scalp Massager Shampoo Hair Brush, Exfoliating, Oil Massage, Anti-Dandruff",
        "price": "₹150",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/71gedmM6o3L._AC_UL320_.jpg",
        "asin": "B0DTJ3RL5J",
        "affiliate": "https://www.amazon.in/dp/B0DTJ3RL5J/?tag=mydeals03c-21",
        "category": "Hair Care"
    },
    {
        "title": "FABSKIN Luxury Satin Silk Hair Bonnet Cap for Sleeping with Satin Scrunchie | For Women & Girls | For Curly & All Hair Types - Wine",
        "price": "₹161",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/81vE5Uq5+9L._AC_UL320_.jpg",
        "asin": "B0CKY4K9CJ",
        "affiliate": "https://www.amazon.in/dp/B0CKY4K9CJ/?tag=mydeals03c-21",
        "category": "Hair Care"
    },
    {
        "title": "LA’BANGERRY Keratin Protein Hair Care Combo | Shampoo, Conditioner, Mask & Serum | Enriched with Almond Oil, Eucalyptus & Jojoba Oil for Smooth, Strong & Shiny Hair (Pack Of 4)",
        "price": "₹447",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/71mgU4YGAaL._AC_UL320_.jpg",
        "asin": "B0F1YVM1K1",
        "affiliate": "https://www.amazon.in/dp/B0F1YVM1K1/?tag=mydeals03c-21",
        "category": "Hair Care"
    },
    {
        "title": "Sacred Grove Condition & Repair Hair Mask for Dry Frizzy Hair | Natural Deep Conditioning Hair Mask for damaged hair with Flaxseed, Marshmallow Root & Hibiscus | Herbal Hair Spa | Paraben, Sulphate, Chemical-Free | 200g",
        "price": "₹960",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/81hw+7DC1lL._AC_UL640_QL65_.jpg",
        "asin": "B0CX4FC9LD",
        "affiliate": "https://www.amazon.in/dp/B0CX4FC9LD/?tag=mydeals03c-21",
        "category": "Hair Care"
    },
    {
        "title": "Livon Keratin Hair Serum for Women & Men | Ultra Glossy & Smooth Hair | 48Hr Frizz Control | Hair Serum for Dry, Rough & Damaged Hair | 48ml",
        "price": "₹99",
        "rating": "4.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/61HKgfKZpDL._AC_UL320_.jpg",
        "asin": "B0G25SH1ML",
        "affiliate": "https://www.amazon.in/dp/B0G25SH1ML/?tag=mydeals03c-21",
        "category": "Hair Care"
    },
    {
        "title": "Bare Anatomy Nature x Science Rosemary Water Spray for Hair Growth & Hair Thickness with Rice Water | 100% Natural Extract | Soft & Smooth Hair | Controls Hairfall & Adds Shine | Non-Greasy & Fast Absorbing | 200 ml",
        "price": "₹359",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/41MZm7lsyWL._AC_UL320_.jpg",
        "asin": "B0DK6W7RPS",
        "affiliate": "https://www.amazon.in/dp/B0DK6W7RPS/?tag=mydeals03c-21",
        "category": "Hair Care"
    },
    {
        "title": "Pilgrim Korean Black Rice and Rosemary Water Spray With Biotin for Hair Growth 100ml | Hair Spray for Regrowth | Thicker & Stronger Hair | Sulphate & Paraben Free I For Women & Men",
        "price": "₹191",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/61EOXr5Er+L._AC_UL320_.jpg",
        "asin": "B0DJNVMZ1M",
        "affiliate": "https://www.amazon.in/dp/B0DJNVMZ1M/?tag=mydeals03c-21",
        "category": "Hair Care"
    },
    {
        "title": "Generic Neem comb Wodden hair comb 100% natural product",
        "price": "₹135",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/512lvjSeF6L._AC_UL320_.jpg",
        "asin": "B0GHDT4QKN",
        "affiliate": "https://www.amazon.in/dp/B0GHDT4QKN/?tag=mydeals03c-21",
        "category": "Hair Care"
    },
    {
        "title": "Mamaearth Rosemary Hair Fall Control Kit | Gives up to 94% Stronger Hair | Up to 93% Less Hair Fall | Made Safe Certified | For Men & Women | 650 ml",
        "price": "₹511",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/61BJaydmJ8L._AC_UL320_.jpg",
        "asin": "B0C9F3NSL8",
        "affiliate": "https://www.amazon.in/dp/B0C9F3NSL8/?tag=mydeals03c-21",
        "category": "Hair Care"
    },
    {
        "title": "WishCare Hair Growth Serum For Scalp | 94% Saw New Hair Growth | Redensyl & Rosemary Oil | 100% Saw Hairfall Reduction | In-Vivo Tested | For Men & Women | 30ml",
        "price": "₹699",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/61PA2P4KDCL._AC_UL320_.jpg",
        "asin": "B0B573QW21",
        "affiliate": "https://www.amazon.in/dp/B0B573QW21/?tag=mydeals03c-21",
        "category": "Hair Care"
    },
    {
        "title": "Hair & Care Triple Blend Damage Repair Non-Sticky Hair Oil with Aloe Vera, Olive Oil & Green Tea, 300 ml + 100 ml",
        "price": "₹230",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/61vtMedwSxL._AC_UL320_.jpg",
        "asin": "B07JLP5J13",
        "affiliate": "https://www.amazon.in/dp/B07JLP5J13/?tag=mydeals03c-21",
        "category": "Hair Care"
    },
    {
        "title": "Bare Anatomy Anti-Dandruff Shampoo | Up To 100% Dandruff Reduction | ZPTO-Free | pH 5.3 | Salicylic Acid, Piroctone Olamine & Biotin | Non-Drying Formula | For Strong, Smooth Hair | Unisex | 100 ml",
        "price": "₹231",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/41aY2ihjX6L._AC_UL320_.jpg",
        "asin": "B0F5BLYYCN",
        "affiliate": "https://www.amazon.in/dp/B0F5BLYYCN/?tag=mydeals03c-21",
        "category": "Hair Care"
    },
    {
        "title": "L'Oreal Paris Extraordinary Oil Hair Serum Powered by Floral Oils for All Hair Types, Volume- 100 ml, Makes hair frizz-free, stronger, shiny and provides UV and Heat Protection, Lightweight Formula",
        "price": "₹437",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/31Ip4aURUpL.png",
        "asin": "B08FW1GJ4F",
        "affiliate": "https://www.amazon.in/dp/B08FW1GJ4F/?tag=mydeals03c-21",
        "category": "Hair Care"
    },
    {
        "title": "Khadi 100% Natural 5 in 1 Amla, Reetha, Shikakai, Bhringraj & Hibiscus Powder – 100% Herbal Hair Care Blend for Hair Growth, Strength & Shine – Prevents Hair Fall & Dandruff – 125gm",
        "price": "₹123",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/71B2ygU+HpL._AC_UL320_.jpg",
        "asin": "B0F6YD161G",
        "affiliate": "https://www.amazon.in/dp/B0F6YD161G/?tag=mydeals03c-21",
        "category": "Hair Care"
    },
    {
        "title": "L'Oreal Paris Hyaluron Moisture Hydra Filling Leave-in Night Cream, Powered by Hyaluronic Acid, For Dry & Dehydrated Hair, Volume-180ml, Makes hair frizz-free, bouncy and hydrated for up to 72HR",
        "price": "₹349",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/31Ip4aURUpL.png",
        "asin": "B0B6XZBQ1G",
        "affiliate": "https://www.amazon.in/dp/B0B6XZBQ1G/?tag=mydeals03c-21",
        "category": "Hair Care"
    },
    {
        "title": "Parachute Advanced Coconut & Rosemary Hair Cream 210ml | Anti – HairFall | 10X Breakage Reduction | 2X Smoother, Softer | For Men & Women",
        "price": "₹224",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/61D+ZfYJOmL._AC_UL320_.jpg",
        "asin": "B0DW48B5MT",
        "affiliate": "https://www.amazon.in/dp/B0DW48B5MT/?tag=mydeals03c-21",
        "category": "Hair Care"
    },
    {
        "title": "Hair & Care with Almond, Non-Sticky Hair Oil, 500ml",
        "price": "₹119",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/61emLBPQHRL._AC_UL320_.jpg",
        "asin": "B07S2SKYTH",
        "affiliate": "https://www.amazon.in/dp/B07S2SKYTH/?tag=mydeals03c-21",
        "category": "Hair Care"
    },
    {
        "title": "Pure and Natural Amla Reetha Shikakai Bhringraj Hibiscus Powder 500gm Pack For Hair Care & Mask For All Types Of Hairs Pack of 5 x 100gm for Men and Women",
        "price": "₹399",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/819r0-qx+-L._AC_UL320_.jpg",
        "asin": "B0CG3QY5SF",
        "affiliate": "https://www.amazon.in/dp/B0CG3QY5SF/?tag=mydeals03c-21",
        "category": "Hair Care"
    },
    {
        "title": "Be Bodywise Rosemary Hair Growth Serum (Roll On) | 3% Redensyl & 2% Anagain | Hair fall control serum for Women & Men | Promotes Hair Growth & Stimulates Hair Follicles | For All Hair Types | 25ml",
        "price": "₹599",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/61hPKEtnF2L._AC_UL320_.jpg",
        "asin": "B0CPJB7WW7",
        "affiliate": "https://www.amazon.in/dp/B0CPJB7WW7/?tag=mydeals03c-21",
        "category": "Hair Care"
    },
    {
        "title": "Dabur Cold Pressed 100% Pure Castor (Arandi) Oil - 200ml | Promotes Hair Growth, Hydrates Skin & Reduces Wrinkles | Rich in Vitamin E, Omega 6 & 9 | No Mineral Oil, No Hexane & No Added Silicones",
        "price": "₹210",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/71u+vxKGDYL._AC_UL320_.jpg",
        "asin": "B0B38NZYXN",
        "affiliate": "https://www.amazon.in/dp/B0B38NZYXN/?tag=mydeals03c-21",
        "category": "Hair Care"
    },
    {
        "title": "Plum Coconut Milk & Peptides Shampoo 250ml & Conditioner 175g Combo for Dry & Frizzy Hair | 22X Softer, Hydrated, & Smooth Hair | SLS & Paraben Free, pH Balanced Shampoo & Conditioner for Women & Men",
        "price": "₹598",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/61rClndNW3L._AC_UL320_.jpg",
        "asin": "B0DP96P1SK",
        "affiliate": "https://www.amazon.in/dp/B0DP96P1SK/?tag=mydeals03c-21",
        "category": "Hair Care"
    },
    {
        "title": "Beardo Rosemary Hair Spray with Redensyl & Rice Water | Activates Natural Hair Growth, Reduces Hair Fall & Breakage | Strengthens Roots | Non-Sticky Daily Hair Tonic for Men- 100ml",
        "price": "₹224",
        "rating": "4.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/71sec20eKeL._AC_UL320_.jpg",
        "asin": "B0FQ56JJKS",
        "affiliate": "https://www.amazon.in/dp/B0FQ56JJKS/?tag=mydeals03c-21",
        "category": "Hair Care"
    },
    {
        "title": "Streax Rosemary Hair Spray - 200ml , 100% Natural Extracts For Hair Growth , Stronger & Thicker Hair, Reduces Hair Fall , Nourishes Scalp & Stimulates Roots , Non-Sticky , Sulphate & Paraben-Free, Rosemary Water Spray for Hair Growth",
        "price": "₹221",
        "rating": "3.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/5164c4peyiL._AC_UL320_.jpg",
        "asin": "B0G1CGVBT9",
        "affiliate": "https://www.amazon.in/dp/B0G1CGVBT9/?tag=mydeals03c-21",
        "category": "Hair Care"
    },
    {
        "title": "Dove Deep Repair Treatment Hair Mask For Damaged Hair With Bio Protein Care Sulphate & Paraben Free 300 ML",
        "price": "₹395",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/51j29e9iQvL._AC_UL320_.jpg",
        "asin": "B0CNXZ6LHW",
        "affiliate": "https://www.amazon.in/dp/B0CNXZ6LHW/?tag=mydeals03c-21",
        "category": "Hair Care"
    },
    {
        "title": "Himalaya Protein Hair Floral Scent Cream for All Hair Types, 200 Millilitres",
        "price": "₹125",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/51RbtUekuAL._AC_UL320_.jpg",
        "asin": "B082STCPHN",
        "affiliate": "https://www.amazon.in/dp/B082STCPHN/?tag=mydeals03c-21",
        "category": "Hair Care"
    },
    {
        "title": "Amla Reetha Shikakai, Bhringraj and Hibiscus Powder for Hair (Pack of 5, 50g each, Total 250g Pack)",
        "price": "₹189",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/71yUPW5T3VL._AC_UL320_.jpg",
        "asin": "B0C65B24Y2",
        "affiliate": "https://www.amazon.in/dp/B0C65B24Y2/?tag=mydeals03c-21",
        "category": "Hair Care"
    },
    {
        "title": "L'Oréal Professionnel Absolut Repair Mask for Dry & Damaged Hair | Professional mask for Strengthening and Repairing Hair, 13x resistance to hair damage | With Protein & Omega-9 For Men & Women, 250ml",
        "price": "₹891",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/61EsRB9xo-L._AC_UL320_.jpg",
        "asin": "B07NDXJGF8",
        "affiliate": "https://www.amazon.in/dp/B07NDXJGF8/?tag=mydeals03c-21",
        "category": "Hair Care"
    },
    {
        "title": "Biolage Smooth Proof 6-in-1 Hair Serum 100ml | Deep Smoothening With Avocado & Grape Seed Oil | Up to 72HR Frizz Control |For Women & Men | Vegan & Cruelty-Free",
        "price": "₹315",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/51PBDFlTFKL._AC_UL320_.jpg",
        "asin": "B01HO9EC94",
        "affiliate": "https://www.amazon.in/dp/B01HO9EC94/?tag=mydeals03c-21",
        "category": "Hair Care"
    },
    {
        "title": "PLIX - THE PLANT FIX Rosemary Advanced Spray for Fuller, Thicker Hair, Redensyl® & Rosemary Extract, Easy to Use, Mess-free, Stimulates Hair Follicles & Promotes Hair Growth, For All Hair Types, 100ml",
        "price": "₹225",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/610UqGdWsTL._AC_UL320_.jpg",
        "asin": "B0F7D2J2VH",
        "affiliate": "https://www.amazon.in/dp/B0F7D2J2VH/?tag=mydeals03c-21",
        "category": "Hair Care"
    },
    {
        "title": "Streax Heat Protectant Spray for Hair - 100 ml, Hair Styling Spray for Women & Men I Heat Protection Spray from heat|Heat protection serum|Protection upto 250°C & 2X Less Hair Breakage",
        "price": "₹240",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/41ZRZg9wfJL._AC_UL320_.jpg",
        "asin": "B0CT3RHP5Y",
        "affiliate": "https://www.amazon.in/dp/B0CT3RHP5Y/?tag=mydeals03c-21",
        "category": "Hair Care"
    },
    {
        "title": "Parachute Advansed Pre-Wash Nourishing Hair Mask For Scalp&Hair|Total Hair Health 10X Stronger Hair&Smoother Hair With Coconut Milk Protein,Avocado&Macadamia Nut|All Hair Types,250Ml,1 Count,Blue",
        "price": "₹189",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/61gU9jTN8JL._AC_UL320_.jpg",
        "asin": "B0D9YMT9KM",
        "affiliate": "https://www.amazon.in/dp/B0D9YMT9KM/?tag=mydeals03c-21",
        "category": "Hair Care"
    },
    {
        "title": "L'Oreal Paris Fresh Hyaluron Moisture 72HR Moisture Sealing Conditioner Powered By Hyaluronic Acid, For Frizz-Free, Hydrated And Bouncy Hair Full Of Life | 340 Millilitres",
        "price": "₹397",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/31Ip4aURUpL.png",
        "asin": "B0CW1DDL79",
        "affiliate": "https://www.amazon.in/dp/B0CW1DDL79/?tag=mydeals03c-21",
        "category": "Hair Care"
    },
    {
        "title": "Soulflower Rosemary Water Spray for Hair Growth | Niacinamide & Mint | Hair Regrowth Spray | Instant Shine | Strengthens Hair Roots & Strand | Anti Hair Fall Cooling & Relaxing | All Hair Types 100ml",
        "price": "₹185",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/61XEUy8lBjL._AC_UL320_.jpg",
        "asin": "B0D2XH28NC",
        "affiliate": "https://www.amazon.in/dp/B0D2XH28NC/?tag=mydeals03c-21",
        "category": "Hair Care"
    },
    {
        "title": "Himalaya Herbals Protein Hair Cream for Normal Hair, 100 Millilitres",
        "price": "₹80",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/31Ip4aURUpL.png",
        "asin": "B01LB4BX6I",
        "affiliate": "https://www.amazon.in/dp/B01LB4BX6I/?tag=mydeals03c-21",
        "category": "Hair Care"
    },
    {
        "title": "Online Quality Store Amla Reetha Shikakai, Bhringraj and Hibiscus Powder for Hair |Aritha|Ritha|Soapnuts|Indian Gooseberry |organic Bhringraj |Hibiscus /gudhal /gudhal fool powder(Pack of 5 ,50g each ,Total 250g Pack)",
        "price": "₹159",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/81g5fO2d++L._AC_UL320_.jpg",
        "asin": "B07N8GJHW9",
        "affiliate": "https://www.amazon.in/dp/B07N8GJHW9/?tag=mydeals03c-21",
        "category": "Hair Care"
    },
    {
        "title": "KRISHNA'S HERBAL & AYURVEDA Hair & Scalp Care Juice 1000 Ml,Hair Care Juice For Hair Growth & Hair Fall Control,Blend Of 7+ Ayurvedic Herbs,No Artificial Colors,Flavours & Sugars,Use 60 Days",
        "price": "₹487",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/71VNwLCl7NL._AC_UL320_.jpg",
        "asin": "B0CFHC828S",
        "affiliate": "https://www.amazon.in/dp/B0CFHC828S/?tag=mydeals03c-21",
        "category": "Hair Care"
    },
    {
        "title": "Ayurvedic Hair Growth Powder with Bhringraj, Amla and Neem to Control Hair Loss, Strengthen Hair Roots and Promote Healthy Hair Growth Suitable for Men and Women for All Hair Types 120g",
        "price": "₹179",
        "rating": "5.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/81BMzvxsdnL._AC_UL320_.jpg",
        "asin": "B0GVWT71VV",
        "affiliate": "https://www.amazon.in/dp/B0GVWT71VV/?tag=mydeals03c-21",
        "category": "Hair Care"
    },
    {
        "title": "Indulekha Bringha Hair Growth Treatment Scalp Serum ,30ml |Ayurvedic Hair Growth Serum",
        "price": "₹455",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/51wFr9rDH-L._AC_UL320_.jpg",
        "asin": "B0F4KSKH5B",
        "affiliate": "https://www.amazon.in/dp/B0F4KSKH5B/?tag=mydeals03c-21",
        "category": "Hair Care"
    },
    {
        "title": "Kerala Ayurveda Neelibhringadi Keram | Hair Oil for Hair Growth | With Indigo, Bhringaraj & Amla | Triple Care Formula | 200ml",
        "price": "₹250",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/61WtxArdLRL._AC_UL320_.jpg",
        "asin": "B07F5NCTN2",
        "affiliate": "https://www.amazon.in/dp/B07F5NCTN2/?tag=mydeals03c-21",
        "category": "Hair Care"
    },
    {
        "title": "Parachute Advansed Protein Shampoo with Coconut Milk & Rosemary | Up to 96% Hair Fall Reduction & up to 23X Hair Fall Control | Protein Lock Technology | Paraben free | For Men & Women | 340ml",
        "price": "₹240",
        "rating": "4.7 out of 5",
        "image": "https://m.media-amazon.com/images/I/71A3Hg9-wZL._AC_UL320_.jpg",
        "asin": "B0GQV4ZTPF",
        "affiliate": "https://www.amazon.in/dp/B0GQV4ZTPF/?tag=mydeals03c-21",
        "category": "Hair Care"
    },
    {
        "title": "Parachute Advansed Ultra Nourish Hair Serum | Coconut & Rosemary | 48 Hr Frizz Control | 10X Strong Hair | 100ml",
        "price": "₹170",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/61T3tBvhm8L._AC_UL320_.jpg",
        "asin": "B0FBGTNH92",
        "affiliate": "https://www.amazon.in/dp/B0FBGTNH92/?tag=mydeals03c-21",
        "category": "Hair Care"
    },
    {
        "title": "HerbtoniQ Natural Dry Amla, Reetha & Shikakai Powder For Healthy Hair Care Pack (400 g)",
        "price": "₹455",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/712614pE36L._AC_UL320_.jpg",
        "asin": "B08FT55Z6J",
        "affiliate": "https://www.amazon.in/dp/B08FT55Z6J/?tag=mydeals03c-21",
        "category": "Hair Care"
    },
    {
        "title": "Minimalist Serum for Repairing Damaged Hair | Maleic Bond Repair Complex 05% Hair Serum with Amino Acids, Argan Oil & Squalane | For Women & Men | For All Hair Types | 50 ml",
        "price": "₹499",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/61RjgoFqyrL._AC_UL320_.jpg",
        "asin": "B0BS1V2W98",
        "affiliate": "https://www.amazon.in/dp/B0BS1V2W98/?tag=mydeals03c-21",
        "category": "Hair Care"
    },
    {
        "title": "WishCare Multi Peptide Anti Hairfall Shampoo For Frizzy and Dry Hair | Controls Hairfall & Promotes Hair Growth | Peptides, Rice Water, Rosemary & Caffeine | Paraben & Sulphate Free Shampoo For Women & Men | For All Hair Types | 250ml",
        "price": "₹394",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/614PSJckmBL._AC_UL320_.jpg",
        "asin": "B0CTFHPC23",
        "affiliate": "https://www.amazon.in/dp/B0CTFHPC23/?tag=mydeals03c-21",
        "category": "Hair Care"
    },
    {
        "title": "WishCare Hair Growth Serum Concentrate - Resdensyl, Anagain, Caffeine, Biotin, Keratin & Rice Water 20ml",
        "price": "₹511",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/5152-gFKAlL._AC_UL320_.jpg",
        "asin": "B0FN8CR7DK",
        "affiliate": "https://www.amazon.in/dp/B0FN8CR7DK/?tag=mydeals03c-21",
        "category": "Hair Care"
    },
    {
        "title": "Streax Frizz Control Hair Serum for Dry Frizzy Hair- 100 ml, 72hrs Frizz Free Hair, For Women & Men, With Bio – Elixir, 84% Frizz Reduction & 11X smoothness",
        "price": "₹198",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/51OYUiuvyvL._AC_UL320_.jpg",
        "asin": "B0CZS143KZ",
        "affiliate": "https://www.amazon.in/dp/B0CZS143KZ/?tag=mydeals03c-21",
        "category": "Hair Care"
    },
    {
        "title": "TRESemme Hydra Matrix Hair Mask 100ml with Polyglutamic Acid | Deep Hydration Treatment for 100H of Fluid Hair | Paraben Free Mask for Dry Frizzy Hair",
        "price": "₹149",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/51ScNxOrEiL._AC_UL320_.jpg",
        "asin": "B0FXSVH4YL",
        "affiliate": "https://www.amazon.in/dp/B0FXSVH4YL/?tag=mydeals03c-21",
        "category": "Hair Care"
    },
    {
        "title": "Dove Intense Repair Conditioner 175 ml|| With Keratin Actives to Smoothen Dry and Frizzy Hair - Deep Conditions Damaged Hair for Men & Women",
        "price": "₹203",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/31Ip4aURUpL.png",
        "asin": "B07H9Y6YHX",
        "affiliate": "https://www.amazon.in/dp/B07H9Y6YHX/?tag=mydeals03c-21",
        "category": "Hair Care"
    },
    {
        "title": "Livon Hair Serum, For Dry & Frizzy Hair | Provides shine , smoothness & damage protection| Leave in serum for women & Men| With Vitamin E & Argan Oil | 100ml",
        "price": "₹195",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/51U-aCPzRxL._AC_UL320_.jpg",
        "asin": "B00CBRILZQ",
        "affiliate": "https://www.amazon.in/dp/B00CBRILZQ/?tag=mydeals03c-21",
        "category": "Hair Care"
    },
      {
        "title": "NEST NATURE HAVEN Engineered Wood Contemporary Bedside End Table with Three Open Shelves for Book Storage and a Small Nightstand Organiser Corner Stand for Office, Bedroom, Living Room Home Decor",
        "price": "₹648",
        "rating": "3.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/71WpswhyAPL._AC_UL320_.jpg",
        "asin": "B0G488MJVG",
        "affiliate": "https://www.amazon.in/dp/B0G488MJVG/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "AMATA Eagle Solid Wood 3 Seater Sofa Cum Bed Grey Suede Velvet with Two Cushions Perfect for Home Living Office Room and Guests (Grey, Medium)(3 yrs Warranty)",
        "price": "₹17,499",
        "rating": "4.7 out of 5",
        "image": "https://m.media-amazon.com/images/I/51PF1LE46nL._AC_UL320_.jpg",
        "asin": "B0B68KM7F5",
        "affiliate": "https://www.amazon.in/dp/B0B68KM7F5/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "STRATA FURNITURE Solid Sheesham Wood King Size Poster Bed with Storage Wooden Double Bed Furniture for Bedroom Living Room Home (Walnut Finish)",
        "price": "₹32,199",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/81zEOHy0XWL._AC_UL320_.jpg",
        "asin": "B09BCBR45N",
        "affiliate": "https://www.amazon.in/dp/B09BCBR45N/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "Honey Touch Nova Folding Double Bed with Mattress | No Assembly Required | Foldable Bed for Sleeping/Guests/Rented Apartments/Bedroom(4x6.25ft, Black)",
        "price": "₹12,599",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/71kKeq8zFYL._AC_UL640_QL65_.jpg",
        "asin": "B0BWS1QCYZ",
        "affiliate": "https://www.amazon.in/dp/B0BWS1QCYZ/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "UHUD CRAFTS Beautiful Antique Wooden Fold-able Side Table/End Table/Plant Stand/Stool Living Room Kids Play Furniture Table Round Shape",
        "price": "₹399",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/51eoKWxpEQL._AC_UL320_.jpg",
        "asin": "B0927T6DS6",
        "affiliate": "https://www.amazon.in/dp/B0927T6DS6/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "Da URBAN® Merlion Office Chair,High Back Mesh Ergonomic Home Office Desk Chair with 3 Years Warranty, Adjustable Armrests,Adjustable Lumbar Support,Tilt Lock Mechanism (Grey)",
        "price": "₹5,399",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/61qEhDtYkRL._AC_UL320_.jpg",
        "asin": "B0BZPJQ2X2",
        "affiliate": "https://www.amazon.in/dp/B0BZPJQ2X2/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "Lukzer 3 Layer Engineered Wood Multipurpose Rack Bookshelf Storage Organizer Stand (MR-010/Oak Brown/80x33x22cm)",
        "price": "₹1,495",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/81p6raoi-hL._AC_UL320_.jpg",
        "asin": "B0CXLR5HKB",
        "affiliate": "https://www.amazon.in/dp/B0CXLR5HKB/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "ABOUT SPACE Wooden Cabinet - 3 Tier Engineered Wood Storage Cabinet for Living Room with Magnetic Door, Space Saving Furniture for Home, Kitchen (Oak Red - L 38 x B 38.5 x H 100.5 cm)",
        "price": "₹3,799",
        "rating": "3.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/71O4-mpcfBL._AC_UL320_.jpg",
        "asin": "B0CB8VLYL1",
        "affiliate": "https://www.amazon.in/dp/B0CB8VLYL1/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "Home Sparkle MDF Wooden Wall Shelves (Brown)",
        "price": "₹640",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/71ETTTGYfnL._AC_UL320_.jpg",
        "asin": "B012ZXGVRU",
        "affiliate": "https://www.amazon.in/dp/B012ZXGVRU/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "AVZEEGO Kitchen Trolley with Wheels, Kitchen Organizer Items and Storage Solutions for Round Kitchen Organizer and Kitchen Accessories Items (4 Layer Square)",
        "price": "₹1,899",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/61gl-EhtBbL._AC_UL320_.jpg",
        "asin": "B0FG16J5HD",
        "affiliate": "https://www.amazon.in/dp/B0FG16J5HD/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "Wudyhub Computer Home/Office Desk | Writing Study | Laptop Table | Modern Simple Desk | Small Desks for Small Spaces | Sturdy Desk for Home, Office, Bedroom, Living Room (ST-09-White)",
        "price": "₹2,099",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/61s5+09b0HL._AC_UL320_.jpg",
        "asin": "B0FG91N1WG",
        "affiliate": "https://www.amazon.in/dp/B0FG91N1WG/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "DaneWood Wooden 5 Seater Sofa Set - 3+1+1, for Living Room, Drawing Room, Office & Lounge | Solid Sheesham Wood, Fabric (Brown)",
        "price": "₹31,995",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/61JctlgNtGL._AC_UL320_.jpg",
        "asin": "B08NC3Q2FQ",
        "affiliate": "https://www.amazon.in/dp/B08NC3Q2FQ/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "Dime Store Engineered Wood Wall Shelf Corner Shelf Home Decor Item,Glossy Finish,Set of 5,White",
        "price": "₹780",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/710id8okAyL._AC_UL320_.jpg",
        "asin": "B084G8V5ZJ",
        "affiliate": "https://www.amazon.in/dp/B084G8V5ZJ/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "AS Furniture Arts Solid Sheesham Wood 6 Seater Sofa Set For Living Room Wooden Sofa Set For Living Room Furniture 3+2+1 (Standard, Natural Teak Finish)",
        "price": "₹26,999",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/71-vuLLNRYL._AC_UL320_.jpg",
        "asin": "B0B5DSJLKN",
        "affiliate": "https://www.amazon.in/dp/B0B5DSJLKN/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "ABOUT SPACE TV Stand - Engineered Wood TV Showcase with Foot Pad Entertainment Console Shelf Storage for Set Top Box, Decor, Books for Living Room TV Unit - Oak Red(L 101 x B 40.5 x H 41 cm)",
        "price": "₹2,899",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/71avwGFASHL._AC_UL320_.jpg",
        "asin": "B0CCVYYBFT",
        "affiliate": "https://www.amazon.in/dp/B0CCVYYBFT/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "Dime Store Set top Box Stand | WiFi Router Holder Wooden Wall Shelves | Setup Box Stand for Home | Wall Mount Stylish WiFi Router Holder TV Cabinet Living Room Furniture",
        "price": "₹290",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/71koXLKBP+L._AC_UL320_.jpg",
        "asin": "B091PY4S5H",
        "affiliate": "https://www.amazon.in/dp/B091PY4S5H/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "Modern Round Side Table, Home Decor for Living Room, Bed Side Tables for Bed Room, stools for Home, Furniture for Home, 2-Tier White Shelves, 30 x 30 x 40 cm",
        "price": "₹499",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/51mv-jIBNWL._AC_UL320_.jpg",
        "asin": "B0FNWMP3S2",
        "affiliate": "https://www.amazon.in/dp/B0FNWMP3S2/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "FireBees Modern Wooden Bedside Table with 3 Shelves | Compact Side Table for Bedroom & Living Room | Bed Side Table Organizer, End Table & Home Furniture | Dark Brown (40.6x25.4x50.8 cm)",
        "price": "₹795",
        "rating": "3.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/61Q+Vxezd-L._AC_UL320_.jpg",
        "asin": "B0GDQR3MQT",
        "affiliate": "https://www.amazon.in/dp/B0GDQR3MQT/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "Aarsun Teak Wooden Round Bed Luxury Interiors Bedroom Furniture Without Side Table (Standard Size, Golden ), Twin",
        "price": "₹4,76,999",
        "rating": "2.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/51uqb8gkbTL._AC_UL320_.jpg",
        "asin": "B07P46Z91X",
        "affiliate": "https://www.amazon.in/dp/B07P46Z91X/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "DEVOKO Outdoor 4 Seater Rope Sofa Set with Comfortable All Weather Resistant Cushions and Glass Top Center Table for Garden, Patio, Poolside Area (Beige &Off-White)",
        "price": "₹23,299",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/81s1tBpdgHL._AC_UL320_.jpg",
        "asin": "B0FCBZ6SVD",
        "affiliate": "https://www.amazon.in/dp/B0FCBZ6SVD/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "Nilkamal Goa 3+1+1 Seater Plastic Sofa Set with Cushion|Indoor & Outdoor Furniture|Patio Chair Two Seater| Perfect for Gardens Poolside Cafes Restaurants and Terraces Weathered Brown",
        "price": "₹29,800",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/612zBREP0tL._AC_UL320_.jpg",
        "asin": "B09X66H34M",
        "affiliate": "https://www.amazon.in/dp/B09X66H34M/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "Happer Plastic Premium Multipurpose Wall Mounted Storage Cabinet with Mirror, Prime Look (White)",
        "price": "₹1,099",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/61VxgYs6feL._AC_UL320_.jpg",
        "asin": "B0BDG4VG2G",
        "affiliate": "https://www.amazon.in/dp/B0BDG4VG2G/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "Home furniture Wooden Sofa Set for Living Room and Office 3 Seater (3 Seater, Teak Finish) Handicraft- Hand Made",
        "price": "₹13,999",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/51tI1HYW7bS._AC_UL320_.jpg",
        "asin": "B0CSG1NG83",
        "affiliate": "https://www.amazon.in/dp/B0CSG1NG83/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "Modern Round Wall Shelf Metal Frame with Wooden Shelves | Decorative Wall Mounted Storage Organizer for Living Room, Bedroom & Home Décor",
        "price": "₹1,349",
        "rating": "4.7 out of 5",
        "image": "https://m.media-amazon.com/images/I/61DeIu5LojL._AC_UL320_.jpg",
        "asin": "B0GHZGQ9ZT",
        "affiliate": "https://www.amazon.in/dp/B0GHZGQ9ZT/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "Furniture Single Seater Swing Chair with Stand & Cushion Outdoor Indoor Balcony Garden Patio,Powder Coated Frame,UV Protected Wicker,Premium Cushion NS-17",
        "price": "₹10,499",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/61lyVN9E-ML._AC_UL320_.jpg",
        "asin": "B0F6M9ZXNP",
        "affiliate": "https://www.amazon.in/dp/B0F6M9ZXNP/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "BOXJOY 6 Shelf Black Shoe Rack with 3 Doors, 5 Hook Steel Holder & Wooden Hammer Home Storage PP Plastic Organizer with Metal Door Frame and Foots for Chappal Slipper Sandals Shoes Box Stand",
        "price": "₹1,649",
        "rating": "3.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/617WmLCjCTL._AC_UL320_.jpg",
        "asin": "B0FSS651G5",
        "affiliate": "https://www.amazon.in/dp/B0FSS651G5/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "FURNY Carlo 4 Seater - L Shape Convertible Sofa Set for Living Room Furniture Sets 3 Piece Small Sofa, Modular Sectional Couch for Small Space, Upholstery-Velvet Fabric (Teal)",
        "price": "₹11,899",
        "rating": "3.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/61feMRpkMoL._AC_UL320_.jpg",
        "asin": "B0DV5PCZNV",
        "affiliate": "https://www.amazon.in/dp/B0DV5PCZNV/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "Nilkamal Arthur Wooden Double Bed Without Storage | Engineered Wood | Knock Down | Contemporary Design | Walnut",
        "price": "₹10,890",
        "rating": "3.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/61yA5dZ9usL._AC_UL320_.jpg",
        "asin": "B09S3QQQ14",
        "affiliate": "https://www.amazon.in/dp/B09S3QQQ14/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "Wooden Small Round End Table MIni Table Side TableFaux Marble Top 12x12x13 Inch Flower Pot Stand Bed Side Table Living Room Furniture Bedroom and Farmhouse (Brown)",
        "price": "₹425",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/71qtOH+OtRL._AC_UL320_.jpg",
        "asin": "B0G14LSCV4",
        "affiliate": "https://www.amazon.in/dp/B0G14LSCV4/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "FireBees Modern Wooden Bedside Table with 3 Shelves | Compact Side Table for Bedroom & Living Room | Bed Side Table Organizer, End Table & Home Furniture | Dark Brown (40.6x25.4x50.8 cm)",
        "price": "₹799",
        "rating": "3.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/61mKGRj0+iL._AC_UL320_.jpg",
        "asin": "B0FCG49VSH",
        "affiliate": "https://www.amazon.in/dp/B0FCG49VSH/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "DEVOKO 7 Piece Outdoor Conversation Patio Furniture Set All Weather Wicker Sectional Couch 7 Seater Sofa With Center Table Ottoman For Garden,Terrace,Porch,Lawn,Backyard(Silver&Grey)",
        "price": "₹49,999",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/91kqAHSgvaL._AC_UL320_.jpg",
        "asin": "B0C16TMNQQ",
        "affiliate": "https://www.amazon.in/dp/B0C16TMNQQ/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "Lotey Outdoor D-12 Chairs Table Set 4+1 Wicker Patio Furniture Sets 4 Chair and 1 Table with Cushions for Garden Balcony Bedroom Powder Coated Frame Uv Protected Wicker (Cream +Yellow)",
        "price": "₹12,999",
        "rating": "4.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/61d7gmYjrSL._AC_UL320_.jpg",
        "asin": "B0DZR634TN",
        "affiliate": "https://www.amazon.in/dp/B0DZR634TN/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "UB Unity Brand 4pcs Caster Wheel Self Adhesive Caster Wheel 360° Swivel Wheels for Furniture, Small Appliance, DIY Modification Moving Table Heavy Duty Caster Wheels (White)",
        "price": "₹198",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/61ca9F6+ltL._AC_UL320_.jpg",
        "asin": "B0FN7BW9LN",
        "affiliate": "https://www.amazon.in/dp/B0FN7BW9LN/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "Sheesham Wood Small End Table/Side Table/Plant Stand/Round Stool with Hairpin Legs for Home Decor (Wood Natural)",
        "price": "₹649",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/6148Qti0IxL._AC_UL320_.jpg",
        "asin": "B0BVCQDPJS",
        "affiliate": "https://www.amazon.in/dp/B0BVCQDPJS/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "Patio Seating Chair and Table Set Garden Coffee Table Set with 1 Table and 2 Chairs Set Outdoor Furniture (Cream) - Rattan",
        "price": "₹8,999",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/71imyBTLBUL._AC_UL320_.jpg",
        "asin": "B0CKHTMWK6",
        "affiliate": "https://www.amazon.in/dp/B0CKHTMWK6/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "Garden Patio Seating Chair and Table Set Outdoor Balcony Garden Coffee Table Set Furniture with 1 Table and 4 Chairs Set (Black), Rattan, 22 Inch, 24 Inch, Inch",
        "price": "₹11,498",
        "rating": "4.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/81O2u1MhEdL._AC_UL320_.jpg",
        "asin": "B09GM8ZN1Y",
        "affiliate": "https://www.amazon.in/dp/B09GM8ZN1Y/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "Skafa Metal End of Bed Bench-Upholstered Entry Shoe Storage with Nailhead Trim,Black Mental Frame Ottoman Bench for Bedroom Entry Window Mudroom Living Room (White)",
        "price": "₹2,599",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/61fCFfUv-9L._AC_UL320_.jpg",
        "asin": "B0DXVG7H7Z",
        "affiliate": "https://www.amazon.in/dp/B0DXVG7H7Z/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "Home furniture Wooden Sofa Set for Living Room and Office 5 Seater (Alanis (Walnut Finish) Handicraft- Handmade",
        "price": "₹25,999",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/61lgDdkrXkS._AC_UL320_.jpg",
        "asin": "B09525K2F5",
        "affiliate": "https://www.amazon.in/dp/B09525K2F5/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "Yookeer Modern Bedside Table with 3 Shelves,Bed Side Table Wooden Organizer Stand/Home Decor Table/Coffee Table/End Table/Side Table for Bedroom/End Table for Living Room 40.6x25.4x50.8 cm,Dark Brown",
        "price": "₹829",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/818VPBTCxBL._AC_UL320_.jpg",
        "asin": "B0DS95TJ7D",
        "affiliate": "https://www.amazon.in/dp/B0DS95TJ7D/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "Kingsman Furnitures ABEL Rattan Teak Wood Accent Arm Chair for Home Bedroom, Living, Dining, Drawing Room | Ultra Soft and Comfortable for Stress Free | Removable Cushion (Natural)",
        "price": "₹12,051",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/6156VyQRVoL._AC_UL320_.jpg",
        "asin": "B0CJRRFMB2",
        "affiliate": "https://www.amazon.in/dp/B0CJRRFMB2/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "FURNY Cosmos 5 Seater Leatherette 3+1+1 Sofa Set (Brown) Premium Velvet Finish | Durable Comfort | Ideal for Living Room",
        "price": "₹18,899",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/61cbIczPgPL._AC_UL320_.jpg",
        "asin": "B0G8KXN33J",
        "affiliate": "https://www.amazon.in/dp/B0G8KXN33J/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "VK Furniture Solid Sheesham Wood 4 Seater Dining Table Set | Solid Wood Dining Table with Cushioned Chairs | Space Saving Wooden Dining Set for Home, Kitchen, Restaurant & Hotel (Chestnut Finish)",
        "price": "₹15,616",
        "rating": "3.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/71QFx-Hs4nL._AC_UL320_.jpg",
        "asin": "B0BGSFWKGT",
        "affiliate": "https://www.amazon.in/dp/B0BGSFWKGT/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "Enigmatic Woodworks Wooden Large Open Bookshelf Multipurpose for Home Rack Showcase Organizer for Living Room I Study Room I 4-Tier I Finish-Suede DIY (Wenge)",
        "price": "₹1,998",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/81OxeNvTqrL._AC_UL320_.jpg",
        "asin": "B0FD38YBXF",
        "affiliate": "https://www.amazon.in/dp/B0FD38YBXF/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "ABOUT SPACE 6 Tier Book Shelf for Home Library 6ft with Assembly,Cabinet For Storage,White Bookshelves for Living Room Display Stand Book Rack For Office,Kitchen,Bedroom(33x24x180cm - Engineered Wood)",
        "price": "₹2,599",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/611hdjg99tL._AC_UL320_.jpg",
        "asin": "B0C5HKLYGK",
        "affiliate": "https://www.amazon.in/dp/B0C5HKLYGK/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "Streem Furniture Solid Wooden Sideboard Cabinet for Living Room, Drawing Room, Office & Lounge, Storage Type: 2 Doors & 3 Drawers (Natural)",
        "price": "₹19,899",
        "rating": "4.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/81GycJ95qzL._AC_UL320_.jpg",
        "asin": "B0DWLMP512",
        "affiliate": "https://www.amazon.in/dp/B0DWLMP512/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "K25 Cotton Floor Bed Mattress with High-Density Foam for Extra Bedding | Lightweight Portable Rolling Mat for Travel Yoga Outdoor & Camping (Size: 72x48x0.8 Inch, Multicolor)",
        "price": "₹1,699",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/613iJzMpV+L._AC_UL320_.jpg",
        "asin": "B0G92H59RK",
        "affiliate": "https://www.amazon.in/dp/B0G92H59RK/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "LSGF Sofa Set Modern Luxury Furniture Fabric Upholstery Lounge Sofa with Gold Metal Sofa for Home | Hotel | Cafe (1+2+3 Sofa Set, Forest Green)",
        "price": "₹99,899",
        "rating": "",
        "image": "https://m.media-amazon.com/images/I/512ln9qlG8L._AC_UL320_.jpg",
        "asin": "B09FZM21JX",
        "affiliate": "https://www.amazon.in/dp/B09FZM21JX/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "Kunjal Furniture Solid Sheesham Wood Sofa Cum Bed with Storage for Living Room | 3-Seater Convertible Sofa Bed | Handmade Wooden Furniture (Walnut, Cane)",
        "price": "₹34,495",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/71pZDkfK5JL._AC_UL320_.jpg",
        "asin": "B0GG53S4FP",
        "affiliate": "https://www.amazon.in/dp/B0GG53S4FP/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "Sheesham Wooden 5 Seater Sofa Set For Living Room | Rosewood Cushion Sofa With Side Newspaper Holder For Home & Office | Lounge (Honey, 3+1+1 Seater)",
        "price": "₹25,499",
        "rating": "4.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/81PdOjHarqL._AC_UL320_.jpg",
        "asin": "B0F93LZ6ZK",
        "affiliate": "https://www.amazon.in/dp/B0F93LZ6ZK/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "Shuttle Art Desk Organizer with 2 Drawers | Multi-Functional Stationery Holder for Office, Study Table, Home | 5 Compartment Pen, Pencil, Marker Storage Box for School & Art Supplies (White)",
        "price": "₹199",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/71R42qRoy3L._AC_UL320_.jpg",
        "asin": "B0FJM311NX",
        "affiliate": "https://www.amazon.in/dp/B0FJM311NX/?tag=mydeals03c-21",
        "category": "Office Supplies"
    },
    {
        "title": "FLAIR Writemore Kit 149|Blue",
        "price": "₹149",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/81LF+ekHaYL._AC_UL320_.jpg",
        "asin": "B09FL9YF53",
        "affiliate": "https://www.amazon.in/dp/B09FL9YF53/?tag=mydeals03c-21",
        "category": "Office Supplies"
    },
    {
        "title": "JK Copier Paper - A4, 75 GSM, 1 Ream, 500 Sheets",
        "price": "₹377",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/31Ip4aURUpL.png",
        "asin": "B00MVV81MK",
        "affiliate": "https://www.amazon.in/dp/B00MVV81MK/?tag=mydeals03c-21",
        "category": "Office Supplies"
    },
    {
        "title": "Luxor Pro-Desk Set of 7 Assorted Combo | Perfect for Home and Office | Essential Stationery Item Kit | Writing tools | Office writing supplies",
        "price": "₹150",
        "rating": "4.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/81nL4Lx-Q+L._AC_UL320_.jpg",
        "asin": "B0F6D87J91",
        "affiliate": "https://www.amazon.in/dp/B0F6D87J91/?tag=mydeals03c-21",
        "category": "Office Supplies"
    },
    {
        "title": "BRUSTRO Assorted Clip Box | Includes 120 Paper Clips-28mm & 56 Binder Clips (25mm- 6 pcs| 19mm- 15 pcs| 15mm- 35pcs) | Home, Office, Stationery use, Ideal for Kids and Adults, Reusable, Flexible",
        "price": "₹290",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/81-uPq+MNHL._AC_UL320_.jpg",
        "asin": "B0CCJFBR48",
        "affiliate": "https://www.amazon.in/dp/B0CCJFBR48/?tag=mydeals03c-21",
        "category": "Office Supplies"
    },
    {
        "title": "Primelife File Tray Rack ABS Plastics | Foldable Office Desk Accessories | Durable & Sturdy | Easy Assembly | Efficient Organizer | Plastic Office Stationery Files Layer Rack -3LAYER(Black)",
        "price": "₹396",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/71xdyYvUuML._AC_UL320_.jpg",
        "asin": "B0CZT76W2C",
        "affiliate": "https://www.amazon.in/dp/B0CZT76W2C/?tag=mydeals03c-21",
        "category": "Office Supplies"
    },
    {
        "title": "Kangaro Desk Essentials DP-480 2 Hole Heavy Duty Metal Paper Punch | Removable Chip Tray | 12 Sheets Capacity | Office Essentials | Pack of 1 | Color May Vary",
        "price": "₹130",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/61oBP-IawiL._AC_UL320_.jpg",
        "asin": "B07NY2VDTX",
        "affiliate": "https://www.amazon.in/dp/B07NY2VDTX/?tag=mydeals03c-21",
        "category": "Office Supplies"
    },
    {
        "title": "Scotch 6-inches Stainless Steel Multi-Purpose Scissor (Red)",
        "price": "₹229",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/31Ip4aURUpL.png",
        "asin": "B078KLYH4T",
        "affiliate": "https://www.amazon.in/dp/B078KLYH4T/?tag=mydeals03c-21",
        "category": "Office Supplies"
    },
    {
        "title": "Kangaro DE Mini 10 Manual Staplers",
        "price": "₹245",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/71aYkxSjhrL._AC_UL320_.jpg",
        "asin": "B07ZDJLKVJ",
        "affiliate": "https://www.amazon.in/dp/B07ZDJLKVJ/?tag=mydeals03c-21",
        "category": "Office Supplies"
    },
    {
        "title": "GLUN® A4 Transparent Document File Folders with Button Closure – Set of 5 Poly Envelope File Folders, Waterproof Plastic Paper Organizer for Office, School, Bills & Certificates (Black)",
        "price": "₹288",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/81mH2Osyh1L._AC_UL320_.jpg",
        "asin": "B0F4QTRZS6",
        "affiliate": "https://www.amazon.in/dp/B0F4QTRZS6/?tag=mydeals03c-21",
        "category": "Office Supplies"
    },
    {
        "title": "Scotch Dual-Purpose Scissor Cum Cutter | Universal Tool for Unboxing, Box Cutting, Art & Craft with Durable Design, Soft Grip, Non-Stick & Safe Blades, Green",
        "price": "₹749",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/51iyNgQ4bqL._AC_UL640_QL65_.jpg",
        "asin": "B0C7LT7JSP",
        "affiliate": "https://www.amazon.in/dp/B0C7LT7JSP/?tag=mydeals03c-21",
        "category": "Office Supplies"
    },
    {
        "title": "LIRAMARK Mobile Phone Charging Stand, Storage Holder, Bedside Fixed Rack, Home Organization and Storage Supplies, Bedroom Accessories, Office Accessories, Bathroom Accessories (Pack of 1)",
        "price": "₹119",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/61mJSikurML._AC_UL320_.jpg",
        "asin": "B0BQMJZZNM",
        "affiliate": "https://www.amazon.in/dp/B0BQMJZZNM/?tag=mydeals03c-21",
        "category": "Office Supplies"
    },
    {
        "title": "Casio MJ-12D 150 Steps Check and Correct Desktop Financial Calculator, Black",
        "price": "₹439",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/611slw6gynL._AC_UL320_.jpg",
        "asin": "B0752LL57V",
        "affiliate": "https://www.amazon.in/dp/B0752LL57V/?tag=mydeals03c-21",
        "category": "Office Supplies"
    },
    {
        "title": "GLUN® Multicolour Sticky Notes 400 Sheets Strong Adhesive, Self-Stick, Multi-Color, Ideal for Notes, Organization, and Reminders Bright Morandi Colors",
        "price": "₹126",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/71W3YS4sb9L._AC_UL320_.jpg",
        "asin": "B0F1T74XDW",
        "affiliate": "https://www.amazon.in/dp/B0F1T74XDW/?tag=mydeals03c-21",
        "category": "Office Supplies"
    },
    {
        "title": "UCRAVO Blue Office Desk Organizer, Plastic Desktop Organizer with Pencil Holder, Sticky Note Tray, Stationery Supplies Organizers All in One Office Supplies & Cool Desk Accessories Pen Holder Caddy",
        "price": "₹199",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/61UfeItFeoL._AC_UL320_.jpg",
        "asin": "B0FNWRFSBZ",
        "affiliate": "https://www.amazon.in/dp/B0FNWRFSBZ/?tag=mydeals03c-21",
        "category": "Office Supplies"
    },
    {
        "title": "SPS Exampad A4 Plastic Clipboard with Built-in Storage and Pen Holder - Ideal for School, Office, Travel - Perfect for Students and Professionals, School and Office - Green",
        "price": "₹259",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/816m9uPepFL._AC_UL320_.jpg",
        "asin": "B0G258M6CJ",
        "affiliate": "https://www.amazon.in/dp/B0G258M6CJ/?tag=mydeals03c-21",
        "category": "Office Supplies"
    },
    {
        "title": "STRIFF Windows & Office Keyboard Shortcuts Desk Mat | Gaming Mouse Pad Extended Size (800mm x 300mm x 2mm) Stitched Edges| Non-Slip Rubber Base|Computer Laptop|Keyboard Mouse Pad (Keyboard Shortcuts)",
        "price": "₹229",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/71BGHsmReWL._AC_UL320_.jpg",
        "asin": "B0CXDF3XT3",
        "affiliate": "https://www.amazon.in/dp/B0CXDF3XT3/?tag=mydeals03c-21",
        "category": "Office Supplies"
    },
    {
        "title": "Kangaro Desk Essentials HD-10D & 10/1M Staples Combo | Standard Stapler with Quick Loading Mechanism | Sturdy & Durable for Long Time Use | Color May Vary, Pack of 1",
        "price": "₹184",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/71m5WF4zmSL._AC_UL320_.jpg",
        "asin": "B08GJRTS2H",
        "affiliate": "https://www.amazon.in/dp/B08GJRTS2H/?tag=mydeals03c-21",
        "category": "Office Supplies"
    },
    {
        "title": "RECLUSE 12 PCS Highlighter Pastel Pen Marker Pastel Assorted Colours, Aesthetic Marker Pens Highlighter Set, Perfect for Diary or Notebook in School,Office Supplies Smooth Writing Quick Dry",
        "price": "₹185",
        "rating": "3.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/61xKh05eooL._AC_UL320_.jpg",
        "asin": "B0FWR5HMJK",
        "affiliate": "https://www.amazon.in/dp/B0FWR5HMJK/?tag=mydeals03c-21",
        "category": "Office Supplies"
    },
    {
        "title": "OFIXO 100 Pieces Colour Sheets Copy Printing Papers/Art and Craft Paper A4 Sheets Double Sided Coloured Origami Folding DIY Craft Smooth Finish Home, School, Office Stationery (10 Sheets each color)",
        "price": "₹147",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/51sNbRTiZJL._AC_UL320_.jpg",
        "asin": "B07SCZB24S",
        "affiliate": "https://www.amazon.in/dp/B07SCZB24S/?tag=mydeals03c-21",
        "category": "Office Supplies"
    },
    {
        "title": "SYGA 10-Digit Transparent Sugar Cube Calculator Office Supplies Scientific Computer Student Dedicated Accounting Calculator (Purple)",
        "price": "₹280",
        "rating": "3.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/51V8Nrrx8UL._AC_UL320_.jpg",
        "asin": "B0FL7VXGZS",
        "affiliate": "https://www.amazon.in/dp/B0FL7VXGZS/?tag=mydeals03c-21",
        "category": "Office Supplies"
    },
    {
        "title": "Corslet File Folders for Documents A4 Letter Size, 5 Pocket Certificate File Organiser Document Organizer Bag Expanding File Folder Portable File Organizer for School Office Supplies Document Folder",
        "price": "₹199",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/619fWQYPi2L._AC_UL320_.jpg",
        "asin": "B0D54935FN",
        "affiliate": "https://www.amazon.in/dp/B0D54935FN/?tag=mydeals03c-21",
        "category": "Office Supplies"
    },
    {
        "title": "SHUTTLE ART Sticky Notes Transparent Pad | 50 Sheets Clear Waterproof Transparent Sticky Notes | Reusable Sticky Notes Pad for Books, Study, Office & Aesthetic Stationery",
        "price": "₹149",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/51YY5gvMi0L._AC_UL320_.jpg",
        "asin": "B0CLJK59NT",
        "affiliate": "https://www.amazon.in/dp/B0CLJK59NT/?tag=mydeals03c-21",
        "category": "Office Supplies"
    },
    {
        "title": "Amazon Brand - Umi Rotating Desk Organizer Pen Pencil Holder with 9 Slot 360° Desktop Organizer for Office Supplies Stationery Staplers Clips Sticky Notes Remote Mobile Holder Visiting Card - White",
        "price": "₹499",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/618IMGkMG6L._AC_UL320_.jpg",
        "asin": "B0D2LC456X",
        "affiliate": "https://www.amazon.in/dp/B0D2LC456X/?tag=mydeals03c-21",
        "category": "Office Supplies"
    },
    {
        "title": "Shuban Metal Mesh Pencil Holder Round Pen Cups For Desk Organizer Classroom Organization Pencil Holders Wire Makeup Brush Holders For Desk Office Supplies-4 Pcs",
        "price": "₹370",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/81+cXGRA2qL._AC_UL320_.jpg",
        "asin": "B08L7W4QLG",
        "affiliate": "https://www.amazon.in/dp/B08L7W4QLG/?tag=mydeals03c-21",
        "category": "Office Supplies"
    },
    {
        "title": "5 Tier Mesh Metal Desk Organiser File Rack | Letter Tray A4 Papers Documents Holder Desk Organizer for Office (1 Pcs.)",
        "price": "₹809",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/51gDsngb76L._AC_UL320_.jpg",
        "asin": "B0B2X2TQB6",
        "affiliate": "https://www.amazon.in/dp/B0B2X2TQB6/?tag=mydeals03c-21",
        "category": "Office Supplies"
    },
    {
        "title": "COI Note Pad/Memo Book with Sticky Notes & Clip Holder with Pen for Gifting",
        "price": "₹182",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/41oLhpKArFL._AC_UL320_.jpg",
        "asin": "B00UGZWM2I",
        "affiliate": "https://www.amazon.in/dp/B00UGZWM2I/?tag=mydeals03c-21",
        "category": "Office Supplies"
    },
    {
        "title": "DailyObjects Large Premium Vegan Leather Desk Mat|Anti-Skid|Anti-Slip|85*45cm|Reversible Desk spread Turf Desk/Laptop Mat for Work from Home/Office/Gaming- Extended mouse pad and keyboard desk pad-Tan",
        "price": "₹848",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/61YKz5THoxL._AC_UL320_.jpg",
        "asin": "B08NXD7MHC",
        "affiliate": "https://www.amazon.in/dp/B08NXD7MHC/?tag=mydeals03c-21",
        "category": "Office Supplies"
    },
    {
        "title": "A4 Mesh Zipper File Folder Organizer with 3-Layer Separation – Dustproof Document Bag with Label Pocket, Lightweight Portable Pouch for Office, School, Students (Random Color Set of 2)",
        "price": "₹399",
        "rating": "3.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/51nljumXJQL._AC_UL320_.jpg",
        "asin": "B0FBMGSRYJ",
        "affiliate": "https://www.amazon.in/dp/B0FBMGSRYJ/?tag=mydeals03c-21",
        "category": "Office Supplies"
    },
    {
        "title": "Fevistik Glue Stick 25g, Pack of 3 | Multi-Purpose Glue Stick for School Projects, Art & Craft, DIY | Suitable for School & Office Activities | Easy to Use",
        "price": "₹141",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/51kxrVIfBHL._AC_UL320_.jpg",
        "asin": "B0CW35HF93",
        "affiliate": "https://www.amazon.in/dp/B0CW35HF93/?tag=mydeals03c-21",
        "category": "Office Supplies"
    },
    {
        "title": "Pragati Systems® Genius Regular Steel (Magnetic) Whiteboard for Office, Meeting & Presentation with Lightweight Aluminium Frame | Durable Magnetic White Board | Large Size 3x4 Feet (Pack of 1)",
        "price": "₹3,825",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/71Wfb4t39-L._AC_UL320_.jpg",
        "asin": "B073CKXM7N",
        "affiliate": "https://www.amazon.in/dp/B073CKXM7N/?tag=mydeals03c-21",
        "category": "Office Supplies"
    },
    {
        "title": "Recluse Stylish Multifunctional Stackable Desk Organizer with 2 Drawers and 5 Compartments | Pen Stand for Study Table, Office Use | Storage Box for Stationery, Art Supplies, Sticky Notes (Black)",
        "price": "₹199",
        "rating": "3.7 out of 5",
        "image": "https://m.media-amazon.com/images/I/71MN5rrejJL._AC_UL320_.jpg",
        "asin": "B0FKHPC7H8",
        "affiliate": "https://www.amazon.in/dp/B0FKHPC7H8/?tag=mydeals03c-21",
        "category": "Office Supplies"
    },
    {
        "title": "SHUTTLE ART 12 PCS Pastel Highlighter Pens | Dual Tip Soft Color Markers for Journaling, Note Taking, Office & School Supplies | Aesthetic Stationery Cute Highlighters for Study, Planner & Art (Set)",
        "price": "₹185",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/61Mh9fgXl8L._AC_UL320_.jpg",
        "asin": "B0G125TDHD",
        "affiliate": "https://www.amazon.in/dp/B0G125TDHD/?tag=mydeals03c-21",
        "category": "Office Supplies"
    },
    {
        "title": "SHUTTLE ART Gel Pens 5Pcs Retractable Quick Dry Ink Pens 0.5mm Fine Point Blue Ink Smooth Writing Pens for School Office Supplies Aesthetic pretty pens (Green tea)",
        "price": "₹146",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/71ZENciyrfL._AC_UL320_.jpg",
        "asin": "B0FGDBW6XJ",
        "affiliate": "https://www.amazon.in/dp/B0FGDBW6XJ/?tag=mydeals03c-21",
        "category": "Office Supplies"
    },
    {
        "title": "Luxor 5 Subject Single Ruled Notebook - A5 Size, 300 Pages, 70 GSM",
        "price": "₹146",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/81ygPSqMEWL._AC_UL320_.jpg",
        "asin": "B00LHZW3XY",
        "affiliate": "https://www.amazon.in/dp/B00LHZW3XY/?tag=mydeals03c-21",
        "category": "Office Supplies"
    },
    {
        "title": "GLUN Wooden Pen Stand with Mobile & Visiting Card Holder | Multipurpose Desk Organizer for Office & Home | Pen Pencil Stand with Business Card Holder Brown, 8X17.5X10 Cm",
        "price": "₹186",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/61nHKSGwBIL._AC_UL320_.jpg",
        "asin": "B0F2946WFB",
        "affiliate": "https://www.amazon.in/dp/B0F2946WFB/?tag=mydeals03c-21",
        "category": "Office Supplies"
    },
    {
        "title": "Pencil Pen Holder for Desk,9 Slots 360 Degree Rotating Desk Organizers,Desktop Storage Stationery Supplies Organizer, Cute Pencil Cup Pot For Office, School, Home (White)",
        "price": "₹399",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/61+PeXWt3tL._AC_UL320_.jpg",
        "asin": "B0FJ8HMVT3",
        "affiliate": "https://www.amazon.in/dp/B0FJ8HMVT3/?tag=mydeals03c-21",
        "category": "Office Supplies"
    },
    {
        "title": "SPS Transparent Report File – Set of 10 | Plastic File for A4 Documents | for Office, School & Home | Holds Up to 150 Sheets | Best for Interviews and Reports",
        "price": "₹299",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/81AUvjitgwL._AC_UL320_.jpg",
        "asin": "B0F8HZ1BFN",
        "affiliate": "https://www.amazon.in/dp/B0F8HZ1BFN/?tag=mydeals03c-21",
        "category": "Office Supplies"
    },
    {
        "title": "STRIFF World Map Extended Size (800 mm x 300 mm x 2 mm) Gaming Mouse Pad| Desk Mat | Stitched Edges| Non-Slip Rubber Base|Computer Laptop|Keyboard Mouse Pad for Office & Home (World Map)",
        "price": "₹229",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/61s6d6BxW4L._AC_UL320_.jpg",
        "asin": "B0CXDN7V9N",
        "affiliate": "https://www.amazon.in/dp/B0CXDN7V9N/?tag=mydeals03c-21",
        "category": "Office Supplies"
    },
    {
        "title": "Corslet 12 Pcs Dual Tip Brush Pens Felt Tip Pen Set 12 Colors, Colouring Pens Art Markers for Kids and Adults, Colouring Book, Art Supplies Fineliner Tip Brush Marker for Drawing Sketching",
        "price": "₹178",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/81+nYKKiSFL._AC_UL320_.jpg",
        "asin": "B0CS665RX3",
        "affiliate": "https://www.amazon.in/dp/B0CS665RX3/?tag=mydeals03c-21",
        "category": "Office Supplies"
    },
    {
        "title": "eo Pen Stand for Study Table with Self-Watering Plant Pot, Glasses & Smartphone Holder – Desk Organizer & Pencil Holder for Office, Home, Kids, Students, Study Room (Desk Station Black)",
        "price": "₹399",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/51aqm8DHdOL._AC_UL320_.jpg",
        "asin": "B09N9FGMH7",
        "affiliate": "https://www.amazon.in/dp/B09N9FGMH7/?tag=mydeals03c-21",
        "category": "Office Supplies"
    },
    {
        "title": "3-Tier Mesh Metal Desk Organiser File Rack | A4 Letter Tray Document Holder | 3 Layer Metal File Paper Magazine Organizer for Office Home Desktop (Black)",
        "price": "₹499",
        "rating": "4.7 out of 5",
        "image": "https://m.media-amazon.com/images/I/81jMe3h1PZL._AC_UL320_.jpg",
        "asin": "B0GKGDBLWN",
        "affiliate": "https://www.amazon.in/dp/B0GKGDBLWN/?tag=mydeals03c-21",
        "category": "Office Supplies"
    },
    {
        "title": "Oblivion Multifunctional Tiered Shelf Freestanding File Rack With Drawers-4-Layer Desktop Storage Organizer For Office Supplies,Adjustable For A4/Letter Size,Sturdy & Space-Saving For Home Or Office",
        "price": "₹549",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/61PIFXdo1-L._AC_UL320_.jpg",
        "asin": "B0DPHVPNLR",
        "affiliate": "https://www.amazon.in/dp/B0DPHVPNLR/?tag=mydeals03c-21",
        "category": "Office Supplies"
    },
    {
        "title": "Buzz Cool Silver Metal Push Pull Stickers For Glass And Wood | Self Adhesive Stainless Steel Metal Sticker for Door | Push and Pull Stickers for Hospital Malls Office 1 set (2pcs)",
        "price": "₹275",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/71iAuNMS9lS._AC_UL320_.jpg",
        "asin": "B0979GL6BN",
        "affiliate": "https://www.amazon.in/dp/B0979GL6BN/?tag=mydeals03c-21",
        "category": "Office Supplies"
    },
    {
        "title": "LANLOY 346pcs Journal Supplies Kit Vintage Scrapbook Stickers Art Journaling Bullet Junk Journal Planners DIY Decoration Paper Stickers Craft Kits Notebook Collage Album (Plants Paradise)",
        "price": "₹349",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/71auacKBrUL._AC_UL320_.jpg",
        "asin": "B0FR332K89",
        "affiliate": "https://www.amazon.in/dp/B0FR332K89/?tag=mydeals03c-21",
        "category": "Office Supplies"
    },
    {
        "title": "amazon basics Narrow Ruled Writing Pad - 5 x 8 Inches, 50 Sheets, Pack Of 12 (Canary)",
        "price": "₹499",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/71N5sJEc5DL._AC_UL320_.jpg",
        "asin": "B00QSR9BT0",
        "affiliate": "https://www.amazon.in/dp/B00QSR9BT0/?tag=mydeals03c-21",
        "category": "Office Supplies"
    },
    {
        "title": "MosQuick Set Of 2 Transparent Sturdy Desk Supplies Organisers Magazine File Holder For Office Acrylic File Rack File Organizer Study Table Accessories Book Holder Table Organizer For Study Table",
        "price": "₹598",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/61ovgyT4eqL._AC_UL320_.jpg",
        "asin": "B0DFT1Z5XP",
        "affiliate": "https://www.amazon.in/dp/B0DFT1Z5XP/?tag=mydeals03c-21",
        "category": "Office Supplies"
    },
    {
        "title": "CentraLit Organizer Magazine File Holder Modern Desk, 3 Slot Modern Magazine Holder Stand for Table Desk Home File Stand Decor File Storage for Office (Black)",
        "price": "₹339",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/61ZQXo-tARL._AC_UL320_.jpg",
        "asin": "B0974KTDJQ",
        "affiliate": "https://www.amazon.in/dp/B0974KTDJQ/?tag=mydeals03c-21",
        "category": "Office Supplies"
    },
    
    {
        "title": "Depets Self Cleaning Slicker Brush, Pet Grooming Shedding Brush for Dogs and Cats - Easy to Remove Loose Undercoat, Pet Massaging Tool Suitable for Pets with Long or Short Hair Color May Vary",
        "price": "₹129",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/61qjyzM3+BL._AC_UL320_.jpg",
        "asin": "B08FJ655HL",
        "affiliate": "https://www.amazon.in/dp/B08FJ655HL/?tag=mydeals03c-21",
        "category": "Pet Supplies"
    },
    {
        "title": "Meat Up Dog Treats Biscuits Real Chicken Flavour, 500g +500g Total 1 Kg Pack",
        "price": "₹247",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/71qg9nW7CFL._AC_UL320_.jpg",
        "asin": "B079T87VW1",
        "affiliate": "https://www.amazon.in/dp/B079T87VW1/?tag=mydeals03c-21",
        "category": "Pet Supplies"
    },
    {
        "title": "Amazon Basics Self Cleaning Slicker Pet Grooming Brush | Pet Cleaning Tool Suitable for All Pets | Rectangular Shape",
        "price": "₹179",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/71iWJiqLLLL._AC_UL320_.jpg",
        "asin": "B0CV55MWXK",
        "affiliate": "https://www.amazon.in/dp/B0CV55MWXK/?tag=mydeals03c-21",
        "category": "Pet Supplies"
    },
    {
        "title": "Himalaya Erina-EP Shampoo | 200 ml | Tick & Flea Control for Dogs & Cats | with Neem & Eucalyptus for Skin Health & Hygiene",
        "price": "₹226",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/51UYPTXkUhL._AC_UL320_.jpg",
        "asin": "B073RVF88P",
        "affiliate": "https://www.amazon.in/dp/B073RVF88P/?tag=mydeals03c-21",
        "category": "Pet Supplies"
    },
    {
        "title": "PUPPEE Wipe ME 100% Biodegradable 96 Count (Pack of 2) Wet Wipes for Dogs, Cats & All Pets | Lavender Essential, Vitamin E & Olive Oil | Anti-Bacterial | Cleansing, Deodorising & Grooming Wipes",
        "price": "₹195",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/71dDrG6kN-L._AC_UL320_.jpg",
        "asin": "B0B34TC2ZM",
        "affiliate": "https://www.amazon.in/dp/B0B34TC2ZM/?tag=mydeals03c-21",
        "category": "Pet Supplies"
    },
    {
        "title": "Qpets® Pet Hair Removal Gloves, Static-Enhanced Pet Hair Removal Mitt, Reusable Grooming Mitt Cleaning Glove for Furniture, Carpets, Car Seats & Gentle Massage for Dogs Cats (23.5x18cm)",
        "price": "₹218",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/71uUtvrPyIL._AC_UL320_.jpg",
        "asin": "B0FG266LJX",
        "affiliate": "https://www.amazon.in/dp/B0FG266LJX/?tag=mydeals03c-21",
        "category": "Pet Supplies"
    },
    {
        "title": "Pets Empire Stainless Steel Dog Bowl, Dog Food Bowl, Dog Feeding Bowl, Medium (Set of 2 x 700ml)",
        "price": "₹189",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/71g03h7tp9L._AC_UL320_.jpg",
        "asin": "B072XW1FSP",
        "affiliate": "https://www.amazon.in/dp/B072XW1FSP/?tag=mydeals03c-21",
        "category": "Pet Supplies"
    },
    {
        "title": "6-in-1 Pet Grooming Combo for Dogs & Cats | Bathing Brush, Silicone Shampoo Dispenser, Deshedding Glove, Slicker Brush, Nail Clipper & File | Complete Pet Cleaning, Bathing & Shedding Care Kit",
        "price": "₹474",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/81eSLqSesML._AC_UL320_.jpg",
        "asin": "B0G48C7HFJ",
        "affiliate": "https://www.amazon.in/dp/B0G48C7HFJ/?tag=mydeals03c-21",
        "category": "Pet Supplies"
    },
    {
        "title": "Pet Wipes for Dogs & Cats | 160 Count | 80 x Pack of 2 | Vet Recommended Grooming Wipes |Alcohol-Free Wet Wipes for Cats & Dogs|Pets Dry Bathing, Paw Cleaning| Aloe Vera, Jojoba Oil, Vitamin E",
        "price": "₹189",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/61r1Ou1S5UL._AC_UL320_.jpg",
        "asin": "B0FH2FB8GF",
        "affiliate": "https://www.amazon.in/dp/B0FH2FB8GF/?tag=mydeals03c-21",
        "category": "Pet Supplies"
    },
    {
        "title": "Foodie Puppies Dog Bath Brush Body Scrubber Shampoo Dispenser Tick Remover - (Silicone Dispenser Brush) for Shower Bathing and Shedding Soft Silicone Brushes for Pet Puppy Dogs Cat Rabbit Horse",
        "price": "₹111",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/61f3dfO3naL._AC_UL320_.jpg",
        "asin": "B0CG1T8J5B",
        "affiliate": "https://www.amazon.in/dp/B0CG1T8J5B/?tag=mydeals03c-21",
        "category": "Pet Supplies"
    },
    {
        "title": "Flynovate Self Cleaning Dog Comb & Cat Comb - Pet Hair Remover Grooming Comb with Switch & PAIN - FREE Slickers | Deshedding Dog Brush & Cat Brush To Gently Massage The Pets with FREE Bath Brush",
        "price": "₹649",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/81wYEm4LY5L._AC_UL640_QL65_.jpg",
        "asin": "B09TVY9J5F",
        "affiliate": "https://www.amazon.in/dp/B09TVY9J5F/?tag=mydeals03c-21",
        "category": "Pet Supplies"
    },
    {
        "title": "Grooming Wet Wipes 300 Count(Pack of 3) for Dogs, Cats & All Pets | Purified Water, Glycerin |Anti-Bacterial|Cleansing, Deodorising Wipes",
        "price": "₹258",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/81xU7fjrNcL._AC_UL320_.jpg",
        "asin": "B0DBHWMFVW",
        "affiliate": "https://www.amazon.in/dp/B0DBHWMFVW/?tag=mydeals03c-21",
        "category": "Pet Supplies"
    },
    {
        "title": "Dog Shampoo Gloves for Bathing – Silicone Dog Washing Gloves with Bristles – Pet Hair Removal Glove for Dogs & Cats – Puppy Essentials – Dog Grooming Supplies & Accessories – Shampoo Brush for Pets",
        "price": "₹144",
        "rating": "3.7 out of 5",
        "image": "https://m.media-amazon.com/images/I/81Q+WMQEt4L._AC_UL320_.jpg",
        "asin": "B0CP18D7XX",
        "affiliate": "https://www.amazon.in/dp/B0CP18D7XX/?tag=mydeals03c-21",
        "category": "Pet Supplies"
    },
    {
        "title": "emily pets Dog Chew Rope Toys Pack of 7 Combo for Dogs & Puppies Ball Dual-Tennis Knotted Chewing Dog Toy for Playing, Teeth Cleaning & Training (Color As Vary, Pack 7)",
        "price": "₹279",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/71FLjwSaDVL._AC_UL320_.jpg",
        "asin": "B0CTJVHJ2S",
        "affiliate": "https://www.amazon.in/dp/B0CTJVHJ2S/?tag=mydeals03c-21",
        "category": "Pet Supplies"
    },
    {
        "title": "AmazonBasics Pet Pee Pads for Potty Training| Standard | Regular 56 x 56cms | 50 Pieces | Leak-Proof Quick Dry Design, 5-Layer Design, for Small Dogs and Puppies (Standard, Regular Size, 50 Pads)",
        "price": "₹619",
        "rating": "3.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/71Co+yjlWAL._AC_UL320_.jpg",
        "asin": "B00MW8G3YU",
        "affiliate": "https://www.amazon.in/dp/B00MW8G3YU/?tag=mydeals03c-21",
        "category": "Pet Supplies"
    },
    {
        "title": "Foodie Puppies Professional Animal Nail Cutter Clipper Trimmer Filer - (Nail Clipper - Large) for Small, Medium, and Large Dogs, Puppies, Cats, and Kittens Claw Grooming Tool Set",
        "price": "₹195",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/61d+ilJQaeL._AC_UL320_.jpg",
        "asin": "B08CRT4H12",
        "affiliate": "https://www.amazon.in/dp/B08CRT4H12/?tag=mydeals03c-21",
        "category": "Pet Supplies"
    },
    {
        "title": "Pedigree Tasty Jerky Dog Treat, Chicken Flavour, 70g Jerky-style Treats for Bonding, Low-fat and Rich-protein* Dog Treat",
        "price": "₹170",
        "rating": "4.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/31Ip4aURUpL.png",
        "asin": "B00LHS7K0C",
        "affiliate": "https://www.amazon.in/dp/B00LHS7K0C/?tag=mydeals03c-21",
        "category": "Pet Supplies"
    },
    {
        "title": "Foodie Puppies Double Side Steel Needles Comb for Dogs and Cats - (Paw Dual Comb) | Grooming Rake Shedding for Dogs, Cats - Cleaning Supplies (Color May Vary)",
        "price": "₹153",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/61A3W8+PVQL._AC_UL320_.jpg",
        "asin": "B07N7G71NK",
        "affiliate": "https://www.amazon.in/dp/B07N7G71NK/?tag=mydeals03c-21",
        "category": "Pet Supplies"
    },
    {
        "title": "Foodie Puppies Pet Hair Remover Lint Roller with Handle and 4 Refills (300 Sheets), Hair Remover for Dogs and Cats, Ideal for Clothes, Furniture, Coats, Car Seats, Carpets, Fabric, and Dust Cleaning",
        "price": "₹299",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/81rIyUb9UAL._AC_UL320_.jpg",
        "asin": "B0B6SQX234",
        "affiliate": "https://www.amazon.in/dp/B0B6SQX234/?tag=mydeals03c-21",
        "category": "Pet Supplies"
    },
    {
        "title": "Absolut Pet Hip and Joint-Supplements for Dogs Chews that Improve Mobility & Bone Strength with Glucosamine, Chondroitin & Collagen (60 Chews)",
        "price": "₹999",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/5112RijP1rL._AC_UL320_.jpg",
        "asin": "B0DWX243RY",
        "affiliate": "https://www.amazon.in/dp/B0DWX243RY/?tag=mydeals03c-21",
        "category": "Pet Supplies"
    },
    {
        "title": "odo-rite Pet Area Freshener- 200Ml | Pet Odour Remover | Pet Safe & Child Safe | Bio Technological Based | Skin Safe | Urine Smell Remover | Can Be Used On All Surface, Aerosol",
        "price": "₹274",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/41L-uiVvC0L._AC_UL320_.jpg",
        "asin": "B07DKZP5K7",
        "affiliate": "https://www.amazon.in/dp/B07DKZP5K7/?tag=mydeals03c-21",
        "category": "Pet Supplies"
    },
    {
        "title": "Amazon Basics Folding Jaw Clamp Poop Scooper | Pet Waste Picker | Large",
        "price": "₹319",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/71C2p39WasL._AC_UL320_.jpg",
        "asin": "B0CFDWSQ1N",
        "affiliate": "https://www.amazon.in/dp/B0CFDWSQ1N/?tag=mydeals03c-21",
        "category": "Pet Supplies"
    },
    {
        "title": "PETS EMPIRE 8 Roll Dog Poop Bags Extra Thick and Strong | Leak Proof Poop Bags for Dogs | Plastic Waste Pick Up Biodegradable | Dog Potty Picker Bag | Unscented Waste Bag 120 Counts",
        "price": "₹179",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/51j0ynjvU1L._AC_UL320_.jpg",
        "asin": "B09QXDY4LJ",
        "affiliate": "https://www.amazon.in/dp/B09QXDY4LJ/?tag=mydeals03c-21",
        "category": "Pet Supplies"
    },
    {
        "title": "5-in-1 Pet Grooming Kit for Dogs & Cats – Includes Self Cleaning Brush, Cat Comb, Silicone Bath Scrubber, Flea Comb & Nail Clipper | Grooming Tools for All Hair Types | Dog Brush Kit",
        "price": "₹349",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/81v9xOq+FdL._AC_UL320_.jpg",
        "asin": "B0F5HV5QBR",
        "affiliate": "https://www.amazon.in/dp/B0F5HV5QBR/?tag=mydeals03c-21",
        "category": "Pet Supplies"
    },
    {
        "title": "6 in 1 Pet Grooming Kit for Dog and Cat with Shedding Brush Nail Clipper Bath Brush Flea Comb and Complete Grooming Tools Set for Home Pet Hair Care Fur Cleaning and Professional Daily Pet Grooming Use",
        "price": "₹299",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/61rgMiZox9L._AC_UL320_.jpg",
        "asin": "B0GFXSJSRC",
        "affiliate": "https://www.amazon.in/dp/B0GFXSJSRC/?tag=mydeals03c-21",
        "category": "Pet Supplies"
    },
    {
        "title": "Drools Puppy Wet Dog Food 0.9kg (150g x 6 Packs) | Real Chicken & Chicken Liver Chunks in Gravy | Better Digestibility & Overall Health | Supports Healthy Skin & Coat | Maintains Joint Health",
        "price": "₹188",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/71Fc3+zeBhL._AC_UL320_.jpg",
        "asin": "B0CP61Q4G7",
        "affiliate": "https://www.amazon.in/dp/B0CP61Q4G7/?tag=mydeals03c-21",
        "category": "Pet Supplies"
    },
    {
        "title": "Pedigree Dentastix Oral Care Dog Treat, Adult Medium Breed (10-25 kg), 720 g, Recommended by Vets, Supports Gum Health, Reduces Risk of Gum diseases",
        "price": "₹704",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/71xgVTxZQiL._AC_UL320_.jpg",
        "asin": "B01BBXRK7K",
        "affiliate": "https://www.amazon.in/dp/B01BBXRK7K/?tag=mydeals03c-21",
        "category": "Pet Supplies"
    },
    {
        "title": "Pet Clean Primrose Oil Eye & Ear Pads - Gentle Care for Dogs & Cats - 50 Count (Pack of 1)",
        "price": "₹279",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/41bZHG50S-L._AC_UL320_.jpg",
        "asin": "B0C3D1T71J",
        "affiliate": "https://www.amazon.in/dp/B0C3D1T71J/?tag=mydeals03c-21",
        "category": "Pet Supplies"
    },
    {
        "title": "PANCA 4-in-1 Steam Brush for Dogs & Cats | Pet Grooming Brush with Deshedding Comb, Bath Spray & Massage | Hair Remover Tool for Long Hair Pets & Short (Orange Steam Brush)",
        "price": "₹249",
        "rating": "3.7 out of 5",
        "image": "https://m.media-amazon.com/images/I/51lA3fIsTcL._AC_UL320_.jpg",
        "asin": "B0GPY1KH89",
        "affiliate": "https://www.amazon.in/dp/B0GPY1KH89/?tag=mydeals03c-21",
        "category": "Pet Supplies"
    },
    {
        "title": "Foodie Puppies Pet Massage Rubber Bath Glove for Dogs, Cats, Rabbit, & Hamster | Grooming Shampoo Washing Soothing Bristles Hand Brush Comb - 1 Piece (Soothing Glove)",
        "price": "₹101",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/718o4rL38HL._AC_UL320_.jpg",
        "asin": "B076FPGHQX",
        "affiliate": "https://www.amazon.in/dp/B076FPGHQX/?tag=mydeals03c-21",
        "category": "Pet Supplies"
    },
    {
        "title": "Meat Up Adult Dry Dog Food 2.4kg (1.2kg + 1.2kg) | Chicken Flavour | Healthy Skin & Coat | Antioxidants | Enriched with Vitamins & Minerals",
        "price": "₹395",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/71kPRiVXwBL._AC_UL320_.jpg",
        "asin": "B075WXVYR4",
        "affiliate": "https://www.amazon.in/dp/B075WXVYR4/?tag=mydeals03c-21",
        "category": "Pet Supplies"
    },
    {
        "title": "Amazon Basics Stainless Steel Pet Feeding Bowls for Dogs and Cats | Set of 2 | 700 ml Each | Dry Kibble, Wet Food, Water Bowl | No-Tip, Non Sliding Design | Dishwasher Safe",
        "price": "₹169",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/71r+KxgC0xL._AC_UL320_.jpg",
        "asin": "B0BT1QYYXL",
        "affiliate": "https://www.amazon.in/dp/B0BT1QYYXL/?tag=mydeals03c-21",
        "category": "Pet Supplies"
    },
    {
        "title": "Pedigree Dentastix Oral Care Dog Treat, Adult Medium Breed (10-25 kg), 180 g, Recommended by Vets, Supports Gum Health, Reduces Risk of Gum diseases",
        "price": "₹178",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/612yuQFzRKL._AC_UL320_.jpg",
        "asin": "B014PCXPI2",
        "affiliate": "https://www.amazon.in/dp/B014PCXPI2/?tag=mydeals03c-21",
        "category": "Pet Supplies"
    },
    {
        "title": "Foodie Puppies Natural Rubber Spike Ball - 2.8inch/ 7cm | Suitable for Small to Medium Dogs and Puppies | Chewing, Teething, and Training Bouncy Ball Toy",
        "price": "₹140",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/817UzL+QmSL._AC_UL320_.jpg",
        "asin": "B076DJBKYZ",
        "affiliate": "https://www.amazon.in/dp/B076DJBKYZ/?tag=mydeals03c-21",
        "category": "Pet Supplies"
    },
    {
        "title": "PET360 Omega 3+6 Concentrated Salmon Fish Oil for Dogs & Cats with Vitamins & Minerals | Shinier Coat, Itch & Allergy Control | Improves Skin & Hair Health | Nutritional Supplement for Pets - 200 ml",
        "price": "₹296",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/51vV6IcxQUL._AC_UL320_.jpg",
        "asin": "B08PC2TXDX",
        "affiliate": "https://www.amazon.in/dp/B08PC2TXDX/?tag=mydeals03c-21",
        "category": "Pet Supplies"
    },
    {
        "title": "Foodie Puppies Dog Perfume Spray English Lavender - 200ml | Extract of Lavender and Aloe-vera | Daily use, Safe Deodorizer, Coat Perfume, Body Bad Odor - Safe & Effective Pet-Friendly Formula for Dogs",
        "price": "₹190",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/61d4c0dLTtL._AC_UL320_.jpg",
        "asin": "B0BDVPJRQD",
        "affiliate": "https://www.amazon.in/dp/B0BDVPJRQD/?tag=mydeals03c-21",
        "category": "Pet Supplies"
    },
    {
        "title": "4‑in‑1 Pet Grooming Set – Self‑Cleaning Slicker Deshedding Brush + Silicone Bath & Massage Tool + Adjustable Rubber Bath Scrubber + Ergonomic Nail Clippers – for Dogs & Cats",
        "price": "₹275",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/81wxjTP5VeL._AC_UL320_.jpg",
        "asin": "B0FGKC8Z8Y",
        "affiliate": "https://www.amazon.in/dp/B0FGKC8Z8Y/?tag=mydeals03c-21",
        "category": "Pet Supplies"
    },
    {
        "title": "Kennel Kitchen Soft Baked Lamb with Pumpkin Sticks Treats for Dogs, 100g (Pack of 1) | Soft Dog Chew Sticks | Dog Treats for Adult Dogs and Puppies",
        "price": "₹185",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/71yHenq7zDL._AC_UL320_.jpg",
        "asin": "B08JCY7PB6",
        "affiliate": "https://www.amazon.in/dp/B08JCY7PB6/?tag=mydeals03c-21",
        "category": "Pet Supplies"
    },
    {
        "title": "Pet Steam Brush for Dogs & Cats | Self-Cleaning Grooming Comb with Water Spray, Anti-Static, Massage Bristles | Portable Pet Hair Remover for Long & Short Fur (Multicolor)",
        "price": "₹498",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/71nQVBsKtZL._AC_UL320_.jpg",
        "asin": "B0FTVDSD16",
        "affiliate": "https://www.amazon.in/dp/B0FTVDSD16/?tag=mydeals03c-21",
        "category": "Pet Supplies"
    },
    {
        "title": "Purepet Adult Dry Cat Food 1kg | Ocean Fish Flavour | Hairball Protection | Heart Care with Taurine | Skin & Coat Health",
        "price": "₹181",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/71PON0RBeyL._AC_UL320_.jpg",
        "asin": "B0BMGP89P1",
        "affiliate": "https://www.amazon.in/dp/B0BMGP89P1/?tag=mydeals03c-21",
        "category": "Pet Supplies"
    },
    {
        "title": "RvPaws Dog Paw Cleaner, Dog Paw Washer Cup, 2 in 1 Portable Silicone Pet Cleaning Brush Feet Cleaner for Dogs Grooming with Muddy Paw,Dog Foot Cleaner for Large Dog, Pet Gifts for Dogs Owners (Small)",
        "price": "₹297",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/61aOiEWf4iL._AC_UL320_.jpg",
        "asin": "B0BL6SF73K",
        "affiliate": "https://www.amazon.in/dp/B0BL6SF73K/?tag=mydeals03c-21",
        "category": "Pet Supplies"
    },
    {
        "title": "Foodie Puppies Foot Washing Cup, Pet Paw Cleaner Portable Dog Paw Washer with Soft Silicone Bristles for Quickly Cleaning Pets Muddy Feet - Color May Vary (Paw Cleaner - Large)",
        "price": "₹382",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/61FPnYW05TL._AC_UL320_.jpg",
        "asin": "B07J69GMYT",
        "affiliate": "https://www.amazon.in/dp/B07J69GMYT/?tag=mydeals03c-21",
        "category": "Pet Supplies"
    },
    {
        "title": "Bekin 4‑in‑1 Pet Grooming Set – Bath Brush Steam Brush 3 in 1 Water Brush Brush + Silicone Bath & Massage Tool + Adjustable Rubber Bath Scrubber + Ergonomic Nail Clippers – for Dogs & Cats",
        "price": "₹275",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/81hSWwhgI7L._AC_UL320_.jpg",
        "asin": "B0FTSM2VBH",
        "affiliate": "https://www.amazon.in/dp/B0FTSM2VBH/?tag=mydeals03c-21",
        "category": "Pet Supplies"
    },
    {
        "title": "Meat Up Adult Wet Dog Food (8 x 70g) 560g + 560g (Free) 1120g| Real Chicken in Gravy| Buy 1 Get 1 | Healthy Digestion | Promotes Health & Vitality | Complete and Balanced Meal",
        "price": "₹294",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/71D3y4SAyWL._AC_UL320_.jpg",
        "asin": "B0F5446LN6",
        "affiliate": "https://www.amazon.in/dp/B0F5446LN6/?tag=mydeals03c-21",
        "category": "Pet Supplies"
    },
    {
        "title": "Foodie Puppies Pet Flea Comb for Dog, Cat, Birds and Rabbit (Flea Comb - Large) | Stainless Steel Fine Tooth Flea Lice Tear Stain Remover Comb | Hair Nit Comb For Head Nit Treatment Removes Head Nits",
        "price": "₹144",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/61wuID3USIL._AC_UL320_.jpg",
        "asin": "B0BQBJSJL6",
        "affiliate": "https://www.amazon.in/dp/B0BQBJSJL6/?tag=mydeals03c-21",
        "category": "Pet Supplies"
    },
    {
        "title": "Blutails Slicker Premium Brush for Pets (LARGE) | Self Cleaning Brush For Grooming Dogs and Cats | Suitable for Any Fur Babies (Rectangle Shape) (Grey).",
        "price": "₹199",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/71dfJK20TgL._AC_UL320_.jpg",
        "asin": "B0DNW88YCB",
        "affiliate": "https://www.amazon.in/dp/B0DNW88YCB/?tag=mydeals03c-21",
        "category": "Pet Supplies"
    },
    {
        "title": "Amazon Basics 2 In1 Pet Feeder Food and Water Dispenser|Stainless Steel Bowl|Automatic Water Dispensing Mechanism|Suitable for Cats and Dogs, 32 cm, H_22 cm, W_16.5 cm, Medium",
        "price": "₹329",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/51iD4gjpJaL._AC_UL320_.jpg",
        "asin": "B0CZKY77YP",
        "affiliate": "https://www.amazon.in/dp/B0CZKY77YP/?tag=mydeals03c-21",
        "category": "Pet Supplies"
    },
    {
        "title": "Drools Adult Dry Dog Food 4.2kg (3kg + 1.2kg Free) | Chicken & Egg Flavour | Supports Active Behaviour | Digestive Health & Immunity | Better Digestibility",
        "price": "₹712",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/71o84Bphv-L._AC_UL320_.jpg",
        "asin": "B07HBMB3WW",
        "affiliate": "https://www.amazon.in/dp/B07HBMB3WW/?tag=mydeals03c-21",
        "category": "Pet Supplies"
    },
    {
        "title": "ZEXSAZONE Summer Round Donut Comfortable Durable Both Sides usable and Washable Pet Bed | Dog Bed | Puppy Bed | Cat Bed | Mat Cat | Medium Dog Bed for Cats Puppies Labrador German Shepherd Bulldogs",
        "price": "₹780",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/71+OjblrbjL._AC_UL320_.jpg",
        "asin": "B0CF5PS18K",
        "affiliate": "https://www.amazon.in/dp/B0CF5PS18K/?tag=mydeals03c-21",
        "category": "Pet Supplies"
    },
    
    {
        "title": "ToysBuddy Kick and Play Multi-Function ABS High Grade Plastic Piano Baby Gym and Fitness Rack Products",
        "price": "₹548",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/61-afsKGl9L._AC_UL320_.jpg",
        "asin": "B08F38HSMN",
        "affiliate": "https://www.amazon.in/dp/B08F38HSMN/?tag=mydeals03c-21",
        "category": "Baby Products"
    },
    {
        "title": "Himalaya Baby Gift Basket ( Pack of 9 )",
        "price": "₹756",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/61qq6zza-pL._AC_UL320_.jpg",
        "asin": "B075B7WDJY",
        "affiliate": "https://www.amazon.in/dp/B075B7WDJY/?tag=mydeals03c-21",
        "category": "Baby Products"
    },
    {
        "title": "BRANDONN Baby Blanket Newborn Gift Pack of Swaddle Wrapper, 0-9 Months, Length 68 cm x Width 68 cm",
        "price": "₹268",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/413--hB59bL._AC_UL320_.jpg",
        "asin": "B08SHG5ZRB",
        "affiliate": "https://www.amazon.in/dp/B08SHG5ZRB/?tag=mydeals03c-21",
        "category": "Baby Products"
    },
    {
        "title": "LuvLap Silicone Food/Fruit Nibbler with Extra Mesh, Soft Pacifier/Feeder, Teether for Baby, Infant, Bunny Violet & Pink",
        "price": "₹142",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/71qllxazPuL._AC_UL320_.jpg",
        "asin": "B081N5ZF8K",
        "affiliate": "https://www.amazon.in/dp/B081N5ZF8K/?tag=mydeals03c-21",
        "category": "Baby Products"
    },
    {
        "title": "Toy Imagine Tummy Time Water Mat for Babies | Sensory Play Gym for 6-12 Months | Newborn Baby Essentials | Water-Filled Activity Mat | Baby Gifts | Pack of 1",
        "price": "₹220",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/61X1LlYXACL._AC_UL320_.jpg",
        "asin": "B0D42118K5",
        "affiliate": "https://www.amazon.in/dp/B0D42118K5/?tag=mydeals03c-21",
        "category": "Baby Products"
    },
    {
        "title": "Mee Mee Wet Wipes for Baby Skin with Aloe Vera | 72 Wipes x Pack of 3-216 Wipes | Paraben Free, Fragrance Free, pH Balanced, Dermatologically Safe, Baby Wipes Combo | Pack Lid",
        "price": "₹199",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/71FQljFWNiL._AC_UL320_.jpg",
        "asin": "B07X34F9MF",
        "affiliate": "https://www.amazon.in/dp/B07X34F9MF/?tag=mydeals03c-21",
        "category": "Baby Products"
    },
    {
        "title": "Mother Sparsh Tummy Roll On For Baby, Colic Relief, Constipation and Indigestion With Hing & Saunf | 100% Ayurvedic - 40ml",
        "price": "₹166",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/51irXeAL86L._AC_UL320_.jpg",
        "asin": "B07N3RT753",
        "affiliate": "https://www.amazon.in/dp/B07N3RT753/?tag=mydeals03c-21",
        "category": "Baby Products"
    },
    {
        "title": "Mother Sparsh Natural Care Gift Set for Babies | Baby Gift Box of 5 | Baby Wipes (40Pcs), Baby Lotion (100ml), Baby Head to Toe Wash (100ml), Baby Shampoo (100ml) & Baby Soap (75g)",
        "price": "₹399",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/71obdCznYcL._AC_UL320_.jpg",
        "asin": "B0FPCPXCKG",
        "affiliate": "https://www.amazon.in/dp/B0FPCPXCKG/?tag=mydeals03c-21",
        "category": "Baby Products"
    },
    {
        "title": "LuvLap Elegant Baby Comb & Brush Set, Soft Bristles for Gentle Hair Grooming, Complete Hair Grooming Kit for Infants, Newborns & Toddlers, Suitable from Birth (0M+), Perfect Baby Shower Gift",
        "price": "₹173",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/41kA5CDI1-L._AC_UL320_.jpg",
        "asin": "B082D9D9LW",
        "affiliate": "https://www.amazon.in/dp/B082D9D9LW/?tag=mydeals03c-21",
        "category": "Baby Products"
    },
    {
        "title": "BabyGo Waterproof Baby Bibs | Spill-Resistant Apron Feeding Bibs for 6–12 Months, Soft & Absorbent Fast-Dry Cotton, Durable, Lightweight, Washable & Reusable Meal Time Bibs | Set of 6 (Multicolor)",
        "price": "₹179",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/61U2BVM9bPL._AC_UL320_.jpg",
        "asin": "B07DKJXSPK",
        "affiliate": "https://www.amazon.in/dp/B07DKJXSPK/?tag=mydeals03c-21",
        "category": "Baby Products"
    },
    {
        "title": "Kmils Electric Nail Trimmer For Baby, Baby Nail Trimmer, Baby Nail Cutter, Nail Trimmer For New Born Baby, Kids Nail Cutter With Light (Multi Colour), 1 Set",
        "price": "₹371",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/61ThuAHSbCL._AC_UL640_QL65_.jpg",
        "asin": "B0CG25W8VH",
        "affiliate": "https://www.amazon.in/dp/B0CG25W8VH/?tag=mydeals03c-21",
        "category": "Baby Products"
    },
    {
        "title": "Little's Soft Cleansing Baby Wipes with Lid | 80 Wipes x Pack of 3 - 240 Wipes | Extra Thick & Moist Wet Wipes for Baby's | Prevents Rashes & Redness with Goodness of Aloe Vera, Vitamin E & Jojoba Oil",
        "price": "₹218",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/71Cd9g15QZL._AC_UL320_.jpg",
        "asin": "B088TZC4B6",
        "affiliate": "https://www.amazon.in/dp/B088TZC4B6/?tag=mydeals03c-21",
        "category": "Baby Products"
    },
    {
        "title": "Himalaya Baby Massage Oil for Strong bones & muscles – 500ml | No.1 Doctor Prescribed",
        "price": "₹325",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/61a81nzvpgL._AC_UL320_.jpg",
        "asin": "B00NOKRPD8",
        "affiliate": "https://www.amazon.in/dp/B00NOKRPD8/?tag=mydeals03c-21",
        "category": "Baby Products"
    },
    {
        "title": "Cetaphil Baby Wash & Shampoowith Organic Calendula,Tear Free, Paraben, Colorant and Mineral Oil Free, 13.5 Fl. Oz (Packaging May Vary)",
        "price": "₹1,301",
        "rating": "4.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/6156PYCVqBL._AC_UL320_.jpg",
        "asin": "B07VHR8NDF",
        "affiliate": "https://www.amazon.in/dp/B07VHR8NDF/?tag=mydeals03c-21",
        "category": "Baby Products"
    },
    {
        "title": "MOMITTLE- Pack of 2 Pair Baby Smiley Knee Pads for Crawling,Anti-Slip Padded Stretchable Elastic Cotton Soft Breathable Comfortable Knee Cap Elbow Safety Protector Random Color,All Color",
        "price": "₹197",
        "rating": "3.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/61yfRxDxpcL._AC_UL320_.jpg",
        "asin": "B0D9GK94VC",
        "affiliate": "https://www.amazon.in/dp/B0D9GK94VC/?tag=mydeals03c-21",
        "category": "Baby Products"
    },
    {
        "title": "LuvLap Feeding Spoon with Squeezy Food Grade Silicone Feeder Bottle, for Infant Baby, 90ml, BPA Free",
        "price": "₹298",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/61aTV3E8y2L._AC_UL320_.jpg",
        "asin": "B08263JWXK",
        "affiliate": "https://www.amazon.in/dp/B08263JWXK/?tag=mydeals03c-21",
        "category": "Baby Products"
    },
    {
        "title": "Sebamed Baby Gentle Wash|pH 5.5|Baby Body Wash|Soap Free|Tear Free|400 ml",
        "price": "₹864",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/41MWTdwrrwL._AC_UL320_.jpg",
        "asin": "B0DK9FW81X",
        "affiliate": "https://www.amazon.in/dp/B0DK9FW81X/?tag=mydeals03c-21",
        "category": "Baby Products"
    },
    {
        "title": "OYO BABY Extra Absorbent Waterproof Baby Dry Sheet | Quick Dry Sheet for New Born Baby Bed Protector, Soft & Breathable Rubber Sheet for Bed (Grey + Salmon Rose, Small Combo 2)",
        "price": "₹225",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/81D-bayk87L._AC_UL320_.jpg",
        "asin": "B0BSQZPZ4W",
        "affiliate": "https://www.amazon.in/dp/B0BSQZPZ4W/?tag=mydeals03c-21",
        "category": "Baby Products"
    },
    {
        "title": "Sebamed Baby Shampoo|pH 5.5| Soap Free| No Tears | 150 ml",
        "price": "₹419",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/41Ptld1L0kL._AC_UL320_.jpg",
        "asin": "B00ED003U0",
        "affiliate": "https://www.amazon.in/dp/B00ED003U0/?tag=mydeals03c-21",
        "category": "Baby Products"
    },
    {
        "title": "BabyPro BabyProofing Electric Socket Covers (Set of 12) for Baby Safety by Certified Professional Childproofer, Switch Board Covers (White) - Made in India",
        "price": "₹169",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/51xSG+qeJBL._AC_UL320_.jpg",
        "asin": "B07NGFZ7LB",
        "affiliate": "https://www.amazon.in/dp/B07NGFZ7LB/?tag=mydeals03c-21",
        "category": "Baby Products"
    },
    {
        "title": "Cetaphil Baby Mild Cleansing Bar for Newborns & Babies 75 gm | With Shea Butter, Avocado Oil & Olive Oil | Gentle, Hypoallergenic, Pediatrician Recommended | Dry & Sensitive Skin",
        "price": "₹192",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/51bFpsWdUPL._AC_UL320_.jpg",
        "asin": "B085CLPCV7",
        "affiliate": "https://www.amazon.in/dp/B085CLPCV7/?tag=mydeals03c-21",
        "category": "Baby Products"
    },
    {
        "title": "Little Boo new born Baby's Cotton Cloth Diapers/Langot/nappy U Shaped Washable and Reusable Nappies (Multicolour,0-6 Months) Pack of 10",
        "price": "₹296",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/71xUkumiVLL._AC_UL320_.jpg",
        "asin": "B0933JQ6TG",
        "affiliate": "https://www.amazon.in/dp/B0933JQ6TG/?tag=mydeals03c-21",
        "category": "Baby Products"
    },
    {
        "title": "LuvLap Baby Wash & Shampoo -400ml, Milky Soft Head to Toe Wash With Oatmeal & Shea Butter, Paraben Free, Tear Free, Rich Moisturised Skin & Soft Hair, 2 in 1 Baby Body Wash, Dermatologically Tested",
        "price": "₹109",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/7190STDMxFL._AC_UL320_.jpg",
        "asin": "B0FGJWCBLW",
        "affiliate": "https://www.amazon.in/dp/B0FGJWCBLW/?tag=mydeals03c-21",
        "category": "Baby Products"
    },
    {
        "title": "Storio 5-in-1 Suction Spinster Windmill Toy - Blue | Interactive Baby Toy for Bath & Play | Sensory Suction Cups Toy for Toddlers | Early Skill Development",
        "price": "₹299",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/616Hewot3ML._AC_UL320_.jpg",
        "asin": "B0F4462F2H",
        "affiliate": "https://www.amazon.in/dp/B0F4462F2H/?tag=mydeals03c-21",
        "category": "Baby Products"
    },
    {
        "title": "LuvLap Baby Lotion with Milk Protein - 700ml, Suitable for Baby’s Delicate Skin, 24 Hour Protection for Sensitive Skin, Shea Butter and VIT E, Paraben Free, Sweet Almond Oil, Dermatologically Tested",
        "price": "₹159",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/61sR1T2ZNDL._AC_UL320_.jpg",
        "asin": "B0FGJXZ4H5",
        "affiliate": "https://www.amazon.in/dp/B0FGJXZ4H5/?tag=mydeals03c-21",
        "category": "Baby Products"
    },
    {
        "title": "Mee Mee Baby Liquid Detergent 1.5 L | pH Balanced, Free from Harsh Chemicals, Safe for Mother’s Hands & Baby’s Skin | Anti-Bacterial, Removes Stains & Odor with One Drop, Hypoallergenic | Mild Scent",
        "price": "₹349",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/51KwH65IZ-L._AC_UL320_.jpg",
        "asin": "B0789HXX16",
        "affiliate": "https://www.amazon.in/dp/B0789HXX16/?tag=mydeals03c-21",
        "category": "Baby Products"
    },
    {
        "title": "Himalaya Gentle Baby Cream 100ml | No.1 Doctor-Prescribed Brand | Nourishes & Extra Soft Skin | pH 5.5 Formulation | Safe for Newborns",
        "price": "₹146",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/71bW2G6UwtL._AC_UL320_.jpg",
        "asin": "B0G1MYJNLT",
        "affiliate": "https://www.amazon.in/dp/B0G1MYJNLT/?tag=mydeals03c-21",
        "category": "Baby Products"
    },
    {
        "title": "Himalaya Head to Toe Baby Wash with Pure Cow Ghee 400ml | ph 5.5 | Aloe vera | Soap free | Safe for newborns | For baby's sensitive skin from day 1 | No Parabens | No Phthalates | No Sulphates | Pediatrician evaluated",
        "price": "₹360",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/61n0RPL-1TL._AC_UL320_.jpg",
        "asin": "B0CV5ZR9LY",
        "affiliate": "https://www.amazon.in/dp/B0CV5ZR9LY/?tag=mydeals03c-21",
        "category": "Baby Products"
    },
    {
        "title": "Aveeno Baby Daily Moisture Wash and Shampoo (354ml) | Cleanses hair & body | Oat kernel extract & glycerin | Tear-free, soap-free, paraben-free, hypoallergenic | US #1 Pediatrician recommended",
        "price": "₹707",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/51Uvt88YaFL._AC_UL320_.jpg",
        "asin": "B072X5MNF3",
        "affiliate": "https://www.amazon.in/dp/B072X5MNF3/?tag=mydeals03c-21",
        "category": "Baby Products"
    },
    {
        "title": "EIO Newborn Baby Cotton Romper Sleepsuit | Half Sleeve Jumpsuit Bodysuit for Boys & Girls | Soft Breathable Baby Clothes Combo Pack",
        "price": "₹597",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/71OcZb3NBXL._AC_UL320_.jpg",
        "asin": "B0DWFLDZ8K",
        "affiliate": "https://www.amazon.in/dp/B0DWFLDZ8K/?tag=mydeals03c-21",
        "category": "Baby Products"
    },
    {
        "title": "Mother Sparsh Natural Care Baby Wet Wipes with Lid|100% Plant Made Fabric From Forest Land|Fresh+Cleanse(with Cucumber)Plant Powered Wet Wipes For Baby,Cotton Cloth Like Bigger Sheets|60 Pc(Pack of 3)",
        "price": "₹274",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/61zVln4MViL._AC_UL320_.jpg",
        "asin": "B0C4YRPJBH",
        "affiliate": "https://www.amazon.in/dp/B0C4YRPJBH/?tag=mydeals03c-21",
        "category": "Baby Products"
    },
    {
        "title": "Sebamed Baby Cream Extra Soft|pH 5.5|Ideal for Dry Skin|50 ml",
        "price": "₹256",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/51pQSEj2ADL._AC_UL320_.jpg",
        "asin": "B075ZWHX4K",
        "affiliate": "https://www.amazon.in/dp/B075ZWHX4K/?tag=mydeals03c-21",
        "category": "Baby Products"
    },
    {
        "title": "Mamaearth Milky Soft Natural Baby Face Cream for Babies, For All Skin Types 60 g",
        "price": "₹131",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/51TY8STjMPL._AC_UL320_.jpg",
        "asin": "B07JG9R34V",
        "affiliate": "https://www.amazon.in/dp/B07JG9R34V/?tag=mydeals03c-21",
        "category": "Baby Products"
    },
    {
        "title": "Aveeno Baby Daily Moisture Cleansing Bar 75g | With natural Oatmeal, Glycerin and Shea Butter | Co-created with Pediatricians and Dermatologists for newborn sensitive skin | pH balanced, free of soap, parabens sulfates and phthalates",
        "price": "₹190",
        "rating": "4.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/515s6Bf1ZfL._AC_UL320_.jpg",
        "asin": "B0FG2GYPQ5",
        "affiliate": "https://www.amazon.in/dp/B0FG2GYPQ5/?tag=mydeals03c-21",
        "category": "Baby Products"
    },
    {
        "title": "Himalaya Baby Powder 400g | Refreshes and keeps baby's skin smooth and dry",
        "price": "₹241",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/31Ip4aURUpL.png",
        "asin": "B008YD57OO",
        "affiliate": "https://www.amazon.in/dp/B008YD57OO/?tag=mydeals03c-21",
        "category": "Baby Products"
    },
    {
        "title": "EIO Unisex Kids Cotton Solid Clothing Gift Set -13 Pieces",
        "price": "₹670",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/61X3IMp9dvL._AC_UL320_.jpg",
        "asin": "B07ZBMFTHX",
        "affiliate": "https://www.amazon.in/dp/B07ZBMFTHX/?tag=mydeals03c-21",
        "category": "Baby Products"
    },
    {
        "title": "BabyGo Kids 4-in-1 Adjustable Baby Carrier Cum Kangaroo Bag | Multiple Carry Positions: Front, Back, Hip - Comfortable & Adjustable with Safety Belt and Buckle Straps (Blue)",
        "price": "₹475",
        "rating": "3.7 out of 5",
        "image": "https://m.media-amazon.com/images/I/61z3As8aRdL._AC_UL320_.jpg",
        "asin": "B0BH4JP33K",
        "affiliate": "https://www.amazon.in/dp/B0BH4JP33K/?tag=mydeals03c-21",
        "category": "Baby Products"
    },
    {
        "title": "Chicco Baby Moments Body Lotion 200ml | Almond Milk & Murumuru Butter | Quick Absorb Formula with Natural Ingredients for Ultra Soft Skin | Dermatologically Tested | Parabens & Phenoxyethanol Free",
        "price": "₹254",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/51SiqTzs9RL._AC_UL320_.jpg",
        "asin": "B09SBMDJ46",
        "affiliate": "https://www.amazon.in/dp/B09SBMDJ46/?tag=mydeals03c-21",
        "category": "Baby Products"
    },
    {
        "title": "EIO® 100% Cotton Rompers Sleepsuits Jumpsuit Night Suits for Infants Newborn Baby Boys & Girls",
        "price": "₹475",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/61k-7wDEdtL._AC_UL320_.jpg",
        "asin": "B07ZFNM3P4",
        "affiliate": "https://www.amazon.in/dp/B07ZFNM3P4/?tag=mydeals03c-21",
        "category": "Baby Products"
    },
    {
        "title": "LuvLap Baby Lotion with Milk Protein - 400ml, Gentle Daily Lotion for Face & Body, 24 Hour Protection for Sensitive Skin, Ph 5.5, Shea Butter and VIT E, Paraben Free, Dermatologically Tested",
        "price": "₹116",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/61N1P3UhTtL._AC_UL320_.jpg",
        "asin": "B0FGJX1TCN",
        "affiliate": "https://www.amazon.in/dp/B0FGJX1TCN/?tag=mydeals03c-21",
        "category": "Baby Products"
    },
    {
        "title": "LuvLap Milky Soft Baby Shampoo - 400ml, Tear Free Formula, with Milk Protein, Vitamin E & Coconut Oil, Shea Butter & Chamomile, Gentle Care for Baby's Soft Hair, No Paraben, Dermatologically Tested",
        "price": "₹101",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/610h2Q5rU6L._AC_UL320_.jpg",
        "asin": "B0FGJS4MCR",
        "affiliate": "https://www.amazon.in/dp/B0FGJS4MCR/?tag=mydeals03c-21",
        "category": "Baby Products"
    },
    {
        "title": "Mother Sparsh Milky Baby Lotion-400ML | Extra Gentle Moisturizer Hypoallergenic & pH balanced | With Milk Protein, Coconut Oil & Shea Butter | No Parabens, No Mineral Oil | Safe for Newborns",
        "price": "₹239",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/71r+DlOHkfL._AC_UL320_.jpg",
        "asin": "B0C595BHR5",
        "affiliate": "https://www.amazon.in/dp/B0C595BHR5/?tag=mydeals03c-21",
        "category": "Baby Products"
    },
    {
        "title": "Himalaya Baby Lotion with Pure Cow Ghee 400ml | ph 5.5 | Aloe vera | Safe for newborns | For baby's sensitive skin safe from day 1| No Parabens | No Phthalates | No Mineral Oil | No Synthetic color | Pediatrician evaluated",
        "price": "₹335",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/31Ip4aURUpL.png",
        "asin": "B0CV5Y8ZWR",
        "affiliate": "https://www.amazon.in/dp/B0CV5Y8ZWR/?tag=mydeals03c-21",
        "category": "Baby Products"
    },
    {
        "title": "LuvLap Baby Wash - 600ml, with Milk Protein, Oatmeal, Shea Butter and Vitamin E, Soap Free, Baby Wash for Baby Bath, Natural, pH Balanced & Paraben Free, Dermatologically Tested",
        "price": "₹139",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/71cwN1k+gmL._AC_UL320_.jpg",
        "asin": "B0FGXHM27N",
        "affiliate": "https://www.amazon.in/dp/B0FGXHM27N/?tag=mydeals03c-21",
        "category": "Baby Products"
    },
    {
        "title": "Johnson's Baby Oil with Vitamin E, Non-Sticky for easy spread and massage, 200ml",
        "price": "₹215",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/411n1PR5UNL._AC_UL320_.jpg",
        "asin": "B007AF5BIO",
        "affiliate": "https://www.amazon.in/dp/B007AF5BIO/?tag=mydeals03c-21",
        "category": "Baby Products"
    },
    {
        "title": "SYGA 5 Pcs Children Safety Door Pinch Guard,Door Slam Stopper Soft Foam Door Stopper,Prevents Finger Pinch Injuries &Child or Pet from Getting Locked in Room,Colorful Cartoon Animal Cushion-Muticolor",
        "price": "₹174",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/61GQQ++zgHL._AC_UL320_.jpg",
        "asin": "B075RZN9N6",
        "affiliate": "https://www.amazon.in/dp/B075RZN9N6/?tag=mydeals03c-21",
        "category": "Baby Products"
    },
    {
        "title": "Huggies Complete Comfort Wonder Pants | Pant Style Baby Diapers Newborn Size (NB/XS), 90 Count | India's Fastest Absorbing Diaper, Prevents Diaper Rash, Ideal for 0-5 Kgs",
        "price": "₹571",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/7113VFGpN3L._AC_UL320_.jpg",
        "asin": "B07RB2H4XV",
        "affiliate": "https://www.amazon.in/dp/B07RB2H4XV/?tag=mydeals03c-21",
        "category": "Baby Products"
    },
    {
        "title": "Khillayox New Born Baby Ankle Length Socks Woolen Socks For Baby Boys And Baby Girls Warm Thick Terry Socks For Kids Infants Socks (Asoorted Colors And Designs) Pack Of 6 Pair,Assorted",
        "price": "₹284",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/41MPlA-+iuL._AC_UL320_.jpg",
        "asin": "B09HP34DXZ",
        "affiliate": "https://www.amazon.in/dp/B09HP34DXZ/?tag=mydeals03c-21",
        "category": "Baby Products"
    },
    {
        "title": "LuvLap 100% Natural Baby Kajal 5g, with Pure Cow Ghee, Cocoa Butter, Coconut Oil, Sweet Amond & Castor Oil, Soothes & Nourishes Eyes of New Born & Kids, Irritation-free, Dermatologically Tested",
        "price": "₹199",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/81ooTjNjldL._AC_UL320_.jpg",
        "asin": "B0FTZBB644",
        "affiliate": "https://www.amazon.in/dp/B0FTZBB644/?tag=mydeals03c-21",
        "category": "Baby Products"
    },
    {
        "title": "AGARO",
        "price": "₹1,499",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/71Q1IoCMWBL._AC_UY218_.jpg",
        "asin": "B0FPQSN47V",
        "affiliate": "https://www.amazon.in/dp/B0FPQSN47V/?tag=mydeals03c-21",
        "category": "Automotive"
    },
    {
        "title": "Fancy Products 46 in 1 tool kit Drive Socket Set Auto Repair Hand Tool Ratchet Hex Wrench Set, Tool Kit For Automotive Repair, Household, Car & Bicycle Repairs Metric Screwdriver Set With Storage Case",
        "price": "₹539",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/91Dq5UEERWL._AC_UY218_.jpg",
        "asin": "B0G1T5T1MB",
        "affiliate": "https://www.amazon.in/dp/B0G1T5T1MB/?tag=mydeals03c-21",
        "category": "Automotive"
    },
    {
        "title": "UN1QUE",
        "price": "₹946",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/71BVH9OcBsL._AC_UY218_.jpg",
        "asin": "B0F6MLBYNF",
        "affiliate": "https://www.amazon.in/dp/B0F6MLBYNF/?tag=mydeals03c-21",
        "category": "Automotive"
    },
    {
        "title": "Scotch",
        "price": "₹215",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/61HfkIB-2rL._AC_UY218_.jpg",
        "asin": "B0BZ3WNQ5T",
        "affiliate": "https://www.amazon.in/dp/B0BZ3WNQ5T/?tag=mydeals03c-21",
        "category": "Automotive"
    },
    {
        "title": "Ceptics",
        "price": "₹1,699",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/61KbEfzU8iL._AC_UY218_.jpg",
        "asin": "B0D22S4R15",
        "affiliate": "https://www.amazon.in/dp/B0D22S4R15/?tag=mydeals03c-21",
        "category": "Automotive"
    },
    {
        "title": "Free and Fast delivery",
        "price": "₹270",
        "rating": "",
        "image": "https://m.media-amazon.com/images/I/31Ip4aURUpL.png",
        "asin": "B0CXDQWYQP",
        "affiliate": "https://www.amazon.in/dp/B0CXDQWYQP/?tag=mydeals03c-21",
        "category": "Automotive"
    },
    {
        "title": "Car Scratch Remover Touch Up Paint Pen Automotive Car Paint Pen 2 In 1 Car Paint Scratch Repair for Deep Scratches Special-Purpose Car Paint (SEELVR.1)",
        "price": "₹219",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/61pdQvzm1ZL._AC_UY218_.jpg",
        "asin": "B0FT344Z8Q",
        "affiliate": "https://www.amazon.in/dp/B0FT344Z8Q/?tag=mydeals03c-21",
        "category": "Automotive"
    },
    {
        "title": "Car Interior AC Vent Cleaning Brush Soft Detailing Tool for Dusting and Cleaning Automotive Accessories, Dashboard, Get Rid of Dust and Dirt from Laptop (Pack of 1)",
        "price": "₹122",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/71tgKxoyNKL._AC_UY218_.jpg",
        "asin": "B0GT15KT38",
        "affiliate": "https://www.amazon.in/dp/B0GT15KT38/?tag=mydeals03c-21",
        "category": "Automotive"
    },
    {
        "title": "3M",
        "price": "₹317",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/71j1MB-GqdL._AC_UY218_.jpg",
        "asin": "B00MHQ8JKS",
        "affiliate": "https://www.amazon.in/dp/B00MHQ8JKS/?tag=mydeals03c-21",
        "category": "Automotive"
    },
    {
        "title": "MMAK Anti-Slip Car Dashboard Mat with Phone Holder & Aromatherapy - Universal Non Slip Sticky Rubber Pad with 2 Aroma Sticks & Radium Night Glow for Smartphone, GPS Navigation- Black",
        "price": "₹599",
        "rating": "3.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/71uYuJZe6tL._AC_UL640_QL65_.jpg",
        "asin": "B0BKQBWTHK",
        "affiliate": "https://www.amazon.in/dp/B0BKQBWTHK/?tag=mydeals03c-21",
        "category": "Automotive"
    },
    {
        "title": "SOFTSPUN",
        "price": "₹261",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/81HybebUt1L._AC_UY218_.jpg",
        "asin": "B0DB26D97P",
        "affiliate": "https://www.amazon.in/dp/B0DB26D97P/?tag=mydeals03c-21",
        "category": "Automotive"
    },
    {
        "title": "Osram",
        "price": "₹299",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/71kYJNa8b1L._AC_UY218_.jpg",
        "asin": "B08GFPNC8Q",
        "affiliate": "https://www.amazon.in/dp/B08GFPNC8Q/?tag=mydeals03c-21",
        "category": "Automotive"
    },
    {
        "title": "Bosch",
        "price": "₹224",
        "rating": "3.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/61-HHwV7pUL._AC_UY218_.jpg",
        "asin": "B082P8P9T8",
        "affiliate": "https://www.amazon.in/dp/B082P8P9T8/?tag=mydeals03c-21",
        "category": "Automotive"
    },
    {
        "title": "TA-H1 HUD OBD2 GPS Smart Gauge Speedometer – High-Resolution, No Delay Head-Up Display, 10 Interfaces, RPM, Fuel, Turbo, Temp Monitoring for Cars",
        "price": "₹3,799",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/61KR5E7u2VL._AC_UY218_.jpg",
        "asin": "B0DZCT3FB3",
        "affiliate": "https://www.amazon.in/dp/B0DZCT3FB3/?tag=mydeals03c-21",
        "category": "Automotive"
    },
    {
        "title": "TEKCOOL",
        "price": "₹129",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/71eI9W4y84L._AC_UY218_.jpg",
        "asin": "B0G6W8D4VK",
        "affiliate": "https://www.amazon.in/dp/B0G6W8D4VK/?tag=mydeals03c-21",
        "category": "Automotive"
    },
    {
        "title": "3M",
        "price": "₹379",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/71OQcFNPl1L._AC_UY218_.jpg",
        "asin": "B07WZRSYJM",
        "affiliate": "https://www.amazon.in/dp/B07WZRSYJM/?tag=mydeals03c-21",
        "category": "Automotive"
    },
    {
        "title": "NIKAVI",
        "price": "₹299",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/71m-mlgMSQL._AC_UY218_.jpg",
        "asin": "B01N44N7VT",
        "affiliate": "https://www.amazon.in/dp/B01N44N7VT/?tag=mydeals03c-21",
        "category": "Automotive"
    },
    
    {
        "title": "Larah by BOROSIL",
        "price": "₹2,376",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/51jBpPGEwtL._MCnd_AC_.jpg",
        "asin": "B0B41ZY6FS",
        "affiliate": "https://www.amazon.in/dp/B0B41ZY6FS/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Larah by BOROSIL",
        "price": "₹2,377",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/51BDyL1BmPL._MCnd_AC_.jpg",
        "asin": "B0DJ369PJL",
        "affiliate": "https://www.amazon.in/dp/B0DJ369PJL/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Larah by BOROSIL",
        "price": "₹2,102",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/51hglApzqQL._MCnd_AC_.jpg",
        "asin": "B0C53PST83",
        "affiliate": "https://www.amazon.in/dp/B0C53PST83/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Larah by BOROSIL",
        "price": "₹2,363",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/31nbN0+OJiL._MCnd_AC_.jpg",
        "asin": "B07YNZVQRF",
        "affiliate": "https://www.amazon.in/dp/B07YNZVQRF/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Larah by BOROSIL",
        "price": "₹2,376",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/51ZnzGix2mL._MCnd_AC_.jpg",
        "asin": "B0D8J6PCQB",
        "affiliate": "https://www.amazon.in/dp/B0D8J6PCQB/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "CELLO",
        "price": "₹2,799",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/41hEknqJohL._MCnd_AC_.jpg",
        "asin": "B0C74KDPGV",
        "affiliate": "https://www.amazon.in/dp/B0C74KDPGV/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Larah by BOROSIL",
        "price": "₹2,376",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/51XGihdBYxL._MCnd_AC_.jpg",
        "asin": "B0D8J67QPR",
        "affiliate": "https://www.amazon.in/dp/B0D8J67QPR/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Larah by BOROSIL",
        "price": "₹3,253",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/31OVXfIUxaL._MCnd_AC_.jpg",
        "asin": "B07YP1146J",
        "affiliate": "https://www.amazon.in/dp/B07YP1146J/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "CELLO",
        "price": "₹1,899",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/411dDDZ-bQL._MCnd_AC_.jpg",
        "asin": "B07TKKJVRP",
        "affiliate": "https://www.amazon.in/dp/B07TKKJVRP/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "CELLO",
        "price": "₹1,249",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/31GOQaRz+nL._MCnd_AC_.jpg",
        "asin": "B07L8ZPHHM",
        "affiliate": "https://www.amazon.in/dp/B07L8ZPHHM/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "CELLO",
        "price": "₹2,535",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/51oVTFd81xL._MCnd_AC_.jpg",
        "asin": "B0DNMRKNQH",
        "affiliate": "https://www.amazon.in/dp/B0DNMRKNQH/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Amazon Brand - Solimo",
        "price": "₹3,859",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/315OHCSNy7L._MCnd_AC_.jpg",
        "asin": "B08BVK156S",
        "affiliate": "https://www.amazon.in/dp/B08BVK156S/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "CELLO",
        "price": "₹3,880",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/51bER9cwcQL._MCnd_AC_.jpg",
        "asin": "B0BF4KCB3W",
        "affiliate": "https://www.amazon.in/dp/B0BF4KCB3W/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Amazon Brand - Solimo",
        "price": "₹3,239",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/31aVe5UHJiL._MCnd_AC_.jpg",
        "asin": "B0B7S5J6QT",
        "affiliate": "https://www.amazon.in/dp/B0B7S5J6QT/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Amazon Brand - Solimo",
        "price": "₹5,119",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/41gV+FlYx3L._MCnd_AC_.jpg",
        "asin": "B08BVNDMCP",
        "affiliate": "https://www.amazon.in/dp/B08BVNDMCP/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "ExclusiveLane",
        "price": "₹3,099",
        "rating": "4.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/51GgtFCDd+L._MCnd_AC_.jpg",
        "asin": "B0CXJGCQMB",
        "affiliate": "https://www.amazon.in/dp/B0CXJGCQMB/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Bodhi House",
        "price": "₹5,320",
        "rating": "4.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/51KXwbsgTIL._MCnd_AC_.jpg",
        "asin": "B0DFWCD4RL",
        "affiliate": "https://www.amazon.in/dp/B0DFWCD4RL/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Larah by BOROSIL",
        "price": "₹3,162",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/51PcHKIViOL._MCnd_AC_.jpg",
        "asin": "B07G43LZJD",
        "affiliate": "https://www.amazon.in/dp/B07G43LZJD/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "#",
        "price": "₹970",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/31VbtnmcpNL._MCnd_AC_.jpg",
        "asin": "B07JPC93DR",
        "affiliate": "https://www.amazon.in/dp/B07JPC93DR/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Castleite",
        "price": "₹2,957",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/51HW4KGkADL._MCnd_AC_.jpg",
        "asin": "B0DPCK6JW7",
        "affiliate": "https://www.amazon.in/dp/B0DPCK6JW7/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "#",
        "price": "₹1,999",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/41MbyvKairL._MCnd_AC_.jpg",
        "asin": "B07TKYB3B2",
        "affiliate": "https://www.amazon.in/dp/B07TKYB3B2/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "La Opala",
        "price": "₹6,450",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/51hBfPG9OYL._MCnd_AC_.jpg",
        "asin": "B0B53FZY9X",
        "affiliate": "https://www.amazon.in/dp/B0B53FZY9X/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Amazon Brand - Solimo",
        "price": "₹3,529",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/41q-ljpiAfL._MCnd_AC_.jpg",
        "asin": "B0B7S25BTB",
        "affiliate": "https://www.amazon.in/dp/B0B7S25BTB/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Amazon Brand - Solimo",
        "price": "₹4,760",
        "rating": "4.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/41812XnVlUL._MCnd_AC_.jpg",
        "asin": "B0B7S3G5M1",
        "affiliate": "https://www.amazon.in/dp/B0B7S3G5M1/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Shay",
        "price": "₹9,999",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/414TIF849-L._MCnd_AC_.jpg",
        "asin": "B0C59YSM65",
        "affiliate": "https://www.amazon.in/dp/B0C59YSM65/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Shay",
        "price": "₹11,999",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/41Mwd8ZHyML._MCnd_AC_.jpg",
        "asin": "B0C24L26MX",
        "affiliate": "https://www.amazon.in/dp/B0C24L26MX/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Larah by BOROSIL",
        "price": "₹3,508",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/516HJUC36oL._MCnd_AC_.jpg",
        "asin": "B097HPH5X4",
        "affiliate": "https://www.amazon.in/dp/B097HPH5X4/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Larah by BOROSIL",
        "price": "₹3,400",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/51u+6PN-WgL._MCnd_AC_.jpg",
        "asin": "B07TC3RG7Q",
        "affiliate": "https://www.amazon.in/dp/B07TC3RG7Q/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Larah by BOROSIL",
        "price": "₹2,614",
        "rating": "3.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/5147yKSkkfL._MCnd_AC_.jpg",
        "asin": "B0D8J91CMJ",
        "affiliate": "https://www.amazon.in/dp/B0D8J91CMJ/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Larah by BOROSIL",
        "price": "₹3,551",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/31Qo4Un5DGL._MCnd_AC_.jpg",
        "asin": "B07YNZPVF1",
        "affiliate": "https://www.amazon.in/dp/B07YNZPVF1/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "CELLO",
        "price": "₹2,199",
        "rating": "3.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/31+MNzDMBmL._MCnd_AC_.jpg",
        "asin": "B0BQ3LVKDG",
        "affiliate": "https://www.amazon.in/dp/B0BQ3LVKDG/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "The Earth Store",
        "price": "₹5,499",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/41tEO7tVmiL._MCnd_AC_.jpg",
        "asin": "B0DWKCNMH5",
        "affiliate": "https://www.amazon.in/dp/B0DWKCNMH5/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "#",
        "price": "₹2,299",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/41RnYnm9SvL._MCnd_AC_.jpg",
        "asin": "B0C1VWCDL6",
        "affiliate": "https://www.amazon.in/dp/B0C1VWCDL6/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Shri & Sam",
        "price": "₹724",
        "rating": "3.7 out of 5",
        "image": "https://m.media-amazon.com/images/I/41Jt+AgZXlL._MCnd_AC_.jpg",
        "asin": "B09Z89J9J2",
        "affiliate": "https://www.amazon.in/dp/B09Z89J9J2/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Shri & Sam",
        "price": "₹1,345",
        "rating": "3.7 out of 5",
        "image": "https://m.media-amazon.com/images/I/41YrC3XYLSL._MCnd_AC_.jpg",
        "asin": "B0BSCHNSDY",
        "affiliate": "https://www.amazon.in/dp/B0BSCHNSDY/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Shri & Sam",
        "price": "₹2,167",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/31g+wwcm-7L._MCnd_AC_.jpg",
        "asin": "B07FY8KZDT",
        "affiliate": "https://www.amazon.in/dp/B07FY8KZDT/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "#",
        "price": "₹1,099",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/41Dz-Lmd6OL._MCnd_AC_.jpg",
        "asin": "B07JQ1FFYB",
        "affiliate": "https://www.amazon.in/dp/B07JQ1FFYB/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "#",
        "price": "₹699",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/41K4YNzpgHL._MCnd_AC_.jpg",
        "asin": "B0BXFF1ZRQ",
        "affiliate": "https://www.amazon.in/dp/B0BXFF1ZRQ/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "#",
        "price": "₹2,199",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/4162TDMAwRL._MCnd_AC_.jpg",
        "asin": "B097MV3VL6",
        "affiliate": "https://www.amazon.in/dp/B097MV3VL6/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "#",
        "price": "₹977",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/51UuPQeJjKL._MCnd_AC_.jpg",
        "asin": "B0BX63W6WS",
        "affiliate": "https://www.amazon.in/dp/B0BX63W6WS/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "#",
        "price": "₹249",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/415LMHoEmjL._MCnd_AC_.jpg",
        "asin": "B07FTQD132",
        "affiliate": "https://www.amazon.in/dp/B07FTQD132/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "#",
        "price": "₹5,812",
        "rating": "4.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/419H4AreDOL._MCnd_AC_.jpg",
        "asin": "B0DFWBZDQM",
        "affiliate": "https://www.amazon.in/dp/B0DFWBZDQM/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "#",
        "price": "₹1,999",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/41DBQQbwrtL._MCnd_AC_.jpg",
        "asin": "B08G8H1TT9",
        "affiliate": "https://www.amazon.in/dp/B08G8H1TT9/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "#",
        "price": "₹399",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/21CEcQJW38L._MCnd_AC_.jpg",
        "asin": "B091TSZPVS",
        "affiliate": "https://www.amazon.in/dp/B091TSZPVS/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "#",
        "price": "₹449",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/31HNmW+gPpL._MCnd_AC_.jpg",
        "asin": "B08DG3JGX9",
        "affiliate": "https://www.amazon.in/dp/B08DG3JGX9/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "#",
        "price": "₹279",
        "rating": "3.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/31hdYKVgaeL._MCnd_AC_.jpg",
        "asin": "B0BXHF5M56",
        "affiliate": "https://www.amazon.in/dp/B0BXHF5M56/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "#",
        "price": "₹1,299",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/414sMEUXtiL._MCnd_AC_.jpg",
        "asin": "B0CPYN5WQK",
        "affiliate": "https://www.amazon.in/dp/B0CPYN5WQK/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "#",
        "price": "₹1,099",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/414MgBvDb7L._MCnd_AC_.jpg",
        "asin": "B07Q1GZ3PX",
        "affiliate": "https://www.amazon.in/dp/B07Q1GZ3PX/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "#",
        "price": "₹1,099",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/41diJ866dmL._MCnd_AC_.jpg",
        "asin": "B07N8V64JQ",
        "affiliate": "https://www.amazon.in/dp/B07N8V64JQ/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "#",
        "price": "₹649",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/415Ifi7jJgL._MCnd_AC_.jpg",
        "asin": "B07D7XPLQB",
        "affiliate": "https://www.amazon.in/dp/B07D7XPLQB/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "#",
        "price": "₹199",
        "rating": "3.7 out of 5",
        "image": "https://m.media-amazon.com/images/I/31TKMNO6ZML._MCnd_AC_.jpg",
        "asin": "B0C3VRV3PN",
        "affiliate": "https://www.amazon.in/dp/B0C3VRV3PN/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "#",
        "price": "₹1,432",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/41DHpfrwFxL._MCnd_AC_.jpg",
        "asin": "B07W3KY943",
        "affiliate": "https://www.amazon.in/dp/B07W3KY943/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "#",
        "price": "₹2,376",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/41wb0by6jFL._MCnd_AC_.jpg",
        "asin": "B08G8KFKMJ",
        "affiliate": "https://www.amazon.in/dp/B08G8KFKMJ/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Previous",
        "price": "₹629",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/31PAfDGePiL._MCnd_AC_.jpg",
        "asin": "B081DJH7QR",
        "affiliate": "https://www.amazon.in/dp/B081DJH7QR/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Previous",
        "price": "₹1,432",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/31SuN+ervwL._MCnd_AC_.jpg",
        "asin": "B07W3KYHC6",
        "affiliate": "https://www.amazon.in/dp/B07W3KYHC6/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    
    {
        "title": "Femora Premium Pink Peacock Pattern Golden Ceramic Tea Cup | Finest Premium for Tea/Coffee/Hot Drinks | Set of 6 | Capacity- 180 ML | Pink | (Not Microwave Safe)",
        "price": "₹1,322",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/61O4NdKOqzL._AC_UL320_.jpg",
        "asin": "B0BTJ63J3W",
        "affiliate": "https://www.amazon.in/dp/B0BTJ63J3W/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Femora Ceramic Gold Line Diamond Cut White Cup 6 Pcs with Saucer Set of 6 Pcs Tea/Coffee Cups 200 ml |Microwave & Dishwasher Safe Crockery Set Ideal for Daily Use & Gifting, White",
        "price": "₹1,399",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/61B-RpZu2LL._AC_UL320_.jpg",
        "asin": "B07PPZLK2X",
        "affiliate": "https://www.amazon.in/dp/B07PPZLK2X/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Femora Premium Floral Gold Line Ceramic Coffee & Tea Cup | Finest Premium for Tea/Coffee/Hot Drinks | Set of 6 | Capacity- 160 ML |(Not Microwave Safe)",
        "price": "₹989",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/710fLUVp-XL._AC_UL320_.jpg",
        "asin": "B08PV1FXMX",
        "affiliate": "https://www.amazon.in/dp/B08PV1FXMX/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "La Opala Diva, Sovrana Collection Opal Glass Crockery | Cup & Saucer, Set of 12 | Moroccan Gold, 160 ml | for Tea & Coffee | Microwave Safe | 100% Vegetarian | Extra Strong | Super Light | Super White",
        "price": "₹649",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/71fUpqsJGSL._AC_UL320_.jpg",
        "asin": "B08MY5N9JX",
        "affiliate": "https://www.amazon.in/dp/B08MY5N9JX/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Clay Craft Impression Ceramic Gold Line Coffee Mugs/Tea Cups Set of 6 Pieces, 200ml, White (Barrel), Tea Cup Set of 6, Mugs for Coffee, Cups Set of 6, Ideal for Gifting, Perfect for Home and Office",
        "price": "₹776",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/71mxq+lGyYL._AC_UL320_.jpg",
        "asin": "B0CL59DHC2",
        "affiliate": "https://www.amazon.in/dp/B0CL59DHC2/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "CELLO Ricca Mug 6 Pcs Set | Cups for Tea, Coffee, Espressoc | Thermal Resistant | Light Weight | Ideal Gifting Option | Blue Creeper | 100ml",
        "price": "₹299",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/81RnnlA6U8L._AC_UL320_.jpg",
        "asin": "B0BC3M2MRY",
        "affiliate": "https://www.amazon.in/dp/B0BC3M2MRY/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Shay Ceramic Tea Cup Set, Set of 6, Teal Green with Real Gold Line, 180ml | Cup Set of 6 for Tea | Glossy Finish | Premium Ceramic | Tea Cup Set of 6 (Tea Cups - Teal Gold Line)",
        "price": "₹1,499",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/71PbQwOd3JL._AC_UL320_.jpg",
        "asin": "B0C7PFLZTM",
        "affiliate": "https://www.amazon.in/dp/B0C7PFLZTM/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "GOLDEN QUEEN'S Bone China Handcrafted Sapphire Bloom Tea & Coffee Cups - Set Of 6 | Perfect For Daily Use, Elevate Your Tea And Coffee Experience | Microwave Safe | 200 Ml",
        "price": "₹776",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/61uT1+gr2IL._AC_UL320_.jpg",
        "asin": "B0C2VZ5MXW",
        "affiliate": "https://www.amazon.in/dp/B0C2VZ5MXW/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "The Earth Store Glam Green Fringe Premium Ceramic Cup Set of 6 for Tea, 160 ML Each, Microwave and Dishwasher Safe Stackable Cup Set Tea | Chai Cups for Gifting, Home & Office Use, Every Occasion",
        "price": "₹675",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/61vpJcOQrlL._AC_UL320_.jpg",
        "asin": "B0F99HPYWZ",
        "affiliate": "https://www.amazon.in/dp/B0F99HPYWZ/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Clay Craft Fine Ceramic Tea/Coffee Cup Set of 6-200 ml Each (Hilton H308), Tea Cup Set of 6, Microwave & Dishwasher Safe, Mugs for Coffee, Cups Set of 6, Mug Set, Gift Set, Ideal for Gifting",
        "price": "₹737",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/81ngFjuBScL._AC_UL320_.jpg",
        "asin": "B0CQT8ZCRX",
        "affiliate": "https://www.amazon.in/dp/B0CQT8ZCRX/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "The Earth Store Tritone Sky Blue Ovule Shape Cup Set of 6 for Tea Microwave and Dishwasher Safe, Perfect for Every Occasion Capacity - 200 Ml Each - Ceramic",
        "price": "₹599",
        "rating": "3.7 out of 5",
        "image": "https://m.media-amazon.com/images/I/71A3HqODhLL._AC_UL640_QL65_.jpg",
        "asin": "B0CVRQBG26",
        "affiliate": "https://www.amazon.in/dp/B0CVRQBG26/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "La Opala, Novo Collection Opal Glass Crockery | Cup Lily, Set of 6 | English Lavender, 150 ml | for Tea & Coffee | Microwave Safe | 100% Vegetarian | Toughened Extra Strong | Super Light | Super White",
        "price": "₹349",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/71K+0z0qkYL._AC_UL320_.jpg",
        "asin": "B0CGJ5SZNN",
        "affiliate": "https://www.amazon.in/dp/B0CGJ5SZNN/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Femora Premium Ceramic Royal Crowned Coffee & Tea Cup | Finest Premium for Tea/Coffee/Hot Drinks | Set of 6 | Capacity- 180 ML | (Not Microwave Safe)",
        "price": "₹1,279",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/61bBpLJRnSL._AC_UL320_.jpg",
        "asin": "B0CK4SYH88",
        "affiliate": "https://www.amazon.in/dp/B0CK4SYH88/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Clay Craft Palm Impression Ceramic Gold Line Coffee Mugs/Tea Cups Set of 6 Pieces, 200ml, White (Palm), Tea Cup Set of 6, Mugs for Coffee, Cups Set of 6, Ideal for Gifting, Perfect for Home and Office",
        "price": "₹749",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/71H9-KvY19L._AC_UL320_.jpg",
        "asin": "B0CL58Z3PZ",
        "affiliate": "https://www.amazon.in/dp/B0CL58Z3PZ/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Clay Craft Fine Ceramic Alton Golden Printed Premium Coffee/Tea Cups - 180 ml each - Set of 6, Tea Cup Set of 6, Mugs for Coffee, Cups Set of 6, Mug Set, Ideal for Gifting, Perfect for Home and Office",
        "price": "₹1,259",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/81agwyc+B3L._AC_UL320_.jpg",
        "asin": "B0BHWPNWH2",
        "affiliate": "https://www.amazon.in/dp/B0BHWPNWH2/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Larah by BOROSIL Curl Opalware Cup, Set of 6 Tea/Coffee Cups, 160 ml Each, Microwave & Dishwasher Safe, Bone-Ash Free, Crockery Set Ideal for Daily Use & Gifting, White",
        "price": "₹385",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/51nqmDflS5L._AC_UL320_.jpg",
        "asin": "B0CLYFFDG1",
        "affiliate": "https://www.amazon.in/dp/B0CLYFFDG1/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "GOLDEN QUEEN'S Handcrafted Tea Cups - Set of 6 | Ideal for Everyday Tea and Coffee, Enhancing Your Daily Rituals - Garden Splendor, Bone China, 200 ML",
        "price": "₹884",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/61Tr6UC8f+L._AC_UL320_.jpg",
        "asin": "B09QCWJ4H7",
        "affiliate": "https://www.amazon.in/dp/B09QCWJ4H7/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "La Opala Diva, Opal Glass Coffee Mug Set Cylinder Regular 6 Pcs, Golden Fall, White, Standard - 180 Ml",
        "price": "₹399",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/61EeZ4f6fpL._AC_UL320_.jpg",
        "asin": "B09M5ZTZ5J",
        "affiliate": "https://www.amazon.in/dp/B09M5ZTZ5J/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Handmade Ceramic Tea Cup Set of 6 Pcs-150ml | Hanpainted Blue Floral Design Tea/Chai Cup Sets Milk Coffee Mugs Dinnerware Crockery Drinkware|Dishwasher & Microwave Safe | Daily Use & Gifting Item",
        "price": "₹399",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/51-3diaLy4L._AC_UL320_.jpg",
        "asin": "B0CV7WTSQ5",
        "affiliate": "https://www.amazon.in/dp/B0CV7WTSQ5/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "GOLDEN QUEEN'S Cup & Saucer Set | Perfect for Hosting & for Tea/Coffee Lovers | Handcrafted in India, Inspired by Florals & 24-Carat Gold Rim | 6 Cups & 6 Saucers |170 ml - Pink Shrub",
        "price": "₹1,991",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/61thxB2cT3L._AC_UL320_.jpg",
        "asin": "B0C97HZBXC",
        "affiliate": "https://www.amazon.in/dp/B0C97HZBXC/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Borosil 6pc Mug Set | Made in India Borosilicate Glass Cup Set for Chai, Green Tea, Coffee, Milk | Microwave Safe, Scratch Resistance, Lightweight | Transparent (Chai Time (210ml))",
        "price": "₹399",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/61bss9n1kXL._AC_UL320_.jpg",
        "asin": "B0DHS36CHP",
        "affiliate": "https://www.amazon.in/dp/B0DHS36CHP/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "The Earth Store Green Peafowl Ceramic Cup Set of 6 for Tea, 150 ML Each, Microwave and Dishwasher Safe Coffee Cups | Cup Set Tea | Chai Cups for Gifting, Home & Office Use, Every Occasion",
        "price": "₹699",
        "rating": "3.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/71sXpQxSdXL._AC_UL320_.jpg",
        "asin": "B0DSC6CVK1",
        "affiliate": "https://www.amazon.in/dp/B0DSC6CVK1/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Clay Craft Ceramic Coffee Cup - Set Of 6, Multicolor, 200ml",
        "price": "₹499",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/71sBohQO0dL._AC_UL320_.jpg",
        "asin": "B08287VRJ5",
        "affiliate": "https://www.amazon.in/dp/B08287VRJ5/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "The Earth Store Grey Fizz Coffee Mugs Set of 6 Ceramic Mugs to Gift to Best Friend, Tea Mugs, Microwave Safe Coffee Mugs, Ceramic Tea Cups",
        "price": "₹597",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/81oO2bd-yDL._AC_UL320_.jpg",
        "asin": "B0B3RPC54W",
        "affiliate": "https://www.amazon.in/dp/B0B3RPC54W/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Clay Craft Fine Ceramic Feather Print - 120 ml -Set of 6 Tea Cups (Gold Line Cups - 6 Pcs)",
        "price": "₹738",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/812Mx5vA6tL._AC_UL320_.jpg",
        "asin": "B08KVH9NBH",
        "affiliate": "https://www.amazon.in/dp/B08KVH9NBH/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Cello Caroline Glass Tea Cup with Elegant Design 160ml, Set of 6 Clear | Dishwasher Safe, Scratch Resistance | Perfect for Regular Use and Serving Cup Set for Chai, Green Tea, Coffee, Milk & Beverages",
        "price": "₹279",
        "rating": "3.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/613fTazIYYL._AC_UL320_.jpg",
        "asin": "B0FCMJNYZV",
        "affiliate": "https://www.amazon.in/dp/B0FCMJNYZV/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Treo by Milton Opalware Amara 10 Silvia Cup Set | Microwave & Dishwasher Safe | Bone-Ash Free | Tempered Toughness | Set of 6, 100 ml Each | White | Crockery Set for Daily Use & Gifting",
        "price": "₹281",
        "rating": "3.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/61jLe9QTA8L._AC_UL320_.jpg",
        "asin": "B0G81L5GP1",
        "affiliate": "https://www.amazon.in/dp/B0G81L5GP1/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Femora Double Gold LineDiamond Cut White Ceramic Tea Cup with Saucer Set of 12 Pcs, 200 ml | Microwave & Dishwasher Safe | Bone-Ash Free | Crockery Set Ideal for Daily Use & Gifting, White",
        "price": "₹1,339",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/71x3mfh1DaL._AC_UL320_.jpg",
        "asin": "B0C9WMLW61",
        "affiliate": "https://www.amazon.in/dp/B0C9WMLW61/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Femora Handcrafted Tea Cup Set of 6, 160 ml Each| Microwave and Dishwasher Safe Coffee Cups | Chai Cups for Gifting, Home & Office Use, Every Occasion,Multicolor",
        "price": "₹629",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/61yg+h+wgVL._AC_UL320_.jpg",
        "asin": "B08C2TH6C1",
        "affiliate": "https://www.amazon.in/dp/B08C2TH6C1/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "The Earth Store Blue Petals Handcrafted Ceramic Tea Set with Kettle 6 Tea Cups & 1 Kettle Microwave and Dishwasher Safe Teapot Set | Kettle Set with Cups | Morning Cup Set with Kettle for Gifting",
        "price": "₹1,399",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/61CbNBmjArL._AC_UL320_.jpg",
        "asin": "B0DY1B4GRV",
        "affiliate": "https://www.amazon.in/dp/B0DY1B4GRV/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Clay Craft x Magique by The Wishing Chair : Wings Paradise Summer Ceramic Mug Set of 6 | 200 ml Fine China Tea Coffee Cups | Lightweight Durable Elegant Mugs | Ideal for Home Office Gifting",
        "price": "₹999",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/61--vgIYzLL._AC_UL320_.jpg",
        "asin": "B0DRVJSTRP",
        "affiliate": "https://www.amazon.in/dp/B0DRVJSTRP/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "The Earth Store Tritone Sky Blue Ovule Shape Cup Set of 6 for Tea Microwave and Dishwasher Safe, Perfect for Every Occasion Capacity - 190 Ml Each - Ceramic",
        "price": "₹599",
        "rating": "3.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/71oNKLXdW5L._AC_UL320_.jpg",
        "asin": "B0CVS4BCSW",
        "affiliate": "https://www.amazon.in/dp/B0CVS4BCSW/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Larah by Borosil Helena Opalware Cup Set of 6 pcs | Tea/Coffee Cups 100 ml | Microwave & Dishwasher Safe | Bone-Ash Free | Crockery Set Ideal for Daily Use & Gifting, White",
        "price": "₹334",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/51UE9Nljg1L._AC_UL320_.jpg",
        "asin": "B072JW2KT8",
        "affiliate": "https://www.amazon.in/dp/B072JW2KT8/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "GOLDEN QUEEN'S Cup, Saucer & Spoons Set | Perfect for Hosting & for Tea/Coffee | Handcrafted in India | 24-Carat Gold Details | 6 Cups, 6 Saucers & 6 Spoons | 170 ml - Leafy Blush & Pink Charm",
        "price": "₹2,018",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/610-WMj0k9L._AC_UL320_.jpg",
        "asin": "B0F5HVBBTT",
        "affiliate": "https://www.amazon.in/dp/B0F5HVBBTT/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "The Earth Store Lavender Pebble Ceramic Cup Set of 6 for Tea, Small Coffee Chai Serving Cups Microwave Safe Ideal Gifts for Anniversary, Housewarming Parties Family and Friends 200ML",
        "price": "₹599",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/61c23PViM-L._AC_UL320_.jpg",
        "asin": "B0D9SG3M66",
        "affiliate": "https://www.amazon.in/dp/B0D9SG3M66/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Glass Tea Cup Set of 6 140 mL – Heat-Resistant, Lightweight & Durable | Transparent Chai Cups with Handle for Tea, Coffee, Milk & Beverages | Elegant Home & Kitchen Glassware – Ideal Gift Set",
        "price": "₹399",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/71rN-IfVi0L._AC_UL320_.jpg",
        "asin": "B0F2TKKK7F",
        "affiliate": "https://www.amazon.in/dp/B0F2TKKK7F/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Tea Cup Set of 6, Coffee Cup Set for Kitchen & Dining Table, Bone China Cup Set for Tea & Coffee, Tea Cup for Dining (160 ML)",
        "price": "₹1,350",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/61c2QGEN14S._AC_UL320_.jpg",
        "asin": "B08Q8K2ZQX",
        "affiliate": "https://www.amazon.in/dp/B08Q8K2ZQX/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "CRAF10 Ceramic Print Bliss Tea Mugs – Set of 6, 180 ML, Elegant & Durable, Microwave & Dishwasher Safe",
        "price": "₹749",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/91GYtTFaAhL._AC_UL320_.jpg",
        "asin": "B0DVBR6QBW",
        "affiliate": "https://www.amazon.in/dp/B0DVBR6QBW/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Ceramic Tea Cup Set of 6 | 150 ML Microwave Safe Chai Cups | Glossy Floral Deer Printed Tea Coffee Cups | Premium Ceramic Cup Set for Home Kitchen Office Gifting",
        "price": "₹399",
        "rating": "",
        "image": "https://m.media-amazon.com/images/I/41a2-Qg+AlL._AC_UL320_.jpg",
        "asin": "B0H1QSY8M7",
        "affiliate": "https://www.amazon.in/dp/B0H1QSY8M7/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Femora Ceramic Tea Cup Set of 6 Pcs -160 ml, Handprinted Blue Block Print Chai Cup Sets | Milk Coffee Mugs Dinnerware Crockery Drinkware| Daily Use & Gifting Item",
        "price": "₹669",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/61Jl0Aj7FZL._AC_UL320_.jpg",
        "asin": "B092CNRXQW",
        "affiliate": "https://www.amazon.in/dp/B092CNRXQW/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "La Opala Diva, Opal Glass Crockery | Coffee Cup Iris, Set of 6 | Twilight Bouquet, 100 ml | for Tea & Coffee | Microwave Safe | 100% Vegetarian | Toughened Extra Strong | Super Light | Super White",
        "price": "₹349",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/61X9fzWTMiL._AC_UL320_.jpg",
        "asin": "B0CGJFSHJV",
        "affiliate": "https://www.amazon.in/dp/B0CGJFSHJV/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "ExclusiveLane 'Deer & Floral' Ceramic Tea Cups Set of 6 for Tea Cups Ceramic (Set of 6, 150 ml, Microwave Safe, White & Blue)| Coffee Cup Set Ceramic Cups for Tea Cup Chai Cups Drinkware",
        "price": "₹860",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/71a7QhB6-uL._AC_UL320_.jpg",
        "asin": "B0DFLV2BW1",
        "affiliate": "https://www.amazon.in/dp/B0DFLV2BW1/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Clay Craft Fine Ceramic Tea/Coffee Cup Set of 6-200 ml Each (Hilton H309), Tea Cup Set of 6, Microwave & Dishwasher Safe, Mugs for Coffee, Cups Set of 6, Mug Set, Gift Set, Ideal for Gifting",
        "price": "₹737",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/81FM9hpSLrL._AC_UL320_.jpg",
        "asin": "B0CQT6VLCX",
        "affiliate": "https://www.amazon.in/dp/B0CQT6VLCX/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Borosil 240ml Latte Tea/Coffee Mug Set | Borosilicate Tuff Glass Made in India Cup Set for Chai, Green Tea, Coffee, Milk | Microwave Safe, Scratch Resistance, Lightweight | Transparent (6pc Set)",
        "price": "₹560",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/61R-oyk496L._AC_UL320_.jpg",
        "asin": "B0D9VR66CF",
        "affiliate": "https://www.amazon.in/dp/B0D9VR66CF/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Femora Ceramic Grey Gold Line Coffee & Tea Cup | Finest Premium for Tea/Coffee/Hot Drinks | Set of 6 | Capacity- 180 ML |(Not Microwave Safe)",
        "price": "₹999",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/51Ye8LKqSJL._AC_UL320_.jpg",
        "asin": "B08PNPZKXJ",
        "affiliate": "https://www.amazon.in/dp/B08PNPZKXJ/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Femora Indian Ceramic Tea Cup Set, 200 ML, Set of 6, Multi-Color (NOT Microwave Safe)",
        "price": "₹1,214",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/61kirOy0G-L._AC_UL320_.jpg",
        "asin": "B07FJVHTM3",
        "affiliate": "https://www.amazon.in/dp/B07FJVHTM3/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "The Earth Store Handcrafted Ceramic Flicker Zest Microwave Safe Chai/Tea Cups Serving Tea Cups Set of 6 Ideal for Friends, Anniversary, Birthday",
        "price": "₹429",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/71RRlB73ihL._AC_UL320_.jpg",
        "asin": "B0C5RHWXQN",
        "affiliate": "https://www.amazon.in/dp/B0C5RHWXQN/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "The Earth Store Cup O'clock Cup Set of 6 for Tea-200ml Each Capacity | Clock Print | Microwave and Dishwasher Safe Ceramic Tea Cup Ideal for Home, Office, Parties, Birthday Gift Chai Cups",
        "price": "₹455",
        "rating": "3.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/61lWLTVpQFL._AC_UL320_.jpg",
        "asin": "B0CYTC81TV",
        "affiliate": "https://www.amazon.in/dp/B0CYTC81TV/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Clay Craft Fine Ceramic Gold Printed Coffee/Tea Cups Set of 6-200 ml Each for Home & Gifting, Tea Cup Set of 6, Mugs for Coffee, Cups Set of 6, Mug Set, Ideal for Gifting, Perfect for Home and Office",
        "price": "₹1,259",
        "rating": "3.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/718rdBCtWYL._AC_UL320_.jpg",
        "asin": "B0CQ5K8329",
        "affiliate": "https://www.amazon.in/dp/B0CQ5K8329/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    
    {
        "title": "50 cm Velvet Shaped Stuffed Cushion | Soft Plush Decorative Pillow with Arms & Legs | Nursery & Bedroom Decor Soft Toy Cushion for Kids Home & Gift (3 Pcs Cloud Moon Star)",
        "price": "₹499",
        "rating": "5.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/61Jt5ajyHNL._AC_UL320_.jpg",
        "asin": "B0GSRXFLYM",
        "affiliate": "https://www.amazon.in/dp/B0GSRXFLYM/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "STITCHNEST Set of 2 Polycotton Cushion Covers – Yellow & Grey Abstract Drop Design – 12x18 Inches – Soft & Durable Cushion Covers for Sofa, Bed & Living Room | Perfect for Home Decor",
        "price": "₹279",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/81OVBpWcjoL._AC_UL320_.jpg",
        "asin": "B08LZL54FL",
        "affiliate": "https://www.amazon.in/dp/B08LZL54FL/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Sun Shaped Velvet Cushion for Kids Room, Living Room, Bedroom, Luxury Furnishing, Throw Pillow (16x16 inch, Orange)",
        "price": "₹525",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/51hOKWvYgxL._AC_UL320_.jpg",
        "asin": "B08ZNL62NS",
        "affiliate": "https://www.amazon.in/dp/B08ZNL62NS/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "STITCHNEST Set of 5 Polycotton Cushion Covers – 16x16 Inches – Multicolor Elephant & Jungle Print – Playful Cushion Covers for Kids Room, Sofa & Living Room Decor",
        "price": "₹348",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/91SQQqOQk0L._AC_UL320_.jpg",
        "asin": "B07T8PMTPW",
        "affiliate": "https://www.amazon.in/dp/B07T8PMTPW/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "AVS Super Soft Sunflower Cushion for Sofa Bed Seating Area Cushion Filler Throw Pillow Flower Shaped Pair Cushion Soft & Decorative Cushions for Living Room (35 Cm) (Pink)",
        "price": "₹426",
        "rating": "3.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/51HX6rvtlJL._AC_UL320_.jpg",
        "asin": "B0F99WHJZX",
        "affiliate": "https://www.amazon.in/dp/B0F99WHJZX/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "The Purple Tree Cute Cloud Moon Star Cot Cushion with Crown (Pack of 3, 16x16 inch, Velvet) Kids Cushion, Soft Toy, Soft Plush Pillow, Nursery décor, Baby Pillow",
        "price": "₹649",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/51rMDgTRIkL._AC_UL320_.jpg",
        "asin": "B07SS1YDHH",
        "affiliate": "https://www.amazon.in/dp/B07SS1YDHH/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "JDX and Fiber Round Cushion Set of 2 for Living Room and Sofa, 16x16 Inch, B0BGSP1L74",
        "price": "₹293",
        "rating": "3.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/71cie9kIuxL._AC_UL320_.jpg",
        "asin": "B0BGSP1L74",
        "affiliate": "https://www.amazon.in/dp/B0BGSP1L74/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Flower Shaped Velvet Decorative Throw Pillow Cushion Ultra Soft Cute Floor Pillow for Couch Bed Sofa (Dusty Pink, 16\"x16\")",
        "price": "₹399",
        "rating": "",
        "image": "https://m.media-amazon.com/images/I/7159vik1BAL._AC_UL320_.jpg",
        "asin": "B0GP6FV4QH",
        "affiliate": "https://www.amazon.in/dp/B0GP6FV4QH/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Cloth Fusion Microfiber Cushion 16 inch x 16 inch Filler, Sofa Cushions Set of 5, Durable Sofa Pillow for Home Decor (White)",
        "price": "₹999",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/51N3dTg2M0L._AC_UL320_.jpg",
        "asin": "B07L763N19",
        "affiliate": "https://www.amazon.in/dp/B07L763N19/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Set Of 5 Small Size Heart Shape Polyester Filled Pillow, Different Colors (5),Multi",
        "price": "₹599",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/51mzWAsn-5L._AC_UL320_.jpg",
        "asin": "B0CBYLF2XF",
        "affiliate": "https://www.amazon.in/dp/B0CBYLF2XF/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "MY ARMOR Microfibre Cushion for Sofa | Set of 5 Soft & Fluffy Square Sofa Cushions | Decorative Sofa Pillows for Bed, Chair, Car & Living Room | Velvet Cover | Grey | 16 x 16 Inch",
        "price": "₹1,369",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/71+1Fj1aRhL._AC_UL640_QL65_.jpg",
        "asin": "B09M45CNZ8",
        "affiliate": "https://www.amazon.in/dp/B09M45CNZ8/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Mollismoons Polyester Fill Decorative Throw Cushions & Pillow for Home Decor Moon, Star, Ball Girls Room, Kids Room (Ivory, 12x12, Round Cushion of Body Pillow, Decorative Cushions)",
        "price": "₹999",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/71xmzbalnlL._AC_UL320_.jpg",
        "asin": "B0DS9LH4JH",
        "affiliate": "https://www.amazon.in/dp/B0DS9LH4JH/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Oasis Home Tex Hand Made Decorative Velvet Heart Shape Cushions | Throw Pillows - Pack of 1 (Maroon)",
        "price": "₹249",
        "rating": "5.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/71rcuU1IR7L._AC_UL320_.jpg",
        "asin": "B0GPCSFV6T",
        "affiliate": "https://www.amazon.in/dp/B0GPCSFV6T/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Cushions for Sofa, Microfibre Filled Soft Cushion/Pillow, White (Pack of 2 Cushions, 16x16 Inches)",
        "price": "₹249",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/51v3TB1cYrL._AC_UL320_.jpg",
        "asin": "B0C7GJ5H8Y",
        "affiliate": "https://www.amazon.in/dp/B0C7GJ5H8Y/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "RVA Cute Sunflower Shaped Throw Pillows Preppy Decorative Pillows Cushion for Girls Bed Room Couch Sofa Chair Aesthetic Decor (35CM, Pink/White)",
        "price": "₹499",
        "rating": "3.7 out of 5",
        "image": "https://m.media-amazon.com/images/I/51DlF3vcLGL._AC_UL320_.jpg",
        "asin": "B0D92H58TX",
        "affiliate": "https://www.amazon.in/dp/B0D92H58TX/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "HOMADORN Luxury Cotton Handmade Decorative Boho Throw Pillow Covers with Tassels 16\"X16\" for Decorative Sofa Couch Living Room Indoor Outdoor Chair Car Farmhouse (Rust, 1)",
        "price": "₹489",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/A1EikvPmkwL._AC_UL320_.jpg",
        "asin": "B0CBSBXP5G",
        "affiliate": "https://www.amazon.in/dp/B0CBSBXP5G/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Star Shaped Decorative Throw Pillows, Pink and White Plush, Soft Cushions for Home Decor, Living Room, Balcony, 2 Pack",
        "price": "₹399",
        "rating": "5.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/71Za98xBUcL._AC_UL320_.jpg",
        "asin": "B0FY31VVCF",
        "affiliate": "https://www.amazon.in/dp/B0FY31VVCF/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "STITCHNEST Set of 5 Polycotton Cushion Covers – 16x16 Inches – Beige & White Ikat Geometric Print – Elegant Cushion Covers for Sofa & Living Room Decor",
        "price": "₹469",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/61dq7E7N30L._AC_UL320_.jpg",
        "asin": "B07TK1X3HM",
        "affiliate": "https://www.amazon.in/dp/B07TK1X3HM/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Brick Home Set of 2 Polycotton Printed Cushion Covers 12x18 Inches | Floral & Bird Design | Pastel Blush Pink, Beige & Off-White | Soft Fabric Decorative Pillow Covers for Sofa, Couch & Living Room",
        "price": "₹275",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/81xpBzXThsL._AC_UL320_.jpg",
        "asin": "B09LYTZKQ4",
        "affiliate": "https://www.amazon.in/dp/B09LYTZKQ4/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Keshav Creation Polyester Biscuit Cushion, Round Shape Biscuit, Stuffed Cushions Toy Seat Pad -Multicolored Decorative Cushion. (12X 12 Inch) (Set of 3)",
        "price": "₹785",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/71l97WN5wuL._AC_UL320_.jpg",
        "asin": "B09W9WCBWV",
        "affiliate": "https://www.amazon.in/dp/B09W9WCBWV/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "STITCHNEST Set of 2 Polycotton Cushion Covers – 16x16 Inches – Multicolor Elephant & Jungle Print – Playful Cushion Covers for Kids Room, Sofa & Living Room Decor",
        "price": "₹139",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/81776SK33yL._AC_UL320_.jpg",
        "asin": "B0GHYYRHKX",
        "affiliate": "https://www.amazon.in/dp/B0GHYYRHKX/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Microfiber Cushion 16 inches x 16 inches Filler, Sofa Cushions Set of 5 Durable Sofa Pillow for Home Decor (White) Cushion fillers",
        "price": "₹360",
        "rating": "3.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/61a38GNrQWL._AC_UL320_.jpg",
        "asin": "B0DPM7LY3Y",
        "affiliate": "https://www.amazon.in/dp/B0DPM7LY3Y/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Decorative Aesthetic Throw Knot Pillow | Fluffy Handmade Ball Shape Cushion | Soft Home Decor Round Pillows for Sofa, Bed, Couch, Living Room and Bedroom (Beige Grey)",
        "price": "₹599",
        "rating": "",
        "image": "https://m.media-amazon.com/images/I/51iB2sM5F3L._AC_UL320_.jpg",
        "asin": "B0H1X6ZPD8",
        "affiliate": "https://www.amazon.in/dp/B0H1X6ZPD8/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Cushions 16x16 Inch| 40x40 Cm, Filled with Microfiber Cushion for Sofa, Bed, Stripe White, Set of 1",
        "price": "₹189",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/61z4No5HG6L._AC_UL320_.jpg",
        "asin": "B0F6TNT3JL",
        "affiliate": "https://www.amazon.in/dp/B0F6TNT3JL/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "JDX Cushions | Hotel Quality Premium Fibre Sofa Cushion Set of 5 | Cushion 16 inch x 16 inch | Sofa Pillow, Cushion, Cushions for Sofa, Cushion Pillow, Pillow, Cushions for Bed",
        "price": "₹899",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/51pDo5ClyqL._AC_UL320_.jpg",
        "asin": "B01A4C6I54",
        "affiliate": "https://www.amazon.in/dp/B01A4C6I54/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "AEROHAVEN Set Of 5 Multi Colored Decorative Hand Made Jute Throw/Pillow Cushion Covers - Cc24 - (16 Inch X 16 Inch), 175 TC",
        "price": "₹183",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/71+Y5yc3cUL._AC_UL320_.jpg",
        "asin": "B07CZRN7GG",
        "affiliate": "https://www.amazon.in/dp/B07CZRN7GG/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "R home Pack of 1 Cushion Filler 12x20 Inch / 30x50 cm | Rectangular Lumbar Cushion Insert | Ultra Soft Premium Microfiber Filling | for Sofa, Bed, Couch & Diwan",
        "price": "₹299",
        "rating": "3.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/61XDJh6THPL._AC_UL320_.jpg",
        "asin": "B0D87N5H11",
        "affiliate": "https://www.amazon.in/dp/B0D87N5H11/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Double Sided Fur Pillow for Sofa/ Bedroom/ Couch/ Car - White Super Soft Fluffy Cushion in Square Shape - Size 16 X 16 Inches",
        "price": "₹358",
        "rating": "4.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/81Osz6dKGnS._AC_UL320_.jpg",
        "asin": "B0934BTP6Z",
        "affiliate": "https://www.amazon.in/dp/B0934BTP6Z/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Decorative Velvet Plush Smiley Pillows (Multicolor, 12x12 inches)- Set of 5, Sofa Cushions, Emoji Cushions, Emoji Cushions, Round Wink Kiss Heart Love Pillow, Smiley Cushions",
        "price": "₹599",
        "rating": "3.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/71EHpg9xK6L._AC_UL320_.jpg",
        "asin": "B0CF67M6SM",
        "affiliate": "https://www.amazon.in/dp/B0CF67M6SM/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Wakefit Cushion for Sofa | Super Soft Fabric Cushion Pillow, Throw Pillow for Sofa | Premium Fresh Hollow Fibre Filling | 16x16 Inches | Autumn Sunset | Set of 5",
        "price": "₹1,086",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/61zO56f05wL._AC_UL320_.jpg",
        "asin": "B09B76KFXF",
        "affiliate": "https://www.amazon.in/dp/B09B76KFXF/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "RVA Flower Pillow Decorative Soft Daisy Sunflower Throw Pillows Plush Rabbit Fur Fabric for Sofa Cushion Filler Throw Case for Sofa Bedroom Car Office (35 Cm) (Grey)",
        "price": "₹499",
        "rating": "",
        "image": "https://m.media-amazon.com/images/I/61lp7AcTH9L._AC_UL320_.jpg",
        "asin": "B0FS1ZKZDC",
        "affiliate": "https://www.amazon.in/dp/B0FS1ZKZDC/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Tufted Cushion Cover 12 inch x 20 inch | Bedroom Cushions Set for Bed | Living Room Cushions for Sofa | Yellow Diamond or Yellow Flower | Pack of 2",
        "price": "₹599",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/61mJHdVR11L._AC_UL320_.jpg",
        "asin": "B0BDMFHX1P",
        "affiliate": "https://www.amazon.in/dp/B0BDMFHX1P/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "JDX Microfiber Cushion Filler, 16 x 16 Inch, (Set of 5) | Cushions, Cushions for Sofa, Cushion, Cushion Pillow, Cushion 16 inch x 16 inch, Hollow Fiber Sofa Cushions Set of 5",
        "price": "₹621",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/51dzkarZmiL._AC_UL320_.jpg",
        "asin": "B081RL6BLM",
        "affiliate": "https://www.amazon.in/dp/B081RL6BLM/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Kuber Industries Pack of 2 Cushion Pillow Filler | 12x12 Inch | Fluffy Microfiber Cushion Filler for Sofa-Living Room-Bedroom | Throw Couch Cushion Pillow Filler | White",
        "price": "₹259",
        "rating": "3.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/51MTOV53ZHL._AC_UL320_.jpg",
        "asin": "B0D14V6C3D",
        "affiliate": "https://www.amazon.in/dp/B0D14V6C3D/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "ishro home Premium Cushion Cover Set of 5 | Cushion Cover 16 inch x 16 inch – Soft European Standard Fabric, Frill Design, Machine Washable | (5, Sun Garden, 16x16 Inch)",
        "price": "₹899",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/91mKq3DbGVL._AC_UL320_.jpg",
        "asin": "B0DZ27JR8N",
        "affiliate": "https://www.amazon.in/dp/B0DZ27JR8N/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Kuber Industries Rose Flower Shaped Pair Cushion|Soft & Decorative Cushions for Living Room Bed,Sofa,Seating Area,13 Inch,(Red)",
        "price": "₹342",
        "rating": "3.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/71AkFaSwdsL._AC_UL320_.jpg",
        "asin": "B0BBLX3SCY",
        "affiliate": "https://www.amazon.in/dp/B0BBLX3SCY/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Moon Plush Pillow, White Faux Fur, Decorative Throw Cushion (Big)",
        "price": "₹499",
        "rating": "4.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/61gaEwsS4ZL._AC_UL320_.jpg",
        "asin": "B0FYWQ384D",
        "affiliate": "https://www.amazon.in/dp/B0FYWQ384D/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "BRICK HOME Set of 2 Polycotton Printed Cushion Covers 12x18 Inches | Pastel Floral Pattern on Beige Stripes | Soft Fabric Decorative Pillow Covers for Sofa, Couch & Living Room",
        "price": "₹275",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/81Ih0uZnqwL._AC_UL320_.jpg",
        "asin": "B09LYW7SCN",
        "affiliate": "https://www.amazon.in/dp/B09LYW7SCN/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "R home Cushion Filler 30x50 cm Pack of 2 / 12x20 Inch | Lumbar Cushion Filler | Rectangle Cushion Insert | Vacuum Packed | Super Soft Microfiber I Best Grade Polyfill with Bounce Back",
        "price": "₹399",
        "rating": "3.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/61wEXIwyXCL._AC_UL320_.jpg",
        "asin": "B0D88PYTMR",
        "affiliate": "https://www.amazon.in/dp/B0D88PYTMR/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "STITCHNEST Set of 2 Pastel Leaf Serenity Collection Printed Jute Cushion Covers 16x16 Inches | Decorative Throw Pillow Covers for Sofa, Living Room, Bedroom | Perfect for Home Decor",
        "price": "₹139",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/81h44K53+UL._AC_UL320_.jpg",
        "asin": "B0GMQW2ZCH",
        "affiliate": "https://www.amazon.in/dp/B0GMQW2ZCH/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Kuber Industries Rose Flower Shaped Pair Cushion|Soft & Decorative Cushions for Living Room Bed,Sofa,Seating Area,13 Inch,(Purple)",
        "price": "₹323",
        "rating": "3.7 out of 5",
        "image": "https://m.media-amazon.com/images/I/71lAvxAeNpL._AC_UL320_.jpg",
        "asin": "B0BBLSQTHV",
        "affiliate": "https://www.amazon.in/dp/B0BBLSQTHV/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "The White Willow Memory Foam Square Cushion for Car, Sofa, Diwan, Bed, Chair & Couch-Premium Decorative Square Cushion for Sofa-Throw Pillow for Back Support-Soft-Small-12x12 Inch",
        "price": "₹522",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/71RGWF6JK+L._AC_UL320_.jpg",
        "asin": "B0179BAR32",
        "affiliate": "https://www.amazon.in/dp/B0179BAR32/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "STITCHNEST Set of 2 Polycotton Cushion Covers – 12x18 Inches – Cute Owl & Heart Print in Pink & Teal – Fun and Whimsical Cushion Covers for Kids Room, Sofa & Home Decor",
        "price": "₹279",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/81-ZjeXZjzL._AC_UL320_.jpg",
        "asin": "B082HNTPQC",
        "affiliate": "https://www.amazon.in/dp/B082HNTPQC/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Perfect Sleeper Premium 20x20 Inch Polyester Fiber Cushion Set of 3 - Plush and Fluffy Inserts for Sofa or Bed, Universal Size 50x50 cm, Square Shape Pillow for Versatile Styling",
        "price": "₹859",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/81Wd9sSTXoL._AC_UL320_.jpg",
        "asin": "B0975XWYYF",
        "affiliate": "https://www.amazon.in/dp/B0975XWYYF/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "AEROHAVEN™ Premium Faux Rabbit Fur Plush Luxury Soft Fluffy Striped Decorative Throw Pillow/Cushion Covers for Sofa, Couch, Living Room - CC283 - (2, Khaki, 16 x 16 Inch)",
        "price": "₹809",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/81F79urkMCL._AC_UL320_.jpg",
        "asin": "B0DY6HLP5Q",
        "affiliate": "https://www.amazon.in/dp/B0DY6HLP5Q/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "The Purple Tree Velvet Cute Star Cuddle Cushion for Kids and Babies (Blue, Pack of 1), Crib Cushion, Cuddle Cushion for Babies, Baby Cot Cushions",
        "price": "₹326",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/31EVy1f-xjL._AC_UL320_.jpg",
        "asin": "B08T9T71PY",
        "affiliate": "https://www.amazon.in/dp/B08T9T71PY/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "50 cm Velvet Shaped Stuffed Cushion | Soft Plush Decorative Pillow with Arms & Legs | Nursery & Bedroom Decor Soft Toy Cushion for Kids Home & Gift (2 Pcs Moon)",
        "price": "₹375",
        "rating": "5.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/51FDT0ptRzL._AC_UL320_.jpg",
        "asin": "B0GSS1CQPN",
        "affiliate": "https://www.amazon.in/dp/B0GSS1CQPN/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Rectangular 12x20 Inches Cushion, Set of 2, Microfiber Hotel Quality Premium Fibre Soft Cushion, Pillow Filler, White",
        "price": "₹489",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/61x8xqmMqRL._AC_UL320_.jpg",
        "asin": "B0B36G1Z65",
        "affiliate": "https://www.amazon.in/dp/B0B36G1Z65/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Wakewell Set of 5 Cushions 16 inch x 16 inch | Microfibre Sofa Cushion Filler for Diwan & Living Room | Square Throw Pillow, Soft & Fluffy (Striped Cushions, 16X16 Inches (Pack of 5))",
        "price": "₹555",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/61NeIW--ywL._AC_UL320_.jpg",
        "asin": "B09R4ZVNL7",
        "affiliate": "https://www.amazon.in/dp/B09R4ZVNL7/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    
    {
        "title": "Amazon Basics 20000 mAh Power Bank | 22.5W Fast Charging | Dual Output & Input | Charge 3 Devices Simultaneously | for Smartphones, TWS Earbuds, Speakers, Tablets (Dark Blue)",
        "price": "₹999",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/61YLrPkmW1L._AC_UY218_.jpg",
        "asin": "B0D96HMLYX",
        "affiliate": "https://www.amazon.in/dp/B0D96HMLYX/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Amazon Basics Memory Foam Travel Neck Pillow with Eye Mask & Ear Plugs Combo|Ultra Soft Velvet Fabric|Ergonomically Designed for Ultimate Comfort for Air, Car, Train, Bus Travel- Black, Standard Size",
        "price": "₹379",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/71gqZE6HL+L._AC_UY218_.jpg",
        "asin": "B0C7BM18PB",
        "affiliate": "https://www.amazon.in/dp/B0C7BM18PB/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "London Hills Women's Cotton Oversized Fit Printed Round Neck Oversized T-Shirt | Loose Fit Drop Shoulder T-Shirt Pack of 3",
        "price": "₹699",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/71NeVk5kozL._AC_UY218_.jpg",
        "asin": "B0CN72GNFD",
        "affiliate": "https://www.amazon.in/dp/B0CN72GNFD/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "amazon basics Sling Bag/Crossbody Bag with Adjustable Strap for Daily and Travel Use, Durable, Water-Resistant, Travel-Friendly (Unisex, Black)",
        "price": "₹459",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/71qVcSST3sL._AC_UY218_.jpg",
        "asin": "B0C3RFCH37",
        "affiliate": "https://www.amazon.in/dp/B0C3RFCH37/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Amazon Basics 4G LTE Wireless Dongle with All Sim Network Support|Single_Band Plug & Play Data Card Stick with Up to 150Mbps WiFi Hotspot|2200Mah Rechargeable Battery| Sim Adapter Included (Black)",
        "price": "₹2,499",
        "rating": "3.7 out of 5",
        "image": "https://m.media-amazon.com/images/I/5182gSeadZL._AC_UY218_.jpg",
        "asin": "B0DGGPBX97",
        "affiliate": "https://www.amazon.in/dp/B0DGGPBX97/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Amazon Basics Memory Foam Travel Neck Pillow with Eye Mask & Ear Plugs Combo|Ultra Soft Velvet Fabric|Ergonomically Designed for Ultimate Comfort for Air, Car, Train, Bus Travel- Grey, Standard Size",
        "price": "₹379",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/81Mzc1DyT8L._AC_UY218_.jpg",
        "asin": "B0C7BNDW3M",
        "affiliate": "https://www.amazon.in/dp/B0C7BNDW3M/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "London Hills Women's Casual Printed Round Neck Oversized Longline Drop Shoulder Boho Style T-Shirt",
        "price": "₹299",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/51JpOLglH2L._AC_UY218_.jpg",
        "asin": "B0CHK1Y9L2",
        "affiliate": "https://www.amazon.in/dp/B0CHK1Y9L2/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Amazon Basics 10-inch Ring Light with Tripod Stand | 3 Color Modes | 10 Brightness Settings | 360° Rotation | Suitable for Mobile Phones & Camera, YouTube, Photoshoot, Videography and More",
        "price": "₹439",
        "rating": "3.7 out of 5",
        "image": "https://m.media-amazon.com/images/I/51FxH9IyvgL._AC_UY218_.jpg",
        "asin": "B0D7Q327L8",
        "affiliate": "https://www.amazon.in/dp/B0D7Q327L8/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "amazon basics Vacuum Compression Storage Bags with Hand Pump - Medium, 5-Pack",
        "price": "₹499",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/71qEqnkZg8L._AC_UY218_.jpg",
        "asin": "B07RTJV6G4",
        "affiliate": "https://www.amazon.in/dp/B07RTJV6G4/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "amazon basics Sling Bag/Crossbody Bag with Adjustable Strap for Daily and Travel Use, Durable, Water-Resistant, Travel-Friendly (Unisex, Silver)",
        "price": "₹329",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/71mLgf8l40L._AC_UY218_.jpg",
        "asin": "B0C3RBDWQX",
        "affiliate": "https://www.amazon.in/dp/B0C3RBDWQX/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Amazon Basics 100% Memory Foam Travel Neck Pillow with Eye Mask and Ear Plugs Combo|Ergonomically Designed for Ultimate Comfort, Perfect for Air, Car, Train, Bus Travel - Navy Blue, Standard Size",
        "price": "₹379",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/81Tslj8zQ7L._AC_UY218_.jpg",
        "asin": "B0CB3QW7RW",
        "affiliate": "https://www.amazon.in/dp/B0CB3QW7RW/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "T Shirt For Man | Men T-Shirts | Tshirt For Man Solid Cotton Blend Half Sleeve Regular Men Round Neck Tshirts | T-Shirts | Stylish | Gym Wear For Workout | T-Shirt | Crew Neck | Multi-Colored",
        "price": "₹249",
        "rating": "3.7 out of 5",
        "image": "https://m.media-amazon.com/images/I/61v-HyIcV0L._AC_UY218_.jpg",
        "asin": "B07FLBTTNC",
        "affiliate": "https://www.amazon.in/dp/B07FLBTTNC/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Amazon Basics USB Type-C Hub Dock, 8-in-1 HDCP Aluminium Adapter with 4K HDMI & Ethernet Port,100mbps, Power Delivery, TF/SD Card Reader, Mac & Windows USB-C & 3.0 Devices",
        "price": "₹1,049",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/61Q+pBh+4sL._AC_UY218_.jpg",
        "asin": "B0BT179DV6",
        "affiliate": "https://www.amazon.in/dp/B0BT179DV6/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "AmazonBasics Pet Pee Pads for Potty Training| Standard | Regular 56 x 56cms | 50 Pieces | Leak-Proof Quick Dry Design, 5-Layer Design, for Small Dogs and Puppies (Standard, Regular Size, 50 Pads)",
        "price": "₹619",
        "rating": "3.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/71Co+yjlWAL._AC_UY218_.jpg",
        "asin": "B00MW8G3YU",
        "affiliate": "https://www.amazon.in/dp/B00MW8G3YU/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "amazon basics 100% Memory Foam Travel Neck Pillow with Eye Mask and Ear Plugs Combo|Ergonomically Designed for Ultimate Comfort, Perfect for Air, Car, Train, Bus Travel-Happy Holidays, Standard Size",
        "price": "₹379",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/81cBmC9FSqL._AC_UY218_.jpg",
        "asin": "B0C7BP65PH",
        "affiliate": "https://www.amazon.in/dp/B0C7BP65PH/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    
    {
        "title": "Kleenest Magic Eraser Cleaning Sponge | Pack of 4 | Chemical-Free, Multi-Purpose Wipe for Effortless Cleaning of Kitchen, Bathroom, Walls, Shoes & More – Tough on Stains, Gentle on Surfaces",
        "price": "₹299",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/61ykzpOaFKL._AC_UL320_.jpg",
        "asin": "B0FP4S4JX2",
        "affiliate": "https://www.amazon.in/dp/B0FP4S4JX2/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "CP PLUS 4MP Quad HD Smart Wi-Fi CCTV Camera for Home | 360° Pan & Tilt | CTC Cyber Secure Tech | View & Talk | Smart Detection Suite | IR Night Vision | Cloud Recording | Support OK Google | CP-E45Q",
        "price": "₹2,599",
        "rating": "3.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/11hfR5Cq9GL._SS200_.png",
        "asin": "B0FPRFBXQM",
        "affiliate": "https://www.amazon.in/dp/B0FPRFBXQM/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "AIPL Mosquito Net Repair Tape | Strong Adhesive & Waterproof Screen Repair Kit | Window & Door Mesh Patch for Tears & Holes | 200cm x 5cm Roll (Pack of 1)",
        "price": "₹149",
        "rating": "3.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/81NMsk1LSNL._AC_UL320_.jpg",
        "asin": "B0FSSK41HS",
        "affiliate": "https://www.amazon.in/dp/B0FSSK41HS/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Duracell LED Torch Light, Super Bright, 6000 LUX, Ultra-Light and Easy to Carry Design, Large Reflector, for Everyday Use, 2AA Batteries Free, Black",
        "price": "₹138",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/81rAz8kwM-L._AC_UL320_.jpg",
        "asin": "B0F8QT5ZPP",
        "affiliate": "https://www.amazon.in/dp/B0F8QT5ZPP/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "CP PLUS 2MP Full HD Wi-Fi CCTV Camera for Home with Motion Tracking | Smart Detection Suite | Night Vision | Cloud Recording | View & Talk | Supports OK Google | CTC Cyber Secure | CP-E25Q",
        "price": "₹1,999",
        "rating": "3.7 out of 5",
        "image": "https://m.media-amazon.com/images/I/11hfR5Cq9GL._SS200_.png",
        "asin": "B0FNRV6X18",
        "affiliate": "https://www.amazon.in/dp/B0FNRV6X18/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Qubo Smart Cam 360° by Hero Group [2026 Edition]| 3MP Ultra 2K Display | STQC Certified | Color Night Vision | 360° Panoramic Monitoring | 2-Way Talk | AI Person Detection | Cloud & SD Card Support",
        "price": "₹2,490",
        "rating": "3.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/61BI1MJ03iL._AC_UL320_.jpg",
        "asin": "B0G64G64YL",
        "affiliate": "https://www.amazon.in/dp/B0G64G64YL/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "CP PLUS 4MP Quad HD Outdoor Wi-Fi CCTV Camera | 360° Pan & Tilt | Full-Color Night Vision | CTC Cyber Secure Tech | Smart Detection Suite | View & Talk | OK Google | Cloud Recording | CP-Z43Q",
        "price": "₹3,599",
        "rating": "3.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/11hfR5Cq9GL._SS200_.png",
        "asin": "B0FNMHBRMX",
        "affiliate": "https://www.amazon.in/dp/B0FNMHBRMX/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "THEMISTO 20 Watt Mini Hot Melt Glue Gun with 10 Glue Sticks for DIY Art and Crafts…",
        "price": "₹187",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/618L6ygDkoL._AC_UL320_.jpg",
        "asin": "B0CK2DD4RN",
        "affiliate": "https://www.amazon.in/dp/B0CK2DD4RN/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "AGARO Royal Electric Spin Scrubber, Cleaning Brush Scrubber for Home, 400RPM/Mins - 8 Replaceable Brush Heads - 90Mins Work Time,3 Adjustable Size,2 Adjustable Speeds for Bathroom,Glass, Car, Black",
        "price": "₹2,899",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/71FNoF-RlSL._AC_UL320_.jpg",
        "asin": "B0FNDD3TCX",
        "affiliate": "https://www.amazon.in/dp/B0FNDD3TCX/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Street27® Rearview Mirror Thread Hole Plug Screw Bolts for Motorcycles Aluminum Alloy Vibration-Resistant Durable and Perfect for Replacement or Custom Applications",
        "price": "₹349",
        "rating": "3.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/41-8ggSEEkL._AC_UL320_.jpg",
        "asin": "B0DNZL9CFH",
        "affiliate": "https://www.amazon.in/dp/B0DNZL9CFH/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Zebronics 3 Pin Multiplug Travel Adapter With Universal Socket | 1440 Watts | 6 Amps | Compact & Durable Converter Plug for Travel, Home & Office Use (Power Plug 31)",
        "price": "₹109",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/51MSC21w+bL._AC_UL320_.jpg",
        "asin": "B0FJRH1BYH",
        "affiliate": "https://www.amazon.in/dp/B0FJRH1BYH/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Gym Posing Light with Power Bank | Portable lamp for Posing |Magnetic Light |180° Rotate with Hang Hook Camping Lamp,LED Handheld Flashlight with Adjustable Brightness, Rechargeable",
        "price": "₹1,698",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/71OwYWAOUOL._AC_UL320_.jpg",
        "asin": "B0FZ6B6RS4",
        "affiliate": "https://www.amazon.in/dp/B0FZ6B6RS4/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "EMBOX Extension Board 5 Meter Cable | Extension Board with Switches, 4 Universal Sockets LED Indicator | 1500W Extension Cord",
        "price": "₹395",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/51FzUoTd0pL._AC_UL320_.jpg",
        "asin": "B0FVFBZ4YF",
        "affiliate": "https://www.amazon.in/dp/B0FVFBZ4YF/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Aquaguard Water Softener Regeneration Media Salt (10 Kg) | 5-IN-1 BENEFIT | CERTIFIED DUST FREE 99.9% PURE",
        "price": "₹350",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/61Ef2slEPKL._AC_UL320_.jpg",
        "asin": "B0D7HRMLMP",
        "affiliate": "https://www.amazon.in/dp/B0D7HRMLMP/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Swiffer Duster Kit With Handle And Refill Duster, 1 Unit, Multicolored",
        "price": "₹499",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/71V6ExXVjNL._AC_UL320_.jpg",
        "asin": "B00WFVHDIY",
        "affiliate": "https://www.amazon.in/dp/B00WFVHDIY/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Amazon Brand – Presto! Clean Steel Spin Mop | Plastic & Stainless Steel | 2 Microfiber Refills | Big Wheels with Drag Handle | 360° Spin | Telescopic Handle | Green",
        "price": "₹1,199",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/61HjsCU1K-L._AC_UL320_.jpg",
        "asin": "B0F8C4PKN7",
        "affiliate": "https://www.amazon.in/dp/B0F8C4PKN7/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "DRQ Ceiling Fan Cleaner Duster, Reusable Microfiber Duster with Extension Pole, 13 to 48 Inch Fan Blade Cleaner, Removable Dusters for Cleaning Walls Bookshelves Door Window Top (Grey)",
        "price": "₹299",
        "rating": "4.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/71ozZfclMJL._AC_UL320_.jpg",
        "asin": "B0DKHJ9HVP",
        "affiliate": "https://www.amazon.in/dp/B0DKHJ9HVP/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "BUILDSKILL 13\" Small Tool Box for Home | Convenient Top Lids & Removable Tool Tray | Secure Latch Lock | Key Hole | Heavy Duty Impact Resistant Body | Ideal Repair Toolbox for DIY & Professional Use",
        "price": "₹489",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/719Nt13JKWL._AC_UL320_.jpg",
        "asin": "B0F7HPHHJQ",
        "affiliate": "https://www.amazon.in/dp/B0F7HPHHJQ/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Anchor by Panasonic Wireless Doorbell | 45 Melodies Calling Bell for Home, Office with 120 Meter Operating Range | Door Bell for home (22730)",
        "price": "₹699",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/51XGcwwG8qL._AC_UL320_.jpg",
        "asin": "B0824BZGH9",
        "affiliate": "https://www.amazon.in/dp/B0824BZGH9/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Portronics Juicemate Go Universal Travel Adapter with 6A AC Socket Output,Universal AC Socket, All in One International Travel Fast Charging Adapter,Suitable for 180+ Countries US,UK,EU,AUS,Etc",
        "price": "₹259",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/61qvvNGRzuL._AC_UL320_.jpg",
        "asin": "B0FMYRVQ8Q",
        "affiliate": "https://www.amazon.in/dp/B0FMYRVQ8Q/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "FLYNGO Motion Sensor Under Cabinet LED Light, 3 Color Modes Wireless Rechargeable Closet Light with Stepless Dimming for Under Counter, Kitchen, Cabinet, Wardrobe, Bedroom, Cupboard (30 CM)",
        "price": "₹575",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/61c8JhfZjAL._AC_UL320_.jpg",
        "asin": "B0GX5SWCBY",
        "affiliate": "https://www.amazon.in/dp/B0GX5SWCBY/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "Blue Star BL1HPCGA Bottom Loading Water Dispenser | 3 Faucets, Hot, Cold & Ambient Water, LED Display, Child Lock (Black)",
        "price": "₹16,500",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/61KmokBty8L._AC_UL320_.jpg",
        "asin": "B0F1T9CXV9",
        "affiliate": "https://www.amazon.in/dp/B0F1T9CXV9/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "ScotchBrite Scrub Pad ( pack of 5)",
        "price": "₹75",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/31Ip4aURUpL.png",
        "asin": "B07H4YJLP4",
        "affiliate": "https://www.amazon.in/dp/B07H4YJLP4/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    {
        "title": "CP PLUS 4MP Quad HD Smart Wi-Fi CCTV Camera | 360° Pan & Tilt | Press to Call | CTC Cyber Secure Tech | Smart Detection Suite | View & Talk | IR Night Vision | Cloud Recording | OK Google | CP-E44Q",
        "price": "₹2,699",
        "rating": "3.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/11hfR5Cq9GL._SS200_.png",
        "asin": "B0FMRJZT33",
        "affiliate": "https://www.amazon.in/dp/B0FMRJZT33/?tag=mydeals03c-21",
        "category": "Home & Kitchen"
    },
    
    {
        "title": "GRENARO Mic for YouTube Wireless, 3-Level Adjustable Noise Reduction Mic Wireless,S12 Wireless Microphone for Youtubers with LED Indicator Light (Single Channel Type-C Port Version)",
        "price": "₹787",
        "rating": "4.0 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/71dhDqkgHPL._AC_UL600_SR600,400_.jpg",
        "asin": "B0DQD8HWWG",
        "affiliate": "https://www.amazon.in/dp/B0DQD8HWWG/?tag=mydeals03c-21",
        "category": "Electronics"
    },
    {
        "title": "pTron Newly Launched Fusion Tunes 10W Mini Bluetooth Speaker with Wireless Karaoke Mic, 8Hrs Playtime, Vivid RGB Lights, Voice Effects, Multi-Play Modes BT5.1/TF Card & Type-C Charging Port (Black)",
        "price": "₹799",
        "rating": "4.1 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/61Lgfcc+o-L._AC_UL600_SR600,400_.jpg",
        "asin": "B0D772K8X8",
        "affiliate": "https://www.amazon.in/dp/B0D772K8X8/?tag=mydeals03c-21",
        "category": "Electronics"
    },
    {
        "title": "Hollyland Wireless Magnetic Mini Microphone: Lark A1 Mini Duo Wireless Mic for iPhone15/16/iPad/Android Smartphone with 3-Lv Noise Cancel, 200m Transmission for YouTube Podcast Vlog Content Creation",
        "price": "₹4,097",
        "rating": "4.1 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/612ETE0GIHL._AC_UL600_SR600,400_.jpg",
        "asin": "B0FMQW9LZD",
        "affiliate": "https://www.amazon.in/dp/B0FMQW9LZD/?tag=mydeals03c-21",
        "category": "Electronics"
    },
    {
        "title": "Digitek DWM-010 Mic Wireless with Type-C, Mic for YouTube Wireless Recording, 2.4GHz Wireless Microphone with Noise Reduction, 40m Range, 7H Battery, LED Light Indicator",
        "price": "₹799",
        "rating": "4.0 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/51wVz40ryKL._AC_UL600_SR600,400_.jpg",
        "asin": "B0GF1ZJ2N4",
        "affiliate": "https://www.amazon.in/dp/B0GF1ZJ2N4/?tag=mydeals03c-21",
        "category": "Electronics"
    },
    {
        "title": "Hollyland Lark M2 Wireless Microphone for iPhone/Camera/Android/PC, 48kHz/24-bit High Fidelity Audio, 300m Range, Noise Cancelling, 40h Use, YouTube, Vlog, Streaming (2TX + 3RX + Charging Case)",
        "price": "₹12,996",
        "rating": "4.1 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/81RzyMqiQjL._AC_UL600_SR600,400_.jpg",
        "asin": "B0FMWXRQRR",
        "affiliate": "https://www.amazon.in/dp/B0FMWXRQRR/?tag=mydeals03c-21",
        "category": "Electronics"
    },
    {
        "title": "Radhe Flutes | PVC Fiber | C Natural | Right Handed | Black & Orange Threads | Assorted Colours for Velvet Cover + Complete Flute Beginners Online Course In Hindi and English",
        "price": "₹398",
        "rating": "4.2 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/616uLwyJ1sL._AC_UL600_SR600,400_.jpg",
        "asin": "B07T35ZBHB",
        "affiliate": "https://www.amazon.in/dp/B07T35ZBHB/?tag=mydeals03c-21",
        "category": "Electronics"
    },
    {
        "title": "Digitek DWM-116 Mic Wireless with Type-C & Lightning, Wireless Mic for YouTube Recording, 2.4GHz Wireless Microphone with Noise Cancellation, 40m Range, 6H Battery, Magnetic Clip",
        "price": "₹3,683",
        "rating": "3.8 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/61jRoRx6HiL._AC_UL600_SR600,400_.jpg",
        "asin": "B0DH8BVS6Z",
        "affiliate": "https://www.amazon.in/dp/B0DH8BVS6Z/?tag=mydeals03c-21",
        "category": "Electronics"
    },
    {
        "title": "Juarez JRZ10HM Key C Diatonic Blues Harmonica 10 Hole 20 Tones with Case, Mouth Organ for Beginners, Students, Kids & Professionals, Silver",
        "price": "₹337",
        "rating": "4.3 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/615RyYFVkzL._AC_UL600_SR600,400_.jpg",
        "asin": "B088KRHPG5",
        "affiliate": "https://www.amazon.in/dp/B088KRHPG5/?tag=mydeals03c-21",
        "category": "Electronics"
    },
    {
        "title": "GADGETSWEAR Furry K8 Wireless Lavalier Microphone, Bluetooth Collar Microphone for Type-C Android, Noise Canceling Mic for Vlogging, Clip-On for YouTube (K8 - Single)",
        "price": "₹379",
        "rating": "3.9 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/51cNp+UlDUL._AC_UL600_SR600,400_.jpg",
        "asin": "B0FHBRX7T7",
        "affiliate": "https://www.amazon.in/dp/B0FHBRX7T7/?tag=mydeals03c-21",
        "category": "Electronics"
    },
    {
        "title": "VELOMAX Mic for YouTube Wireless - Ultra-Clear Noise Reduction, 30M Stable Connection, Zero Latency, Plug & Play, Perfect Wireless mic for Youtubers Creators",
        "price": "₹919",
        "rating": "4.2 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/717EAC0RU6L._AC_UL600_SR600,400_.jpg",
        "asin": "B0F2NBK7RN",
        "affiliate": "https://www.amazon.in/dp/B0F2NBK7RN/?tag=mydeals03c-21",
        "category": "Electronics"
    },
    {
        "title": "Mommers Xylophone Musical Educational Toy for Kid (1-3Year Old) I Toddlers Babies Kids Girls, Boys I 2-in-1 Piano Combined I Safe for Kids Drum Sticks for Fast and Fun Learning for Kid (Pink)",
        "price": "₹199",
        "rating": "4.1 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/71sBIRbeAWL._AC_UL600_SR600,400_.jpg",
        "asin": "B0D1M7GJYX",
        "affiliate": "https://www.amazon.in/dp/B0D1M7GJYX/?tag=mydeals03c-21",
        "category": "Electronics"
    },
    {
        "title": "BOYA ByM1 Auxiliary Omnidirectional Lavalier Condenser Microphone with 20ft Audio Cable (Black)",
        "price": "₹899",
        "rating": "4.0 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/51H9Y-aa6YL._AC_UL600_SR600,400_.jpg",
        "asin": "B076B8G5D8",
        "affiliate": "https://www.amazon.in/dp/B076B8G5D8/?tag=mydeals03c-21",
        "category": "Electronics"
    },
    {
        "title": "Digitek (DWM-124 2-in-1 Wireless Microphone System for iPhone 15+ Above & Type-C Android, 80m Range, Noise Reduction & Echo Modes, for Creators & Vloggers",
        "price": "₹2,699",
        "rating": "4.0 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/61tEuaArXUL._AC_UL600_SR600,400_.jpg",
        "asin": "B0GJKWNJH1",
        "affiliate": "https://www.amazon.in/dp/B0GJKWNJH1/?tag=mydeals03c-21",
        "category": "Electronics"
    },
    {
        "title": "Portronics Dash 7 Omnidirectional Type C Wireless Microphone, Noise Cancellation, Plug & Play, Lapel Wireless Mic for Video Recording, Supports Type C Android, iPhone, Camera(Black)",
        "price": "₹799",
        "rating": "3.9 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/510FMHQ1ikL._AC_UL600_SR600,400_.jpg",
        "asin": "B0CWXRTBSZ",
        "affiliate": "https://www.amazon.in/dp/B0CWXRTBSZ/?tag=mydeals03c-21",
        "category": "Electronics"
    },
    {
        "title": "Juârez JRZ250 One Handed Trigger Guitar Metal Capo Quick Change for Ukulele, Electric and Acoustic Guitars, Black",
        "price": "₹199",
        "rating": "4.3 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/71rEeRq9oyL._AC_UL600_SR600,400_.jpg",
        "asin": "B072FH5KLJ",
        "affiliate": "https://www.amazon.in/dp/B072FH5KLJ/?tag=mydeals03c-21",
        "category": "Electronics"
    },
    {
        "title": "Juârez JRZ100 Guitar Wall Hanger/Mount/Holder/Hook/Stand/Rack for Acoustic/Electric/Bass Guitars, with Fittings/Accessories, Black",
        "price": "₹199",
        "rating": "4.3 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/51AdYDbV1HL._AC_UL600_SR600,400_.jpg",
        "asin": "B0716FQ7SP",
        "affiliate": "https://www.amazon.in/dp/B0716FQ7SP/?tag=mydeals03c-21",
        "category": "Electronics"
    },
    {
        "title": "GRENARO P10 Wireless Mic for Youtubers with 3-Level Noise Reduction, Mic Wireless with 40H Charging Case, Mike for YouTube Channel",
        "price": "₹1,999",
        "rating": "3.8 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/71o4U01-QpL._AC_UL600_SR600,400_.jpg",
        "asin": "B0DCJSVN1Z",
        "affiliate": "https://www.amazon.in/dp/B0DCJSVN1Z/?tag=mydeals03c-21",
        "category": "Electronics"
    },
    {
        "title": "Juarez Extra Light Copper Wound Acoustic Guitar Strings Set – 0.010–0.048 Gauge, 7 Strings (Extra 1st String), Bright Copper Tone, Includes 2 Picks – For All Acoustic Guitars JAGSP300",
        "price": "₹149",
        "rating": "4.1 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/61tqfh+g8RL._AC_UL600_SR600,400_.jpg",
        "asin": "B08MVZGGW4",
        "affiliate": "https://www.amazon.in/dp/B08MVZGGW4/?tag=mydeals03c-21",
        "category": "Electronics"
    },
    {
        "title": "Yamaha F280 Acoustic Guitar – Natural Finish, 6-String Full-Size Guitar with Spruce Top & Rosewood Fretboard, Ideal for Beginners & Intermediate Players",
        "price": "₹7,191",
        "rating": "4.2 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/61b6DTHgNWL._AC_UL600_SR600,400_.jpg",
        "asin": "B08317Y4VP",
        "affiliate": "https://www.amazon.in/dp/B08317Y4VP/?tag=mydeals03c-21",
        "category": "Electronics"
    },
    {
        "title": "JUAREZ JRGS100 Heavy-Duty Metal Folding Guitar Stand | Universal A-Frame Stand for Acoustic, Electric, Bass, Ukulele & Banjo | Anti-Slip Rubber & Foam Padding",
        "price": "₹469",
        "rating": "4.3 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/61E+Nm2pzKL._AC_UL600_SR600,400_.jpg",
        "asin": "B08KWM1MHV",
        "affiliate": "https://www.amazon.in/dp/B08KWM1MHV/?tag=mydeals03c-21",
        "category": "Electronics"
    },
    {
        "title": "Juarez JAP60 Guitar Plectrums Pick Set (6 Pieces) | Multi-Thickness 0.46mm–1.50mm | Celluloid & ABS Picks | For Acoustic & Electric Guitar | Colours Random",
        "price": "₹209",
        "rating": "4.3 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/71EzaEE+liL._AC_UL600_SR600,400_.jpg",
        "asin": "B08K43SPQ1",
        "affiliate": "https://www.amazon.in/dp/B08K43SPQ1/?tag=mydeals03c-21",
        "category": "Electronics"
    },
    {
        "title": "GRENARO Wireless Mic for Youtubers, S11 3 in 1 Wireless Microphone for iPhone/Android/DSLR Camera/USB-C Plug/iPad, Noise Cancellation Mic for Youtubers, Video Recording, 50M Range (Dual Channel)",
        "price": "₹1,182",
        "rating": "4.0 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/71nxcnWu3yL._AC_UL600_SR600,400_.jpg",
        "asin": "B0DMV9KZ76",
        "affiliate": "https://www.amazon.in/dp/B0DMV9KZ76/?tag=mydeals03c-21",
        "category": "Electronics"
    },
    {
        "title": "Digitek (DWM 123 2-in-1 Wireless Microphone System with Charging Case & Magnetic Collar Clip, Type-C Port for iOS, Smartphones, 60m Range, Build in Microphone, for Creators and Vloggers (Black - 2)",
        "price": "₹1,833",
        "rating": "4.1 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/61KNgdNotZL._AC_UL600_SR600,400_.jpg",
        "asin": "B0GJKYHS8J",
        "affiliate": "https://www.amazon.in/dp/B0GJKYHS8J/?tag=mydeals03c-21",
        "category": "Electronics"
    },
    {
        "title": "GRENARO J13 Wireless Mic for YouTube, 3-Level Adjustable MicNoise Reduction Lapel Mic with Charging Case, Wireless Mic for Video Recording, YouTube, Facebook, Video Production (Double (Universal))",
        "price": "₹1,896",
        "rating": "3.9 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/61JBh+juL3L._AC_UL600_SR600,400_.jpg",
        "asin": "B09ZV5JHVR",
        "affiliate": "https://www.amazon.in/dp/B09ZV5JHVR/?tag=mydeals03c-21",
        "category": "Electronics"
    },
    {
        "title": "Digitek DWM 101 Wireless Microphone System with ANC Noise Reduction, 360° Sound Capture, Upto 12 Hrs Working Time, for DSLR Camera, Android & iOS Smartphones, Seamless Audio Recording",
        "price": "₹4,299",
        "rating": "3.9 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/71bd2iJ18bL._AC_UL600_SR600,400_.jpg",
        "asin": "B0B8DF9H2R",
        "affiliate": "https://www.amazon.in/dp/B0B8DF9H2R/?tag=mydeals03c-21",
        "category": "Electronics"
    },
    {
        "title": "Kadence UKTWC Concert 23\" Acoustic Ukulele | Sapele Wood | Comes with Bag | Includes Learning Course | Brown",
        "price": "₹2,499",
        "rating": "4.4 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/51N29anEXCL._AC_UL600_SR600,400_.jpg",
        "asin": "B08G1NYPLF",
        "affiliate": "https://www.amazon.in/dp/B08G1NYPLF/?tag=mydeals03c-21",
        "category": "Electronics"
    },
    {
        "title": "Amazon Basics Guitar Capo with Pin Remover | Heavy Duty ABS Material | Versatile Fit | For Acoustic & Electric Guitar, Ukulele and Banjo | Buzz Free (Black)",
        "price": "₹93",
        "rating": "3.7 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/61YKCbZ2YtL._AC_UL600_SR600,400_.jpg",
        "asin": "B0DSPJBGPP",
        "affiliate": "https://www.amazon.in/dp/B0DSPJBGPP/?tag=mydeals03c-21",
        "category": "Electronics"
    },
    {
        "title": "DIGIMORE Cardioid Dynamic Microphone | 6.35mm Jack | High Sensitivity | 3m Cable | ON/Off Switch | Ideal for Karaoke, Singing, PA & Stage Use (D-1010)",
        "price": "₹386",
        "rating": "4.1 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/71QWOU56EDL._AC_UL600_SR600,400_.jpg",
        "asin": "B0G3X7GPXY",
        "affiliate": "https://www.amazon.in/dp/B0G3X7GPXY/?tag=mydeals03c-21",
        "category": "Electronics"
    },
    {
        "title": "EMBOX Omnidirectional Mic for YouTube | Plug & Play Wireless Mic Set 30m Range | Microphone for Video Recording DSP Noise Cancellation Collar Mike LED Type C for Vlogging, Podcast",
        "price": "₹549",
        "rating": "3.4 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/71EsHudrEmL._AC_UL300_SR300,200_.jpg",
        "asin": "B0G4DMDHD8",
        "affiliate": "https://www.amazon.in/dp/B0G4DMDHD8/?tag=mydeals03c-21",
        "category": "Electronics"
    },
    {
        "title": "VELOMAX Wireless Mic for Youtubers, Noise Cancellation Wireless Microphone with 164FT 40H Battery, Mic for YouTube Wireless, Microphone for Recording, Vlogging (Type-C and Lightning Port Version)",
        "price": "₹2,098",
        "rating": "4.3 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/61lflR4O7NL._AC_UL300_SR300,200_.jpg",
        "asin": "B0D5DPWH3K",
        "affiliate": "https://www.amazon.in/dp/B0D5DPWH3K/?tag=mydeals03c-21",
        "category": "Electronics"
    },
    {
        "title": "UTECTION by VOOK Wireless Mic with Noise Cancellation – Clip-On Collar Mic for iPhone & Android | 48H Battery, 20m Range, Type-C Charging | Mic Wireless for YouTube, Vlogging & Video Recording",
        "price": "₹2,299",
        "rating": "4.4 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/61r+JCRVbZL._AC_UL300_SR300,200_.jpg",
        "asin": "B0GMWDK829",
        "affiliate": "https://www.amazon.in/dp/B0GMWDK829/?tag=mydeals03c-21",
        "category": "Electronics"
    },
    {
        "title": "MAONO Boom Arm Microphone Stand: Adjustable Metal Suspension Mic Boom Arm for Podcast Gaming Streaming Recording,with Desk Clamp and 3/8\" to 5/8\" Screw Adapter-Max Load 1KG AU-B01 Black",
        "price": "₹719",
        "rating": "4.1 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/610haNom-OL._AC_UL300_SR300,200_.jpg",
        "asin": "B07JGQ9L5B",
        "affiliate": "https://www.amazon.in/dp/B07JGQ9L5B/?tag=mydeals03c-21",
        "category": "Electronics"
    },
    {
        "title": "YGM Acoustic Foams® Pyramid Acoustic Panels 12″×12″×2″ Thick | 38 Density Acoustic Foams for Echo Reduction & Sound Absorption | Sound Proof Foam for Room & Studio | Charcoal Black, Set of 18",
        "price": "₹1,295",
        "rating": "4.2 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/71YVQmQ-ScL._AC_UL300_SR300,200_.jpg",
        "asin": "B0B7GMH7KZ",
        "affiliate": "https://www.amazon.in/dp/B0B7GMH7KZ/?tag=mydeals03c-21",
        "category": "Electronics"
    },
    {
        "title": "MUTMAIN Polyester Piano Dust Cover For Casio & Yamaha All 61 Keys Keyboards Yamaha Psr-E363, E373, E473, E463, I455, I425, I400, I500 Keyboard & X870In, X8000In, X9000In Keyboard (61Pdc-Black)",
        "price": "₹301",
        "rating": "3.9 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/61q5oG+lzwL._AC_UL300_SR300,200_.jpg",
        "asin": "B0B3KT7SDJ",
        "affiliate": "https://www.amazon.in/dp/B0B3KT7SDJ/?tag=mydeals03c-21",
        "category": "Electronics"
    },
    {
        "title": "Radhe Flutes PVC Fiber C Natural Bansuri – 19 Inch Middle Octave, Right-Handed Flute | Durable, Weatherproof, Bamboo-Like Sound for Beginners & Professionals",
        "price": "₹299",
        "rating": "4.2 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/31x80h0q7xL._AC_UL300_SR300,200_.jpg",
        "asin": "B0773GB3KF",
        "affiliate": "https://www.amazon.in/dp/B0773GB3KF/?tag=mydeals03c-21",
        "category": "Electronics"
    },
    {
        "title": "FEDUS ClearTone 9.5V 1A Power Adapter for Casio Piano Electronics Keyboards, Replacement for AD-E95100L, Fits SA-46, SA-47, SA-76, SA-77, CTK-240, CTK-1100, CTK-1150, CTK-1200, 2 meter Extra Long Cord",
        "price": "₹398",
        "rating": "3.8 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/71feQQe0j+L._AC_UL300_SR300,200_.jpg",
        "asin": "B0995J8WT7",
        "affiliate": "https://www.amazon.in/dp/B0995J8WT7/?tag=mydeals03c-21",
        "category": "Electronics"
    },
    
    {
        "title": "Sounce Anti-Slip Silicone PS5 Controller Skin Cover – Non-Slip Protective Grip Sleeve with Thumb Grip Caps, Touch Pad Sticker & Wrap Cover Stickers for PlayStation 5 (Pack of 1, Red Skin Cover)",
        "price": "₹349",
        "rating": "4.5 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/71xbdy-9ogL._AC_UL600_SR600,400_.jpg",
        "asin": "B0FRF4VSXC",
        "affiliate": "https://www.amazon.in/dp/B0FRF4VSXC/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "Sony DualSense Wireless Controller Red (PlayStation 5)",
        "price": "₹6,149",
        "rating": "4.5 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/61afp1oz7eL._AC_UL600_SR600,400_.jpg",
        "asin": "B098439Y2G",
        "affiliate": "https://www.amazon.in/dp/B098439Y2G/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "Rockstar Games PS5 Video Game ConsoleGrand Theft Auto V",
        "price": "₹2,299",
        "rating": "4.5 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/81kAitW5qAL._AC_UL600_SR600,400_.jpg",
        "asin": "B09XJ8FGVP",
        "affiliate": "https://www.amazon.in/dp/B09XJ8FGVP/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "Ant Esports Dock5 RGB with Cooling Fan and Dual Controller Charger Station, PS5 Console Disc & Digital Edition, PS5 Cooling Station Accessories with RGB Light/Headset Holder/6 Game Slots/Screw (White)",
        "price": "₹1,899",
        "rating": "4.4 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/81jrnsmHlPL._AC_UL600_SR600,400_.jpg",
        "asin": "B0BRZZCRPW",
        "affiliate": "https://www.amazon.in/dp/B0BRZZCRPW/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "Sounce Glacier Pad RGB PS5 Cooling Stand with Dual Controller Charging Station Vertical Stand with 5200RPM Cooling Fan, RGB Lights Compatible with PS5 Disc/Pro/Digital/Slim Consoles (White)",
        "price": "₹1,699",
        "rating": "4.2 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/71pngHvGYkL._AC_UL600_SR600,400_.jpg",
        "asin": "B0F674X8GP",
        "affiliate": "https://www.amazon.in/dp/B0F674X8GP/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "Cranique Waterproof Dust cover for PS5 Gaming Console Digital Edition & Disc Edition Playstation 5 (Black)",
        "price": "₹225",
        "rating": "4.3 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/91JkAsS35JL._AC_UL600_SR600,400_.jpg",
        "asin": "B0CHMXVCGH",
        "affiliate": "https://www.amazon.in/dp/B0CHMXVCGH/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "EDNITA Controller Cover for PS5 Silicone Skin, Controller Accessories, Non-Slip PS 5 Case with Thumb Grip Caps, Touch Pad Sticker and Cover Wrap Stickers (Pack of-1)",
        "price": "₹399",
        "rating": "4.3 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/61G1XFG4xiL._AC_UL600_SR600,400_.jpg",
        "asin": "B0G2MKGDFD",
        "affiliate": "https://www.amazon.in/dp/B0G2MKGDFD/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "Electronic Arts FC 26 | Standard Edition | PlayStation 5",
        "price": "₹2,999",
        "rating": "3.9 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/61y95cBeTeL._AC_UL600_SR600,400_.jpg",
        "asin": "B0FHWBD9ZV",
        "affiliate": "https://www.amazon.in/dp/B0FHWBD9ZV/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "ZORBES® Desk Stand for PS5 Slim/Pro Console,Horizontal Stand for PS5 Slim/Pro Console,Anti-Slip Base Accessories PlayStation 5 Slim//Pro Digital & Ultra-HD Edition No l Included",
        "price": "₹757",
        "rating": "4.4 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/514urlstaxL._AC_UL600_SR600,400_.jpg",
        "asin": "B0CWH7FCFX",
        "affiliate": "https://www.amazon.in/dp/B0CWH7FCFX/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "PowerA Twin Charging Station for PS5 DualSense and DualSense Edge Wireless Controllers, AC Adaptor Included, with LED Indicator, Vertical Dual Controller Fast Charging Dock (Officially Licensed)",
        "price": "₹1,999",
        "rating": "4.5 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/61TezEHI9dL._AC_UL600_SR600,400_.jpg",
        "asin": "B0DP6N7ZCF",
        "affiliate": "https://www.amazon.in/dp/B0DP6N7ZCF/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "Joystick Replacement Cap Thumb Grips for PS5/PS4 Controller, IINE PS5/PS4 Controller Button Stick Covers, 3D Analog Cap Skin Replacement Part Repair Accessories, 6 PCS",
        "price": "₹440",
        "rating": "4.7 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/612xo4lqAeL._AC_UL600_SR600,400_.jpg",
        "asin": "B0F1KL383Z",
        "affiliate": "https://www.amazon.in/dp/B0F1KL383Z/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "Meyaar Thumb Grips Joystick Caps for PS4/PS5/XBOX Controller, Silicone Joystick Caps Ps5 Controller Grip with Anti-Stickiness, Anti-Slip, Anti-Fingerprint (Pack of 10 Piece)",
        "price": "₹139",
        "rating": "3.9 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/61JCsXlRzEL._AC_UL600_SR600,400_.jpg",
        "asin": "B0GG5GYL25",
        "affiliate": "https://www.amazon.in/dp/B0GG5GYL25/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "Sounce Dust Plug for PS5, 9 Pcs Dust Plug Kit, Slim Console, PS5 Silicone Plug Protector, Antidust Cover, Dustproof PlayStation 5 Disk/Digital Console Slim Game Accessories (Black)",
        "price": "₹299",
        "rating": "4.2 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/61ifCtUPYuL._AC_UL600_SR600,400_.jpg",
        "asin": "B0FNDDJ1LV",
        "affiliate": "https://www.amazon.in/dp/B0FNDDJ1LV/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "Meyaar Anti-Slip Silicone Cover for PS5 Controller with Thumb Grip Caps & Touchpad Sticker Made for PS5 Controller Only. (Bloodline Black (1 Pack))",
        "price": "₹398",
        "rating": "4.4 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/618PJaLIbDL._AC_UL600_SR600,400_.jpg",
        "asin": "B0GN2F3JFY",
        "affiliate": "https://www.amazon.in/dp/B0GN2F3JFY/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "Sony Ps5 Spiderman 2 Standard Edn.",
        "price": "₹3,940",
        "rating": "4.2 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/81qBiCSoegL._AC_UL600_SR600,400_.jpg",
        "asin": "B0C7VLXMT4",
        "affiliate": "https://www.amazon.in/dp/B0C7VLXMT4/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "Cricket 26 | Standard Edition | Playstation 5",
        "price": "₹4,299",
        "rating": "3.9 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/71KRjeUNa+L._AC_UL600_SR600,400_.jpg",
        "asin": "B0FV8P4993",
        "affiliate": "https://www.amazon.in/dp/B0FV8P4993/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "DEADSKULL – Spidy Edition Protective Cover Case Compatible with PlayStation DualSense Anti-Slip PS5 Remote Skin, PS 5 Controller Accessories,Silicone Sleeves Set (Red & Black)",
        "price": "₹479",
        "rating": "4.3 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/711VG+Iwg9L._AC_UL600_SR600,400_.jpg",
        "asin": "B0G1H22MT6",
        "affiliate": "https://www.amazon.in/dp/B0G1H22MT6/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "Meyaar FPS Freek Galaxy Joystick Cap Cover for PlayStation 4 (PS4) and PlayStation 5 (PS5) | Performance Thumbsticks for PS5 & PS4 Joystick Cover Cap | 1 High-Rise, 1 Mid-Rise (White)",
        "price": "₹299",
        "rating": "4.4 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/71LuSenKs4L._AC_UL600_SR600,400_.jpg",
        "asin": "B0F95ZTDSR",
        "affiliate": "https://www.amazon.in/dp/B0F95ZTDSR/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "New World JOYSTICK REPLACEMENT CAPS FOR PS5 ,Easy to install Joystick Replacement Cap Thumb Grips for PS5 Controller Replacement Part Repair Accessories- 4 PC",
        "price": "₹400",
        "rating": "4.2 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/31QWBJuHp0L._AC_UL600_SR600,400_.jpg",
        "asin": "B0FKTPM8V6",
        "affiliate": "https://www.amazon.in/dp/B0FKTPM8V6/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "Bandai Namco Tekken 8 | Standard Edition | PlayStation 5",
        "price": "₹2,989",
        "rating": "4.3 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/81calZhnlHL._AC_UL600_SR600,400_.jpg",
        "asin": "B0CKSX2S72",
        "affiliate": "https://www.amazon.in/dp/B0CKSX2S72/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "Sounce Premium Polyester Dual Controller Hard Carry Case for PS5, PS4, Xbox, and iPega Controllers – Shockproof Travel Storage Bag with 3-Layer Protection, Accessory Pocket & Handle",
        "price": "₹1,999",
        "rating": "4.4 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/811+E7e7gsL._AC_UL600_SR600,400_.jpg",
        "asin": "B0F91N6WQK",
        "affiliate": "https://www.amazon.in/dp/B0F91N6WQK/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "PS5 Ghost of Yotei",
        "price": "₹5,199",
        "rating": "4.3 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/81p8hiryVYL._AC_UL600_SR600,400_.jpg",
        "asin": "B0F6VH981P",
        "affiliate": "https://www.amazon.in/dp/B0F6VH981P/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "PS5 Mortal Kombat 11: Ultimate",
        "price": "₹2,017",
        "rating": "4.5 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/71IBLpK-DtL._AC_UL600_SR600,400_.jpg",
        "asin": "B08SL6JRX6",
        "affiliate": "https://www.amazon.in/dp/B08SL6JRX6/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "New World Black/Red Universal Travel EVA Game Controller Carrying Storage Case ,Game Controller Holder Home Safekeeping Protective Cover Compatible with PS5/PS4/XBOX/Switch Pro Controller",
        "price": "₹499",
        "rating": "4.5 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/61CHnwx+BwL._AC_UL600_SR600,400_.jpg",
        "asin": "B0FS29PY7R",
        "affiliate": "https://www.amazon.in/dp/B0FS29PY7R/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "Mortal Kombat 1 | Standard Edition | PlayStation 5",
        "price": "₹1,999",
        "rating": "4.3 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/81Y0VYDMohL._AC_UL600_SR600,400_.jpg",
        "asin": "B0C5WVDXGX",
        "affiliate": "https://www.amazon.in/dp/B0C5WVDXGX/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "ZORBES® LED Fan for PS5 Slim Console,Quiet Cooler with Memory Function,Accessory with 3 Fans & USB 3.0 Port Compatible Playstation5 Slim Digital & Discs Edition Cooling Fan for PS5 Accessories",
        "price": "₹1,398",
        "rating": "4.5 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/61NhhW6oV8L._AC_UL600_SR600,400_.jpg",
        "asin": "B0CX12ZCW7",
        "affiliate": "https://www.amazon.in/dp/B0CX12ZCW7/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "WWE 2K26 | Standard Edition | PlayStation 5",
        "price": "₹4,255",
        "rating": "4.1 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/710tNzjA72L._AC_UL600_SR600,400_.jpg",
        "asin": "B0GMGVT3Z8",
        "affiliate": "https://www.amazon.in/dp/B0GMGVT3Z8/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "OIVO INDIA Dual Controller Remote Hard Carry Cover Compatible for PS5/PS4/XBOX Water-Resistant Travel Carry Case",
        "price": "₹749",
        "rating": "4.5 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/61ZwJnUbgEL._AC_UL600_SR600,400_.jpg",
        "asin": "B0D6RSFS64",
        "affiliate": "https://www.amazon.in/dp/B0D6RSFS64/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    {
        "title": "Resident Evil Requiem | Standard Edition | PlayStation 5",
        "price": "₹4,799",
        "rating": "4.6 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/61Y6ieMqm3L._AC_UL600_SR600,400_.jpg",
        "asin": "B0G433389V",
        "affiliate": "https://www.amazon.in/dp/B0G433389V/?tag=mydeals03c-21",
        "category": "Gaming"
    },
    
    {
        "title": "SASSAFRAS",
        "price": "₹989",
        "rating": "",
        "image": "https://m.media-amazon.com/images/I/81GLgMSVg8L._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FDR59YBN",
        "affiliate": "https://www.amazon.in/dp/B0FDR59YBN/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹967",
        "rating": "4.7 out of 5",
        "image": "https://m.media-amazon.com/images/I/91yyREZTT8L._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FDBCC1CT",
        "affiliate": "https://www.amazon.in/dp/B0FDBCC1CT/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹989",
        "rating": "",
        "image": "https://m.media-amazon.com/images/I/81GLgMSVg8L._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FDR5DS1Z",
        "affiliate": "https://www.amazon.in/dp/B0FDR5DS1Z/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹989",
        "rating": "",
        "image": "https://m.media-amazon.com/images/I/81GLgMSVg8L._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FDR66VNL",
        "affiliate": "https://www.amazon.in/dp/B0FDR66VNL/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹947",
        "rating": "",
        "image": "https://m.media-amazon.com/images/I/91qDH-phs9L._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FB3D7Z1M",
        "affiliate": "https://www.amazon.in/dp/B0FB3D7Z1M/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹823",
        "rating": "",
        "image": "https://m.media-amazon.com/images/I/91f3RDnnifL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FB36YFJQ",
        "affiliate": "https://www.amazon.in/dp/B0FB36YFJQ/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹802",
        "rating": "",
        "image": "https://m.media-amazon.com/images/I/81GLgMSVg8L._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FDR4JJWL",
        "affiliate": "https://www.amazon.in/dp/B0FDR4JJWL/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹989",
        "rating": "",
        "image": "https://m.media-amazon.com/images/I/91f3RDnnifL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FB37Y545",
        "affiliate": "https://www.amazon.in/dp/B0FB37Y545/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹988",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/61XkuV3t0OL._AC_UL320_.jpg",
        "asin": "B0FDBCWQ31",
        "affiliate": "https://www.amazon.in/dp/B0FDBCWQ31/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹781",
        "rating": "4.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/81pBMfPEfrL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0B4S2HX5N",
        "affiliate": "https://www.amazon.in/dp/B0B4S2HX5N/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹839",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/91xKMwh0cLL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FG3BRCFG",
        "affiliate": "https://www.amazon.in/dp/B0FG3BRCFG/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹989",
        "rating": "",
        "image": "https://m.media-amazon.com/images/I/91f3RDnnifL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FB3B4552",
        "affiliate": "https://www.amazon.in/dp/B0FB3B4552/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹1,175",
        "rating": "4.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/91sx450HM5L._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FH731NS6",
        "affiliate": "https://www.amazon.in/dp/B0FH731NS6/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹989",
        "rating": "",
        "image": "https://m.media-amazon.com/images/I/81GLgMSVg8L._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FDR5WS6V",
        "affiliate": "https://www.amazon.in/dp/B0FDR5WS6V/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹734",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/91LhoKZw5-L._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FB3138P2",
        "affiliate": "https://www.amazon.in/dp/B0FB3138P2/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹884",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/91f+ZPO1AkL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FDBCGNVJ",
        "affiliate": "https://www.amazon.in/dp/B0FDBCGNVJ/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹718",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/510g4ZBMXCL._AC_UL320_.jpg",
        "asin": "B0FG397Q5T",
        "affiliate": "https://www.amazon.in/dp/B0FG397Q5T/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹880",
        "rating": "4.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/91G9Bkt1f4L._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FH6YZKP6",
        "affiliate": "https://www.amazon.in/dp/B0FH6YZKP6/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS worklyf",
        "price": "₹849",
        "rating": "4.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/915kkesRXYL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FF4Q5B95",
        "affiliate": "https://www.amazon.in/dp/B0FF4Q5B95/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹832",
        "rating": "4.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/91HVj36a3zL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FDR7GYRR",
        "affiliate": "https://www.amazon.in/dp/B0FDR7GYRR/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "Pink Paprika by SASSAFRAS",
        "price": "₹1,183",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/A1Ffefsw8ZL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FF4NGMWY",
        "affiliate": "https://www.amazon.in/dp/B0FF4NGMWY/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹828",
        "rating": "5.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/91Un5SPUwRL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FG3CJVPZ",
        "affiliate": "https://www.amazon.in/dp/B0FG3CJVPZ/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹719",
        "rating": "5.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/91IrR8oYRDL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FGV9FMGN",
        "affiliate": "https://www.amazon.in/dp/B0FGV9FMGN/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "Pink Paprika By SASSAFRAS",
        "price": "₹1,169",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/91OdReHayBL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FLY814J9",
        "affiliate": "https://www.amazon.in/dp/B0FLY814J9/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹835",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/610MIFREhYL._AC_UL320_.jpg",
        "asin": "B0FDR5P1JV",
        "affiliate": "https://www.amazon.in/dp/B0FDR5P1JV/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹1,259",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/91W0lxbfYhL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FG391X9F",
        "affiliate": "https://www.amazon.in/dp/B0FG391X9F/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹420",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/81fD6htFFKL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0B4SPJMMY",
        "affiliate": "https://www.amazon.in/dp/B0B4SPJMMY/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹804",
        "rating": "4.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/51lTTakel-L._AC_UL320_.jpg",
        "asin": "B0FG3BJ56F",
        "affiliate": "https://www.amazon.in/dp/B0FG3BJ56F/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹816",
        "rating": "4.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/81rlhY8rZBL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0F9YY2V5P",
        "affiliate": "https://www.amazon.in/dp/B0F9YY2V5P/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹681",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/91d+1jbZRXL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FDBKKN29",
        "affiliate": "https://www.amazon.in/dp/B0FDBKKN29/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹1,439",
        "rating": "4.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/A1ZGluAFmQL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FH6Z7WTY",
        "affiliate": "https://www.amazon.in/dp/B0FH6Z7WTY/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹734",
        "rating": "",
        "image": "https://m.media-amazon.com/images/I/91LhoKZw5-L._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FB34G8YW",
        "affiliate": "https://www.amazon.in/dp/B0FB34G8YW/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "sassafras",
        "price": "₹899",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/913O4oJIoyL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FHKYBQC7",
        "affiliate": "https://www.amazon.in/dp/B0FHKYBQC7/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹839",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/81B9s3dI6iL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0B393JQ2G",
        "affiliate": "https://www.amazon.in/dp/B0B393JQ2G/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹798",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/A1Sp77BYgXL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FDR6MGNL",
        "affiliate": "https://www.amazon.in/dp/B0FDR6MGNL/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹824",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/A1Bu4vib0UL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0F9Z1W2WS",
        "affiliate": "https://www.amazon.in/dp/B0F9Z1W2WS/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹835",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/91Dcur4FU8L._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FDR6ZWJF",
        "affiliate": "https://www.amazon.in/dp/B0FDR6ZWJF/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹664",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/81vbVarnFmL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0F9Z3YWDJ",
        "affiliate": "https://www.amazon.in/dp/B0F9Z3YWDJ/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹984",
        "rating": "4.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/81ZrLRVbAJL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FDBFW7C1",
        "affiliate": "https://www.amazon.in/dp/B0FDBFW7C1/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹806",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/81vS0xKTzUL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FDB96156",
        "affiliate": "https://www.amazon.in/dp/B0FDB96156/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹858",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/91pt-NKM81L._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FGVD8K2J",
        "affiliate": "https://www.amazon.in/dp/B0FGVD8K2J/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹764",
        "rating": "5.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/91FdOHcIdfL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0F9YYKR7Y",
        "affiliate": "https://www.amazon.in/dp/B0F9YYKR7Y/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹983",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/91di0uusZBL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0F9Z1T1XX",
        "affiliate": "https://www.amazon.in/dp/B0F9Z1T1XX/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹735",
        "rating": "5.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/A1CB5ObA9dL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0F9YZ8LSY",
        "affiliate": "https://www.amazon.in/dp/B0F9YZ8LSY/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹988",
        "rating": "5.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/91U9xmif0WL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FDBBKMJ4",
        "affiliate": "https://www.amazon.in/dp/B0FDBBKMJ4/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹713",
        "rating": "",
        "image": "https://m.media-amazon.com/images/I/81ftQBiNyeL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0F9YYKD32",
        "affiliate": "https://www.amazon.in/dp/B0F9YYKD32/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹1,099",
        "rating": "",
        "image": "https://m.media-amazon.com/images/I/81203BX3LwL._AC_UL320_.jpg",
        "asin": "B0F9YZTW62",
        "affiliate": "https://www.amazon.in/dp/B0F9YZTW62/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹714",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/91vGvy-tQAL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FDR7S1V8",
        "affiliate": "https://www.amazon.in/dp/B0FDR7S1V8/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    
    {
        "title": "SASSAFRAS",
        "price": "₹719",
        "rating": "5.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/91IrR8oYRDL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FGV9FMGN",
        "affiliate": "https://www.amazon.in/dp/B0FGV9FMGN/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹420",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/81fD6htFFKL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0B4SPJMMY",
        "affiliate": "https://www.amazon.in/dp/B0B4SPJMMY/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹858",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/91pt-NKM81L._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FGVD8K2J",
        "affiliate": "https://www.amazon.in/dp/B0FGVD8K2J/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹675",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/81nYKMhqppL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0B4SS6MGH",
        "affiliate": "https://www.amazon.in/dp/B0B4SS6MGH/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS Curve",
        "price": "₹704",
        "rating": "5.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/81Xa3y3DMDL._AC_UL320_.jpg",
        "asin": "B0F9YYPXW9",
        "affiliate": "https://www.amazon.in/dp/B0F9YYPXW9/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹809",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/71LBlp6zj5L._AC_UL320_.jpg",
        "asin": "B0FDBBMRSN",
        "affiliate": "https://www.amazon.in/dp/B0FDBBMRSN/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹479",
        "rating": "4.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/91QSJrFjeyL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0F9YWG66Y",
        "affiliate": "https://www.amazon.in/dp/B0F9YWG66Y/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹479",
        "rating": "",
        "image": "https://m.media-amazon.com/images/I/91QSJrFjeyL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0F9YX8V7Y",
        "affiliate": "https://www.amazon.in/dp/B0F9YX8V7Y/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹545",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/81tiJE51CCL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0B4SQBRM9",
        "affiliate": "https://www.amazon.in/dp/B0B4SQBRM9/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "Shae by SASSAFRAS",
        "price": "₹599",
        "rating": "3.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/81YbqWHSjUL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FGVDQ2N6",
        "affiliate": "https://www.amazon.in/dp/B0FGVDQ2N6/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS Curve",
        "price": "₹747",
        "rating": "5.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/91RSnFYtaRL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FGVHCF25",
        "affiliate": "https://www.amazon.in/dp/B0FGVHCF25/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹588",
        "rating": "3.7 out of 5",
        "image": "https://m.media-amazon.com/images/I/91xqgxpW1nL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FB34HFY9",
        "affiliate": "https://www.amazon.in/dp/B0FB34HFY9/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹559",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/91fxBtEOb6L._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FDBCRPH7",
        "affiliate": "https://www.amazon.in/dp/B0FDBCRPH7/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹809",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/913w220xFAL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FGV9Q1ML",
        "affiliate": "https://www.amazon.in/dp/B0FGV9Q1ML/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹689",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/91+0tPZ5BZL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FGVGNSBW",
        "affiliate": "https://www.amazon.in/dp/B0FGVGNSBW/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹874",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/918HboIezjL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FGVC1T9M",
        "affiliate": "https://www.amazon.in/dp/B0FGVC1T9M/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹704",
        "rating": "",
        "image": "https://m.media-amazon.com/images/I/91PA15B-tbL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0F9YXR35L",
        "affiliate": "https://www.amazon.in/dp/B0F9YXR35L/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹671",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/81mEp6NYudL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0B4SQ2RPP",
        "affiliate": "https://www.amazon.in/dp/B0B4SQ2RPP/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹491",
        "rating": "",
        "image": "https://m.media-amazon.com/images/I/911qBVI2pCL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FGVCMV6F",
        "affiliate": "https://www.amazon.in/dp/B0FGVCMV6F/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹559",
        "rating": "",
        "image": "https://m.media-amazon.com/images/I/91fxBtEOb6L._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FDBDJVYR",
        "affiliate": "https://www.amazon.in/dp/B0FDBDJVYR/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹689",
        "rating": "5.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/91oKqnJS24L._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FGVDKPR5",
        "affiliate": "https://www.amazon.in/dp/B0FGVDKPR5/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹559",
        "rating": "5.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/91cl1RlbR+L._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FDBGYZD1",
        "affiliate": "https://www.amazon.in/dp/B0FDBGYZD1/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹699",
        "rating": "3.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/916AjRDdBgL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0F9YWT954",
        "affiliate": "https://www.amazon.in/dp/B0F9YWT954/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS Curve",
        "price": "₹798",
        "rating": "5.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/91eojtFJeHL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FGVD5HS9",
        "affiliate": "https://www.amazon.in/dp/B0FGVD5HS9/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹559",
        "rating": "5.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/91fxBtEOb6L._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FDBF4Z3C",
        "affiliate": "https://www.amazon.in/dp/B0FDBF4Z3C/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹546",
        "rating": "5.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/91qldKgV2YL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0F9YYQ3NT",
        "affiliate": "https://www.amazon.in/dp/B0F9YYQ3NT/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS Curve",
        "price": "₹798",
        "rating": "5.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/919xxGY7BiL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FF4PJST2",
        "affiliate": "https://www.amazon.in/dp/B0FF4PJST2/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "Shae by SASSAFRAS",
        "price": "₹601",
        "rating": "3.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/81Je0QuZi4L._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FGVHYQGV",
        "affiliate": "https://www.amazon.in/dp/B0FGVHYQGV/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "Shae by SASSAFRAS",
        "price": "₹645",
        "rating": "5.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/91UHz66yqWL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FGVCQS3F",
        "affiliate": "https://www.amazon.in/dp/B0FGVCQS3F/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹781",
        "rating": "5.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/91HYIwvvSpL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0GS5QKFJ6",
        "affiliate": "https://www.amazon.in/dp/B0GS5QKFJ6/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS Curve",
        "price": "₹467",
        "rating": "5.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/91xS87veuYL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FGVGHB91",
        "affiliate": "https://www.amazon.in/dp/B0FGVGHB91/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS worklyf",
        "price": "₹751",
        "rating": "5.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/91O8696QzcL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FGVCZB8P",
        "affiliate": "https://www.amazon.in/dp/B0FGVCZB8P/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹485",
        "rating": "5.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/81BTZf1FZUL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FGVCX3Y8",
        "affiliate": "https://www.amazon.in/dp/B0FGVCX3Y8/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹435",
        "rating": "5.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/91ZV9yYDEEL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FDBH6BDX",
        "affiliate": "https://www.amazon.in/dp/B0FDBH6BDX/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "Shae by SASSAFRAS",
        "price": "₹791",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/91SC1Xq0qdL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FGVFKWLR",
        "affiliate": "https://www.amazon.in/dp/B0FGVFKWLR/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹559",
        "rating": "3.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/91fxBtEOb6L._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FDBGMBPQ",
        "affiliate": "https://www.amazon.in/dp/B0FDBGMBPQ/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹737",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/91IgfLBAsUL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FGVGBYR6",
        "affiliate": "https://www.amazon.in/dp/B0FGVGBYR6/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹653",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/91QfiLFjbXL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FGV9LW3H",
        "affiliate": "https://www.amazon.in/dp/B0FGV9LW3H/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹719",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/91irU1uIQGL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FDBD2DDH",
        "affiliate": "https://www.amazon.in/dp/B0FDBD2DDH/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "Shae by SASSAFRAS",
        "price": "₹749",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/919pbiHacyL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FGVDNX35",
        "affiliate": "https://www.amazon.in/dp/B0FGVDNX35/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS Curve",
        "price": "₹764",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/91bFgxZo7aL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FGVFKQRN",
        "affiliate": "https://www.amazon.in/dp/B0FGVFKQRN/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹604",
        "rating": "3.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/A1Jy5qKFRBL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FDBDNJXB",
        "affiliate": "https://www.amazon.in/dp/B0FDBDNJXB/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "Shae by SASSAFRAS",
        "price": "₹773",
        "rating": "3.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/91WqnVc-PJL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FGVCZPPH",
        "affiliate": "https://www.amazon.in/dp/B0FGVCZPPH/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹791",
        "rating": "3.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/61mtDapwO4L._AC_UL320_.jpg",
        "asin": "B0F9YZZB6W",
        "affiliate": "https://www.amazon.in/dp/B0F9YZZB6W/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹439",
        "rating": "3.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/91CSPelCBxL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FDR6Y6FD",
        "affiliate": "https://www.amazon.in/dp/B0FDR6Y6FD/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹899",
        "rating": "",
        "image": "https://m.media-amazon.com/images/I/71SmU4h0JtL._AC_UL320_.jpg",
        "asin": "B0GWZP9WR1",
        "affiliate": "https://www.amazon.in/dp/B0GWZP9WR1/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "Shae by SASSAFRAS",
        "price": "₹749",
        "rating": "",
        "image": "https://m.media-amazon.com/images/I/81wfxLqwkdL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FGVFSB42",
        "affiliate": "https://www.amazon.in/dp/B0FGVFSB42/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS BASICS",
        "price": "₹749",
        "rating": "",
        "image": "https://m.media-amazon.com/images/I/91NjAzADO5L._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0GMXKKDHG",
        "affiliate": "https://www.amazon.in/dp/B0GMXKKDHG/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    
    {
        "title": "SASSAFRAS",
        "price": "₹988",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/61XkuV3t0OL._AC_UL320_.jpg",
        "asin": "B0FDBCWQ31",
        "affiliate": "https://www.amazon.in/dp/B0FDBCWQ31/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹839",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/91xKMwh0cLL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FG3BRCFG",
        "affiliate": "https://www.amazon.in/dp/B0FG3BRCFG/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹734",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/91LhoKZw5-L._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FB3138P2",
        "affiliate": "https://www.amazon.in/dp/B0FB3138P2/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹884",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/91f+ZPO1AkL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FDBCGNVJ",
        "affiliate": "https://www.amazon.in/dp/B0FDBCGNVJ/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹718",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/510g4ZBMXCL._AC_UL320_.jpg",
        "asin": "B0FG397Q5T",
        "affiliate": "https://www.amazon.in/dp/B0FG397Q5T/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS worklyf",
        "price": "₹849",
        "rating": "4.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/915kkesRXYL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FF4Q5B95",
        "affiliate": "https://www.amazon.in/dp/B0FF4Q5B95/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "Pink Paprika by SASSAFRAS",
        "price": "₹1,183",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/A1Ffefsw8ZL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FF4NGMWY",
        "affiliate": "https://www.amazon.in/dp/B0FF4NGMWY/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹828",
        "rating": "5.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/91Un5SPUwRL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FG3CJVPZ",
        "affiliate": "https://www.amazon.in/dp/B0FG3CJVPZ/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "Pink Paprika By SASSAFRAS",
        "price": "₹1,169",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/91OdReHayBL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FLY814J9",
        "affiliate": "https://www.amazon.in/dp/B0FLY814J9/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹1,259",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/91W0lxbfYhL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FG391X9F",
        "affiliate": "https://www.amazon.in/dp/B0FG391X9F/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹804",
        "rating": "4.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/51lTTakel-L._AC_UL320_.jpg",
        "asin": "B0FG3BJ56F",
        "affiliate": "https://www.amazon.in/dp/B0FG3BJ56F/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹816",
        "rating": "4.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/81rlhY8rZBL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0F9YY2V5P",
        "affiliate": "https://www.amazon.in/dp/B0F9YY2V5P/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹734",
        "rating": "",
        "image": "https://m.media-amazon.com/images/I/91LhoKZw5-L._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FB34G8YW",
        "affiliate": "https://www.amazon.in/dp/B0FB34G8YW/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹839",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/81B9s3dI6iL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0B393JQ2G",
        "affiliate": "https://www.amazon.in/dp/B0B393JQ2G/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹824",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/A1Bu4vib0UL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0F9Z1W2WS",
        "affiliate": "https://www.amazon.in/dp/B0F9Z1W2WS/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹664",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/81vbVarnFmL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0F9Z3YWDJ",
        "affiliate": "https://www.amazon.in/dp/B0F9Z3YWDJ/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹806",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/81vS0xKTzUL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FDB96156",
        "affiliate": "https://www.amazon.in/dp/B0FDB96156/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹983",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/91di0uusZBL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0F9Z1T1XX",
        "affiliate": "https://www.amazon.in/dp/B0F9Z1T1XX/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹735",
        "rating": "5.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/A1CB5ObA9dL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0F9YZ8LSY",
        "affiliate": "https://www.amazon.in/dp/B0F9YZ8LSY/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹988",
        "rating": "5.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/91U9xmif0WL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FDBBKMJ4",
        "affiliate": "https://www.amazon.in/dp/B0FDBBKMJ4/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹713",
        "rating": "",
        "image": "https://m.media-amazon.com/images/I/81ftQBiNyeL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0F9YYKD32",
        "affiliate": "https://www.amazon.in/dp/B0F9YYKD32/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹1,099",
        "rating": "",
        "image": "https://m.media-amazon.com/images/I/81203BX3LwL._AC_UL320_.jpg",
        "asin": "B0F9YZTW62",
        "affiliate": "https://www.amazon.in/dp/B0F9YZTW62/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹714",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/91vGvy-tQAL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FDR7S1V8",
        "affiliate": "https://www.amazon.in/dp/B0FDR7S1V8/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹832",
        "rating": "4.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/91cpDizzvPL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0F9Z14HBD",
        "affiliate": "https://www.amazon.in/dp/B0F9Z14HBD/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹809",
        "rating": "4.7 out of 5",
        "image": "https://m.media-amazon.com/images/I/8105Y29jRKL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FG3G71XY",
        "affiliate": "https://www.amazon.in/dp/B0FG3G71XY/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹699",
        "rating": "4.7 out of 5",
        "image": "https://m.media-amazon.com/images/I/71lHGNNdGKL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0B393FM8M",
        "affiliate": "https://www.amazon.in/dp/B0B393FM8M/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS Curve",
        "price": "₹849",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/91jLwZSOZ2L._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FF4PWX48",
        "affiliate": "https://www.amazon.in/dp/B0FF4PWX48/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹811",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/A15Ndwuo34L._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0F9Z1ZXVK",
        "affiliate": "https://www.amazon.in/dp/B0F9Z1ZXVK/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹683",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/91rzi2V5XOL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FDB95FZB",
        "affiliate": "https://www.amazon.in/dp/B0FDB95FZB/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹999",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/91SDqgavkxL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FG3DSBQS",
        "affiliate": "https://www.amazon.in/dp/B0FG3DSBQS/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "Shae by SASSAFRAS",
        "price": "₹999",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/81cxUh0ZKRL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FG3CX1KH",
        "affiliate": "https://www.amazon.in/dp/B0FG3CX1KH/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹965",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/91zoXWrMqTL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FDBD8PZ7",
        "affiliate": "https://www.amazon.in/dp/B0FDBD8PZ7/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹1,049",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/A1UAzeFYOKL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0F9FBW53M",
        "affiliate": "https://www.amazon.in/dp/B0F9FBW53M/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹718",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/813Y4IZCwwL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FG3CSCVY",
        "affiliate": "https://www.amazon.in/dp/B0FG3CSCVY/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹833",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/81yfNy-Ok4L._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FG3CQD5X",
        "affiliate": "https://www.amazon.in/dp/B0FG3CQD5X/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS Curve",
        "price": "₹1,079",
        "rating": "4.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/81N59xxnxpL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FG3CC73K",
        "affiliate": "https://www.amazon.in/dp/B0FG3CC73K/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹1,349",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/91KKjk8-a5L._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FG39STB1",
        "affiliate": "https://www.amazon.in/dp/B0FG39STB1/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS BASICS",
        "price": "₹899",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/61XI-XndAbL._AC_UL320_.jpg",
        "asin": "B0F9YX989P",
        "affiliate": "https://www.amazon.in/dp/B0F9YX989P/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS Curve",
        "price": "₹874",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/81drzFRIG9L._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0F9YZSZLK",
        "affiliate": "https://www.amazon.in/dp/B0F9YZSZLK/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹988",
        "rating": "5.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/91U9xmif0WL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FDBFVGV7",
        "affiliate": "https://www.amazon.in/dp/B0FDBFVGV7/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹1,099",
        "rating": "5.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/91mi6LoLskL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FG3DJY34",
        "affiliate": "https://www.amazon.in/dp/B0FG3DJY34/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹713",
        "rating": "5.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/91GC2byCLsL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0F9Z1P6Q9",
        "affiliate": "https://www.amazon.in/dp/B0F9Z1P6Q9/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹781",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/81P2JN4dc7L._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0F9YZFPWL",
        "affiliate": "https://www.amazon.in/dp/B0F9YZFPWL/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹719",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/91rXFmNT65L._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FG3FC4R4",
        "affiliate": "https://www.amazon.in/dp/B0FG3FC4R4/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹1,151",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/A1AB9L1GWaL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FDBC2QLZ",
        "affiliate": "https://www.amazon.in/dp/B0FDBC2QLZ/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹1,049",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/A1UAzeFYOKL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0F9F8BSBQ",
        "affiliate": "https://www.amazon.in/dp/B0F9F8BSBQ/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS",
        "price": "₹646",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/912r8kWR7iL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FDBC671D",
        "affiliate": "https://www.amazon.in/dp/B0FDBC671D/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    {
        "title": "SASSAFRAS worklyf",
        "price": "₹699",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/81EJjnHYYqL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0F9YYFQ7Y",
        "affiliate": "https://www.amazon.in/dp/B0F9YYFQ7Y/?tag=mydeals03c-21",
        "category": "Fashion"
    },
    
    {
        "title": "Aquaguard Water Softener Regeneration Media Salt (10 Kg) | 5-IN-1 BENEFIT | CERTIFIED DUST FREE 99.9% PURE",
        "price": "₹350",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/61Ef2slEPKL._AC_UY218_.jpg",
        "asin": "B0D7HRMLMP",
        "affiliate": "https://www.amazon.in/dp/B0D7HRMLMP/?tag=mydeals03c-21",
        "category": "Home Decor"
    },
    {
        "title": "Blue Star BL1HPCGA Bottom Loading Water Dispenser | 3 Faucets, Hot, Cold & Ambient Water, LED Display, Child Lock (Black)",
        "price": "₹16,500",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/61KmokBty8L._AC_UY218_.jpg",
        "asin": "B0F1T9CXV9",
        "affiliate": "https://www.amazon.in/dp/B0F1T9CXV9/?tag=mydeals03c-21",
        "category": "Home Decor"
    },
    {
        "title": "Zolmix® Over Washing Machine Storage Rack Bathroom Storage Stand | Washing Machine Shelf Stand with Hooks, Laundry Storage Rack Organizer, Space Saving Bathroom Shelf Over Washer Cabinet Rack.",
        "price": "₹1,599",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/71TGUDBPU8L._AC_UY218_.jpg",
        "asin": "B0GJZL8VT8",
        "affiliate": "https://www.amazon.in/dp/B0GJZL8VT8/?tag=mydeals03c-21",
        "category": "Home Decor"
    },
    {
        "title": "Xtend Stainless Steel Sink Strainer Kitchen Drain Basin Basket Filter Stopper Drainer/Jali (11cm / Size 3)",
        "price": "₹99",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/51MNIhtsBYS._AC_UY218_.jpg",
        "asin": "B08Z3JD4G5",
        "affiliate": "https://www.amazon.in/dp/B08Z3JD4G5/?tag=mydeals03c-21",
        "category": "Home Decor"
    },
    {
        "title": "Purifit Hard Water Tap & Shower Filter for Bathroom Version 2 | Anti Hair Fall, Dry Skin & Frizz Control | Chlorine Removal Water Filter | Universal Fit",
        "price": "₹999",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/51aGSa+FqqL._AC_UY218_.jpg",
        "asin": "B0CBRHDQ55",
        "affiliate": "https://www.amazon.in/dp/B0CBRHDQ55/?tag=mydeals03c-21",
        "category": "Home Decor"
    },
    {
        "title": "Avimee Herbal Instant Water Softener | Makes Your Water Hair & Skin Friendly | Reduces Hair Fall & Skin Itching |Disables Hardness & Maintains pH Level | Non Toxic & 100% Safe (400ml each (Pack of 3))",
        "price": "₹999",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/81u+DDZSJBL._AC_UY218_.jpg",
        "asin": "B0GF7LFSJ5",
        "affiliate": "https://www.amazon.in/dp/B0GF7LFSJ5/?tag=mydeals03c-21",
        "category": "Home Decor"
    },
    {
        "title": "Automatic Water Dispenser Pump for 20 Litre Bottle | Big Battery - Portable C Type USB Rechargeable Water Pump Dispenser for Home, Office | 1 Year Warranty, White",
        "price": "₹369",
        "rating": "4.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/71NBma6IfHL._AC_UY218_.jpg",
        "asin": "B0FPRNQ21M",
        "affiliate": "https://www.amazon.in/dp/B0FPRNQ21M/?tag=mydeals03c-21",
        "category": "Home Decor"
    },
    {
        "title": "TEKCOOL Bathroom Organiser, Self Adhesive Bathroom Shelf for Wall, Washroom Organizer, Bathroom Rack Stand Without Drilling (1 Pcs),Plastic",
        "price": "₹149",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/61z9TgxkjBL._AC_UY218_.jpg",
        "asin": "B0GBXC1S8N",
        "affiliate": "https://www.amazon.in/dp/B0GBXC1S8N/?tag=mydeals03c-21",
        "category": "Home Decor"
    },
    {
        "title": "SquareUp Self-Adhesive Wall-Mount ABS Plastic Bathroom Corner Shelf Rack Organizer Without Drill Storage Shelves Holder/Accessories (Black, Pack of 2)",
        "price": "₹299",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/91GZemHHz2L._AC_UY218_.jpg",
        "asin": "B0GQ46NW41",
        "affiliate": "https://www.amazon.in/dp/B0GQ46NW41/?tag=mydeals03c-21",
        "category": "Home Decor"
    },
    {
        "title": "Health Faucet Stainless Steel Jet Spray Gun for Toilet | Silver & Copper Ion Shield Kills 99% Germs | Leak-Proof Bathroom 1 Year Warranty (Jet Spray Only)",
        "price": "₹301",
        "rating": "4.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/71xY1lcGCIL._AC_UY218_.jpg",
        "asin": "B0FT4WTQD8",
        "affiliate": "https://www.amazon.in/dp/B0FT4WTQD8/?tag=mydeals03c-21",
        "category": "Home Decor"
    },
    {
        "title": "Pack of 1 Travel Soap Holder - Portable Soap Dish for Home, Outdoor Hiking, and Camping - Compact and Durable Plastic Travel Soap Box - Soap Case Ideal for Travel Accessories (1)",
        "price": "₹139",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/511AOO6MMgL._AC_UY218_.jpg",
        "asin": "B0DNWM5BLH",
        "affiliate": "https://www.amazon.in/dp/B0DNWM5BLH/?tag=mydeals03c-21",
        "category": "Home Decor"
    },
    {
        "title": "Manual Drinking Water Pump Dispenser for 20 to 25 Litre Bottles | Hand Press Plastic Water Can Pump for Home Office Camping | Easy Fit Vacuum Action Water Dispenser -Multicolour",
        "price": "₹189",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/513wWPYdayL._AC_UY218_.jpg",
        "asin": "B0GTLFJLXV",
        "affiliate": "https://www.amazon.in/dp/B0GTLFJLXV/?tag=mydeals03c-21",
        "category": "Home Decor"
    },
    {
        "title": "DALUCI Bathroom Shelf Without Drill for Wall | Self Adhesive Bathroom Organiser | Wall Mounted Bathroom Shelves Rack | Strong Adhesive Storage Organizer Stand (Black, Pack of 2)",
        "price": "₹599",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/81OBsn26D+L._AC_UY218_.jpg",
        "asin": "B0GW2GG1GG",
        "affiliate": "https://www.amazon.in/dp/B0GW2GG1GG/?tag=mydeals03c-21",
        "category": "Home Decor"
    },
    {
        "title": "TIP DISH WASH KIT (DIY KIT 10 LITER) Dish Cleaning Gel (GENERAL, 10 L) dish wash MIX Dish wash Gel Making Kit",
        "price": "₹590",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/71PB4V76coL._AC_UY218_.jpg",
        "asin": "B0FCS9J2V2",
        "affiliate": "https://www.amazon.in/dp/B0FCS9J2V2/?tag=mydeals03c-21",
        "category": "Home Decor"
    },
    {
        "title": "MorivaHomes Self Adhesive Bathroom Shelf for Wall Shelf Organizer Wall Mounted Bathroom Shelves Rack Holder Stand for Bathroom Accessories Organiser Without Drill (Black, Pack of 2)",
        "price": "₹298",
        "rating": "3.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/611JQD3ITkL._AC_UY218_.jpg",
        "asin": "B0G7ZT2QG6",
        "affiliate": "https://www.amazon.in/dp/B0G7ZT2QG6/?tag=mydeals03c-21",
        "category": "Home Decor"
    },
    {
        "title": "Plastic Water Dispenser Bottle - Blue Color 20L, 20 Liter Mineral Water Dispensers Jar | Drinking Water Can | Big Water Bottle BPA Free Water Bottle Large Container With Thread Cap (BLUE) Pack of 1",
        "price": "₹399",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/41T3ahDXgrL._AC_UY218_.jpg",
        "asin": "B0GNMNHKKH",
        "affiliate": "https://www.amazon.in/dp/B0GNMNHKKH/?tag=mydeals03c-21",
        "category": "Home Decor"
    },
    
    {
        "title": "The Attic INES Kitchen Cabinet, Multipurpose Cabinet for Bedroom Living Room Study bar, Solid Wood Bookshelf/Kitchen Cabinet, Solid Mango Wood, Walnut Matte Finish",
        "price": "₹18,706",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/71aPq46Ps4L._AC_UL320_.jpg",
        "asin": "B0DGTHWF5G",
        "affiliate": "https://www.amazon.in/dp/B0DGTHWF5G/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "Modern Round Floating Wall Shelf - 13 Inch Black Iron & Wood Decorative Wall Mount Display Rack for Home Decor Set of 2",
        "price": "₹1,349",
        "rating": "",
        "image": "https://m.media-amazon.com/images/I/61n4F5HQd2L._AC_UL320_.jpg",
        "asin": "B0GWJS6ZJB",
        "affiliate": "https://www.amazon.in/dp/B0GWJS6ZJB/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "Icon TV Entertainment Unit with Elevated Soundbar Shelf & Storage Cabinet, Modern Media Console for Living Room up to 55 Inch TV, 140x40x64cm (Dark Oak & White)",
        "price": "₹4,949",
        "rating": "",
        "image": "https://m.media-amazon.com/images/I/815qUntk82L._AC_UL320_.jpg",
        "asin": "B0GP2W1WNX",
        "affiliate": "https://www.amazon.in/dp/B0GP2W1WNX/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "Callas ST-40 Wooden Study Table with Hutch & Bottom Storage – Multi-Purpose Office Desk for Laptop, Computer, Writing & Study – Durable Engineered Wood Workstation for Home & Office (White, ST-40)",
        "price": "₹2,649",
        "rating": "3.7 out of 5",
        "image": "https://m.media-amazon.com/images/I/91oRTxJO6bL._AC_UL320_.jpg",
        "asin": "B0F3XJJ1ZF",
        "affiliate": "https://www.amazon.in/dp/B0F3XJJ1ZF/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "Sheesham Wood Bedside End Table for Living Room (Walnut Finish)",
        "price": "₹4,394",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/61wXK2mO4bL._AC_UL320_.jpg",
        "asin": "B07R17DTNS",
        "affiliate": "https://www.amazon.in/dp/B07R17DTNS/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "Kunjal Furniture Solid Sheesham Wood Sofa Cum Bed with Storage for Living Room | 3-Seater Convertible Sofa Bed | Handmade Wooden Furniture (Walnut, Cane)",
        "price": "₹34,495",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/71pZDkfK5JL._AC_UL320_.jpg",
        "asin": "B0GG53S4FP",
        "affiliate": "https://www.amazon.in/dp/B0GG53S4FP/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "Sheesham Wood Nesting Tables Set of 3 Stools (Honey Finish)",
        "price": "₹4,496",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/7186tgkq0eL._AC_UL320_.jpg",
        "asin": "B07R17DZNY",
        "affiliate": "https://www.amazon.in/dp/B07R17DZNY/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "Luxurious Royal Roynd Bed with 2 Huge Side Dressing Table in Teak Wood Having Premium Antique Finish| Maharaja Style Round Bed Luxury Bedroom Furniture",
        "price": "₹8,00,000",
        "rating": "",
        "image": "https://m.media-amazon.com/images/I/71ZWd5aX6gL._AC_UL320_.jpg",
        "asin": "B0DQWFLNYY",
        "affiliate": "https://www.amazon.in/dp/B0DQWFLNYY/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "Contemporary Sheesham Wood Half Moon Bedside Table for Bedroom & Office (Teak) (76x39x71 cm)",
        "price": "₹4,097",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/51SU3E2HhhL._AC_UL320_.jpg",
        "asin": "B0DBM153RG",
        "affiliate": "https://www.amazon.in/dp/B0DBM153RG/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "DaneWood - 3-Person Sofa Set for Living Room, Drawing Room & Office Lounge|Capacity - Three Seater, Sheesham Wood, Dark Brown Finish",
        "price": "₹16,992",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/51b2Z0ImOdL._AC_UL320_.jpg",
        "asin": "B0B3MV7WJ7",
        "affiliate": "https://www.amazon.in/dp/B0B3MV7WJ7/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "4+1 Outdoor Indoor Patio Furniture Sets Rattan Chair, Wicker Conversation Set Poolside Lawn Chairs Swingarea Balcony Garden Furniture (White & Orange Cushion) 50x50x66 Cm",
        "price": "₹15,915",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/61OrC9MxHcL._AC_UL320_.jpg",
        "asin": "B0BLCMLH9V",
        "affiliate": "https://www.amazon.in/dp/B0BLCMLH9V/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "Solid Sheesham Wood 5 Seater Sofa Set | Multipurpose Wooden 3+1+1 Seater Lounge Sofa Set Furniture for Living Room, Home and Office (Honey Finish)",
        "price": "₹24,999",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/61MjD4yeLxL._AC_UL320_.jpg",
        "asin": "B0GHQB62C1",
        "affiliate": "https://www.amazon.in/dp/B0GHQB62C1/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "Nilkamal Freedom Big FMM Plastic Cabinet | 3-Year Warranty | 4-Shelf Storage Cupboard with Doors | Multi Organiser for Home, Wardrobe, and Kitchen | Clothes Rack, Shelves, Brown & Biscuit Colour",
        "price": "₹5,910",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/61oxcYAz6oL._AC_UL320_.jpg",
        "asin": "B01BY6ZOQI",
        "affiliate": "https://www.amazon.in/dp/B01BY6ZOQI/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "Wooden Queen Size Bed Without Storage - Solid Wood Queen Cot - 12 Month Warranty - Stylish Bedroom Furniture(Queen, Aelina, Honey Finish)",
        "price": "₹21,199",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/714QFjZWBzL._AC_UL320_.jpg",
        "asin": "B0CBKJ8PL3",
        "affiliate": "https://www.amazon.in/dp/B0CBKJ8PL3/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "Nilkamal Breeze 2 Seater Balcony Sofa set with Square Center Table with Toughened Glass|Indoor & Outdoor Furniture|Patio Chair Two Seater, Perfect for Gardens,Restaurants,Terraces, Weathered Brown",
        "price": "₹10,000",
        "rating": "3.7 out of 5",
        "image": "https://m.media-amazon.com/images/I/81wsC6ghLcL._AC_UL320_.jpg",
        "asin": "B0BSLNRDSF",
        "affiliate": "https://www.amazon.in/dp/B0BSLNRDSF/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "Amazon Brand - Solimo Petra Solid Sheesham Wood King Bed (Teak Finish)",
        "price": "₹16,000",
        "rating": "3.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/71hI+XoAYPL._AC_UL320_.jpg",
        "asin": "B08QT7FH84",
        "affiliate": "https://www.amazon.in/dp/B08QT7FH84/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "SONA ART & CRAFTS Kuber Solid Sheesham Wood Bedroom Set | King Size Bed Without Storage, Wardrobe, Chest of Drawer & Two Bedside Tables - Walnut Finish (Assembly Included)",
        "price": "₹74,299",
        "rating": "4.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/81uQsUVVG9L._AC_UL320_.jpg",
        "asin": "B0F26HTCF4",
        "affiliate": "https://www.amazon.in/dp/B0F26HTCF4/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "LOCCUS 4-Piece Outdoor & Indoor Rope Sofa Set with Waterproof Cushions – Patio, Garden, Balcony, Lawn, Terrace Conversation & Bistro Furniture, Durable Woven Rattan Lounge Set [Grey & Blue]",
        "price": "₹28,499",
        "rating": "4.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/61lYeTndDlL._AC_UL320_.jpg",
        "asin": "B0BVVD3S4D",
        "affiliate": "https://www.amazon.in/dp/B0BVVD3S4D/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "ANGEL FURNITURE Sheesham Wood Kitchen Cabinet, 72 inch Height, Glass Doors, 3 Drawers, Mandala Design, Natural Brown (Honey Finish)",
        "price": "₹62,490",
        "rating": "",
        "image": "https://m.media-amazon.com/images/I/61AhcnKX58L._AC_UL320_.jpg",
        "asin": "B0FHWWQX2X",
        "affiliate": "https://www.amazon.in/dp/B0FHWWQX2X/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "Amazon Brand - Solimo Kaya Braid & Rope Garden Seater Sofa Set with Cushions and Center Table | Patio Conversation Furniture | Ideal for Outdoor, Balcony, Living Area (4 Seater - Grey)",
        "price": "₹26,949",
        "rating": "5.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/81gLMQ1zmqL._AC_UL320_.jpg",
        "asin": "B0GNST3WZX",
        "affiliate": "https://www.amazon.in/dp/B0GNST3WZX/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "Wisteria Lane Outdoor Patio Furniture Sets, 4 Piece Aluminum Sectional Sofa, White Metal Conversation Set with Grey Cushions",
        "price": "₹37,382",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/81cV-JuKbTL._AC_UL320_.jpg",
        "asin": "B088BTFT9Q",
        "affiliate": "https://www.amazon.in/dp/B088BTFT9Q/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "Torque - Moscow 5 Seater (Light Brown) Corner Fabric L Shape Sofa with Ottoman for Living Room,Bedroom,Office Furniture,1 Year Warranty",
        "price": "₹33,999",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/61LAglmlrlL._AC_UL320_.jpg",
        "asin": "B0G39TMSWQ",
        "affiliate": "https://www.amazon.in/dp/B0G39TMSWQ/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "Ottoman Velvet Cover for Pouffe Footrest Pouf Vanity Stool & Round Seating, Stretchable Elastic Slipcover Soft Washable Sitting Stool Furniture Protector 17 x 17 x 19-inch",
        "price": "₹149",
        "rating": "",
        "image": "https://m.media-amazon.com/images/I/71Oqq+VeMSL._AC_UL320_.jpg",
        "asin": "B0H1SQKGT7",
        "affiliate": "https://www.amazon.in/dp/B0H1SQKGT7/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "Ganpati Arts Solid Sheesham Wood Swift Bunk Bed Twin Over Bed with Ladder Wooden Bunk Bed with 2 Drawer Storage for Bedroom Living Room Home (Teak Finish)",
        "price": "₹33,999",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/81MTT7r5sSL._AC_UL320_.jpg",
        "asin": "B0CZN8YF1P",
        "affiliate": "https://www.amazon.in/dp/B0CZN8YF1P/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "Sheesham Wood Jali Coffee Table for Living Room Home | Wooden Cane Centre Table | RattanTeapoy Table with 2 Drawers Storage for Office and Hotels (Natural Finish, Standard) (Bohemian)",
        "price": "₹10,249",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/71N1I48Q9ML._AC_UL320_.jpg",
        "asin": "B0FGHW1WL5",
        "affiliate": "https://www.amazon.in/dp/B0FGHW1WL5/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "DEVOKO 8 Seater Outdoor Dining Set All-Weather Garden Dining Set Furniture with Cushioned Chair and Table for Indoor, Terrace, Garden (White & Dark Grey) Table Without Glass Top",
        "price": "₹77,999",
        "rating": "5.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/712s3cYd+pL._AC_UL320_.jpg",
        "asin": "B0CV9HN69C",
        "affiliate": "https://www.amazon.in/dp/B0CV9HN69C/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "Sheesham Wood Honey Finish Nesting Table Stool -Set of 3 Stools",
        "price": "₹4,396",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/61mRgUbp7hL._AC_UL320_.jpg",
        "asin": "B07TFFFYBZ",
        "affiliate": "https://www.amazon.in/dp/B07TFFFYBZ/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "Mamta Furniture Solid Sheesham Wood 5 Seater Sofa Set (3+1+1) with Coffee Table | Wooden Furniture with 40 Density Cushions for Living Room",
        "price": "₹33,683",
        "rating": "",
        "image": "https://m.media-amazon.com/images/I/81Z2ZXZBgJL._AC_UL320_.jpg",
        "asin": "B0FPBWBT5B",
        "affiliate": "https://www.amazon.in/dp/B0FPBWBT5B/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "LOCCUS Outdoor 6 Seater Rope Patio Furniture Sofa Set with Center Table and Side Table for Balcony, Terrace, Garden, and Backyard, Poolside All-Weather Rope Conversation Set (Grey)",
        "price": "₹45,599",
        "rating": "5.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/81iFkMGU1JL._AC_UL320_.jpg",
        "asin": "B0GN8XNTHQ",
        "affiliate": "https://www.amazon.in/dp/B0GN8XNTHQ/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "GateWay Furniture Solid Sheesham Wood Wooden Chest of Drawers with 4-Drawer Storage (Asher, Walnut Finish)",
        "price": "₹12,499",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/71aBxoGEKnL._AC_UL320_.jpg",
        "asin": "B0C1H122R2",
        "affiliate": "https://www.amazon.in/dp/B0C1H122R2/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "Sheesham Wood Floor Standing Shelf | Corner Shelf for Living Room | Wooden Corner 5 Tier Ladder Shelves | Corner Home Decor Bookcase | Corner Shelf for Office | Honey Oak Finish",
        "price": "₹4,798",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/51q+efIBCnL._AC_UL320_.jpg",
        "asin": "B0BN8TPCQ9",
        "affiliate": "https://www.amazon.in/dp/B0BN8TPCQ9/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "Nilkamal Freedom Large 18 (FMSC18) Shoe Rack Plastic Cabinet with Dustproof Door – Shoe Rack for Home, Chappal Stand for Home Indoor & Outdoor, Shoes Rack Plastic with Door (Weather Brown)",
        "price": "₹5,790",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/71DJBriPL8L._AC_UL320_.jpg",
        "asin": "B0DQ7MB81V",
        "affiliate": "https://www.amazon.in/dp/B0DQ7MB81V/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "4+1 Wicker Patio Furniture Set Outdoor Table & Chair for Garden|All-Wheather, UV-Protecte, Rust Free-Frame|Style & Durable Design (Brown)",
        "price": "₹16,999",
        "rating": "2.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/619lIkuIE0L._AC_UL320_.jpg",
        "asin": "B0GSVHN8FG",
        "affiliate": "https://www.amazon.in/dp/B0GSVHN8FG/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "FURNEASER Cabiar Wall Mount TV Unit for Living Room Wooden Entertainment Center with Storage Shelves Modern TV Panel Stand Showcase for up to 55 Inch Media Console Cabinet Wenge & White",
        "price": "₹6,109",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/51NyCPmAn+L._AC_UL320_.jpg",
        "asin": "B0DGQMZND5",
        "affiliate": "https://www.amazon.in/dp/B0DGQMZND5/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "BLUEWUD Skiddo Engineered Wood TV Entertainment Unit Set Top Box Stand/TV Cabinet with Shelves for Books & Décor Display Unit Bed Living Room Upto 55 Inches - DIY (Brown Maple & White)",
        "price": "₹5,799",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/81qGQQoaXcL._AC_UL320_.jpg",
        "asin": "B0CJLRT2TR",
        "affiliate": "https://www.amazon.in/dp/B0CJLRT2TR/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "HAUS OF BARS Model V Premium Smart Home Bar Cabinet with Built in Fridge (Gold Lattice Stainless Steel)",
        "price": "₹99,999",
        "rating": "5.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/81cTaP7eGLL._AC_UL320_.jpg",
        "asin": "B0D4DYLR23",
        "affiliate": "https://www.amazon.in/dp/B0D4DYLR23/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "DEVOKO Outdoor 4 Seater Rope Sofa Conversation Set with Comfortable All Weather Water-Resistant Cushions and Glass Top Round Center Table for Garden,Patio,Poolside(Light Grey & Dark Grey)",
        "price": "₹29,999",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/81Q6dGQjW5L._AC_UL320_.jpg",
        "asin": "B0FB4677KV",
        "affiliate": "https://www.amazon.in/dp/B0FB4677KV/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "Fabrique Hembrella 6-Seater L-Shape Suede Fabric Sofa Set With Ottoman (Rhs) | Modern, Luxurious, And Comfortable Furniture For Home Office, Guests, And Living Room | Pebble Grey, 6 Seater",
        "price": "₹60,950",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/71NPDzbCB0L._AC_UL320_.jpg",
        "asin": "B0B5YF93HL",
        "affiliate": "https://www.amazon.in/dp/B0B5YF93HL/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "Kunjal Furniture Premium Solid Sheesham Wood Double Bunk Bed with 2-Drawer Storage – Kids Bed with Ladder and Guardrails (Natural Finish) (Walnut, Laddu Gopal)",
        "price": "₹1",
        "rating": "5.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/31PoBokB-2L._AC_UL320_.jpg",
        "asin": "B0F3QHLC1L",
        "affiliate": "https://www.amazon.in/dp/B0F3QHLC1L/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "Sheesham Wood Bedside Table Solid Wooden Drawer & Shelf Storage Bed Side End Tables Night Stand Furniture for Home Living Room Bedroom - Teak Finish",
        "price": "₹2,899",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/71eKpPDdL3L._AC_UL320_.jpg",
        "asin": "B07THJZKX2",
        "affiliate": "https://www.amazon.in/dp/B07THJZKX2/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "George Dining Table",
        "price": "₹89,999",
        "rating": "",
        "image": "https://m.media-amazon.com/images/I/71GnpU5JS5L._AC_UL320_.jpg",
        "asin": "B0FZC9TKKB",
        "affiliate": "https://www.amazon.in/dp/B0FZC9TKKB/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "Wall Shelf, Heart Shaped Floating Shelves Wooden Modern Retro Bookshelf for Home Living Room Bedroom Display Rack (Black Round 2)",
        "price": "₹1,349",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/71i6WjNKmZL._AC_UL320_.jpg",
        "asin": "B0BR63RQ2F",
        "affiliate": "https://www.amazon.in/dp/B0BR63RQ2F/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "Mamta Furniture Wooden 5 Seater Sofa Set with 40 Density Cushions for Living Room, Five Seater Sofa for Office & Lounge, 3+1+1 Seater Sofa Sets for Home, Sheesham Wood, Walnut",
        "price": "₹30,525",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/51bwRxz4KjL._AC_UL320_.jpg",
        "asin": "B0CM34DMNV",
        "affiliate": "https://www.amazon.in/dp/B0CM34DMNV/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "DEVOKO 5-Piece Outdoor Rattan Wicker Patio Bistro Set For Garden, Backyard, Balcony, Porch, Poolside Furniture With Dark Brown All-Weather Wicker And Glass Top Table (Dark Brown), (58 X 46 X 79Cm)",
        "price": "₹11,499",
        "rating": "4.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/81Vv03JLsJL._AC_UL320_.jpg",
        "asin": "B0DGLF3XYY",
        "affiliate": "https://www.amazon.in/dp/B0DGLF3XYY/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "ASTRIDE Ergofit Ergonomic Office Chair for Home | 3-Years Warranty | 2D Headrest, Adjustable Arms & Lumbar Support | Tilt Lock Mechanism [Heavy Duty Chromium Metal Base, Grey-White]",
        "price": "₹5,399",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/818hqgJuNoL._AC_UL320_.jpg",
        "asin": "B0CN49729X",
        "affiliate": "https://www.amazon.in/dp/B0CN49729X/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "Patio Outdoor Sofa for Balcony 8 Seater | 9 Piece Weather Resistant Wicker Sectional Sofa Set with Waterproof Cushion | 8 Seater L Shape Outdoor Sofa (Beige, Eight Seats)",
        "price": "₹54,999",
        "rating": "",
        "image": "https://m.media-amazon.com/images/I/913vZQCILmL._AC_UL320_.jpg",
        "asin": "B0F8Q5H9CS",
        "affiliate": "https://www.amazon.in/dp/B0F8Q5H9CS/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "FFO TV Unit, TV Cabinet 180 cm 6ft | TV Unit 75 Inch+ for Living Room | Black TV Stand Wooden with Metal Legs TV Console | TV Cabinet with Storage | TV Console Unit for 43, 55, 65, 75 Inch TVs |DIY.",
        "price": "₹8,500",
        "rating": "3.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/71sJhgdUeUL._AC_UL320_.jpg",
        "asin": "B0G5SBXR4R",
        "affiliate": "https://www.amazon.in/dp/B0G5SBXR4R/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "Kingsman Furnitures Brok 3‑Seater Luxury Fabric Sofa – Mid-Century Luxe Bouclé Upholstery, Brushed Brass Base, Plush Comfort for Living Room (Boucle Cream)",
        "price": "₹54,999",
        "rating": "",
        "image": "https://m.media-amazon.com/images/I/71mgB-jP0cL._AC_UL320_.jpg",
        "asin": "B0GQHCCN9S",
        "affiliate": "https://www.amazon.in/dp/B0GQHCCN9S/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "Mighty Home 3-Tier Metal Plant Stand, Black, Heavy Duty Iron Plant Holder for Balcony, Garden, Home Decor, Indoor & Outdoor Multi-Purpose Pot Rack, Space-Saving, Durable\nMighty Home 3-Tier Metal Plant Stand, Black, Heavy Duty Iron Plant Holder for Balcony, Garden, Home Decor, I…",
        "price": "₹2,799",
        "rating": "4.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/81iPuzl2hKL._AC_SR405%2C405_.jpg",
        "asin": "B0DXL7DK43",
        "affiliate": "https://www.amazon.in/dp/B0DXL7DK43/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "S S Wood Nation Interlocking Wooden Wall Shelves Set of 1 Floating Wall Mounted Shelves for Home Decor | Storage Display Rack for Living Room, Bedroom & Office | Modern Wall Decoration Items (Brown)\nS S Wood Nation Interlocking Wooden Wall Shelves Set of 1 Floating Wall Mounted Shelves for Home Dec…",
        "price": "₹699",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/71pDTrJ2c3L._AC_SR405%2C405_.jpg",
        "asin": "B0FB42MRRP",
        "affiliate": "https://www.amazon.in/dp/B0FB42MRRP/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "Jdav Sheesham Wood Bedside End Table | Side Table with a Drawer for Home Decor |Living Room | Single Table (Sheesham,Brown)\nJdav Sheesham Wood Bedside End Table | Side Table with a Drawer for Home Decor |Living Room | Single Table (S…",
        "price": "₹3,969",
        "rating": "",
        "image": "https://m.media-amazon.com/images/I/310daOyqFuL._AC_SR405%2C405_.jpg",
        "asin": "B09Y44WCYG",
        "affiliate": "https://www.amazon.in/dp/B09Y44WCYG/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "ZOVE Luxury Tropical Leaf Metal Wall Decor | Artistic Green & Blue Wall Hanging with Gold Accents | Premium Large Metal Wall Art for Living Room, Bedroom, Hallway & Office | Modern Home Décor Sculpture ( 45 x 20 Inch )\nZOVE Luxury Tropical Leaf Metal Wall Decor | Artistic Green & Blue Wall Hanging with Gold Accents | Premium Lar…",
        "price": "₹3,999",
        "rating": "",
        "image": "https://m.media-amazon.com/images/I/5105dryHymL._AC_SR405%2C405_.jpg",
        "asin": "B0GWF6RVNF",
        "affiliate": "https://www.amazon.in/dp/B0GWF6RVNF/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "MustHome Wall Plates, Wall Decor Set of 4, Multicolor, Wooden, Wall Plates Decor Hanging, Wall Decor, 10 Inches, Boho, Wood Hanging Decorations for Living Room, Bedroom, Office, Wedding Gift items\nMustHome Wall Plates, Wall Decor Set of 4, Multicolor, Wooden, Wall Plates Decor Hanging, Wall Decor, 10 Inches,…",
        "price": "₹1,398",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/81cNj4kx1yL._AC_SR405%2C405_.jpg",
        "asin": "B0DBJC79GF",
        "affiliate": "https://www.amazon.in/dp/B0DBJC79GF/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "HOTHOUSE Boho Art Home Decoration Painting | Paintings With Frame For Living Room Bed Room Hotel Wall Decor Digital Reprint Set of 3 (13X17 inch)\nHOTHOUSE Boho Art Home Decoration Painting | Paintings With Frame For Living Room Bed Room Hotel Wall…",
        "price": "₹1,329",
        "rating": "3.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/71Zht2x7DhL._AC_SR405%2C405_.jpg",
        "asin": "B0G2LFF2NJ",
        "affiliate": "https://www.amazon.in/dp/B0G2LFF2NJ/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "THE URBAN STORE Shelf Wooden Wall Mounted Distressed Grey Color 60 x 20 X 19 CM Pack of One French Country Style Elegantly Floral Hand Crafted for Home and Office Decor TUSSLF09\nTHE URBAN STORE Shelf Wooden Wall Mounted Distressed Grey Color 60 x 20 X 19 CM Pack of One French Country St…",
        "price": "₹1,779",
        "rating": "3.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/61i6jqzLtBL._AC_SR405%2C405_.jpg",
        "asin": "B08D9NNTQS",
        "affiliate": "https://www.amazon.in/dp/B08D9NNTQS/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "The Earth Store Handcrafted Creme Matte Brown Ceramic Dinner Set, 30 Pieces Serving for 6, Microwave and Dishwasher Safe, Bone-Ash Free, Dinner Sets | Crockery Set for Gifting & Dining",
        "price": "₹5,899",
        "rating": "3.9 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/81cyY0ge0yL._AC_UL165_SR165,165_.jpg",
        "asin": "B0GKGZ7LMJ",
        "affiliate": "https://www.amazon.in/dp/B0GKGZ7LMJ/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "Ice Roller for Face and Eye (Pink), Ice Roller, Face Massager, Facial Roller, Ice Facial Roller, Ice Rooler",
        "price": "₹129",
        "rating": "4.2 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/71m2Mn63IJL._AC_UL165_SR165,165_.jpg",
        "asin": "B0D8TNT77P",
        "affiliate": "https://www.amazon.in/dp/B0D8TNT77P/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "Crompton Wave Plus 400 mm wall Fan | Adjustable Height | Smooth Oscillation | Superior Air Delivery | 2 Year Warranty | White",
        "price": "₹2,479",
        "rating": "4.0 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/51SNVdSfblS._AC_UL165_SR165,165_.jpg",
        "asin": "B08QFJMXK1",
        "affiliate": "https://www.amazon.in/dp/B08QFJMXK1/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "INOVERA Ice Roller for Face Massager | Reusable Ice Holder Tool for Glowing & Clear Skin | Easy to Use and Carry | Cold Massage Therapy for Skin (Black)",
        "price": "₹159",
        "rating": "4.1 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/71lEO9SCqML._AC_UL165_SR165,165_.jpg",
        "asin": "B0CL24GV58",
        "affiliate": "https://www.amazon.in/dp/B0CL24GV58/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "atomberg Renesa | 400mm BLDC Wall | Silent Operation | Home, Office | 35W | Save ₹400 every summer | Remote with Oscillation, Timer, Sleep modes | 2 Yrs Warranty | Midnight Black",
        "price": "₹400",
        "rating": "4.1 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/81m8RU7ZV0L._AC_UL165_SR165,165_.jpg",
        "asin": "B0BGC19X9B",
        "affiliate": "https://www.amazon.in/dp/B0BGC19X9B/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "RIXTEC ice roller for face women skin glowing ice cube massager Face Puffiness Relief Massage Skin Care Tools for face eye(Multi color)(Facial roller)",
        "price": "₹129",
        "rating": "4.4 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/61Zc+oboyuL._AC_UL165_SR165,165_.jpg",
        "asin": "B0DQPJTPHW",
        "affiliate": "https://www.amazon.in/dp/B0DQPJTPHW/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    {
        "title": "Pets Empire Stainless Steel Dog Bowl, Dog Food Bowl, Dog Feeding Bowl, Medium (Set of 2 x 700ml)",
        "price": "₹189",
        "rating": "4.3 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/71g03h7tp9L._AC_UL165_SR165,165_.jpg",
        "asin": "B072XW1FSP",
        "affiliate": "https://www.amazon.in/dp/B072XW1FSP/?tag=mydeals03c-21",
        "category": "Furniture"
    },
    
    {
        "title": "Wooden Shelf Bamboo 4-Tier Kitchen Organizer Shoes &Slippers Rack Books Shelves Planter Stand Office File Cabinet Utility Rack for Doorway, Hallway, Entryway & Balcony (Large)",
        "price": "₹999",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/41pEQaAkPwL._AC_UL320_.jpg",
        "asin": "B0GGJBB174",
        "affiliate": "https://www.amazon.in/dp/B0GGJBB174/?tag=mydeals03c-21",
    },
    {
        "title": "Floating Wooden Wall Shelves for Books | Wall Mounted Bookshelf for Living Room & Bedroom | Floating Wall Bookshelf | Book Shelf Wooden Wall Mounted | Decorative Wall Shelf Rack Set (Manna)",
        "price": "₹399",
        "rating": "5.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/71eNwxJhzsL._AC_UL320_.jpg",
        "asin": "B0GRPK5V9H",
        "affiliate": "https://www.amazon.in/dp/B0GRPK5V9H/?tag=mydeals03c-21",
    },
    {
        "title": "Spire 6-Tier Tall Bookshelf & Corner Display Rack, Vertical Storage Organizer for Living Room & Office, 33x24x180cm (Walnut)",
        "price": "₹2,499",
        "rating": "",
        "image": "https://m.media-amazon.com/images/I/81e1ab18MYL._AC_UL320_.jpg",
        "asin": "B0GP1KFXLM",
        "affiliate": "https://www.amazon.in/dp/B0GP1KFXLM/?tag=mydeals03c-21",
    },
    {
        "title": "Floating Wooden Wall Shelves for Books | Wall Mounted Bookshelf for Living Room & Bedroom | Floating Wall Bookshelf | Book Shelf Wooden Wall Mounted | Decorative Wall Shelf Rack Set (Aurace)",
        "price": "₹399",
        "rating": "5.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/71eDS8-fYQL._AC_UL320_.jpg",
        "asin": "B0GRS42N1W",
        "affiliate": "https://www.amazon.in/dp/B0GRS42N1W/?tag=mydeals03c-21",
    },
    {
        "title": "STAR WORK Set of 4 Tier Corner Shelf, Industrial Wall Corner Bookshelf with Metal Frame, Corner Storage Rack Shelves Display Plant Flower, Stand Bookcase for Home, Office, Kitchen (3.7X2X1 Feet)",
        "price": "₹1,612",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/61OPVQNMPDL._AC_UL320_.jpg",
        "asin": "B08VMZ46GM",
        "affiliate": "https://www.amazon.in/dp/B08VMZ46GM/?tag=mydeals03c-21",
    },
    {
        "title": "Trio 3-Tier Multipurpose Bookshelf & Storage Rack, Compact Engineered Wood Organizer Stand for Home & Office, 80x33x22cm (Light Oak)",
        "price": "₹1,449",
        "rating": "3.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/81S7pf57CNL._AC_UL320_.jpg",
        "asin": "B0GP1D7TV9",
        "affiliate": "https://www.amazon.in/dp/B0GP1D7TV9/?tag=mydeals03c-21",
    },
    {
        "title": "Engineered Wood Wall Mounted Shelf for Living Room Home Décor Shelves for Office | Wall Display Rack for Hall Set of 3 Pieces(Brown)",
        "price": "₹999",
        "rating": "5.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/51uTg9EuvlL._AC_UL320_.jpg",
        "asin": "B0CD5Q1JKC",
        "affiliate": "https://www.amazon.in/dp/B0CD5Q1JKC/?tag=mydeals03c-21",
    },
    {
        "title": "Acrylic Floating Wall Shelves Set – Stylish Invisible Display Shelves for Bedroom Bathroom Kitchen Office Living Room Décor Storage and Organization Pack of 2 (4 inch)",
        "price": "₹295",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/717dvFED4tL._AC_UL320_.jpg",
        "asin": "B0FD44CVNQ",
        "affiliate": "https://www.amazon.in/dp/B0FD44CVNQ/?tag=mydeals03c-21",
    },
    {
        "title": "STAR WORK Engineered Wood Standing Corner Wall Shelf Rack Floor Wall Shelves For Living Bed Room Home Office|Multipurpose Utility Storage Organiser(3 Tier Corner Rack)(H-2.6 Ft|W-2 Ft|D-1 Ft)",
        "price": "₹1,072",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/61OALCwR1xL._AC_UL320_.jpg",
        "asin": "B09HK7PHZS",
        "affiliate": "https://www.amazon.in/dp/B09HK7PHZS/?tag=mydeals03c-21",
    },
    {
        "title": "Genuine Decor 16 Inch Natural Solid Wood Floating Wall Shelf, Small Wall Mounted Shelf",
        "price": "₹1,416",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/71qe5Nq-PnL._AC_UL320_.jpg",
        "asin": "B0G6T4N1Y4",
        "affiliate": "https://www.amazon.in/dp/B0G6T4N1Y4/?tag=mydeals03c-21",
    },
    {
        "title": "Floating Shelf with Drawer, Floating Stand for Bedroom- Wall Shelf, White Floating Shelf with Storage, Floating Shelf Living & Bed Room Decor (Grey)",
        "price": "₹1,249",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/618EFHkm1WL._AC_UL320_.jpg",
        "asin": "B0DWXMTRPC",
        "affiliate": "https://www.amazon.in/dp/B0DWXMTRPC/?tag=mydeals03c-21",
        "category": "Home Decor"
    },
    {
        "title": "Opus 3-Tier Modern Side Table & Nightstand, Two-Tone Accent Bookshelf for Living Room, Bedroom & Office, 50x24x68cm (Dark Walnut & White)",
        "price": "₹1,749",
        "rating": "5.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/81-6unYWFeL._AC_UL320_.jpg",
        "asin": "B0GP1TH7CY",
        "affiliate": "https://www.amazon.in/dp/B0GP1TH7CY/?tag=mydeals03c-21",
        "category": "Home Decor"
    },
    {
        "title": "WOOD ART STORE Rustic Kitchen Wood Wall Shelf with Metal Rail Also Multi Use Can Be Used As a Spice & box Rack guest room or Bedroom Wall Shelf",
        "price": "₹499",
        "rating": "3.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/7175LrPbL1L._AC_UL320_.jpg",
        "asin": "B084LFP3SF",
        "affiliate": "https://www.amazon.in/dp/B084LFP3SF/?tag=mydeals03c-21",
        "category": "Home Decor"
    },
    {
        "title": "Nordic Floating Shelf with Drawer, Wall Shelf, 1 Shelf, White & Grey, Space Saving, Bedroom & Living Room Decor",
        "price": "₹1,249",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/61oeq-YU0dL._AC_UL320_.jpg",
        "asin": "B0DX28W1D4",
        "affiliate": "https://www.amazon.in/dp/B0DX28W1D4/?tag=mydeals03c-21",
        "category": "Home Decor"
    },
    {
        "title": "Engineered Wood Puja Temple Shelf with Drawer, Floating Stand for Bedroom- Wall Shelf, White Floating Shelf with Storage, Floating Shelf Living Room Bed Room Decor (Brown)",
        "price": "₹1,249",
        "rating": "3.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/61CndfM9kzL._AC_UL320_.jpg",
        "asin": "B0DX2B4L4L",
        "affiliate": "https://www.amazon.in/dp/B0DX2B4L4L/?tag=mydeals03c-21",
        "category": "Home Decor"
    },
    {
        "title": "Amazon Basics Self-Adhesive Wall Shelf – No-Drill Multipurpose Bathroom/Kitchen Organizer with Hooks and Towel Holder, Rust Proof GI Steel Organizer | Black, 28.2 x 9.8 x 11.5 cm, Pack of 1",
        "price": "₹319",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/71POCxgXGSL._AC_UL320_.jpg",
        "asin": "B0FBX2F1W9",
        "affiliate": "https://www.amazon.in/dp/B0FBX2F1W9/?tag=mydeals03c-21",
        "category": "Home Decor"
    },
    {
        "title": "Ash & Roh steel - Standing Corner Wall Shelf | 5 Tier Rack Floor Wall Shelves For Living Bed Room Home Office |Multipurpose Utility Storage Organiser For Home Décor (5 Tier Corner Rack)",
        "price": "₹1,614",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/61WQkAZwdNL._AC_UL320_.jpg",
        "asin": "B096KM5ND2",
        "affiliate": "https://www.amazon.in/dp/B096KM5ND2/?tag=mydeals03c-21",
        "category": "Home Decor"
    },
    {
        "title": "Floating Shelf with Drawer, Floating Stand for Bedroom- Wall Shelf, White Floating Shelf with Storage, Floating Shelf Living & Bed Room Decor (Black)",
        "price": "₹1,249",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/61IgmgF1dbL._AC_UL320_.jpg",
        "asin": "B0DWXTVGP1",
        "affiliate": "https://www.amazon.in/dp/B0DWXTVGP1/?tag=mydeals03c-21",
        "category": "Home Decor"
    },
    {
        "title": "Novatic Beautiful Antique Metal Plastic Foldable Side Table/End Table/Plant Stand/Stool Living Room Kids Play Furniture Table Square Shape for Living Room, Bedroom, Bedside Table",
        "price": "₹851",
        "rating": "1.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/51Sfxhn9acL._AC_UL320_.jpg",
        "asin": "B0DY4MZBFH",
        "affiliate": "https://www.amazon.in/dp/B0DY4MZBFH/?tag=mydeals03c-21",
        "category": "Home Decor"
    },
    {
        "title": "Novatic Metal Plastic Side Table/End Table/Showcase Dsiplay Stand Kids Play Corner Stand Square Shape for Living Room, Bedroom, Bedside Shelves - 4 Tier",
        "price": "₹736",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/51IXXyPk6-L._AC_UL320_.jpg",
        "asin": "B0DHL3CQKX",
        "affiliate": "https://www.amazon.in/dp/B0DHL3CQKX/?tag=mydeals03c-21",
        "category": "Home Decor"
    },
    {
        "title": "Multi-Layer Shoe Rack for Home, Space Saving Plastic Shoe Organizer Stand, Easy Assembly Storage Rack for Living Room, Bedroom & Entryway (6 Tier)",
        "price": "₹479",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/71a9YCW+4cL._AC_UL320_.jpg",
        "asin": "B0GVTCH6CP",
        "affiliate": "https://www.amazon.in/dp/B0GVTCH6CP/?tag=mydeals03c-21",
        "category": "Home Decor"
    },
    {
        "title": "Wall Mounted Acrylic Bathroom Shelf with Stainless Steel Support | Luxury Storage Organizer Rack for Shower, Kitchen & Living Room | Space Saving Floating Shelf for Home Décor",
        "price": "₹649",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/61+QWa60dJL._AC_UL320_.jpg",
        "asin": "B0FMQC5K43",
        "affiliate": "https://www.amazon.in/dp/B0FMQC5K43/?tag=mydeals03c-21",
        "category": "Home Decor"
    },
    {
        "title": "Collapsible Wall Hanging Storage Bag 3 Pocket Wall Door Cloth Wardrobe Hanging Storage Hanger Bags Box Organizer Hanging Pocket for Dorm Living Room Home Decor (1 Pack)",
        "price": "₹299",
        "rating": "1.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/614MMnN64PL._AC_UL320_.jpg",
        "asin": "B0CSWGZFTY",
        "affiliate": "https://www.amazon.in/dp/B0CSWGZFTY/?tag=mydeals03c-21",
        "category": "Home Decor"
    },
    {
        "title": "Puja Temple Shelf with Drawer, Floating Stand for Bedroom- Wall Shelf, White Floating Shelf with Storage, Floating Shelf Living Room Bed Room Decor (Grey)",
        "price": "₹1,249",
        "rating": "5.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/61hgTYOf+HL._AC_UL320_.jpg",
        "asin": "B0DXKR469K",
        "affiliate": "https://www.amazon.in/dp/B0DXKR469K/?tag=mydeals03c-21",
        "category": "Home Decor"
    },
    {
        "title": "40 inch Floating Shelf for Wall Natural Walnut Wood Wall Shelves Picture Ledge Display Shelf Hanging Wall Bookshelf for Living Room Bedroom Kitchen Office Home Decor (Natural, 100cm)",
        "price": "₹2,089",
        "rating": "",
        "image": "https://m.media-amazon.com/images/I/41wCOUAZ5aL._AC_UL320_.jpg",
        "asin": "B0FQ49MV8P",
        "affiliate": "https://www.amazon.in/dp/B0FQ49MV8P/?tag=mydeals03c-21",
        "category": "Home Decor"
    },
    {
        "title": "40 inch Floating Shelf for Wall Natural Walnut Wood Wall Shelves Picture Ledge Display Shelf Hanging Wall Bookshelf for Living Room Bedroom Kitchen Office Home D?cor (Natural, 100cm)",
        "price": "₹2,161",
        "rating": "5.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/41IduGe+WTL._AC_UL320_.jpg",
        "asin": "B0D94WSVRK",
        "affiliate": "https://www.amazon.in/dp/B0D94WSVRK/?tag=mydeals03c-21",
        "category": "Home Decor"
    },
    {
        "title": "Floating Shelf Wall Set of 2, Mini Floating Shelf, White Acrylic Floating Shelf, Wall Shelf, Picture Rail, White for Bedroom, Bathroom, Kitchen, Spice Rack, Wall Living Room, Office, Depth 10 cm x",
        "price": "₹699",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/51jw3RidlQL._AC_UL320_.jpg",
        "asin": "B0CDLS9DBF",
        "affiliate": "https://www.amazon.in/dp/B0CDLS9DBF/?tag=mydeals03c-21",
        "category": "Home Decor"
    },
    {
        "title": "Puja Temple Shelf with Drawer, Floating Stand for Bedroom- Wall Shelf, White Floating Shelf with Storage, Floating Shelf Living Room Bed Room Decor (Brown)",
        "price": "₹1,249",
        "rating": "5.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/61CndfM9kzL._AC_UL320_.jpg",
        "asin": "B0DXKSYJHJ",
        "affiliate": "https://www.amazon.in/dp/B0DXKSYJHJ/?tag=mydeals03c-21",
        "category": "Home Decor"
    },
    {
        "title": "4 Tier Foldable Shoe Rack for Home | Multipurpose Collapsible Footwear Stand | Space Saving Plastic Shoe Organizer for Entryway, Bedroom & Living Room (Black)",
        "price": "₹287",
        "rating": "",
        "image": "https://m.media-amazon.com/images/I/512s9cXsbyL._AC_UL320_.jpg",
        "asin": "B0GSXH8FTS",
        "affiliate": "https://www.amazon.in/dp/B0GSXH8FTS/?tag=mydeals03c-21",
        "category": "Home Decor"
    },
    {
        "title": "Brown Art SHOPPEE Floating Shelf with Drawer, Floating Stand for Bedroom- Wall Shelf, Storage Shelf with Storage, Floating Shelf-Office Bathroom Kitchen Floating Bedside Table (Brown)",
        "price": "₹1,186",
        "rating": "3.7 out of 5",
        "image": "https://m.media-amazon.com/images/I/61AjUU3YTqL._AC_UL320_.jpg",
        "asin": "B0FCM6F8FM",
        "affiliate": "https://www.amazon.in/dp/B0FCM6F8FM/?tag=mydeals03c-21",
        "category": "Home Decor"
    },
    {
        "title": "Metal Foldable Open Book Shelf, Book Shelve Book Case, Book Rack, Book Storage Rack for Study Room (Set of 1 ,Black)",
        "price": "₹619",
        "rating": "3.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/61ZnPDDBhyL._AC_UL320_.jpg",
        "asin": "B08XQ8JWBD",
        "affiliate": "https://www.amazon.in/dp/B08XQ8JWBD/?tag=mydeals03c-21",
        "category": "Home Decor"
    },
    {
        "title": "Floating Shelf with Drawer, Floating Stand for Bedroom- Wall Shelf, White Floating Shelf with Storage, Floating Shelf Living Room Bed Room Decor (Grey White)",
        "price": "₹1,299",
        "rating": "",
        "image": "https://m.media-amazon.com/images/I/61NkNFP+7xL._AC_UL320_.jpg",
        "asin": "B0DWXH22RM",
        "affiliate": "https://www.amazon.in/dp/B0DWXH22RM/?tag=mydeals03c-21",
        "category": "Home Decor"
    },
    {
        "title": "Wall Mounted Shoe Rack Holder, Wall Shelves,Mini Floating Shelves Acrylic Display Shelves, Decor Living Room Wall Mounted Stand Organizer Shoes Display Stand for Shop Glass (2)",
        "price": "₹295",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/51KHqAAfRoL._AC_UL320_.jpg",
        "asin": "B0F5K5HVLP",
        "affiliate": "https://www.amazon.in/dp/B0F5K5HVLP/?tag=mydeals03c-21",
        "category": "Home Decor"
    },
    {
        "title": "IRA Furniture Handcrafted Rattan Arch Bookshelf - 3-Tier Natural Wicker Display Rack - Bohemian Standing Storage Shelf for Living Room, Nursery & Bedroom - Sustainable Bamboo Style Furniture",
        "price": "₹9,492",
        "rating": "",
        "image": "https://m.media-amazon.com/images/I/51PH5AiEgEL._AC_UL320_.jpg",
        "asin": "B0GZGK5QT8",
        "affiliate": "https://www.amazon.in/dp/B0GZGK5QT8/?tag=mydeals03c-21",
        "category": "Home Decor"
    },
    {
        "title": "Wall Mount Floating Rustic Wooden Shelf - Book Storage Shelves for Free Grouping of Bedroom, Living Room, Kitchen, Office, Bathroom (Medium)",
        "price": "₹599",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/61wLYG65PxL._AC_UL320_.jpg",
        "asin": "B08RX7Z1Y2",
        "affiliate": "https://www.amazon.in/dp/B08RX7Z1Y2/?tag=mydeals03c-21",
        "category": "Home Decor"
    },
    {
        "title": "Aliensware 4-Layer Foldable Shoe Organizer Storage Box/Collapsible Shoe Rack/Foldable Closet for Living Room,Study,Bathroom/Storage Organizer for Shoe Boots,Slippers,Sneakers,Books,Aliens (White)",
        "price": "₹1,249",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/51yGfpQN0qL._AC_UL320_.jpg",
        "asin": "B0DR5X8R2R",
        "affiliate": "https://www.amazon.in/dp/B0DR5X8R2R/?tag=mydeals03c-21",
        "category": "Home Decor"
    },
    {
        "title": "Novatic Heavy Duty Metal & Plastic Foldable 6 Layer Bookshelf for Home Library, Study Room & Open Display Rack Home Décor (Large)",
        "price": "₹1,184",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/41mVWxPsaOL._AC_UL320_.jpg",
        "asin": "B0BSNXXCWL",
        "affiliate": "https://www.amazon.in/dp/B0BSNXXCWL/?tag=mydeals03c-21",
        "category": "Home Decor"
    },
    {
        "title": "Macrame Wall Hanging, 2pcs, Handmade Bohemian Floating Shelf for Living Room, Bedroom, Kitchen, Bathroom, Closet (Style-5)",
        "price": "₹299",
        "rating": "1.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/31+cWtT0p5L._AC_UL320_.jpg",
        "asin": "B0D834LGH8",
        "affiliate": "https://www.amazon.in/dp/B0D834LGH8/?tag=mydeals03c-21",
        "category": "Home Decor"
    },
    {
        "title": "Foldable Multi PERPOSE Plastic Shoe Rack, 4 Shelf, Black, Multipurpose Storage, 60x30x80 cm, Floor Mount, Rectangular",
        "price": "₹319",
        "rating": "3.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/61I-J9y46dL._AC_UL320_.jpg",
        "asin": "B0GRV7XWSL",
        "affiliate": "https://www.amazon.in/dp/B0GRV7XWSL/?tag=mydeals03c-21",
        "category": "Home Decor"
    },
    {
        "title": "Floating Shelves Wall 4mm Storage. Wall Mounted Bookshelves for Study Room, Toy Cards Collectibles Display for Kids Room, Perfume and Cosmetics Organizer for Bathroom (4, Clear)",
        "price": "₹826",
        "rating": "",
        "image": "https://m.media-amazon.com/images/I/61OmSYqpv8L._AC_UL320_.jpg",
        "asin": "B0FRGHMHD3",
        "affiliate": "https://www.amazon.in/dp/B0FRGHMHD3/?tag=mydeals03c-21",
        "category": "Home Decor"
    },
    {
        "title": "Wall Mount Floating Shelves Set of Rustic Wood Storage Shelves, Book Shelves for Free Grouping of Bedroom, Living Room, Kitchen, Office, Bathroom (Medium)",
        "price": "₹799",
        "rating": "3.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/71jgtGezgLL._AC_UL320_.jpg",
        "asin": "B083XZM11D",
        "affiliate": "https://www.amazon.in/dp/B083XZM11D/?tag=mydeals03c-21",
        "category": "Home Decor"
    },
    {
        "title": "Floating Shelf with Drawer, Floating Stand for Bedroom- Wall Shelf, White Floating Shelf with Storage, Floating Shelf Living Room Bed Room Decor (Brown White)",
        "price": "₹1,249",
        "rating": "",
        "image": "https://m.media-amazon.com/images/I/71UJOhwsNIL._AC_UL320_.jpg",
        "asin": "B0DWXSPD2W",
        "affiliate": "https://www.amazon.in/dp/B0DWXSPD2W/?tag=mydeals03c-21",
        "category": "Home Decor"
    },
    {
        "title": "Floating Shelf with Drawer, Floating Stand for Bedroom- Wall Shelf, White Floating Shelf with Storage, Floating Shelf Living Room Bed Room Decor (Brown White)",
        "price": "₹1,249",
        "rating": "5.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/71iNnIWqDCL._AC_UL320_.jpg",
        "asin": "B0DXKMC9T2",
        "affiliate": "https://www.amazon.in/dp/B0DXKMC9T2/?tag=mydeals03c-21",
        "category": "Home Decor"
    },
    {
        "title": "Dwain Foldable Shoe Rack Plastic for Home | 6 Layer Portable Shoe Organizer Stand | Shoes & Slippers Storage Rack Space Saver | Shoe Rack with Cover for Bedroom Living Room",
        "price": "₹589",
        "rating": "2.7 out of 5",
        "image": "https://m.media-amazon.com/images/I/71XVOh6-dyL._AC_UL320_.jpg",
        "asin": "B0GG4KBG2T",
        "affiliate": "https://www.amazon.in/dp/B0GG4KBG2T/?tag=mydeals03c-21",
        "category": "Home Decor"
    },
    {
        "title": "Sheesham Wood Book Shelf with Open Cabinet & Drawer Storage | Solid Wooden Bookcase Display Unit for Living Room Library & Office | Honey Finish",
        "price": "₹11,999",
        "rating": "",
        "image": "https://m.media-amazon.com/images/I/61ziZmoSxkL._AC_UL320_.jpg",
        "asin": "B0CTX2V1RJ",
        "affiliate": "https://www.amazon.in/dp/B0CTX2V1RJ/?tag=mydeals03c-21",
        "category": "Home Decor"
    },
    {
        "title": "Macramé Wall Hanging Shelf, Indoor Boho Wall Decor for Living Room, Wood Hanging Shelf Organizer, Handmade Woven Cotton Rope Bohemian Home Wall Décor (Set of 1,Beige)",
        "price": "₹299",
        "rating": "",
        "image": "https://m.media-amazon.com/images/I/51BiC0MINYL._AC_UL320_.jpg",
        "asin": "B0G6DSQD39",
        "affiliate": "https://www.amazon.in/dp/B0G6DSQD39/?tag=mydeals03c-21",
        "category": "Home Decor"
    },
    {
        "title": "Floating Shelf with Drawer, Floating Stand for Bedroom- Wall Shelf, White Floating Shelf with Storage, Floating Shelf Living & Bed Room Decor (RED)",
        "price": "₹1,249",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/61HPEGc9XzL._AC_UL320_.jpg",
        "asin": "B0DWXQSD4R",
        "affiliate": "https://www.amazon.in/dp/B0DWXQSD4R/?tag=mydeals03c-21",
        "category": "Home Decor"
    },
    {
        "title": "Solid Sheesham Wood Open Bookcase with Set of 3 Tier Shelf Corner Storage | Wooden Display Organizer Unit for Bedroom, Living Room, Home and Office (Brown Finish)",
        "price": "₹5,187",
        "rating": "",
        "image": "https://m.media-amazon.com/images/I/81ayzgQEM+L._AC_UL320_.jpg",
        "asin": "B0BCQD53YR",
        "affiliate": "https://www.amazon.in/dp/B0BCQD53YR/?tag=mydeals03c-21",
        "category": "Home Decor"
    },
    {
        "title": "Mighty Home 3-Tier Metal Plant Stand, Black, Heavy Duty Iron Plant Holder for Balcony, Garden, Home Decor, Indoor & Outdoor Multi-Purpose Pot Rack, Space-Saving, Durable\nMighty Home 3-Tier Metal Plant Stand, Black, Heavy Duty Iron Plant Holder for Balcony, Garden, Home Decor, I…",
        "price": "₹2,799",
        "rating": "4.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/81iPuzl2hKL._AC_SR405%2C405_.jpg",
        "asin": "B0DXL7DK43",
        "affiliate": "https://www.amazon.in/dp/B0DXL7DK43/?tag=mydeals03c-21",
        "category": "Home Decor"
    },
    {
        "title": "S S Wood Nation Interlocking Wooden Wall Shelves Set of 1 Floating Wall Mounted Shelves for Home Decor | Storage Display Rack for Living Room, Bedroom & Office | Modern Wall Decoration Items (Brown)\nS S Wood Nation Interlocking Wooden Wall Shelves Set of 1 Floating Wall Mounted Shelves for Home Dec…",
        "price": "₹699",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/71pDTrJ2c3L._AC_SR405%2C405_.jpg",
        "asin": "B0FB42MRRP",
        "affiliate": "https://www.amazon.in/dp/B0FB42MRRP/?tag=mydeals03c-21",
        "category": "Home Decor"
    },
    {
        "title": "Jdav Sheesham Wood Bedside End Table | Side Table with a Drawer for Home Decor |Living Room | Single Table (Sheesham,Brown)\nJdav Sheesham Wood Bedside End Table | Side Table with a Drawer for Home Decor |Living Room | Single Table (S…",
        "price": "₹3,969",
        "rating": "",
        "image": "https://m.media-amazon.com/images/I/310daOyqFuL._AC_SR405%2C405_.jpg",
        "asin": "B09Y44WCYG",
        "affiliate": "https://www.amazon.in/dp/B09Y44WCYG/?tag=mydeals03c-21",
        "category": "Home Decor"
    },
    {
        "title": "ZOVE Luxury Tropical Leaf Metal Wall Decor | Artistic Green & Blue Wall Hanging with Gold Accents | Premium Large Metal Wall Art for Living Room, Bedroom, Hallway & Office | Modern Home Décor Sculpture ( 45 x 20 Inch )\nZOVE Luxury Tropical Leaf Metal Wall Decor | Artistic Green & Blue Wall Hanging with Gold Accents | Premium Lar…",
        "price": "₹3,999",
        "rating": "",
        "image": "https://m.media-amazon.com/images/I/5105dryHymL._AC_SR405%2C405_.jpg",
        "asin": "B0GWF6RVNF",
        "affiliate": "https://www.amazon.in/dp/B0GWF6RVNF/?tag=mydeals03c-21",
        "category": "Home Decor"
    },
    {
        "title": "MustHome Wall Plates, Wall Decor Set of 4, Multicolor, Wooden, Wall Plates Decor Hanging, Wall Decor, 10 Inches, Boho, Wood Hanging Decorations for Living Room, Bedroom, Office, Wedding Gift items\nMustHome Wall Plates, Wall Decor Set of 4, Multicolor, Wooden, Wall Plates Decor Hanging, Wall Decor, 10 Inches,…",
        "price": "₹1,398",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/81cNj4kx1yL._AC_SR405%2C405_.jpg",
        "asin": "B0DBJC79GF",
        "affiliate": "https://www.amazon.in/dp/B0DBJC79GF/?tag=mydeals03c-21",
        "category": "Home Decor"
    },
    {
        "title": "HOTHOUSE Boho Art Home Decoration Painting | Paintings With Frame For Living Room Bed Room Hotel Wall Decor Digital Reprint Set of 3 (13X17 inch)\nHOTHOUSE Boho Art Home Decoration Painting | Paintings With Frame For Living Room Bed Room Hotel Wall…",
        "price": "₹1,329",
        "rating": "3.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/71Zht2x7DhL._AC_SR405%2C405_.jpg",
        "asin": "B0G2LFF2NJ",
        "affiliate": "https://www.amazon.in/dp/B0G2LFF2NJ/?tag=mydeals03c-21",
        "category": "Home Decor"
    },
    {
        "title": "THE URBAN STORE Shelf Wooden Wall Mounted Distressed Grey Color 60 x 20 X 19 CM Pack of One French Country Style Elegantly Floral Hand Crafted for Home and Office Decor TUSSLF09\nTHE URBAN STORE Shelf Wooden Wall Mounted Distressed Grey Color 60 x 20 X 19 CM Pack of One French Country St…",
        "price": "₹1,779",
        "rating": "3.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/61i6jqzLtBL._AC_SR405%2C405_.jpg",
        "asin": "B08D9NNTQS",
        "affiliate": "https://www.amazon.in/dp/B08D9NNTQS/?tag=mydeals03c-21",
        "category": "Home Decor"
    },
    {
        "title": "The Earth Store Handcrafted Creme Matte Brown Ceramic Dinner Set, 30 Pieces Serving for 6, Microwave and Dishwasher Safe, Bone-Ash Free, Dinner Sets | Crockery Set for Gifting & Dining",
        "price": "₹5,899",
        "rating": "3.9 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/81cyY0ge0yL._AC_UL165_SR165,165_.jpg",
        "asin": "B0GKGZ7LMJ",
        "affiliate": "https://www.amazon.in/dp/B0GKGZ7LMJ/?tag=mydeals03c-21",
        "category": "Home Decor"
    },
    {
        "title": "Ice Roller for Face and Eye (Pink), Ice Roller, Face Massager, Facial Roller, Ice Facial Roller, Ice Rooler",
        "price": "₹129",
        "rating": "4.2 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/71m2Mn63IJL._AC_UL165_SR165,165_.jpg",
        "asin": "B0D8TNT77P",
        "affiliate": "https://www.amazon.in/dp/B0D8TNT77P/?tag=mydeals03c-21",
        "category": "Home Decor"
    },
    {
        "title": "Crompton Wave Plus 400 mm wall Fan | Adjustable Height | Smooth Oscillation | Superior Air Delivery | 2 Year Warranty | White",
        "price": "₹2,479",
        "rating": "4.0 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/51SNVdSfblS._AC_UL165_SR165,165_.jpg",
        "asin": "B08QFJMXK1",
        "affiliate": "https://www.amazon.in/dp/B08QFJMXK1/?tag=mydeals03c-21",
        "category": "Home Decor"
    },
    {
        "title": "INOVERA Ice Roller for Face Massager | Reusable Ice Holder Tool for Glowing & Clear Skin | Easy to Use and Carry | Cold Massage Therapy for Skin (Black)",
        "price": "₹159",
        "rating": "4.1 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/71lEO9SCqML._AC_UL165_SR165,165_.jpg",
        "asin": "B0CL24GV58",
        "affiliate": "https://www.amazon.in/dp/B0CL24GV58/?tag=mydeals03c-21",
        "category": "Home Decor"
    },
    {
        "title": "atomberg Renesa | 400mm BLDC Wall | Silent Operation | Home, Office | 35W | Save ₹400 every summer | Remote with Oscillation, Timer, Sleep modes | 2 Yrs Warranty | Midnight Black",
        "price": "₹400",
        "rating": "4.1 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/81m8RU7ZV0L._AC_UL165_SR165,165_.jpg",
        "asin": "B0BGC19X9B",
        "affiliate": "https://www.amazon.in/dp/B0BGC19X9B/?tag=mydeals03c-21",
        "category": "Home Decor"
    },
    {
        "title": "RIXTEC ice roller for face women skin glowing ice cube massager Face Puffiness Relief Massage Skin Care Tools for face eye(Multi color)(Facial roller)",
        "price": "₹129",
        "rating": "4.4 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/61Zc+oboyuL._AC_UL165_SR165,165_.jpg",
        "asin": "B0DQPJTPHW",
        "affiliate": "https://www.amazon.in/dp/B0DQPJTPHW/?tag=mydeals03c-21",
        "category": "Home Decor"
    },
    {
        "title": "Pets Empire Stainless Steel Dog Bowl, Dog Food Bowl, Dog Feeding Bowl, Medium (Set of 2 x 700ml)",
        "price": "₹189",
        "rating": "4.3 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/71g03h7tp9L._AC_UL165_SR165,165_.jpg",
        "asin": "B072XW1FSP",
        "affiliate": "https://www.amazon.in/dp/B072XW1FSP/?tag=mydeals03c-21",
        "category": "Home Decor"
    },
    
    {
        "title": "Frantic",
        "price": "₹279",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/81srig8NIfL._AC_UL320_.jpg",
        "asin": "B091757GK4",
        "affiliate": "https://www.amazon.in/dp/B091757GK4/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "CARRYUP",
        "price": "₹349",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/71RIxBAs93L._AC_UL320_.jpg",
        "asin": "B0FSB6LHR7",
        "affiliate": "https://www.amazon.in/dp/B0FSB6LHR7/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "SAFAR ENTERPRISES",
        "price": "₹151",
        "rating": "3.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/41cG-040lCL._AC_UL320_.jpg",
        "asin": "B0G7YTW37G",
        "affiliate": "https://www.amazon.in/dp/B0G7YTW37G/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Elios British Design Kids School Bag for Boys and Girls Backpack, 360° Reflective Design, Spinal Care, Heat Dissipation, Functional Storage, Ages 7-12, Grades 3-6 Birthday & Rakhi Gift",
        "price": "₹1,590",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/81OsosM7oeL._AC_UL640_QL65_.jpg",
        "asin": "B0D7ZT7YXG",
        "affiliate": "https://www.amazon.in/dp/B0D7ZT7YXG/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "HYDER",
        "price": "₹399",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/815W9Mh+pAL._AC_UL320_.jpg",
        "asin": "B0DSKVT9GV",
        "affiliate": "https://www.amazon.in/dp/B0DSKVT9GV/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "F Gear",
        "price": "₹499",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/71PPM-SE8XL._AC_UL320_.jpg",
        "asin": "B0CWR8JC6X",
        "affiliate": "https://www.amazon.in/dp/B0CWR8JC6X/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Frantic",
        "price": "₹319",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/61tlq95ApEL._AC_UL320_.jpg",
        "asin": "B0B7WJVYXQ",
        "affiliate": "https://www.amazon.in/dp/B0B7WJVYXQ/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "CARRYUP",
        "price": "₹349",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/71mYMjD+s8L._AC_UL320_.jpg",
        "asin": "B0FSC6S2CY",
        "affiliate": "https://www.amazon.in/dp/B0FSC6S2CY/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "perfect star",
        "price": "₹284",
        "rating": "5.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/81kYutXdpqL._AC_UL320_.jpg",
        "asin": "B0GRCDKM8T",
        "affiliate": "https://www.amazon.in/dp/B0GRCDKM8T/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Generic",
        "price": "₹265",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/51CfFU3T87L._AC_UL320_.jpg",
        "asin": "B0CGNRLQ2P",
        "affiliate": "https://www.amazon.in/dp/B0CGNRLQ2P/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Impulse",
        "price": "₹699",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/51vhk-H73pL._AC_UL320_.jpg",
        "asin": "B0CX9D52VD",
        "affiliate": "https://www.amazon.in/dp/B0CX9D52VD/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "HYDER",
        "price": "₹519",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/61lk7JBJK+L._AC_UL320_.jpg",
        "asin": "B0BJ6PWNHP",
        "affiliate": "https://www.amazon.in/dp/B0BJ6PWNHP/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Frantic",
        "price": "₹619",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/71EspaKSgsL._AC_UL320_.jpg",
        "asin": "B0D1RFYPHQ",
        "affiliate": "https://www.amazon.in/dp/B0D1RFYPHQ/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Stylbase",
        "price": "₹449",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/71PP8RtGKlL._AC_UL320_.jpg",
        "asin": "B0BNL2PBPH",
        "affiliate": "https://www.amazon.in/dp/B0BNL2PBPH/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Skybags",
        "price": "₹940",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/71MLHV7ED7L._AC_UL320_.jpg",
        "asin": "B0DZH1BNHG",
        "affiliate": "https://www.amazon.in/dp/B0DZH1BNHG/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Impulse",
        "price": "₹549",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/61LVydGmMmL._AC_UL320_.jpg",
        "asin": "B0GR9NY6MN",
        "affiliate": "https://www.amazon.in/dp/B0GR9NY6MN/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "STRIDERS",
        "price": "₹969",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/51qggXMBCzL._AC_UL320_.jpg",
        "asin": "B0CR6J56Y5",
        "affiliate": "https://www.amazon.in/dp/B0CR6J56Y5/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "BEAUTY GIRLS",
        "price": "₹799",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/71sOkBXRy4L._AC_UL320_.jpg",
        "asin": "B0D1R77RKF",
        "affiliate": "https://www.amazon.in/dp/B0D1R77RKF/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Frantic",
        "price": "₹319",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/41kmmejuwIL._AC_UL320_.jpg",
        "asin": "B0CDRY4BYV",
        "affiliate": "https://www.amazon.in/dp/B0CDRY4BYV/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "CARRYUP",
        "price": "₹349",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/71rYK2Vi2yL._AC_UL320_.jpg",
        "asin": "B0FSCJW5W7",
        "affiliate": "https://www.amazon.in/dp/B0FSCJW5W7/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "blue tree",
        "price": "₹377",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/618w0pFcRKL._AC_UL320_.jpg",
        "asin": "B0CKH441SQ",
        "affiliate": "https://www.amazon.in/dp/B0CKH441SQ/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Safari",
        "price": "₹699",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/81pWGXXhF-L._AC_UL320_.jpg",
        "asin": "B097G723LZ",
        "affiliate": "https://www.amazon.in/dp/B097G723LZ/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Skybags",
        "price": "₹880",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/61Y9tvi3KzL._AC_UL320_.jpg",
        "asin": "B0CT5N38S2",
        "affiliate": "https://www.amazon.in/dp/B0CT5N38S2/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Impulse",
        "price": "₹699",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/51nJnY6bN-L._AC_UL320_.jpg",
        "asin": "B0CXDT9NB2",
        "affiliate": "https://www.amazon.in/dp/B0CXDT9NB2/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Skybags",
        "price": "₹949",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/81B4ymueJqL._AC_UL320_.jpg",
        "asin": "B0FDR62BKK",
        "affiliate": "https://www.amazon.in/dp/B0FDR62BKK/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Tommy Hilfiger",
        "price": "₹1,861",
        "rating": "5.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/51Df9y9TIbL._AC_UL320_.jpg",
        "asin": "B0GJ4F8J1P",
        "affiliate": "https://www.amazon.in/dp/B0GJ4F8J1P/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Umadiya",
        "price": "₹899",
        "rating": "4.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/61bVbW5aA5L._AC_UL320_.jpg",
        "asin": "B0FMP5PDJC",
        "affiliate": "https://www.amazon.in/dp/B0FMP5PDJC/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Impulse",
        "price": "₹699",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/51ObTal+U0L._AC_UL320_.jpg",
        "asin": "B0CX9BKRBF",
        "affiliate": "https://www.amazon.in/dp/B0CX9BKRBF/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Skybags",
        "price": "₹890",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/51mg6+g1GNL._AC_UL320_.jpg",
        "asin": "B0DZGZQQQJ",
        "affiliate": "https://www.amazon.in/dp/B0DZGZQQQJ/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Skybags",
        "price": "₹880",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/61ZZdG4OlZL._AC_UL320_.jpg",
        "asin": "B0DZGJ81H5",
        "affiliate": "https://www.amazon.in/dp/B0DZGJ81H5/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "American Tourister",
        "price": "₹999",
        "rating": "",
        "image": "https://m.media-amazon.com/images/I/81Hf8lYNnBL._AC_UL320_.jpg",
        "asin": "B0GCXRCY9W",
        "affiliate": "https://www.amazon.in/dp/B0GCXRCY9W/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "American Tourister",
        "price": "₹999",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/41qL0FreNLL._AC_UL320_.jpg",
        "asin": "B0C7W2FLJB",
        "affiliate": "https://www.amazon.in/dp/B0C7W2FLJB/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Storite",
        "price": "₹898",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/81ri1gmMwCL._AC_UL320_.jpg",
        "asin": "B0D839H9Q6",
        "affiliate": "https://www.amazon.in/dp/B0D839H9Q6/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Safari",
        "price": "₹899",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/71Ffp3diqGL._AC_UL320_.jpg",
        "asin": "B097GL13SD",
        "affiliate": "https://www.amazon.in/dp/B097GL13SD/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "American Tourister",
        "price": "₹890",
        "rating": "5.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/71Ip7qchqsL._AC_UL320_.jpg",
        "asin": "B0GCXHW1MM",
        "affiliate": "https://www.amazon.in/dp/B0GCXHW1MM/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Skybags",
        "price": "₹1,900",
        "rating": "5.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/617GlFhLTyL._AC_UL320_.jpg",
        "asin": "B0GJC57G7B",
        "affiliate": "https://www.amazon.in/dp/B0GJC57G7B/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Safari",
        "price": "₹687",
        "rating": "5.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/71okqKpsiSL._AC_UL320_.jpg",
        "asin": "B097GDFW8G",
        "affiliate": "https://www.amazon.in/dp/B097GDFW8G/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Stylbase",
        "price": "₹451",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/61Qaolb0MpL._AC_UL320_.jpg",
        "asin": "B0D46425JM",
        "affiliate": "https://www.amazon.in/dp/B0D46425JM/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Skybags",
        "price": "₹999",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/61ZH3EaCj2L._AC_UL320_.jpg",
        "asin": "B0CT5CF79G",
        "affiliate": "https://www.amazon.in/dp/B0CT5CF79G/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "LUXIVA",
        "price": "₹299",
        "rating": "3.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/61U+Uhp7eaL._AC_UL320_.jpg",
        "asin": "B0GM7HF6DS",
        "affiliate": "https://www.amazon.in/dp/B0GM7HF6DS/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Disney",
        "price": "₹1,299",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/71hvr-oKLEL._AC_UL320_.jpg",
        "asin": "B0DBQZ5Z8H",
        "affiliate": "https://www.amazon.in/dp/B0DBQZ5Z8H/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "WORLD OF KITCHENCRAFT",
        "price": "₹299",
        "rating": "3.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/51uQRtjZspL._AC_UL320_.jpg",
        "asin": "B0G4WM1SYY",
        "affiliate": "https://www.amazon.in/dp/B0G4WM1SYY/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Arctic Fox",
        "price": "₹949",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/71YHUNRbMnL._AC_UL320_.jpg",
        "asin": "B0BZVKG4HC",
        "affiliate": "https://www.amazon.in/dp/B0BZVKG4HC/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Frantic",
        "price": "₹619",
        "rating": "3.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/61q0-qt8fVL._AC_UL320_.jpg",
        "asin": "B0F26TDVML",
        "affiliate": "https://www.amazon.in/dp/B0F26TDVML/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "GYNSUN",
        "price": "₹499",
        "rating": "4.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/71K7CsMhR3L._AC_UL320_.jpg",
        "asin": "B0GHP661YF",
        "affiliate": "https://www.amazon.in/dp/B0GHP661YF/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "American Tourister",
        "price": "₹1,299",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/51kD7UYKZyL._AC_UL320_.jpg",
        "asin": "B0CYGP4MPW",
        "affiliate": "https://www.amazon.in/dp/B0CYGP4MPW/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Frantic",
        "price": "₹619",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/71+OyzW4QvL._AC_UL320_.jpg",
        "asin": "B0F26R7PJ6",
        "affiliate": "https://www.amazon.in/dp/B0F26R7PJ6/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "American Tourister",
        "price": "₹1,720",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/41Q-XEKnKpL._AC_UL320_.jpg",
        "asin": "B0BNVV6JS4",
        "affiliate": "https://www.amazon.in/dp/B0BNVV6JS4/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Skybags",
        "price": "₹1,500",
        "rating": "2.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/61Y84YwZotL._AC_UL320_.jpg",
        "asin": "B0GJC5NHTZ",
        "affiliate": "https://www.amazon.in/dp/B0GJC5NHTZ/?tag=mydeals03c-21",
        "category": "Bags"
    },
    
    {
        "title": "Safari Omega Plus Casual Laptop Backpack, 2 compartments, Raincover, Organizer, Full body print, Bottle holder, Front pockets Softline (Black)",
        "price": "₹749",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/81RPmHSijhL._AC_UY218_.jpg",
        "asin": "B097B2PQTG",
        "affiliate": "https://www.amazon.in/dp/B097B2PQTG/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "American Tourister Nexa Style 01 | 36L Backpack | Casual Bag | 3 Compartments | School & College Backpack for Men and Women | Olive | 1 Yr Global Warranty",
        "price": "₹1,399",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/81C1PO3CKbL._AC_UY218_.jpg",
        "asin": "B0FKH35M4C",
        "affiliate": "https://www.amazon.in/dp/B0FKH35M4C/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Large Capacity Waterproof Backpack, Lightweight Travel Laptop Bag with Multiple Compartments, Black School Office Shoulder Bag",
        "price": "₹499",
        "rating": "2.7 out of 5",
        "image": "https://m.media-amazon.com/images/I/313QdeKraYL._AC_UY218_.jpg",
        "asin": "B0FQTVLFKF",
        "affiliate": "https://www.amazon.in/dp/B0FQTVLFKF/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Gear Classic 18\"/20L Faux Leather Water Resistant Anti Theft Laptop Bag | Office Backpack | Travel Backpack | Casual Backpack for Men/Women (Navy - Tan)",
        "price": "₹909",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/81inOWivlCL._AC_UY218_.jpg",
        "asin": "B07G4JQX2F",
        "affiliate": "https://www.amazon.in/dp/B07G4JQX2F/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "American Tourister Valex | 28L Backpack | 17\" Laptop Bag | 2 Compartments | College & Office Backpack for Men and Women | Blue | 1 Year Global Warranty",
        "price": "₹1,399",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/51RWGEpW4VL._AC_UY218_.jpg",
        "asin": "B0BTD4FK9G",
        "affiliate": "https://www.amazon.in/dp/B0BTD4FK9G/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "NORTH ZONE Casual Waterproof Laptop Backpack/Office Bag/School Bag/College Bag/Business Bag/Travel Backpack (Dimensions:13x18 inches) (Compatible with 39.62cm(15.6inch laptop) 30 L",
        "price": "₹464",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/61LB4CRJ9nL._AC_UY218_.jpg",
        "asin": "B0BS6QM2GD",
        "affiliate": "https://www.amazon.in/dp/B0BS6QM2GD/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Gear Superior 17\"/19L Medium Water Resistant Backpack | Casual Backpack | Daypack | Travel Backpack | College Bag For Men/Women (Black - Grey)",
        "price": "₹349",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/81A8ZcnfqBL._AC_UY218_.jpg",
        "asin": "B08GY328RG",
        "affiliate": "https://www.amazon.in/dp/B08GY328RG/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Skybags Fuse Plus 22 Liters Backpack with 17 Inch Laptop Compartment for Men & Women, Side Bottole Pocket, Organiser with Key Chain Holder, Padded Back & Shoulder Strap (Grey)",
        "price": "₹999",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/81iN8ZyF6QL._AC_UY218_.jpg",
        "asin": "B0CMQWV222",
        "affiliate": "https://www.amazon.in/dp/B0CMQWV222/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Aristocrat Nova 15L Laptop Backpack for Men & Women with Bottle Pocket | Padded Shoulder Straps, Multi Compartments | Travel & College Bag | Dark Blue",
        "price": "₹349",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/61chxvJ9RdL._AC_UY218_.jpg",
        "asin": "B0FPWJX447",
        "affiliate": "https://www.amazon.in/dp/B0FPWJX447/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Tinytot 30 Litre, Stylish & Trendy Water Resistant Hi Storage School Collage Travel Laptop Backpack Bag for Boys, Girls, Mens & Womens, 20 Inches (Black)",
        "price": "₹990",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/61q2o3yvJLL._AC_UY218_.jpg",
        "asin": "B0DR5D9JMN",
        "affiliate": "https://www.amazon.in/dp/B0DR5D9JMN/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Skybags Lumous 3 Compartment Laptop Backpack (E) 16 L Black",
        "price": "₹970",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/71bguGWvhZL._AC_UY218_.jpg",
        "asin": "B0CJ3TCKYD",
        "affiliate": "https://www.amazon.in/dp/B0CJ3TCKYD/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Tinytot 30 Litre Japanese Korean Style School Bag Water-Resistant Laptop & Travel Backpack - Unisex Large 18 Inches Multipurpose Student Backpack for Boys & Girls, Men & Women",
        "price": "₹690",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/314rp427gsL._AC_UY218_.jpg",
        "asin": "B0GDVBCGZW",
        "affiliate": "https://www.amazon.in/dp/B0GDVBCGZW/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Medium 35L Durable Fancy Modern Unisex School Bag,Ofice Bag,Travel Bag",
        "price": "₹299",
        "rating": "5.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/51QN3vR8rdL._AC_UY218_.jpg",
        "asin": "B0GVKJC6XC",
        "affiliate": "https://www.amazon.in/dp/B0GVKJC6XC/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Girls bags || college || school bag,s || Tuition bag's || Office bag || Casual Backpacks for Women // Stylish And Trendy Backpack || Water Resistant and Lightweight Bags etc.",
        "price": "₹259",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/41yIMuxi8wL._AC_UY218_.jpg",
        "asin": "B0GV4TPDV6",
        "affiliate": "https://www.amazon.in/dp/B0GV4TPDV6/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Aristocrat Lava 17 Inch Compatible Laptop Backpack 25L | Premium Durable Fabric | 2 Compartments with Side Bottle Pocket | Padded Backpanel | Office & Travel Backpack for Men & Women",
        "price": "₹427",
        "rating": "3.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/71nXs0aNQSL._AC_UY218_.jpg",
        "asin": "B0FMY7DLJT",
        "affiliate": "https://www.amazon.in/dp/B0FMY7DLJT/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "F Gear Brio13L, Kids 4 Compartment School Backpack|Daypack|Tuition Bag|Lightweight Primary/Nursery/Picnic Bag For Girls, Boys|Bottle Holder & Front Zippered Pocket, Padded Shoulder Straps (Navy Blue)",
        "price": "₹499",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/71PPM-SE8XL._AC_UY218_.jpg",
        "asin": "B0CWR8JC6X",
        "affiliate": "https://www.amazon.in/dp/B0CWR8JC6X/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "The Earth Store Handcrafted Creme Matte Brown Ceramic Dinner Set, 30 Pieces Serving for 6, Microwave and Dishwasher Safe, Bone-Ash Free, Dinner Sets | Crockery Set for Gifting & Dining",
        "price": "₹5,899",
        "rating": "3.9 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/81cyY0ge0yL._AC_UL165_SR165,165_.jpg",
        "asin": "B0GKGZ7LMJ",
        "affiliate": "https://www.amazon.in/dp/B0GKGZ7LMJ/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Ice Roller for Face and Eye (Pink), Ice Roller, Face Massager, Facial Roller, Ice Facial Roller, Ice Rooler",
        "price": "₹129",
        "rating": "4.2 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/71m2Mn63IJL._AC_UL165_SR165,165_.jpg",
        "asin": "B0D8TNT77P",
        "affiliate": "https://www.amazon.in/dp/B0D8TNT77P/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Crompton Wave Plus 400 mm wall Fan | Adjustable Height | Smooth Oscillation | Superior Air Delivery | 2 Year Warranty | White",
        "price": "₹2,479",
        "rating": "4.0 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/51SNVdSfblS._AC_UL165_SR165,165_.jpg",
        "asin": "B08QFJMXK1",
        "affiliate": "https://www.amazon.in/dp/B08QFJMXK1/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "INOVERA Ice Roller for Face Massager | Reusable Ice Holder Tool for Glowing & Clear Skin | Easy to Use and Carry | Cold Massage Therapy for Skin (Black)",
        "price": "₹159",
        "rating": "4.1 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/71lEO9SCqML._AC_UL165_SR165,165_.jpg",
        "asin": "B0CL24GV58",
        "affiliate": "https://www.amazon.in/dp/B0CL24GV58/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "atomberg Renesa | 400mm BLDC Wall | Silent Operation | Home, Office | 35W | Save ₹400 every summer | Remote with Oscillation, Timer, Sleep modes | 2 Yrs Warranty | Midnight Black",
        "price": "₹400",
        "rating": "4.1 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/81m8RU7ZV0L._AC_UL165_SR165,165_.jpg",
        "asin": "B0BGC19X9B",
        "affiliate": "https://www.amazon.in/dp/B0BGC19X9B/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "RIXTEC ice roller for face women skin glowing ice cube massager Face Puffiness Relief Massage Skin Care Tools for face eye(Multi color)(Facial roller)",
        "price": "₹129",
        "rating": "4.4 out of 5",
        "image": "https://images-eu.ssl-images-amazon.com/images/I/61Zc+oboyuL._AC_UL165_SR165,165_.jpg",
        "asin": "B0DQPJTPHW",
        "affiliate": "https://www.amazon.in/dp/B0DQPJTPHW/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Nayasa Plastic Laundry Basket with Lid - 54 Ltrs | Strong & Sturdy Rope Design | Clothes Storage Hamper | Laundry Basket for Clothes |(Rope) Brown\nNayasa Plastic Laundry Basket with Lid - 54 Ltrs | Strong & Sturdy Rope Design | Clothes Storage Hamper | Laundry Bas…",
        "price": "₹1,785",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/6110dbFGw2L._AC_SR405%2C405_.jpg",
        "asin": "B075SKQTCZ",
        "affiliate": "https://www.amazon.in/dp/B075SKQTCZ/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Nayasa Plastic Laundry Basket with Lid - 51 Ltrs | Clothes Storage Hamper | Multipurpose Organizer | Clothes Bin Laundry |(Square) Dark Brown\nNayasa Plastic Laundry Basket with Lid - 51 Ltrs | Clothes Storage Hamper | Multipurpose Organizer | Clothes Bin…",
        "price": "₹1,073",
        "rating": "3.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/71qVMTcunVL._AC_SR405%2C405_.jpg",
        "asin": "B018G77402",
        "affiliate": "https://www.amazon.in/dp/B018G77402/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Nayasa Plastic Laundry Basket with Lid - 44 Ltrs | Ventilated Clothes Hamper with Easy-Grip Handles | Clothes & Toy Storage Organizer |(Round Petal) Brown\nNayasa Plastic Laundry Basket with Lid - 44 Ltrs | Ventilated Clothes Hamper with Easy-Grip Handles | Clothes & To…",
        "price": "₹655",
        "rating": "3.9 out of 5",
        "image": "https://m.media-amazon.com/images/I/81rYyBM4TQL._AC_SR405%2C405_.jpg",
        "asin": "B0FNCM362M",
        "affiliate": "https://www.amazon.in/dp/B0FNCM362M/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "The Better Home | Laundry Baskets | Fabric | Multiple use cases for home organization | Foldable laundry bag for clothes| Basket with Lid | Large Capacity\nThe Better Home | Laundry Baskets | Fabric | Multiple use cases for home organization | Foldable laundry bag f…",
        "price": "₹1,399",
        "rating": "3.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/71urxlmDYKL._AC_SR405%2C405_.jpg",
        "asin": "B0F2F8NQYM",
        "affiliate": "https://www.amazon.in/dp/B0F2F8NQYM/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Amazon Brand - Solimo Knit Laundry Basket - Big - 55 Litres - 44 Cm X 35 Cm X 61 Cm | Dark Grey - Plastic\nAmazon Brand - Solimo Knit Laundry Basket - Big - 55 Litres - 44 Cm X 35 Cm X 61 Cm | Dark Grey - Plastic",
        "price": "₹999",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/813MEOpHwLL._AC_SR405%2C405_.jpg",
        "asin": "B0CP5WQ77N",
        "affiliate": "https://www.amazon.in/dp/B0CP5WQ77N/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "PrettyKrafts 45L Non Woven Trio Printed Round Foldable Large Laundry Bag/Basket With Handles, Freestanding Clothes Storage Organizer for Bedroom, Bathroom, Dorm (36x36x45cm, Blue, Set of 1)\nPrettyKrafts 45L Non Woven Trio Printed Round Foldable Large Laundry Bag/Basket With Handles, Freesta…",
        "price": "₹159",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/61EHLhSA+yL._AC_SR405%2C405_.jpg",
        "asin": "B07WX29FYS",
        "affiliate": "https://www.amazon.in/dp/B07WX29FYS/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "RATAN PLASTICWARE Tidy Bin with Swing Lid 25 Litres Plastic Dustbin, Trash Bin, Garbage Waste Bin For Home, Bathroom, Kitchen, Office, Bedroom Grey Color\nRATAN PLASTICWARE Tidy Bin with Swing Lid 25 Litres Plastic Dustbin, Trash Bin, Garbage Waste Bin For Home, B…",
        "price": "₹649",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/51dFESzUHgL._AC_SR405%2C405_.jpg",
        "asin": "B0C8TNJV3Y",
        "affiliate": "https://www.amazon.in/dp/B0C8TNJV3Y/?tag=mydeals03c-21",
        "category": "Bags"
    },

    {
        "title": "BLUE WORLD",
        "price": "₹498",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/61LOeB-ug0L._AC_UL320_.jpg",
        "asin": "B0FYZ13169",
        "affiliate": "https://www.amazon.in/dp/B0FYZ13169/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Generic",
        "price": "₹299",
        "rating": "3.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/51r-KN2CArL._AC_UL320_.jpg",
        "asin": "B0GTMTMD15",
        "affiliate": "https://www.amazon.in/dp/B0GTMTMD15/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "LEGAL BRIBE",
        "price": "₹569",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/71OW7nY-JdL._AC_UL320_.jpg",
        "asin": "B0CQP1QYBW",
        "affiliate": "https://www.amazon.in/dp/B0CQP1QYBW/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "INOVERA (LABEL) Hand Bags for Women Combo - Faux Leather Stylish Ladies Handbag Purse - Crossbody Shoulder Sling Bag with Adjustable Strap",
        "price": "₹1,699",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/71s6O7Cy4qL._AC_UL640_QL65_.jpg",
        "asin": "B0DJXKYQVM",
        "affiliate": "https://www.amazon.in/dp/B0DJXKYQVM/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Carrylux",
        "price": "₹420",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/71M7n4XqWCL._AC_UL320_.jpg",
        "asin": "B0CP9GGP5X",
        "affiliate": "https://www.amazon.in/dp/B0CP9GGP5X/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "HaveGlam",
        "price": "₹294",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/61wxgP4SadL._AC_UL320_.jpg",
        "asin": "B0GPWQQG52",
        "affiliate": "https://www.amazon.in/dp/B0GPWQQG52/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Fargo",
        "price": "₹467",
        "rating": "3.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/51-+SFrhYFL._AC_UL320_.jpg",
        "asin": "B09N3K2ZCP",
        "affiliate": "https://www.amazon.in/dp/B09N3K2ZCP/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Generic",
        "price": "₹219",
        "rating": "3.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/51BAYzPFzWL._AC_UL320_.jpg",
        "asin": "B0CW9T7BC3",
        "affiliate": "https://www.amazon.in/dp/B0CW9T7BC3/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "ADISA",
        "price": "₹695",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/81mAaCC+-zL._AC_UL320_.jpg",
        "asin": "B0D6X2FBM6",
        "affiliate": "https://www.amazon.in/dp/B0D6X2FBM6/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "LEGAL BRIBE",
        "price": "₹492",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/71iHbv5vkqL._AC_UL320_.jpg",
        "asin": "B0CP84GDFW",
        "affiliate": "https://www.amazon.in/dp/B0CP84GDFW/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Generic",
        "price": "₹310",
        "rating": "4.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/611sFnKI7RL._AC_UL320_.jpg",
        "asin": "B0GF7SG8R4",
        "affiliate": "https://www.amazon.in/dp/B0GF7SG8R4/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Lavie",
        "price": "₹1,049",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/81SRDNUx+kL._AC_UL320_.jpg",
        "asin": "B0B3JBRB6J",
        "affiliate": "https://www.amazon.in/dp/B0B3JBRB6J/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "AESTHETIC HANDBAGS",
        "price": "₹298",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/51gcz3ppyJL._AC_UL320_.jpg",
        "asin": "B0G9KZ8YV7",
        "affiliate": "https://www.amazon.in/dp/B0G9KZ8YV7/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "EXOTIC",
        "price": "₹1,225",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/71oW9ddfGsL._AC_UL320_.jpg",
        "asin": "B09RW3DK6W",
        "affiliate": "https://www.amazon.in/dp/B09RW3DK6W/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "ROSS BROWN",
        "price": "₹420",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/81Uaf69-v4L._AC_UL320_.jpg",
        "asin": "B0C97JVGR9",
        "affiliate": "https://www.amazon.in/dp/B0C97JVGR9/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Lavie",
        "price": "₹1,599",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/517uFyY5B4L._AC_UL320_.jpg",
        "asin": "B0F66SQJYL",
        "affiliate": "https://www.amazon.in/dp/B0F66SQJYL/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "KEALIN",
        "price": "₹205",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/31IHJC6BjTL._AC_UL320_.jpg",
        "asin": "B0GRS9K5PW",
        "affiliate": "https://www.amazon.in/dp/B0GRS9K5PW/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "JI ACCESSORIES",
        "price": "₹271",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/91pJW57LGLL._AC_UL320_.jpg",
        "asin": "B0FQQLTDZH",
        "affiliate": "https://www.amazon.in/dp/B0FQQLTDZH/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Lavie",
        "price": "₹1,149",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/61INAsuttVL._AC_UL320_.jpg",
        "asin": "B0D2DLQMGY",
        "affiliate": "https://www.amazon.in/dp/B0D2DLQMGY/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "kate spade new york",
        "price": "₹53,254",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/71Xd7wtZZNL._AC_UL320_.jpg",
        "asin": "B0DSJWHKRL",
        "affiliate": "https://www.amazon.in/dp/B0DSJWHKRL/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Lavie",
        "price": "₹949",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/61SXM77U-9L._AC_UL320_.jpg",
        "asin": "B08J8KM544",
        "affiliate": "https://www.amazon.in/dp/B08J8KM544/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "U.S. Polo Assn.",
        "price": "₹4,759",
        "rating": "4.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/81QxAtxHHtL._AC_UL320_.jpg",
        "asin": "B0DRKDZ9BL",
        "affiliate": "https://www.amazon.in/dp/B0DRKDZ9BL/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "EXOTIC",
        "price": "₹1,199",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/61ljZ3YohfL._AC_UL320_.jpg",
        "asin": "B092VKKY65",
        "affiliate": "https://www.amazon.in/dp/B092VKKY65/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Fastrack",
        "price": "₹1,699",
        "rating": "4.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/61fBsjTMrFL._AC_UL320_.jpg",
        "asin": "B0G49FSM47",
        "affiliate": "https://www.amazon.in/dp/B0G49FSM47/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Lavie",
        "price": "₹799",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/81QX9Dat3JL._AC_UL320_.jpg",
        "asin": "B094J474T3",
        "affiliate": "https://www.amazon.in/dp/B094J474T3/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Generic",
        "price": "₹220",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/51daBCjkGQL._AC_UL320_.jpg",
        "asin": "B0GS6DR63J",
        "affiliate": "https://www.amazon.in/dp/B0GS6DR63J/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Lavie",
        "price": "₹1,649",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/719m2tHI6sL._AC_UL320_.jpg",
        "asin": "B0F13YHLZJ",
        "affiliate": "https://www.amazon.in/dp/B0F13YHLZJ/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Lavie",
        "price": "₹1,599",
        "rating": "4.2 out of 5",
        "image": "https://m.media-amazon.com/images/I/61b92ZDJ1jL._AC_UL320_.jpg",
        "asin": "B0F66SNH8H",
        "affiliate": "https://www.amazon.in/dp/B0F66SNH8H/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "EXOTIC",
        "price": "₹1,199",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/71NopnO547L._AC_UL320_.jpg",
        "asin": "B0D2DKZXWK",
        "affiliate": "https://www.amazon.in/dp/B0D2DKZXWK/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "ZOUK",
        "price": "₹1,088",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/71a9TRSsXIL._AC_UL320_.jpg",
        "asin": "B0BQWF3TJK",
        "affiliate": "https://www.amazon.in/dp/B0BQWF3TJK/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Lavie",
        "price": "₹1,649",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/618dMyAnB2L._AC_UL320_.jpg",
        "asin": "B0F8HTWZZQ",
        "affiliate": "https://www.amazon.in/dp/B0F8HTWZZQ/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Miraggio",
        "price": "₹2,924",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/616-SwgH17L._AC_UL320_.jpg",
        "asin": "B0B3RBHN46",
        "affiliate": "https://www.amazon.in/dp/B0B3RBHN46/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "ForeverCarry",
        "price": "₹399",
        "rating": "4.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/51TMAlmLGvL._AC_UL320_.jpg",
        "asin": "B0GF99QBKR",
        "affiliate": "https://www.amazon.in/dp/B0GF99QBKR/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Mochi",
        "price": "₹2,029",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/81+DHfEACGL._AC_UL320_.jpg",
        "asin": "B0DZH65YWV",
        "affiliate": "https://www.amazon.in/dp/B0DZH65YWV/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Lavie",
        "price": "₹949",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/61MOAimHqGL._AC_UL320_.jpg",
        "asin": "B08J8MV1GM",
        "affiliate": "https://www.amazon.in/dp/B08J8MV1GM/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Caprese",
        "price": "₹2,229",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/71L77sQAUbL._AC_UL320_.jpg",
        "asin": "B0FM4CVD61",
        "affiliate": "https://www.amazon.in/dp/B0FM4CVD61/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Van Heusen",
        "price": "₹2,309",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/51hCAGzd39L._AC_UL320_.jpg",
        "asin": "B0F3HSQWGQ",
        "affiliate": "https://www.amazon.in/dp/B0F3HSQWGQ/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "GUESS",
        "price": "₹15,000",
        "rating": "4.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/71nelvKOMIL._AC_UL320_.jpg",
        "asin": "B0BS5BZ2NM",
        "affiliate": "https://www.amazon.in/dp/B0BS5BZ2NM/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Lavie",
        "price": "₹949",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/71eAa-K89QL._AC_UL320_.jpg",
        "asin": "B0DZ71X3QP",
        "affiliate": "https://www.amazon.in/dp/B0DZ71X3QP/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Lavie",
        "price": "₹949",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/51sLex9cbWL._AC_UL320_.jpg",
        "asin": "B08J8M2B42",
        "affiliate": "https://www.amazon.in/dp/B08J8M2B42/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Caprese",
        "price": "₹2,419",
        "rating": "3.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/61ZDYXWzdhL._AC_UL320_.jpg",
        "asin": "B0FXB2RKXR",
        "affiliate": "https://www.amazon.in/dp/B0FXB2RKXR/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Lavie",
        "price": "₹1,749",
        "rating": "4.1 out of 5",
        "image": "https://m.media-amazon.com/images/I/61ga12jfJCL._AC_UL320_.jpg",
        "asin": "B0F18JSXWZ",
        "affiliate": "https://www.amazon.in/dp/B0F18JSXWZ/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "ETLIS",
        "price": "₹449",
        "rating": "4.5 out of 5",
        "image": "https://m.media-amazon.com/images/I/51W9pOi-uaL._AC_UL320_.jpg",
        "asin": "B0GMQY6NYF",
        "affiliate": "https://www.amazon.in/dp/B0GMQY6NYF/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Lavie",
        "price": "₹799",
        "rating": "4.3 out of 5",
        "image": "https://m.media-amazon.com/images/I/718Oh-VUpJL._AC_UL320_.jpg",
        "asin": "B094J5JLN9",
        "affiliate": "https://www.amazon.in/dp/B094J5JLN9/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Lavie",
        "price": "₹1,349",
        "rating": "4.0 out of 5",
        "image": "https://m.media-amazon.com/images/I/816e9RE9WNL._AC_UL320_.jpg",
        "asin": "B0B1F7GW5X",
        "affiliate": "https://www.amazon.in/dp/B0B1F7GW5X/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Lyrovo",
        "price": "₹465",
        "rating": "4.4 out of 5",
        "image": "https://m.media-amazon.com/images/I/61Qn7SrsJJL._AC_UL320_.jpg",
        "asin": "B0F6TZ572V",
        "affiliate": "https://www.amazon.in/dp/B0F6TZ572V/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Miraggio",
        "price": "₹3,499",
        "rating": "4.6 out of 5",
        "image": "https://m.media-amazon.com/images/I/71idMvAkElL._AC_UL320_.jpg",
        "asin": "B0CNPX6CJF",
        "affiliate": "https://www.amazon.in/dp/B0CNPX6CJF/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Carrylux",
        "price": "₹498",
        "rating": "4.8 out of 5",
        "image": "https://m.media-amazon.com/images/I/61FfZyulIZL._AC_UL320_.jpg",
        "asin": "B0GK34HKMN",
        "affiliate": "https://www.amazon.in/dp/B0GK34HKMN/?tag=mydeals03c-21",
        "category": "Bags"
    },
    {
        "title": "Allen Solly",
        "price": "₹4,449",
        "rating": "",
        "image": "https://m.media-amazon.com/images/I/518TUBhYlqL._AC_UL320_.jpg",
        "asin": "B0G4WJ962B",
        "affiliate": "https://www.amazon.in/dp/B0G4WJ962B/?tag=mydeals03c-21",
        "category": "Bags"
    }


























];

function parsePrice(str) {
  return parseFloat(String(str).replace(/[₹,]/g, '')) || 0;
}

function parseRating(str) {
  return parseFloat(str) || 0;
}

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅  MongoDB connected\n');

    let added = 0, skipped = 0;

    for (const item of products) {
      const exists = await Product.findOne({ affiliateLink: item.affiliate });
      if (exists) {
        console.log(`⏭️   Already exists: ${item.title.slice(0, 55)}…`);
        skipped++;
        continue;
      }

      await Product.create({
        name:          item.title,
        description:   item.title,
        price:         parsePrice(item.price),
        image:         item.image,
        category:      item.category || 'Home Decor',
        affiliateLink: item.affiliate,
        rating:        parseRating(item.rating),
        featured:      false,
      });

      console.log(`✅  Added: ${item.title.slice(0, 55)}…`);
      added++;
    }

    console.log(`\n🎉  Done!  Added: ${added}  |  Skipped: ${skipped}`);
    process.exit(0);
  } catch (err) {
    console.error('❌  Error:', err.message);
    process.exit(1);
  }
}

run();