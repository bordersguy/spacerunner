//To Do

//Create more enemies: 
//  - every level will have a variation of the virus ufo 
//  - every level will also have it's own unique enemy
//Create more planets:  
//Create planet effects
//  -ice, fire, junk, rock, grubs, water, energy, crystal, destroyed planet
//  -freeze, more damage, ?, base, more enemies, ?, ?, ?
//Add powerups: shield, extra life, 
//Add variety to platforms for different levels
//  - disappearing platforms
//  - up and down platforms
//  - damage dealing platforms
//Extra points for longer words
//Grab a letter 50 points....delete a letter 40 points
//Change score to represent collected energy
//Time is represented by oxygen
//On bounce jump....walking animation pops up just for a millisecond...fix it
//Destroy dropping virus if it never hits anything
//Fix up runner ship
//update ready to play button
//jump sometimes is just a short jump after jumping



//Working on Now:
//


var panel;
var player;
var playerCameraFollow;
var platforms;
var platforms2
var platformType;
var groundType;
var cursors;
var ground;
var ground2;
var singleGround;
var ledge;
var currentHeight;
var hitPlatform
var planet;
var background;
var asteroidType = ["asteroid", "asteroidFire", "asteroidIce", "asteroidEnergy"];
var energyText
var energyCount = 0;

var bubbles;
var score = 0;
var scoreText;

var timer;
var total;
var timeText;

var timer2;
var timer3;

var emitter;
var emitter2;
var emitter3;
var emitter4;

var letterText;
var consonants = ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M',
                'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z'];
                
var vowels = ['A', 'E', 'I', 'O', 'U'];

var letter;
var scoreWord;

var introText;
var finalPoint;

var directions;
var leftButton;
var leftClick;
var rightButton;
var rightClick;
var jumpButton1;
var jumpButton2;
var jumpClick;

var isDead = false;
var gameStarted = false;
var enemyCreated = false;
var planetCreated = false;
var enemyGroup;
var ufo;
var ufoStart;
var ufoHit;
var droppingVirus;
var delayTimer;
var totalEnemies = 0;
var playerHit;
var platformHit;
var slideTime = 0;
var slideWait = false;
var makeBubble = true;
var latCollisionUFO;
var longCollisionUFO;
var ufoGroup;
var playerCollisionPanel;
var playerRollingCollisionPanel;
var playerGroup;
var intersects1;
var intersects2;
var checkCollision = false;
var collisionCounter = 0;
var collectedLetters;
var collectedText;
var keyX;
var keyC;
var keyZ;
var rock;
var dictionary = [];
var asteroidGroup;
var asteroidCreated = false;

var planetList;

var fpsText;
var teleportIn;
var teleportOut;
var teleportLoading = false;
var teleportLoadingBar;


var lifeBar;

//var wordKeyCloud;
var foundWordCloud;
var cloudUp = false;
var hitPlayer = false;

var lives = 3;
var teleports = 3;
var playerReset = false;
var wormHoles;
var playerLife;
var cameraFollow = false;
var cameraLerping = false;

var bounceOff = false;
var tryAgainButton;
var newMissionbutton;
// var inverted = false;
// var jumpDelay = false;
// var gravitySwitch = 0;

var playState = {
 
create: function () {
    
    this.game.world.setBounds(0, 0, 1200, 1200);
    //this.game.time.advancedTiming = true; 

    cursors = this.game.input.keyboard.createCursorKeys();
    
    SetupDictionary();
    
    background = this.game.add.sprite(0,0, 'spaceBackground');
    //background.alpha = 0;
    
    CreatePlanet();
   
    SetUpBubbles();

    CreatePlatforms();
    currentHeight = this.game.world.height - 250;
    CreatePlatforms2();
    CreatePlatforms3();

    CreateIntroText();
 
    CreatePlayer();
    
    CreateBars();
    
    enemyGroup = this.game.add.group();
    asteroidGroup = this.game.add.group();
    collectedLetters = this.game.add.group();
    
    //score
    var scoreImage = this.game.add.sprite(16, 16, asteroidType[this.game.pickPlanet]);
    scoreImage.scale.setTo(.60, .60);
    scoreImage.fixedToCamera = true;
    scoreText = this.game.add.text(55, 16, ':00',{fontSize: '32px', fill: 'yellow'});
    scoreText.fixedToCamera = true;
    
    //energy
    var energyImage = this.game.add.sprite(250, 16, "energyCount");
    energyImage.scale.setTo(.60, .60);
    energyImage.fixedToCamera = true;
    energyText = this.game.add.text(285, 16, ':00',{fontSize: '32px', fill: 'yellow'});
    energyText.fixedToCamera = true;
    // fpsText = this.game.add.text(1000, this.game.world.height - 584, this.game.time.fps,{fontSize: '32px', fill: 'yellow'});
    // fpsText.fixedToCamera = true;
    
    
    //timer
    timer = this.game.time.create(false);
    timer2 = this.game.time.create(false);
    timer3 = this.game.time.create(false);
    delayTimer = this.game.time.create(false);
    delayTimer.start();

    total = 180;
    timeText = this.game.add.text(600, 16, 'time: 180',{fontSize: '32px', fill: 'yellow'});
    timeText.fixedToCamera = true;
    
    
    timer.loop(1000, UpdateCounter, this);
    //timer.loop(1000, CheckFPS, this);
    SetUpEmitters();

    //directions = this.game.add.sprite(this.game.world.centerX - 125, this.game.world.height - 200, 'directions');
    
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  
    this.scale.setScreenSize( true );

    keyZ = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);
    keyX = this.game.input.keyboard.addKey(Phaser.Keyboard.X);
    keyC = this.game.input.keyboard.addKey(Phaser.Keyboard.C);
    
    keyZ.onDown.add(Teleport, this);
    keyX.onDown.add(DeleteLetter, this);
    keyC.onDown.add(SubmitWord, this);
    
},

