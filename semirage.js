//Legitbot code is terrible ATM, need to recode. Better than the previous one, though :D

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
                            throw new Error("[onetap] invalid type specified for get_item_value for reference call (variable name " + JSON.stringify(menu_array[var_index].var_name) /*dunno how error msgs handle arrays*/ + ", specified type: " + type + ")\n");
                    }
                default:
                    throw new Error("[onetap] invalid type specified for get_item_value call (variable name " + menu_array[var_index].var_name + ", specified type: " + type + ")\n");
            }
        }
        throw new Error("[onetap] invalid menu item specified for get_item_value, item index " + var_index + "\n");
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
                    const temporary_argument_arr = this.menu_array[var_index].var_name.concat(new_value);
                    //temporary_argument_arr.push(new_value);
                    switch(this.menu_array[var_index].reference_subtype)
                    {
                        case this.menu_types.TYPE_VALUE:
                            UI.SetValue.apply(null, temporary_argument_arr);
                            break;
                        case this.menu_types.TYPE_COLOR:
                            UI.SetColor.apply(null, temporary_argument_arr);
                            break;
                        default: //We can't set a hotkey, can we?
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
};

const setup_helpers = 
{
    weapon_types: ["Pistol", "Heavy pistol", "Rifle", "SMG", "Heavy", "SSG 08", "AWP", "Autosniper"],
    weapon_types_cfg: ["pistol", "heavy_pistol", "rifle", "smg", "heavy", "ssg08", "awp", "autosniper"],
    ragebot_weapon_types: ["GENERAL", "PISTOL", "HEAVY PISTOL", "SCOUT", "AWP", "AUTOSNIPER"],
    ragebot_weapon_types_2: ["General", "Pistol", "Heavy pistol", "Scout", "AWP", "Auto"],
    ragebot_internal_weapon_types: ["general", "pistol", "heavy_pistol", "ssg08", "awp", "auto"],
    hitboxes: ["Head", "Upper chest", "Chest", "Lower chest", "Stomach", "Pelvis"],
    autowall_modes: ["No autowall", "Legit autowall", "Autowall"],
    autowall_triggers: ["In autowall FOV", "Peeking"], //I bet most people never used the other autowall modes, no point keeping'em. The visible hitbox thing is forced on by default now.
};

