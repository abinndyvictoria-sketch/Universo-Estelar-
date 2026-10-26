extends Node3D

## Personagem estilizado com cores personalizáveis e aparência salva localmente.

@export var skin_color := Color(1.0, 0.76, 0.67, 1.0)
@export var hair_color := Color(0.20, 0.12, 0.32, 1.0)
@export var outfit_color := Color(0.68, 0.48, 1.0, 1.0)
@export var accent_color := Color(0.48, 0.82, 1.0, 1.0)

var hair_options: Array[Color] = [
    Color(0.20, 0.12, 0.32), Color(0.12, 0.08, 0.16),
    Color(0.38, 0.19, 0.12), Color(0.12, 0.30, 0.48),
    Color(0.48, 0.25, 0.62), Color(0.82, 0.48, 0.22)
]
var outfit_options: Array[Color] = [
    Color(0.68, 0.48, 1.0), Color(0.35, 0.65, 1.0),
    Color(1.0, 0.42, 0.65), Color(0.38, 0.78, 0.62),
    Color(0.18, 0.20, 0.34), Color(1.0, 0.72, 0.30)
]
var accent_options: Array[Color] = [
    Color(0.48, 0.82, 1.0), Color(1.0, 0.78, 0.30),
    Color(1.0, 0.45, 0.72), Color(0.62, 1.0, 0.72),
    Color(1.0, 1.0, 1.0), Color(0.80, 0.58, 1.0)
]
var hair_index := 0
var outfit_index := 0
var accent_index := 0

func _ready() -> void:
    _load_appearance()
    _sync_colors()
    _build_character()

func cycle_hair() -> void:
    hair_index = (hair_index + 1) % hair_options.size()
    _sync_colors()
    _rebuild_character()
    _save_appearance()

func cycle_outfit() -> void:
    outfit_index = (outfit_index + 1) % outfit_options.size()
    _sync_colors()
    _rebuild_character()
    _save_appearance()

func cycle_accent() -> void:
    accent_index = (accent_index + 1) % accent_options.size()
    _sync_colors()
    _rebuild_character()
    _save_appearance()

func _sync_colors() -> void:
    hair_color = hair_options[hair_index]
    outfit_color = outfit_options[outfit_index]
    accent_color = accent_options[accent_index]

func _load_appearance() -> void:
    var config := ConfigFile.new()
    if config.load("user://appearance.cfg") == OK:
        hair_index = clampi(int(config.get_value("appearance", "hair", 0)), 0, hair_options.size() - 1)
        outfit_index = clampi(int(config.get_value("appearance", "outfit", 0)), 0, outfit_options.size() - 1)
        accent_index = clampi(int(config.get_value("appearance", "accent", 0)), 0, accent_options.size() - 1)

func _save_appearance() -> void:
    var config := ConfigFile.new()
    config.set_value("appearance", "hair", hair_index)
    config.set_value("appearance", "outfit", outfit_index)
    config.set_value("appearance", "accent", accent_index)
    var error := config.save("user://appearance.cfg")
    if error != OK:
        push_warning("Não foi possível salvar a aparência do personagem.")

func _rebuild_character() -> void:
    for child in get_children():
        child.queue_free()
    _build_character()

func _material(color: Color) -> StandardMaterial3D:
    var mat := StandardMaterial3D.new()
    mat.albedo_color = color
    mat.roughness = 0.72
    return mat

func _sphere(part_name: String, pos: Vector3, size: Vector3, color: Color) -> MeshInstance3D:
    var part := MeshInstance3D.new()
    part.name = part_name
    var mesh := SphereMesh.new()
    mesh.radius = 0.5
    mesh.height = 1.0
    mesh.radial_segments = 16
    mesh.rings = 8
    mesh.material = _material(color)
    part.mesh = mesh
    part.position = pos
    part.scale = size
    add_child(part)
    return part

func _capsule(part_name: String, pos: Vector3, radius: float, height: float, color: Color) -> MeshInstance3D:
    var part := MeshInstance3D.new()
    part.name = part_name
    var mesh := CapsuleMesh.new()
    mesh.radius = radius
    mesh.height = height
    mesh.radial_segments = 12
    mesh.rings = 6
    mesh.material = _material(color)
    part.mesh = mesh
    part.position = pos
    add_child(part)
    return part

