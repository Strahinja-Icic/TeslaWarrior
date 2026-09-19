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

    this.damageHP = function(dmg) // Returns true if the entity was killed, false otherwise.
    {
        if (this.Dead)
            return false; // This doesn't let the entity get damaged if it's already dead, useful for detirmining if the entity was actually killed or not when the method is called.
        
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
            return true;
        }
        else
            return false;
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



function attackEnemy() // Returns true if the attack was successful, false otherwise
{
    if (player.Dead)
    {
        addMessageInOutput("Can\'t attack cuz ur ded.");
        return false;
    }
    else if (enemy.Dead)
    {
        addMessageInOutput("The enemy is already dead!");
        return false;
    }

    let bool = enemy.damageHP(player.AttackPower); // Returns true if the enemy was killed by this attack

    if (bool)
        addMessageInOutput("The player has killed the enemy.");
    else
        addMessageInOutput("The player has attacked the enemy.");
    
    updateDisplayedStats();
    return true;
}

function defend()
{
    player.Resistance = 1;
    addMessageInOutput("Defended");
}

function checkEnemy()
{
    addMessageInOutput(`Enemy MaxHP: ${enemy.MaxHP}; Enemy DEF: ${enemy.Defense}; Enemy RES: ${enemy.Resistance}`);
}

function useConsumableItem()
{
    let bool = player.healHP(4, false);

    addMessageInOutput("Used item.");

    if (bool)
        addMessageInOutput("Healed to max HP.");
    else
        addMessageInOutput("healed 4HP");

    updateDisplayedStats();
}

function enemyTurn()
{
    if (enemy.HP > 0 && !player.Dead)
    {
        let bool = player.damageHP(enemy.AttackPower);
        addMessageInOutput("The enemy has attacked the player.");
        
        if (bool)
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
    attackEnemy();
    enemyTurn();
});

defendB.addEventListener("click", function()
{
    if (!player.Dead)
    {
        defend();
        enemyTurn();
        player.Resistance = 0;
    }
    else
        addMessageInOutput("Can\'t do this action while dead.");

});

checkB.addEventListener("click", checkEnemy);

cItemB.addEventListener("click", function()
{
    if (!player.Dead)
        useConsumableItem();
    else
        addMessageInOutput("Can\'t do this action while dead.");
});

skipB.addEventListener("click", function()
{
    if (!player.Dead)
        enemyTurn();
    else
        addMessageInOutput("Can\'t do this action while dead.");
});

clearB.addEventListener("click", clearOutput);
restartB.addEventListener("click", restartBattle)
//


// Function calls
clearOutput();
updateDisplayedStats();
//