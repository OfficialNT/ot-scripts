//Some credits: April for the freestanding, depresso/whatever he goes by for mathlib.
//I probably stole shit from somewhere else as well, but I don't remember from where anymore rofl

var js_items = ["Misc", "JAVASCRIPT", "Script Items"];
var rbot_weapon_types = ["GENERAL", "PISTOL", "HEAVY PISTOL", "SCOUT", "AWP", "AUTOSNIPER"];
var reworked_lbot_guns = ["Pistol", "Heavy pistol", "Heavy", "Rifle", "SMG", "Scout", "AWP", "Autosnipers"];

var mathlib = require("mathlib.js") //damn.......
function setup_menu()
{
    UI.AddCheckbox("Enable semirage assist");
    UI.AddHotkey("Enable ragebot");
    UI.AddHotkey("Autowall");
    UI.AddDropdown("Currently configured weapon", reworked_lbot_guns);
    for(var i = 0; i < 8; i++)
    {
        var current_gun = reworked_lbot_guns[i];
        UI.AddSliderInt(current_gun + " dynamic FOV base", 2500, 6000);
        UI.AddSliderFloat(current_gun + " dynamic FOV min", 0.1, 180.0);
        UI.AddSliderFloat(current_gun + " dynamic FOV max", 0.1, 180.0);
        UI.AddSliderFloat(current_gun + " dynamic FOV modifier", 0.34, 1);
        if(i == 2 || i == 3 || i == 4)
        {
            UI.AddSliderInt(current_gun + " minimum damage", 0, 130);
            UI.AddSliderInt(current_gun + " hitchance", 0, 100);
            UI.AddCheckbox(current_gun + " prefer bodyaim");
            UI.AddCheckbox(current_gun + " prefer safepoint");
        }
        UI.AddDropdown(current_gun + " w/o autowall key", ["Autowall on triggers", "No autowall"]);
        UI.AddMultiDropdown(current_gun + " autowall triggers", ["Hitbox visible", "Hurt us", "In autowall FOV", "Possible lethal damage", "We are low HP", "Ragebot shot him before"]);
        UI.AddSliderInt(current_gun + " hitbox amount", 1, 10);
        UI.AddSliderFloat(current_gun + " time after hurt (s)", 0.01, 10);
        UI.AddSliderFloat(current_gun + " autowall FOV", 0.5, 10.0);
        UI.AddSliderInt(current_gun + " health +", 0, 60);
        UI.AddSliderFloat(current_gun + " shot expire time (s)", 1, 120);
    }
    UI.AddCheckbox("Trigger fakelag on visible");
    UI.AddSliderInt("Minimum damage", 1, 50);
    UI.AddSliderInt("Choke on visible", 0, 8);
    UI.AddSliderInt("Normal choke", 0, 8);
    UI.AddCheckbox("Enable legit AA");
    UI.AddCheckbox("Safety checks");
    UI.AddDropdown("LBY Mode", ["Safe", "Extend"]);
    UI.AddHotkey("Legit AA juke (only in rage)");
    UI.AddCheckbox("Legit AA edge detection");
    UI.AddDropdown("Peeking mode", ["Peek with fake", "Peek with real"]);
    UI.AddCheckbox("Fix slowwalk on legitbot");
    UI.AddMultiDropdown("Semirage assist indicators", ["Aimbot status", "Autowall", "Legit AA", "Choke", "Inaccuracy", "Aim mode", "Enemy possible real yaw side", "Fake arrows", "Watermark"]);
    
    UI.AddSliderFloat("Indicator offset", 0.2, 1);
    UI.AddColorPicker("AA arrow color");
    UI.AddColorPicker("Side text color");

    UI.AddColorPicker("Watermark accent color");

    UI.AddCheckbox("Rage shot logs");

    UI.AddCheckbox("Trashtalk");
}

setup_menu();

var local = 0;

