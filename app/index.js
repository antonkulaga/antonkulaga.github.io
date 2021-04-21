const Graph = ForceGraphVR()
(document.getElementById('3d-graph'))
    .jsonUrl('./graph/miserables.json')
    .nodeAutoColorBy('group')
    .nodeThreeObject(node => {
        const sprite = new SpriteText(node.id);
        sprite.color = node.color;
        sprite.textHeight = 8;
        return sprite;
    });