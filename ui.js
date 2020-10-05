(function() {
    for(var i in UI) {
        if(!~i.indexOf("Add"))
            continue;

        (function(cur) {
            UI[i] = function() {
                cur.apply(this, Array.prototype.slice.call(arguments));
                return arguments[0].concat(arguments[1]);
            }
        }(UI[i]));
    }
})();

UI.AddSubTab(["Visuals", "SUBTAB_MGR"], "Identity");

const __hotkey_list = UI.AddCheckbox(["Visuals", "SUBTAB_MGR", "Identity", "SHEET_MGR", "Identity"], "Display active hotkeys");
const __watermark = UI.AddCheckbox(["Visuals", "SUBTAB_MGR", "Identity", "SHEET_MGR", "Identity"], "Display watermark");

const hotkey_list_accent = UI.AddColorPicker(["Visuals", "SUBTAB_MGR", "Identity", "SHEET_MGR", "Identity"], "Hotkey list accent color");
const watermark_accent = UI.AddColorPicker(["Visuals", "SUBTAB_MGR", "Identity", "SHEET_MGR", "Identity"], "Watermark accent color");

const math = {
    clamp: function(val, min, max) {
        return Math.min(max, Math.max(min, val));
    }
};

const draggable = {
    draggables: [],

    create_draggable: function(starting_size_x, starting_size_y, callback) {
        const screen_size = Render.GetScreenSize();

        const slider_x = UI.AddSliderInt(["Visuals", "SUBTAB_MGR", "Identity", "SHEET_MGR", "Identity"], "_draggable_" + this.draggables.length + "_x", 0, screen_size[0]);
        const slider_y = UI.AddSliderInt(["Visuals", "SUBTAB_MGR", "Identity", "SHEET_MGR", "Identity"], "_draggable_" + this.draggables.length + "_y", 0, screen_size[1]);
        
        UI.SetEnabled(slider_x, 0);
        UI.SetEnabled(slider_y, 0);

        this.draggables.push({
            pos: [UI.GetValue(slider_x), UI.GetValue(slider_y)],
            size: [starting_size_x, starting_size_y],

            is_dragging: false,

            initial_drag_pos: [0, 0],
            sliders: [slider_x, slider_y],

            callback_function: callback,

            update: function() {
                const screen_size = Render.GetScreenSize();
                const menu_open = UI.IsMenuOpen();
                if(menu_open) {
                    if(Input.IsKeyPressed(1)) {
                        const mouse_position = Input.GetCursorPosition();
                        if(!this.is_dragging && mouse_position[0] >= this.pos[0] && mouse_position[1] >= this.pos[1] && mouse_position[0] <= this.pos[0] + this.size[0] && mouse_position[1] <= this.pos[1] + this.size[1]) {
                            this.is_dragging = true;
                            this.initial_drag_pos = [mouse_position[0] - this.pos[0], mouse_position[1] - this.pos[1]];
                        }
                        else if(this.is_dragging) {
                            this.pos = [math.clamp(mouse_position[0] - this.initial_drag_pos[0], 0, screen_size[0]), math.clamp(mouse_position[1] - this.initial_drag_pos[1], 0, screen_size[1])];
                            for(var i in this.pos)
                            {
                                UI.SetValue(this.sliders[i], this.pos[i]);
                            }
                        }
                    }
                    else if(this.is_dragging) {
                        this.is_dragging = false;
                        this.initial_drag_pos = [0, 0];
                    }
                }
                this.callback_function.apply(this, [menu_open]);
            }
        });
    },

    update_draggables: function() {
        for(var i in this.draggables) {
            this.draggables[i].update();
        }
    }
};

const watermark = function() {
    if(UI.GetValue(__watermark)) {
        var watermark_str = "Onetap | " + Cheat.GetUsername() + " | ";
        const server_str = World.GetServerString();
        if(server_str != "") {
            const idx = server_str.indexOf(":");
            watermark_str += server_str.charAt(0).toUpperCase() + server_str.slice(1, idx != -1 ? idx : server_str.length) + " | " + (server_str == "local server" ? "" : "RTT: " + (Math.floor(Local.Latency() * 1000) - 16).toString() + " ms | ") + "Rate: " + Globals.Tickrate() + " ticks | ";
        }
        const date = new Date();
        const hrs = date.getHours();
        const mins = date.getMinutes();

        watermark_str += (hrs < 10 ? "0" + hrs.toString() : hrs.toString()) + ":" + (mins < 10 ? "0" + mins.toString() : mins.toString());

        const watermark_col = UI.GetColor(watermark_accent);
        const watermark_font = Render.AddFont("segoeui.ttf", 11, 600);
        const string_size = Render.TextSize(watermark_str, watermark_font);

        string_size[0] += 8;
        string_size[1] += 4;

        const render_position = [Render.GetScreenSize()[0] - string_size[0] - 15, 10];

        Render.FilledRect(render_position[0] - 1, render_position[1] - 2, string_size[0], 2, watermark_col);
        Render.FilledRect(render_position[0] - 1, render_position[1], string_size[0], string_size[1] + 3, [17, 17, 17, 200]);
        Render.String(render_position[0] + 3, render_position[1] + 2, 0, watermark_str, [0, 0, 0, 200], watermark_font);
        Render.String(render_position[0] + 3, render_position[1] + 1, 0, watermark_str, [255, 255, 255, 200], watermark_font);
    }
};