var script_config = {
rbot_active: 0,
rbot_lbot_switch_active: 0,
lbot_active: 0,
script_active: 0,
rbot_fov_min: -1,
rbot_fov_max: -1,
rbot_fov_mod: -1,
rbot_fov_base_distance: -1,
rbot_fov_awall: -1,
rbot_optional_mindmg: -1,
rbot_optional_hc: -1,
rbot_optional_baim: 0,
rbot_optional_safepoint: 0,
autowall_active: 0,
autowall_mode: -1,
legit_autowall_modifiers: -1,
legit_autowall_hitbox_amt: -1,
legit_autowall_hurt_time: -1,
legit_autowall_lethal_override: -1,
legit_autowall_ragebot_decay_time: -1,
legitaa_active: 0,
legitaa_safety_active: 0,
legitaa_lby_mode: -1,
legitaa_juke_active: 0,
legitaa_edge_active: 0,
legitaa_edge_distance: -1,
legitaa_peek_behavior: -1,
slowwalk_fix: 0,
gay_fakelag_active: 0,
gay_fakelag_mindmg: -1,
gay_fakelag_vis_choke: -1,
gay_fakelag_invis_choke: -1,
indicator_picks: -1,
indicator_offset: -1,
indicator_legitaa_col: [0, 0, 0, 255],
indicator_enemy_side_col: [0, 0, 0, 255],
indicator_watermark_accent_col: [0, 0, 0, 255],
rage_shot_log: 0,
trashtalk: 0,
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
    script_config.lbot_active = UI.IsHotkeyActive("Legit", "GENERAL", "General", "Enabled");
    script_config.script_active = UI.GetValue(js_items, "Enable semirage assist");
    script_config.rbot_lbot_switch_active = UI.IsHotkeyActive(js_items, "Enable ragebot");
    if(prev_wpntype_settings == -1)
    {
        script_config.rbot_lbot_switch_active = true; //for legitaa with knife (p100 ghettofix)
    }
    script_config.autowall_active = UI.IsHotkeyActive(js_items, "Autowall");
    
    script_config.legitaa_active = UI.GetValue(js_items, "Enable legit AA");
    script_config.legitaa_safety_active = UI.GetValue(js_items, "Safety checks");
    script_config.legitaa_lby_mode = UI.GetValue(js_items, "LBY Mode");
    script_config.legitaa_juke_active = UI.IsHotkeyActive(js_items, "Legit AA juke");
    script_config.legitaa_edge_active = UI.GetValue(js_items, "Legit AA edge detection");
    script_config.legitaa_peek_behavior = UI.GetValue(js_items, "Peeking mode");
    script_config.slowwalk_fix = UI.GetValue(js_items, "Fix slowwalk on legitbot");
    script_config.gay_fakelag_active = UI.GetValue(js_items, "Trigger fakelag on visible");
    script_config.gay_fakelag_mindmg = UI.GetValue(js_items, "Minimum damage");
    script_config.gay_fakelag_vis_choke = UI.GetValue(js_items, "Choke on visible");
    script_config.gay_fakelag_invis_choke = UI.GetValue(js_items, "Normal choke");
    script_config.indicator_picks = UI.GetValue(js_items, "Semirage assist indicators");
    script_config.indicator_offset = UI.GetValue(js_items, "Indicator offset");
    script_config.indicator_legitaa_col = UI.GetColor(js_items, "AA arrow color");
    script_config.indicator_enemy_side_col = UI.GetColor(js_items, "Side text color");
    script_config.indicator_watermark_accent_col = UI.GetColor(js_items, "Watermark accent color");
    script_config.rage_shot_log = UI.GetValue(js_items, "Rage shot logs");
    script_config.trashtalk = UI.GetValue(js_items, "Trashtalk");
    if(World.GetServerString() == "" || !Entity.IsValid(local) || !Entity.IsAlive(local)) 
    {
        return; //Can't really go further without using localplayer's weapon.
    }

    var local_weapon_type = get_weapon_for_config();
    if(local_weapon_type == -1)
    {
        return;
    }
    
    var weapon_name = reworked_lbot_guns[local_weapon_type];

    script_config.autowall_mode = UI.GetValue(js_items, weapon_name + " w/o autowall key");
    script_config.legit_autowall_modifiers = UI.GetValue(js_items, weapon_name + " autowall triggers");
    script_config.legit_autowall_hitbox_amt = UI.GetValue(js_items, weapon_name + " hitbox amount");
    script_config.legit_autowall_hurt_time = UI.GetValue(js_items, weapon_name + " time after hurt (s)");
    script_config.legit_autowall_lethal_override = UI.GetValue(js_items, weapon_name + " health +");
    script_config.legit_autowall_ragebot_decay_time = UI.GetValue(js_items, weapon_name + " shot expire time (s)");
    script_config.rbot_fov_awall = UI.GetValue(js_items, weapon_name + " autowall FOV");
    script_config.rbot_fov_min = UI.GetValue(js_items, weapon_name + " dynamic FOV min");
    script_config.rbot_fov_max = UI.GetValue(js_items, weapon_name + " dynamic FOV max");
    script_config.rbot_fov_mod = UI.GetValue(js_items, weapon_name + " dynamic FOV modifier");
    script_config.rbot_fov_base_distance = UI.GetValue(js_items, weapon_name + " dynamic FOV base");
    if(convert_weapon_index_into_rbot_idx(local_weapon_type) == 0)
    {
        script_config.rbot_optional_mindmg = UI.GetValue(js_items, weapon_name + " minimum damage");
        script_config.rbot_optional_hc = UI.GetValue(js_items, weapon_name + " hitchance");
        script_config.rbot_optional_baim = UI.GetValue(js_items, weapon_name + " prefer bodyaim");
        script_config.rbot_optional_safepoint = UI.GetValue(js_items, weapon_name + " prefer safepoint");
    }
    prev_wpntype_settings = local_weapon_type;
}

