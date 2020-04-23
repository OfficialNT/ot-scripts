var js_items = ["Misc", "JAVASCRIPT", "Script Items"];
var rbot_weapon_types = ["GENERAL", "PISTOL", "HEAVY PISTOL", "SCOUT", "AWP", "AUTOSNIPER"];
var reworked_lbot_guns = ["Pistol", "Heavy pistol", "Heavy", "Rifle", "SMG", "Scout", "AWP", "Autosnipers"];

var mathlib = require("mathlib.js")
function setup_menu()
{
    UI.AddCheckbox("Enable semirage assist");
    UI.AddHotkey("Legitbot aimkey");
    UI.AddLabel("Magnet trigger uses ragebot bind!");
    UI.AddHotkey("Autowall");
    UI.AddDropdown("Default mode (no autowall key)", ["Legit autowall", "No autowall"]);

    UI.AddDropdown("Currently configured weapon", reworked_lbot_guns);
    for(var i = 0; i < 8; i++)
    {
        var current_gun = reworked_lbot_guns[i];
        UI.AddDropdown(current_gun + " legitbot hitbox selection", ["Closest to crosshair", "Most damage"]);
        UI.AddSliderFloat(current_gun + " legitbot FOV", 0.1, 60.0);
        UI.AddSliderFloat(current_gun + " legitbot modified smooth FOV", 0.1, 60.0);
        UI.AddSliderFloat(current_gun + " magnet trigger dynamic FOV start", 0.1, 180.0);
        UI.AddSliderFloat(current_gun + " magnet trigger dynamic FOV end", 0.1, 180.0);
        UI.AddSliderFloat(current_gun + " magnet trigger dynamic FOV modifier", 100, 250);
        UI.AddSliderFloat(current_gun + " magnet trigger autowall FOV", 0, 10.0);
        UI.AddSliderFloat(current_gun + " smoothing", 1.0, 10.0);
        UI.AddSliderFloat(current_gun + " modified smooth", 1.0, 10.0);

        UI.AddCheckbox(current_gun + " recoil control");
        UI.AddSliderFloat(current_gun + " recoil control strength (pitch)", 0.0, 2.0);
        UI.AddSliderFloat(current_gun + " recoil control strength (yaw)", 0.0, 2.0);

        UI.AddSliderInt(current_gun + " inaccuracy limit", 0, 100);

        UI.AddHotkey("Force legitbot bodyaim on " + current_gun.toLowerCase());

        UI.AddSliderInt(current_gun + " legitbot minimum damage", 0, 100);
        UI.AddSliderInt(current_gun + " legitbot health override", 1, 20);

        if(i == 2 || i == 3 || i == 4)
        {
            UI.AddSliderInt(current_gun + " magnet trigger minimum damage", 0, 130);
            UI.AddSliderInt(current_gun + " magnet trigger hitchance", 0, 100);
            UI.AddCheckbox(current_gun + " prefer bodyaim on magnet trigger");
            UI.AddCheckbox(current_gun + " prefer safepoint on magnet trigger");
        }
        UI.AddSliderFloat(current_gun + " legitbot kill delay (seconds)", 0, 1.0);

        UI.AddCheckbox(current_gun + " flash check");
    }

    UI.AddCheckbox("Enable legit AA");
    UI.AddDropdown("LBY Mode", ["Safe", "Extend"]);
    UI.AddHotkey("Legit AA juke");
    UI.AddMultiDropdown("Semirage assist indicators", ["Aimbot status", "Autowall", "Legit AA", "Choke", "Inaccuracy", "Watermark"]);
    UI.AddCheckbox("Trashtalk");
}

setup_menu();

var local = 0;

var script_config = {
rbot_active: 0,
script_active: 0,
rbot_fov_min: -1,
rbot_fov_max: -1,
rbot_fov_mod: -1,
rbot_fov_awall: -1,
rbot_optional_mindmg: -1,
rbot_optional_hc: -1,
rbot_optional_baim: 0,
rbot_optional_safepoint: 0,
autowall_active: 0,
autowall_mode: -1,
legitaa_active: 0,
legitaa_lby_mode: -1,
legitaa_juke_active: 0,
indicator_picks: -1,
trashtalk: 0,

lbot_active: 0,
lbot_target_selection: -1,
lbot_fov: -1,
lbot_mod_fov: -1,
lbot_smooth: -1,
lbot_mod_smooth: -1,
lbot_rcs: 0,
lbot_rcs_pitch: -1,
lbot_rcs_yaw: -1,
lbot_spread_limit: 0,
lbot_baim: 0,
lbot_mindmg: -1,
lbot_hp_override: -1,
lbot_kill_delay: -1,
lbot_max_flash: 0
};
//Trying out a new model for this shit