update: function() {
    
    if (isDead == false) {
        
   
        if (typeof player !== "undefined") {
            
            if ((teleportLoadingBar.width < 10 || player.alpha < .6) && cameraLerping == false && gameStarted == true) {
    
                var lerpCamera = this.game.add.tween(this.game.camera).to( { x: player.x, y: player.y}, 1000, Phaser.Easing.Bounce.Out, true);
                lerpCamera.onComplete.add(CameraLerpOff, this);
                cameraLerping = true;
                
            } else if (teleportLoadingBar.width >= 10) {
                
                this.game.camera.focusOnXY(player.x, player.y + 100);    
                
            }
    
        }
        
        hitPlatform = this.game.physics.arcade.collide(player, platforms);
        this.game.physics.arcade.collide(bubbles, platforms);
        this.game.physics.arcade.collide(bubbles,bubbles);
        this.game.physics.arcade.overlap(player, bubbles, CollectBubble, null, this);
        this.game.physics.arcade.collide(droppingVirus, bubbles, DestroyBubble, null, this);
        this.game.physics.arcade.collide(ufo, bubbles, DestroyBubble, null, this);
        this.game.physics.arcade.collide(droppingVirus, platforms, DestroyPlatformVirus, null, this);
       
        if (collisionCounter == 3) {
            
            checkCollision = true;
            
        } else {
            
            checkCollision = false;
            
        }
        
       if (checkCollision == true && playerReset == false) {
            
            var currentPanel;
            if (player.animations.currentAnim.name !== null) {
                
                if (player.animations.currentAnim.name == "rolling") {
                
                currentPanel = playerRollingCollisionPanel;
                
                } else {
                    
                    currentPanel = playerCollisionPanel;
                    
                }
                
                if (this.checkOverlap(currentPanel, latCollisionUFO) || 
                    this.checkOverlap(currentPanel, longCollisionUFO)) {
                    
                    PlayerHit(20, ufo);
                    //ChangeScore(100);
           
                }
                
                if (this.checkOverlap(currentPanel, droppingVirus)) {
                    
                    PlayerHit(20, droppingVirus);
                    
                }
                
            }
        
        }
        
     
        //CheckInverted();
        
        CheckEnemy();
        
        CheckJump();
        
        CheckShortJump();
    
        CheckFallingDown();
        
        CheckBackwards();

        MoveEnemy();
        
        MovePlayer();
        
        MovePlatforms();
    
        CheckFellDown();
      
        DestroyPlatforms();
        
        MakeBubbles();
        
        MakeBackgroundAsteroids();
        
        CheckTeleport();
        
        CheckLife();
        
        MovePlanet();
        
       // CheckCamera();
       
    }
    
    

},

checkOverlap: function(spriteA, spriteB) {

        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();

        return Phaser.Rectangle.intersects(boundsA, boundsB);

}

  
};

function CameraLerpOff() {
    
    RunDelay(SetToFalse, 500, "cameralerp");
    
    
}

// function CheckFPS() {
    
//     fpsText.setText(this.game.time.fps);
    
// }

function ChangeScore(changeEnergy, changeCount) {
    
    score += changeCount;
    if (score < 0) {
        
        score = 0;
        
    }
    scoreText.text = " : " + score;
    
    
    energyCount += changeEnergy;
    if (energyCount < 0) {
        
        energyCount = 0;
        
    }
    
    energyText.text = " : " + energyCount;
}

// function CheckCamera() {
    
//     if (player.y < 0) {
        
//         this.game.camera.follow(player);
        
//     } else {
        
//         this.game.camera.target = null;
//     }
    
// }

function CheckBackwards() {
    
    if ((cursors.left.isDown && player.body.velocity.y !== 0) || (leftClick == true && player.body.velocity.y !== 0))
    {
        player.body.velocity.x = -50;
        player.animations.play('left');
    }
}

function CheckEnemy() {
    
    if (total % 25 == 0 && enemyCreated == false && isDead == false) {
        
        if (totalEnemies > 0) {
            
            ufoGroup.destroy();
            collisionCounter -= 2;
            ufoHit = false;
            
        }
        
        CreateUfo();
        enemyCreated = true;
        
        RunDelay(SetToFalse, 1500, "ufo");
    } 
    
    if (total % 11 == 0 && enemyCreated == false && isDead == false && gameStarted == true) {
        
        CreateDroppingVirus();
        enemyCreated = true;
        
        RunDelay(SetToFalse, 1000, "ufo");
    } 
    

}

function CheckFallingDown() {
    
    if (!hitPlatform && cursors.up.isUp && player.body.velocity.y > 0) {
        
        player.body.gravity.y = 900;
        player.body.velocity.x = 0;
   
    }
}

function CheckFellDown() {
    
    if (player.y > this.game.world.height + 100 && isDead == false) {
        
        lifeBar.width = 0;

    }
    
    // if (player.y < -500 && isDead == false && inverted == true) {
        
    //     lifeBar.width = 0;

    // }
}

function CheckJump() {
    
    if (cursors.up.isDown && player.body.touching.down && hitPlatform|| jumpClick == true && hitPlatform )
    {
        player.body.velocity.y = -450;

    } 
    
    // if (cursors.up.isDown && player.body.touching.up && hitPlatform && inverted == true && jumpDelay == false|| jumpClick == true && hitPlatform )
    // {
    //     player.body.velocity.y = 450;

    // } 
    
    if (hitPlatform && player.body.touching.down) {
        
        bounceOff = false;
        
    }
    
    if (player.body.touching.up && hitPlatform) {
        
        bounceOff = true;
        
    }
    
    // if (player.body.touching.up && hitPlatform && inverted == false) {
        
    //     //bounceOff = true;
    //     inverted = true;
    //     player.body.velocity.y = 0;
    //     jumpDelay = true;
    //     gravitySwitch = 1;
        
    //     RunDelay(SetToFalse, 250, "jumpDelay");
        
    // } else if (player.body.touching.down && hitPlatform && inverted == true) {
        
    //     inverted = false;
    //     player.body.velocity.y = 0;
    //     jumpDelay = true;
    //     gravitySwitch = 2;
        
    //     RunDelay(SetToFalse, 250, "jumpDelay");
        
    // }
    
    if (bounceOff) {
        
        player.animations.play('rolling');
        
    }
}