func _build_character() -> void:
    # Pernas e tênis
    _capsule("Perna_Esquerda", Vector3(-0.16, 0.34, 0.0), 0.105, 0.48, skin_color)
    _capsule("Perna_Direita", Vector3(0.16, 0.34, 0.0), 0.105, 0.48, skin_color)
    _sphere("Tenis_Esquerdo", Vector3(-0.16, 0.12, -0.055), Vector3(0.25, 0.14, 0.34), Color(0.92, 0.91, 1.0, 1.0))
    _sphere("Tenis_Direito", Vector3(0.16, 0.12, -0.055), Vector3(0.25, 0.14, 0.34), Color(0.92, 0.91, 1.0, 1.0))

    # Corpo, mangas e braços
    _capsule("Blusa", Vector3(0.0, 0.88, 0.0), 0.25, 0.62, outfit_color)
    _sphere("Detalhe_da_Blusa", Vector3(0.0, 0.91, -0.225), Vector3(0.12, 0.12, 0.035), accent_color)
    _capsule("Braco_Esquerdo", Vector3(-0.31, 0.88, 0.0), 0.085, 0.48, skin_color)
    _capsule("Braco_Direito", Vector3(0.31, 0.88, 0.0), 0.085, 0.48, skin_color)

    # Cabeça e cabelo
    _sphere("Cabeca", Vector3(0.0, 1.55, 0.0), Vector3(0.66, 0.70, 0.58), skin_color)
    _sphere("Cabelo_Base", Vector3(0.0, 1.79, 0.045), Vector3(0.68, 0.36, 0.60), hair_color)
    _sphere("Franja", Vector3(0.0, 1.69, -0.245), Vector3(0.43, 0.20, 0.20), hair_color)
    _sphere("Mecha_Esquerda", Vector3(-0.27, 1.58, -0.18), Vector3(0.18, 0.34, 0.18), hair_color)
    _sphere("Mecha_Direita", Vector3(0.27, 1.58, -0.18), Vector3(0.18, 0.34, 0.18), hair_color)

    # Olhos, brilho e sorriso
    _sphere("Olho_Esquerdo", Vector3(-0.14, 1.55, -0.274), Vector3(0.085, 0.12, 0.045), Color(0.12, 0.09, 0.18, 1.0))
    _sphere("Olho_Direito", Vector3(0.14, 1.55, -0.274), Vector3(0.085, 0.12, 0.045), Color(0.12, 0.09, 0.18, 1.0))
    _sphere("Brilho_Olho_Esquerdo", Vector3(-0.16, 1.59, -0.301), Vector3(0.027, 0.035, 0.015), Color(1, 1, 1, 1))
    _sphere("Brilho_Olho_Direito", Vector3(0.12, 1.59, -0.301), Vector3(0.027, 0.035, 0.015), Color(1, 1, 1, 1))
    _sphere("Bochecha_Esquerda", Vector3(-0.23, 1.45, -0.25), Vector3(0.09, 0.045, 0.025), Color(1.0, 0.48, 0.59, 1.0))
    _sphere("Bochecha_Direita", Vector3(0.23, 1.45, -0.25), Vector3(0.09, 0.045, 0.025), Color(1.0, 0.48, 0.59, 1.0))
    _sphere("Sorriso", Vector3(0.0, 1.405, -0.282), Vector3(0.075, 0.025, 0.018), Color(0.42, 0.16, 0.25, 1.0))

    # Presilha de estrela
    _sphere("Presilha_Estrela_Centro", Vector3(0.25, 1.84, -0.20), Vector3(0.12, 0.12, 0.055), accent_color)
    _sphere("Presilha_Ponta_Cima", Vector3(0.25, 1.93, -0.20), Vector3(0.055, 0.07, 0.04), accent_color)
    _sphere("Presilha_Ponta_Baixo", Vector3(0.25, 1.75, -0.20), Vector3(0.055, 0.07, 0.04), accent_color)