var last_script_enabled_state = -1; //Force the script to update the visibility on load
var last_configured_weapon = -1; //Cached to prevent useless visibility updates.
var last_autowall_mode = -1;
var last_legitaa_mode = -1;
var last_fakelag_state = -1;
var was_legitaa_edge_active = -1;
var last_awall_state_for_weapons = [-1, -1, -1, -1, -1, -1, -1, -1]; //im a gamer
var last_awall_triggers_for_weapons = [-1, -1, -1, -1, -1, -1, -1, -1];
var old_indicator_picks = -1;
function handle_visibility()
{
    if(!UI.IsMenuOpen())
    {
        return; //What's the point of handling menu visibility if the damn thing isn't even visible?
    }
    var indicator_picks = UI.GetValue(js_items, "Semirage assist indicators");
    if(script_config.script_active != last_script_enabled_state || last_legitaa_mode != script_config.legitaa_active || was_legitaa_edge_active != script_config.legitaa_edge_active || indicator_picks != old_indicator_picks || last_fakelag_state != script_config.gay_fakelag_active)
    {
        UI.SetEnabled(js_items, "Autowall", script_config.script_active);
        UI.SetEnabled(js_items, "Enable ragebot", script_config.script_active);
        UI.SetEnabled(js_items, "Currently configured weapon", script_config.script_active);

        UI.SetEnabled(js_items, "Enable legit AA", script_config.script_active);
        UI.SetEnabled(js_items, "Safety checks", script_config.script_active && script_config.legitaa_active);
        UI.SetEnabled(js_items, "LBY Mode", script_config.script_active && script_config.legitaa_active);
        UI.SetEnabled(js_items, "Legit AA juke (only in rage)", script_config.script_active && script_config.legitaa_active);
        
        UI.SetEnabled(js_items, "Legit AA edge detection", script_config.script_active && script_config.legitaa_active);
        UI.SetEnabled(js_items, "Peeking mode", script_config.script_active && script_config.legitaa_active && script_config.legitaa_edge_active);
        UI.SetEnabled(js_items, "Fix slowwalk on legitbot", script_config.script_active);
        UI.SetEnabled(js_items, "Semirage assist indicators", script_config.script_active);
        
        UI.SetEnabled(js_items, "Indicator offset", script_config.script_active);
        UI.SetEnabled(js_items, "Side text color", script_config.script_active && indicator_picks & (1 << 6));
        UI.SetEnabled(js_items, "AA arrow color", script_config.script_active && indicator_picks & (1 << 7));
        UI.SetEnabled(js_items, "Watermark accent color", script_config.script_active && indicator_picks & (1 << 8));
        UI.SetEnabled(js_items, "Rage shot logs", script_config.script_active);
        UI.SetEnabled(js_items, "Trashtalk", script_config.script_active);

        UI.SetEnabled(js_items, "Trigger fakelag on visible", script_config.script_active);
        UI.SetEnabled(js_items, "Minimum damage", script_config.script_active && script_config.gay_fakelag_active);
        UI.SetEnabled(js_items, "Choke on visible", script_config.script_active && script_config.gay_fakelag_active);
        UI.SetEnabled(js_items, "Normal choke", script_config.script_active && script_config.gay_fakelag_active);
    }
    old_indicator_picks = indicator_picks;
    last_fakelag_state = script_config.gay_fakelag_active;
    var cur_selected_gun = UI.GetValue(js_items, "Currently configured weapon"); //Shame I have to do it like this.
    var lbot_weapons_length = 8; //Hardcoded because it won't change lol
    
    for(var i = 0; i < lbot_weapons_length; i++)
    {
        var weapon_name = reworked_lbot_guns[i];
        if(last_configured_weapon != cur_selected_gun || script_config.script_active != last_script_enabled_state)
        {
            UI.SetEnabled(js_items, weapon_name + " dynamic FOV base", script_config.script_active && cur_selected_gun == i);
            UI.SetEnabled(js_items, weapon_name + " dynamic FOV min", script_config.script_active && cur_selected_gun == i);
            UI.SetEnabled(js_items, weapon_name + " dynamic FOV max", script_config.script_active && cur_selected_gun == i);
            UI.SetEnabled(js_items, weapon_name + " dynamic FOV modifier", script_config.script_active && cur_selected_gun == i);
            UI.SetEnabled(js_items, weapon_name + " hitchance", script_config.script_active && cur_selected_gun == i && (i == 2 || i == 3 || i == 4));
            UI.SetEnabled(js_items, weapon_name + " minimum damage", script_config.script_active && cur_selected_gun == i && (i == 2 || i == 3 || i == 4));
            UI.SetEnabled(js_items, weapon_name + " prefer bodyaim", script_config.script_active && cur_selected_gun == i && (i == 2 || i == 3 || i == 4));
            UI.SetEnabled(js_items, weapon_name + " prefer safepoint", script_config.script_active && cur_selected_gun == i && (i == 2 || i == 3 || i == 4));
        }
        var awall_mode = UI.GetValue(weapon_name + " w/o autowall key");
        if(last_configured_weapon != cur_selected_gun || script_config.script_active != last_script_enabled_state || awall_mode != last_awall_state_for_weapons[i])
        {
            UI.SetEnabled(js_items, weapon_name + " w/o autowall key", script_config.script_active && cur_selected_gun == i);
            UI.SetEnabled(js_items, weapon_name + " autowall triggers", script_config.script_active && cur_selected_gun == i && awall_mode == 0);
        }
        var awall_triggers = UI.GetValue(weapon_name + " autowall triggers");
        if(last_configured_weapon != cur_selected_gun || script_config.script_active != last_script_enabled_state || awall_mode != last_awall_state_for_weapons[i] || awall_triggers != last_awall_triggers_for_weapons[i])
        {
            UI.SetEnabled(js_items, weapon_name + " hitbox amount", script_config.script_active && cur_selected_gun == i && awall_mode == 0 && awall_triggers & (1 << 0));
            UI.SetEnabled(js_items, weapon_name + " time after hurt (s)", script_config.script_active && cur_selected_gun == i && awall_mode == 0 && awall_triggers & (1 << 1));
            UI.SetEnabled(js_items, weapon_name + " autowall FOV", script_config.script_active && cur_selected_gun == i && awall_mode == 0 && awall_triggers & (1 << 2));
            UI.SetEnabled(js_items, weapon_name + " health +", script_config.script_active && cur_selected_gun == i && awall_mode == 0 && awall_triggers & (1 << 3));
            UI.SetEnabled(js_items, weapon_name + " shot expire time (s)", script_config.script_active && cur_selected_gun == i && awall_mode == 0 && awall_triggers & (1 << 5));
        }
        last_awall_state_for_weapons[i] = awall_mode;
        last_awall_triggers_for_weapons[i] = awall_triggers;
    }
    last_script_enabled_state = script_config.script_active;
    last_configured_weapon = cur_selected_gun;
    was_legitaa_edge_active = script_config.legitaa_edge_active;
}
handle_visibility();

function clamp(val, min, max)
{
	return Math.max(min,Math.min(max,val));
}

function random_float(min, max)
{
    return Math.random() * (max - min) + min;
}

function angle_diff(angle1, angle2)
{
    var diff = angle1 - angle2;
    diff %= 360;
    if(diff > 180)
    {
        diff -= 360;
    }
    if(diff < -180)
    {
        diff += 360;
    }
    return diff;
}

function get_choked_ticks_for_entity(entity)
{
    return clamp(Math.floor((Globals.Curtime() - Entity.GetProp(entity, "CBaseEntity", "m_flSimulationTime")) / Globals.TickInterval()), 0, 16);
}

function get_hitbox_name(hitbox) //Useless, but I love the bloody shot logs
{
    var hitbox_name = "";
    switch (hitbox)
    {
        case 0:
            hitbox_name = "head";
            break;
        case 1:
            hitbox_name = "neck";
            break;
        case 2:
            hitbox_name = "pelvis";
            break;
        case 3:
            hitbox_name = "body";
            break;
        case 4:
            hitbox_name = "thorax";
            break;
        case 5:
            hitbox_name = "chest";
            break;
        case 6:
            hitbox_name = "upper chest";
            break;
        case 7:
            hitbox_name = "left thigh";
            break;
        case 8:
            hitbox_name = "right thigh";
            break;
        case 9:
            hitbox_name = "left calf";
            break;
        case 10:
            hitbox_name = "right calf";
            break;
        case 11:
            hitbox_name = "left foot";
            break;
        case 12:
            hitbox_name = "right foot";
            break;
        case 13:
            hitbox_name = "left hand";
            break;
        case 14:
            hitbox_name = "right hand";
            break;
        case 15:
            hitbox_name = "left upper arm";
            break;
        case 16:
            hitbox_name = "left forearm";
            break;
        case 17:
            hitbox_name = "right upper arm";
            break;
        case 18:
            hitbox_name = "right forearm";
            break;
        default:
            hitbox_name = "generic";
    }

    return hitbox_name;
}



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
    var delta = mathlib.VectorSub(from, to);
	var ret_angle = [];
	ret_angle[0] = mathlib.RadToDeg(Math.atan(delta[2] / Math.hypot(delta[0], delta[1]))) - base_angle[0];
	ret_angle[1] = mathlib.RadToDeg(Math.atan(delta[1] / delta[0])) - base_angle[1];
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