// function CheckInverted() {
    
//     if (gameStarted == true) {
        
//         if (inverted == true && gravitySwitch == 1) {
        
//             player.body.gravity.y = -300;
//             player.scale.setTo(-1, -1);
//             player.anchor.setTo(.5, 0);
//             gravitySwitch = 0;
            
            
            
//         } else if (inverted == false && gravitySwitch == 2) {
            
//             player.body.gravity.y = 300;
//             player.scale.setTo( 1, 1);
//             player.anchor.setTo(.5, 1);
//             gravitySwitch = 0;
            
//         }
        
//     }

    
    
// }

function CheckLife () {
    
    if (lifeBar.width < 1 && isDead == false) {
        
        if (lives > 0) {
            
            playerLife.getChildAt(playerLife.length - 1).destroy();
            lifeBar.width = 100;
            lives -= 1;
            
            WarpIn();
  
            
        } else if (lives <= 0 && isDead == false) {
            
            GameOver();
                
        }
        
        
    } 
    
}

function CheckShortJump() {
    
    if (cursors.up.isUp && player.body.velocity.y < 0) {
        
        player.body.gravity.y = 700;
        
        
    } 
}

function CheckTeleport() {
    
    if (teleportLoading == true || (teleports == 0 && teleportLoadingBar.width < 101)) {
        
        teleportLoadingBar.width += .25;
        
        if (teleportLoadingBar.width >= 100) {
            
            teleportLoading = false;
            
        }
        
        
    }
    
}

function CollectBubble (player, bubble) {
    
    if (isDead == false) {
        
        if (this.game.gameType == 1) {
            
           
            if (bubble.children[0].name == "letterText") {
                
               //nothing needed here. Just a placeholder.
                
                
            } else if (bubble.children[0].name == "extraHealth") {
                    
                lifeBar.width += 20;
                
                if (lifeBar.width > 100) {
                    
                    lifeBar.width = 100;
                    
                }
                    
            } else if (bubble.children[0].name == "extraTeleport") {
                    
                if (teleports < 4) {
                    
                    var worms = wormHoles.create(teleportLoadingBar.x + (wormHoles.length * 36), 16 + 25, 'wormHoles');    
                    worms.fixedToCamera = true;
                    teleports += 1;
                
                    if (teleports == 1) {
                    
                        teleportLoadingBar.width = 100;
                        teleportLoadingBar.alpha = 1;
                    
                    }
                }
            }
    
                DiamondBurst(bubble.x, bubble.y);
                StarBurst(bubble.x, bubble.y);
                
                bubble.kill();
                
                ChangeScore(50, 1);
            
            
            
        }
        
        if (this.game.gameType == 2) {
            
            if (collectedLetters.length < 9) {
            
            if (bubble.children[0].name == "letterText") {
                
                rock = collectedLetters.create((collectedLetters.length * 55) + 30, 60, 'letterJar');
                rock.fixedToCamera = true;
                
                var getLetter = bubble.children[0].text;
                
                var style = { font: "28px impact", fill: "#00ff00", 
                            wordWrap: true, wordWrapWidth: bubble.width,
                            align: "center", backgroundColor: "transparent" };
                    
                collectedText = this.game.add.text(16, 12, getLetter, style );
                
                rock.addChild(collectedText);
                
                var submittedWord = "";
            
                collectedLetters.forEach(function (child) {
            
                    submittedWord += child.getChildAt(0).text.toLowerCase();
               
                });
            
                MakeWordCloud(submittedWord);
                
                
            } else if (bubble.children[0].name == "extraHealth") {
                
                lifeBar.width += 20;
                
                if (lifeBar.width > 100) {
                    
                    lifeBar.width = 100;
                    
                }
                
            } else if (bubble.children[0].name == "extraTeleport") {
                
                if (teleports < 4) {
                    
                    var worms = wormHoles.create(teleportLoadingBar.x + (wormHoles.length * 36), 16 + 25, 'wormHoles');    
                    worms.fixedToCamera = true;
                    teleports += 1;
                
                    if (teleports == 1) {
                    
                        teleportLoadingBar.width = 100;
                        teleportLoadingBar.alpha = 1;
                    
                    }
                }
            }

            DiamondBurst(bubble.x, bubble.y);
            StarBurst(bubble.x, bubble.y);
            
            bubble.kill();
            
            ChangeScore(50);
 
        }
            
        }
   
    }
}

function CreateBars() {
    
    //These are set to the camera....so I can't use world height
    
    teleportLoadingBar = this.game.add.sprite(1050, 16, "teleportLoadingBar");
    teleportLoadingBar.fixedToCamera = true;

    
    var barFrame1= this.game.add.sprite(1042, 16, "barFrame");
    barFrame1.fixedToCamera = true;
   
   
    wormHoles = this.game.add.group();
    
    
    for (var i = 0; i < teleports; i++) {
        
        var worms = wormHoles.create(teleportLoadingBar.x + (i * 36), teleportLoadingBar.y + 25, 'wormHoles');    
        worms.fixedToCamera = true;
    }
    
    
    lifeBar = this.game.add.sprite(900, 16, "lifeBar");
    lifeBar.fixedToCamera = true;
    
    var barFrame2 = this.game.add.sprite(892, 16, "barFrame");
    barFrame2.fixedToCamera = true;
    
    playerLife = this.game.add.group();
    //playerLife.fixedToCamera = true;
    
    for (var i = 0; i < lives; i++) {
        
        var aliens = playerLife.create(lifeBar.x + (i * 30), lifeBar.y + 25, 'playerLife');    
        aliens.fixedToCamera = true;
    }
}

