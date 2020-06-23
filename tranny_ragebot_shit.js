//i tried to go full on tranny for this code, dont think i quite succeeded
//code is basically obfuscated since its so tranny

const ragebot_safe_conditions = ["Lethal", "Lethal (DT)", "Standing", "Slowwalking", "Moving", "In air", "Knife out"];

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
        UI.AddCheckbox(created_var_name);
        return this.menu_array.push({type: this.menu_types.TYPE_VALUE, var_name: created_var_name, is_item_visible: true}) - 1;
    },

    create_slider_int: function(created_var_name, created_var_min, created_var_max)
    {
        UI.AddSliderInt(created_var_name, created_var_min, created_var_max);
        return this.menu_array.push({type: this.menu_types.TYPE_VALUE, var_name: created_var_name, is_item_visible: true}) - 1;
    },

    create_slider_float: function(created_var_name, created_var_min, created_var_max)
    {
        UI.AddSliderFloat(created_var_name, created_var_min, created_var_max);
        return this.menu_array.push({type: this.menu_types.TYPE_VALUE, var_name: created_var_name, is_item_visible: true}) - 1;
    },

    create_dropdown: function(created_var_name, created_var_dropdown_array)
    {
        UI.AddDropdown(created_var_name, created_var_dropdown_array);
        return this.menu_array.push({type: this.menu_types.TYPE_VALUE, var_name: created_var_name, is_item_visible: true}) - 1;
    },

    create_multi_dropdown: function(created_var_name, created_var_dropdown_array)
    {
        UI.AddMultiDropdown(created_var_name, created_var_dropdown_array);
        return this.menu_array.push({type: this.menu_types.TYPE_VALUE, var_name: created_var_name, is_item_visible: true}) - 1;
    },

    create_colorpicker: function(created_var_name)
    {
        UI.AddColorPicker(created_var_name);
        return this.menu_array.push({type: this.menu_types.TYPE_COLOR, var_name: created_var_name, is_item_visible: true}) - 1;
    },

    create_keybind: function(created_var_name)
    {
        UI.AddHotkey(created_var_name);
        return this.menu_array.push({type: this.menu_types.TYPE_KEYBIND, var_name: created_var_name, is_item_visible: true}) - 1;
    },

    create_menu_reference: function(var_path, var_type)
    {
        return this.menu_array.push({type: this.menu_types.TYPE_REFERENCE, var_name: var_path, is_item_visible: true, reference_subtype: var_type}) - 1;
    },

    get_item_value: function(var_index)
    {
        if(typeof(this.menu_array[var_index]) != "undefined")
        {
            switch(this.menu_array[var_index].type)
            {
                case this.menu_types.TYPE_VALUE:
                    return UI.GetValue("Misc", "JAVASCRIPT", "Script items", this.menu_array[var_index].var_name);
                case this.menu_types.TYPE_COLOR:
                    return UI.GetColor("Misc", "JAVASCRIPT", "Script items", this.menu_array[var_index].var_name);
                case this.menu_types.TYPE_KEYBIND:
                    return UI.IsHotkeyActive("Misc", "JAVASCRIPT", "Script items", this.menu_array[var_index].var_name);
                case this.menu_types.TYPE_REFERENCE:
                    switch(this.menu_array[var_index].reference_subtype)
                    { //LLAMA DU HURENSOHN WHY CANT WE PASS ARRAYS INTO MENU FUNCTIONS ANYMORE REEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE
                        case this.menu_types.TYPE_VALUE:
                            return UI.GetValue.apply(null, this.menu_array[var_index].var_name); //Oh well, this way it's good enough
                        case this.menu_types.TYPE_COLOR:
                            return UI.GetColor.apply(null, this.menu_array[var_index].var_name);
                        case this.menu_types.TYPE_KEYBIND:
                            return UI.IsHotkeyActive.apply(null, this.menu_array[var_index].var_name);
                        default:
                            throw new Error("[onetap] invalid type specified for get_script_item_value for reference call (variable name " + JSON.stringify(menu_array[var_index].var_name) /*dunno how error msgs handle arrays*/ + ", specified type: " + type + ")\n");
                    }
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
                switch(this.menu_array[var_index].type)
                {
                    case this.menu_types.TYPE_REFERENCE:
                        const temporary_argument_arr = this.menu_array[var_index].var_name;
                        temporary_argument_arr.push(visibility_status); //Has to be done :(
                        UI.SetEnabled.apply(null, temporary_argument_arr);
                        break;
                    default:
                        UI.SetEnabled("Misc", "JAVASCRIPT", "Script items", this.menu_array[var_index].var_name, visibility_status);
                }
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
            switch(this.menu_array[var_index].type)
            {
                case this.menu_types.TYPE_VALUE:
                    UI.SetValue("Misc", "JAVASCRIPT", "Script items", this.menu_array[var_index].var_name, new_value);
                    break;
                case this.menu_types.TYPE_COLOR:
                    UI.SetColor("Misc", "JAVASCRIPT", "Script items", this.menu_array[var_index].var_name, new_value);
                    break;
                case this.menu_types.TYPE_REFERENCE:
                    const temporary_argument_arr = this.menu_array[var_index].var_name;
                    temporary_argument_arr.push(new_value);
                    switch(this.menu_array[var_index].reference_subtype)
                    {
                        case this.menu_types.TYPE_VALUE:
                            UI.SetValue.apply(null, temporary_argument_arr);
                            break;
                        case this.menu_types.TYPE_COLOR:
                            UI.SetColor.apply(null, temporary_argument_arr);
                            break;
                        default:
                            throw new Error("[onetap] invalid type specified for set_item_value for reference call (variable name " + menu_array[var_index].var_name + ", specified type: " + this.menu_array[var_index].reference_subtype + ")\n");
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
}

const math = 
{
    vector: 
    {
        length: function(a)
        {
            return Math.sqrt(a[0] ** 2 + a[1] ** 2 + a[2] ** 2);
        }
    }
}


const master_switch = menu.create_checkbox("Ragebot improvements master switch");
const force_safety_dropdown = menu.create_multi_dropdown("Force safety", ragebot_safe_conditions);
const doubletap_improvements = menu.create_checkbox("Doubletap damage improvements");
const draw_preferences = menu.create_checkbox("Safety indicators");

const ragebot_active_hotkey_reference = menu.create_menu_reference(["Rage", "General", "Enabled"], menu.menu_types.TYPE_KEYBIND);

const doubletap_active_value_reference = menu.create_menu_reference(["Rage", "Exploits", "Doubletap"], menu.menu_types.TYPE_VALUE);
const doubletap_active_hotkey_reference = menu.create_menu_reference(["Rage", "Exploits", "Doubletap"], menu.menu_types.TYPE_KEYBIND);

const utility = 
{
    global_variables:
    {
        local_player: -1
    },

    script_settings:
    {
        is_active: menu.get_item_value(master_switch),
        force_safety_list: menu.get_item_value(force_safety_dropdown),
        indicator: menu.get_item_value(draw_preferences),
        doubletap_mindmg_shit: menu.get_item_value(doubletap_improvements),
        update: function()
        {
            this.is_active = menu.get_item_value(master_switch);
            this.force_safety_list = menu.get_item_value(force_safety_dropdown);
            this.indicator = menu.get_item_value(draw_preferences);
            this.doubletap_mindmg_shit = menu.get_item_value(doubletap_improvements);
        }
    },

    handle_menu_item_visibility: function()
    {
        const is_script_active = menu.get_item_value(master_switch);
        
        menu.set_item_visibility(force_safety_dropdown, is_script_active);
        menu.set_item_visibility(draw_preferences, is_script_active);
        menu.set_item_visibility(doubletap_improvements, is_script_active);
    },

    safepoint_conditions:
    {
        ON_LETHAL: (1 << 0),
        ON_LETHAL_DT: (1 << 1),
        ON_STANDING: (1 << 2),
        ON_SLOWWALK: (1 << 3),
        ON_MOVE: (1 << 4),
        ON_AERIAL: (1 << 5),
        ON_KNIFEOUT: (1 << 6)
    }
}


const features = 
{
    safe_enemies: [],

    handle_entity_preference: function(entity_index)
    {
        if(Entity.IsValid(entity_index) && Entity.IsAlive(entity_index) && !Entity.IsDormant(entity_index))
        {
            const current_safepoint_settings = utility.script_settings.force_safety_list;
            if(current_safepoint_settings == 0)
            {
                this.safe_enemies[entity_index] = false;
                return;
            }

            var should_apply_safepoint_on_entity = false;

            const safepoint_on_lethal = current_safepoint_settings & utility.safepoint_conditions.ON_LETHAL;
            const safepoint_on_standing = current_safepoint_settings & utility.safepoint_conditions.ON_STANDING;
            const safepoint_on_slowwalk = current_safepoint_settings & utility.safepoint_conditions.ON_SLOWWALK;
            const safepoint_on_move = current_safepoint_settings & utility.safepoint_conditions.ON_MOVE;
            const safepoint_on_aerial = current_safepoint_settings & utility.safepoint_conditions.ON_AERIAL;
            const safepoint_on_knife = current_safepoint_settings & utility.safepoint_conditions.ON_KNIFEOUT; //rape all the dogs who think standing with a knife out to get EPIC ANTIMEDIA is new

            const doubletap_active_and_ready = menu.get_item_value(doubletap_active_value_reference) && menu.get_item_value(doubletap_active_hotkey_reference) && Exploit.GetCharge() == 1;
            const safepoint_on_lethal_dt = (current_safepoint_settings & utility.safepoint_conditions.ON_LETHAL_DT) && doubletap_active_and_ready;

            //Do the shit that only does number compares first, do expensive autowall calls later
            if(safepoint_on_standing || safepoint_on_slowwalk || safepoint_on_move) //All of those rely on velocity in one way or another
            {
                const current_entity_velocity = math.vector.length(Entity.GetProp(entity_index, "CBasePlayer", "m_vecVelocity[0]"));

                const standing = current_entity_velocity < 3.5; //To avoid classifying retards who do "micromovement"
                const slowwalking = !standing && current_entity_velocity < 135; //Magic number, but I don't think any slowwalk goes above 135-ish
                const moving = !standing && !slowwalking;

                if((safepoint_on_standing && standing) || (safepoint_on_slowwalk && slowwalking) || (safepoint_on_move && moving))
                {
                    should_apply_safepoint_on_entity = true;
                }
            }

            if(!should_apply_safepoint_on_entity && safepoint_on_aerial)
            {
                const current_entity_flags = Entity.GetProp(entity_index, "CBasePlayer", "m_fFlags");
                if(!(current_entity_flags & (1 << 0) /* FL_ONGROUND */))
                {
                    should_apply_safepoint_on_entity = true;
                }
            }

            if(!should_apply_safepoint_on_entity && safepoint_on_knife)
            {
                const entity_weapon_handle = Entity.GetProp(entity_index, "CBasePlayer", "m_hActiveWeapon"); //Way of getting if the weapon is a knife is shamelessly stolen from April's weapon config thing
                const entity_item_definition_index = Entity.GetProp(entity_weapon_handle, "CBaseAttributableItem", "m_iItemDefinitionIndex") & 0xFFFF;

                const all_knives = [41, 42, 59, 500, 503, 505, 506, 507, 508, 509, 512, 514, 515, 516, 517, 518, 519, 520, 521, 522, 523, 525];

                if(all_knives.some(function(val) { return val == entity_item_definition_index }))
                {
                    should_apply_safepoint_on_entity = true;
                }
                
            }

            //Finally, we get to the expensive-as-shit autowall calls

            if(!should_apply_safepoint_on_entity && (safepoint_on_lethal || safepoint_on_lethal_dt))
            {
                const local_eye_position = Entity.GetEyePosition(utility.global_variables.local_player);
                const entity_health = Entity.GetProp(entity_index, "CBasePlayer", "m_iHealth");
                for(var i = 2; i <= 4; i++) //check pelvis, body and thorax for lethality
                {
                    const entity_hitbox_position = Entity.GetHitboxPosition(entity_index, i);
                    if(typeof(entity_hitbox_position) != "undefined")
                    {
                        const trace = Trace.Bullet(utility.global_variables.local_player, entity_index, local_eye_position, entity_hitbox_position);
                        const damage = trace[1];

                        if(safepoint_on_lethal && damage > entity_health + 5 || (safepoint_on_lethal_dt && damage > entity_health / 2 + 5))
                        {
                            if(utility.script_settings.doubletap_mindmg_shit && safepoint_on_lethal_dt) 
                            {
                                Ragebot.ForceTargetMinimumDamage(entity_index, (entity_health / 2 + 5))
                            }
                            should_apply_safepoint_on_entity = true;
                            break;
                        }
                    }
                }
            }

            this.safe_enemies[entity_index] = should_apply_safepoint_on_entity;

            if(should_apply_safepoint_on_entity)
            {
                Ragebot.ForceTargetSafety(entity_index);
            }
        }
    },


    render_preferences: function()
    {
        if(utility.script_settings.is_active && utility.script_settings.indicator && menu.get_item_value(ragebot_active_hotkey_reference) && Entity.IsValid(utility.global_variables.local_player))
        {
            const enemies = Entity.GetEnemies();
            const enemies_length = enemies.length;
            for(var i = 0; i < enemies_length; i++)
            {
                const enemy = enemies[i];
                if(Entity.IsValid(enemy) && Entity.IsAlive(enemy) && !Entity.IsDormant(enemy))
                {
                    const safety_status = this.safe_enemies[enemy];
                    if(typeof(safety_status) == "undefined")
                    {
                        continue;
                    }
                    const renderbox = Entity.GetRenderBox(enemy);
                    if(!renderbox[0])
                    {
                        continue;
                    }

                    const text = safety_status ? "SAFETY" : "DEFAULT";
                    const color = safety_status ? [255, 25, 25, 200] : [255, 255, 255, 200];
                    const render_position = (renderbox[3] - renderbox[1]) / 2 + renderbox[1];

                    Render.String(render_position, renderbox[2] - 30, 1, text, color, 1);
                }
            }
        }
    }
}

function on_draw()
{
    utility.handle_menu_item_visibility();
    utility.script_settings.update();
    features.render_preferences();
}

function on_move()
{
    utility.global_variables.local_player = Entity.GetLocalPlayer();

    //Fuck it, imma just do all the calls to handle_entity_preference in createmove callback lol
    if(utility.script_settings.is_active && menu.get_item_value(ragebot_active_hotkey_reference))
    {
        const enemies = Entity.GetEnemies();
        const enemy_array_length = enemies.length;
        for(var i = 0; i < enemy_array_length; i++)
        {
            const enemy = enemies[i];
            features.handle_entity_preference(enemy);
        }
    }
    
}

function on_script_start()
{
    Cheat.RegisterCallback("CreateMove", "on_move");
    Cheat.RegisterCallback("Draw", "on_draw");
}

on_script_start();