var cached_wpnname = "";
var cached_wpntype = -1;
function get_weapon_for_config()
{
    var wpn_name = Entity.GetName(Entity.GetWeapon(local));
    if(cached_wpnname == wpn_name)
    {
        return cached_wpntype;
    }
    var ret = 0; 
    switch(wpn_name)
    {
        case "usp s":
        case "p2000":
        case "glock 18":
        case "dual berettas":
        case "p250":
        case "tec 9":
        case "five seven":
        case "cz75 auto":
            break;
        case "desert eagle":
        case "r8 revolver":
            ret = 1;
            break;
        case "nova":
        case "xm1014":
        case "mag 7":
        case "sawed off":
        case "m249":
        case "negev":
            ret = 2;
            break;
        case "famas":
        case "galil ar":
        case "ak 47":
        case "m4a4":
        case "m4a1 s":
        case "sg 553":
        case "aug":
            ret = 3;
            break;
        case "mac 10":
        case "mp9":
        case "mp7":
        case "mp5 sd":
        case "ump 45":
        case "pp bizon":
        case "p90":
            ret = 4;
            break;
        case "ssg 08":
            ret = 5;
            break;
        case "awp":
            ret = 6;
            break;
        case "scar 20":
        case "g3sg1":
            ret = 7;
            break;
        default:
            ret = -1; //on knives/whatnot
            break;
    }
    cached_wpnname = wpn_name;
    cached_wpntype = ret;
    return ret;
}

function convert_weapon_index_into_rbot_idx(wpn_index) //Converts current weapon type into ragebot index
{
    switch(wpn_index)
    {
        case 0:
            return 1;
        case 1:
            return 2;
        case 2:
        case 3:
        case 4:
            return 0;
        case 5:
            return 3;
        case 6:
            return 4;
        case 7:
            return 5;
    }
}

var prev_wpntype_settings = -1;
function update_settings()
{
    script_config.rbot_active = UI.IsHotkeyActive("Rage", "General", "Enabled");
    script_config.lbot_active = UI.IsHotkeyActive(js_items, "Legitbot aimkey");
    script_config.script_active = UI.GetValue(js_items, "Enable semirage assist");
    script_config.autowall_active = UI.IsHotkeyActive(js_items, "Autowall");
    script_config.autowall_mode = UI.GetValue(js_items, "Default mode (no autowall key)");
    script_config.legitaa_active = UI.GetValue(js_items, "Enable legit AA");
    script_config.legitaa_lby_mode = UI.GetValue(js_items, "LBY Mode");
    script_config.legitaa_juke_active = UI.IsHotkeyActive(js_items, "Legit AA juke");
    script_config.indicator_picks = UI.GetValue(js_items, "Semirage assist indicators");
    script_config.trashtalk = UI.GetValue(js_items, "Trashtalk");

    if(World.GetServerString() == "" || !Entity.IsValid(local) || !Entity.IsAlive(local)) 
    {
        return; //Can't really go further without using localplayer's weapon.
    }

    var local_weapon_type = get_weapon_for_config();
    Cheat.Print("current local weapontype: " + reworked_lbot_guns[local_weapon_type] + "\n");
    Cheat.Print("cached weapontype: " + reworked_lbot_guns[prev_wpntype_settings] + "\n");
    if(local_weapon_type == -1 || prev_wpntype_settings == local_weapon_type)
    {
        return;
    }
    
    var weapon_name = reworked_lbot_guns[local_weapon_type];

    script_config.rbot_fov_min = UI.GetValue(js_items, weapon_name + " magnet trigger start FOV");
    script_config.rbot_fov_max = UI.GetValue(js_items, weapon_name + " magnet trigger end FOV");
    script_config.rbot_fov_mod = UI.GetValue(js_items, weapon_name + " magnet trigger dynamic FOV modifier");

    if(convert_weapon_index_into_rbot_idx(local_weapon_type) == 0)
    {
        rbot_optional_mindmg = UI.GetValue(js_items, weapon_name + " magnet trigger minimum damage");
        rbot_optional_hc = UI.GetValue(js_items, weapon_name + " magnet trigger hitchance");
        rbot_optional_baim = UI.GetValue(js_items, weapon_name + " prefer bodyaim on magnet trigger");
        rbot_optional_safepoint = UI.GetValue(js_items, weapon_name + " prefer safepoint on magnet trigger");
    }
    script_config.lbot_fov = UI.GetValue(js_items, weapon_name + " legitbot FOV");
    script_config.lbot_mod_fov = UI.GetValue(js_items, weapon_name + " legitbot modified smooth FOV");
    script_config.lbot_target_selection = UI.GetValue(js_items, weapon_name + " legitbot hitbox selection");
    script_config.lbot_smooth = UI.GetValue(js_items, weapon_name + " smoothing");
    script_config.lbot_mod_smooth = UI.GetValue(js_items, weapon_name + " modified smooth");

    script_config.lbot_rcs = UI.GetValue(js_items, weapon_name + " recoil control");
    script_config.lbot_rcs_pitch = UI.GetValue(js_items, weapon_name + " recoil control strength (pitch)");
    script_config.lbot_rcs_yaw = UI.GetValue(js_items, weapon_name + " recoil control strength (yaw)");

    script_config.lbot_spread_limit = UI.GetValue(js_items, weapon_name + " inaccuracy limit");
    
    script_config.lbot_baim = UI.IsHotkeyActive(js_items, "Force legitbot bodyaim on " + weapon_name.toLowerCase());

    script_config.lbot_mindmg = UI.GetValue(js_items, weapon_name + " legitbot minimum damage");
    script_config.lbot_hp_override = UI.GetValue(js_items, weapon_name + " legitbot health override");

    script_config.lbot_kill_delay = UI.GetValue(js_items, weapon_name + " legitbot kill delay (seconds)");
    script_config.lbot_max_flash = UI.GetValue(js_items, weapon_name + " flash check");

    prev_wpntype_settings = local_weapon_type;
}

