UI.AddCheckbox("premium trashtalk");
var js_items = ["Misc", "JAVASCRIPT", "Script Items"];
//Gay killsay territory
var normal_killsays = ["ez", "too fucking easy", "effortless", "easiest kill of my life", 
    "retard blasted", "cleans?", "nice memesense retard", "hello mind explaining what happened there", 
    "pounce out of your window disgusting tranny, you shouldnt exist in this world", 
    "а вы че клины???", "обоссал мемюзера лол", "ты че там отлетел то", 
    "lmao ur so ugly irl like bro doesnt it hurt to live like that, btw you know you can just end it all",
    "ROFL NICE *DEAD* HHHHHHHHHHHHHHHHHH", "take the cooldown and let your team surr retard",
    "go take some estrogen tranny", "uid police here present your user identification number right now",
    "нищий улетел", "*DEAD* пофикси нищ", "сразу видно юид иссуе хуле тут",
    "у мамки что кфг иссуе была шо тебя родила", "а ты и в жизни ньюкамыч????", "сука не позорься и ливни лол",
    "юид полиция подьехала открывай дверь уебыч", "набутылирован лол", "tranny holzed", 
    "але ты там из хрущевки выеди а потом вырыгивай блять", "как там с мамкой комнату разделять АХАХАХХАХА как ты на акк накопил блять",
    "найс 0.5х0.5м комната блять ХАХАХАХА ТЫ ТАМ ЖЕ ДАЖЕ ПОВЕСИТЬСЯ НЕ МОЖЕШЬ МЕСТА НЕТ ПХПХПХППХ", "better buy the superior hack!",
    "на мыло и веревку то деньги есть нищ????", "whatcha shootin at retard", "опущены стяги, легион и.. А БЛЯТЬ ТЫЖ ТУТ ОПУЩ НАХУЙ ПХГАХААХАХАХАХА)))))))",
    "але какая с юидом ситуация)))", "бля че тут эта нищая собака заскулила", "не хотелось даже руки об тебя марать нищ сука", "ебать ты красиво на бутылку упал",
    "прости что без смазки)))", "алло это скорая? тут такая ситуация нищ упал))) ОЙ А ВЫ НИЩАМ ТО НЕ ПОМОГАЕТЕ?? ПОНЯТНО Я ПОЙДУ ТОГДА))))))))", "nice 0.5x0.5m room you poorfag, how the fuck did you afford an acc hhhhhh", "вырыгнись из окна нахуй боберхук юзер",
    "тяжело с мемсенсом наверно????", "imagine losing at video games couldn't ever be me", "але а противники то где???", "nice chromosome count you sell??", "nice thirdworldspeak ROFL", "как ты на пк накопил даже не знаю )))))))))",
    "iq больше двух будет пмнешь ок????"
];
    
var hs_killsays = ["ez", "effortless", "1", "nice antiaim, you sell?", "you pay for that?", 
    "refund right now", "consider suicide", "bro are u clean?",
    "another retard blasted",
    "hhhhhhhhhhhhhhhhhh 1, you pay for that? refund so maybe youll afford some food for your family thirdworld monkey",
    "paster abandoned the match and received a 7 day competitive matchmaking cooldown",
    "freeqn.net/refund.php", "refund your rainbowhook right now pasteuser dog",
    "бля эт пиздец че какие то там нищи с мемсенсом рыгают блять",
    "тебе права голоса не давали thirdworlder ебаный",
    "на завод иди",
    "JAJAJAJJAJA NICE RAINBOWPASTE ROFL",
    "140er????", "get good get vantap4ik",
    "1 but all you need to fix your problems is a rope and a chair you ugly shit",
    "who (kto) are you (nn4ik) wattafak mens???????", "must be an uid issue", "holy shit consider refunding your trash paste rofl",
    "hello please refund your subpar product",
    "ебать тебя унесло", "рефандни пожалуйста", 
    "на бутылку русак",
    "a вы (you) сэр собственно кто (who)?",
    "бля пиздос может рефнешь???",
    "как там жизнь с рупастой??????",
    "але может не будешь тратить мамкину зарплату на говнопасты???",
    "stop spending your lunch money on shitpastes retard",
    "бля я рядом только прошел а ты уже упал АУУ НИЩ С ТОБОЙ ВСЕ ХОРОШО??????????))))))",
    "ой нищий упал щас скорую вызовем",
    "ой а кто (who) ты (you) такой вотзефак мен))))))",
    "thats going in my media compilation right there get shamed retard rofl",
    "imagine the only thing you eat being bullets man being a thirdworlder must suck rofl", "so fucking ez", "bot_kick", "where the enemies at????",
    "але найс упал нищ ЛОООООООЛ", "с тобой там все хорошо????????????? а да ты нищ нахуя я спрашиваю ПХАХАХАХАХХА",
    "жаль конечно что против нищей играть надо)))", "тебе даже спин не поможет блять, нахуй ты вообще живешь", "ты можешь заселлить лишнюю хромосому???",
    "научи потом как так сосать на хвх", "когда не накопил на гормоны и чулки)))))))))))))", "как там жизнь на мамкину пенсию???????", "але я бот_кик в консоль вроде прописал а вас там не кикнуло эт че баг??)))))))))",
    "крякоюзер down, на завод нахуй", "я не понял ты такой жирный потомучто дошики каждый день жрешь???? нормальную работу найди может на еду денег хватит))))))))))))"
];

//I hope you haven't gotten cancer after reading those

function on_player_death()
{
    if(UI.GetValue(js_items, "premium trashtalk"))
    {
        var victim = Entity.GetEntityFromUserID(Event.GetInt("userid"));
		var attacker = Entity.GetEntityFromUserID(Event.GetInt("attacker"));
		var headshot = Event.GetInt("headshot") == 1;
        
        if(Entity.IsLocalPlayer(attacker) && attacker != victim)
        {
            var normal_say = normal_killsays[Math.floor(Math.random() * normal_killsays.length)];
			var hs_say = hs_killsays[Math.floor(Math.random() * hs_killsays.length)];
            
            if(headshot && Math.floor(Math.random() * 2) <= 1) //gamer style randomizer
            {
                Cheat.ExecuteCommand("say " + hs_say);
                return;
            }
            Cheat.ExecuteCommand("say " + normal_say);
        }
    }
}

var killsay_amt = normal_killsays.length + hs_killsays.length;

Cheat.Print("trashtalk js loaded, killsay count: " + killsay_amt + "\n");
Cheat.RegisterCallback("player_death", "on_player_death");