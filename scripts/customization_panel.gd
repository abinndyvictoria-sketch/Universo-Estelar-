extends Control

## Painel simples de personalização para telas de celular.

@onready var character = get_node("../Player/VisualCharacter")

func _ready() -> void:
    anchors_preset = Control.PRESET_FULL_RECT
    mouse_filter = Control.MOUSE_FILTER_PASS

    var panel := PanelContainer.new()
    panel.name = "CustomizationPanel"
    panel.anchor_left = 1.0
    panel.anchor_right = 1.0
    panel.anchor_top = 0.0
    panel.anchor_bottom = 0.0
    panel.offset_left = -224.0
    panel.offset_right = -16.0
    panel.offset_top = 16.0
    panel.offset_bottom = 188.0
    add_child(panel)

    var layout := VBoxContainer.new()
    layout.add_theme_constant_override("separation", 7)
    panel.add_child(layout)

    var title := Label.new()
    title.text = "✨ Meu visual"
    title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
    layout.add_child(title)

    _add_button(layout, "Cabelo: trocar", character.cycle_hair)
    _add_button(layout, "Roupa: trocar", character.cycle_outfit)
    _add_button(layout, "Acessório: trocar", character.cycle_accent)

func _add_button(parent: VBoxContainer, label_text: String, action: Callable) -> void:
    var button := Button.new()
    button.text = label_text
    button.custom_minimum_size = Vector2(188, 36)
    button.pressed.connect(action)
    parent.add_child(button)
