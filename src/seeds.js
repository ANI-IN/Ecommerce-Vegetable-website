const mongoose = require("mongoose");
const Item = require("./models/items");

mongoose.connect("mongodb://127.0.0.1:27017/Registration").then(()=>{
    console.log(`!!Connection Successful`);
}).catch( (e)=>{
console.log(e);
})

const p = [
{
    name : "Apple",
    description : "Spoil yourself with the luscious and mouth-watering Red Delicious Apple. Red Delicious Apples are known for their distinct, smooth texture and divinely sweet crispness.",
    category: "fruit",
    quantity: 100,
    image: "css/images/green apple.jpg",
    previous_rates : "65,70,75,80,75,75",
    today: 65
},
{
    name : "Banana",
    description : "The banana may be a simple fruit, but it's surprisingly versatile.Buy it, peel it, and eat it.",
    category: "fruit",
    quantity: 100,
    image: "css/images/banana.jpg",
    previous_rates : "15,14,12,15,12,15",
    today: 15
},
{
    name : "Black Grapes",
    description : "Black grapes are small, sweet fruits — famous for their intense blueish-purple color that makes them look almost black",
    category: "fruit",
    quantity: 100,
    image: "css/images/black grapes.jpg",
    previous_rates : "56,50,50,50,50,56",
    today: 56
},
{
    name : "Cherry",
    description : "A cherry is the fruit of many plants of the genus Prunus, and is a fleshy drupe",
    category: "fruit",
    quantity: 100,
    image: "css/images/cherry.jpg",
    previous_rates : "80,75,78,72,75,80",
    today: 80
},
{
    name : "Green Grapes",
    description : "The green grape is a sweet fruit that grows in bunches. The fruit makes a popular snack, both because of its sweet flavor",
    category: "fruit",
    quantity: 100,
    image: "css/images/green grapes.jpg",
    previous_rates : "125,125,137,118,118,122",
    today: 125
},
{
    name : "Kiwi",
    description : "Kiwifruit or Chinese gooseberry is the edible berry of several species of woody vines in the genus Actinidia. The most common cultivar group of kiwifruit is oval",
    category : "fruit",
    quantity : 100,
    image: "css/images/kiwi.jpg",
    previous_rates : "340,340,330,320,320,320",
    today: 350
},
{
    name : "Mosambi",
    description : "The tastiest among the family of citrus fruits is mosambi . Also known as sweet lime, it is a sweet-sour fruit with greenish edible flesh",
    category : "fruit",
    quantity : 100,
    image: "css/images/kiwi.jpg",
    previous_rates : "40,40,40,40,40,40",
    today: 40
},
{
    name : "Musk Melon",
    description : "It is a yellow-coloured fruit with tempting sweetness and a pleasant aroma. Muskmelon is said to have its origin most likely in a region from India to Africa",
    category : "fruit",
    quantity : 100,
    image: "css/images/musk melon.jpeg",
    previous_rates : "125,122,125,125,127,127",
    today: 120
},
{
    name : "Orange",
    description : "Oranges are a type of healthy, low calorie, highly nutritious citrus fruit",
    category : "fruit",
    quantity : 100,
    image: "css/images/Orange.jpg",
    previous_rates : "55,55,40,40,40,40",
    today: 41
},
{
    name : "Papaya", 
    description : "Papayas are tropical fruit high in vitamin C and antioxidants. Certain compounds in papayas may have anticancer properties and improve heart",
    category : "fruit",
    quantity : 100,
    image: "css/images/papaya.jpg",
    previous_rates : "14,16,14,16,14,16",
    today: 24
},
{
    name : "Pear",
    description : "Pears are fruits produced and consumed around the world, growing on a tree and harvested in late summer into mid-autumn",
    category : "fruit",
    quantity : 100,
    image: "css/images/pear.jpg",
    previous_rates : "36,36,29,36,37,32",
    today: 40
},
{
    name : "Pomegranate", 
    description : "Pomegranates are low in calories and fat but high in fiber, vitamins, and minerals. Benefits include antioxidants, heart health",
    category : "fruit",
    quantity : 100,
    image: "css/images/pomegranate.jpg",
    previous_rates : "100,100,100,100,100,100",
    today: 110
},
{
    name : "Strawberry",
    description : "The fruit is widely appreciated for its characteristic aroma, bright red color, juicy texture, and sweetness. It is consumed in large quantities",
    category : "fruit",
    quantity : 100,
    image: "css/images/strawberry.jpg",
    previous_rates : "137,135,135,135,132,131",
    today: 131
},
{
    name : "Watermelon",
    description : "Watermelon is a flowering plant species of the Cucurbitaceae family and the name of its edible fruit. A scrambling and trailing vine-like plant, it is a highly cultivated fruit worldwide, with more than 1,000 varieties.",
    category : "fruit",
    quantity : 100,
    image: "css/images/watermelon.jpg",
    previous_rates : "55,54,50,50,50,45",
    today: 50
}
]

Item.insertMany(p).then(res => {
    console.log(res);
}).catch((e)=>{
    console.log(e);
})
