// Important HTML elements
let attackB = document.getElementById("attackButton");
let defendB = document.getElementById("defendButton");
let checkB = document.getElementById("checkButton");
let cItemB = document.getElementById("cItemButton");
let clearB = document.getElementById("clearButton");
let restartB = document.getElementById("restartBattle");

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
    this.Resistance = parseFloat(resistance), // Percentage which can range from 100% to -∞%
    this.AttackPower = parseInt(attackPower),

    this.damageHP = function(dmg) // Returns true if the entity was killed, false otherwise.
    {
        if (this.HP <= 0)
            return false; // This doesn't let the entity get damaged if it's hp is 0 or less, useful for detirmining if the entity was actually killed or not when the method is called.
        
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
            return true;
        else
            return false;
    },

    this.healHP = function(amount, healPastMax)
    {
        this.HP += amount;

        if (healPastMax)
            return;
        else if (this.HP > this.MaxHP)
            this.HP = this.MaxHP;
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



function attackEnemy()
{
    if (player.HP <= 0)
    {
        addMessageInOutput("Can\'t attack cuz ur ded.");
        return;
    }

    let bool = enemy.damageHP(player.AttackPower); // Returns true if the enemy was killed by this attack

    if (bool)
        addMessageInOutput("The player has killed the enemy.");
    else
        addMessageInOutput("The player has attacked the enemy.");
    
    enemyTurn();
    updateDisplayedStats();
}

function defend()
{
    addMessageInOutput("Skipped");
    enemyTurn();
}

function checkEnemy()
{
    addMessageInOutput("Checked");
}

function useConsumableItem()
{
    addMessageInOutput("Used item");
}

function enemyTurn()
{
    if (enemy.HP > 0)
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
    playerStatsP.textContent = `Player HP: ${player.HP}; Player ATK: ${player.AttackPower}`; // First time hearing about backticks (`) in my life, reminder for self: they're located to the left of the 1 key
    enemyStatsP.textContent = `Enemy HP: ${enemy.HP}; Enemy ATK: ${enemy.AttackPower}`;
}

function restartBattle()
{
    player.HP = player.MaxHP;
    enemy.HP = enemy.MaxHP;

    clearOutput();
    updateDisplayedStats();
}
//


// Event listeners
attackB.addEventListener("click", attackEnemy);
defendB.addEventListener("click", defend);
checkB.addEventListener("click", checkEnemy);
cItemB.addEventListener("click", useConsumableItem);

clearB.addEventListener("click", clearOutput);
restartB.addEventListener("click", restartBattle)

//


// Function calls
clearOutput();
updateDisplayedStats();
//