const menu_items = 
{
    script_items:
    {
        setup_menu_items: function()
        {
            //I know I'm mixing object item access styles here :(
            menu_items.script_items.start_separator = menu.create_slider_int("Semirage Assist", 0, 0);
            menu_items.script_items.master_switch = menu.create_checkbox("Enable semirage assist");
            menu_items.script_items.autowall_keybind = menu.create_keybind("Autowall key");
            menu_items.script_items.currently_configured_items = menu.create_dropdown("Configured item tab", ["Weapons", "Anti-hit", "Misc"]);
            menu_items.script_items.currently_selected_configured_weapon = menu.create_dropdown("Configured weapon group", setup_helpers.weapon_types);

            for(var i = 0; i <= 7; i++) //Put all the weapon config items like menu_items.script_items.
            {
                const required_weapon_string = setup_helpers.weapon_types[i];
                const required_weapon_cfg_string = setup_helpers.weapon_types_cfg[i];

                menu_items.script_items[required_weapon_cfg_string + "_current_config_setup"] = menu.create_dropdown("Current " + (i == 5 || i == 6 ? required_weapon_string : required_weapon_string.toLowerCase()) + " configuration", ["Rage", "Legit"]);
                menu_items.script_items[required_weapon_cfg_string + "_dynamic_fov_min"] = menu.create_slider_int(required_weapon_string + " dynamic FOV minimum", 0, 180);
                menu_items.script_items[required_weapon_cfg_string + "_dynamic_fov_max"] = menu.create_slider_int(required_weapon_string + " dynamic FOV maximum", 0, 180);

                menu_items.script_items[required_weapon_cfg_string + "_autowall_mode"] = menu.create_dropdown(required_weapon_string + " default autowall mode", setup_helpers.autowall_modes);
                menu_items.script_items[required_weapon_cfg_string + "_autowall_triggers"] = menu.create_multi_dropdown(required_weapon_string + " additional autowall triggers", setup_helpers.autowall_triggers);
                menu_items.script_items[required_weapon_cfg_string + "_autowall_fov"] = menu.create_slider_float(required_weapon_string + " autowall FOV", 0.1, 180);

                menu_items.script_items[required_weapon_cfg_string + "_legitbot_hitboxes"] = menu.create_multi_dropdown(required_weapon_string + " target hitboxes", setup_helpers.hitboxes);
                menu_items.script_items[required_weapon_cfg_string + "_legitbot_static_fov"] = menu.create_slider_float(required_weapon_string + " FOV", 0.1, 180);
                menu_items.script_items[required_weapon_cfg_string + "_use_dynamic_legitbot_fov"] = menu.create_checkbox("Use " + (i == 5 || i == 6 ? required_weapon_string : required_weapon_string.toLowerCase()) + " dynamic FOV");

                menu_items.script_items[required_weapon_cfg_string + "_legitbot_dynamic_fov_min"] = menu.create_slider_float(required_weapon_string + " FOV minimum", 0.1, 180);
                menu_items.script_items[required_weapon_cfg_string + "_legitbot_dynamic_fov_max"] = menu.create_slider_float(required_weapon_string + " FOV maximum", 0.1, 180);

                menu_items.script_items[required_weapon_cfg_string + "_use_silent_fov"] = menu.create_checkbox("Use silent FOV for " + (i == 5 || i == 6 ? required_weapon_string : required_weapon_string.toLowerCase().concat("s")));
                menu_items.script_items[required_weapon_cfg_string + "_silent_fov"] = menu.create_slider_float(required_weapon_string + " silent FOV", 0.1, 10);

                menu_items.script_items[required_weapon_cfg_string + "_smoothing"] = menu.create_slider_float(required_weapon_string + " smoothing", 1, 10);

                menu_items.script_items[required_weapon_cfg_string + "_shot_delay"] = menu.create_slider_int(required_weapon_string + " shot delay (ms)", 0, 1000);
                menu_items.script_items[required_weapon_cfg_string + "_kill_delay"] = menu.create_slider_int(required_weapon_string + " kill delay (ms)", 0, 1000);

                menu_items.script_items[required_weapon_cfg_string + "_rcs_pitch"] = menu.create_slider_float(required_weapon_string + " RCS (pitch)", 0, 2);
                menu_items.script_items[required_weapon_cfg_string + "_rcs_yaw"] = menu.create_slider_float(required_weapon_string + " RCS (yaw)", 0, 2);

                menu_items.script_items[required_weapon_cfg_string + "_legitbot_mindmg"] = menu.create_slider_int(required_weapon_string + " minimum damage", 1, 100);
            }

            menu_items.script_items.legitaa_master_switch = menu.create_checkbox("Enable legit AA");
            menu_items.script_items.legitaa_safety_checks = menu.create_checkbox("Legit AA safety checks");

            menu_items.script_items.legitaa_autodirection = menu.create_checkbox("Legit AA autodirection");
            menu_items.script_items.legitaa_autodirection_peek_mode = menu.create_dropdown("Peeking mode", ["Fake out", "Real out"]);

            menu_items.script_items.legitaa_current_configured_stance = menu.create_dropdown("Configured stance", ["Standing", "Walking", "Moving"]);
    
            menu_items.script_items.legitaa_standing_mode = menu.create_dropdown("Standing mode", ["Static", "Jitter"]);
            menu_items.script_items.legitaa_lby_mode = menu.create_dropdown("LBY mode", ["Safe", "Extend"]);
            menu_items.script_items.legitaa_lby_extension_amount = menu.create_slider_float("Extension amount", 0.01, 1);
            menu_items.script_items.legitaa_fake_delta_standing = menu.create_slider_float("Standing fake strength", 0.0, 1.0);
    
            menu_items.script_items.legitaa_walking_mode = menu.create_dropdown("Walking mode", ["Static", "Jitter"]);
            menu_items.script_items.legitaa_fake_delta_walking = menu.create_slider_float("Walking fake strength", 0.0, 0.9);
    
            menu_items.script_items.legitaa_moving_mode = menu.create_dropdown("Moving mode", ["Static", "Jitter"]);
            menu_items.script_items.legitaa_fake_delta_moving = menu.create_slider_float("Moving fake strength", 0.0, 0.5);
    
            menu_items.script_items.visible_only_fakelag = menu.create_checkbox("Enable visible fakelag");
            menu_items.script_items.visible_fakelag_strength = menu.create_slider_int("Lag amount", 0, 8);

            menu_items.script_items.indicators = menu.create_multi_dropdown("Display indicators", ["Aimbot status", "Autowall", "AA", "Lag", "MM"]);
            
            menu_items.script_items.rbot_shotlogs = menu.create_checkbox("Shot logs");
            menu_items.script_items.killsays = menu.create_checkbox("Killsays");
        }
    }, 

    references:
    {
        setup_references: function()
        {
            this.ragebot_enabled_hotkey_reference = menu.create_menu_reference(["Rage", "General", "Enabled"], menu.menu_types.TYPE_KEYBIND);
            this.ragebot_resolver_hotkey_reference = menu.create_menu_reference(["Rage", "General", "Resolver override"], menu.menu_types.TYPE_KEYBIND);
            this.ragebot_bodyaim_hotkey_reference = menu.create_menu_reference(["Rage", "General", "Force body aim"], menu.menu_types.TYPE_KEYBIND);
            this.ragebot_safepoint_hotkey_reference = menu.create_menu_reference(["Rage", "General", "Force safe point"], menu.menu_types.TYPE_KEYBIND);

            this.restrictions_reference = menu.create_menu_reference(["Misc", "PERFORMANCE & INFORMATION", "Information", "Restrictions"], menu.menu_types.TYPE_VALUE);

            this.antiaim_enabled_reference = menu.create_menu_reference(["Anti-Aim", "Rage Anti-Aim", "Enabled"], menu.menu_types.TYPE_VALUE);
            this.antiaim_yaw_offset_reference = menu.create_menu_reference(["Anti-Aim", "Rage Anti-Aim", "Yaw offset"], menu.menu_types.TYPE_VALUE);
            this.antiaim_inverter_reference = menu.create_menu_reference(["Anti-Aim", "Fake angles", "Inverter"], menu.menu_types.TYPE_KEYBIND);
            this.antiaim_pitch_reference = menu.create_menu_reference(["Anti-Aim", "Extra", "Pitch"], menu.menu_types.TYPE_VALUE);

            for(var i = 0; i <= 5; i++)
            {
                const current_ragebot_weapongroup_string = setup_helpers.ragebot_weapon_types[i];
                const current_ragebot_weapongroup_string_internal = setup_helpers.ragebot_internal_weapon_types[i];

                this["ragebot_" + current_ragebot_weapongroup_string_internal + "_autowall_reference"] = menu.create_menu_reference(["Rage", current_ragebot_weapongroup_string, (i == 0 ? "Targeting" : setup_helpers.ragebot_weapon_types_2[i] + " config"), "Disable autowall"], menu.menu_types.TYPE_VALUE);
                this["ragebot_" + current_ragebot_weapongroup_string_internal + "_fov_reference"] = menu.create_menu_reference(["Rage", current_ragebot_weapongroup_string, "Targeting", "FOV"], menu.menu_types.TYPE_VALUE);
                this["ragebot_" + current_ragebot_weapongroup_string_internal + "_prefer_baim_reference"] = menu.create_menu_reference(["Rage", current_ragebot_weapongroup_string, "Accuracy", "Prefer body aim"], menu.menu_types.TYPE_VALUE);
                this["ragebot_" + current_ragebot_weapongroup_string_internal + "_prefer_safepoint_reference"] = menu.create_menu_reference(["Rage", current_ragebot_weapongroup_string, "Accuracy", "Prefer safe point"], menu.menu_types.TYPE_VALUE);
            }
        }
    },

    handle_menu_item_visibility: function()
    {
        if(UI.IsMenuOpen())
        {
            const is_script_active = menu.get_item_value(menu_items.script_items.master_switch);
            const currently_configured_tab = menu.get_item_value(menu_items.script_items.currently_configured_items);
            const selected_weapon_group = menu.get_item_value(menu_items.script_items.currently_selected_configured_weapon);
            menu.set_item_visibility(menu_items.script_items.currently_configured_items, is_script_active);
            menu.set_item_visibility(menu_items.script_items.autowall_keybind, is_script_active && currently_configured_tab == 0);
            menu.set_item_visibility(menu_items.script_items.currently_selected_configured_weapon, is_script_active && currently_configured_tab == 0);
            
            for(var weapon_group = 0; weapon_group <= 7; weapon_group++)
            {
                const current_weapon_config_string = setup_helpers.weapon_types_cfg[weapon_group];
                const currently_opened_weapon_mode = menu.get_item_value(menu_items.script_items[current_weapon_config_string + "_current_config_setup"]);

                const autowall_mode = menu.get_item_value(menu_items.script_items[current_weapon_config_string + "_autowall_mode"]);

                const using_legitbot_dynamic_fov = menu.get_item_value(menu_items.script_items[current_weapon_config_string + "_use_dynamic_legitbot_fov"]);
                const using_legitbot_silent_fov = menu.get_item_value(menu_items.script_items[current_weapon_config_string + "_use_silent_fov"]);

                menu.set_item_visibility(menu_items.script_items[current_weapon_config_string + "_current_config_setup"], is_script_active && currently_configured_tab == 0 && selected_weapon_group == weapon_group);
                menu.set_item_visibility(menu_items.script_items[current_weapon_config_string + "_dynamic_fov_min"], is_script_active && currently_configured_tab == 0 && selected_weapon_group == weapon_group && currently_opened_weapon_mode == 0);
                menu.set_item_visibility(menu_items.script_items[current_weapon_config_string + "_dynamic_fov_max"], is_script_active && currently_configured_tab == 0 && selected_weapon_group == weapon_group && currently_opened_weapon_mode == 0);
                
                menu.set_item_visibility(menu_items.script_items[current_weapon_config_string + "_autowall_mode"], is_script_active && currently_configured_tab == 0 && selected_weapon_group == weapon_group && currently_opened_weapon_mode == 0);
                menu.set_item_visibility(menu_items.script_items[current_weapon_config_string + "_autowall_triggers"], is_script_active && currently_configured_tab == 0 && selected_weapon_group == weapon_group && currently_opened_weapon_mode == 0 && autowall_mode == 1);
                menu.set_item_visibility(menu_items.script_items[current_weapon_config_string + "_autowall_fov"], is_script_active && currently_configured_tab == 0 && selected_weapon_group == weapon_group && currently_opened_weapon_mode == 0 && autowall_mode == 1);

                menu.set_item_visibility(menu_items.script_items[current_weapon_config_string + "_legitbot_hitboxes"], is_script_active && currently_configured_tab == 0 && selected_weapon_group == weapon_group && currently_opened_weapon_mode == 1);
                
                menu.set_item_visibility(menu_items.script_items[current_weapon_config_string + "_use_dynamic_legitbot_fov"], is_script_active && currently_configured_tab == 0 && selected_weapon_group == weapon_group && currently_opened_weapon_mode == 1);
                menu.set_item_visibility(menu_items.script_items[current_weapon_config_string + "_legitbot_static_fov"], is_script_active && currently_configured_tab == 0 && selected_weapon_group == weapon_group && currently_opened_weapon_mode == 1 && !using_legitbot_dynamic_fov);
                menu.set_item_visibility(menu_items.script_items[current_weapon_config_string + "_legitbot_dynamic_fov_min"], is_script_active && currently_configured_tab == 0 && selected_weapon_group == weapon_group && currently_opened_weapon_mode == 1 && using_legitbot_dynamic_fov);
                menu.set_item_visibility(menu_items.script_items[current_weapon_config_string + "_legitbot_dynamic_fov_max"], is_script_active && currently_configured_tab == 0 && selected_weapon_group == weapon_group && currently_opened_weapon_mode == 1 && using_legitbot_dynamic_fov);

                menu.set_item_visibility(menu_items.script_items[current_weapon_config_string + "_use_silent_fov"], is_script_active && currently_configured_tab == 0 && selected_weapon_group == weapon_group && currently_opened_weapon_mode == 1);
                menu.set_item_visibility(menu_items.script_items[current_weapon_config_string + "_silent_fov"], is_script_active && currently_configured_tab == 0 && selected_weapon_group == weapon_group && currently_opened_weapon_mode == 1 && using_legitbot_silent_fov);
                menu.set_item_visibility(menu_items.script_items[current_weapon_config_string + "_smoothing"], is_script_active && currently_configured_tab == 0 && selected_weapon_group == weapon_group && currently_opened_weapon_mode == 1);
                
                menu.set_item_visibility(menu_items.script_items[current_weapon_config_string + "_shot_delay"], is_script_active && currently_configured_tab == 0 && selected_weapon_group == weapon_group && currently_opened_weapon_mode == 1);
                menu.set_item_visibility(menu_items.script_items[current_weapon_config_string + "_kill_delay"], is_script_active && currently_configured_tab == 0 && selected_weapon_group == weapon_group && currently_opened_weapon_mode == 1);
                
                menu.set_item_visibility(menu_items.script_items[current_weapon_config_string + "_rcs_pitch"], is_script_active && currently_configured_tab == 0 && selected_weapon_group == weapon_group && currently_opened_weapon_mode == 1);
                menu.set_item_visibility(menu_items.script_items[current_weapon_config_string + "_rcs_yaw"], is_script_active && currently_configured_tab == 0 && selected_weapon_group == weapon_group && currently_opened_weapon_mode == 1);

                menu.set_item_visibility(menu_items.script_items[current_weapon_config_string + "_legitbot_mindmg"], is_script_active &&currently_configured_tab == 0 && selected_weapon_group == weapon_group && currently_opened_weapon_mode == 1);
            }
        }

        const legitaa_enabled = menu.get_item_value(menu_items.script_items.legitaa_master_switch);

        const legitaa_autodirection_enabled = menu.get_item_value(menu_items.script_items.legitaa_autodirection);
        
        const current_legitaa_selected_stance = menu.get_item_value(menu_items.script_items.legitaa_current_configured_stance);
        const legitaa_lby_mode = menu.get_item_value(menu_items.script_items.legitaa_lby_mode);

        const fakelag_enabled = menu.get_item_value(menu_items.script_items.visible_only_fakelag);

        menu.set_item_visibility(menu_items.script_items.legitaa_master_switch, is_script_active && currently_configured_tab == 1);

        menu.set_item_visibility(menu_items.script_items.legitaa_autodirection, is_script_active && currently_configured_tab == 1 && legitaa_enabled);
        menu.set_item_visibility(menu_items.script_items.legitaa_autodirection_peek_mode, is_script_active && currently_configured_tab == 1 && legitaa_enabled && legitaa_autodirection_enabled);

        menu.set_item_visibility(menu_items.script_items.legitaa_safety_checks, is_script_active && currently_configured_tab == 1 && legitaa_enabled);
        menu.set_item_visibility(menu_items.script_items.legitaa_current_configured_stance, is_script_active && currently_configured_tab == 1 && legitaa_enabled);

        menu.set_item_visibility(menu_items.script_items.legitaa_standing_mode, is_script_active && currently_configured_tab == 1 && legitaa_enabled && current_legitaa_selected_stance == 0);
        menu.set_item_visibility(menu_items.script_items.legitaa_lby_mode, is_script_active && currently_configured_tab == 1 && legitaa_enabled && current_legitaa_selected_stance == 0);
        menu.set_item_visibility(menu_items.script_items.legitaa_lby_extension_amount, is_script_active && currently_configured_tab == 1 && legitaa_enabled && current_legitaa_selected_stance == 0 && legitaa_lby_mode == 1);
        menu.set_item_visibility(menu_items.script_items.legitaa_fake_delta_standing, is_script_active && currently_configured_tab == 1 && legitaa_enabled && current_legitaa_selected_stance == 0);

        menu.set_item_visibility(menu_items.script_items.legitaa_walking_mode, is_script_active && currently_configured_tab == 1 && legitaa_enabled && current_legitaa_selected_stance == 1);
        menu.set_item_visibility(menu_items.script_items.legitaa_fake_delta_walking, is_script_active && currently_configured_tab == 1 && legitaa_enabled && current_legitaa_selected_stance == 1);

        menu.set_item_visibility(menu_items.script_items.legitaa_moving_mode, is_script_active && currently_configured_tab == 1 && legitaa_enabled && current_legitaa_selected_stance == 2);
        menu.set_item_visibility(menu_items.script_items.legitaa_fake_delta_moving, is_script_active && currently_configured_tab == 1 && legitaa_enabled && current_legitaa_selected_stance == 2);

        menu.set_item_visibility(menu_items.script_items.visible_only_fakelag, is_script_active && currently_configured_tab == 1);
        menu.set_item_visibility(menu_items.script_items.visible_fakelag_strength, is_script_active && currently_configured_tab == 1 && fakelag_enabled);

        menu.set_item_visibility(menu_items.script_items.indicators, is_script_active && currently_configured_tab == 2);

        menu.set_item_visibility(menu_items.script_items.rbot_shotlogs, is_script_active && currently_configured_tab == 2);
        menu.set_item_visibility(menu_items.script_items.killsays, is_script_active && currently_configured_tab == 2);
    }
};

