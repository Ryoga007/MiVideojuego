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
    update: update,
    extend: {
      generarAsteroides: generarAsteroides,
      colicionAutoAsteroide: colicionAutoAsteroide,
      actualizartexto: actualizartexto
    }
  }]
}

var game = new Phaser.Game(config);

var auto;
var derecha;
var izquierda;
var arriba;
var abajo;
var asteroides;
var texto;

const velocidadAuto = 500;
const minAteroides = 2;
const maxAsteroides = 4;
const velocidadCaida = 5;
const tiempoAparicion = 600;
const vidaAuto = 4;
const municionInicial = 100;

function preload(){

  const imageUrlAuto = new URL("../public/assets/sprites/auto.png", import.meta.url);
  const imageUrlAsteroides = new URL("../public/assets/sprites/asteroides.png", import.meta.url);

  this.load.image("auto",imageUrlAuto.pathname);
  this.load.spritesheet("asteroides",imageUrlAsteroides.pathname,{frameWidth:64,frameHeight:64});
}

function create(){
  
  auto = this.physics.add.sprite(game.config.width /2, game.config.height - 100, 'auto');
  auto.vida = vidaAuto;
  auto.municion = municionInicial;

  texto = this.add.text(10,10,'', {
    fontSize: '20px',
    fill: '#ffffff'
  }).setDepth(0,1);
  this.actualizartexto();

  asteroides = this.physics.add.group({
    defaultKey:'asteroides',
    frame:0,
    maxSice:50
  });

  this.time.addEvent({
    delay: tiempoAparicion,
    loop: true,
    callback:()=> {
      this.generarAsteroides()
    }
  });

  this.physics.add.overlap(auto, asteroides, this.colicionAutoAsteroide, null,this);

  derecha = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
  izquierda = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
  arriba = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
  abajo = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
}

function update(){
    Phaser.Actions.IncY(asteroides.getChildren(),velocidadCaida);
    asteroides.children.iterate(function(asteroide) {
      if (asteroide.y > 600) {
        asteroides.killAndHide(asteroide);
      }
    });

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

function generarAsteroides() {
  var numeroAsteroides = Phaser.Math.Between(minAteroides,maxAsteroides);
  for (let i = 0; i < numeroAsteroides; i++) {
    var asteroide = asteroides.get();
    
    if (asteroide) {
      asteroide.setActive(true).setVisible(true);
      asteroide.setFrame(Phaser.Math.Between(0,1));
      asteroide.y = -100;
      asteroide.x = Phaser.Math.Between(0,game.config.width);
      this.physics.add.overlap(asteroide, asteroides,(asteroideEnColicion)=> {
        asteroideEnColicion.x = Phaser.Math.Between(0, game.config.width);
      });
    }
    
  }
}

function colicionAutoAsteroide(auto, asteroide) {
  if (asteroide.active) {
    asteroides.killAndHide(asteroide);
    asteroide.setActive(false);
    asteroide.setVisible(false);
    if (auto.vida > 0) {
      auto.vida --;  
    }
    this.actualizartexto();
  }
}

function actualizartexto(){
  texto.setText('Vida: '+auto.vida)
}