function clamp(val, min, max)
{
	return Math.max(min,Math.min(max,val));
}

function random_float(min, max)
{
    return Math.random() * (max - min) + min;
}

var last_script_enabled_state = -1; //Force the script to update the visibility on load
var last_configured_weapon = -1; //Cached to prevent useless visibility updates.
function handle_visibility()
{
    if(!UI.IsMenuOpen())
    {
        return; //What's the point of handling menu visibility if the damn thing isn't even visible?
    }    
    if(script_config.script_active != last_script_enabled_state)
    {
        UI.SetEnabled(js_items, "Magnet trigger uses ragebot bind!", script_config.script_active);
        UI.SetEnabled(js_items, "Autowall", script_config.script_active);
        UI.SetEnabled(js_items, "Legitbot aimkey", script_config.script_active);
        UI.SetEnabled(js_items, "Default mode (no autowall key)", script_config.script_active);
        UI.SetEnabled(js_items, "Currently configured weapon", script_config.script_active);
        UI.SetEnabled(js_items, "Enable legit AA", script_config.script_active);
        UI.SetEnabled(js_items, "LBY Mode", script_config.script_active && script_config.legitaa_active);
        UI.SetEnabled(js_items, "Legit AA juke", script_config.script_active && script_config.legitaa_active);

        UI.SetEnabled(js_items, "Semirage assist indicators", script_config.script_active);
        UI.SetEnabled(js_items, "Trashtalk", script_config.script_active);

    }
    var cur_selected_gun = UI.GetValue(js_items, "Currently configured weapon"); //Shame I have to do it like this.
    var lbot_weapons_length = 8; //Hardcoded because it won't change lol
    if(last_configured_weapon != cur_selected_gun || script_config.script_active != last_script_enabled_state)
    {
        Cheat.Print("cached weapon changed! \n");
        for(var i = 0; i < lbot_weapons_length; i++)
        {
            var weapon_name = reworked_lbot_guns[i];
            UI.SetEnabled(js_items, weapon_name + " legitbot hitbox selection", script_config.script_active && cur_selected_gun == i);
            UI.SetEnabled(js_items, weapon_name + " legitbot FOV", script_config.script_active && cur_selected_gun == i);
            UI.SetEnabled(js_items, weapon_name + " legitbot modified smooth FOV", script_config.script_active && cur_selected_gun == i);
            UI.SetEnabled(js_items, weapon_name + " magnet trigger dynamic FOV start", script_config.script_active && cur_selected_gun == i);
            UI.SetEnabled(js_items, weapon_name + " magnet trigger dynamic FOV end", script_config.script_active && cur_selected_gun == i);
            UI.SetEnabled(js_items, weapon_name + " magnet trigger dynamic FOV modifier", script_config.script_active && cur_selected_gun == i);
            UI.SetEnabled(js_items, weapon_name + " magnet trigger autowall FOV", script_config.script_active && cur_selected_gun == i);
            UI.SetEnabled(js_items, weapon_name + " smoothing", script_config.script_active && cur_selected_gun == i);
            UI.SetEnabled(js_items, weapon_name + " modified smooth", script_config.script_active && cur_selected_gun == i);
            UI.SetEnabled(js_items, weapon_name + " recoil control", script_config.script_active && cur_selected_gun == i);
            UI.SetEnabled(js_items, weapon_name + " recoil control strength (pitch)", script_config.script_active && cur_selected_gun == i);
            UI.SetEnabled(js_items, weapon_name + " recoil control strength (yaw)", script_config.script_active && cur_selected_gun == i);
            UI.SetEnabled(js_items, weapon_name + " inaccuracy limit", script_config.script_active && cur_selected_gun == i);
            UI.SetEnabled(js_items, "Force legitbot bodyaim on " + weapon_name.toLowerCase(), script_config.script_active && cur_selected_gun == i);
            UI.SetEnabled(js_items, weapon_name + " legitbot minimum damage", script_config.script_active && cur_selected_gun == i);
            UI.SetEnabled(js_items, weapon_name + " legitbot health override", script_config.script_active && cur_selected_gun == i);
            UI.SetEnabled(js_items, weapon_name + " magnet trigger hitchance", script_config.script_active && cur_selected_gun == i && (i == 2 || i == 3 || i == 4));
            UI.SetEnabled(js_items, weapon_name + " magnet trigger minimum damage", script_config.script_active && cur_selected_gun == i && (i == 2 || i == 3 || i == 4));
            UI.SetEnabled(js_items, weapon_name + " prefer bodyaim on magnet trigger", script_config.script_active && cur_selected_gun == i && (i == 2 || i == 3 || i == 4));
            UI.SetEnabled(js_items, weapon_name + " prefer safepoint on magnet trigger", script_config.script_active && cur_selected_gun == i && (i == 2 || i == 3 || i == 4));
            UI.SetEnabled(js_items, weapon_name + " legitbot kill delay (seconds)", script_config.script_active && cur_selected_gun == i);
            UI.SetEnabled(js_items, weapon_name + " flash check", script_config.script_active && cur_selected_gun == i);
        }
    }
    last_script_enabled_state = script_config.script_active;
    last_configured_weapon = cur_selected_gun;
}
handle_visibility();



