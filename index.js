const discord = require('discord.js');
const bot = new discord.Client();
bot.on('ready', () => { bot.user.setGame('D&D probably') });
var operands = ["+", "-", "*", "/", "^", "!", "sqrt"];
var classes = ["Barbarian", "Bard", "Cleric", "Druid", "Fighter", "Monk", "Paladin", "Ranger", "Rogue", "Sorcerer", "Warlock", "Wizard"];
var races = ["Dwarf", "Elf", "Halfling", "Human", "Dragonborn", "Gnome", "Half-Elf", "Half-Orc", "Tiefling"];
bot.on("message", msg=>{
    var message = msg.content.toLowerCase();
    let prefix = "!";
    let rollPre = "!";
    let botName = bot.user;
    if(msg.content.startsWith(prefix) || message.includes(botName)){}
    else return;
    if(msg.author.bot) return;
    if(message == prefix + "help"){
        msg.channel.sendMessage("Command List: \n" + "```css\n!ndx+y``` ```will roll a die where 'n' is the number of dice, 'x' is the number of sides on the die, and 'y' is the modifier. You can use a + or a - operand too. (example: 2d6+5)```\n"
        + "```css\n!rollstats```" + "```will create a random array of stats for you and display some useful information```\n"
        + "```css\n!rollcharacter``` ```will create a random character with a random set of stats, race and class.```\n"
        + "```css\n+ - * / ! ^n sqrt``` ```Typing a message with only numbers and one of these operands (no command needed) will do some math for you. (Example: [5!], [1+2], [sqrt64], [2^8], etc)\nNote: Does not support 'long math' yet. Keep things simple```"
        + "```css\n!flip``` ```Flips a coin```");
    }
    if(message == prefix + "rollstats"){
        var stat = rollStats();
        var total = totalMod(CalModifier(stat));
        msg.channel.sendMessage("Here's your generated statblock: " + stat + "\nHere are your modifiers: " + CalModifier(stat) + "\n" + total);
    }
    if(message == prefix + "rollcharacter"){
        msg.channel.sendMessage(rollCharacter());
    }
    if(msg.content.startsWith(prefix + "flip")){
        var result = Math.floor(Math.random() * 2) + 1;
        if(result == 1)
            msg.channel.sendMessage("Heads");
        else
            msg.channel.sendMessage("Tails");
    }
    

});
bot.on("message", msg=>{
    var message = msg.content.toLowerCase();
    let prefix = "!";
    if(msg.author.bot) return;
    for(i = 0; i < operands.length; i++){
        var variable;
        var v1, v2;
        if(message.includes(operands[i])){
            variables = message.split(operands[i]);
            v1 = parseFloat(variables[0]);
            v2 = parseFloat(variables[1]);
            if(operands[i] == "!" && !isNaN(v1)){
                var res = 1;
                for(n = v1; n > 1; n--){
                    res = res*n;
                }
                msg.reply(res);
                
            }
            if(operands[i] == "sqrt" && !isNaN(v2)){
                msg.reply(Math.sqrt(v2));
                
            }
            if((isNaN(v1) || isNaN(v2)))
                break;
            else if(operands[i] == "+")
                msg.reply(v1 + v2);
            else if(operands[i] == "-")
                msg.reply(v1 - v2);
            else if(operands[i] == "*")
                msg.reply(v1 * v2);
            else if(operands[i] == "/")
                msg.reply(v1 / v2); 
            else if(operands[i] == "^"){
                var res = 1;
                for(n = 0; n < v2; n++){
                    res = res*v1;
                }
                msg.reply(res);
            }            
        }

    }        
});

