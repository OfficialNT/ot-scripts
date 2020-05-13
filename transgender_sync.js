var current_real_body_yaw_target = 60;
var current_real_body_yaw = -60;
function random_float(min, max)
{
    return Math.random() * (max - min) + min;
}
function on_move()
{
    var inversion = UI.IsHotkeyActive("Anti-Aim", "Fake angles", "Inverter") ? -1 : 1;
    AntiAim.SetOverride(1);
    if(current_real_body_yaw == current_real_body_yaw_target)
    {
        current_real_body_yaw_target = 0;
        current_real_body_yaw = 0;
    }
    current_real_body_yaw += current_real_body_yaw_target > 0 ? 3 : -3;

    var fake_yaw_offset = Math.floor(random_float(0, 60));
    AntiAim.SetFakeOffset(fake_yaw_offset * inversion);
    AntiAim.SetRealOffset(current_real_body_yaw * inversion);
    AntiAim.SetLBYOffset(0);
    
}

function on_unload()
{
    AntiAim.SetOverride(0);
}

Cheat.RegisterCallback("CreateMove", "on_move");
Cheat.RegisterCallback("Unload", "on_unload");