function handle_autowall()
{
    var local_eyepos = Entity.GetEyePosition(local);
    var enemies = Entity.GetEnemies();
    var enemy_arr_length = enemies.length;

    for(var i = 0; i < enemy_arr_length; i++)
    {
        if(Entity.IsValid(enemies[i]) && Entity.IsAlive(enemies[i]) && !Entity.IsDormant(enemies[i]))
        {
            var vis_length = 0;
            for(var j = 0; j <= 18; j++)
            {
                if(script_config.autowall_mode == 0 && vis_length > 0)
                {
                    break;
                }
                var hitbox = Entity.GetHitboxPosition(enemies[i], j);
                if(typeof(hitbox) == "undefined") //sometimes happens l0l
                {
                    Cheat.Print("hitbox " + j + " was undefined on player " + Entity.GetName(enemies[i]) + "\n");
                    continue;
                }
                var trace = Trace.Bullet(local, enemies[i], local_eyepos, hitbox);
                if(trace[2])
                {
                   vis_length++;
                }
            }
            if(script_config.autowall_mode == 1 ? vis_length < 13 : vis_length == 0) //Ghetto AF
            {
                Ragebot.IgnoreTarget(enemies[i]);
            }
        }
    }
}

function handle_legitaa()
{
    if(script_config.script_active && script_config.legitaa_active)
    {
        AntiAim.SetOverride(1);
        UI.SetValue("Misc", "PERFORMANCE & INFORMATION", "Information", "Restrictions", 0);
		UI.SetValue("Anti-Aim", "Extra", "Pitch", 0);
		UI.SetValue("Anti-Aim", "Rage Anti-Aim", "Enabled", 1);
		UI.SetValue("Anti-Aim", "Rage Anti-Aim", "Yaw offset", 180);
        var fake_side = UI.IsHotkeyActive("Anti-Aim", "Fake angles", "Inverter");
        //I far prefer doing legit AA this way l0l + it lets us do the juke meme
        var local_velocity = Entity.GetProp(local, "CBasePlayer", "m_vecVelocity[0]");
        var local_velocity_length = Math.sqrt(local_velocity[0] ** 2 + local_velocity[1] ** 2);
        var should_juke = script_config.legitaa_juke_active && local_velocity_length < 3.5;
        var real_yaw_offset = fake_side == 1 ? 60 : -60;
        var lowerbody_offset = script_config.legitaa_lby_mode ? (fake_side == 1 ? (should_juke ? 100 : -100) : (should_juke ? -100 : 100)) : 0;
        AntiAim.SetRealOffset(real_yaw_offset);
        AntiAim.SetLBYOffset(lowerbody_offset);
    }
    else if(!script_config.legitaa_active)
    {
        AntiAim.SetOverride(0);
    }
}

