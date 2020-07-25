//Unfinished (meant to add some other shit in there), might finish sometime later (don't have a subscription ATM and can't be fucked buying one)

const menu = 
{
    menu_types: 
    {
        TYPE_VALUE: 0,
        TYPE_COLOR: 1,
        TYPE_KEYBIND: 2,
        TYPE_REFERENCE: 3
    },

    menu_array: [], //where the items lie lol

    //I understand that all of those can be generalized, but this way the code is more clear.
    create_checkbox: function(created_var_name)
    {
        return this.menu_array.push({type: this.menu_types.TYPE_VALUE, var_name: UI.AddCheckbox(created_var_name), is_item_visible: true}) - 1; //I guess the variable naming is a bit gay rofl
    },

    create_slider_int: function(created_var_name, created_var_min, created_var_max)
    {
        return this.menu_array.push({type: this.menu_types.TYPE_VALUE, var_name: UI.AddSliderInt(created_var_name, created_var_min, created_var_max), is_item_visible: true}) - 1;
    },

    create_slider_float: function(created_var_name, created_var_min, created_var_max)
    {
        return this.menu_array.push({type: this.menu_types.TYPE_VALUE, var_name: UI.AddSliderFloat(created_var_name, created_var_min, created_var_max), is_item_visible: true}) - 1;
    },

    create_dropdown: function(created_var_name, created_var_dropdown_array)
    {
        return this.menu_array.push({type: this.menu_types.TYPE_VALUE, var_name: UI.AddDropdown(created_var_name, created_var_dropdown_array), is_item_visible: true}) - 1;
    },

    create_multi_dropdown: function(created_var_name, created_var_dropdown_array)
    {
        return this.menu_array.push({type: this.menu_types.TYPE_VALUE, var_name: UI.AddMultiDropdown(created_var_name, created_var_dropdown_array), is_item_visible: true}) - 1;
    },

    create_colorpicker: function(created_var_name)
    {
        return this.menu_array.push({type: this.menu_types.TYPE_COLOR, var_name: UI.AddColorPicker(created_var_name), is_item_visible: true}) - 1;
    },

    create_keybind: function(created_var_name)
    {
        return this.menu_array.push({type: this.menu_types.TYPE_KEYBIND, var_name: UI.AddHotkey(created_var_name), is_item_visible: true}) - 1;
    },

    create_menu_reference: function(var_path, var_type)
    {
        return this.menu_array.push({type: this.menu_types.TYPE_REFERENCE, var_name: var_path, is_item_visible: true, reference_subtype: var_type}) - 1;
    },

    get_item_value: function(var_index)
    {
        if(typeof(this.menu_array[var_index]) != "undefined")
        {
            const var_type = this.menu_array[var_index].type == this.menu_types.TYPE_REFERENCE ? this.menu_array[var_index].reference_subtype : this.menu_array[var_index].type;
            switch(var_type)
            {
                case this.menu_types.TYPE_VALUE:
                    return UI.GetValue.apply(null, this.menu_array[var_index].var_name); //Why isn't UI.GetValue good for all menu items? llama pls fix
                case this.menu_types.TYPE_COLOR:
                    return UI.GetColor.apply(null, this.menu_array[var_index].var_name);
                case this.menu_types.TYPE_KEYBIND:
                    return UI.IsHotkeyActive.apply(null, this.menu_array[var_index].var_name);
                default:
                    throw new Error("[onetap] invalid type specified for get_script_item_value call (variable name " + menu_array[var_index].var_name + ", specified type: " + type + ")\n");
            }
        }
        throw new Error("[onetap] invalid menu item specified for get_script_item_value\n");
    },

    set_item_visibility: function(var_index, visibility_status)
    {
        if(typeof(this.menu_array[var_index]) != "undefined")
        {
            if(this.menu_array[var_index].is_item_visible != visibility_status && UI.IsMenuOpen())
            {
                UI.SetEnabled.apply(null, this.menu_array[var_index].var_name.concat(visibility_status));
                this.menu_array[var_index].is_item_visible = visibility_status;
            }
        }
        else
        {
            throw new Error("[onetap] invalid menu item specified for set_item_visibility\n");
        }
    },

    set_item_value: function(var_index, new_value)
    {
        if(typeof(this.menu_array[var_index]) != "undefined")
        {
            const var_type = this.menu_array[var_index].type == this.menu_types.TYPE_REFERENCE ? this.menu_array[var_index].reference_subtype : this.menu_array[var_index].type;
            switch(var_type)
            {
                case this.menu_types.TYPE_VALUE:
                    UI.SetValue.apply(null, this.menu_array[var_index].var_name.concat(new_value));
                    break;
                case this.menu_types.TYPE_COLOR:
                    UI.SetColor.apply(null, this.menu_array[var_index].var_name.concat(new_value));
                    break;
                case this.menu_types.TYPE_KEYBIND:
                    const keybind_state = this.get_item_value(var_index);
                    if(keybind_state != new_value)
                    {
                        UI.ToggleHotkey.apply(null, this.menu_array[var_index].var_name); //Requires hotkey to be in "Toggle" mode :(
                    }
                    break;
                default:
                    throw new Error("[onetap] invalid type specified for set_item_value (variable name " + menu_array[var_index].var_name + ", specified type: " + this.menu_array[var_index].type + ")\n");
            }
        }
        else
        {
            throw new Error("[onetap] invalid menu item specified for set_item_value\n");
        }
    }
};

