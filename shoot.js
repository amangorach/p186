AFRAME.registerComponent("bullets", {
  init: function () {
    this.shootBullet();
  },
  shootBullet: function () {
    window.addEventListener("keydown", (e) => {
      if (e.key === "z") {
        var bullet = document.createElement("a-entity");

        bullet.setAttribute("geometry", {
          primitive: "sphere",
          radius: 0.1,
        });

        bullet.setAttribute("material", "color", "black");

        var cam = document.querySelector("#camera");

        pos = cam.getAttribute("position");

        var parts = document.createElement("a-entity");
        parts.setAttribute("spe-particles", {
          color:"cyan, blue, white, red, purple",
        distribution:"sphere",
        //randomize_velocity:true,
        radius:1,
        //'particle-count':8000,
        velocity:1,
        //'velocity-spread':15,
        //'max-age':2,
        duration:-1,
        size:"1, 1, 1, 0",
        //'active-multiplier':1000
        });
        parts.setAttribute("position", {x:pos.x, y: pos.y, z: 20});
        
        bullet.setAttribute("position", {
          x: pos.x,
          y: pos.y,
          z: pos.z,
        });

        var camera = document.querySelector("#camera").object3D;

        //get the camera direction as Three.js Vector
        var direction = new THREE.Vector3();
        camera.getWorldDirection(direction);
        parts.setAttribute("velocity", direction.multiplyScalar(-10));
        //set the velocity and it's direction
        bullet.setAttribute("velocity", direction.multiplyScalar(-10));
        var scene = document.querySelector("#scene");
        bullet.setAttribute("dynamic-body", {
          shape: "sphere",
          mass:0
        });
        bullet.addEventListener("collide",this.removeBullet)
        scene.appendChild(parts)
        scene.appendChild(bullet);
      }
    });
  },

  removeBullet: function (e) {
    //Original entity (bullet)
    console.log(e.detail.target.el);

    //Other entity, which bullet touched.
    console.log(e.detail.body.el);

    //bullet elemen
    var element = e.detail.target.el

    //element which is hit
    var elementHit = e.detail.body.el

    if (elementHit.id.includes("box")) 
      {
        //set material attribute
        elementHit.setAttribute("material", {
          opacity: 1,
          transparent: true 
        });

        //impulse and point vector
        var impulse = new CANNON.Vec3(-2, 2, 1)
        var worldPoint = new CANNON.Vec3().copy(
          elementHit.getAttribute("position")
        );
        elementHit.body.applyImpulse(impulse, worldPoint)
        //remove event listener
        element.removeEventListener("collide", this.shootBullet) 
        //remove the bullets from the scene
        var scene = document.querySelector("#scene")
        scene.removeChild(element)
    }
  },
});