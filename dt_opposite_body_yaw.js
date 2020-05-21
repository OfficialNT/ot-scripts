function angle_diff(angle_1, angle_2)
{
    var delta = angle_1 - angle_2;
    delta %= 360;
    if(delta > 180)
    {
        delta -= 360;
    }
    if(delta < -180)
    {
        delta += 360;
    }
    return delta;
}

function on_move()
{
    if(UI.GetValue("Anti-Aim", "Fake angles", "LBY mode") == 1)
    {
        AntiAim.SetOverride(1);
        var fake_direction = UI.IsHotkeyActive("Anti-Aim", "Fake angles", "Inverter") == 1 ? 1 : -1;
        var real_yaw_offset = 60 * fake_direction;
        var lower_body_offset = -60 * fake_direction;
        var current_fake_yaw = Local.GetFakeYaw();
        var current_real_yaw = Local.GetRealYaw();
        if(Math.abs(angle_diff(current_fake_yaw, current_real_yaw)) > 100)
        {
            lower_body_offset = 180;
        }
        AntiAim.SetFakeOffset(0);
        AntiAim.SetRealOffset(real_yaw_offset);
        AntiAim.SetLBYOffset(lower_body_offset);
    }
    else
    {
        AntiAim.SetOverride(0);
    }
}

function on_unload()
{
    AntiAim.SetOverride(0);
}

Cheat.RegisterCallback("CreateMove", "on_move");
Cheat.RegisterCallback("Unload", "on_unload");