function CreateIntroText() {
    
    introText = this.game.add.text(300, this.game.world.height - 400,
    'Hit the space debris to collect supplies.\n"Z" to ememergency warp.\n Up Arrow to jump...hold for a long jump.\n Click here to start!',
    {fontSize: '60px', fill: 'yellow', align: 'center',
    backgroundColor: '#fff'});
    
    introText.inputEnabled = true;
    introText.events.onInputDown.add(StartGame, this);
}

function CreatePlanet() {

    planetList = ["planetBrown", "planetRed", "planetIce", "planetEnergy"];
    //pickPlanet = Math.floor(Math.random() * planetList.length);

    planet = this.game.add.sprite(1000, this.game.world.height - 400, planetList[this.game.pickPlanet]);
    //planetCreated = true;

    // this.game.physics.arcade.enable(planet);
    // planet.body.gravity.y = 0;
    // planet.body.collideWorldBounds = false;
    // planet.body.velocity.x = -25;

    //planet.bringToTop();    
    this.game.world.sendToBack(planet);
    this.game.world.sendToBack(background);
}

function CreatePlatforms() {
    //sets up platforms
    platforms = this.game.add.group();
    platforms2 = this.game.add.group();
    platforms2.enableBody = true;
    platforms2.kinematic = true;
    platforms.enableBody = true;
    platforms.kinematic = true;
    ground = platforms.create(0, this.game.world.height - 64, 'ground');
    ground.scale.setTo(3,3);
    ground.body.immovable = true;
    
    if (this.game.pickPlanet == 3) {
        
        platformType = 0;
        groundType = 7;
        
    } else if (this.game.pickPlanet == 2) {
        
        platformType = 4;
        groundType = 5;
        
    } else if (this.game.pickPlanet == 1 || this.game.pickPlanet == 0) {
        
        platformType = 7;
        groundType = 2;
        
    }

}

function CreatePlatforms2() {
    
    //floating platforms
    var heightAdjustment = Math.floor((Math.random() * 90) + 1);
    var negativePositive = Math.floor((Math.random() * 2) + 1);
    
    if (isDead == false) {
        
        if (currentHeight >= this.game.world.height - 300 && currentHeight < this.game.world.height - 400) {
            
        if (negativePositive == 1) {
                
            heightAdjustment = heightAdjustment * -1; 
                
        } 
        
        } else if (currentHeight < this.game.world.height - 300) {
                
            heightAdjustment = heightAdjustment * -1;
       
        }
        
         //console.log('pt = ' + platformType);
        
        var groundLength = Math.floor((Math.random() * platformType) + 2);
        
        for (var i = 0; i < groundLength; i++) {
            
            ground = platforms.create(1500 + (i * 78), currentHeight - heightAdjustment, 'singleGround');
            ground.scale.setTo(3,3);
            ground.body.immovable = true;
            
        }
    
        currentHeight = currentHeight - heightAdjustment;
        
    }
}

function CreatePlatforms3() {
    
    //these are for a pseudo ground
    var groundLength = Math.floor((Math.random() * groundType) + 1);
    
        
    for (var i = 0; i < groundLength; i++) {
    
        ground = platforms.create(1800 + (i * 78),this.game.world.height - 50, 'singleGround');
        ground.scale.setTo(3,3);
        ground.body.immovable = true;
        
    }

}

function CreatePlayer() {
    
    playerGroup = this.game.add.group();
    
    player = playerGroup.create(-100, this.game.world.height - 135, 'dude');  
    
    this.game.physics.arcade.enable(player);
    player.anchor.setTo(.5, 1);
    
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = false;
    player.body.moves = false;
    
    player.animations.add('left', [0,1,2,3,4,5,6,7,8,9,10,11,12,13], 20, true);
    player.animations.add('right', [14,15,16,17,18,19,20,21,22,23,24,25,26,27], 20, true);
    player.animations.add('rolling', [29, 30, 31, 32], 26, true);
    player.animations.add('shortJump', [28], 1, true);
    player.animations.add('stand', [33], 1, true);
    
    playerCollisionPanel = playerGroup.create(-15, -60, "playerCollisionPanel");
    playerRollingCollisionPanel = playerGroup.create(-15, -30, "playerRollingCollisionPanel");
    

    player.addChild(playerCollisionPanel);
    player.addChild(playerRollingCollisionPanel);
    collisionCounter += 1;
    
}

function CreateUfo() {
    
    totalEnemies += 1;
    ufoGroup = this.game.add.group();

    ufo = ufoGroup.create(1400, player.y, "ufo");
    this.game.physics.arcade.enable(ufo);
    ufo.body.gravity.y = 0;
    ufo.body.collideWorldBounds = false;
    ufo.body.velocity.x = -250;
    ufo.body.velocity.y = 50;
    ufoStart = ufo.y;
    
    ufo.animations.add('flying');
    ufo.animations.play('flying', 24, true);

    latCollisionUFO = ufoGroup.create(40, 15, 'latCollisionUFO');
    longCollisionUFO = ufoGroup.create(10, 50, 'longCollisionUFO');
    
    collisionCounter += 2;

    ufo.addChild(latCollisionUFO);
    ufo.addChild(longCollisionUFO);


}

function CreateDroppingVirus(argument) {
    
    droppingVirus = enemyGroup.create(player.x + 300, player.y - 300, "droppingVirus");
    
    this.game.physics.arcade.enable(droppingVirus);
    droppingVirus.body.gravity.y = 0;
    droppingVirus.body.velocity.y = 200;
    droppingVirus.body.collideWorldBounds = false;
    //console.log("x = " + droppingVirus.x + " y = " + droppingVirus.y);
    droppingVirus.animations.add('falling', [0,1,2,3,4,5,6,7,8,9,10,11,12], 12, true);
    droppingVirus.animations.play('falling');
    
    droppingVirus.alpha = 0;
    droppingVirus.scale.setTo(.1, .1);
    
    this.game.add.tween(droppingVirus).to( { alpha: 1.0 }, 2000, null, true);
    this.game.add.tween(droppingVirus.scale).to({ x: 1, y: 1}, 2000, null, true);
    

    
}