var on_script_setup = true;

const config = 
{
    weapon_settings: [],
    reference_states: [],

    update_reference_states: function()
    {
        if(utilities.global_variables.current_weapon_group_ragebot != -1)
        {
            const current_ragebot_weapongroup_string = setup_helpers.ragebot_internal_weapon_types[utilities.global_variables.current_weapon_group_ragebot];
            this.reference_states[utilities.global_variables.current_weapon_group_ragebot] = 
            {
                prefer_baim_state: menu.get_item_value(menu_items.references["ragebot_" + current_ragebot_weapongroup_string + "_prefer_baim_reference"]),
                prefer_safepoint_state: menu.get_item_value(menu_items.references["ragebot_" + current_ragebot_weapongroup_string + "_prefer_safepoint_reference"])
            };
        }
    },

    update_weapon_settings: function()
    {
        if(menu.get_item_value(menu_items.script_items.currently_configured_items) == 0 || on_script_setup)
        {
            for(var current_selected_weapon = 0; current_selected_weapon <= 7; current_selected_weapon++)
            {
                const current_weapon_config_string = setup_helpers.weapon_types_cfg[current_selected_weapon]; 
                this.weapon_settings[current_selected_weapon] =
                {
                    ragebot_dynamic_fov_min: menu.get_item_value(menu_items.script_items[current_weapon_config_string + "_dynamic_fov_min"]),
                    ragebot_dynamic_fov_max: menu.get_item_value(menu_items.script_items[current_weapon_config_string + "_dynamic_fov_max"]),
                    
                    ragebot_autowall_mode: menu.get_item_value(menu_items.script_items[current_weapon_config_string + "_autowall_mode"]),
                    ragebot_autowall_triggers: menu.get_item_value(menu_items.script_items[current_weapon_config_string + "_autowall_triggers"]),
                    ragebot_autowall_fov: menu.get_item_value(menu_items.script_items[current_weapon_config_string + "_autowall_fov"]),

                    legitbot_allowed_hitboxes: menu.get_item_value(menu_items.script_items[current_weapon_config_string + "_legitbot_hitboxes"]),

                    legitbot_static_fov: menu.get_item_value(menu_items.script_items[current_weapon_config_string + "_legitbot_static_fov"]),
                    legitbot_should_use_dynamic_fov: menu.get_item_value(menu_items.script_items[current_weapon_config_string + "_use_dynamic_legitbot_fov"]),
                    legitbot_dynamic_fov_min: menu.get_item_value(menu_items.script_items[current_weapon_config_string + "_legitbot_dynamic_fov_min"]),
                    legitbot_dynamic_fov_max: menu.get_item_value(menu_items.script_items[current_weapon_config_string + "_legitbot_dynamic_fov_max"]),

                    legitbot_use_silent_fov: menu.get_item_value(menu_items.script_items[current_weapon_config_string + "_use_silent_fov"]),
                    legitbot_silent_fov: menu.get_item_value(menu_items.script_items[current_weapon_config_string + "_silent_fov"]),

                    legitbot_smoothing: menu.get_item_value(menu_items.script_items[current_weapon_config_string + "_smoothing"]),

                    legitbot_shot_delay: menu.get_item_value(menu_items.script_items[current_weapon_config_string + "_shot_delay"]),
                    legitbot_kill_delay: menu.get_item_value(menu_items.script_items[current_weapon_config_string + "_kill_delay"]),

                    legitbot_rcs_pitch: menu.get_item_value(menu_items.script_items[current_weapon_config_string + "_rcs_pitch"]),
                    legitbot_rcs_yaw: menu.get_item_value(menu_items.script_items[current_weapon_config_string + "_rcs_yaw"]),

                    legitbot_minimum_damage: menu.get_item_value(menu_items.script_items[current_weapon_config_string + "_legitbot_mindmg"])
                }
            }
        }
    },

    generic_settings:
    {},

    update_script_settings: function()
    {
        this.update_reference_states();

        //Generic enough hotkeys that they can be here
        this.generic_settings.ragebot_enabled_hotkey_reference = menu.get_item_value(menu_items.references.ragebot_enabled_hotkey_reference);
        this.generic_settings.ragebot_resolver_hotkey_reference = menu.get_item_value(menu_items.references.ragebot_resolver_hotkey_reference);
        this.generic_settings.ragebot_safepoint_hotkey_reference = menu.get_item_value(menu_items.references.ragebot_safepoint_hotkey_reference);
        this.generic_settings.ragebot_bodyaim_hotkey_reference = menu.get_item_value(menu_items.references.ragebot_bodyaim_hotkey_reference);
        this.generic_settings.autowall_key_down = menu.get_item_value(menu_items.script_items.autowall_keybind);

        if(UI.IsMenuOpen() || on_script_setup)
        {
            this.generic_settings.master_switch = menu.get_item_value(menu_items.script_items.master_switch);

            this.generic_settings.legitaa_master_switch = menu.get_item_value(menu_items.script_items.legitaa_master_switch);
            this.generic_settings.legitaa_safety_checks = menu.get_item_value(menu_items.script_items.legitaa_safety_checks);

            this.generic_settings.legitaa_autodirection = menu.get_item_value(menu_items.script_items.legitaa_autodirection);
            this.generic_settings.legitaa_autodirection_peek_mode = menu.get_item_value(menu_items.script_items.legitaa_autodirection_peek_mode);

            this.generic_settings.legitaa_standing_mode = menu.get_item_value(menu_items.script_items.legitaa_standing_mode);
            this.generic_settings.legitaa_lby_mode = menu.get_item_value(menu_items.script_items.legitaa_lby_mode);
            this.generic_settings.legitaa_lby_extension_amount = menu.get_item_value(menu_items.script_items.legitaa_lby_extension_amount);
            this.generic_settings.legitaa_fake_delta_standing = menu.get_item_value(menu_items.script_items.legitaa_fake_delta_standing);

            this.generic_settings.legitaa_walking_mode = menu.get_item_value(menu_items.script_items.legitaa_walking_mode);
            this.generic_settings.legitaa_fake_delta_walking = menu.get_item_value(menu_items.script_items.legitaa_fake_delta_walking);

            this.generic_settings.legitaa_moving_mode = menu.get_item_value(menu_items.script_items.legitaa_moving_mode);
            this.generic_settings.legitaa_fake_delta_moving = menu.get_item_value(menu_items.script_items.legitaa_fake_delta_moving);

            this.generic_settings.visible_only_fakelag = menu.get_item_value(menu_items.script_items.visible_only_fakelag);
            this.generic_settings.visible_fakelag_strength = menu.get_item_value(menu_items.script_items.visible_fakelag_strength);

            this.generic_settings.indicators = menu.get_item_value(menu_items.script_items.indicators);

            this.generic_settings.rbot_shotlogs = menu.get_item_value(menu_items.script_items.rbot_shotlogs);
            this.generic_settings.killsays = menu.get_item_value(menu_items.script_items.killsays);

            this.update_weapon_settings();
        }

        if(on_script_setup)
        {
            on_script_setup = false;
        }
    }
};

