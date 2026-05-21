// bulk-import.js
// Place this file in: backend/bulk-import.js
// Run: node bulk-import.js
//
// This imports all 50 Home Decor products directly into MongoDB
// Images use Amazon CDN URLs directly — no upload needed

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
        category:      'Home Decor',
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