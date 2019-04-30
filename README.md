# The-Lost-Treasure
A JavaScript command line style game

[The Lost Treasure](http://willemme.com/thelosttreasure/)

<img src="Gif.gif?raw=true" width="80%" >

## Motivation
This "Game" was made because of an assignment for secondary education computer science. Everyone had just learned JavaScript and were supposed to make a game using alert and prompt pop ups (lame!). Since I was already familiar with JavaScript, I went next level and made a full on webpage, making it look like an old command line game. Not that I played any (before my time). The game also has some Pokémon style fighting with different attack options.

The grade was a 9.6 (A+).

### Learning goals:
* JavaScript (Imposed by teacher)
* "Intermediate" JQuery
* Interactive webpage design

## Play the game
You can play the game on my personal website: [The Lost Treasure](http://willemme.com/thelosttreasure/) (if I don't mess up my site by then)

The game works by giving two types of input either A-D or a open question like your name.
It's a very advanced ;D game with multiple ending and storylines.
The English is sometimes a little broken, I'm sorry it was made in a bit of a rush. So feel free to spell check me.

## Code explanation
The code contains comments, however since this was any school assignment they are all in Dutch. So here some extra explanation.
In short the program works by using an decoder function and a linked list. The decoder reads every dialog “card”, each card has an in and out. In[0] selects out[0] as output etc. Out’s contain: text, person saying it, answers, and the next card in the 2 dimensional array (“next” and “tree”). Every card has to setup the next card so if the next card will be a fight the previous card will have to "prime" the "card reader".

dialog format: 
* in (a,b,c,d strings): Determines the out
* out(array van objects): Contains the different options from the in's
* text(string): Text that will be printed in the "terminal"
* person(string): Person saying it
* say(array van strings): Options
* next(number): Refers to next card 
* tree(number): Refers to different tree if necessary

-other options
* clear(boolean): Clears terminal
* chance(boolean): Give a random in to next card (A or B)
* isVar(boolean): Save input 
* forVar(number): On which index of the gameVars array to save the input 
* fight(boolean): Places "fightholder" and sets decoder up for fighting sequence.  
* fightID(number): Selects which fight must be played
* reload(boolean): Reload page after game finish


**story card example**
```
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
}
 ```
 
 ## Usage
 If you want to use it feel free to adapt it to your needs. One day I want to improve the "engine" and make it easy to write your own stories. But until then feel free to reach out to me if you need help adapting my code. 
 
 
## Contributors
[Willem Me](https://github.com/WillemMe)

## Licence

[GNU GPL](/LICENSE)
