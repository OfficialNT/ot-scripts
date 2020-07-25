///Never really bothered to finish the script :( Don't have a sub anyway.


//i tried to go full on tranny for this code, dont think i quite succeeded
//code is basically obfuscated since its so tranny

//also fallback always goes before head conditions, since what's the point of shooting head anyway

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

        length_2d: function(a)
        {
            return Math.sqrt(a[0] ** 2 + a[1] ** 2);
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

const setup_helpers = 
{
    ragebot_head_conditions: ["Shooting", "Moving", "In air"],
    ragebot_fallback_modes: ["Safepoint", "Bodyaim"], //fatality moment
    ragebot_fallback_conditions: ["Lethal", "Standing", "Slowwalking", "Moving", "In air"],
    ragebot_weapon_groups: ["General", "Pistol", "Heavy pistol", "Scout", "AWP", "Autosniper"],
};

const menu_items = 
{
    references: {},

    setup_menu_items: function()
    {
        this.master_switch = menu.create_checkbox("Ragebot improvement master switch");
        this.damage_override_key = menu.create_keybind("Damage override");
        this.selected_weapon = menu.create_dropdown("Selected weapon", setup_helpers.ragebot_weapon_groups);
        for(var i = 0; i <= 5; i++)
        {
            const ragebot_weapon = setup_helpers.ragebot_weapon_groups[i];
            const ragebot_weapon_cfg = ragebot_weapon.split(" ").join("_").toLowerCase();
            this[ragebot_weapon_cfg + "_standard_damage_amount"] = menu.create_slider_int(ragebot_weapon + " minimum damage", 0, 130);
            this[ragebot_weapon_cfg + "_damage_override_amount"] = menu.create_slider_int(ragebot_weapon + " damage override", 0, 130);
            this[ragebot_weapon_cfg + "_ragebot_head_conditions"] = menu.create_multi_dropdown(ragebot_weapon + " head conditions", setup_helpers.ragebot_head_conditions);
            this[ragebot_weapon_cfg + "_ragebot_fallback_mode"] = menu.create_dropdown(ragebot_weapon + " fallback mode", setup_helpers.ragebot_fallback_modes);
            this[ragebot_weapon_cfg + "_ragebot_fallback_conditions"] = menu.create_multi_dropdown(ragebot_weapon + " fallback conditions", setup_helpers.ragebot_fallback_conditions);
            
            if(i == 2 || i == 3)
            {
                this[ragebot_weapon_cfg + "_jumping_hitchance"] = menu.create_slider_int(ragebot_weapon + " jumping hitchance", 1, 100);
            }

            if(i == 2 || i == 5)
            {
                this[ragebot_weapon_cfg + "_doubletap_hitchance"] = menu.create_slider_int(ragebot_weapon + " DT second shot hitchance", 0, 100);
            }

            if(i == 4)
            {
                this[ragebot_weapon_cfg + "_safety"] = menu.create_checkbox("Safe AWP");
            }

            if(i == 5)
            {
                this[ragebot_weapon_cfg + "_lethal_wait"] = menu.create_checkbox("Delay shot until DT lethal");
            }
        }
        this.improve_dt = menu.create_checkbox("Doubletap corrections");
        this.indicators = menu.create_multi_dropdown("Indicators", ["Enemy mode", "Damage override", "Body aim", "Safe point", "Doubletap state", "Watermark"]);
    },
    
    setup_references: function()
    {
        this.references.ragebot_bodyaim_hotkey_reference = menu.create_menu_reference(["Rage", "Force body aim"], menu.menu_types.TYPE_KEYBIND);
        this.references.ragebot_safepoint_hotkey_reference = menu.create_menu_reference(["Rage", "Force safe point"], menu.menu_types.TYPE_KEYBIND);

        this.references.ragebot_doubletap_hotkey_reference = menu.create_menu_reference(["Rage", "Doubletap"], menu.menu_types.TYPE_KEYBIND);
        this.references.ragebot_doubletap_value_reference = menu.create_menu_reference(["Rage", "Doubletap"], menu.menu_types.TYPE_VALUE);

        for(var i = 0; i <= 5; i++)
        {
            const ragebot_weapon = setup_helpers.ragebot_weapon_groups[i].toUpperCase();
            const ragebot_weapon_cfg = ragebot_weapon.split(" ").join("_").toLowerCase();

            this.references["ragebot_" + ragebot_weapon_cfg + "_mindmg_reference"] = menu.create_menu_reference(["Rage", ragebot_weapon, "Targeting", "Minimum damage"], menu.menu_types.TYPE_VALUE);
            menu.set_item_visibility(this.references["ragebot_" + ragebot_weapon_cfg + "_mindmg_reference"], false);
        }
    },

    handle_menu_item_visibility: function()
    {
        if(UI.IsMenuOpen())
        {
            const master_switch_active = menu.get_item_value(this.master_switch);
            const selected_menu_weapon = menu.get_item_value(this.selected_weapon);
            menu.set_item_visibility(this.damage_override_key, master_switch_active);
            menu.set_item_visibility(this.selected_weapon, master_switch_active);   
            for(var i = 0; i <= 5; i++)
            {
                const ragebot_weapon_cfg = setup_helpers.ragebot_weapon_groups[i].split(" ").join("_").toLowerCase();

                menu.set_item_visibility(this[ragebot_weapon_cfg + "_standard_damage_amount"], master_switch_active && selected_menu_weapon == i);
                menu.set_item_visibility(this[ragebot_weapon_cfg + "_damage_override_amount"], master_switch_active && selected_menu_weapon == i);
                menu.set_item_visibility(this[ragebot_weapon_cfg + "_ragebot_head_conditions"], master_switch_active && selected_menu_weapon == i);
                menu.set_item_visibility(this[ragebot_weapon_cfg + "_ragebot_fallback_mode"], master_switch_active && selected_menu_weapon == i);
                menu.set_item_visibility(this[ragebot_weapon_cfg + "_ragebot_fallback_conditions"], master_switch_active && selected_menu_weapon == i);

                if(i == 2 || i == 3)
                {
                    menu.set_item_visibility(this[ragebot_weapon_cfg + "_jumping_hitchance"], master_switch_active && selected_menu_weapon == i);
                }

                if(i == 2 || i == 5)
                {
                    menu.set_item_visibility(this[ragebot_weapon_cfg + "_doubletap_hitchance"], master_switch_active && selected_menu_weapon == i);
                }

                if(i == 4)
                {
                    menu.set_item_visibility(this[ragebot_weapon_cfg + "_safety"], master_switch_active && selected_menu_weapon == i);
                }

                if(i == 5)
                {
                    menu.set_item_visibility(this[ragebot_weapon_cfg + "_lethal_wait"], master_switch_active && selected_menu_weapon == i);
                }
            }
            menu.set_item_visibility(this.improve_dt, master_switch_active);
            menu.set_item_visibility(this.indicators, master_switch_active);
        }
    }
};


const config = 
{
    weapon_settings: [],
    
    update_weapon_config: function()
    {
        for(var i = 0; i <= 5; i++)
        {
            const ragebot_weapon_cfg = setup_helpers.ragebot_weapon_groups[i].split(" ").join("_").toLowerCase();
            this.weapon_settings[i] = 
            {
                standard_damage_amount: menu.get_item_value(menu_items[ragebot_weapon_cfg + "_standard_damage_amount"]),

                damage_override_amount: menu.get_item_value(menu_items[ragebot_weapon_cfg + "_damage_override_amount"]),
                ragebot_head_conditions: menu.get_item_value(menu_items[ragebot_weapon_cfg + "_ragebot_head_conditions"]),

                ragebot_fallback_mode: menu.get_item_value(menu_items[ragebot_weapon_cfg + "_ragebot_fallback_mode"]),
                ragebot_fallback_conditions: menu.get_item_value(menu_items[ragebot_weapon_cfg + "_ragebot_fallback_conditions"]),

                jumping_hitchance: (i == 2 || i == 3 ? menu.get_item_value(menu_items[ragebot_weapon_cfg + "_jumping_hitchance"]) : 0),
                dt_hitchance: (i == 2 || i == 5 ? menu.get_item_value(menu_items[ragebot_weapon_cfg + "_doubletap_hitchance"]) : 0),

                force_safety: (i == 4 ? menu.get_item_value(menu_items[ragebot_weapon_cfg + "_safety"]) : 0),
                lethal_wait: (i == 5 ? menu.get_item_value(menu_items[ragebot_weapon_cfg + "_lethal_wait"]) : 0) 
            };
        }
    },

    update_settings: function()
    {
        this.damage_override_key = menu.get_item_value(menu_items.damage_override_key);
        this.master_switch = menu.get_item_value(menu_items.master_switch);
        this.improve_dt = menu.get_item_value(menu_items.improve_dt);
        this.indicators = menu.get_item_value(menu_items.indicators);
        this.update_weapon_config();
    }
};

const utility = 
{
    weapon_groups:
    [
        null, //General
        [32, 61, 4, 36, 3, 30, 2, 63], //Pistols
        [1, 64], //Heavy pistols
        [40], //SSG
        [9], //AWP
        [11, 38] //Autosnipers
    ],

    entity_movement_types:
    {
        TYPE_STAND: 0,
        TYPE_SLOWWALK: 1,
        TYPE_RUN: 2,
        TYPE_AERIAL: 3
    },

    doubletap_states:
    {
        STATE_CANNOT_DOUBLETAP: 0, //Our charge is too low and we cannot shift 
        STATE_SHOULD_RECHARGE: 1,
        STATE_READY: 2
    },

    global_variables:
    {
        local_player: -1,
        fake_yaw: -1,
        real_yaw: -1,
        doubletap_state: -1,
        
        in_doubletap_shot: false,
        current_weapon_group: 0,

        update: function()
        {
            this.local_player = Entity.GetLocalPlayer();
            this.fake_yaw = Local.GetFakeYaw();
            this.real_yaw = Local.GetRealYaw();
            
            if(Entity.IsValid(this.local_player) && Entity.IsAlive(this.local_player))
            {
                this.doubletap_state = (Exploit.GetCharge() == 1 ? utility.doubletap_states.STATE_READY : features.exploit_handler.helpers.can_shift_shot() ? utility.doubletap_states.STATE_SHOULD_RECHARGE : utility.doubletap_states.STATE_CANNOT_DOUBLETAP);
            }
        },

        update_weapon_group: function()
        {
            if(Entity.IsLocalPlayer(Entity.GetEntityFromUserID(Event.GetInt("userid"))))
            {
                const item_id = Event.GetInt("defindex") & 0xFFFF;
                var weapon_group = 0;
                for(var i = 1; i <= 5; i++)
                {
                    if(utility.weapon_groups[i].some(function(value) { return value == item_id; }))
                    {
                        weapon_group = i;
                        break;
                    }
                }
                this.current_weapon_group = weapon_group;
            }
        }
    },

    console_log_prefix: "[ragebot_enhancer] ",
    console_log_prefix_color: [255, 0, 0, 255],

    log: function(text)
    {
        Cheat.PrintColor(this.console_log_prefix_color, this.console_log_prefix);
        Cheat.Print(text + "\n");
    }
};

const features = 
{
    shared:
    {
        entity_data: []
    },

    ragebot_handler:
    {
        helpers:
        {
            force_head: function(local_eyepos, entity_index)
            {
                menu.set_item_value(menu_items.references.ragebot_bodyaim_hotkey_reference, false);
                const entity_head_position = Entity.GetHitboxPosition(entity_index, 0);
                if(typeof(entity_head_position) != "undefined")
                {
                    const trace = Trace.Bullet(utility.global_variables.local_player, entity_index, local_eyepos, entity_head_position);
                    if(trace[0] == entity_index && trace[3] == 0)
                    {
                        Ragebot.ForceTargetMinimumDamage(entity_index, trace[1]);
                    }
                }
            },

            get_entity_movement_type: function(entity_index)
            {
                if(!(Entity.GetProp(entity_index, "CBasePlayer", "m_fFlags") & (1 << 0)))
                {
                    return utility.entity_movement_types.TYPE_AERIAL;
                }
                const entity_velocity_length2d = math.vector.length_2d(Entity.GetProp(entity_index, "CBasePlayer", "m_vecVelocity[0]"));
                return entity_velocity_length2d > 150 ? utility.entity_movement_types.TYPE_RUN : entity_velocity_length2d > 15 ? utility.entity_movement_types.TYPE_SLOWWALK : utility.entity_movement_types.TYPE_STAND;
            },

            lethality_check: function(local_eyepos, entity_index, doubletap_state)
            {
                const extrapolated_shootpos = math.vector.add(local_eyepos, math.vector.mul_fl(Entity.GetProp(utility.global_variables.local_player, "CBasePlayer", "m_vecVelocity[0]"), Globals.TickInterval() * 10));

            }
        },

        handle: function(createmove_data)
        {
            if(createmove_data.enemy_array_length > 0)
            {
                const doubletap_ready = Exploit.GetCharge() == 1 && menu.get_item_value(menu_items.references.ragebot_doubletap_hotkey_reference) && menu.get_item_value(menu_items.references.ragebot_doubletap_value_reference);
                const ragebot_target = Ragebot.GetTarget();
                const force_head_conditions = config.weapon_settings[utility.global_variables.current_weapon_group].ragebot_head_conditions;

                const force_fallback_mode = config.weapon_settings[utility.global_variables.current_weapon_group].ragebot_fallback_mode;
                const force_fallback_conditions = config.weapon_settings[utility.global_variables.current_weapon_group].ragebot_fallback_conditions;
                const should_force_safety = config.weapon_settings[utility.global_variables.current_weapon_group].force_safety;

                const min_damage = config.damage_override_key ? config.weapon_settings[utility.global_variables.current_weapon_group].damage_override_amount : config.weapon_settings[utility.global_variables.current_weapon_group].standard_damage_amount;
                const jumpscout_hitchance = config.weapon_settings[utility.global_variables.current_weapon_group].jumping_hitchance;
                const eligible_for_jumpscout = jumpscout_hitchance != 0 && !(Entity.GetProp(utility.global_variables.local_player, "CBasePlayer", "m_fFlags") & (1 << 0));

                const should_delay_for_lethal_dt = utility.global_variables.current_weapon_group == 5 && config.weapon_settings[utility.global_variables.current_weapon_group].lethal_wait;

                for(var i = 0; i < createmove_data.enemy_array_length; i++)
                {
                    const entity_index = createmove_data.enemies[i];
                    const is_ragebot_target = entity_index == ragebot_target;
                                        
                    Ragebot.ForceTargetMinimumDamage(entity_index, min_damage);
                    if(eligible_for_jumpscout)
                    {
                        Ragebot.ForceTargetHitchance(entity_index, jumpscout_hitchance);
                    }
                    if(should_force_safety)
                    {
                        Ragebot.ForceTargetSafety(entity_index);
                    }
                    if(force_fallback_mode == 1 && force_head_conditions == 0 && !is_ragebot_target)
                    {
                        continue;
                    }

                    const entity_movetype = this.helpers.get_entity_movement_type(entity_index);
                    if(force_fallback_conditions & (1 << 1) && entity_movetype == utility.entity_movement_types.TYPE_STAND || force_fallback_conditions & (1 << 2) && entity_movetype == utility.entity_movement_types.TYPE_SLOWWALK || force_fallback_conditions & (1 << 3) && entity_movetype == utility.entity_movement_types.TYPE_RUN || force_fallback_conditions & (1 << 4) && entity_movetype == utility.entity_movement_types.TYPE_AERIAL)
                    {
                        force_fallback_mode == 0 ? Ragebot.ForceTargetSafety(entity_index) : is_ragebot_target ? menu.set_item_value(menu_items.references.ragebot_bodyaim_hotkey_reference, true) : null;
                        continue;
                    }
                    
                }
            }   
        }
    },

    exploit_handler:
    {
        helpers:
        {
            can_shift_shot() //still from Salvatore
            {
                const server_time = (Entity.GetProp(utility.global_variables.local_player, "CCSPlayer", "m_nTickBase") - 14) * Globals.TickInterval(); //Shifted ticks are fixed to 14 because that's the most likely option
                return server_time > Entity.GetProp(utility.global_variables.local_player, "CCSPlayer", "m_flNextAttack") && server_time > Entity.GetProp(Entity.GetWeapon(utility.global_variables.local_player), "CBaseCombatWeapon", "m_flNextPrimaryAttack");
            }
        },

        handle: function()
        {

        }
    },

    renderer:
    {
        helpers:
        {
            screen_size: [],

            generic_color: function(fraction)
            {
                return [190 - ((fraction * 60) * 75 / 40), 40 + ((fraction * 60) * 146 / 60), 10, 200];
            },

            render_localplayer_indicators: function()
            {
                const indicator_selections = config.indicators;

                const base_x = this.screen_size[0] * 0.5;
                const base_y = this.screen_size[1] * 0.52;

                var offset = 0;

                const push_indicator = function(string, color)
                {
                    Render.String(base_x + 1, base_y + 1 + offset, 1, string, [0, 0, 0, 255], 3);
                    Render.String(base_x, base_y + offset, 1, string, color, 3);
                    offset += 12;
                };

                if(indicator_selections & (1 << 1) && config.damage_override_key)
                {
                    push_indicator("DAMAGE", [255, 255, 0, 200]);
                }

                if(indicator_selections & (1 << 2) && menu.get_item_value(menu_items.references.ragebot_bodyaim_hotkey_reference))
                {
                    push_indicator("BAIM", [255, 0, 255, 200]);
                }

                if(indicator_selections & (1 << 3) && (menu.get_item_value(menu_items.references.ragebot_safepoint_hotkey_reference) || config.weapon_settings[utility.global_variables.current_weapon_group].force_safety))
                {
                    push_indicator("SAFE", [77.5, 186, 10, 200]);
                }

                if(indicator_selections & (1 << 4) && menu.get_item_value(menu_items.references.ragebot_doubletap_hotkey_reference))
                {
                    push_indicator("DOUBLETAP", this.generic_color(Exploit.GetCharge()));
                }
            }
        },

        handle: function()
        {
            this.helpers.screen_size = Render.GetScreenSize();
            if(Entity.IsValid(utility.global_variables.local_player) && Entity.IsAlive(utility.global_variables.local_player))
            {
                this.helpers.render_localplayer_indicators();
            }

            if(config.indicators & (1 << 5))
            {
                const font = Render.AddFont("Segoe UI", 8, 400);
                const string = "ragebot_enhancements.js | " + Cheat.GetUsername() + " | " + World.GetServerString();
                const string_size = Render.TextSizeCustom(string, font);
                string_size[0] += 8;
                string_size[1] += 4;
                const x = this.helpers.screen_size[0] - string_size[0] - 10, y = 80;

                Render.FilledRect(x - 4, y + 1, 3, string_size[1], [255, 255, 0, 200]);
                Render.FilledRect(x - 1, y + 1, string_size[0] + 3, string_size[1], [17, 17, 17, 200]);
                Render.StringCustom(x + 4, y + 2, 0, string, [255, 255, 255, 255], font);
            }
        }
    }
};

const callbacks =
{
    game_functions:
    {
        create_move:
        {
            on_function: function()
            {
                utility.global_variables.update();
                if(config.master_switch)
                {
                    const generate_createmove_data = function()
                    {
                        const object = 
                        {
                            local_eye_position: Entity.GetEyePosition(utility.global_variables.local_player),
                            enemies: Entity.GetEnemies().filter(function(entity_index) { return Entity.IsValid(entity_index) && Entity.IsAlive(entity_index) && !Entity.IsDormant(entity_index); }),
                            enemy_array_length: 0
                        };

                        object.enemy_array_length = object.enemies.length;
                        return object;
                    };

                    const createmove_data = generate_createmove_data();
                    features.ragebot_handler.handle(createmove_data);
                }
            }
        },

        draw:
        {
            on_function: function()
            {
                menu_items.handle_menu_item_visibility();
                config.update_settings();
                features.renderer.handle();
            }
        }
    },

    events:
    {
        item_equip:
        {
            on_function: function()
            {
                utility.global_variables.update_weapon_group();
            }
        }
    },

    register_callbacks: function()
    {
        Cheat.RegisterCallback("CreateMove", "callbacks.game_functions.create_move.on_function");
        Cheat.RegisterCallback("Draw", "callbacks.game_functions.draw.on_function");

        Cheat.RegisterCallback("item_equip", "callbacks.events.item_equip.on_function");
    }
};

const on_script_start = function()
{
    menu_items.setup_menu_items();
    menu_items.setup_references();
    callbacks.register_callbacks();

    for(var i = 1; i <= 64; i++)
    {
        features.shared.entity_data[i] = 
        {
            last_shot_time: -1,
            entity_info: "",
            visible: false
        };
    }

    utility.log("loaded, user: " + Cheat.GetUsername());
}

on_script_start();
