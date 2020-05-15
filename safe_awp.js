var js_items = ["Misc", "JAVASCRIPT", "Script Items"];

UI.AddCheckbox("Safe AWP");

function is_hitbox_potentially_unsafe(hitbox)
{
    return (hitbox <= 1 || hitbox >= 6);
}

const c_weapon_awp = 232;

function on_move()
{
    if(UI.GetValue(js_items, "Safe AWP"))
    {
        var local = Entity.GetLocalPlayer();
        var local_weapon = Entity.GetWeapon(local);
        var local_weapon_classid = Entity.GetClassID(local_weapon);
        if(local_weapon_classid == c_weapon_awp)
        {
            for(var i = 0; i <= 12; i++)
            {
                if(is_hitbox_potentially_unsafe(i))
                {
                    Ragebot.ForceHitboxSafety(i);
                }
            }
        }
    }
}

Cheat.RegisterCallback("CreateMove", "on_move");
