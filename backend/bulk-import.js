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

const products = [
    {
        "title": "Amazon Brand - Presto! Garbage Bags | Medium | 180 Count | 30 Bags X 6 Rolls | 19 X 21 Inches | For Dry & Wet Waste | Black",
        "price": "₹355",
        "rating": "4.4 out of 5",
        "image": "http://localhost:5000/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F61fn1xtHO4L._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0821PN8L4",
        "affiliate": "https://www.amazon.in/dp/B0821PN8L4/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Ezee Live Life Ezee Way Black Garbage Bags for Dustbin|90 Pcs|Medium 19 X 21 Inches|30 Pcs X Pack of 3, 3 count",
        "price": "₹159",
        "rating": "4.2 out of 5",
        "image": "http://localhost:5000/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F71erHCKJ3WL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B06VX8YR6Q",
        "affiliate": "https://www.amazon.in/dp/B06VX8YR6Q/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "JIALTO 20 Pcs Self Adhesive Hooks for Secure Wall Hanging - Versatile 6mm Nail Hook for Photo Frames Hooks, Clocks, and More - Transparent, Heavy-Duty, No-Drill Solution",
        "price": "₹149",
        "rating": "4.2 out of 5",
        "image": "http://localhost:5000/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F61dhl%2BOHAhL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0CMTZ92DC",
        "affiliate": "https://www.amazon.in/dp/B0CMTZ92DC/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Go24 pexpo Water Bottle 1 ltr Stainless Steel Sports/Fridge Bottle with Sipper Cap | 1-Year Warranty | Single Wall | For Home, Office, Gym | Lightweight | Craft Pro 950ml | Grey - Black Ombre",
        "price": "₹299",
        "rating": "4.1 out of 5",
        "image": "http://localhost:5000/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F71Jd57CzPBL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0DRCT1MTK",
        "affiliate": "https://www.amazon.in/dp/B0DRCT1MTK/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "ATOM ALISTON K1 Series Digital Kitchen Weighing Scale 10 kg, Electronic Weight Machine with LCD Display for Baking, Cooking, Food & Diet, SF-400/A121. 6Months Warranty (Colour May Vary)",
        "price": "₹249",
        "rating": "4.2 out of 5",
        "image": "http://localhost:5000/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F71775fRr%2BgL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B083C6XMKQ",
        "affiliate": "https://www.amazon.in/dp/B083C6XMKQ/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "MICROTEK EM4160 Automatic Voltage Digital Display Wall Mounted Stabilizer (160V-285V) for AC Air Conditioner Upto 1.5 Ton (Metallic Grey)",
        "price": "₹2,269",
        "rating": "4.0 out of 5",
        "image": "http://localhost:5000/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F61sVH4hfjML._AC_UL600_SR600%2C400_.jpg",
        "asin": "B075HH96CH",
        "affiliate": "https://www.amazon.in/dp/B075HH96CH/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "NutriPro Juicer Mixer Grinder - Smoothie Maker - 500 Watts (2 Jars & 1 Blade, Silver) - 2 Year Warranty",
        "price": "₹1,599",
        "rating": "4.4 out of 5",
        "image": "http://localhost:5000/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F71rH4vEE4nL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B09J2T124D",
        "affiliate": "https://www.amazon.in/dp/B09J2T124D/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "MILTON Comet 1000 Stainless Steel Water Bottle 1000 ml, Single Walled, ISI Certified I Leak Proof Lid, Rust Proof I For School, Office, Gym I Black",
        "price": "₹299",
        "rating": "3.9 out of 5",
        "image": "http://localhost:5000/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F61K8wOHMIXL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0CXNSCCVW",
        "affiliate": "https://www.amazon.in/dp/B0CXNSCCVW/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Trance 100% Waterproof Premium Mattress Protector for Double Bed King Size 78x72 Inches | Cotton Feel Mattresses Cover | Elastic Fitted | Fits Upto 10 Inch | Bed Protector Cover (78\"x72\" King Grey)",
        "price": "₹625",
        "rating": "4.2 out of 5",
        "image": "http://localhost:5000/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F61Mx6KEz3QL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B01A57IV58",
        "affiliate": "https://www.amazon.in/dp/B01A57IV58/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Amazon Brand - Presto! Garbage Bags | Large | 90 Count | 15 Bags X 6 Rolls | 24 X 32 Inches | For Dry & Wet Waste | Black",
        "price": "₹355",
        "rating": "4.4 out of 5",
        "image": "http://localhost:5000/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F61fn1xtHO4L._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0821PYKVK",
        "affiliate": "https://www.amazon.in/dp/B0821PYKVK/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Bajaj Pygmy Go 178MM Mini Fan with LED Lighting | Rechargeable | USB Charging | 4-hours Battery Backup | 3 Speed | 2-Light Brightness Setting | High Speed | Portable【Blue】",
        "price": "₹1,549",
        "rating": "3.9 out of 5",
        "image": "http://localhost:5000/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F71LTc2cd3GL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0C3XNCTDX",
        "affiliate": "https://www.amazon.in/dp/B0C3XNCTDX/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "One94Store Astronaut Galaxy Projector Night Light – 360° Rotating Nebula Star Projector with Remote Control, Timer & Adjustable Head – Space Lamp for Kids’ Bedroom, Gifts, Gaming Room, Home & Décor",
        "price": "₹699",
        "rating": "4.1 out of 5",
        "image": "http://localhost:5000/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F81r6tIbS1cL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0DN1RWNSQ",
        "affiliate": "https://www.amazon.in/dp/B0DN1RWNSQ/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Milton Aura 1000 Thermosteel Water Bottle, 24 Hr Hot and Cold I Leak Proof Lid, ISI Certified I Vacuum Insulated I for Office, Gym, School I Dark Blue",
        "price": "₹870",
        "rating": "4.1 out of 5",
        "image": "http://localhost:5000/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F61SHImx3ixL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0B4RZ3XNP",
        "affiliate": "https://www.amazon.in/dp/B0B4RZ3XNP/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Zulaxy Photo Frame Hooks for Wall Without Drilling, 10 Pack Self Adhesive Hooks for Wall Heavy Duty Strong Nail Free for Hanging Photo Frame (Hanging Hook, Transparent) Stainless Steel",
        "price": "₹269",
        "rating": "4.0 out of 5",
        "image": "http://localhost:5000/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F61WnmpLwAQL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0CCM8L54V",
        "affiliate": "https://www.amazon.in/dp/B0CCM8L54V/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Homestrap Set of 6 Non-Woven Printed Saree Cover/Cloth Storage/Wardrobe Organizer For Clothes with Transparent Window (Grey)(Shark Tank Featured) 45cmx33cmx22cm",
        "price": "₹339",
        "rating": "4.1 out of 5",
        "image": "http://localhost:5000/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F71zjvUApaRL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B08LQRXXNB",
        "affiliate": "https://www.amazon.in/dp/B08LQRXXNB/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Raxon Innovation (39 Inches, Pack of 5) PVC Door Guard Gap Filler for Door Bottom Seal Strip - Sound-Proof, Reduce Noise, Energy Saving Door Stopper for Reduce Door Dust, Door Guard for Home",
        "price": "₹188",
        "rating": "4.0 out of 5",
        "image": "http://localhost:5000/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F61ejfP6n1KL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0983PRR2Z",
        "affiliate": "https://www.amazon.in/dp/B0983PRR2Z/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Prestige PIC 20 1600 Watts Induction Cooktop | 4KV Surge Protection | 8 Preset Indian Menu Options & Timer | Soft Touch Button | Easy to Clean | Portable | Black | 1Y Warranty | BIS",
        "price": "₹2,950",
        "rating": "4.0 out of 5",
        "image": "http://localhost:5000/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F71%2B18JpxhOL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B00YMJ0OI8",
        "affiliate": "https://www.amazon.in/dp/B00YMJ0OI8/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Robustt Heavy Duty AC stand | Rust Proof Iron Air Conditioner Outdoor Unit Mounting Bracket, Supports upto 200kg weight | Air Conditioner Stand Comes with Necessary Wall Fittings - Pack of 1",
        "price": "₹449",
        "rating": "4.0 out of 5",
        "image": "http://localhost:5000/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F61wn%2B%2BdqhEL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0DX77JM71",
        "affiliate": "https://www.amazon.in/dp/B0DX77JM71/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "GADDA CO 100% Waterproof Premium Cotton Feel Mattress Protector King Size 78x72 Inch|Ultra Soft Breathable & Fitted Bed Protector Terry Cover Double Bed (6.5x6 feet, Fits 10 Inches, Grey)",
        "price": "₹599",
        "rating": "4.3 out of 5",
        "image": "http://localhost:5000/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F71yu3d1QjjL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B09VL787WJ",
        "affiliate": "https://www.amazon.in/dp/B09VL787WJ/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "atomberg Renesa Enzel 1200mm BLDC Ceiling Fan with Remote | 5 star | Advance Air+ Technology | LED Speed Indicator | Low Noise | Sleek Design | Power Saving | 3 Year Warranty | Gloss White",
        "price": "₹3,749",
        "rating": "4.2 out of 5",
        "image": "http://localhost:5000/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F51m%2BI%2BvzJEL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0CHJNJJDP",
        "affiliate": "https://www.amazon.in/dp/B0CHJNJJDP/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Bajaj PX 97 Torque New 36L Personal Air Cooler For Room|Honeycomb Cooling Pads|High-Speed |30Ft Powerful Air Throw|3-Speed Control|Portable Cooler-Home|3 Year Comprehensive Product Warranty|White",
        "price": "₹5,399",
        "rating": "3.6 out of 5",
        "image": "http://localhost:5000/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F61Juyv14Y0L._AC_UL600_SR600%2C400_.jpg",
        "asin": "B09R3QNGW5",
        "affiliate": "https://www.amazon.in/dp/B09R3QNGW5/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Pigeon Polypropylene Mini Handy and Compact Chopper with 3 Blades for Effortlessly Chopping Vegetables and Fruits for Your Kitchen (12420, Green, 400 ml)",
        "price": "₹183",
        "rating": "4.0 out of 5",
        "image": "http://localhost:5000/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F51RXzjrUmkL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B01LWYDEQ7",
        "affiliate": "https://www.amazon.in/dp/B01LWYDEQ7/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "WARMEO MICROMATE Microwave-Safe Stainless Steel Lunch Box, Bpa Free, Perfect for Office, School, Travelling, Combo(800ml+150 ml),Green",
        "price": "₹499",
        "rating": "4.0 out of 5",
        "image": "http://localhost:5000/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F61dcjkw9fjL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0FPXKMT65",
        "affiliate": "https://www.amazon.in/dp/B0FPXKMT65/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Daikin 1.5 Ton 3 Star, New Star rated, Inverter Split AC (Copper, PM2.5 Filter, MTKL50XV16, White)",
        "price": "₹37,490",
        "rating": "3.7 out of 5",
        "image": "http://localhost:5000/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F61aNUgUz6EL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0GRV2DWP3",
        "affiliate": "https://www.amazon.in/dp/B0GRV2DWP3/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "SATVIKAYA Air Tight Plastic Storage Containers Set for Kitchen | Pantry Organizers Kitchen Accessories Items,Fridge Storage Boxes | Leak-Proof, Durable, and Space-Saving (4, 2500ml) (1200 ML, 6)",
        "price": "₹389",
        "rating": "4.2 out of 5",
        "image": "http://localhost:5000/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F714THosaxdL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0DVLBTKPH",
        "affiliate": "https://www.amazon.in/dp/B0DVLBTKPH/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Go24 pexpo Insulated Water Bottle 1 LTR, Stainless Steel Leak Proof Flask, 24 Hours Hot & Cold, BPA Free Bottle for Gym, Office, Travel, 2-Year Warranty |Bravo 1000| Military Green",
        "price": "₹699",
        "rating": "4.3 out of 5",
        "image": "http://localhost:5000/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F71PBOQE7ivL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0CLXVWX25",
        "affiliate": "https://www.amazon.in/dp/B0CLXVWX25/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "DALUCI Self Adhesive Wall Hooks - 20 Pcs Heavy Duty Wall Hooks for Hanging | Nail Free Sticky Hooks for Wall Heavy Items Without Drilling, Transparent Wall Hanger Hook (Flower Hook, 20)",
        "price": "₹170",
        "rating": "4.2 out of 5",
        "image": "http://localhost:5000/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F61GkkM%2BS6lL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0D8PQQQ6G",
        "affiliate": "https://www.amazon.in/dp/B0D8PQQQ6G/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "AmazonBasics Mild Steel Cloth Drying Stand - 3 Way Folding, 42 Feet Drying Length, 20 Drying Rails, Lightweight (Silver)",
        "price": "₹1,329",
        "rating": "4.2 out of 5",
        "image": "http://localhost:5000/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F71vkps3XMVL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0FWRLQND8",
        "affiliate": "https://www.amazon.in/dp/B0FWRLQND8/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "AGARO Elite Rechargeable Mini Electric Chopper, Food Grade Bowl, Stainless Steel Blades, Rechargeable, One Touch Operation, for Chopping Garlic, Ginger, Onion, Vegetable, Nuts, 250 Ml, Black",
        "price": "₹599",
        "rating": "4.2 out of 5",
        "image": "http://localhost:5000/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F71JxqRoEC9L._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0C897PVVM",
        "affiliate": "https://www.amazon.in/dp/B0C897PVVM/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Nova Milk Frother Rechargable Coffee Frother Milk & Beater for Cold Latte 2In1 Handheld Battery-Powered Blender and Egg Whisker | 1 Year Warranty Free Frothy Recipe E-Book (Whisker), Black",
        "price": "₹301",
        "rating": "4.6 out of 5",
        "image": "http://localhost:5000/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F71TD7nkRWtL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0F8HJJVW1",
        "affiliate": "https://www.amazon.in/dp/B0F8HJJVW1/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Godrej aer Spray | Room Freshener for Home & Office - Cool Aqua (200 ml) | Long-Lasting Fragrance",
        "price": "₹85",
        "rating": "4.2 out of 5",
        "image": "http://localhost:5000/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F612dwuTHwSL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B00OHNGJ2Y",
        "affiliate": "https://www.amazon.in/dp/B00OHNGJ2Y/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "amazon basics Electric Egg Boiler | 350 Watt | Boils Upto 7 Eggs | Automatic Operation, 3 Boiling Modes | Overheat Protection | Stainless Steel Heating Plate, Measuring Cup | 75ml | Plastic | White",
        "price": "₹419",
        "rating": "4.2 out of 5",
        "image": "http://localhost:5000/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F71p1L3X-ViL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0BT1M24FN",
        "affiliate": "https://www.amazon.in/dp/B0BT1M24FN/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "V-Guard VG 400 for 1.5 Ton A.C (170V to 270V) Original 3 Year onsite wrranty,GREY",
        "price": "₹1,999",
        "rating": "4.0 out of 5",
        "image": "http://localhost:5000/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F31xRPjdBD3L._AC_UL600_SR600%2C400_.jpg",
        "asin": "B089YC1QMD",
        "affiliate": "https://www.amazon.in/dp/B089YC1QMD/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "amazon basics Vacuum Compression Storage Bags with Hand Pump - Medium, 5-Pack",
        "price": "₹499",
        "rating": "4.3 out of 5",
        "image": "http://localhost:5000/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F71qEqnkZg8L._AC_UL600_SR600%2C400_.jpg",
        "asin": "B07RTJV6G4",
        "affiliate": "https://www.amazon.in/dp/B07RTJV6G4/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Amazon Brand - Presto! Garbage Bags | Small | 180 Count | 30 Bags X 6 Rolls | 17 X 19 Inches | For Dry & Wet Waste | Black",
        "price": "₹269",
        "rating": "4.4 out of 5",
        "image": "http://localhost:5000/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F613NiEOHPgL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0821PKWBW",
        "affiliate": "https://www.amazon.in/dp/B0821PKWBW/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Milton Rapid Electric Kettle 1.8L | 1500 Watts | Stainless Steel Hot Water portable Electric Kettle for Home, Office | Auto Shut-Off with Wide Mouth | Cool-touch Handle and Single-Touch Lid Lock",
        "price": "₹649",
        "rating": "4.0 out of 5",
        "image": "http://localhost:5000/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F51lYFOP2mUL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0F54GKQ38",
        "affiliate": "https://www.amazon.in/dp/B0F54GKQ38/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "MY ARMOR Microfiber Pillows Set 2, Soft Adjustable Pillow for Sleeping - 16 x 24 Inches -White",
        "price": "₹449",
        "rating": "4.2 out of 5",
        "image": "http://localhost:5000/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F810RfUP8ODL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0BFNRKR8Z",
        "affiliate": "https://www.amazon.in/dp/B0BFNRKR8Z/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Story@Home 100% True Blackout Door Curtains 7 Feet Long Set of 2 | Plain Design | Room Darkening Curtain | Thermal Insulated Curtains for Living Room, Bedroom | (116 x 215 cm, Beige)",
        "price": "₹1,249",
        "rating": "4.1 out of 5",
        "image": "http://localhost:5000/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F71fbk-b5ObL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B06XDP2C1S",
        "affiliate": "https://www.amazon.in/dp/B06XDP2C1S/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "WARISI Cotton Kitchen Doormat| Floor Mat | Door Mat| Anti-Slip, Soft,Washable, Printed, Designer, for Floor, Kitchen, Room Offices (120L X 40W & 60L X 40W Centimetre), Rectangular (Design-1)",
        "price": "₹247",
        "rating": "3.3 out of 5",
        "image": "http://localhost:5000/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F717B9NPW78L._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0D1VCNM5F",
        "affiliate": "https://www.amazon.in/dp/B0D1VCNM5F/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "AERYS Digital Alarm Clock with Automatic Sensor, Date and Temperature Display, Compact Desk Table Clock for Students, Home, Office, Bedroom, Living Room,Home Decor, Corporate Use (Black Digital)",
        "price": "₹299",
        "rating": "3.8 out of 5",
        "image": "http://localhost:5000/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F51MctYF8BiL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0CQH5N1DY",
        "affiliate": "https://www.amazon.in/dp/B0CQH5N1DY/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Godrej aer Matic Automatic Room Fresheners Refill Pack | Violet Valley Bloom | 2200 Sprays Guaranteed | Lasts up to 60 days (210ml)",
        "price": "₹249",
        "rating": "4.3 out of 5",
        "image": "http://localhost:5000/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F71EVBYj9wNL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B07FPRB9CR",
        "affiliate": "https://www.amazon.in/dp/B07FPRB9CR/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Bisleri Water bottle with added minerals, 5 L",
        "price": "₹68",
        "rating": "4.6 out of 5",
        "image": "http://localhost:5000/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F51SZnVrmKQL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0DGY1PQDP",
        "affiliate": "https://www.amazon.in/dp/B0DGY1PQDP/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Misamo Enterprise Glass Oil Sprayer and Dispenser Bottle, 500ml Capacity, 2-in-1 Design, Black",
        "price": "₹249",
        "rating": "4.0 out of 5",
        "image": "http://localhost:5000/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F713%2B2UPOISL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0DH4WS3B4",
        "affiliate": "https://www.amazon.in/dp/B0DH4WS3B4/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Shalimar Premium (Lavender Fragrance) Scented Garbage Bags | Medium 19 X 21 Inches | 120 Bags (30 Bags X 4 Rolls) | Dustbin Bag/Trash Bag | (Black) - Perforated Box for Easy Dispensing",
        "price": "₹369",
        "rating": "4.5 out of 5",
        "image": "http://localhost:5000/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F81UM3i0sUbL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B07KT9Q54M",
        "affiliate": "https://www.amazon.in/dp/B07KT9Q54M/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "KCE Store Split AC Cover for Outdoor Unit, Heat-Insulated, Weather-Resistant Protection, Extend Lifespan, Boost Energy Efficiency",
        "price": "₹249",
        "rating": "3.7 out of 5",
        "image": "http://localhost:5000/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F71CPTDgHZ7L._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0GPQ1PLFW",
        "affiliate": "https://www.amazon.in/dp/B0GPQ1PLFW/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Wakefit 100% Waterproof Premium Cotton Mattress Protector | Breathable and Hypoallergenic Ultra Soft Fitted Bed Protector 78\"x72\" - King, Grey",
        "price": "₹761",
        "rating": "4.3 out of 5",
        "image": "http://localhost:5000/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F61sRf7oDELL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0C1S894S3",
        "affiliate": "https://www.amazon.in/dp/B0C1S894S3/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "CareFoam Memory Foam Cervical Neck Pillow | 2 Years Warranty | Pain Relief Sleep, Improves Posture Spinal Alignment, Neck Pain Relief | Queen 19 x 11 x 3.5 Inch | White Jacquard Cover | Pack of 1",
        "price": "₹598",
        "rating": "3.9 out of 5",
        "image": "http://localhost:5000/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F51iOIPuNN5L._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0DXBCP7M4",
        "affiliate": "https://www.amazon.in/dp/B0DXBCP7M4/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "TEX-RO Stainless Steel Dish Drying Rack for Kitchen with Drainer Tray & Cutlery Holder | Utensils Drying Rack & Dish Drainer Basket | Bartan Stand Steel | Large 56x43x23 cm, Chrome Finish",
        "price": "₹839",
        "rating": "4.1 out of 5",
        "image": "http://localhost:5000/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F81yYaxjauDL._AC_UL600_SR600%2C400_.jpg",
        "asin": "B0CBN7X3V1",
        "affiliate": "https://www.amazon.in/dp/B0CBN7X3V1/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Havells Airboll High Speed 450mm Wall Fan (White)",
        "price": "₹4,990",
        "rating": "4.0 out of 5",
        "image": "http://localhost:5000/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F81%2B5bbj3xeL._AC_UL165_SR165%2C165_.jpg",
        "asin": "B00B4BC9IA",
        "affiliate": "https://www.amazon.in/dp/B00B4BC9IA/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "The Earth Store Handcrafted Creme Matte Brown Ceramic Dinner Set, 30 Pieces Serving for 6, Microwave and Dishwasher Safe, Bone-Ash Free, Dinner Sets | Crockery Set for Gifting & Dining",
        "price": "₹5,899",
        "rating": "3.9 out of 5",
        "image": "http://localhost:5000/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F81cyY0ge0yL._AC_UL165_SR165%2C165_.jpg",
        "asin": "B0GKGZ7LMJ",
        "affiliate": "https://www.amazon.in/dp/B0GKGZ7LMJ/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Havells Swing 300mm Wall Mounted Fan | High-Performance, Wall Fan for Kitchen & Home, Smooth Oscillation, 100% Copper Motor | 3-Speed Control, 2-Year Warranty | (Pack of 1, Off White)",
        "price": "₹2,699",
        "rating": "4.0 out of 5",
        "image": "http://localhost:5000/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F719Lzp9EmmL._AC_UL165_SR165%2C165_.jpg",
        "asin": "B00J5ENA7C",
        "affiliate": "https://www.amazon.in/dp/B00J5ENA7C/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Havells CANDY HS Wall & Table Fan 230 mm 100% Copper Wire Motor| Watt: 60|Air Flow: 35 cmm|Speed: 2700 RPM| 2 Year Warranty(Yellow)",
        "price": "₹2,450",
        "rating": "3.6 out of 5",
        "image": "http://localhost:5000/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F61zVvj%2Bh90L._AC_UL165_SR165%2C165_.jpg",
        "asin": "B0F6BNMKMH",
        "affiliate": "https://www.amazon.in/dp/B0F6BNMKMH/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Havells Swing 400mm Wall Fan (Off White)",
        "price": "₹2,490",
        "rating": "4.0 out of 5",
        "image": "http://localhost:5000/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F41ueDbjypYL._AC_UL165_SR165%2C165_.jpg",
        "asin": "B00B4BCAVG",
        "affiliate": "https://www.amazon.in/dp/B00B4BCAVG/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Portronics Aero Breeze Portable table Fan 178mm, USB Rechargeable Fan, 3 Speed Airflow, Battery Powered Silent Operation, 4 Hours Back Up, 360° Rotatable USB Fan, BLDC Fan for Kitchen,Office,Home",
        "price": "₹949",
        "rating": "3.9 out of 5",
        "image": "http://localhost:5000/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F71OhLdT8bfL._AC_UL165_SR165%2C165_.jpg",
        "asin": "B0CQG1SBV3",
        "affiliate": "https://www.amazon.in/dp/B0CQG1SBV3/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "The Earth Store Handcrafted White Matte Brown Ceramic Dinner Set, 21 Pieces Serving for 6, Microwave and Dishwasher Safe, Bone-Ash Free, Dinner Sets | Crockery Set for Gifting & Dining",
        "price": "₹5,499",
        "rating": "4.0 out of 5",
        "image": "http://localhost:5000/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F81MWJ0bTcJL._AC_UL165_SR165%2C165_.jpg",
        "asin": "B0D1V4382S",
        "affiliate": "https://www.amazon.in/dp/B0D1V4382S/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "fancymart Artificial Plants with Pot (Pack of 2, 45 cm) – Hanging Plants for Home Decor | Fake Plants Vine Creeper for Living Room, Wall, Office & Indoor Decoration",
        "price": "₹235",
        "rating": "4.2 out of 5",
        "image": "http://localhost:5000/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F713NePqdaeL._AC_UL165_SR165%2C165_.jpg",
        "asin": "B0C1W5BKK2",
        "affiliate": "https://www.amazon.in/dp/B0C1W5BKK2/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "SPHINX White Ceramic Donut Vase, 6 Inch Modern Flower Vase for Pampas Grass, Dried Flowers, Home & Office Decor, Centerpiece, Handcrafted Gift Vase Only",
        "price": "₹178",
        "rating": "4.2 out of 5",
        "image": "http://localhost:5000/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F813Kzy7rfqL._AC_UL165_SR165%2C165_.jpg",
        "asin": "B0CQ23K1SB",
        "affiliate": "https://www.amazon.in/dp/B0CQ23K1SB/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "UHUD CRAFTS Hanging Shelves - Adjustable Rope Hanging Shelf, Wall Hanging Decor, Lightweight, Premium Wooden Shelf, Hanging Plant Shelf for Bedroom and Living Room (1 Pcs)",
        "price": "₹169",
        "rating": "4.4 out of 5",
        "image": "http://localhost:5000/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F61I3xo6idhL._AC_UL165_SR165%2C165_.jpg",
        "asin": "B09MCWZBH2",
        "affiliate": "https://www.amazon.in/dp/B09MCWZBH2/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Toy Imagine Indoor Hanging Table Tennis Trainer for Kids Age 5-14 | Door Mounted Ping Pong Game Set with 2 Rackets 6 Balls | Indoor Sports Game for Boys and Girls Home Play Activity",
        "price": "₹399",
        "rating": "3.8 out of 5",
        "image": "http://localhost:5000/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F61YYv%2BMnECL._AC_UL165_SR165%2C165_.jpg",
        "asin": "B0D4Z3FXKC",
        "affiliate": "https://www.amazon.in/dp/B0D4Z3FXKC/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Artvibes Designer Elephant Wooden Wall Hanging For Luck Properity For Home Decoration | Livingroom | Spiritual Decor Items | Wall Illustrations | Ethnic Wall Decor | Wall Art Print (WH_8506N)",
        "price": "₹189",
        "rating": "4.0 out of 5",
        "image": "http://localhost:5000/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F719UiPPxPlL._AC_UL165_SR165%2C165_.jpg",
        "asin": "B0CJLSF2T2",
        "affiliate": "https://www.amazon.in/dp/B0CJLSF2T2/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Frenchware Cutlery (Set of 12, Stainless Steel PVD Gold Spoons - 6 and Forks - 6), 100% Food Grade, Non Toxic, Anti-Rust, Dishwasher Safe, Perfect Gifting Set for All Occasions",
        "price": "₹869",
        "rating": "4.1 out of 5",
        "image": "http://localhost:5000/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F81XmWT4lUZL._AC_UL165_SR165%2C165_.jpg",
        "asin": "B0DCWDDY9H",
        "affiliate": "https://www.amazon.in/dp/B0DCWDDY9H/?tag=primeoffers02-21",
        "category": "Best Sellers",
        "region": "india"
    },
    {
        "title": "Himalaya Erina-EP Shampoo | 200 ml | Tick & Flea Control for Dogs & Cats | with Neem & Eucalyptus for Skin Health & Hygiene",
        "price": "₹226",
        "rating": "4.4 out of 5",
        "image": "http://localhost:5000/api/img?url=https%3A%2F%2Fimages-eu.ssl-images-amazon.com%2Fimages%2FI%2F51UYPTXkUhL._AC_UL165_SR165%2C165_.jpg",
        "asin": "B073RVF88P",
        "affiliate": "https://www.amazon.in/dp/B073RVF88P/?tag=primeoffers02-21",
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