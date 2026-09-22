(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,34559,e=>{"use strict";var t=e.i(43476),a=e.i(71645),o=e.i(75056),r=e.i(94800),i=e.i(48546),n=e.i(47071),s=e.i(90072),l=e.i(14047);let u=e=>new s.CatmullRomCurve3(e.map(e=>new s.Vector3(...e)),!1,"centripetal",.5),c={cameraCurve:u([[0,.25,8.6],[0,.18,4],[0,.1,-5.5],[-2.6,.2,-8.9],[2.6,.2,-15.9],[0,.5,-25.4],[0,.5,-30.6]]),targetCurve:u([[0,0,0],[0,0,-1],[0,.05,-11],[-3.4,0,-15.6],[3.4,0,-22.6],[0,.05,-29.8],[0,0,-36.6]]),slots:[{id:"lineup-0",product:0,position:[-2.8,.05,0],rotation:[0,.2,.03],scale:1.5},{id:"lineup-1",product:1,position:[2.8,.05,0],rotation:[0,-.2,-.03],scale:1.5},{id:"flavour-0",product:0,position:[-1.35,0,-15.2],rotation:[0,-.26,.02],scale:1.8},{id:"flavour-1",product:1,position:[1.35,0,-22.2],rotation:[0,.26,-.02],scale:1.8},{id:"finale-0",product:0,position:[-2.6,0,-36.6],rotation:[0,.24,.02],scale:1.5,visible:[.88,2]},{id:"finale-1",product:1,position:[2.6,0,-36.6],rotation:[0,-.24,-.02],scale:1.5,visible:[.88,2]}],fov:38},h={cameraCurve:u([[0,0,5],[.16,.02,3.4],[0,0,1.8],[-.2,.05,-1.5],[0,0,-5],[.2,.05,-8.5],[0,0,-11.6],[-.09,.02,-13.6],[0,0,-19.6],[.09,.02,-21.6],[0,0,-27.5],[0,.02,-32],[0,0,-35.4]]),targetCurve:u([[0,0,-2],[-.06,0,-3.6],[0,0,-5.2],[.07,0,-8.5],[0,0,-12],[-.07,0,-15.5],[0,0,-18.6],[.03,0,-20.6],[0,0,-26.6],[-.03,0,-28.6],[0,0,-34.5],[0,0,-39],[0,0,-42.4]]),slots:[{id:"lineup-0",product:0,position:[-.34,.3,.55],rotation:[0,.28,.03],scale:1.24,visible:[-1,.2]},{id:"lineup-1",product:1,position:[.52,.7,-.55],rotation:[0,-.28,-.03],scale:1.24,visible:[-1,.2]},{id:"flavour-0",product:0,position:[0,.62,-18],rotation:[0,-.16,.02],scale:2.05,visible:[.42,.6],turnOver:[.5,.575]},{id:"flavour-1",product:1,position:[0,.62,-26],rotation:[0,.16,-.02],scale:2.05,visible:[.58,.76],turnOver:[.665,.74]},{id:"finale-0",product:0,position:[-.44,.38,-39.2],rotation:[0,.26,.02],scale:1.62,visible:[.88,2]},{id:"finale-1",product:1,position:[.62,.88,-40.8],rotation:[0,-.26,-.02],scale:1.62,visible:[.88,2]}],fov:60},d=[{at:0,color:"#f5b301"},{at:.33,color:"#f2860d"},{at:.5,color:"#e63324"},{at:.67,color:"#f2860d"},{at:.85,color:"#f5b301"},{at:1,color:"#009b4c"}];var p=e.i(19980),f=e.i(24119);let v=new s.Color("#fff8ee");function m({awake:e,screens:o,grid:i}){let n=(0,a.useMemo)(()=>{let e=document.createElement("video");return e.muted=!0,e.defaultMuted=!0,e.loop=!1,e.playsInline=!0,e.preload="auto",e.crossOrigin="anonymous",e},[]),u=(0,a.useMemo)(()=>{let e=new s.VideoTexture(n);return e.colorSpace=s.SRGBColorSpace,e.minFilter=s.LinearFilter,e.magFilter=s.LinearFilter,e.generateMipmaps=!1,e},[n]),c=(0,a.useMemo)(()=>(function([e,t]){let a,o=e*t,r=new s.PlaneGeometry(1,1),i=new s.InstancedBufferGeometry;i.setIndex(r.index),i.setAttribute("position",r.attributes.position),i.setAttribute("uv",r.attributes.uv),i.instanceCount=o;let n=new Float32Array(2*o),l=new Float32Array(3*o),u=new Float32Array(o),c=(a=70414,()=>(a=(1664525*a+0x3c6ef35f)%0x100000000)/0x100000000);for(let a=0;a<t;a+=1)for(let t=0;t<e;t+=1){let o=a*e+t;n[2*o]=t,n[2*o+1]=a,l[3*o]=(2*c()-1)*2.6,l[3*o+1]=(2*c()-1)*1.7,l[3*o+2]=2.4*c()-.4,u[o]=c()}let h=(e,t)=>new s.InstancedBufferAttribute(e,t);return i.setAttribute("aTile",h(n,2)),i.setAttribute("aScatter",h(l,3)),i.setAttribute("aDelay",h(u,1)),i.boundingSphere=new s.Sphere(new s.Vector3(0,0,0),14),i})(i),[i]),h=(0,a.useMemo)(()=>o.map(e=>(function(e,t,a,[o,r]){return new s.ShaderMaterial({transparent:!0,depthWrite:!1,side:s.DoubleSide,glslVersion:s.GLSL3,uniforms:{uMap:{value:e},uGrid:{value:new s.Vector2(o,r)},uSize:{value:t},uReveal:{value:0},uOpacity:{value:a},uTime:{value:0},uDepth:{value:.2},uFog:{value:v},uContrast:{value:1.08},uSaturation:{value:1.18},uOverlap:{value:1.3}},vertexShader:`
      attribute vec2 aTile;
      attribute vec3 aScatter;
      attribute float aDelay;

      uniform sampler2D uMap;
      uniform vec2 uGrid;
      uniform vec2 uSize;
      uniform float uReveal;
      uniform float uTime;
      uniform float uDepth;
      uniform float uOverlap;

      varying vec2 vUv;
      varying vec2 vLocal;
      varying float vFog;

      void main() {
        vec2 cell = uSize / uGrid;
        vec2 centre = (aTile + 0.5) / uGrid;

        /* One texel per tile, read in the vertex shader: the tile's own
           brightness is what pushes it out of the wall. The level has to
           be named, since a vertex shader has no derivatives to pick a
           mip from. */
        vec3 shot = textureLod(uMap, centre, 0.0).rgb;
        float lum = dot(shot, vec3(0.299, 0.587, 0.114));

        vec2 planar = (centre - 0.5) * uSize;
        /* A shallow bow, so the wall is a surface catching the light
           across it rather than a sticker facing straight out */
        float bow = -(planar.x * planar.x) / (uSize.x * 2.6);

        /* Each tile arrives on its own beat, late ones still travelling
           while the early ones have already locked in */
        float t = clamp((uReveal - aDelay * 0.35) / 0.65, 0.0, 1.0);
        float ease = t * t * (3.0 - 2.0 * t);

        vec3 home = vec3(planar, bow + (lum - 0.5) * uDepth * ease);
        vec3 pos = home + aScatter * (1.0 - ease);
        pos.y += sin(uTime * 0.6 + aDelay * 12.0) * 0.045 * (1.0 - ease);

        /* Tiles start small and grow into their cell, so a loose tile
           reads as a speck of the room and not as a torn-off poster.
           Settled tiles overrun it: see OVERLAP. */
        vec2 quad = position.xy * cell * mix(0.35, uOverlap, ease);

        vec4 mv = modelViewMatrix * vec4(pos + vec3(quad, 0.0), 1.0);
        gl_Position = projectionMatrix * mv;

        /* The uv spills by exactly as much as the quad does, so a tile's
           overrun shows its neighbour's own pixels rather than a stretched
           copy of its own, and the join has nothing to give itself away */
        vUv = (aTile + 0.5 + position.xy * uOverlap) / uGrid;
        /* Where this fragment sits inside the tile's own cell: \xb10.5 is the
           cell edge, anything past it is the overrun. */
        vLocal = position.xy * uOverlap;
        /* Starts further back and never gets far: fog is depth, but every
           point of it is a point of the film turned to cream, and a screen
           is only ever this far away because you are on your way to it.
           Ceiling cut from 0.22 — a fifth of the picture replaced by cream
           was reading as a dirty screen rather than as distance. */
        vFog = clamp((-mv.z - 11.0) / 30.0, 0.0, 0.12);
      }
    `,fragmentShader:`
      /* GLSL ES 3.00 has no built-in fragment output, and three only
         declares one for its own materials. The alias is what the shared
         colorspace chunk below writes through. */
      layout(location = 0) out highp vec4 pc_fragColor;
      #define gl_FragColor pc_fragColor

      uniform sampler2D uMap;
      uniform float uOpacity;
      uniform float uReveal;
      uniform vec3 uFog;
      uniform float uContrast;
      uniform float uSaturation;
      uniform float uOverlap;

      varying vec2 vUv;
      varying vec2 vLocal;
      varying float vFog;

      void main() {
        vec3 shot = texture(uMap, vUv).rgb;

        /* The grade. Saturation swings around the frame's own luminance so
           the cream ceiling and the white plates stay neutral while the
           chilli and turmeric come up; the contrast swings around mid-grey
           so the oil goes darker as the crust goes brighter, which is what
           reads as depth rather than as exposure. */
        float luma = dot(shot, vec3(0.299, 0.587, 0.114));
        shot = mix(vec3(luma), shot, uSaturation);
        shot = clamp((shot - 0.5) * uContrast + 0.5, 0.0, 1.0);

        /* Feathered rather than cut: the film has no frame around it, it
           just stops being there toward the edges of the wall. Written
           the forward way round because GLSL leaves smoothstep undefined
           when its edges are reversed. */
        vec2 edge = abs(vUv - 0.5) * 2.0;
        float fade = 1.0 - smoothstep(0.72, 1.0, max(edge.x, edge.y));

        /* Hand the shared band over.
           Each tile owns its cell outright and gives up its overrun across
           the seam, on a curve whose two halves sum to one — so at every
           point of the band this tile's weight and its neighbour's are
           exactly a whole tile between them. */
        float band = (uOverlap - 1.0) * 0.5;
        vec2 give = vec2(
          1.0 - smoothstep(0.5 - band, 0.5 + band, abs(vLocal.x)),
          1.0 - smoothstep(0.5 - band, 0.5 + band, abs(vLocal.y))
        );
        float weight = give.x * give.y;

        /* Weighting the alpha directly would not do: two layers at half
           strength do not compose to one layer at full, they compose to
           three quarters of it, and the band would go dark instead of
           bright. Transmittance is what multiplies, so the weight belongs
           in the exponent — the pair then leaves exactly (1 - a) behind,
           whatever the split, and the seam has nothing to show. */
        float want = min(uOpacity * uReveal * fade, 0.999);
        float a = 1.0 - pow(1.0 - want, weight);

        /* Well above zero: a screen damping out of its beat would
           otherwise leave a field of near-invisible tiles hanging in the
           corridor behind the next one. */
        if (a < 0.04) discard;

        gl_FragColor = vec4(mix(shot, uFog, vFog), a);
        #include <colorspace_fragment>
      }
    `})})(u,new s.Vector2(e.width,e.width/p.FILM_ASPECT),e.opacity,i)),[u,o,i]),d=(0,a.useRef)(-1),g=(0,a.useRef)(0),w=(0,a.useRef)(0),y=(0,a.useRef)(null),b=(0,a.useRef)([]);return(0,a.useEffect)(()=>{!e||n.getAttribute("src")||(n.setAttribute("src",p.FILM_SRC),n.load())},[e,n]),(0,a.useEffect)(()=>(y.current=n,()=>{for(let e of(y.current=null,n.pause(),n.removeAttribute("src"),n.load(),u.dispose(),c.dispose(),h))e.dispose()}),[n,u,c,h]),(0,r.useFrame)((e,t)=>{let a=l.worldState.progress,r=0,i=0;for(let e=0;e<o.length;e+=1){let t=(0,f.bandOpacity)(a,o[e].band);t>r&&(r=t,i=e)}let n=y.current,u=null!==n&&n.readyState>=2;if(w.current=s.MathUtils.damp(w.current,+!!u,5,t),n&&u){let[e,a]=o[i].segment;g.current+=t;let r=()=>{n.playbackRate=(0,p.segmentRate)(o[i].segment),n.currentTime=e,g.current=0};d.current!==i?(d.current=i,r()):n.seeking||(n.currentTime>=a?r():g.current>.6&&n.currentTime<e-.25&&r()),l.worldState.active&&n.paused?n.play().catch(()=>{}):l.worldState.active||n.paused||n.pause()}for(let e=0;e<o.length;e+=1){let r=b.current[e];if(!r)continue;r.uniforms.uTime.value+=t;let i=(0,f.bandOpacity)(a,o[e].band)*w.current;r.uniforms.uReveal.value=s.MathUtils.damp(r.uniforms.uReveal.value,i,3.5,t)}}),(0,t.jsx)(t.Fragment,{children:o.map((e,a)=>(0,t.jsx)("mesh",{geometry:c,position:e.position,rotation:e.rotation,frustumCulled:!1,renderOrder:-1,children:(0,t.jsx)("primitive",{ref:e=>{b.current[a]=e},object:h[a],attach:"material"})},e.id))})}function g({slot:e,geometry:o,front:i,back:n,accent:u,label:c,onSelect:h}){let d=(0,a.useRef)(null),p=(0,a.useRef)(null),f=(0,a.useRef)(null),[v,m]=(0,a.useState)(!1),w=(0,a.useMemo)(()=>new s.ShaderMaterial({transparent:!0,depthWrite:!1,uniforms:{uColor:{value:new s.Color("#7a3c10")},uFade:{value:1}},vertexShader:`
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,fragmentShader:`
      uniform vec3 uColor;
      uniform float uFade;
      varying vec2 vUv;
      void main() {
        float d = length((vUv - 0.5) * vec2(1.0, 1.35)) * 2.0;
        /* Not smoothstep(1.0, 0.0, d): GLSL leaves the reversed form
           undefined, and some drivers answer zero for all of it. */
        float a = (1.0 - smoothstep(0.0, 1.0, d)) * 0.28 * uFade;
        if (a < 0.005) discard;
        gl_FragColor = vec4(uColor, a);
        #include <colorspace_fragment>
      }
    `}),[]);(0,r.useFrame)((t,a)=>{let o=d.current;if(!o)return;let r=v?.35:1,i=e.turnOver?Math.PI*s.MathUtils.smoothstep(l.worldState.progress,e.turnOver[0],e.turnOver[1]):0,n=e.rotation[1]+i+.26*l.worldState.pointerX*r-(v?.8*e.rotation[1]:0),u=-(.14*l.worldState.pointerY)*r;o.rotation.y=s.MathUtils.damp(o.rotation.y,n,5,a),o.rotation.x=s.MathUtils.damp(o.rotation.x,u,5,a);let c=.045*Math.sin(6e-4*performance.now()+e.position[0]);o.position.y=s.MathUtils.damp(o.position.y,e.position[1]+c+.12*!!v,6,a);let h=e.visible?s.MathUtils.smoothstep(l.worldState.progress,e.visible[0],e.visible[0]+.06)*(1-s.MathUtils.smoothstep(l.worldState.progress,e.visible[1]-.06,e.visible[1])):1,m=e.scale*(v?1.06:1)*h,g=s.MathUtils.damp(o.scale.x,m,6,a);o.scale.setScalar(Math.max(g,1e-4));let w=g/e.scale;f.current&&(f.current.uniforms.uFade.value=w),p.current&&(p.current.intensity=(v?5.5:3.4)*w)});let y=e=>{m(e),document.body.dataset.cursor=e?"pack":""};return(0,t.jsxs)("group",{position:e.position,children:[(0,t.jsx)("pointLight",{ref:p,position:[0,1.5,-1.6],intensity:v?5.5:3.4,distance:7,color:u}),(0,t.jsxs)("group",{ref:d,rotation:e.rotation,scale:e.scale,onPointerOver:e=>{e.stopPropagation(),y(!0)},onPointerOut:()=>y(!1),onClick:e=>{e.stopPropagation(),h()},children:[(0,t.jsx)("mesh",{geometry:o,position:[0,0,.012],children:(0,t.jsx)("meshPhysicalMaterial",{map:i,alphaTest:.5,roughness:.5,clearcoat:.55,clearcoatRoughness:.35})}),(0,t.jsx)("mesh",{geometry:o,rotation:[0,Math.PI,0],position:[0,0,-.012],children:(0,t.jsx)("meshPhysicalMaterial",{map:n,alphaTest:.5,roughness:.5,clearcoat:.55,clearcoatRoughness:.35})})]}),(0,t.jsxs)("mesh",{position:[0,-1.35*e.scale*.62,0],rotation:[-Math.PI/2,0,0],renderOrder:1,children:[(0,t.jsx)("planeGeometry",{args:[2.4*e.scale,1.7*e.scale]}),(0,t.jsx)("primitive",{ref:f,object:w,attach:"material"})]}),(0,t.jsx)("group",{name:c})]})}let w={wide:{flight:c,screens:p.WIDE_SCREENS,grid:[30,17]},tall:{flight:h,screens:p.TALL_SCREENS,grid:[18,10]}};function y({flight:e}){let{cameraCurve:t,targetCurve:o}=e,n=(0,i.useThree)(e=>e.camera),u=(0,a.useRef)(new s.Vector3().copy(t.getPoint(0))),c=(0,a.useRef)(new s.Vector3().copy(o.getPoint(0))),h=(0,a.useRef)(new s.Vector3),d=(0,a.useRef)(0);return(0,r.useFrame)((e,a)=>{let r=s.MathUtils.clamp(l.worldState.progress,0,1);d.current=s.MathUtils.damp(d.current,r,4.5,a),t.getPoint(d.current,h.current),u.current.copy(h.current),u.current.x+=.34*l.worldState.pointerX,u.current.y+=-(.2*l.worldState.pointerY),n.position.copy(u.current),o.getPoint(d.current,h.current),c.current.lerp(h.current,1-Math.exp(-6*a)),n.lookAt(c.current)}),null}function b({mode:e}){let t=(0,i.useThree)(e=>e.camera),o=(0,i.useThree)(e=>e.size.width),r=(0,i.useThree)(e=>e.size.height);return(0,a.useEffect)(()=>{let a="tall"===e?s.MathUtils.clamp(1+(o/r-.5)*.9,1,1.12):1;return a<=1.001?t.clearViewOffset():t.setViewOffset(o*a,r*a,o*(a-1)/2,0,o,r),t.updateProjectionMatrix(),()=>{t.clearViewOffset(),t.updateProjectionMatrix()}},[t,e,o,r]),null}function x(){let e=(0,a.useRef)(null),o=(0,i.useThree)(e=>e.camera),n=(0,a.useMemo)(()=>d.map(e=>({at:e.at,color:new s.Color(e.color)})),[]),u=(0,a.useMemo)(()=>n[0].color.clone(),[n]),c=(0,a.useMemo)(()=>new s.Color,[]);return(0,r.useFrame)((t,a)=>{let r=e.current;if(!r)return;let i=s.MathUtils.clamp(l.worldState.progress,0,1),h=n[0],d=n[n.length-1];for(let e=0;e<n.length-1;e+=1)if(i>=n[e].at&&i<=n[e+1].at){h=n[e],d=n[e+1];break}let p=d.at-h.at||1;c.copy(h.color).lerp(d.color,(i-h.at)/p),u.lerp(c,1-Math.exp(-3*a)),r.color.copy(u),r.position.set(o.position.x,o.position.y+1.6,o.position.z+1.2)}),(0,t.jsx)("pointLight",{ref:e,intensity:6,distance:16,decay:1.4})}function S({packs:e,awake:o,mode:r,onSelect:i}){let{flight:l,screens:u,grid:c}=w[r],h=(0,a.useMemo)(()=>(function(){let e=new s.PlaneGeometry(1,1.4,28,36),t=e.attributes.position;for(let e=0;e<t.count;e+=1){let a=Math.sin(Math.PI*(t.getX(e)+.5))*Math.pow(Math.sin(Math.PI*(t.getY(e)/1.4+.5)),.55);t.setZ(e,.09*a)}return e.computeVertexNormals(),e})(),[]);(0,a.useEffect)(()=>()=>h.dispose(),[h]);let d=(0,a.useMemo)(()=>e.flatMap(e=>[e.front,e.back??e.front]),[e]),p=(0,n.useTexture)(d,e=>{for(let t of Array.isArray(e)?e:[e])t.colorSpace=s.SRGBColorSpace,t.anisotropy=8,t.needsUpdate=!0});return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("ambientLight",{intensity:1.5}),(0,t.jsx)("directionalLight",{position:[4,6,6],intensity:1.05}),(0,t.jsx)("directionalLight",{position:[-5,3,4],intensity:.5,color:"#fff0d8"}),(0,t.jsx)(x,{}),(0,t.jsx)(y,{flight:l}),(0,t.jsx)(b,{mode:r}),(0,t.jsx)(m,{awake:o,screens:u,grid:c}),l.slots.map(a=>{let o=e[a.product];return o?(0,t.jsx)(g,{slot:a,geometry:h,front:p[2*a.product],back:p[2*a.product+1],accent:o.accent,label:o.name,onSelect:()=>i(o.slug)},a.id):null})]})}e.s(["default",0,function({packs:e,awake:r,mode:i,onSelect:n}){let{flight:l}=w[i],u="tall"===i,c=l.cameraCurve.getPoint(0);return(0,t.jsx)(o.Canvas,{frameloop:r?"always":"never",dpr:u?[1,1.75]:[1,2],camera:{position:[c.x,c.y,c.z],fov:l.fov,near:.1,far:120},gl:{alpha:!0,antialias:!0,powerPreference:u?"default":"high-performance",toneMapping:s.NoToneMapping},onCreated:({scene:e})=>{e.fog=new s.FogExp2("#fff8ee",.016)},children:(0,t.jsx)(a.Suspense,{fallback:null,children:(0,t.jsx)(S,{packs:e,awake:r,mode:i,onSelect:n})})})}],34559)},74661,e=>{e.n(e.i(34559))}]);