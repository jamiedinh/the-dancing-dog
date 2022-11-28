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
    const text = document.querySelector(".text");

    //MUSIC

    //music information variables
    let musicIndex = 1;
    let allMusicIndex = [1,2,3,4,5,6];
    let firstsong = true;
    let mood;

    //randomly choose the song until every song is played
    function chooseSong() {
        if(allMusicIndex.length===0) {
            allMusicIndex = [1,2,3,4,5,6];
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
                //before switch dog state we need to set back to default
                defaultAnimate();
                transition=true;
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

    //this let is to record the state of last frame for transition
    let transition=true;



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
    const ears = []
    let ear_position = [[1,1,1], [1,1,-1]];
    ear_position.forEach (index => {
        index[0] = index[0]*-1;
        index[1] = index[1]*5.5;
        index[2] = index[2]*1;
        const ear = new THREE.Mesh(ear_geometry, ear_material);
        ear.position.set(index[0], index[1], index[2]);
        ears.push(ear);
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
    const eyes = [];
    let eye_position = [[1,1,1], [1,1,-1]];
    eye_position.forEach (index => {
        index[0] = index[0]*-4;
        index[1] = index[1]*4.5;
        index[2] = index[2]*1;
        const eye = new THREE.Mesh(eye_geometry, eye_material);
        eye.position.set(index[0], index[1], index[2]);
        eyes.push(eye);
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
    scene.add(dog_group);

    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 0), 0);
    const helper = new THREE.PlaneHelper( plane, 30, 0x000000 );

    // scene.add(helper);



    //ADD BONE
    let bone;
    const loader = new GLTFLoader();

    loader.load(
        './bone/scene.gltf', (gltf) => {
            gltf.scene.scale.set(0.01,0.01,0.01);
            scene.add(gltf.scene);
            bone = gltf.scene;
        }
    )



    //ADD CHERRY BLOSSOM
    let rain, rainBuffer;
    const rainCount = 1000;
    const textureLoader = new THREE.TextureLoader();

    function addCherryBlossom() {
        rainBuffer = new THREE.BufferGeometry();
        let posRain = new Float32Array(rainCount*3);
        for (let i = 0; i<(rainCount*3); i += 3) {
            posRain[i] = Math.random() * 200 - 100;
            posRain[i+1] = Math.random() * 100 - 40;
            posRain[i+2] = Math.random() * 200 - 100;
        }

        rainBuffer.setAttribute('position', new THREE.BufferAttribute(posRain, 3));
        let rainMaterial = new THREE.PointsMaterial({
            map: textureLoader.load('./image/cherry-blossom.png'),
            size: 3,
            transparent: true
        });
        rain = new THREE.Points(rainBuffer, rainMaterial);
    }

    addCherryBlossom();



    //ANIMATION

    //default state
    function defaultAnimate(time) {
        function defaultRotationSet(time){
            dog_group.rotation.set (Math.PI/4/3, Math.PI/2/3, 0);
        }

        function defaultPositionSet(time){
            head.position.set(-2, 3.75, 0);
            nose.position.set(-4.75, 3.75, 0);
            body.position.set(0,0,0);
            let foot_index = 0;
            feet_position.forEach(index=>{
                feet[foot_index].position.set(index[0],index[1],index[2]);
                foot_index++;
            });
            tail.position.set(4.5, 1, 0);
        }

        defaultRotationSet(time);
        defaultPositionSet(time);

        //remove bone and rain
        function removeElements() {
            if(bone===undefined||bone.parent===null) {
                ;
            } else {
                scene.remove(bone);
            }
            if(rain===undefined||rain.parent===null) {
                ;
            } else {
                scene.remove(rain);
            }
        }

        removeElements();

        //remove mousemove
        function removeMousemove(){
            window.removeEventListener('mousemove', dogLookAt);
            window.removeEventListener('mousemove', boneFollowMouse);
        }

        removeMousemove();
    };
    
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
    function dogLookAt(event) {
        head_group.rotation.y = (event.clientX / window.innerWidth) - 0.5;
        head_group.rotation.x = (event.clientY / window.innerHeight) - 0.5;
    }

    function boneFollowMouse(event) {
        bone.position.x = ((event.clientX / window.innerWidth) - 0.5) * 40;
        bone.position.y = ((event.clientY / window.innerHeight) - 0.5) * -40;
        bone.position.z = 10;
    }

    function hungryAnimate(time) {
        if(transition) {
            scene.add(bone);
            bone.position.set(0,0,10);
            camera.position.set(0,0,50);
            dog_group.rotation.y = Math.PI/2;
        }

        window.addEventListener('mousemove', dogLookAt);
        window.addEventListener('mousemove', boneFollowMouse);

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
        if(transition){
            scene.add(rain);
        }

        //rain fall animation
        function rainFall() {
            const positions = rain.geometry.attributes.position.array;
            for (let i=0; i<(rainCount*3); i += 3) {
                let speed = 0.05;
                positions[i] += Math.random()*0.06 - 0.03;
                positions[i+1] -= speed + Math.random() * 0.05;
                positions[i+2] += Math.random()*0.06 - 0.03;
                if (positions[i+1] < -40) {
                    positions[i+1] = Math.random() * 100 - 40;
                }
                rain.geometry.attributes.position.needsUpdate = true;
            }
        }

        rainFall();

        function headGroupUp(speed, amplitude){
            head_group.rotation.y=Math.PI/80+0*amplitude*Math.sin(speed*time);
            head_group.rotation.x=amplitude*Math.sin(speed*time);
        }

        headGroupUp(0.002, 0.05);
    }

    //bounce statement of the dog
    function bounceAnimate(time){
        function feetBounce(speed, amplitude){
            const phase_array = [0,2,4,6];
            let foot_index = 0;
            feet.forEach(foot =>{
                foot.position.z=feet_position[foot_index][2]+amplitude*Math.sin(speed*time+phase_array[foot_index]);
                foot.position.y=feet_position[foot_index][1]-amplitude*Math.cos(speed*time+phase_array[foot_index]);
                foot_index++;
            })
        }

        feetBounce(0.03,0.5);

        function tailUpDown(speed, amplitude){
            tail.rotation.x = Math.PI+amplitude*Math.sin(speed*time);
        }

        tailUpDown(0.009,0.2);

        function bodyUpDown(speed, amplitude){
            body.rotation.x = Math.PI-amplitude*Math.sin(speed*time);
        }

        bodyUpDown(0.009,0.05);

        function headGroupShake(speed, amplitude){
            head_group.rotation.x = amplitude*Math.sin(speed*time);
            head_group.rotation.y = amplitude*Math.sin(speed*time);
        }

        headGroupShake(0.009, 0.05);
    }
    
    //peaceful state of the dog
    function peacefulAnimate(time){
        function feetSwim(speed, amplitude){
            const phase_array = [0,0,2,2];
            let foot_index = 0;
            feet.forEach(foot =>{
                foot.position.x=1.5*feet_position[foot_index][0]+amplitude*Math.sin(speed*time+phase_array[foot_index]);
                foot.position.y=0.5*feet_position[foot_index][1];
                foot.position.z=1.5*feet_position[foot_index][2]-amplitude*Math.cos(speed*time+phase_array[foot_index]);
                foot_index++;
            })
        }

        feetSwim(0.003,1);

        function bodySwim(speed, amplitude){
            body.rotation.x = Math.PI-0.7*amplitude*Math.sin(0.5*speed*time);
            body.rotation.z = -amplitude*Math.cos(speed*time);
            body.rotation.y = -amplitude*Math.sin(speed*time);
        }

        bodySwim(0.003,0.1);
        
        function tailWave(speed, amplitude){
            tail.rotation.z = amplitude*Math.sin(speed*time);
        }

        tailWave(0.003,0.1);
        
        function earWave(speed, amplitude){
            ears.forEach(ear => {
                if(ear.rotation.y === 0){
                    ear.rotation.z=amplitude*Math.sin(speed*time);
                }else{
                    ear.rotation.x=amplitude*Math.sin(speed*time+1);
                }
            })
        }

        earWave(0.01, 0.1);
        
        function headGroupShake(speed, amplitude){
            head_group.rotation.x = 0.5*amplitude*Math.sin(0.5*speed*time);
            head_group.rotation.z = amplitude*Math.sin(speed*time);
            head_group.rotation.y = amplitude*Math.sin(speed*time);
        }

        headGroupShake(0.003, 0.1);

        function dogSwimFly(speed, amplitude){
            dog_group.position.z = amplitude*Math.sin(speed*time);
            dog_group.position.x = -0.5*amplitude*Math.sin(speed*time)
        }

        dogSwimFly(0.003, 1.5);
    }

    //sorrowful state of the dog
    function sorrowfulAnimate(time){
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
    }



    ///MATCH MOOD AND ANIMATION

    function dogReaction(time){
        requestAnimationFrame(dogReaction);
        if(audioPlay.paused === true){
            // defaultAnimate();
            console.log("default");
        }else{
            text.style.display='none';
            if(mood==="chill"){
                scene.background = new THREE.Color(0xCBF6C5);
                // scene.background = new THREE.Color(0xEAAAA9);
                chillAnimate(time);
                console.log("chill");
            }
            if(mood==="spring"){
                scene.background = new THREE.Color(0x363636);
                springAnimate(time);
                console.log("spring");
            }
            if(mood==="hungry"){
                scene.background = new THREE.Color(0xFED867);
                hungryAnimate(time);
                console.log("hungry");
            }
            if(mood==="bounce"){
                scene.background = new THREE.Color(0xBEF6F6);
                bounceAnimate(time);
                console.log("bounce");
            }
            if(mood==="peaceful"){
                scene.background = new THREE.Color(0xD7EDF9);
                peacefulAnimate(time);
                console.log("peaceful");
            }
            if(mood==="sorrowful"){
                scene.background = new THREE.Color(0xE6DAED);
                sorrowfulAnimate(time);
                console.log("sorrowful");
            }
            transition = false;
        }
        controls.update();
        renderer.render(scene, camera);
    }

    dogReaction();
    
});