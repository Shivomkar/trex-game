var PLAY = 1;
var END = 0;
var gameState = PLAY;
var trex, trex_running, ground, groundImage, cloudImage;
var invisibleground;
var trex_collided;
var gameoverimage,restartimage
function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png")
  groundImage = loadImage("ground2.png")
  cloudImage = loadImage("cloud.png")
  obstacle1 = loadImage("obstacle1.png")
  obstacle2 = loadImage("obstacle2.png")
  obstacle3 = loadImage("obstacle3.png")
  obstacle4 = loadImage("obstacle4.png")
  obstacle5 = loadImage("obstacle5.png")
  obstacle6 = loadImage("obstacle6.png")
  trex_collided=loadAnimation("trex_collided.png")
  gameoverimage=loadImage("gameOver.png")
  restartimage=loadImage("restart.png")
  jumpsound=loadSound("jump.mp3")
  diesound=loadSound("die.mp3")
  checkpointsound=loadSound("checkpoint.mp3")
}

function setup() {
  createCanvas(600, 200)

  //create a trex sprite
  trex = createSprite(50, 160, 20, 50)
  trex.addAnimation("running", trex_running)
  trex.addAnimation("collided",trex_collided)
  //to create edges
  edges = createEdgeSprites()
  //to add scale and position to trex
  trex.scale = 0.5;
  //create ground sprite
  ground = createSprite(200, 180, 400, 20)
  ground.addImage("ground", groundImage)
  ground.x = ground.width / 2
  gameover=createSprite(300,100)
  gameover.addImage(gameoverimage)
  restart=createSprite(300,140)
  restart.addImage(restartimage)
  gameover.scale=0.5;
  restart.scale=0.5

  ground.velocityX = -4
  //to create a invisible ground
  invisibleground = createSprite(200, 190, 400, 10)
  invisibleground.visible = false
  //to create obstacle and cloud group
  obstacleGroup = new Group();
  cloudGroup = new Group();

  // var ran=Math.round(random(10,60))
  // console.log(ran)
  //console.log("hello "+" world"+4)
  trex.setCollider("circle",0,0,40)
  trex.debug=true;
  score = 0;
}

function draw() {
  //set background colour to white
  background(180)
  text("score: " + score, 500, 50)

  console.log(trex.y)
  if (gameState === PLAY) {
    gameover.visible=false;
    restart.visible=false;
    ground.velocityX = -(4+3*score/100)
    score = score + Math.round(getFrameRate() / 60)
    if(score>0 && score%100===0){
      checkpointsound.play()
    }
    
    if (ground.x < 0) {
      ground.x = ground.width / 2
    }
    //jump when space key is pressed
    if (keyDown("space") && trex.y >= 100) {
      trex.velocityY = -10;
      jumpsound.play()
    }
    trex.velocityY = trex.velocityY + 0.5
    //call the spawn clouds
  spawnclouds()
  spawnobstacles()
  if(obstacleGroup.isTouching(trex)){
    gameState=END
    diesound.play()
  }
  }
  else if (gameState === END) {
    gameover.visible=true
    restart.visible=true
    ground.velocityX = 0
    trex.velocityY=0
    //to change trex animation
    trex.changeAnimation("collided",trex_collided)
    obstacleGroup.setLifetimeEach(-1)
    obstacleGroup.setVelocityXEach(0)
    cloudGroup.setVelocityXEach(0)
    cloudGroup.setLifetimeEach(-1)
  }

  //to make the ground appear again

  //to stop trex from falling down
  trex.collide(invisibleground)
  if(mousePressedOver(restart)){
    reset()
  }
  console.log(frameCount)
  drawSprites()
}
function reset(){
  gameState=PLAY;
  gameover.visibe=false;
  restart.visible=false;
  obstacleGroup.destroyEach();
  cloudGroup.destroyEach();
  trex.changeAnimation("running",trex_running)
  score=0
}
function spawnclouds() {
  //to spawn clouds at different locations
  if (frameCount % 60 === 0) {
    cloud = createSprite(600, 100, 40, 10)
    cloud.addImage(cloudImage)
    cloud.y = Math.round(random(10, 60))
    cloud.scale = 0.4
    cloud.velocityX = -3
    //to assign lifetime to the variable-wirth 600 pixels / velocity 3
    cloud.lifetime = 200;
    //adjust the depth
    cloud.depth = trex.depth

    trex.depth = trex.depth + 1
    //to add cloud to the group
    cloudGroup.add(cloud)
  }
}

function spawnobstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(600, 165, 10, 40)
    obstacle.velocityX = -(6+score/100)
    var rand = Math.round(random(1, 6))
    switch (rand) {
      case 1:
        obstacle.addImage(obstacle1);
        break;
      case 2:
        obstacle.addImage(obstacle2);
        break;
      case 3:
        obstacle.addImage(obstacle3);
        break;
      case 4:
        obstacle.addImage(obstacle4);
        break;
      case 5:
        obstacle.addImage(obstacle5);
        break;
      case 6:
        obstacle.addImage(obstacle6);
        break;
      default:
        break;
    }
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //to add each obstacle to the group
    obstacleGroup.add(obstacle)
  }
}