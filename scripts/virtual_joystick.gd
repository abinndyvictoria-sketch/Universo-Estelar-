extends Control

## Joystick virtual para telas sensíveis ao toque.
## Também aceita clique e arraste com o mouse para facilitar testes no computador.

@export var base_radius: float = 68.0
@export var knob_radius: float = 27.0
@export var dead_zone: float = 0.12

var _vector: Vector2 = Vector2.ZERO
var _pointer_active := false
var _active_touch_id := -1
var _mouse_active := false

func _ready() -> void:
    custom_minimum_size = Vector2(180, 180)
    mouse_filter = Control.MOUSE_FILTER_STOP
    queue_redraw()

func get_output() -> Vector2:
    return _vector

func _gui_input(event: InputEvent) -> void:
    if event is InputEventScreenTouch:
        if event.pressed and _active_touch_id == -1:
            _active_touch_id = event.index
            _pointer_active = true
            _update_from_position(event.position)
            accept_event()
        elif not event.pressed and event.index == _active_touch_id:
            _active_touch_id = -1
            _release_stick()
            accept_event()
    elif event is InputEventScreenDrag and event.index == _active_touch_id:
        _update_from_position(event.position)
        accept_event()
    elif event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT:
        if event.pressed:
            _mouse_active = true
            _pointer_active = true
            _update_from_position(event.position)
        else:
            _mouse_active = false
            if _active_touch_id == -1:
                _release_stick()
        accept_event()
    elif event is InputEventMouseMotion and _mouse_active:
        _update_from_position(event.position)
        accept_event()

func _update_from_position(pointer_position: Vector2) -> void:
    var center := size * 0.5
    var offset := pointer_position - center
    if offset.length() > base_radius:
        offset = offset.normalized() * base_radius
    _vector = Vector2(offset.x / base_radius, offset.y / base_radius)
    if _vector.length() < dead_zone:
        _vector = Vector2.ZERO
    queue_redraw()

func _release_stick() -> void:
    _pointer_active = false
    _vector = Vector2.ZERO
    queue_redraw()

func _draw() -> void:
    var center := size * 0.5
    draw_circle(center, base_radius, Color(0.20, 0.22, 0.42, 0.62))
    draw_arc(center, base_radius, 0.0, TAU, 48, Color(0.73, 0.66, 1.0, 0.9), 3.0, true)
    var knob_offset := _vector * base_radius
    var knob_color := Color(0.75, 0.62, 1.0, 0.95) if _pointer_active else Color(0.65, 0.66, 0.82, 0.85)
    draw_circle(center + knob_offset, knob_radius, knob_color)
    draw_arc(center + knob_offset, knob_radius, 0.0, TAU, 32, Color(1, 1, 1, 0.85), 2.0, true)
