UI.AddCheckbox("Enable anti-bruteforce");
UI.AddSliderInt("Anti-bruteforce step", 5, 25);
UI.AddCheckbox("Invert fake on step");

var math_library = require("mathlib.js"); 
var js_items = "Misc";

function random_int(min, max)
{
    return Math.floor(Math.random() * (Math.ceil(max) - Math.floor(min) + 1)) + Math.floor(min);
}

function vector_distance_to(from, to)
{
    var delta = [to[0] - from[0], to[1] - from[1], to[2] - from[2]];
    return math_library.VectorLength(delta);
}

function point_lies_between_points(point, start, end)
{
    var gradient = ((end[1] - start[1]) / (end[0] - start[0]));
    if(gradient == 0)
    {
        return point[1] == start[1];
    }
    var perpeticular_gradient = -1.0 / gradient;
    var perpeticular_const_start = start[1] - (perpeticular_gradient * start[0]);
    var perpeticular_const_end = end[1] - (perpeticular_gradient * end[0]);

    return point[1] >= (perpeticular_gradient * point[0] + perpeticular_const_start) && point[1] <= (perpeticular_gradient * point[0] + perpeticular_const_end);
}

function was_shot_intended_for_us(source, observer, bullet_impact)
{
    if(!(source[1] > bullet_impact[1] ? point_lies_between_points(observer, bullet_impact, source) : point_lies_between_points(observer, source, bullet_impact)))
    {
        return false;
    }
    var bullet_dist = vector_distance_to(source, bullet_impact);
    var origin_to_observer_dist = vector_distance_to(source, observer);
    var observer_to_impact_dist = vector_distance_to(observer, bullet_impact);

    var angle = Math.acos((observer_to_impact_dist * observer_to_impact_dist - origin_to_observer_dist * origin_to_observer_dist - bullet_dist * bullet_dist) / (-2 * bullet_dist * origin_to_observer_dist));
    return (Math.sin(angle) * origin_to_observer_dist) <= 150.0;
}

var current_fake_step = 0;

function on_bullet_impact()
{
    if(UI.GetValue(js_items, "Enable anti-bruteforce"))
    {
        var local = Entity.GetLocalPlayer();
        if(!Entity.IsAlive(local))
        {
            fake_switch_stage = 0;
            return;
        }
        var player = Entity.GetEntityFromUserID(Event.GetInt("userid"));
        if(!Entity.IsValid(player) || Entity.IsTeammate(player) || Entity.IsDormant(player)) //basic checks
        {
            return;
        }
        var impact_vector = [Event.GetFloat("x"), Event.GetFloat("y"), Event.GetFloat("z")];
        var player_shootpos = Entity.GetEyePosition(player);
        var local_headpos = Entity.GetEyePosition(local);
        if(was_shot_intended_for_us(player_shootpos, local_headpos, impact_vector))
        {
            current_fake_step++;
            if(current_fake_step == 4)
            {
                current_fake_step = 0;
            }
            var antibf_step = UI.GetValue(js_items, "Anti-bruteforce step");
            var should_invert_fake = UI.GetValue(js_items, "Invert fake on step");
            switch(current_fake_step)
            {
                case 0:
                    break;
                case 1:
                    antibf_step *= 2;
                    break;
                case 2:
                    antibf_step *= -1;
                    break;
                case 3:
                    antibf_step *= -2;
                    break;
            }
            UI.SetValue("Anti-Aim", "Rage Anti-Aim", "Yaw offset", antibf_step);
            if(should_invert_fake)
            {
                UI.ToggleHotkey("Anti-Aim", "Fake angles", "Inverter");
            }
        }
    }
}

function handle_visibility()
{
    var is_enabled = UI.GetValue(js_items, "Enable anti-bruteforce");
    UI.SetEnabled(js_items, "Anti-bruteforce step", is_enabled);
    UI.SetEnabled(js_items, "Invert fake on step", is_enabled);
    render_stage_indicator();
}

function render_stage_indicator()
{
    if(UI.GetValue(js_items, "Enable anti-bruteforce"))
    {
        var yaw_offset = UI.GetValue("Anti-Aim", "Rage Anti-Aim", "Yaw offset");
        Render.String(15, 700, 0, "Anti-bruteforce stage: " + current_fake_step + ", current yaw offset: " + yaw_offset + "\nInverter status: " + UI.IsHotkeyActive("Anti-Aim", "Fake angles", "Inverter"), [255, 255, 255, 255]);
    }
}

Cheat.RegisterCallback("bullet_impact", "on_bullet_impact");
Cheat.RegisterCallback("Draw", "handle_visibility");
