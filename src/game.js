import Phaser from "phaser";

var config = {
  type: Phaser.AUTO,
  width: 1200,
  height: 600,
  backgroundColor:'',
  parent: 'phaser-ejemplo',
  physics:{
    default:'arcade',
    arcade: {
      gravity: {y:0},
      debug: false
    }
  },
  scene:[{
    preload: preload,
    create: create,
    update: update
  }]
}

var game = new Phaser.Game(config);

var auto;
var derecha;
var izquierda;
var arriba;
var abajo;

const velocidadAuto = 500;

function preload(){
  const imageUrl = new URL("./assets/sprites/auto.png", import.meta.url);

  //this.load.path = "assets/sprites/";  
  this.load.image("auto",imageUrl.pathname);

}

function create(){
  
  auto = this.physics.add.sprite(game.config.width /2, game.config.height - 100, 'auto');

  derecha = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
  izquierda = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
  arriba = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
  abajo = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
}

function update(){
    auto.body.setVelocityX(0);
    auto.body.setVelocityY(0);

  if (izquierda.isDown) { 
    auto.body.setVelocityX(-velocidadAuto);
  }
  else if (derecha.isDown) {
    auto.body.setVelocityX(velocidadAuto);
  }
  else if (arriba.isDown) { 
    auto.body.setVelocityY(-velocidadAuto);
  }
  else if (abajo.isDown) {
    auto.body.setVelocityY(velocidadAuto);
  }
}