//Sets up the config for generic weapons and sets up the dynamic ragebot FOV.
function setup_config_and_dyn_fov() 
{   
    var fov_max = script_config.rbot_fov_max;
    var fov_min = script_config.rbot_fov_min;

    var fov_mod = script_config.rbot_fov_mod;
    var fov_base = script_config.rbot_fov_base_distance;

    var new_dynamic_fov = 0;

    var weapon_type = get_weapon_for_config();
    if(weapon_type == -1)
    {
        return; //No point configuring it if we're holding a knife or something, right?
    }
    var rbot_weapon_type = convert_weapon_index_into_rbot_idx(weapon_type);
    var rbot_config_string = rbot_weapon_types[rbot_weapon_type];
    if(rbot_weapon_type == 0)
    {
        UI.SetValue("Rage", rbot_config_string, "Accuracy", "Prefer safe point", script_config.rbot_optional_safepoint); //Can't force the hack to PREFER bodyaim or safepoint through the new API functions.
        UI.SetValue("Rage", rbot_config_string, "Accuracy", "Prefer body aim", script_config.rbot_optional_baim);
    }

    var old_fov = UI.GetValue("Rage", rbot_config_string, "Targeting", "FOV");
    var local_render_origin = Entity.GetRenderOrigin(local);

    var enemies = Entity.GetEnemies();
    var enemy_arr_length = enemies.length;

    var distance = 10000;
    for(var i = 0; i < enemy_arr_length; i++)
    {
        if(Entity.IsValid(enemies[i]) && Entity.IsAlive(enemies[i]) && !Entity.IsDormant(enemies[i]))
        {
            if(rbot_weapon_type == 0)
            {
                Ragebot.ForceTargetMinimumDamage(enemies[i], script_config.rbot_optional_mindmg);
                Ragebot.ForceTargetHitchance(enemies[i], script_config.rbot_optional_hc);
            }
            var enemy_render_origin = Entity.GetRenderOrigin(enemies[i]);
            var current_distance = mathlib.VectorLength(mathlib.VectorSub(local_render_origin, enemy_render_origin));
            if(distance > current_distance)
            {
                distance = current_distance;
            }
        }
    }
    if(distance != 10000)
    {
        new_dynamic_fov = clamp((fov_base / distance) * (fov_mod * 3), fov_min, fov_max);
    }
    else //We haven't found any enemies.
    {
        new_dynamic_fov = old_fov;
    }
    UI.SetValue("Rage", rbot_config_string, "Targeting", "FOV", new_dynamic_fov);
}

var players_who_hurt_us = [];
var ragebot_targets_this_round = [];

function handle_autowall()
{
    var is_legit_autowall_active = script_config.autowall_mode == 0;
    var visible_hitbox_check = is_legit_autowall_active && script_config.legit_autowall_modifiers & (1 << 0);
    var visible_hitbox_amt = script_config.legit_autowall_hitbox_amt;
    var hurt_check = is_legit_autowall_active && script_config.legit_autowall_modifiers & (1 << 1);
    var hurt_length = script_config.legit_autowall_hurt_time;
    var fov_check = is_legit_autowall_active && script_config.legit_autowall_modifiers & (1 << 2);
    var autowall_fov = script_config.rbot_fov_awall;
    var lethal_check = is_legit_autowall_active && script_config.legit_autowall_modifiers & (1 << 3);
    var lethal_override_hp_amt = script_config.legit_autowall_lethal_override;
    var local_lowhp_check = is_legit_autowall_active && script_config.legit_autowall_modifiers & (1 << 4);
    var rbot_target_check = is_legit_autowall_active && script_config.legit_autowall_modifiers & (1 << 5);
    var rbot_target_decay_time = script_config.legit_autowall_ragebot_decay_time;

    if(local_lowhp_check)
    {
        var local_health = Entity.GetProp(local, "CBasePlayer", "m_iHealth");
        if(local_health < 25) //fuck them if we're low hp, i should prolly make this user-adjustable
        {
            return;
        }
    }
    var local_eyepos = Entity.GetEyePosition(local);
    var local_viewangles = Local.GetViewAngles();
    var enemies = Entity.GetEnemies();
    var enemy_arr_length = enemies.length; //Apparently doing this is slightly faster than getting the array length every iteration

    for(var i = 0; i < enemy_arr_length; i++)
    {
        if(Entity.IsValid(enemies[i]) && Entity.IsAlive(enemies[i]) && !Entity.IsDormant(enemies[i]))
        {
            if(hurt_check)
            {
                if(players_who_hurt_us.some(function(value) { return value.cisgendered_pig == enemies[i] && value.time_he_hurt_us + hurt_length > Globals.Curtime(); }))
                {
                    continue;
                }
            }
            if(rbot_target_check)
            {
                if(ragebot_targets_this_round.some(function(value) { return value.aimbot_target == enemies[i] && value.shot_time + rbot_target_decay_time > Globals.Curtime(); }))
                {
                    continue;
                }
            }
            var is_inside_autowall_fov = false;
            var vis_length = 0;
            var could_be_lethal = false;
            for(var j = 0; j <= 18; j++)
            {
                var hitbox = Entity.GetHitboxPosition(enemies[i], j);
                if(typeof(hitbox) == "undefined") //sometimes happens l0l
                {
                    continue;
                }
                if(fov_check)
                {
                    var angle_to_hitbox = calculate_angle(local_eyepos, hitbox, local_viewangles);
                    var fov = Math.hypot(angle_to_hitbox[0], angle_to_hitbox[1]);
                    if(autowall_fov > fov)
                    {
                        is_inside_autowall_fov = true;
                        break;
                    }
                }
                var trace = Trace.Bullet(local, enemies[i], local_eyepos, hitbox);
                if(trace[2])
                {
                   vis_length++;
                }
                if(lethal_check)
                {
                    var enemy_hp = Entity.GetProp(enemies[i], "CBasePlayer", "m_iHealth");
                    if(trace[1] > enemy_hp + lethal_override_hp_amt)
                    {
                        could_be_lethal = true;
                        break;
                    }
                }
                if(visible_hitbox_check && vis_length >= visible_hitbox_amt)
                {
                    break;
                }
            }
            if(could_be_lethal || is_inside_autowall_fov || (visible_hitbox_check && vis_length >= visible_hitbox_amt))
            {
                continue;
            }
            if(vis_length < 11)
            {
                Ragebot.IgnoreTarget(enemies[i]);
            }
        }
    }
}