function handle_indicators()
{
    if(script_config.script_active && script_config.indicator_picks && Entity.IsValid(local) && Entity.IsAlive(local))
    {
        var screensize = Render.GetScreenSize();

        var fake_yaw = Local.GetFakeYaw();
        var real_yaw = Local.GetRealYaw();

        var difference = fake_yaw - real_yaw; //i could implement anglediff as a wholly new fn but i cant be arsed, its used like once
        difference %= 360;
        if(difference > 180)
        {
            difference -= 360;
        }
        if(difference < -180)
        {
            difference += 360;
        }

        var base_yaw = screensize[1] * 0.7; //not actually yaw l0l
        if(script_config.indicator_picks & (1 << 0))
        {
            var string_size = Render.TextSize("Aimbot: ", 1);
            Render.String(15, base_yaw, 0, "Aimbot: ", [255, 255, 255, 255], 1);
            Render.String(15 + string_size[0], base_yaw, 0, (script_config.rbot_active ? "ON" : "OFF"), (script_config.rbot_active ? [0, 255, 0, 255] : [255, 0, 0, 255]), 1);
            base_yaw += 15;
        }
        if(script_config.indicator_picks & (1 << 1))
        {
            var string_size = Render.TextSize("Autowall: ", 1);
            Render.String(15, base_yaw, 0, "Autowall: " , [255, 255, 255, 255], 1);
            Render.String(15 + string_size[0], base_yaw, 0, (script_config.autowall_active ? "ON" : (script_config.autowall_mode == 0 ? "LEGIT" : "OFF")), (script_config.autowall_active ? [0, 255, 0, 255] : (script_config.autowall_mode == 0 ? [232, 216, 35, 255] : [255, 0, 0, 255])), 1);
            base_yaw += 15;
        }
        if(script_config.indicator_picks & (1 << 2))
        {
            var string_size = Render.TextSize("Desync: ", 1);
            Render.String(15, base_yaw, 0, "Desync: ", [255, 255, 255, 255], 1);
            Render.String(15 + string_size[0], base_yaw, 0, (script_config.legitaa_active ? (("ON" + (", fake delta: ") + Math.round(difference)) + (script_config.legitaa_juke_active ? " (in juke)" : "")) : "OFF"), (script_config.legitaa_active ? (script_config.legitaa_juke_active ? [150, 35, 232, 255] : [0, 255, 0, 255]) : [255, 0, 0, 255]), 1);
            base_yaw += 15;
        }
        if(script_config.indicator_picks & (1 << 3))
        {
            var string_size = Render.TextSize("Choke: ", 1);
            var choked_fl_ticks = clamp(Math.floor((Globals.Curtime() - Entity.GetProp(local, "CBaseEntity", "m_flSimulationTime")) / Globals.TickInterval()), 0, 16);
            var cool_representation = "";
            for(var i = 0; i < choked_fl_ticks; i++)
            {
                cool_representation += "/";
            }
            Render.String(15, base_yaw, 0, "Choke: " + cool_representation, [255, 255, 255, 255], 1);
            Render.String(15 + string_size[0], base_yaw, 0, cool_representation, [0, 255, 0, 255], 1);
            base_yaw += 15;
        }
        if(script_config.indicator_picks & (1 << 4))
        {
            var string_size = Render.TextSize("Inaccuracy: ", 1);
            var inaccuracy = Local.GetInaccuracy();
            if(inaccuracy == 0)
            {
                inaccuracy = 0.001;
            }
            var inaccuracy_text = 1 / inaccuracy < 50 ? "High" : "Low";
            Render.String(15, base_yaw, 0, "Inaccuracy: ", [255, 255, 255, 255], 1);
            Render.String(15 + string_size[0], base_yaw, 0, inaccuracy_text, (inaccuracy_text == "Low" ? [0, 255, 0, 255] : [255, 0, 0, 255]));
        }
    }
}