function DeleteLetter() {
    
    if (this.game.gameType == 2) {
        
        if (collectedLetters.length > 0) {
        
            ChangeScore(-50, -1);
            collectedLetters.getChildAt(collectedLetters.length - 1).destroy();
    
        }
        
        var submittedWord = "";
        
        collectedLetters.forEach(function (child) {
        
            submittedWord += child.getChildAt(0).text.toLowerCase();
           
        });
            
        
        MakeWordCloud(submittedWord);
        
    }

    
    
}

function DestroyBubble (virus, bubble) {
    
    if (isDead == false) {
    
        bubble.kill();
        DiamondBurst(bubble.x, bubble.y);
        StarBurst(bubble.x, bubble.y);
        
    }
}

function DestroyPlatforms() {
 
    for (var i = 0; i < platforms.children.length; i++) {
        
        if (platforms.children[i].x < -1200) {

            platforms.children[i].destroy();
   
        }
    }
}

function DestroyPlatformVirus(virus, thisPlatform) {
 
 
    GroundBurst(thisPlatform.x, thisPlatform.y);
    this.game.add.tween(virus).to( { alpha: 0. }, 2000, null, true);
    var virusScale = this.game.add.tween(virus.scale).to({ x: .1, y: .1}, 2000, null, true);
    
    virusScale.onComplete.add(function () {    virus.destroy();   }, this);
    
    
    thisPlatform.destroy();
    //virus.destroy();
      
}

function DestroyThis(toDestroy) {
    
    toDestroy.destroy();
    
}

function DiamondBurst(x,y){
    
    emitter.x = x;
    emitter.y = y;
    
    emitter.start(true, 2000, null, 30);
    
    emitter2.x = x;
    emitter2.y = y;
    emitter2.start(true, 3000, null, 10);
    
}

function FoundWord(foundWord) {
    
    if (this.game.gameType == 2) {
        
        console.log("foundWord = " + foundWord);
        var points = 200;
        foundWord = foundWord.toUpperCase();
        
        if (foundWord == this.game.wordKey) {
            
            points = 400;
            
            for (var i = 0; i < this.game.wordKeys.length; i++) {
                
                
                if (foundWord == this.game.wordKeys[i]) {
                    
                    
                    this.game.wordKeysFound[i] = true;
                    var newFoundValue = "";
                    
                    for (var i = 0; i < this.game.wordKeys.length; i++) {
                        
                        newFoundValue += this.game.wordKeysFound[i] + " ";
                        
                    }
                    
                    this.localStorage.setItem("foundWords", newFoundValue);
                    console.log("foundwords from play = " + this.localStorage.getItem("foundWords"));
                    
                }
                
            }
            
        }
        
        collectedLetters.forEach(function (child) {
            
            ChangeScore(points, 1); 
            collectedLetters.getChildAt(collectedLetters.length - 1).destroy();
            
        });
        
    }

    
}

function GameOver(){
    
    isDead = true;
    
    player.body.moves = false;

    // bubbles.forEach(function (child) {
        
    //     child.body.enableBody = false;
        
    // });
    
    // asteroidGroup.forEach(function (child) {
        
    //     child.body.enableBody = false;
        
    // });
    
    timer.stop();
    
    pointTotal();
    
    tryAgainButton = this.game.add.button (panel.x + -100, panel.y + 100, 'tryAgainButton', Start, this, 2,1,0);
    
    tryAgainButton.anchor.setTo(0.5);
    tryAgainButton.fixedToCamera = true;
    
    newMissionbutton = this.game.add.button (panel.x + 100, panel.y + 100, 'newMissionButton', Start, this, 2,1,0);
    
    newMissionbutton.anchor.setTo(0.5);
    newMissionbutton.fixedToCamera = true;
    
//   for (var i = 0; i < platforms.children.length; i++) {
        
//         platforms.children[i].enableBody = false;
        
//     }
    
    player.kill();
    
    makeBubble = true;

}

function JumpUp(){
    jumpClick = true;
 
}

function MakeBackgroundAsteroids() {
    
    if (total % 8 == 0 && asteroidCreated == false && gameStarted == true && isDead == false) {
        
        //var asteroidList = ["largeAsteroid", "asteroidFireLarge", "asteroidIceLarge", "asteroidEnergyLarge"];
        
        //var pickAsteroid = Math.floor(Math.random() * asteroidList.length);
        var asteroidY = Math.floor(Math.random() * 600) + 50;
        var asteroidAVY = Math.floor(Math.random() * 25) + 5;
        var asteroidVX = Math.floor((Math.random() * 100) + 25) * -1;

        var asteroid = asteroidGroup.create(1400, asteroidY, asteroidType[this.game.pickPlanet]);
        asteroid.scale.setTo(Math.floor((Math.random() * 90) + 35)/100);
        
        this.game.physics.arcade.enable(asteroid);
        
        asteroid.anchor.setTo(0.5, 0.5);
        
        asteroid.body.gravity.y = 0;
        asteroid.body.collideWorldBounds = false;

        asteroid.body.velocity.x = asteroidVX;
        asteroid.body.angularVelocity = asteroidAVY;
        asteroidCreated = true;
    
        RunDelay(SetToFalse, 1000, "asteroid");
        
      
        this.game.world.sendToBack(asteroidGroup);
        this.game.world.sendToBack(planet);
        this.game.world.sendToBack(background);
        
    } 
}