function are_we_peeking(local_eye_position, velocity, predicted_ticks, min_damage) //premium, also stolen from my doubletap peek thing
{
    var extrapolated_local_eyepos = mathlib.VectorAdd(local_eye_position, mathlib.VectorMulFl(velocity, predicted_ticks * Globals.TickInterval()));
    var enemies = Entity.GetEnemies();
    var enemy_arr_length = enemies.length;
    for(var i = 0; i < enemy_arr_length; i++)
    {
        if(Entity.IsValid(enemies[i]) && Entity.IsAlive(enemies[i]) && !Entity.IsDormant(enemies[i]))
        {
            var enemy_stomach = Entity.GetHitboxPosition(enemies[i], 2);
            if(typeof(enemy_stomach) == "undefined")
            {
                continue;
            }
            var trace = Trace.Bullet(local, enemies[i], extrapolated_local_eyepos, enemy_stomach);
            if(trace[1] > min_damage) //AMAZING PEEK DETECTION, PATENT PENDING
            {
                return true;
            }
        }
    }
    return false;
}

var peek_time = 0.0;
var current_proper_direction = 0;
var last_peek = 0.0;
var indicator_dir = 0;


//That's a lotta global vars. 

function handle_legitaa_safety()
{
    if(Entity.IsValid(local) && Entity.IsAlive(local))
    {
        if(!script_config.legitaa_safety_active)
        {
            return true; //epic gamer move
        }
        var current_framerate = 1 / Globals.Frametime();
        var current_choke = get_choked_ticks_for_entity(local);
        return current_framerate >= 100 && current_choke < 3; //Quick bandaid check.
    }
    return true;
}
function handle_legitaa()
{
    var are_we_safe = handle_legitaa_safety();
    if(script_config.legitaa_active && are_we_safe)
    {
        var used_implementation = script_config.rbot_lbot_switch_active ? 1 : 0;
        var is_autodirection_used = script_config.legitaa_edge_active == 1;
        var is_peek_invert_active = script_config.legitaa_peek_behavior == 1;
        var lby_mode = script_config.legitaa_lby_mode;

        var local_velocity = Entity.GetProp(local, "CBasePlayer", "m_vecVelocity[0]");
        var local_velocity_length = mathlib.VectorLength(local_velocity);
        var current_inversion = indicator_dir;
        if(is_autodirection_used)
        {
            current_inversion = current_proper_direction;
        }
        if(is_autodirection_used && is_peek_invert_active && last_peek + 0.4 < Globals.Curtime())
        {
            var localplayer_eyepos = Entity.GetEyePosition(local);
            var in_peek = are_we_peeking(localplayer_eyepos, local_velocity, 7, 1);
            if(in_peek)
            {
                peek_time += Globals.TickInterval();
            }
            if(peek_time > 2.0)
            {
                peek_time = 0;
                in_peek = false;
                last_peek = Globals.Curtime();    
            }
            if(local_velocity_length > 33 && in_peek)
            {
                current_inversion *= -1; //To fuck up antifreestanding resolvers (and most legit AA resolvers should be doing anti-freestanding at some point in time, otherwise they're horribly lucky.)
            }
        }
        if(used_implementation == 1)
        {
            UI.SetValue("Misc", "PERFORMANCE & INFORMATION", "Information", "Restrictions", 0);
            UI.SetValue("Anti-Aim", "Rage Anti-Aim", "Enabled", 1);
            UI.SetValue("Anti-Aim", "Rage Anti-Aim", "Yaw offset", 180);
            UI.SetValue("Anti-Aim", "Extra", "Pitch", 0);
            UI.SetValue("Anti-Aim", "Fake angles", "Enabled", 1);

            if(!is_autodirection_used)
            {
                current_inversion = UI.IsHotkeyActive("Anti-Aim", "Fake angles", "Inverter") == 1 ? -1 : 1;
            }
            
            AntiAim.SetOverride(1);
            var should_use_juke = lby_mode == 1 && script_config.legitaa_juke_active; //If we're using "safe" LBY, we can't exactly trick dumb resolvers into trying to resolve us as if we were using opposite.
            var real_yaw_offset = 60 * current_inversion * (should_use_juke ? -1 : 1);
            var lower_body_yaw_offset = lby_mode == 1 ? (100 * -current_inversion) : 0;

            AntiAim.SetRealOffset(real_yaw_offset);
            AntiAim.SetLBYOffset(lower_body_yaw_offset);
            indicator_dir = current_inversion;
        }
        else
        {
            UI.SetValue("Anti-Aim", "Fake angles", "Enabled", 0);
            UI.SetValue("Anti-Aim", "Legit Anti-Aim", "Enabled", 1);
            UI.SetValue("Anti-Aim", "Legit Anti-Aim", "Extend angle", lby_mode == 1);
            
            var current_side = UI.IsHotkeyActive("Anti-Aim", "Legit Anti-Aim", "Direction key") == 1 ? 1 : -1;
            if(!is_autodirection_used)
            {
                indicator_dir = current_side;
                return;
            }
            
            if(current_inversion != current_side)
            {
                UI.ToggleHotkey("Anti-Aim", "Legit Anti-Aim", "Direction key");
            }
            indicator_dir = current_inversion;
        }
    }
    else
    {
        AntiAim.SetOverride(0); //Bad code, but seems to flick less due to reasons I have no clue about.
        UI.SetValue("Anti-Aim", "Legit Anti-Aim", "Enabled", 0);
        UI.SetValue("Anti-Aim", "Rage Anti-Aim", "Enabled", 0);
    }
}

