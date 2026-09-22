(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,52134,e=>{"use strict";var t=e.i(43476),r=e.i(71645),i=e.i(75056),a=e.i(94800);function n(){return(n=Object.assign.bind()).apply(null,arguments)}var s=e.i(90072),u=e.i(48546);let o={uniforms:{tDiffuse:{value:null},h:{value:1/512}},vertexShader:`
      varying vec2 vUv;

      void main() {

        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

      }
  `,fragmentShader:`
    uniform sampler2D tDiffuse;
    uniform float h;

    varying vec2 vUv;

    void main() {

    	vec4 sum = vec4( 0.0 );

    	sum += texture2D( tDiffuse, vec2( vUv.x - 4.0 * h, vUv.y ) ) * 0.051;
    	sum += texture2D( tDiffuse, vec2( vUv.x - 3.0 * h, vUv.y ) ) * 0.0918;
    	sum += texture2D( tDiffuse, vec2( vUv.x - 2.0 * h, vUv.y ) ) * 0.12245;
    	sum += texture2D( tDiffuse, vec2( vUv.x - 1.0 * h, vUv.y ) ) * 0.1531;
    	sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;
    	sum += texture2D( tDiffuse, vec2( vUv.x + 1.0 * h, vUv.y ) ) * 0.1531;
    	sum += texture2D( tDiffuse, vec2( vUv.x + 2.0 * h, vUv.y ) ) * 0.12245;
    	sum += texture2D( tDiffuse, vec2( vUv.x + 3.0 * h, vUv.y ) ) * 0.0918;
    	sum += texture2D( tDiffuse, vec2( vUv.x + 4.0 * h, vUv.y ) ) * 0.051;

    	gl_FragColor = sum;

    }
  `},v={uniforms:{tDiffuse:{value:null},v:{value:1/512}},vertexShader:`
    varying vec2 vUv;

    void main() {

      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

    }
  `,fragmentShader:`

  uniform sampler2D tDiffuse;
  uniform float v;

  varying vec2 vUv;

  void main() {

    vec4 sum = vec4( 0.0 );

    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 4.0 * v ) ) * 0.051;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 3.0 * v ) ) * 0.0918;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 2.0 * v ) ) * 0.12245;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 1.0 * v ) ) * 0.1531;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 1.0 * v ) ) * 0.1531;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 2.0 * v ) ) * 0.12245;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 3.0 * v ) ) * 0.0918;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 4.0 * v ) ) * 0.051;

    gl_FragColor = sum;

  }
  `},l=r.forwardRef(({scale:e=10,frames:t=1/0,opacity:i=1,width:l=1,height:c=1,blur:f=1,near:m=0,far:h=10,resolution:d=512,smooth:p=!0,color:x="#000000",depthWrite:g=!1,renderOrder:y,...U},D)=>{let M,b,j=r.useRef(null),R=(0,u.useThree)(e=>e.scene),T=(0,u.useThree)(e=>e.gl),w=r.useRef(null);l*=Array.isArray(e)?e[0]:e||1,c*=Array.isArray(e)?e[1]:e||1;let[P,S,I,C,A,E,k]=r.useMemo(()=>{let e=new s.WebGLRenderTarget(d,d),t=new s.WebGLRenderTarget(d,d);t.texture.generateMipmaps=e.texture.generateMipmaps=!1;let r=new s.PlaneGeometry(l,c).rotateX(Math.PI/2),i=new s.Mesh(r),a=new s.MeshDepthMaterial;a.depthTest=a.depthWrite=!1,a.onBeforeCompile=e=>{e.uniforms={...e.uniforms,ucolor:{value:new s.Color(x)}},e.fragmentShader=e.fragmentShader.replace("void main() {",`uniform vec3 ucolor;
           void main() {
          `),e.fragmentShader=e.fragmentShader.replace("vec4( vec3( 1.0 - fragCoordZ ), opacity );","vec4( ucolor * fragCoordZ * 2.0, ( 1.0 - fragCoordZ ) * 1.0 );")};let n=new s.ShaderMaterial(o),u=new s.ShaderMaterial(v);return u.depthTest=n.depthTest=!1,[e,r,a,i,n,u,t]},[d,l,c,e,x]),L=e=>{C.visible=!0,C.material=A,A.uniforms.tDiffuse.value=P.texture,A.uniforms.h.value=e/256,T.setRenderTarget(k),T.render(C,w.current),C.material=E,E.uniforms.tDiffuse.value=k.texture,E.uniforms.v.value=e/256,T.setRenderTarget(P),T.render(C,w.current),C.visible=!1},B=0;return(0,a.useFrame)(()=>{w.current&&(t===1/0||B<t)&&(B++,M=R.background,b=R.overrideMaterial,j.current.visible=!1,R.background=null,R.overrideMaterial=I,T.setRenderTarget(P),T.render(R,w.current),L(f),p&&L(.4*f),T.setRenderTarget(null),j.current.visible=!0,R.overrideMaterial=b,R.background=M)}),r.useImperativeHandle(D,()=>j.current,[]),r.createElement("group",n({"rotation-x":Math.PI/2},U,{ref:j}),r.createElement("mesh",{renderOrder:y,geometry:S,scale:[1,-1,1],rotation:[-Math.PI/2,0,0]},r.createElement("meshBasicMaterial",{transparent:!0,map:P.texture,opacity:i,depthWrite:g})),r.createElement("orthographicCamera",{ref:w,args:[-l/2,l/2,c/2,-c/2,m,h]}))}),c=r.forwardRef(({children:e,enabled:t=!0,speed:i=1,rotationIntensity:n=1,floatIntensity:u=1,floatingRange:o=[-.1,.1],autoInvalidate:v=!1,...l},c)=>{let f=r.useRef(null);r.useImperativeHandle(c,()=>f.current,[]);let m=r.useRef(1e4*Math.random());return(0,a.useFrame)(e=>{var r,a;if(!t||0===i)return;v&&e.invalidate();let l=m.current+e.clock.elapsedTime;f.current.rotation.x=Math.cos(l/4*i)/8*n,f.current.rotation.y=Math.sin(l/4*i)/8*n,f.current.rotation.z=Math.sin(l/4*i)/20*n;let c=Math.sin(l/4*i)/10;c=s.MathUtils.mapLinear(c,-.1,.1,null!=(r=null==o?void 0:o[0])?r:-.1,null!=(a=null==o?void 0:o[1])?a:.1),f.current.position.y=c*u,f.current.updateMatrix()}),r.createElement("group",l,r.createElement("group",{ref:f,matrixAutoUpdate:!1},e))});var f=e.i(47071);function m({front:e,back:i,onSelect:a}){let[n,u=n]=(0,f.useTexture)(i?[e,i]:[e],e=>{for(let t of Array.isArray(e)?e:[e])t.colorSpace=s.SRGBColorSpace,t.anisotropy=8,t.needsUpdate=!0}),o=(0,r.useMemo)(()=>{let e=new s.PlaneGeometry(1,1.4,28,36),t=e.attributes.position;for(let e=0;e<t.count;e+=1){let r=Math.sin(Math.PI*(t.getX(e)+.5))*Math.pow(Math.sin(Math.PI*(t.getY(e)/1.4+.5)),.55);t.setZ(e,.09*r)}return e.computeVertexNormals(),e},[]);return(0,r.useEffect)(()=>()=>o.dispose(),[o]),(0,t.jsxs)("group",{onClick:e=>{a&&!(e.delta>4)&&(e.stopPropagation(),a())},children:[(0,t.jsx)("mesh",{geometry:o,position:[0,0,.012],children:(0,t.jsx)("meshPhysicalMaterial",{map:n,alphaTest:.5,roughness:.5,clearcoat:.55,clearcoatRoughness:.35})}),(0,t.jsx)("mesh",{geometry:o,rotation:[0,Math.PI,0],position:[0,0,-.012],children:(0,t.jsx)("meshPhysicalMaterial",{map:u,alphaTest:.5,roughness:.5,clearcoat:.55,clearcoatRoughness:.35})})]})}function h({progress:e,children:i}){let n=(0,r.useRef)(null);return(0,a.useFrame)(()=>{let t=n.current;if(!t)return;let r=e.current;t.rotation.y=s.MathUtils.lerp(t.rotation.y,r*Math.PI,.14);let i=Math.sin(r*Math.PI);t.rotation.z=s.MathUtils.lerp(t.rotation.z,-.07*i,.14),t.position.y=s.MathUtils.lerp(t.position.y,.14*i,.14)}),(0,t.jsx)("group",{ref:n,children:i})}e.s(["default",0,function({front:e,back:a,accent:n,progress:s}){let{ref:u,inView:o}=function(){let e=(0,r.useRef)(null),[t,i]=(0,r.useState)(!0);return(0,r.useEffect)(()=>{let t=e.current;if(!t)return;let r=new IntersectionObserver(([e])=>i(e.isIntersecting));return r.observe(t),()=>r.disconnect()},[]),{ref:e,inView:t}}();return(0,t.jsx)("div",{ref:u,style:{width:"100%",height:"100%"},children:(0,t.jsxs)(i.Canvas,{dpr:[1,2],frameloop:o?"always":"never",camera:{position:[0,.1,5],fov:38},gl:{alpha:!0,antialias:!0},children:[(0,t.jsx)("ambientLight",{intensity:1.15}),(0,t.jsx)("directionalLight",{position:[4,6,6],intensity:1.4}),(0,t.jsx)("directionalLight",{position:[-5,3,4],intensity:.5,color:"#ffe3b8"}),(0,t.jsx)("pointLight",{position:[0,1.8,-2],intensity:6,distance:8,color:n}),(0,t.jsxs)(r.Suspense,{fallback:null,children:[(0,t.jsx)(h,{progress:s,children:(0,t.jsx)(c,{speed:1.3,rotationIntensity:.18,floatIntensity:.45,children:(0,t.jsx)("group",{scale:2.05,children:(0,t.jsx)(m,{front:e,back:a})})})}),(0,t.jsx)(l,{position:[0,-1.75,0],opacity:.3,scale:8,blur:2.6,far:3.4,color:"#7a3c10"})]})]})})}],52134)},60883,e=>{e.n(e.i(52134))}]);