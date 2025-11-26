// src/WaveScene.jsx
import React, { useRef, useMemo } from 'react';
import { useFrame, Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { Stars } from '@react-three/drei'; // <-- 导入 Stars


const LINE_COUNT = 40;
const POINTS_PER_LINE = 100;
const LINE_WIDTH = 150;
const LINE_DEPTH = 150;

const pseudoRandom = (seed) => {
    const x = Math.sin(seed * 13445.89 + 489.133) * 43758.5453;
    return x - Math.floor(x);
};

function WaveLines() {
    const groupRef = useRef();
    
    // 记忆化创建所有的几何体和线条
    const lines = useMemo(() => {
        const lineObjects = [];
        const whiteLineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });

        for (let i = 0; i < LINE_COUNT; i++) {
            const positions = new Float32Array(POINTS_PER_LINE * 3);
            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            
            const line = new THREE.Line(geometry, whiteLineMaterial);
            line.position.z = (i / LINE_COUNT - 0.5) * LINE_DEPTH;
            line.userData.lineIndex = i; 
            line.userData.phaseOffset = pseudoRandom(i + 1) * Math.PI * 2; 
            
            lineObjects.push(line);
        }
        return lineObjects;
    }, []);

    // 每一帧更新线条位置
    useFrame(({ clock }) => {
        const time = clock.getElapsedTime();
        
        lines.forEach((line) => {
            const lineGeo = line.geometry;
            const positions = lineGeo.attributes.position.array;
            const i = line.userData.lineIndex;
            const phaseOffset = line.userData.phaseOffset;
            
            for (let j = 0; j < POINTS_PER_LINE; j++) {
                const x = (j / POINTS_PER_LINE - 0.5) * LINE_WIDTH;
                const waveSpeed = 2.5 + Math.sin(i * 0.05) * 1.0; 
                const yOffset = Math.sin(x * 0.3 + time * waveSpeed + phaseOffset) * 2;
                
                let y = yOffset * (0.5 + 0.5 * Math.sin(time * 0.5 + i * 0.2));
                
                positions[j * 3 + 0] = x;
                positions[j * 3 + 1] = y * 0.8; 
                positions[j * 3 + 2] = 0; 
            }
            lineGeo.attributes.position.needsUpdate = true;
        });
        
        if (groupRef.current) {
            // 简单呼吸旋转
            groupRef.current.rotation.y = Math.sin(time * 0.1) * 0.05;
        }
    });

    return (
        <group ref={groupRef} position={[0, -15, 0]} rotation={[-Math.PI / 10, 0, 0]}>
            {lines.map((line, index) => (
                <primitive key={index} object={line} />
            ))}
        </group>
    );
}

export default function WaveScene() {
    return (
        <Canvas 
            camera={{ position: [0, 5, 30], fov: 70 }} 
            style={{ 
                position: 'absolute', 
                inset: 0, 
                width: '100vw', 
                height: '100vh', 
                backgroundColor: 'black' 
            }}
            gl={{ antialias: true }}
        >
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1.5} />
            <Stars 
                radius={100} 
                depth={50} 
                count={5000} 
                factor={4} 
                saturation={0} 
                fade 
            />
            <WaveLines />
        </Canvas>
    );
}