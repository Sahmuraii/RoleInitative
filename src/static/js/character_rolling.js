const display = document.getElementById("numberDisplay");
const textDisplay = document.getElementById("rollingTextDisplay");
const skills = document.getElementsByName("skill_id_modifier");

function rollDice(sides, modifier) {
    textDisplay.textContent = "";
    display.scrollIntoView();
    changeDisplay(sides, modifier);
}

function changeDisplay(max, modifier) {

    var changes = 0;
    const totalChanges = 20;
    const intervalTime = 1500 / totalChanges;
    

    const interval = setInterval(() => {
        changes++;
        randValue = Math.ceil(Math.random() * max);
        display.textContent = `${randValue}`;

        if (changes === totalChanges) {
            clearInterval(interval); 
            if(modifier < 0) {
                display.textContent += ` - ${Math.abs(modifier)} = ${randValue + modifier}`
            }
            else {
                display.textContent += ` + ${modifier} = ${randValue + modifier}`
            }
            
            if(randValue == max) {
                textDisplay.textContent = "Critical Hit!";
            }
            else if(randValue == 1) {
                textDisplay.textContent = "Critical Failure...";
            }
            else {
                textDisplay.textContent = `You rolled a ${randValue + modifier}!`;
            }
            
        }
    }, intervalTime);

}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".character_skill_line_bonus").forEach((element) => {
        element.addEventListener("click", () => {
            rollDice(20, parseInt(element.textContent));
        });
    });

    initiativeButton = document.getElementById("initiative_field")
    initiativeButton.addEventListener("click", () => {
        rollDice(20, parseInt(initiativeButton.textContent))
    });

    initiativeButton = document.getElementById("initiative_field")
    initiativeButton.addEventListener("click", () => {
        rollDice(20, parseInt(initiativeButton.textContent))
    });

    document.querySelectorAll(".character_modifier_field").forEach((element) => {
        element.addEventListener("click", () => {
            rollDice(20, parseInt(element.textContent));
        });
    });

    savingthrow0 = document.getElementById("saving_throw_1_field")
    savingthrow0.addEventListener("click", () => {
        rollDice(20, parseInt(savingthrow0.textContent))
    });

    savingthrow1 = document.getElementById("saving_throw_1_field_1")
    savingthrow1.addEventListener("click", () => {
        rollDice(20, parseInt(savingthrow1.textContent))
    });

    savingthrow2 = document.getElementById("saving_throw_1_field_2")
    savingthrow2.addEventListener("click", () => {
        rollDice(20, parseInt(savingthrow2.textContent))
    });

    savingthrow3 = document.getElementById("saving_throw_1_field_3")
    savingthrow3.addEventListener("click", () => {
        rollDice(20, parseInt(savingthrow3.textContent))
    });

    savingthrow4 = document.getElementById("saving_throw_1_field_4")
    savingthrow4.addEventListener("click", () => {
        rollDice(20, parseInt(savingthrow4.textContent))
    });

    savingthrow5 = document.getElementById("saving_throw_1_field_5")
    savingthrow5.addEventListener("click", () => {
        rollDice(20, parseInt(savingthrow5.textContent))
    });
});