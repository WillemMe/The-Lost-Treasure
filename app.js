/*
  The lost treasure
  Door Willem Medendorp.
  Voor informatica: Adventure game.
  22 April 2017
*/
//〚 Run script als de pagina geladen is 〛
$(function(){
// ╔═════════════════════════════════════════════════════════════════════════════╗
// ║                                  Setup                                      ║
// ╚═════════════════════════════════════════════════════════════════════════════╝
  //Jquery DOM elementen inladen, voor het verkomen van latency bij herhaaldelijk ophallen
  var terminal = $("#terminal"),
      options = $("#options"),
      opTable = $("#optionsTable"),
      cmdLine = $("#cmdLine"),
      alertDialog = $(".alertDialog"),
      alertTxt = $(".alertDialog > p"),
      plus = $("#plus"),
      min = $("#min")

  //onfocus vanaf het begin
  cmdLine.focus();
  //zorgt er voor dat je niet uit de input kunt klikken
  cmdLine.on('blur',function () {
    setTimeout(function() {
        cmdLine.focus()
    }, 10);
  });
  // als in de input "cmdLine" op enter word gedrukt(event 13) dan word de data verstuurd en de input geleegt
  // de normalEnter var word gebruikt omdat het nodig is om het op bepaalde momenten uittschakelen
  var normalEnter = true
  cmdLine.keypress(function(event) {
      if (event.which == 13 && normalEnter) {
        input = cmdLine.val();
        script(input);
        cmdLine.val("")
      }
  });
  // Event triggers
  plus.click(function(){
    txtResize("plus")
  });
  min.click(function(){
    txtResize("min")
  });
  // Resizing
  $("body").attr("style", "font-size: 1vw !important");
  $("input").attr("style", "font-size: 1vw !important");
  function txtResize(direction){
    var fontSize = $("*").css("font-size");
    if(direction =="plus"){
      $("body").css("font-size","+=2")
      $("input").css("font-size","+=2")
    }else if(direction == "min"){
      $("body").css("font-size","-=2")
      $("input").css("font-size","-=2")
    }
    terminal.scrollTop(terminal[0].scrollHeight)
  }
// ╔═════════════════════════════════════════════════════════════════════════════╗
// ║                                Functions                                    ║
// ╚═════════════════════════════════════════════════════════════════════════════╝
  //Zelf gemaakte console.log gelijke, die tekst toevoegt aan de <p> op de pagina
  function print(val){
    terminal.append(val + "<br/>");
    // Altijd op het laagste punt gescrolled
    terminal.scrollTop(terminal[0].scrollHeight)
  }
  //Print de mogelijke opties in een table onder de terminal
  function printOp(val) {
    opTable.html("")
    var table = "",
        tableRow = ["",""]
    val.forEach(function(cur,i){
      if(i < 2){
        tableRow[0] += "<td>"+cur+"</td>"
      }
      if(i >= 2){
        tableRow[1] += "<td>"+cur+"</td>";
        table = "<tr>"+ tableRow[0] +"</tr>"+"<tr>"+ tableRow[1] +"</tr>"
      }else{
        table = "<tr>"+ tableRow[0] +"</tr>"
      }
    })
    opTable.append(table)
  }

  function roundRandom(max){
    if(!max){
      max = 1
    }
    return Math.round(Math.random()*max)
  }
  //            ╔══════════════════════════════════════════════════════╗
  //            ║                     Script/staging                   ║
  //            ╚══════════════════════════════════════════════════════╝
  //Setup Global vars
  var curDialog, prevSay, isVar, varFor, chance = false, clear, fightWon = [false],
      gameVars = ["Stranger"],
      prepands = ["A: ","B: ","C: ","D: "],
      continueStr = ["Press enter to continue"];

  function script(val){
    //Var reset
    var found = false
    // Debugging functie, door bijv. 0 4 intevoeren dan ga je naar tree 0 stage 4
    if(!isNaN(val.substr(0,1)) && !(val == "")){
      tree = val.substr(0,1);
      stage = val.substr(2);
      print(val.substr(0,1) +" "+ val.substr(2));
      return
    }
    // Check voor of val een variable is dat moet worden opgeslagen
    if(isVar){
      if(!val){
        print("Narrator: No awnser? Try again.");
        return
      }else{
        gameVars[varFor] = val;
        isVar = false;
        update();
      }
    }
    curDialog = dialog[tree][stage];
    //〚 Na een gevecht gewonnen of verloren doorvoeren 〛
    if(fightWon[0]){
      alertHide();
      update();
      if(fightWon[1]){
        val = "a"
      }else{
        val = "b"
      }
      //〚 reset 〛
      fightWon[0] = false
    }
    //'val' voorbereiding voor proccessing
    val = val.toLowerCase()
    // Printen van het andwoord
    if(prevSay){
      prevSay.forEach(function(cur,i){
        if(val == cur.substr(0,1).toLowerCase()){
          print(gameVars[0] + ": " + cur.substr(3));
          //〚 reset 〛
          prevSay = undefined;
        }
      })
    }
    // Check of er een kans element is
    if(chance){
      //chance return een a of b
      val = chanceFunc();
      chance = false
    }
    if(clear){
      terminal.html("");
      clear = false
    }
    //〚 Als er een gevecht moet hij de stepper overslaan 〛
    if(fight){
        fighter(fightID, val);
    }else{
      // Dialog input interactie
      if(curDialog.in){
        curDialog.in.forEach(function(cur, i){
          if(val == cur){
            stepper(i);
            found = true
          }
        });
        // Als de input niet overeen komt met de opties
        if(!found){
          print("Narrator: Sorry what?")
        }
        // Printen van dialog zonder input
      }else{
        stepper(0)
      }
    }
    //Update Dialog
    update()
  }

  //            ╔══════════════════════════════════════════════════════╗
  //            ║             buitengenomen functions                  ║
  //            ╚══════════════════════════════════════════════════════╝

  function chanceFunc(){
    r = roundRandom()
    if(r == 0){
      return "a"
    }else{
      return "b"
    }
  }
  function stepper(i){
      curD = curDialog.out[i]
      if(curD.txt){
        print(curD.person + ": " + curD.txt);
      }
      if(curD.say){
        printOp(curD.say);
        prevSay = curD.say;
      }else{
        printOp(continueStr);
      }
      //〚 Setup voor volgende stap 〛
      stage = curD.next;
      if(curD.tree){
        tree = curD.tree
      }
      if(curD.isVar){
        isVar = true;
        varFor = curD.varFor
      }
      if(curD.chance){
        chance = true
      }
      if(curD.clear){
        clear = true
      }
      if(curD.fight){
        fight = true;
        fightID = curD.fightID;
        fightSetup = true
      }
      if(curD.reload){
        location.reload();
      }
  }
  // ╔═════════════════════════════════════════════════════════════════════════════╗
  // ║                              Fight handler                                  ║
  // ╚═════════════════════════════════════════════════════════════════════════════╝
  //〚 Global vars voor fighter() 〛
  var player, enemy, fight, fightID, fightSetup, playerStartHP, playerStartHP,
      fightStage = 0

  //〚 Alert handler 〛
  function alertPrint(msg , clear, title){
    //〚 Verschillende alert styling 〛
    if(clear){
      alertTxt.html("")
      alertTxt.css({"line-height":"15vh"})
    }else{
      alertTxt.css({"line-height":"7vh"})
    }
    if(title){
      alertTxt.css({"line-height":"15vh", "font-size":"3vw"})
    }else{
      alertTxt.css({"font-size":"1vw"})
    }
    alertDialog.css("visibility", "visible")
    alertTxt.append(msg + "</br>")
  }
  //〚 Alert hidder 〛
  function alertHide(){
    alertDialog.css("visibility", "hidden")
  }

  //〚 Fight "stepper" 〛
  function fighter(id, val){

    //〚 Print options 〛
    function printAttacks(player){
      var options = [];
      player.attacks.forEach(function(cur, i){
        options[i] = prepands[i] + cur.name + " dmg: " + cur.dmgL + "-" + cur.dmgH
        if(cur.mis){
          options[i] += "(could miss)"
        }
      })
      printOp(options)
    }
    //〚 Update HitPoint bars 〛
    function hpUpdate() {
      if(player.hp < 1){
        player.hp = 0
      }else if( enemy.hp < 1){
        enemy.hp = 0
      }
      pHpTxt.html(player.hp+"/"+ playerStartHP);
      eHpTxt.html(enemy.hp+"/"+ enemyStartHP);
      pWidth = (player.hp / playerStartHP) * 100
      eWidth = (enemy.hp / enemyStartHP) * 100
      pHpBar.css("width",""+pWidth+"%");
      eHpBar.css("width",""+eWidth+"%")
    }
    //〚 Random number generator (RNG) voor aanval damage 〛
    function dmgRandom(attack){
      function calcDmg(){
        var r = Math.random()
        r1 = 1 - r
        dmg = Math.round((r * attack.dmgL + r1 * attack.dmgH))
        return dmg
      }
      if(attack.mis){
        var r = roundRandom()
        if(r == 1){
          return "missed"
        }else{
          return calcDmg()
        }
      }else{
        return calcDmg()
      }
    }

    //〚 Selecteren van fight DOM elementen 〛
    var fightholder = $(".fightholder"),
        pStat = $(".playerStat"),
        eStat = $(".enemyStat"),
        pImg = $(".playerImg"),
        eImg = $(".enemyImg"),
        pHpBar = $(".playerHealth"),
        eHpBar = $(".enemyHealth"),
        pHpTxt = $(".playerHpTxt"),
        eHpTxt = $(".enemyHpTxt")

    if(fightSetup){
      //〚 Setup fase 〛
      fightholder.css({"z-index":"2", "visibility": "visible"})
      player = fightDialog[id][0];
      enemy = fightDialog[id][1];
      playerStartHP = player.hp;
      enemyStartHP = enemy.hp;
      pImg.append("<img src='./img/"+player.img+"'>");
      eImg.append("<img src='./img/"+enemy.img+"'>");
      hpUpdate();
      printAttacks(player);
      fightSetup = false
    }else{
      //〚 fightStage: player aanval (0). tegenstander aanval (1). Round up (2) 〛
      if(fightStage == 0){
        printAttacks(player);
        switch(val){
        case "a":
          val = 0
          break;
        case "b":
          val = 1
          break;
        case "c":
          val = 2
          break;
        case "d":
          val = 3
          break;
        default:
          print("You aren't a ninja, this is all you got.")
          return
      }
      pAttack = player.attacks[val]
      playerDmg = dmgRandom(pAttack)
      if(playerDmg == "missed"){
        alertPrint("Your "+pAttack.name + " missed!", true)
        playerDmg = 0
      }else{
        alertPrint("Your "+pAttack.name + " did "+playerDmg+" points of damage!",true)
      }

      enemy.hp -= playerDmg
      hpUpdate();

      //〚 Check of de tegenstander nog hp heeft voor dat de tegenstander een aanval doet 〛
      if(enemy.hp < 1){
        fightStage = 2
      }else{
        fightStage = 1
      }
    }else if(fightStage == 1){
      //〚 Een aanval kiezen voor de tegenstander 〛
      r = roundRandom(enemy.attacks.length-1)
      eAttack = enemy.attacks[r]
      enemyDmg = dmgRandom(eAttack);

      if(enemyDmg == "missed"){
        alertPrint("His "+eAttack.name + " missed!", true)
        enemyDmg = 0
      }else{
        alertPrint("His "+eAttack.name + " did "+enemyDmg+" points of damage!",true)
      }
      player.hp -= enemyDmg
      hpUpdate();

      fightStage = 2
    }else if(fightStage == 2){
      alertHide();
      fightStage = 0
      //〚 Dead detect 〛
      if(enemy.hp < 1 || player.hp < 1){
        if(enemy.hp < 1){
          alertPrint("Victory",true,true)
          fightWon = [true, true]
        }else if(player.hp < 1){
          alertPrint("Defeat",true,true)
          fightWon = [true, false]
        }
        //〚 Reset 〛
        fight = false;
        fightID = undefined;
        player = undefined;
        enemy = undefined;
        pImg.html("");
        eImg.html("");
        fightholder.css({"z-index":"2", "visibility": "hidden"});
      }
    }
   }
  }

  //〚 Start Print 〛
  print("Press enter to start");
// ╔═════════════════════════════════════════════════════════════════════════════╗
// ║                               Story data                                    ║
// ╚═════════════════════════════════════════════════════════════════════════════╝
  //〚 Var declaratie 〛
  var stage = 0,
      tree = 0,
      //〚 "Random" bekende proffesor namen, naam van "de proffesor" verschild ierdere game 〛
      proffs = ["Jibbens","Oak","Cuthbert Calculus","John Frink Jr.",
                "Farnsworth","Xavier","Marvel","Moriarty","Dumbledore","Einstein",
                "Jones","Chaos","Snape","Utonium","Layton"],
      proff = proffs[roundRandom(proffs.length-1)],
      dialog,
      fightDialog
  function update(){
    //〚 Random objecten voor 2-2 〛
    var objects = ["hand of sand","big stick","piece of liver","bottle","glass shard","bone","peble","unicorn horn","brick","skull"]
    var randomObject = objects[roundRandom(objects.length-1)]
    // Hergebruikte dialogs
    var goInTemple = {
          "txt": "What are you waiting for lets go in!",
          "person": proff,
          "say": ["A: Lets go!", "B: Uhhhmm I don't know, I don't like the dark."],
          "next": 11
        },
        templeIn = {
          "txt": "You and the proffesor go into the temple.",
          "person": "Narrator",
          "next": 13
        }
    // Script
    /*
    ╔═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
    ║  dialog format:                                                                                                                     ║
    ║  in (a,b,c,d strings): de in bepaald welke van de "outs" gebruikt wordt                                                             ║
    ║  out(array van objects): elke object is voor een van de inputs 0 voor a, 1 voor b enz.                                              ║
    ║    text(string): Tekst die op in de terminal geprint wordt                                                                          ║
    ║    person(string): Naam die voor de string staat                                                                                    ║
    ║    say(array van strings): Antwoord opties ("A: " of "B: " is belangerijk)                                                          ║
    ║    next(number): Verwijst naar de volgende object in de huidige array                                                               ║
    ║    tree(number): Lijkt op next alleen dan verwijst het naar een ander array in dialog array                                         ║
    ║    -overige                                                                                                                         ║
    ║    clear(boolean): Maakt de terminal leeg voor de volgende dialog                                                                   ║
    ║    chance(boolean): Random A of B voor volgende dialog                                                                              ║
    ║    isVar(boolean): Slaat input op                                                                                                   ║
    ║    forVor(number): Slaat de input op in de gameVars array op positie van het nummer                                                 ║
    ║    fight(boolean): Plaats "fightholder" en start de juist proccesen voor een gevecht                                                ║
    ║    fightID(number): Verwijst naar welk gevechts informatie uit de fightDialog moet worden gehaald met het nummer de array index     ║
    ║    reload(boolean): Pagina reloaden                                                                                                 ║
    ╚═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝
    */
    dialog = [
      [
        {
            "out": [{
                "txt": "It's a rainy day and you're walking through the jungle.",
                "person": "Narrator",
                "next": 1
            }]
        },
        //1
        {
            "out": [{
                "txt": "But then you stumble upon a old man and he asks:",
                "person": "Narrator",
                "next": 2
            }]
        },
        //2
        {
            "out": [{
                "txt": "What are you doing in the jungle?",
                "person": "Oldman",
                "say": ["A: I'm in search for the temple.", "B: Who are you to know!"],
                "next": 3
            }]
        },
        //3
        {
            "in": ["a", "b"],
            "out": [{
                "txt": "In search for the temple as well?",
                "person": "Oldman",
                "say": ["A: Yes, lets go together.", "B: Definitely, can I join?"],
                "next": 4
            }, {
                "txt": "I'm sorry, but may you come with me?",
                "person": "Oldman",
                "say": ["A: Sure", "B: I guess"],
                "next": 4
            }]
        },
        //4
        {
            "out": [{
                "txt": "Nice that you're comming with me, I like to introduce my self, my name is proffesor " + proff + ".",
                "person": "Oldman",
                "next": 5
            }]
        },
        //5
        {
            "out": [{
                "txt": "And who are you?",
                "person": proff,
                "say": ["Enter name:"],
                "isVar": true,
                "varFor": 0,
                "next": 6
            }]
        },
        //6
        {
            "out": [{
                "txt": "Nice to meet you " + gameVars[0] + ", shall we continue our search.",
                "person": proff,
                "next": 7
            }]
        },
        //7
        {
            "out": [{
                "txt": "Over there, you see that, that is the temple.",
                "person": proff,
                "say": ["A: I see", "B: What where?"],
                "next": 8
            }]
        },
        //8
        {
            "in": ["a", "b"],
            "out": [goInTemple,
              {
                "txt": "Are you blind " + gameVars[0] + ", look too right of that rock.",
                "person": proff,
                "say": ["A: I See", "B: I still can't see it"],
                "next": 9
            }]
        },
        //9
        {
            "in": ["a", "b"],
            "out": [goInTemple, {
                "txt": "Come with me, I will show you.",
                "person": proff,
                "next": 10
            }]
        },
        //10
        {
            "out": [goInTemple]
        },
        //11
        {
            "in": ["a", "b"],
            "out": [templeIn,
              {
                "txt": "What are you, a girl!",
                "person": proff,
                "say": ["A: I'm sorry, can we go on please.", "B: Don't make fun of me, I'm sure you're affraid of things aswell!"],
                "next": 12
            }]
        },
        //12
        {
            "in": ["a", "b"],
            "out": [templeIn, templeIn]
        },
        //13
        {
            "out": [{
                "txt": "Inside the temple you see a wall full of glyphs, but also a small door.",
                "person": "Narrator",
                "say": ["A: *Go through the small door.*", "B: *Try and read the glyphs.*"],
                "next": 14
            }]
        },
        //14
        {
            "in": ["a", "b"],
            "out": [{
                "txt": "You now find yourself with the proffesor in a small corridor.",
                "person": "Narrator",
                "tree": 2, //Tree swap
                "next": 0
            },
            {
                "txt": "You are reading the glyphs.",
                "person": "Narrator",
                "chance": true,
                "tree": 1, //Tree swap
                "next": 0
            }]
        }
      ],
      [ //New tree
        //0
        {
            "in":["a", "b"],
            "out": [{
                "txt": "You have read the glyphs but didn't understand them.",
                "person": "Narrator",
                "say": ["A: *Pass on them, and go to the small door.*"],
                "tree": 2,
                "next": 0
            },
            {
                "txt": "You have read the glyphs and understood them, and know that something strange is going on.",
                "person": "Narrator",
                "next": 1
            }]
        },
        // 1
        {
            "out": [{
                "txt": "You continue to walk with the proffesor, with glyphs in the back of your mind.",
                "person": "Narrator",
                "next": 2
            }]
        },
        // 2
        {
            "out": [{
                "txt": "What was going on with those glyphs?",
                "person": proff,
                "say": ["A: Nothing.", "B: They were about aliens!"],
                "next": 3
            }]
        },
        // 3
        {
            "in": ["a", "b"],
            "out": [{
                "txt": "Why won't you tell me "+gameVars[0]+" ?",
                "person": proff,
                "say": ["A: I no longer trust you", "B: You're not human!"],
                "next": 4
            },
            {
                "txt": "About aliens!? Are you nuts?",
                "person": proff,
                "say": ["A: No, I'm 100% sure about it.", "B: No really it said something about a alien stuck on earth.", "C: I could have been wrong."],
                "next": 5
            }]
        },
        // 4
        {
            "in": ["a", "b"],
            "out": [{
                "txt": "Okeay, if you think this way, I rather tell you the truth.",
                "person": proff,
                "say": ["A: Okeay"],
                "next": 5
            },
            {
                "txt": "Now you know, but there is more to this story.",
                "person": proff,
                "say":["A: What do you mean", "B: Not all?"],
                "next": 5
            }]
        },
        //5
        {
            "in": ["a", "b", "c"],
            "out": [{
                "txt": "I'm that alien, but I'm stuck on earth,<br> you are the first one in 10glypto years to even come close to this temple. <br>I really need your help!",
                "person": proff,
                "next": 6
            },
            {
                "txt": "So you already know my backstory, I'm that alien, but I really need your help!<br> You are the first one in 10glypto years to even come to this temple.",
                "person": proff,
                "next": 6
            },
            {
                "txt": "It was probably nothing, can we go on?",
                "person": proff,
                "tree": 2, //Tree switch!
                "next": 0
            }]
        },
        //6
        {
            "out": [{
                "txt": "Will you help me?",
                "person": proff,
                "say": ["A: I will", "B: No, I don't trust aliens"],
                "next": 7
            }]
        },
        //7
        {
            "in": ["a", "b"],
            "out": [{
                "txt": "Do you really think I need your help! All I want is your flesh, fight me!",
                "person": proff,
                "next": 8 //Need out
            },
            {
                "txt": "Now you know to much, you can't tell the whole world, I have to kill you"+gameVars[0]+".",
                "person": proff,
                "say": ["A: Come on, fight me!"],
                "next": 8,
                "clear": true
            }]
        },
        // 8
        {

            "out": [{
                "say":["Ready to fight!"],
                "fight": true,
                "fightID": 0,
                "next": 9,
                "clear": true
            }]
        },
        //9
        {
            "in":["a", "b"],
            "out": [{
                "txt":"You have defeated the alien, and were is such a shock that you left the temple, no longer caring about the treasure.",
                "person": "Narrator",
                "say":["A: *Restart this journey*", "B: *Go home*"],
                "next": 10
            },
            {
                "txt": "You have been defeated by alien, he cleaned up your remainings and went back to what he was doing before you came along.",
                "person": "Narrator",
                "say": ["A: *Cry in corner*"],
                "next": 12
            }]
        },
        // 10
        {
            "out": [
              {
                "txt": "Thanks for playing!",
                "person": "Willem",
                "next": 11
            }]
        },
        //11
        {
            "out":[
              {
                "reload": true
              }
            ]
        },
        //12
        {
            "out": [{
                "txt": "A dead man can't continue playing, you have to restart if you want to continue.",
                "person": "Narrator",
                "next": 10
            }]
        }
      ],
      //〚 Tree 2 〛
      [
        {
            "out": [{
                "txt": "You go through the door, to find a room filled with cobwebs.",
                "person": "Narrator",
                "say": ["A: How are we going to get through this?", "B: I don't like spiders!"],
                "next": 1
            }]
        },
        //1
        {
            "in": ["a", "b"],
            "out": [{
                "txt": "Walk I guess, grab that torch there, and I will lit it.",
                "person": proff,
                "say": ["A: *Give rock","B: *Give torch"],
                "next": 2
            },
            {
                "txt": "Me neither but we got the go through, give me that torch over there.",
                "person": proff,
                "say": ["A: *Give rock","B: *Give torch"],
                "next": 2
            }
            ]
        },
        //2
        {
            "in": ["a", "b"],
            "out": [{
                "txt": "That isn't a bloody torch!",
                "person": proff,
                "say": ["A: *Give a "+randomObject, "B: *Give torch"],
                "next": 2
            },
            {
                "txt": "Thank you, lets light this thing up.",
                "person": proff,
                "next": 3
            }
            ]
        },
        //3
        {
            "out": [{
                "txt": "The torch lights entire room, now you can see the giant spider previously hidden in the dark.",
                "person": "Narrator",
                "say": ["A: What in the world!", "B: UUUhhhhhhh..."],
                "next": 4
            }]
        },
        //4
        {
            "in": ["a", "b"],
            "out": [{
                "txt": "It's a meter tall Theraphosa blondi!",
                "person": proff,
                "say": ["A: It's getting closser", "B: It will kill us!"],
                "next": 5
            },
            {
                "txt": "Close your mouth, that is a meter tall Theraphosa blondi.",
                "person": proff,
                "say": ["A: It's going to get us", "B: It will eat us alive"],
                "next": 5
            }]
        },
        //5
        {
            "out": [{
                "txt": "What are you waiting for, kill that beast, I'm a old man you go!",
                "person": proff,
                "fight": true,
                "fightID": 1,
                "clear": true,
                "next": 6
            }]
        },
        //6
        {
            "in": ["a", "b"],
            "out": [{
                "txt": "You successfully killed the spider, and are thinking about ways to go through the room.",
                "person": "Narrator",
                "say":["A: Why don't we light the cobweb on fire?","B: We can try to just walk through it?"],
                "next": 7
            },
            {
                "txt": "The spider killder you, and is now eating your corps.",
                "person": "Narrator",
                "next": 12,
                "tree": 1
            }]
        },
        // 7
        {
            "in":["a","b"],
            "out": [{
                "txt": "Are you crazy! But it could work tho.",
                "person": proff,
                "chance": true,
                "next": 8
            },
            {
                "txt": "We will probably get stuck, but lets give it a shot.",
                "person": proff,
                "next": 9
            }]
        },
        // 8
        {
            "in": ["a", "b"],
            "out": [{
                "txt": "The proffesor failed to light the cobwebs, now you have to walk through it.",
                "person": "Narrator",
                "next": 9
            },
            {
                "txt": "The proffesor successfully lit the cobwebs, it now creats a path to the door on the other and of the room.",
                "person": "Narrator",
                "next": 14
            }]
        },
        //9
        {
            "out": [{
                "txt": "Half way through the room you find some small spiders.",
                "person": "Narrator",
                "next": 10
            }]
        },
        //10
        {
            "out": [{
                "txt": "Kill them!",
                "person": proff,
                "fight": true,
                "fightID": 2,
                "clear": true,
                "next": 11
            }]
        },
        //11
        {
            "out": [{
                "txt": "Here is an other one!",
                "person": proff,
                "fight": true,
                "fightID": 2,
                "clear": true,
                "next": 12
            }]
        },
        //12
        {
            "out": [{
                "txt": "And an other one!",
                "person": proff,
                "fight": true,
                "fightID": 2,
                "clear": true,
                "next": 13
            }]
        },
        //13
        {
            "out": [{
                "txt": "I bloody hate spiders! Lets go through that door.",
                "person": proff,
                "next": 14
            }]
        },
        //14
        {
            "out": [{
                "txt": "You and the proffesor once again go through a door, to find this time a drawing on the wall.",
                "person": "Narrator",
                "next": 15
            }]
        },
        //15
        {
            "out": [{
                "txt": "The drawing is a map of the temple showing you the path to the treasure. Do you trust it?",
                "person": "Narrator",
                "next": 16
            }]
        },
        //16
        {
            "out": [{
                "txt": "What does that map say?",
                "person": proff,
                "say": ["A: We need to go right to find the treasure","B: The maps says right so we need to go left."],
                "next": 17
            }]
        },
        //17
        {
            "in": ["a", "b"],
            "out": [{
                "txt": "If the map tells us so.",
                "person": proff,
                "next": 18
            },
            {
                "txt": "interesting way of thinking, but is see where you're aiming for.",
                "person": proff,
                "next": 28
            }]
        },
        //18
        {
            "out": [{
                "txt": "You go into the right corridor but then you hear growling infront and behind you, two guardians rose form the dust.",
                "person": "Narrator",
                "say":["A: Kill it i guess?", "B: this temple is messed up!"],
                "next": 19
            }]
        },
        // 19
        {
            "in": ["a", "b"],
            "out": [{
                "txt": "No make friends. You stupid? Kill it!",
                "person": proff,
                "fight": true,
                "fightID": 3,
                "clear": true,
                "next": 20
            },
            {
                "txt": "It is, are go going to kill them or what?",
                "person": proff,
                "fight": true,
                "fightID": 3,
                "clear": true,
                "next": 20
            }]
        },
        //20
        {
            "in": ["a", "b"],
            "out": [{
                "txt": "There is one more to kill!",
                "person": proff,
                "fight": true,
                "fightID": 3,
                "clear": true,
                "next": 21
            },
            {
                "txt": "Sooooo, well uuhhhh, you died, how sad.",
                "person": "Narrator",
                "next": 12,
                "tree": 1
            }]
        },
        //21
        {
            "in": ["a", "b"],
            "out": [{
                "txt": "Once again, you won, great job!",
                "person": "Narrator",
                "next": 22
            },
            {
                "txt": "Sooooo, well uuhhhh, you died, how sad.",
                "person": "Narrator",
                "next": 12,
                "tree": 1
            }]
        },
        //22
        {
            "out": [{
                "txt": "You finally made it, you found the lost treasure!",
                "person": "Narrator",
                "say": ["What are you going to buy with all of this money:"],
                "next": 23,
                "isVar": true,
                "varFor": 1
            }]
        },
        //23
        {
            "out": [{
                "txt": gameVars[1]+", never heard of it, well you do you, I'm not judging.",
                "person": "Narrator",
                "next": 24
            }]
        },
        //24
        {
            "out": [{
                "txt": gameVars[0]+" wasn't it? yhea you can go, you won the game is over, the maker was to lazy to make an escape, this is all.",
                "person": "Narrator",
                "next": 25
            }]
        },
        //25
        {
            "out": [{
                "txt": "No really you can go now it's over, bye!",
                "person": "Narrator",
                "next": 26
            }]
        },
        //26
        {
            "out": [{
                "txt": "Thanks for playing!",
                "person": "Willem",
                "next": 27
            }]
        },
        //27
        {
            "out": [{
                "reload":true
            }]
        },
        //28
        {
            "out": [{
                "txt": "Someone doens't like to play by the rules, You and the proffesor go through the left corridor.",
                "person": "Narrator",
                "next": 29
            }]
        },
        {
            "out": [{
                "txt": "The left corridor was most definitely the right chose, here you are one last door away from the treasure will you go in or fight the end boss on the right corridor?",
                "person": "Narrator",
                "say": ["A: Skip fun", "B: fight the other corridors end boss"],
                "next": 30
            }]
        },
        {
            "in": ["a", "b"],
            "out": [{
                "txt": "How borring, wel here we go.",
                "person": "Narrator",
                "next": 22
            },
            {
                "txt": "Good choice, let's have some fun.",
                "person": "Narrator",
                "next": 18
            }]
        }
      ]
    ];

    //            ╔══════════════════════════════════════════════════════╗
    //            ║                Fighting dialog/stats                 ║
    //            ╚══════════════════════════════════════════════════════╝
    /*
    ╔═════════════════════════════════════════════════════════════════════════════╗
    ║fightDialog format                                                           ║
    ║  img(string): path naar img/"STRING"                                        ║
    ║  hp(number): Hit points                                                     ║
    ║  attack(array van objecten)                                                 ║
    ║    name(string): Naam aanval                                                ║
    ║    dmgH(number): Maximale aanvals schade                                    ║
    ║    dmgL(number): Minimale aanvals schade                                    ║
    ║    mis(boolean): Optie of aan mogelijk kan missen, en dus 0 schade doet     ║
    ╚═════════════════════════════════════════════════════════════════════════════╝
    */
    fightDialog = [
      [
        {
          "img":"player.png",
          "hp": 100,
          "attacks":[
            {
              "name": "Low punch",
              "dmgH": 10,
              "dmgL": 6
            },
            {
              "name":"High punch",
              "dmgH": 9,
              "dmgL": 8
            },
            {
              "name":"Kick",
              "dmgH":15,
              "dmgL":5
            },
            {
              "name":"Rock throw",
              "dmgH": 25,
              "dmgL": 10,
              "mis": true
            }
          ]
        },
        {
          "name": "Alien",
          "img":"Alien.png",
          "hp": 100,
          "attacks":[
            {
              "name":"Tentacle slap",
              "dmgH": 15,
              "dmgL": 5
            },
            {
              "name":"Laser shot",
              "dmgH": 30,
              "dmgL": 15,
              "mis": true
            },
            {
              "name":"Head bump",
              "dmgH": 10,
              "dmgL": 9
            },
            {
              "name":"Void charge",
              "dmgH": 20,
              "dmgL": 1,
            }
          ]
        }
      ],
      //1
      [
        {
          "img":"player.png",
          "hp": 100,
          "attacks":[
            {
              "name": "Punch",
              "dmgH": 9,
              "dmgL": 8
            },
            {
              "name":"Flame dash",
              "dmgH": 20,
              "dmgL": 5,
              "mis": true
            },
            {
              "name":"Kick",
              "dmgH":15,
              "dmgL":5
            },
            {
              "name":"Rock throw",
              "dmgH": 25,
              "dmgL": 10,
              "mis": true
            }
          ]
        },
        {
          "name": "Theraphosa Blondi",
          "img":"spider.png",
          "hp": 50,
          "attacks":[
            {
              "name":"Claw dash",
              "dmgH": 15,
              "dmgL": 10
            },
            {
              "name":"String shot",
              "dmgH": 40,
              "dmgL": 15,
              "mis": true
            },
            {
              "name":"Bite",
              "dmgH": 10,
              "dmgL": 9
            },
            {
              "name":"Jaw lock",
              "dmgH": 25,
              "dmgL": 1
            }
          ]
        }
      ],
      //3
      [
        {
          "img":"player.png",
          "hp": 100,
          "attacks":[
            {
              "name":"Flame dash",
              "dmgH": 20,
              "dmgL": 5,
              "mis": true
            },
            {
              "name":"Head stepper",
              "dmgH":40,
              "dmgL":0
            }
          ]
        },
        {
          "name": "small Theraphosa Blondi",
          "img":"smallspider.png",
          "hp": 20,
          "attacks":[
            {
              "name":"Claw dash",
              "dmgH": 15,
              "dmgL": 10
            },
            {
              "name":"String shot",
              "dmgH": 20,
              "dmgL": 15,
              "mis": true
            },
            {
              "name":"Bite",
              "dmgH": 10,
              "dmgL": 9
            }
          ]
        }
      ],
      //4
      [
        {
          "img":"player.png",
          "hp": 100,
          "attacks":[
            {
              "name": "Punch",
              "dmgH": 10,
              "dmgL": 9
            },
            {
              "name":"Back flip kick",
              "dmgH": 20,
              "dmgL": 5,
            },
            {
              "name":"Five Knuckle Shuffle",
              "dmgH":35,
              "dmgL":5,
              "mis": true
            },
            {
              "name":"Rock throw",
              "dmgH": 25,
              "dmgL": 10,
              "mis": true
            }
          ]
        },
        {
          "name": "Temple guardian",
          "img":"guardian.png",
          "hp": 100,
          "attacks":[
            {
              "name":"Head dash",
              "dmgH": 15,
              "dmgL": 10
            },
            {
              "name":"Poison cloud",
              "dmgH": 30,
              "dmgL": 15,
              "mis": true
            },
            {
              "name":"Upper cut",
              "dmgH": 10,
              "dmgL": 9
            },
            {
              "name":"Push",
              "dmgH": 8,
              "dmgL": 7
            }
          ]
        }
      ],
    ];
  }
  //〚 initialisatie van de dialog 〛
  update();
});

//  Copyright (C) 2017, Willem Medendorp, - All Rights Reserved
