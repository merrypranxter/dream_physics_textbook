import { useEffect, useRef } from 'react';
import type { Chapter } from '../content/manifest';

type DreamShaderProps = {
  chapter: Chapter;
  quiet: boolean;
};

const vertexShader = `#version 300 es
in vec2 a_position;
void main(){gl_Position=vec4(a_position,0.0,1.0);}`;

const fragmentShader = `#version 300 es
precision highp float;
out vec4 fragColor;
uniform vec2 u_resolution;
uniform vec2 u_pointer;
uniform float u_time;
uniform float u_mode;
uniform float u_quiet;
uniform vec3 u_a;
uniform vec3 u_b;
uniform vec3 u_c;

float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1)),f.x),f.y);}
float fbm(vec2 p){float v=0.0,a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.02+vec2(17.1,9.2);a*=.5;}return v;}
float line(float d,float w){return smoothstep(w,0.0,abs(d));}
mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}

void main(){
  vec2 uv=(gl_FragCoord.xy-.5*u_resolution.xy)/min(u_resolution.x,u_resolution.y);
  vec2 mouse=(u_pointer-.5)*.35;
  float t=u_time*(u_quiet>.5?0.0:.11);
  float mode=floor(u_mode+.5);
  vec2 p=uv;
  float f=0.0,g=0.0,h=0.0;

  if(mode<.5){
    p+=.16*vec2(sin(p.y*3.0+t),cos(p.x*2.4-t));
    f=fbm(p*2.1+t*.25); g=line(length(p-mouse)-(.26+.12*sin(f*6.28+t)),.055);
  }else if(mode<1.5){
    vec2 q=p-mouse; float well=.1/(.08+dot(q,q));
    f=sin(length(q)*13.0-well+t*2.0)*.5+.5; g=fbm(p*2.5+well*.08);
  }else if(mode<2.5){
    float r=length(p),a=atan(p.y,p.x); f=line(sin(a*5.0-log(r+.06)*4.0+t)*.65,.14); g=fbm(p*3.0);
  }else if(mode<3.5){
    p.x=abs(p.x); p.y=abs(p.y-.08*sin(t)); f=line(p.x-.17-.08*sin(p.y*9.0+t),.06); g=fbm(p*4.0+vec2(t));
  }else if(mode<4.5){
    vec2 q=fract((p*rot(.3))*5.0)-.5; f=line(max(abs(q.x),abs(q.y))-.23,.055); g=sin((q.x+q.y)*10.0+t)*.5+.5;
  }else if(mode<5.5){
    float phase=floor((p.y+t*.15)*12.0)/12.0; f=sin((length(p)+phase)*28.0-t*3.0)*.5+.5; g=line(p.x+sin(phase*31.0)*.25,.055);
  }else if(mode<6.5){
    for(int i=0;i<4;i++){p=abs(p)-vec2(.28,.21);p*=rot(.65+float(i)*.08);}
    f=line(max(abs(p.x),abs(p.y))-.14,.045);g=fbm(p*3.0);
  }else if(mode<7.5){
    f=sin((p.x*p.x-p.y*p.y)*32.0+t)*sin(p.x*p.y*48.0-t)*.5+.5;g=line(length(p-mouse)-.32,.05);
  }else if(mode<8.5){
    p*=rot(fbm(p*1.8)*2.2+t);f=sin(p.x*19.0+fbm(p*3.0)*7.0)*.5+.5;g=line(p.y+sin(p.x*3.0+t)*.22,.07);
  }else if(mode<9.5){
    float band=floor((p.y+t*.4)*24.0);p.x+=step(.74,hash(vec2(band,floor(t*2.0))))*.22;f=fbm(p*4.0);g=line(sin(p.y*38.0)+p.x*2.0,.12);
  }else if(mode<10.5){
    float a=atan(p.y,p.x);a=abs(mod(a,1.0472)-.5236);p=length(p)*vec2(cos(a),sin(a));f=fbm(p*5.0-t*.3);g=line(sin(p.x*34.0+f*5.0),.12);
  }else if(mode<11.5){
    float r=length(p-mouse);f=smoothstep(.58,.05,r);g=line(r-(.3+.05*sin(t*2.0)),.07);h=fbm(p*2.0);
  }else if(mode<12.5){
    vec2 q=fract(p*7.0)-.5;f=line(min(abs(q.x),abs(q.y)),.055);g=fbm(p*2.0+t*.2);h=line(length(q)-.19,.05);
  }else if(mode<13.5){
    vec2 q=p*rot(t*.08);f=fbm(q*2.3+vec2(sin(q.y*3.0),cos(q.x*3.0)));g=line(sin(atan(q.y,q.x)*7.0+length(q)*18.0),.13);
  }else if(mode<14.5){
    float a=atan(p.y,p.x),r=length(p);f=fbm(p*3.0+t*.08);g=line(sin(a*8.0-r*22.0+f*5.0+t),.12);h=line(r-.38,.08);
  }else{
    float r=length(p);f=line(sin(r*31.0-t*2.0)+sin(atan(p.y,p.x)*6.0),.14);g=fbm(p*3.0);h=line(r-.33,.06);
  }

  float field=clamp(.12+f*.52+g*.48+h*.34,0.0,1.25);
  vec3 color=mix(u_a,u_b,smoothstep(.08,.9,field));
  color=mix(color,u_c,smoothstep(.63,1.15,field));
  float vignette=smoothstep(1.1,.18,length(uv));
  float grain=(hash(gl_FragCoord.xy+floor(u_time*8.0))-.5)*.025;
  color=(color*(.36+.76*field)+grain)*(.46+.54*vignette);
  color=min(color,vec3(1.0));
  fragColor=vec4(color,.86);
}`;