function MakeBubbles() {
 
    if (makeBubble == false) {
        
        if (this.game.gameType == 1) {
            
             var asteroidType = ["asteroid", "asteroidFire", "asteroidIce", "asteroidEnergy"];
            //var pickCon = consonants[Math.floor(Math.random() * consonants.length)];
            //var pickCon = this.game.wordKey[Math.floor(Math.random() * this.game.wordKey.length)];    
            //var pickVow = vowels[Math.floor(Math.random() * vowels.length)];  
            var upDown = Math.floor(Math.random() * 2);
            
            if (upDown == 0) {
     
                upDown = Math.floor(Math.random() * 100);
                
            } else {
                
                upDown = Math.floor(Math.random() * -100);
      
            }
            
            var bubble = bubbles.create(1400, player.y - upDown, asteroidType[this.game.pickPlanet]);
            //var pickLetter;
            var inside = Math.floor(Math.random() * 20) + 1;
     
            bubble.anchor.setTo(0.5, 0.5);
            bubble.body.gravity.setTo(0,0);
            bubble.body.bounce.setTo(0.7 + Math.random() * 0.2, 0.7 + Math.random() * 0.2);
            bubble.body.velocity.setTo(-100, 5);
            bubble.body.angularVelocity = 50;
            
            if (inside <= 18) {
                
                
                var style = { font: "28px arial", fill: "white", 
                wordWrap: true, wordWrapWidth: bubble.width,
                align: "center", backgroundColor: "transparent" };
                
           
                letterText = this.game.add.text(6, 0, "", style );
                letterText.anchor.setTo(0.5,0.5);
                letterText.name = "letterText";
                bubble.addChild(letterText);
                
            } 

            if (inside == 19) {
                
                var extraHealth = this.game.add.sprite(0, 0, "extraHealth");
                extraHealth.name = "extraHealth";
                extraHealth.anchor.setTo(.5,.5);
                bubble.addChild(extraHealth);
                
            } else if (inside == 20) {
                
                var extraTeleport = this.game.add.sprite(0, 0, "wormHoles");
                extraTeleport.name = "extraTeleport";
                extraTeleport.anchor.setTo(.5,.5);
                bubble.addChild(extraTeleport);
                
            }
    
            makeBubble = true;
            RunDelay(SetToFalse, 2000, "bubble");
            
        }
        
        if (this.game.gameType == 2) {
            
             var asteroidType = ["asteroid", "asteroidFire", "asteroidIce", "asteroidEnergy"];
            //var pickCon = consonants[Math.floor(Math.random() * consonants.length)];
            var pickCon = this.game.wordKey[Math.floor(Math.random() * this.game.wordKey.length)];    
            var pickVow = vowels[Math.floor(Math.random() * vowels.length)];  
            var upDown = Math.floor(Math.random() * 2);
            
            if (upDown == 0) {
     
                upDown = Math.floor(Math.random() * 100);
                
            } else {
                
                upDown = Math.floor(Math.random() * -100);
      
            }
            
            var bubble = bubbles.create(1400, player.y - upDown, asteroidType[this.game.pickPlanet]);
            var pickLetter;
            var inside = Math.floor(Math.random() * 20) + 1;
     
            bubble.anchor.setTo(0.5, 0.5);
            bubble.body.gravity.setTo(0,0);
            bubble.body.bounce.setTo(0.7 + Math.random() * 0.2, 0.7 + Math.random() * 0.2);
            bubble.body.velocity.setTo(-100, 5);
            bubble.body.angularVelocity = 50;
            
            if (inside <= 18) {
                
                var pickColor = ["#00ff00", "#00ff00", "#2a4c1e"];
                var style = { font: "28px arial", fill: pickColor[this.game.pickPlanet], 
                wordWrap: true, wordWrapWidth: bubble.width,
                align: "center", backgroundColor: "transparent" };
                var conOrVow = Math.floor(Math.random() * 10) + 1;
            
                if (conOrVow < 6) {
                
                    pickLetter = pickCon;
                
                } else {
                
                pickLetter = pickVow;
                
                }
                
                letterText = this.game.add.text(6, 0, pickLetter, style );
                letterText.anchor.setTo(0.5,0.5);
                letterText.name = "letterText";
                bubble.addChild(letterText);
                
            } else if (inside == 19) {
                
                var extraHealth = this.game.add.sprite(0, 0, "extraHealth");
                extraHealth.name = "extraHealth";
                extraHealth.anchor.setTo(.5,.5);
                bubble.addChild(extraHealth);
                
            } else if (inside == 20) {
                
                var extraTeleport = this.game.add.sprite(0, 0, "wormHoles");
                extraTeleport.name = "extraTeleport";
                extraTeleport.anchor.setTo(.5,.5);
                bubble.addChild(extraTeleport);
                
            }
    
            makeBubble = true;
            RunDelay(SetToFalse, 2000, "bubble");
            
        }
        
   
        
    }
}

function MakeWordCloud(checkThis) {
    
    if (this.game.gameType == 2) {
        
        var noWord = true;
        
        for (var i = 0; i < dictionary.length; i++) {
        
            if (dictionary[i].trim() == (checkThis)) {
                
                noWord = false;
                
                if (cloudUp == true) {
                    
                    foundWordCloud.destroy();
                    
                }
                
                if (checkThis == this.game.wordKey) {
                    
                    foundWordCloud = this.game.add.sprite(30, 60, "wordKeyCloud");    
                    
                } else {
                    
                    foundWordCloud = this.game.add.sprite(30, 60, "foundWordCloud");
                    
                }
                
                foundWordCloud.width = checkThis.length * 55;
                foundWordCloud.fixedToCamera = true;
                cloudUp = true;
            } 
        }
        
        if (noWord == true && cloudUp == true) {
            
            foundWordCloud.destroy();
            
        }
        
        
    }

    
}

function MoveEnemy() {
    
    if (typeof ufo !== "undefined" && ufoHit == false) {
        
        if (ufo.y > ufoStart + 50) {
        
            ufo.body.velocity.y = -100;
        
        } else if (ufo.y < ufoStart - 50) {
        
            ufo.body.velocity.y = 100;
        
        } 
        
    }
}

