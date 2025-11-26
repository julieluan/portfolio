import React, { useState, useRef, useMemo, useContext, createContext, useEffect } from 'react';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { Stars, OrbitControls, Float, Html, Trail } from '@react-three/drei';
import * as THREE from 'three';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import portfolioData from './data/portfolioData';

// 扩展 THREE.js 库，使其在 R3F 中可用
extend({ OrbitControls });

// --- 2. TIME CONTEXT & HOOK (时间上下文与 Hook) ---
const TimeContext = createContext({
    globalSpeed: 1.0,
    setGlobalSpeed: () => {},
    setHudText: () => {}
});

const useTime = () => useContext(TimeContext);

// --- 2.5 ROTATING STARS (旋转星空背景) ---
const RotatingStars = ({ globalSpeed }) => {
    const starsRef = useRef();
    
    useFrame(() => {
        if (starsRef.current) {
            // 星空缓慢自转
            starsRef.current.rotation.y += 0.0001 * globalSpeed;
        }
    });
    
    return (
        <group ref={starsRef}>
            <Stars radius={80} depth={60} count={6000} factor={5} saturation={0.5} fade speed={globalSpeed * 0.5} />
        </group>
    );
};

// --- 3. CAMERA CONTROL (相机控制) ---
const CameraControl = ({ targetPosition, autoRotate, activePlanetPosition, forceReset }) => {
    const { camera } = useThree();
    const controlsRef = useRef();
    
    // 焦点目标 (OrbitControls.target)
    const lookAtTarget = useRef(new THREE.Vector3(0, 0, 0)); 
    
    // 相机目标位置（用于切换视图模式）
    const currentCamPos = useRef(new THREE.Vector3(targetPosition[0], targetPosition[1], targetPosition[2])); 

    // 初始化相机位置 (初始加载时，只运行一次)
    useEffect(() => {
        camera.position.set(targetPosition[0], targetPosition[1], targetPosition[2]);
    }, [camera, targetPosition]);
    
    // 强制重置：当收到重置信号时，立即设置相机到目标位置
    useEffect(() => {
        if (forceReset && controlsRef.current) {
            // 立即设置相机位置（不用 lerp）
            camera.position.set(targetPosition[0], targetPosition[1], targetPosition[2]);
            
            // 重置 OrbitControls 到初始状态
            controlsRef.current.target.set(0, 0, 0);
            lookAtTarget.current.set(0, 0, 0);
            
            // 关键：保存并恢复当前距离，强制 OrbitControls 更新内部状态
            controlsRef.current.saveState();
            controlsRef.current.reset();
            controlsRef.current.update();
        }
    }, [forceReset, camera, targetPosition]);

    useFrame(() => {
        // --- 相机位置平滑移动 ---
        currentCamPos.current.set(targetPosition[0], targetPosition[1], targetPosition[2]);
        
        // 相机位置平滑过渡
        const positionLerpSpeed = 0.08; 
        camera.position.lerp(currentCamPos.current, positionLerpSpeed); 
        
        if (controlsRef.current) {
            // --- OrbitControls 焦点目标平滑移动 ---
            if (activePlanetPosition) {
                // FOLLOW MODE: 聚焦时，焦点目标平滑跟踪行星的实时位置
                lookAtTarget.current.lerp(activePlanetPosition, 0.08); 
            } else {
                // CENTER MODE: 退出聚焦时，焦点目标平滑返回到中心 (0, 0, 0)
                lookAtTarget.current.lerp(new THREE.Vector3(0, 0, 0), 0.2);
            }
            
            // 应用目标并更新控制器
            controlsRef.current.target.copy(lookAtTarget.current);
            controlsRef.current.update();
        }
    });

    return (
        <OrbitControls 
            ref={controlsRef} 
            enablePan={false} 
            enableZoom={true} 
            maxDistance={50}
            minDistance={4} 
            maxPolarAngle={Math.PI / 1.5} 
            minPolarAngle={Math.PI / 3}
            autoRotate={autoRotate}
            autoRotateSpeed={0.3} 
        />
    );
};