const math = 
{
    vector: 
    {
        add: function(a, b)
        {
            return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
        },

        sub: function(a, b)
        {
            return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
        },

        mul_fl: function(a, fl)
        {
            return [a[0] * fl, a[1] * fl, a[2] * fl];
        },

        div_fl: function(a, fl)
        {
            return [a[0] / fl, a[1] / fl, a[2] / fl];
        },

        length: function(a)
        {
            return Math.sqrt(a[0] ** 2 + a[1] ** 2 + a[2] ** 2);
        },

        angle_vector: function(ang)
        {
            const sp = Math.sin(math.angle.deg2rad(ang[0])), cp = Math.cos(math.angle.deg2rad(ang[0]));
            const sy = Math.sin(math.angle.deg2rad(ang[1])), cy = Math.cos(math.angle.deg2rad(ang[1]));
            return [cp * cy, cp * sy, -sp];
        }
    },

    angle: 
    {
        rad2deg: function(rad)
        {
            return rad * (180 / Math.PI);
        },

        deg2rad: function(deg)
        {
            return deg * (Math.PI / 180);
        },

        difference: function(angle1, angle2)
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
        },

        normalize: function(angle)
        {
            const ang = angle;
            ang[0] = math.clamp(ang[0], -89, 89);
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
            return ang;
        },

        calculate_angle(from, to, base_angle)
        {
            const delta = math.vector.sub(from, to);
            const ret_angle = [];
            ret_angle[0] = this.rad2deg(Math.atan(delta[2] / Math.hypot(delta[0], delta[1]))) - base_angle[0];
            ret_angle[1] = this.rad2deg(Math.atan(delta[1] / delta[0])) - base_angle[1];
            ret_angle[2] = 0;
            if(delta[0] >= 0.0)
                ret_angle[1] += 180.0;

            return this.normalize(ret_angle);
        }
    },

    clamp: function(val, min, max)
    {
        return Math.max(min,Math.min(max,val));
    },

    random_float: function(min, max)
    {
        return Math.random() * (max - min) + min;
    }
};