const master_switch = menu.create_checkbox("Doubletap improvements");
const doubletap_speed = menu.create_slider_int("Speed", 0, 2);

const doubletap_enabled_hotkey_reference = menu.create_menu_reference(["Rage", "Doubletap"], menu.menu_types.TYPE_KEYBIND);
const doubletap_enabled_value_reference = menu.create_menu_reference(["Rage", "Doubletap"], menu.menu_types.TYPE_VALUE);

const utility = { log_prefix: "[doubletap_improvements] ", log_prefix_col: [0, 255, 0, 200], log: function(string) { Cheat.PrintColor(this.log_prefix_col, this.log_prefix); Cheat.Print(string + "\n"); } };

const able_to_shift_shot = function(local, ticks_to_shift) //From Salvatore :)
{
    const server_time = (Entity.GetProp(local, "CCSPlayer", "m_nTickBase") - ticks_to_shift) * Globals.TickInterval();
    return server_time > Entity.GetProp(local, "CCSPlayer", "m_flNextAttack") && server_time > Entity.GetProp(Entity.GetWeapon(local), "CBaseCombatWeapon", "m_flNextPrimaryAttack");
};

const on_move = function()
{
    if(menu.get_item_value(doubletap_enabled_value_reference) && menu.get_item_value(doubletap_enabled_hotkey_reference) && menu.get_item_value(master_switch))
    {
        const desired_doubletap_speed = menu.get_item_value(doubletap_speed);

        Exploit.OverrideShift(12 + desired_doubletap_speed);
        Exploit.OverrideTolerance(2 - desired_doubletap_speed); //yes i know its clamped to 1 but its PRETTY this way!

        const local = Entity.GetLocalPlayer();

        const exploit_charge = Exploit.GetCharge();
        
        exploit_charge != 1 ? Exploit.EnableRecharge() : Exploit.DisableRecharge();

        const able_to_shift = able_to_shift_shot(local, 12 + desired_doubletap_speed);
        var should_recharge_doubletap = exploit_charge != 1 && able_to_shift;

        const enemies = Entity.GetEnemies().filter(function(entity_index) { return Entity.IsValid(entity_index) && Entity.IsAlive(entity_index) && !Entity.IsDormant(entity_index); });

        const local_eyepos = Entity.GetEyePosition(local);

        if(should_recharge_doubletap)
        {
            for(var i = 0; i < enemies.length; i++)
            {
                const entity_index = enemies[i];
                const entity_head_position = Entity.GetHitboxPosition(entity_index, 0);
                const entity_render_origin = Entity.GetRenderOrigin(entity_index);
                if(typeof(entity_head_position) != "undefined")
                {
                    const head_trace = Trace.Line(local, local_eyepos, entity_head_position);
                    const origin_trace = Trace.Line(local, local_eyepos, entity_render_origin);

                    if(head_trace[0] == entity_index || head_trace[1] == 1 || origin_trace[0] == entity_index || origin_trace[1] == 1)
                    {
                        should_recharge_doubletap = false;
                        break;
                    }
                }
            }
        }
        
        if(should_recharge_doubletap)
        {
            Exploit.DisableRecharge();
            Exploit.Recharge();
        }
    }
    else
    {
        Exploit.EnableRecharge();
    }
};

const on_draw = function()
{
    const local = Entity.GetLocalPlayer();
    if(Entity.IsValid(local) && Entity.IsAlive(local))
    {
        const font = Render.AddFont("Segoe UI", 8, 400);
        const exploit_charge = Exploit.GetCharge(); const can_shift_shot = able_to_shift_shot(local, 14);
        const doubletap_state = menu.get_item_value(doubletap_enabled_hotkey_reference) && menu.get_item_value(doubletap_enabled_value_reference) && exploit_charge == 1 ? "2" : menu.get_item_value(doubletap_enabled_hotkey_reference) && menu.get_item_value(doubletap_enabled_value_reference) && can_shift_shot ? "1" : "0";
        const string = "doubletap_improvements.js | exp. charge: " + exploit_charge.toFixed(2) + " | state: " + doubletap_state;
        const string_size = Render.TextSizeCustom(string, font);
        string_size[0] += 8;
        string_size[1] += 4;
        const x = Render.GetScreenSize()[0] - string_size[0] - 10, y = 75;
        Render.FilledRect(x - 4, y + 1, 3, string_size[1], [89, 119, 239, 255]);
        Render.FilledRect(x - 1, y + 1, string_size[0] + 3, string_size[1], [17, 17, 17, 200]);
        Render.StringCustom(x + 4, y + 2, 0, string, [255, 255, 255, 255], font);
    }
    
};

const on_unload = function()
{
    Exploit.EnableRecharge();
};

Cheat.RegisterCallback("CreateMove", "on_move");
Cheat.RegisterCallback("Unload", "on_unload");
Cheat.RegisterCallback("Draw", "on_draw");

utility.log("big dt by big man loaded");