// --- 4. CORE COMPONENT (中心行星) ---
const Core = ({ theme, onSelectAbout }) => {
  const meshRef = useRef();
  const { globalSpeed } = useTime();
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.003 * globalSpeed;
      meshRef.current.rotation.y += 0.003 * globalSpeed;
    }
  });

  const materialColor = theme === 'dark' ? "#ffffff" : "#222222";
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh
        ref={meshRef}
        scale={1.2}
        onClick={onSelectAbout}
        onPointerOver={() => {
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'default';
        }}
      >
        <icosahedronGeometry args={[1, 1]} /> 
        <meshStandardMaterial 
          color={materialColor} 
          wireframe={true} 
          emissive={materialColor} 
          emissiveIntensity={hovered ? 0.6 : 0.3} 
          transparent 
          opacity={0.8} 
        />
      </mesh>
      <Html distanceFactor={15}>
        <div 
          className="text-2xl font-mono"
          style={{
            color: materialColor, 
            transform: 'translate3d(-50%, -50%, 0)',
            textShadow: hovered ? `0 0 10px ${materialColor}` : 'none',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.3s ease'
          }}>
          ABOUT
        </div>
      </Html>
    </Float>
  );
};

// --- 5. SUB PLANET COMPONENT (二级卫星 - 悬停时停止 + 拖尾) ---
const SubPlanet = ({ radius, color, project, phaseShift, theme, onProjectClick }) => {
    const groupRef = useRef();
    // 卫星尺寸 0.15
    const geometry = useMemo(() => new THREE.OctahedronGeometry(0.15, 0), []);
    const [hovered, setHover] = useState(false);
    const { globalSpeed, setHudText } = useTime();
    
    // 悬停时，effectiveSpeed 为 0，完全停止运动
    const effectiveSpeed = hovered ? 0 : globalSpeed; 
    
    // 二级卫星基础轨道速度 (已放慢)
    const baseSpeed = 0.5; 
    
    // 使用 useRef 累积时间，防止暂停后时间突变
    const timeRef = useRef(0);

    useFrame((state, delta) => {
        // 累积时间，只有 effectiveSpeed > 0 时才累积 (运动中)
        if (effectiveSpeed > 0) {
            // 使用 delta 确保帧率变化时速度稳定
            timeRef.current += delta * baseSpeed * effectiveSpeed;
        }

        const t = timeRef.current + phaseShift; 
        
        if (groupRef.current) {
            // 轨道运动 (只在运动中更新位置)
            if (effectiveSpeed > 0) {
                // 复杂的 Y 轴振动确保轨道是非平面椭圆
                groupRef.current.position.x = Math.cos(t) * radius;
                groupRef.current.position.y = Math.sin(t * 1.5) * (radius * 0.3); 
                groupRef.current.position.z = Math.sin(t) * radius;
            }
            
            // 自转 (只在运动中自转)
            if (effectiveSpeed > 0) {
                groupRef.current.rotation.x += 0.05 * effectiveSpeed;
                groupRef.current.rotation.y += 0.05 * effectiveSpeed;
            }
        }
    });
  
    const baseColor = theme === 'dark' ? "#ffffff" : "#888888";
    const emissive = hovered ? color : baseColor;
    const textColor = theme === 'dark' ? "white" : "black"; 

    return (
      <group ref={groupRef}> 
        {/* 为小星星添加更长的拖尾效果来代表轨道 */}
        <Trail width={0.5} length={15} color={new THREE.Color(color)} attenuation={(t) => t * t}>
            <mesh 
            geometry={geometry}
            onPointerOver={() => { 
                setHover(true); 
                document.body.style.cursor = 'pointer'; 
                setHudText(`Project: ${project.name} // ${project.summary}`);
            }}
            onPointerOut={() => { 
                setHover(false); 
                document.body.style.cursor = 'default';
                setHudText(null); 
            }}
            onClick={(event) => { 
                event.stopPropagation();
                if (onProjectClick) {
                    onProjectClick(project.slug);
                }
            }}
            >
            <meshStandardMaterial 
                color={baseColor} 
                wireframe={true} 
                transparent 
                opacity={hovered ? 1 : 0.4} 
                emissive={emissive}
                emissiveIntensity={hovered ? 1.5 : 0.1}
            />
            </mesh>
        </Trail>
        
        <Html distanceFactor={8} zIndexRange={[100, 0]}>
            <div 
                className="font-mono text-[8px] tracking-widest whitespace-nowrap"
                style={{
                    color: textColor,
                    transform: 'translate3d(-50%, 20px, 0)',
                    pointerEvents: 'none', 
                    userSelect: 'none',
                    letterSpacing: '0.3rem',
                    textTransform: 'uppercase',
                    opacity: hovered ? 1 : 0,
                    transition: 'opacity 0.3s ease',
                }}
            >
                {project.name}
            </div>
        </Html>
        <Html distanceFactor={10} zIndexRange={[100, 0]}>
            <div
                style={{
                    opacity: hovered ? 1 : 0,
                    transition: 'opacity 0.3s ease',
                    transform: 'translate3d(-50%, 50px, 0)',
                    pointerEvents: 'none'
                }}
            >
                <div
                    style={{
                        border: `1px solid ${color}`,
                        boxShadow: hovered ? `0 0 12px ${color}66` : 'none',
                        padding: '6px 10px',
                        background: 'rgba(0,0,0,0.6)',
                        fontSize: '10px',
                        width: '160px',
                        textAlign: 'left',
                        fontFamily: 'Share Tech Mono, monospace'
                    }}
                >
                    <div style={{ opacity: 0.85 }}>{project.summary}</div>
                </div>
            </div>
        </Html>
      </group>
    );
  };