const utilities = 
{
    global_variables: 
    {
        local_player: -1,
        current_weapon_group_script: -1,
        current_weapon_group_ragebot: -1,
        cheat_username: Cheat.GetUsername(), //Not like the user's name will change while the script runs lol

        choked_commands: -1,
        fake_yaw: -1.0,
        real_yaw: -1.0,

        update: function()
        {
            this.local_player = Entity.GetLocalPlayer();
            this.choked_commands = Globals.ChokedCommands();
            this.fake_yaw = Local.GetFakeYaw();
            this.real_yaw = Local.GetRealYaw();

            utilities.setup_current_script_weapon_groups(); //Could do it on the item_equip event, but can't honestly be arsed setting that up
        }
    },

    ragebot_weapon_groups:
    {
        GROUP_DEFAULT: 0,
        GROUP_PISTOL: 1,
        GROUP_HEAVY_PISTOL: 2,
        GROUP_SCOUT: 3,
        GROUP_AWP: 4,
        GROUP_AUTOSNIPER: 5
    },

    script_weapon_groups:
    {
        GROUP_INVALID: -1,
        GROUP_PISTOL: 0,
        GROUP_HEAVY_PISTOL: 1,
        GROUP_RIFLE: 2,
        GROUP_SMG: 3,
        GROUP_HEAVY: 4,
        GROUP_SCOUT: 5,
        GROUP_AWP: 6,
        GROUP_AUTOSNIPER: 7
    },

    script_hitgroups:
    {
        HITGROUP_HEAD: 1 << 0,
        HITGROUP_UPPER_CHEST: 1 << 1,
        HITGROUP_CHEST: 1 << 2,
        HITGROUP_LOWER_CHEST: 1 << 3,
        HITGROUP_STOMACH: 1 << 4,
        HITGROUP_PELVIS: 1 << 5
    },

    hitboxes: 
    [
        "head",
        "neck",
        "pelvis",
        "body",
        "thorax",
        "chest",
        "upper chest",
        "left thigh",
        "right thigh",
        "left calf",
        "right calf",
        "left foot",
        "right foot",
        "left hand",
        "right hand",
        "left upper arm",
        "left forearm",
        "right upper arm",
        "right forearm",
        "generic"
    ],

    matchmaking_ranks: 
    [
    "None", "S1", "S2", "S3", "S4", "SE", "SEM",
    "GN1", "GN2", "GN3", "GNM", 
    "MG1", "MG2", "MGE", "DMG",
    "LE", "LEM", "Supreme", "Global"
    ],

    player_weapons:
    [
        [32, 61, 4, 36, 3, 30, 2, 63],
        [1, 64],
        [10, 13, 7, 16, 60, 39, 8],
        [34, 17, 24, 33, 23, 26, 19],
        [35, 25, 27, 29, 14, 28],
        [40], 
        [9], 
        [38, 11]
    ],

    setup_current_script_weapon_groups: function()
    {
        if(Entity.IsValid(this.global_variables.local_player) && Entity.IsAlive(this.global_variables.local_player))
        {
            const convert_weapon_group_to_ragebot_weapon_group = function(weapon_group)
            {
                switch(weapon_group)
                {
                    case utilities.script_weapon_groups.GROUP_PISTOL:
                        return utilities.ragebot_weapon_groups.GROUP_PISTOL;

                    case utilities.script_weapon_groups.GROUP_HEAVY_PISTOL:
                        return utilities.ragebot_weapon_groups.GROUP_HEAVY_PISTOL;
                    
                    case utilities.script_weapon_groups.GROUP_SCOUT:
                        return utilities.ragebot_weapon_groups.GROUP_SCOUT;
                    
                    case utilities.script_weapon_groups.GROUP_AWP:
                        return utilities.ragebot_weapon_groups.GROUP_AWP;
                    
                    case utilities.script_weapon_groups.GROUP_AUTOSNIPER:
                        return utilities.ragebot_weapon_groups.GROUP_AUTOSNIPER;

                    default:
                        return utilities.ragebot_weapon_groups.GROUP_DEFAULT;
                }
            }

            const local_player_weapon = Entity.GetProp(this.global_variables.local_player, "CBasePlayer", "m_hActiveWeapon");
            const local_player_item_definition_index = Entity.GetProp(local_player_weapon, "CBaseAttributableItem", "m_iItemDefinitionIndex") & 0xFFFF;

            var weapon_group = -1;

            for(var i = 0; i <= 7; i++) //Could do it better :) later though, cant't be arsed atm
            {
                if(utilities.player_weapons[i].some(function(index) { return index == local_player_item_definition_index; } ))
                {
                    weapon_group = i;
                    break;
                }
            }

            this.global_variables.current_weapon_group_script = weapon_group; this.global_variables.current_weapon_group_ragebot = convert_weapon_group_to_ragebot_weapon_group(weapon_group);
        }
    },

    game: 
    {
        local_peek_check: function(local_eye_position, entity_index)
        {
            const local_velocity_length = math.vector.length(Entity.GetProp(utilities.global_variables.local_player, "CBasePlayer", "m_vecVelocity[0]"));
            if(local_velocity_length < 50)
            {
                return false;
            }
            const extrapolated_local_eyepos = math.vector.add(local_eye_position, math.vector.mul_fl(Entity.GetProp(utilities.global_variables.local_player, "CBasePlayer", "m_vecVelocity[0]"), 16 * Globals.TickInterval()));
            const entity_stomach_position = Entity.GetHitboxPosition(entity_index, 2);
            if(typeof(entity_stomach_position) != "undefined")
            {
                const trace = Trace.Line(utilities.global_variables.local_player, extrapolated_local_eyepos, entity_stomach_position);
                return trace[0] == entity_index || trace[1] == 1;
            }
            return false;
        },

        get_script_hitgroup_from_hitbox: function(hitbox)
        {
            switch(hitbox)
            {
                case 0:
                case 1:
                    return utilities.script_hitgroups.HITGROUP_HEAD;
                case 6:
                    return utilities.script_hitgroups.HITGROUP_UPPER_CHEST;
                case 5:
                    return utilities.script_hitgroups.HITGROUP_CHEST;
                case 3:
                    return utilities.script_hitgroups.HITGROUP_LOWER_CHEST;
                case 4:
                    return utilities.script_hitgroups.HITGROUP_STOMACH;
                case 2:
                    return utilities.script_hitgroups.HITGROUP_PELVIS;
                default:
                    return 1 << 32; //a flag that 100% wont be hit
            }
        },

        is_player_visible: function(local_eye_position, entity_index, require_full_scan/*if we need to scan every hitbox //NOTE: this variable is used nowhere in the code, probably can be removed (we dont even really need to force full scans anymore)*/, vis_threshold)
        {
            var visible_hitboxes_amt = 0;
            if(!require_full_scan)
            {
                const entity_head_position = Entity.GetHitboxPosition(entity_index, 0);
                if(typeof(entity_head_position) != "undefined")
                {
                    const trace_head = Trace.Line(utilities.global_variables.local_player, local_eye_position, entity_head_position);
                    const trace_origin = Trace.Line(utilities.global_variables.local_player, local_eye_position, Entity.GetRenderOrigin(entity_index));

                    if((trace_head[0] == entity_index || trace_head[1] == 1) || (trace_origin[0] == entity_index || trace_origin[1] == 1))
                    {
                        return true;
                    }
                }
            }
            

            for(var i = 0; i <= 18; i++)
            {
                const hitbox_position = Entity.GetHitboxPosition(entity_index, i);
                if(typeof(hitbox_position) != "undefined")
                {
                    const trace = Trace.Line(utilities.global_variables.local_player, local_eye_position, hitbox_position);
                    if(trace[0] == entity_index || trace[1] == 1)
                    {
                        visible_hitboxes_amt++;
                        if(visible_hitboxes_amt >= vis_threshold)
                        {
                            return true;
                        }
                    }
                }
            }
            return false;
        },

        get_dynamic_fov: function(enemy_array, min_fov, max_fov)
        {
            const local_origin = Entity.GetRenderOrigin(utilities.global_variables.local_player);
            const enemy_array_length = enemy_array.length; //considering this is only getting called by createmove functions which have the enemy array length passed into them by default, could pass it into this function too
            var closest_distance = Infinity;
            for(var i = 0; i < enemy_array_length; i++)
            {
                const entity_index = enemy_array[i];
                const distance = math.vector.length(math.vector.sub(local_origin, Entity.GetRenderOrigin(entity_index)));
                if(closest_distance > distance)
                {
                    closest_distance = distance;
                }
            }
            const new_fov = closest_distance != Infinity ? math.clamp((5500 / closest_distance) * 2, min_fov, max_fov) : min_fov; //Could probably offer a choice between "simple" and "advanced" dynamic FOV handler modes, where advanced lets you change the base distance and the modifier thing
            return new_fov;
        }
    },

    log: function(text)
    {
        Cheat.PrintColor([255, 0, 0, 255], "[semirage assist] ");
        Cheat.Print(text + "\n");
    },

    log_chat: function(text)
    {
        this.log(text);
        Cheat.PrintChat(" \x02[semirage assist] \x01" + text);
    }
};

