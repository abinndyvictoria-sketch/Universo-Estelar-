extends Node3D

## Primeira praça estilizada: caminhos, fonte, árvores, bancos, postes e casas.

func _ready() -> void:
    _paths()
    _fountain()
    _trees()
    _lamps_and_benches()
    _houses()
    _stars()

func _mat(c: Color) -> StandardMaterial3D:
    var m := StandardMaterial3D.new()
    m.albedo_color = c
    m.roughness = 0.8
    return m

func _box(parent: Node3D, n: String, p: Vector3, s: Vector3, c: Color) -> void:
    var node := MeshInstance3D.new()
    node.name = n
    var mesh := BoxMesh.new()
    mesh.size = s
    mesh.material = _mat(c)
    node.mesh = mesh
    node.position = p
    parent.add_child(node)

func _sphere(parent: Node3D, n: String, p: Vector3, s: Vector3, c: Color) -> void:
    var node := MeshInstance3D.new()
    node.name = n
    var mesh := SphereMesh.new()
    mesh.radius = 0.5
    mesh.height = 1.0
    mesh.radial_segments = 12
    mesh.rings = 6
    mesh.material = _mat(c)
    node.mesh = mesh
    node.position = p
    node.scale = s
    parent.add_child(node)

func _cylinder(parent: Node3D, n: String, p: Vector3, r: float, h: float, c: Color) -> void:
    var node := MeshInstance3D.new()
    node.name = n
    var mesh := CylinderMesh.new()
    mesh.top_radius = r
    mesh.bottom_radius = r
    mesh.height = h
    mesh.radial_segments = 12
    mesh.material = _mat(c)
    node.mesh = mesh
    node.position = p
    parent.add_child(node)

func _paths() -> void:
    _box(self, "Caminho_Central", Vector3(0, 0.015, -5), Vector3(3.2, 0.04, 34), Color(0.66, 0.64, 0.82))
    _box(self, "Caminho_Cruzado", Vector3(0, 0.018, 0), Vector3(34, 0.045, 3.2), Color(0.66, 0.64, 0.82))
    _box(self, "Praca_Central", Vector3(0, 0.025, 0), Vector3(9, 0.06, 9), Color(0.76, 0.72, 0.91))
    for i in range(7):
        _box(self, "Laje_%02d" % i, Vector3(0, 0.055, -13.0 + float(i) * 4.0), Vector3(2.5, 0.025, 0.08), Color(0.9, 0.86, 1.0))

func _fountain() -> void:
    _cylinder(self, "Fonte_Base", Vector3(0, 0.18, 0), 1.35, 0.28, Color(0.4, 0.63, 0.92))
    _cylinder(self, "Agua", Vector3(0, 0.34, 0), 1.08, 0.08, Color(0.47, 0.85, 1.0))
    _cylinder(self, "Fonte_Centro", Vector3(0, 0.58, 0), 0.28, 0.42, Color(0.76, 0.68, 1.0))
    _sphere(self, "Cristal_Estelar", Vector3(0, 0.94, 0), Vector3(0.42, 0.55, 0.42), Color(0.78, 0.9, 1.0))
    _sphere(self, "Luz_da_Fonte", Vector3(0, 1.25, 0), Vector3(0.16, 0.16, 0.16), Color(1.0, 0.88, 0.54))

func _trees() -> void:
    var positions := [Vector3(-8,0,-8), Vector3(8,0,-8), Vector3(-8,0,8), Vector3(8,0,8), Vector3(-12,0,-13), Vector3(12,0,-13), Vector3(-12,0,13), Vector3(12,0,13), Vector3(-16,0,-5), Vector3(16,0,5), Vector3(-16,0,8), Vector3(16,0,-8)]
    for i in range(positions.size()):
        var p: Vector3 = positions[i]
        _cylinder(self, "Tronco_%02d" % i, p + Vector3(0,0.72,0), 0.22, 1.45, Color(0.42,0.25,0.22))
        var leaf := Color(0.48,0.78,0.66) if i % 2 == 0 else Color(0.68,0.58,0.88)
        _sphere(self, "Copa_%02d" % i, p + Vector3(0,1.85,0), Vector3(1.45,1.55,1.35), leaf)
        _sphere(self, "Copa_Pequena_%02d" % i, p + Vector3(0.42,2.12,0.08), Vector3(0.72,0.78,0.72), leaf.lightened(0.1))