bot.on("message", msg=>{
    
    var message = msg.content.toLowerCase();
    let prefix = "!";
    let botName = bot.user;
    if(msg.content.startsWith(prefix) && msg.content.includes("d")){
        var fullRoll = msg.content;
        console.log(fullRoll);
        if(!(msg.content.includes("+") || msg.content.includes("-"))){
            fullRoll = msg.content + "+0";
        }
        var operand;
        if(msg.content.includes("-")){operand = "-";}
        else operand = "+";
        var temp = fullRoll;
        console.log("pre: " + temp);
        temp = reverseString(temp);
        console.log("reversing: " + temp);
        temp = temp.split(operand); //operand
        console.log("splitting: " + temp);
        var dieMod = reverseString(String(temp[0]));
        console.log("DMOD = " + dieMod);
        temp.shift();
        temp = reverseString(String(temp));
        console.log(temp);
        var temp0 = temp;
        temp0 = temp0.split("d");
        temp0.shift();
        console.log(temp0);
        var dieSide = reverseString(temp0);
        var dieNum = 1;
        var splice = String(msg.content);
        var rollResult;
        
        if(!msg.content.startsWith(prefix + "d")){
            splice = splice.replace(prefix,"");
            splice = reverseString(splice);
            splice = splice.split("d");
            splice.shift();
            splice = splice.toString();
            splice = reverseString(splice);
            dieNum = splice;
            if(operand == "-"){dieMod = "-" + dieMod;}
            rollResult = Roll(dieNum,dieSide, dieMod);
            msg.reply(rollResult);
            
        }
        else if(msg.content.includes("+")){
            var temp2 = reverseString(msg.content);
            temp2 = msg.content.split("+");
            dNum = String(temp2[0]);
            mod = String(temp2[1]);
            var x = dNum.split("d");
            dNum = x[1];
            var roll1 = RollSingle(dNum);
            var result = add(roll1, mod);
            msg.reply(result + " = (" + roll1 + "+" + mod + ")");
            console.log(roll1 + " " + mod);

        }
         else if(msg.content.includes("-")){
            var temp2 = reverseString(msg.content);
            temp2 = msg.content.split("-");
            dNum = String(temp2[0]);
            mod = String(temp2[1]);
            var x = dNum.split("d");
            dNum = x[1];
            var roll1 = RollSingle(dNum);
            var result = sub(roll1, mod);
            msg.reply(result + " = (" + roll1 + "-" + mod + ")");
            console.log(roll1 + " " + mod);

        }
        else
            msg.reply(RollSingle(dieSide));
    }
});
function choose(){
    var choice = RollSingle(2);
    if(choice == 1)
        return "yes";
    else   
        return "no";

}
function rollCharacter(){
    var stats = rollStats();
    console.log(stats);
    stats = String(stats);
    console.log(stats);
    stats = stats.split(",");
    console.log(stats[0]);
    var race = races[generateRace()];
    var dClass = classes[generateClass()];
    return assignPoints(dClass, stats, race);;
}
function assignPoints(classes, stats, race){
    var sortStats = numSort(stats);
    var str = stats[0];
    var con = stats[1];
    var dex = stats[2];
    var cha = stats[3];
    var wis = stats[4];
    var int = stats[5];
    
    if(classes == "Rogue"){
        
    }
    if(classes == "Barbarian"){
        
    }
    if(classes == "Bard"){

    }
    if(classes == "Druid"){

    }
    if(classes == "Fighter"){

    }
    if(classes == "Monk"){

    }
    if(classes == "Paladin"){

    }
    if(classes == "Ranger"){

    }
    if(classes == "Sorcerer"){

    }
    if(classes == "Warlock"){

    }
    if(classes == "Wizard"){

    }

    var final = "Race: " + race + "\n" +
                "Class: " + classes + "\n" +
                "Str: " + str + "\n" +
                "Con: " + con + "\n" +
                "Dex: " + dex + "\n" +
                "Cha: " + cha + "\n" +
                "Wis: " + wis + "\n" +
                "Int: " + int + "\n";
    return final;
}
function numSort(a){
    for(i = 0; i < a.length; i++){
        a[i] = parseInt(a[i]);
    }
    var temp;
    for(i=0; i<6; i++){
        for(j=0; j<6-i-1; j++){
            if( a[j] < a[j+1]){
            temp = a[j];
            a[j] = a[j+1];
            a[j+1] = temp;
            } 
        }
    }
    return a;
}
function generateRace(){
    return rand(0,races.length);
}
function generateClass(){
    return rand(0,classes.length);
}
function rollStats(){
    var score = new Array(0, 0, 0, 0, 0, 0);
    var stat = [];
    for(j = 0; j < 6; j++){
        for(i = 0; i <4; i++){
            stat[i] = RollSingle(6);
        }
        stat.sort();
        stat.shift();
        for(x = 0; x < 3; x++){
            score[j] = score[j] + stat[x];
        }
        //console.log(stat);
        //console.log(score);
    }
    
    return score;

}
function CalModifier(score){
    var mods = new Array(0,0,0,0,0,0);
    for(i = 0; i <6; i++){
        mods[i] = parseInt((score[i] - 10)/2);
    }
    return mods;
}
function totalMod(mods){
    var total = 0;
    for(i = 0; i < 6; i++){
        total = total + mods[i];
    }
    if(total < 4)
        return "Your total modifier is " + total + "; you may be too weak, consider rerolling.";
    else if(total >7)
        return "Your total modifier is " + total + "; you may be too strong, consider rerolling.";
    else 
        return "Your total modifier is " + total;
}
function add(x1,x2){
    x1 = parseInt(x1);
    x2 = parseInt(x2);
    return x1 + x2;
}
function sub(x1,x2){
    x1 = parseInt(x1);
    x2 = parseInt(x2);
    return x1 - x2;
}
function reverseString(str) {

    var newString = "";
    for (var i = str.length - 1; i >= 0; i--) { 
        newString += str[i]; 
    }
    return newString; 
}
function rand(from, to){
    var roll = Math.floor(Math.random() * to) + from;
    return roll;
}
function RollSingle(dieSide){
    var final;
    var roll = Math.floor(Math.random() * dieSide) + 1;
        final = roll;
    //console.log("ROLLIN SINGLE");
    return final;
}
function Roll(dieNum, dieSide, mod){
    var total = 0;
    var result;
    var die = [];
    var rolls = "";
    for(i = 0; i < dieNum; i++){
        result = RollSingle(dieSide);
        total = total + result;
        die[i] = result;
        if(i == dieNum-1){
            rolls = rolls + result;
        }
        else{
            rolls = rolls + result + " + ";
        }
        //console.log(result);
    }
    total = parseInt(total) + parseInt(mod);
    console.log(total);
    if(mod < 0){
        mod = mod*-1;
        return total + " = (" + rolls + ")" + " - " + mod;
    }
    else {return total + " = (" + rolls + ")" + " + " + mod;}
}
bot.login('MzE0MTg0NzMzNTczNjQ0Mjg4.C_0fAA.pEbYZb5w06PKvr2Lv_HqcJ-X63k');