//Following was a project for a legitbot remake that I was doing a while ago, couldn't be arsed to make it a separate script. Has some cool shit that Onetap's legitbot kinda lacks, though (like a (probably crazy-FPS-eating) autowall)

//Since the one in mathlib looks to be kinda dumb and since we're cool people I'll just use my own (well ""my own"")
/**
 * 
 * @param {*} {array} from 
 * @param {*} {array} to 
 * @param {*} {array} base_angle
 * @returns {array} angle delta from base angle to calculated angle 
 */
function calculate_angle(from, to, base_angle)
{
    var delta = [];
	delta[0] = from[0] - to[0];
	delta[1] = from[1] - to[1];
	delta[2] = from[2] - to[2];
	var ret_angle = [];
	ret_angle[0] = rad2deg(Math.atan(delta[2] / Math.hypot(delta[0], delta[1]))) - base_angle[0];
	ret_angle[1] = rad2deg(Math.atan(delta[1] / delta[0])) - base_angle[1];
	ret_angle[2] = 0;
	if(delta[0] >= 0.0)
		ret_angle[1] += 180.0;

	ret_angle[1] %= 360;
	if(ret_angle[1] > 180)
        ret_angle[1] -= 360;
    if(ret_angle[1] < -180)
        ret_angle[1] += 360;
	return ret_angle;
}

function calculate_hitchance() //A quick approximation of our needed hitchance for legitbot.
{ //I have no particular interest to make a proper raytrace hitchance in a script. (someone go give epicgamer cone-capsule intersection hitchance l0le, even though that would probably be just as hard to implement through a script)
    var inaccuracy = Local.GetInaccuracy();
    if(inaccuracy == 0)
    {
        inaccuracy = 0.01;
    }
    return clamp(1 / inaccuracy, 0, 100);
}

function is_hitbox_body(hitbox)
{
    return (hitbox == 2 || hitbox == 3 || hitbox == 4 || hitbox == 5 || hitbox == 6);
}
/**
 * Selects target to aim at, scans its hitboxes and returns position to aim at + fov to the position. If it doesn't find a hitbox, returns [0, 0, 0]
 * @param {*} targeting_mode {number} we have 2 targeting modes - highest dmg hitbox and closest to crosshair, closest to xhair is 0 and highest dmg hitbox is 1
 * @param {*} hp_override_amt {number} basically onetaps healthbased override
 * @param {*} min_damage {number} the mindamage you'll need to deal to the target, healthbased override will override it
 * @param {*} max_fov {number} maximum fov we will scan hitboxes in (mostly relevant for closest to xhair, wont work so well with highest damage)
 * @param {*} force_bodyaim {boolean} pretty self explanatory there l0l
 */
