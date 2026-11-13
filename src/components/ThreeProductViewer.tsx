/**
 * AtlasForge Sports Nutrition - 3D Product Showcase & Packshot Inspector
 * Matches the signature 250g "Protéine Musculaire" bottle:
 * - Matte black 250g jar body
 * - Clean white label with distinct Forest Green (#1E4D2B) Mountain/Leaf emblem
 * - Matte black knurled screw cap
 * - Interactive 3D Orbit, Exploded Cap Separation, and Studio Packshot view
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RotateCw, Layers, Eye, RefreshCw, ChevronDown, ChevronUp, Sparkles, ShieldCheck, Camera, Box } from 'lucide-react';
import { FlavorOption } from '../types';

interface ThreeProductViewerProps {
  activeFlavor: FlavorOption;
  onFlavorChange?: (flavor: FlavorOption) => void;
  allFlavors?: FlavorOption[];
  onOpenOrderModal?: () => void;
}

export const ThreeProductViewer: React.FC<ThreeProductViewerProps> = ({
  activeFlavor,
  allFlavors = [],
  onFlavorChange,
  onOpenOrderModal,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  // Default to the official product photo as requested ("7at lia nafss photo d product f section 2")
  const [viewMode, setViewMode] = useState<'packshot' | '3d'>('packshot');
  const [selectedPhoto, setSelectedPhoto] = useState<string>('/assets/aistudio/image_789e9c1a.png');
  const [isExploded, setIsExploded] = useState<boolean>(false);
  const [isWireframe, setIsWireframe] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [dockCollapsed, setDockCollapsed] = useState<boolean>(false);
  const [inspectionDetail, setInspectionDetail] = useState<string | null>(null);

  const stateRef = useRef({
    isExploded: false,
    isWireframe: false,
    autoRotate: true,
    capTargetY: 0,
    capCurrentY: 0,
    targetRotationY: 0,
    currentRotationY: 0,
    targetTiltX: 0,
    currentTiltX: 0,
    pointerDown: false,
    prevPointerX: 0,
    prevPointerY: 0,
    materials: [] as THREE.Material[],
    labelTexture: null as THREE.CanvasTexture | null,
    capGroup: null as THREE.Group | null,
    bottleGroup: null as THREE.Group | null,
    powderMesh: null as THREE.Mesh | null,
  });

  useEffect(() => {
    stateRef.current.isExploded = isExploded;
    stateRef.current.capTargetY = isExploded ? 1.6 : 0;
  }, [isExploded]);

  useEffect(() => {
    stateRef.current.isWireframe = isWireframe;
    stateRef.current.materials.forEach((mat) => {
      if ('wireframe' in mat) {
        (mat as THREE.MeshStandardMaterial).wireframe = isWireframe;
        mat.needsUpdate = true;
      }
    });
  }, [isWireframe]);

  useEffect(() => {
    stateRef.current.autoRotate = autoRotate;
  }, [autoRotate]);

  // Procedural 2D Canvas Label Generation (Clean White Label + Forest Green Mountain/Leaf Emblem)
  const updateLabelCanvas = (canvas: HTMLCanvasElement, flavor: FlavorOption) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // 1. Clean Premium White / Soft Ivory Label Background (#FAF9F6)
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, w, h);

    // Subtle natural paper grain tint
    ctx.fillStyle = '#FBFBFA';
    ctx.fillRect(10, 10, w - 20, h - 20);

    // 2. Elegant Corner Brackets [ and ] matching user product image
    const forestGreen = '#1E4D2B';
    ctx.strokeStyle = '#14171A';
    ctx.lineWidth = 4;
    const bracketSize = 35;
    const padX = 140;
    const padY = 80;

    // Top-Left bracket ┌
    ctx.beginPath();
    ctx.moveTo(padX, padY + bracketSize);
    ctx.lineTo(padX, padY);
    ctx.lineTo(padX + bracketSize, padY);
    ctx.stroke();

    // Top-Right bracket ┐
    ctx.beginPath();
    ctx.moveTo(w - padX, padY + bracketSize);
    ctx.lineTo(w - padX, padY);
    ctx.lineTo(w - padX - bracketSize, padY);
    ctx.stroke();

    // 3. Draw Official Forest Green Mountain Logo with "A" cut into peak
    const centerX = w * 0.5;
    const logoY = 175;

    ctx.save();
    ctx.fillStyle = forestGreen;

    // Main Mountain with "A" cutout
    ctx.beginPath();
    ctx.moveTo(centerX, logoY - 75); // Peak tip
    ctx.lineTo(centerX + 65, logoY + 15);
    ctx.lineTo(centerX + 32, logoY + 15);
    ctx.lineTo(centerX, logoY - 32); // inner peak
    ctx.lineTo(centerX - 32, logoY + 15);
    ctx.lineTo(centerX - 65, logoY + 15);
    ctx.closePath();
    ctx.fill();

    // Left Peak
    ctx.beginPath();
    ctx.moveTo(centerX - 42, logoY + 15);
    ctx.lineTo(centerX - 85, logoY - 25);
    ctx.lineTo(centerX - 130, logoY + 15);
    ctx.closePath();
    ctx.fill();

    // Right Peak
    ctx.beginPath();
    ctx.moveTo(centerX + 42, logoY + 15);
    ctx.lineTo(centerX + 85, logoY - 25);
    ctx.lineTo(centerX + 130, logoY + 15);
    ctx.closePath();
    ctx.fill();

    // Horizontal crossbar of "A"
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(centerX - 16, logoY - 8, 32, 7);
    ctx.restore();

    // 4. ATLASFORGE Header Wordmark
    ctx.textAlign = 'center';
    ctx.fillStyle = '#14171A';
    ctx.font = '900 68px "Plus Jakarta Sans", "Outfit", sans-serif';
    ctx.letterSpacing = '3px';
    ctx.fillText('ATLASFORGE', centerX, logoY + 95);

    // Flanked lines for "— SPORTS NUTRITION —"
    ctx.strokeStyle = forestGreen;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(centerX - 240, logoY + 130);
    ctx.lineTo(centerX - 120, logoY + 130);
    ctx.moveTo(centerX + 120, logoY + 130);
    ctx.lineTo(centerX + 240, logoY + 130);
    ctx.stroke();

    ctx.fillStyle = forestGreen;
    ctx.font = '800 21px "Plus Jakarta Sans", sans-serif';
    ctx.letterSpacing = '4px';
    ctx.fillText('SPORTS NUTRITION', centerX, logoY + 137);

    // 5. Large Bold Product Title: PROTÉINE MUSCULAIRE (2 lines)
    ctx.fillStyle = '#111315';
    ctx.font = '900 86px "Plus Jakarta Sans", sans-serif';
    ctx.letterSpacing = '1px';
    ctx.fillText('PROTÉINE', centerX, 440);
    ctx.fillText('MUSCULAIRE', centerX, 530);

    // 6. Arabic Subtitle from the real bottle
    ctx.fillStyle = '#2D3748';
    ctx.font = '600 30px system-ui, -apple-system, sans-serif';
    ctx.fillText('مكمل غذائي عالي الجودة لبناء العضلات والتعافي', centerX, 615);

    // 7. Bottom Footnote Strip: [■] COMPLÉMENT ALIMENTAIRE   250 G [■]
    const footY = 820;
    // Green square 1
    ctx.fillStyle = forestGreen;
    ctx.fillRect(centerX - 220, footY - 20, 26, 26);

    ctx.fillStyle = '#14171A';
    ctx.font = '800 20px "Plus Jakarta Sans", sans-serif';
    ctx.letterSpacing = '2px';
    ctx.fillText('COMPLÉMENT ALIMENTAIRE', centerX - 60, footY);

    ctx.font = '900 22px "Space Mono", monospace';
    ctx.fillText('250 G', centerX + 120, footY);

    // Green square 2
    ctx.fillStyle = forestGreen;
    ctx.fillRect(centerX + 180, footY - 20, 26, 26);

    // 8. Side Ingredients and Directions text (Right Side)
    ctx.textAlign = 'left';
    ctx.fillStyle = '#14171A';
    ctx.font = '800 18px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('INGRÉDIENTS :', w - 380, 280);
    ctx.font = '500 15px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#4A5568';
    ctx.fillText('Protéine de lait', w - 380, 310);
    ctx.fillText('(concentrée)', w - 380, 332);
    ctx.font = '700 15px "Plus Jakarta Sans", sans-serif';
    ctx.fillText("Conseils d'utilisation :", w - 380, 375);
    ctx.font = '500 14px "Plus Jakarta Sans", sans-serif';
    ctx.fillText("Mélanger 30g avec", w - 380, 400);
    ctx.fillText("de l'eau ou du lait.", w - 380, 422);

  };

  useEffect(() => {
    const mount = containerRef.current;
    if (!mount) return;

    // Detect Software WebGL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const width = mount.clientWidth || 600;
    const height = mount.clientHeight || 600;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 50);
    camera.position.set(0, 0.6, 5.2);

    // Environment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight('#ffffff', 1.1);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight('#fffcf5', 2.6);
    keyLight.position.set(4, 5, 4);
    keyLight.castShadow = !isSoftwareGl;
    if (!isSoftwareGl) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    // Warm organic rim fill + subtle natural green reflection
    const forestRim = new THREE.DirectionalLight('#2E7D32', 1.8);
    forestRim.position.set(-4, 3, -3);
    scene.add(forestRim);

    const softFill = new THREE.HemisphereLight('#FFFFFF', '#EAEAEA', 0.9);
    scene.add(softFill);

    // Procedural Texture Canvas
    const labelCanvas = document.createElement('canvas');
    labelCanvas.width = 2048;
    labelCanvas.height = 1024;
    updateLabelCanvas(labelCanvas, activeFlavor);

    const labelTexture = new THREE.CanvasTexture(labelCanvas);
    labelTexture.colorSpace = THREE.SRGBColorSpace;
    labelTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    stateRef.current.labelTexture = labelTexture;

    // Materials:
    // 1. Matte Black Jar Body with White Canvas Label map
    const bottleBodyMat = new THREE.MeshStandardMaterial({
      color: '#FFFFFF', // Clean white background for label
      roughness: 0.32,
      metalness: 0.04,
      map: labelTexture,
    });

    // 2. Matte Black Cap Material
    const blackCapMat = new THREE.MeshStandardMaterial({
      color: '#16181B', // Matte deep charcoal/black
      roughness: 0.42,
      metalness: 0.18,
    });

    // 3. Forest Green Tamper Seal Ring
    const greenSealMat = new THREE.MeshStandardMaterial({
      color: '#1E4D2B',
      roughness: 0.22,
      metalness: 0.7,
    });

    // 4. White Whey Isolate Powder
    const powderMat = new THREE.MeshStandardMaterial({
      color: '#F9F8F5',
      roughness: 0.95,
      metalness: 0.0,
    });

    // 5. Sealed Mouth Foil
    const inductionFoilMat = new THREE.MeshStandardMaterial({
      color: '#E2E8F0',
      roughness: 0.2,
      metalness: 0.85,
    });

    stateRef.current.materials = [
      bottleBodyMat,
      blackCapMat,
      greenSealMat,
      powderMat,
      inductionFoilMat,
    ];

    // Build Model
    const bottleRoot = new THREE.Group();
    bottleRoot.position.set(0, -0.65, 0);
    scene.add(bottleRoot);
    stateRef.current.bottleGroup = bottleRoot;

    // Lathed Jar Silhouette for 250g Jar
    const points: THREE.Vector2[] = [];
    points.push(new THREE.Vector2(0, 0));
    points.push(new THREE.Vector2(0.96, 0.02));
    points.push(new THREE.Vector2(1.02, 0.14));
    points.push(new THREE.Vector2(1.04, 0.6));
    points.push(new THREE.Vector2(1.02, 1.25));
    points.push(new THREE.Vector2(1.04, 1.62));
    points.push(new THREE.Vector2(0.98, 1.95));
    points.push(new THREE.Vector2(0.80, 2.15));
    points.push(new THREE.Vector2(0.78, 2.36));
    points.push(new THREE.Vector2(0.72, 2.36));
    points.push(new THREE.Vector2(0.70, 2.1));
    points.push(new THREE.Vector2(0.70, 0.1));

    const bodyGeo = new THREE.LatheGeometry(points, 64);
    bodyGeo.computeVertexNormals();
    const bodyMesh = new THREE.Mesh(bodyGeo, bottleBodyMat);
    bodyMesh.castShadow = !isSoftwareGl;
    bodyMesh.receiveShadow = !isSoftwareGl;
    bottleRoot.add(bodyMesh);

    // Inner Powder
    const powderGeo = new THREE.CylinderGeometry(0.74, 0.88, 1.4, 32);
    const powderMesh = new THREE.Mesh(powderGeo, powderMat);
    powderMesh.position.set(0, 1.1, 0);
    powderMesh.visible = false;
    bottleRoot.add(powderMesh);
    stateRef.current.powderMesh = powderMesh;

    // Induction Foil on Neck
    const foilGeo = new THREE.CylinderGeometry(0.78, 0.78, 0.02, 32);
    const foilMesh = new THREE.Mesh(foilGeo, inductionFoilMat);
    foilMesh.position.set(0, 2.37, 0);
    bottleRoot.add(foilMesh);

    // Cap Group
    const capGroup = new THREE.Group();
    capGroup.position.set(0, 2.37, 0);
    bottleRoot.add(capGroup);
    stateRef.current.capGroup = capGroup;

    // Forest green tamper ring
    const tamperGeo = new THREE.CylinderGeometry(0.82, 0.82, 0.08, 48);
    const tamperMesh = new THREE.Mesh(tamperGeo, greenSealMat);
    tamperMesh.position.set(0, 0.04, 0);
    capGroup.add(tamperMesh);

    // Outer black cap
    const capOuterGeo = new THREE.CylinderGeometry(0.83, 0.83, 0.44, 64);
    const capOuterMesh = new THREE.Mesh(capOuterGeo, blackCapMat);
    capOuterMesh.position.set(0, 0.29, 0);
    capOuterMesh.castShadow = !isSoftwareGl;
    capGroup.add(capOuterMesh);

    // 36 Knurled Grip Ribs
    const ribCount = 36;
    const ribGeo = new THREE.BoxGeometry(0.016, 0.38, 0.024);
    const ribInstanced = new THREE.InstancedMesh(ribGeo, blackCapMat, ribCount);
    const dummyMat4 = new THREE.Matrix4();
    const dummyQuat = new THREE.Quaternion();
    const dummyPos = new THREE.Vector3();
    const dummyScale = new THREE.Vector3(1, 1, 1);

    for (let i = 0; i < ribCount; i++) {
      const angle = (i / ribCount) * Math.PI * 2;
      const rx = Math.cos(angle) * 0.832;
      const rz = Math.sin(angle) * 0.832;
      dummyPos.set(rx, 0.29, rz);
      dummyQuat.setFromAxisAngle(new THREE.Vector3(0, 1, 0), -angle);
      dummyMat4.compose(dummyPos, dummyQuat, dummyScale);
      ribInstanced.setMatrixAt(i, dummyMat4);
    }
    ribInstanced.instanceMatrix.needsUpdate = true;
    capGroup.add(ribInstanced);

    // Cap Top with embossed green emblem ring
    const capTopGeo = new THREE.CylinderGeometry(0.81, 0.83, 0.04, 48);
    const capTopMesh = new THREE.Mesh(capTopGeo, blackCapMat);
    capTopMesh.position.set(0, 0.53, 0);
    capGroup.add(capTopMesh);

    const emblemGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.02, 32);
    const emblemMesh = new THREE.Mesh(emblemGeo, greenSealMat);
    emblemMesh.position.set(0, 0.55, 0);
    capGroup.add(emblemMesh);

    // Soft Contact Shadow Plane
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext('2d');
    if (sCtx) {
      const grad = sCtx.createRadialGradient(128, 128, 10, 128, 128, 120);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0.45)');
      grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.15)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 256, 256);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowGeo = new THREE.PlaneGeometry(3.2, 3.2);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.5,
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.set(0, 0.01, 0);
    bottleRoot.add(shadowPlane);

    // Pointer events
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      stateRef.current.pointerDown = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      stateRef.current.prevPointerX = clientX;
      stateRef.current.prevPointerY = clientY;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      if (stateRef.current.pointerDown) {
        const deltaX = clientX - stateRef.current.prevPointerX;
        const deltaY = clientY - stateRef.current.prevPointerY;
        stateRef.current.targetRotationY += deltaX * 0.012;
        stateRef.current.targetTiltX = Math.max(
          -0.3,
          Math.min(0.4, stateRef.current.targetTiltX + deltaY * 0.008)
        );
        stateRef.current.prevPointerX = clientX;
        stateRef.current.prevPointerY = clientY;
      } else {
        const rect = mount.getBoundingClientRect();
        const normY = (clientY - rect.top) / rect.height - 0.5;
        stateRef.current.targetTiltX = normY * 0.22;
      }
    };

    const onPointerUp = () => {
      stateRef.current.pointerDown = false;
    };

    const onScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      stateRef.current.targetRotationY = scrollY * 0.0022;
    };

    const domCanvas = renderer.domElement;
    domCanvas.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    domCanvas.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);
    window.addEventListener('scroll', onScroll, { passive: true });

    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    let frameId = 0;
    const clock = new THREE.Clock();

    function tick() {
      const delta = Math.min(clock.getDelta(), 0.1);

      if (stateRef.current.autoRotate && !stateRef.current.pointerDown) {
        stateRef.current.targetRotationY += 0.42 * delta;
      }

      stateRef.current.currentRotationY = THREE.MathUtils.damp(
        stateRef.current.currentRotationY,
        stateRef.current.targetRotationY,
        8,
        delta
      );
      stateRef.current.currentTiltX = THREE.MathUtils.damp(
        stateRef.current.currentTiltX,
        stateRef.current.targetTiltX,
        6,
        delta
      );
      stateRef.current.capCurrentY = THREE.MathUtils.damp(
        stateRef.current.capCurrentY,
        stateRef.current.capTargetY,
        7,
        delta
      );

      if (stateRef.current.bottleGroup) {
        stateRef.current.bottleGroup.rotation.y = stateRef.current.currentRotationY;
        stateRef.current.bottleGroup.rotation.x = stateRef.current.currentTiltX;
      }

      if (stateRef.current.capGroup) {
        stateRef.current.capGroup.position.y = 2.37 + stateRef.current.capCurrentY;
        stateRef.current.capGroup.rotation.z = stateRef.current.capCurrentY * 0.08;
      }

      if (stateRef.current.powderMesh) {
        stateRef.current.powderMesh.visible = stateRef.current.capCurrentY > 0.4;
      }

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        frameId = window.setTimeout(tick, 30);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      domCanvas.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      domCanvas.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', handleResize);

      bodyGeo.dispose();
      powderGeo.dispose();
      foilGeo.dispose();
      tamperGeo.dispose();
      capOuterGeo.dispose();
      ribGeo.dispose();
      capTopGeo.dispose();
      emblemGeo.dispose();
      shadowGeo.dispose();
      shadowTex.dispose();
      labelTexture.dispose();

      stateRef.current.materials.forEach((m) => m.dispose());
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  const handleResetView = useCallback(() => {
    stateRef.current.targetRotationY = 0;
    stateRef.current.targetTiltX = 0;
    setIsExploded(false);
    setIsWireframe(false);
  }, []);

  return (
    <div className="relative w-full h-[520px] sm:h-[600px] lg:h-[680px] bg-gradient-to-b from-[#FFFFFF] via-[#F8F9FA] to-[#F1F3F5] rounded-2xl overflow-hidden border border-slate-200/90 shadow-lg flex items-center justify-center">
      {/* 1. Header Badges & View Switcher */}
      <div className="absolute top-5 left-5 z-20 pointer-events-auto">
        <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#1E4D2B] font-bold uppercase">
          <span>ATLASFORGE BIO-LAB</span>
          <span className="text-slate-300">·</span>
          <span>250G PURITÉ NATURELLE</span>
        </div>
        <h2 className="text-sm font-bold text-slate-800 tracking-wide mt-1 font-serif-heading">
          Protéine Musculaire · Flacon Noir & Étiquette Blanche
        </h2>

        {/* View Mode Switcher: 3D vs Packshot */}
        <div className="flex items-center gap-1 mt-3 bg-white/90 p-1 rounded-xl border border-slate-200 shadow-sm backdrop-blur-sm">
          <button
            onClick={() => setViewMode('3d')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
              viewMode === '3d'
                ? 'bg-[#1E4D2B] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>3D Interactif</span>
          </button>
          <button
            onClick={() => setViewMode('packshot')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
              viewMode === 'packshot'
                ? 'bg-[#1E4D2B] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Photo Studio</span>
          </button>
        </div>
      </div>

      {/* 2. Hotspots / Badges (Right Flank) */}
      <div className="absolute top-5 right-5 z-20 hidden sm:flex flex-col gap-2 pointer-events-auto">
        <button
          onClick={() =>
            setInspectionDetail(
              inspectionDetail === 'bio'
                ? null
                : 'Isolat de lactosérum natif certifié issu d’élevages en pâturage. Extraction à froid sans solvant chimique.'
            )
          }
          className="text-left px-3 py-1.5 rounded-xl bg-white/95 hover:bg-white border border-slate-200 hover:border-[#1E4D2B] text-xs transition-colors shadow-xs"
        >
          <div className="flex items-center gap-1.5 text-[#1E4D2B] font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>100% Bio & Pureté</span>
          </div>
        </button>

        <button
          onClick={() =>
            setInspectionDetail(
              inspectionDetail === 'packaging'
                ? null
                : 'Flacon noir mat anti-UV 250g préservant l’intégrité des peptides d’acides aminés contre l’oxydation solaire.'
            )
          }
          className="text-left px-3 py-1.5 rounded-xl bg-white/95 hover:bg-white border border-slate-200 hover:border-[#1E4D2B] text-xs transition-colors shadow-xs"
        >
          <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-[#1E4D2B]" />
            <span>Packaging 250g Anti-UV</span>
          </div>
        </button>

        {inspectionDetail && (
          <div className="p-3 bg-white/95 border border-[#1E4D2B]/30 rounded-xl text-xs text-slate-700 max-w-xs shadow-lg backdrop-blur-md">
            <p className="leading-relaxed">{inspectionDetail}</p>
            <button
              onClick={() => setInspectionDetail(null)}
              className="text-[10px] text-[#1E4D2B] font-bold underline mt-2 block"
            >
              Fermer
            </button>
          </div>
        )}
      </div>

      {/* 3. Central Viewer Display */}
      {viewMode === '3d' ? (
        <div
          ref={containerRef}
          className="w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center touch-none"
          title="Faites pivoter la bouteille 3D avec le curseur"
        />
      ) : (
        /* Packshot Photo Studio Mode - Exact User Product Bottle */
        <div className="relative w-full h-full flex flex-col items-center justify-center p-6 sm:p-8 bg-gradient-to-b from-[#FAF9F7] via-[#F4F4F6] to-[#ECEEF1] animate-fade-in group overflow-hidden">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(30,77,43,0.06)_0%,transparent_70%)] pointer-events-none" />

          {/* Centered High-Res Packshot */}
          <div className="relative z-10 flex items-center justify-center h-full max-h-[82%] w-full">
            <img
              src={selectedPhoto}
              alt="AtlasForge Protéine Musculaire 250g - Flacon officiel"
              className="max-h-full max-w-[90%] object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.22)] transition-all duration-700 ease-out group-hover:scale-[1.03] group-hover:-translate-y-1"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Bottom Control Bar in Packshot Mode: Photo Selector + 3D Animation Switch */}
          <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
            {/* Left: Product Label Badge */}
            <div className="flex items-center gap-2.5 text-xs text-slate-700 bg-white/95 px-3 py-1.5 rounded-xl border border-slate-200/90 shadow-sm backdrop-blur-md">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1E4D2B] animate-pulse" />
              <span className="font-semibold text-slate-900 font-serif-heading">Flacon Officiel 250g</span>
              <span className="text-slate-300 font-mono">·</span>
              <span className="text-[#1E4D2B] font-mono text-[11px] font-bold">مكمل غذائي عالي الجودة</span>
            </div>

            {/* Center/Right: Photo Angle Switcher & 3D Rotate Button */}
            <div className="flex items-center gap-2 bg-white/95 p-1 rounded-xl border border-slate-200/90 shadow-sm backdrop-blur-md">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1 hidden sm:inline">Angles:</span>
              
              <button
                onClick={() => setSelectedPhoto('/assets/aistudio/image_789e9c1a.png')}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  selectedPhoto === '/assets/aistudio/image_789e9c1a.png'
                    ? 'bg-[#1E4D2B] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 bg-slate-50 border border-slate-200'
                }`}
                title="Photo 1 : Vital Boost Protein"
              >
                <span>Vue 1</span>
              </button>

              <button
                onClick={() => setSelectedPhoto('/assets/aistudio/bazili_c898db13.png')}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  selectedPhoto === '/assets/aistudio/bazili_c898db13.png'
                    ? 'bg-[#1E4D2B] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 bg-slate-50 border border-slate-200'
                }`}
                title="Photo 2 : Protéine Musculaire"
              >
                <span>Vue 2</span>
              </button>

              <div className="h-4 w-px bg-slate-200 mx-0.5" />

              <button
                onClick={() => setViewMode('3d')}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-[#1E4D2B] hover:text-[#163a20] bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-200 rounded-lg transition-all shadow-xs"
                title="Activer la rotation 3D interactive à 360°"
              >
                <RotateCw className="w-3.5 h-3.5 animate-spin-slow" />
                <span>Animation 3D (360°)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Sleek Unified Collapsible Bottom Dock (Zero Viewport Occlusion) */}
      {viewMode === '3d' && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 w-full max-w-2xl px-4 pointer-events-auto">
          <div className="flex justify-center mb-1.5">
            <button
              onClick={() => setDockCollapsed(!dockCollapsed)}
              className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 bg-white/90 hover:bg-white border border-slate-200 rounded-full transition-all shadow-xs"
            >
              {dockCollapsed ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5 text-[#1E4D2B]" />
                  <span>Afficher les Contrôles 3D</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  <span>Masquer les Contrôles (Mode Zen)</span>
                </>
              )}
            </button>
          </div>

          {!dockCollapsed && (
            <div className="bg-white/95 border border-slate-200 rounded-xl p-2.5 shadow-lg backdrop-blur-md flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setAutoRotate(!autoRotate)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    autoRotate
                      ? 'bg-[#1E4D2B]/10 text-[#1E4D2B] border border-[#1E4D2B]/30 font-bold'
                      : 'text-slate-600 hover:text-slate-900 bg-slate-50 border border-slate-200'
                  }`}
                  title="Activer / désactiver la rotation 360°"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>360° Auto</span>
                </button>

                <button
                  onClick={() => setIsExploded(!isExploded)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    isExploded
                      ? 'bg-[#1E4D2B]/10 text-[#1E4D2B] border border-[#1E4D2B]/30 font-bold'
                      : 'text-slate-600 hover:text-slate-900 bg-slate-50 border border-slate-200'
                  }`}
                  title="Soulever le bouchon noir et inspecter l’intérieur"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Vue Éclatée</span>
                </button>

                <button
                  onClick={() => setIsWireframe(!isWireframe)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    isWireframe
                      ? 'bg-[#1E4D2B]/10 text-[#1E4D2B] border border-[#1E4D2B]/30 font-bold'
                      : 'text-slate-600 hover:text-slate-900 bg-slate-50 border border-slate-200'
                  }`}
                  title="Maillage filaire 3D"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Maillage</span>
                </button>

                <button
                  onClick={handleResetView}
                  className="p-1.5 text-slate-500 hover:text-slate-900 bg-slate-50 border border-slate-200 rounded-lg"
                  title="Réinitialiser l'angle"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Flavor Selector in Dock */}
              {allFlavors.length > 0 && onFlavorChange && (
                <div className="flex items-center gap-1.5 border-l border-slate-200 pl-2">
                  <span className="text-[11px] text-slate-400 hidden lg:inline mr-1">Saveurs:</span>
                  {allFlavors.map((flavor) => {
                    const isSelected = flavor.id === activeFlavor.id;
                    return (
                      <button
                        key={flavor.id}
                        onClick={() => onFlavorChange(flavor)}
                        className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium transition-all ${
                          isSelected
                            ? 'bg-[#1E4D2B] text-white font-semibold shadow-xs'
                            : 'text-slate-700 hover:text-slate-900 bg-slate-100 border border-slate-200'
                        }`}
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: flavor.accentColor }}
                        />
                        <span className="truncate max-w-[85px]">{flavor.name.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {onOpenOrderModal && (
                <button
                  onClick={onOpenOrderModal}
                  className="px-3 py-1.5 bg-[#1E4D2B] hover:bg-[#163a20] text-white text-xs font-bold rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  Commander 250g
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
