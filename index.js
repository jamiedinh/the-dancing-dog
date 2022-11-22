//IMPORT LIBRARIES
import * as THREE from './node_modules/three/build/three.module.js';
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from './node_modules/three/examples/jsm/loaders/GLTFLoader.js';


window.addEventListener('DOMContentLoaded',function() {
    //music player elements
    const switchButton = document.querySelector(".shuffle-button");
    const playButton = document.querySelector(".play-button");
    const playIcon = document.querySelector(".play-icon");
    const audioPlay = document.querySelector("#audio-play"); 



    //MUSIC

    //music information variables
    let musicIndex = 1;
    let allMusicIndex = [1,2,3,4];
    let firstsong = true;
    let mood;

    //randomly choose the song until every song is played
    function chooseSong() {
        if(allMusicIndex.length===0) {
            allMusicIndex = [1,2,3,4];
        }
        musicIndex = allMusicIndex.splice(Math.floor(Math.random()*allMusicIndex.length),1);
        console.log(musicIndex);
    }

    //play the current music
    function playMusic(){
        fetch("./music/music-list.json")
            .then((response) => response.json())
            .then((list) => {
                chooseSong();
                console.log(list["track"+musicIndex].uri);
                let musicUri = list["track"+musicIndex].uri;
                audioPlay.setAttribute("src", musicUri);
                mood = list["track"+musicIndex].mood;
                if(firstsong) {
                    audioPlay.pause();
                    firstsong = false;
                } else {
                    playIcon.setAttribute("src","./image/pauseIcon.png");
                }
            });
    }

    //control audio, play a song or stop a song
    function controlSongPlay(){
        console.log(audioPlay.paused);
        console.log("activate");
        if(audioPlay.paused === true){
            audioPlay.play();
            playIcon.setAttribute("src", "./image/pauseIcon.png");
        }else{
            audioPlay.pause();
            playIcon.setAttribute("src", "./image/playIcon.png");
        }
    }

    //choose the first song, then play or switch
    playMusic();
    playIcon.setAttribute("src", "./image/playIcon.png");
    playButton.addEventListener("click", controlSongPlay);
    switchButton.addEventListener("click", playMusic);



    //INIT RENDER, SCENE, CAMERA

    //create Renderer
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({canvas});
    renderer.setSize(innerWidth, innerHeight)
    document.body.appendChild(renderer.domElement);

    //create Camera
    const camera = new THREE.PerspectiveCamera (40, innerWidth/innerHeight, 0.1, 1000);
    camera.position.z = 50;
    camera.lookAt(0, 0, 0);

    //create Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xFFECFB)

    //orbit control
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();

    //add ambient light(soft background light)
    const alight = new THREE.AmbientLight( 0x404040 );
    //create hemisphere light(to make shadow)
    const hlight = new THREE.HemisphereLight( 0xFFFFFF, 0x080820, 1 );
    //add the light
    scene.add(alight);
    scene.add(hlight);



    //CREATE DOG

    //dog group
    const dog_group = new THREE.Group();

    //create body
    const body_geometry = new THREE.BoxGeometry(8, 4, 5);
    const body_material = new THREE.MeshPhongMaterial({color: 0x79543D});
    const body = new THREE.Mesh(body_geometry, body_material);
    dog_group.add(body);

    //head group
    const head_group = new THREE.Group();

    //create head
    const head_geometry = new THREE.BoxGeometry(4, 3.5, 4);
    const head_material = new THREE.MeshPhongMaterial({color: 0x79543D});
    const head = new THREE.Mesh(head_geometry, head_material);
    head.position.set(-2, 3.5, 0);
    head_group.add(head);

    //create mouth
    const mouth_geometry = new THREE.BoxGeometry(1, 1, 2);
    const mouth_material = new THREE.MeshPhongMaterial({color: 0xB49671});
    const mouth = new THREE.Mesh(mouth_geometry, mouth_material);
    mouth.position.set(-4.5, 3, 0);
    head_group.add(mouth);

    //create ear
    const ear_geometry = new THREE.BoxGeometry(1, 1.5, 1);
    const ear_material = new THREE.MeshPhongMaterial({color: 0xB49671});
    let ear_position = [[1,1,1], [1,1,-1]];
    ear_position.forEach (index => {
        index[0] = index[0]*-1;
        index[1] = index[1]*5.5;
        index[2] = index[2]*1;
        const ear = new THREE.Mesh(ear_geometry, ear_material);
        ear.position.set(index[0], index[1], index[2]);
        head_group.add(ear);
    })

    //create nose
    const nose_geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const nose_material = new THREE.MeshPhongMaterial({color: 0x000000});
    const nose = new THREE.Mesh(nose_geometry, nose_material);
    nose.position.set(-4.75, 3.75, 0);
    head_group.add(nose);

    //create eye
    const eye_geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const eye_material = new THREE.MeshPhongMaterial({color: 0x000000});
    let eye_position = [[1,1,1], [1,1,-1]];
    eye_position.forEach (index => {
        index[0] = index[0]*-4;
        index[1] = index[1]*4.5;
        index[2] = index[2]*1;
        const eye = new THREE.Mesh(eye_geometry, eye_material);
        eye.position.set(index[0], index[1], index[2]);
        head_group.add(eye);
    })

    //add head to dog group
    dog_group.add(head_group);

    //create foot
    const feet_geometry = new THREE.BoxGeometry(1, 1, 1);
    const feet_material = new THREE.MeshPhongMaterial({color: 0xB49671});
    // const feet = new THREE.Mesh(feet_geometry, feet_material);
    const feet = [];
    let feet_position = [[1,1,1],[1,1,-1],[-1,1,1],[-1,1,-1]]
    feet_position.forEach (index => {
        index[0] = index[0]*3;
        index[1] = index[1]*-2.5;
        index[2] = index[2]*2;
        const foot = new THREE.Mesh(feet_geometry, feet_material);
        foot.position.set(index[0], index[1], index[2]);
        feet.push(foot);
        dog_group.add(foot);
    })

    //create tail
    const tail_geometry = new THREE.BoxGeometry(1, 1, 1);
    const tail_material = new THREE.MeshPhongMaterial({color: 0xB49671});
    const tail = new THREE.Mesh(tail_geometry, tail_material);
    tail.position.set(4.5, 1, 0);
    dog_group.add(tail);

    //add whole dog to scene
    dog_group.rotation.y = Math.PI/2/3;
    dog_group.rotation.x = Math.PI/4/3;
    scene.add(dog_group);
    


    //ANIMATION
    
    //chill state
    function chillAnimate(time){
        function tailWave(speed, amplitude){
            tail.rotation.z = amplitude*Math.sin(speed*time);
        }

        tailWave(0.01,0.3);

        function bodyWave(speed, amplitude){
            body.rotation.z = -amplitude*Math.sin(speed*time);
        }

        bodyWave(0.01,0.08);

        function headGroupShake(speed, amplitude){
            head_group.rotation.z = amplitude*Math.sin(speed*time);
            head_group.rotation.y = amplitude*Math.sin(speed*time);
        }

        headGroupShake(0.01, 0.08);
    }

    //hungry state
    function hungryAnimate(time) {
        dog_group.rotation.y = Math.PI/2;

        let bone;
        const loader = new GLTFLoader();

        loader.load(
            './bone/scene.gltf', (gltf) => {
                // bone.scene.position.set(-4.5, 3, 0);
                gltf.scene.scale.set(0.01,0.01,0.01);
                scene.add(gltf.scene);
                bone = gltf.scene;
            }
        )

        window.addEventListener('mousemove', (event) => {
            head_group.rotation.y = (event.clientX / window.innerWidth) - 0.5;
            head_group.rotation.x = (event.clientY / window.innerHeight) - 0.5;
        
            bone.position.x = ((event.clientX / window.innerWidth) - 0.5) * 15;
            bone.position.y = ((event.clientY / window.innerHeight) - 0.5) * -15;
        });

        function feetBounce(speed, amplitude){
            const phase_array = [0,2,4,6];
            let foot_index = 0;
            feet.forEach(foot =>{
                foot.position.y=feet_position[foot_index][1]+amplitude*Math.sin(speed*time+phase_array[foot_index]);
                foot.position.z=feet_position[foot_index][2]-amplitude*Math.cos(speed*time+phase_array[foot_index]);
                foot_index++;
            })
        }

        feetBounce(0.03,0.5);
    }

    //spring state
    function springAnimate(time){
        function headGroupDown(speed, amplitude){
            head_group.rotation.x=Math.PI/20+0*amplitude*Math.sin(speed*time);
            head_group.rotation.y=amplitude*Math.sin(speed*time);
        }

        headGroupDown(0.002, 0.05);

        function curlFeet(speed, amplitude){
            let foot_index = 0;
            feet.forEach(foot =>{
                foot.position.x=(1.2+amplitude*Math.sin(speed*time))*feet_position[foot_index][0];
                foot.position.y=0.5*feet_position[foot_index][1];
                foot.position.z=(1.1+amplitude*Math.sin(speed*time))*feet_position[foot_index][2];
                foot_index++;
            })
        }

        curlFeet(0.003, 0.05);

        function downTail(speed, amplitude){
            tail.rotation.x = Math.PI*4/7;
            tail.rotation.z = amplitude*Math.cos(speed*time);
        }

        downTail(0.002, 0.1);

        //rain fall background

        let rain, rainBuffer;
        const rainCount = 1000;
        const textureLoader = new THREE.TextureLoader();

        //create rain drop
        function rainDrop() {
            rainBuffer = new THREE.BufferGeometry();
            let posRain = new Float32Array(rainCount*3);
            for (let i = 0; i<(rainCount*3); i += 3) {
                posRain[i] = Math.random() * 400 - 200;
                posRain[i+1] = Math.random() * 100 - 50;
                posRain[i+2] = Math.random() * 300 - 150;
            }

            rainBuffer.setAttribute('position', new THREE.BufferAttribute(posRain, 3));
            let rainMaterial = new THREE.PointsMaterial({
                map: textureLoader.load('./image/cherry-blossom.png'),
                // color: 0x000000,
                size: 0.5,
                transparent: true
            });
            rain = new THREE.Points(rainBuffer, rainMaterial);
            scene.add(rain);
        }

        //rain fall animation
        function fall() {
            requestAnimationFrame(fall);

            const positions = rain.geometry.attributes.position.array;
            for (let i=0; i<(rainCount*3); i++) {
                positions[i+1] -= 2.0 + Math.random() * 0.1;
                if (positions[i+1] < (-300 * Math.random())) {
                    positions[i+1] = 100;
                }
                rain.geometry.attributes.position.needsUpdate = true;
            }
        }

        rainDrop();
        fall();
    }
    


    ///match mood and animation

    function dogReaction(time){
        requestAnimationFrame(dogReaction);
            if(mood==="chill"){
                //change the background color
                scene.background = new THREE.Color(0x8FBC8F);
                chillAnimate(time);
                console.log("chill");
            }
            if(mood==="spring"){
                //change the background color
                scene.background = new THREE.Color(0xFFECFB);
                // springAnimate();
                console.log("spring");
            }
            if(mood==="hungry"){
                //change the background color
                scene.background = new THREE.Color(0xFED867);
                hungryAnimate(time);
                console.log("hungry");
            }
        controls.update();
        renderer.render(scene, camera);
        }
    dogReaction();

});