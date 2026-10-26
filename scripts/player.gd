extends CharacterBody3D

## Movimento 3D usando joystick virtual no celular e setas/WASD no computador.

@export var move_speed: float = 5.0
@export var rotation_speed: float = 10.0
@export var gravity: float = 18.0

@onready var joystick: Control = get_node_or_null("../MobileControls/Joystick")

func _physics_process(delta: float) -> void:
    var input_2d := Vector2.ZERO

    if joystick != null and joystick.has_method("get_output"):
        input_2d = joystick.get_output()

    if input_2d.length() < 0.01:
        input_2d = Input.get_vector("ui_left", "ui_right", "ui_up", "ui_down")

    var move_dir := Vector3(input_2d.x, 0.0, input_2d.y)

    if move_dir.length_squared() > 0.001:
        move_dir = move_dir.normalized()
        velocity.x = move_dir.x * move_speed
        velocity.z = move_dir.z * move_speed
        var target_rotation := atan2(-move_dir.x, -move_dir.z)
        rotation.y = lerp_angle(rotation.y, target_rotation, rotation_speed * delta)
    else:
        velocity.x = move_toward(velocity.x, 0.0, move_speed * 6.0 * delta)
        velocity.z = move_toward(velocity.z, 0.0, move_speed * 6.0 * delta)

    if not is_on_floor():
        velocity.y -= gravity * delta
    else:
        velocity.y = 0.0

    move_and_slide()