var were_we_peeking = false;
function handle_fakelag()
{
    if(script_config.gay_fakelag_active)
    {
        var local_eyepos = Entity.GetEyePosition(local);
        var local_velocity = Entity.GetProp(local, "CBasePlayer", "m_vecVelocity[0]");
        var peek = are_we_peeking(local_eyepos, local_velocity, 5, script_config.gay_fakelag_mindmg);
        if(peek != were_we_peeking)
        {
            were_we_peeking = peek;
            UI.SetValue("Anti-Aim", "Fake-Lag", "Limit", peek ? script_config.gay_fakelag_vis_choke : script_config.gay_fakelag_invis_choke);
        }
    }
}

//Shamelessly pasted from April's script due to me being too lazy to figure out the easy math myself. Returns 1 on left and -1 on right. Won't work very well against spinners, though.
//This is also better than the idea I had, so its good lol
function handle_edge_detection(entity, step) //I recommend the step being divisible by 15.
{
    if(Entity.IsValid(entity) && Entity.IsAlive(entity) && !Entity.IsDormant(entity))
    {
        var ent_headpos = Entity.GetHitboxPosition(entity, 0);
        var ent_eyeangles = [0, 0, 0];
        if(entity == local)
        {
            ent_eyeangles = Local.GetViewAngles();
        }
        else
        {
            ent_eyeangles = Entity.GetProp(entity, "CCSPlayer", "m_angEyeAngles");
        }
        var left_fractions = 0;
        var right_fractions = 0;
        
        var base_yaw = ent_eyeangles[1] - 90;
        var end_yaw = ent_eyeangles[1] + 90;

        for(var current_step = base_yaw; current_step <= end_yaw; current_step += step)
        {
            if(current_step == ent_eyeangles[1])
            {
                continue; //Not exactly a side, I guess.
            }
            var point_next_to_ent = mathlib.VectorAdd(ent_headpos, [Math.cos(mathlib.DegToRad(current_step)) * 450, Math.sin(mathlib.DegToRad(current_step)) * 450, 0]);
            var ray = Trace.Line(entity, ent_headpos, point_next_to_ent);
            current_step < ent_eyeangles[1] ? left_fractions += ray[1] : right_fractions += ray[1];
        }

        left_fractions /= (90 / step);
        right_fractions /= (90 / step);

        return left_fractions > right_fractions ? 1 : -1;
    }
    return 0;
}


