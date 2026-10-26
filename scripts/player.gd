extends CharacterBody3D

## Movimento inicial para testar o protótipo.
## Os controles de toque serão adicionados na próxima etapa.

@export var move_speed: float = 5.0
@export var rotation_speed: float = 10.0
@export var gravity: float = 18.0

@onready var camera_pivot: Node3D = $CameraPivot

func _physics_process(delta: float) -> void:
    var input_2d := Vector2(
        Input.get_action_strength("move_right") - Input.get_action_strength("move_left"),
        Input.get_action_strength("move_back") - Input.get_action_strength("move_forward")
    )

    if input_2d.length() > 1.0:
        input_2d = input_2d.normalized()

    var move_dir := Vector3(input_2d.x, 0.0, input_2d.y)

    if move_dir.length_squared() > 0.001:
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