function MoveLeft(){
    leftClick = true;
    
}

function MovePlanet() {
    
    planet.x -= .05;
    
}

function MovePlatforms() {
    
    if (gameStarted == true && player.body.moves == true) {
    
        platforms.x -= .01;
        platforms2.x -= .01;
    } 

}

function MovePlayer() {

   if (player.body.velocity.y < 0 && !cursors.left.isDown) {
        
        player.body.velocity.x = 0;
        
        if (cursors.up.isDown) {
            
            player.animations.play("rolling");
                
        } else {
            
            player.animations.play('shortJump');
            
        }
        

        
    } else if (player.body.velocity.y == 0) {
        
        if (gameStarted == true) {
            
            player.body.gravity.y = 300;
            
            if (!cursors.down.isDown) {
                    
                player.animations.play('right');
                
            }

            if (player.x < 300) {
                
                 player.body.velocity.x = 350;
                
            } else if (player.x >= 300 && player.x <= 800) {
                
                 player.body.velocity.x = 275;
                
            } else if (player.x > 800 ) {
                
                
                player.body.velocity.x = 150;
                
            }

            if (cursors.down.isDown) {
                
                 player.animations.play('rolling');
            }
                // if (slideTime > 60) {
                    
                //     slideWait = true;
                    
                // } else if (slideTime <= 0) {
                    
                //     slideWait = false;
                    
                // }

                // if (slideWait == false) {

                //     slideTime += 1;
                //     player.animations.play('rolling');
                    
                // }
    
            // } else if (!cursors.down.isDown) {
                
            //     slideWait = true;
                
            // }  
        }
    }
    
    
       
    // if (slideWait == true) {
       
    //   if (slideTime > -2) {
           
    //         slideTime -= 1; 
 
    //   }
    // } 
    

}

function MoveRight(){
    rightClick = true;
    
}

function NewMission() {
    

    
}

function pointTotal () {
    
    panel = this.game.add.sprite(this.game.world.centerX, 300, 'endGamePanel');
    panel.anchor.setTo(0.5);
    panel.fixedToCamera = true;
    
    finalPoint = this.game.add.text(0,-50, 
    'Collect the bubbles in order for the most points.\n Click here to start!',
    { font: '40px Impact', fill: 'white', align: 'center',
    backgroundColor: 'white'});

    finalPoint.anchor.setTo(0.5);
    panel.addChild(finalPoint);
    
    if (score < 100)
    {
        finalPoint.setText("Game Over\nThat was okay\n...but you can do better!");
        
        
    }
    else if (score > 99 && score < 200)
    {
        
        finalPoint.setText("Game Over\nPretty good!\n  Can you break 200?");
    }
    else if (score > 199 && score < 300)
    {
        finalPoint.setText("Game Over\nNice!!\n  Go for 300!");
        
    }
    else
    {
        finalPoint.setText("Game Over\nWow!!\n  Nice Score!!");
        
    }
    
}

function PlayerHit(damage, whichEnemy) {
    
    if (hitPlayer == false) {
        
        hitPlayer = true;
        ufoHit = true;
        lifeBar.width -= damage;
        
        player.body.velocity.setTo(-50, -100);
        whichEnemy.body.velocity.setTo(800, -800);
        //ufo.anchor.setTo(0.5, 0.5);
        whichEnemy.body.angularVelocity = 200;
        
        ChangeScore(-100, -2);
        
        if (this.game.gameType == 2) {
            
            for (var i = 0; i < collectedLetters.length; i++) {
            
            DeleteLetter();
            
            }    
            
        }
        

        RunDelay(SetToFalse, 1000, 'playerHit');


        
    }

}

function RunDelay(doThis, time, passThis) {

    if (passThis == "none") {
        
        delayTimer.add(time, doThis, this);    
        
    } else {
        
        delayTimer.add(time, doThis, this, passThis);

    }
    
    //delayTimer.start();
    
}

function SetToFalse(falseThis) {
    
    if (isDead == false) {
        
        switch (falseThis) {
            
            case 'ufo':
                enemyCreated = false;
                break;
            
             case 'planet':
                planetCreated = false;
                break;
                
            case 'bubble':
                makeBubble = false;
                break;
      
            case 'asteroid':
                asteroidCreated = false;
                break;
                
            case 'playerHit':
                hitPlayer = false;
                break;    
                
            case 'playerreset':
                playerReset = false;
                break;     
                
            case 'cameralerp':
                cameraLerping = false;
                break; 
                
            case 'ufoHit':
                ufoHit = false;
                break;
                
            // case 'jumpDelay':
            //     jumpDelay = false;
            //     break; 
        }
        
        
    }

}

function SetUpBubbles() {

    bubbles = this.game.add.group();
    bubbles.enableBody = true;
    
}

function SetUpEmitters() {
    
    var bits = ['asteroidBits', 'asteroidFireBits', 'asteroidIceBits', 'asteroidEnergyBits'];
    
    //explosion
    emitter = this.game.add.emitter(0,0,100);
    emitter.makeParticles(bits[this.game.pickPlanet]);
    emitter.gravity = Math.floor((Math.random() * 200) + 1);
    
    emitter2 = this.game.add.emitter(0,0,100);
    emitter2.makeParticles(bits[this.game.pickPlanet]);
    emitter2.gravity = Math.floor((Math.random() * -200) + 1);
    
    emitter3 = this.game.add.emitter(0,0,100);
    emitter3.makeParticles('energy');
    emitter3.gravity = Math.floor((Math.random() * -50) + 1);
    
    emitter4 = this.game.add.emitter(0,0,250);
    emitter4.makeParticles('singleGroundBits');
    emitter4.gravity = Math.floor((Math.random() * -50) + 1);
    
    
    
}