function hexToRgb(hex: string) {
  const value = Number.parseInt(hex.slice(1), 16);
  return [((value >> 16) & 255) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255] as const;
}

export function DreamShader({ chapter, quiet }: DreamShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext('webgl2', { alpha: true, antialias: false, powerPreference: 'low-power' });
    if (!canvas || !gl) return;

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vert = compile(gl.VERTEX_SHADER, vertexShader);
    const frag = compile(gl.FRAGMENT_SHADER, fragmentShader);
    const program = gl.createProgram();
    if (!vert || !frag || !program) return;
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    gl.useProgram(program);

    const resolution = gl.getUniformLocation(program, 'u_resolution');
    const pointer = gl.getUniformLocation(program, 'u_pointer');
    const time = gl.getUniformLocation(program, 'u_time');
    const mode = gl.getUniformLocation(program, 'u_mode');
    const quietUniform = gl.getUniformLocation(program, 'u_quiet');
    const colorA = gl.getUniformLocation(program, 'u_a');
    const colorB = gl.getUniformLocation(program, 'u_b');
    const colorC = gl.getUniformLocation(program, 'u_c');
    const pointerState = { x: .5, y: .5 };
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;
    let visible = !document.hidden;

    const onPointer = (event: PointerEvent) => {
      pointerState.x = event.clientX / window.innerWidth;
      pointerState.y = 1 - event.clientY / window.innerHeight;
    };
    const onVisibility = () => {
      visible = !document.hidden;
      if (!visible) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else if (!quiet && !reduced && !frame) {
        frame = requestAnimationFrame(draw);
      }
    };
    window.addEventListener('pointermove', onPointer, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);

    const surface = canvas;
    const context = gl;
    function draw(milliseconds: number) {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.max(1, Math.floor(surface.clientWidth * dpr));
      const height = Math.max(1, Math.floor(surface.clientHeight * dpr));
      if (surface.width !== width || surface.height !== height) {
        surface.width = width;
        surface.height = height;
        context.viewport(0, 0, width, height);
      }
      const [a, b, c] = chapter.palette.map(hexToRgb);
      context.uniform2f(resolution, width, height);
      context.uniform2f(pointer, pointerState.x, pointerState.y);
      context.uniform1f(time, milliseconds / 1000);
      context.uniform1f(mode, chapter.number - 1);
      context.uniform1f(quietUniform, quiet || reduced ? 1 : 0);
      context.uniform3fv(colorA, a);
      context.uniform3fv(colorB, b);
      context.uniform3fv(colorC, c);
      context.drawArrays(context.TRIANGLES, 0, 3);
      if (!quiet && !reduced && visible) frame = requestAnimationFrame(draw);
    }

    draw(quiet || reduced ? 4200 : performance.now());
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onPointer);
      document.removeEventListener('visibilitychange', onVisibility);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vert);
      gl.deleteShader(frag);
    };
  }, [chapter, quiet]);

  return <canvas ref={canvasRef} className="dream-shader" aria-hidden="true" />;
}
