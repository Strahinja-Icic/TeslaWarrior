/*
Current tasks:
- Look over the code and make optimizations if needed (always do this)
- Add enemySpecific stats
- Add support for multiple enemies during battle

*/

// Important HTML elements
let attackB = document.getElementById("attackButton");
let defendB = document.getElementById("defendButton");
let checkB = document.getElementById("checkButton");
let cItemB = document.getElementById("cItemButton");
let clearB = document.getElementById("clearButton");
let restartB = document.getElementById("restartBattle");
let skipB = document.getElementById("skipButton");

let playerStatsP = document.getElementById("playerStats");
let enemyStatsP = document.getElementById("enemyStats");

let output = document.getElementById("output");
//


// Player and enemy stats
function UniversalStats(hp, maxhp, defense, resistance, attackPower) // Object constructor which will be used for creating universal stats for the player and all of the enemies, I will refer to this object as the entity from now on.
{
    this.HP = parseInt(hp),
    this.MaxHP = parseInt(maxhp),
    this.Defense = parseInt(defense),
    this.Resistance = parseFloat(resistance),
    this.AttackPower = parseInt(attackPower),
    this.Dead = false,

    this.damageHP = function(dmg) // Returns an array which contains a boolean and a number, the boolean is true if the entity was killed and false if it wasn't, the number represents how much damage has been done to the entity.
    {
        if (this.Dead)
            return [false, 0]; // This doesn't let the entity get damaged if it's already dead, useful for detirmining if the entity was actually killed or not when the method is called.
        
        let defenseEquation = parseInt(dmg - this.Defense);
        let resistanceEquation = parseFloat(1 - this.Resistance);
        let dmgToInflict;

        if (defenseEquation <= 0) // If defenseEquation is less than 0 that means that the amount of damage that will be inflicted is less than zero, the defense mechanic is used for reducing the amount of damage that will be inflicted to the entity, but it can't reduce it past 1.
            dmgToInflict = 1;
        else if (resistanceEquation <= 0) // resistanceEquation isn't supposed to be less than 0 in any case so I put this check just in case.
            dmgToInflict = 0;
        else
            dmgToInflict = parseInt(defenseEquation * resistanceEquation);

        this.HP -= dmgToInflict;

        if (this.HP <= 0)
        {
            this.Dead = true;
            return [true, dmgToInflict];
        }
        else
            return [false, dmgToInflict];
    },

    this.healHP = function(amount, healPastMax) // Returns true if the entity was healed to or past max HP.
    {
        let HPafterHeal = this.HP += amount;

        if (HPafterHeal >= this.MaxHP && !healPastMax)
        {
            this.HP = this.MaxHP;
            return true;
        }
        else if (HPafterHeal >= this.MaxHP && healPastMax)
        {
            this.HP = HPafterHeal;
            return true;
        }
        else
            this.HP = HPafterHeal;

        return false;
    }
}

let player = new UniversalStats(10, 10, 0, 0, 2); //Using the object constructor to create the player and the enemy
let enemy = new UniversalStats(4, 4, 0, 0, 2);

let playerSpecific = {}
playerSpecific.Coins = 0;
playerSpecific.Defending = false;
playerSpecific.AdditionalDEF = 20; // Additional stats are applied when the player is defending
playerSpecific.AdditionalRES = 0;
//


// Functions
function addMessageInOutput(message)
{
    output.innerHTML += message + "<br>";
}

function clearOutput()
{
    output.innerHTML = "This is the output.<br>";
}

function playerTurn(option) // Returns true if the turn was successful, false otherwise
{
    /*
    option values:
    1 - Attack,
    2 - Defend,
    3 - Check,
    4 - Use consumable item,
    Other - Skip turn 
    */

    if (player.Dead)
    {
        addMessageInOutput("Can\'t do this action because the player is dead.");
        return false;
    }

    switch (option)
    {
        case 1: // Attack
            if (enemy.Dead)
            {
                addMessageInOutput("Can\'t do this action because the enemy is dead.");
                return false;
            }

            let returnValue = enemy.damageHP(player.AttackPower); // Returns true if the enemy was killed by this attack
            
            addMessageInOutput(`The player has attacked the enemy and has dealt ${returnValue[1]} damage.`);
            if (returnValue[0])
                addMessageInOutput("The player has killed the enemy.");
            
            updateDisplayedStats();
            return true;

        case 2: // Defend
            playerSpecific.Defending = true;

            player.Defense += playerSpecific.AdditionalDEF;
            player.Resistance += playerSpecific.AdditionalRES;

            return true;

        case 3: // Check
            addMessageInOutput(`Enemy HP: ${enemy.HP}; Enemy MaxHP: ${enemy.MaxHP}; Enemy DEF: ${enemy.Defense}; Enemy RES: ${enemy.Resistance}; Enemy ATK: ${enemy.AttackPower};`);
            return true;

        case 4: // Use consumable item, for now it heals 4HP everytime it's used
            let bool = player.healHP(4, false);

            addMessageInOutput("Used item.");

            if (bool)
                addMessageInOutput("Healed to max HP.");
            else
                addMessageInOutput("healed 4HP");

            updateDisplayedStats();

            return true;

        default:
            addMessageInOutput("Skipped turn.");
            return true;
    }
}

function enemyTurn()
{
    if (enemy.HP > 0 && !player.Dead)
    {
        let returnValue = player.damageHP(enemy.AttackPower);
        addMessageInOutput(`The enemy has attacked the player and has dealt ${returnValue[1]} damage.`);
        
        if (returnValue[0])
            addMessageInOutput("You\'ve died!");

        updateDisplayedStats();
    }
}



function updateDisplayedStats()
{
    playerStatsP.textContent = `Player HP: ${player.HP}; Player ATK: ${player.AttackPower}; Player DEF: ${player.Defense}; Player RES: ${player.Resistance}`; // First time hearing about backticks (`) in my life, reminder for self: they're located to the left of the 1 key
    enemyStatsP.textContent = `Enemy HP: ${enemy.HP}; Enemy ATK: ${enemy.AttackPower}`;
}

function restartBattle()
{
    player.HP = player.MaxHP;
    player.Dead = false;
    enemy.HP = enemy.MaxHP;
    enemy.Dead = false;

    clearOutput();
    updateDisplayedStats();
}
//


// Event listeners
attackB.addEventListener("click", function()
{
    playerTurn(1);
    enemyTurn();
});

defendB.addEventListener("click", function()
{
    playerTurn(2);
    enemyTurn();

    player.Defending = false;
    player.Defense -= playerSpecific.AdditionalDEF;
    player.Resistance -= playerSpecific.AdditionalRES;
    updateDisplayedStats();
});

checkB.addEventListener("click", function()
{
    playerTurn(3);
});

cItemB.addEventListener("click", function()
{
    playerTurn(4);
    enemyTurn();
});

skipB.addEventListener("click", function()
{
    playerTurn(-1);
    enemyTurn();
});

clearB.addEventListener("click", clearOutput);
restartB.addEventListener("click", restartBattle)
//


// Function calls
clearOutput();
updateDisplayedStats();
//