function handle_indicators()
{
    if(script_config.script_active && script_config.indicator_picks)
    {
        var screensize = Render.GetScreenSize();
        var font = Render.AddFont("Tahoma", 12, 700);
        var watermark_font = Render.AddFont("Verdana", 8, 250);
        if(Entity.IsValid(local) && Entity.IsAlive(local))
        {
            var base_yaw = screensize[1] * script_config.indicator_offset; //not actually yaw l0l
            if(script_config.indicator_picks & (1 << 0))
            {
                var string_size = Render.TextSizeCustom("Aimbot: ", font);
                
                var is_aimbot_active = script_config.rbot_lbot_switch_active ? script_config.rbot_active : script_config.lbot_active;
                var text = is_aimbot_active ? "ON" : "OFF";
                var weapon_type = get_weapon_for_config();
                if(weapon_type != -1)
                {
                    var converted_ragebot_type = convert_weapon_index_into_rbot_idx(weapon_type);
                    var weapon_cur_fov = UI.GetValue("Rage", rbot_weapon_types[converted_ragebot_type], "Targeting", "FOV");
                    var string = ", FOV: " + weapon_cur_fov;
                    text += (script_config.rbot_lbot_switch_active ? string : "");
                }
                Render.StringCustom(15, base_yaw, 0, "Aimbot: ", [255, 255, 255, 255], font);
                Render.StringCustom(15 + string_size[0], base_yaw, 0, text, is_aimbot_active ? [0, 255, 0, 255] : [255, 0, 0, 255], font);
                base_yaw += 20;
            }
            if(script_config.indicator_picks & (1 << 1))
            {
                var string_size = Render.TextSizeCustom("Autowall: ", font);
                Render.StringCustom(15, base_yaw, 0, "Autowall: " , [255, 255, 255, 255], font);
                Render.StringCustom(15 + string_size[0], base_yaw, 0, (script_config.autowall_active ? "ON" : (script_config.autowall_mode == 0 ? "LEGIT" : "OFF")), (script_config.autowall_active ? [0, 255, 0, 255] : (script_config.autowall_mode == 0 ? [232, 216, 35, 255] : [255, 0, 0, 255])), font);
                base_yaw += 20;
            }
            if(script_config.indicator_picks & (1 << 2))
            {
                var string_size = Render.TextSizeCustom("Fake: ", font);
                Render.StringCustom(15, base_yaw, 0, "Fake: ", [255, 255, 255, 255], font);
                var fake_yaw = Local.GetFakeYaw();
                var real_yaw = Local.GetRealYaw();

                var difference = angle_diff(fake_yaw, real_yaw);
                var text = script_config.legitaa_active ? ("ON, fake delta: " + Math.round(difference) + (script_config.legitaa_juke_active ? " (in juke)" : "")) : "OFF"; 
                Render.StringCustom(15 + string_size[0], base_yaw, 0, text, (script_config.legitaa_active ? (script_config.legitaa_juke_active ? [150, 35, 232, 255] : [0, 255, 0, 255]) : [255, 0, 0, 255]), font);
                base_yaw += 20;
            }
            if(script_config.indicator_picks & (1 << 3))
            {
                var string_size = Render.TextSizeCustom("Choke: ", font);
                var choked_fl_ticks = get_choked_ticks_for_entity(local);
                var cool_representation = "";
                for(var i = 0; i < choked_fl_ticks; i++)
                {
                    cool_representation += "/";
                }
                Render.StringCustom(15, base_yaw, 0, "Choke: " + cool_representation, [255, 255, 255, 255], font);
                Render.StringCustom(15 + string_size[0], base_yaw, 0, cool_representation, [0, 255, 0, 255], font);
                base_yaw += 20;
            }
            if(script_config.indicator_picks & (1 << 4))
            {
                var string_size = Render.TextSizeCustom("Inaccuracy: ", font);
                var inaccuracy = Local.GetInaccuracy();
                if(inaccuracy == 0)
                {
                    inaccuracy = 0.001;
                }
                var inaccuracy_text = 1 / inaccuracy < 50 ? "High" : "Low";
                Render.StringCustom(15, base_yaw, 0, "Inaccuracy: ", [255, 255, 255, 255], font);
                Render.StringCustom(15 + string_size[0], base_yaw, 0, inaccuracy_text, (inaccuracy_text == "Low" ? [0, 255, 0, 255] : [255, 0, 0, 255]), font);
                base_yaw += 20;
            }
            if(script_config.indicator_picks & (1 << 5))
            {
                var string_size = Render.TextSizeCustom("Aim mode: ", font);
                var text = (script_config.rbot_lbot_switch_active ? "RAGE" : "LEGIT");
                Render.StringCustom(15, base_yaw, 0, "Aim mode: ", [255, 255, 255, 255], font);
                Render.StringCustom(15 + string_size[0], base_yaw, 0, text, (text == "RAGE" ? [135, 50, 168, 255] : [39, 214, 202, 255]), font);
            }
            if(script_config.indicator_picks & (1 << 6))
            {
                var enemies = Entity.GetEnemies();
                var enemy_arr_length = enemies.length;
                var col = script_config.indicator_enemy_side_col;
                for(var i = 0; i < enemy_arr_length; i++)
                {
                    if(Entity.IsValid(enemies[i]) && Entity.IsAlive(enemies[i]) && !Entity.IsDormant(enemies[i]) && !Entity.IsBot(enemies[i])) //Of course a bot cannot desync lol
                    {
                        //var enemy_choked_ticks = get_choked_ticks_for_entity(enemies[i]);
                        //if(enemy_choked_ticks < 1)
                        //{
                           // continue;
                        //}
                        var enemy_freestanding_result = handle_edge_detection(enemies[i], 30);
                        if(enemy_freestanding_result == 0)
                        {
                            continue; 
                        }
                        var render_box = Entity.GetRenderBox(enemies[i]);
                        if(render_box[0] == false)
                        {
                            continue;
                        }
                        var center_of_bbox_x = render_box[3] - render_box[1];
                        center_of_bbox_x /= 2;
                        center_of_bbox_x += render_box[1];
                        var text = "EST. REAL DIR: " + (enemy_freestanding_result == 1 ? "LEFT" : "RIGHT");
                        Render.String(center_of_bbox_x, render_box[2] - 25, 1, text, col, 2);
                    }
                }
            }
            if(script_config.indicator_picks & (1 << 7)) //Shit code incoming lol
            {
                var current_fake_side = indicator_dir; //Actually real side but w/e
                var screen_center_y = screensize[1] * 0.5;
                var screen_side_top = screensize[1] * 0.495;
                var screen_side_bottom = screensize[1] * 0.505;

                var col = script_config.indicator_legitaa_col;

                if(current_fake_side == -1) //The lines are for cool gamer style outlines around the polygons
                {
                    var right_front = screensize[0] * 0.54; 
                    var right_end = screensize[0] * 0.535;
                    var right_side = screensize[0] * 0.533;
                    
                    Render.Line(right_front, screen_center_y, right_side, screen_side_top, col);
                    Render.Line(right_end, screen_center_y, right_side, screen_side_top, col);

                    Render.Line(right_front, screen_center_y, right_side, screen_side_bottom, col);
                    Render.Line(right_end, screen_center_y, right_side, screen_side_bottom, col);
                    Render.Polygon([[right_front, screen_center_y], [right_end, screen_center_y], [right_side, screen_side_top]], [col[0], col[1], col[2], col[3] * 0.45]);
                    Render.Polygon([[right_front, screen_center_y], [right_side, screen_side_bottom], [right_end, screen_center_y]], [col[0], col[1], col[2], col[3] * 0.45]);
                }
                else if(current_fake_side == 1)
                {
                    var left_front = screensize[0] * 0.46;
                    var left_end = screensize[0] * 0.465;
                    var left_side = screensize[0] * 0.467;

                    Render.Line(left_front, screen_center_y, left_side, screen_side_top, col);
                    Render.Line(left_end, screen_center_y, left_side, screen_side_top, col);

                    Render.Line(left_front, screen_center_y, left_side, screen_side_bottom, col); 
                    Render.Line(left_side, screen_side_bottom, left_end, screen_center_y, col);

                    Render.Polygon([[left_end, screen_center_y], [left_front, screen_center_y], [left_side, screen_side_top]], [col[0], col[1], col[2], col[3] * 0.45]);
                    Render.Polygon([[left_side, screen_side_bottom], [left_front, screen_center_y], [left_end, screen_center_y]], [col[0], col[1], col[2], col[3] * 0.45]);
                }
            }
        }
        if(script_config.indicator_picks & (1 << 8)) //gay watermark
        {
            var watermark_string = "";
            var server_ip = World.GetServerString();
            var are_we_ingame = server_ip != "" && Entity.IsValid(local);
            if(server_ip == "valve")
            {
                server_ip = "valve ds"
            }
            if(server_ip == "local server")
            {
                server_ip = "127.0.0.1";
            }
            var accent_color = script_config.indicator_watermark_accent_col;
            var watermark_nickname = Cheat.GetUsername();
            if(are_we_ingame)
            {
                var kills = Entity.GetProp(local, "CPlayerResource", "m_iKills");
                var deaths = Entity.GetProp(local, "CPlayerResource", "m_iDeaths");

                var kd_ratio = deaths == 0 ? kills : (kills / deaths);
                var kd_string = kd_ratio.toFixed(2);
                
                watermark_string = "onetap.su & semirage assist | user: " + watermark_nickname + " | kills: " + kills + " | deaths: " + deaths + " | k/d: " + kd_string + " | host: " + server_ip;
            }
            else
            {
                watermark_string = "onetap.su && semirage assist | user: " + watermark_nickname;
            }
            var string_size = Render.TextSizeCustom(watermark_string, watermark_font);
            Render.FilledRect(screensize[0] * 0.99 - string_size[0], 8, string_size[0] + 10, 20, [0, 0, 0, 150]);
            Render.StringCustom(screensize[0] * 0.99 - string_size[0] + 5, 11, 0, watermark_string, accent_color, watermark_font);
            Render.Line(screensize[0] * 0.99 - string_size[0], 28, screensize[0] * 0.99 + 9, 28, accent_color);
            Render.GradientRect(screensize[0] * 0.99 - string_size[0], 27, string_size[0] + 10, 3, 1, accent_color, [accent_color[0] * 0.75, accent_color[1]*0.75, accent_color[2]*0.75, accent_color[3] * 0.75]);
        }
    }
}