// --- 6. PLANET COMPONENT (一级卫星 - 悬停时停止 + 环绕二级卫星轨道) ---
const Planet = ({ radius, speed, color, label, type, theme, projects, onSelect, initialDelay, started, onProjectClick, activeCategory }) => {
  const groupRef = useRef();
  const planetMeshRef = useRef();
  const [hovered, setHover] = useState(false);
  const { globalSpeed, setHudText } = useTime();
  const isActive = activeCategory === type;

  // 悬停时，effectiveSpeed 为 0，完全停止轨道运动和自转。
  const effectiveSpeed = hovered ? 0 : globalSpeed;
  
  // 使用 useRef 累积时间，防止暂停后时间突变
  const timeRef = useRef(0);
  
  // 初始时间设置
  useEffect(() => {
    timeRef.current = initialDelay;
  }, [initialDelay]);

  useFrame((state, delta) => {
    // 累积时间，只有 effectiveSpeed > 0 时才累积
    if (effectiveSpeed > 0) {
        timeRef.current += delta * speed;
    }
    const t = timeRef.current; 

    // 启动动画：行星从中心扩散出来
    const currentRadius = groupRef.current.position.length();
    const targetRadius = started ? radius : 0;
    
    // 平滑插值到目标半径
    const newRadius = THREE.MathUtils.lerp(currentRadius, targetRadius, 0.05);

    // 计算轨道位置：只有在不悬停时才更新位置 (effectiveSpeed > 0)
    if (effectiveSpeed > 0) {
        groupRef.current.position.x = Math.cos(t) * newRadius;
        groupRef.current.position.z = Math.sin(t) * newRadius;
    }
    
    // 自转特效和缩放
    if (planetMeshRef.current) {
        // 仅在不悬停时自转
        if (effectiveSpeed > 0) {
            // 放慢自转速度: 0.005
            planetMeshRef.current.rotation.y += 0.005 * globalSpeed; 
        }
        
        const targetScale = hovered ? 1.5 : (isActive ? 1.2 : 1);
        // 平滑缩放，与运动无关
        planetMeshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  const handleSelect = (e) => {
    e.stopPropagation();
    onSelect(type, groupRef.current.position); 
    setHudText(`Connected: ${label} orbit. Exploring key projects...`);
  };

  const handlePointerOver = () => {
    setHover(true);
    document.body.style.cursor = 'pointer';
    setHudText(`Orbit: ${label} // Click to focus.`);
  };

  const handlePointerOut = () => {
    setHover(false);
    document.body.style.cursor = 'default';
    if (!isActive) setHudText(null);
  };

  const textColor = theme === 'dark' ? "white" : "black";
  const emissiveIntensity = hovered || isActive ? 0.8 : 0.3; 

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* 主行星 (一级卫星) */}
      <Trail 
        width={1} 
        length={8} 
        color={new THREE.Color(color)} 
        attenuation={(t) => t * t}
      >
        <mesh 
          ref={planetMeshRef}
          onClick={handleSelect}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          <icosahedronGeometry args={[0.4, 0]} />
          <meshStandardMaterial 
              color={color} 
              wireframe={true}
              emissive={color}
              emissiveIntensity={emissiveIntensity}
              transparent
              opacity={hovered || isActive ? 1 : 0.7}
          />
        </mesh>
        <mesh
          onClick={handleSelect}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          <sphereGeometry args={[0.65, 16, 16]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      </Trail>
      
      {/* 嵌套的子项目卫星群 (二级卫星) */}
      <group>
            {/* 渲染二级卫星 */}
            {projects.map((project, index) => (
                <SubPlanet 
                    key={project.name}
                    project={project}
                    radius={1.0} 
                    color={color}
                    phaseShift={(Math.PI * 2 / projects.length) * index}
                    theme={theme}
                    onProjectClick={onProjectClick}
                />
            ))}
      </group>

      {/* 悬浮大标签 */}
      <Html distanceFactor={12} zIndexRange={[100, 0]}>
        <div 
          className="font-mono text-xs font-bold tracking-wider whitespace-nowrap"
          style={{
            color: textColor,
            transform: 'translate3d(-50%, 60px, 0)',
            pointerEvents: 'none', 
            userSelect: 'none',
            opacity: (hovered || isActive) ? 1 : 0, 
            textShadow: (hovered || isActive) ? `0 0 10px ${color}` : 'none', 
            transition: 'opacity 0.3s'
        }}>
          {label}
        </div>
      </Html>
      
    </group>
  );
};


// --- 7. MAIN APP COMPONENT (主应用组件) ---
export default function App() {
  const [theme, setTheme] = useState('dark');
  const [activeCategory, setActiveCategory] = useState(null);
  const [hudText, setHudText] = useState("System: Welcome, builder. Hover to reveal project intel.");
  const [globalSpeed, setGlobalSpeed] = useState(1.0);
  const [started, setStarted] = useState(false); 
  const [autoRotate, setAutoRotate] = useState(true); 
  // 跟踪活动行星的位置 (用于设置 OrbitControls 的目标)
  const [activePlanetPosition, setActivePlanetPosition] = useState(null);
  // 强制重置信号
  const [forceReset, setForceReset] = useState(0); 

  // 初始相机位置和退出后的相机位置（可以设置为不同值来调整视角）
  const initialCamPos = [0, 6, 16]; // 初始加载时的位置
  const [camTarget, setCamTarget] = useState(initialCamPos);

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const handlePlanetSelect = (type, positionRef) => {
    setActiveCategory(type);
    
    // activePlanetPosition 传递给 CameraControl 用于跟踪
    setActivePlanetPosition(positionRef); 

    const pos = positionRef.clone();
    // 聚焦时的相机目标位置：跟随行星，同时保持俯视角度
    const targetPos = [pos.x * 0.5, 3.5, pos.z * 0.5]; 

    setCamTarget(targetPos);
    setAutoRotate(false); 
    setGlobalSpeed(0.5); // 聚焦时减慢全局速度
  };
  
  const handleDisengage = () => {
    setActiveCategory(null);
    
    // 关键修复: 清除跟踪目标，让 CameraControl 的 lookAtTarget 开始 Lerp 回到 (0,0,0)
    setActivePlanetPosition(null); 
    
    // 镜头目标拉回到初始位置
    setCamTarget(initialCamPos); 
    
    // 恢复初始的自转和速度
    setAutoRotate(true); 
    setHudText("System: Returning to main orbital view.");
    setGlobalSpeed(1.0); 
    setForceReset((prev) => prev + 1);
  };

  const handleProjectNavigation = (slug) => {
    if (slug) {
      navigate(`/projects/${slug}`);
    }
  };

  const handleAboutNavigate = () => {
    navigate('/about');
  };

  const bgColor = theme === 'dark' ? '#080808' : '#f0f0f0';
  const uiColor = theme === 'dark' ? '#ffffff' : '#111111';
  const panelBg = theme === 'dark' ? 'rgba(10, 10, 10, 0.85)' : 'rgba(240, 240, 240, 0.85)';
  
  // 一级卫星速度已放慢 (radius 和 speed)
  const planetDataList = [
      { radius: 3.5, speed: 0.25, type: 'design', initialDelay: 0.0 }, // 设计
      { radius: 5.5, speed: 0.15, type: 'tech', initialDelay: 0.5 }, // 技术
      { radius: 7.5, speed: 0.1, type: 'business', initialDelay: 1.0 }, // 商业
  ];

  return (
    <TimeContext.Provider value={{ globalSpeed, setGlobalSpeed, setHudText }}>
      {/* 确保主容器占满整个视口 */}
      <div 
        className="relative w-full font-sans" 
        style={{ height: '100vh', background: bgColor, transition: 'background 0.8s ease' }}
      >
        
        {/* 3D 场景层 */}
        <Canvas 
            // 初始 Canvas 视角设置
            camera={{ position: initialCamPos, fov: 50 }} 
            gl={{ antialias: true }} 
            className="w-full h-full absolute top-0 left-0"
        >
            <CameraControl 
                targetPosition={camTarget} 
                autoRotate={autoRotate} 
                activePlanetPosition={activePlanetPosition}
                forceReset={forceReset}
            /> 
            <fog attach="fog" args={[bgColor, 15, 35]} />
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={1.5} color={uiColor} />
            
            {/* 旋转星空背景 */}
            {theme === 'dark' && <RotatingStars globalSpeed={globalSpeed} />}

            {/* 中心行星 (Core) */}
            <Core theme={theme} onSelectAbout={handleAboutNavigate} />
            
            {/* 渲染一级卫星的同心轨道环 (Primary Orbit Lines) */}
            {planetDataList.map((data, index) => (
                <mesh key={`ring-${index}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                    {/* 增加环的厚度以便更清晰地表达轨道 */}
                    <ringGeometry args={[data.radius - 0.015, data.radius + 0.015, 128]} />
                    <meshBasicMaterial 
                        color={theme === 'dark' ? "#444" : "#ddd"} 
                        opacity={0.3} 
                        transparent 
                        side={THREE.DoubleSide} 
                    />
                </mesh>
            ))}

            {/* 渲染一级卫星 (Planets) */}
            {planetDataList.map(data => (
                <Planet 
                    key={data.type}
                    {...data}
                    color={portfolioData[data.type].color}
                    label={portfolioData[data.type].title}
                    theme={theme}
                    projects={portfolioData[data.type].projects}
                    onSelect={handlePlanetSelect}
                    onProjectClick={handleProjectNavigation}
                    started={started}
                    activeCategory={activeCategory}
                />
            ))}
        </Canvas>

        {/* 2D UI 层 (覆盖在 3D 场景之上) */}
        <div className="absolute inset-0 pointer-events-none p-4 sm:p-8">
            
            {/* 顶部标题和主题切换 */}
            <Motion.div 
                initial={{ opacity: 0, y: -20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 1 }}
                className="flex justify-between items-start pointer-events-auto"
            >
                <div style={{ color: uiColor }} className="font-mono">
                    <h1 className="text-xl sm:text-3xl font-bold tracking-widest">JULIE LUAN</h1>
                    <h2 className="text-sm sm:text-base opacity-70 mt-1">THE MULTIVERSE BUILDER</h2>
                </div>

                <button 
                    className="p-2 rounded-full text-xl sm:text-2xl transition-colors hover:scale-110" 
                    onClick={toggleTheme} 
                    style={{ color: uiColor, borderColor: uiColor }}
                >
                    {theme === 'dark' ? '☀' : '☾'}
                </button>
            </Motion.div>

            {/* HUD Prompt 左下角 */}
            <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 font-mono pointer-events-none max-w-xs">
                <AnimatePresence>
                    {hudText && (
                        <Motion.div
                            key="hud"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.5 }}
                            className="bg-black bg-opacity-70 p-3 rounded-lg border text-sm"
                            style={{ borderColor: uiColor, color: uiColor }}
                        >
                            <span className="text-yellow-400 font-bold mr-1">[{activeCategory ? 'FOCUS' : 'SYSTEM'}]</span> 
                            {hudText}
                        </Motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* 侧边详情面板 */}
            <AnimatePresence>
            {activeCategory && (
                <Motion.div
                    key="detail-panel"
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                    className="fixed right-0 top-0 h-full w-full sm:w-80 p-6 shadow-xl pointer-events-auto flex flex-col"
                    style={{ background: panelBg, color: uiColor, borderLeft: `2px solid ${portfolioData[activeCategory].color}` }}
                >
                    <h3 
                        className="text-2xl font-bold font-mono border-b pb-2 mb-4" 
                        style={{ color: portfolioData[activeCategory].color, borderColor: uiColor + '33' }}
                    >
                        {portfolioData[activeCategory].title} ORBIT
                    </h3>
                    
                    <p className="text-sm mb-6 opacity-80">
                        {portfolioData[activeCategory].desc}
                    </p>
                    
                    <h4 className="text-sm font-semibold mb-3 font-mono tracking-wider text-green-400">PROJECT ORBITS:</h4>
                    <ul className="space-y-2 overflow-y-auto flex-grow">
                        {portfolioData[activeCategory].projects.map(item => (
                            <li key={item.name} className="flex items-start text-sm font-mono opacity-90 hover:text-green-400 transition-colors">
                                <svg className="w-3 h-3 mt-1 mr-2 flex-shrink-0" style={{ fill: portfolioData[activeCategory].color }} viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="6"/>
                                </svg>
                                <div>
                                    <p className='font-bold'>{item.name}</p>
                                    <p className='text-xs opacity-60'>{item.summary}</p>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <button 
                        onClick={handleDisengage}
                        className="mt-6 w-full py-3 rounded-lg font-bold uppercase transition-transform hover:scale-[1.02]"
                        style={{ 
                            backgroundColor: 'rgba(0,0,0,0.6)',
                            border: `1px solid ${portfolioData[activeCategory].color}`,
                            color: portfolioData[activeCategory].color,
                            boxShadow: `0 0 15px ${portfolioData[activeCategory].color}66`
                        }}
                    >
                        DISENGAGE
                    </button>
                </Motion.div>
            )}
            </AnimatePresence>

        </div>
      </div>
    </TimeContext.Provider>
  );
}