func _lamps_and_benches() -> void:
    var lamp_positions := [Vector3(-4,0,-4), Vector3(4,0,-4), Vector3(-4,0,4), Vector3(4,0,4), Vector3(-10,0,0), Vector3(10,0,0)]
    for i in range(lamp_positions.size()):
        var p: Vector3 = lamp_positions[i]
        _cylinder(self, "Poste_%02d" % i, p + Vector3(0,1.25,0), 0.07, 2.5, Color(0.31,0.28,0.47))
        _sphere(self, "Luz_%02d" % i, p + Vector3(0,2.58,0), Vector3(0.42,0.42,0.42), Color(1.0,0.86,0.57))
    for i in range(4):
        var x := -5.0 if i % 2 == 0 else 5.0
        var z := -2.8 if i < 2 else 2.8
        var bench := Node3D.new()
        bench.name = "Banco_%02d" % i
        bench.position = Vector3(x,0,z)
        add_child(bench)
        _box(bench, "Assento", Vector3(0,0.48,0), Vector3(1.8,0.16,0.52), Color(0.55,0.36,0.68))
        _box(bench, "Encosto", Vector3(0,0.86,0.22), Vector3(1.8,0.58,0.13), Color(0.72,0.56,0.84))
        _box(bench, "Pe_E", Vector3(-0.65,0.22,0), Vector3(0.12,0.48,0.14), Color(0.30,0.28,0.42))
        _box(bench, "Pe_D", Vector3(0.65,0.22,0), Vector3(0.12,0.48,0.14), Color(0.30,0.28,0.42))

func _houses() -> void:
    _house("Casa_Lilas", Vector3(-11,0,-2), Color(0.72,0.57,0.88), Color(0.42,0.32,0.64))
    _house("Casa_Azul", Vector3(11,0,2), Color(0.52,0.76,0.94), Color(0.34,0.48,0.76))
    _house("Loja_Estelar", Vector3(0,0,-17), Color(0.92,0.72,0.84), Color(0.63,0.38,0.72))

func _house(n: String, p: Vector3, wall: Color, roof: Color) -> void:
    var h := Node3D.new()
    h.name = n
    h.position = p
    add_child(h)
    _box(h, "Parede", Vector3(0,1.3,0), Vector3(4.2,2.6,3.4), wall)
    _box(h, "Telhado", Vector3(0,2.82,0), Vector3(4.65,0.42,3.8), roof)
    _box(h, "Porta", Vector3(0,0.88,-1.73), Vector3(0.92,1.76,0.12), Color(0.35,0.24,0.43))
    _box(h, "Janela_E", Vector3(-1.25,1.62,-1.76), Vector3(0.82,0.76,0.1), Color(0.69,0.91,1.0))
    _box(h, "Janela_D", Vector3(1.25,1.62,-1.76), Vector3(0.82,0.76,0.1), Color(0.69,0.91,1.0))
    _box(h, "Placa", Vector3(0,2.25,-1.82), Vector3(1.45,0.3,0.12), Color(1.0,0.87,0.56))

func _stars() -> void:
    var positions := [Vector3(-5,3.1,-5), Vector3(5,3.3,-5), Vector3(-5,3,5), Vector3(5,3.2,5), Vector3(-13,3.5,5), Vector3(13,3.4,-5)]
    for i in range(positions.size()):
        _sphere(self, "Estrela_%02d" % i, positions[i], Vector3(0.32,0.32,0.32), Color(1.0,0.84,0.52))
