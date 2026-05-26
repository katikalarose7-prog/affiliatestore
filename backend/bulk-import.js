// bulk-import.js
// Place this file in: backend/bulk-import.js
// Run: node bulk-import.js
//
// This imports all 50 Beauty products directly into MongoDB
// Images use Amazon CDN URLs directly — no upload needed
const cloudinary = require('./config/cloudinary')
const fs = require('fs')

require('dotenv').config();
const mongoose = require('mongoose');
const Product  = require('./models/Product');

const products = 
    [
    {
        "title": "Tabletop Spice Rack For Your Kitchen_Countertop Spice s And Masala Rack 2 -Tiered Shelf And 2 Layer Stainless Steel And Special Countertop Spice Rack-(Pack Of One) (Nhsp)",
        "price": "₹240",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F817myYN1wgL._AC_UL320_.jpg",
        "asin": "B0CLGK218X",
        "affiliate": "https://www.amazon.in/dp/B0CLGK218X/?tag=primeoffers02-21",
        "category": "Kitchen",
        "region": "india"
    },
    {
        "title": "Cri8Hub Stainless Steel 2 Tiered Shelf Kitchen Rack - Spice Boxes Organizer –Kitchen Rack Stand - Cosmetic Organizer – Counter Top Organiser - Floor Mounted Shelf For Home(Multipurpose Rack)",
        "price": "₹275",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71A5JJpZuDL._AC_UL320_.jpg",
        "asin": "B0CV8348ZZ",
        "affiliate": "https://www.amazon.in/dp/B0CV8348ZZ/?tag=primeoffers02-21",
        "category": "Kitchen",
        "region": "india"
    },
    {
        "title": "OXMIC 2-Tier Countertop Organiser, Brown, Engineered Wood, Matte Finish, Modern Style, 32x21x15 cm, Lightweight",
        "price": "₹799",
        "rating": "",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61L6KxA55UL._AC_UL320_.jpg",
        "asin": "B0GY4219HH",
        "affiliate": "https://www.amazon.in/dp/B0GY4219HH/?tag=primeoffers02-21",
        "category": "Kitchen",
        "region": "india"
    },
    {
        "title": "3-Tier Spice Rack, 13.8 Inch Wood Step Shelf Countertop Spice Storage Holder, Kitchen Pantry Cabinet Organizer Cupboard for Spice Bottles, Jars, Seasonings, Baking Supplies,",
        "price": "₹299",
        "rating": "3.9 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71ro-ziYhEL._AC_UL320_.jpg",
        "asin": "B0GRVKDBVX",
        "affiliate": "https://www.amazon.in/dp/B0GRVKDBVX/?tag=primeoffers02-21",
        "category": "Kitchen",
        "region": "india"
    },
    {
        "title": "Dillard's Plastic Multipurpose 4-Tier Floor Mount Corner Shelf Kitchen Organizer Rack/Storage Shelf/Dish Rack/Storage Rack For Kitchen",
        "price": "₹499",
        "rating": "3.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61m039qSy2L._AC_UL320_.jpg",
        "asin": "B0FGJYFV3L",
        "affiliate": "https://www.amazon.in/dp/B0FGJYFV3L/?tag=primeoffers02-21",
        "category": "Kitchen",
        "region": "india"
    },
    {
        "title": "CHHAAP Stainless Steel 2 Level Kitchen Storage Rack for Corners, Multipurpose Kitchen Space Organizer Corner Shelf Rack Stand Holder (NHSP) (Pack of 1)",
        "price": "₹245",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61monv8vHqL._AC_UL320_.jpg",
        "asin": "B0F6KMLLZ7",
        "affiliate": "https://www.amazon.in/dp/B0F6KMLLZ7/?tag=primeoffers02-21",
        "category": "Kitchen",
        "region": "india"
    },
    {
        "title": "WonderStand Iron 2-Tier Countertop MultipurposeOrganizer|Tiered Shelf Storage Rack, Counter Top Organiser Storage Shelf For Home Kitchen And Bathroom",
        "price": "₹499",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61uDpiEO7pL._AC_UL320_.jpg",
        "asin": "B0CYM12DPZ",
        "affiliate": "https://www.amazon.in/dp/B0CYM12DPZ/?tag=primeoffers02-21",
        "category": "Kitchen",
        "region": "india"
    },
    {
        "title": "Stainless Steel 4-in-1 Chakla Belan Tawa Chimta Stand | Wall Mounted Kitchen Organizer Rack for Rolling Pin Board Tong & Tawa | Space Saving Corner Shelf",
        "price": "₹299",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F611DtPqRWZL._AC_UL320_.jpg",
        "asin": "B0GD7H6Y8J",
        "affiliate": "https://www.amazon.in/dp/B0GD7H6Y8J/?tag=primeoffers02-21",
        "category": "Kitchen",
        "region": "india"
    },
    {
        "title": "TEX-RO 3-Layer Kitchen Rack Stand/Multipurpose Rack for Storage/Vegetable Stand for Kitchen Storage Rack/Durable Kitchen Racks for Storage (Grey)",
        "price": "₹299",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71fF87VT4BL._AC_UL320_.jpg",
        "asin": "B0FLKBTVPM",
        "affiliate": "https://www.amazon.in/dp/B0FLKBTVPM/?tag=primeoffers02-21",
        "category": "Kitchen",
        "region": "india"
    },
    {
        "title": "FireBees 2 Tier Kitchen Counter Organizer, Wooden Kitchen Organizer Rack for Spices & Storage, Kitchen Shelf Organiser Stand, Masala Organizer Rack, Aesthetic Kitchen Organizer Items 33 x 16 x 25 cm",
        "price": "₹349",
        "rating": "4.8 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F518T84qOyML._AC_UL320_.jpg",
        "asin": "B0GW9H1KC7",
        "affiliate": "https://www.amazon.in/dp/B0GW9H1KC7/?tag=primeoffers02-21",
        "category": "Kitchen",
        "region": "india"
    },
    {
        "title": "KWER Metal Kitchen Trolley, Portable Square Storage Baskets Organizer with Wheels for Onion, Kitchen Accessories Items & Vegetable, Black, Layer-2",
        "price": "₹1,689",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F91MVCokgdmL._AC_UL640_QL65_.jpg",
        "asin": "B0BZRKQT3H",
        "affiliate": "https://www.amazon.in/dp/B0BZRKQT3H/?tag=primeoffers02-21",
        "category": "Kitchen",
        "region": "india"
    },
    {
        "title": "Cri8Hub Stainless Steel 2 Tier Kitchen Rack - Spice Boxes Organizer –Kitchen Stand - Cosmetic Organizer – Counter Top Basket -Floor Mounted Shelf For Home And Bathroom, Step Shelf",
        "price": "₹275",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61vSpZFFeGL._AC_UL320_.jpg",
        "asin": "B0CJJ9LK8G",
        "affiliate": "https://www.amazon.in/dp/B0CJJ9LK8G/?tag=primeoffers02-21",
        "category": "Kitchen",
        "region": "india"
    },
    {
        "title": "Stainless Steel Under Cabinet Kitchen Dish Rack Expandable Storage Floating Shelves For Kitchen Multipurpose Organizer Extend Up To 580 Mm With Anti-Rust Nano Coating(Pack Of 2)(Nhsp)",
        "price": "₹249",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61BIGG5Yr%2BL._AC_UL320_.jpg",
        "asin": "B0CH6MD3LV",
        "affiliate": "https://www.amazon.in/dp/B0CH6MD3LV/?tag=primeoffers02-21",
        "category": "Kitchen",
        "region": "india"
    },
    {
        "title": "CR18 COLLECTION Heavy Big Size 2-Layer Stainless Steel Spice Rack | Modular kitchen Storage Organizer | Multipurpose Space Saver Rack for Efficient kitchen Organization",
        "price": "₹245",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71-Fb1WV0bL._AC_UL320_.jpg",
        "asin": "B0BHNMMGZM",
        "affiliate": "https://www.amazon.in/dp/B0BHNMMGZM/?tag=primeoffers02-21",
        "category": "Kitchen",
        "region": "india"
    },
    {
        "title": "OXMIC kitchen organizer items and storage, kitchen organiser, kitchen stand, kitchen rack organizer, 2-Tier Wooden Spice Rack Organizer, 33 x 16 x 25 cm, White Shelves",
        "price": "₹325",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F715lovtJIHL._AC_UL320_.jpg",
        "asin": "B0FQ2DKRJ4",
        "affiliate": "https://www.amazon.in/dp/B0FQ2DKRJ4/?tag=primeoffers02-21",
        "category": "Kitchen",
        "region": "india"
    },
    {
        "title": "Shoper cart kitchen organizer rack, 2-Tier Spice Rack Organiser, Rustic Brown and Black, 30cm x 15.7cm x 26.4cm, Kitchen Counter Storage Shelf with Metal Frame",
        "price": "₹799",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61L6KxA55UL._AC_UL320_.jpg",
        "asin": "B0GKG8H377",
        "affiliate": "https://www.amazon.in/dp/B0GKG8H377/?tag=primeoffers02-21",
        "category": "Kitchen",
        "region": "india"
    },
    {
        "title": "Go Hooked Kitchen 3-Tier Step Standing rack Kitchen Spice Bottle Rack Utensil Holder Food Storage Organizer for Cabinet Pantry Shelf Bathroom Rack (Black, Pack of 1, Iron, Step Shelf, Countertop)",
        "price": "₹538",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71mLcdqP78L._AC_UL320_.jpg",
        "asin": "B0BYPGZQWB",
        "affiliate": "https://www.amazon.in/dp/B0BYPGZQWB/?tag=primeoffers02-21",
        "category": "Kitchen",
        "region": "india"
    },
    {
        "title": "3 Tier Wooden Kitchen Organizer Rack for Countertop | Wooden Spice Rack Stand for Kitchen Counter | Kitchen Shelf Organizer & Cabinet Shelf Riser | Decorative Masala Rack Storage Stand | Dark Brown",
        "price": "₹299",
        "rating": "3.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71DUQsQqCPL._AC_UL320_.jpg",
        "asin": "B0GRK2JW8X",
        "affiliate": "https://www.amazon.in/dp/B0GRK2JW8X/?tag=primeoffers02-21",
        "category": "Kitchen",
        "region": "india"
    },
    {
        "title": "Privesh Stainless Steel Modern Kitchen Storage Rack, Folding Perforated Design Trolley for Spice, Fruits, Vegetable, Onion, Potato, Organizer Stand with Wheel, 4 Layer Trolley",
        "price": "₹968",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F611g96ubcaL._AC_UL320_.jpg",
        "asin": "B0BRVDXZ28",
        "affiliate": "https://www.amazon.in/dp/B0BRVDXZ28/?tag=primeoffers02-21",
        "category": "Kitchen",
        "region": "india"
    },
    {
        "title": "Lyrovo Countertop Organizer Organization, 2 Tier Moveable Corner Shelf for Kitchen, Bathroom, Spice Rack, Coffee Area, Over Sink, Dresser Table",
        "price": "₹640",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F715wrOJLSSL._AC_UL320_.jpg",
        "asin": "B0BF4Y2YMT",
        "affiliate": "https://www.amazon.in/dp/B0BF4Y2YMT/?tag=primeoffers02-21",
        "category": "Kitchen",
        "region": "india"
    },
    {
        "title": "DEMIQON 5-Shelf Stainless Steel Wall-Mounted Dish Drying Rack (31x30 Inches) – Multi-Purpose Kitchen Organizer for Plates, Bowls, and Utensils",
        "price": "₹1,799",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51jmCVYLJvL._AC_UL320_.jpg",
        "asin": "B0DR6YD9JX",
        "affiliate": "https://www.amazon.in/dp/B0DR6YD9JX/?tag=primeoffers02-21",
        "category": "Kitchen",
        "region": "india"
    },
    {
        "title": "Rasvesh Multi-Purpose Trolley Storage Organizer and Kitchen Accessories Items for Kitchen Storage Rack Square Design Fruits & Vegetable Onion Cutler (5 Tier)",
        "price": "₹2,428",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61DCMZUkMtL._AC_UL320_.jpg",
        "asin": "B0C3MCBSDD",
        "affiliate": "https://www.amazon.in/dp/B0C3MCBSDD/?tag=primeoffers02-21",
        "category": "Kitchen",
        "region": "india"
    },
    {
        "title": "3-Tier Spice Rack, 13.8 Inch Wood Step Shelf Countertop Spice Storage Holder, Kitchen Pantry Cabinet Organizer Cupboard for Spice Bottles, Jars, Seasonings, Baking Supplies,",
        "price": "₹289",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51QCC-JFK2L._AC_UL320_.jpg",
        "asin": "B0G3P735DB",
        "affiliate": "https://www.amazon.in/dp/B0G3P735DB/?tag=primeoffers02-21",
        "category": "Kitchen",
        "region": "india"
    },
    {
        "title": "Satpurush 2 Tier Kitchen Organizer Rack Countertop Shelf, Space Saving Kitchen Rack for Spice Jars Oil Bottles and Containers, Modern Metal Kitchen Organiser for Neat Home Storage",
        "price": "₹349",
        "rating": "3.7 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71ZtXNlq3LL._AC_UL320_.jpg",
        "asin": "B0GVN2FL9C",
        "affiliate": "https://www.amazon.in/dp/B0GVN2FL9C/?tag=primeoffers02-21",
        "category": "Kitchen",
        "region": "india"
    },
    {
        "title": "Go Hooked 2-Tier Standing Rack | Bathroom Countertop Organizer | Vanity Tray | Cosmetic- Makeup Storage | Kitchen Spice Rack | Corner Shelf (Black, Metal, Pack of 1)",
        "price": "₹699",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81G2cm8quOL._AC_UL320_.jpg",
        "asin": "B0CRF29MFR",
        "affiliate": "https://www.amazon.in/dp/B0CRF29MFR/?tag=primeoffers02-21",
        "category": "Kitchen",
        "region": "india"
    },
    {
        "title": "Wall-Mounted Wooden Kitchen Organizer Rack Shelf Multipurpose Utensil Stand & Storage Shelf for Wall, Rusti Wood Kitchen Rack Organizer for Spices, Jars, Mugs, and Essentials |",
        "price": "₹669",
        "rating": "3.5 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51y7ZsKWdSL._AC_UL320_.jpg",
        "asin": "B0DH3CVLV2",
        "affiliate": "https://www.amazon.in/dp/B0DH3CVLV2/?tag=primeoffers02-21",
        "category": "Kitchen",
        "region": "india"
    },
    {
        "title": "TEX-RO Kitchen Trolley with Wheels | 3-Layer Metal Vegetable Basket Stand & Kitchen Storage Rack | Multipurpose Kitchen Organizer for Onion Potato Storage (Black)",
        "price": "₹1,776",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81zSFh5uwdL._AC_UL320_.jpg",
        "asin": "B0B3JST2F4",
        "affiliate": "https://www.amazon.in/dp/B0B3JST2F4/?tag=primeoffers02-21",
        "category": "Kitchen",
        "region": "india"
    },
    {
        "title": "12FOR COLLECTION Stainless Steel 2-Tier Free Standing Kitchen Rack-Spice Container Organizer, Jar Holder Rack, Glass Holder, Corner Dish Rack For Kitchen (3 Layer Corner Rack, Corner Shelf)",
        "price": "₹260",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51D1xsF8iIL._AC_UL320_.jpg",
        "asin": "B0CP87FSY5",
        "affiliate": "https://www.amazon.in/dp/B0CP87FSY5/?tag=primeoffers02-21",
        "category": "Kitchen",
        "region": "india"
    },
    {
        "title": "Steeliness Steel Dish Rack Plate Stand For 6 Layer Table Stand, Plates Holder Kitchen, Kitchen Rack, Stainless (Pack Of One, Nhspcountertop, Floating Shelves)",
        "price": "₹156",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51WcVum6kmL._AC_UL320_.jpg",
        "asin": "B0CLVJVXC6",
        "affiliate": "https://www.amazon.in/dp/B0CLVJVXC6/?tag=primeoffers02-21",
        "category": "Kitchen",
        "region": "india"
    },
    {
        "title": "MT WoodRyzn Multipurpose Wooden Countertop Spice Rack Kitchen Organizer 2-Tier Kitchen Storage Jars Holder & Kithen Decor Item Standing Shelf Pot Stand Book Shelf Pack Of 1",
        "price": "₹179",
        "rating": "3.9 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51MdiT5KRnL._AC_UL320_.jpg",
        "asin": "B0DJCDVLBS",
        "affiliate": "https://www.amazon.in/dp/B0DJCDVLBS/?tag=primeoffers02-21",
        "category": "Kitchen",
        "region": "india"
    },
    {
        "title": "SHIOK DECOR 2-Tier Standing Spice Rack and Bathroom Countertop Organizer - Kitchen Cabinet Tray, Multipurpose Storage Shelf for Dresser, Tiered Shelf Stand for Kitchen, Bathroom - Black",
        "price": "₹772",
        "rating": "4.7 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81CipsAU41L._AC_UL320_.jpg",
        "asin": "B0DSVQ9DLC",
        "affiliate": "https://www.amazon.in/dp/B0DSVQ9DLC/?tag=primeoffers02-21",
        "category": "Kitchen",
        "region": "india"
    },
    {
        "title": "12FOR COLLECTION 2pcs Stainless Steel Kitchen Dish Rack Expandable Storage Shelves for Kitchen Cabinets Multipurpose Organizer Extend Up to 580 mm , Free Standing, Tiered Shelf",
        "price": "₹245",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51wXsnRgRwL._AC_UL320_.jpg",
        "asin": "B09XDQZHW2",
        "affiliate": "https://www.amazon.in/dp/B09XDQZHW2/?tag=primeoffers02-21",
        "category": "Kitchen",
        "region": "india"
    },
    {
        "title": "Craft Mshopr Wall Mounted Kitchen Spice Rack Organizer – Black Iron Hanging Spice Shelf with 7 S-Shaped Hooks for Utensils | Space-Saving Spice Holder (16\" L x 5.25\" W x 2.5\" H) (Pack-1)",
        "price": "₹299",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61X82eDEWpL._AC_UL320_.jpg",
        "asin": "B0FNND3828",
        "affiliate": "https://www.amazon.in/dp/B0FNND3828/?tag=primeoffers02-21",
        "category": "Kitchen",
        "region": "india"
    },
    {
        "title": "Cri8Hub Heavy Stainless Steel 2 Tier Kitchen Rack - Spice Boxes Rack Kitchen Stand - Cosmetic Organizer, Counter Top Basket -Floor Mounted Shelf for Home, Tiered Shelf",
        "price": "₹275",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71orZznJjTL._AC_UL320_.jpg",
        "asin": "B0BZ5571M1",
        "affiliate": "https://www.amazon.in/dp/B0BZ5571M1/?tag=primeoffers02-21",
        "category": "Kitchen",
        "region": "india"
    },
    {
        "title": "FireBees 3 Tier Wooden Spice Rack for Kitchen Countertop | Masala Organizer Rack Stand | Kitchen Shelf Organizer & Cabinet Shelf Riser | Wooden Kitchen Storage Stand | Dark Brown",
        "price": "₹297",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61EnEVd2mOL._AC_UL320_.jpg",
        "asin": "B0GKV6WSH1",
        "affiliate": "https://www.amazon.in/dp/B0GKV6WSH1/?tag=primeoffers02-21",
        "category": "Kitchen",
        "region": "india"
    },
    {
        "title": "BAMEOS 𝟒 𝐏𝐀𝐂𝐊 Plastic Rack for Storage Cabinet with Wheels | Multipurpose Shelf Storage Services Almirah Wardrobe for Clothes, Kitchen Cupboard | Plastic Organizer with Transparent Doors - WHITE",
        "price": "₹3,699",
        "rating": "4.5 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81TbAKkF-JL._AC_UL320_.jpg",
        "asin": "B0GTR2FPJH",
        "affiliate": "https://www.amazon.in/dp/B0GTR2FPJH/?tag=primeoffers02-21",
        "category": "Kitchen",
        "region": "india"
    },
    {
        "title": "Oslen Metal (Pack of 2 Self-Adhesive Shelf/Storage Organizer for Bathroom and Kitchen Corner Wall Mounted Rack Shelf Bathroom Accessories Storage Rack (No Drilling-Shelf Adhesive) (8 and 9 INCH,Black)",
        "price": "₹298",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61d9W1vJjmL._AC_UL320_.jpg",
        "asin": "B0DY1XYMYW",
        "affiliate": "https://www.amazon.in/dp/B0DY1XYMYW/?tag=primeoffers02-21",
        "category": "Kitchen",
        "region": "india"
    },
    {
        "title": "Palomino Wall Mount Kitchen Utensils Dish Rack | Stainless Steel Utensil Stand with Plate & Cutlery Holder (31 X 30 Inches) | Kitchen Shelves Organizer | Hanging",
        "price": "₹2,157",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71S9i3p-z7L._AC_UL320_.jpg",
        "asin": "B084M4NN1F",
        "affiliate": "https://www.amazon.in/dp/B084M4NN1F/?tag=primeoffers02-21",
        "category": "Kitchen",
        "region": "india"
    },
    {
        "title": "ABJA Stylish Wooden Rack for Kitchen Storage, Corner Shelf for Kitchen, Organizer Rack, 3 Tier Spice, Oil Stand, Tabletop Adjustable Rack for Makeup, Office (Rustic Brown, 3 Tier Lite)",
        "price": "₹1,349",
        "rating": "4.6 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71gYLtstVFL._AC_UL320_.jpg",
        "asin": "B0GWTVLRZR",
        "affiliate": "https://www.amazon.in/dp/B0GWTVLRZR/?tag=primeoffers02-21",
        "category": "Kitchen",
        "region": "india"
    },
    {
        "title": "Kitchenwell Metal Multi-Purpose Trolley Storage Organizer and Kitchen Accessories Items for Kitchen Storage Rack Square Design Fruits & Vegetable Onion Cutlery (Matt Black, 5 Layer Drawer)",
        "price": "₹2,535",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81TpT-eekoL._AC_UL320_.jpg",
        "asin": "B0BVC1YT6X",
        "affiliate": "https://www.amazon.in/dp/B0BVC1YT6X/?tag=primeoffers02-21",
        "category": "Kitchen",
        "region": "india"
    },
    {
        "title": "TechSrmaji Metal 2-Tier Standing Rack for Bathroom, Kitchen, Countertop Storage Dish Rack for Kitchen Organizer, Cosmetic Shelf, 2-Tier Shelf",
        "price": "₹412",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61PsuDmJ4sL._AC_UL320_.jpg",
        "asin": "B0BSHB929Q",
        "affiliate": "https://www.amazon.in/dp/B0BSHB929Q/?tag=primeoffers02-21",
        "category": "Kitchen",
        "region": "india"
    },
    {
        "title": "Kitchenwell Metal Multi-Purpose Trolley Storage Organizer and Kitchen Accessories Items for Kitchen Storage Rack Square Design Fruits & Vegetable Onion Cutlery (Matt Black, 3 Layer Drawer)",
        "price": "₹1,512",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81TwxR3pN7L._AC_UL320_.jpg",
        "asin": "B0BVBTXP94",
        "affiliate": "https://www.amazon.in/dp/B0BVBTXP94/?tag=primeoffers02-21",
        "category": "Kitchen",
        "region": "india"
    },
    {
        "title": "12FOR COLLECTION Stainless Steel 3-Tier Countertop Storage Rack For Corners, Multipurpose Kitchen Plate Dish Corner Shelf, Rack Stand Holder",
        "price": "₹270",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61eX3uIvTwL._AC_UL320_.jpg",
        "asin": "B09MYH9QC1",
        "affiliate": "https://www.amazon.in/dp/B09MYH9QC1/?tag=primeoffers02-21",
        "category": "Kitchen",
        "region": "india"
    },
    {
        "title": "HOME CUBE 5-Tier Metal Storage Shelf with Wooden Shelves, Kitchen Organizer Rack, Microwave Stand, Bookshelf, Standing Shelf Units, Multipurpose Storage Rack for Living Room, Office, Garage, Shops",
        "price": "₹5,299",
        "rating": "4.6 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71ubuiYpATL._AC_UL320_.jpg",
        "asin": "B0FJ5S9XG2",
        "affiliate": "https://www.amazon.in/dp/B0FJ5S9XG2/?tag=primeoffers02-21",
        "category": "Kitchen",
        "region": "india"
    },
    {
        "title": "Oslen (Pack of 2 Self-Adhesive Multipurpose Bathroom Rack, Bathroom Shelf Organizer, Wall Mounted Shelf,Bathroom Accessories Set for Home,Bathroom Shelves (Black)",
        "price": "₹298",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61wc7K3%2BoKL._AC_UL320_.jpg",
        "asin": "B0DY4HGQZJ",
        "affiliate": "https://www.amazon.in/dp/B0DY4HGQZJ/?tag=primeoffers02-21",
        "category": "Kitchen",
        "region": "india"
    },
    {
        "title": "SHIOK DCOR 2-Tier Multipurpose Standing Storage Rack - Black | Modern & Durable Storage Shelf Organizer for Kitchen Countertop & Bathroom | Metal Mesh Basket Design with Wheels",
        "price": "₹576",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61gz1AHX5IL._AC_UL320_.jpg",
        "asin": "B0FZHQGVVL",
        "affiliate": "https://www.amazon.in/dp/B0FZHQGVVL/?tag=primeoffers02-21",
        "category": "Kitchen",
        "region": "india"
    },
    {
        "title": "Craftland Wrought Iron Countertop/Cabinet 2 Tier Kitchen Organiser/stand/Shelf/Holder/Utensils Rack for Spices Jars (White)",
        "price": "₹572",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61i-G4VG%2BCL._AC_UL320_.jpg",
        "asin": "B08XKD5P1R",
        "affiliate": "https://www.amazon.in/dp/B08XKD5P1R/?tag=primeoffers02-21",
        "category": "Kitchen",
        "region": "india"
    },
    {
        "title": "Decorlay Metal & Wooden Spice Rack Organizer Space Saver Counter-top Storage for Kitchen, Bathroom, Office, and Cosmetics (White + Beech, Two - Tier)",
        "price": "₹711",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61A6Z-5LuGL._AC_UL320_.jpg",
        "asin": "B0DBM1GLSK",
        "affiliate": "https://www.amazon.in/dp/B0DBM1GLSK/?tag=primeoffers02-21",
        "category": "Kitchen",
        "region": "india"
    },
    {
        "title": "MIKANIX Stainless Steel Vegetable & Fruit Storage Rack with Wheels, Kitchen Storage Basket Organizer, Rust Proof Stand for Onion, Potato, Fruits & Vegetables Trolley (3 Rack & 6 PARTITION)",
        "price": "₹1,249",
        "rating": "3.5 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81FsncxpCQL._AC_UL320_.jpg",
        "asin": "B0GWVG6ZLD",
        "affiliate": "https://www.amazon.in/dp/B0GWVG6ZLD/?tag=primeoffers02-21",
        "category": "Kitchen",
        "region": "india"
    },
    {
        "title": "AQUANERO+",
        "price": "₹349",
        "rating": "3.5 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51nJa1JfCcL._AC_UY218_.jpg",
        "asin": "B0G1B24ZZ4",
        "affiliate": "https://www.amazon.in/dp/B0G1B24ZZ4/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Aquaguard",
        "price": "₹22,999",
        "rating": "3.8 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F514W3h5UFhL._AC_UY218_.jpg",
        "asin": "B0CS2YPF7Y",
        "affiliate": "https://www.amazon.in/dp/B0CS2YPF7Y/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Aquaguard",
        "price": "₹14,998",
        "rating": "3.9 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61Oo%2BMITIbL._AC_UY218_.jpg",
        "asin": "B0FM8WDFGZ",
        "affiliate": "https://www.amazon.in/dp/B0FM8WDFGZ/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "ECOTAVA Multicolor RO Pre Filter Spanner for 10 Inch Housing – Wrench Tool for RO Water Purifier & Filter Housing | Universal Fit for Kent, Aquaguard, Livpure & More",
        "price": "₹132",
        "rating": "1.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51eviPYLLxL._AC_UY218_.jpg",
        "asin": "B0GTZK1Z5J",
        "affiliate": "https://www.amazon.in/dp/B0GTZK1Z5J/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Aquaguard",
        "price": "₹19,999",
        "rating": "3.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F416n5cZMwdL._AC_UY218_.jpg",
        "asin": "B0CZTYJ9KX",
        "affiliate": "https://www.amazon.in/dp/B0CZTYJ9KX/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Dolphin 5 Stage Purification 9 Liter Ro + Active Copper + B12 Alkaline Water Purifier Filter For Home Office White And Blue",
        "price": "₹4,290",
        "rating": "3.7 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F516f9R6iMdL._AC_UY218_.jpg",
        "asin": "B09SFCSCVY",
        "affiliate": "https://www.amazon.in/dp/B09SFCSCVY/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Kinsco",
        "price": "₹5,412",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71t2o38udaL._AC_UY218_.jpg",
        "asin": "B0D9QKN9K9",
        "affiliate": "https://www.amazon.in/dp/B0D9QKN9K9/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Aquaguard",
        "price": "₹16,499",
        "rating": "3.8 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51nkgTBQpjL._AC_UY218_.jpg",
        "asin": "B0D21VSH55",
        "affiliate": "https://www.amazon.in/dp/B0D21VSH55/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "ADDYZ",
        "price": "₹3,999",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51jRSwBiy1L._AC_UY218_.jpg",
        "asin": "B0FJMF96XC",
        "affiliate": "https://www.amazon.in/dp/B0FJMF96XC/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Aquaguard",
        "price": "₹17,199",
        "rating": "3.7 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51v4PYCjzwL._AC_UY218_.jpg",
        "asin": "B09YXKRP17",
        "affiliate": "https://www.amazon.in/dp/B09YXKRP17/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Aquaguard",
        "price": "₹14,499",
        "rating": "3.6 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F5132fjnsxcL._AC_UY218_.jpg",
        "asin": "B0F8W3RN4X",
        "affiliate": "https://www.amazon.in/dp/B0F8W3RN4X/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Aquaguard",
        "price": "₹17,999",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51cTc-Lcy5L._AC_UY218_.jpg",
        "asin": "B0CRVMGKYG",
        "affiliate": "https://www.amazon.in/dp/B0CRVMGKYG/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "RO Pre-Filter Bowl Aquaguard Type + Elbow+Pipe and 9 inch Candle for RO UV Water Purifier",
        "price": "₹499",
        "rating": "3.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F31GepgyR-oL._AC_UY218_.jpg",
        "asin": "B09SF3RB2Z",
        "affiliate": "https://www.amazon.in/dp/B09SF3RB2Z/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Aquaguard",
        "price": "₹2500",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51MYezGGC1L._AC_UY218_.jpg",
        "asin": "B0D45SL7P6",
        "affiliate": "https://www.amazon.in/dp/B0D45SL7P6/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Aquaguard",
        "price": "₹7,999",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F41oXYqMboQL._AC_UY218_.jpg",
        "asin": "B08XXLDTSJ",
        "affiliate": "https://www.amazon.in/dp/B08XXLDTSJ/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Aquaguard",
        "price": "₹14,699",
        "rating": "3.5 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51a4e58jVsL._AC_UY218_.jpg",
        "asin": "B0FCFRGV82",
        "affiliate": "https://www.amazon.in/dp/B0FCFRGV82/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Carbon Filter Cartridge Suitable for All Types of Water Purifier | MLT Candle|Suitable for All Types of Water Purifier 9\" Pre Filter (Pack of 4)\nCarbon Filter Cartridge Suitable for All Types of Water Purifier | MLT Candle|Suitable for All Types of Water Purifier…",
        "price": "₹370",
        "rating": "3.7 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51G9wcmjK2L._AC_SR405%252C405_.jpg",
        "asin": "B0C6QMZBYV",
        "affiliate": "https://www.amazon.in/dp/B0C6QMZBYV/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Purolift 10 Inch PP Spun Filter for pre Filter for All Types of RO Water purifiers Water Filter Candles for pre Filter Cartridge External Sediment Filter Sponge Replacement Filter Candle (Pack of 10)\nPurolift 10 Inch PP Spun Filter for pre Filter for All Types of RO Water purifiers Water Filter Candles for pre Filter C…",
        "price": "₹499",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71Nu6A3qWgL._AC_SR405%252C405_.jpg",
        "asin": "B0FYGPNTCV",
        "affiliate": "https://www.amazon.in/dp/B0FYGPNTCV/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Native M1 Pro Water Purifier by Urban Company | Smart Real-Time Tracking | 10-Stage RO+UV+Copper+Alkaline+Mineraliser | No Service for 2 Years | India's Only 2-year Unconditional Warranty\nNative M1 Pro Water Purifier by Urban Company | Smart Real-Time Tracking | 10-Stage RO+UV+Copper+Alkali…",
        "price": "₹17,499",
        "rating": "4.5 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51duol76pKL._AC_SR405%252C405_.jpg",
        "asin": "B0GWQFXMTY",
        "affiliate": "https://www.amazon.in/dp/B0GWQFXMTY/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "WaterScience Replacement Cartridge for CLEO Shower and Tap Filter for Hard Water | Borewell/Tanker Water Cartridge | Hard Water Softener\nWaterScience Replacement Cartridge for CLEO Shower and Tap Filter for Hard Water | Borewell/Tanker Wat…",
        "price": "₹845",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51L5n%2BumNeL._AC_SR405%252C405_.jpg",
        "asin": "B07Y24YFSP",
        "affiliate": "https://www.amazon.in/dp/B07Y24YFSP/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Konvio NEER Set of Two High Density 10-Inch 5 Micron PP Spun Filter for pre Filter of All Type RO Water Purifiers(2, Spun)\nKonvio NEER Set of Two High Density 10-Inch 5 Micron PP Spun Filter for pre Filter of All Type RO Water Purifiers(2, Spun)",
        "price": "₹399",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51q-0tYvcdL._AC_SR405%252C405_.jpg",
        "asin": "B07TZ7PQZ2",
        "affiliate": "https://www.amazon.in/dp/B07TZ7PQZ2/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Purolift 4pcs Heavy Duty PP Spun Filter/Cartridge with Spanner for All Types of RO Water Purifier(10 Inch, 5 Micron) | RO Water Purifier Cartridge,RO Spun Filter Sponge Replacement Filter Candle\nPurolift 4pcs Heavy Duty PP Spun Filter/Cartridge with Spanner for All Types of RO Water Purifier(10 Inch, 5 Micr…",
        "price": "₹319",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71VJJ6mD3YL._AC_SR405%252C405_.jpg",
        "asin": "B0DKC4MFJ9",
        "affiliate": "https://www.amazon.in/dp/B0DKC4MFJ9/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "KONVIO NEER 9 Inch pp Yarn Filter Cartridge MLT Compatible for 10 Inch pp Yarn Pre Filter Housing of All Water Purifier | Pack of 4\nKONVIO NEER 9 Inch pp Yarn Filter Cartridge MLT Compatible for 10 Inch pp Yarn Pre Filter Housing of All Water P…",
        "price": "₹799",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81Q76MRfeqL._AC_SR405%252C405_.jpg",
        "asin": "B0DTHPRR9L",
        "affiliate": "https://www.amazon.in/dp/B0DTHPRR9L/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Havells Airboll High Speed 450mm Wall Fan (White)",
        "price": "₹4,990",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F81%2B5bbj3xeL._AC_UL165_SR165%2C165_.jpg",
        "asin": "B00B4BC9IA",
        "affiliate": "https://www.amazon.in/dp/B00B4BC9IA/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "The Earth Store Handcrafted Creme Matte Brown Ceramic Dinner Set, 30 Pieces Serving for 6, Microwave and Dishwasher Safe, Bone-Ash Free, Dinner Sets | Crockery Set for Gifting & Dining",
        "price": "₹5,899",
        "rating": "3.9 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F81cyY0ge0yL._AC_UL165_SR165%2C165_.jpg",
        "asin": "B0GKGZ7LMJ",
        "affiliate": "https://www.amazon.in/dp/B0GKGZ7LMJ/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Havells Swing 300mm Wall Mounted Fan | High-Performance, Wall Fan for Kitchen & Home, Smooth Oscillation, 100% Copper Motor | 3-Speed Control, 2-Year Warranty | (Pack of 1, Off White)",
        "price": "₹2,349",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F719Lzp9EmmL._AC_UL165_SR165%2C165_.jpg",
        "asin": "B00J5ENA7C",
        "affiliate": "https://www.amazon.in/dp/B00J5ENA7C/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Havells CANDY HS Wall & Table Fan 230 mm 100% Copper Wire Motor| Watt: 60|Air Flow: 35 cmm|Speed: 2700 RPM| 2 Year Warranty(Yellow)",
        "price": "₹2,450",
        "rating": "3.6 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F61zVvj%2Bh90L._AC_UL165_SR165%2C165_.jpg",
        "asin": "B0F6BNMKMH",
        "affiliate": "https://www.amazon.in/dp/B0F6BNMKMH/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Havells Swing 400mm Wall Fan (Off White)",
        "price": "₹2,490",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F41ueDbjypYL._AC_UL165_SR165%2C165_.jpg",
        "asin": "B00B4BCAVG",
        "affiliate": "https://www.amazon.in/dp/B00B4BCAVG/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Portronics Aero Breeze Portable table Fan 178mm, USB Rechargeable Fan, 3 Speed Airflow, Battery Powered Silent Operation, 4 Hours Back Up, 360° Rotatable USB Fan, BLDC Fan for Kitchen,Office,Home",
        "price": "₹949",
        "rating": "3.9 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F71OhLdT8bfL._AC_UL165_SR165%2C165_.jpg",
        "asin": "B0CQG1SBV3",
        "affiliate": "https://www.amazon.in/dp/B0CQG1SBV3/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "9-Inch PP Yarn Wound Sediment Water Filter Cartridge | 5 Micron,150gm Heavy-Duty Pre-Filter Compatible with Aqua-Guard, LG and Other Brands RO/UV/UF Water Purifier | Virgin PP Yarn (Pack of 1)",
        "price": "₹249",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F41lbs4BB6qL._AC_UY218_.jpg",
        "asin": "B0F9B2C9NK",
        "affiliate": "https://www.amazon.in/dp/B0F9B2C9NK/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Serplex",
        "price": "₹998",
        "rating": "",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51zY0QaGwyL._AC_UY218_.jpg",
        "asin": "B0GH73X68S",
        "affiliate": "https://www.amazon.in/dp/B0GH73X68S/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Kitchen Clean",
        "price": "₹209",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F717O4PSKfrL._AC_UY218_.jpg",
        "asin": "B0CWDKY44X",
        "affiliate": "https://www.amazon.in/dp/B0CWDKY44X/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "AQUANERO+",
        "price": "₹299",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61fsgJ5VNML._AC_UY218_.jpg",
        "asin": "B0FC5PYYNT",
        "affiliate": "https://www.amazon.in/dp/B0FC5PYYNT/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Eureka Forbes",
        "price": "₹940",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51ACQyvyf%2BL._AC_UY218_.jpg",
        "asin": "B0C8B4X5Q8",
        "affiliate": "https://www.amazon.in/dp/B0C8B4X5Q8/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "9-Inch PP Yarn Wound Sediment Water Filter Cartridge | 5 Micron,150gm Heavy-Duty Pre-Filter Compatible with Aqua-Guard, LG and Other Brands RO/UV/UF Water Purifier | Virgin PP Yarn (Pack of 2)",
        "price": "₹299",
        "rating": "4.5 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51nmCni1YfL._AC_UY218_.jpg",
        "asin": "B0GBVX3KSY",
        "affiliate": "https://www.amazon.in/dp/B0GBVX3KSY/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Aquaguard",
        "price": "₹10,999",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51azW1nqt6L._AC_UY218_.jpg",
        "asin": "B0CW5YZ6VV",
        "affiliate": "https://www.amazon.in/dp/B0CW5YZ6VV/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "AquaMonk",
        "price": "₹199",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F41p-wDzninL._AC_UY218_.jpg",
        "asin": "B0FP5H5CRN",
        "affiliate": "https://www.amazon.in/dp/B0FP5H5CRN/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Classic Compact Dual Activated Carbon Block Dual Filter Catridge for AG Compact Water Purifier Model (Pack of 1)",
        "price": "₹312",
        "rating": "3.9 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51p%2B5EW4XAL._AC_UY218_.jpg",
        "asin": "B0BWV6LHJW",
        "affiliate": "https://www.amazon.in/dp/B0BWV6LHJW/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "SHAPURE",
        "price": "₹449",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51TMf4lFGpL._AC_UY218_.jpg",
        "asin": "B09922T8ZR",
        "affiliate": "https://www.amazon.in/dp/B09922T8ZR/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "IONIX",
        "price": "₹249",
        "rating": "3.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61N%2BOWsry1L._AC_UY218_.jpg",
        "asin": "B0DH8993DF",
        "affiliate": "https://www.amazon.in/dp/B0DH8993DF/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "10\" Slim Carbon Block and 9\" Threaded PP Filter Pre-Filter Compatible to ST, Classic Model",
        "price": "₹334",
        "rating": "3.9 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51O5hJttXyL._AC_UY218_.jpg",
        "asin": "B0BK5JC9N2",
        "affiliate": "https://www.amazon.in/dp/B0BK5JC9N2/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Flaner",
        "price": "₹299",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71hesoc2cZL._AC_UY218_.jpg",
        "asin": "B0DHD9N165",
        "affiliate": "https://www.amazon.in/dp/B0DHD9N165/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "GRACE DIGITAL",
        "price": "₹227",
        "rating": "3.7 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F618nRDA4yML._AC_UY218_.jpg",
        "asin": "B0D76PT7XF",
        "affiliate": "https://www.amazon.in/dp/B0D76PT7XF/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Pre Filter for Water Purifier, 9 inch Sediment Filter Threaded Candle Cartridge. Compatible with Aquaguard Pre Filter, Livpure Pre Filter and All Other Brands (Pack of 4)",
        "price": "₹299",
        "rating": "3.9 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51ljy4kCC1L._AC_UY218_.jpg",
        "asin": "B0DS2SQ3CX",
        "affiliate": "https://www.amazon.in/dp/B0DS2SQ3CX/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Care N Made® Pure Threaded Outer Filter Water Purifier Cartridge for RO/Aquaguard (9 in)",
        "price": "₹149",
        "rating": "4.5 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F310ayRO6TEL._AC_UY218_.jpg",
        "asin": "B09S9Z5JM2",
        "affiliate": "https://www.amazon.in/dp/B09S9Z5JM2/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Noir Aqua 10pcs PP Spun Filter/Cartridge for All Types of RO Water purifiers (10 Inch, 5 Micron) | RO Water Purifier Cartridge,RO Spun Filter Cartridge Sponge Replacement Water Filter Candle",
        "price": "₹589",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61Aen8TBGWL._AC_UL640_QL65_.jpg",
        "asin": "B08KZLRY8B",
        "affiliate": "https://www.amazon.in/dp/B08KZLRY8B/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "TWINZFIT Pushup Board, 15 in 1 Push Up Stand, Multi-Function Flex Board for Chest, Triceps, Shoulder, Back Muscles, Home Workout Gym Equipment, Multicolour",
        "price": "₹290",
        "rating": "3.8 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71UFD%2BkyMfL._AC_UL320_.jpg",
        "asin": "B0DKJZX382",
        "affiliate": "https://www.amazon.in/dp/B0DKJZX382/?tag=primeoffers02-21",
        "category": "Fitness",
        "region": "india"
    },
    {
        "title": "Boldfit Hand Gripper for Men & Women Hand Grip Strengthener for Forearm, Wrist & Finger Workout Fitness Equipment for Home & Gym Training",
        "price": "₹169",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F612AmJbiG1L._AC_UL320_.jpg",
        "asin": "B0B77X44MX",
        "affiliate": "https://www.amazon.in/dp/B0B77X44MX/?tag=primeoffers02-21",
        "category": "Fitness",
        "region": "india"
    },
    {
        "title": "Protoner PVC 3 in 1 convertible DM 4-40 Kg Dumbbells Set and Fitness Kit for Men and Women Whole Body Workout (20 kg (2 kg x 4, 3 kg x 4), 3 in 1 convertible)",
        "price": "₹849",
        "rating": "3.8 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81yi8OiYIRL._AC_UL320_.jpg",
        "asin": "B0C55FP5TX",
        "affiliate": "https://www.amazon.in/dp/B0C55FP5TX/?tag=primeoffers02-21",
        "category": "Fitness",
        "region": "india"
    },
    {
        "title": "ALN® Portable Resistance Bands (11pcs) with Door Anchor, Foam Handles, Legs Ankle Straps for Resistance Training, Physical Therapy, Home Workouts For Men and Women Full body Exercise fitness Equipment",
        "price": "₹399",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51760FwF-CL._AC_UL320_.jpg",
        "asin": "B0FQ464CL3",
        "affiliate": "https://www.amazon.in/dp/B0FQ464CL3/?tag=primeoffers02-21",
        "category": "Fitness",
        "region": "india"
    },
    {
        "title": "SILENCIO Sit-Up Bar With Foam Handle and Rubber Suction Seat Up Fitness Equipment Sit-ups and Push-ups Assistant Device For Weight Lose Gym Workout Abdominal Curl Exercise Work Out Trainer (Pack of 1)",
        "price": "₹422",
        "rating": "3.9 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61nX-qFqz7L._AC_UL320_.jpg",
        "asin": "B09CR1CVW7",
        "affiliate": "https://www.amazon.in/dp/B09CR1CVW7/?tag=primeoffers02-21",
        "category": "Fitness",
        "region": "india"
    },
    {
        "title": "Fitkit by Cult FK7004 Premium Magnetic Spin Bike | 130kg Support | Stepless Resistance & 8kg Flywheel | LCD Display with Heart-Rate Tracking | Tablet Holder | Smooth & Silent Ride for Home Fitness",
        "price": "₹13,999",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F41fogv7RlzL._AC_UL320_.jpg",
        "asin": "B0G496T2BW",
        "affiliate": "https://www.amazon.in/dp/B0G496T2BW/?tag=primeoffers02-21",
        "category": "Fitness",
        "region": "india"
    },
    {
        "title": "Boldfit Skipping Rope for Men and Women Jumping Rope With Adjustable Height Speed Skipping Rope for Exercise, Gym, Sports Fitness Adjustable Jump Rope Black",
        "price": "₹143",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71vlhBkVs3L._AC_UL320_.jpg",
        "asin": "B0BC47M9YL",
        "affiliate": "https://www.amazon.in/dp/B0BC47M9YL/?tag=primeoffers02-21",
        "category": "Fitness",
        "region": "india"
    },
    {
        "title": "Boldfit Hand Gripper for Men & Women Hand Grip Strengthener for Forearm, Wrist & Finger Workout Fitness Equipment for Home & Gym Training",
        "price": "₹199",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61sb10nOi-L._AC_UL320_.jpg",
        "asin": "B08G8R7TRM",
        "affiliate": "https://www.amazon.in/dp/B08G8R7TRM/?tag=primeoffers02-21",
        "category": "Fitness",
        "region": "india"
    },
    {
        "title": "Push Up Board: Versatile Push Up Stand for Chest Workout & Home Gym Exercise Pushup Stand, Ideal Home Gym Equipment for Strength Training and Fitness, Durable and Ergonomic",
        "price": "₹265",
        "rating": "3.8 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71cjth7t1nL._AC_UL320_.jpg",
        "asin": "B0DTQXLXHD",
        "affiliate": "https://www.amazon.in/dp/B0DTQXLXHD/?tag=primeoffers02-21",
        "category": "Fitness",
        "region": "india"
    },
    {
        "title": "Fitness Mantra® 12 Pairs Sports Ankle Cotton Socks | Free Size| Breathable| Daily Use| Multicolor| 12 Pairs|",
        "price": "₹198",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81SEVBzTWhL._AC_UL320_.jpg",
        "asin": "B0CTQ4RSMB",
        "affiliate": "https://www.amazon.in/dp/B0CTQ4RSMB/?tag=primeoffers02-21",
        "category": "Fitness",
        "region": "india"
    },
    {
        "title": "Boldfit Forearm Strengthener Wrist Exercise Equipment Arm Strengthener Grip Strengthener Fitness Equipment Home Gym Equipment For Men & Gym Equipment For Women Grip Workout Forearm Wrist Grip, Black",
        "price": "₹349",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61-XFKFYCbL._AC_UL320_.jpg",
        "asin": "B0BS3YY9ZQ",
        "affiliate": "https://www.amazon.in/dp/B0BS3YY9ZQ/?tag=primeoffers02-21",
        "category": "Fitness",
        "region": "india"
    },
    {
        "title": "Cult Davie 7HP Peak, Max Weight: 150 Kg, Auto Incline with Massager Motorized Treadmill for Home Gym Fitness & 1 Year Warranty",
        "price": "₹65,749",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61hL2r1EDGL._AC_UL320_.jpg",
        "asin": "B0CK1MHXSX",
        "affiliate": "https://www.amazon.in/dp/B0CK1MHXSX/?tag=primeoffers02-21",
        "category": "Fitness",
        "region": "india"
    },
    {
        "title": "Amazon Brand - Symactive 20 Kg PVC Adjustable Dumbbells Fitness Kit for Full Body Workout (2 Kg x 4 + 3 Kg x 4 Kg Weight, One Pair 14'' Dumbbell Rods & Nuts)",
        "price": "₹769",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61NEUWb5A4L._AC_UL320_.jpg",
        "asin": "B0DYFB76QF",
        "affiliate": "https://www.amazon.in/dp/B0DYFB76QF/?tag=primeoffers02-21",
        "category": "Fitness",
        "region": "india"
    },
    {
        "title": "Bodyband Abs Roller for Men & Women Stomach Abs Roller Wheel for Home Workout, Gym Ab Roller for Men Abs Workout Equipment for Abdominal Ab Roller Home Exercise Equipment With Knee Mat -Yellow Black",
        "price": "₹249",
        "rating": "3.7 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71Vt2Pgy4hL._AC_UL320_.jpg",
        "asin": "B0CR7G9V56",
        "affiliate": "https://www.amazon.in/dp/B0CR7G9V56/?tag=primeoffers02-21",
        "category": "Fitness",
        "region": "india"
    },
    {
        "title": "Kore K-Pvc 20Kg Combo 3 Leather Home Gym And Fitness Kit, Grey",
        "price": "₹1,449",
        "rating": "3.6 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81XNzjmXi%2BL._AC_UL320_.jpg",
        "asin": "B01N0TFA7M",
        "affiliate": "https://www.amazon.in/dp/B01N0TFA7M/?tag=primeoffers02-21",
        "category": "Fitness",
        "region": "india"
    },
    {
        "title": "Lifelong Yoga Mat for Gym, Yoga & Home Workout | EVA Material 4mm Thick Anti-Slip Exercise & Fitness Mat with Carry Strap for Men & Women | Blue",
        "price": "₹349",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F611jmiOOWpL._AC_UL320_.jpg",
        "asin": "B0G12SRPB9",
        "affiliate": "https://www.amazon.in/dp/B0G12SRPB9/?tag=primeoffers02-21",
        "category": "Fitness",
        "region": "india"
    },
    {
        "title": "PRO365 Ultimate Home Workout Combo – 4-Piece Fitness Kit with Ab Roller, Push-Up Bars, Tummy Trimmer & Toning Tube",
        "price": "₹798",
        "rating": "3.8 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61IlTDvjDpL._AC_UL320_.jpg",
        "asin": "B0DJ3BDZP8",
        "affiliate": "https://www.amazon.in/dp/B0DJ3BDZP8/?tag=primeoffers02-21",
        "category": "Fitness",
        "region": "india"
    },
    {
        "title": "QUXIS Resistance Bands Set for Men and Women, Pack of 5 Different Levels Elastic Band for Home Gym Long Exercise Workout – Great Fitness Equipment for Training, Yoga – Free Carrying Bag",
        "price": "₹399",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71eUwv9BxoL._AC_UL320_.jpg",
        "asin": "B0C17FWR59",
        "affiliate": "https://www.amazon.in/dp/B0C17FWR59/?tag=primeoffers02-21",
        "category": "Fitness",
        "region": "india"
    },
    {
        "title": "Slovic Dumbbell Set [5 Kg Each] | Home Gym Dumbbells for Daily Workout | Quality Fitness Equipment for Strength Training | Non-Slip Coated Handle | Perfect for Women & Men",
        "price": "₹499",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81QeeKGrKeL._AC_UL320_.jpg",
        "asin": "B0FCCNHPYX",
        "affiliate": "https://www.amazon.in/dp/B0FCCNHPYX/?tag=primeoffers02-21",
        "category": "Fitness",
        "region": "india"
    },
    {
        "title": "21 Fitness Resistance Bands-6 Tube Pedal Ankle Puller, 2025 Upgraded Multifunction Tension Rope, Home Gym Equipment for Full Body Strength for Abdomen/Waist/Arm/Leg Training and Stretching",
        "price": "₹204",
        "rating": "3.7 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51sHk4nmzWL._AC_UL320_.jpg",
        "asin": "B0FM8JLYFC",
        "affiliate": "https://www.amazon.in/dp/B0FM8JLYFC/?tag=primeoffers02-21",
        "category": "Fitness",
        "region": "india"
    },
    {
        "title": "HASHTAG FITNESS Wall mount pull up bar, 3 in 1, dips station, home gym equipments, height increasing equipments for men,kids and women (Black)",
        "price": "₹2,326",
        "rating": "3.8 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61HObZ65q9L._AC_UL320_.jpg",
        "asin": "B09RPYLL28",
        "affiliate": "https://www.amazon.in/dp/B09RPYLL28/?tag=primeoffers02-21",
        "category": "Fitness",
        "region": "india"
    },
    {
        "title": "Boldfit Heavy Resistance Band for Workout Set Exercise & Stretching Pull Up Bands for Home Exercise for Gym Men & Women Loop Bands Toning Bands Resistance Band Yellow (3-7 Kg)",
        "price": "₹179",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F619jhkU8wcL._AC_UL320_.jpg",
        "asin": "B08H8KD72Q",
        "affiliate": "https://www.amazon.in/dp/B08H8KD72Q/?tag=primeoffers02-21",
        "category": "Fitness",
        "region": "india"
    },
    {
        "title": "FitBox Sports Adjustable Hand Grip (5kg - 60kg) Strengthener with Counter for Men & Women for Gym Workout Hand Exercise Equipment to Use in Home for Forearm Exercise (Black) Stainless Steel Spring",
        "price": "₹151",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F512egbgZqsL._AC_UL320_.jpg",
        "asin": "B0D8H1JBHQ",
        "affiliate": "https://www.amazon.in/dp/B0D8H1JBHQ/?tag=primeoffers02-21",
        "category": "Fitness",
        "region": "india"
    },
    {
        "title": "Lifelong Polypropylene Exercise Fitness Stepper for Exercise Aerobics Stepper | Max Weight 200kg",
        "price": "₹899",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61WJSeHTvuL._AC_UL320_.jpg",
        "asin": "B089SNPGMS",
        "affiliate": "https://www.amazon.in/dp/B089SNPGMS/?tag=primeoffers02-21",
        "category": "Fitness",
        "region": "india"
    },
    {
        "title": "You Can by George Matthew Adams | The Classic Guide to Self-Belief, Self-Help, Motivation & Personal Growth | A Life Changing Book on Success and Inner Strength | Premium Paperback Edition | Best Seller",
        "price": "₹99",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81T05w0B3lL._AC_UY218_.jpg",
        "asin": "9389931843",
        "affiliate": "https://www.amazon.in/dp/9389931843/?tag=primeoffers02-21",
        "category": "Books",
        "region": "india"
    },
    {
        "title": "The Art of Letting Go: Move Beyond the Hurt, Find Emotional Freedom and Restore Your Inner Peace",
        "price": "₹183",
        "rating": "4.5 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71pEaSYkhsL._AC_UY218_.jpg",
        "asin": "0143465066",
        "affiliate": "https://www.amazon.in/dp/0143465066/?tag=primeoffers02-21",
        "category": "Books",
        "region": "india"
    },
    {
        "title": "The Psychology of Money",
        "price": "₹289",
        "rating": "4.6 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71XEsXS5RlL._AC_UY218_.jpg",
        "asin": "9390166268",
        "affiliate": "https://www.amazon.in/dp/9390166268/?tag=primeoffers02-21",
        "category": "Books",
        "region": "india"
    },
    {
        "title": "Ikigai: The Japanese secret to a long and happy life",
        "price": "₹356",
        "rating": "4.6 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81l3rZK4lnL._AC_UY218_.jpg",
        "asin": "178633089X",
        "affiliate": "https://www.amazon.in/dp/178633089X/?tag=primeoffers02-21",
        "category": "Books",
        "region": "india"
    },
    {
        "title": "Don't Believe Everything You Think (English)",
        "price": "₹179",
        "rating": "4.5 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71l4V5QookL._AC_UY218_.jpg",
        "asin": "935543135X",
        "affiliate": "https://www.amazon.in/dp/935543135X/?tag=primeoffers02-21",
        "category": "Books",
        "region": "india"
    },
    {
        "title": "Limited time deal",
        "price": "₹259",
        "rating": "",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F21EzREA%2B0yL.svg",
        "asin": "1786583232",
        "affiliate": "https://www.amazon.in/dp/1786583232/?tag=primeoffers02-21",
        "category": "Books",
        "region": "india"
    },
    {
        "title": "Price, product page",
        "price": "₹0",
        "rating": "",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F21EzREA%2B0yL.svg",
        "asin": "B0BZSLGWLN",
        "affiliate": "https://www.amazon.in/dp/B0BZSLGWLN/?tag=primeoffers02-21",
        "category": "Books",
        "region": "india"
    },
    {
        "title": "How to Be Happy with Who You Are | Puffin Chapter Book | Full-colour, Gorgeous Illustrations | Perfect Introduction to Sudha Murty | Ages 5+",
        "price": "₹172",
        "rating": "4.6 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81Oo6fpigLL._AC_UY218_.jpg",
        "asin": "0143458205",
        "affiliate": "https://www.amazon.in/dp/0143458205/?tag=primeoffers02-21",
        "category": "Books",
        "region": "india"
    },
    {
        "title": "Courage To Be Disliked, The: How to free yourself, change your life and achieve real happiness",
        "price": "₹362",
        "rating": "4.5 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F710cYy40DUL._AC_UY218_.jpg",
        "asin": "1760630721",
        "affiliate": "https://www.amazon.in/dp/1760630721/?tag=primeoffers02-21",
        "category": "Books",
        "region": "india"
    },
    {
        "title": "The Alchemist",
        "price": "₹259",
        "rating": "4.6 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F617lxveUjYL._AC_UY218_.jpg",
        "asin": "8172234988",
        "affiliate": "https://www.amazon.in/dp/8172234988/?tag=primeoffers02-21",
        "category": "Books",
        "region": "india"
    },
    {
        "title": "Why I am an Atheist and Other Works | Letters & Jail Diary of Bhagat Singh on Revolution, Religion & Politics",
        "price": "₹110",
        "rating": "4.6 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61MCDl9XbqL._AC_UL640_QL65_.jpg",
        "asin": "9387022811",
        "affiliate": "https://www.amazon.in/dp/9387022811/?tag=primeoffers02-21",
        "category": "Books",
        "region": "india"
    },
    {
        "title": "The Power of Your Subconscious Mind: Original Classic Edition | Premium Paperback",
        "price": "₹149",
        "rating": "4.5 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71g4OFCERdL._AC_UY218_.jpg",
        "asin": "8172345666",
        "affiliate": "https://www.amazon.in/dp/8172345666/?tag=primeoffers02-21",
        "category": "Books",
        "region": "india"
    },
    {
        "title": "THE SECRET | Life-Changing Self-Help Book on Law of Attraction | Personal Transformation, Positive Thinking & Motivation | Paperback for Mindset, Success & Happiness",
        "price": "₹174",
        "rating": "4.5 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81Wz6-l3pkL._AC_UY218_.jpg",
        "asin": "B0FVXWJ55T",
        "affiliate": "https://www.amazon.in/dp/B0FVXWJ55T/?tag=primeoffers02-21",
        "category": "Books",
        "region": "india"
    },
    {
        "title": "The Art of Being Alone: Loneliness Was My Cage, Solitude Is My Home (English)",
        "price": "₹198",
        "rating": "4.5 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61Ktyy7KymL._AC_UY218_.jpg",
        "asin": "9355434022",
        "affiliate": "https://www.amazon.in/dp/9355434022/?tag=primeoffers02-21",
        "category": "Books",
        "region": "india"
    },
    {
        "title": "White Nights by Fyodor Dostoyevsky: A Timeless Story of Love, Longing & Solitude | Classic Fiction, Russian Literature, Romantic Novella | Penguin Little Black Classics",
        "price": "₹126",
        "rating": "4.6 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F41y8H3QmVqL._AC_UY218_.jpg",
        "asin": "0241252083",
        "affiliate": "https://www.amazon.in/dp/0241252083/?tag=primeoffers02-21",
        "category": "Books",
        "region": "india"
    },
    {
        "title": "READ PEOPLE LIKE A BOOK | Master Human Behavior and Body Language | Analyze Emotions, Thoughts, and Intentions | Psychology-Based Guide to Improve Communication, and Social Intelligence",
        "price": "₹169",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51eysN903mL._AC_UY218_.jpg",
        "asin": "B0GHMRK98B",
        "affiliate": "https://www.amazon.in/dp/B0GHMRK98B/?tag=primeoffers02-21",
        "category": "Books",
        "region": "india"
    },
    {
        "title": "World’s Greatest Books For Personal Growth & Wealth (Set of 4 Books) : Perfect Motivational Gift Set | How to Win Friends and Influence People | Think and Grow Rich | The Richest Man in Babylon | The Power of Your Subconscious Mind | Premium Paperback for Gifting",
        "price": "₹349",
        "rating": "4.5 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71eVoJQz9-L._AC_UY218_.jpg",
        "asin": "9389432014",
        "affiliate": "https://www.amazon.in/dp/9389432014/?tag=primeoffers02-21",
        "category": "Books",
        "region": "india"
    },
    {
        "title": "Stop Letting Everything Affect You: How to break free from overthinking, emotional chaos, and self-sabotage",
        "price": "₹255",
        "rating": "4.6 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71sXWkc3YsL._AC_UY218_.jpg",
        "asin": "9373171984",
        "affiliate": "https://www.amazon.in/dp/9373171984/?tag=primeoffers02-21",
        "category": "Books",
        "region": "india"
    },
    {
        "title": "HOME UTSAV Embossed Pyramid Solid Punching Heavy Curtains for Window 5 Feet, Pack of 1, Brown",
        "price": "₹198",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F91GhFEXpVfL._AC_UL320_.jpg",
        "asin": "B0B5HGVX63",
        "affiliate": "https://www.amazon.in/dp/B0B5HGVX63/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Home Sizzler 2 Pieces Elegant Panel Eyelet Polyester Door Curtains - 7 Feet, Brown",
        "price": "₹426",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F813tzrKnhEL._AC_UL320_.jpg",
        "asin": "B06WCZCFR2",
        "affiliate": "https://www.amazon.in/dp/B06WCZCFR2/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Home Sizzler 2 Pieces Patterned Panel Eyelet Polyester Window Curtains - 5 Feet, Blue",
        "price": "₹349",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71RrPK032FL._AC_UL320_.jpg",
        "asin": "B09R9GMR93",
        "affiliate": "https://www.amazon.in/dp/B09R9GMR93/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "FARRELL Home Decor Polyresin Solid Plian Semi Sheer Grommet Curtain For Window (5 Feet),(Grey)",
        "price": "₹99",
        "rating": "3.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61u5GJE0zhL._AC_UL320_.jpg",
        "asin": "B0D6VN2PWP",
        "affiliate": "https://www.amazon.in/dp/B0D6VN2PWP/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Home Sizzler Set of 2 Door Curtains - 7 Feet Long",
        "price": "₹430",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81gwOUTORrL._AC_UL320_.jpg",
        "asin": "B01M1GSOSS",
        "affiliate": "https://www.amazon.in/dp/B01M1GSOSS/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Window Curtains 5 Feet Long for Living Room – Window Curtains Set of 1 Pcs Panel, Velvet Blackout & Stylish Parda for Home Décor & Office Ice Colour",
        "price": "₹279",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81CyzfNh7sL._AC_UL320_.jpg",
        "asin": "B0GQM5TMWJ",
        "affiliate": "https://www.amazon.in/dp/B0GQM5TMWJ/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Homefab India Royal Silky Grommet Door Curtain - 7 feet, Coffee - 2 Piece",
        "price": "₹473",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61M-sYoL%2BOL._AC_UL320_.jpg",
        "asin": "B00NRQP3II",
        "affiliate": "https://www.amazon.in/dp/B00NRQP3II/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Home Sizzler 2 Pieces Abstract Flower Eyelet Polyester Window Curtains - 5 Feet, Grey",
        "price": "₹349",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71YNzpEt3tL._AC_UL320_.jpg",
        "asin": "B0853753RS",
        "affiliate": "https://www.amazon.in/dp/B0853753RS/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Home Sizzler Abstract 2 Piece Eyelet Polyester Door Curtain Set - 7ft, Brown",
        "price": "₹399",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71e0YBc3wZL._AC_UL320_.jpg",
        "asin": "B01DA4NSHO",
        "affiliate": "https://www.amazon.in/dp/B01DA4NSHO/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Kiara Creations Velvet Emboss Damas Room Darkening Grommet Curtains for Door- 7 Feet (Pack of 1) Brown",
        "price": "₹322",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F91LliuWEBbL._AC_UL320_.jpg",
        "asin": "B09RDWQQXG",
        "affiliate": "https://www.amazon.in/dp/B09RDWQQXG/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Yellow Weaves Rich Jacquard Fabric Curtains for Door, Lilac Leaf, 7 Feet, Pack of 2, Beige Brown,Eyelet",
        "price": "₹1,249",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F91dHLgQF3NL._AC_UL640_QL65_.jpg",
        "asin": "B0B84TL7MS",
        "affiliate": "https://www.amazon.in/dp/B0B84TL7MS/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Exporthub 1 Piece Beautiful Polyester Door Threads String Curtain - 7ft, White (EHSPR558_74)",
        "price": "₹198",
        "rating": "3.7 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71IsOl6UgIL._AC_UL320_.jpg",
        "asin": "B071P7KDYV",
        "affiliate": "https://www.amazon.in/dp/B071P7KDYV/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Galaxy Home Decor Sheer Transparent Net Grommet Curtains for Door 7 Feet, Pack of 1, Cream (Cream (Cross), Door 7 Feet (1Pc))",
        "price": "₹285",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F810EExrz2sL._AC_UL320_.jpg",
        "asin": "B09CD4MTVV",
        "affiliate": "https://www.amazon.in/dp/B09CD4MTVV/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Homefab India Pack of 2 Royal Silky Cream Door Curtains with Stainless Steel Eyelets - 7 feet",
        "price": "₹473",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61M3oIJG5CL._AC_UL320_.jpg",
        "asin": "B00NRQOYZG",
        "affiliate": "https://www.amazon.in/dp/B00NRQOYZG/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Story@Home 100% True Blackout Curtains Semi Long Door 8 Feet Set of 1 | Solid Design |Room Darkening Curtain | Thermal Insulated Curtains for Living Room, Bedroom | (116 X 242 Cm, Ash Grey)",
        "price": "₹729",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F8102fLQUYtL._AC_UL320_.jpg",
        "asin": "B0GQFZNTZF",
        "affiliate": "https://www.amazon.in/dp/B0GQFZNTZF/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Window Curtains 5 Feet Long for Living Room – Window Curtains Set of 1 Pcs Panel, Velvet Curtain Blackout & Stylish Parda for Home Décor & Office Grey Colour - 5 feet (48 x 60 Inch) - 1 Pcs",
        "price": "₹279",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81WkOGO4rSL._AC_UL320_.jpg",
        "asin": "B0G6TQYYST",
        "affiliate": "https://www.amazon.in/dp/B0G6TQYYST/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Galaxy Home Decor Premium Foil Leaf Print Velvet Fabric Curtains for Door 7 Feet, Pack of 1, Cream",
        "price": "₹305",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F91OWEI7V00L._AC_UL320_.jpg",
        "asin": "B0CFV589YV",
        "affiliate": "https://www.amazon.in/dp/B0CFV589YV/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Door Curtains 7 feet Long Set of 2 | Ethnic Design | Polyester, Light Filtering Curtains and Drapes | Curtains for Living Room | (118 x 215 cm, Blue & Ivory) | Perfect for Home Decor",
        "price": "₹348",
        "rating": "3.6 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F91m1HDsE9PL._AC_UL320_.jpg",
        "asin": "B0FHQ4LGSW",
        "affiliate": "https://www.amazon.in/dp/B0FHQ4LGSW/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Home Sizzler Abstract Opaque 2 Piece Eyelet Polyester Scroll Frill Door Curtain Set - 7ft, Maroon",
        "price": "₹429",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F812dwb7hkhL._AC_UL320_.jpg",
        "asin": "B077D9YDCX",
        "affiliate": "https://www.amazon.in/dp/B077D9YDCX/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "amazon basics - Room Darkening Blackout Window Curtains, 100% Room Darkening | 5 Feet |Set of 2| Plain Design | for Living Room and Bedroom | 115cmx150cm, Color- Coffee",
        "price": "₹699",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61eaYiCw2%2BL._AC_UL320_.jpg",
        "asin": "B0DZY1KLJP",
        "affiliate": "https://www.amazon.in/dp/B0DZY1KLJP/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Story@Home 100% True Blackout Solid Door Curtains 7 Feet Long Set of 2 | Room Darkening | Thermal Insulated Curtains for Living Room | (116 x 215 cm, Black)",
        "price": "₹1,299",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F715Yd3-ZbJL._AC_UL320_.jpg",
        "asin": "B06XDM7Z48",
        "affiliate": "https://www.amazon.in/dp/B06XDM7Z48/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "CASA-NEST 7 Feet Transparent AC Door Curtain - 4.5ft Width | Clear PVC Thermal Barrier for Cooling Retention | Includes Heavy Duty Shower Rings | Ideal for Home, Office, and Shop Partitions",
        "price": "₹268",
        "rating": "3.9 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F515yKHa191L._AC_UL320_.jpg",
        "asin": "B07FN3RXQ8",
        "affiliate": "https://www.amazon.in/dp/B07FN3RXQ8/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Fashion String Polyester Blossoms Eyelet Window Curtains (5 Feet, Blue) - 2 Piece(Eyelet, String, Washable), Floral | Light-Filtering",
        "price": "₹300",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F710zqX3-4AL._AC_UL320_.jpg",
        "asin": "B09FZJJ4C2",
        "affiliate": "https://www.amazon.in/dp/B09FZJJ4C2/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "HOMEMONDE Light Filtering Curtain 5 Feet Window - Cotton Sheer Floral Printed Curtains for Home Decoration, Pack of 2 - (Top Style - Rod Pocket)",
        "price": "₹964",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F910QleZYO%2BL._AC_UL320_.jpg",
        "asin": "B0CM6P5VZR",
        "affiliate": "https://www.amazon.in/dp/B0CM6P5VZR/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "HOME UTSAV Embossed Pyramid Solid Punching Heavy Curtains for Long Door 8 Feet, Pack of 1, Aqua",
        "price": "₹284",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F91f1lyGdMDL._AC_UL320_.jpg",
        "asin": "B0B5HDRCSC",
        "affiliate": "https://www.amazon.in/dp/B0B5HDRCSC/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Galaxy Home Decor Abstract Opaque Polyester Curtain, Window - 5 ft, Brown, Pack of 2, Eyelet",
        "price": "₹305",
        "rating": "3.8 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81EdoMnAyCL._AC_UL320_.jpg",
        "asin": "B07NK9L8PT",
        "affiliate": "https://www.amazon.in/dp/B07NK9L8PT/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Story@Home 100% True Blackout Window Curtains 5 Feet Long Set of 1 | Plain Design | Room Darkening Curtain | Thermal Insulated Curtains for Living Room, Bedroom | (116 x 152 cm, Navy Blue)",
        "price": "₹629",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71ign7Zp18L._AC_UL320_.jpg",
        "asin": "B074XNHS85",
        "affiliate": "https://www.amazon.in/dp/B074XNHS85/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Home Sizzler 2 Pieces 3D Flower Eyelet Polyester Window Curtains - 5 Feet, Green | Semi-Sheer",
        "price": "₹321",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71pgSib6btL._AC_UL320_.jpg",
        "asin": "B0836JMXYS",
        "affiliate": "https://www.amazon.in/dp/B0836JMXYS/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "DECOMIZER Opaque Polyester 3D God Digital Printed Home Furnishing Polyresin Floral Curtain for Pooja Room|Temple Curtain|Bhagwan Parde, 4x7 Ft-1 Piece, Door Curtain - Mor Pankh, Grommet, Multicolor",
        "price": "₹359",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81Vhskt84yL._AC_UL320_.jpg",
        "asin": "B09NT19K69",
        "affiliate": "https://www.amazon.in/dp/B09NT19K69/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "STITCHNEST PVC Transparent AC Curtain | Waterproof Door Curtain | Quick Water Release | Dust & Insect Protection | Energy Saving Cooling Barrier | 7 Feet (Pack of 1)",
        "price": "₹249",
        "rating": "3.9 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71B4ZOH4S2L._AC_UL320_.jpg",
        "asin": "B0BX67Y6DB",
        "affiliate": "https://www.amazon.in/dp/B0BX67Y6DB/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Door Curtains 7 Feet Long | Yarn Polyester Curtains | Premium Screens for Home Office | Prada for Living Room Bedroom | (Purple Kolaveri, 1pc)",
        "price": "₹199",
        "rating": "3.6 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51b1Js1TroL._AC_UL320_.jpg",
        "asin": "B0BXPFFNR8",
        "affiliate": "https://www.amazon.in/dp/B0BXPFFNR8/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Cortina 80-90% Blackout Solid Door Curtains 7 Feet Set of 2 - Thermal Insulated | Curtain for Living Room | Drapes for Bedroom | (7 Feet, Grey)",
        "price": "₹798",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F711nJTnCn3L._AC_UL320_.jpg",
        "asin": "B0F23VGBP6",
        "affiliate": "https://www.amazon.in/dp/B0F23VGBP6/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Home Sizzler 2 Piece Elegant Panel Eyelet Polyester Door Curtains - 7 Feet, Blue",
        "price": "₹429",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81dRAItVB7L._AC_UL320_.jpg",
        "asin": "B06WV7656K",
        "affiliate": "https://www.amazon.in/dp/B06WV7656K/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "CASA-NEST Transparent PVC AC Curtain (4.5ft x 9ft) with 8 Hooks | Heavy Duty Clear Plastic Insulation Sheet for Energy Saving | Waterproof Shower & Door Partition Curtain",
        "price": "₹343",
        "rating": "3.8 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61xUCEQOXxL._AC_UL320_.jpg",
        "asin": "B07FN4FWN5",
        "affiliate": "https://www.amazon.in/dp/B07FN4FWN5/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Galaxy Home Decor Premium Blackout Curtain for Window 4 Feet | Thermal Insulated Modern Window Curtain with Rings for Living Room & Bedroom | Pack of 1,Beige",
        "price": "₹249",
        "rating": "3.9 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71vyAkQfsKL._AC_UL320_.jpg",
        "asin": "B0FQ5K9YPK",
        "affiliate": "https://www.amazon.in/dp/B0FQ5K9YPK/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Exporthub 2 Piece Eyelet Polyester Door Curtain - 7 feet, Cream",
        "price": "₹425",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F610vCWg0EzL._AC_UL320_.jpg",
        "asin": "B01CVRRKV6",
        "affiliate": "https://www.amazon.in/dp/B01CVRRKV6/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Home Sizzler 2 Pieces Solid Patch Bloom Burst Eyelet Polyester Door Curtains - 7 Feet, Grey",
        "price": "₹547",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71chSJAoabL._AC_UL320_.jpg",
        "asin": "B0CYQC239S",
        "affiliate": "https://www.amazon.in/dp/B0CYQC239S/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Galaxy Home Decor Solid Plain Curtains for Door 7 Feet, Pack of 2, Brown",
        "price": "₹449",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81wnDyMKdeL._AC_UL320_.jpg",
        "asin": "B07S41VWG9",
        "affiliate": "https://www.amazon.in/dp/B07S41VWG9/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Cortina Damask Light-Filtering Polyester Curtains 5 feet Long Set of 1 for Window [ Opacity: 50-60%, Color: Green, Printed Curtain -130 GSM ]",
        "price": "₹178",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F615nqpmunLL._AC_UL320_.jpg",
        "asin": "B0C6KVLWRX",
        "affiliate": "https://www.amazon.in/dp/B0C6KVLWRX/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Home Sizzler 2 Piece Flower Border Panel Eyelet Polyester Door Curtains - 7 Feet, Brown",
        "price": "₹405",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81Q-4DXQhEL._AC_UL320_.jpg",
        "asin": "B0BBFDWZBX",
        "affiliate": "https://www.amazon.in/dp/B0BBFDWZBX/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Homefab India Velvet Curtains Room Darkening - Door 7 feet, Pack of 2 Panels, Grey",
        "price": "₹719",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F91tZ-xADHXL._AC_UL320_.jpg",
        "asin": "B0D2977RN6",
        "affiliate": "https://www.amazon.in/dp/B0D2977RN6/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Home Sizzler 2 Piece Garden Panel Eyelet Polyester Window Curtains - 5 Feet, Maroon",
        "price": "₹300",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81l2If36DsL._AC_UL320_.jpg",
        "asin": "B0787XKC37",
        "affiliate": "https://www.amazon.in/dp/B0787XKC37/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Galaxy Home Decor Premium Blackout Curtain for Window 4 Feet | Thermal Insulated Modern Window Curtain with Rings for Living Room & Bedroom | Pack of 2, Mocha",
        "price": "₹448",
        "rating": "3.9 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81Np5DP%2Bt7L._AC_UL320_.jpg",
        "asin": "B0GTF3ZGJY",
        "affiliate": "https://www.amazon.in/dp/B0GTF3ZGJY/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Fabrilia Floral Net Semi Transparent Door Semi Sheer Grommet Curtains 7 Feet Set Of 2, White",
        "price": "₹563",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71GB1VL6VwL._AC_UL320_.jpg",
        "asin": "B09P5L5ZBS",
        "affiliate": "https://www.amazon.in/dp/B09P5L5ZBS/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Home Sizzler 2 Piece Ethnic Motif Border Panel Eyelet Polyester Door Curtain - 7 Feet, Blue",
        "price": "₹430",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81mGa%2BmzcQL._AC_UL320_.jpg",
        "asin": "B0BGF2Y7SN",
        "affiliate": "https://www.amazon.in/dp/B0BGF2Y7SN/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "HOMEMONDE Solid Blackout Curtains 5 Feet Long Set of 2 - Thermal Insulated Curtains for Window, 70% Room Darkening Drapes for Living Room, Bedroom, 60 Inches, (Beige, 152.4 x 118 CM)",
        "price": "₹999",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71fU6NzqEBL._AC_UL320_.jpg",
        "asin": "B0BV6B2BTT",
        "affiliate": "https://www.amazon.in/dp/B0BV6B2BTT/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "HUESLAND Cotton Curtains 7 feet Long for Door, 1 Bohemian Grommets Eyelets Curtains (Door 7 x 4 ft, Green Leaf Floral)",
        "price": "₹899",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81tcMzm91VL._AC_UL320_.jpg",
        "asin": "B0C2QGH63H",
        "affiliate": "https://www.amazon.in/dp/B0C2QGH63H/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Urban Space Premium Blackout Jacquard Curtains for Door, 80-85% Thermal Insulated Curtains for Living Room, Pack of 2 Blackout Curtains with Eyelets, Tieback Included (7 feet, Dusk Soft Brown)",
        "price": "₹1,999",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F819IKrE%2BDvL._AC_UL320_.jpg",
        "asin": "B0F4W9FWJQ",
        "affiliate": "https://www.amazon.in/dp/B0F4W9FWJQ/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Story@Home Sheer Curtains 8 Feet Long Set of 2 | Net Semi Transparent Curtain | Solid Printed | Semi Long Door Curtain for Living Room, Bedroom | (118 X 242 cm, Beige)",
        "price": "₹1,199",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71Rif1wIUyL._AC_UL320_.jpg",
        "asin": "B0GRVSYKCV",
        "affiliate": "https://www.amazon.in/dp/B0GRVSYKCV/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Dekorly Artificial Lavender Plant in White Pot, 18cm – Realistic Faux Flower Arrangement for Home & Office Décor (Set of 1) (1, White Color Pot)",
        "price": "₹259",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61oHjuL-ZNL._AC_UL320_.jpg",
        "asin": "B0G2C4KYR3",
        "affiliate": "https://www.amazon.in/dp/B0G2C4KYR3/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "SPHINX White Ceramic Donut Vase, 6 Inch Modern Flower Vase for Pampas Grass, Dried Flowers, Home & Office Decor, Centerpiece, Handcrafted Gift Vase Only",
        "price": "₹178",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F813Kzy7rfqL._AC_UL320_.jpg",
        "asin": "B0CQ23K1SB",
        "affiliate": "https://www.amazon.in/dp/B0CQ23K1SB/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Rousrie Wooden Wall Hanging For Home Décor, Set of 11, Living Room, Bedroom, Office Decoration (Rajasthani)",
        "price": "₹199",
        "rating": "3.9 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81Ota-b141L._AC_UL320_.jpg",
        "asin": "B0DNMTMMF5",
        "affiliate": "https://www.amazon.in/dp/B0DNMTMMF5/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "fancymart Artificial Plants with Pot (Pack of 2, 45 cm) – Hanging Plants for Home Decor | Fake Plants Vine Creeper for Living Room, Wall, Office & Indoor Decoration",
        "price": "₹235",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F713NePqdaeL._AC_UL320_.jpg",
        "asin": "B0C1W5BKK2",
        "affiliate": "https://www.amazon.in/dp/B0C1W5BKK2/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Dekorly Artificial Potted Plants, Artificial Plastic Eucalyptus Plants Small Indoor Potted Houseplants, Small Faux Plants for Home Decor Bathroom Office Farmhouse (Set 0F 8)",
        "price": "₹299",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F8139T8YbdkL._AC_UL320_.jpg",
        "asin": "B0BCKLM33P",
        "affiliate": "https://www.amazon.in/dp/B0BCKLM33P/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Webelkart Premium Home Keys Wooden Key Holder (29 cm x 13.5 cm x 0.4 cm, Wood) 7 Hook - Decorative Items for Home Decor (Black)",
        "price": "₹177",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81eil1Y4QpL._AC_UL320_.jpg",
        "asin": "B0D4F4R4RK",
        "affiliate": "https://www.amazon.in/dp/B0D4F4R4RK/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "JaipurCrafts Premium Sparkle Square Gramophone Showpiece - 23 cm (Brass, Brown, Gold) (Black, Gold) (Black, Gold)",
        "price": "₹299",
        "rating": "3.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F715dmJcuJZL._AC_UL320_.jpg",
        "asin": "B018LX0NAO",
        "affiliate": "https://www.amazon.in/dp/B018LX0NAO/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "AERYS Digital Alarm Clock with Automatic Sensor, Date and Temperature Display, Compact Desk Table Clock for Students, Home, Office, Bedroom, Living Room,Home Decor, Corporate Use (Black Digital)",
        "price": "₹299",
        "rating": "3.8 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51MctYF8BiL._AC_UL320_.jpg",
        "asin": "B0CQH5N1DY",
        "affiliate": "https://www.amazon.in/dp/B0CQH5N1DY/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Wooden 1 Glass Test Tube Home Decor Planter Modern Flower Vase with Wood Stand Plant Propagation (17x12.5) cm",
        "price": "₹99",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F4176Z641npL._AC_UL320_.jpg",
        "asin": "B0CJ744N7Z",
        "affiliate": "https://www.amazon.in/dp/B0CJ744N7Z/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "PUREZENTO Unique White Ceramic Donut Vase 8.5 & 5.7 Inch - Set of 2 | Decorative Donut Vase for Dried Flowers & Pampas Grass | Vases for Modern Home Decor, Living Room, Office Decor Ideas",
        "price": "₹544",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61NA2BGm89L._AC_UL320_.jpg",
        "asin": "B0DQQ2GXRB",
        "affiliate": "https://www.amazon.in/dp/B0DQQ2GXRB/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "BEHOMA Aluminium Pair of Swans with Gift Box for Good Luck | Feng Shui Love Gifts Candle Holder for Home Decor Living Room | Showpiece Anniversary Wedding Gifts for Couple (Candles not Included) Gold",
        "price": "₹1,298",
        "rating": "4.6 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81BIupehFVL._AC_UL640_QL65_.jpg",
        "asin": "B0BY2XCXYC",
        "affiliate": "https://www.amazon.in/dp/B0BY2XCXYC/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Global Grabbers New Limited Edition 25 Centimetre Meditating Sitting Buddha Idol Statue showpiece Home Decor Decoration Items for Living Room and Gifts (1, Orange Black)",
        "price": "₹371",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F815eXSPF%2B4L._AC_UL320_.jpg",
        "asin": "B07LF3PQYF",
        "affiliate": "https://www.amazon.in/dp/B07LF3PQYF/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "NYRWANA Table Lamp | 2000mAh Battery | Home Decor, Lamps for Bedroom, Lamp for Living Room, Stepless Dimming, 3 Colour Touch Control, USB-c Charging (Metal - Gold)",
        "price": "₹540",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61J3nHsyp6L._AC_UL320_.jpg",
        "asin": "B0CT2SBYKT",
        "affiliate": "https://www.amazon.in/dp/B0CT2SBYKT/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Akaar Polyester Artificial Plants Leaves Money Plant Greenery Hanging Vine Creeper Home Decor Door Wall Balcony Decoration Party Festival Craft(7.2Ft) - Pack Of 1",
        "price": "₹86",
        "rating": "3.8 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71h9cNPXjmL._AC_UL320_.jpg",
        "asin": "B0CCVYSYPG",
        "affiliate": "https://www.amazon.in/dp/B0CCVYSYPG/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "amazon basics Artificial Plants with Pot|Realistic Looking| Multi Variety |Durable Plastic | No Maintenance | Home Decor | Dimensions: 5 cm X 13 cm (Pack of 8)",
        "price": "₹298",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F710jjgj13jL._AC_UL320_.jpg",
        "asin": "B0D25C6QP2",
        "affiliate": "https://www.amazon.in/dp/B0D25C6QP2/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Homesake® Retro Down to the Wire Metal Table Lamp with Fabric Shade, Bedside Lamp Gift Housewarming Home Living Room, Pleated Shade (Off-White)",
        "price": "₹409",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61xO0lWxdOL._AC_UL320_.jpg",
        "asin": "B0DQP38PJD",
        "affiliate": "https://www.amazon.in/dp/B0DQP38PJD/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Artvibes Bless This Home Wall Art Wooden Wall Hanging for Living Room | Quotes Decor | Wall Art For Hall| Hanging Graffiti | Paintings | Sceneries | Printed Decore (WH_6603N)",
        "price": "₹221",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71vBYh7o5lL._AC_UL320_.jpg",
        "asin": "B0B94444P5",
        "affiliate": "https://www.amazon.in/dp/B0B94444P5/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "UGAOO Jade Plant in Mocca Ibiza Pot | Low-Maintenance Succulent for Home Decor, Office Desk & Good Luck Feng Shui Plant",
        "price": "₹176",
        "rating": "3.8 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81DGlsYpFXL._AC_UL320_.jpg",
        "asin": "B0F9FM266J",
        "affiliate": "https://www.amazon.in/dp/B0F9FM266J/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Homesake® Modern Small Crystal Table Lamp, Contemporary Bedroom Bedside Nightstand Lamp, Morden Minimalist, Desk Globe Lamp for Living Room Girls Kids Room, Fabric Shade (White)",
        "price": "₹729",
        "rating": "3.9 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71OdSxSTnJL._AC_UL320_.jpg",
        "asin": "B0CK6W443Y",
        "affiliate": "https://www.amazon.in/dp/B0CK6W443Y/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Webelkart Premium HD UV Printed Mahindra Thar Car Shape Designer Wooden Key Holder Home and Office Decor (11 X 6 Inch, Wood) (Yellow)",
        "price": "₹187",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61v0BuK%2Br2L._AC_UL320_.jpg",
        "asin": "B0DB249WGP",
        "affiliate": "https://www.amazon.in/dp/B0DB249WGP/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Proxin Rubber Kitchen Mats for Floor 2 Pcs Non Slip Kitchen Mats Washable Cushion Rug for Home, Cooking & Standing Comfort Kitchen Decor with Modern Design with Easy to Clean (118 x 38cm, 58 x 38cm)",
        "price": "₹474",
        "rating": "3.9 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61Z09XSU3LL._AC_UL320_.jpg",
        "asin": "B0FY3B7CGD",
        "affiliate": "https://www.amazon.in/dp/B0FY3B7CGD/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Xtore® 12pcs 3D Home Decor Butterfly with Sticking Pad (Shimmer Golden, Set of 12)",
        "price": "₹299",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71tNwTNO3TL._AC_UL320_.jpg",
        "asin": "B0774X1QCB",
        "affiliate": "https://www.amazon.in/dp/B0774X1QCB/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "DECORIQUE Wooden Wall Hanging Welcome Sign Decorative Quote Board For Home, Door, Entrance, Hall & Office - Rustic Wall Art & Housewarming Gift Item,25 Cm",
        "price": "₹194",
        "rating": "3.9 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F617%2B4Y2FDTL._AC_UL320_.jpg",
        "asin": "B0F7HXKH7R",
        "affiliate": "https://www.amazon.in/dp/B0F7HXKH7R/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Global Grabbers New 25 Centimetre Meditating Sitting Buddha Statue showpiece Idol Home Decor Items for Living Room and Gifts (Golden2)",
        "price": "₹448",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F91z86Cjd5zL._AC_UL320_.jpg",
        "asin": "B095JZW7B4",
        "affiliate": "https://www.amazon.in/dp/B095JZW7B4/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Webelkart Premium Iron Gold Plated 3 Leaf Shape Decoration Table Stand for Home and Living Room Decor - (7.8 inches, Gold)- Decorative Items for Home Decor, Showpiece for Home Decor",
        "price": "₹187",
        "rating": "3.9 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71kJHD94buL._AC_UL320_.jpg",
        "asin": "B0CWNB2F3G",
        "affiliate": "https://www.amazon.in/dp/B0CWNB2F3G/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Xtore® Home Decor Lucky Deer Family Matte Finish Ceramic Figures - (Set of 3, Matte Brown)",
        "price": "₹829",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71qdMrPodaL._AC_UL320_.jpg",
        "asin": "B08MD5J7Z5",
        "affiliate": "https://www.amazon.in/dp/B08MD5J7Z5/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "SPHINX Decorative Glass Vase for Flowers Plants Home Decor Office Living Table Decorations, Vases for Home Decor, Luster Glass Vase,Modern - (Crystal Amber, Approx 9 Inches Height)",
        "price": "₹212",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71jwO2MnbML._AC_UL320_.jpg",
        "asin": "B0CSWJ39V4",
        "affiliate": "https://www.amazon.in/dp/B0CSWJ39V4/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Artvibes Royal Fort And Rides Moder Art Decorative Wall Art MDF Wooden Wall Hanger for Home | Room Decoration | Handcrafted Art | Aesthetic Wooden Decor | Artworks Hangings | Ideal Gifts (WH_6533N)",
        "price": "₹223",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81AdAsrHv8L._AC_UL320_.jpg",
        "asin": "B0F8P3WVCR",
        "affiliate": "https://www.amazon.in/dp/B0F8P3WVCR/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "TIED RIBBONS Set of 4 Miniature Buddha Monk Statues for Home Decor and Gifts (Small, Multicolour) Resin",
        "price": "₹198",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71WBIhxYlZL._AC_UL320_.jpg",
        "asin": "B07P8SYN87",
        "affiliate": "https://www.amazon.in/dp/B07P8SYN87/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Rousrie Madhubani Art Framed Painting For Home, Living Room, Hall | Traditional Rajasthani Pichwai Art Paitnings With Frame For Home Decor (Set Of 4)",
        "price": "₹279",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F9163C25UNuL._AC_UL320_.jpg",
        "asin": "B0F91D628S",
        "affiliate": "https://www.amazon.in/dp/B0F91D628S/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "VRB Dec 50 Pcs Set 17inch Natural Dried Pampas Grass,Real Rabbit Bunny Tail,Reed Pampas,Boho Bouquet,Artificial Flowers Decor for Table Vase Home Decoration. (50 Pcs Dried Bunny Tails)",
        "price": "₹329",
        "rating": "3.6 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61Kb2qgskZL._AC_UL320_.jpg",
        "asin": "B0DTFBPCYD",
        "affiliate": "https://www.amazon.in/dp/B0DTFBPCYD/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "SATYAM KRAFT 1 Set (3 Pcs) LED Tea Light Candles | Flameless, Smokeless, Unscented | for Gifting, Home Decor, Room Decoration Lights, Balcony & Festival, Wedding Decoration Items (1 Set)",
        "price": "₹379",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61haQBFBlyL._AC_UL320_.jpg",
        "asin": "B0C3D5TV4W",
        "affiliate": "https://www.amazon.in/dp/B0C3D5TV4W/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Desidiya® 16-Color LED Night Light Sunset Lamp with Remote & USB – 360° Rotating Projection Light for Room Ambience, Wall Decor, Photography & Mood Lighting",
        "price": "₹277",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F713fAW3HyUL._AC_UL320_.jpg",
        "asin": "B0FD9T4NPJ",
        "affiliate": "https://www.amazon.in/dp/B0FD9T4NPJ/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "SPHINX Ribbed Pipe Ceramic Vase for Flowers, Pampas Grass, or Live Plants | Decorative Home & Office Centerpiece Gift – No Flowers- (White, 6 Inch)",
        "price": "₹247",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61Lt6ZEiQUL._AC_UL320_.jpg",
        "asin": "B0CWY4TKNW",
        "affiliate": "https://www.amazon.in/dp/B0CWY4TKNW/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Modern Round Side Table, Home Decor for Living Room, Bed Side Tables for Bed Room, stools for Home, Furniture for Home, 2-Tier White Shelves, 30 x 30 x 40 cm",
        "price": "₹499",
        "rating": "3.9 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51mv-jIBNWL._AC_UL320_.jpg",
        "asin": "B0FNWMP3S2",
        "affiliate": "https://www.amazon.in/dp/B0FNWMP3S2/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "CRAFTEL Double Sided Station Wall Clock Multi-Layer Electroplated | Both Side English Numerals | Aluminum Matte-Finish Dial Metal Body | Dial - 8 Inches, Shiny Gold | 365 Days Warranty",
        "price": "₹1,669",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81zqloh6RFL._AC_UL320_.jpg",
        "asin": "B07SDR8Y2L",
        "affiliate": "https://www.amazon.in/dp/B07SDR8Y2L/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "eCraftIndia Resin Set of 4 Little Monk Buddha Statue Think No Evil Speak No Evil Hear No Evil See No Evil Showpiece for Home Decor Living Room Office| Diwali Housewarming Buddha Purnima Birthday Gifts",
        "price": "₹278",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71W0D-K-tBL._AC_UL320_.jpg",
        "asin": "B07P41VGFP",
        "affiliate": "https://www.amazon.in/dp/B07P41VGFP/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Crosscut Furniture LED Tripod Floor Lamp with 3 Shelves, Fresh Flower, Yellow, Metal Corner Floor Lamp for Living Room & Bedroom Decoration",
        "price": "₹1,795",
        "rating": "4.5 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81JL7n7CM5L._AC_UL320_.jpg",
        "asin": "B0CK4BZZKG",
        "affiliate": "https://www.amazon.in/dp/B0CK4BZZKG/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Xtore Hand Crafted Swan Pair Home Decor Figurine | Decorative Showpiece (Pack of 2, Blue)",
        "price": "₹1,509",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81YIVj3bicL._AC_UL320_.jpg",
        "asin": "B0C2HNBNNM",
        "affiliate": "https://www.amazon.in/dp/B0C2HNBNNM/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "CDM Handcrafted Rajasthani Wall Hanging | Ethnic Decorative Hanging with Beads & Bell | Home Decor for Door, Wall, Balcony",
        "price": "₹196",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71qIifBB3OL._AC_UL320_.jpg",
        "asin": "B0FCMKV87F",
        "affiliate": "https://www.amazon.in/dp/B0FCMKV87F/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Global Grabbers Buddha Statue Showpiece Idol Home Decor Items for Living Room and Gifts (Golden RED Blue)",
        "price": "₹995",
        "rating": "4.6 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81oRooa2aCL._AC_UL320_.jpg",
        "asin": "B0F1VB96TH",
        "affiliate": "https://www.amazon.in/dp/B0F1VB96TH/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "JD FRESH Feng Shui 7 Chakra Crystal Tree with Golden Money Bag Base/Natural Gemstone Decorative Showpiece Bonsai Tree for Home & Office Décor, Good Luck Diwali Gift, Wealth & Prosperity",
        "price": "₹799",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F817C1dk7klL._AC_UL320_.jpg",
        "asin": "B0G4D1G2C3",
        "affiliate": "https://www.amazon.in/dp/B0G4D1G2C3/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "CINAGRO Metal Flower Vase Planter Pot, Pots for Plants, Plant Pots for Home Decoration, Succulent Pot, Indoor Planter Garden Decor Style: Grand Manor",
        "price": "₹179",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71aLEYNAiFL._AC_UL320_.jpg",
        "asin": "B0F99M2DY8",
        "affiliate": "https://www.amazon.in/dp/B0F99M2DY8/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Collectible India Peacock Design Radha Krishna Idol Showpiece with Diya for Puja and Home Decor (7 x 5 Inches), Metal, Gold (1 Piece)",
        "price": "₹355",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F814wwnDQ1gL._AC_UL320_.jpg",
        "asin": "B07VYL7FSF",
        "affiliate": "https://www.amazon.in/dp/B07VYL7FSF/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "999 Pure Silver Plated Kamdhenu Cow Idol | 4 Inch Vastu Home Decor | Symbol of Prosperity & Abundance | Auspicious Religious Gift for Pooja Room & Mandir",
        "price": "₹3,499",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71DKi4mDc2L._AC_UL320_.jpg",
        "asin": "B0FPXGTNV2",
        "affiliate": "https://www.amazon.in/dp/B0FPXGTNV2/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Sehaz Artworks Wall Decoration Items for Living Room |Photo Frames for Wall Decoration|Memories Wall Hanging |Home Decor Items |Photo Hanging Clips and Rope|Room Decor Items |Photo Frame for Friends",
        "price": "₹199",
        "rating": "4.5 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71kwV2psAwL._AC_UL320_.jpg",
        "asin": "B0CMH1ZBDT",
        "affiliate": "https://www.amazon.in/dp/B0CMH1ZBDT/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "White 19 Inch Running 7 Victory Horses Resin Statue for Vastu and Feng Shui | Home Office Living Room Decor Showpiece",
        "price": "₹2,726",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61Pdpdoc05L._AC_UL320_.jpg",
        "asin": "B0DZVTXHBW",
        "affiliate": "https://www.amazon.in/dp/B0DZVTXHBW/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Artvibes Home Quotes Decorative Wall Mdf Wooden Hanging For Living Room | Handcrafted Art | Mdf| Paintings | Quote | Gifts | Sceneries For Wall | Unique Gift (WH_7304N)",
        "price": "₹221",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71PI9O5JTML._AC_UL320_.jpg",
        "asin": "B0BFL3P62F",
        "affiliate": "https://www.amazon.in/dp/B0BFL3P62F/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "Seven Chakra Gemston Tree of Life, Positive Energy, Feng Shui Decor, Bonsai, Crystals and Healing Stones, Money Tree, Room Decor Stone, Healing Crystals (Chakra Tree)",
        "price": "₹399",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F819gqQRVvHL._AC_UL320_.jpg",
        "asin": "B0D67H9HKM",
        "affiliate": "https://www.amazon.in/dp/B0D67H9HKM/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india"
    },
    {
        "title": "FUR JADEN Anti Theft Number Lock Backpack Bag with 15.6 Inch Laptop Compartment, USB Charging Port & Organizer Pocket for Men Women Boys Girls",
        "price": "₹588",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61egMfcDWlL._AC_UY218_.jpg",
        "asin": "B09VTDMRY7",
        "affiliate": "https://www.amazon.in/dp/B09VTDMRY7/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india",
        "audience": "men"
    },
    {
        "title": "Safari Omega spacious/large laptop backpack with Raincover, college bag, travel bag for men and women, Black, 30 Litre",
        "price": "₹649",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71maWXZscfL._AC_UY218_.jpg",
        "asin": "B097JJ2CK6",
        "affiliate": "https://www.amazon.in/dp/B097JJ2CK6/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india",
        "audience": "men"
    },
    {
        "title": "GadgetBite Graphite 20L Laptop Backpack with 15.6\" Laptop Compartment, USB Charging Port, Organiser Pockets and Bottle Holder. Ideal for Office, College and Travel",
        "price": "₹599",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F718vsdE4aIL._AC_UY218_.jpg",
        "asin": "B0DT4M5QZ9",
        "affiliate": "https://www.amazon.in/dp/B0DT4M5QZ9/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india",
        "audience": "men"
    },
    {
        "title": "Aristocrat Lava 17 Inch Compatible Laptop Backpack 25L | Premium Durable Fabric | 2 Compartments with Side Bottle Pocket | Padded Backpanel | Office & Travel Backpack for Men & Women",
        "price": "₹427",
        "rating": "3.7 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71nXs0aNQSL._AC_UY218_.jpg",
        "asin": "B0FMY7DLJT",
        "affiliate": "https://www.amazon.in/dp/B0FMY7DLJT/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india",
        "audience": "men"
    },
    {
        "title": "Bennett™ Mystic 15.6 inch (39.6cm) Laptop Briefcase Shoulder Sling Office Business Professional Travel Messenger Bag for Men and Women Water Repellent Formal Executive Bags (Grey) 6 Months Warranty",
        "price": "₹512",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81a1-ephOCL._AC_UY218_.jpg",
        "asin": "B09321GJXZ",
        "affiliate": "https://www.amazon.in/dp/B09321GJXZ/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india",
        "audience": "men"
    },
    {
        "title": "American Tourister Valex | 28L Backpack | 17\" Laptop Bag | 2 Compartments | College & Office Backpack for Men and Women | Black | 1 Year Global Warranty",
        "price": "₹1,299",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51yfw2JIxwL._AC_UY218_.jpg",
        "asin": "B0BTD4S4XF",
        "affiliate": "https://www.amazon.in/dp/B0BTD4S4XF/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india",
        "audience": "men"
    },
    {
        "title": "Aristocrat Nova 15L Laptop Backpack for Men & Women with Bottle Pocket | Padded Shoulder Straps, Multi Compartments | Travel & College Bag | Dark Black",
        "price": "₹349",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71aYGrOy6gL._AC_UY218_.jpg",
        "asin": "B0D8BG7S4P",
        "affiliate": "https://www.amazon.in/dp/B0D8BG7S4P/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india",
        "audience": "men"
    },
    {
        "title": "NORTH ZONE 30L Water Restant Office Laptop Bag/Backpack for Men/Women/(Black)",
        "price": "₹499",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61LB4CRJ9nL._AC_UY218_.jpg",
        "asin": "B0CJ378GZB",
        "affiliate": "https://www.amazon.in/dp/B0CJ378GZB/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india",
        "audience": "men"
    },
    {
        "title": "Wooum Water-Resistant Sling Bag for Men with 1 Year Warranty | Stylish Crossbody & Messenger Bag | Compact Office & Travel Side Bag | Waterproof Man Bag | Gift for Men Under 500",
        "price": "₹296",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F91avn9At21L._AC_UY218_.jpg",
        "asin": "B0CXPY1X7G",
        "affiliate": "https://www.amazon.in/dp/B0CXPY1X7G/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india",
        "audience": "men"
    },
    {
        "title": "FATMUG Laptop Messenger Bag For Men -Convertible Large Backpack For Office And Travel -Oxford Fabric",
        "price": "₹1,599",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71Bo4-Xdd1L._AC_UY218_.jpg",
        "asin": "B084LF4RT5",
        "affiliate": "https://www.amazon.in/dp/B084LF4RT5/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india",
        "audience": "men"
    },
    {
        "title": "ADISA Laptop Messenger Office Bag Briefcase for Work for Men",
        "price": "₹599",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F91ADzwHQk%2BL._AC_UY218_.jpg",
        "asin": "B0GH6H7G2C",
        "affiliate": "https://www.amazon.in/dp/B0GH6H7G2C/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india",
        "audience": "men"
    },
    {
        "title": "FUR JADEN Anti Theft Number Lock Backpack Bag with 15.6 Inch Laptop Compartment, USB Charging Port & Organizer Pocket for Men Women Boys Girls",
        "price": "₹699",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71PRQKJNdHL._AC_UY218_.jpg",
        "asin": "B09VTCNN75",
        "affiliate": "https://www.amazon.in/dp/B09VTCNN75/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india",
        "audience": "men"
    },
    {
        "title": "Gear Vintage 2 Faux Leather(Without Antitheft) 19\"/34L Large Water Resistant Laptop Backpack/Casual Backpack/Daypack/Travel Backpack/College Bag For Men/Women(Black-Brown)",
        "price": "₹1,189",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71X%2Bke2huIL._AC_UY218_.jpg",
        "asin": "B0FFB8KTF8",
        "affiliate": "https://www.amazon.in/dp/B0FFB8KTF8/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india",
        "audience": "men"
    },
    {
        "title": "Skybags Nero 15 Inch Compatible Anti-Theft Laptop Backpack 20L | 3 Compartments with Side Bottle Pocket | Padded Backpanel | Trolley Sleeve | Office & Travel Backpack for Men & Women (Olive Green)",
        "price": "₹999",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71ULGpotRmL._AC_UY218_.jpg",
        "asin": "B0FSXZGLJX",
        "affiliate": "https://www.amazon.in/dp/B0FSXZGLJX/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india",
        "audience": "men"
    },
    {
        "title": "RIONTO Prime Vegan Leather Laptop Bags for Men Office Use | Upto 15.6 inch | Expandable Bottom | Mobile & Pen Compartment with Multiple Organizers | Professional Office Bag for Man & Women - Tan",
        "price": "₹1,579",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71sEAzKpQnL._AC_UY218_.jpg",
        "asin": "B0C5T56YNY",
        "affiliate": "https://www.amazon.in/dp/B0C5T56YNY/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india",
        "audience": "men"
    },
    {
        "title": "ADISA Laptop Messenger Office Bag Briefcase for Work for Men (LB6052)",
        "price": "₹599",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F91G9%2BIdi8fL._AC_UY218_.jpg",
        "asin": "B0G26K63JB",
        "affiliate": "https://www.amazon.in/dp/B0G26K63JB/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india",
        "audience": "men"
    },
    {
        "title": "Carrylux",
        "price": "₹498",
        "rating": "4.8 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61FfZyulIZL._AC_UL320_.jpg",
        "asin": "B0GK34HKMN",
        "affiliate": "https://www.amazon.in/dp/B0GK34HKMN/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "Carrylux",
        "price": "₹413",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81ZZzCBJBUL._AC_UL320_.jpg",
        "asin": "B0BJ7NFTB8",
        "affiliate": "https://www.amazon.in/dp/B0BJ7NFTB8/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "LEGAL BRIBE",
        "price": "₹569",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71OW7nY-JdL._AC_UL320_.jpg",
        "asin": "B0CQP1QYBW",
        "affiliate": "https://www.amazon.in/dp/B0CQP1QYBW/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "Generic",
        "price": "₹299",
        "rating": "3.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51r-KN2CArL._AC_UL320_.jpg",
        "asin": "B0GTMTMD15",
        "affiliate": "https://www.amazon.in/dp/B0GTMTMD15/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "ForeverCarry",
        "price": "₹399",
        "rating": "4.6 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51HTd9pGwuL._AC_UL320_.jpg",
        "asin": "B0GF9GCTLW",
        "affiliate": "https://www.amazon.in/dp/B0GF9GCTLW/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "Horse and Hash",
        "price": "₹449",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61w11APMF3L._AC_UL320_.jpg",
        "asin": "B0FL2451BD",
        "affiliate": "https://www.amazon.in/dp/B0FL2451BD/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "AESTHETIC HANDBAGS",
        "price": "₹298",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51gcz3ppyJL._AC_UL320_.jpg",
        "asin": "B0G9KZ8YV7",
        "affiliate": "https://www.amazon.in/dp/B0G9KZ8YV7/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "IRMAO",
        "price": "₹499",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61hre5NAPiL._AC_UL320_.jpg",
        "asin": "B09NNG1P81",
        "affiliate": "https://www.amazon.in/dp/B09NNG1P81/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "LEGAL BRIBE",
        "price": "₹492",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71iHbv5vkqL._AC_UL320_.jpg",
        "asin": "B0CP84GDFW",
        "affiliate": "https://www.amazon.in/dp/B0CP84GDFW/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "Lyrovo",
        "price": "₹465",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61Qn7SrsJJL._AC_UL320_.jpg",
        "asin": "B0F6TZ572V",
        "affiliate": "https://www.amazon.in/dp/B0F6TZ572V/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "SHOPO Handbags for Women combo | Soft PU Leather | Attractive Ladies Purse | Bags for Women with Long Strap and Wallet (3 in 1)",
        "price": "₹1,879",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61XDInlpIAL._AC_UL640_QL65_.jpg",
        "asin": "B09N1882WY",
        "affiliate": "https://www.amazon.in/dp/B09N1882WY/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "Lyrovo",
        "price": "₹464",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F41xLDgIxH1L._AC_UL320_.jpg",
        "asin": "B0F5GS19M1",
        "affiliate": "https://www.amazon.in/dp/B0F5GS19M1/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "IRMAO",
        "price": "₹499",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61GqpD8mdgL._AC_UL320_.jpg",
        "asin": "B0DH6L1DGG",
        "affiliate": "https://www.amazon.in/dp/B0DH6L1DGG/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "HaveGlam",
        "price": "₹284",
        "rating": "3.8 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51v%2BhicV2-L._AC_UL320_.jpg",
        "asin": "B0G4QF7H5D",
        "affiliate": "https://www.amazon.in/dp/B0G4QF7H5D/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "HaveGlam",
        "price": "₹284",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F41yFFLw%2BFBL._AC_UL320_.jpg",
        "asin": "B0GCNXM1H3",
        "affiliate": "https://www.amazon.in/dp/B0GCNXM1H3/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "Wazdorf",
        "price": "₹499",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71K1L77B7OL._AC_UL320_.jpg",
        "asin": "B0D3LZCGV4",
        "affiliate": "https://www.amazon.in/dp/B0D3LZCGV4/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "Lavie",
        "price": "₹1,049",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81SRDNUx%2BkL._AC_UL320_.jpg",
        "asin": "B0B3JBRB6J",
        "affiliate": "https://www.amazon.in/dp/B0B3JBRB6J/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "Lavie",
        "price": "₹949",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61V9aRtNBRL._AC_UL320_.jpg",
        "asin": "B08J8JCPZ4",
        "affiliate": "https://www.amazon.in/dp/B08J8JCPZ4/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "Max",
        "price": "₹499",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51DbxTJTdhL._AC_UL320_.jpg",
        "asin": "B0DCVWPXVX",
        "affiliate": "https://www.amazon.in/dp/B0DCVWPXVX/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "The Purple Tree",
        "price": "₹799",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61oix3ol0eL._AC_UL320_.jpg",
        "asin": "B0C9V6CJ9B",
        "affiliate": "https://www.amazon.in/dp/B0C9V6CJ9B/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "EXOTIC",
        "price": "₹1,198",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61NhaCR1UDL._AC_UL320_.jpg",
        "asin": "B09WVQVS2X",
        "affiliate": "https://www.amazon.in/dp/B09WVQVS2X/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "ADISA",
        "price": "₹496",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71ZxLkR86jL._AC_UL320_.jpg",
        "asin": "B0CZPHYY24",
        "affiliate": "https://www.amazon.in/dp/B0CZPHYY24/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "ADISA",
        "price": "₹796",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51uCFgyZOFL._AC_UL320_.jpg",
        "asin": "B0D7739W64",
        "affiliate": "https://www.amazon.in/dp/B0D7739W64/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "JKM & Company",
        "price": "₹41,664",
        "rating": "4.6 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71XczyodsGL._AC_UL320_.jpg",
        "asin": "B0791Z894D",
        "affiliate": "https://www.amazon.in/dp/B0791Z894D/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "ZOUK",
        "price": "₹1,088",
        "rating": "4.5 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71a9TRSsXIL._AC_UL320_.jpg",
        "asin": "B0BQWF3TJK",
        "affiliate": "https://www.amazon.in/dp/B0BQWF3TJK/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "ADISA",
        "price": "₹496",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71I4Yx1anzL._AC_UL320_.jpg",
        "asin": "B0CZPJRDQN",
        "affiliate": "https://www.amazon.in/dp/B0CZPJRDQN/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "ADISA",
        "price": "₹597",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81S7jhwBINL._AC_UL320_.jpg",
        "asin": "B0F6ZQDYPG",
        "affiliate": "https://www.amazon.in/dp/B0F6ZQDYPG/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "ADISA",
        "price": "₹495",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61jsDR7kaYL._AC_UL320_.jpg",
        "asin": "B09154JPWQ",
        "affiliate": "https://www.amazon.in/dp/B09154JPWQ/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "ADISA",
        "price": "₹695",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81mAaCC%2B-zL._AC_UL320_.jpg",
        "asin": "B0D6X2FBM6",
        "affiliate": "https://www.amazon.in/dp/B0D6X2FBM6/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "Lavie",
        "price": "₹799",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81QX9Dat3JL._AC_UL320_.jpg",
        "asin": "B094J474T3",
        "affiliate": "https://www.amazon.in/dp/B094J474T3/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "Lavie",
        "price": "₹949",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61pGsyeaCsL._AC_UL320_.jpg",
        "asin": "B0DZ6YFV4M",
        "affiliate": "https://www.amazon.in/dp/B0DZ6YFV4M/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "Lavie",
        "price": "₹949",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61SXM77U-9L._AC_UL320_.jpg",
        "asin": "B08J8KM544",
        "affiliate": "https://www.amazon.in/dp/B08J8KM544/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "Lavie",
        "price": "₹649",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81Ghm2u5-wL._AC_UL320_.jpg",
        "asin": "B09WYDVGDQ",
        "affiliate": "https://www.amazon.in/dp/B09WYDVGDQ/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "Lavie",
        "price": "₹1,349",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61JoqxL4ATL._AC_UL320_.jpg",
        "asin": "B0DY819JZ8",
        "affiliate": "https://www.amazon.in/dp/B0DY819JZ8/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "U.S. Polo Assn.",
        "price": "₹5,599",
        "rating": "4.6 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81QxAtxHHtL._AC_UL320_.jpg",
        "asin": "B0DRKDZ9BL",
        "affiliate": "https://www.amazon.in/dp/B0DRKDZ9BL/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "Lifelong",
        "price": "₹199",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71sJX24y6yL._AC_UL320_.jpg",
        "asin": "B0FCYHSSKQ",
        "affiliate": "https://www.amazon.in/dp/B0FCYHSSKQ/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "Mochi",
        "price": "₹594",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F716urAg%2BQYL._AC_UL320_.jpg",
        "asin": "B09W1B1M26",
        "affiliate": "https://www.amazon.in/dp/B09W1B1M26/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "ZOUK",
        "price": "₹1,999",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81H43eW1TSL._AC_UL320_.jpg",
        "asin": "B0DGQNLJX7",
        "affiliate": "https://www.amazon.in/dp/B0DGQNLJX7/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "Lavie",
        "price": "₹1,649",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61%2BJ53Mmo7L._AC_UL320_.jpg",
        "asin": "B0D83MTRFC",
        "affiliate": "https://www.amazon.in/dp/B0D83MTRFC/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "PUMA",
        "price": "₹1,029",
        "rating": "4.6 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F41Bi2KMg1zL._AC_UL320_.jpg",
        "asin": "B0DSC55RBP",
        "affiliate": "https://www.amazon.in/dp/B0DSC55RBP/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "Max",
        "price": "₹499",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51kOPXoH30L._AC_UL320_.jpg",
        "asin": "B0FQ5B1G69",
        "affiliate": "https://www.amazon.in/dp/B0FQ5B1G69/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "Lavie",
        "price": "₹1,449",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71U07JJbngL._AC_UL320_.jpg",
        "asin": "B0DVLNFTRT",
        "affiliate": "https://www.amazon.in/dp/B0DVLNFTRT/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "Lavie",
        "price": "₹1,169",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F7117mmgOm-L._AC_UL320_.jpg",
        "asin": "B0DVLGJQN2",
        "affiliate": "https://www.amazon.in/dp/B0DVLGJQN2/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "Lavie",
        "price": "₹1,449",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61-wXlQa5kL._AC_UL320_.jpg",
        "asin": "B096KTWTXC",
        "affiliate": "https://www.amazon.in/dp/B096KTWTXC/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "Lavie",
        "price": "₹1,649",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61l0XOO0bHL._AC_UL320_.jpg",
        "asin": "B0D2DMQXSY",
        "affiliate": "https://www.amazon.in/dp/B0D2DMQXSY/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "Lavie",
        "price": "₹1,449",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61M9preveyL._AC_UL320_.jpg",
        "asin": "B0D2DJYF7J",
        "affiliate": "https://www.amazon.in/dp/B0D2DJYF7J/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "Lavie Signature",
        "price": "₹2,299",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71ruiiET26L._AC_UL320_.jpg",
        "asin": "B0F99KVZHR",
        "affiliate": "https://www.amazon.in/dp/B0F99KVZHR/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "MOKOBARA",
        "price": "₹6,499",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71HqavIsscL._AC_UL320_.jpg",
        "asin": "B0FR9D5GJX",
        "affiliate": "https://www.amazon.in/dp/B0FR9D5GJX/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "GUESS",
        "price": "₹10,919",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F716daKEF6HL._AC_UL320_.jpg",
        "asin": "B0BYP969TV",
        "affiliate": "https://www.amazon.in/dp/B0BYP969TV/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "Safari Omega spacious/large laptop backpack with Raincover, college bag, travel bag for men and women, Black, 30 Litre",
        "price": "₹649",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71maWXZscfL._AC_UY218_.jpg",
        "asin": "B097JJ2CK6",
        "affiliate": "https://www.amazon.in/dp/B097JJ2CK6/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Aristocrat Nova 15L Laptop Backpack for Men & Women with Bottle Pocket | Padded Shoulder Straps, Multi Compartments | Travel & College Bag | Dark Black",
        "price": "₹349",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71aYGrOy6gL._AC_UY218_.jpg",
        "asin": "B0D8BG7S4P",
        "affiliate": "https://www.amazon.in/dp/B0D8BG7S4P/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Safari Omega Spacious/Large 5 Compartment Laptop Backpack With Raincover, College Bag, Travel Bag For Unisex, Navy Blue, 30 Litre",
        "price": "₹619",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81Fbfx0fpuL._AC_UY218_.jpg",
        "asin": "B097LC1DJ6",
        "affiliate": "https://www.amazon.in/dp/B097LC1DJ6/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "NORTH ZONE Lightweight school bags Backpacks for Boys Girls Stylish men and women Casual Travel Laptop Bag College office",
        "price": "₹426",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61LB4CRJ9nL._AC_UY218_.jpg",
        "asin": "B0BL3S5NC1",
        "affiliate": "https://www.amazon.in/dp/B0BL3S5NC1/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Safari Omega Spacious/Large 5 Compartment Laptop Backpack With Raincover, College Bag, Travel Bag For Unisex, Teal, 30 Litre",
        "price": "₹649",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71XqKCamGaL._AC_UY218_.jpg",
        "asin": "B097JH4V5G",
        "affiliate": "https://www.amazon.in/dp/B097JH4V5G/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Safari Nudge Laptop Backpack for men & women, school bag for boys and girls, college bag, office bag, travel bag, 3 compartments, Bottle holder, Front pocket, Color Black",
        "price": "₹599",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61ZWpOeKc9L._AC_UY218_.jpg",
        "asin": "B097BHM5TV",
        "affiliate": "https://www.amazon.in/dp/B097BHM5TV/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Safari Omega Pro Laptop Backpack With Raincover, 3 Compartments, Bottle Holder, Organizer, Unisex Bag For Boys & Girls, School/College/Office/Travel Bag, Color- Blue, 35L",
        "price": "₹849",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71KFyatFwrL._AC_UY218_.jpg",
        "asin": "B097JMJ63C",
        "affiliate": "https://www.amazon.in/dp/B097JMJ63C/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "NISHI - Water Resistant Backpack with Bottle Compartment | Lightweight Travel & School Bag for Men, Women & College Students | Trendy Laptop Backpack for Daily Use 13",
        "price": "₹299",
        "rating": "3.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61G%2BTUL1KAL._AC_UY218_.jpg",
        "asin": "B0GHZ4FVB9",
        "affiliate": "https://www.amazon.in/dp/B0GHZ4FVB9/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Waterproof Casual Backpack for Girls & Women Stylish Trendy School and College Bag 17\" x 12\" Durable Daily Use Black",
        "price": "₹273",
        "rating": "3.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F31v1C488LwL._AC_UY218_.jpg",
        "asin": "B0GKVQD2W2",
        "affiliate": "https://www.amazon.in/dp/B0GKVQD2W2/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "ProArch Backpack Purse for Women Leather | Stylish Ladies Shoulder Backpack Bag for Office, College, Travel & Shopping | Birthday Gift for Sister, Mom & Wife",
        "price": "₹848",
        "rating": "3.8 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81xoOAcC-CL._AC_UL640_QL65_.jpg",
        "asin": "B0FPR5F46C",
        "affiliate": "https://www.amazon.in/dp/B0FPR5F46C/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Safari Nudge Laptop Backpack for men & women, school bag for boys and girls, college bag, office bag, travel bag, 3 compartments, Bottle holder, Front pocket, Color Blue",
        "price": "₹599",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71IF2uxsv8L._AC_UY218_.jpg",
        "asin": "B097BGPLYV",
        "affiliate": "https://www.amazon.in/dp/B097BGPLYV/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "American Tourister Valex | 28L Backpack | 17\" Laptop Bag | 2 Compartments | College & Office Backpack for Men and Women | Black | 1 Year Global Warranty",
        "price": "₹1,299",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51yfw2JIxwL._AC_UY218_.jpg",
        "asin": "B0BTD4S4XF",
        "affiliate": "https://www.amazon.in/dp/B0BTD4S4XF/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "FUOCO Laptop Backpack for Women Men - College School Bag with Bottle Holder for Boys Girls- Stylish Canvas Travel Backpacker for Students Office Casual Use",
        "price": "₹949",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51GWdtzQvjL._AC_UY218_.jpg",
        "asin": "B0F13Q73GB",
        "affiliate": "https://www.amazon.in/dp/B0F13Q73GB/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Glowic WBAG-118",
        "price": "₹749",
        "rating": "3.6 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51yPlJzSuQL._AC_UY218_.jpg",
        "asin": "B0F8JKVCW7",
        "affiliate": "https://www.amazon.in/dp/B0F8JKVCW7/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Wesley Spartan Unisex Travel Hiking Laptop Bag fits Upto 17.3 inch with Raincover and Internal Organiser Backpack Rucksack College Backpack",
        "price": "₹749",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F810b7vGgpkL._AC_UY218_.jpg",
        "asin": "B0D5QTFT2T",
        "affiliate": "https://www.amazon.in/dp/B0D5QTFT2T/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "FUR JADEN Anti Theft Number Lock Backpack Bag with 15.6 Inch Laptop Compartment, USB Charging Port & Organizer Pocket for Men Women Boys Girls",
        "price": "₹699",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71PRQKJNdHL._AC_UY218_.jpg",
        "asin": "B09VTCNN75",
        "affiliate": "https://www.amazon.in/dp/B09VTCNN75/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Gear Vintage 2 Faux Leather(Without Antitheft) 19\"/34L Large Water Resistant Laptop Backpack/Casual Backpack/Daypack/Travel Backpack/College Bag For Men/Women(Black-Brown)",
        "price": "₹1,189",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71X%2Bke2huIL._AC_UY218_.jpg",
        "asin": "B0FFB8KTF8",
        "affiliate": "https://www.amazon.in/dp/B0FFB8KTF8/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Doms",
        "price": "₹100",
        "rating": "4.5 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81ZMVKsgkIL._AC_UL320_.jpg",
        "asin": "B0CRDYHDG7",
        "affiliate": "https://www.amazon.in/dp/B0CRDYHDG7/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india",
        "audience": "kids"
    },
    {
        "title": "Camel",
        "price": "₹698",
        "rating": "4.5 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81lFzDHQjgL._AC_UL320_.jpg",
        "asin": "B0D7937X6M",
        "affiliate": "https://www.amazon.in/dp/B0D7937X6M/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india",
        "audience": "kids"
    },
    {
        "title": "Fevicryl",
        "price": "₹299",
        "rating": "4.5 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F615vhMweGHL._AC_UL320_.jpg",
        "asin": "B0FLK9DTQ3",
        "affiliate": "https://www.amazon.in/dp/B0FLK9DTQ3/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india",
        "audience": "kids"
    },
    {
        "title": "Doms",
        "price": "₹450",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81LlsU7F2OL._AC_UL320_.jpg",
        "asin": "B07KQCD8R4",
        "affiliate": "https://www.amazon.in/dp/B07KQCD8R4/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india",
        "audience": "kids"
    },
    {
        "title": "Doms",
        "price": "₹368",
        "rating": "4.5 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F818uBXBjczL._AC_UL320_.jpg",
        "asin": "B07MQ9PX6P",
        "affiliate": "https://www.amazon.in/dp/B07MQ9PX6P/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india",
        "audience": "kids"
    },
    {
        "title": "Doms",
        "price": "₹719",
        "rating": "4.5 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61jmJz-JiJL._AC_UL320_.jpg",
        "asin": "B0CRDXSDQH",
        "affiliate": "https://www.amazon.in/dp/B0CRDXSDQH/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india",
        "audience": "kids"
    },
    {
        "title": "Fevicryl",
        "price": "₹389",
        "rating": "4.5 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61qCNHt10qL._AC_UL320_.jpg",
        "asin": "B0DBR45ML8",
        "affiliate": "https://www.amazon.in/dp/B0DBR45ML8/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india",
        "audience": "kids"
    },
    {
        "title": "Corslet",
        "price": "₹499",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71026bj%2BC9L._AC_UL320_.jpg",
        "asin": "B0D794K8NC",
        "affiliate": "https://www.amazon.in/dp/B0D794K8NC/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india",
        "audience": "kids"
    },
    {
        "title": "Fevicryl",
        "price": "₹225",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61L%2BMa0demL._AC_UL320_.jpg",
        "asin": "B0FLK8MYSX",
        "affiliate": "https://www.amazon.in/dp/B0FLK8MYSX/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india",
        "audience": "kids"
    },
    {
        "title": "Camel",
        "price": "₹94",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F91HU2u4haxL._AC_UL320_.jpg",
        "asin": "B0CHFFZN8H",
        "affiliate": "https://www.amazon.in/dp/B0CHFFZN8H/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india",
        "audience": "kids"
    },
    {
        "title": "Camel",
        "price": "₹128",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F91sPE2kSsNL._AC_UL320_.jpg",
        "asin": "B0CHFDMXN7",
        "affiliate": "https://www.amazon.in/dp/B0CHFDMXN7/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india",
        "audience": "kids"
    },
    {
        "title": "Doms",
        "price": "₹199",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81Dg1pNTgiL._AC_UL320_.jpg",
        "asin": "B07V3CLBQ4",
        "affiliate": "https://www.amazon.in/dp/B07V3CLBQ4/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india",
        "audience": "kids"
    },
    {
        "title": "Cello",
        "price": "₹469",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81LlDO5EDpL._AC_UL320_.jpg",
        "asin": "B08KB2CPBP",
        "affiliate": "https://www.amazon.in/dp/B08KB2CPBP/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india",
        "audience": "kids"
    },
    {
        "title": "Doms",
        "price": "₹382",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71Auc0PJFWL._AC_UL320_.jpg",
        "asin": "B07FGXC8HG",
        "affiliate": "https://www.amazon.in/dp/B07FGXC8HG/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india",
        "audience": "kids"
    },
    {
        "title": "Fevicryl",
        "price": "₹359",
        "rating": "4.5 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71Cimg9MI7L._AC_UL320_.jpg",
        "asin": "B09Q62NHK5",
        "affiliate": "https://www.amazon.in/dp/B09Q62NHK5/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india",
        "audience": "kids"
    },
    {
        "title": "Fevicryl",
        "price": "₹223",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61o5SGrfjNL._AC_UL320_.jpg",
        "asin": "B0FLKCFZ5V",
        "affiliate": "https://www.amazon.in/dp/B0FLKCFZ5V/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india",
        "audience": "kids"
    },
    {
        "title": "Fevicryl",
        "price": "₹748",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61vKrSF3HAL._AC_UL320_.jpg",
        "asin": "B0DBVJS9VQ",
        "affiliate": "https://www.amazon.in/dp/B0DBVJS9VQ/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india",
        "audience": "kids"
    },
    {
        "title": "Kores",
        "price": "₹149",
        "rating": "5.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81G7v%2BmlqaL._AC_UL320_.jpg",
        "asin": "B0CNXTW9Y1",
        "affiliate": "https://www.amazon.in/dp/B0CNXTW9Y1/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india",
        "audience": "kids"
    },
    {
        "title": "Corslet",
        "price": "₹1,199",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F817CmdNc53L._AC_UL320_.jpg",
        "asin": "B0BDSPF1FT",
        "affiliate": "https://www.amazon.in/dp/B0BDSPF1FT/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india",
        "audience": "kids"
    },
    {
        "title": "Apsara",
        "price": "₹177",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81I1hHihBBL._AC_UL320_.jpg",
        "asin": "B07T444XGS",
        "affiliate": "https://www.amazon.in/dp/B07T444XGS/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india",
        "audience": "kids"
    },
    {
        "title": "Corslet",
        "price": "₹678",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71LKGzsX3EL._AC_UL320_.jpg",
        "asin": "B08WS1KCBF",
        "affiliate": "https://www.amazon.in/dp/B08WS1KCBF/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india",
        "audience": "kids"
    },
    {
        "title": "ECLET",
        "price": "₹89",
        "rating": "3.8 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61TGoYIKI1S._AC_UL320_.jpg",
        "asin": "B0CJ7FMY9P",
        "affiliate": "https://www.amazon.in/dp/B0CJ7FMY9P/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india",
        "audience": "kids"
    },
    {
        "title": "Doms",
        "price": "₹315",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71CkZrpw3OL._AC_UL320_.jpg",
        "asin": "B0DDTR558Q",
        "affiliate": "https://www.amazon.in/dp/B0DDTR558Q/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india",
        "audience": "kids"
    },
    {
        "title": "Fevicryl",
        "price": "₹258",
        "rating": "4.5 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51%2BJHFyz%2BLL._AC_UL320_.jpg",
        "asin": "B0FBM19SWH",
        "affiliate": "https://www.amazon.in/dp/B0FBM19SWH/?tag=primeoffers02-21",
        "category": "Home",
        "region": "india",
        "audience": "kids"
    },
    {
        "title": "₹799.00\n₹799\n.\n00\n₹3,199.00\npTron Newly Launched Fusion Tunes 10W Mini Bluetooth Speaker with Wireless Karaoke Mic, 8Hrs Playtime, Vivid RGB Lights, Voice Effects, Multi-Play Modes BT5.1/TF Card & Type-C Charging Port (Black)\n4.1 out of 5 stars\n 5,753",
        "price": "₹799",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61Lgfcc%2Bo-L._AC._SR360%2C460.jpg",
        "asin": "B0D772K8X8",
        "affiliate": "https://www.amazon.in/dp/B0D772K8X8/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Amazon Echo Dot (5th Gen) | Smart speaker with vibrant sound, Motion Detection, Temperature Sensor, Alexa and Bluetooth| Blue",
        "price": "₹5,499",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71MXrXqcyEL._AC_UL320_.jpg",
        "asin": "B09B8XJDW5",
        "affiliate": "https://www.amazon.in/dp/B09B8XJDW5/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "₹949.00\n₹949\n.\n00\n₹3,490.00\nBoat Aavante Bar 490 10W Signature Sound, Dual Full-Range Drivers,7 HRS Battery, Built-in Mic,2.0 CH, TWS Feature,Multi Connect, Bluetooth Sound Bar, Soundbar Speaker (Classic Black)\n4.1 out of 5 stars\n 3,363",
        "price": "₹949",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71-I9Bk8dgL._AC._SR360%2C460.jpg",
        "asin": "B0CH3G9VR2",
        "affiliate": "https://www.amazon.in/dp/B0CH3G9VR2/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Dubstep Pop 1400 Portable Bluetooth Speaker | 14W Loud Sound, Deep Bass with XBASS, 16 Hrs Playtime, TWS Stereo Pairing, 52mm Driver, Splash-Resistant, Carry Strap (Black)\nDubstep Pop 1400 Portable Bluetooth Sp…",
        "price": "₹649",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F711x6ynULPL._AC_SR480%252C570_.jpg",
        "asin": "B0FHHQQNZY",
        "affiliate": "https://www.amazon.in/dp/B0FHHQQNZY/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "₹1,018.00\n₹1,018\n.\n00\n₹2,499.00\nPortronics SoundDrum 1 12W TWS Portable Bluetooth Speaker with Powerful Bass, Bluetooth 5.3V, 360° Surround Sound, USB Drive in, Type C Fast Charging(Blue)\n4.1 out of 5 stars\n 13,228",
        "price": "₹1,018",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61ygYGBZUBL._AC._SR360%2C460.jpg",
        "asin": "B097D69GJ1",
        "affiliate": "https://www.amazon.in/dp/B097D69GJ1/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "₹739.00\n₹739\n.\n00\n₹1,899.00\nZEBRONICS Astra 35, Portable Bluetooth Speaker, 16 Watts, Upto 8h Backup, Dual Drivers + Dual Passive Radiators, Call Function, Bluetooth v5.3 | USB | mSD| AUX, TWS, RGB LED\n4.0 out of 5 stars\n 3,169",
        "price": "₹739",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71Gn7eWoLUL._AC._SR360%2C460.jpg",
        "asin": "B0DJ3FFC8R",
        "affiliate": "https://www.amazon.in/dp/B0DJ3FFC8R/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Boat Stone 352 Pro/Stone 358 Pro w/ 14W Signature Sound, Up to 12 Hours Playback, RGB LEDs, TWS Feature, Built-in Mic, BTv5.3, Free Music Streaming on JioSaavn Bluetooth Speaker (Vibing Blue)",
        "price": "₹1,799",
        "rating": "",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F41xqrbyovFL._AC_SR480%2C440_.jpg",
        "asin": "B0D6W6T95D",
        "affiliate": "https://www.amazon.in/dp/B0D6W6T95D/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Tribit Updated Version XSound Go Wireless Bluetooth 5.3 Speakers with Loud Stereo Sound & Rich Bass 16W,24H Playtime,150 ft Bluetooth Range,Outdoor Lightweight IPX7 Waterproof,Built-in Mic (Black)",
        "price": "₹2,842",
        "rating": "",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F41lcDoa4aXL._AC_SR480%2C440_.jpg",
        "asin": "B078S4P3J9",
        "affiliate": "https://www.amazon.in/dp/B078S4P3J9/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "₹549.00\n₹549\n.\n00\n₹999.00\nZebronics ZEB-COUNTY 3W Wireless Bluetooth Portable Speaker With Supporting Carry Handle, USB, SD Card, AUX, FM & Call Function. (Black)\n3.8 out of 5 stars\n 54,592",
        "price": "₹549",
        "rating": "3.8 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71wAXhzCmnS._AC._SR360%2C460.jpg",
        "asin": "B07YNV41FT",
        "affiliate": "https://www.amazon.in/dp/B07YNV41FT/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "JBL Go Essential with Rich Base, Wireless Ultra Portable Bluetooth Speaker, Vibrant Colors, Waterproof, Type C (Without Mic, Black)",
        "price": "₹1,899",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71uji1ExbsL._AC_UL320_.jpg",
        "asin": "B09NCFVNK9",
        "affiliate": "https://www.amazon.in/dp/B09NCFVNK9/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Portronics 30W Apollo 30 Wireless Bluetooth Portable Speaker with Wireless Karaoke Mic, Echo Control, 5 Hour Playtime, RGB LED Light, Bluetooth V5.4, Easy Grab Handle, USB in, Type C Charging(Black)",
        "price": "₹2,199",
        "rating": "",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F516e27p74ML._AC_SR480%2C440_.jpg",
        "asin": "B0FVG8H8SM",
        "affiliate": "https://www.amazon.in/dp/B0FVG8H8SM/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Portronics SoundDrum P 20W Portable Bluetooth Speaker with 6-7 hrs Playback Time, Handsfree Calling, USB Slot, Aux-in Port, Type C Charging (Black)\nPortronics SoundDrum P 20W Portable Bluetoo…",
        "price": "₹1,999",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71zoEeTAszL._AC_SR480%252C570_.jpg",
        "asin": "B09V2J596T",
        "affiliate": "https://www.amazon.in/dp/B09V2J596T/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "₹899.00\n₹899\n.\n00\n₹1,699.00\nZEBRONICS Sound Feast 90 10W Output, Portable Wireless Speaker with Bluetooth v5.0, TWS, 6.3mm with Wired Mic, USB, mSD, AUX, Mobile Holder and RGB Lights\n3.8 out of 5 stars\n 1,337",
        "price": "₹899",
        "rating": "3.8 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F718mnMXpj5L._AC._SR360%2C460.jpg",
        "asin": "B0C6QY4TTP",
        "affiliate": "https://www.amazon.in/dp/B0C6QY4TTP/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "₹547.00\n₹547\n.\n00\n₹1,699.00\nWembley Rechargeable Karaoke Mic with Speaker for Singing | Wireless Mini Portable Bluetooth Speaker with Microphone & LED Lights | Cute Birthday Gift for Kids Musical Toys for Boys, Girls and Adults\n4.0 out of 5 stars\n 2,651",
        "price": "₹547",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61ijIp-5KZL._AC._SR360%2C460.jpg",
        "asin": "B0DRPCR5VK",
        "affiliate": "https://www.amazon.in/dp/B0DRPCR5VK/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "₹1,499.00\n₹1,499\n.\n00\n₹2,499.00\nPortronics Apollo One 20W Wireless Bluetooth Portable Speaker with Wireless Karaoke Mic, 5 Hour Playtime, RGB LED Light, Bluetooth V5.3, Easy Grab Handle, USB/AUX in/TF Card, Type C Charging(White)\n4.1 out of 5 stars\n 36",
        "price": "₹1,499",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81qo2q-1MZL._AC._SR360%2C460.jpg",
        "asin": "B0GCCCKTZG",
        "affiliate": "https://www.amazon.in/dp/B0GCCCKTZG/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "₹1,399.00\n₹1,399\n.\n00\n₹2,799.00\nZEBRONICS 20W Portable Bluetooth Speaker, 10.16cm Driver, Upto 5Hrs Playback, TWS, RGB Lights, 6.3mm Mic Input, BT v5.0, USB, mSD, AUX, FM, Type-C Charging, Carry Handle, Mobile Holder (Buddy 100)\n3.8 out of 5 stars\n 15,897",
        "price": "₹1,399",
        "rating": "3.8 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71poiJ97u9L._AC._SR360%2C460.jpg",
        "asin": "B09P53B3M5",
        "affiliate": "https://www.amazon.in/dp/B09P53B3M5/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "₹1,799.00\n₹1,799\n.\n00\n₹4,899.00\npTron Fusion Party V2 40W Bluetooth Speaker w/ 3m Wired Karaoke Mic, Immersive Sound, 6Hrs Playtime, RGB Light, TWS Mode, Party Speaker w/Bluetooth V5.0, Aux Port, USB & SD Card Playback (Coal Black)\n2.9 out of 5 stars\n 40",
        "price": "₹1,799",
        "rating": "2.9 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71xMIZrArlL._AC._SR360%2C460.jpg",
        "asin": "B0FSX4F497",
        "affiliate": "https://www.amazon.in/dp/B0FSX4F497/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "₹789.00\n₹789\n.\n00\n₹3,999.00\nPunnkFunnk Kids Adults with Wireless Mics Portable Karaoke Bluetooth Speaker & Dynamic Lights Birthday Gift for Girls, Boys & Toddlers Ages 4,5,6,7,8,9,10,12+ Year Old Home Outdoor Travel (Pink)\n3.7 out of 5 stars\n 209",
        "price": "₹789",
        "rating": "3.7 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71nRyF7z14L._AC._SR360%2C460.jpg",
        "asin": "B0DXL8MRSP",
        "affiliate": "https://www.amazon.in/dp/B0DXL8MRSP/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "₹3,563.00\n₹3,563\n.\n00\n₹4,999.00\nPortronics Dash 2, 2400-2480 MHz Wireless Bluetooth Karaoke Mic with 10W Speaker,Upto 10 Hour Playtime, Dynamic RGB Lights, Music Recording, Duet Singing, Mini Karaoke Machine for Car Travel\n4.1 out of 5 stars\n 1,436",
        "price": "₹3,563",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51uIRtjygqL._AC._SR360%2C460.jpg",
        "asin": "B0CD44YX65",
        "affiliate": "https://www.amazon.in/dp/B0CD44YX65/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "₹425.00\n₹425\n.\n00\n₹999.00\nBolaButty Fun Flicks Karaoke Machine with Wireless Mics, Bluetooth Speaker, RGB Lights, 5 Voice Effects, Portable Sound System for Home, Party, Outdoor, for Kids & Adults (1 MIC with Speaker Set)\n4.5 out of 5 stars\n 33,487",
        "price": "₹425",
        "rating": "4.5 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F715dQ6p5v9L._AC._SR360%2C460.jpg",
        "asin": "B0FL2K964V",
        "affiliate": "https://www.amazon.in/dp/B0FL2K964V/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "₹1,099.00\n₹1,099\n.\n00\n₹3,999.00\npTron Fusion Moment 10W Mini Bluetooth Speaker with Wireless Karaoke Mic, RGB Lights, Voice Change Effects, 6H Playtime, Bluetooth v5.3 & Type-C Fast Charging (Cream)\n5.0 out of 5 stars\n 3",
        "price": "₹1,099",
        "rating": "5.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61g-h87GukL._AC._SR360%2C460.jpg",
        "asin": "B0GXFS95SJ",
        "affiliate": "https://www.amazon.in/dp/B0GXFS95SJ/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "₹999.00\n₹999\n.\n00\n₹2,999.00\nVELOMAX Karaoke Mic with Speaker for Kids, 360° Surround Sound with Ambiance Light, Wireless Mic with 5 Sound Effects, Birthday Gifts Toys Teens Kids, Cute Fun Fashion (2 Microphones)\n3.8 out of 5 stars\n 149",
        "price": "₹999",
        "rating": "3.8 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71bp6M1EFjL._AC._SR360%2C460.jpg",
        "asin": "B0DKHT13RD",
        "affiliate": "https://www.amazon.in/dp/B0DKHT13RD/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "pTron Newly Launched Fusion Tunes 10W Mini Bluetooth Speaker, Wireless Karaoke Mic, 8Hrs Playtime, Vivid RGB Lights, Voice Effects, Multi-Play Modes BT5.1/TF Card & Type-C Charging (Light Pink)\npTron Newly Launched Fusion Tunes 10W Mini…",
        "price": "₹899",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F611z3Ep-gnL._AC_SR480%252C570_.jpg",
        "asin": "B0D7725FG2",
        "affiliate": "https://www.amazon.in/dp/B0D7725FG2/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "TRIGGR Roar 12 Portable Bluetooth Speaker, 12W Deep Bass, 8H Playtime, Type-C Fast Charging, BT v5.3, TWS Stereo Pairing, FM Radio, USB/SD Card, Handsfree with Built-in Mic (Rustic Dust)\nTRIGGR Roar 12 Portable Bluetooth Speaker, 12…",
        "price": "₹799",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F812OeWMe3pL._AC_SR480%252C570_.jpg",
        "asin": "B0FPG6YTHH",
        "affiliate": "https://www.amazon.in/dp/B0FPG6YTHH/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Toreto Retro Mini Bluetooth Speaker with Dual Wireless Karaoke Mic, 20W Output, Bluetooth 5.0, Voice Changer, 10m Range, 6H Playtime, USB/AUX/TF/FM, Type-C Charging (Rose Gold)\nToreto Retro Mini Bluetooth Speaker wit…",
        "price": "₹2,999",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51u4a7Qwu0L._AC_SR480%252C570_.jpg",
        "asin": "B0CF9WY39V",
        "affiliate": "https://www.amazon.in/dp/B0CF9WY39V/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Sonos Roam 2 | Lightweight Portable Waterpoof Speaker with Bluetooth, WiFi, 10 Hour Battery Life and Voice Control for Home and Outdoor Use - Black\nSonos Roam 2 | Lightweight Portable…",
        "price": "₹14,999",
        "rating": "4.5 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61VnNvzHRxL._AC_SR480%252C570_.jpg",
        "asin": "B0D37BY6ZR",
        "affiliate": "https://www.amazon.in/dp/B0D37BY6ZR/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "HAMMER Drop X1 5W Bluetooth Speaker with Twin Pairing, Bluetooth v6.0, 32 Hours Playtime, 52mm Drivers (Green)",
        "price": "₹599",
        "rating": "4.5 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51O5FBgvdKL._AC_UL320_.jpg",
        "asin": "B0GMDNKHP5",
        "affiliate": "https://www.amazon.in/dp/B0GMDNKHP5/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "₹16,900.00\n₹16,900\n.\n00\nBose SoundLink Flex (2nd Gen) Portable Wireless Bluetooth Speaker Small Powerful for Outdoor Parties, Up to 12H Runtime, IP67 Waterproof and Dustproof, Twilight Blue\n4.8 out of 5 stars\n 11,049",
        "price": "₹16,900",
        "rating": "4.8 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61Qpcw7p2BL._AC._SR360%2C460.jpg",
        "asin": "B0DV5H3S16",
        "affiliate": "https://www.amazon.in/dp/B0DV5H3S16/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "₹1,899.00\n₹1,899\n.\n00\n₹2,999.00\nJBL Go Essential with Rich Bass, Wireless Ultra Portable Bluetooth Speaker, Vibrant Colors, Waterproof, Type C (Without Mic, Red)\n4.2 out of 5 stars\n 10,712",
        "price": "₹1,899",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71CT0d4O0KL._AC._SR360%2C460.jpg",
        "asin": "B09NCG2YF1",
        "affiliate": "https://www.amazon.in/dp/B09NCG2YF1/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "₹1,899.00\n₹1,899\n.\n00\n₹5,999.00\npTron Fusion ONE 48W Bluetooth Party Speaker w/Pristine Stereo Sound, Dual 4 inch Neo Drivers, Rhythmic RGB Lights, 6Hrs Playtime, BT5.3/Aux/TF Card/USB Playback Modes, Type-C Charging (Jet Black)\n4.1 out of 5 stars\n 61",
        "price": "₹1,899",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71Fln-PGf9L._AC._SR360%2C460.jpg",
        "asin": "B0FYNW4CJV",
        "affiliate": "https://www.amazon.in/dp/B0FYNW4CJV/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "₹21,999.00\n₹21,999\n.\n00\n₹34,999.00\nJBL Partybox Encore 2 with Mic, Wireless Bluetooth Party Speaker, AI Sound Boost, Dynamic Light Show, Upto 15Hrs Playtime, Replaceable Battery, Multi-Speaker Connection by Auracast, PartyBox App-Black\n4.6 out of 5 stars\n 83",
        "price": "₹21,999",
        "rating": "4.6 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71%2BwCRcUfDL._AC._SR360%2C460.jpg",
        "asin": "B0FJ1G71B7",
        "affiliate": "https://www.amazon.in/dp/B0FJ1G71B7/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "₹4,799.00\n₹4,799\n.\n00\n₹14,990.00\nBoat Stone 1200 Pro, 60W Boat Signature Sound, 76.2mm Drivers, TWS,7.5H Battery, Built-in Mic, Carry Strap,IPX6, Bluetooth Speaker, Wireless Speaker, Portable Speaker (Twilight Black)\n4.2 out of 5 stars\n 338",
        "price": "₹4,799",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81y8cmMBngL._AC._SR360%2C460.jpg",
        "asin": "B0FLYDHYY4",
        "affiliate": "https://www.amazon.in/dp/B0FLYDHYY4/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "₹2,199.00\n₹2,199\n.\n00\n₹5,999.00\nHAMMER Boom 30W Bluetooth Speaker with RGB Lights, Dual Passive Radiators, TWS Function, Type-C Charging, Multi-Connectivity (AUX/USB/TF/Bluetooth), Built-in Mic, Upto 30H Playtime, Carry Handle Blue\n4.4 out of 5 stars\n 159",
        "price": "₹2,199",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61m1rK5wrLL._AC._SR360%2C460.jpg",
        "asin": "B0F9TMXDQ2",
        "affiliate": "https://www.amazon.in/dp/B0F9TMXDQ2/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "₹4,499.00\n₹4,499\n.\n00\n₹9,999.00\nZEBRONICS 2026 Launch 75W Bluetooth Speaker, Upto 5Hrs Playback, Dual 78mm Drivers, 101mm Subwoofer, Dual Passive Radiators, RGB Modes, 6.3mm Mic Input, TWS, BT v5.3, Type-C (Sound Feast 550)\n5.0 out of 5 stars\n 4",
        "price": "₹4,499",
        "rating": "5.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81MzPekUmpL._AC._SR360%2C460.jpg",
        "asin": "B0GL8KN6JK",
        "affiliate": "https://www.amazon.in/dp/B0GL8KN6JK/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "₹7,499.00\n₹7,499\n.\n00\n₹13,999.00\nJBL Flip 6 Wireless Portable Bluetooth Speaker Pro Sound, Upto 12 Hours Playtime, IP67 Water & Dustproof, PartyBoost & Personalization App (Without Mic, Black)\n4.4 out of 5 stars\n 16,854",
        "price": "₹7,499",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81nT721hWGL._AC._SR360%2C460.jpg",
        "asin": "B09V7WS4PP",
        "affiliate": "https://www.amazon.in/dp/B09V7WS4PP/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "₹15,990.00\n₹15,990\n.\n00\n₹24,990.00\nSony New ULT Field 3 Wireless Bluetooth Speaker, 24hrs Playtime, Massive Bass, Hands Free Calling, Shoulder Strap, IP67 Water, Dust & Rustproof, Quick Charging-Black\n4.6 out of 5 stars\n 210",
        "price": "₹15,990",
        "rating": "4.6 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F717-LwBzfTL._AC._SR360%2C460.jpg",
        "asin": "B0DYB6KMJH",
        "affiliate": "https://www.amazon.in/dp/B0DYB6KMJH/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "₹7,499.00\n₹7,499\n.\n00\n₹13,999.00\nJBL Flip 6 Wireless Portable Bluetooth Speaker Pro Sound, Upto 12 Hours Playtime, IP67 Water & Dustproof, PartyBoost & Personalization App (Without Mic, Squad)\n4.4 out of 5 stars\n 16,854",
        "price": "₹7,499",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61xnazgtNeL._AC._SR360%2C460.jpg",
        "asin": "B09NCDDM7T",
        "affiliate": "https://www.amazon.in/dp/B09NCDDM7T/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "₹2,999.00\n₹2,999\n.\n00\n₹6,999.00\nZEBRONICS 2026 Launch 50W Bluetooth Speaker, Dual 5.7cm Drivers, 8.9cm Subwoofer, Upto 5Hrs Playback, Dual Passive Radiators, RGB Modes, 6.3mm Mic Input, TWS, BT v5.3, Type-C (Sound Feast 450)\n5.0 out of 5 stars\n 4",
        "price": "₹2,999",
        "rating": "5.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71eiY81Eg3L._AC._SR360%2C460.jpg",
        "asin": "B0GL7QWQF1",
        "affiliate": "https://www.amazon.in/dp/B0GL7QWQF1/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "₹265.00\n₹265\n.\n00\n₹700.00\nThree23 J...B...L Mini Boost 8 4D Power Bass Metal Speaker |Bluetooth Mini Boost 8 Speaker TWS Stereo Sound (Available in Multicolor)\n3.2 out of 5 stars\n 8",
        "price": "₹265",
        "rating": "3.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F41tVG0hAf-L._AC._SR360%2C460.jpg",
        "asin": "B0GSZJJBR3",
        "affiliate": "https://www.amazon.in/dp/B0GSZJJBR3/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "₹279.00\n₹279\n.\n00\n₹799.00\nProlet® Ultra Boost Mini Portable Bluetooth Wireless Speaker | Heavy Bass, Clear Sound, Round Metal Design, Fast Charging & Long Battery Backup for Home, Office, Travel & Outdoor Use (Random Colour)\n4.0 out of 5 stars\n 39",
        "price": "₹279",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71EpvcKnn6L._AC._SR360%2C460.jpg",
        "asin": "B0GNMCJDBR",
        "affiliate": "https://www.amazon.in/dp/B0GNMCJDBR/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "₹499.00\n₹499\n.\n00\n₹1,999.00\nHAMMER Drop Go Portable Indoor Bluetooth Speaker | 5W RMS Output | Bluetooth 6.0 | Up to 32H Playtime | Twin Pairing | Made in India | Type-C Fast Charging | Built-in Mic | TF Card, USB Support- Beige\n4.3 out of 5 stars\n 24",
        "price": "₹499",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61b2SG4l6%2BL._AC._SR360%2C460.jpg",
        "asin": "B0GN9GH5TZ",
        "affiliate": "https://www.amazon.in/dp/B0GN9GH5TZ/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "₹1,299.00\n₹1,299\n.\n00\n₹3,999.00\nMivi Fort S24 Bluetooth Speaker Soundbar with 24W Powerful Sound, 2.0 Channel Speaker, Multiple Connectivity Modes, Portable Speaker, Made in India Soundbar\n3.6 out of 5 stars\n 63",
        "price": "₹1,299",
        "rating": "3.6 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71fj-%2BXL5gL._AC._SR360%2C460.jpg",
        "asin": "B0GFWNYHR1",
        "affiliate": "https://www.amazon.in/dp/B0GFWNYHR1/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "₹279.00\n₹279\n.\n00\n₹799.00\nTECHONTO® Ultra Boost Mini Bluetooth Speaker, Portable Wireless Speaker with Heavy Bass, Metal Electroplated Design, Fast Charging, Long Battery Backup for Home, Office & Travel (Random Color)\n3.7 out of 5 stars\n 43",
        "price": "₹279",
        "rating": "3.7 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61bMW-xxllL._AC._SR360%2C460.jpg",
        "asin": "B0GNM6464L",
        "affiliate": "https://www.amazon.in/dp/B0GNM6464L/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "₹999.00\n₹999\n.\n00\n₹3,199.00\npTron Fusion Beam V2 16W Bluetooth Soundbar Speaker, Stereo Sound, RGB Lights, Metal Grill, Soundbar for Phone/TV/Laptop/Tablets, BT5.3/Aux/TF Card/USB Playback & TWS Feature (Midnight)\n5.0 out of 5 stars\n 3",
        "price": "₹999",
        "rating": "5.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61bImlpPptL._AC._SR360%2C460.jpg",
        "asin": "B0GXFLTDLM",
        "affiliate": "https://www.amazon.in/dp/B0GXFLTDLM/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "₹284.00\n₹284\n.\n00\n₹999.00\nfonfox mini Portable Bluetooth Speaker, White and Turquoise, Wireless Audio Device with Control Buttons\n2.9 out of 5 stars\n 22",
        "price": "₹284",
        "rating": "2.9 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71nmvLW1CDL._AC._SR360%2C460.jpg",
        "asin": "B0GF1RWB4D",
        "affiliate": "https://www.amazon.in/dp/B0GF1RWB4D/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "₹3,499.00\n₹3,499\n.\n00\n₹7,999.00\nGOBOULT Mustang GT 20, Dual Dynamic Drivers, RGB LEDs, Bass Radiator, BTv 6, 7Hr Battery 20 W Bluetooth Speaker (Turbo Black, Stereo Channel)\n4.4 out of 5 stars\n 20",
        "price": "₹3,499",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81WG-ABShHL._AC._SR360%2C460.jpg",
        "asin": "B0GWFD3Q2B",
        "affiliate": "https://www.amazon.in/dp/B0GWFD3Q2B/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "₹299.00\n₹299\n.\n00\n₹999.00\nJBL Compatible Ultra Mini Wireless Bluetooth Speaker with Heavy Metal Electroplating | Round Mini Speaker, Power Button Controlled, Long Battery Backup & Quick Charge\n5.0 out of 5 stars\n 3",
        "price": "₹299",
        "rating": "5.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F41Zq79BElIL._AC._SR360%2C460.jpg",
        "asin": "B0GRMJKQ9M",
        "affiliate": "https://www.amazon.in/dp/B0GRMJKQ9M/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "₹238.00\n₹238\n.\n00\n₹399.00\nsk handicrafts Mini Bluetooth Speaker, Portable Wireless Audio Player, Small Size, Big Sound, Effortless Connectivity, for Mobile Devices",
        "price": "₹238",
        "rating": "",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61yuJlACM9L._AC._SR360%2C460.jpg",
        "asin": "B0GXSTW4B7",
        "affiliate": "https://www.amazon.in/dp/B0GXSTW4B7/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "₹3,499.00\n₹3,499\n.\n00\n₹7,999.00\nZEBRONICS 80W Soundbar with Dual Drivers, 2.0 Channel with Dual Drivers, BTv5.4, TV ARC, USB, AUX, LED Indicator, Remote Control, Wall Mountable, (Juke Bar 2550)\n4.0 out of 5 stars\n 102",
        "price": "₹3,499",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61XUoTsFj-L._AC._SR360%2C460.jpg",
        "asin": "B0GH1XW61R",
        "affiliate": "https://www.amazon.in/dp/B0GH1XW61R/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "₹449.00\n₹449\n.\n00\n₹999.00\nUTRAX Mini Go 10W Bluetooth Speaker with 8 Hours Playtime | High Bass Portable Mini Speaker | Bluetooth 5.3 | USB Drive Support | Type-C Fast Charging | Black\n4.0 out of 5 stars\n 6",
        "price": "₹449",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81iDBS9W9vL._AC._SR360%2C460.jpg",
        "asin": "B0GTHZ2NJM",
        "affiliate": "https://www.amazon.in/dp/B0GTHZ2NJM/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Amazon Echo Dot (5th Gen) | Smart speaker with vibrant sound, Motion Detection, Temperature Sensor, Alexa and Bluetooth| Black",
        "price": "₹5,499",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F719xTUTjrSL._AC_UL320_.jpg",
        "asin": "B09B917Z8D",
        "affiliate": "https://www.amazon.in/dp/B09B917Z8D/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "₹3,760.00\n₹3,760\n.\n00\n₹7,370.00\nheetipuk 2026 Pillow Speaker,Bluetooth Pillow Speakers for Sleeping,Ultra-Thin Under Pillow Speaker with White Noise Timer,Wireless Sleep Aid for Adult Kids\n2.6 out of 5 stars\n 69",
        "price": "₹3,760",
        "rating": "2.6 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81Dats5Re5L._AC._SR360%2C460.jpg",
        "asin": "B0GKP5SS8K",
        "affiliate": "https://www.amazon.in/dp/B0GKP5SS8K/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "₹5,499.00\n₹5,499\n.\n00\nAmazon Echo Dot (5th Gen) | Smart speaker with vibrant sound, Motion Detection, Temperature Sensor, Alexa and Bluetooth| White\n4.1 out of 5 stars\n 12,606",
        "price": "₹5,499",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71QM7WZCKvL._AC._SR360%2C460.jpg",
        "asin": "B09B8M1M51",
        "affiliate": "https://www.amazon.in/dp/B09B8M1M51/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "₹2,799.00\n₹2,799\n.\n00\n₹3,999.00\nJBL Go 3, Wireless Ultra Portable Bluetooth Speaker, Pro Sound, Vibrant Colors with Rugged Fabric Design, Waterproof, Type C (Without Mic, Blue)\n4.5 out of 5 stars\n 74,596",
        "price": "₹2,799",
        "rating": "4.5 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71dV1Nr821L._AC._SR360%2C460.jpg",
        "asin": "B08FB396L1",
        "affiliate": "https://www.amazon.in/dp/B08FB396L1/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "₹1,999.00\n₹1,999\n.\n00\n₹4,799.00\nZebronics 10W Portable Bluetooth v6.0 Speaker, Dual 5.2cm Drivers, 9hr Backup, Retro CD Design, 6 Ambient Sound Effects, TWS Support, Passive Radiator, Built-in Clock, Alarm & Call Function (Echospin)\n4.2 out of 5 stars\n 39",
        "price": "₹1,999",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61r-b5IBTTL._AC._SR360%2C460.jpg",
        "asin": "B0G2MKMPVZ",
        "affiliate": "https://www.amazon.in/dp/B0G2MKMPVZ/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "₹31,999.00\n₹31,999\n.\n00\nMarshall Middleton II Bluetooth Portable Bluetooth Speaker, Over 30 Hours Playtime, IP67 Waterproof - Black and Brass\n4.3 out of 5 stars\n 204",
        "price": "₹31,999",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71IFsdnYdTL._AC._SR360%2C460.jpg",
        "asin": "B0FBHTGL16",
        "affiliate": "https://www.amazon.in/dp/B0FBHTGL16/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "₹1,699.00\n₹1,699\n.\n00\n₹3,499.00\nFENSIR® Bluetooth Pillow Speaker | Ultra Thin Sleep Speaker White Noise Audio Relaxation Device",
        "price": "₹1,699",
        "rating": "",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51k9-qz-1kL._AC._SR360%2C460.jpg",
        "asin": "B0H1J5N9JT",
        "affiliate": "https://www.amazon.in/dp/B0H1J5N9JT/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "₹12,899.00\n₹12,899\n.\n00\n₹18,999.00\nJBL Flip 7 Wireless Portable Bluetooth Speaker, Bold Pro Sound with AI Sound Boost, 16Hrs of Playtime, IP68 Water & Dustproof, Multi-Speaker Connection by Auracast, Personalization App (Blue)\n4.4 out of 5 stars\n 2,889",
        "price": "₹12,899",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81QOsWak5bL._AC._SR360%2C460.jpg",
        "asin": "B0DMYQ32SC",
        "affiliate": "https://www.amazon.in/dp/B0DMYQ32SC/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "₹3,949.00\n₹3,949\n.\n00\n₹5,499.00\nJBL Go 4, Wireless Ultra Portable Bluetooth Speaker, Pro Sound, Vibrant Colors, Water & Dust Proof, Type C (Without Mic, Black)\n4.4 out of 5 stars\n 18,977",
        "price": "₹3,949",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71HdLDJEEUL._AC._SR360%2C460.jpg",
        "asin": "B0CX5C6WP3",
        "affiliate": "https://www.amazon.in/dp/B0CX5C6WP3/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "₹1,299.00\n₹1,299\n.\n00\n₹2,599.00\nPHILIPS Audio TAS1400BL Wireless Bluetooth Speaker with Deep Bass, Passive Radiator, 12W Sound Output, 1200mAh Rechargable Battery, RGB Light Modes, 10H Playtime, Supports TF/USB/BT Modes (Blue)\n4.0 out of 5 stars\n 479",
        "price": "₹1,299",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F712kYGkeC9L._AC._SR360%2C460.jpg",
        "asin": "B0F8W3VKDZ",
        "affiliate": "https://www.amazon.in/dp/B0F8W3VKDZ/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Zebronics 2026 Launch Portable Bluetooth Speaker, 5W RMS, Up to 10Hrs Playback, Passive Radiator, TWS, BT v5.4, USB & mSD, 9 RGB Modes, Splash Proof, Type-C Charging (Sonic POD 15)",
        "price": "₹699",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81H5LbpvjBL._AC_UL320_.jpg",
        "asin": "B0GSF8FB2X",
        "affiliate": "https://www.amazon.in/dp/B0GSF8FB2X/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "₹649.00\n₹649\n.\n00\n₹1,499.00\nZEBRONICS Clipper, 4 Watts, Wearable Bluetooth Speaker with Mic, Magnetic Clip-On, Upto 20 Hours Playback, Bluetooth v5.3, Carry Loop, Adventure & Travel Companion, Portable Speaker (Grey + Red)\n3.9 out of 5 stars\n 10,619",
        "price": "₹649",
        "rating": "3.9 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71vcU1FsDlL._AC._SR360%2C460.jpg",
        "asin": "B0F4MX4DYP",
        "affiliate": "https://www.amazon.in/dp/B0F4MX4DYP/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Dubstep Pop 1200 Portable Bluetooth Speaker | 12W Loud Sound, Deep Bass with XBASS, 16 Hrs Playtime, TWS Stereo Pairing, 52mm Driver, Splash-Resistant, Carry Strap (Black)",
        "price": "₹559",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71YG3ZhUwxL._AC_UL320_.jpg",
        "asin": "B0FCFWGB8V",
        "affiliate": "https://www.amazon.in/dp/B0FCFWGB8V/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "₹599.00\n₹599\n.\n00\n₹3,499.00\nHAMMER Drop X1 5W Bluetooth Speaker with Twin Pairing, Bluetooth v6.0, 32 Hours Playtime, 52mm Drivers (Beige)\n4.5 out of 5 stars\n 125",
        "price": "₹599",
        "rating": "4.5 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51PeLBopj8L._AC._SR360%2C460.jpg",
        "asin": "B0GMD8G6HY",
        "affiliate": "https://www.amazon.in/dp/B0GMD8G6HY/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "₹699.00\n₹699\n.\n00\n₹1,999.00\nToy Imagine Bluetooth Toy Car Speaker | Portable Car-Shaped Wireless Speaker with 5W Stereo Sound & 1200mAh Battery | TF/USB/FM/TWS Support, Multicolor Music Toy\n4.0 out of 5 stars\n 79",
        "price": "₹699",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71t4I-2qNHL._AC._SR360%2C460.jpg",
        "asin": "B0GF8KV7MR",
        "affiliate": "https://www.amazon.in/dp/B0GF8KV7MR/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "₹699.00\n₹699\n.\n00\n₹2,499.00\nHAMMER Wave 10W Bluetooth Speaker Up to 8 Hours Playtime, TWS Function, Made in India, Built-in Mic, BTv5.4, USB Port, Type-C Interface Wireless Bluetooth Speaker with Hanging Loop (Blue)\n4.0 out of 5 stars\n 290",
        "price": "₹699",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71ODP-LXUHL._AC._SR360%2C460.jpg",
        "asin": "B0FLKDXMQ7",
        "affiliate": "https://www.amazon.in/dp/B0FLKDXMQ7/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "₹999.00\n₹999\n.\n00\n₹4,999.00\nBlaupunkt 2025 Launch ATOMIK Grab 20W Party Speaker Boombox, Unbelievable Loud & Clear Music I Portable Carry Handle | A Perfect Carry Around Sound Partner for Outdoors I Light Weight Grab on the GO\n4.3 out of 5 stars\n 1,259",
        "price": "₹999",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F613LNL9foqL._AC._SR360%2C460.jpg",
        "asin": "B0DH8FHY3S",
        "affiliate": "https://www.amazon.in/dp/B0DH8FHY3S/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "₹649.00\n₹649\n.\n00\n₹1,499.00\nZEBRONICS Clipper, 4 Watts, Wearable Bluetooth Speaker with Mic, Magnetic Clip-On, Upto 20 Hours Playback, Bluetooth v5.3, Carry Loop, Adventure & Travel Companion, Portable Speaker (Black)\n3.9 out of 5 stars\n 10,619",
        "price": "₹649",
        "rating": "3.9 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F614ob6e%2BzLL._AC._SR360%2C460.jpg",
        "asin": "B0F4MXYZ34",
        "affiliate": "https://www.amazon.in/dp/B0F4MXYZ34/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "₹599.00\n₹599\n.\n00\n₹3,499.00\nHAMMER Drop 5W Bluetooth Wireless Speaker with Twin Pairing, 1200 mAh Battery, 100H Standby Time, TWS Function, TF Card, USB Slot, Auto-Pairing, in-Built Mic, Type-C Charging, 52mm Driver (Green)\n4.2 out of 5 stars\n 1,913",
        "price": "₹599",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61kQ3rY82ML._AC._SR360%2C460.jpg",
        "asin": "B0D7SLTNZY",
        "affiliate": "https://www.amazon.in/dp/B0D7SLTNZY/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "₹750.00\n₹750\n.\n00\n₹3,000.00\nE GATE C210 | 20W Bluetooth Speaker Soundbar, Dual Drivers + Dual Passive Radiator for Extra bass, RGB Light, Upto 15 Hrs Backup from 2000mah Battery, Call Function, TWS, Aux, USB, FM\n4.1 out of 5 stars\n 60",
        "price": "₹750",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61aGBier96L._AC._SR360%2C460.jpg",
        "asin": "B0D7W818QD",
        "affiliate": "https://www.amazon.in/dp/B0D7W818QD/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "JBL Partybox 120 Wireless Bluetooth 160W Party Speaker, AI Sound Boost, Futuristic Light Show, Upto 12Hrs Playtime,Multispeaker Connection by Auracast, Guitar & Mic Input, Splashproof (Black)",
        "price": "₹29,999",
        "rating": "",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F41tP4RfhbfL._AC_SR480%2C440_.jpg",
        "asin": "B0CX1NHPMG",
        "affiliate": "https://www.amazon.in/dp/B0CX1NHPMG/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Tribit StormBox 2 Bluetooth Speaker with 34W 360° Surround Sound, XBass Tech, 24H Playtime, IPX7 Waterproof, Bluetooth 5.3, TWS Pairing Portable Wireless Speaker for Outdoor",
        "price": "₹5,918",
        "rating": "",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51VXR26HcTL._AC_SR480%2C440_.jpg",
        "asin": "B0CW9N3XF1",
        "affiliate": "https://www.amazon.in/dp/B0CW9N3XF1/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Tribit XSound Plus 2 30W 5.3 Bluetooth Wireless Speakers,Powerful Louder Stereo Sound with Bass-Enhanced XBass Function,24H Playtime,IPX7 Waterproof,Built in Mic,150ft BT Range for Home/Outdoor,Black",
        "price": "₹5,699",
        "rating": "",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F41-0OGa-JSL._AC_SR480%2C440_.jpg",
        "asin": "B0CT5F1SW4",
        "affiliate": "https://www.amazon.in/dp/B0CT5F1SW4/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Boat PartyPal 65 Pro, 42W Signature Sound, Wireless Karaoke Mic, 8H Battery,RGB LEDs, TWS, Bass Boost, Multi Port, Bluetooth Speaker, Wireless Speaker, Portable Speaker (Premium Black)",
        "price": "₹5,499",
        "rating": "",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51q9xGTjskL._AC_SR480%2C440_.jpg",
        "asin": "B0FLYBFZL5",
        "affiliate": "https://www.amazon.in/dp/B0FLYBFZL5/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "EMEET Conference Speakerphone M0 Plus, 4 AI Mics 360° Voice Pickup, Noise Reduction, USB C Speaker, Bluetooth Conference Speaker for 8 People w/Daisy Chain for 16 Compatible with Leading Software",
        "price": "₹5,799",
        "rating": "",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51zfICZQrEL._AC_SR480%2C440_.jpg",
        "asin": "B0BVZLS5GZ",
        "affiliate": "https://www.amazon.in/dp/B0BVZLS5GZ/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "JBL Flip Essential 2, Wireless Portable Bluetooth Speaker with Deep Base, IPX7 Water & Dustproof (Without Mic, Black)",
        "price": "₹4,999",
        "rating": "",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F41DhH4Oa9iL._AC_SR480%2C440_.jpg",
        "asin": "B0B3XX8P9C",
        "affiliate": "https://www.amazon.in/dp/B0B3XX8P9C/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Tribit StormBox Mini+ Bluetooth Speaker 12W,360°Surround Sound,Custom EQ,12H Playtime,BT 5.4,AAC/SBC Support,LED Lights,IPX7 Waterproof,TWS Pairing,Type-C, Portable for Home/Outdoor/Travel Black",
        "price": "₹2,499",
        "rating": "",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51IVmNkgvoL._AC_SR480%2C440_.jpg",
        "asin": "B0DSVRLMV5",
        "affiliate": "https://www.amazon.in/dp/B0DSVRLMV5/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Boat Stone 1200 Pro, 60W Boat Signature Sound, 76.2mm Drivers, TWS,7.5H Battery, Built-in Mic, Carry Strap,IPX6, Bluetooth Speaker, Wireless Speaker, Portable Speaker (Ice Grey)",
        "price": "₹4,799",
        "rating": "",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F41aXKEt0SLL._AC_SR480%2C440_.jpg",
        "asin": "B0FLYBJB9Z",
        "affiliate": "https://www.amazon.in/dp/B0FLYBJB9Z/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "SMILEDRIVE® Portable Wireless Conference Speakerphone with Mute Feature|Loud Voice|Noise Reduction|360°Pickup Upto 20ft|360°Omnidirectional Mic|Bluetooth/USB Dual Connection|Audio/Video/Online Calls",
        "price": "₹3,999",
        "rating": "",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F31Iz5d6BIQL._AC_SR480%2C440_.jpg",
        "asin": "B0788QQ9KW",
        "affiliate": "https://www.amazon.in/dp/B0788QQ9KW/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Boat Aavante Bar 610, 25W Signature Sound, 2.0 CH with Dual Passive Radiators, 7 HRS Battery, Sleek Design, Multi Connectivity, Bluetooth Sound Bar, Soundbar Speaker (Charcoal Black)",
        "price": "₹1,899",
        "rating": "",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F31tFKzKo5lL._AC_SR480%2C440_.jpg",
        "asin": "B0BZ4DJ7GZ",
        "affiliate": "https://www.amazon.in/dp/B0BZ4DJ7GZ/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "JBL Charge 5, Wireless Portable Bluetooth Speaker Pro Sound, 20 Hrs Playtime, Powerful Bass Radiators, Built-in 7500mAh Powerbank, PartyBoost, IP67 Water & Dustproof (Without Mic, Black)",
        "price": "₹12,999",
        "rating": "",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F31L50qUHIHL._AC_SR480%2C440_.jpg",
        "asin": "B08VDNCZT9",
        "affiliate": "https://www.amazon.in/dp/B08VDNCZT9/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "boAt Stone 580 Bluetooth Speaker with 12W RMS Stereo Sound, LED Lights, Up to 8 HRS Playtime, TWS Feature, FM Radio, Multi-Compatibility Mode, IPX4(Pine Green)",
        "price": "₹1,699",
        "rating": "",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F517Uc94twIL._AC_SR480%2C440_.jpg",
        "asin": "B0CC5Y2PZW",
        "affiliate": "https://www.amazon.in/dp/B0CC5Y2PZW/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Boat Stone 193 Pro / Stone190 Pro with 5W Signature Sound, Up to 12hrs of Playtime, TWS Feature, Built-in Mic, Bluetooth v5.3, AUX Port, TF Card, IPX6 & Type-C Bluetooth Speaker (Tropical Blue)",
        "price": "₹999",
        "rating": "",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51dmspB5j-L._AC_SR480%2C440_.jpg",
        "asin": "B0DH8CDH9J",
        "affiliate": "https://www.amazon.in/dp/B0DH8CDH9J/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Portronics Talk Three Wearable Bluetooth Speaker with Mic, Magnetic/Spring Clip-On, Upto 10Hours Playtime, IPX5 Water/Dust Resistant, Bluetooth 5.3v, Big Buttons, Portable Speaker with Microphone",
        "price": "₹1,399",
        "rating": "",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51bDKLR%2BPLL._AC_SR480%2C440_.jpg",
        "asin": "B0CW39HC2Y",
        "affiliate": "https://www.amazon.in/dp/B0CW39HC2Y/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Artis BT12 Classic Retro Wireless BT Speaker with FM/USB/AUX in & Hands Free Calling (5W RMS Output)",
        "price": "₹999",
        "rating": "",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F41X3E8XP4UL._AC_SR480%2C440_.jpg",
        "asin": "B07RMHXKMK",
        "affiliate": "https://www.amazon.in/dp/B07RMHXKMK/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Ambrane 5W Wireless Bluetooth Mini Speaker with 44Hrs Playtime, Immersive Sound, 52mm Driver, Twin Pairing, Integrated Music & Call Control, Built in Mic, IPX4 Water Resistance (Minipod, Green)",
        "price": "₹699",
        "rating": "",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F41bswxGxbhL._AC_SR480%2C440_.jpg",
        "asin": "B0CLJ7V2JT",
        "affiliate": "https://www.amazon.in/dp/B0CLJ7V2JT/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "HALONIX Prime DJ Speaker 9W Base-B22 Millions Color smart Bluetooth led Bulb Pack of 1 (Clear & Powerful Bluetooth Speaker with Colorful Light)",
        "price": "₹661",
        "rating": "",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51ERZnUizDL._AC_SR480%2C440_.jpg",
        "asin": "B0924X1B6T",
        "affiliate": "https://www.amazon.in/dp/B0924X1B6T/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Razer DeathAdder V4 Pro Gaming Mouse (Model No: RZ01-05330100-R3A1) | 56 g Wireless Esports Mouse | Focus Pro 45K Optical Sensor | 8,000 Hz HyperSpeed | Optical Scroll Wheel | Gen-4 Switches_ Black\nRazer DeathAdder V4 Pro Gaming Mouse (…",
        "price": "₹16,999",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F31KgLlj0otL.AC_SX250.jpg",
        "asin": "B0FGX8N9KP",
        "affiliate": "https://www.amazon.in/dp/B0FGX8N9KP/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "JBL Quantum 100M2 Wired Gaming Headphones, Supports Windows sonic spatial audio, 40mm Realistic Dynamic Drivers, Omnidirectional Detachable Mic, Breathable Memory Foam cushions, PC/Xbox/PS/3.5mm-Black\nJBL Quantum 100M2 Wired Gaming Headp…",
        "price": "₹2,999",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F31UwcHLXXvL.AC_SX250.jpg",
        "asin": "B0D6NLHV8N",
        "affiliate": "https://www.amazon.in/dp/B0D6NLHV8N/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Razer Hammerhead V3 - Wired Earbuds for Gaming\nRazer Hammerhead V3 - Wired Earbuds for…",
        "price": "₹6,258",
        "rating": "3.5 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F41D3deQotCL.AC_SX250.jpg",
        "asin": "B0FJFCTFBV",
        "affiliate": "https://www.amazon.in/dp/B0FJFCTFBV/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Razer Seiren V3 Mini USB Microphone: Condenser Mic - Supercardioid Pickup Pattern - Tap-to-Mute Sensor with LED Indicator - Shock Absorber - Ultra Compact - PC, Discord, OBS Studio, XSplit - Black\nRazer Seiren V3 Mini USB Microphone: Co…",
        "price": "₹4,152",
        "rating": "4.5 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F31cHIXkz%2BdL.AC_SX250.jpg",
        "asin": "B0CMTQPWQ8",
        "affiliate": "https://www.amazon.in/dp/B0CMTQPWQ8/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Kreo Harpy Gaming Mouse Wired, 55g Ultra-Lightweight Mouse, Customizable RGB Mouse for Laptop Gaming, Mouse for Pc, 1000Hz Polling Rate, 12800 DPI\nKreo Harpy Gaming Mouse Wired, 55g Ul…",
        "price": "₹549",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F31GsgJUiUML.AC_SX250.jpg",
        "asin": "B0F43QRQRP",
        "affiliate": "https://www.amazon.in/dp/B0F43QRQRP/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "ZEBRONICS Transformer M Plus Wired Gaming Mouse, Up to 12800 DPI, 6 Buttons with a 6-Level DPI Switch, 8 RGB Modes, 1000Hz Polling Rate, 1.5m Detachable Cable, Gaming Grade Sensor (Grey + Blue)\nZEBRONICS Transformer M Plus…",
        "price": "₹699",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F41HImdtqU4L.AC_SX250.jpg",
        "asin": "B0FF4ZJNM3",
        "affiliate": "https://www.amazon.in/dp/B0FF4ZJNM3/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Razer Basilisk Mobile Portable Ergonomic Wireless Gaming Mouse: 10 Programmable Controls HyperScroll - Optical Switches Gen-3 - Long Battery Life - AI Prompt - 2.4 GHz, Bluetooth, USB C\nRazer Basilisk Mobile Portable Ergonomic…",
        "price": "₹7,596",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F31wxzbDPIGL.AC_SX250.jpg",
        "asin": "B0F85WRNZG",
        "affiliate": "https://www.amazon.in/dp/B0F85WRNZG/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Logitech G102 Light Sync Gaming Mouse with Customizable RGB Lighting, 6 Programmable Buttons, Gaming Grade Sensor, 8K DPI Tracking,16.8mn Color, Light Weight - Black",
        "price": "₹1,395",
        "rating": "",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F41hYQ9J7gCL._AC_SR480%2C440_.jpg",
        "asin": "B08LT9BMPP",
        "affiliate": "https://www.amazon.in/dp/B08LT9BMPP/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Razer BlackShark V2 X Smartchoice Wired Gaming Headset with Mic, 7.1 Surround Sound, 50mm Drivers, Memory Foam Cushions, Multi-Platform (PC/PS/Xbox/Switch/Mobile), 3.5mm Jack_Black\nRazer BlackShark V2 X Smartchoice Wired G…",
        "price": "₹3,999",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F41GMgZG6zdL.AC_SX250.jpg",
        "asin": "B08WBJHVYV",
        "affiliate": "https://www.amazon.in/dp/B08WBJHVYV/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Razer Bluetooth DeathAdder V2 X Hyper Speed: Award-Winning Ergonomic Design with 14000 DPI - Ultra-Fast Hyper Speed Wireless Ergonomic Gaming Mouse - 235hr Battery Life - RZ01-04130100-R3A1, Black",
        "price": "₹3,499",
        "rating": "",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F31RYQTatwkL._AC_SR480%2C440_.jpg",
        "asin": "B09KH6NFXG",
        "affiliate": "https://www.amazon.in/dp/B09KH6NFXG/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Razer Cobra Smartchoice Wired Gaming Mouse, 58g Lightweight Design, Gen-3 Optical Switches, Chroma RGB Underglow, 8500 DPI Optical Sensor, Speedflex Cable, Black",
        "price": "₹2,999",
        "rating": "",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F31rUkBw3SmL._AC_SR480%2C440_.jpg",
        "asin": "B0C5XNRVWM",
        "affiliate": "https://www.amazon.in/dp/B0C5XNRVWM/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Razer Kraken X Lite Ultralight Gaming Headset: 7.1 Surround Sound Capable - Lightweight Frame - Bendable Cardioid Microphone - for PC, Xbox, PS4, Nintendo Switch - Classic Black",
        "price": "₹3,859",
        "rating": "",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F31ejq4oforL._AC_SR480%2C440_.jpg",
        "asin": "B07XC936P8",
        "affiliate": "https://www.amazon.in/dp/B07XC936P8/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Razer BlackShark V2 X - White | Multi-Platform Wired Esports On Ear Headset - RZ04-03240700-R3M1",
        "price": "₹3,999",
        "rating": "",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F41G1JuUoG%2BL._AC_SR480%2C440_.jpg",
        "asin": "B09QFYNJMB",
        "affiliate": "https://www.amazon.in/dp/B09QFYNJMB/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Razer DeathAdder V3 Pro Smartchoice Wireless Gaming Mouse, Ultra Lightweight Design, Focus Pro 30K Optical Sensor, HyperSpeed Wireless, Gen-3 Optical Switches, 5 Programmable Buttons, Black",
        "price": "₹8,999",
        "rating": "",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F319j10IcNIL._AC_SR480%2C440_.jpg",
        "asin": "B0B92HV8CP",
        "affiliate": "https://www.amazon.in/dp/B0B92HV8CP/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "HP GK400F Mechanical Gaming Keyboard,dust & Spill Resistant,RGB Backlit Keys,Metal Panel,Full-Sized Keyboard Design",
        "price": "₹1,959",
        "rating": "",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F31u6SHbp0CL._AC_SR480%2C440_.jpg",
        "asin": "B0CW2VHDS4",
        "affiliate": "https://www.amazon.in/dp/B0CW2VHDS4/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Cosmic Byte ARES Wireless Controller for PC, Upgraded Hall Effect Joystick & Triggers, Dual Vibration, Backit LED Buttons, Turbo, Auto Turbo (Black)",
        "price": "₹1,499",
        "rating": "",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F41gah1c4DXL._AC_SR480%2C440_.jpg",
        "asin": "B09GRW4V2H",
        "affiliate": "https://www.amazon.in/dp/B09GRW4V2H/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Razer Blackshark V2 Pro Wireless Gaming Headset 2023 Edition: 50Mm Titanium Drivers-Hyperclear Super Wideband Mic-Noise-Isolating Earcups-70 Hour Battery Life-Black-Rz04-04530100-R3M1-Over Ear",
        "price": "₹21,180",
        "rating": "",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F41uKeDrWOZL._AC_SR480%2C440_.jpg",
        "asin": "B0BXLWCLZN",
        "affiliate": "https://www.amazon.in/dp/B0BXLWCLZN/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Corsair Katar Pro Ultra-Light Optical USB Gaming Mouse with Backlit RGB LED, 12400 DPI (Black)\nCorsair Katar Pro Ultra-Light Optical USB Ga…",
        "price": "₹1,607",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F31aaaWeSDZL.AC_SX250.jpg",
        "asin": "B08KSZV3SR",
        "affiliate": "https://www.amazon.in/dp/B08KSZV3SR/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Razer Huntsman Mini - Mercury Edition - 60% Optical Gaming Keyboard (Clicky Purple Switch) - FRML Packaging\nRazer Huntsman Mini - Mercury Edition - 60…",
        "price": "₹5,019",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F41QZdRFgSsL.AC_SX250.jpg",
        "asin": "B08BZDLVNN",
        "affiliate": "https://www.amazon.in/dp/B08BZDLVNN/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Razer Naga V2 Pro Smartchoice Wireless Gaming Mouse, Interchangeable Side Plates (2/6/12 Buttons), 20K DPI Optical Sensor, Fast Switches, Chroma RGB Lighting, Black\nRazer Naga V2 Pro Smartchoice Wireless…",
        "price": "₹20,030",
        "rating": "3.9 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F41Ys1r4Uq0L.AC_SX250.jpg",
        "asin": "B0BW414LJL",
        "affiliate": "https://www.amazon.in/dp/B0BW414LJL/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Ant Esports GM600 RGB Wired Gaming Mouse 7200 DPI Optical Sensor 6 Adjustable DPI Levels 7 Programmable Buttons HUANO 50M Click Switches 14 RGB Modes Ergonomic USB Mouse for PC Laptop Gaming & Office\nAnt Esports GM600 RGB Wired Gaming…",
        "price": "₹655",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F314-ruVhSxL.AC_SX250.jpg",
        "asin": "B09NDK13WW",
        "affiliate": "https://www.amazon.in/dp/B09NDK13WW/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Logitech G515 Lightspeed TKL Low Profile Wireless Gaming Keyboard, LIGHTSYNC RGB, Thin Tenkeyless Design, PBT Keycaps, Tactile (Brown) Mechanical Switches - Black\nLogitech G515 Lightspeed TKL Low…",
        "price": "₹11,295",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F310qhbsOKRL.AC_SX250.jpg",
        "asin": "B0D5WMS51B",
        "affiliate": "https://www.amazon.in/dp/B0D5WMS51B/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Zowie BenQ U2 Wireless Gaming Mouse for Esports, Sport Science, Enhanced Receiver, 60g Lightweight, 3200 DPI 3395 Sensor, 5 Buttons, 70 Hr Battery Life\nZowie BenQ U2 Wireless Gaming Mo…",
        "price": "₹7,490",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F31fA7UbHHhL.AC_SX250.jpg",
        "asin": "B0CT8KVMWC",
        "affiliate": "https://www.amazon.in/dp/B0CT8KVMWC/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "HyperX Cloud II – Wired Gaming Headset for PC, PS5 / PS4. Active Noise Cancellation, Over Ear, circumaural, Closed Back, HyperX Virtual 7.1 Surround Sound - Black-Red (4P5M0AA)\nHyperX Cloud II – Wired Gaming Heads…",
        "price": "₹5,499",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F41SkA5j2l-L.AC_SX250.jpg",
        "asin": "B00SAYCXWG",
        "affiliate": "https://www.amazon.in/dp/B00SAYCXWG/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Boat Bassheads 300C Wired Earphones,Type-C Jack, 10mm Drivers, Signature Sound, in-Line Microphone, Integrated Controls, Voice Assistant & 120cm Cable (Active Black)",
        "price": "₹549",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51sxI5xpalL._AC_UL320_.jpg",
        "asin": "B0FM38916Y",
        "affiliate": "https://www.amazon.in/dp/B0FM38916Y/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Jio Original & Genuine Bluetooth Voice Remote for JioFiber Set-Top Box | 43-Key Universal Replacement | Easy Pairing | 6-Month Warranty",
        "price": "₹699",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61R6eRGisYL._AC_UL320_.jpg",
        "asin": "B0DK1CJKM3",
        "affiliate": "https://www.amazon.in/dp/B0DK1CJKM3/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "ZEBRONICS HDMI 2.0 Cable with ARC, 4K@60Hz UHD, 3 Meter, 18 Gbps High Speed Data Transmission, Supports 3D, ARC, CEC, 32 Audio Channels, Male-to-Male (HAA3020A)",
        "price": "₹199",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71Oga6oOfmL._AC_UL320_.jpg",
        "asin": "B0FKT3NYWR",
        "affiliate": "https://www.amazon.in/dp/B0FKT3NYWR/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Apple iPad 11″: A16 chip, 27.69 cm (11″) Model, Liquid Retina Display, 128GB, Wi-Fi 6, 12MP Front/12MP Back Camera, Touch ID, All-Day Battery Life — Silver",
        "price": "₹34,400",
        "rating": "4.6 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61qYkM2gvSL._AC_UL320_.jpg",
        "asin": "B0DZ79Q1DB",
        "affiliate": "https://www.amazon.in/dp/B0DZ79Q1DB/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "AULA F75 75% Wireless PBT Keycaps Mechanical Keyboard | Hot Swappable, Pre-lubed Linear Switches | RGB Backlit, 2.4GHz/Type-C/Bluetooth Gaming Keyboard (Thunder Black, Star-Vector(Seiya) Switch)",
        "price": "₹4,999",
        "rating": "5.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71cu-Jst1cL._AC_UL320_.jpg",
        "asin": "B0GLH6M7DL",
        "affiliate": "https://www.amazon.in/dp/B0GLH6M7DL/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "8Bitdo Ultimate 2C Wireless Controller for Windows PC and Android, with 1000 Hz Polling Rate, Hall Effect Joysticks and Triggers, and Remappable L4/R4 Bumpers (Purple) (Mint)",
        "price": "₹5,346",
        "rating": "4.5 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F514wvI38zaL._AC_UL320_.jpg",
        "asin": "B0D736BCNM",
        "affiliate": "https://www.amazon.in/dp/B0D736BCNM/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Virtutron Electronic Non-Bluetooth Universal Stylus Pen| High-Precision Digital Pencil| Compatible with iPhone, iPad, Samsung, Android, Tablet & Mobiles- White",
        "price": "₹999",
        "rating": "3.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F41kWmhHiGlL._AC_UL320_.jpg",
        "asin": "B0D5M4RHWG",
        "affiliate": "https://www.amazon.in/dp/B0D5M4RHWG/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Portronics 80W Dual Output Fast Car Charger with Type-C PD & USB, LED Indicator, Charging Adapter Compatible with Cars for iPhone & Android Smartphone, Smartwatch, Earbud, Power Bank (Black)",
        "price": "₹522",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51OyrUyY3bL._AC_UL320_.jpg",
        "asin": "B0DJBZJM15",
        "affiliate": "https://www.amazon.in/dp/B0DJBZJM15/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Boat Universal Travel Adapter C10 Compatible with US, UK, EU & AU Plug Types, Two USB Ports with 10W Max Support, 5-in-1 International Travel Adapter with Overheat/Overcharge Protection",
        "price": "₹598",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61vWxpa%2BY6L._AC_UL320_.jpg",
        "asin": "B0FFMXM58D",
        "affiliate": "https://www.amazon.in/dp/B0FFMXM58D/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Portronics Bubble 3.0 Wireless Keyboard with Bluetooth + 2.4 GHz USB Receiver, Rechargeable Battery, Dual Height Adjustment, Multimedia Hotkeys with Numpad, for Laptop, PC, Smartphone, Tablet(White)",
        "price": "₹999",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F7145-Bby56L._AC_UL320_.jpg",
        "asin": "B0G2S6FRWS",
        "affiliate": "https://www.amazon.in/dp/B0G2S6FRWS/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Noise Airwave Max 5 Wireless Over-Ear Headphones with Adaptive Hybrid ANC (up to 50dB), HFA Tech, 80H Playtime, Dual Pairing(Calm Beige)",
        "price": "₹4,949",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51YKwVXBhIL._AC_UL320_.jpg",
        "asin": "B0DGV6TB8D",
        "affiliate": "https://www.amazon.in/dp/B0DGV6TB8D/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "realme Buds Air 8,11mm+6mm Dual Dynamic Bass Drivers,58Hrs Playtime, 55dB ANC,6 Mic ENC, 45ms Low Latency, 360° Spatial Audio, Hi-Res LHDC, IP55 Dust & Water Resistant, BT v5.4 (Master Grey)",
        "price": "₹3,799",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51oUkepEvzL._AC_UL320_.jpg",
        "asin": "B0GDQ28DY5",
        "affiliate": "https://www.amazon.in/dp/B0GDQ28DY5/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Ambrane 5-in-1 MultiPort Adapter with Universal AC Socket, 2 x Type C, 2 x USB, 2500W AC Output, 20W USB & PD Output, Ideal for Tight Spaces/Bedside & Travels, Child Safety Shutter (Charge X20, Black)",
        "price": "₹999",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F718gCT4jMdL._AC_UL320_.jpg",
        "asin": "B0FG7NRVBL",
        "affiliate": "https://www.amazon.in/dp/B0FG7NRVBL/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Portronics Ruffpad 12E Re-Writable LCD Writing Pad with 30.4cm (12 inch) Writing Area, India's First Notepad to Save and Share Your Child's First creatives via Ruffpad app on Your Smartphone(Black)",
        "price": "₹339",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F614cir2QNOL._AC_UL320_.jpg",
        "asin": "B09VC2D2WG",
        "affiliate": "https://www.amazon.in/dp/B09VC2D2WG/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Portronics 71W Car Power 1C Triple Output Fast Car Charger with 33W Type-C Cable, 20W Type-C PD, 18W USB Port, Fast Charging Adapter Compatible with Cars for iPhone & Android Smartphone (Black)",
        "price": "₹551",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F619B%2Bx%2BwIAL._AC_UL320_.jpg",
        "asin": "B0D3DJKVDM",
        "affiliate": "https://www.amazon.in/dp/B0D3DJKVDM/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Boat Wave Call 3 Smartwatch 1.83” HD Display with Animated Watch Faces; BT Calling, Functional Crown, Multiple Sports Modes, IP68, HR, SpO2 Monitor, Smart Watches for Men & Women (Bold Black)",
        "price": "₹1,399",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71UdDIKDlEL._AC_UL320_.jpg",
        "asin": "B0FLF44GTQ",
        "affiliate": "https://www.amazon.in/dp/B0FLF44GTQ/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "realme Buds T200x True Wireless Earbuds with 12.4mm Dynamic Bass Drivers, 25 dB ANC, Quad Mic, 45ms Latency, Upto 48 Hrs Playback, Fast Charge, IP55 Rated, BT 5.4 (Pure Black)",
        "price": "₹1,599",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61Ow0V-mzkL._AC_UL320_.jpg",
        "asin": "B0FBR6HGXM",
        "affiliate": "https://www.amazon.in/dp/B0FBR6HGXM/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "OneAssist 1 Year Extended Warranty Plan for Small Home Appliances Between Rs 10001 to Rs 15000 (E-Mail Delivery Only)",
        "price": "₹499",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51BwVxswfPL._AC_UL320_.jpg",
        "asin": "B0C28FNDHS",
        "affiliate": "https://www.amazon.in/dp/B0C28FNDHS/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Honeywell 7-in-1 TypeC Docking Station with 4K HDMI,1xUSB 3.0, 2xUSB 2.0 & TypeC 3.0 PD 100W Charging Port, SD & Micro SD Slot,for All Type C Devices- MacBook,Laptop, Thunderbolt 3,PC,3 Years Warranty",
        "price": "₹1,999",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61tPYsj5cGL._AC_UL320_.jpg",
        "asin": "B0CHBHYLLR",
        "affiliate": "https://www.amazon.in/dp/B0CHBHYLLR/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "realme Buds T310 True Wireless in-Ear Earbuds with 46dB Hybrid ANC, 360° Spatial Audio, 12.4mm Dynamic Bass Driver, Upto 40Hrs Battery and Fast Charging (Vibrant Black)",
        "price": "₹2,068",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61dj32WdrxL._AC_UL320_.jpg",
        "asin": "B0DBGP48NW",
        "affiliate": "https://www.amazon.in/dp/B0DBGP48NW/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Goldmedal 360 Degree Power Strip | 6 Universal Sockets| 2-Meter Cord with Safety Shutter | Multi-Plug Board for Home Appliances & Office, Wall Mount Option - White & Red",
        "price": "₹655",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51QyerUXHjL._AC_UL320_.jpg",
        "asin": "B00NWTC234",
        "affiliate": "https://www.amazon.in/dp/B00NWTC234/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "wipro 9-Watt B22 WiFi Smart LED Bulb with Music Sync (16 Million Colours + Warm White/Neutral White/White) (Compatible with Amazon Alexa and Google Assistant), Standard (NS9400)(Pack of 1)",
        "price": "₹549",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F11hfR5Cq9GL._SS200_.png",
        "asin": "B095SWYF6M",
        "affiliate": "https://www.amazon.in/dp/B095SWYF6M/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "pTron Fusion Pro Retro Signature 20W Bluetooth Speaker with Pristine Sound, 8 Hours Playtime, Dual Drivers, Playback via BT5.3/USB/TF Card, Easy Controls, Portable Speaker & Type C Charging (Black)",
        "price": "₹1,699",
        "rating": "3.8 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71eruucP21L._AC_UL320_.jpg",
        "asin": "B0DVZF8RQF",
        "affiliate": "https://www.amazon.in/dp/B0DVZF8RQF/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Electronic Spices 12v Brushless 3Inch DC Cooling Fan for Pc Case,CPU Cooler, 2pcs, Black (80X80) mm",
        "price": "₹259",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51MU-LDNBvL._AC_UL320_.jpg",
        "asin": "B08WS4TDXX",
        "affiliate": "https://www.amazon.in/dp/B08WS4TDXX/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Noise Buds VS102 Plus Wireless Earbuds, Bluetooth Earbuds with 70H Playtime, Quad Mic ENC for Clear Calls, 11mm Drivers, Deep Bass, Instacharge, Bluetooth v5.3 (Deep Wine)",
        "price": "₹1,199",
        "rating": "3.6 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61Sok9EsgjL._AC_UL320_.jpg",
        "asin": "B0DS2XNXZB",
        "affiliate": "https://www.amazon.in/dp/B0DS2XNXZB/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Zebronics 2-in-1 Wireless Carplay Receiver, Converts Wired Android Auto & CarPlay to Wireless, USB A & Type C, BT v5.4, WiFi 6, iOS & Android Compatible, Fast Boot, Compact, Plug & Play (DriveCast)",
        "price": "₹1,599",
        "rating": "3.8 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71FMEC5cJML._AC_UL320_.jpg",
        "asin": "B0GQ5BCCBK",
        "affiliate": "https://www.amazon.in/dp/B0GQ5BCCBK/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Apple 20W USB-C Power Adapter (for iPhone, iPad & AirPods)",
        "price": "₹1,799",
        "rating": "4.5 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F41aAXonVlQL._AC_UL320_.jpg",
        "asin": "B09794YHBS",
        "affiliate": "https://www.amazon.in/dp/B09794YHBS/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Lifelong Electronics 10A Universal Travel Adapter All in One | 2500W Heavy Duty Power | 180+ Countries - Europe/US/UK/AU/Asia etc. | 9-Hole International Worldwide Socket Accessories (Latest Launch)",
        "price": "₹665",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51O-pEDiZQL._AC_UL320_.jpg",
        "asin": "B0F5BQR5SL",
        "affiliate": "https://www.amazon.in/dp/B0F5BQR5SL/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Portronics Ruffpad 8.5M Multicolor LCD Writing Pad with Screen 21.5cm (8.5-inch) for Drawing, Playing, Handwriting Gifts for Kids & Adults, India's first notepad to save and share your child's first creatives via Ruffpad app on your Smartphone(Black)",
        "price": "₹200",
        "rating": "3.9 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51GOQ6nTwoL._AC_UL320_.jpg",
        "asin": "B09GFN8WZL",
        "affiliate": "https://www.amazon.in/dp/B09GFN8WZL/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Boat Type C to Lighting Cable for 27W Fast Charging | 480 Mbps Data Transfer | 1.2 m (3.9 ft) Perfect Cable Length | Premium Nylon Braiding | Durable & Tangle-Free | with Silicon Tie (Arctic White)",
        "price": "₹249",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51cid%2BMbDdL._AC_UL320_.jpg",
        "asin": "B0G4MDFNGZ",
        "affiliate": "https://www.amazon.in/dp/B0G4MDFNGZ/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "RENEE Prime Matte Lipstick - Mulberry Wine, Lightweight & Long-Lasting Formula, Creamy Matte Finish, One Swipe Application, Non-Drying, Vitamin E Infused, 4.5Gm\nRENEE Prime Matte Lipstick - Mulberry Wine, Lightweight & Long-Lasting Formula, Creamy Matte Finish, One Swip…",
        "price": "₹345",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51-avEyt1ZL._AC_SR405%252C405_.jpg",
        "asin": "B0DL6FWTCH",
        "affiliate": "https://www.amazon.in/dp/B0DL6FWTCH/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Hilary Rhoda Creamy Touch Lipstick | Infused with Olive Oil, Shea Butter & Vitamin E | Highly Pigmented & Creamy Texture | Long Lasting & Keeps Lips Moisturising - 4g (Pink Nude - Shade 02)\nHilary Rhoda Creamy Touch Lipstick | Infused with Olive Oil, Shea Butter & Vitamin E | Highly Pigmented & Cr…",
        "price": "₹185",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61VdvTO73AL._AC_SR405%252C405_.jpg",
        "asin": "B0DVGK4T1P",
        "affiliate": "https://www.amazon.in/dp/B0DVGK4T1P/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Bob & Bae Whipped Lipstick with Kojic Acid| Viral Korean Mousse Lipstick | Matte Finish & Long Lasting | Lip & Cheek Tint | Superlight & Transferproof | Infused with Niacinamide, Vitamin E & Cocoa Butter - 5.5 ml (JEY)\nBob & Bae Whipped Lipstick with Kojic Acid| Viral Korean Mousse Lipstick | Matte Finish & Long Lasting | Lip & C…",
        "price": "₹549",
        "rating": "5.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F510vLQE8qlL._AC_SR405%252C405_.jpg",
        "asin": "B0FLK7GXT4",
        "affiliate": "https://www.amazon.in/dp/B0FLK7GXT4/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "REBISSTO 6Pcs Lipstick Combo Set - Long Lasting Liquid Lipsticks Matte Waterproof for Dusky Skin Tone & Fair Tone in Red, Brown, Nude lipstick Shades, Ideal Valentine Gift for Girlfriend & Wife\nREBISSTO 6Pcs Lipstick Combo Set - Long Lasting Liquid Lipsticks Matte Waterproof for Dusky Skin Tone & Fair…",
        "price": "₹399",
        "rating": "3.5 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61wfbUsbgrL._AC_SR405%252C405_.jpg",
        "asin": "B0GQNW71K5",
        "affiliate": "https://www.amazon.in/dp/B0GQNW71K5/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Swiss Beauty Non Tranfer Lipstick Long Stay & Smooth, Royal-Maroon, 3G Matte Finish\nSwiss Beauty Non Tranfer Lipstick Long Stay & Smooth, Royal-Maroon, 3G Matte Finish",
        "price": "₹339",
        "rating": "3.9 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51Ta3nEUgrL._AC_SR405%252C405_.jpg",
        "asin": "B07T96KW9Y",
        "affiliate": "https://www.amazon.in/dp/B07T96KW9Y/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Swiss Beauty Pure Matte Creamy Lipstick | Non-drying, Highly pigmented Lipstick | Shade- Fuchsia Pink, 3.8gm|\nSwiss Beauty Pure Matte Creamy Lipstick | Non-drying, Highly pigmented Lipstick | Shade- Fuchsia Pink, 3.…",
        "price": "₹194",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51tI6rHm7JL._AC_SR405%252C405_.jpg",
        "asin": "B07SYLDWKP",
        "affiliate": "https://www.amazon.in/dp/B07SYLDWKP/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Europe Girl Silky Matte Lipstick (EG 18-BED TALK, 3 g)\nEurope Girl Silky Matte Lipstick (EG 18-BED TALK, 3 g)",
        "price": "₹765",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61fnP4-nQYL._AC_SR405%252C405_.jpg",
        "asin": "B0DXF8T2CR",
        "affiliate": "https://www.amazon.in/dp/B0DXF8T2CR/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Havells Airboll High Speed 450mm Wall Fan (White)",
        "price": "₹4,990",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F81%2B5bbj3xeL._AC_UL165_SR165%2C165_.jpg",
        "asin": "B00B4BC9IA",
        "affiliate": "https://www.amazon.in/dp/B00B4BC9IA/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "The Earth Store Handcrafted Creme Matte Brown Ceramic Dinner Set, 30 Pieces Serving for 6, Microwave and Dishwasher Safe, Bone-Ash Free, Dinner Sets | Crockery Set for Gifting & Dining",
        "price": "₹5,899",
        "rating": "3.9 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F81cyY0ge0yL._AC_UL165_SR165%2C165_.jpg",
        "asin": "B0GKGZ7LMJ",
        "affiliate": "https://www.amazon.in/dp/B0GKGZ7LMJ/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Havells Swing 300mm Wall Mounted Fan | High-Performance, Wall Fan for Kitchen & Home, Smooth Oscillation, 100% Copper Motor | 3-Speed Control, 2-Year Warranty | (Pack of 1, Off White)",
        "price": "₹2,349",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F719Lzp9EmmL._AC_UL165_SR165%2C165_.jpg",
        "asin": "B00J5ENA7C",
        "affiliate": "https://www.amazon.in/dp/B00J5ENA7C/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Havells CANDY HS Wall & Table Fan 230 mm 100% Copper Wire Motor| Watt: 60|Air Flow: 35 cmm|Speed: 2700 RPM| 2 Year Warranty(Yellow)",
        "price": "₹2,450",
        "rating": "3.6 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F61zVvj%2Bh90L._AC_UL165_SR165%2C165_.jpg",
        "asin": "B0F6BNMKMH",
        "affiliate": "https://www.amazon.in/dp/B0F6BNMKMH/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Havells Swing 400mm Wall Fan (Off White)",
        "price": "₹2,490",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F41ueDbjypYL._AC_UL165_SR165%2C165_.jpg",
        "asin": "B00B4BCAVG",
        "affiliate": "https://www.amazon.in/dp/B00B4BCAVG/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Portronics Aero Breeze Portable table Fan 178mm, USB Rechargeable Fan, 3 Speed Airflow, Battery Powered Silent Operation, 4 Hours Back Up, 360° Rotatable USB Fan, BLDC Fan for Kitchen,Office,Home",
        "price": "₹949",
        "rating": "3.9 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F71OhLdT8bfL._AC_UL165_SR165%2C165_.jpg",
        "asin": "B0CQG1SBV3",
        "affiliate": "https://www.amazon.in/dp/B0CQG1SBV3/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "The Earth Store Handcrafted White Matte Brown Ceramic Dinner Set, 21 Pieces Serving for 6, Microwave and Dishwasher Safe, Bone-Ash Free, Dinner Sets | Crockery Set for Gifting & Dining",
        "price": "₹5,499",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F81MWJ0bTcJL._AC_UL165_SR165%2C165_.jpg",
        "asin": "B0D1V4382S",
        "affiliate": "https://www.amazon.in/dp/B0D1V4382S/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Portronics Snapcase 3 60W Multifunctional Fast Charging Data Cable Kit, Conversion Set USB A & Type C to Male Micro/Type C/Lightning, Data Transfer, Sim Storage, Sim Eject Pin, Pocket Size(Blue)",
        "price": "₹299",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61t1Q0eNs7L._AC_UL320_.jpg",
        "asin": "B0DTPGC83R",
        "affiliate": "https://www.amazon.in/dp/B0DTPGC83R/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Ambrane Magsafe Wireless 10000Mah Fast Charging Power Bank, Strong Magnet, Micro USB Input, 22.5W Output For Iphone 12 Above, Android & Other Qi Enabled Devices + Magnetic Ring (Aerosync Snap, Purple)",
        "price": "₹1,499",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F6199hEwNH6L._AC_UL320_.jpg",
        "asin": "B0D9S9TV5Q",
        "affiliate": "https://www.amazon.in/dp/B0D9S9TV5Q/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Portronics Snapcase 2 60W Multifunctional Fast Charging Data Cable Kit With Retractable Cable, Conversion Set USB A & Type C to Male Micro/Lightning,Sim Storage,Sim Eject Pin",
        "price": "₹449",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61U53pEqNwL._AC_UL320_.jpg",
        "asin": "B0DPX6M4L5",
        "affiliate": "https://www.amazon.in/dp/B0DPX6M4L5/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "SaleOn Cable Organizer Case Bag – Electronics Accessories Travel Gadget & Hard Disk Bag – Water-Resistant Portable Storage, Sleek Black (6-Month Warranty)",
        "price": "₹298",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81GaofCt8VL._AC_UL320_.jpg",
        "asin": "B0DLBRVQCC",
        "affiliate": "https://www.amazon.in/dp/B0DLBRVQCC/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "pTron Newly Launched Fusion Tunes 10W Mini Bluetooth Speaker with Wireless Karaoke Mic, 8Hrs Playtime, Vivid RGB Lights, Voice Effects, Multi-Play Modes BT5.1/TF Card & Type-C Charging Port (Black)",
        "price": "₹799",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61Lgfcc%2Bo-L._AC_UL320_.jpg",
        "asin": "B0D772K8X8",
        "affiliate": "https://www.amazon.in/dp/B0D772K8X8/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "OnePlus Nord Buds 3r TWS Earbuds up to 54 Hours Playback, 2-mic Clear Calls, 3D Spatial Audio, AI Translation, 12.4mm Drivers, Dual-Device Connectivity, 47ms Low Latency - Ash Black",
        "price": "₹1,999",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51nBTTG3hNL._AC_UL320_.jpg",
        "asin": "B0FMDL81GS",
        "affiliate": "https://www.amazon.in/dp/B0FMDL81GS/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "THEMISTO - built with passion Themisto Beginners 8 In 1 Corded_electric Soldering Iron Kit",
        "price": "₹299",
        "rating": "3.7 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61rO8eQB4ZL._AC_UL320_.jpg",
        "asin": "B07PM6134P",
        "affiliate": "https://www.amazon.in/dp/B07PM6134P/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Portronics Ruffpad 8.5E Re-Writable LCD Writing Pad with Screen 21.5cm (8.5-inch) for Drawing, Playing, Handwriting Gifts for Kids & Adults,(Black)",
        "price": "₹179",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51wfrF6-1hL._AC_UL320_.jpg",
        "asin": "B09GF6JBZN",
        "affiliate": "https://www.amazon.in/dp/B09GF6JBZN/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Redmi Pad 2 Wi-Fi + Cellular, Active Pen Support, 27.94cm(11\") Model, 2.5K Sharp & Clear Display, 6GB, 128GB, All Day & More 9000mAh Battery, AI-Enabled, Dolby Atmos, HyperOS 2, Graphite Grey",
        "price": "₹19,999",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71cXQm1s52L._AC_UL320_.jpg",
        "asin": "B0FBRY7X7Y",
        "affiliate": "https://www.amazon.in/dp/B0FBRY7X7Y/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "VRPRIME Laptop Cleaner Kit | Combo with 500ML Laptop Screen Cleaner Spray for Keyboard, Mobile Phone, Camera Lens, Computer, Gadgets, Electronics, TV | Large Microfiber Cloth & Brush",
        "price": "₹279",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81mN3S7J-lL._AC_UL640_QL65_.jpg",
        "asin": "B0DVPXG1B8",
        "affiliate": "https://www.amazon.in/dp/B0DVPXG1B8/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Portronics Trifusion 16W HD Sound Bluetooth Speaker with 15W Wireless Charging, 360°RGB LED Lights, Digital Clock with Alarm Setting, Built-in White Noise, USB/SD Card/AUX in, Type C Charging(Black)",
        "price": "₹1,841",
        "rating": "3.5 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71KVLuFXPIL._AC_UL320_.jpg",
        "asin": "B0DJ33F2JQ",
        "affiliate": "https://www.amazon.in/dp/B0DJ33F2JQ/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Portronics Bridge Y USB 3.0 to Type C OTG Adaptor, 10Gbps High Speed Data Transfer, Thunderbolt to USB Adapter, Compatible for All Type C Devices, Smartphone, Laptops, Tablets, Chargers, MacBook",
        "price": "₹119",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F616jdfyhw8L._AC_UL320_.jpg",
        "asin": "B0DH3J6LB9",
        "affiliate": "https://www.amazon.in/dp/B0DH3J6LB9/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Sounce Shutter Remote Control with Bluetooth Wireless Technology - Create Amazing Photos and Videos Hands-Free - Works with Most Smartphones and Tablets (iOS and Android) (Black)",
        "price": "₹169",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51x9HSFrFrL._AC_UL320_.jpg",
        "asin": "B0922XL7SH",
        "affiliate": "https://www.amazon.in/dp/B0922XL7SH/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "HUMBLE Ultra Soft Microfiber Cleaning Cloth for Laptop Screen Phone Camera Lens Tablet Monitor Sunglasses Soft Lint Free Reusable Wipes for Electronics Optical Glass Non Abrasive Microfiber Pack of 10",
        "price": "₹199",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F812r2zH%2B0AL._AC_UL320_.jpg",
        "asin": "B0FBK96FN7",
        "affiliate": "https://www.amazon.in/dp/B0FBK96FN7/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Amazon Basics Travel Organiser for Electronic Accessories, Flexible Padded Dividers, Waterproof, Foam Padding, for Cables, Chargers, Hard Disk, Power Bank",
        "price": "₹469",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71V%2BPt4QslL._AC_UL320_.jpg",
        "asin": "B0C3RFT4WV",
        "affiliate": "https://www.amazon.in/dp/B0C3RFT4WV/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Sounce 3 in 1 Cleaning Kit Set for Screen PC, Laptops, Monitors, Mobiles, LCD, LED, TV/Professional Quality/Prevents Static Electricity, 100ml with Micro Fiber Cloth and Brush",
        "price": "₹139",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71CFc-fYMBL._AC_UL320_.jpg",
        "asin": "B0BSLRB8NJ",
        "affiliate": "https://www.amazon.in/dp/B0BSLRB8NJ/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Fire-Boltt Ninja Call Pro Max Bluetooth Calling Smart Watch, 2.01\" HD Display, 120+ Sports Modes, Health Suite, AI Voice Assistance, SpO2 & Heart Rate Monitor Smartwatch for Men & Women - Grey",
        "price": "₹1,399",
        "rating": "3.9 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61zBJcICfFL._AC_UL320_.jpg",
        "asin": "B0C496V772",
        "affiliate": "https://www.amazon.in/dp/B0C496V772/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Lifelong Electronics 20000mAh 22.5W Fast Charging Power Bank | 3 Inputs (1 Built-in USB A Cable + 1 C + 1 Lightning Port) & 6 Outputs (3 Built-in Cables + 1 C + 2 A Port) | Small Pocket Size Powerbank",
        "price": "₹1,829",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61%2BiWpYg1gL._AC_UL320_.jpg",
        "asin": "B0D96GWQX1",
        "affiliate": "https://www.amazon.in/dp/B0D96GWQX1/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "JioTag Air for iOS (Gray) Worldwide Tracker, Pair with Apple Find My app for keys, luggage, bikes, purses etc. inside & outside Bluetooth range, No SIM/subscriptions required, 1+1 year battery, 120 dB",
        "price": "₹749",
        "rating": "3.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F316sdRiF3ML._AC_UL320_.jpg",
        "asin": "B0D59VZ1RS",
        "affiliate": "https://www.amazon.in/dp/B0D59VZ1RS/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "OnePlus Nord Buds 3r TWS Earbuds up to 54 Hours Playback, 2-mic Clear Calls, 3D Spatial Audio, AI Translation, 12.4mm Drivers, Dual-Device Connectivity, 47ms Low Latency - Aura Blue",
        "price": "₹1,950",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61nFKgi0qPL._AC_UL320_.jpg",
        "asin": "B0FMDLD86P",
        "affiliate": "https://www.amazon.in/dp/B0FMDLD86P/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Portronics Snapcase 4 60W Multifunctional Fast Charging Data Cable Transparent Kit, Conversion Set USB A & Type C to Male Micro/Type C/Lightning, Data Transfer, Sim Storage, Sim Eject Pin,Pocket Size",
        "price": "₹299",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61Qc-oqhPQL._AC_UL320_.jpg",
        "asin": "B0FB9JSJNB",
        "affiliate": "https://www.amazon.in/dp/B0FB9JSJNB/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "E GATE Atom 3X Projector 4k Ultra HD Full HD 1080p Native Automatic Home Projector for Room | 300 ISO | Rotatable Design | Android Netflix Prime | ARC-HDMI USB WiFi-6 BT Screen Mirroring Egate",
        "price": "₹7,579",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71BoB%2B5wXXL._AC_UL320_.jpg",
        "asin": "B0F6K264BY",
        "affiliate": "https://www.amazon.in/dp/B0F6K264BY/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Amazon Basics Travel Organiser for Electronic Accessories, Flexible Padded Dividers, Waterproof, Foam Padding, for Cables, Chargers, Hard Disk, Power Bank",
        "price": "₹469",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F715qEPv14EL._AC_UL320_.jpg",
        "asin": "B0C3R96SF5",
        "affiliate": "https://www.amazon.in/dp/B0C3R96SF5/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "pTron Tangent Rush w/ 50Hrs Playtime, Pristine Sound, Dual-Device Pairing, Bluetooth 5.4 Wireless in-Ear Earphones with Mic, Voice Assistant, Type-C Fast Charging & IPX5 Water Resistant (Ink Blue)",
        "price": "₹498",
        "rating": "3.6 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51u6yMIZTbL._AC_UL320_.jpg",
        "asin": "B0FZC523RD",
        "affiliate": "https://www.amazon.in/dp/B0FZC523RD/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "Samsung Original 25W USB Type-C Travel Adaptor Without Cable for Google Pixel, Xiaomi, Motorola, iPhone, Samsung Galaxy Tab S/A Series, Galaxy S10/M54/M55/A80/A90/S25/S24, White",
        "price": "₹770",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F512UVkoMMEL._AC_UL320_.jpg",
        "asin": "B0D2R2MXXJ",
        "affiliate": "https://www.amazon.in/dp/B0D2R2MXXJ/?tag=primeoffers02-21",
        "category": "Electronics",
        "region": "india"
    },
    {
        "title": "\"Glow and Lovely Renew Bright Multivitamin Serum in Cream | Vitamins B,C and E | Renews Skin cells |Bright and Healthy Skin | Clinically proven formula is dermatologically tested | 80g \"",
        "price": "₹199",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51Ixxq9NkkL._AC_UL320_.jpg",
        "asin": "B08H2ZG4JF",
        "affiliate": "https://www.amazon.in/dp/B08H2ZG4JF/?tag=primeoffers02-21",
        "category": "Beauty",
        "region": "india",
        "audience": "men"
    },
    {
        "title": "BoroPlus Ayurvedic Antiseptic Cream with 10 super herbs |24 hrs Moisturisation |Glowing Skin|For Face, Hand & Body | Heals and Protects the skin|120ml",
        "price": "₹146",
        "rating": "4.5 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F518l8rweMrL._AC_UL320_.jpg",
        "asin": "B07F7DHFS7",
        "affiliate": "https://www.amazon.in/dp/B07F7DHFS7/?tag=primeoffers02-21",
        "category": "Beauty",
        "region": "india",
        "audience": "men"
    },
    {
        "title": "Muuchstac Ocean Face Wash for Men | Fight Acne & Pimples, Brighten Skin, Clears Dirt, Oil Control, Refreshing Feel - Multi-Action Formula (100 ml)",
        "price": "₹150",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51FodsevJrL._AC_UL320_.jpg",
        "asin": "B07KB1Y75J",
        "affiliate": "https://www.amazon.in/dp/B07KB1Y75J/?tag=primeoffers02-21",
        "category": "Beauty",
        "region": "india",
        "audience": "men"
    },
    {
        "title": "Glow and Lovely Renew Bright Multivitamin Serum in Cream | Vitamins B,C and E | Renews Skin cells |Bright and Healthy Skin | Clinically proven formula is dermatologically tested 110g",
        "price": "₹265",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51Ixxq9NkkL._AC_UL320_.jpg",
        "asin": "B08H2Y91P1",
        "affiliate": "https://www.amazon.in/dp/B08H2Y91P1/?tag=primeoffers02-21",
        "category": "Beauty",
        "region": "india",
        "audience": "men"
    },
    {
        "title": "Philips QP210/51 Oneblade Replaceable Blade (Lime)",
        "price": "₹799",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F719dXSwlCdL._AC_UL320_.jpg",
        "asin": "B07NGM233W",
        "affiliate": "https://www.amazon.in/dp/B07NGM233W/?tag=primeoffers02-21",
        "category": "Beauty",
        "region": "india",
        "audience": "men"
    },
    {
        "title": "Garnier Skin Naturals Bright Complete Vitamin C Serum UV Cream, Vitamin C Day Cream for Sun Protection and Skin Brightening - Suitable For all Skin Types, 45g",
        "price": "₹179",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71nUe95xR1L._AC_UL320_.jpg",
        "asin": "B07DL94CPX",
        "affiliate": "https://www.amazon.in/dp/B07DL94CPX/?tag=primeoffers02-21",
        "category": "Beauty",
        "region": "india",
        "audience": "men"
    },
    {
        "title": "Dove Beauty Moisture Conditioning Face Wash Cleanser 50 ML",
        "price": "₹163",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F41Y5AEVyv0L._AC_UL320_.jpg",
        "asin": "B06WRNV9W5",
        "affiliate": "https://www.amazon.in/dp/B06WRNV9W5/?tag=primeoffers02-21",
        "category": "Beauty",
        "region": "india",
        "audience": "men"
    },
    {
        "title": "Gillette Mach 3, Shaving Razor For Men | Most Comfortable Shave | 3D Blade Technology | Metal Handle For Superior Grip",
        "price": "₹275",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61o8Ikd2qrL._AC_UL320_.jpg",
        "asin": "B019ORGD8M",
        "affiliate": "https://www.amazon.in/dp/B019ORGD8M/?tag=primeoffers02-21",
        "category": "Beauty",
        "region": "india",
        "audience": "men"
    },
    {
        "title": "NIVEA Aloe Hydration Body Lotion, 400ml | 72H Moisturization | With Deep Moisture Serum & 100% Natural Aloe Vera Extracts | All Skin Types",
        "price": "₹253",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51ffS7Hy7wL._AC_UL320_.jpg",
        "asin": "B079KGC4NZ",
        "affiliate": "https://www.amazon.in/dp/B079KGC4NZ/?tag=primeoffers02-21",
        "category": "Beauty",
        "region": "india",
        "audience": "men"
    },
    {
        "title": "Smart And Handsome Long Lasting Radiance Cream I 2X Spot Reduction I 7 Hrs Brighter Look I Pro-Peptide I Face Cream for Men I 60g",
        "price": "₹132",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F515gnUuTknL._AC_UL320_.jpg",
        "asin": "B01BD5EO2U",
        "affiliate": "https://www.amazon.in/dp/B01BD5EO2U/?tag=primeoffers02-21",
        "category": "Beauty",
        "region": "india",
        "audience": "men"
    },
    {
        "title": "Himalaya Tan Removal Orange Face Wash, 100ml",
        "price": "₹149",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71MwmlO5duL._AC_UL320_.jpg",
        "asin": "B072QLJZ1B",
        "affiliate": "https://www.amazon.in/dp/B072QLJZ1B/?tag=primeoffers02-21",
        "category": "Beauty",
        "region": "india",
        "audience": "men"
    },
    {
        "title": "Olay Cream Natural Aura Vitamin B3, Pro B5, E With Uv Protection,40 Gm",
        "price": "₹163",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61j7D9v5-ML._AC_UL320_.jpg",
        "asin": "B00DRE6DM0",
        "affiliate": "https://www.amazon.in/dp/B00DRE6DM0/?tag=primeoffers02-21",
        "category": "Beauty",
        "region": "india",
        "audience": "men"
    },
    {
        "title": "MARS Edge of Desire Lip Liner | One Swipe Smooth Application | Long Lasting Lip Pencil (1.4gm) (03-BLOOD BATH)",
        "price": "₹68",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61K1KjkHEBL._AC_UL320_.jpg",
        "asin": "B0C9MVCV9Z",
        "affiliate": "https://www.amazon.in/dp/B0C9MVCV9Z/?tag=primeoffers02-21",
        "category": "Beauty",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "NIVEA Pearl and Beauty 50ml Deo Underarm Roll On | With Pearl Extracts & Avocado Oil | 72 H Long Lasting Floral Scent | 0% Alcohol and Dermat Approved | For Women",
        "price": "₹160",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F31Ip4aURUpL.png",
        "asin": "B006LXDVTM",
        "affiliate": "https://www.amazon.in/dp/B006LXDVTM/?tag=primeoffers02-21",
        "category": "Beauty",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "Gleva 4Pcs Makeup Blender Sponge Set, Soft Egg Shaped Blending Puff For Flawles Makeup, Blender for Liquid Foundation, Cream, Powder, Wet And Dry Makeup Applicator For Girls, Women (Pink)",
        "price": "₹149",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51EdSBwUm5L._AC_UL320_.jpg",
        "asin": "B0DCK7P5X1",
        "affiliate": "https://www.amazon.in/dp/B0DCK7P5X1/?tag=primeoffers02-21",
        "category": "Beauty",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "L'Oreal Paris Fresh Hyaluron Moisture 72HR Moisture Sealing Conditioner Powered By Hyaluronic Acid, For Frizz-Free, Hydrated And Bouncy Hair Full Of Life For All Hair Types | 175 Millilitres",
        "price": "₹261",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F31Ip4aURUpL.png",
        "asin": "B0B6Y3FNV7",
        "affiliate": "https://www.amazon.in/dp/B0B6Y3FNV7/?tag=primeoffers02-21",
        "category": "Beauty",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "BiE Superpower - Eternal Youth Cream | Anti-Aging Cream with Squalane, Almond Oil & Ginseng Stem Cells | Reduces Wrinkles & Fine Lines | Unisex | For All Skin Types | 50gm",
        "price": "₹2,999",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51Tapc21LWL._AC_UL320_.jpg",
        "asin": "B0BRJH8HLL",
        "affiliate": "https://www.amazon.in/dp/B0BRJH8HLL/?tag=primeoffers02-21",
        "category": "Beauty",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "Beauty of Joseon Relief Sun Aqua-fresh Rice + B5, SPF 50+ PA++++ Sun Cream, Moisturizing & Calming Formula, Korean Skincare, 50ml",
        "price": "₹1,275",
        "rating": "4.6 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F518ZII9nOxL._AC_UL320_.jpg",
        "asin": "B0DFMGBZ9Z",
        "affiliate": "https://www.amazon.in/dp/B0DFMGBZ9Z/?tag=primeoffers02-21",
        "category": "Beauty",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "Maybelline New York Kajal, Black, Matte Finish",
        "price": "₹187",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F31Ip4aURUpL.png",
        "asin": "B06WGZP21B",
        "affiliate": "https://www.amazon.in/dp/B06WGZP21B/?tag=primeoffers02-21",
        "category": "Beauty",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "Cetaphil Gentle Skin Hydrating Face Wash 118ml, Paraben Free, Sulphate-Free Gentle Skin Hydrating Cleanser with Niacinamide, Vitamin B5 for Dry to Normal, Sensitive Skin",
        "price": "₹377",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61Ti2uv6V3L._AC_UL320_.jpg",
        "asin": "B01CCGW4OE",
        "affiliate": "https://www.amazon.in/dp/B01CCGW4OE/?tag=primeoffers02-21",
        "category": "Beauty",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "Swiss Beauty Jelly Verse Eyeshadow Glow Stick | Rich Colour Payoff | Crease-Proof | Sparkling Shine | 6 Stellar Shades | Shade- 1. Star Shower, 3g",
        "price": "₹426",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61n%2BrAl01vL._AC_UL320_.jpg",
        "asin": "B0FVM8JN3P",
        "affiliate": "https://www.amazon.in/dp/B0FVM8JN3P/?tag=primeoffers02-21",
        "category": "Beauty",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "NICONI Tan Vanish Gluta-Kojic Skin Polish | Instant Tan Removal & Glow | Infused with Kojic Acid & Glutathione | Ideal for All Skin Types | Lightens Suntan | 180g",
        "price": "₹1,396",
        "rating": "3.8 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51l44UDSZSL._AC_UL640_QL65_.jpg",
        "asin": "B0F1TDDNGD",
        "affiliate": "https://www.amazon.in/dp/B0F1TDDNGD/?tag=primeoffers02-21",
        "category": "Beauty",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "POND'S Bright Beauty Spot Less Fairness Face Wash|| Removes Dead Skin And Dark Spots|| 200 g",
        "price": "₹228",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F512dChFNuXL._AC_UL320_.jpg",
        "asin": "B08NYD1GGK",
        "affiliate": "https://www.amazon.in/dp/B08NYD1GGK/?tag=primeoffers02-21",
        "category": "Beauty",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "Swiss Beauty Long lasting Misty Finish Professional Makeup Fixer Spray for Face makeup | With Aloe Vera and Vitamin- E | Light weight, quick dry makeup Setting spray |70 ML|",
        "price": "₹214",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61yLwQTM2SS._AC_UL320_.jpg",
        "asin": "B07SR3WV5N",
        "affiliate": "https://www.amazon.in/dp/B07SR3WV5N/?tag=primeoffers02-21",
        "category": "Beauty",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "LAKMÉ Eyeconic Black Kajal 0.35 g (Combo Pack of 2) Matte Kohl Liner in a Twist Up Pencil - Waterproof|| Smudge Proof & Long Lasting Eye Makeup",
        "price": "₹214",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61as79PTNHL._AC_UL320_.jpg",
        "asin": "B09L7QWYC3",
        "affiliate": "https://www.amazon.in/dp/B09L7QWYC3/?tag=primeoffers02-21",
        "category": "Beauty",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "Multi-Shape Makeup Sponge Set | 20 Piece Beauty Puff Collection with Headband and Clean Sponge | Pink, Purple, Beige & Bright Sets | Face Blender Kit for Cream, Liquid & Powder | Aesthetic and Functional Makeup Tool (Brown, 20Pcs)",
        "price": "₹299",
        "rating": "4.5 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81cn5ubXbHL._AC_UL320_.jpg",
        "asin": "B0F8JD36CQ",
        "affiliate": "https://www.amazon.in/dp/B0F8JD36CQ/?tag=primeoffers02-21",
        "category": "Beauty",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "Swiss Beauty Awaken Eyeshadow Palette | Matte + Shimmer Finish | Long-Lasting | Blendable | Shade- 1. Blooming Rose, 11g",
        "price": "₹314",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61CE8TnEDqL._AC_UL320_.jpg",
        "asin": "B0FYQ7L8PK",
        "affiliate": "https://www.amazon.in/dp/B0FYQ7L8PK/?tag=primeoffers02-21",
        "category": "Beauty",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "Beauty of Joseon Revive Eye Serum with Ginseng & Retinal (30m) | Anti-Aging, Wrinkle Care, Korean Eye Cream for Dark Circles & Fine Lines",
        "price": "₹1,207",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51jLIIpp2lL._AC_UL320_.jpg",
        "asin": "B0B45LL4DD",
        "affiliate": "https://www.amazon.in/dp/B0B45LL4DD/?tag=primeoffers02-21",
        "category": "Beauty",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "Beauty of Joseon Relief Sun Rice + Probiotics 50 ml SPF 50+ PA++++ Lightweight Korean Sunscreen for Oily Skin",
        "price": "₹1,275",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61DA-VH24GL._AC_UL320_.jpg",
        "asin": "B09JVNZVH3",
        "affiliate": "https://www.amazon.in/dp/B09JVNZVH3/?tag=primeoffers02-21",
        "category": "Beauty",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "13 Pcs Make up Brushes Set, Foundation Powder Concealer Eyeshadow Blush Highlighter Eyebrow Brush Make up Brush Set, Travel Makeup Brushes with Cloth Bag for Beginner and Make up Artist (Green)",
        "price": "₹179",
        "rating": "3.6 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61xj0G7cnLL._AC_UL320_.jpg",
        "asin": "B0F1LKMWF9",
        "affiliate": "https://www.amazon.in/dp/B0F1LKMWF9/?tag=primeoffers02-21",
        "category": "Beauty",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "Aroma Magic 7 step Bridal Glow Facial Kit| Enhance Natural glow + Dazzling radiance & Revitalises | with Turmeric & Rose Extracts| All Skin type| Single Use| Pack of 1 (20g + 18ml)",
        "price": "₹144",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51JYXsFmuDL._AC_UL320_.jpg",
        "asin": "B08FCSBJPS",
        "affiliate": "https://www.amazon.in/dp/B08FCSBJPS/?tag=primeoffers02-21",
        "category": "Beauty",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "Love Beauty & Planet Argan Oil and Lavender Sulfate Free Smooth and Serene Shampoo|| No Parabens|| No Dyes|| 400ml",
        "price": "₹408",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51HCJolKonL._AC_UL320_.jpg",
        "asin": "B07YSY6S6F",
        "affiliate": "https://www.amazon.in/dp/B07YSY6S6F/?tag=primeoffers02-21",
        "category": "Beauty",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "Cosrx Advanced Snail 96 Mucin Power Essence (100ml)",
        "price": "₹1,065",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F416kUGx2rQL._AC_UL320_.jpg",
        "asin": "B00PBX3L7K",
        "affiliate": "https://www.amazon.in/dp/B00PBX3L7K/?tag=primeoffers02-21",
        "category": "Beauty",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "Swiss Beauty Bold Matt Lip Liner | Set of 12 | Long-lasting |Matte Finish | Non-drying, 19.2gm",
        "price": "₹621",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61D5PnuVl2L._AC_UL320_.jpg",
        "asin": "B07Y3F85BV",
        "affiliate": "https://www.amazon.in/dp/B07Y3F85BV/?tag=primeoffers02-21",
        "category": "Beauty",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "Swiss Beauty Lustre Eyeshadow Palette | 4 Highly Pigmented Shades in Matte & Shine |Long-Lasting | All Skin Types | Shade- Rose n Petals, 5gm",
        "price": "₹216",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61HycKa-csL._AC_UL320_.jpg",
        "asin": "B0C6XX4421",
        "affiliate": "https://www.amazon.in/dp/B0C6XX4421/?tag=primeoffers02-21",
        "category": "Beauty",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "FACES CANADA Strobe Cream Mini- Rose Gold, 18ml | Primer + Highlighter + Moisturizer | Shea Butter & Hyaluronic Acid | Intense Hydration | Flawless Radiant Dewy Skin | Illuminating & Glowing Makeup Base",
        "price": "₹293",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51yKs%2BHlJkL._AC_UL320_.jpg",
        "asin": "B0FSQB83XJ",
        "affiliate": "https://www.amazon.in/dp/B0FSQB83XJ/?tag=primeoffers02-21",
        "category": "Beauty",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "Swiss Beauty Real Makeup Base Highlighting Primer| Skin-Hydrating Poreless Primer With Natural Glow Finish For Face Makeup |Shade - 01 Natural Tint, 32Ml",
        "price": "₹318",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F517WvzmVvpL._AC_UL320_.jpg",
        "asin": "B07WGMXX8Y",
        "affiliate": "https://www.amazon.in/dp/B07WGMXX8Y/?tag=primeoffers02-21",
        "category": "Beauty",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "Free and Fast delivery",
        "price": "₹297",
        "rating": "",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F31Ip4aURUpL.png",
        "asin": "B099QVJGCR",
        "affiliate": "https://www.amazon.in/dp/B099QVJGCR/?tag=primeoffers02-21",
        "category": "Beauty",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "Swiss Beauty Perfect Liquid Light Weight Concealer With Full Coverage |Easily Blendable Concealer For Face Makeup With Matte Finish | Shade- Medium Beige, 6g",
        "price": "₹184",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51XwTvwzT7L._AC_UL320_.jpg",
        "asin": "B07NBLWN5G",
        "affiliate": "https://www.amazon.in/dp/B07NBLWN5G/?tag=primeoffers02-21",
        "category": "Beauty",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "Beauty Garage Botoplex K9 Shampoo And Conditioner For Women | 300ml + 300ml Combo | Sulfate Phosphate Paraben Free Duo With Frizz Control | Shampoo And Conditioner For Color Maintenance",
        "price": "₹2,550",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F41sOjpwez0L._AC_UL320_.jpg",
        "asin": "B0BB1ZNC7P",
        "affiliate": "https://www.amazon.in/dp/B0BB1ZNC7P/?tag=primeoffers02-21",
        "category": "Beauty",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "SWISS BEAUTY Craze 2-N 1 Gel Semi-Matte Eyeliner With Wing Stamp | Waterproof And Smudgeproof Eyeliner With Fine Tip For Precise Application | Black, 2.8Ml",
        "price": "₹222",
        "rating": "3.9 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51lI17yYXHL._AC_UL320_.jpg",
        "asin": "B0CY5B96NC",
        "affiliate": "https://www.amazon.in/dp/B0CY5B96NC/?tag=primeoffers02-21",
        "category": "Beauty",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "Swiss Beauty Professional Face & Eye Brush Set | 6-Piece Brush Set | Soft Synthetic Bristles | Easy Blending | Flawless Application | Premium Quality | Comfortable Grip | Cream, Liquid & Powder Formulation",
        "price": "₹699",
        "rating": "4.5 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81r6KIx6YyL._AC_UL320_.jpg",
        "asin": "B08MQKXPQT",
        "affiliate": "https://www.amazon.in/dp/B08MQKXPQT/?tag=primeoffers02-21",
        "category": "Beauty",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "Dove Cream Beauty Bathing Bar 100g + 20g FREE",
        "price": "₹60",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F31Ip4aURUpL.png",
        "asin": "B008KH5FBE",
        "affiliate": "https://www.amazon.in/dp/B008KH5FBE/?tag=primeoffers02-21",
        "category": "Beauty",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "Beauty of Joseon Dynasty Cream Hydrating Face Moisturizer for Dry, Sensitive Skin, Korean Skincare for Men and Women 50ml",
        "price": "₹1,700",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51CKPzqhNLL._AC_UL320_.jpg",
        "asin": "B08WJQ3XJD",
        "affiliate": "https://www.amazon.in/dp/B08WJQ3XJD/?tag=primeoffers02-21",
        "category": "Beauty",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "Blue Heaven Saj Dhaj Festive Makeup Kit for Women | Full Face Makeup Kit Combo Set | Fair Tone | Pack of 10 | Long Lasting Beauty Makeup Gift Set for Girls | 19g + 26.3ml",
        "price": "₹299",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61WsPPt4vYL._AC_UL320_.jpg",
        "asin": "B0CG6FPKB3",
        "affiliate": "https://www.amazon.in/dp/B0CG6FPKB3/?tag=primeoffers02-21",
        "category": "Beauty",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "Beauty of Joseon Ground Rice and Honey Glow Mask for Pore and Sebum Care for Dry Sensitive Skin Korean Skin Care 150ml",
        "price": "₹1,275",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71i25DwdOEL._AC_UL320_.jpg",
        "asin": "B0D4517144",
        "affiliate": "https://www.amazon.in/dp/B0D4517144/?tag=primeoffers02-21",
        "category": "Beauty",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "Ice Roller for Face & Eyes – Cold Facial Roller for Puffy Eyes, Dark Circles & Acne | Reusable Skincare Cooling Roller for Glowing Skin | Portable Beauty Ice Roller Tool for Face & Neck (pink)",
        "price": "₹99",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61bNxB4e8DL._AC_UL320_.jpg",
        "asin": "B0GTQBN2BQ",
        "affiliate": "https://www.amazon.in/dp/B0GTQBN2BQ/?tag=primeoffers02-21",
        "category": "Beauty",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "Swiss Beauty Makeup Buddy Beauty Blender for Face Makeup | Reusable Multi-Use Sponge | Flawless & Airbrushed Finish | Soft & Blendable | Shade 02",
        "price": "₹116",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61fHYr2mYwL._AC_UL320_.jpg",
        "asin": "B09V1KXDCK",
        "affiliate": "https://www.amazon.in/dp/B09V1KXDCK/?tag=primeoffers02-21",
        "category": "Beauty",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "Maybelline New York Colossal Bold Liner - Black, smudge-proof and water-proof Long-lasting eyeliner. Maybelline New York Colossal Bold and dark eyeliner is for everyday use | 3ml",
        "price": "₹185",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F413yzxupVTL._AC_UL320_.jpg",
        "asin": "B07S141T2R",
        "affiliate": "https://www.amazon.in/dp/B07S141T2R/?tag=primeoffers02-21",
        "category": "Beauty",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "Swiss Beauty Cream It Up Blush | Highly pigmented | Super-blendable | Long-lasting | Enriched with Shea Butter | Multipurpose | Shade-03 Cheeky Peach, 10ml",
        "price": "₹222",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51k6u8kYKNL._AC_UL320_.jpg",
        "asin": "B0C6XM5LYZ",
        "affiliate": "https://www.amazon.in/dp/B0C6XM5LYZ/?tag=primeoffers02-21",
        "category": "Beauty",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "Beauty of Joseon Red Bean Pore Refreshing Mask Mud Cream Hydrating Wash Off Pack, Pore Cleansing Exfoliator, Korean Skin Care for Men and Women 140ml",
        "price": "₹1,503",
        "rating": "4.5 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71ExVUWZQEL._AC_UL320_.jpg",
        "asin": "B0BJPKX14D",
        "affiliate": "https://www.amazon.in/dp/B0BJPKX14D/?tag=primeoffers02-21",
        "category": "Beauty",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "POND'S Bright Beauty Day Cream 35 g, Non-Oily, Mattifying Daily Face Moisturizer, SPF 15 - With Niacinamide to Lighten Dark Spots for Glowing Skin",
        "price": "₹125",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51%2Bhz8BNKjL._AC_UL320_.jpg",
        "asin": "B077ND8562",
        "affiliate": "https://www.amazon.in/dp/B077ND8562/?tag=primeoffers02-21",
        "category": "Beauty",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "FACESCANADA Strobe Cream - Rose Gold, 30Ml | Primer + Highlighter + Moisturizer | Shea Butter & Hyaluronic Acid | Intense Hydration | Flawless Radiant Dewy Skin | Illuminating & Glowing Makeup Base",
        "price": "₹445",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F515W5cQZxDL._AC_UL320_.jpg",
        "asin": "B0BR585QS2",
        "affiliate": "https://www.amazon.in/dp/B0BR585QS2/?tag=primeoffers02-21",
        "category": "Beauty",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "Fae Beauty Lip Whip 12Hr Comfortable Matte Liquid Lipstick (10ml) | Waterproof | Long Wear | Non Drying | Soft Mousse Smudgeproof Formula | Vegan | With Moisture Lock Technology | Enriched with Vitamin E and Cherry Coffee - Tease",
        "price": "₹499",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F41m3ssIBvtL._AC_UL320_.jpg",
        "asin": "B0DM93H2M4",
        "affiliate": "https://www.amazon.in/dp/B0DM93H2M4/?tag=primeoffers02-21",
        "category": "Beauty",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "Beauty of Joseon Glow Serum with Propolis & Niacinamide (30ml) | Korean Face Serum for Glowing Skin, Pore Minimizing, Brightening & Hydration",
        "price": "₹1,207",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F619pJvn1MUL._AC_UL320_.jpg",
        "asin": "B086VKZZZY",
        "affiliate": "https://www.amazon.in/dp/B086VKZZZY/?tag=primeoffers02-21",
        "category": "Beauty",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "POND'S BB+ Cream|| Instant Spot Coverage + Light Make-up Glow|| Ivory 30g",
        "price": "₹211",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F31Ip4aURUpL.png",
        "asin": "B099FFNCRM",
        "affiliate": "https://www.amazon.in/dp/B099FFNCRM/?tag=primeoffers02-21",
        "category": "Beauty",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "d'alba Piedmont Italian White Truffle First Spray Serum, Vegan Skin Care, Hydrating Face Moisturizer, Glow Serum for Radiant Skin, Non Comedogenic, All In One Mist, Korean Skin Care - 100ml",
        "price": "₹1,615",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51Hyi1zkxYL._AC_UL320_.jpg",
        "asin": "B0BFQ9RD5B",
        "affiliate": "https://www.amazon.in/dp/B0BFQ9RD5B/?tag=primeoffers02-21",
        "category": "Beauty",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "Beauty of Joseon Glow Replenishing Rice Toner (150 Ml) | Hydrating & Balancing Facial Toner for Oily and Combination Skin, Korean Skincare with Rice Extract",
        "price": "₹1,275",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51tIGrBc4sL._AC_UL320_.jpg",
        "asin": "B0D44T7RW9",
        "affiliate": "https://www.amazon.in/dp/B0D44T7RW9/?tag=primeoffers02-21",
        "category": "Beauty",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "Lakme 9 to 5 CC Cream Beige with 3% Niacinamide Complex SPF 30 PA++| 9g",
        "price": "₹115",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51TjBxQilYL._AC_UL320_.jpg",
        "asin": "B01BBNF6C6",
        "affiliate": "https://www.amazon.in/dp/B01BBNF6C6/?tag=primeoffers02-21",
        "category": "Beauty",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "Garnier Vitamin C + Face Serum for Skin Brightening & Anti-Dark Spots|100X Stronger than Vit C |2% Niacinamide 0.5% Salicylic Acid/BHA |Suitable for Oily, Dry, Sensitive Skin |For Men & Women 30ml",
        "price": "₹371",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51-0Yb6kfJL._AC_UL320_.jpg",
        "asin": "B08FTQXWC7",
        "affiliate": "https://www.amazon.in/dp/B08FTQXWC7/?tag=primeoffers02-21",
        "category": "Beauty",
        "region": "india",
        "audience": "women"
    },
    {
        "title": "KLOSIA",
        "price": "₹799",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71yccLHi21L._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FRFXX2C3",
        "affiliate": "https://www.amazon.in/dp/B0FRFXX2C3/?tag=primeoffers02-21",
        "category": "Fashion",
        "region": "india"
    },
    {
        "title": "Shasmi",
        "price": "₹599",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81cIJSHLG7L._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FLK9RWQV",
        "affiliate": "https://www.amazon.in/dp/B0FLK9RWQV/?tag=primeoffers02-21",
        "category": "Fashion",
        "region": "india"
    },
    {
        "title": "DEELMO",
        "price": "₹498",
        "rating": "3.9 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F91FM6HAPPxL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FXRWCN5S",
        "affiliate": "https://www.amazon.in/dp/B0FXRWCN5S/?tag=primeoffers02-21",
        "category": "Fashion",
        "region": "india"
    },
    {
        "title": "KLOSIA",
        "price": "₹799",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F91YNRG6ttfL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FDWB8BZ5",
        "affiliate": "https://www.amazon.in/dp/B0FDWB8BZ5/?tag=primeoffers02-21",
        "category": "Fashion",
        "region": "india"
    },
    {
        "title": "Leriya Fashion",
        "price": "₹599",
        "rating": "3.8 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F91d3xRWT3lL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FVR18G2V",
        "affiliate": "https://www.amazon.in/dp/B0FVR18G2V/?tag=primeoffers02-21",
        "category": "Fashion",
        "region": "india"
    },
    {
        "title": "Prajapati fashion",
        "price": "₹339",
        "rating": "3.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61TjBft-mbL._AC_UL320_.jpg",
        "asin": "B0GRNCHNQ3",
        "affiliate": "https://www.amazon.in/dp/B0GRNCHNQ3/?tag=primeoffers02-21",
        "category": "Fashion",
        "region": "india"
    },
    {
        "title": "Shining Diva Fashion",
        "price": "₹269",
        "rating": "3.8 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71UCk9VMVrL._AC_UL320_.jpg",
        "asin": "B0C1N366XM",
        "affiliate": "https://www.amazon.in/dp/B0C1N366XM/?tag=primeoffers02-21",
        "category": "Fashion",
        "region": "india"
    },
    {
        "title": "KOTTY",
        "price": "₹499",
        "rating": "3.8 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81fcT7SVDeL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0DWJXXT3Q",
        "affiliate": "https://www.amazon.in/dp/B0DWJXXT3Q/?tag=primeoffers02-21",
        "category": "Fashion",
        "region": "india"
    },
    {
        "title": "Sun Fashion And Lifestyle",
        "price": "₹725",
        "rating": "3.9 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81pWFtlXlAL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0GCDFM8QP",
        "affiliate": "https://www.amazon.in/dp/B0GCDFM8QP/?tag=primeoffers02-21",
        "category": "Fashion",
        "region": "india"
    },
    {
        "title": "DEELMO",
        "price": "₹498",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F91WYHuNt-VL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0F4NJ2445",
        "affiliate": "https://www.amazon.in/dp/B0F4NJ2445/?tag=primeoffers02-21",
        "category": "Fashion",
        "region": "india"
    },
    {
        "title": "Lux Amore Women's High Coverage Super Combed Cotton Elastane Stretch Mid Waist Boy Shorts with Concealed Waistband and StayFresh Treatment (Colors&Print May Vary)",
        "price": "₹289",
        "rating": "3.9 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51eKEcKpeeL._AC_UL640_QL65_.jpg",
        "asin": "B0FDGT2KX1",
        "affiliate": "https://www.amazon.in/dp/B0FDGT2KX1/?tag=primeoffers02-21",
        "category": "Fashion",
        "region": "india"
    },
    {
        "title": "YouBella",
        "price": "₹217",
        "rating": "3.7 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F610kKHwQM8L._AC_UL320_.jpg",
        "asin": "B0D873HJTT",
        "affiliate": "https://www.amazon.in/dp/B0D873HJTT/?tag=primeoffers02-21",
        "category": "Fashion",
        "region": "india"
    },
    {
        "title": "AUSK",
        "price": "₹298",
        "rating": "3.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71H8BPhO1mL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0GKVFYFGZ",
        "affiliate": "https://www.amazon.in/dp/B0GKVFYFGZ/?tag=primeoffers02-21",
        "category": "Fashion",
        "region": "india"
    },
    {
        "title": "Dream Beauty Fashion",
        "price": "₹208",
        "rating": "3.9 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61jv2gGwFuL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FP9J89Z7",
        "affiliate": "https://www.amazon.in/dp/B0FP9J89Z7/?tag=primeoffers02-21",
        "category": "Fashion",
        "region": "india"
    },
    {
        "title": "Casio",
        "price": "₹1,724",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61ybeKQto8L._AC_UL320_.jpg",
        "asin": "B000GAYQJ0",
        "affiliate": "https://www.amazon.in/dp/B000GAYQJ0/?tag=primeoffers02-21",
        "category": "Fashion",
        "region": "india"
    },
    {
        "title": "Lymio",
        "price": "₹549",
        "rating": "3.6 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F91UP6o9pbrL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0DRFN3SBV",
        "affiliate": "https://www.amazon.in/dp/B0DRFN3SBV/?tag=primeoffers02-21",
        "category": "Fashion",
        "region": "india"
    },
    {
        "title": "Suppar Sleave",
        "price": "₹540",
        "rating": "3.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F813iC8RBGdL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0GHNDT6ZX",
        "affiliate": "https://www.amazon.in/dp/B0GHNDT6ZX/?tag=primeoffers02-21",
        "category": "Fashion",
        "region": "india"
    },
    {
        "title": "DEELMO",
        "price": "₹459",
        "rating": "3.9 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F91CXtpIx2WL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FXRTPR6K",
        "affiliate": "https://www.amazon.in/dp/B0FXRTPR6K/?tag=primeoffers02-21",
        "category": "Fashion",
        "region": "india"
    },
    {
        "title": "Leriya Fashion",
        "price": "₹449",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F712RBywGJYL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FSDMJZ7Y",
        "affiliate": "https://www.amazon.in/dp/B0FSDMJZ7Y/?tag=primeoffers02-21",
        "category": "Fashion",
        "region": "india"
    },
    {
        "title": "Shining Diva Fashion",
        "price": "₹299",
        "rating": "3.7 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F713ZDAwhQuL._AC_UL320_.jpg",
        "asin": "B0DYVPP86H",
        "affiliate": "https://www.amazon.in/dp/B0DYVPP86H/?tag=primeoffers02-21",
        "category": "Fashion",
        "region": "india"
    },
    {
        "title": "Leriya Fashion",
        "price": "₹899",
        "rating": "4.9 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F91JJGt1DnzL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0GC7DRZ2M",
        "affiliate": "https://www.amazon.in/dp/B0GC7DRZ2M/?tag=primeoffers02-21",
        "category": "Fashion",
        "region": "india"
    },
    {
        "title": "Shining Diva Fashion",
        "price": "₹299",
        "rating": "3.8 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71R2QnSdv%2BL._AC_UL320_.jpg",
        "asin": "B0D3DCP7JQ",
        "affiliate": "https://www.amazon.in/dp/B0D3DCP7JQ/?tag=primeoffers02-21",
        "category": "Fashion",
        "region": "india"
    },
    {
        "title": "Leriya Fashion",
        "price": "₹599",
        "rating": "3.8 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F810etBZMi6L._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0D7N1CZXC",
        "affiliate": "https://www.amazon.in/dp/B0D7N1CZXC/?tag=primeoffers02-21",
        "category": "Fashion",
        "region": "india"
    },
    {
        "title": "Nermosa",
        "price": "₹799",
        "rating": "4.5 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F91kthRY21vL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0G7189R4V",
        "affiliate": "https://www.amazon.in/dp/B0G7189R4V/?tag=primeoffers02-21",
        "category": "Fashion",
        "region": "india"
    },
    {
        "title": "Leriya Fashion",
        "price": "₹599",
        "rating": "3.9 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61lZBrFzHIL._AC_UL320_.jpg",
        "asin": "B0DGDZGWVG",
        "affiliate": "https://www.amazon.in/dp/B0DGDZGWVG/?tag=primeoffers02-21",
        "category": "Fashion",
        "region": "india"
    },
    {
        "title": "KLOSIA",
        "price": "₹699",
        "rating": "4.5 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81iFLwAOysL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0GPQCS8P6",
        "affiliate": "https://www.amazon.in/dp/B0GPQCS8P6/?tag=primeoffers02-21",
        "category": "Fashion",
        "region": "india"
    },
    {
        "title": "ANNI DESIGNER",
        "price": "₹699",
        "rating": "3.6 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81u33Nc2QAL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0F8ZR53TT",
        "affiliate": "https://www.amazon.in/dp/B0F8ZR53TT/?tag=primeoffers02-21",
        "category": "Fashion",
        "region": "india"
    },
    {
        "title": "ANNI DESIGNER",
        "price": "₹499",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81nDTCdUwKL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0G4964K8M",
        "affiliate": "https://www.amazon.in/dp/B0G4964K8M/?tag=primeoffers02-21",
        "category": "Fashion",
        "region": "india"
    },
    {
        "title": "Nermosa",
        "price": "₹799",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81iqCtRWVnL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0DY1T6RPL",
        "affiliate": "https://www.amazon.in/dp/B0DY1T6RPL/?tag=primeoffers02-21",
        "category": "Fashion",
        "region": "india"
    },
    {
        "title": "Sirona",
        "price": "₹169",
        "rating": "3.9 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61wJEFn8A0L._AC_UL320_.jpg",
        "asin": "B0B82MHB5C",
        "affiliate": "https://www.amazon.in/dp/B0B82MHB5C/?tag=primeoffers02-21",
        "category": "Fashion",
        "region": "india"
    },
    {
        "title": "ANNI DESIGNER",
        "price": "₹589",
        "rating": "3.7 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F91skL0oq8xL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FJY1KWLN",
        "affiliate": "https://www.amazon.in/dp/B0FJY1KWLN/?tag=primeoffers02-21",
        "category": "Fashion",
        "region": "india"
    },
    {
        "title": "Allen Solly",
        "price": "₹699",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F91Pt9K991OL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B06Y2FG6R7",
        "affiliate": "https://www.amazon.in/dp/B06Y2FG6R7/?tag=primeoffers02-21",
        "category": "Fashion",
        "region": "india"
    },
    {
        "title": "Nermosa",
        "price": "₹799",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F91vc8GyeNJL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0G1HVLPX9",
        "affiliate": "https://www.amazon.in/dp/B0G1HVLPX9/?tag=primeoffers02-21",
        "category": "Fashion",
        "region": "india"
    },
    {
        "title": "Lymio",
        "price": "₹749",
        "rating": "3.5 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F91w3qFQBa1L._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0DRFNDSNX",
        "affiliate": "https://www.amazon.in/dp/B0DRFNDSNX/?tag=primeoffers02-21",
        "category": "Fashion",
        "region": "india"
    },
    {
        "title": "Shining Diva Fashion",
        "price": "₹299",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71cFz1Nv55L._AC_UL320_.jpg",
        "asin": "B0DZNX1R5W",
        "affiliate": "https://www.amazon.in/dp/B0DZNX1R5W/?tag=primeoffers02-21",
        "category": "Fashion",
        "region": "india"
    },
    {
        "title": "DEELMO",
        "price": "₹488",
        "rating": "3.6 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F91g-GJCo2WL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0CNM4R13B",
        "affiliate": "https://www.amazon.in/dp/B0CNM4R13B/?tag=primeoffers02-21",
        "category": "Fashion",
        "region": "india"
    },
    {
        "title": "JAAR FASHION",
        "price": "₹485",
        "rating": "4.6 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F91liASEtMTL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0GPQMRCT9",
        "affiliate": "https://www.amazon.in/dp/B0GPQMRCT9/?tag=primeoffers02-21",
        "category": "Fashion",
        "region": "india"
    },
    {
        "title": "Shining Diva Fashion",
        "price": "₹199",
        "rating": "3.7 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61dK8fy1dRL._AC_UL320_.jpg",
        "asin": "B0BX62B58N",
        "affiliate": "https://www.amazon.in/dp/B0BX62B58N/?tag=primeoffers02-21",
        "category": "Fashion",
        "region": "india"
    },
    {
        "title": "Dream Beauty Fashion",
        "price": "₹208",
        "rating": "3.9 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F611CfMeu3lL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FP9HV7GL",
        "affiliate": "https://www.amazon.in/dp/B0FP9HV7GL/?tag=primeoffers02-21",
        "category": "Fashion",
        "region": "india"
    },
    {
        "title": "Fashion Dream",
        "price": "₹299",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F91g9wLXcE0L._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FQJXGSXM",
        "affiliate": "https://www.amazon.in/dp/B0FQJXGSXM/?tag=primeoffers02-21",
        "category": "Fashion",
        "region": "india"
    },
    {
        "title": "Leriya Fashion",
        "price": "₹499",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F91IZ1hG6TwL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0G4S3LXB5",
        "affiliate": "https://www.amazon.in/dp/B0G4S3LXB5/?tag=primeoffers02-21",
        "category": "Fashion",
        "region": "india"
    },
    {
        "title": "Leriya Fashion",
        "price": "₹565",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81jp9EMlz%2BL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0F9T173L3",
        "affiliate": "https://www.amazon.in/dp/B0F9T173L3/?tag=primeoffers02-21",
        "category": "Fashion",
        "region": "india"
    },
    {
        "title": "Nautiful",
        "price": "₹664",
        "rating": "3.7 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F91kLDP8ShpL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0GY55GPYH",
        "affiliate": "https://www.amazon.in/dp/B0GY55GPYH/?tag=primeoffers02-21",
        "category": "Fashion",
        "region": "india"
    },
    {
        "title": "Leriya Fashion",
        "price": "₹449",
        "rating": "3.7 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F91LQMYr%2BpaL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0CT3J532T",
        "affiliate": "https://www.amazon.in/dp/B0CT3J532T/?tag=primeoffers02-21",
        "category": "Fashion",
        "region": "india"
    },
    {
        "title": "Shining Diva Fashion",
        "price": "₹299",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F51zqJUDBnWL._AC_UL320_.jpg",
        "asin": "B0CNH38J1K",
        "affiliate": "https://www.amazon.in/dp/B0CNH38J1K/?tag=primeoffers02-21",
        "category": "Fashion",
        "region": "india"
    },
    {
        "title": "Xomantic Fashion",
        "price": "₹1,139",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81WmE6azovL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0G34LKX3C",
        "affiliate": "https://www.amazon.in/dp/B0G34LKX3C/?tag=primeoffers02-21",
        "category": "Fashion",
        "region": "india"
    },
    {
        "title": "ANNI DESIGNER",
        "price": "₹499",
        "rating": "3.9 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81wmD1A-f3L._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0FHJNF4MT",
        "affiliate": "https://www.amazon.in/dp/B0FHJNF4MT/?tag=primeoffers02-21",
        "category": "Fashion",
        "region": "india"
    },
    {
        "title": "PRAYAARI FASHIONS",
        "price": "₹279",
        "rating": "5.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61w8yzuAYOL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0GVG1P7PG",
        "affiliate": "https://www.amazon.in/dp/B0GVG1P7PG/?tag=primeoffers02-21",
        "category": "Fashion",
        "region": "india"
    },
    {
        "title": "Urbano Fashion",
        "price": "₹749",
        "rating": "3.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F81CrWOcFDDL._AC_UL320_FMwebp_QL65_.jpg",
        "asin": "B0F5WDCNNK",
        "affiliate": "https://www.amazon.in/dp/B0F5WDCNNK/?tag=primeoffers02-21",
        "category": "Fashion",
        "region": "india"
    },
    {
        "title": "Amazon Brand - Presto! Garbage Bags | Medium | 180 Count | 30 Bags X 6 Rolls | 19 X 21 Inches | For Dry & Wet Waste | Black",
        "price": "₹355",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F61fn1xtHO4L._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0821PN8L4",
        "affiliate": "https://www.amazon.in/dp/B0821PN8L4/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Ezee Live Life Ezee Way Black Garbage Bags for Dustbin|90 Pcs|Medium 19 X 21 Inches|30 Pcs X Pack of 3, 3 count",
        "price": "₹159",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F71erHCKJ3WL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B06VX8YR6Q",
        "affiliate": "https://www.amazon.in/dp/B06VX8YR6Q/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "JIALTO 20 Pcs Self Adhesive Hooks for Secure Wall Hanging - Versatile 6mm Nail Hook for Photo Frames Hooks, Clocks, and More - Transparent, Heavy-Duty, No-Drill Solution",
        "price": "₹149",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F61dhl%2BOHAhL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0CMTZ92DC",
        "affiliate": "https://www.amazon.in/dp/B0CMTZ92DC/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Go24 pexpo Water Bottle 1 ltr Stainless Steel Sports/Fridge Bottle with Sipper Cap | 1-Year Warranty | Single Wall | For Home, Office, Gym | Lightweight | Craft Pro 950ml | Grey - Black Ombre",
        "price": "₹299",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F71Jd57CzPBL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0DRCT1MTK",
        "affiliate": "https://www.amazon.in/dp/B0DRCT1MTK/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "ATOM ALISTON K1 Series Digital Kitchen Weighing Scale 10 kg, Electronic Weight Machine with LCD Display for Baking, Cooking, Food & Diet, SF-400/A121. 6Months Warranty (Colour May Vary)",
        "price": "₹249",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F71775fRr%2BgL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B083C6XMKQ",
        "affiliate": "https://www.amazon.in/dp/B083C6XMKQ/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "MICROTEK EM4160 Automatic Voltage Digital Display Wall Mounted Stabilizer (160V-285V) for AC Air Conditioner Upto 1.5 Ton (Metallic Grey)",
        "price": "₹2,269",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F61sVH4hfjML._AC_UL600_SR600%2C400_.jpg",
        "asin": "B075HH96CH",
        "affiliate": "https://www.amazon.in/dp/B075HH96CH/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "NutriPro Juicer Mixer Grinder - Smoothie Maker - 500 Watts (2 Jars & 1 Blade, Silver) - 2 Year Warranty",
        "price": "₹1,599",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F71rH4vEE4nL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B09J2T124D",
        "affiliate": "https://www.amazon.in/dp/B09J2T124D/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "MILTON Comet 1000 Stainless Steel Water Bottle 1000 ml, Single Walled, ISI Certified I Leak Proof Lid, Rust Proof I For School, Office, Gym I Black",
        "price": "₹299",
        "rating": "3.9 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F61K8wOHMIXL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0CXNSCCVW",
        "affiliate": "https://www.amazon.in/dp/B0CXNSCCVW/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Trance 100% Waterproof Premium Mattress Protector for Double Bed King Size 78x72 Inches | Cotton Feel Mattresses Cover | Elastic Fitted | Fits Upto 10 Inch | Bed Protector Cover (78\"x72\" King Grey)",
        "price": "₹625",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F61Mx6KEz3QL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B01A57IV58",
        "affiliate": "https://www.amazon.in/dp/B01A57IV58/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Amazon Brand - Presto! Garbage Bags | Large | 90 Count | 15 Bags X 6 Rolls | 24 X 32 Inches | For Dry & Wet Waste | Black",
        "price": "₹355",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F61fn1xtHO4L._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0821PYKVK",
        "affiliate": "https://www.amazon.in/dp/B0821PYKVK/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Bajaj Pygmy Go 178MM Mini Fan with LED Lighting | Rechargeable | USB Charging | 4-hours Battery Backup | 3 Speed | 2-Light Brightness Setting | High Speed | Portable【Blue】",
        "price": "₹1,549",
        "rating": "3.9 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F71LTc2cd3GL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0C3XNCTDX",
        "affiliate": "https://www.amazon.in/dp/B0C3XNCTDX/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "One94Store Astronaut Galaxy Projector Night Light – 360° Rotating Nebula Star Projector with Remote Control, Timer & Adjustable Head – Space Lamp for Kids’ Bedroom, Gifts, Gaming Room, Home & Décor",
        "price": "₹699",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F81r6tIbS1cL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0DN1RWNSQ",
        "affiliate": "https://www.amazon.in/dp/B0DN1RWNSQ/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Milton Aura 1000 Thermosteel Water Bottle, 24 Hr Hot and Cold I Leak Proof Lid, ISI Certified I Vacuum Insulated I for Office, Gym, School I Dark Blue",
        "price": "₹870",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F61SHImx3ixL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0B4RZ3XNP",
        "affiliate": "https://www.amazon.in/dp/B0B4RZ3XNP/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Zulaxy Photo Frame Hooks for Wall Without Drilling, 10 Pack Self Adhesive Hooks for Wall Heavy Duty Strong Nail Free for Hanging Photo Frame (Hanging Hook, Transparent) Stainless Steel",
        "price": "₹269",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F61WnmpLwAQL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0CCM8L54V",
        "affiliate": "https://www.amazon.in/dp/B0CCM8L54V/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Homestrap Set of 6 Non-Woven Printed Saree Cover/Cloth Storage/Wardrobe Organizer For Clothes with Transparent Window (Grey)(Shark Tank Featured) 45cmx33cmx22cm",
        "price": "₹339",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F71zjvUApaRL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B08LQRXXNB",
        "affiliate": "https://www.amazon.in/dp/B08LQRXXNB/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Raxon Innovation (39 Inches, Pack of 5) PVC Door Guard Gap Filler for Door Bottom Seal Strip - Sound-Proof, Reduce Noise, Energy Saving Door Stopper for Reduce Door Dust, Door Guard for Home",
        "price": "₹188",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F61ejfP6n1KL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0983PRR2Z",
        "affiliate": "https://www.amazon.in/dp/B0983PRR2Z/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Prestige PIC 20 1600 Watts Induction Cooktop | 4KV Surge Protection | 8 Preset Indian Menu Options & Timer | Soft Touch Button | Easy to Clean | Portable | Black | 1Y Warranty | BIS",
        "price": "₹2,950",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F71%2B18JpxhOL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B00YMJ0OI8",
        "affiliate": "https://www.amazon.in/dp/B00YMJ0OI8/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Robustt Heavy Duty AC stand | Rust Proof Iron Air Conditioner Outdoor Unit Mounting Bracket, Supports upto 200kg weight | Air Conditioner Stand Comes with Necessary Wall Fittings - Pack of 1",
        "price": "₹449",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F61wn%2B%2BdqhEL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0DX77JM71",
        "affiliate": "https://www.amazon.in/dp/B0DX77JM71/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "GADDA CO 100% Waterproof Premium Cotton Feel Mattress Protector King Size 78x72 Inch|Ultra Soft Breathable & Fitted Bed Protector Terry Cover Double Bed (6.5x6 feet, Fits 10 Inches, Grey)",
        "price": "₹599",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F71yu3d1QjjL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B09VL787WJ",
        "affiliate": "https://www.amazon.in/dp/B09VL787WJ/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "atomberg Renesa Enzel 1200mm BLDC Ceiling Fan with Remote | 5 star | Advance Air+ Technology | LED Speed Indicator | Low Noise | Sleek Design | Power Saving | 3 Year Warranty | Gloss White",
        "price": "₹3,749",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F51m%2BI%2BvzJEL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0CHJNJJDP",
        "affiliate": "https://www.amazon.in/dp/B0CHJNJJDP/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Bajaj PX 97 Torque New 36L Personal Air Cooler For Room|Honeycomb Cooling Pads|High-Speed |30Ft Powerful Air Throw|3-Speed Control|Portable Cooler-Home|3 Year Comprehensive Product Warranty|White",
        "price": "₹5,399",
        "rating": "3.6 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F61Juyv14Y0L._AC_UL600_SR600%2C400_.jpg",
        "asin": "B09R3QNGW5",
        "affiliate": "https://www.amazon.in/dp/B09R3QNGW5/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Pigeon Polypropylene Mini Handy and Compact Chopper with 3 Blades for Effortlessly Chopping Vegetables and Fruits for Your Kitchen (12420, Green, 400 ml)",
        "price": "₹183",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F51RXzjrUmkL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B01LWYDEQ7",
        "affiliate": "https://www.amazon.in/dp/B01LWYDEQ7/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "WARMEO MICROMATE Microwave-Safe Stainless Steel Lunch Box, Bpa Free, Perfect for Office, School, Travelling, Combo(800ml+150 ml),Green",
        "price": "₹499",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F61dcjkw9fjL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0FPXKMT65",
        "affiliate": "https://www.amazon.in/dp/B0FPXKMT65/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Daikin 1.5 Ton 3 Star, New Star rated, Inverter Split AC (Copper, PM2.5 Filter, MTKL50XV16, White)",
        "price": "₹37,490",
        "rating": "3.7 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F61aNUgUz6EL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0GRV2DWP3",
        "affiliate": "https://www.amazon.in/dp/B0GRV2DWP3/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "SATVIKAYA Air Tight Plastic Storage Containers Set for Kitchen | Pantry Organizers Kitchen Accessories Items,Fridge Storage Boxes | Leak-Proof, Durable, and Space-Saving (4, 2500ml) (1200 ML, 6)",
        "price": "₹389",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F714THosaxdL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0DVLBTKPH",
        "affiliate": "https://www.amazon.in/dp/B0DVLBTKPH/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Go24 pexpo Insulated Water Bottle 1 LTR, Stainless Steel Leak Proof Flask, 24 Hours Hot & Cold, BPA Free Bottle for Gym, Office, Travel, 2-Year Warranty |Bravo 1000| Military Green",
        "price": "₹699",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F71PBOQE7ivL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0CLXVWX25",
        "affiliate": "https://www.amazon.in/dp/B0CLXVWX25/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "DALUCI Self Adhesive Wall Hooks - 20 Pcs Heavy Duty Wall Hooks for Hanging | Nail Free Sticky Hooks for Wall Heavy Items Without Drilling, Transparent Wall Hanger Hook (Flower Hook, 20)",
        "price": "₹170",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F61GkkM%2BS6lL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0D8PQQQ6G",
        "affiliate": "https://www.amazon.in/dp/B0D8PQQQ6G/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "AmazonBasics Mild Steel Cloth Drying Stand - 3 Way Folding, 42 Feet Drying Length, 20 Drying Rails, Lightweight (Silver)",
        "price": "₹1,329",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F71vkps3XMVL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0FWRLQND8",
        "affiliate": "https://www.amazon.in/dp/B0FWRLQND8/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "AGARO Elite Rechargeable Mini Electric Chopper, Food Grade Bowl, Stainless Steel Blades, Rechargeable, One Touch Operation, for Chopping Garlic, Ginger, Onion, Vegetable, Nuts, 250 Ml, Black",
        "price": "₹599",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F71JxqRoEC9L._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0C897PVVM",
        "affiliate": "https://www.amazon.in/dp/B0C897PVVM/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Nova Milk Frother Rechargable Coffee Frother Milk & Beater for Cold Latte 2In1 Handheld Battery-Powered Blender and Egg Whisker | 1 Year Warranty Free Frothy Recipe E-Book (Whisker), Black",
        "price": "₹301",
        "rating": "4.6 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F71TD7nkRWtL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0F8HJJVW1",
        "affiliate": "https://www.amazon.in/dp/B0F8HJJVW1/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Godrej aer Spray | Room Freshener for Home & Office - Cool Aqua (200 ml) | Long-Lasting Fragrance",
        "price": "₹85",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F612dwuTHwSL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B00OHNGJ2Y",
        "affiliate": "https://www.amazon.in/dp/B00OHNGJ2Y/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "amazon basics Electric Egg Boiler | 350 Watt | Boils Upto 7 Eggs | Automatic Operation, 3 Boiling Modes | Overheat Protection | Stainless Steel Heating Plate, Measuring Cup | 75ml | Plastic | White",
        "price": "₹419",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F71p1L3X-ViL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0BT1M24FN",
        "affiliate": "https://www.amazon.in/dp/B0BT1M24FN/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "V-Guard VG 400 for 1.5 Ton A.C (170V to 270V) Original 3 Year onsite wrranty,GREY",
        "price": "₹1,999",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F31xRPjdBD3L._AC_UL600_SR600%2C400_.jpg",
        "asin": "B089YC1QMD",
        "affiliate": "https://www.amazon.in/dp/B089YC1QMD/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "amazon basics Vacuum Compression Storage Bags with Hand Pump - Medium, 5-Pack",
        "price": "₹499",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F71qEqnkZg8L._AC_UL600_SR600%2C400_.jpg",
        "asin": "B07RTJV6G4",
        "affiliate": "https://www.amazon.in/dp/B07RTJV6G4/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Amazon Brand - Presto! Garbage Bags | Small | 180 Count | 30 Bags X 6 Rolls | 17 X 19 Inches | For Dry & Wet Waste | Black",
        "price": "₹269",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F613NiEOHPgL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0821PKWBW",
        "affiliate": "https://www.amazon.in/dp/B0821PKWBW/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Milton Rapid Electric Kettle 1.8L | 1500 Watts | Stainless Steel Hot Water portable Electric Kettle for Home, Office | Auto Shut-Off with Wide Mouth | Cool-touch Handle and Single-Touch Lid Lock",
        "price": "₹649",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F51lYFOP2mUL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0F54GKQ38",
        "affiliate": "https://www.amazon.in/dp/B0F54GKQ38/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "MY ARMOR Microfiber Pillows Set 2, Soft Adjustable Pillow for Sleeping - 16 x 24 Inches -White",
        "price": "₹449",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F810RfUP8ODL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0BFNRKR8Z",
        "affiliate": "https://www.amazon.in/dp/B0BFNRKR8Z/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Story@Home 100% True Blackout Door Curtains 7 Feet Long Set of 2 | Plain Design | Room Darkening Curtain | Thermal Insulated Curtains for Living Room, Bedroom | (116 x 215 cm, Beige)",
        "price": "₹1,249",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F71fbk-b5ObL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B06XDP2C1S",
        "affiliate": "https://www.amazon.in/dp/B06XDP2C1S/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "WARISI Cotton Kitchen Doormat| Floor Mat | Door Mat| Anti-Slip, Soft,Washable, Printed, Designer, for Floor, Kitchen, Room Offices (120L X 40W & 60L X 40W Centimetre), Rectangular (Design-1)",
        "price": "₹247",
        "rating": "3.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F717B9NPW78L._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0D1VCNM5F",
        "affiliate": "https://www.amazon.in/dp/B0D1VCNM5F/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "AERYS Digital Alarm Clock with Automatic Sensor, Date and Temperature Display, Compact Desk Table Clock for Students, Home, Office, Bedroom, Living Room,Home Decor, Corporate Use (Black Digital)",
        "price": "₹299",
        "rating": "3.8 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F51MctYF8BiL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0CQH5N1DY",
        "affiliate": "https://www.amazon.in/dp/B0CQH5N1DY/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Godrej aer Matic Automatic Room Fresheners Refill Pack | Violet Valley Bloom | 2200 Sprays Guaranteed | Lasts up to 60 days (210ml)",
        "price": "₹249",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F71EVBYj9wNL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B07FPRB9CR",
        "affiliate": "https://www.amazon.in/dp/B07FPRB9CR/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Bisleri Water bottle with added minerals, 5 L",
        "price": "₹68",
        "rating": "4.6 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F51SZnVrmKQL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0DGY1PQDP",
        "affiliate": "https://www.amazon.in/dp/B0DGY1PQDP/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Misamo Enterprise Glass Oil Sprayer and Dispenser Bottle, 500ml Capacity, 2-in-1 Design, Black",
        "price": "₹249",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F713%2B2UPOISL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0DH4WS3B4",
        "affiliate": "https://www.amazon.in/dp/B0DH4WS3B4/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Shalimar Premium (Lavender Fragrance) Scented Garbage Bags | Medium 19 X 21 Inches | 120 Bags (30 Bags X 4 Rolls) | Dustbin Bag/Trash Bag | (Black) - Perforated Box for Easy Dispensing",
        "price": "₹369",
        "rating": "4.5 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F81UM3i0sUbL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B07KT9Q54M",
        "affiliate": "https://www.amazon.in/dp/B07KT9Q54M/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "KCE Store Split AC Cover for Outdoor Unit, Heat-Insulated, Weather-Resistant Protection, Extend Lifespan, Boost Energy Efficiency",
        "price": "₹249",
        "rating": "3.7 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F71CPTDgHZ7L._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0GPQ1PLFW",
        "affiliate": "https://www.amazon.in/dp/B0GPQ1PLFW/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Wakefit 100% Waterproof Premium Cotton Mattress Protector | Breathable and Hypoallergenic Ultra Soft Fitted Bed Protector 78\"x72\" - King, Grey",
        "price": "₹761",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F61sRf7oDELL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0C1S894S3",
        "affiliate": "https://www.amazon.in/dp/B0C1S894S3/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "CareFoam Memory Foam Cervical Neck Pillow | 2 Years Warranty | Pain Relief Sleep, Improves Posture Spinal Alignment, Neck Pain Relief | Queen 19 x 11 x 3.5 Inch | White Jacquard Cover | Pack of 1",
        "price": "₹598",
        "rating": "3.9 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F51iOIPuNN5L._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0DXBCP7M4",
        "affiliate": "https://www.amazon.in/dp/B0DXBCP7M4/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "TEX-RO Stainless Steel Dish Drying Rack for Kitchen with Drainer Tray & Cutlery Holder | Utensils Drying Rack & Dish Drainer Basket | Bartan Stand Steel | Large 56x43x23 cm, Chrome Finish",
        "price": "₹839",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F81yYaxjauDL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0CBN7X3V1",
        "affiliate": "https://www.amazon.in/dp/B0CBN7X3V1/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Havells Airboll High Speed 450mm Wall Fan (White)",
        "price": "₹4,990",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F81%2B5bbj3xeL._AC_UL165_SR165%2C165_.jpg",
        "asin": "B00B4BC9IA",
        "affiliate": "https://www.amazon.in/dp/B00B4BC9IA/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "The Earth Store Handcrafted Creme Matte Brown Ceramic Dinner Set, 30 Pieces Serving for 6, Microwave and Dishwasher Safe, Bone-Ash Free, Dinner Sets | Crockery Set for Gifting & Dining",
        "price": "₹5,899",
        "rating": "3.9 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F81cyY0ge0yL._AC_UL165_SR165%2C165_.jpg",
        "asin": "B0GKGZ7LMJ",
        "affiliate": "https://www.amazon.in/dp/B0GKGZ7LMJ/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Havells Swing 300mm Wall Mounted Fan | High-Performance, Wall Fan for Kitchen & Home, Smooth Oscillation, 100% Copper Motor | 3-Speed Control, 2-Year Warranty | (Pack of 1, Off White)",
        "price": "₹2,699",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F719Lzp9EmmL._AC_UL165_SR165%2C165_.jpg",
        "asin": "B00J5ENA7C",
        "affiliate": "https://www.amazon.in/dp/B00J5ENA7C/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Havells CANDY HS Wall & Table Fan 230 mm 100% Copper Wire Motor| Watt: 60|Air Flow: 35 cmm|Speed: 2700 RPM| 2 Year Warranty(Yellow)",
        "price": "₹2,450",
        "rating": "3.6 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F61zVvj%2Bh90L._AC_UL165_SR165%2C165_.jpg",
        "asin": "B0F6BNMKMH",
        "affiliate": "https://www.amazon.in/dp/B0F6BNMKMH/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Havells Swing 400mm Wall Fan (Off White)",
        "price": "₹2,490",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F41ueDbjypYL._AC_UL165_SR165%2C165_.jpg",
        "asin": "B00B4BCAVG",
        "affiliate": "https://www.amazon.in/dp/B00B4BCAVG/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Portronics Aero Breeze Portable table Fan 178mm, USB Rechargeable Fan, 3 Speed Airflow, Battery Powered Silent Operation, 4 Hours Back Up, 360° Rotatable USB Fan, BLDC Fan for Kitchen,Office,Home",
        "price": "₹949",
        "rating": "3.9 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F71OhLdT8bfL._AC_UL165_SR165%2C165_.jpg",
        "asin": "B0CQG1SBV3",
        "affiliate": "https://www.amazon.in/dp/B0CQG1SBV3/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "The Earth Store Handcrafted White Matte Brown Ceramic Dinner Set, 21 Pieces Serving for 6, Microwave and Dishwasher Safe, Bone-Ash Free, Dinner Sets | Crockery Set for Gifting & Dining",
        "price": "₹5,499",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F81MWJ0bTcJL._AC_UL165_SR165%2C165_.jpg",
        "asin": "B0D1V4382S",
        "affiliate": "https://www.amazon.in/dp/B0D1V4382S/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "fancymart Artificial Plants with Pot (Pack of 2, 45 cm) – Hanging Plants for Home Decor | Fake Plants Vine Creeper for Living Room, Wall, Office & Indoor Decoration",
        "price": "₹235",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F713NePqdaeL._AC_UL165_SR165%2C165_.jpg",
        "asin": "B0C1W5BKK2",
        "affiliate": "https://www.amazon.in/dp/B0C1W5BKK2/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "SPHINX White Ceramic Donut Vase, 6 Inch Modern Flower Vase for Pampas Grass, Dried Flowers, Home & Office Decor, Centerpiece, Handcrafted Gift Vase Only",
        "price": "₹178",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F813Kzy7rfqL._AC_UL165_SR165%2C165_.jpg",
        "asin": "B0CQ23K1SB",
        "affiliate": "https://www.amazon.in/dp/B0CQ23K1SB/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "UHUD CRAFTS Hanging Shelves - Adjustable Rope Hanging Shelf, Wall Hanging Decor, Lightweight, Premium Wooden Shelf, Hanging Plant Shelf for Bedroom and Living Room (1 Pcs)",
        "price": "₹169",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F61I3xo6idhL._AC_UL165_SR165%2C165_.jpg",
        "asin": "B09MCWZBH2",
        "affiliate": "https://www.amazon.in/dp/B09MCWZBH2/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Toy Imagine Indoor Hanging Table Tennis Trainer for Kids Age 5-14 | Door Mounted Ping Pong Game Set with 2 Rackets 6 Balls | Indoor Sports Game for Boys and Girls Home Play Activity",
        "price": "₹399",
        "rating": "3.8 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F61YYv%2BMnECL._AC_UL165_SR165%2C165_.jpg",
        "asin": "B0D4Z3FXKC",
        "affiliate": "https://www.amazon.in/dp/B0D4Z3FXKC/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Artvibes Designer Elephant Wooden Wall Hanging For Luck Properity For Home Decoration | Livingroom | Spiritual Decor Items | Wall Illustrations | Ethnic Wall Decor | Wall Art Print (WH_8506N)",
        "price": "₹189",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F719UiPPxPlL._AC_UL165_SR165%2C165_.jpg",
        "asin": "B0CJLSF2T2",
        "affiliate": "https://www.amazon.in/dp/B0CJLSF2T2/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Frenchware Cutlery (Set of 12, Stainless Steel PVD Gold Spoons - 6 and Forks - 6), 100% Food Grade, Non Toxic, Anti-Rust, Dishwasher Safe, Perfect Gifting Set for All Occasions",
        "price": "₹869",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F81XmWT4lUZL._AC_UL165_SR165%2C165_.jpg",
        "asin": "B0DCWDDY9H",
        "affiliate": "https://www.amazon.in/dp/B0DCWDDY9H/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Himalaya Erina-EP Shampoo | 200 ml | Tick & Flea Control for Dogs & Cats | with Neem & Eucalyptus for Skin Health & Hygiene",
        "price": "₹226",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F51UYPTXkUhL._AC_UL165_SR165%2C165_.jpg",
        "asin": "B073RVF88P",
        "affiliate": "https://www.amazon.in/dp/B073RVF88P/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    
    {
        "title": "Casio Youth Series Digital Black Dial Unisex Watch - F-91W-1Q(D002)",
        "price": "₹1,295",
        "rating": "4.5 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F51oNy5CTCOL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B00HFPIIOI",
        "affiliate": "https://www.amazon.in/dp/B00HFPIIOI/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "LEDO Men's and Women's Watch Box Holder Organizer Case In 12 Slots of watches In PU Leather with Black & Gray",
        "price": "₹746",
        "rating": "4.5 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F815s2tmyNkL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0BTTNR391",
        "affiliate": "https://www.amazon.in/dp/B0BTTNR391/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Casio Vintage A-158WA-1Q Digital Grey Dial Unisex Watch Silver Metal Strap (D011)",
        "price": "₹1,724",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F61ybeKQto8L._AC_UL600_SR600%2C400_.jpg",
        "asin": "B000GAYQJ0",
        "affiliate": "https://www.amazon.in/dp/B000GAYQJ0/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Amazon Basics Unisex Faux Leather Watch Organiser Box with 6 Slots |Watch Organiser with Transparent Lid (Black)",
        "price": "₹489",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F8162qBrd6ML._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0DZ2YY9NC",
        "affiliate": "https://www.amazon.in/dp/B0DZ2YY9NC/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Matrix Black, Blue, White Dial, Day & Date Functioning, Stainless Steel Strap Analog Watch for Men & Women",
        "price": "₹299",
        "rating": "3.8 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F816eXKgDfIL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0BNHD7MM3",
        "affiliate": "https://www.amazon.in/dp/B0BNHD7MM3/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "TIMEX Classics Analog Watch for Men with Round Dial & Water Resistant Man's Wrist Watches",
        "price": "₹1,099",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F71Kx6rgmlRS._AC_UL600_SR600%2C400_.jpg",
        "asin": "B07H3K85H5",
        "affiliate": "https://www.amazon.in/dp/B07H3K85H5/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Daniel Hechter Paris Bercy Collection Modern Chronograph Watch for Men with Square Dial and Silicon Band-DHM1001",
        "price": "₹2,799",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F71Ozj5O%2BfEL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0DZTMMSY2",
        "affiliate": "https://www.amazon.in/dp/B0DZTMMSY2/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "SPIKY Analog Watch for Kids | 3D Cartoon | 7 Multicolor LED Luminous Lights with Silicone Strap | Unisex Best Birthday Gift | Analogue Wrist Watches for Boys & Girls | Age 3-10 yrs",
        "price": "₹460",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F61-Lleg9fuL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B09TZW89JV",
        "affiliate": "https://www.amazon.in/dp/B09TZW89JV/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Titan Karishma Analog Champagne Dial Women's Watch -NM2598YM01 / NL2598YM01",
        "price": "₹1,995",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F71hC1byRyKL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B07CR1JQBY",
        "affiliate": "https://www.amazon.in/dp/B07CR1JQBY/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Fastrack Tees Analog Grey Dial Unisex-Adult Watch-68011PP08",
        "price": "₹885",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F41dannBuneL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B099WR4WHC",
        "affiliate": "https://www.amazon.in/dp/B099WR4WHC/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "AMERICANVIBER Men's Silver, Watch with Stainless Steel Band | Water-Resistant Analog Dress & Casual Wristwatch",
        "price": "₹300",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F71IVibsCYYL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0FPBGQ125",
        "affiliate": "https://www.amazon.in/dp/B0FPBGQ125/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Acnos® Premium Brand - A Digital Watch Shockproof Multi-Functional Automatic 5 Color Army Strap Waterproof Digital Sports Watch for Men's Kids Watch for Boys Watch for Men Pack of 1",
        "price": "₹299",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F61wP1%2Beh4%2BS._AC_UL600_SR600%2C400_.jpg",
        "asin": "B095YWP668",
        "affiliate": "https://www.amazon.in/dp/B095YWP668/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Matrix Antique Day & Date Leather Strap Analog Silicone Watch For Men & Boys - Black",
        "price": "₹285",
        "rating": "3.8 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F713WexJvpTL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0BMTH89TD",
        "affiliate": "https://www.amazon.in/dp/B0BMTH89TD/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Birch & Co. Faux Leather Watch Box Organizer,Watchcase Box For Unisex,Storage Tray,Wristwatch Collection Holder 12 Slots,Sleek & Durable Display Case For All Enthusiasts,Mohagany,Brown",
        "price": "₹725",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F816BMgd4pAL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0D6MV32Y8",
        "affiliate": "https://www.amazon.in/dp/B0D6MV32Y8/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Titan Karishma Analog Black Dial Men's Watch -NM1639SM02 / NL1639SM02",
        "price": "₹1,994",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F51ykbSj-eoL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B00ISNVQMW",
        "affiliate": "https://www.amazon.in/dp/B00ISNVQMW/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Matrix Antique 2.0 Day & Date Softest Silicone Strap Analog Watch for Men & Boys",
        "price": "₹299",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F71v6m3wsYRL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0CK4P136D",
        "affiliate": "https://www.amazon.in/dp/B0CK4P136D/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "styledose Women Analogue Wrist Watches for Women's & Girls&Miss&Ladies Diamond Studded Dial Rosegold Colored Stylish Bracelet Strap",
        "price": "₹373",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F711J1gA9deL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0D4YX94G3",
        "affiliate": "https://www.amazon.in/dp/B0D4YX94G3/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "LOUIS DEVIN Rose Gold Plated Mesh Chain Analog Wrist Watch for Women (Black/Blue/Rose Gold Dial) | RG162",
        "price": "₹359",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F71R7AfsSLuL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0BQRNY6FM",
        "affiliate": "https://www.amazon.in/dp/B0BQRNY6FM/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "TIMEWEAR Analog Day Date Functioning Stainless Steel Chain Watch for Men",
        "price": "₹299",
        "rating": "3.8 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F81nj6IlZpVL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B07MDGSP8F",
        "affiliate": "https://www.amazon.in/dp/B07MDGSP8F/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Casio Enticer Men Analog Green Dial Men MTP-1302PD-3AVEF (A2262)",
        "price": "₹3,635",
        "rating": "4.5 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F61XeQ6jAVqL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0BRP4LVN2",
        "affiliate": "https://www.amazon.in/dp/B0BRP4LVN2/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Matrix Kids Edition Super Hero 3D Heads Up with 6 Image Projection Digital Watch for Kids",
        "price": "₹275",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F61tKpIGBPSL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0FMDX9ZCZ",
        "affiliate": "https://www.amazon.in/dp/B0FMDX9ZCZ/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "IIK COLLECTION 22mm Silicone Strap for Smart Watches | Combo Pack Compatible With Noise, Fireboltt, Boat Xtend, Pebble, Boat Flash, Noise Color Fit, Ultra Smart Watch & All Watches",
        "price": "₹265",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F51YZSMSOWsL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0CG6CZT3S",
        "affiliate": "https://www.amazon.in/dp/B0CG6CZT3S/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Acnos Luminous LED Display Fashionable Children's Digital Watches - Waterproof Sports Square Electronic Led Watch for Boy & Girl",
        "price": "₹249",
        "rating": "3.6 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F61ohjb-5f5L._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0CBN55GTS",
        "affiliate": "https://www.amazon.in/dp/B0CBN55GTS/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Casio Enticer Analog Blue Dial Men's Watch-MTP-VD01D-2EVUDF (A1364)",
        "price": "₹2,995",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F61g5FZOHQEL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B07BS3LCP1",
        "affiliate": "https://www.amazon.in/dp/B07BS3LCP1/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Fastrack Analog Unisex-Adult Watch",
        "price": "₹995",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F61FFBTzKiUL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B099WNYHY2",
        "affiliate": "https://www.amazon.in/dp/B099WNYHY2/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Titan Casual Watches for Women -2656WL01",
        "price": "₹1,895",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F61EAcTdXZ7L._AC_UL600_SR600%2C400_.jpg",
        "asin": "B09B9QZH8N",
        "affiliate": "https://www.amazon.in/dp/B09B9QZH8N/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "TIMEWEAR Analog, Day Date Functioning, Strap Watch for Men",
        "price": "₹299",
        "rating": "3.8 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F71CVv%2B-eVWL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0BJF1GF29",
        "affiliate": "https://www.amazon.in/dp/B0BJF1GF29/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "STYLEDOSE Women's Luxury Black Analog Watch – Rose Gold Roman Numerals with Stylish Metal Chain Strap Wrist Watches for Women's & Girls&Miss&Ladies",
        "price": "₹499",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F71puP2144aL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0GCNF4KXH",
        "affiliate": "https://www.amazon.in/dp/B0GCNF4KXH/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Shocknshop Digital Sports Stylish Multifunctional Electronic LED Black Dial Wrist Watch for Men Boys -WCH78",
        "price": "₹499",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F71CxgCKczdL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0BW3RBC3K",
        "affiliate": "https://www.amazon.in/dp/B0BW3RBC3K/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    
    {
        "title": "LifeKrafts Polyester Magnetic Mosquito Net for All Door Types & Sizes, Auto-Closing Insect Screen/Curtain to Keep Mosquito & Flies Out, (200x100 cm) Brown",
        "price": "₹899",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F71cRik9djML._AC_UL600_SR600%2C400_.jpg",
        "asin": "B07YWZMJFP",
        "affiliate": "https://www.amazon.in/dp/B07YWZMJFP/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "SaleOn Insulated Lunch Bag for Women & Men | Waterproof Soft Cooler Tote | Leakproof, Reusable with Pockets | Thermal Lunch Box for Office, Travel, Picnic (Charcoal Grey)",
        "price": "₹334",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F71He-EbDEbL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0FGK2LF3P",
        "affiliate": "https://www.amazon.in/dp/B0FGK2LF3P/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Classic Mosquito Net for Double Bed | King Size Foldable Machardani | Polyester 30GSM Strong Net | PVC Coated Corrosion Resistant Steel Wire - Blue",
        "price": "₹949",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F61IOb4Nu6AL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B00JD8EA1U",
        "affiliate": "https://www.amazon.in/dp/B00JD8EA1U/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Shadow Securitronics Gecko Aerosol Based Odour Free Herbal Lizard Repellent Spray | Eco-Friendly & Biodegradable | Irritant &Chemical-Free | 220 ml (60 Days Protection) PK of 1-FORMULATION 10X",
        "price": "₹383",
        "rating": "3.9 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F61U4HUr13cL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0BQHY9419",
        "affiliate": "https://www.amazon.in/dp/B0BQHY9419/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Mortein 45ml x 6 (Buy 4 Get 2 Free) Fits All Machines | SmartPlus Mosquito Repellent Refill | Mosquito Repellent & Killer | 100% Protection from Dengue Mosquitoes, Pack of 6",
        "price": "₹260",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F61ki4G4AKkL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B07YY9N6TY",
        "affiliate": "https://www.amazon.in/dp/B07YY9N6TY/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Mortein Advanced Anti-Mosquito Racquet | Mosquito Bat | Electric Fly Swatter | Mosquito Killer Racket | Bat to Hit Mosquito, Multicolor",
        "price": "₹449",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F81NcPU059SL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0CPXSRNC8",
        "affiliate": "https://www.amazon.in/dp/B0CPXSRNC8/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Konvio Neer TDS Meter for Water Testing | Digital TDS meter| PPM Tester for Drinking Water, RO, Aquarium & Hydroponics | Total Dissolved Solids meter",
        "price": "₹299",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F41T7y64PCiS._AC_UL600_SR600%2C400_.jpg",
        "asin": "B08HSN58RK",
        "affiliate": "https://www.amazon.in/dp/B08HSN58RK/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "HIT Crawling Insect Killer – Cockroach Killer Spray | Instant Kill | Deep-Reach Nozzle | Fresh Fragrance, 400ml",
        "price": "₹171",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F61BKO3MH48L._AC_UL600_SR600%2C400_.jpg",
        "asin": "B00XORDU9E",
        "affiliate": "https://www.amazon.in/dp/B00XORDU9E/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "HIT Crawling Insect Killer Cockroach Killer Spray | Instant Kill | Deep-Reach Nozzle | Fresh Fragrance, 700ml",
        "price": "₹315",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F612O8HhPFJL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B07WQJLYQM",
        "affiliate": "https://www.amazon.in/dp/B07WQJLYQM/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Ugaoo Organic Vermicompost Fertilizer for Plants – 5 Kg | 100% Natural Vermi Compost Manure for Home Garden, Vegetables, Indoor & Balcony Plants | Organic Soil Booster for Plant",
        "price": "₹329",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F615ogT1U-KL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0BDVN579S",
        "affiliate": "https://www.amazon.in/dp/B0BDVN579S/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "ORILEY 2 LTR Multipurpose Classic Sprayer Hand Powered Water Spray Bottle for Gardening Sanitising Car & Bike Wash Home & Garden",
        "price": "₹255",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F61DhItyxY8L._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0CRZ71BFY",
        "affiliate": "https://www.amazon.in/dp/B0CRZ71BFY/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Shadow Securitronics Tom CAT No Entry Rat Repellent Spray for Cars Highly Effective with and Lasts 1 Year Leak Free Easy to Spray Nozzle 1st time in India (1) - FORMULATION 1 X 200 ML",
        "price": "₹454",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F71vIuYzSvhL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B07KCCSJG8",
        "affiliate": "https://www.amazon.in/dp/B07KCCSJG8/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Weird Wolf 2 in 1 Rechargeable Mosquito Killer Racket with UV Light & Base Stand | Electric Fly Swatter with Auto & Manual Mode | Type-C USB Charging | 1200 mAh Lithium Battery | 6 Month Warranty",
        "price": "₹699",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F81rlqolLHiL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0DFWDZ3B3",
        "affiliate": "https://www.amazon.in/dp/B0DFWDZ3B3/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "LifeKrafts AC Curtain Magnetic|Thermal Screen|Insulated|Translucent Bubble Design|Insect & Pest Control|Privacy Screen, Dust, Pollen & Pollution Control Screen(Size 210 x 120 cm) Non-Customizable",
        "price": "₹1,149",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F61UqFmG-ENL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0FCBTK4CG",
        "affiliate": "https://www.amazon.in/dp/B0FCBTK4CG/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Jeena Sikho Water Testing Kit | pH Level & ORP Test Drops for Testing Drinking Water",
        "price": "₹149",
        "rating": "3.8 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F51F3a%2BDfFxL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0GZK1XSF3",
        "affiliate": "https://www.amazon.in/dp/B0GZK1XSF3/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "UGAOO Cocopeat Block 5 Kg for Home Garden Plants | Compressed & Sterilized Coconut Fiber Growing Medium for Seed Germination, Potting Mix, Indoor & Outdoor Gardening & Soil Aeration",
        "price": "₹398",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F71sY95JXtzL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B07D7QJ4FN",
        "affiliate": "https://www.amazon.in/dp/B07D7QJ4FN/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Lifekrafts Standard Size Window Mosquito Net (Size-90x120cms/36x47 Inches/2.95x3.94 Feet, Color-Grey) 120 GSM Stitched Fiberglass Net with Strong Hook & Loop Adhesive Tape",
        "price": "₹472",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F516sjSH5d4L._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0DPHTF2Q8",
        "affiliate": "https://www.amazon.in/dp/B0DPHTF2Q8/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Ugaoo Organic Potting Soil Mix for Plants – 5 Kg | Ready to Use Garden Soil for Cactus & Succulents, Indoor, Outdoor & Flowering Plants | Home Garden Potting Mixture",
        "price": "₹349",
        "rating": "4.3 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F71YiMttna-L._AC_UL600_SR600%2C400_.jpg",
        "asin": "B07SC9Q2RL",
        "affiliate": "https://www.amazon.in/dp/B07SC9Q2RL/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Terminator Eco-Friendly Termite Killer Spray| 500ml | Wood Preservative and Termite, Borer and Insect Repellent for Home, Kitchen, and Offices",
        "price": "₹281",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F611q2fskstL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B08BPNPCL8",
        "affiliate": "https://www.amazon.in/dp/B08BPNPCL8/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Go Garden NPK 19 19 19 Fertilizer for Plants | Water Soluble Plant Fertilizer for Growth, Flowering & Fruiting | Garden & Indoor Plant Care – 400 Gram",
        "price": "₹168",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F61OvVxWepBL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0C5JWLJ8P",
        "affiliate": "https://www.amazon.in/dp/B0C5JWLJ8P/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Amish Herbal Ant Gel Pack of 2 | 10 Min Max Bait Formula | Powerful Organic Repellent & Cleaner | Removes Red,Black Ant, Antox Pests | Natural Dawa Protector for Home & Kitchen",
        "price": "₹285",
        "rating": "3.9 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F71dT7BHZBvL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B07CW2N5RW",
        "affiliate": "https://www.amazon.in/dp/B07CW2N5RW/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "TrustBasket Vermicompost 5kg 100% Natural Organic Fertilizer for Plants | Nutrient-Rich Compost for Home Garden | Improves Plant Health, Water Retention & Soil Quality | Ideal for All Gardening Needs",
        "price": "₹238",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F71zxEAIaI7L._AC_UL600_SR600%2C400_.jpg",
        "asin": "B07PRXV7MJ",
        "affiliate": "https://www.amazon.in/dp/B07PRXV7MJ/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "ELOVE 18 Watt Submersible Water Pump - 180V-230V, 1.85 M Cooler Pump for Desert Air Cooler, Aquarium, Fountains, Ponds (Black/Grey)",
        "price": "₹253",
        "rating": "4.1 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F71A1M5ItjTL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B07BW882S2",
        "affiliate": "https://www.amazon.in/dp/B07BW882S2/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "LifeKrafts Polyester Door Mosquito Net with Magnets | Color Planet Theme with Dark Blue Background | Mosquito Curtain for All Door Types and Sizes | Auto Close Insect Screen | Size 210 * 100cm",
        "price": "₹899",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F71BADnUvWML._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0DF833X4W",
        "affiliate": "https://www.amazon.in/dp/B0DF833X4W/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "3M Rodent Repellent Coating, 250 g| Rat Protection for Engine Parts and Wires | Long-Lasting Effect, Liquid",
        "price": "₹549",
        "rating": "4.0 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F61MYvD1kRkL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B07GBBKF54",
        "affiliate": "https://www.amazon.in/dp/B07GBBKF54/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "LifeKrafts Polyester Magnetic Mosquito Net/ Curtain for Door, for All Door Types & Sizes, Auto-Closing Insect Screen to Keep Mosquito Out, Grey, 200 x 100 Cm",
        "price": "₹899",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F71XB8blqvyL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B07RJHMN7S",
        "affiliate": "https://www.amazon.in/dp/B07RJHMN7S/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "TrustBasket Enriched organic Earth Magic Potting Soil Fertilizer for Plants, 5 Kg",
        "price": "₹273",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F61fUoGkNdHL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B07L68TK8D",
        "affiliate": "https://www.amazon.in/dp/B07L68TK8D/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Anandi Green's Premium HDPE Uv Protected 260 GSM Round Shaped Green Colour Plants Grow Bags Suitable for Terrace and Vegetable Gardening 12x12 Inch Pack of 5 Grow Bags",
        "price": "₹420",
        "rating": "4.4 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F71XqJtb1i2L._AC_UL600_SR600%2C400_.jpg",
        "asin": "B09MW99WD8",
        "affiliate": "https://www.amazon.in/dp/B09MW99WD8/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Kraft Seeds Plant Cutter for Garden with Premium Stainless Steel Lock, Sharp Edges - Tree Cutter Tools & Gardening Tools, Grass Trimmer, Shear Cutting, Pruner for Plants and Leaves, Heavy Duty Cutter",
        "price": "₹199",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F71qsM1jKy%2BL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B083G39X64",
        "affiliate": "https://www.amazon.in/dp/B083G39X64/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Ugaoo Neem Oil Spray for Plants & Garden - Highly Effective on Plant Insects (250 ml)",
        "price": "₹179",
        "rating": "4.2 out of 5",
        "image": "https://primeoffersstore.up.railway.app/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F61Lb5sYOk2L._AC_UL600_SR600%2C400_.jpg",
        "asin": "B08P51GM2K",
        "affiliate": "https://www.amazon.in/dp/B08P51GM2K/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    }


]

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
        category:      item.category || 'Beauty',
        affiliateLink: item.affiliate,
        rating:        parseRating(item.rating),
        featured:      false,
        region: item.region || 'all',
          audience: item.audience || 'all',

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