const features = 
{
    ragebot_handler:
    {
        helpers: 
        {
            set_ragebot_dynamic_fov: function(createmove_data)
            { //hf reading this :)
                menu.set_item_value(menu_items.references["ragebot_" + setup_helpers.ragebot_internal_weapon_types[utilities.global_variables.current_weapon_group_ragebot] + "_fov_reference"], 
                utilities.game.get_dynamic_fov(createmove_data.enemies, config.weapon_settings[utilities.global_variables.current_weapon_group_script].ragebot_dynamic_fov_min, config.weapon_settings[utilities.global_variables.current_weapon_group_script].ragebot_dynamic_fov_max));
            }
        },
        
        handle: function(createmove_data)
        {
            if(config.generic_settings.ragebot_enabled_hotkey_reference && utilities.global_variables.current_weapon_group_script != -1)
            {
                this.helpers.set_ragebot_dynamic_fov(createmove_data);

                const autowall_state = config.generic_settings.autowall_key_down ? 2 : config.weapon_settings[utilities.global_variables.current_weapon_group_script].ragebot_autowall_mode;
                menu.set_item_value(menu_items.references["ragebot_" + setup_helpers.ragebot_internal_weapon_types[utilities.global_variables.current_weapon_group_ragebot] + "_autowall_reference"], autowall_state == 0);
                if(autowall_state != 1)
                {
                    return; //Ugly code, need to refactor later
                }

                const autowall_triggers = config.weapon_settings[utilities.global_variables.current_weapon_group_script].ragebot_autowall_triggers;

                for(var i = 0; i < createmove_data.enemy_array_length; i++)
                {
                    const entity_index = createmove_data.enemies[i];
                    if(autowall_triggers & (1 << 0))
                    {
                        const entity_head_position = Entity.GetHitboxPosition(entity_index, 0);
                        if(typeof(entity_head_position) != "undefined")
                        {
                            if(config.weapon_settings[utilities.global_variables.current_weapon_group_script].ragebot_autowall_fov > Math.hypot(math.angle.calculate_angle(createmove_data.local_eye_position, entity_head_position, createmove_data.local_viewangles)))
                            {
                                continue;
                            }
                        }
                    }
                    if((autowall_triggers & (1 << 1) && utilities.game.local_peek_check(createmove_data.local_eye_position, entity_index)) || utilities.game.is_player_visible(createmove_data.local_eye_position, entity_index, false, 1))
                    {
                        continue;
                    }
                    Ragebot.IgnoreTarget(entity_index);
                }
            }
        }
    },

    legitbot_handler:
    {
        last_fov: -1,
        last_kill_time: -1,

        last_in_attack_time: -1,
        last_punch_angle: [0, 0, 0],

        in_aim: false,
        aimbot_active: false,
        
        handle: function(createmove_data)
        {
            const IN_ATTACK = 1 << 0;
            const autowall_key_down = config.generic_settings.autowall_key_down;
            if(utilities.global_variables.current_weapon_group_script != -1 &&
            !config.generic_settings.ragebot_enabled_hotkey_reference && 
            createmove_data.usercmd_buttons & IN_ATTACK && 
            (Entity.GetProp(utilities.global_variables.local_player, "CCSPlayer", "m_flFlashDuration") < 2.0 || autowall_key_down) && 
            Globals.Realtime() > this.last_kill_time + config.weapon_settings[utilities.global_variables.current_weapon_group_script].legitbot_kill_delay / 1000 &&
            createmove_data.enemy_array_length > 0)
            {
                this.aimbot_active = true;
                const vector_forward = math.vector.add(createmove_data.local_eye_position, math.vector.mul_fl(math.vector.angle_vector(createmove_data.local_viewangles), 8192));
                const trace_forward = Trace.Line(utilities.global_variables.local_player, createmove_data.local_eye_position, vector_forward); //i hate doing traces, it's HORRIBLE for framerate
                if(!(Entity.IsValid(trace_forward[0]) && Entity.IsAlive(trace_forward[0]) && Entity.IsEnemy(trace_forward[0])))
                {
                    if(!this.in_aim)
                    {
                        this.last_in_attack_time = Globals.Realtime();
                        this.in_aim = true;
                    }

                    this.last_in_attack_time + config.weapon_settings[utilities.global_variables.current_weapon_group_script].legitbot_shot_delay / 1000 > Globals.Realtime() ? UserCMD.SetButtons(createmove_data.usercmd_buttons &= ~IN_ATTACK) : this.in_aim = false;

                    const maximum_fov = config.weapon_settings[utilities.global_variables.current_weapon_group_script].legitbot_should_use_dynamic_fov ? utilities.game.get_dynamic_fov(createmove_data.enemies, 
                        config.weapon_settings[utilities.global_variables.current_weapon_group_script].legitbot_dynamic_fov_min, 
                        config.weapon_settings[utilities.global_variables.current_weapon_group_script].legitbot_dynamic_fov_max) : config.weapon_settings[utilities.global_variables.current_weapon_group_script].legitbot_static_fov;

                    this.last_fov = maximum_fov;

                    const valid_enemies = [];
                    for(var i = 0; i < createmove_data.enemy_array_length; i++)
                    {
                        const _entity_index = createmove_data.enemies[i];
                        const entity_head_position = Entity.GetHitboxPosition(_entity_index, 0);
                        if(typeof(entity_head_position) != "undefined")
                        {
                            const angle_to_head = math.angle.calculate_angle(createmove_data.local_eye_position, entity_head_position, createmove_data.local_viewangles);
                            const fov_to_head = Math.hypot(angle_to_head[0], angle_to_head[1]);
                            if(maximum_fov > fov_to_head && (utilities.game.is_player_visible(createmove_data.local_eye_position, _entity_index, false, 5) || autowall_key_down))
                            {
                                valid_enemies.push({entity_index: _entity_index, fov: fov_to_head});
                            }
                        }
                    }

                    if(valid_enemies.length == 0)
                    {
                        return;
                    }

                    const legitbot_hitboxes = config.weapon_settings[utilities.global_variables.current_weapon_group_script].legitbot_allowed_hitboxes;
                    const minimum_damage = config.weapon_settings[utilities.global_variables.current_weapon_group_script].legitbot_minimum_damage;

                    valid_enemies.sort(function (enemy_a, enemy_b) { return enemy_a.fov - enemy_b.fov; });
                    
                    var best_fov = Infinity;
                    var best_angle = [];

                    for(var ent = 0; ent < valid_enemies.length; ent++)
                    {
                        const entity = valid_enemies[0];
                        const entity_health = Entity.GetProp(entity.entity_index, "CBasePlayer", "m_iHealth");
                        const scaled_minimum_damage = entity_health * (minimum_damage / 100);
                        var should_break = false; //ghetto way of escaping nested forloop
                        for(var i = 0; i <= 6; i++) //UGLY CODE ALERT
                        {
                            if(legitbot_hitboxes & utilities.game.get_script_hitgroup_from_hitbox(i))
                            {
                                const hitbox_position = Entity.GetHitboxPosition(entity.entity_index, i)
                                if(typeof(hitbox_position) != "undefined" && (!Trace.Smoke(createmove_data.local_eye_position, hitbox_position) || autowall_key_down))
                                {
                                    const angle_to_hitbox = math.angle.calculate_angle(createmove_data.local_eye_position, hitbox_position, createmove_data.local_viewangles);
                                    const fov = Math.hypot(angle_to_hitbox[0], angle_to_hitbox[1]); //We already store the FOV to their heads, but that's a very small optimization and basically doesn't matter l0l
                                    if(best_fov > fov)
                                    {
                                        const trace = Trace.Bullet(utilities.global_variables.local_player, entity.entity_index, createmove_data.local_eye_position, hitbox_position);
                                        if(trace[0] == entity.entity_index && trace[1] > scaled_minimum_damage && (trace[2] || autowall_key_down))
                                        {
                                            best_fov = fov;
                                            best_angle = angle_to_hitbox;
                                            if(trace[1] > entity_health || fov < 1)
                                            {
                                                should_break = true;
                                                break;
                                            }
                                        }
                                    }
                                } 
                            }
                        }

                        if(should_break)
                        {
                            break;
                        }
                    }
                    

                    const recoil = Entity.GetProp(utilities.global_variables.local_player, "CBasePlayer", "m_aimPunchAngle");

                    if(best_fov != Infinity)
                    {
                        const using_silent_fov = config.weapon_settings[utilities.global_variables.current_weapon_group_script].legitbot_use_silent_fov;
                        const silent_fov = config.weapon_settings[utilities.global_variables.current_weapon_group_script].legitbot_silent_fov;
                        const smooth_amount = using_silent_fov && best_fov <= silent_fov ? 1 : config.weapon_settings[utilities.global_variables.current_weapon_group_script].legitbot_smoothing;
                        var final_angle = math.vector.add(createmove_data.local_viewangles, math.vector.div_fl(best_angle, smooth_amount));
                        
                        if(recoil[0] != 0 || recoil[1] != 0)
                        {
                            final_angle[0] -= (recoil[0] - this.last_punch_angle[0]) * config.weapon_settings[utilities.global_variables.current_weapon_group_script].legitbot_rcs_pitch;
                            final_angle[1] -= (recoil[1] - this.last_punch_angle[1]) * config.weapon_settings[utilities.global_variables.current_weapon_group_script].legitbot_rcs_yaw;
                        }

                        final_angle = math.angle.normalize(final_angle);
                        UserCMD.SetViewAngles(final_angle, using_silent_fov == 1 && best_fov <= silent_fov /*yikes*/);
                    }
                    this.last_punch_angle = recoil;
                }
            }
            else
            {
                this.in_aim = false;
                this.aimbot_active = false; //why does everyone want the tranny indicators that badly?
            }
        }
    },

    antiaim_handler:
    {
        jitter_flip: -1, //big premium real yaw jitter
        desync_side: 0,
        //fuck yo autodir lol

        helpers:
        {
            get_autodirection_side: function(createmove_data)
            {
                const left_trace = Trace.Line(utilities.global_variables.local_player, createmove_data.local_eye_position, math.vector.add(createmove_data.local_eye_position, math.vector.mul_fl(math.vector.angle_vector([createmove_data.local_viewangles[0], createmove_data.local_viewangles[1] + 58, 0]), 90)));
                const right_trace = Trace.Line(utilities.global_variables.local_player, createmove_data.local_eye_position, math.vector.add(createmove_data.local_eye_position, math.vector.mul_fl(math.vector.angle_vector([createmove_data.local_viewangles[0], createmove_data.local_viewangles[1] - 58, 0]), 90)));

                if(left_trace[1] == right_trace[1])
                {
                    return 0;
                }

                return left_trace[1] < right_trace[1] ? 1 : -1;
            }
        },

        handle: function(createmove_data)
        {
            if(config.generic_settings.legitaa_master_switch && menu.get_item_value(menu_items.references.antiaim_enabled_reference))
            {
                menu.set_item_value(menu_items.references.restrictions_reference, 0);
                menu.set_item_value(menu_items.references.antiaim_yaw_offset_reference, 180);
                menu.set_item_value(menu_items.references.antiaim_pitch_reference, 0);

                AntiAim.SetOverride(1);

                const local_velocity_length = math.vector.length(Entity.GetProp(utilities.global_variables.local_player, "CBasePlayer", "m_vecVelocity[0]"));

                const fake_type_array = ["standing", "walking", "moving"];
                var fake_type = local_velocity_length < 3.5 ? 0 : local_velocity_length < 135 ? 1 : 2;

                var desync_direction = menu.get_item_value(menu_items.references.antiaim_inverter_reference) ? -1 : 1; //TODO: edge detection & using inverter dir if no wall found
                if(config.generic_settings.legitaa_autodirection)
                {
                    const autodirection_result = this.helpers.get_autodirection_side(createmove_data);
                    if(autodirection_result != 0)
                    {
                        desync_direction = autodirection_result;
                        if(config.generic_settings.legitaa_autodirection_peek_mode == 1 && fake_type >= 1 && createmove_data.enemies.some(function(entity_index) {  //Could be optimized more
                            return utilities.game.local_peek_check(createmove_data.local_eye_position, entity_index);
                        } ))
                        {
                            desync_direction *= -1;
                        }
                    }
                }
                
                if(utilities.global_variables.choked_commands == 0)
                {
                    this.jitter_flip *= -1;
                }

                const current_lby_extend_amount = config.generic_settings.legitaa_lby_extension_amount;
        
                this.desync_side = desync_direction;

                AntiAim.SetRealOffset((60 * config.generic_settings["legitaa_fake_delta_" + fake_type_array[fake_type]] * desync_direction * (config.generic_settings["legitaa_" + fake_type_array[fake_type] + "_mode"] == 0 ? 1 : (this.jitter_flip == -1 ? -0.5 : 1))));
                AntiAim.SetLBYOffset(config.generic_settings.legitaa_lby_mode == 1 && !(config.generic_settings.legitaa_safety_checks && (Globals.Tickrate() > 1 / Globals.Frametime() || Local.Latency() > 0.2)) ? Math.abs(math.angle.difference(utilities.global_variables.fake_yaw, utilities.global_variables.real_yaw)) > 100 && current_lby_extend_amount == 1 ? 180 : 100 * current_lby_extend_amount * -desync_direction : 0);
            }
            else
            {
                AntiAim.SetOverride(0);
            }
        }
    },

    fakelag_handler:
    {
        handle: function(createmove_data)
        {
            config.generic_settings.visible_only_fakelag && createmove_data.enemies.some(function(entity_index) { 
                return utilities.game.local_peek_check(createmove_data.local_eye_position, entity_index);
            } ) && utilities.global_variables.choked_commands < config.generic_settings.visible_fakelag_strength ? UserCMD.Choke() : null;
        }
    },

    renderer:
    {
        helpers: 
        {
            screensize: [],
            generic_color: function(fraction, desired_alpha)
            {
                return [190 - ((fraction * 60) * 75 / 40), 40 + ((fraction * 60) * 146 / 60), 10, desired_alpha];
            },
            
            render_indicators: function()
            {
                const indicator_font = Render.AddFont("Verdana", 10, 800);
                const indicator_selections = config.generic_settings.indicators;

                const aim_data = {active: 0, fov: 0, aim_mode: 0, aim_mode_str: ""};
                var autowall_mode = 0;

                const _fake_delta = math.angle.difference(utilities.global_variables.fake_yaw, utilities.global_variables.real_yaw);

                const aa_data = {fake_delta: _fake_delta, direction: features.antiaim_handler.desync_side, color: this.generic_color(math.clamp(Math.abs(_fake_delta) / 60, 0, 1), 200)};
                const lag_data = {color: this.generic_color(math.clamp(utilities.global_variables.choked_commands / 8, 0, 1), 200)};

                const fill_indicator_data = function()
                {
                    const is_ragebot_active = config.generic_settings.ragebot_enabled_hotkey_reference;
                    aim_data.active = is_ragebot_active ? true : features.legitbot_handler.aimbot_active;
                    aim_data.fov = is_ragebot_active ? menu.get_item_value(menu_items.references["ragebot_" + setup_helpers.ragebot_internal_weapon_types[utilities.global_variables.current_weapon_group_ragebot] + "_fov_reference"]) : Math.round(features.legitbot_handler.last_fov);
                    aim_data.aim_mode = is_ragebot_active ? 0 : 1;
                    aim_data.aim_mode_str = is_ragebot_active ? "RAGE" : "LEGIT";
                    if(is_ragebot_active)
                    {
                        aim_data.bodyaim_mode = config.generic_settings.ragebot_bodyaim_hotkey_reference ? 2 : config.reference_states[utilities.global_variables.current_weapon_group_ragebot].prefer_baim_state ? 1 : 0;
                        aim_data.safepoint_mode = config.generic_settings.ragebot_safepoint_hotkey_reference ? 2 : config.reference_states[utilities.global_variables.current_weapon_group_ragebot].prefer_safepoint_state ? 1 : 0;
                        aim_data.resolver_override = config.generic_settings.ragebot_resolver_hotkey_reference;
                    }

                    if(config.generic_settings.autowall_key_down)
                    {
                        autowall_mode = 2;
                    }
                    else
                    {
                        autowall_mode = (utilities.global_variables.current_weapon_group_script != -1 && is_ragebot_active) ? config.weapon_settings[utilities.global_variables.current_weapon_group_script].ragebot_autowall_mode : 0;
                    }
                }

                fill_indicator_data();

                const base_x = this.screensize[0] * 0.5;
                var base_y = this.screensize[1] * 0.52;

                const mode_colors = [[255, 25, 30, 200], [190, 170, 18, 200], [77.5, 186, 10, 200]]; //generalized for ease of use

                if(indicator_selections & (1 << 0))
                {
                    Render.StringCustom(base_x, base_y, 1, aim_data.aim_mode_str, aim_data.active ? mode_colors[2] : mode_colors[0], indicator_font);
                    base_y += 15;
    
                    Render.StringCustom(base_x, base_y, 1, "FOV: " + aim_data.fov, aim_data.active ? mode_colors[2] : mode_colors[0], indicator_font);
                    base_y += 15;

                    if(aim_data.aim_mode == 0)
                    {
                        if(aim_data.bodyaim_mode)
                        {
                            Render.StringCustom(base_x, base_y, 1, "BODY", mode_colors[aim_data.bodyaim_mode], indicator_font);
                            base_y += 15;
                        }
                        if(aim_data.safepoint_mode)
                        {
                            Render.StringCustom(base_x, base_y, 1, "SAFETY", mode_colors[aim_data.safepoint_mode], indicator_font);
                            base_y += 15;
                        }
                        if(aim_data.resolver_override)
                        {
                            Render.StringCustom(base_x, base_y, 1, "OVERRIDE", mode_colors[2], indicator_font);
                            base_y += 15;
                        }
                    }
                }
                if(indicator_selections & (1 << 1) && utilities.global_variables.current_weapon_group_script != -1)
                {
                    Render.StringCustom(base_x, base_y, 1, "AW", mode_colors[autowall_mode], indicator_font);
                    base_y += 15;
                }
                if(indicator_selections & (1 << 2) && config.generic_settings.legitaa_master_switch)
                {
                    const screen_center_y = this.screensize[1] * 0.5;
                    const screen_side_top = this.screensize[1] * 0.495;
                    const screen_side_bottom = this.screensize[1] * 0.505;

                    aa_data.direction == -1 ? Render.Polygon([[this.screensize[0] * 0.541, screen_center_y], [this.screensize[0] * 0.535, screen_side_bottom], [this.screensize[0] * 0.535, screen_side_top]], aa_data.color) : Render.Polygon([[this.screensize[0] * 0.465, screen_side_bottom], [this.screensize[0] * 0.459, screen_center_y], [this.screensize[0] * 0.465, screen_side_top]], aa_data.color);

                    Render.StringCustom(base_x, base_y, 1, "AA " + Math.abs(Math.round(aa_data.fake_delta)), aa_data.color, indicator_font);
                    base_y += 15;
                }
                if(indicator_selections & (1 << 3))
                {
                    Render.StringCustom(base_x, base_y, 1, "LAG", lag_data.color, indicator_font);
                }
            },

            render_mm_info: function()
            {
                const info_font = Render.AddFont("Segoe UI", 8, 750);
                const base_x = this.screensize[0] * 0.85;
                var base_y = this.screensize[1] * 0.35;

                Render.StringCustom(base_x, base_y, 1, "MM Data", [255, 255, 255, 255], info_font);
                base_y += 15;
                const players = Entity.GetPlayers();
                const players_array_length = players.length;

                for(var i = 0; i < players_array_length; i++)
                {
                    const player = players[i];
                    if(Entity.IsValid(player))
                    {
                        const player_name = Entity.GetName(player);
                        if(player_name == "GOTV") //GOTV pops up here, surprisingly
                        { 
                            continue; 
                        }
                        Render.StringCustom(base_x, base_y, 1, ((Entity.IsBot(player) ? "BOT " : "") + player_name.trim() + " | Rank: " + utilities.matchmaking_ranks[Entity.GetProp(player, "CCSPlayerResource", "m_iCompetitiveRanking")] + " | Wins: " + Entity.GetProp(player, "CCSPlayerResource", "m_iCompetitiveWins")), Entity.IsEnemy(player) ? [255, 20, 20, 255] : [20, 20, 255, 255], info_font);
                        base_y += 15;
                    }
                }
            }
        },

        handle: function()
        {
            this.helpers.screensize = Render.GetScreenSize();
            if(Entity.IsValid(utilities.global_variables.local_player))
            {
                if(Entity.IsAlive(utilities.global_variables.local_player))
                {
                    this.helpers.render_indicators();
                }
                if(Input.IsKeyPressed(0x09))
                {
                    this.helpers.render_mm_info();
                }
            }
        }
    },

    event_handlers:
    {
        legitbot_killdelay:
        {
            handle: function()
            {
                if(utilities.global_variables.local_player == Entity.GetEntityFromUserID(Event.GetInt("attacker")) && utilities.global_variables.local_player != Entity.GetEntityFromUserID(Event.GetInt("userid")))
                {
                    features.legitbot_handler.last_kill_time = Globals.Realtime();
                }
            }
        },

        ragebot_shotlogs:
        {
            handle: function()
            {
                if(config.generic_settings.rbot_shotlogs)
                {
                    const target_index = Event.GetInt("target_index");
                    const hitbox_index = Event.GetInt("hitbox");

                    var string = "shot " + Entity.GetName(target_index).trim() + " into " + (utilities.hitboxes[hitbox_index] || "generic") + " | HC: " + Event.GetInt("hitchance") + " | safe: " + (Event.GetInt("safepoint") == 1 ? "true" : "false");
                    const hitbox_position = Entity.GetHitboxPosition(target_index, hitbox_index);
                    if(typeof(hitbox_position) != "undefined")
                    {
                        const trace = Trace.Bullet(utilities.global_variables.local_player, target_index, Entity.GetEyePosition(utilities.global_variables.local_player), hitbox_position);
                        string += " | predicted damage: " + trace[1];
                    }

                    utilities.log_chat(string);
                }                
            }
        },

        killsay:
        {
            helpers:
            {
                normal_killsays: 
                ["ez", "too fucking easy", "effortless", "easiest kill of my life", 
                "retard blasted", "cleans?", "nice memesense retard", "hello mind explaining what happened there", 
                "pounce out of your window disgusting tranny, you shouldnt exist in this world", 
                "а вы че клины???", "обоссал мемюзера лол", "ты че там отлетел то", 
                "uglyass fucking tranny down rofl",
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
                "iq больше двух будет пмнешь ок????", "НИХУЯ ТАМ НЬЮКАМЫЧА ОРОШИЛИ СТРУЕЙ МОЧИ АХАХХАХАХАХАХАХАХА", "дал юид за щеку проверяй", "nn4ik shat on",
                "хуя тебя опустили манька))))", "go back to your fucking jungle xane lookin ass", "monkeys running straight into my xhair ROFL"
                ],

                headshot_killsays:
                [
                "ez", "effortless", "1", "nice antiaim, you sell?", "you pay for that?", 
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
                "крякоюзер down, на завод нахуй", "я не понял ты такой жирный потомучто дошики каждый день жрешь???? нормальную работу найди может на еду денег хватит))))))))))))",
                "насрал тебе в ротешник проверяй", "нихуя ты там как самолет отлетел ХАХАХХАХАХАХАХХХААХАА",
                "БЛЯ НИЩ ХУЯК ХУЯК И ТЫ УПАЛ КАК ТАК ТО?????? ОБЬЯСНИСЬ БЛЯТЬ", "единичкой упал нахуй", "stop OOH OOH AAH AAHing in csgo and go back to the cotton field dumb retard the sun hasnt set yet"
                ] //i didnt steal these killsays from the insert-ru-forum-here post, i posted them there myself lmao
            },

            handle: function()
            {
                if(config.generic_settings.killsays && utilities.global_variables.local_player == Entity.GetEntityFromUserID(Event.GetInt("attacker")) && utilities.global_variables.local_player != Entity.GetEntityFromUserID(Event.GetInt("userid")))
                {
                    Cheat.ExecuteCommand("say " + ((Event.GetInt("headshot") == 1 && Math.random > 0.5) ? this.helpers.headshot_killsays[Math.floor(Math.random() * this.helpers.headshot_killsays.length)] : this.helpers.normal_killsays[Math.floor(Math.random() * this.helpers.normal_killsays.length)]));
                }
            }
        }
    }
};

