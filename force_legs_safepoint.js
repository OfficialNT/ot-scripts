UI.AddMultiDropdown("Force safepoint on limbs", ["Legs", "Feet"]);

function on_move()
{
    const safepoint_selection = UI.GetValue("Misc", "Force safepoint on limbs");
    if(safepoint_selection & (1 << 0)) //Webster, you don't need a library to use multidropdowns, l0l
    {
        Ragebot.ForceHitboxSafety(7);
        Ragebot.ForceHitboxSafety(8);
        Ragebot.ForceHitboxSafety(9);
        Ragebot.ForceHitboxSafety(10);
    }
    if(safepoint_selection & (1 << 1))
    {
        Ragebot.ForceHitboxSafety(11);
        Ragebot.ForceHitboxSafety(12);
    }
}

Cheat.RegisterCallback("CreateMove", "on_move");