function scan_targets(targeting_mode, hp_override_amt, min_damage, max_fov, force_bodyaim) //Kinda sad I can't really scan backtrack records using Onetap's API.
{
    var local_eyepos = Entity.GetEyePosition(local);
    var local_viewangles = Local.GetViewAngles();
    var hitboxes = [];

    var enemies = Entity.GetEnemies();
    var enemy_len = enemies.length;
    if(enemy_len == 0)
    {
        return {pos: [0, 0, 0], fov: -1};
    }
    var best_fov = 999;
    var target = -1;
    var temp_tgt_hitboxes = [];
    for(var i = 0; i < enemy_len; i++)
    {
        if(Entity.IsValid(enemies[i]) && Entity.IsAlive(enemies[i]) && !Entity.IsDormant(enemies[i]))
        {
            var hitbox_arr = [];
            for(var j = 0; j <= 18; j++)
            {
                var hitbox = Entity.GetHitboxPosition(enemies[i], j);
                if(typeof(hitbox) == "undefined")
                {
                    continue;
                }
                hitbox_arr.push({hb: hitbox, index: j});
            }
            var hitbox_arr_len = hitbox_arr.length;
            for(var k = 0; k <= hitbox_arr_len; k++)
            {
                var angle_to_hitbox = calculate_angle(local_eyepos, hitbox_arr[k].hb, local_viewangles); var fov = Math.hypot(angle_to_hitbox[0], angle_to_hitbox[1]);
                if(best_fov_target > fov)
                {
                    best_fov_target = fov;
                    target = enemies[i];
                    temp_tgt_hitboxes = hitbox_arr;
                }
            }
        }
    }
    if(target == -1 || best_fov_target > max_fov)
    {
        return {pos: [0, 0, 0], fov: -1};
    }
    hitboxes = temp_tgt_hitboxes;

    best_fov = 999; //reset fov

    var target_health = Entity.GetProp(target, "CBasePlayer", "m_iHealth"); //Used for hp override
    var best_hitbox_pos = [0, 0, 0];
    var legit_autowall_active = script_config.autowall_mode == 0;
    var hitboxes_visible = 0; //For legit autowall

    var hitbox_arr_length = hitboxes.length;
    var best_damage = -1;
    for(var i = hitbox_arr_length - 1; i >= 0; i--) //better for legit awall l0l
    {
        var hitbox = hitboxes[i];
        if(force_bodyaim && !is_hitbox_body(hitbox.index))
        {
            continue;
        }
        var trace = Trace.Bullet(local, target, local_eyepos, hitbox.hb);
        var damage = trace[1];
        var visible = trace[2];
        if(visible)
        {
            hitboxes_visible++;
        }
        var angle_to_hitbox = calculate_angle(local_eyepos, hitbox.hb, local_viewangles); var fov = Math.hypot(angle_to_hitbox[0], angle_to_hitbox[1]);
        if((targeting_mode == 0 ? (best_fov > fov && fov < max_fov) : (damage > best_damage && max_fov > fov)))
        {
            if((visible || script_config.autowall_active || (legit_autowall_active && hitboxes_visible > 0)) && (damage > min_damage || damage > target_health + hp_override_amt))
            {
                best_fov = fov;
                best_damage = damage;
                best_hitbox_pos = hitbox.hb;
                if(targeting_mode == 1 && best_damage > target_health + hp_override_amt * 2 || best_damage > 110 + hp_override_amt)
                {
                    break;
                }
            }
        }
    }
    return {pos: best_hitbox_pos, fov: best_fov}; //gamer moment
}
//Long and unoptimized as shit, I'll make it better... someday. Closest-to-crosshair mode shouldn't eat a lotta frames, though. 

/**
 * Normalizes input angle to -89 to 89 pitch, -180 to 180 yaw, 0 roll (because who cares about roll tbqh not like we're gonna be using it)
 * @param {*} ang 
 */
function normalize_angle(ang)
{
    ang[0] = clamp(ang[0], -89, 89);
    ang[1] %= 360;
    if(ang[1] > 180)
    {
        ang[1] -= 360;
    }
    if(ang[1] < -180)
    {
        ang[1] += 360;
    }
    ang[2] = 0;
}
//returns smoothed out original angle + aimangle (totally not pasted from some ruski legithack guise!)
function smooth_out_aim(original_angle, aimangle, factor)
{
    var new_aimangle = aimangle;
    var delta_len = Math.max(Math.hypot(aimangle[0], aimangle[1]), 0.01);
    new_aimangle = mathlib.VectorMulFl(new_aimangle, 1 / delta_len);
    var random_num = random_float(-0.1, 0.1);
    var smooth_amt = Math.min((Globals.TickInterval() * 64) / (random_num + factor * 0.15), delta_len);
    new_aimangle = mathlib.VectorMulFl(new_aimangle, smooth_amt);

    var return_angle = mathlib.VectorAdd(original_angle, new_aimangle);
    return normalize_angle(return_angle);
}

var old_punchangle = [];
function do_rcs(aimangle, rcs_pitch, rcs_yaw)
{
    var local_punch_angle = Entity.GetProp(local, "CBasePlayer", "m_aimPunchAngle");
    var recoil_scale = Convar.GetFloat("weapon_recoil_scale");
    var fixed_recoil = mathlib.VectorMulFl(local_punch_angle, recoil_scale);

    fixed_recoil[0] *= rcs_pitch;
    fixed_recoil[1] *= rcs_yaw;

    old_punchangle = fixed_recoil;

    var finished_rcs = mathlib.VectorAdd(aimangle, mathlib.VectorSub(old_punchangle, fixed_recoil));
    return normalize_angle(finished_rcs);
}