function handle_switch()
{
    UI.SetValue("Rage", "GENERAL", "Enabled", script_config.rbot_lbot_switch_active);
    UI.SetValue("Legit", "GENERAL", "General", "Enabled", !script_config.rbot_lbot_switch_active);
}

function fix_slowwalk()
{
    UI.SetValue("Misc", "Movement", "Accurate walk", script_config.script_active && !script_config.rbot_lbot_switch_active && UI.IsHotkeyActive("Anti-Aim", "Extra", "Slow walk"));
}

function on_move()
{
    local = Entity.GetLocalPlayer();
    if(script_config.script_active)
    {
        setup_config_and_dyn_fov();
        handle_legitaa();
        if(script_config.rbot_active && !script_config.autowall_active)
        {
            handle_autowall();
        }
        handle_fakelag();
    }
}

var last_direction_switch = 0;

function on_draw()
{
    update_settings();
    handle_visibility();
    handle_switch();
    handle_indicators();
    if(last_direction_switch + 0.3 < Globals.Curtime())
    {
        current_proper_direction = handle_edge_detection(local, 15);
        last_direction_switch = Globals.Curtime();
    }
    fix_slowwalk();
} //Can't be arsed setting up a FSN callback for all the misc shit and doing it in Draw doesn't seem to be a bad choice, seeing as it's called once-per-frame.

//Gay killsay territory
var normal_killsays = ["ez", "too fucking easy", "effortless", "easiest kill of my life", 
    "retard blasted", "cleans?", "nice memesense retard", "hello mind explaining what happened there", 
    "pounce out of your window disgusting tranny, you shouldnt exist in this world", 
    "lmao ur so ugly irl like bro doesnt it hurt to live like that, btw you know you can just end it all",
    "ROFL NICE *DEAD* HHHHHHHHHHHHHHHHHH", "take the cooldown and let your team surr retard",
    "go take some estrogen tranny", "uid police here present your user identification number right now"];
    
    var hs_killsays = ["ez", "effortless", "1", "nice antiaim, you sell?", "you pay for that?", 
    "refund right now", "consider suicide", "bro are u clean?",
    "another retard blasted",
    "hhhhhhhhhhhhhhhhhh 1, you pay for that? refund so maybe youll afford some food for your family thirdworld monkey",
    "paster abandoned the match and received a 7 day competitive matchmaking cooldown",
    "freeqn.net/refund.php", "refund your rainbowhook right now pasteuser dog",
    "140er????", "get good get vantap4ik",
    "1 but all you need to fix your problems is a rope and a chair you ugly shit",
    "who (kto) are you (nn4ik) wattafak mens???????", "must be an uid issue", "holy shit consider refunding your trash paste rofl",
    "hello please refund your subpar product"];

    var awall_killsays = ["ez", "effortless", "sorry for awall bro", 
    "get autoballed monkey",
    "too ez", "legit wallbang", "my awall > your awall", "1 hhhh", 
    "sorry i held down my awall key bro", "thats going in my media compilation right there get shamed retard rofl",
    "imagine the only thing you eat being bullets man being a thirdworlder must suck rofl", "so fucking ez", "bot_kick", "where the enemies at????"];

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

//if they shoot us they better be ready for da OTTOBALL
function on_player_hurt()
{
    var attacker = Entity.GetEntityFromUserID(Event.GetInt("attacker"));
    var victim = Entity.GetEntityFromUserID(Event.GetInt("userid"));
    if(local == victim && Event.GetInt("health") > 0 && Entity.IsEnemy(attacker))
    {
        players_who_hurt_us.push({cisgendered_pig: attacker, time_he_hurt_us: Globals.Curtime()}); //How dare he hurt our precious trans selves? (youre playing semirage youre probably taking estrogen)
    }
}

function on_round_start() //Clean up our shit.
{
    players_who_hurt_us.splice(0, players_who_hurt_us.length);
    ragebot_targets_this_round.splice(0, ragebot_targets_this_round.length);
    last_peek = 0.0;
    last_direction_switch = 0.0;
}

function on_ragebot_fire()
{
    var target_index = Event.GetInt("target_index");
    ragebot_targets_this_round.push({aimbot_target: target_index, shot_time: Globals.Curtime()});
    if(script_config.rage_shot_log)
    {
        var target_name = Entity.GetName(target_index);
        var hitbox = Event.GetInt("hitbox");
        var hitbox_name = get_hitbox_name(hitbox);
        var hitchance = Event.GetInt("hitchance");
        var safety = Event.GetInt("safepoint");
        var safety_string = safety == 1 ? "ON" : "OFF";
        var local_eyepos = Entity.GetEyePosition(local);
        var target_hitboxpos = Entity.GetHitboxPosition(target_index, hitbox);
        var hitbox_string = "";
        if(typeof(target_hitboxpos) != "undefined")
        {
            var trace = Trace.Bullet(local, target_index, local_eyepos, target_hitboxpos);
            var damage = trace[1];
            var visibility = trace[2];
            hitbox_string = " ( predicted damage: \x0C" + damage + " \x01, center of hitbox visible: \x0C" + visibility + " \x01)";
        }
        var final_string = " \x03[semirage assist] \x01fired at \x04" + target_name + " \x01into \x04" + hitbox_name + " \x01with hitchance \x0C" + hitchance + " \x01( safety status: \x02" + safety_string + " \x01)" + hitbox_string;
        Cheat.PrintChat(final_string);
    }
}

function on_unload()
{
    AntiAim.SetOverride(0); //i hate having aa override left on
}

function setup_callbacks()
{
    //Function callbacks + unload callback
    Cheat.RegisterCallback("CreateMove", "on_move");
    Cheat.RegisterCallback("Draw", "on_draw");
    Cheat.RegisterCallback("Unload", "on_unload");

    //Event callbacks
    Cheat.RegisterCallback("player_death", "on_player_death");
    Cheat.RegisterCallback("player_hurt", "on_player_hurt");
    Cheat.RegisterCallback("ragebot_fire", "on_ragebot_fire");
    Cheat.RegisterCallback("round_start", "on_round_start");
}

setup_callbacks();