const callbacks = 
{
    game_functions: 
    {
        createmove:
        {
            on_function: function()
            {   
                utilities.global_variables.update();

                if(config.generic_settings.master_switch)
                {
                    const generate_createmove_data = function()
                    {
                        const object = 
                        { 
                            local_eye_position: Entity.GetEyePosition(utilities.global_variables.local_player),
                            local_viewangles: Local.GetViewAngles(),
                            usercmd_buttons: UserCMD.GetButtons(),
                            enemies: Entity.GetEnemies(),
                            enemy_array_length: 0
                        };

                        object.enemies = object.enemies.filter(function(entity_index)
                        {
                            return Entity.IsValid(entity_index) && Entity.IsAlive(entity_index) && !Entity.IsDormant(entity_index);
                        });

                        object.enemy_array_length = object.enemies.length;
                        
                        return object;
                    }

                    const createmove_data = generate_createmove_data();

                    features.legitbot_handler.handle(createmove_data);
                    features.ragebot_handler.handle(createmove_data);
                    features.antiaim_handler.handle(createmove_data);
                    features.fakelag_handler.handle(createmove_data);
                }
            }
        },

        draw:
        {
            on_function: function()
            {
                config.update_script_settings();
                features.renderer.handle();
                menu_items.handle_menu_item_visibility();
            }
        },

        unload: //technically not a game function.
        {
            on_function: function()
            {
                AntiAim.SetOverride(0);
            }
        }
    },
    
    events:
    {
        ragebot_fire:
        {
            on_function: function()
            {
                features.event_handlers.ragebot_shotlogs.handle();
            }
        },

        player_death:
        {
            on_function: function()
            {
                features.event_handlers.killsay.handle();
                features.event_handlers.legitbot_killdelay.handle();
            }
        }
    },

    setup_callbacks: function()
    {
        Cheat.RegisterCallback("CreateMove", "callbacks.game_functions.createmove.on_function");
        Cheat.RegisterCallback("Draw", "callbacks.game_functions.draw.on_function");
        Cheat.RegisterCallback("Unload", "callbacks.game_functions.unload.on_function");

        Cheat.RegisterCallback("player_death", "callbacks.events.player_death.on_function");
        Cheat.RegisterCallback("ragebot_fire", "callbacks.events.ragebot_fire.on_function");
    }
};

const on_script_load = function()
{
    menu_items.script_items.setup_menu_items();
    menu_items.references.setup_references();

    callbacks.setup_callbacks();

    utilities.log("script loaded, current user: " + utilities.global_variables.cheat_username);
}

on_script_load();

//go and see what I pasted from you mr spec-whoever