const on_draw = function() {
    draggable.update_draggables(); 
    watermark();   
};

const hotkey_list = { list_internal_data: {
    alpha: 0
}};

(function() {
    const add_hotkeys_to_list = function(bind_path) {
        const keys = UI.GetChildren(bind_path);
        for(var i in keys) {
            hotkey_list[keys[i]] = {
                name: keys[i],
                path: bind_path.concat(keys[i]),
                alpha: 0
            }
        }
    };

    add_hotkeys_to_list(["Legit", "General", "SHEET_MGR", "General", "Key assignment"]);
    add_hotkeys_to_list(["Rage", "General", "SHEET_MGR", "General", "Key assignment"]);
    add_hotkeys_to_list(["Rage", "Exploits", "SHEET_MGR", "Key assignment"]);
    add_hotkeys_to_list(["Rage", "Anti Aim", "SHEET_MGR", "Key assignment"]);
    add_hotkeys_to_list(["Misc.", "Keys", "SHEET_MGR", "Key assignment"]);

    hotkey_list["Thirdperson"] = undefined; //lol
})(); //Fill hotkey list.

const keybind_modes = {
    "Hold": "[holding]",
    "Toggle": "[toggled]"
};

draggable.create_draggable(200, 21, function(menu_open) {
    if(UI.GetValue(__hotkey_list)) {
        const local = Entity.GetLocalPlayer();
        const is_at_least_1_hotkey_active = (function() {
            for(var i in hotkey_list) {
                if(hotkey_list[i] && hotkey_list[i].name && UI.GetValue(hotkey_list[i].path) && keybind_modes[UI.GetHotkeyState(hotkey_list[i].path)]) {
                    return true;
                }
            }
            return false;
        })();
        
        const new_alpha_value = Globals.Frametime() * 8 * ((menu_open || Entity.IsValid(local) && is_at_least_1_hotkey_active) ? 1 : -1);
        hotkey_list.list_internal_data.alpha = math.clamp(hotkey_list.list_internal_data.alpha + new_alpha_value, 0, 1);
        if(hotkey_list.list_internal_data.alpha > 0) {
            const hotkey_accent_color = UI.GetColor(hotkey_list_accent);
            const hotkey_title_font = Render.AddFont("segoeuib.ttf", 11, 800);

            const render_position = [this.pos[0], this.pos[1]];
            Render.FilledRect(render_position[0], render_position[1], this.size[0], 2, [hotkey_accent_color[0], hotkey_accent_color[1], hotkey_accent_color[2], 200 * hotkey_list.list_internal_data.alpha]);
            Render.FilledRect(render_position[0], render_position[1] + 2, this.size[0], this.size[1] - 1, [17, 17, 17, 200 * hotkey_list.list_internal_data.alpha]);
            Render.String(render_position[0] + this.size[0] / 2, render_position[1] + this.size[1] / 5 + 1, 1, "Hotkey list", [0, 0, 0, 200 * hotkey_list.list_internal_data.alpha], hotkey_title_font);
            Render.String(render_position[0] + this.size[0] / 2, render_position[1] + this.size[1] / 5, 1, "Hotkey list", [255, 255, 255, 200 * hotkey_list.list_internal_data.alpha], hotkey_title_font);
            render_position[1] += this.size[1];

            if(!menu_open) {
                const hotkey_font = Render.AddFont("segoeui.ttf", 11, 400);
                for(var i in hotkey_list) {
                    if(hotkey_list[i] && hotkey_list[i].name) {
                        const active = UI.GetValue(hotkey_list[i].path);
                        const mode = keybind_modes[UI.GetHotkeyState(hotkey_list[i].path)];
                        const alpha_additive = Globals.Frametime() * 8 * ((active && !!mode) ? 1 : -1);
        
                        hotkey_list[i].alpha = math.clamp(hotkey_list[i].alpha + alpha_additive, 0, 1);
                        if(hotkey_list[i].alpha > 0)
                        {
                            const measured_str_name = Render.TextSize(i, hotkey_font);
                            const measured_str_mode = Render.TextSize(mode, hotkey_font);
        
                            if(!active && hotkey_list[i].alpha < 0.15) {
                                render_position[1] -= measured_str_name[1] * hotkey_list[i].alpha * Math.abs(alpha_additive) * 7.5;
                            }
                            
                            Render.String(render_position[0] + 2, render_position[1] + 1, 0, i, [0, 0, 0, hotkey_list[i].alpha * 200], hotkey_font)
                            Render.String(render_position[0] + 2, render_position[1], 0, i, [255, 255, 255, hotkey_list[i].alpha * 200], hotkey_font);

                            Render.String(render_position[0] + this.size[0] - 1 - measured_str_mode[0], render_position[1] + 1, 0, mode, [0, 0, 0, hotkey_list[i].alpha * 200], hotkey_font);
                            Render.String(render_position[0] + this.size[0] - 1 - measured_str_mode[0], render_position[1], 0, mode, [255, 255, 255, hotkey_list[i].alpha * 200], hotkey_font);

                            if(hotkey_list[i].alpha > 0.15) {
                                render_position[1] += measured_str_name[1]
                            }
                        }
                    }
                }
            }
        }
    }
});

(function() {
    Cheat.RegisterCallback("Draw", "on_draw");
})();
