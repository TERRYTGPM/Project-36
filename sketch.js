var Doggo, happyDoggo,database;
var sadDog,garden,washroom;
var foodS, foodStock;
var dog, feedthedog, stockthefood;
var fedTime, lastFed, foodObj;
var gameState,readState;

function preload()
{
  Doggo = loadImage("images/dogImg.png");
  happyDoggo = loadImage("images/dogImg1.png");
}

function setup() {
  createCanvas(1000, 500);
  
  dog = createSprite(800,200,150,150 );
  dog.addImage(Doggo);
  dog.scale = "0.3";

  foodObj = new Food();

  database = firebase.database();

  foodStock = database.ref("Food");
  foodStock.on("value", readStock);

  feedthedog = createButton("Feed");
  feedthedog.position(700, 95);
  feedthedog.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(stockFood);
  
}


function draw() {  
  currentTime=hour();
  if(currentTime==(lastFed+1)){
      update("Playing");
      foodObj.garden();
   }else if(currentTime==(lastFed+2)){
    update("Sleeping");
      foodObj.bedroom();
   }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
      foodObj.washroom();
   }else{
    update("Hungry")
    foodObj.display();
   }
   
   if(gameState!="Hungry"){
     feedthedog.hide();
     addFood.hide();
     dog.remove();
   }else{
    feedthedog.show();
    addFood.show();
    
   }
  drawSprites();


}

function readStock(data){

  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function writeStock(x){

  if(x <= 0){
    x = 0;
  }else{
    x = x - 1;
  }
  database.ref('/').update({
    Food: x
  })
}

function stockFood(){
  foodS++
database.ref('/').update({
  Food: foodS
})
}

function feedDog(){
  dog.addImage(happyDoggo);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    feedTime:hour(),
        gameState:"Hungry"
  })
}

function update(state){
  database.ref('/').update({
    gameState: state
  })
}

readState