function basic_legitbot() //Yeah, fuck using Onetap's default legitbot, can't be arsed to do it myself l0l, I'll just make my own
{ //sharklaser gib ffi for smokecheck
    if(script_config.lbot_active && !script_config.rbot_active)
    {
        var flash_amt = Entity.GetProp(local, "CCSPlayer", "m_flFlashDuration");
        if(script_config.lbot_max_flash && flash_amt > 0.3)
        {
            return;
        }
        var target = scan_targets(script_config.lbot_target_selection, script_config.lbot_hp_override, script_config.lbot_mindmg, script_config.lbot_fov, script_config.lbot_baim);
        if(target.pos == [0, 0, 0])
        {
            return;
        }
        else
        {
            
        }
    }
}
//End of legitbot stuff

function on_move()
{
    local = Entity.GetLocalPlayer();
    if(script_config.script_active)
    {
        if(script_config.rbot_active && !script_config.autowall_active)
        {
            handle_autowall();
        }
        handle_legitaa();
        basic_legitbot();
    }
}

function on_draw()
{
    update_settings();
    handle_visibility();
    handle_indicators();
}

//Gay killsay territory
var normal_killsays = ["ez", "too fucking easy", "effortless", "easiest kill of my life", 
    "retard blasted", "cleans?", "а вы че клины???", "обоссал мемюзера лол", "ты че там отлетел то", 
    "pounce out of your window disgusting tranny, you shouldnt exist in this world", 
    "lmao ur so ugly irl like bro doesnt it hurt to live like that, btw you know you can just end it all"];
    
    var hs_killsays = ["ez", "effortless", "1", "nice antiaim, you sell?", "you pay for that?", 
    "refund right now", "consider suicide", "bro are u clean?", "ебать тебя унесло", "рефандни пожалуйста", 
    "на бутылку русак", "another retard blasted",
    "hhhhhhhhhhhhhhhhhh 1, you pay for that? refund so maybe youll afford some food for your family thirdworld monkey",
    "paster abandoned the match and received a 7 day competitive matchmaking cooldown",
    "freeqn.net/refund.php", "refund your rainbowhook right now pasteuser dog",
    "1 but all you need to fix your problems is a rope and a chair you ugly shit",
    "a вы (you) сэр собственно кто (who)?"];

    var awall_killsays = ["ez", "effortless", "sorry for awall bro", 
    "get autoballed monkey",
    "too ez", "legit wallbang", "my awall > your awall", "1 hhhh", "бля случайно аволл прожал", 
    "sorry i held down my awall key bro", "thats going in my media compilation right there get shamed retard rofl",
    "нищий отлетел от супериор аволла лол рефни"];

//I hope you haven't gotten cancer after reading those

function on_player_death()
{
    if(script_config.trashtalk)
    {
        var victim = Entity.GetEntityFromUserID(Event.GetInt("userid"));
		var attacker = Entity.GetEntityFromUserID(Event.GetInt("attacker"));
		var headshot = Event.GetInt("headshot") == 1;
        var autowalled = Event.GetInt("penetrated");
        
        if(attacker == local && attacker != victim)
        {
            var normal_say = normal_killsays[Math.floor(Math.random() * normal_killsays.length)];
			var hs_say = hs_killsays[Math.floor(Math.random() * hs_killsays.length)];
            var awall_say = awall_killsays[Math.floor(Math.random() * awall_killsays.length)];
            
            if(headshot && Math.floor(Math.random() * 3) <= 2) //gamer style randomizer
            {
                Cheat.ExecuteCommand("say " + hs_say);
                return;
            }
            if(autowalled && Math.floor(Math.random() * 3) <= 2)
            {
                Cheat.ExecuteCommand("say " + awall_say);
                return;
            }
            Cheat.ExecuteCommand("say " + normal_say);
        }
    }
}

function run_adaptive_fov_calc(weapon_type) //pasted from niggahook uff yaa$$$$$$$$
{
    var fov_max = script_config.rbot_fov_max;
    var fov_min = script_config.rbot_fov_min;

    var fov_mod = script_config.rbot_fov_mod;
    var enemies = Entity.GetEnemies();

    
}

Cheat.RegisterCallback("player_death", "on_player_death");
Cheat.RegisterCallback("CreateMove", "on_move");
Cheat.RegisterCallback("Draw", "on_draw");