/**
 * a simple universe bg plugin build with three.js
 * https://github.com/zxdong262/universe
 */
import * as THREE from 'three';
class UniverseBg {
    constructor(opts = {}) {
        this.id = '';
        this.className = '';
        this.starSize = 0.1;
        this.shootingStarSize = 0.2;
        this.starCount = 10000;
        this.shootingStarCount = 30;
        this.starDistance = 100;
        this.shootingStarDistance = 50;
        this.starColor = 0xffffff;
        this.shootingStarColor = 0xffffff;
        this.bgColor = 0x000000;
        this.stars = null;
        this.shootingStars = [];
        Object.assign(this, opts);
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        if (this.id) {
            this.renderer.domElement.setAttribute('id', this.id);
        }
        if (this.className) {
            this.renderer.domElement.classList.add(this.className);
        }
        this.camera.position.z = 5;
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(this.bgColor);
        document.body.appendChild(this.renderer.domElement);
        this.createStars();
        this.createShootingStars();
        this.animate();
    }
    createStars() {
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        const { starSize, starCount, starColor, starDistance } = this;
        for (let i = 0; i < starCount; i++) {
            const x = (Math.random() - 0.5) * starDistance;
            const y = (Math.random() - 0.5) * starDistance;
            const z = (Math.random() - 0.5) * starDistance;
            vertices.push(x, y, z);
        }
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        const material = new THREE.PointsMaterial({ color: starColor, size: starSize });
        this.stars = new THREE.Points(geometry, material);
        this.scene.add(this.stars);
    }
    createShootingStars() {
        const { shootingStarColor, shootingStarDistance, shootingStarSize, shootingStarCount } = this;
        this.shootingStars = [];
        for (let i = 0; i < shootingStarCount; i++) {
            const geometry = new THREE.BufferGeometry();
            const vertices = [0, 0, 0, 0, 0, 0];
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
            const material = new THREE.PointsMaterial({ color: shootingStarColor, size: shootingStarSize });
            const shootingStar = new THREE.Points(geometry, material);
            shootingStar.position.x = (Math.random() - 0.5) * shootingStarDistance;
            shootingStar.position.y = (Math.random() - 0.5) * shootingStarDistance;
            shootingStar.position.z = (Math.random() - 0.5) * shootingStarDistance;
            this.scene.add(shootingStar);
            this.shootingStars.push(shootingStar);
        }
    }
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        if (this.stars) {
            this.stars.rotation.x += 0.0001;
            this.stars.rotation.y += 0.0001;
        }
        this.shootingStars.forEach(star => {
            star.position.x -= 0.05;
            star.position.y -= 0.05;
            star.position.z -= 0.05;
            if (star.position.x < -25) {
                star.position.x = 25;
                star.position.y = (Math.random() - 0.5) * 50;
                star.position.z = (Math.random() - 0.5) * 50;
            }
        });
        this.renderer.render(this.scene, this.camera);
    }
}
export default UniverseBg;