function SetupDictionary() {
    
    if (this.game.gameType == 2) {
        
        dictionary = this.game.cache.getText('wordDictionary').split("\n");    
        
    }

    

}

function StarBurst(x,y){
    emitter3.x = x;
    emitter3.y = y;

    emitter3.alpha = 1;
    emitter3.start(true, 2000, null, 10);
    this.game.add.tween(emitter3).to( { alpha: 0.3 }, 2000, null, true);

}

function GroundBurst(x,y){
    emitter4.x = x;
    emitter4.y = y;

    emitter4.alpha = 1;
    emitter4.start(true, 3000, null, 40);
    this.game.add.tween(emitter4).to( { alpha: 0.3 }, 3000, null, true);

}

function Start (buttonClicked) {
        
        isDead = false;
        gameStarted = false;
        enemyCreated = false;
        //planetCreated = false;
        totalEnemies = 0;
        slideTime = 0;
        slideWait = false;
        makeBubble = true;
        collisionCounter = 0;
        checkCollision = false;
        asteroidCreated = false;
        hitPlayer = false;
        playerReset = false;
        lives = 3;
        teleports = 3;
        cameraFollow = false;
        cameraLerping = false;
        bounceOff = false;
        ufoHit = false;
        // inverted = false;
        // jumpDelay = false;
        
        if (buttonClicked == tryAgainButton) {
            
            this.game.state.start('play');    
            
        } else if (buttonClicked == newMissionbutton) {
            
            this.game.state.start('select');
            
        }
        
        
}

function StartGame() {
    
    timer.start();
    
    timer2.loop(2750, CreatePlatforms2, this);
    timer2.start();
    
    timer3.loop(3000, CreatePlatforms3, this);
    timer3.start();

    gameStarted = true;
 
    WarpIn();
    player.body.moves = true;
    
    
    jumpButton1 = this.game.add.sprite(200,this.game.world.height - 475, 'movebutton');
    jumpButton1.anchor.setTo(0.5);
    jumpButton1.inputEnabled = true;
    jumpButton1.events.onInputDown.add(JumpUp, this);
    
    jumpButton2 = this.game.add.sprite(1000,this.game.world.height - 475, 'movebutton');
    jumpButton2.anchor.setTo(0.5);
    jumpButton2.inputEnabled = true;
    jumpButton2.events.onInputDown.add(JumpUp, this);
    
    leftButton = this.game.add.sprite(200,this.game.world.height - 125, 'movebutton');
    leftButton.anchor.setTo(0.5);
    leftButton.inputEnabled = true;
    leftButton.events.onInputDown.add(MoveLeft, this);
    
    rightButton = this.game.add.sprite(1000,this.game.world.height - 125, 'movebutton');
    rightButton.anchor.setTo(0.5);
    rightButton.inputEnabled = true;
    rightButton.events.onInputDown.add(MoveRight, this);
    
    rightButton.events.onInputUp.add(StopRight, this);
    leftButton.events.onInputUp.add(StopLeft, this);
    jumpButton1.events.onInputUp.add(StopJump, this);
    jumpButton2.events.onInputUp.add(StopJump, this);
    
    score = 0;
    
    introText.destroy();
    
    //directions.destroy();
    
    RunDelay(SetToFalse, 2000, "bubble");
}

function StopJump(){
    jumpClick = false;
    
}

function StopLeft () {
    leftClick = false;
    
}

function StopRight () {
    rightClick = false;
    
}

function SubmitWord() {
    
    if (this.game.gameType == 2) {
        
        var submittedWord = "";
    
        collectedLetters.forEach(function (child) {
            
            submittedWord += child.getChildAt(0).text.toLowerCase();
    
        });
        
        for (var i = 0; i < dictionary.length; i++) {
            
            if (dictionary[i].trim() == (submittedWord)) {
                
                FoundWord(submittedWord);
                
            } 
        }
        
        if (cloudUp == true) {
            
            foundWordCloud.destroy();
            
        }
            
    }
 
}

function Teleport() {
    
    if (teleportLoading == false && isDead == false && teleports > 0) {
        
        wormHoles.getChildAt(wormHoles.length - 1).destroy();
        teleports -= 1;
        teleportLoadingBar.width = .25;
        
        teleportIn = this.game.add.sprite(player.x, player.y, "wormHole");
        teleportOut = this.game.add.sprite(600, this.game.world.height - 500, "wormHole");
        
        player.reset(600,700);
        
        RunDelay(DestroyThis, 500, teleportIn);
        RunDelay(DestroyThis, 1000, teleportOut);
        
        teleportLoading = true;    
        //inverted = false;
    }
    
    if (teleports == 0) {
        
        teleportLoadingBar.alpha = 0;
        
        teleportLoading = false;
        
    }
    
    
    
}

function UpdateCounter() {
    
    total -= 1;
    
    timeText.setText('Time: ' + total);
   
    if (total == 0)
    {
       timer.stop();
       
       GameOver();
        
    }
    
}

function WarpIn() {
    
   //inverted = false;
    var warpIn = this.game.add.sprite(300, this.game.world.height - 500, "warpIn");
    this.game.add.tween(warpIn).to({alpha:0},1000,Phaser.Easing.None,true);

    player.reset(330, 730);

    RunDelay(DestroyThis, 1000, warpIn);

    playerReset = true;
    player.alpha = .20;
    this.game.add.tween(player).to({alpha:1},3000,Phaser.Easing.None,true);
    
    RunDelay(SetToFalse, 3000, "playerreset");
    
    for (var i = 0; i < 3; i++) {
    
        ground = platforms.create(300 + (i * 78),this.game.world.height - 300, 'singleGround');
        ground.scale.setTo(3,3);
        ground.body.immovable = true;
        var groundFadeOut = this.game.add.tween(ground).to({alpha:0},3000,Phaser.Easing.None,true);
        //groundFadeOut.onComplete(DestroyThis, ground);
        RunDelay(DestroyThis, 3000, ground);
    }
    
    
}